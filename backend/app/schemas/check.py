from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class CheckCreateRequest(BaseModel):
    input: str = Field(..., description="The text claim, news article URL, or statement to verify")
    input_type: str = Field("TEXT", description="TEXT, URL, IMAGE, SCREENSHOT, WHATSAPP_FORWARD")
    language: Optional[str] = "en"
    metadata: Optional[Dict[str, Any]] = None

class EvidenceSchema(BaseModel):
    id: str
    publisher: str
    source_type: str
    domain: str
    reliability_score: float
    relationship: str  # SUPPORTS, CONTRADICTS, PARTIALLY_SUPPORTS, PARTIALLY_CONTRADICTS, IRRELEVANT, INSUFFICIENT
    evidence_text: str
    relevance_score: float
    publication_date: Optional[str] = None
    freshness_category: str = "RECENT"
    url: str

class VerdictSchema(BaseModel):
    verdict: str  # TRUE, FALSE, MISLEADING, PARTLY_TRUE, UNVERIFIED, OUTDATED
    confidence: str  # HIGH, MEDIUM, LOW
    reasoning: str
    evidence_metrics: Optional[Dict[str, Any]] = None

class ClaimResponseSchema(BaseModel):
    claim_id: str
    claim_text: str
    claim_type: str
    canonical_data: Optional[Dict[str, Any]] = None
    verdict: Optional[VerdictSchema] = None
    evidence: List[EvidenceSchema] = []

class FactCheckSchema(BaseModel):
    publisher: str
    reviewed_claim: str
    review_url: str
    rating: Optional[str] = None
    review_date: Optional[str] = None

class CheckResponse(BaseModel):
    check_id: str
    status: str  # QUEUED, EXTRACTING, SEARCHING, ANALYZING, COMPLETED, FAILED
    current_stage: str
    input_type: str
    raw_input: str
    overall_verdict: Optional[str] = None
    overall_confidence: Optional[str] = None
    overall_summary: Optional[str] = None
    processing_time_ms: float = 0.0
    created_at: datetime
    completed_at: Optional[datetime] = None
    claims: List[ClaimResponseSchema] = []
    fact_checks: List[FactCheckSchema] = []
    error_message: Optional[str] = None

class CheckListResponse(BaseModel):
    items: List[CheckResponse]
    total: int
    page: int
    limit: int
