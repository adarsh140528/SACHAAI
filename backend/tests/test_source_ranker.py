import pytest
from backend.app.services.source_ranker import source_ranker

def test_source_ranking_tiers():
    # Tier 1 Official
    r1 = source_ranker.rank_source("https://rbi.org.in/scripts/BS_PressReleaseDisplay.aspx", "Reserve Bank of India")
    assert r1["source_tier"] == "TIER_1_OFFICIAL_PRIMARY"
    assert r1["reliability_score"] >= 0.95

    # Tier 1 Scientific
    r_sci = source_ranker.rank_source("https://www.nature.com/articles/s41586-024", "Nature")
    assert r_sci["source_tier"] == "TIER_1_SCIENTIFIC_PRIMARY"
    assert r_sci["reliability_score"] >= 0.95

    # Tier 2 Established News
    r2 = source_ranker.rank_source("https://www.reuters.com/world/india/news-article", "Reuters")
    assert r2["source_tier"] == "TIER_2_ESTABLISHED_NEWS"
    assert r2["reliability_score"] >= 0.85

    # Tier 3 Fact-Checker
    r3 = source_ranker.rank_source("https://www.altnews.in/fact-check-claim-viral", "AltNews")
    assert r3["source_tier"] == "TIER_3_FACT_CHECKER"
    assert r3["reliability_score"] >= 0.85

    # Tier 5 Social Media
    r5 = source_ranker.rank_source("https://twitter.com/user/status/123456", "Twitter")
    assert r5["source_tier"] == "TIER_5_SOCIAL_MEDIA"
    assert r5["reliability_score"] <= 0.25

def test_syndication_clustering():
    sources = [
        {"title": "RBI clarifies 2000 rupee notes status in new gazette", "domain": "siteA.com"},
        {"title": "RBI clarifies 2000 rupee notes status in new gazette", "domain": "siteB.com"},
        {"title": "Completely different reporting on currency", "domain": "siteC.com"},
    ]
    clustered = source_ranker.cluster_source_independence(sources)
    assert clustered[0]["source_group_id"] == clustered[1]["source_group_id"]
    assert clustered[0]["source_group_id"] != clustered[2]["source_group_id"]
