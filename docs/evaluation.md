# SACHAI.AI — Evaluation & Benchmark Methodology

---

## Evaluation Dataset

The evaluation suite utilizes the **Development Evaluation Dataset** (`backend/evaluation/dataset.json`), containing 200 labeled real-world test claims across 6 classifications:
- **50 TRUE**
- **50 FALSE**
- **25 MISLEADING**
- **25 PARTLY_TRUE**
- **25 UNVERIFIED**
- **25 OUTDATED**

---

## Benchmark Execution

To execute the automated evaluation runner:
```bash
python backend/evaluation/run_evaluation.py
```

### Metrics Measured
- **Accuracy:** Percentage of exact verdict matches across all test samples.
- **Precision, Recall, F1 Score:** Calculated per category.
- **Confusion Matrix:** Measures cross-category misclassifications.

---

## Baseline Comparison Architecture

To compare SACHAI.AI against alternative architectures:
```bash
python backend/evaluation/baseline_comparison.py
```

### Evaluated Models
1. **Baseline A (Gemini Only):** LLM generation with zero retrieved context (high hallucination rate).
2. **Baseline B (Gemini + Raw Search):** LLM with unranked web snippets (vulnerable to SEO spam).
3. **Baseline C (Gemini + FactCheck + Search):** Fact checks and raw search without deterministic scoring.
4. **SACHAI Full Architecture:** 5-tier source ranking, syndication clustering, and deterministic hybrid verdict engine.
