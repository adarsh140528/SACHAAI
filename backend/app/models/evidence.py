import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.db.base import Base

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    claim_id = Column(String(36), ForeignKey("claims.id", ondelete="CASCADE"), nullable=False, index=True)
    source_id = Column(String(36), ForeignKey("sources.id", ondelete="CASCADE"), nullable=False, index=True)
    
    evidence_text = Column(Text, nullable=False)
    relationship_type = Column(String(50), nullable=False)  # SUPPORTS, CONTRADICTS, PARTIALLY_SUPPORTS, PARTIALLY_CONTRADICTS, IRRELEVANT, INSUFFICIENT
    relevance_score = Column(Float, default=0.80)
    source_reliability = Column(Float, default=0.50)
    publication_date = Column(String(100), nullable=True)
    freshness_category = Column(String(50), default="RECENT")  # VERY_RECENT, RECENT, OLD, STALE
    url = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    claim = relationship("Claim", back_populates="evidence")
    source = relationship("Source", back_populates="evidence_items")
