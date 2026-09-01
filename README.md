# SACHAI.AI — Evidence-Based AI Fact-Checking Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.11+](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![Next.js: 14](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-teal.svg)](https://fastapi.tiangolo.com/)
[![Database: Supabase PostgreSQL](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E.svg)](https://supabase.com/)

> **"Don't Just Believe It. Verify It."**  
> *SACHAI.AI does not ask "What does AI think?" — It asks "What does the verified evidence prove?"*

---

## 🌟 Core Product Principle

**AI does not decide what is true by itself. Evidence does.**

Large Language Models often hallucinate verdicts when asked to evaluate claims from ungrounded memory. **SACHAI.AI** solves this by strictly separating natural language structural extraction from deterministic truth aggregation:

1. **Retrieves verifiable primary records** from official gazettes, government portals, international bodies, and IFCN-certified fact-checkers.
2. **Ranks source reliability** across a strict 5-tier credibility hierarchy (from Official Primary at 1.0 to Social at 0.10).
3. **Clusters wire service reprints** so 10 syndicated copies of one report count as 1 independent source.
4. **Calculates verdicts deterministically** (`TRUE`, `FALSE`, `MISLEADING`, `PARTLY_TRUE`, `UNVERIFIED`, `OUTDATED`) along with Evidence Confidence (`HIGH`, `MEDIUM`, `LOW`).

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    User["User Ingestion (Text / Image / URL / WhatsApp Forward)"] --> Sec["Security Shield (SSRF & Magic Byte Check)"]
    Sec --> Pipe["Verification Pipeline"]
    
    subgraph Pipeline ["SACHAI 11-Stage Verification Pipeline"]
        Pipe --> Decomp["1. Claim Decomposition & Canonicalization"]
        Decomp --> Retr["2. Parallel Retrieval (FactCheck Tools + Serper Google)"]
        Retr --> Rank["3. 5-Tier Source Ranking & Syndication Clustering"]
        Rank --> Evid["4. Atomic Evidence Extraction & Stance Analysis"]
        Evid --> Eng["5. Deterministic Hybrid Verdict Engine"]
        Eng --> Exp["6. Gemini 3.5 Flash Natural Explanation"]
    end
    
    Exp --> DB[("Supabase Cloud PostgreSQL Database")]
    Exp --> UI["Next.js 14 Frontend + Interactive Evidence Graph"]
```

---

## ⚡ Multimodal Verification Capabilities

| Format | Features |
| :--- | :--- |
| **📝 Text Claims** | Factual statements, viral quotes, political announcements, statistics. |
| **🖼️ Image & Screenshots** | Magic-byte validated OCR (`PNG`, `JPEG`, `WEBP`) with Gemini Multimodal Vision forensic context extraction. |
| **💬 WhatsApp Forwards** | Strips forwarding noise and decomposes multi-claim forwards into atomic factual statements. |
| **🌐 News URLs & Articles** | SSRF-guarded scraper parses article body and verifies each embedded claim independently. |

---

## 📦 Project Structure

```text
SACHAAI/
├── backend/                        # FastAPI Backend Service
│   ├── app/
│   │   ├── api/routes/             # REST Endpoints (checks, auth, uploads, saved, analytics, keys, demo)
│   │   ├── core/                   # Security shield, SSRF blocker, config, logging
│   │   ├── db/                     # Supabase asyncpg session factory & models base
│   │   ├── models/                 # SQLAlchemy schema models (Check, Claim, Evidence, Source, Verdict, User)
│   │   ├── providers/              # Gemini 3.5, Serper Google Search, FactCheck Tools
│   │   ├── schemas/                # Pydantic v2 validation schemas
│   │   └── services/               # Pipeline, source ranker, verdict engine, OCR, scraper, cache
│   ├── evaluation/                 # Benchmark suite (200-sample dataset, runner, baseline comparison)
│   ├── requirements.txt            # Python dependencies
│   └── tests/                      # Pytest unit, integration & security test suites
├── frontend/                       # Next.js 14 Web Application
│   ├── app/                        # App Router pages (/, /check/[id], /dashboard, /history, /developers, /demo)
│   ├── components/                 # ClaimChecker, EvidenceGraph SVG, UI elements
│   ├── lib/                        # Design tokens, API client, utilities
│   ├── package.json                # Frontend dependencies
│   └── tailwind.config.js          # Tailwind CSS theme
├── docs/                           # In-depth architectural & API documentation
│   ├── architecture.md             # 10 Mermaid architectural diagrams
│   ├── verification-pipeline.md    # 11-stage pipeline specification
│   ├── api.md                      # REST API Reference
│   ├── security.md                 # Security safeguards & SSRF shield
│   └── evaluation.md               # Benchmark methodology
├── LICENSE                         # MIT License
├── pytest.ini                      # Pytest configuration
└── README.md                       # Master Documentation
```

---

## 🚀 Quick Start Guide

### 1. Clone Repository & Setup Environment
```bash
git clone https://github.com/adarsh140528/SACHAAI.git
cd SACHAAI

# Copy example environment variables
cp .env.example .env
```

Configure your credentials in `.env`:
```env
# Database (Supabase Cloud PostgreSQL)
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# AI & Search Providers
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_FACT_CHECK_API_KEY=your_factcheck_api_key
SEARCH_PROVIDER=serper
SEARCH_API_KEY=your_serper_api_key
```

### 2. Run Backend API Server
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Start backend with live reload
uvicorn backend.app.main:app --reload --port 8000
```
Interactive API documentation: `http://localhost:8000/docs`

### 3. Run Frontend Web UI
```bash
cd frontend

# Install Node dependencies
npm install

# Start Next.js development server
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🧪 Testing & Benchmark Evaluation

```bash
# 1. Run all Unit, Integration & Security Tests (18 tests passing)
python -m pytest backend/tests -v

# 2. Run Evaluation Benchmark (Accuracy, Precision, Recall, Macro F1)
python backend/evaluation/run_evaluation.py

# 3. Run Comparative Baseline Benchmark
python backend/evaluation/baseline_comparison.py
```

---

## 🛡️ Security Features

- **SSRF Shield:** Blocks private subnets (RFC 1918), loopback (`127.0.0.1`), and cloud metadata (`169.254.169.254`).
- **Magic-Byte Validation:** Inspects binary file headers before image processing.
- **Prompt Injection Defense:** Untrusted web text is sanitized and enclosed in data-only XML boundaries.
- **Constant-Time Key Hashing:** API keys are hashed with SHA-256 and verified using `hmac.compare_digest`.

---

## ⚖️ Responsible AI Disclaimer

> SACHAI.AI provides evidence-based verification using publicly available information. It does not guarantee absolute truth. Results depend on the quality, availability, independence, and freshness of retrieved evidence. When reliable evidence is insufficient or conflicting, SACHAI.AI returns **UNVERIFIED**.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
