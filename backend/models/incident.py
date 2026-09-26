"""
SQLAlchemy ORM Models for Infrastructure Incidents & Automated Failovers.
Defines database schema for tracking cluster outages,
alert acknowledgments, and resolutions.
"""

from datetime import datetime
from enum import Enum as PyEnum
from typing import Optional

from sqlalchemy import DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class IncidentSeverity(str, PyEnum):
    """Severity level of an infrastructure incident."""

    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"


class IncidentStatus(str, PyEnum):
    """Current status of an infrastructure incident."""

    ACTIVE = "active"
    ACKNOWLEDGED = "acknowledged"
    RESOLVED = "resolved"


class Incident(Base):
    """
    Represents an infrastructure incident, node failure,
    or chaos event.
    """

    __tablename__ = "incidents"

    id: Mapped[str] = mapped_column(
        String(64),
        primary_key=True
    )

    severity: Mapped[IncidentSeverity] = mapped_column(
        Enum(IncidentSeverity, native_enum=False),
        nullable=False,
        default=IncidentSeverity.WARNING
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    node_id: Mapped[str] = mapped_column(
        String(128),
        index=True,
        nullable=False
    )

    status: Mapped[IncidentStatus] = mapped_column(
        Enum(IncidentStatus, native_enum=False),
        nullable=False,
        default=IncidentStatus.ACTIVE,
        index=True
    )

    # Timestamps & User Audit Metadata
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        index=True
    )

    acknowledged_by_id: Mapped[Optional[str]] = mapped_column(
        String(64),
        ForeignKey(
            "users.id",
            ondelete="SET NULL"
        ),
        nullable=True
    )

    acknowledged_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime,
        nullable=True
    )

    resolved_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime,
        nullable=True
    )

    resolution_notes: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )

    # Relationship with User
    acknowledged_by_user: Mapped[Optional["User"]] = relationship(
        "User",
        foreign_keys=[acknowledged_by_id]
    )