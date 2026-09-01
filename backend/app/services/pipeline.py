import json
import time
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.check import Check
from backend.app.models.claim import Claim
from backend.app.models.source import Source
from backend.app.models.evidence import Evidence
from backend.app.models.verdict import Verdict
from backend.app.models.fact_check import FactCheck

from backend.app.services.claim_extractor import claim_extractor_service
from backend.app.services.whatsapp_service import whatsapp_service
from backend.app.services.url_extractor import url_extractor_service
from backend.app.services.factcheck_service import factcheck_service
from backend.app.services.search_service import search_service
from backend.app.services.evidence_extractor import evidence_extractor_service
from backend.app.services.verdict_engine import verdict_engine
from backend.app.services.explanation_service import explanation_service
from backend.app.core.logging import logger

class VerificationPipeline:
    """
    Coordinates the multi-stage evidence verification pipeline.
    Stages:
    1. EXTRACTING: Extract and normalize atomic factual claims
    2. SEARCHING: Parallel search across Google Fact Check Tools API and Web Search
    3. ANALYZING: Tiered source ranking, independence clustering, and relationship evaluation
    4. VERDICT: Deterministic hybrid verdict calculation and explanation generation
    5. COMPLETED: Persist all evidence nodes and metrics
    """
    async def process_check(self, check_id: str, db: AsyncSession) -> Optional[Check]:
        start_time = time.time()
        logger.info(f"Starting verification pipeline for Check ID: {check_id}")

        result = await db.execute(select(Check).where(Check.id == check_id))
        check = result.scalar_one_or_none()
        if not check:
            logger.error(f"Check ID {check_id} not found in database.")
            return None

        try:
            # Stage 1: Claim Extraction & Decomposition
            check.status = "EXTRACTING"
            check.current_stage = "Extracting and decomposing factual claims..."
            await db.commit()

            text_to_analyze = check.raw_input

            # Handle URL Input Type
            if check.input_type in ("URL", "ARTICLE"):
                check.current_stage = "Fetching and extracting article content safely..."
                await db.commit()
                try:
                    article_data = await url_extractor_service.extract_article_content(check.raw_input.strip())
                    text_to_analyze = f"{article_data['title']}\n\n{article_data['body']}"
                    check.input_metadata = json.dumps({
                        "article_title": article_data["title"],
                        "article_url": article_data["url"],
                        "publication_date": article_data.get("publication_date"),
                    })
                except Exception as url_err:
                    logger.warning(f"URL extraction issue: {url_err}")
                    text_to_analyze = check.raw_input.strip()

            if check.input_type in ("WHATSAPP_FORWARD", "WHATSAPP"):
                raw_claims = await whatsapp_service.decompose_whatsapp_message(text_to_analyze)
            else:
                raw_claims = await claim_extractor_service.extract_and_normalize_claims(text_to_analyze)
                
            logger.info(f"Extracted {len(raw_claims)} claims for verification.")

            overall_verdicts = []
            overall_summaries = []

            for claim_data in raw_claims[:5]:  # Process up to top 5 distinct claims for multi-claim articles
                claim_record = Claim(
                    check_id=check.id,
                    claim_text=claim_data.get("claim_text", check.raw_input),
                    claim_type=claim_data.get("claim_type", "FACTUAL"),
                    canonical_data=claim_data.get("canonical_data"),
                    claim_time=claim_data.get("claim_time", "Current"),
                    claim_order=claim_data.get("claim_order", "1"),
                )
                db.add(claim_record)
                await db.flush()

                # Stage 2: Parallel Fact-Check & Web Search Retrieval
                check.status = "SEARCHING"
                check.current_stage = f"Searching web evidence for: {claim_record.claim_text[:40]}..."
                await db.commit()

                fact_checks = await factcheck_service.retrieve_existing_fact_checks(claim_record.claim_text)
                for fc in fact_checks:
                    fc_record = FactCheck(
                        check_id=check.id,
                        publisher=fc["publisher"],
                        reviewed_claim=fc["reviewed_claim"],
                        review_url=fc["review_url"],
                        rating=fc.get("rating"),
                        review_date=fc.get("review_date"),
                        language_code=fc.get("language_code", "en"),
                    )
                    db.add(fc_record)

                search_results = await search_service.execute_multi_query_search(claim_record.claim_text)

                # Stage 3: Source Ranking & Evidence Extraction
                check.status = "ANALYZING"
                check.current_stage = "Evaluating evidence relationships and source reliability..."
                await db.commit()

                extracted_evidence = await evidence_extractor_service.extract_and_evaluate_evidence(
                    claim_text=claim_record.claim_text,
                    search_results=search_results,
                    fact_checks=fact_checks
                )

                # Persist Sources & Evidence
                persisted_evidence_records = []
                for ev in extracted_evidence:
                    src_info = ev["source"]
                    source_record = Source(
                        domain=src_info["domain"],
                        publisher_name=src_info["publisher_name"],
                        source_tier=src_info["source_tier"],
                        reliability_score=src_info["reliability_score"],
                        source_group_id=src_info.get("source_group_id"),
                    )
                    db.add(source_record)
                    await db.flush()

                    ev_record = Evidence(
                        claim_id=claim_record.id,
                        source_id=source_record.id,
                        evidence_text=ev["evidence_text"],
                        relationship_type=ev["relationship"],
                        relevance_score=ev["relevance_score"],
                        source_reliability=ev["source_reliability"],
                        publication_date=ev.get("publication_date"),
                        freshness_category=ev.get("freshness_category", "RECENT"),
                        url=ev["url"],
                    )
                    db.add(ev_record)
                    persisted_evidence_records.append(ev)

                # Stage 4: Deterministic Verdict & Confidence Calculation
                verdict_str, confidence_str, metrics = verdict_engine.calculate_verdict(
                    claim_text=claim_record.claim_text,
                    evidence_items=persisted_evidence_records,
                    temporal_context=claim_record.claim_time or "Current"
                )

                # Stage 5: Explainable Reasoning Generation
                reasoning_text = await explanation_service.generate_explanation(
                    claim_text=claim_record.claim_text,
                    verdict=verdict_str,
                    confidence=confidence_str,
                    evidence_items=persisted_evidence_records
                )

                verdict_record = Verdict(
                    claim_id=claim_record.id,
                    verdict=verdict_str,
                    confidence=confidence_str,
                    reasoning=reasoning_text,
                    evidence_metrics=metrics,
                )
                db.add(verdict_record)

                overall_verdicts.append(verdict_str)
                overall_summaries.append(reasoning_text)

            # Finalize Check summary
            check.status = "COMPLETED"
            check.current_stage = "Verification Complete"
            check.processing_time_ms = round((time.time() - start_time) * 1000, 2)
            check.completed_at = datetime.utcnow()

            # Multi-claim Synthesis Breakdown
            if len(overall_verdicts) == 1:
                check.overall_verdict = overall_verdicts[0]
                check.overall_confidence = confidence_str
                check.overall_summary = overall_summaries[0]
            else:
                false_count = sum(1 for v in overall_verdicts if v == "FALSE")
                true_count = sum(1 for v in overall_verdicts if v == "TRUE")
                misleading_count = sum(1 for v in overall_verdicts if v == "MISLEADING")
                unverified_count = sum(1 for v in overall_verdicts if v == "UNVERIFIED")

                if false_count > 0 and true_count > 0:
                    check.overall_verdict = "PARTLY_TRUE"
                elif false_count > 0:
                    check.overall_verdict = "FALSE"
                elif misleading_count > 0:
                    check.overall_verdict = "MISLEADING"
                elif true_count > 0:
                    check.overall_verdict = "TRUE"
                else:
                    check.overall_verdict = "UNVERIFIED"

                check.overall_confidence = "HIGH" if any(v in ["TRUE", "FALSE"] for v in overall_verdicts) else "MEDIUM"
                check.overall_summary = (
                    f"Article Multi-Claim Breakdown ({len(overall_verdicts)} claims analyzed):\n"
                    f"• True: {true_count} | False: {false_count} | Misleading: {misleading_count} | Unverified: {unverified_count}\n\n"
                    + "\n\n".join([f"Claim {i+1}: {s}" for i, s in enumerate(overall_summaries)])
                )

            await db.commit()
            await db.refresh(check)
            logger.info(f"Pipeline finished for Check {check.id} with verdict {check.overall_verdict} in {check.processing_time_ms}ms")
            return check

        except Exception as e:
            logger.error(f"Pipeline error processing check {check_id}: {e}", exc_info=True)
            check.status = "FAILED"
            check.current_stage = "Processing encountered an error"
            check.error_message = str(e)
            check.processing_time_ms = round((time.time() - start_time) * 1000, 2)
            await db.commit()
            return check

verification_pipeline = VerificationPipeline()
