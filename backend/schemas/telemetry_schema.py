"""
Pydantic Schemas for System Telemetry & Proctoring Metrics.
Defines data contracts for test center monitoring, network performance, and AI risk thresholds.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class CenterTelemetrySchema(BaseModel):
    """
    Real-time status and network health metrics for a regional test center node.
    """
    center_id: str = Field(..., example="CTR-NA-EAST-1", description="Unique test center identifier")
    name: str = Field(..., example="North America East Exam Hub", description="Display name of the center")
    region: str = Field(..., example="us-east-1", description="AWS/Cloud infrastructure region")
    active_candidates: int = Field(..., ge=0, example=412, description="Currently connected candidate sessions")
    total_capacity: int = Field(..., ge=1, example=500, description="Maximum seated candidate capacity")
    edge_latency_ms: float = Field(..., ge=0.0, example=18.4, description="Average edge node RTT in milliseconds")
    packet_loss_pct: float = Field(..., ge=0.0, le=100.0, example=0.02, description="Inbound packet loss percentage")
    status: str = Field(..., example="healthy", description="Operational state: 'healthy' | 'degraded' | 'offline'")
    last_ping: str = Field(..., example="2026-09-27T00:30:00Z", description="ISO-8601 timestamp of last telemetry heartbeat")

    class Config:
        from_attributes = True


class RiskEngineConfigSchema(BaseModel):
    """
    Global configuration parameters for the AI proctoring and computer vision detection models.
    """
    sensitivity_threshold: float = Field(
        0.75, ge=0.0, le=1.0, description="Global baseline sensitivity score for anomaly flags"
    )
    enable_gaze_tracking: bool = Field(True, description="Enable gaze direction & pupil tracking model")
    enable_audio_frequency_analysis: bool = Field(True, description="Enable room audio spectrum monitoring")
    enable_multi_face_detection: bool = Field(True, description="Flag secondary faces detected in camera frame")
    enable_window_blur_detection: bool = Field(True, description="Flag browser focus/blur and tab switching")
    flag_cooldown_seconds: int = Field(30, ge=5, le=300, description="Minimum delay between recurring infraction alerts")
    critical_risk_cutoff: float = Field(
        0.85, ge=0.0, le=1.0, description="Composite score threshold triggering immediate proctor intervention"
    )

    class Config:
        from_attributes = True


class CandidateTelemetryStreamSchema(BaseModel):
    """
    Real-time candidate proctoring data payload sent over WebSockets or HTTP ingestion.
    """
    candidate_id: str = Field(..., example="usr_cand_9812")
    exam_id: str = Field(..., example="EXAM-AWS-2026")
    gaze_deviation_score: float = Field(..., ge=0.0, le=1.0, example=0.12)
    audio_anomaly_score: float = Field(..., ge=0.0, le=1.0, example=0.05)
    multi_face_detected: bool = Field(False, description="True if more than 1 face is detected")
    window_blur_count: int = Field(0, ge=0, description="Number of times browser lost focus")
    composite_risk_score: float = Field(..., ge=0.0, le=1.0, example=0.18, description="Calculated aggregate risk score")
    timestamp: str = Field(
        default_factory=lambda: datetime.utcnow().isoformat(), description="ISO-8601 creation timestamp"
    )

    class Config:
        from_attributes = True