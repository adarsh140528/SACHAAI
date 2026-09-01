from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from backend.app.db.session import get_db
from backend.app.models.check import Check
from backend.app.models.user import User
from backend.app.api.routes.auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("")
async def get_dashboard_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    # 1. Total checks (Filtered to current user if logged in)
    base_query = select(Check)
    if current_user:
        total_checks_res = await db.execute(
            select(func.count(Check.id)).where(Check.user_id == current_user.id)
        )
    else:
        total_checks_res = await db.execute(select(func.count(Check.id)))
    total_checks = total_checks_res.scalar() or 0

    # 2. Verdict breakdown
    verdict_query = select(Check.overall_verdict, func.count(Check.id)).where(Check.overall_verdict.isnot(None))
    if current_user:
        verdict_query = verdict_query.where(Check.user_id == current_user.id)
    verdict_query = verdict_query.group_by(Check.overall_verdict)
    verdict_rows = (await db.execute(verdict_query)).all()
    verdict_map = {row[0]: row[1] for row in verdict_rows}

    # 3. Input type breakdown
    input_query = select(Check.input_type, func.count(Check.id))
    if current_user:
        input_query = input_query.where(Check.user_id == current_user.id)
    input_query = input_query.group_by(Check.input_type)
    input_rows = (await db.execute(input_query)).all()
    input_type_map = {row[0]: row[1] for row in input_rows}

    # 4. Confidence breakdown
    conf_query = select(Check.overall_confidence, func.count(Check.id)).where(Check.overall_confidence.isnot(None))
    if current_user:
        conf_query = conf_query.where(Check.user_id == current_user.id)
    conf_query = conf_query.group_by(Check.overall_confidence)
    conf_rows = (await db.execute(conf_query)).all()
    conf_map = {row[0]: row[1] for row in conf_rows}

    # 5. Average processing latency in ms
    latency_query = select(func.avg(Check.processing_time_ms)).where(Check.status == "COMPLETED")
    if current_user:
        latency_query = latency_query.where(Check.user_id == current_user.id)
    avg_latency_res = await db.execute(latency_query)
    avg_latency = avg_latency_res.scalar() or 0.0

    return {
        "is_individual": current_user is not None,
        "user_email": current_user.email if current_user else None,
        "total_checks": total_checks,
        "true_count": verdict_map.get("TRUE", 0),
        "false_count": verdict_map.get("FALSE", 0),
        "misleading_count": verdict_map.get("MISLEADING", 0),
        "partly_true_count": verdict_map.get("PARTLY_TRUE", 0),
        "unverified_count": verdict_map.get("UNVERIFIED", 0),
        "outdated_count": verdict_map.get("OUTDATED", 0),
        "avg_latency_ms": round(float(avg_latency), 2),
        "verdict_distribution": [
            {"name": "True", "value": verdict_map.get("TRUE", 0), "color": "#10b981"},
            {"name": "False", "value": verdict_map.get("FALSE", 0), "color": "#ef4444"},
            {"name": "Misleading", "value": verdict_map.get("MISLEADING", 0), "color": "#f59e0b"},
            {"name": "Partly True", "value": verdict_map.get("PARTLY_TRUE", 0), "color": "#f97316"},
            {"name": "Unverified", "value": verdict_map.get("UNVERIFIED", 0), "color": "#6b7280"},
            {"name": "Outdated", "value": verdict_map.get("OUTDATED", 0), "color": "#3b82f6"},
        ],
        "input_distribution": [
            {"name": "Text Claims", "count": input_type_map.get("TEXT", 0)},
            {"name": "News URLs", "count": input_type_map.get("URL", 0) + input_type_map.get("ARTICLE", 0)},
            {"name": "Images / Screenshots", "count": input_type_map.get("IMAGE", 0) + input_type_map.get("SCREENSHOT", 0)},
            {"name": "WhatsApp Forwards", "count": input_type_map.get("WHATSAPP_FORWARD", 0) + input_type_map.get("WHATSAPP", 0)},
        ],
        "confidence_distribution": [
            {"name": "High", "count": conf_map.get("HIGH", 0)},
            {"name": "Medium", "count": conf_map.get("MEDIUM", 0)},
            {"name": "Low", "count": conf_map.get("LOW", 0)},
        ]
    }
