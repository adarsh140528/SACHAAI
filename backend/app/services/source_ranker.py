import hashlib
import re
from typing import Dict, Any, Tuple, List
from backend.app.core.config import settings

# Recognized Domain Database for Tier Classification
TIER_1_DOMAINS = {
    "gov.in", "nic.in", "rbi.org.in", "pib.gov.in", "who.int", "un.org",
    "eci.gov.in", "sci.gov.in", "incometax.gov.in", "isro.gov.in", "nasa.gov",
    "whitehouse.gov", "cdc.gov", "fda.gov", "nature.com", "science.org",
    "thelancet.com", "nejm.org", "pnas.org", "nih.gov", "supremecourt.gov"
}

TIER_2_DOMAINS = {
    "reuters.com", "apnews.com", "bbc.com", "bbc.co.uk", "thehindu.com",
    "indianexpress.com", "ndtv.com", "hindustantimes.com", "timesofindia.indiatimes.com",
    "ptinews.com", "aniin.com", "bloomberg.com", "wsj.com", "nytimes.com",
    "theguardian.com", "ft.com", "economist.com", "afp.com", "aljazeera.com",
    "business-standard.com", "livemint.com", "moneycontrol.com", "scroll.in",
    "theprint.in", "thewire.in"
}

TIER_3_DOMAINS = {
    "altnews.in", "boomlive.in", "snopes.com", "politifact.com", "factcheck.org",
    "reuters.com/fact-check", "apnews.com/hub/ap-fact-check", "vishwasnews.com",
    "newschecker.in", "factly.in", "thip.media", "fullfact.org", "afpfactcheck.com"
}

TIER_5_DOMAINS = {
    "twitter.com", "x.com", "facebook.com", "instagram.com", "t.me",
    "reddit.com", "quora.com", "tiktok.com", "youtube.com", "blogspot.com",
    "wordpress.com", "medium.com"
}

class SourceRanker:
    """
    Ranks source reliability based on a 5-tier classification hierarchy
    and performs syndication / independence clustering.
    """
    def rank_source(self, url: str, publisher: str) -> Dict[str, Any]:
        domain = self._clean_domain(url)
        tier, score = self._classify_domain(domain)
        
        return {
            "domain": domain,
            "publisher_name": publisher or self._derive_publisher_name(domain),
            "source_tier": tier,
            "reliability_score": score,
        }

    def _clean_domain(self, url: str) -> str:
        try:
            import urllib.parse
            parsed = urllib.parse.urlparse(url)
            netloc = parsed.netloc.lower()
            if netloc.startswith("www."):
                netloc = netloc[4:]
            return netloc
        except Exception:
            return "unknown.com"

    def _classify_domain(self, domain: str) -> Tuple[str, float]:
        # Tier 1: Official / Primary / Scientific
        for t1 in TIER_1_DOMAINS:
            if domain == t1 or domain.endswith("." + t1):
                if any(sci in domain for sci in ["nature.com", "science.org", "thelancet", "nejm", "pnas"]):
                    return "TIER_1_SCIENTIFIC_PRIMARY", settings.WEIGHT_SCIENTIFIC_PRIMARY
                return "TIER_1_OFFICIAL_PRIMARY", settings.WEIGHT_OFFICIAL_PRIMARY

        # Tier 3: Professional Fact-Checkers
        for t3 in TIER_3_DOMAINS:
            if domain == t3 or domain.endswith("." + t3):
                return "TIER_3_FACT_CHECKER", settings.WEIGHT_FACT_CHECKER

        # Tier 2: Established News
        for t2 in TIER_2_DOMAINS:
            if domain == t2 or domain.endswith("." + t2):
                return "TIER_2_ESTABLISHED_NEWS", settings.WEIGHT_ESTABLISHED_NEWS

        # Tier 5: Social Media / Blogs
        for t5 in TIER_5_DOMAINS:
            if domain == t5 or domain.endswith("." + t5):
                return "TIER_5_SOCIAL_MEDIA", settings.WEIGHT_SOCIAL_MEDIA

        # Tier 4: Known Secondary / General Websites
        if any(domain.endswith(ext) for ext in [".org", ".edu", ".ac.in"]):
            return "TIER_4_KNOWN_SECONDARY", settings.WEIGHT_KNOWN_SECONDARY

        return "TIER_4_GENERAL_WEBSITE", settings.WEIGHT_GENERAL_WEBSITE

    def _derive_publisher_name(self, domain: str) -> str:
        parts = domain.split(".")
        if len(parts) >= 2:
            return parts[0].capitalize()
        return domain

    def cluster_source_independence(self, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Detects syndicated or identical wire copies (e.g. 10 sites copying the same PTI/Reuters report)
        and assigns a common source_group_id so they do not count as independent sources.
        """
        for item in items:
            title = item.get("title", "")
            # Normalize title for syndication matching
            norm_title = re.sub(r'[^a-zA-Z0-9]', '', title.lower())[:40]
            if not norm_title:
                norm_title = item.get("domain", "group")
            # Create a group hash
            group_id = hashlib.md5(norm_title.encode()).hexdigest()[:8]
            item["source_group_id"] = f"grp_{group_id}"
            
        return items

source_ranker = SourceRanker()
