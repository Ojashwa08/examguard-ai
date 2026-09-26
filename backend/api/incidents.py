"""
Infrastructure Incidents & Automated Failover API Routes.
Provides endpoints for retrieving live system outages, chaos events, acknowledging alerts, and resolving incidents.
"""

from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from api.auth import UserResponse, get_current_user

router = APIRouter()


# Pydantic Schemas
class Incident(BaseModel):
    id: str
    severity: str  # "critical" | "warning" | "info"
    title: str
    description: str
    node_id: str
    status: str  # "active" | "acknowledged" | "resolved"
    created_at: str
    acknowledged_by: Optional[str] = None
    resolved_at: Optional[str] = None


class IncidentResolutionPayload(BaseModel):
    notes: Optional[str] = None


# Mock Incidents In-Memory Store
MOCK_INCIDENTS_DB = [
    {
        "id": "inc_node_081",
        "severity": "critical",
        "title": "Primary Ledger Node Heartbeat Dropout",
        "description": "Raft Consensus Node 03 failed to respond to quorum keep-alive pings within the 150ms timeout window. Automated failover initiated.",
        "node_id": "us-east-1-node-03",
        "status": "active",
        "created_at": datetime.utcnow().isoformat(),
        "acknowledged_by": None,
        "resolved_at": None,
    },
    {
        "id": "inc_latency_104",
        "severity": "warning",
        "title": "Regional Telemetry Spike (CTR-NA-EAST-1)",
        "description": "Inbound proctoring video stream frame drop rates exceeded 12% across 4 test center workstations.",
        "node_id": "ctr-na-east-1-edge",
        "status": "acknowledged",
        "created_at": datetime.utcnow().isoformat(),
        "acknowledged_by": "usr_admin_01",
        "resolved_at": None,
    },
]


def check_admin_permission(user: UserResponse):
    """Enforce administrator role restriction."""
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to platform administrators.",
        )


@router.get("", response_model=List[Incident])
async def list_incidents(
    status_filter: Optional[str] = None,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Retrieve live system incidents and automated failover events.
    """
    check_admin_permission(current_user)

    if status_filter:
        return [
            inc for inc in MOCK_INCIDENTS_DB if inc["status"] == status_filter
        ]
    return MOCK_INCIDENTS_DB


@router.patch("/{incident_id}/acknowledge", response_model=Incident)
async def acknowledge_incident(
    incident_id: str, current_user: UserResponse = Depends(get_current_user)
):
    """
    Acknowledge an active infrastructure incident.
    """
    check_admin_permission(current_user)

    incident = next(
        (inc for inc in MOCK_INCIDENTS_DB if inc["id"] == incident_id), None
    )
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incident '{incident_id}' was not found.",
        )

    incident["status"] = "acknowledged"
    incident["acknowledged_by"] = current_user.username
    return incident


@router.patch("/{incident_id}/resolve", response_model=Incident)
async def resolve_incident(
    incident_id: str,
    payload: Optional[IncidentResolutionPayload] = None,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Mark an active or acknowledged incident as resolved.
    """
    check_admin_permission(current_user)

    incident = next(
        (inc for inc in MOCK_INCIDENTS_DB if inc["id"] == incident_id), None
    )
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incident '{incident_id}' was not found.",
        )

    incident["status"] = "resolved"
    incident["resolved_at"] = datetime.utcnow().isoformat()
    return incident