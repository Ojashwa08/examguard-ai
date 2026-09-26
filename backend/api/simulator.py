"""
Chaos Engineering & Network Anomaly Simulator API Routes.
Provides controls for simulating raft node failovers, network latency injection, and candidate proctoring anomaly spikes.
"""

import random
from datetime import datetime
from typing import Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from api.auth import UserResponse, get_current_user

router = APIRouter()


# Pydantic Schemas
class ChaosInjectionRequest(BaseModel):
    target_type: str = Field(..., description="Target: 'node_failure' | 'latency_spike' | 'proctor_anomaly_wave'")
    target_id: str = Field(..., description="Node or Center ID (e.g., 'us-east-1-node-03' or 'CTR-AP-SOUTH-1')")
    duration_seconds: int = Field(30, ge=5, le=600)
    severity: str = Field("critical", description="'info' | 'warning' | 'critical'")


class SimulationStatusResponse(BaseModel):
    active_simulations: List[Dict]
    cluster_health_score: float
    simulated_packet_loss_pct: float
    injected_latency_ms: float


# In-Memory Simulation State
ACTIVE_SIMULATIONS: List[dict] = []


def check_admin_permission(user: UserResponse):
    """Enforce administrator privilege requirement."""
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to platform administrators.",
        )


@router.get("/status", response_model=SimulationStatusResponse)
async def get_simulation_status(
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Retrieve live status of ongoing chaos engineering simulations and metrics impact.
    """
    check_admin_permission(current_user)

    has_active = len(ACTIVE_SIMULATIONS) > 0
    health_score = 72.5 if has_active else 99.8
    injected_latency = sum(sim.get("latency_added", 0) for sim in ACTIVE_SIMULATIONS)
    packet_loss = 4.2 if has_active else 0.01

    return SimulationStatusResponse(
        active_simulations=ACTIVE_SIMULATIONS,
        cluster_health_score=health_score,
        simulated_packet_loss_pct=packet_loss,
        injected_latency_ms=injected_latency,
    )


@router.post("/inject")
async def inject_chaos_event(
    payload: ChaosInjectionRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Trigger a simulated cluster failure or telemetry anomaly wave.
    """
    check_admin_permission(current_user)

    simulation_id = f"sim_{payload.target_type}_{random.randint(1000, 9999)}"
    latency_added = random.uniform(150.0, 450.0) if payload.target_type == "latency_spike" else 0.0

    event_record = {
        "id": simulation_id,
        "target_type": payload.target_type,
        "target_id": payload.target_id,
        "duration_seconds": payload.duration_seconds,
        "severity": payload.severity,
        "latency_added": latency_added,
        "started_at": datetime.utcnow().isoformat(),
        "initiated_by": current_user.username,
    }

    ACTIVE_SIMULATIONS.append(event_record)

    return {
        "status": "injected",
        "simulation_id": simulation_id,
        "message": f"Successfully injected {payload.target_type} against target {payload.target_id}.",
        "event": event_record,
    }


@router.delete("/stop/{simulation_id}")
async def stop_simulation(
    simulation_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Halt an active chaos engineering simulation and restore standard operational parameters.
    """
    check_admin_permission(current_user)

    global ACTIVE_SIMULATIONS
    initial_len = len(ACTIVE_SIMULATIONS)
    ACTIVE_SIMULATIONS = [s for s in ACTIVE_SIMULATIONS if s["id"] != simulation_id]

    if len(ACTIVE_SIMULATIONS) == initial_len:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Simulation with ID '{simulation_id}' was not found or has already expired.",
        )

    return {
        "status": "stopped",
        "simulation_id": simulation_id,
        "stopped_at": datetime.utcnow().isoformat(),
    }