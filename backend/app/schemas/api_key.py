from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class ApiKeyCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    rate_limit_rpm: Optional[int] = 60

class ApiKeyResponse(BaseModel):
    id: str
    name: str
    key_prefix: str
    rate_limit_rpm: int
    is_active: bool
    created_at: datetime
    last_used_at: Optional[datetime] = None

class ApiKeyCreatedResponse(ApiKeyResponse):
    api_key: str  # Only returned once on creation
