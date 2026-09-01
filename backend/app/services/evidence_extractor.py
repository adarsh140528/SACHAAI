import asyncio
from typing import List, Dict, Any
from backend.app.providers.gemini_provider import gemini_provider
from backend.app.services.source_ranker import source_ranker
from backend.app.core.logging import logger

class EvidenceExtractorService:
    async def extract_and_evaluate_evidence(
        self,
        claim_text: str,
        search_results: List[Dict[str, Any]],
        fact_checks: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        logger.info("Extracting atomic evidence and evaluating source relationships...")
        
        # 1. Cluster syndication and rank sources
        ranked_results = []
        for r in search_results:
            source_meta = source_ranker.rank_source(r.get("url", ""), r.get("publisher", ""))
            ranked_results.append({
                **r,
                **source_meta,
            })
        
        clustered_sources = source_ranker.cluster_source_independence(ranked_results)

        # 2. Add Fact Checks as candidate evidence (Tier 3)
        for fc in fact_checks:
            source_meta = source_ranker.rank_source(fc.get("review_url", ""), fc.get("publisher", ""))
            clustered_sources.append({
                "title": f"Fact Check Review by {fc.get('publisher')}",
                "url": fc.get("review_url", ""),
                "snippet": f"Reviewed Claim: '{fc.get('reviewed_claim')}'. Rating: '{fc.get('rating')}'. Review Date: {fc.get('review_date')}",
                "domain": source_meta["domain"],
                "publisher": fc.get("publisher"),
                "source_tier": "TIER_3_FACT_CHECKER",
                "reliability_score": 0.85,
                "source_group_id": f"fc_{fc.get('publisher', 'factcheck').lower()}",
                "publication_date": fc.get("review_date"),
            })

        # 3. Concurrently evaluate relationship for candidate evidence items
        tasks = []
        for src in clustered_sources[:8]:  # Evaluate top 8 candidate sources
            tasks.append(
                gemini_provider.evaluate_evidence_relationship(
                    claim_text=claim_text,
                    evidence_snippet=src.get("snippet", ""),
                    source_title=src.get("title", ""),
                    publisher=src.get("publisher_name") or src.get("publisher", "Source")
                )
            )

        evaluations = await asyncio.gather(*tasks, return_exceptions=True)

        extracted_evidence: List[Dict[str, Any]] = []
        for src, ev_res in zip(clustered_sources[:8], evaluations):
            if isinstance(ev_res, dict):
                relationship = ev_res.get("relationship", "INSUFFICIENT")
                relevance = ev_res.get("relevance_score", 0.70)
            else:
                relationship = "INSUFFICIENT"
                relevance = 0.50

            extracted_evidence.append({
                "source": {
                    "domain": src.get("domain", ""),
                    "publisher_name": src.get("publisher_name") or src.get("publisher", "Source"),
                    "source_tier": src.get("source_tier", "TIER_4_GENERAL_WEBSITE"),
                    "reliability_score": src.get("reliability_score", 0.40),
                    "source_group_id": src.get("source_group_id"),
                },
                "evidence_text": src.get("snippet", ""),
                "relationship": relationship,
                "relevance_score": relevance,
                "source_reliability": src.get("reliability_score", 0.40),
                "publication_date": src.get("publication_date"),
                "freshness_category": "RECENT",
                "url": src.get("url", ""),
            })

        return extracted_evidence

evidence_extractor_service = EvidenceExtractorService()
