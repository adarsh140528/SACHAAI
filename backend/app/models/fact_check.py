import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.db.base import Base

class FactCheck(Base):
    __tablename__ = "fact_checks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    check_id = Column(String(36), ForeignKey("checks.id", ondelete="CASCADE"), nullable=False, index=True)
    
    publisher = Column(String(255), nullable=False)
    reviewed_claim = Column(Text, nullable=False)
    review_url = Column(Text, nullable=False)
    rating = Column(String(100), nullable=True)
    review_date = Column(String(100), nullable=True)
    language_code = Column(String(20), default="en")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    check = relationship("Check", back_populates="fact_checks")
