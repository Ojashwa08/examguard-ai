"""
API Package Initialization Module.
Assembles and exports all application REST API route definitions.
"""

from fastapi import APIRouter

# Import sub-routers for domain modules
from api.auth import router as auth_router
from api.exams import router as exams_router
from api.admin import router as admin_router
from api.proctoring import router as proctoring_router
from api.ledger import router as ledger_router

# Core API Router (v1)
api_router = APIRouter(prefix="/v1")

# Register domain endpoint routers
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(exams_router, prefix="/exams", tags=["Candidate Exams"])
api_router.include_router(admin_router, prefix="/admin", tags=["Admin Operations"])
api_router.include_router(proctoring_router, prefix="/proctoring", tags=["AI Proctoring Engine"])
api_router.include_router(ledger_router, prefix="/ledger", tags=["Cryptographic Ledger"])


@api_router.get("/health", tags=["Health & Status"])
async def api_health_check():
    """
    Sub-system health check for API v1 routes.
    """
    return {
        "status": "healthy",
        "version": "1.0.0",
        "subsystems": {
            "auth": "online",
            "exam_engine": "online",
            "proctoring_stream": "online",
            "crypto_ledger": "synced"
        }
    }


__all__ = ["api_router"]