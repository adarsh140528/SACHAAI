import asyncio
import re
import urllib.parse
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import httpx
from backend.app.core.config import settings
from backend.app.core.logging import logger

class SearchResultItem:
    def __init__(self, title: str, url: str, snippet: str, publisher: Optional[str] = None):
        self.title = title
        self.url = url
        self.snippet = snippet
        self.domain = self._extract_domain(url)
        self.publisher = publisher or self._derive_publisher(self.domain)

    def _extract_domain(self, url: str) -> str:
        try:
            parsed = urllib.parse.urlparse(url)
            netloc = parsed.netloc.lower()
            if netloc.startswith("www."):
                netloc = netloc[4:]
            return netloc
        except Exception:
            return "unknown"

    def _derive_publisher(self, domain: str) -> str:
        parts = domain.split(".")
        if len(parts) >= 2:
            return parts[0].capitalize()
        return domain

    def to_dict(self) -> Dict[str, Any]:
        return {
            "title": self.title,
            "url": self.url,
            "snippet": self.snippet,
            "domain": self.domain,
            "publisher": self.publisher,
        }

class SearchProvider(ABC):
    @abstractmethod
    async def search(self, query: str, limit: int = 5) -> List[SearchResultItem]:
        pass

class DuckDuckGoSearchProvider(SearchProvider):
    """
    Zero-configuration live web search provider using DuckDuckGo.
    Does not require any external paid API keys so real live searches
    work out-of-the-box in development and production.
    """
    async def search(self, query: str, limit: int = 5) -> List[SearchResultItem]:
        results: List[SearchResultItem] = []
        try:
            # First try official duckduckgo_search library
            from duckduckgo_search import DDGS
            # Run synchronous library call in async threadpool
            def _ddg_call():
                with DDGS() as ddgs:
                    return list(ddgs.text(query, max_results=limit))

            raw_results = await asyncio.to_thread(_ddg_call)
            for item in raw_results:
                title = item.get("title", "")
                url = item.get("href") or item.get("link", "")
                snippet = item.get("body") or item.get("snippet", "")
                if url and title:
                    results.append(SearchResultItem(title=title, url=url, snippet=snippet))
        except Exception as e:
            logger.warning(f"DuckDuckGo library search encountered: {e}. Falling back to direct HTML search.")
            # Fallback to direct DuckDuckGo HTML parsing via httpx
            try:
                headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
                }
                async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
                    resp = await client.post(
                        "https://html.duckduckgo.com/html/",
                        data={"q": query},
                        headers=headers
                    )
                    if resp.status_code == 200:
                        from bs4 import BeautifulSoup
                        soup = BeautifulSoup(resp.text, "html.parser")
                        links = soup.find_all("div", class_="result")
                        for link in links[:limit]:
                            title_elem = link.find("a", class_="result__a")
                            snippet_elem = link.find("a", class_="result__snippet")
                            if title_elem and title_elem.get("href"):
                                href = title_elem["href"]
                                # Extract actual destination URL from DDG redirect url
                                if "uddg=" in href:
                                    qs = urllib.parse.parse_qs(urllib.parse.urlparse(href).query)
                                    if "uddg" in qs:
                                        href = qs["uddg"][0]
                                title_text = title_elem.get_text(strip=True)
                                snippet_text = snippet_elem.get_text(strip=True) if snippet_elem else ""
                                results.append(SearchResultItem(title=title_text, url=href, snippet=snippet_text))
            except Exception as direct_err:
                logger.error(f"Direct HTML search also failed: {direct_err}")

        return results[:limit]

class TavilySearchProvider(SearchProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key

    async def search(self, query: str, limit: int = 5) -> List[SearchResultItem]:
        if not self.api_key:
            return await DuckDuckGoSearchProvider().search(query, limit)
        results: List[SearchResultItem] = []
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    "https://api.tavily.com/search",
                    json={"api_key": self.api_key, "query": query, "max_results": limit, "include_answer": False}
                )
                if res.status_code == 200:
                    data = res.json()
                    for r in data.get("results", []):
                        results.append(SearchResultItem(
                            title=r.get("title", ""),
                            url=r.get("url", ""),
                            snippet=r.get("content", ""),
                        ))
        except Exception as e:
            logger.error(f"Tavily search error: {e}")
            return await DuckDuckGoSearchProvider().search(query, limit)
        return results

class SerperSearchProvider(SearchProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key

    async def search(self, query: str, limit: int = 5) -> List[SearchResultItem]:
        if not self.api_key:
            return await DuckDuckGoSearchProvider().search(query, limit)
        results: List[SearchResultItem] = []
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    "https://google.serper.dev/search",
                    headers={"X-API-KEY": self.api_key, "Content-Type": "application/json"},
                    json={"q": query, "num": limit}
                )
                if res.status_code == 200:
                    data = res.json()
                    for r in data.get("organic", []):
                        results.append(SearchResultItem(
                            title=r.get("title", ""),
                            url=r.get("link", ""),
                            snippet=r.get("snippet", ""),
                        ))
        except Exception as e:
            logger.error(f"Serper search error: {e}")
            return await DuckDuckGoSearchProvider().search(query, limit)
        return results

def get_search_provider() -> SearchProvider:
    provider_name = settings.SEARCH_PROVIDER.lower()
    if provider_name == "tavily" and settings.SEARCH_API_KEY:
        return TavilySearchProvider(settings.SEARCH_API_KEY)
    elif provider_name == "serper" and settings.SEARCH_API_KEY:
        return SerperSearchProvider(settings.SEARCH_API_KEY)
    return DuckDuckGoSearchProvider()
