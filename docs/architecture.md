# SACHAI.AI — System Architecture & Design Specification

> **Product Principle:** *AI does not decide what is true by itself. Evidence does.*

---

## 1. System Architecture Diagram

```mermaid
flowchart TB
    subgraph Client["Frontend Layer (Next.js 14 + Tailwind + Lucide)"]
        UI["Landing & Verification Interface"]
        ResultUI["Evidence & Verdict Explorer"]
        GraphUI["Interactive Evidence Graph"]
        DashUI["Dashboard & Analytics (Recharts)"]
        DevUI["Developer Console & API Docs"]
        AuthUI["Auth Pages (Sign In / Sign Up)"]
    end

    subgraph API_Gateway["FastAPI Gateway & Security Layer"]
        Router["FastAPI Central Router"]
        RateLimit["Rate Limiter & API Key Middleware"]
        AuthMid["JWT & Session Auth Manager"]
        SSRF["SSRF Guard & URL Fetch Validator"]
        InputVal["MIME & Magic Byte File Validator"]
    end

    subgraph Pipeline["Multi-Stage Verification Pipeline"]
        InputProc["1. Input Classifier & Normalizer"]
        OCR_Vision["2. Multimodal OCR & Vision Service"]
        ClaimExt["3. Factual Claim Extraction & Decomposition"]
        FactCheckRet["4. Google Fact Check Tools API Client"]
        SearchOrch["5. Multi-Query Search Orchestrator"]
        SourceRank["6. Tiered Source Reliability Ranker"]
        IndepEngine["7. Source Independence & Deduplication"]
        EvidExt["8. Atomic Evidence Extractor"]
        EvidComp["9. Evidence Comparison & Relationship Reasoner"]
        VerdictEng["10. Deterministic Hybrid Verdict Engine"]
        ExpGen["11. Explainable Reasoning Generator"]
    end

    subgraph External_Providers["External Provider & AI Layer"]
        GeminiFlash["Google Gemini 1.5/2.0 Flash / Pro (LLM & Vision)"]
        GoogleFactCheck["Google Fact Check Tools API"]
        SearchEngines["Web Search Providers (DuckDuckGo / Tavily / Serper)"]
    end

    subgraph Storage_Layer["Persistence & Caching Layer"]
        DB[(PostgreSQL / SQLite Storage)]
        Cache[(Redis / In-Memory State & Caching)]
        FileStore["S3-Compatible / Local Secure Storage"]
    end

    UI --> Router
    ResultUI --> Router
    DashUI --> Router
    DevUI --> Router

    Router --> RateLimit --> AuthMid --> Pipeline
    Pipeline --> OCR_Vision --> GeminiFlash
    Pipeline --> ClaimExt --> GeminiFlash
    Pipeline --> FactCheckRet --> GoogleFactCheck
    Pipeline --> SearchOrch --> SearchEngines
    Pipeline --> EvidComp --> GeminiFlash
    Pipeline --> VerdictEng --> Storage_Layer
    Pipeline --> ExpGen --> Storage_Layer
    Router --> Storage_Layer
```

---

## 2. End-to-End Data Flow Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Client
    participant Web as Next.js Frontend
    participant API as FastAPI Backend
    participant Pipe as Verification Pipeline
    participant Ext as Search & FactCheck Providers
    participant AI as Gemini Reasoning Engine
    participant DB as Database / Cache

    User->>Web: Submit claim / URL / Image / WhatsApp screenshot
    Web->>API: POST /api/v1/checks {input, type, options}
    API->>DB: Create Check record (Status: QUEUED)
    API-->>Web: Return {check_id, status: "PROCESSING"}
    
    rect rgb(240, 248, 255)
        note over Pipe: Asynchronous / Streaming Processing
        API->>Pipe: Run verification worker
        alt Input is Image / WhatsApp
            Pipe->>AI: Multimodal OCR & Context Extraction
        else Input is URL
            Pipe->>Pipe: SSRF-Safe Article Extraction
        end
        Pipe->>AI: Extract atomic factual claims & canonical representation
        Pipe->>Ext: Search Google Fact Check Tools API
        Pipe->>Ext: Generate 4-5 multi-angle search queries & execute Web Search
        Pipe->>Pipe: Rank sources (Tier 1-5) & cluster syndicated reprints
        Pipe->>AI: Extract precise relevant snippets with relationships (SUPPORTS/CONTRADICTS)
        Pipe->>Pipe: Deterministic rule aggregation & confidence calculation
        Pipe->>AI: Generate structured, transparent explanation
        Pipe->>DB: Persist Claims, Evidence, Sources, Verdict & Graph Nodes
    end

    Web->>API: GET /api/v1/checks/{check_id}
    API->>DB: Read verified record
    API-->>Web: Complete Verification Payload
    Web->>User: Render Verdict, Confidence, Evidence Cards & Evidence Graph
```

---

## 3. Verification Pipeline Diagram

```mermaid
flowchart TD
    A["Raw User Input (Text, Image, URL, WhatsApp Forward)"] --> B["Input Sanitization & Classification"]
    B --> C{"Input Type?"}
    C -->|Image / Screenshot| D["Vision & OCR Service (PIL + Gemini Vision)"]
    C -->|URL| E["SSRF-Protected Scraper (HTML Parser)"]
    C -->|Text / Claim| F["Text Normalization"]
    
    D --> G["Extracted Raw Content"]
    E --> G
    F --> G
    
    G --> H["Claim Extraction & Decomposition (Gemini)"]
    H --> I["Canonical Structured Claims (Subject-Predicate-Object, Temporal Context)"]
    
    I --> J["Parallel Fact-Check Search (Google Fact Check API)"]
    I --> K["Multi-Query Query Generator (Exact, Paraphrased, Primary Source, FactCheck)"]
    K --> L["Parallel Web Search (Multi-Provider Abstraction)"]
    
    J & L --> M["Raw Candidate Source & Snippet Pool"]
    M --> N["Source Reliability Classifier (Tiers 1-5: Primary, News, Fact-Checker, General, Social)"]
    N --> O["Source Independence & Syndication Grouper"]
    O --> P["Atomic Evidence Extraction & Relevance Filter"]
    
    P --> Q["Claim ↔ Evidence Relationship Reasoner (Gemini: SUPPORTS, CONTRADICTS, etc.)"]
    Q --> R["Deterministic Hybrid Verdict Engine (Strict Logic Rules)"]
    R --> S["Evidence Confidence Calculator (Source Quality + Agreement + Freshness)"]
    S --> T["Transparent Explanation Generator"]
    T --> U["Final Explainable Result & Interactive Evidence Graph"]
```

---

## 4. Database ER Diagram

```mermaid
erDiagram
    USERS ||--o{ CHECKS : creates
    USERS ||--o{ API_KEYS : owns
    USERS ||--o{ SAVED_CHECKS : saves
    CHECKS ||--|{ CLAIMS : contains
    CHECKS ||--o{ UPLOADS : attaches
    CLAIMS ||--o{ EVIDENCE : yields
    EVIDENCE }|--|| SOURCES : cites
    CLAIMS ||--|| VERDICTS : produces
    CHECKS ||--o{ FACT_CHECKS : retrieves
    USERS ||--o{ USAGE_EVENTS : logs

    USERS {
        uuid id PK
        string email UK
        string password_hash
        string full_name
        string role
        timestamp created_at
    }

    CHECKS {
        uuid id PK
        uuid user_id FK
        string input_type
        text raw_input
        string status
        float processing_time_ms
        string overall_verdict
        string overall_confidence
        text overall_summary
        timestamp created_at
    }

    CLAIMS {
        uuid id PK
        uuid check_id FK
        text claim_text
        json canonical_data
        string claim_type
        string claim_time
        timestamp created_at
    }

    SOURCES {
        uuid id PK
        string domain
        string publisher_name
        string source_tier
        float reliability_score
        string source_group_id
        timestamp created_at
    }

    EVIDENCE {
        uuid id PK
        uuid claim_id FK
        uuid source_id FK
        text evidence_text
        string relationship
        float relevance_score
        string publication_date
        string freshness_category
        string url
        timestamp created_at
    }

    VERDICTS {
        uuid id PK
        uuid claim_id FK
        string verdict
        string confidence
        text reasoning
        json evidence_metrics
        timestamp created_at
    }

    FACT_CHECKS {
        uuid id PK
        uuid check_id FK
        string publisher
        text reviewed_claim
        string review_url
        string rating
        string review_date
    }

    API_KEYS {
        uuid id PK
        uuid user_id FK
        string key_hash UK
        string key_prefix
        string name
        int rate_limit_rpm
        timestamp created_at
        timestamp last_used_at
    }

    SAVED_CHECKS {
        uuid id PK
        uuid user_id FK
        uuid check_id FK
        text notes
        timestamp saved_at
    }
```

---

## 5. API Architecture and Endpoint Map

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/sign-up` | Register new user account | No |
| `POST` | `/api/v1/auth/sign-in` | Authenticate user & return JWT token | No |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile | Yes (JWT) |
| `POST` | `/api/v1/checks` | Submit claim/URL/Image for verification | Optional |
| `GET` | `/api/v1/checks/{id}` | Retrieve real-time status & full result | No (Public or Owner) |
| `GET` | `/api/v1/checks` | Paginated check history with filters | Yes (JWT) |
| `DELETE` | `/api/v1/checks/{id}` | Delete check from history | Yes (JWT) |
| `POST` | `/api/v1/uploads` | Upload image for OCR/vision verification | Optional |
| `POST` | `/api/v1/saved` | Save / bookmark a verification result | Yes (JWT) |
| `GET` | `/api/v1/saved` | List saved verification results | Yes (JWT) |
| `GET` | `/api/v1/analytics` | Dashboard metrics & verdict breakdown | Yes (JWT) |
| `POST` | `/api/v1/api-keys` | Generate new developer API key | Yes (JWT) |
| `GET` | `/api/v1/api-keys` | List active developer API keys | Yes (JWT) |
| `DELETE` | `/api/v1/api-keys/{id}` | Revoke developer API key | Yes (JWT) |
| `POST` | `/api/v1/feedback` | Submit user feedback (👍/👎) on verdict | No |
| `GET` | `/health` | System health check (DB, AI, Search status) | No |

---

## 6. Frontend / Backend / Service Architecture

```text
c:\Users\Adarsh\Downloads\SACHAAI/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/ (config.py, security.py, logging.py)
│   │   ├── db/ (session.py, base.py)
│   │   ├── models/ (user, check, claim, source, evidence, verdict, fact_check, api_key, saved_check, feedback)
│   │   ├── schemas/ (check, auth, api_key, feedback)
│   │   ├── providers/ (gemini_provider, search_provider, factcheck_provider)
│   │   ├── services/ (input_classifier, ocr_service, url_extractor, claim_extractor, factcheck_service, search_service, source_ranker, evidence_extractor, verdict_engine, explanation_service, pipeline)
│   │   └── api/routes/ (auth, checks, uploads, history, saved, analytics, api_keys, feedback, demo)
│   ├── evaluation/ (dataset.json, run_evaluation.py, baseline_comparison.py)
│   ├── tests/ (unit, integration, security)
│   └── requirements.txt
├── frontend/
│   ├── app/ (page, check/[id], dashboard, history, saved, developers, changelog, sign-in, sign-up, demo)
│   ├── components/ (checker, verdict, evidence, graph, dashboard, layout, ui)
│   ├── lib/ (api, auth, utils)
│   ├── types/
│   └── package.json
└── docs/ (architecture, verification-pipeline, api, security, evaluation)
```

---

## 7. AI + Web Search + Fact Check API Integration Architecture

```mermaid
flowchart LR
    subgraph Claim_Normalization
        C[Canonical Claim]
    end

    subgraph FactCheck_Retrieval
        FC[Google Fact Check Tools API]
        FCR[Existing Fact-Check Reviews]
    end

    subgraph Search_Retrieval
        SQ[Multi-Query Generator<br/>Exact, Paraphrased, Primary, FactCheck]
        SP[Search Providers<br/>DuckDuckGo / Tavily / Serper]
        SR[Ranked Candidate Web Sources]
    end

    subgraph Gemini_Reasoning
        EE[Atomic Evidence Extractor]
        ER[Relationship Reasoner<br/>SUPPORTS / CONTRADICTS / IRRELEVANT]
    end

    subgraph Deterministic_Verdict
        VE[Deterministic Aggregator]
        OUT[Verdict + Confidence + Graph]
    end

    C --> FC --> FCR --> EE
    C --> SQ --> SP --> SR --> EE
    EE --> ER --> VE --> OUT
```

---

## 8. Security Architecture

```mermaid
flowchart TD
    Req["Incoming Request / URL / File Upload"] --> G1["1. Network Level: Rate Limiter (Token Bucket / Redis)"]
    G1 --> G2["2. SSRF Shield: Socket DNS Resolver + Private IP Blacklist (RFC1918, 169.254.169.254)"]
    G2 --> G3["3. File Guard: Magic Bytes + MIME Validation (PNG/JPG/WEBP only, Max 10MB)"]
    G3 --> G4["4. Auth Guard: Constant-Time Key Hashing (SHA-256) + JWT Verification"]
    G4 --> G5["5. Prompt Injection Barrier: Untrusted Snippet Sanitizer & Enclosing XML Sandbox"]
    G5 --> Core["FastAPI Core Pipeline & Gemini Engine"]
```

---

## 9. Deployment Architecture

```mermaid
flowchart TD
    subgraph ClientEdge["Frontend Hosting (Vercel / Cloudflare Edge)"]
        FE["Next.js 14 Production App (HTTPS)"]
    end

    subgraph BackendCloud["API Hosting (Docker Container / Cloud Run)"]
        BE["FastAPI ASGI Cluster (Uvicorn Workers)"]
        Worker["Async Verification Pipeline Worker"]
    end

    subgraph DataCloud["Managed Data Services"]
        PG[(PostgreSQL / Supabase Database)]
        RD[(Redis Cache / State)]
        S3[(S3-Compatible Object Store)]
    end

    FE -->|REST API / SSE| BE
    BE --> PG
    BE --> RD
    BE --> S3
    Worker --> PG
```

---

## 10. Error / Fallback Architecture

| Failure Scenario | Automatic Resilient Behavior | User-Facing Result |
|---|---|---|
| **Gemini API Key Missing / 429** | Graceful fallback response informing administrator. | `AI verification service temporarily unavailable.` |
| **Search Provider Outage / Key Missing** | Immediate fallback to zero-key DuckDuckGo live search. | Real evidence retrieved seamlessly with transparent sources. |
| **Google Fact Check API Unavailable** | Seamlessly skips existing checks and executes direct multi-query web search. | `Fact-check service unavailable. Proceeding with web sources.` |
| **Insufficient Reliable Evidence** | Deterministic rule prevents speculative guessing. | `UNVERIFIED — We could not retrieve enough reliable evidence.` |
| **Paywalled / Blocked URL** | Safe SSRF scraper fails gracefully without fabricating text. | `Unable to retrieve article content. Please paste the article text.` |
| **PostgreSQL Unreachable** | Automatic fallback to local SQLite database in development mode. | Zero setup local development without crashes. |
