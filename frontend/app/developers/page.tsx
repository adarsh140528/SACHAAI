"use client";

import { useState } from "react";
import {
  Terminal,
  Key,
  Copy,
  Check,
  Code2,
  ArrowRight,
  ShieldCheck,
  Send,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function DevelopersPage() {
  const [activeTab, setActiveTab] = useState<"curl" | "python" | "javascript">("curl");
  const [copiedKey, setCopiedKey] = useState(false);
  const [testClaim, setTestClaim] = useState("India announced ₹50,000 relief fund for citizens");
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loadingTest, setLoadingTest] = useState(false);

  const sampleApiKey = "sach_live_9f83a21b47c9d08e514f7623a9b1c2d3";

  const handleCopyKey = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(sampleApiKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const runApiTest = async () => {
    setLoadingTest(true);
    setApiResponse(null);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/api/v1/checks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": sampleApiKey,
        },
        body: JSON.stringify({
          input: testClaim,
          input_type: "TEXT",
        }),
      });
      const data = await res.json();
      setApiResponse(data);
    } catch (err: any) {
      setApiResponse({ error: err.message || "Failed to call API." });
    } finally {
      setLoadingTest(false);
    }
  };

  const codeSnippets = {
    curl: `curl -X POST http://localhost:8000/api/v1/checks \\
  -H "Content-Type: application/json" \\
  -H "X-API-KEY: ${sampleApiKey}" \\
  -d '{
    "input": "India has banned 2000 rupee notes",
    "input_type": "TEXT"
  }'`,
    python: `import requests

url = "http://localhost:8000/api/v1/checks"
headers = {
    "Content-Type": "application/json",
    "X-API-KEY": "${sampleApiKey}"
}
payload = {
    "input": "India has banned 2000 rupee notes",
    "input_type": "TEXT"
}

response = requests.post(url, json=payload, headers=headers)
result = response.json()

print(f"Verdict: {result['overall_verdict']}")
print(f"Confidence: {result['overall_confidence']}")
print(f"Reasoning: {result['overall_summary']}")`,
    javascript: `const response = await fetch("http://localhost:8000/api/v1/checks", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": "${sampleApiKey}"
  },
  body: JSON.stringify({
    input: "India has banned 2000 rupee notes",
    input_type: "TEXT"
  })
});

const data = await response.json();
console.log(data.overall_verdict, data.claims);`
  };

  return (
    <div className="container max-w-6xl px-4 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
          <Terminal className="h-3.5 w-3.5" /> Developer Platform & API
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Fact-Checking API Integration
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Embed deterministic fact-checking into your newsroom, chat bots, or research tools using our low-latency JSON REST endpoints.
        </p>
      </div>

      {/* API Key Management Box */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" /> Active Live API Key
            </h3>
            <p className="text-xs text-muted-foreground">
              Pass as <code className="text-primary font-mono text-[11px]">X-API-KEY</code> header or Bearer token.
            </p>
          </div>
          <button
            onClick={handleCopyKey}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground transition-colors self-start sm:self-auto"
          >
            {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey ? "Copied" : "Copy API Key"}</span>
          </button>
        </div>

        <div className="p-3 rounded-lg border border-border bg-secondary/40 font-mono text-xs text-foreground select-all">
          {sampleApiKey}
        </div>
      </div>

      {/* Code Examples & Split Documentation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Code Snippets */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("curl")}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  activeTab === "curl" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                cURL
              </button>
              <button
                onClick={() => setActiveTab("python")}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  activeTab === "python" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Python
              </button>
              <button
                onClick={() => setActiveTab("javascript")}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  activeTab === "javascript" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Node / JS
              </button>
            </div>
          </div>

          <div className="p-4 bg-[#0B1220] flex-1 overflow-x-auto">
            <pre className="text-xs font-mono text-slate-200 leading-relaxed">
              <code>{codeSnippets[activeTab]}</code>
            </pre>
          </div>
        </div>

        {/* Right: Live Interactive API Tester Console */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4 flex flex-col">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">Interactive API Test Console</h3>
            <p className="text-xs text-muted-foreground">
              Send a live JSON payload to test the backend verification response.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Request Payload (`input`)
            </label>
            <input
              type="text"
              value={testClaim}
              onChange={(e) => setTestClaim(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            onClick={runApiTest}
            disabled={loadingTest || !testClaim.trim()}
            className="w-full py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loadingTest ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Executing Pipeline API...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Send Test Request</span>
              </>
            )}
          </button>

          {apiResponse && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-mono text-muted-foreground uppercase">Response JSON:</span>
              <div className="p-3 rounded-lg bg-secondary/50 border border-border max-h-48 overflow-y-auto">
                <pre className="text-[11px] font-mono text-foreground leading-snug">
                  <code>{JSON.stringify(apiResponse, null, 2)}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
