from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from backend.app.db.session import get_db
from backend.app.models.check import Check

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("")
async def get_dashboard_analytics(db: AsyncSession = Depends(get_db)):
    # 1. Total checks
    total_checks_res = await db.execute(select(func.count(Check.id)))
    total_checks = total_checks_res.scalar() or 0

    # 2. Verdict breakdown
    verdict_counts_res = await db.execute(
        select(Check.overall_verdict, func.count(Check.id))
        .where(Check.overall_verdict.isnot(None))
        .group_by(Check.overall_verdict)
    )
    verdict_rows = verdict_counts_res.all()
    verdict_map = {row[0]: row[1] for row in verdict_rows}

    # 3. Input type breakdown
    input_type_res = await db.execute(
        select(Check.input_type, func.count(Check.id))
        .group_by(Check.input_type)
    )
    input_type_rows = input_type_res.all()
    input_type_map = {row[0]: row[1] for row in input_type_rows}

    # 4. Confidence breakdown
    conf_res = await db.execute(
        select(Check.overall_confidence, func.count(Check.id))
        .where(Check.overall_confidence.isnot(None))
        .group_by(Check.overall_confidence)
    )
    conf_rows = conf_res.all()
    conf_map = {row[0]: row[1] for row in conf_rows}

    # 5. Average processing latency in ms
    avg_latency_res = await db.execute(
        select(func.avg(Check.processing_time_ms)).where(Check.status == "COMPLETED")
    )
    avg_latency = avg_latency_res.scalar() or 0.0

    return {
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
