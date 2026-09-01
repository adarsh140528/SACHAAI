from typing import List, Dict, Any, Optional
import httpx
from backend.app.core.config import settings
from backend.app.core.logging import logger

class GoogleFactCheckItem:
    def __init__(
        self,
        publisher: str,
        reviewed_claim: str,
        review_url: str,
        rating: Optional[str] = None,
        review_date: Optional[str] = None,
        language_code: str = "en"
    ):
        self.publisher = publisher
        self.reviewed_claim = reviewed_claim
        self.review_url = review_url
        self.rating = rating or "Unknown"
        self.review_date = review_date
        self.language_code = language_code

    def to_dict(self) -> Dict[str, Any]:
        return {
            "publisher": self.publisher,
            "reviewed_claim": self.reviewed_claim,
            "review_url": self.review_url,
            "rating": self.rating,
            "review_date": self.review_date,
            "language_code": self.language_code,
        }

class FactCheckProvider:
    """
    Integrates with the Google Fact Check Tools API (claims.search).
    Returns real fact check reviews from established verification organizations.
    """
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GOOGLE_FACT_CHECK_API_KEY
        self.endpoint = "https://factchecktools.googleapis.com/v1alpha1/claims:search"

    async def search_claims(self, query: str, language_code: str = "en", page_size: int = 5) -> List[GoogleFactCheckItem]:
        if not self.api_key:
            # Fact check API key not configured - return empty list without crashing
            logger.info("Google Fact Check API key not configured. Skipping claims.search.")
            return []

        results: List[GoogleFactCheckItem] = []
        try:
            params = {
                "key": self.api_key,
                "query": query,
                "pageSize": page_size,
                "languageCode": language_code,
            }
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(self.endpoint, params=params)
                if res.status_code == 200:
                    data = res.json()
                    claims = data.get("claims", [])
                    for claim in claims:
                        text_claim = claim.get("text", "")
                        claim_reviews = claim.get("claimReview", [])
                        for review in claim_reviews:
                            publisher_info = review.get("publisher", {})
                            publisher_name = publisher_info.get("name") or publisher_info.get("site", "Fact-Checker")
                            url = review.get("url", "")
                            rating = review.get("textualRating", "")
                            review_date = review.get("reviewDate", "")
                            
                            if url and publisher_name:
                                results.append(GoogleFactCheckItem(
                                    publisher=publisher_name,
                                    reviewed_claim=text_claim,
                                    review_url=url,
                                    rating=rating,
                                    review_date=review_date,
                                    language_code=language_code
                                ))
                else:
                    logger.warning(f"Fact Check API returned status {res.status_code}: {res.text[:200]}")
        except Exception as e:
            logger.error(f"Error querying Google Fact Check API: {e}")

        return results[:page_size]

factcheck_provider = FactCheckProvider()
