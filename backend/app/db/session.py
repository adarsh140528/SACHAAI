import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from backend.app.core.config import settings
from backend.app.db.base import Base

# Ensure Supabase / Postgres path is formatted properly for asyncpg
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+asyncpg://", 1)
elif db_url.startswith("postgresql://") and not db_url.startswith("postgresql+asyncpg://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
elif db_url.startswith("sqlite:///") and not db_url.startswith("sqlite+aiosqlite:///"):
    db_url = db_url.replace("sqlite:///", "sqlite+aiosqlite:///", 1)

# Configure engine arguments
connect_args = {}
if "sqlite" in db_url:
    connect_args = {"check_same_thread": False}
elif "postgresql+asyncpg" in db_url:
    # Supabase uses SSL mode require and pgbouncer transaction pooler
    connect_args = {"ssl": "require", "statement_cache_size": 0}

engine = create_async_engine(
    db_url,
    echo=False,
    connect_args=connect_args,
    future=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def init_db():
    import backend.app.models  # noqa
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
