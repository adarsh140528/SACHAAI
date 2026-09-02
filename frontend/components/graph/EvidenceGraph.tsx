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
        return { color: "#15803D", bg: "bg-verdict-true text-white", label: "SUPPORTS" };
      case "CONTRADICTS":
        return { color: "#DC2626", bg: "bg-verdict-false text-white", label: "CONTRADICTS" };
      case "PARTIALLY_SUPPORTS":
        return { color: "#D97706", bg: "bg-verdict-misleading text-white", label: "PARTIAL SUPPORT" };
      case "PARTIALLY_CONTRADICTS":
        return { color: "#D97706", bg: "bg-verdict-misleading text-white", label: "PARTIAL CONTRADICT" };
      default:
        return { color: "#64748B", bg: "bg-verdict-unverified text-white", label: "CONTEXT" };
    }
  };

  const verdictTheme = getVerdictTheme(verdict);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-secondary text-primary flex items-center justify-center border border-border">
            <Network className="h-4 w-4 text-accent-blue" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-foreground font-sans">
              Evidence Graph & Network Topology
            </h3>
            <p className="text-[11px] text-muted-foreground font-mono">
              Deterministic graph linking claim assertion to independent evidence nodes
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
        <div className="p-5 sm:p-6 space-y-6">
          {/* Animated SVG Graph Container (Stitch Design Specification) */}
          <div className="relative rounded-lg border border-border bg-secondary/20 p-4 flex flex-col items-center justify-center overflow-hidden">
            <div className="w-full max-w-[400px] h-[220px] relative flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 400 300">
                <defs>
                  <linearGradient id="contradictGrad" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#0B1220" />
                    <stop offset="100%" stopColor="#DC2626" />
                  </linearGradient>
                  <linearGradient id="supportGrad" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#0B1220" />
                    <stop offset="100%" stopColor="#15803D" />
                  </linearGradient>
                  <linearGradient id="neutralGrad" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#0B1220" />
                    <stop offset="100%" stopColor="#64748B" />
                  </linearGradient>
                </defs>

                {/* Animated Dashed Curved Flow Paths */}
                <path
                  d="M 200 150 Q 250 80 320 70"
                  fill="none"
                  stroke={verdict === "FALSE" ? "url(#contradictGrad)" : "url(#neutralGrad)"}
                  strokeWidth="2"
                  strokeDasharray="4"
                  className="animate-dash"
                />
                <path
                  d="M 200 150 Q 260 220 320 230"
                  fill="none"
                  stroke={verdict === "FALSE" ? "url(#contradictGrad)" : "url(#supportGrad)"}
                  strokeWidth="2"
                  strokeDasharray="4"
                  className="animate-dash"
                />
                <path
                  d="M 200 150 Q 140 220 80 230"
                  fill="none"
                  stroke={verdict === "TRUE" ? "url(#supportGrad)" : "url(#neutralGrad)"}
                  strokeWidth="2"
                  strokeDasharray="4"
                  className="animate-dash"
                />

                {/* Center Claim Node */}
                <circle cx="200" cy="150" r="26" fill="#0B1220" stroke="#334155" strokeWidth="2" />
                <text fill="#ffffff" fontFamily="IBM Plex Sans" fontSize="10" fontWeight="700" textAnchor="middle" x="200" y="154">
                  CLAIM
                </text>

                {/* Source Nodes */}
                <circle cx="320" cy="70" r="18" fill="#ffffff" stroke={verdict === "FALSE" ? "#DC2626" : "#64748B"} strokeWidth="2.5" />
                <text fill="#0B1220" fontFamily="IBM Plex Sans" fontSize="11" fontWeight="700" textAnchor="middle" x="320" y="74">
                  S1
                </text>

                <circle cx="320" cy="230" r="18" fill="#ffffff" stroke={verdict === "FALSE" ? "#DC2626" : "#15803D"} strokeWidth="2.5" />
                <text fill="#0B1220" fontFamily="IBM Plex Sans" fontSize="11" fontWeight="700" textAnchor="middle" x="320" y="234">
                  S2
                </text>

                <circle cx="80" cy="230" r="18" fill="#ffffff" stroke={verdict === "TRUE" ? "#15803D" : "#64748B"} strokeWidth="2.5" />
                <text fill="#0B1220" fontFamily="IBM Plex Sans" fontSize="11" fontWeight="700" textAnchor="middle" x="80" y="234">
                  O1
                </text>
              </svg>
            </div>

            {/* Graph Legend */}
            <div className="w-full flex items-center justify-between px-2 pt-2 border-t border-border font-mono text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-verdict-false" /> Contradicts Claim
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-verdict-true" /> Supports Origin
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-verdict-unverified" /> Contextual Record
              </span>
            </div>
          </div>

          {/* Evidence Cards List */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
              Auditable Evidence Citations ({evidenceItems?.length || 0})
            </h4>

            {(!evidenceItems || evidenceItems.length === 0) ? (
              <div className="text-center py-6 text-xs text-muted-foreground font-mono">
                No external evidence citations recorded.
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
                    className={`relative p-4 rounded-lg border transition-all text-left space-y-2 bg-card overflow-hidden ${
                      hoveredNodeId === item.id
                        ? "border-primary shadow-sm"
                        : isHovered
                        ? "border-border"
                        : "border-border/50 opacity-60"
                    }`}
                  >
                    {/* Left Reliability Color Strip */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{
                        backgroundColor:
                          item.relationship === "CONTRADICTS"
                            ? "#DC2626"
                            : item.relationship === "SUPPORTS"
                            ? "#15803D"
                            : "#64748B",
                      }}
                    />

                    <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-1.5 ml-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-bold text-foreground truncate">
                          {item.publisher || "Primary Source"}
                        </span>
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-border bg-secondary text-muted-foreground truncate">
                          {item.source_type?.replace("TIER_", "TIER ") || "TIER 2"}
                        </span>
                      </div>
                      <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded ${rel.bg}`}>
                        {rel.label}
                      </span>
                    </div>

                    <p className="text-xs text-foreground italic border-l-2 border-border pl-2 py-0.5 ml-1 leading-relaxed">
                      &ldquo;{item.evidence_text}&rdquo;
                    </p>

                    <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground ml-1 pt-1">
                      <span>CONFIDENCE: {Math.round((item.reliability_score || 0.85) * 100)}%</span>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-blue hover:underline inline-flex items-center gap-1 font-semibold"
                        >
                          <span>Inspect Record</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
