from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload

from backend.app.db.session import get_db
from backend.app.models.check import Check
from backend.app.models.claim import Claim
from backend.app.models.source import Source
from backend.app.models.evidence import Evidence
from backend.app.models.verdict import Verdict
from backend.app.models.fact_check import FactCheck
from backend.app.models.user import User
from backend.app.schemas.check import (
    CheckCreateRequest,
    CheckResponse,
    CheckListResponse,
    ClaimResponseSchema,
    EvidenceSchema,
    VerdictSchema,
    FactCheckSchema,
)
from backend.app.services.pipeline import verification_pipeline
from backend.app.api.routes.auth import get_current_user, require_auth
from backend.app.core.logging import logger

router = APIRouter(prefix="/checks", tags=["Verification"])

def _build_check_response(check: Check) -> CheckResponse:
    claims_out = []
    for cl in getattr(check, "claims", []):
        verdict_obj = None
        if hasattr(cl, "verdict") and cl.verdict:
            verdict_obj = VerdictSchema(
                verdict=cl.verdict.verdict,
                confidence=cl.verdict.confidence,
                reasoning=cl.verdict.reasoning,
                evidence_metrics=cl.verdict.evidence_metrics,
            )

        ev_list = []
        for ev in getattr(cl, "evidence", []):
            src = getattr(ev, "source", None)
            ev_list.append(EvidenceSchema(
                id=ev.id,
                publisher=src.publisher_name if src else "Unknown",
                source_type=src.source_tier if src else "TIER_4_GENERAL_WEBSITE",
                domain=src.domain if src else "",
                reliability_score=ev.source_reliability,
                relationship=ev.relationship_type,
                evidence_text=ev.evidence_text,
                relevance_score=ev.relevance_score,
                publication_date=ev.publication_date,
                freshness_category=ev.freshness_category,
                url=ev.url,
            ))

        claims_out.append(ClaimResponseSchema(
            claim_id=cl.id,
            claim_text=cl.claim_text,
            claim_type=cl.claim_type,
            canonical_data=cl.canonical_data,
            verdict=verdict_obj,
            evidence=ev_list,
        ))

    fact_checks_out = []
    for fc in getattr(check, "fact_checks", []):
        fact_checks_out.append(FactCheckSchema(
            publisher=fc.publisher,
            reviewed_claim=fc.reviewed_claim,
            review_url=fc.review_url,
            rating=fc.rating,
            review_date=fc.review_date,
        ))

    return CheckResponse(
        check_id=check.id,
        status=check.status,
        current_stage=check.current_stage,
        input_type=check.input_type,
        raw_input=check.raw_input,
        overall_verdict=check.overall_verdict,
        overall_confidence=check.overall_confidence,
        overall_summary=check.overall_summary,
        processing_time_ms=check.processing_time_ms,
        created_at=check.created_at,
        completed_at=check.completed_at,
        claims=claims_out,
        fact_checks=fact_checks_out,
        error_message=check.error_message,
    )

@router.post("", response_model=CheckResponse)
async def create_and_run_check(
    req: CheckCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    if not req.input or not req.input.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Input claim or text cannot be empty."
        )

    check = Check(
        user_id=current_user.id if current_user else None,
        input_type=req.input_type.upper(),
        raw_input=req.input.strip(),
        status="QUEUED",
        current_stage="Queued for verification",
    )
    db.add(check)
    await db.commit()
    await db.refresh(check)

    # Execute verification pipeline
    await verification_pipeline.process_check(check.id, db)

    # Fetch loaded record with all relationships
    stmt = (
        select(Check)
        .where(Check.id == check.id)
        .options(
            selectinload(Check.claims).selectinload(Claim.verdict),
            selectinload(Check.claims).selectinload(Claim.evidence).selectinload(Evidence.source),
            selectinload(Check.fact_checks),
        )
    )
    res = await db.execute(stmt)
    full_check = res.scalar_one()

    return _build_check_response(full_check)

@router.get("/{check_id}", response_model=CheckResponse)
async def get_check_result(
    check_id: str,
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(Check)
        .where(Check.id == check_id)
        .options(
            selectinload(Check.claims).selectinload(Claim.verdict),
            selectinload(Check.claims).selectinload(Claim.evidence).selectinload(Evidence.source),
            selectinload(Check.fact_checks),
        )
    )
    res = await db.execute(stmt)
    check = res.scalar_one_or_none()

    if not check:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Check record not found."
        )

    return _build_check_response(check)

@router.get("", response_model=CheckListResponse)
async def list_checks(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    verdict: Optional[str] = None,
    filter_by_user: bool = Query(False),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    offset = (page - 1) * limit
    query = select(Check)
    if filter_by_user and current_user:
        query = query.where(Check.user_id == current_user.id)
    if verdict:
        query = query.where(Check.overall_verdict == verdict.upper())

    query = query.order_by(desc(Check.created_at)).offset(offset).limit(limit)
    query = query.options(
        selectinload(Check.claims).selectinload(Claim.verdict),
        selectinload(Check.claims).selectinload(Claim.evidence).selectinload(Evidence.source),
        selectinload(Check.fact_checks),
    )

    res = await db.execute(query)
    checks = res.scalars().all()

    items = [_build_check_response(c) for c in checks]
    return CheckListResponse(
        items=items,
        total=len(items),
        page=page,
        limit=limit,
    )
