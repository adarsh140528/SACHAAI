import re
from typing import Dict, Any, Tuple
import httpx
from bs4 import BeautifulSoup
from backend.app.core.security import validate_ssrf_safe_url
from backend.app.core.logging import logger

class URLExtractorService:
    """
    SSRF-protected web article extractor for news & public URLs.
    Extracts article title, author, publication date, and body paragraphs.
    """
    async def extract_article_content(self, url: str) -> Dict[str, Any]:
        logger.info(f"Validating and extracting article content from URL: {url}")
        
        # 1. SSRF Safety Check
        is_safe, error_msg = validate_ssrf_safe_url(url)
        if not is_safe:
            logger.warning(f"SSRF violation blocked for URL: {url} ({error_msg})")
            raise ValueError(f"Security Alert: {error_msg}")

        # 2. Fetch HTML content with strict timeouts
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        }

        try:
            async with httpx.AsyncClient(timeout=8.0, follow_redirects=True, max_redirects=3) as client:
                res = await client.get(url, headers=headers)
                
                if res.status_code != 200:
                    raise RuntimeError(f"HTTP {res.status_code}: Unable to access article.")

                html = res.text
                if not html or len(html) < 50:
                    raise RuntimeError("Retrieved page content was empty.")

        except httpx.TimeoutException:
            raise RuntimeError("Request timed out while connecting to the article server.")
        except Exception as e:
            if "Security Alert" in str(e):
                raise
            raise RuntimeError(f"Unable to retrieve article content ({str(e)}). Please paste the article text directly.")

        # 3. Parse HTML and extract core article text
        return self._parse_html(html, url)

    def _parse_html(self, html: str, url: str) -> Dict[str, Any]:
        soup = BeautifulSoup(html, "html.parser")

        # Strip non-content elements
        for tag in soup(["script", "style", "nav", "footer", "header", "aside", "noscript", "form", "svg"]):
            tag.decompose()

        # Extract Title
        title = ""
        og_title = soup.find("meta", property="og:title")
        if og_title and og_title.get("content"):
            title = og_title["content"].strip()
        elif soup.title and soup.title.string:
            title = soup.title.string.strip()
        elif soup.find("h1"):
            title = soup.find("h1").get_text(strip=True)

        # Extract Publication Date
        pub_date = ""
        date_meta = soup.find("meta", property="article:published_time") or soup.find("meta", attrs={"name": "pubdate"})
        if date_meta and date_meta.get("content"):
            pub_date = date_meta["content"][:10]

        # Extract Core Body Text
        article_tag = soup.find("article") or soup.find("main") or soup.find("div", class_=re.compile(r'content|article|body|entry', re.I))
        
        paragraphs = []
        target_container = article_tag if article_tag else soup.body
        if target_container:
            for p in target_container.find_all("p"):
                p_text = p.get_text(strip=True)
                if len(p_text) > 25:
                    paragraphs.append(p_text)

        full_text = "\n\n".join(paragraphs)
        if not full_text and target_container:
            full_text = target_container.get_text(separator="\n", strip=True)

        # Truncate clean body to max 4000 characters for token-efficient processing
        clean_body = full_text[:4000].strip()

        if not clean_body and not title:
            raise RuntimeError("Unable to extract readable article content. Please paste the article text directly.")

        return {
            "url": url,
            "title": title or "News Article",
            "publication_date": pub_date,
            "body": clean_body,
            "summary_snippet": f"{title}\n\n{clean_body[:300]}..." if clean_body else title
        }

url_extractor_service = URLExtractorService()
