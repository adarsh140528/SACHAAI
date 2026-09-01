import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime
from sqlalchemy.orm import relationship
from backend.app.db.base import Base

class Source(Base):
    __tablename__ = "sources"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    domain = Column(String(255), index=True, nullable=False)
    publisher_name = Column(String(255), nullable=False)
    source_tier = Column(String(50), default="TIER_4_GENERAL_WEBSITE")  # TIER_1_OFFICIAL, TIER_2_ESTABLISHED_NEWS, etc.
    reliability_score = Column(Float, default=0.40)
    source_group_id = Column(String(100), index=True, nullable=True)  # Clusters syndicated/copied content
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    evidence_items = relationship("Evidence", back_populates="source", cascade="all, delete-orphan")
