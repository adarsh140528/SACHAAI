import time
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from backend.app.db.session import get_db
from backend.app.core.config import settings

router = APIRouter(tags=["Health"])

start_time = time.time()

@router.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    db_status = "connected"
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"degraded: {str(e)}"

    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": db_status,
        "uptime_seconds": round(time.time() - start_time, 2),
        "environment": settings.ENV,
        "ai_provider_configured": bool(settings.GEMINI_API_KEY),
        "fact_check_api_configured": bool(settings.GOOGLE_FACT_CHECK_API_KEY),
        "search_provider": settings.SEARCH_PROVIDER,
    }
