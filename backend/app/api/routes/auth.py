from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from datetime import datetime

from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.models.api_key import ApiKey
from backend.app.schemas.auth import UserRegister, UserLogin, TokenResponse, UserProfile
from backend.app.core.security import hash_password, verify_password, create_access_token, decode_access_token, verify_api_key

router = APIRouter(prefix="/auth", tags=["Authentication"])

async def get_current_user(
    authorization: Optional[str] = Header(None),
    x_api_key: Optional[str] = Header(None, alias="X-API-KEY"),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    # 1. Check X-API-KEY header
    api_key_candidate = x_api_key

    # 2. Check Authorization header
    if authorization:
        if authorization.startswith("Bearer sach_live_"):
            api_key_candidate = authorization.replace("Bearer ", "").strip()
        elif authorization.startswith("Bearer "):
            token = authorization.split(" ")[1]
            payload = decode_access_token(token)
            if payload and "sub" in payload:
                user_id = payload["sub"]
                result = await db.execute(select(User).where(User.id == user_id))
                return result.scalar_one_or_none()

    # 3. Authenticate with API Key if present
    if api_key_candidate and api_key_candidate.startswith("sach_live_"):
        prefix = api_key_candidate[:14]
        result = await db.execute(
            select(ApiKey).where(ApiKey.key_prefix == prefix, ApiKey.is_active == True)
        )
        keys = result.scalars().all()
        for k in keys:
            if verify_api_key(api_key_candidate, k.key_hash):
                k.last_used_at = datetime.utcnow()
                await db.commit()
                user_res = await db.execute(select(User).where(User.id == k.user_id))
                return user_res.scalar_one_or_none()

    return None

async def require_auth(current_user: Optional[User] = Depends(get_current_user)) -> User:
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please sign in or provide a valid X-API-KEY.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user

@router.post("/sign-up", response_model=TokenResponse)
async def sign_up(req: UserRegister, db: AsyncSession = Depends(get_db)):
    # Check if user already exists
    existing = await db.execute(select(User).where(User.email == req.email))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists"
        )
    
    user = User(
        email=req.email,
        password_hash=hash_password(req.password),
        full_name=req.full_name,
        role="user",
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserProfile.model_validate(user),
    )

@router.post("/sign-in", response_model=TokenResponse)
async def sign_in(req: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == req.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserProfile.model_validate(user),
    )

@router.get("/me", response_model=UserProfile)
async def get_me(current_user: User = Depends(require_auth)):
    return UserProfile.model_validate(current_user)
