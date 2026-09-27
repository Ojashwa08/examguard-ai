"""
ExamGuard AI - FastAPI Application Entry Point.
"""

from fastapi import FastAPI

from api import api_router

app = FastAPI(
    title="ExamGuard AI",
    description="Secure AI-powered examination and proctoring platform",
    version="1.0.0",
)

# Register all API v1 routes
app.include_router(api_router)


@app.get("/")
def root():
    return {
        "message": "ExamGuard AI backend is running",
        "status": "success",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }