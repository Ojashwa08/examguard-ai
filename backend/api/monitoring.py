"""
Infrastructure Monitoring & Telemetry API Routes.
Provides endpoints for regional test center metrics, edge latency tracking, and proctoring engine risk configurations.
"""

from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from api.auth import UserResponse, get_current_user

router = APIRouter()


# Pydantic Schemas
class CenterTelemetry(BaseModel):
    center_id: str
    name: str
    region: str
    active_candidates: int
    total_capacity: int
    edge_latency_ms: float
    packet_loss_pct: float
    status: str  # "healthy" | "degraded" | "offline"
    last_ping: str


class RiskEngineConfig(BaseModel):
    sensitivity_threshold: float = Field(..., ge=0.0, le=1.0, description="Global anomaly sensitivity score")
    enable_gaze_tracking: bool = True
    enable_audio_frequency_analysis: bool = True
    enable_multi_face_detection: bool = True
    enable_window_blur_detection: bool = True
    flag_cooldown_seconds: int = 30
    critical_risk_cutoff: float = 0.85


# Mock Data Stores
MOCK_CENTERS: List[dict] = [
    {
        "center_id": "CTR-NA-EAST-1",
        "name": "North America East Exam Hub",
        "region": "us-east-1",
        "active_candidates": 412,
        "total_capacity": 500,
        "edge_latency_ms": 18.4,
        "packet_loss_pct": 0.02,
        "status": "healthy",
        "last_ping": datetime.utcnow().isoformat(),
    },
    {
        "center_id": "CTR-EU-WEST-1",
        "name": "European Central Testing Node",
        "region": "eu-west-1",
        "active_candidates": 289,
        "total_capacity": 350,
        "edge_latency_ms": 42.1,
        "packet_loss_pct": 0.15,
        "status": "healthy",
        "last_ping": datetime.utcnow().isoformat(),
    },
    {
        "center_id": "CTR-AP-SOUTH-1",
        "name": "Asia Pacific South Gateway",
        "region": "ap-south-1",
        "active_candidates": 510,
        "total_capacity": 600,
        "edge_latency_ms": 112.8,
        "packet_loss_pct": 1.84,
        "status": "degraded",
        "last_ping": datetime.utcnow().isoformat(),
    },
]

MOCK_RISK_CONFIG = RiskEngineConfig(
    sensitivity_threshold=0.75,
    enable_gaze_tracking=True,
    enable_audio_frequency_analysis=True,
    enable_multi_face_detection=True,
    enable_window_blur_detection=True,
    flag_cooldown_seconds=30,
    critical_risk_cutoff=0.85,
)


def check_admin_permission(user: UserResponse):
    """Enforce administrator role restriction."""
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to platform administrators.",
        )


@router.get("/centers", response_model=List[CenterTelemetry])
async def get_center_telemetry(
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Retrieve real-time telemetry across all regional test centers and edge proxy nodes.
    """
    check_admin_permission(current_user)
    return MOCK_CENTERS


@router.get("/risk-config", response_model=RiskEngineConfig)
async def get_risk_engine_config(
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Fetch active AI proctoring parameters and risk model thresholds.
    """
    check_admin_permission(current_user)
    return MOCK_RISK_CONFIG


@router.put("/risk-config", response_model=RiskEngineConfig)
async def update_risk_engine_config(
    new_config: RiskEngineConfig,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Update AI proctoring sensitivity parameters and toggle computer vision/audio inference models.
    """
    check_admin_permission(current_user)
    global MOCK_RISK_CONFIG
    MOCK_RISK_CONFIG = new_config
    return MOCK_RISK_CONFIG