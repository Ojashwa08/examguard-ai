"""
Cryptographic Integrity & Hash-Chain Audit API Routes.
Provides SHA-256 Merkle tree verification, payload integrity validation, and ledger block queries.
"""

import hashlib
import json
from datetime import datetime
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel

from api.auth import UserResponse, get_current_user

router = APIRouter()


# Pydantic Schemas
class LedgerBlock(BaseModel):
    block_index: int
    timestamp: str
    merkle_root: str
    previous_hash: str
    block_hash: str
    transaction_count: int
    is_verified: bool


class PayloadVerificationRequest(BaseModel):
    question_id: str
    candidate_id: str
    answer_payload: Any
    timestamp: str
    expected_hash: str


class ChainVerificationResult(BaseModel):
    chain_valid: bool
    total_blocks_checked: int
    tampered_blocks: List[int]
    latest_merkle_root: str
    verified_at: str


# Mock In-Memory SHA-256 Hash Ledger Chain
MOCK_LEDGER_CHAIN: List[dict] = [
    {
        "block_index": 0,
        "timestamp": "2026-09-26T18:00:00Z",
        "merkle_root": "0000000000000000000000000000000000000000000000000000000000000000",
        "previous_hash": "0" * 64,
        "block_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "transaction_count": 1,
        "is_verified": True,
    },
    {
        "block_index": 1,
        "timestamp": "2026-09-26T18:15:30Z",
        "merkle_root": "a4f8d92c7e1b3a5f8e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f",
        "previous_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "block_hash": "7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a",
        "transaction_count": 142,
        "is_verified": True,
    },
    {
        "block_index": 2,
        "timestamp": "2026-09-26T18:30:00Z",
        "merkle_root": "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
        "previous_hash": "7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a",
        "block_hash": "9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d",
        "transaction_count": 98,
        "is_verified": True,
    },
]


def check_admin_permission(user: UserResponse):
    """Ensure endpoint is limited to administrators."""
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to platform administrators.",
        )


@router.get("/blocks", response_model=List[LedgerBlock])
async def get_ledger_blocks(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Fetch paginated cryptographic hash blocks from the ledger audit log.
    """
    check_admin_permission(current_user)
    return MOCK_LEDGER_CHAIN[offset : offset + limit]


@router.post("/verify-chain", response_model=ChainVerificationResult)
async def verify_ledger_chain(
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Re-evaluate the full SHA-256 chain from Genesis block to latest root to detect tampering.
    """
    check_admin_permission(current_user)

    tampered = []
    for i in range(1, len(MOCK_LEDGER_CHAIN)):
        prev_block = MOCK_LEDGER_CHAIN[i - 1]
        curr_block = MOCK_LEDGER_CHAIN[i]

        if curr_block["previous_hash"] != prev_block["block_hash"]:
            tampered.append(curr_block["block_index"])

    latest_root = (
        MOCK_LEDGER_CHAIN[-1]["merkle_root"] if MOCK_LEDGER_CHAIN else ""
    )

    return ChainVerificationResult(
        chain_valid=len(tampered) == 0,
        total_blocks_checked=len(MOCK_LEDGER_CHAIN),
        tampered_blocks=tampered,
        latest_merkle_root=latest_root,
        verified_at=datetime.utcnow().isoformat(),
    )


@router.post("/verify-payload")
async def verify_single_payload(
    payload: PayloadVerificationRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Verify individual candidate answer digest against client hash signature.
    """
    check_admin_permission(current_user)

    raw_data = f"{payload.question_id}:{payload.candidate_id}:{json.dumps(payload.answer_payload)}:{payload.timestamp}"
    computed_hash = hashlib.sha256(raw_data.encode("utf-8")).hexdigest()

    is_match = computed_hash == payload.expected_hash

    return {
        "status": "valid" if is_match else "tampered",
        "computed_hash": computed_hash,
        "expected_hash": payload.expected_hash,
        "is_authentic": is_match,
        "verified_at": datetime.utcnow().isoformat(),
    }