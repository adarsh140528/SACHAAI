import re
from typing import List, Dict, Any
from backend.app.providers.gemini_provider import gemini_provider
from backend.app.core.logging import logger

class WhatsAppVerificationService:
    """
    Dedicated service for decomposing and evaluating viral WhatsApp forwards,
    handling multi-claim forwarded messages and screenshot transcripts.
    """
    async def decompose_whatsapp_message(self, raw_text: str) -> List[Dict[str, Any]]:
        logger.info(f"Decomposing WhatsApp forward message ({len(raw_text)} chars)...")
        
        # Strip typical WhatsApp metadata headers if present (e.g. "[10:45 AM, 12/04/2024] Forwarded message")
        cleaned_text = re.sub(r'\[\d{1,2}:\d{2}\s*(?:AM|PM)?,?\s*\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\].*?:', '', raw_text)
        cleaned_text = re.sub(r'^(?:Forwarded|Forwarded many times)\s*', '', cleaned_text, flags=re.IGNORECASE).strip()

        # Extract individual atomic factual claims
        claims = await gemini_provider.extract_claims(cleaned_text)
        
        logger.info(f"Decomposed WhatsApp forward into {len(claims)} atomic claims.")
        return claims

whatsapp_service = WhatsAppVerificationService()
