"""
SQLAlchemy ORM Model for Cryptographic Ledger Blocks.
Defines database schema for storing SHA-256 Merkle chain blocks and verification metadata.
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class LedgerBlock(Base):
    """
    Represents an immutable, tamper-evident block in the SHA-256 response ledger chain.
    """
    __tablename__ = "ledger_blocks"

    block_index: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    merkle_root: Mapped[str] = mapped_column(String(64), nullable=False)
    previous_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    block_hash: Mapped[str] = mapped_column(String(64), nullable=False, unique=True, index=True)
    transaction_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)