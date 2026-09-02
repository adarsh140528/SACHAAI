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
  AlertCircle,
  ExternalLink
} from "lucide-react";

export default function DevelopersPage() {
  const [activeTab, setActiveTab] = useState<"curl" | "python" | "javascript">("curl");
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [testClaim, setTestClaim] = useState("The Great Wall of China is visible from space.");
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

  const curlCode = `curl -X POST http://localhost:8000/api/v1/checks \\
  -H "Content-Type: application/json" \\
  -H "X-API-KEY: ${sampleApiKey}" \\
  -d '{
    "input": "${testClaim}",
    "input_type": "TEXT"
  }'`;

  return (
    <div className="container max-w-7xl px-4 py-8 sm:py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-accent-blue font-bold uppercase tracking-wider mb-1">
          <Terminal className="h-3.5 w-3.5" /> API Reference & Integrations
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-sans">
          Developer Platform & REST API
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed">
          Integrate SACHLAI&apos;s evidence-based fact-checking engine directly into your CMS, editorial newsrooms, browser extensions, or automated intelligence workflows.
        </p>
      </div>

      {/* API Key Management Box */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-secondary text-primary flex items-center justify-center border border-border">
              <Key className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground font-sans">Live API Key</h3>
              <p className="text-xs text-muted-foreground font-mono">Use this key in the Authorization or X-API-KEY header</p>
            </div>
          </div>
          <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-verdict-true/10 text-verdict-true border border-verdict-true/20 self-start sm:self-auto">
            Active Developer Tier
          </span>
        </div>

        <div className="flex items-center gap-2 bg-secondary/50 border border-border rounded-lg p-2 font-mono text-xs">
          <span className="flex-1 truncate px-2 text-foreground select-all">{sampleApiKey}</span>
          <button
            onClick={handleCopyKey}
            className="px-3 py-1 rounded-md bg-card border border-border hover:bg-secondary text-xs font-semibold text-foreground transition-colors flex items-center gap-1.5 shrink-0"
          >
            {copiedKey ? <Check className="h-3.5 w-3.5 text-verdict-true" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey ? "Copied" : "Copy Key"}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Documentation & Interactive Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: API Endpoints & Rate Limits */}
        <div className="lg:col-span-7 space-y-8">
          {/* Endpoints Reference */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground font-sans border-b border-border pb-2">
              Endpoints
            </h3>

            <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-accent-blue text-white font-bold">POST</span>
                <span className="font-semibold text-foreground">/api/v1/checks</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Submits a text assertion, URL, or image transcription to the 11-stage verification pipeline and returns mathematical verdicts and evidence citations.
              </p>

              <div className="space-y-2 pt-2 border-t border-border">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Request Parameters
                </span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-secondary/40 text-[10px] text-muted-foreground uppercase border-b border-border">
                      <tr>
                        <th className="p-2">Field</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Required</th>
                        <th className="p-2">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="p-2 font-bold text-foreground">input</td>
                        <td className="p-2 text-muted-foreground">string</td>
                        <td className="p-2 text-verdict-false font-bold">Yes</td>
                        <td className="p-2 text-muted-foreground font-sans">Statement or URL to verify</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-foreground">input_type</td>
                        <td className="p-2 text-muted-foreground">string</td>
                        <td className="p-2 text-muted-foreground">No</td>
                        <td className="p-2 text-muted-foreground font-sans">TEXT, URL, IMAGE, WHATSAPP</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Rate Limits & SLA */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground font-sans border-b border-border pb-2">
              Rate Limits & Service SLA
            </h3>

            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-secondary/40 text-[10px] text-muted-foreground uppercase border-b border-border">
                  <tr>
                    <th className="p-3">Tier</th>
                    <th className="p-3">Requests / Min</th>
                    <th className="p-3">Pipeline Depth</th>
                    <th className="p-3">SLA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3 font-bold text-foreground">Developer Beta</td>
                    <td className="p-3 text-muted-foreground">60 req/min</td>
                    <td className="p-3 text-muted-foreground">Standard 11-Stage</td>
                    <td className="p-3 text-verdict-true">Best Effort</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-foreground">Newsroom Pro</td>
                    <td className="p-3 text-muted-foreground">600 req/min</td>
                    <td className="p-3 text-muted-foreground">Exhaustive Crawl</td>
                    <td className="p-3 text-verdict-true">99.9% Uptime</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-foreground">Enterprise</td>
                    <td className="p-3 text-muted-foreground">Custom</td>
                    <td className="p-3 text-muted-foreground">Custom Gazettes</td>
                    <td className="p-3 text-verdict-true">99.99% SLA</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Sticky Code Examples & Live Sandbox */}
        <div className="lg:col-span-5 space-y-6">
          {/* cURL Request Box */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
            <div className="bg-secondary/40 border-b border-border px-4 py-2.5 flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                cURL Request
              </span>
              <button
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(curlCode);
                    setCopiedCurl(true);
                    setTimeout(() => setCopiedCurl(false), 2000);
                  }
                }}
                className="text-muted-foreground hover:text-foreground text-xs transition-colors p-1"
                title="Copy cURL"
              >
                {copiedCurl ? <Check className="h-3.5 w-3.5 text-verdict-true" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className="p-4 bg-background overflow-x-auto">
              <pre className="font-mono text-xs text-foreground leading-relaxed">
                <code>{curlCode}</code>
              </pre>
            </div>
          </div>

          {/* Live API Tester */}
          <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                Interactive API Test
              </h4>
              <span className="h-2 w-2 rounded-full bg-verdict-true animate-pulse" />
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={testClaim}
                onChange={(e) => setTestClaim(e.target.value)}
                placeholder="Enter statement to test API..."
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono focus:outline-none focus:ring-1 focus:ring-accent-blue"
              />
              <button
                onClick={runApiTest}
                disabled={loadingTest || !testClaim.trim()}
                className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {loadingTest ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Executing Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Test Request</span>
                  </>
                )}
              </button>
            </div>

            {/* Response Preview */}
            {apiResponse && (
              <div className="pt-2 border-t border-border space-y-2">
                <span className="font-mono text-[10px] text-muted-foreground uppercase font-bold">
                  JSON Response (200 OK)
                </span>
                <div className="p-3 rounded-lg bg-background border border-border overflow-x-auto max-h-64 custom-scrollbar">
                  <pre className="font-mono text-[11px] text-foreground">
                    <code>{JSON.stringify(apiResponse, null, 2)}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
