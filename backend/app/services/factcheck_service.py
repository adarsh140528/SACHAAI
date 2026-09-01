from typing import List, Dict, Any
from backend.app.providers.factcheck_provider import factcheck_provider
from backend.app.core.logging import logger

class FactCheckService:
    async def retrieve_existing_fact_checks(self, claim_text: str, language: str = "en") -> List[Dict[str, Any]]:
        logger.info(f"Searching existing fact-checks for: '{claim_text[:60]}...'")
        checks = await factcheck_provider.search_claims(query=claim_text, language_code=language, page_size=5)
        return [c.to_dict() for c in checks]

factcheck_service = FactCheckService()
