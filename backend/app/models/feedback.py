import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from backend.app.db.base import Base

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    check_id = Column(String(36), ForeignKey("checks.id", ondelete="CASCADE"), nullable=False, index=True)
    is_useful = Column(Boolean, nullable=False)  # True = 👍 Correct, False = 👎 Incorrect
    report_type = Column(String(100), nullable=True)  # wrong_verdict, missing_evidence, bad_source, other
    comments = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    check = relationship("Check", back_populates="feedbacks")
