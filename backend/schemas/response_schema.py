"""
Standardized API Response Wrappers & Generic Schemas.
Ensures uniform JSON contracts for success states, errors, and paginated collections.
"""

from datetime import datetime
from typing import Any, Generic, List, Optional, TypeVar
from pydantic import BaseModel, Field

# Generic payload type parameter
T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """
    Standard top-level API envelope wrapping all JSON endpoint outputs.
    """
    success: bool = Field(True, description="Indicates if the request completed without errors")
    message: str = Field("Request completed successfully", description="Human-readable response message")
    data: Optional[T] = Field(None, description="Response payload container")
    timestamp: str = Field(
        default_factory=lambda: datetime.utcnow().isoformat(),
        description="ISO-8601 server timestamp"
    )


class PaginationMeta(BaseModel):
    """
    Metadata block for paginated collection responses.
    """
    total_items: int = Field(..., ge=0, description="Total count of records matching query")
    page_size: int = Field(..., ge=1, description="Number of records returned per page")
    current_page: int = Field(..., ge=1, description="Current page index (1-based)")
    total_pages: int = Field(..., ge=0, description="Total pages available")
    has_next: bool = Field(False, description="True if subsequent pages exist")
    has_prev: bool = Field(False, description="True if previous pages exist")


class PaginatedResponse(BaseModel, Generic[T]):
    """
    Standard response wrapper for paginated entity lists.
    """
    items: List[T] = Field(default_factory=list, description="Array of returned entity objects")
    pagination: PaginationMeta = Field(..., description="Pagination metadata")


class ErrorDetail(BaseModel):
    """
    Structured error details for failed API calls.
    """
    code: str = Field(..., example="RESOURCE_NOT_FOUND", description="Machine-readable error code")
    message: str = Field(..., example="The requested resource could not be found.", description="User-facing detail")
    field: Optional[str] = Field(None, example="user_id", description="Field name if validation error")


class ErrorResponse(BaseModel):
    """
    Standard error envelope for HTTP exceptions (4xx/5xx).
    """
    success: bool = Field(False, description="Always false for error responses")
    error: ErrorDetail = Field(..., description="Detailed error payload")
    timestamp: str = Field(
        default_factory=lambda: datetime.utcnow().isoformat(),
        description="ISO-8601 server timestamp"
    )