from typing import List, Dict, Any
from backend.app.providers.gemini_provider import gemini_provider
from backend.app.core.logging import logger

class ClaimExtractorService:
    async def extract_and_normalize_claims(self, text: str) -> List[Dict[str, Any]]:
        logger.info(f"Extracting claims from text input ({len(text)} chars)...")
        raw_claims = await gemini_provider.extract_claims(text)
        
        normalized_claims = []
        for idx, item in enumerate(raw_claims, start=1):
            claim_text = item.get("claim_text", "").strip()
            if not claim_text:
                continue
            
            canonical = item.get("canonical_data") or {}
            normalized_claims.append({
                "claim_text": claim_text,
                "claim_type": item.get("claim_type", "FACTUAL"),
                "canonical_data": canonical,
                "claim_time": item.get("claim_time", "Current"),
                "claim_order": str(idx),
            })
            
        if not normalized_claims:
            # Fallback if no factual claims detected
            normalized_claims.append({
                "claim_text": text.strip(),
                "claim_type": "FACTUAL",
                "canonical_data": {"raw": text.strip()},
                "claim_time": "Current",
                "claim_order": "1",
            })
            
        return normalized_claims

claim_extractor_service = ClaimExtractorService()
