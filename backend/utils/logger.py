"""
Structured JSON Logging Utility for ExamGuard AI.
Provides JSON-formatted log streams with contextual metadata, correlation IDs, and standard log levels.
"""

import json
import logging
import sys
from datetime import datetime
from typing import Any, Dict, Optional


class JSONFormatter(logging.Formatter):
    """
    Custom log formatter outputting single-line JSON objects for structured parsing.
    """

    def __init__(self, service_name: str = "examguard-backend", environment: str = "production"):
        super().__init__()
        self.service_name = service_name
        self.environment = environment

    def format(self, record: logging.LogRecord) -> str:
        log_payload: Dict[str, Any] = {
            "timestamp": datetime.utcfromtimestamp(record.created).isoformat() + "Z",
            "level": record.levelname,
            "service": self.service_name,
            "environment": self.environment,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        # Contextual metadata passed via extra parameter (e.g., logger.info(..., extra={"user_id": "123"}))
        if hasattr(record, "extra_data") and isinstance(record.extra_data, dict):
            log_payload["extra"] = record.extra_data

        # Include request ID if present in log record context
        if hasattr(record, "request_id"):
            log_payload["request_id"] = record.request_id

        # Include exception trace if record contains exception details
        if record.exc_info:
            log_payload["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_payload)


def setup_logger(
    name: str = "examguard",
    log_level: int = logging.INFO,
    service_name: str = "examguard-backend",
    environment: str = "production",
) -> logging.Logger:
    """
    Configures and returns a structured logger instance attached to stdout.
    """
    logger = logging.getLogger(name)
    logger.setLevel(log_level)

    # Avoid duplicate handlers if setup is called multiple times
    if not logger.handlers:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(log_level)
        console_handler.setFormatter(
            JSONFormatter(service_name=service_name, environment=environment)
        )
        logger.addHandler(console_handler)

    # Prevent logs from propagating to root logger duplicate streams
    logger.propagate = False

    return logger


# Default application-wide logger instance
logger = setup_logger()