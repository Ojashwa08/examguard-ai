"""
Core Application Configuration Module.
Loads environment variables using Pydantic Settings with validation and default fallbacks.
"""

import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Application Info
    APP_NAME: str = "ExamGuard AI & Operations Engine"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Security & JWT Credentials
    SECRET_KEY: str = "SUPER_SECRET_EXAM_PLATFORM_KEY_CHANGE_IN_PRODUCTION"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8-hour exam session duration

    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Database Settings
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/secure_exam_db"
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 10

    # Redis Cache & Pub/Sub
    REDIS_URL: str = "redis://localhost:6379/0"

    # WebSocket Telemetry Settings
    WS_HEARTBEAT_INTERVAL: int = 30
    WS_MAX_MESSAGE_QUEUE: int = 100

    # AI Proctoring & Risk Threshold Defaults
    DEFAULT_RISK_SENSITIVITY: float = 0.75
    CRITICAL_RISK_SCORE_CUTOFF: float = 0.85

    # Raft Node & Consensus Settings
    RAFT_NODE_ID: str = "node-01"
    RAFT_CLUSTER_NODES: List[str] = ["node-01", "node-02", "node-03"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


# Instantiate singleton global settings object
settings = Settings()