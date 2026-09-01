from typing import List, Dict, Any
from fastapi import APIRouter

router = APIRouter(prefix="/demo", tags=["Demo Suite"])

DEMO_DATASETS: List[Dict[str, Any]] = [
    {
        "demo_id": "demo-true-chandrayaan3",
        "title": "ISRO Chandrayaan-3 Touchdown",
        "category": "TRUE",
        "input_type": "TEXT",
        "raw_input": "ISRO successfully achieved a soft landing of the Chandrayaan-3 Vikram lander near the south pole of the Moon.",
        "verdict": "TRUE",
        "confidence": "HIGH",
        "summary": "The submitted claim is confirmed as TRUE. Official announcements from the Indian Space Research Organisation (ISRO) and global astronomical telemetry verify the successful landing of Vikram lander on August 23, 2023.",
        "evidence": [
            {
                "publisher": "ISRO Official Portal",
                "source_type": "TIER_1_OFFICIAL_PRIMARY",
                "domain": "isro.gov.in",
                "reliability_score": 1.0,
                "relationship": "SUPPORTS",
                "evidence_text": "Chandrayaan-3 successfully completed its soft landing on the lunar surface. Pragyan rover deployed successfully.",
                "url": "https://www.isro.gov.in/Chandrayaan3.html"
            },
            {
                "publisher": "Reuters World",
                "source_type": "TIER_2_ESTABLISHED_NEWS",
                "domain": "reuters.com",
                "reliability_score": 0.85,
                "relationship": "SUPPORTS",
                "evidence_text": "India makes historic moon landing as Chandrayaan-3 Vikram module touches down near south pole.",
                "url": "https://www.reuters.com/world/india/chandrayaan-3-moon-landing"
            }
        ]
    },
    {
        "demo_id": "demo-false-upi-ban",
        "title": "UPI Banned After 10 PM",
        "category": "FALSE",
        "input_type": "TEXT",
        "raw_input": "India has completely banned all UPI and digital payment transactions after 10 PM every night.",
        "verdict": "FALSE",
        "confidence": "HIGH",
        "summary": "The claim is verified as FALSE. The National Payments Corporation of India (NPCI) and the Reserve Bank of India (RBI) confirmed UPI services operate 24x7 without any nighttime curfew or shutdown.",
        "evidence": [
            {
                "publisher": "National Payments Corporation of India (NPCI)",
                "source_type": "TIER_1_OFFICIAL_PRIMARY",
                "domain": "npci.org.in",
                "reliability_score": 1.0,
                "relationship": "CONTRADICTS",
                "evidence_text": "NPCI clarifies that UPI infrastructure operates seamlessly round-the-clock 24/7/365. Viral claims regarding daily shutdowns are baseless.",
                "url": "https://www.npci.org.in/what-we-do/upi/product-overview"
            },
            {
                "publisher": "AltNews Fact Check",
                "source_type": "TIER_3_FACT_CHECKER",
                "domain": "altnews.in",
                "reliability_score": 0.85,
                "relationship": "CONTRADICTS",
                "evidence_text": "Fact Check: False claim circulated claiming UPI shut down after 10 PM. No such directive was issued by authorities.",
                "url": "https://www.altnews.in/fact-check-upi-ban-rumour"
            }
        ]
    },
    {
        "demo_id": "demo-misleading-mumbai-floods",
        "title": "Recycled Flood Footage",
        "category": "MISLEADING",
        "input_type": "IMAGE",
        "raw_input": "Severe catastrophic flooding submerges South Mumbai landmarks today.",
        "verdict": "MISLEADING",
        "confidence": "HIGH",
        "summary": "The statement and photo pairing is MISLEADING. The shared footage is authentic 2019 monsoon archival video presented out of context as present-day disaster reporting.",
        "evidence": [
            {
                "publisher": "BoomLive Fact Check",
                "source_type": "TIER_3_FACT_CHECKER",
                "domain": "boomlive.in",
                "reliability_score": 0.85,
                "relationship": "PARTIALLY_CONTRADICTS",
                "evidence_text": "Old 2019 waterlogging footage falsely shared as current Mumbai weather crisis.",
                "url": "https://www.boomlive.in/fact-check/mumbai-floods-old-video"
            }
        ]
    },
    {
        "demo_id": "demo-partly-true-currency",
        "title": "₹2000 Currency Note Status",
        "category": "PARTLY_TRUE",
        "input_type": "TEXT",
        "raw_input": "RBI withdrew ₹2000 notes and declared them illegal tender with zero monetary value.",
        "verdict": "PARTLY_TRUE",
        "confidence": "HIGH",
        "summary": "The claim is PARTLY TRUE. While the RBI withdrew ₹2000 notes from regular circulation under the Clean Note Policy, the banknotes continue to remain legal tender and can be deposited at RBI Issue Offices.",
        "evidence": [
            {
                "publisher": "Reserve Bank of India (RBI)",
                "source_type": "TIER_1_OFFICIAL_PRIMARY",
                "domain": "rbi.org.in",
                "reliability_score": 1.0,
                "relationship": "PARTIALLY_SUPPORTS",
                "evidence_text": "RBI withdrawn ₹2000 denomination banknotes from circulation, but notes continue to be legal tender.",
                "url": "https://rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx"
            }
        ]
    },
    {
        "demo_id": "demo-unverified-rumor",
        "title": "Unverified Viral Rumor",
        "category": "UNVERIFIED",
        "input_type": "TEXT",
        "raw_input": "Secret underground tunnels found beneath regional airport containing ancient treasure.",
        "verdict": "UNVERIFIED",
        "confidence": "LOW",
        "summary": "UNVERIFIED — We could not retrieve enough reliable evidence from official sources or established journalists to make a responsible determination.",
        "evidence": []
    },
    {
        "demo_id": "demo-outdated-guidelines",
        "title": "Discontinued Tax Relief Scheme",
        "category": "OUTDATED",
        "input_type": "TEXT",
        "raw_input": "Citizens can claim section 80EEA additional interest rebate on loans sanctioned this year.",
        "verdict": "OUTDATED",
        "confidence": "HIGH",
        "summary": "The claim is OUTDATED. Section 80EEA was valid for loans sanctioned between April 2019 and March 2022, but was not extended to recent fiscal periods.",
        "evidence": [
            {
                "publisher": "Income Tax Department of India",
                "source_type": "TIER_1_OFFICIAL_PRIMARY",
                "domain": "incometax.gov.in",
                "reliability_score": 1.0,
                "relationship": "CONTRADICTS",
                "evidence_text": "Section 80EEA deductions apply only to affordable housing loans sanctioned up to March 31, 2022.",
                "url": "https://www.incometax.gov.in"
            }
        ]
    },
    {
        "demo_id": "demo-whatsapp-forward",
        "title": "WhatsApp 3-Claim Forward",
        "category": "WHATSAPP_FORWARD",
        "input_type": "WHATSAPP",
        "raw_input": "Forwarded: 1. Government announces ₹50,000 cash for all citizens. 2. UNESCO declared National Anthem best in world. 3. Chandrayaan-3 landed on Moon.",
        "verdict": "PARTLY_TRUE",
        "confidence": "HIGH",
        "summary": "Multi-claim analysis (3 claims analyzed): 1 True, 2 False.\n\nClaim 1: False — PIB confirms no ₹50,000 grant exists.\nClaim 2: False — Long-standing UNESCO hoax debunked.\nClaim 3: True — ISRO Chandrayaan-3 lunar landing verified.",
        "evidence": [
            {
                "publisher": "PIB Fact Check",
                "source_type": "TIER_1_OFFICIAL_PRIMARY",
                "domain": "pib.gov.in",
                "reliability_score": 1.0,
                "relationship": "CONTRADICTS",
                "evidence_text": "PIB confirms fraudulent viral messages claiming Rs 50,000 relief disbursement.",
                "url": "https://factcheck.pib.gov.in"
            }
        ]
    }
]

@router.get("", response_model=List[Dict[str, Any]])
async def get_demo_cases():
    return DEMO_DATASETS

@router.get("/{demo_id}", response_model=Dict[str, Any])
async def get_demo_case_by_id(demo_id: str):
    for case in DEMO_DATASETS:
        if case["demo_id"] == demo_id:
            return case
    return DEMO_DATASETS[0]
