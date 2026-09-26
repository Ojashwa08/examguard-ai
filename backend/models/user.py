"""
SQLAlchemy ORM Models for User Management & Authentication.
Defines user credentials, role-based authorization attributes, and center associations.
"""

from datetime import datetime
from enum import Enum as PyEnum
from typing import List, Optional
from sqlalchemy import Boolean, Column, DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class UserRole(str, PyEnum):
    ADMIN = "admin"
    PROCTOR = "proctor"
    CANDIDATE = "candidate"


class User(Base):
    """
    Represents an authenticated platform entity across administration, proctoring, and candidate roles.
    """
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    username: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, native_enum=False),
        nullable=False,
        default=UserRole.CANDIDATE,
        index=True,
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    center_id: Mapped[Optional[str]] = mapped_column(
        String(64), ForeignKey("test_centers.id", ondelete="SET NULL"), nullable=True, index=True
    )
    
    # Audit Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    center: Mapped[Optional["TestCenter"]] = relationship("TestCenter", back_populates="users")
    answers: Mapped[List["CandidateAnswer"]] = relationship(
        "CandidateAnswer", back_populates="candidate", cascade="all, delete-orphan"
    )