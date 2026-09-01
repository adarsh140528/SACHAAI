import pytest
from backend.app.services.verdict_engine import verdict_engine

def test_verdict_engine_strong_contradiction_returns_false():
    evidence = [
        {
            "source": {"publisher_name": "Reserve Bank of India", "source_tier": "TIER_1_OFFICIAL_PRIMARY", "source_group_id": "grp_rbi"},
            "relationship": "CONTRADICTS",
            "relevance_score": 0.95,
            "source_reliability": 1.00,
        },
        {
            "source": {"publisher_name": "Reuters Fact Check", "source_tier": "TIER_3_FACT_CHECKER", "source_group_id": "grp_reuters"},
            "relationship": "CONTRADICTS",
            "relevance_score": 0.90,
            "source_reliability": 0.85,
        }
    ]
    verdict, confidence, metrics = verdict_engine.calculate_verdict("India completely banned UPI transactions after 10 PM", evidence)
    assert verdict == "FALSE"
    assert confidence == "HIGH"
    assert metrics["contradicting_sources"] == 2

def test_verdict_engine_strong_support_returns_true():
    evidence = [
        {
            "source": {"publisher_name": "ISRO Official", "source_tier": "TIER_1_OFFICIAL_PRIMARY", "source_group_id": "grp_isro"},
            "relationship": "SUPPORTS",
            "relevance_score": 0.95,
            "source_reliability": 1.00,
        },
        {
            "source": {"publisher_name": "The Hindu", "source_tier": "TIER_2_ESTABLISHED_NEWS", "source_group_id": "grp_thehindu"},
            "relationship": "SUPPORTS",
            "relevance_score": 0.90,
            "source_reliability": 0.85,
        }
    ]
    verdict, confidence, metrics = verdict_engine.calculate_verdict("ISRO launched Chandrayaan-3 mission", evidence)
    assert verdict == "TRUE"
    assert confidence == "HIGH"
    assert metrics["supporting_sources"] == 2

def test_verdict_engine_insufficient_evidence_returns_unverified():
    evidence = [
        {
            "source": {"publisher_name": "Unknown Blog", "source_tier": "TIER_4_GENERAL_WEBSITE", "source_group_id": "grp_blog"},
            "relationship": "INSUFFICIENT",
            "relevance_score": 0.30,
            "source_reliability": 0.20,
        }
    ]
    verdict, confidence, metrics = verdict_engine.calculate_verdict("Aliens visited Mumbai last night", evidence)
    assert verdict == "UNVERIFIED"
    assert confidence == "LOW"
