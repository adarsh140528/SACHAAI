"use client";

import { useState } from "react";
import {
  Terminal,
  Key,
  Copy,
  Check,
  Code2,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Send,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function DevelopersPage() {
  const [activeTab, setActiveTab] = useState<"curl" | "python" | "javascript">("curl");
  const [copiedKey, setCopiedKey] = useState(false);
  const [testClaim, setTestClaim] = useState("India has banned 2000 rupee notes");
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
    curl: `curl -X POST "http://localhost:8000/api/v1/check" \\
  -H "Content-Type: application/json" \\
  -H "X-API-KEY: ${sampleApiKey}" \\
  -d '{
    "input": "India banned ₹2000 notes in 2026",
    "input_type": "text"
  }'`,
    python: `import requests

url = "http://localhost:8000/api/v1/check"
headers = {
    "Content-Type": "application/json",
    "X-API-KEY": "${sampleApiKey}"
}
payload = {
    "input": "India banned ₹2000 notes in 2026",
    "input_type": "text"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
    javascript: `const response = await fetch("http://localhost:8000/api/v1/check", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": "${sampleApiKey}"
  },
  body: JSON.stringify({
    input: "India banned ₹2000 notes in 2026",
    input_type: "text"
  })
});

const result = await response.json();
console.log(result);`
  };

  return (
    <div className="container max-w-6xl px-4 py-12 sm:py-16 mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-500 text-xs font-semibold uppercase tracking-wide">
          <Terminal className="h-3.5 w-3.5" /> Developer Platform
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          SACHAI.AI Verification API
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Integrate deterministic evidence verification, source ranking, and fact-checking into your newsroom, bot, or application with our high-speed REST API.
        </p>
      </div>

      {/* API Key Provisioning Box */}
      <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Key className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Active Developer API Key</h3>
              <p className="text-xs text-muted-foreground">Default rate limit: 60 requests/minute</p>
            </div>
          </div>

          <button
            onClick={handleCopyKey}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/70 border border-border text-xs font-semibold transition-colors"
          >
            {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey ? "Copied to Clipboard!" : "Copy API Key"}</span>
          </button>
        </div>

        <div className="p-3 rounded-xl bg-background border border-border/80 font-mono text-xs text-emerald-500 break-all select-all">
          {sampleApiKey}
        </div>
      </div>

      {/* Code Snippets & Interactive Tester Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Code Snippet Tabs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Code2 className="h-4 w-4 text-emerald-500" /> Code Integration
            </h3>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary border border-border">
              {(["curl", "python", "javascript"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-[#0f172a] text-slate-100 p-4 font-mono text-xs leading-relaxed overflow-x-auto shadow-inner">
            <pre>{codeSnippets[activeTab]}</pre>
          </div>
        </div>

        {/* Interactive Live API Playground */}
        <div className="p-6 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-500" /> Interactive API Console
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 uppercase">
              Live POST /api/v1/check
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Input Statement Payload</label>
            <input
              type="text"
              value={testClaim}
              onChange={(e) => setTestClaim(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <button
            onClick={runApiTest}
            disabled={loadingTest || !testClaim.trim()}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loadingTest ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Executing Verification...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Send Test Request</span>
              </>
            )}
          </button>

          {apiResponse && (
            <div className="p-4 rounded-xl border border-border bg-background space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-foreground">Response Output:</span>
                <span className="text-emerald-500 font-mono">Status: {apiResponse.status || 200}</span>
              </div>
              <pre className="text-[11px] font-mono text-muted-foreground overflow-x-auto max-h-48 whitespace-pre-wrap">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
