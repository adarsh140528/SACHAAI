import sys
import os

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

import json
import asyncio
from typing import Dict, Any, List
from collections import defaultdict

from backend.app.services.claim_extractor import claim_extractor_service
from backend.app.services.search_service import search_service
from backend.app.services.evidence_extractor import evidence_extractor_service
from backend.app.services.verdict_engine import verdict_engine
from backend.app.core.logging import logger

DATASET_PATH = os.path.join(os.path.dirname(__file__), "dataset.json")
RESULTS_PATH = os.path.join(os.path.dirname(__file__), "results.json")

CATEGORIES = ["TRUE", "FALSE", "MISLEADING", "PARTLY_TRUE", "UNVERIFIED", "OUTDATED"]

async def evaluate_single_sample(item: Dict[str, Any]) -> Dict[str, Any]:
    claim_text = item["claim"]
    expected = item["expected_verdict"]
    
    search_results = await search_service.execute_multi_query_search(claim_text)
    
    evidence_items = await evidence_extractor_service.extract_and_evaluate_evidence(
        claim_text=claim_text,
        search_results=search_results,
        fact_checks=[]
    )
    
    actual_verdict, confidence, metrics = verdict_engine.calculate_verdict(
        claim_text=claim_text,
        evidence_items=evidence_items,
        temporal_context=item.get("category", "Current")
    )
    
    return {
        "id": item["id"],
        "claim": claim_text,
        "expected": expected,
        "actual": actual_verdict,
        "confidence": confidence,
        "correct": (expected == actual_verdict),
        "evidence_count": len(evidence_items),
        "metrics": metrics
    }

async def run_evaluation(sample_limit: int = 12):
    logger.info(f"Loading evaluation dataset from {DATASET_PATH}...")
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        dataset = json.load(f)

    selected_samples = []
    category_counts = defaultdict(int)
    max_per_cat = max(2, sample_limit // len(CATEGORIES))

    for item in dataset:
        cat = item["category"]
        if category_counts[cat] < max_per_cat:
            selected_samples.append(item)
            category_counts[cat] += 1

    logger.info(f"Evaluating {len(selected_samples)} test claims across {len(CATEGORIES)} categories...")

    results = []
    for item in selected_samples:
        res = await evaluate_single_sample(item)
        results.append(res)
        status_sym = "[OK]" if res["correct"] else "[X] "
        print(f"{status_sym} #{res['id']:<3} Expected: {res['expected']:<12} Actual: {res['actual']:<12} | {res['claim'][:50]}...")

    total = len(results)
    correct = sum(1 for r in results if r["correct"])
    accuracy = (correct / total) * 100 if total > 0 else 0

    confusion_matrix = {c1: {c2: 0 for c2 in CATEGORIES} for c1 in CATEGORIES}
    tp = defaultdict(int)
    fp = defaultdict(int)
    fn = defaultdict(int)

    for r in results:
        exp = r["expected"]
        act = r["actual"]
        if exp in confusion_matrix and act in confusion_matrix[exp]:
            confusion_matrix[exp][act] += 1

        if exp == act:
            tp[exp] += 1
        else:
            fp[act] += 1
            fn[exp] += 1

    class_metrics = {}
    f1_scores = []
    for cat in CATEGORIES:
        prec = tp[cat] / (tp[cat] + fp[cat]) if (tp[cat] + fp[cat]) > 0 else 0.0
        rec = tp[cat] / (tp[cat] + fn[cat]) if (tp[cat] + fn[cat]) > 0 else 0.0
        f1 = (2 * prec * rec) / (prec + rec) if (prec + rec) > 0 else 0.0
        f1_scores.append(f1)
        class_metrics[cat] = {
            "precision": round(prec, 3),
            "recall": round(rec, 3),
            "f1_score": round(f1, 3),
            "support": tp[cat] + fn[cat]
        }

    macro_f1 = sum(f1_scores) / len(f1_scores) if f1_scores else 0.0

    eval_summary = {
        "dataset_name": "Development Evaluation Dataset",
        "total_evaluated": total,
        "total_correct": correct,
        "accuracy_pct": round(accuracy, 2),
        "macro_f1": round(macro_f1, 3),
        "class_metrics": class_metrics,
        "confusion_matrix": confusion_matrix,
        "results": results
    }

    with open(RESULTS_PATH, "w", encoding="utf-8") as f:
        json.dump(eval_summary, f, indent=2)

    print("\n" + "=" * 60)
    print("SACHAI.AI EVALUATION BENCHMARK REPORT")
    print("=" * 60)
    print(f"Total Samples Evaluated: {total}")
    print(f"Accuracy:                {accuracy:.2f}%")
    print(f"Macro F1 Score:          {macro_f1:.3f}")
    print("-" * 60)
    print(f"{'Category':<15} {'Precision':<10} {'Recall':<10} {'F1-Score':<10} {'Support':<8}")
    print("-" * 60)
    for cat, m in class_metrics.items():
        print(f"{cat:<15} {m['precision']:<10} {m['recall']:<10} {m['f1_score']:<10} {m['support']:<8}")
    print("=" * 60)

    return eval_summary

if __name__ == "__main__":
    asyncio.run(run_evaluation())
