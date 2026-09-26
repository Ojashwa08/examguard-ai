"""
Database Connection & Session Management Module.
Configures SQLAlchemy engine, session maker, and standard request session lifecycle dependencies.
"""

from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

from app.config import settings

# Configure SQLAlchemy Engine with connection pooling
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_pre_ping=True,  # Detect and recover from dropped connections automatically
    echo=settings.DEBUG,
)

# Thread-local database session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Declarative base class for SQLAlchemy ORM models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a transactional database session scope.
    Automatically closes the session after request execution completes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()