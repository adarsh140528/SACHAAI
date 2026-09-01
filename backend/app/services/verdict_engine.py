from typing import List, Dict, Any, Tuple
from backend.app.core.logging import logger

class VerdictEngine:
    """
    Hybrid Deterministic Verdict Engine.
    
    CRITICAL PRODUCT PRINCIPLE:
    Gemini determines atomic evidence relationships (SUPPORTS, CONTRADICTS, etc.),
    while this deterministic backend engine aggregates those scores using mathematical
    and logical rules to produce verifiable, reproducible verdicts and confidence tiers.
    """
    def calculate_verdict(
        self,
        claim_text: str,
        evidence_items: List[Dict[str, Any]],
        temporal_context: str = "Current"
    ) -> Tuple[str, str, Dict[str, Any]]:
        logger.info(f"Computing deterministic verdict for claim over {len(evidence_items)} evidence items...")

        supporting_weight = 0.0
        contradicting_weight = 0.0
        partially_supporting_weight = 0.0
        partially_contradicting_weight = 0.0
        
        supporting_sources = 0
        contradicting_sources = 0
        
        independent_groups = set()
        highest_source_tier = 0.0

        for item in evidence_items:
            rel = item.get("relationship", "INSUFFICIENT")
            if rel == "IRRELEVANT":
                continue

            rel_score = float(item.get("relevance_score", 0.7))
            src_score = float(item.get("source_reliability", 0.4))
            weighted_val = rel_score * src_score

            highest_source_tier = max(highest_source_tier, src_score)
            grp = item.get("source", {}).get("source_group_id")
            if grp:
                independent_groups.add(grp)

            if rel == "SUPPORTS":
                supporting_weight += weighted_val
                supporting_sources += 1
            elif rel == "CONTRADICTS":
                contradicting_weight += weighted_val
                contradicting_sources += 1
            elif rel == "PARTIALLY_SUPPORTS":
                partially_supporting_weight += weighted_val
            elif rel == "PARTIALLY_CONTRADICTS":
                partially_contradicting_weight += weighted_val

        metrics = {
            "supporting_sources": supporting_sources,
            "contradicting_sources": contradicting_sources,
            "supporting_weight": round(supporting_weight, 2),
            "contradicting_weight": round(contradicting_weight, 2),
            "independent_groups_count": len(independent_groups),
            "highest_source_tier": round(highest_source_tier, 2),
            "total_evaluated_evidence": len(evidence_items),
        }

        # 1. Check for OUTDATED temporal status
        if "outdated" in claim_text.lower() or "previously" in temporal_context.lower():
            if supporting_weight > 0.6 and contradicting_weight > 0.6:
                return "OUTDATED", self._calculate_confidence(metrics), metrics

        # 2. Rule Evaluation
        # Strong reliable evidence contradicts claim
        if contradicting_weight >= 1.2 or (contradicting_weight >= 0.8 and contradicting_sources >= 2):
            if supporting_weight < 0.4:
                return "FALSE", self._calculate_confidence(metrics), metrics
            elif supporting_weight >= 0.4:
                return "PARTLY_TRUE", self._calculate_confidence(metrics), metrics

        # Strong reliable evidence supports claim
        if supporting_weight >= 1.2 or (supporting_weight >= 0.8 and supporting_sources >= 2):
            if contradicting_weight < 0.4:
                return "TRUE", self._calculate_confidence(metrics), metrics
            elif contradicting_weight >= 0.4:
                return "PARTLY_TRUE", self._calculate_confidence(metrics), metrics

        # Misleading / Partial True
        if partially_contradicting_weight > 0.5 or (supporting_weight > 0.3 and contradicting_weight > 0.3):
            return "MISLEADING", self._calculate_confidence(metrics), metrics
            
        if partially_supporting_weight > 0.5:
            return "PARTLY_TRUE", self._calculate_confidence(metrics), metrics

        # Moderate single-source contradictions or supports
        if contradicting_weight >= 0.7:
            return "FALSE", "MEDIUM", metrics
        if supporting_weight >= 0.7:
            return "TRUE", "MEDIUM", metrics

        # Insufficient reliable evidence
        return "UNVERIFIED", "LOW", metrics

    def _calculate_confidence(self, metrics: Dict[str, Any]) -> str:
        highest_tier = metrics.get("highest_source_tier", 0.0)
        groups = metrics.get("independent_groups_count", 0)
        total_weight = metrics.get("supporting_weight", 0.0) + metrics.get("contradicting_weight", 0.0)

        if highest_tier >= 0.85 and groups >= 2 and total_weight >= 1.4:
            return "HIGH"
        elif highest_tier >= 0.70 and total_weight >= 0.8:
            return "MEDIUM"
        else:
            return "LOW"

verdict_engine = VerdictEngine()
