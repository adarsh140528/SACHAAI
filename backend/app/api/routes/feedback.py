from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.app.db.session import get_db
from backend.app.models.feedback import Feedback
from backend.app.models.check import Check
from backend.app.schemas.feedback import FeedbackCreate

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.post("")
async def submit_feedback(req: FeedbackCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Check).where(Check.id == req.check_id))
    check = result.scalar_one_or_none()
    if not check:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Check record not found."
        )

    feedback = Feedback(
        check_id=req.check_id,
        is_useful=req.is_useful,
        report_type=req.report_type,
        comments=req.comments,
    )
    db.add(feedback)
    await db.commit()
    return {"status": "success", "message": "Feedback submitted. Thank you for helping improve evidence verification."}
