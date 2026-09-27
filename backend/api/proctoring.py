from fastapi import APIRouter, HTTPException

from services.ml_engine import (
    ProctoringMLEngine,
    TelemetryFrame,
    RiskAssessmentResult,
)

router = APIRouter()

ml_engine = ProctoringMLEngine()


@router.post(
    "/telemetry",
    response_model=RiskAssessmentResult,
)
async def process_candidate_telemetry(
    frame: TelemetryFrame,
):
  
    try:
        return ml_engine.process_telemetry(frame)

    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Telemetry processing failed: {str(exc)}",
        )