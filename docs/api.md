# SACHAI.AI — REST API Documentation

Base URL: `http://localhost:8000/api/v1`

---

## Authentication

All protected endpoints accept either:
1. Session JWT: `Authorization: Bearer <token>`
2. Developer API Key: `X-API-KEY: sach_live_<secret>`

---

## Verification Endpoints

### 1. Submit Claim for Verification
- **Method:** `POST /api/v1/checks` (or `/api/v1/check`)
- **Body:**
```json
{
  "input": "India has completely banned UPI transactions after 10 PM.",
  "input_type": "TEXT"
}
```
- **Response:**
```json
{
  "check_id": "9a12e8b4-5f12-4a7b-8c9d-e1f2a3b4c5d6",
  "status": "COMPLETED",
  "input_type": "TEXT",
  "raw_input": "India has completely banned UPI transactions after 10 PM.",
  "overall_verdict": "FALSE",
  "overall_confidence": "HIGH",
  "overall_summary": "The submitted claim is verified as FALSE...",
  "processing_time_ms": 1420.5,
  "claims": [
    {
      "claim_id": "...",
      "claim_text": "India has completely banned UPI transactions after 10 PM.",
      "verdict": {
        "verdict": "FALSE",
        "confidence": "HIGH",
        "reasoning": "..."
      },
      "evidence": [
        {
          "publisher": "National Payments Corporation of India",
          "domain": "npci.org.in",
          "source_type": "TIER_1_OFFICIAL_PRIMARY",
          "reliability_score": 1.0,
          "relationship": "CONTRADICTS",
          "evidence_text": "NPCI clarifies that UPI infrastructure operates 24/7.",
          "url": "https://www.npci.org.in"
        }
      ]
    }
  ]
}
```

### 2. Get Verification Result by ID
- **Method:** `GET /api/v1/checks/{id}`

### 3. List Verification History
- **Method:** `GET /api/v1/checks?page=1&limit=10&verdict=FALSE`

---

## File Uploads & OCR

### Upload Image for OCR
- **Method:** `POST /api/v1/uploads`
- **Body:** `multipart/form-data` with `file`
- **Supported Formats:** PNG, JPG, JPEG, WEBP (Max 10MB)

---

## Developer API Key Endpoints

### Create API Key
- **Method:** `POST /api/v1/api-keys`
- **Body:** `{"name": "Production Bot", "rate_limit_rpm": 60}`

### List API Keys
- **Method:** `GET /api/v1/api-keys`

### Revoke API Key
- **Method:** `DELETE /api/v1/api-keys/{id}`

---

## System Health
- **Method:** `GET /health`
