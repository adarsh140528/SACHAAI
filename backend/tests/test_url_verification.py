import pytest
from backend.app.core.security import validate_ssrf_safe_url
from backend.app.services.url_extractor import url_extractor_service

def test_ssrf_protection_blocks_private_and_cloud_ips():
    # Localhost and 127.0.0.1
    is_safe, msg = validate_ssrf_safe_url("http://127.0.0.1/admin")
    assert is_safe is False

    is_safe, msg = validate_ssrf_safe_url("http://localhost:8000/secret")
    assert is_safe is False

    # Private Subnets (RFC 1918)
    is_safe, msg = validate_ssrf_safe_url("http://192.168.1.1/router")
    assert is_safe is False

    is_safe, msg = validate_ssrf_safe_url("http://10.0.0.5/internal")
    assert is_safe is False

    # Cloud Metadata Endpoint (AWS / GCP / Azure Link-local)
    is_safe, msg = validate_ssrf_safe_url("http://169.254.169.254/latest/meta-data/")
    assert is_safe is False

    # Non-HTTP/HTTPS schemes
    is_safe, msg = validate_ssrf_safe_url("file:///etc/passwd")
    assert is_safe is False

    is_safe, msg = validate_ssrf_safe_url("gopher://127.0.0.1:70")
    assert is_safe is False

def test_ssrf_permits_legitimate_public_urls():
    is_safe, msg = validate_ssrf_safe_url("https://www.reuters.com/world/india")
    assert is_safe is True
    assert msg == ""

    is_safe, msg = validate_ssrf_safe_url("https://rbi.org.in/pressrelease")
    assert is_safe is True

def test_html_parsing_extracts_article():
    sample_html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>RBI releases annual report on digital payments</title>
        <meta property="og:title" content="RBI releases annual report on digital payments" />
    </head>
    <body>
        <nav><a href="/">Home</a></nav>
        <article>
            <h1>RBI releases annual report on digital payments</h1>
            <p>The Reserve Bank of India today published its comprehensive annual bulletin on digital currency and transaction growth.</p>
            <p>Total payments through UPI reached record milestones over the fiscal year with seamless round-the-clock uptime.</p>
        </article>
        <footer><p>Copyright 2026</p></footer>
    </body>
    </html>
    """
    parsed = url_extractor_service._parse_html(sample_html, "https://example.com/rbi-report")
    assert "RBI releases annual report" in parsed["title"]
    assert "Reserve Bank of India" in parsed["body"]
    assert "Home" not in parsed["body"]
    assert "Copyright" not in parsed["body"]
