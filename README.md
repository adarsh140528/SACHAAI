# SACHAI.AI — Evidence-Based AI Fact-Checking Engine

> **Don't Just Believe It. Verify It.**  
> *SACHAI.AI does not ask "What does AI think?" — It asks "What does the available evidence show?"*

---

## 🌟 Overview

**SACHAI.AI** is a full-stack, evidence-grounded AI verification platform. It verifies:
- **Text Claims & Viral Statements**
- **News Articles & Public URLs**
- **Screenshots, Infographics & Images (via Multimodal OCR)**
- **WhatsApp Multi-Claim Forwards**

Unlike standard LLM fact-checkers that hallucinate verdicts from ungrounded memory, SACHAI.AI retrieves verifiable records from primary gazettes and established news, ranks source reliability across 5 tiers, clusters syndicated reprints, extracts atomic evidence, and deterministically computes explainable verdicts (`TRUE`, `FALSE`, `MISLEADING`, `PARTLY_TRUE`, `UNVERIFIED`, `OUTDATED`) with measurable Evidence Confidence (`HIGH`, `MEDIUM`, `LOW`).

---

## 🏗️ Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Recharts, Interactive SVG Evidence Graph.
- **Backend:** Python 3.11, FastAPI, Pydantic v2, Async HTTP (`httpx`), SQLAlchemy 2.0 (Dual Supabase / SQLite support).
- **AI & Retrieval:** Google Gemini 1.5/2.0 Flash / Pro, Google Fact Check Tools API, Zero-Config DuckDuckGo Live Search / Tavily / Serper.
- **Security:** SSRF IP/DNS Shield, Magic-Byte File Validation, Prompt Injection Isolation, Constant-Time HMAC API Key Hashing.

---

## 🚀 Quick Start (Local Setup)

### 1. Clone & Configure Environment
```bash
git clone https://github.com/adarsh140528/SACHAAI.git
cd SACHAAI

# Copy example environment variables
cp .env.example .env
```

### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Run backend API server
uvicorn backend.app.main:app --reload --port 8000
```
API Documentation will be available at: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend

# Install Node dependencies
npm install

# Start Next.js development server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🧪 Testing & Evaluation

### Run Test Suite
```bash
python -m pytest backend/tests -v
```

### Run Benchmark Evaluation
```bash
python backend/evaluation/run_evaluation.py
```

### Run Baseline Comparison (Gemini Only vs SACHAI Architecture)
```bash
python backend/evaluation/baseline_comparison.py
```

---

## 📖 In-Depth Documentation

- [System Architecture](docs/architecture.md)
- [Verification Pipeline](docs/verification-pipeline.md)
- [REST API Reference](docs/api.md)
- [Security Architecture](docs/security.md)
- [Evaluation & Benchmarks](docs/evaluation.md)

---

## ⚖️ Responsible AI Disclaimer

> SACHAI.AI provides evidence-based verification using publicly available information. It does not guarantee absolute truth. Results depend on the quality, availability, independence, and freshness of retrieved evidence. When reliable evidence is insufficient or conflicting, SACHAI.AI returns **UNVERIFIED**.

---

## 📄 License
MIT License.
