"use client";

import { useState } from "react";
import {
  Network,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Activity,
  ArrowRight
} from "lucide-react";

interface EvidenceGraphProps {
  claimText: string;
  verdict: string;
  confidence: string;
  evidenceItems: any[];
}

export default function EvidenceGraph({
  claimText,
  verdict,
  confidence,
  evidenceItems,
}: EvidenceGraphProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const getVerdictTheme = (v: string) => {
    switch (v?.toUpperCase()) {
      case "TRUE":
        return { color: "#15803D", bg: "bg-emerald-600", text: "text-emerald-700 dark:text-emerald-400" };
      case "FALSE":
        return { color: "#DC2626", bg: "bg-rose-600", text: "text-rose-700 dark:text-rose-400" };
      case "MISLEADING":
        return { color: "#D97706", bg: "bg-amber-600", text: "text-amber-700 dark:text-amber-400" };
      case "PARTLY_TRUE":
        return { color: "#EA580C", bg: "bg-orange-600", text: "text-orange-700 dark:text-orange-400" };
      case "OUTDATED":
        return { color: "#2563EB", bg: "bg-blue-600", text: "text-blue-700 dark:text-blue-400" };
      default:
        return { color: "#64748B", bg: "bg-slate-600", text: "text-slate-400" };
    }
  };

  const getRelTheme = (rel: string) => {
    switch (rel?.toUpperCase()) {
      case "SUPPORTS":
        return { color: "#15803D", bg: "bg-emerald-600 text-white", label: "SUPPORTS" };
      case "CONTRADICTS":
        return { color: "#DC2626", bg: "bg-rose-600 text-white", label: "CONTRADICTS" };
      case "PARTIALLY_SUPPORTS":
        return { color: "#D97706", bg: "bg-amber-600 text-white", label: "PARTIAL SUPPORT" };
      case "PARTIALLY_CONTRADICTS":
        return { color: "#D97706", bg: "bg-amber-600 text-white", label: "PARTIAL CONTRADICT" };
      default:
        return { color: "#64748B", bg: "bg-slate-600 text-white", label: "CONTEXT" };
    }
  };

  const verdictTheme = getVerdictTheme(verdict);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-secondary/20">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Network className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-foreground">
              Evidence Provenance Map
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Trace claim ➔ independent sources ➔ stance relationships ➔ mathematical verdict
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-secondary transition-colors"
        >
          {isCollapsed ? (
            <>
              <span>Expand Map</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              <span>Collapse</span>
              <ChevronUp className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-5 sm:p-8 space-y-6 bg-fine-grid">
          {/* Main Visual Hierarchy Flow */}
          <div className="flex flex-col items-center max-w-3xl mx-auto space-y-6">
            {/* Step 1: Central Claim Node */}
            <div className="w-full max-w-md p-4 rounded-xl border border-border bg-card shadow-sm text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified Subject Assertion</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-foreground leading-snug">
                &ldquo;{claimText}&rdquo;
              </p>
            </div>

            {/* Connecting Vertical Stem */}
            <div className="flex flex-col items-center">
              <div className="h-6 w-0.5 bg-border" />
              <div className="text-[10px] font-mono px-2 py-0.5 rounded border border-border bg-secondary text-muted-foreground">
                Parallel Evidence Retrieval ({evidenceItems?.length || 0} Primary Citations)
              </div>
              <div className="h-6 w-0.5 bg-border" />
            </div>

            {/* Step 2: Evidence Sources Grid */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {(!evidenceItems || evidenceItems.length === 0) ? (
                <div className="col-span-2 text-center py-6 text-xs text-muted-foreground">
                  No independent evidence records retrieved for this query.
                </div>
              ) : (
                evidenceItems.map((item: any, idx: number) => {
                  const rel = getRelTheme(item.relationship);
                  const isHovered = hoveredNodeId === item.id || hoveredNodeId === null;

                  return (
                    <div
                      key={item.id || idx}
                      onMouseEnter={() => setHoveredNodeId(item.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      className={`p-3.5 rounded-lg border transition-all text-left space-y-2 bg-card ${
                        hoveredNodeId === item.id
                          ? "border-primary shadow-md ring-1 ring-primary/20 scale-[1.01]"
                          : isHovered
                          ? "border-border opacity-100"
                          : "border-border/50 opacity-40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs font-bold text-foreground truncate">
                            {item.publisher || "Primary Source"}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded border border-border bg-secondary text-muted-foreground font-mono truncate">
                            {item.source_type?.replace("TIER_", "T") || "TIER 2"}
                          </span>
                        </div>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${rel.bg}`}>
                          {rel.label}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 italic">
                        &ldquo;{item.evidence_text}&rdquo;
                      </p>

                      {item.url && (
                        <div className="pt-1 flex items-center justify-between text-[10px]">
                          <span className="text-muted-foreground font-mono">
                            Reliability: {item.reliability_score || "0.85"}
                          </span>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>Inspect Source</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Connecting Vertical Stem */}
            <div className="flex flex-col items-center">
              <div className="h-6 w-0.5 bg-border" />
              <div className="text-[10px] font-mono px-2 py-0.5 rounded border border-border bg-secondary text-muted-foreground">
                Deterministic Truth Aggregation
              </div>
              <div className="h-6 w-0.5 bg-border" />
            </div>

            {/* Step 3: Final Aggregated Verdict Node */}
            <div
              className="px-8 py-4 rounded-xl border shadow-md flex items-center gap-4 text-left"
              style={{
                borderColor: `${verdictTheme.color}50`,
                backgroundColor: `${verdictTheme.color}10`,
              }}
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Computed Deterministic Verdict
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className="text-xl font-extrabold tracking-tight"
                    style={{ color: verdictTheme.color }}
                  >
                    {verdict || "UNVERIFIED"}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">
                    • Confidence: <strong className="text-foreground">{confidence || "HIGH"}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
