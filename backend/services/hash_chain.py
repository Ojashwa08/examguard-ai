"""
Cryptographic Ledger & Hash Chain Service.
Provides SHA-256 block hashing, Merkle root construction, and ledger chain integrity verification.
"""

import hashlib
import json
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from sqlalchemy.orm import Session

from app.models.ledger import LedgerBlock


class HashChainService:
    """
    Core service for maintaining the cryptographic SHA-256 block ledger chain.
    """

    GENESIS_PREVIOUS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"

    def __init__(self, db_session: Session):
        self.db = db_session

    @staticmethod
    def compute_sha256(data: str) -> str:
        """Computes a standard SHA-256 hex digest for a given UTF-8 string."""
        return hashlib.sha256(data.encode("utf-8")).hexdigest()

    def build_merkle_root(self, transactions: List[Dict]) -> str:
        """
        Calculates the Merkle Tree root hash for a list of candidate answer payloads.
        """
        if not transactions:
            return self.compute_sha256("EMPTY_BLOCK_TRANSACTIONS")

        # Leaf hashes derived from deterministic JSON strings
        leaf_hashes = [
            self.compute_sha256(json.dumps(tx, sort_keys=True)) for tx in transactions
        ]

        # Iteratively calculate parent nodes until single root remains
        current_level = leaf_hashes
        while len(current_level) > 1:
            if len(current_level) % 2 != 0:
                current_level.append(current_level[-1])  # Duplicate last node if odd count

            next_level = []
            for i in range(0, len(current_level), 2):
                combined = current_level[i] + current_level[i + 1]
                next_level.append(self.compute_sha256(combined))
            current_level = next_level

        return current_level[0]

    def create_block(self, transactions: List[Dict]) -> LedgerBlock:
        """
        Appends a new verified cryptographic block to the ledger chain.
        """
        last_block = (
            self.db.query(LedgerBlock)
            .order_by(LedgerBlock.block_index.desc())
            .first()
        )

        if last_block:
            next_index = last_block.block_index + 1
            previous_hash = last_block.block_hash
        else:
            next_index = 0
            previous_hash = self.GENESIS_PREVIOUS_HASH

        merkle_root = self.build_merkle_root(transactions)
        timestamp = datetime.utcnow()

        # Block signature payload: Index + Timestamp + MerkleRoot + PreviousHash
        block_signature_payload = f"{next_index}:{timestamp.isoformat()}:{merkle_root}:{previous_hash}"
        block_hash = self.compute_sha256(block_signature_payload)

        block = LedgerBlock(
            block_index=next_index,
            timestamp=timestamp,
            merkle_root=merkle_root,
            previous_hash=previous_hash,
            block_hash=block_hash,
            transaction_count=len(transactions),
            is_verified=True,
            verified_at=timestamp,
        )

        self.db.add(block)
        self.db.commit()
        self.db.refresh(block)

        return block

    def verify_chain_integrity(self) -> Tuple[bool, Optional[int], str]:
        """
        Iterates over the entire stored ledger chain to detect tampering or broken hash links.
        Returns (is_valid, corrupted_block_index, error_message).
        """
        blocks = (
            self.db.query(LedgerBlock)
            .order_by(LedgerBlock.block_index.asc())
            .all()
        )

        if not blocks:
            return True, None, "Ledger is empty. Integrity intact."

        expected_prev_hash = self.GENESIS_PREVIOUS_HASH

        for block in blocks:
            # 1. Verify link continuity
            if block.previous_hash != expected_prev_hash:
                return (
                    False,
                    block.block_index,
                    f"Previous hash mismatch at index {block.block_index}. Chain broken.",
                )

            # 2. Recompute block signature
            signature_payload = f"{block.block_index}:{block.timestamp.isoformat()}:{block.merkle_root}:{block.previous_hash}"
            recalculated_hash = self.compute_sha256(signature_payload)

            if block.block_hash != recalculated_hash:
                return (
                    False,
                    block.block_index,
                    f"Block hash mutation detected at index {block.block_index}.",
                )

            expected_prev_hash = block.block_hash

        return True, None, "All blocks verified successfully. Ledger integrity 100% valid."