"""
SQLAlchemy ORM Models for System Metrics & Proctoring Telemetry.
Defines database schemas for edge latency tracking, packet loss statistics,
and candidate risk scores.
"""

from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class CenterMetric(Base):
    """
    Time-series metric entry for test center health
    and proxy node performance.
    """

    __tablename__ = "center_metrics"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    center_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey(
            "test_centers.id",
            ondelete="CASCADE"
        ),
        index=True,
        nullable=False
    )

    edge_latency_ms: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    packet_loss_pct: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0
    )

    active_candidates: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0
    )

    cpu_utilization_pct: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0
    )

    memory_utilization_pct: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0
    )

    timestamp: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        index=True,
        nullable=False
    )

    # Relationship with TestCenter
    center: Mapped["TestCenter"] = relationship(
        "TestCenter",
        back_populates="metrics"
    )


class CandidateProctorTelemetry(Base):
    """
    High-frequency telemetry stream entries for candidate
    risk scoring and AI anomaly flags.
    """

    __tablename__ = "candidate_proctor_telemetry"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    candidate_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        index=True,
        nullable=False
    )

    exam_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey(
            "exams.id",
            ondelete="CASCADE"
        ),
        index=True,
        nullable=False
    )

    gaze_deviation_score: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False
    )

    audio_anomaly_score: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False
    )

    multi_face_detected: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    window_blur_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )

    composite_risk_score: Mapped[float] = mapped_column(
        Float,
        index=True,
        nullable=False,
        default=0.0
    )

    timestamp: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        index=True,
        nullable=False
    )

    # Relationships
    candidate: Mapped["User"] = relationship(
        "User"
    )

    exam: Mapped["Exam"] = relationship(
        "Exam"
    )