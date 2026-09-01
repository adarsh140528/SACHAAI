from typing import List, Dict, Any
from backend.app.providers.gemini_provider import gemini_provider
from backend.app.core.logging import logger

class ExplanationService:
    async def generate_explanation(
        self,
        claim_text: str,
        verdict: str,
        confidence: str,
        evidence_items: List[Dict[str, Any]]
    ) -> str:
        logger.info(f"Generating explainable reasoning for verdict: {verdict} ({confidence})...")
        
        evidence_summary = []
        for ev in evidence_items:
            evidence_summary.append({
                "publisher": ev.get("source", {}).get("publisher_name", "Source"),
                "source_type": ev.get("source", {}).get("source_tier", "Secondary"),
                "evidence_text": ev.get("evidence_text", ""),
                "relationship": ev.get("relationship", "INSUFFICIENT"),
            })
            
        return await gemini_provider.generate_explanation(
            claim_text=claim_text,
            verdict=verdict,
            confidence=confidence,
            evidence_summary=evidence_summary
        )

explanation_service = ExplanationService()
