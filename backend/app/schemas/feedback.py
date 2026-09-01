from typing import Optional
from pydantic import BaseModel, Field

class FeedbackCreate(BaseModel):
    check_id: str
    is_useful: bool
    report_type: Optional[str] = Field(None, description="wrong_verdict, missing_evidence, bad_source, other")
    comments: Optional[str] = None
