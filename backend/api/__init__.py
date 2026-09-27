from fastapi import APIRouter

from api.auth import router as auth_router
from api.exam import router as exam_router
from api.monitoring import router as monitoring_router
from api.incidents import router as incidents_router
from api.integrity import router as integrity_router
from api.simulator import router as simulator_router
from api.proctoring import router as proctoring_router

api_router = APIRouter(prefix="/v1")

api_router.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)

api_router.include_router(
    proctoring_router,
    prefix="/proctoring",
    tags=["AI Proctoring Engine"],
)


api_router.include_router(
    exam_router,
    prefix="/exams",
    tags=["Candidate Exams"]
)

api_router.include_router(
    monitoring_router,
    prefix="/monitoring",
    tags=["Monitoring"]
)

api_router.include_router(
    incidents_router,
    prefix="/incidents",
    tags=["Incidents"]
)

api_router.include_router(
    integrity_router,
    prefix="/integrity",
    tags=["Integrity"]
)

api_router.include_router(
    simulator_router,
    prefix="/simulator",
    tags=["Simulator"]
)

@api_router.get("/health", tags=["Health & Status"])
async def api_health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "subsystems": {
            "auth": "online",
            "exam_engine": "online",
            "monitoring": "online",
            "incidents": "online",
            "integrity": "online",
            "simulator": "online"
        }
    }

__all__ = ["api_router"]