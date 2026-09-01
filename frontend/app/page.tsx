"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Database, Server, Cpu } from "lucide-react";
import { fetchHealth } from "@/lib/api";

export default function HomePage() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealth().then((data) => {
      setHealth(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="max-w-3xl w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-wide uppercase">
          <Sparkles className="h-3.5 w-3.5" /> Project Foundation Active
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          SACHAI<span className="text-emerald-500">.AI</span>
        </h1>
        <p className="text-xl sm:text-2xl font-medium text-muted-foreground">
          Don&apos;t Just Believe It. <span className="text-foreground underline decoration-emerald-500 underline-offset-8">Verify It.</span>
        </p>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          The evidence-first verification engine that evaluates primary sources, official records, and independent fact checks before rendering deterministic verdicts.
        </p>

        {/* Live System Connectivity Card */}
        <div className="mt-8 p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-md text-left shadow-lg">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <div className="flex items-center gap-2 font-semibold">
              <Server className="h-4 w-4 text-emerald-500" /> System Foundation Status
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${health?.status === "ok" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
              <span className="text-xs font-mono font-medium">{loading ? "Connecting..." : health?.status === "ok" ? "All Services Operational" : "Backend Offline"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-xl bg-secondary/50 border border-border/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Database className="h-3.5 w-3.5" /> Database
              </div>
              <div className="font-semibold text-foreground">{health?.database || "Connecting..."}</div>
            </div>
            <div className="p-3 rounded-xl bg-secondary/50 border border-border/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Cpu className="h-3.5 w-3.5" /> Search Provider
              </div>
              <div className="font-semibold text-foreground uppercase">{health?.search_provider || "DuckDuckGo (Live)"}</div>
            </div>
            <div className="p-3 rounded-xl bg-secondary/50 border border-border/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Environment
              </div>
              <div className="font-semibold text-foreground capitalize">{health?.environment || "Development"}</div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 transition-all active:scale-95"
          >
            Launch Demo Suite <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-secondary text-foreground font-semibold text-sm transition-colors"
          >
            Explore API Docs (FastAPI)
          </a>
        </div>
      </div>
    </div>
  );
}
