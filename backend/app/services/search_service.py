import asyncio
from typing import List, Dict, Any
from backend.app.providers.search_provider import get_search_provider, SearchResultItem
from backend.app.providers.gemini_provider import gemini_provider
from backend.app.core.logging import logger

class SearchService:
    def __init__(self):
        self.provider = get_search_provider()

    async def execute_multi_query_search(self, claim_text: str) -> List[Dict[str, Any]]:
        logger.info(f"Generating multi-angle search queries for claim: '{claim_text[:50]}...'")
        queries = await gemini_provider.generate_search_queries(claim_text)
        logger.info(f"Executing {len(queries)} search queries concurrently: {queries}")

        tasks = [self.provider.search(q, limit=4) for q in queries]
        results_nested = await asyncio.gather(*tasks, return_exceptions=True)

        seen_urls = set()
        unique_results: List[Dict[str, Any]] = []

        for res_group in results_nested:
            if isinstance(res_group, list):
                for item in res_group:
                    if isinstance(item, SearchResultItem):
                        if item.url not in seen_urls:
                            seen_urls.add(item.url)
                            unique_results.append(item.to_dict())

        logger.info(f"Retrieved {len(unique_results)} distinct web evidence sources.")
        return unique_results

search_service = SearchService()
