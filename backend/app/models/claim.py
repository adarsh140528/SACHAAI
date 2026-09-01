import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.db.base import Base

class Claim(Base):
    __tablename__ = "claims"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    check_id = Column(String(36), ForeignKey("checks.id", ondelete="CASCADE"), nullable=False, index=True)
    claim_text = Column(Text, nullable=False)
    claim_type = Column(String(50), default="FACTUAL")  # FACTUAL, OPINION, PREDICTION, QUESTION, NON_CLAIM
    canonical_data = Column(JSON, nullable=True)  # {subject, predicate, object, value, unit, person, org, location, temporal}
    claim_time = Column(String(100), nullable=True)
    claim_order = Column(String(10), default="1")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    check = relationship("Check", back_populates="claims")
    evidence = relationship("Evidence", back_populates="claim", cascade="all, delete-orphan")
    verdict = relationship("Verdict", back_populates="claim", uselist=False, cascade="all, delete-orphan")
