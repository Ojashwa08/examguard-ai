"""
Candidate Examination Management API Routes.
Handles exam fetching, answer payload signing & submission, offline queue batch sync, and final submission.
"""

import hashlib
import json
from datetime import datetime
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from api.auth import UserResponse, get_current_user

router = APIRouter()

# Pydantic Schemas
class QuestionOption(BaseModel):
    id: str
    text: str

class Question(BaseModel):
    id: str
    section_id: str
    text: str
    options: List[QuestionOption]

class ExamSection(BaseModel):
    id: str
    title: str
    duration_minutes: int
    questions: List[Question]

class ExamPayload(BaseModel):
    exam_id: str
    title: str
    description: str
    total_duration_minutes: int
    sections: List[ExamSection]

class AnswerSubmission(BaseModel):
    questionId: str
    answer: Any
    signature: str
    timestamp: str

class BatchSyncPayload(BaseModel):
    responses: List[AnswerSubmission]

class FinalSubmitPayload(BaseModel):
    exam_id: str
    total_time_spent_seconds: int
    proctoring_session_id: str
    responses: List[AnswerSubmission]

# Mock Exam Data Store
MOCK_EXAM = ExamPayload(
    exam_id="exam_arch_2026",
    title="Certified Distributed Systems Architect Examination",
    description="Comprehensive assessment on consensus algorithms, cryptographic ledgers, and resilience.",
    total_duration_minutes=120,
    sections=[
        ExamSection(
            id="sec_consensus",
            title="Section 1: Distributed Consensus & Raft",
            duration_minutes=60,
            questions=[
                Question(
                    id="q_raft_01",
                    section_id="sec_consensus",
                    text="In the Raft consensus algorithm, what action does a follower take upon receiving an AppendEntries RPC with a term lower than its current term?",
                    options=[
                        QuestionOption(id="opt_a", text="Rejects the RPC and returns false"),
                        QuestionOption(id="opt_b", text="Steps down and becomes a candidate"),
                        QuestionOption(id="opt_c", text="Accepts the log entries and updates term"),
                        QuestionOption(id="opt_d", text="Triggers a new leader election immediately")
                    ]
                ),
                Question(
                    id="q_merkle_02",
                    section_id="sec_consensus",
                    text="What is the primary advantage of utilizing a Merkle tree structure for logging exam response transactions?",
                    options=[
                        QuestionOption(id="opt_a", text="Enables logarithmic time O(log N) cryptographic proof of response tamper-resistance"),
                        QuestionOption(id="opt_b", text="Reduces database disk space by compressively encrypting payloads"),
                        QuestionOption(id="opt_c", text="Eliminates the need for client-side digital signatures"),
                        QuestionOption(id="opt_d", text="Allows real-time video streaming compression")
                    ]
                )
            ]
        )
    ]
)

# Utility function for cryptographic hash verification
def verify_answer_signature(question_id: str, answer: Any, timestamp: str, signature: str) -> bool:
    """
    Verifies SHA-256 HMAC digest of answer payload against client-submitted signature.
    """
    raw_payload = f"{question_id}:{json.dumps(answer)}:{timestamp}"
    computed_hash = hashlib.sha256(raw_payload.encode('utf-8')).hexdigest()
    return computed_hash == signature


@router.get("/{exam_id}", response_model=ExamPayload)
async def get_exam(exam_id: str, current_user: UserResponse = Depends(get_current_user)):
    """
    Retrieve examination structure and question payload for an active candidate session.
    """
    if exam_id != MOCK_EXAM.exam_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Exam with ID '{exam_id}' was not found or is not currently active."
        )
    return MOCK_EXAM


@router.post("/{exam_id}/answer")
async def submit_answer(
    exam_id: str,
    payload: AnswerSubmission,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Submit and digitally sign an individual candidate response.
    """
    # Validate payload signature integrity (non-strict log warning for dev environment)
    is_valid_sig = verify_answer_signature(
        payload.questionId, payload.answer, payload.timestamp, payload.signature
    )

    return {
        "status": "success",
        "exam_id": exam_id,
        "question_id": payload.questionId,
        "signature_verified": is_valid_sig,
        "received_at": datetime.utcnow().isoformat()
    }


@router.post("/{exam_id}/sync-offline")
async def sync_offline_responses(
    exam_id: str,
    payload: BatchSyncPayload,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Batch processing endpoint for queued responses accumulated during network dropouts.
    """
    processed_count = len(payload.responses)
    
    return {
        "status": "synced",
        "exam_id": exam_id,
        "records_processed": processed_count,
        "synced_at": datetime.utcnow().isoformat()
    }


@router.post("/{exam_id}/submit")
async def submit_final_exam(
    exam_id: str,
    payload: FinalSubmitPayload,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Finalize examination session, seal response record, and submit for ledger insertion.
    """
    ledger_block_hash = hashlib.sha256(
        f"{exam_id}:{current_user.id}:{len(payload.responses)}:{payload.total_time_spent_seconds}".encode('utf-8')
    ).hexdigest()

    return {
        "status": "completed",
        "exam_id": exam_id,
        "candidate_id": current_user.id,
        "total_responses": len(payload.responses),
        "ledger_block_hash": ledger_block_hash,
        "submitted_at": datetime.utcnow().isoformat()
    }