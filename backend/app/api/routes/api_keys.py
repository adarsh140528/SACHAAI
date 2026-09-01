from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from pydantic import BaseModel

from backend.app.db.session import get_db
from backend.app.models.api_key import ApiKey
from backend.app.models.user import User
from backend.app.schemas.api_key import ApiKeyCreate, ApiKeyResponse, ApiKeyCreatedResponse
from backend.app.core.security import generate_api_key, verify_api_key
from backend.app.api.routes.auth import require_auth

router = APIRouter(prefix="/api-keys", tags=["API Keys"])

async def get_api_key_user(
    x_api_key: Optional[str] = Header(None, alias="X-API-KEY"),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    if not x_api_key or not x_api_key.startswith("sach_live_"):
        return None

    prefix = x_api_key[:14]
    result = await db.execute(
        select(ApiKey).where(ApiKey.key_prefix == prefix, ApiKey.is_active == True)
    )
    keys = result.scalars().all()
    for k in keys:
        if verify_api_key(x_api_key, k.key_hash):
            k.last_used_at = datetime.utcnow()
            await db.commit()
            user_res = await db.execute(select(User).where(User.id == k.user_id))
            return user_res.scalar_one_or_none()
    return None

@router.post("", response_model=ApiKeyCreatedResponse)
async def create_api_key(
    req: ApiKeyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    raw_key, key_hash, key_prefix = generate_api_key()

    api_key_record = ApiKey(
        user_id=current_user.id,
        name=req.name,
        key_hash=key_hash,
        key_prefix=key_prefix,
        rate_limit_rpm=req.rate_limit_rpm or 60,
        is_active=True,
    )
    db.add(api_key_record)
    await db.commit()
    await db.refresh(api_key_record)

    return ApiKeyCreatedResponse(
        id=api_key_record.id,
        name=api_key_record.name,
        key_prefix=api_key_record.key_prefix,
        rate_limit_rpm=api_key_record.rate_limit_rpm,
        is_active=api_key_record.is_active,
        created_at=api_key_record.created_at,
        last_used_at=api_key_record.last_used_at,
        api_key=raw_key,  # Sent only once upon creation
    )

@router.get("", response_model=List[ApiKeyResponse])
async def list_api_keys(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    result = await db.execute(
        select(ApiKey)
        .where(ApiKey.user_id == current_user.id, ApiKey.is_active == True)
        .order_by(desc(ApiKey.created_at))
    )
    keys = result.scalars().all()
    return [
        ApiKeyResponse(
            id=k.id,
            name=k.name,
            key_prefix=k.key_prefix,
            rate_limit_rpm=k.rate_limit_rpm,
            is_active=k.is_active,
            created_at=k.created_at,
            last_used_at=k.last_used_at,
        )
        for k in keys
    ]

@router.delete("/{key_id}")
async def revoke_api_key(
    key_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    result = await db.execute(
        select(ApiKey).where(ApiKey.id == key_id, ApiKey.user_id == current_user.id)
    )
    key_obj = result.scalar_one_or_none()
    if not key_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API Key not found."
        )

    key_obj.is_active = False
    await db.commit()
    return {"status": "revoked", "message": "API key successfully revoked."}
