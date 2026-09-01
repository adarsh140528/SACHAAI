import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app

@pytest.mark.asyncio
async def test_health_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "database" in data

@pytest.mark.asyncio
async def test_create_and_run_check():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        payload = {
            "input": "India banned 2000 rupee notes in 2023",
            "input_type": "TEXT"
        }
        response = await ac.post("/api/v1/checks", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "check_id" in data
        assert data["status"] == "COMPLETED"
        assert len(data["claims"]) > 0
        assert data["overall_verdict"] in ["TRUE", "FALSE", "MISLEADING", "PARTLY_TRUE", "UNVERIFIED", "OUTDATED"]
