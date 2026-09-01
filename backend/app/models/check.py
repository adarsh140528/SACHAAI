import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.db.base import Base

class Check(Base):
    __tablename__ = "checks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    input_type = Column(String(50), nullable=False)  # TEXT, IMAGE, SCREENSHOT, WHATSAPP_FORWARD, URL, ARTICLE
    raw_input = Column(Text, nullable=False)
    input_metadata = Column(Text, nullable=True)  # JSON metadata (e.g. image path, url headers)
    status = Column(String(50), default="QUEUED", index=True)  # QUEUED, EXTRACTING, SEARCHING, ANALYZING, COMPLETED, FAILED
    current_stage = Column(String(100), default="Initialized")
    error_message = Column(Text, nullable=True)
    processing_time_ms = Column(Float, default=0.0)
    
    # Overall summary and synthesized verdict
    overall_verdict = Column(String(50), nullable=True)  # TRUE, FALSE, MISLEADING, PARTLY_TRUE, UNVERIFIED, OUTDATED
    overall_confidence = Column(String(50), nullable=True)  # HIGH, MEDIUM, LOW
    overall_summary = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="checks")
    claims = relationship("Claim", back_populates="check", cascade="all, delete-orphan")
    fact_checks = relationship("FactCheck", back_populates="check", cascade="all, delete-orphan")
    saved_by = relationship("SavedCheck", back_populates="check", cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="check", cascade="all, delete-orphan")
