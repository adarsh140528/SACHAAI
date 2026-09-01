from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from pydantic import BaseModel

from backend.app.db.session import get_db
from backend.app.models.saved_check import SavedCheck
from backend.app.models.check import Check
from backend.app.models.user import User
from backend.app.api.routes.auth import require_auth
from backend.app.api.routes.checks import _build_check_response
from backend.app.schemas.check import CheckResponse

router = APIRouter(prefix="/saved", tags=["Saved Checks"])

class SaveCheckRequest(BaseModel):
    check_id: str
    notes: Optional[str] = None

class SavedCheckItemResponse(BaseModel):
    id: str
    check_id: str
    notes: Optional[str] = None
    saved_at: str
    check: CheckResponse

@router.post("")
async def save_check(
    req: SaveCheckRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    # Verify check exists
    result = await db.execute(select(Check).where(Check.id == req.check_id))
    check = result.scalar_one_or_none()
    if not check:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Check record not found."
        )

    # Check if already saved
    existing = await db.execute(
        select(SavedCheck).where(
            SavedCheck.user_id == current_user.id,
            SavedCheck.check_id == req.check_id
        )
    )
    if existing.scalar_one_or_none():
        return {"status": "already_saved", "message": "Check is already bookmarked."}

    saved = SavedCheck(
        user_id=current_user.id,
        check_id=req.check_id,
        notes=req.notes,
    )
    db.add(saved)
    await db.commit()
    return {"status": "saved", "message": "Verification result saved successfully."}

@router.get("")
async def list_saved_checks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    query = (
        select(SavedCheck)
        .where(SavedCheck.user_id == current_user.id)
        .order_by(desc(SavedCheck.saved_at))
        .options(
            selectinload(SavedCheck.check)
            .selectinload(Check.claims)
            .selectinload(Check.claims.property.mapper.class_.verdict),
            selectinload(SavedCheck.check)
            .selectinload(Check.claims)
            .selectinload(Check.claims.property.mapper.class_.evidence),
            selectinload(SavedCheck.check)
            .selectinload(Check.fact_checks),
        )
    )
    res = await db.execute(query)
    saved_items = res.scalars().all()

    out = []
    for item in saved_items:
        if item.check:
            out.append({
                "id": item.id,
                "check_id": item.check_id,
                "notes": item.notes,
                "saved_at": item.saved_at.isoformat() if item.saved_at else "",
                "check": _build_check_response(item.check),
            })
    return out

@router.delete("/{check_id}")
async def remove_saved_check(
    check_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    result = await db.execute(
        select(SavedCheck).where(
            SavedCheck.user_id == current_user.id,
            SavedCheck.check_id == check_id
        )
    )
    saved = result.scalar_one_or_none()
    if not saved:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved check bookmark not found."
        )

    await db.delete(saved)
    await db.commit()
    return {"status": "removed", "message": "Bookmark removed."}
