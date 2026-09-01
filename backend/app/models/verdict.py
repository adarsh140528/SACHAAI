import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.db.base import Base

class Verdict(Base):
    __tablename__ = "verdicts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    claim_id = Column(String(36), ForeignKey("claims.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    
    verdict = Column(String(50), nullable=False)  # TRUE, FALSE, MISLEADING, PARTLY_TRUE, UNVERIFIED, OUTDATED
    confidence = Column(String(50), nullable=False)  # HIGH, MEDIUM, LOW
    reasoning = Column(Text, nullable=False)  # Evidence-grounded concise explanation
    evidence_metrics = Column(JSON, nullable=True)  # {supporting_count, contradicting_count, avg_source_quality, independent_groups}
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    claim = relationship("Claim", back_populates="verdict")
