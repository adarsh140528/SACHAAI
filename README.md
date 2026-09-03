# SACHAI.AI — Evidence-Based AI Fact-Checking Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.11+](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![Next.js: 14](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-teal.svg)](https://fastapi.tiangolo.com/)
[![Database: PostgreSQL / SQLite](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20SQLite-3ECF8E.svg)](https://supabase.com/)

> **"Don't Just Believe It. Verify It."**  
> *SACHAI.AI does not ask "What does AI think?" — It asks "What does the verified evidence prove?"*

---

## 🌟 Core Product Principle

**AI does not decide what is true by itself. Evidence does.**

Large Language Models often hallucinate verdicts when asked to evaluate claims from ungrounded parametric memory. **SACHAI.AI** solves this by strictly separating natural language structural decomposition from deterministic truth aggregation:

1. **Retrieves verifiable primary records** from official gazettes, government portals, international bodies, and IFCN-certified fact-checkers.
2. **Ranks source reliability** across a strict 5-tier credibility hierarchy (from Official Primary at 1.0 to Social at 0.10).
3. **Clusters wire service reprints** so 10 syndicated copies of one report count as 1 independent source.
4. **Calculates verdicts deterministically** (`TRUE`, `FALSE`, `MISLEADING`, `PARTLY_TRUE`, `UNVERIFIED`, `OUTDATED`) along with Evidence Confidence (`HIGH`, `MEDIUM`, `LOW`).

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    User["User Ingestion (Text / Image / URL / WhatsApp Forward)"] --> AuthCheck["Auth Shield (JWT Token or X-API-KEY)"]
    AuthCheck --> Sec["Security Shield (SSRF Blocker & Magic Byte Check)"]
    Sec --> Pipe["Verification Pipeline"]
    
    subgraph Pipeline ["SACHAI 11-Stage Verification Pipeline"]
        Pipe --> Decomp["1. Claim Decomposition & Canonicalization"]
        Decomp --> Retr["2. Parallel Retrieval (FactCheck Tools + Serper Google)"]
        Retr --> Rank["3. 5-Tier Source Ranking & Syndication Clustering"]
        Rank --> Evid["4. Atomic Evidence Extraction & Stance Analysis"]
        Evid --> Eng["5. Deterministic Hybrid Verdict Engine"]
        Eng --> Exp["6. Gemini Vision / Multimodal Reasoning & Natural Explanation"]
    end
    
    Exp --> DB[("PostgreSQL / SQLite Database")]
    Exp --> UI["Next.js 14 Frontend + Interactive Evidence Graph & Developer Console"]
```

---

## ⚡ Multimodal Verification Capabilities

| Format | Features |
| :--- | :--- |
| **📝 Text Claims** | Factual statements, viral quotes, political announcements, statistical claims. |
| **🖼️ Image & Screenshots** | Magic-byte validated OCR (`PNG`, `JPEG`, `WEBP`) with Gemini Multimodal Vision forensic context extraction. |
| **💬 WhatsApp Forwards** | Strips forwarding noise and decomposes multi-claim forwards into atomic factual statements. |
| **🌐 News URLs & Articles** | SSRF-guarded scraper parses article body and verifies each embedded claim independently. |

---

## 🔒 Authentication & Developer Platform

SACHAI.AI features a complete developer ecosystem with dual-mode authentication:

### 1. User Authentication (JWT)
- Secure **Sign Up** (`/sign-up`) and **Sign In** (`/sign-in`) with salted password hashing.
- Unauthenticated users are strictly blocked from submitting claims or accessing pipeline resources.

### 2. Developer API Keys (`sach_live_...`)
- Authenticated developers can generate, view prefixes, track rate limits (60 req/min), and revoke custom API keys at `/developers`.
- Secure backend storage using SHA-256 key hashing and constant-time HMAC comparison.

### 3. Dual Authentication on API Endpoints
All API endpoints accept both headers:
- `X-API-KEY: sach_live_<token>` (for automated pipelines, bots, and external integrations)
- `Authorization: Bearer <jwt_or_key>` (for web applications)

---

## 💻 API Reference & Code Integration

### Endpoint: `POST /api/v1/checks`

#### Multi-Language Integration Snippets

<details>
<summary><b>cURL (Linux / macOS / Bash)</b></summary>

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/checks" \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: sach_live_your_key_here" \
  -d '{"input": "ISRO successfully launched Chandrayaan-3.", "input_type": "TEXT"}'
```
</details>

<details>
<summary><b>PowerShell (Windows)</b></summary>

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/checks" `
  -Method Post `
  -Headers @{ "Content-Type" = "application/json"; "X-API-KEY" = "sach_live_your_key_here" } `
  -Body '{"input": "ISRO successfully launched Chandrayaan-3.", "input_type": "TEXT"}'
```
</details>

<details>
<summary><b>Python</b></summary>

```python
import requests

API_URL = "http://127.0.0.1:8000/api/v1/checks"
API_KEY = "sach_live_your_key_here"

payload = {
    "input": "ISRO successfully launched Chandrayaan-3.",
    "input_type": "TEXT"
}

headers = {
    "Content-Type": "application/json",
    "X-API-KEY": API_KEY
}

response = requests.post(API_URL, json=payload, headers=headers)
data = response.json()

print("Overall Verdict:", data.get("overall_verdict"))
print("Confidence:", data.get("overall_confidence"))
print("Summary:", data.get("overall_summary"))
```
</details>

<details>
<summary><b>JavaScript / TypeScript (Fetch / Node.js 18+)</b></summary>

```javascript
async function verifyClaim(statement) {
  const response = await fetch("http://127.0.0.1:8000/api/v1/checks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "sach_live_your_key_here"
    },
    body: JSON.stringify({
      input: statement,
      input_type: "TEXT"
    })
  });

  const result = await response.json();
  console.log("Verdict:", result.overall_verdict);
  console.log("Confidence:", result.overall_confidence);
  return result;
}

verifyClaim("ISRO successfully launched Chandrayaan-3.");
```
</details>

<details>
<summary><b>Webhook / Express / Next.js Middleware</b></summary>

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userSubmittedText } = await req.json();

  const sachaiRes = await fetch("http://127.0.0.1:8000/api/v1/checks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": process.env.SACHAI_API_KEY!
    },
    body: JSON.stringify({
      input: userSubmittedText,
      input_type: "TEXT"
    })
  });

  const verification = await sachaiRes.json();
  const isMisinformation = verification.overall_verdict === "FALSE" || 
                           verification.overall_verdict === "MISLEADING";

  return NextResponse.json({
    status: isMisinformation ? "FLAGGED" : "APPROVED",
    verification
  });
}
```
</details>

---

## 📦 Project Structure

```text
SACHAAI/
├── backend/                        # FastAPI Backend Service
│   ├── app/
│   │   ├── api/routes/             # REST Endpoints (checks, auth, api_keys, uploads, saved, analytics, feedback)
│   │   ├── core/                   # Security shield, SSRF blocker, config, logging, JWT & API Key auth
│   │   ├── db/                     # Async session factory & SQLAlchemy models base
│   │   ├── models/                 # DB Models (Check, Claim, Evidence, Source, Verdict, User, ApiKey)
│   │   ├── providers/              # Gemini 3.5, Serper Google Search, FactCheck Tools
│   │   ├── schemas/                # Pydantic v2 request/response schemas
│   │   └── services/               # Pipeline, source ranker, verdict engine, OCR, scraper, cache
│   ├── evaluation/                 # Benchmark suite (200-sample dataset, runner, baseline comparison)
│   ├── requirements.txt            # Python dependencies
│   └── tests/                      # Pytest unit, integration & security test suites
├── frontend/                       # Next.js 14 App Router Web Application
│   ├── app/                        # Pages (/, /check/[id], /dashboard, /history, /developers, /sign-in, /sign-up)
│   ├── components/                 # ClaimChecker, EvidenceOrbit3D, Navbar, Footer, InputShowcase
│   ├── lib/                        # Design tokens, typed API client, utilities
│   ├── public/                     # Official brand logos (logo.png, logo-dark.png)
│   ├── package.json                # Frontend dependencies
│   └── tailwind.config.js          # Tailwind CSS theme configuration
├── docs/                           # Architectural & API documentation
│   ├── architecture.md             # Detailed Mermaid architectural diagrams
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
# Database (PostgreSQL or SQLite fallback)
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/sachai

# Security
SECRET_KEY=generate_a_secure_random_string_here

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
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
- Interactive Swagger API Documentation: **`http://127.0.0.1:8000/docs`**
- OpenAPI Specification: **`http://127.0.0.1:8000/openapi.json`**

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
# 1. Run all Unit, Integration & Security Tests
python -m pytest backend/tests -v

# 2. Run Evaluation Benchmark (Accuracy, Precision, Recall, Macro F1)
python backend/evaluation/run_evaluation.py

# 3. Run Comparative Baseline Benchmark
python backend/evaluation/baseline_comparison.py
```

---

## 🛡️ Security Features

- **SSRF Shield:** Blocks private subnets (RFC 1918), loopback (`127.0.0.1`), and cloud metadata IP (`169.254.169.254`).
- **Magic-Byte Validation:** Inspects binary file headers before image processing to prevent file upload exploits.
- **Prompt Injection Defense:** Untrusted web content is sanitized and enclosed in data-only XML boundaries.
- **Constant-Time Key Verification:** API keys are hashed with SHA-256 and compared using `hmac.compare_digest`.

---

## ⚖️ Responsible AI Disclaimer

> SACHAI.AI provides evidence-based verification using publicly available information. It does not generate or assume truth without verifiable citations. Results depend on the quality, availability, independence, and freshness of retrieved evidence. When reliable evidence is insufficient or conflicting, SACHAI.AI returns **UNVERIFIED**.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
