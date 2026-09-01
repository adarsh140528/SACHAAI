import hashlib
import time
from typing import Optional, Dict, Any
from backend.app.core.logging import logger

class VerificationCacheService:
    """
    High-performance claim caching using SHA-256 claim hashing.
    Prevents redundant web searches and AI API calls for identical factual statements.
    """
    def __init__(self, ttl_seconds: int = 3600):
        self._cache: Dict[str, Dict[str, Any]] = {}
        self.ttl = ttl_seconds

    def compute_claim_hash(self, claim_text: str) -> str:
        # Normalize text by lowercasing and stripping whitespace/punctuation
        normalized = "".join(ch.lower() for ch in claim_text if ch.isalnum() or ch.isspace()).strip()
        return hashlib.sha256(normalized.encode()).hexdigest()

    def get(self, claim_text: str) -> Optional[Dict[str, Any]]:
        h = self.compute_claim_hash(claim_text)
        entry = self._cache.get(h)
        if entry:
            if time.time() - entry["cached_at"] < self.ttl:
                logger.info(f"Cache HIT for claim hash {h[:8]}")
                return entry["data"]
            else:
                del self._cache[h]
        return None

    def set(self, claim_text: str, data: Dict[str, Any]):
        h = self.compute_claim_hash(claim_text)
        self._cache[h] = {
            "cached_at": time.time(),
            "data": data,
        }
        logger.info(f"Cached verification result for claim hash {h[:8]}")

verification_cache = VerificationCacheService()
