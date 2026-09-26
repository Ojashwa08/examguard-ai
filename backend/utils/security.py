"""
Cryptographic & Authentication Utilities for ExamGuard AI.
Provides password hashing via bcrypt, JWT issuance & verification, and HMAC SHA-256 payload signing.
"""

import hmac
import hashlib
from datetime import datetime, timedelta
from typing import Any, Dict, Optional, Union
import jwt
import passlib.context

# Password hashing context using bcrypt
pwd_context = passlib.context.CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security Default Constants (Overridden in production via pydantic-settings)
SECRET_KEY = "examguard_secret_key_change_in_production_environment"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 12  # 12-hour session duration


def hash_password(password: str) -> str:
    """Hashes a plain-text password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain-text password against a stored bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    subject: Union[str, Any],
    role: str,
    expires_delta: Optional[timedelta] = None,
    extra_claims: Optional[Dict[str, Any]] = None,
) -> str:
    """
    Generates a signed JWT access token containing subject, role, and expiration.
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {
        "sub": str(subject),
        "role": role,
        "exp": expire,
        "iat": datetime.utcnow(),
    }

    if extra_claims:
        to_encode.update(extra_claims)

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Dict[str, Any]:
    """
    Decodes and validates a JWT token.
    Raises jwt.PyJWTError on invalid token or expiration.
    """
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return payload


def generate_hmac_signature(payload_bytes: bytes, secret_key: str) -> str:
    """
    Generates a SHA-256 HMAC signature for payload integrity validation across edge proxies.
    """
    return hmac.new(
        key=secret_key.encode("utf-8"),
        msg=payload_bytes,
        digestmod=hashlib.sha256,
    ).hexdigest()


def verify_hmac_signature(payload_bytes: bytes, secret_key: str, signature: str) -> bool:
    """
    Verifies a SHA-256 HMAC signature against raw payload bytes using constant-time comparison.
    """
    computed_sig = generate_hmac_signature(payload_bytes, secret_key)
    return hmac.compare_digest(computed_sig, signature)