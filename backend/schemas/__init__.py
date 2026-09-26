"""
Pydantic Data Schemas Package Initialization.
Imports and exports all request/response serialization models across domain modules.
"""

from app.schemas.auth import (
    Token,
    TokenData,
    UserLogin,
    UserCreate,
    UserResponse,
)
from app.schemas.exam import (
    QuestionOptionSchema,
    QuestionSchema,
    ExamSectionSchema,
    ExamSchema,
    AnswerSubmissionSchema,
    BatchSyncPayloadSchema,
    FinalSubmitPayloadSchema,
)
from app.schemas.incident import (
    IncidentBase,
    IncidentCreate,
    IncidentResponse,
    IncidentResolutionPayload,
)
from app.schemas.ledger import (
    LedgerBlockSchema,
    PayloadVerificationRequestSchema,
    ChainVerificationResultSchema,
)
from app.schemas.telemetry import (
    CenterTelemetrySchema,
    RiskEngineConfigSchema,
    CandidateTelemetryStreamSchema,
)
from app.schemas.simulator import (
    ChaosInjectionRequestSchema,
    SimulationStatusResponseSchema,
)

__all__ = [
    # Auth
    "Token",
    "TokenData",
    "UserLogin",
    "UserCreate",
    "UserResponse",
    # Exam
    "QuestionOptionSchema",
    "QuestionSchema",
    "ExamSectionSchema",
    "ExamSchema",
    "AnswerSubmissionSchema",
    "BatchSyncPayloadSchema",
    "FinalSubmitPayloadSchema",
    # Incident
    "IncidentBase",
    "IncidentCreate",
    "IncidentResponse",
    "IncidentResolutionPayload",
    # Ledger
    "LedgerBlockSchema",
    "PayloadVerificationRequestSchema",
    "ChainVerificationResultSchema",
    # Telemetry
    "CenterTelemetrySchema",
    "RiskEngineConfigSchema",
    "CandidateTelemetryStreamSchema",
    # Simulator
    "ChaosInjectionRequestSchema",
    "SimulationStatusResponseSchema",
]