"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Terminal,
  Key,
  Copy,
  Check,
  Plus,
  Trash2,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Code2,
  Sparkles,
  Lock,
  Zap,
  Globe,
  Layers,
  Cpu,
  RefreshCw
} from "lucide-react";
import { fetchApiKeys, createApiKey, deleteApiKey } from "@/lib/api";

export default function DevelopersPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [creatingKey, setCreatingKey] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [keyError, setKeyError] = useState("");

  // Live Playground State
  const [playgroundKey, setPlaygroundKey] = useState("");
  const [testClaim, setTestClaim] = useState("ISRO successfully launched the Chandrayaan-3 lunar mission.");
  const [testInputType, setTestInputType] = useState<"TEXT" | "URL" | "WHATSAPP">("TEXT");
  const [loadingTest, setLoadingTest] = useState(false);
  const [apiResponse, setApiResponse] = useState<any | null>(null);
  const [responseTimeMs, setResponseTimeMs] = useState<number | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  // Tabs
  const [activeLangTab, setActiveLangTab] = useState<"curl" | "python" | "javascript" | "webhook">("curl");
  const [activeDocTab, setActiveDocTab] = useState<"verify" | "get_check" | "upload_ocr" | "health">("verify");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("sachai_token");
      setIsLoggedIn(!!token);
      if (token) {
        loadKeys();
      }
    }
  }, []);

  const loadKeys = async () => {
    setLoadingKeys(true);
    try {
      const keys = await fetchApiKeys();
      setApiKeys(keys);
    } catch (err: any) {
      console.error("Failed to load API keys:", err);
    } finally {
      setLoadingKeys(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setCreatingKey(true);
    setKeyError("");

    try {
      const data = await createApiKey(newKeyName.trim());
      setNewlyCreatedKey(data.api_key);
      setPlaygroundKey(data.api_key);
      setNewKeyName("");
      await loadKeys();
    } catch (err: any) {
      setKeyError(err.message || "Failed to generate API key.");
    } finally {
      setCreatingKey(false);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (!confirm("Are you sure you want to revoke this API key? Applications using it will be unable to authenticate.")) return;
    try {
      await deleteApiKey(keyId);
      await loadKeys();
    } catch (err: any) {
      alert(err.message || "Failed to revoke key.");
    }
  };

  const copyToClipboard = (text: string, isSnippet: boolean = false) => {
    navigator.clipboard.writeText(text);
    if (isSnippet) {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const effectiveKey = playgroundKey.trim() || newlyCreatedKey || (apiKeys.length > 0 ? `${apiKeys[0].key_prefix}...` : "sach_live_your_api_key_here");

  const runApiTest = async () => {
    if (!testClaim.trim()) return;
    setLoadingTest(true);
    setApiResponse(null);
    setResponseStatus(null);
    setResponseTimeMs(null);
    const startTime = performance.now();

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const token = typeof window !== "undefined" ? localStorage.getItem("sachai_token") : null;
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (playgroundKey.trim()) {
        headers["X-API-KEY"] = playgroundKey.trim();
      } else if (newlyCreatedKey) {
        headers["X-API-KEY"] = newlyCreatedKey;
      } else if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        headers["X-API-KEY"] = "sach_live_demo_key";
      }

      const res = await fetch(`${API_URL}/api/v1/checks`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          input: testClaim,
          input_type: testInputType,
        }),
      });

      const elapsed = Math.round(performance.now() - startTime);
      setResponseTimeMs(elapsed);
      setResponseStatus(res.status);

      const data = await res.json();
      setApiResponse(data);
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - startTime);
      setResponseTimeMs(elapsed);
      setResponseStatus(500);
      setApiResponse({ error: err.message || "Failed to execute API request." });
    } finally {
      setLoadingTest(false);
    }
  };

  const getCodeSnippet = () => {
    const key = effectiveKey;
    const endpointUrl = "http://127.0.0.1:8000/api/v1/checks";

    if (activeLangTab === "curl") {
      return `# Linux / macOS / Bash:
curl -X POST "${endpointUrl}" \\
  -H "Content-Type: application/json" \\
  -H "X-API-KEY: ${key}" \\
  -d '{"input": "${testClaim}", "input_type": "${testInputType}"}'

# Windows PowerShell:
Invoke-RestMethod -Uri "${endpointUrl}" -Method Post -Headers @{"Content-Type"="application/json"; "X-API-KEY"="${key}"} -Body '{"input": "${testClaim}", "input_type": "${testInputType}"}'`;
    }

    if (activeLangTab === "python") {
      return `import requests

API_URL = "${endpointUrl}"
API_KEY = "${key}"

payload = {
    "input": "${testClaim}",
    "input_type": "${testInputType}"
}

headers = {
    "Content-Type": "application/json",
    "X-API-KEY": API_KEY
}

response = requests.post(API_URL, json=payload, headers=headers)
data = response.json()

print(f"Overall Verdict: {data.get('overall_verdict')}")
print(f"Confidence: {data.get('overall_confidence')}")
print(f"Summary: {data.get('overall_summary')}")`;
    }

    if (activeLangTab === "javascript") {
      return `// Node.js (18+) or Browser fetch
async function verifyClaim(statement) {
  const response = await fetch("${endpointUrl}", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "${key}"
    },
    body: JSON.stringify({
      input: statement,
      input_type: "${testInputType}"
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Verification failed");
  }

  const result = await response.json();
  console.log("Verdict:", result.overall_verdict);
  console.log("Confidence:", result.overall_confidence);
  return result;
}

verifyClaim("${testClaim}");`;
    }

    if (activeLangTab === "webhook") {
      return `// Express.js / Next.js API Route Webhook Handler
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userSubmittedText } = await req.json();

  // Call SACHAI Verification Engine
  const sachaiRes = await fetch("${endpointUrl}", {
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
}`;
    }

    return "";
  };

  return (
    <div className="container max-w-7xl px-4 py-8 sm:py-12 space-y-10">
      {/* Page Header */}
      <div className="border-b border-border pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs text-accent-blue font-bold uppercase tracking-wider">
            <Terminal className="h-4 w-4" />
            <span>Developer Platform & REST API</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-sans">
            API Reference & Integrations
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
            Integrate algorithmic evidence extraction, multi-tier credibility ranking, and deterministic truth verification directly into your CMS, editorial workflows, browser extensions, or automated intelligence pipelines.
          </p>
        </div>
      </div>

      {/* 1. API Key Management Card */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center border border-accent-blue/20">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground font-sans">API Key Authentication</h3>
              <p className="text-xs text-muted-foreground">
                Authenticate requests by passing your key in the <code className="font-mono text-foreground font-semibold bg-secondary px-1.5 py-0.5 rounded">X-API-KEY</code> header
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-verdict-true/10 text-verdict-true border border-verdict-true/20 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>Production Ready</span>
            </span>
          </div>
        </div>

        {/* Newly Created Key Alert Banner */}
        {newlyCreatedKey && (
          <div className="p-4 rounded-xl bg-accent-blue/10 border-2 border-accent-blue/30 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground font-sans flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-accent-blue" />
                <span>New API Key Generated — Copy Now</span>
              </span>
              <span className="text-[10px] text-amber-600 font-mono font-bold uppercase">
                Will not be shown again
              </span>
            </div>

            <div className="flex items-center gap-2 bg-background border border-accent-blue/30 rounded-lg p-2 font-mono text-xs">
              <span className="flex-1 truncate px-2 text-foreground font-bold select-all">{newlyCreatedKey}</span>
              <button
                onClick={() => copyToClipboard(newlyCreatedKey)}
                className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold transition-all hover:opacity-90 flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                {copiedKey ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey ? "Copied!" : "Copy Full Key"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Logged in Key Manager vs Logged out Prompt */}
        {isLoggedIn ? (
          <div className="space-y-4">
            {/* Generate Key Form */}
            <form onSubmit={handleCreateKey} className="flex flex-col sm:flex-row gap-2 max-w-xl">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Key Name (e.g. Production CMS, Telegram Bot)"
                className="flex-1 px-3.5 py-2 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent-blue"
              />
              <button
                type="submit"
                disabled={creatingKey || !newKeyName.trim()}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm"
              >
                {creatingKey ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                <span>Generate Key</span>
              </button>
            </form>

            {keyError && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> {keyError}
              </p>
            )}

            {/* List of Active Keys */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Active Keys ({apiKeys.length})
              </span>

              {loadingKeys ? (
                <div className="flex items-center gap-2 py-4 text-xs text-muted-foreground font-mono">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading your keys...
                </div>
              ) : apiKeys.length === 0 ? (
                <div className="p-4 rounded-lg bg-secondary/30 border border-border text-center text-xs text-muted-foreground">
                  No active API keys found. Generate your first API key above to start integrating.
                </div>
              ) : (
                <div className="divide-y divide-border border border-border rounded-xl bg-card overflow-hidden">
                  {apiKeys.map((k) => (
                    <div key={k.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground font-sans">{k.name}</span>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-secondary border border-border font-semibold">
                            {k.key_prefix}••••••••
                          </span>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                          <span>Rate Limit: {k.rate_limit_rpm} req/min</span>
                          <span>Created: {new Date(k.created_at).toLocaleDateString()}</span>
                          {k.last_used_at && <span>Last Used: {new Date(k.last_used_at).toLocaleDateString()}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setPlaygroundKey(k.key_prefix);
                            const el = document.getElementById("api-playground");
                            el?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="px-2.5 py-1 rounded border border-border bg-secondary/40 hover:bg-secondary text-[11px] font-semibold transition-colors flex items-center gap-1"
                        >
                          <Zap className="h-3 w-3 text-accent-blue" />
                          <span>Test in Playground</span>
                        </button>
                        <button
                          onClick={() => handleRevokeKey(k.id)}
                          className="px-2.5 py-1 rounded border border-destructive/30 text-destructive hover:bg-destructive/10 text-[11px] font-semibold transition-colors flex items-center gap-1"
                          title="Revoke API Key"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Revoke</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-secondary/30 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start text-xs font-bold text-foreground font-sans">
                <Lock className="h-3.5 w-3.5 text-accent-blue" />
                <span>Sign in to Generate and Manage Live API Keys</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Get developer access, API keys, and rate limit allocation by signing in.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/sign-in"
                className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-semibold text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all shadow-sm"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 2. PROMINENT LIVE API PLAYGROUND SECTION */}
      <div id="api-playground" className="rounded-2xl border-2 border-accent-blue/30 bg-card shadow-lg p-6 space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center border border-accent-blue/20">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-foreground font-sans">
                  Live API Playground
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-verdict-true/10 text-verdict-true font-mono text-[10px] font-bold border border-verdict-true/20 animate-pulse">
                  ● Interactive Sandbox
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Execute live requests against the verification endpoint (<code className="font-mono text-foreground font-semibold">POST /api/v1/checks</code>) using your API key.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Playground Form (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* API Key Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-foreground uppercase flex items-center justify-between">
                <span>API Key Header (X-API-KEY)</span>
                {playgroundKey && <span className="text-accent-blue text-[10px] font-sans">Custom Key Active</span>}
              </label>
              <input
                type="text"
                value={playgroundKey}
                onChange={(e) => setPlaygroundKey(e.target.value)}
                placeholder="Paste your sach_live_... API key here"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-accent-blue/20"
              />
            </div>

            {/* Input Type */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase">
                Input Type:
              </span>
              <div className="flex gap-1.5">
                {(["TEXT", "URL", "WHATSAPP"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTestInputType(t)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-colors border ${
                      testInputType === t
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-secondary/40 text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Claim Statement */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono font-bold text-foreground uppercase">
                  Statement / Claim to Verify
                </label>
              </div>
              <textarea
                rows={4}
                value={testClaim}
                onChange={(e) => setTestClaim(e.target.value)}
                placeholder="Enter claim statement, news URL, or forwarded message..."
                className="w-full p-3.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 leading-relaxed resize-none shadow-inner"
              />
            </div>

            {/* Quick Samples */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
                Try:
              </span>
              <button
                type="button"
                onClick={() => setTestClaim("ISRO successfully launched the Chandrayaan-3 lunar mission.")}
                className="px-2 py-0.5 rounded text-[11px] border border-border bg-secondary/30 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                Chandrayaan-3
              </button>
              <button
                type="button"
                onClick={() => setTestClaim("India has completely banned UPI transactions after 10 PM.")}
                className="px-2 py-0.5 rounded text-[11px] border border-border bg-secondary/30 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                UPI 10 PM Ban
              </button>
              <button
                type="button"
                onClick={() => setTestClaim("Government has announced ₹50,000 relief for every citizen.")}
                className="px-2 py-0.5 rounded text-[11px] border border-border bg-secondary/30 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                ₹50,000 Scheme
              </button>
            </div>

            {/* Send Request Button */}
            <button
              onClick={runApiTest}
              disabled={loadingTest || !testClaim.trim()}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-primary/10"
            >
              {loadingTest ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Executing 11-Stage Verification Pipeline...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Verification Request</span>
                </>
              )}
            </button>
          </div>

          {/* Playground Response (6 cols) */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex items-center justify-between pb-2">
              <span className="text-[11px] font-mono font-bold text-foreground uppercase">
                Live API Response
              </span>
              {apiResponse && (
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                      responseStatus === 200
                        ? "bg-verdict-true/10 text-verdict-true border border-verdict-true/20"
                        : "bg-destructive/10 text-destructive border border-destructive/20"
                    }`}
                  >
                    HTTP {responseStatus}
                  </span>
                  {responseTimeMs && (
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {responseTimeMs}ms
                    </span>
                  )}
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(apiResponse, null, 2))}
                    className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy response JSON"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 min-h-[260px] rounded-xl border border-border bg-background p-4 font-mono text-[11px] overflow-auto max-h-[380px] custom-scrollbar">
              {loadingTest ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-accent-blue" />
                  <p className="text-xs">Searching primary records, clustering wires, calculating verdict...</p>
                </div>
              ) : apiResponse ? (
                <pre className="text-foreground whitespace-pre-wrap leading-relaxed">
                  <code>{JSON.stringify(apiResponse, null, 2)}</code>
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground text-center py-12">
                  <Zap className="h-6 w-6 opacity-40 text-accent-blue" />
                  <p className="text-xs font-semibold text-foreground">Playground Ready</p>
                  <p className="text-[10px] max-w-xs">
                    Enter your statement and click &ldquo;Send Verification Request&rdquo; to see the structured JSON verdict output.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Integration Code Snippets & REST Specification Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (6 cols): Multi-language Integration Snippets */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-base font-bold text-foreground font-sans flex items-center gap-2">
              <Code2 className="h-4 w-4 text-accent-blue" />
              <span>Integration Code Snippets</span>
            </h3>
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Copy-Paste Ready</span>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
            <div className="bg-secondary/50 border-b border-border px-4 py-2.5 flex items-center justify-between">
              <div className="flex gap-1.5">
                {(["curl", "python", "javascript", "webhook"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLangTab(lang)}
                    className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg transition-colors ${
                      activeLangTab === lang
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                onClick={() => copyToClipboard(getCodeSnippet(), true)}
                className="px-2.5 py-1 rounded bg-secondary hover:bg-secondary/80 text-foreground text-xs transition-colors flex items-center gap-1.5 border border-border"
                title="Copy code snippet"
              >
                {copiedSnippet ? <Check className="h-3 w-3 text-verdict-true" /> : <Copy className="h-3 w-3" />}
                <span className="text-[11px] font-semibold">{copiedSnippet ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div className="p-4 bg-background overflow-x-auto max-h-[340px] custom-scrollbar">
              <pre className="font-mono text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                <code>{getCodeSnippet()}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): REST Endpoints Specification */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-base font-bold text-foreground font-sans">
              REST Endpoints Reference
            </h3>
            <div className="flex gap-1.5">
              {(["verify", "get_check", "upload_ocr", "health"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveDocTab(tab)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all border ${
                    activeDocTab === tab
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary/30 text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {tab === "verify" ? "POST /checks" : tab === "get_check" ? "GET /checks/{id}" : tab === "upload_ocr" ? "POST /uploads" : "GET /health"}
                </button>
              ))}
            </div>
          </div>

          {activeDocTab === "verify" && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-0.5 rounded bg-accent-blue text-white font-bold">POST</span>
                <span className="font-bold text-foreground">/api/v1/checks</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Submits a factual claim to the 11-stage verification pipeline. Executes parallel primary source retrieval, credibility tier ranking, and stance analysis.
              </p>
              <div className="space-y-2 pt-2 border-t border-border">
                <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">Required Headers</span>
                <div className="text-xs font-mono bg-background p-2.5 rounded-lg border border-border space-y-1">
                  <div><span className="text-accent-blue font-bold">Content-Type:</span> application/json</div>
                  <div><span className="text-accent-blue font-bold">X-API-KEY:</span> sach_live_...</div>
                </div>
              </div>
            </div>
          )}

          {activeDocTab === "get_check" && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-0.5 rounded bg-emerald-600 text-white font-bold">GET</span>
                <span className="font-bold text-foreground">/api/v1/checks/{`{id}`}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Fetches the complete audited verification report by unique Check ID, including all atomic claims, extracted evidence quotes, and stance ratings.
              </p>
            </div>
          )}

          {activeDocTab === "upload_ocr" && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-0.5 rounded bg-accent-blue text-white font-bold">POST</span>
                <span className="font-bold text-foreground">/api/v1/uploads</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Uploads an image screenshot (PNG, JPEG, WEBP up to 10MB) and extracts claim text using Gemini Vision Multimodal forensic OCR.
              </p>
            </div>
          )}

          {activeDocTab === "health" && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-0.5 rounded bg-emerald-600 text-white font-bold">GET</span>
                <span className="font-bold text-foreground">/health</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Returns real-time health diagnostics for the API engine, Supabase PostgreSQL, and search providers.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
