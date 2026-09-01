"use client";

import { useState } from "react";
import { Network, ChevronDown, ChevronUp, ExternalLink, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, HelpCircle } from "lucide-react";

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
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const getVerdictColor = (v: string) => {
    switch (v?.toUpperCase()) {
      case "TRUE": return "#10b981";
      case "FALSE": return "#ef4444";
      case "MISLEADING": return "#f59e0b";
      case "PARTLY_TRUE": return "#f97316";
      case "OUTDATED": return "#3b82f6";
      default: return "#6b7280";
    }
  };

  const getRelColor = (rel: string) => {
    switch (rel?.toUpperCase()) {
      case "SUPPORTS": return "#10b981";
      case "CONTRADICTS": return "#ef4444";
      case "PARTIALLY_SUPPORTS":
      case "PARTIALLY_CONTRADICTS": return "#f59e0b";
      default: return "#94a3b8";
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Network className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-foreground">
              Interactive Evidence Graph
            </h3>
            <p className="text-xs text-muted-foreground">
              Visual provenance tracing claim $\to$ sources $\to$ relationships $\to$ verdict
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-secondary transition-colors"
        >
          {isCollapsed ? (
            <>
              <span>Show Graph</span>
              <ChevronDown className="h-4 w-4" />
            </>
          ) : (
            <>
              <span>Collapse</span>
              <ChevronUp className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Visual SVG Flow Representation */}
          <div className="w-full overflow-x-auto py-2">
            <div className="min-w-[650px] flex flex-col items-center gap-6">
              {/* Root Node: User Claim */}
              <div className="max-w-md w-full p-4 rounded-xl border border-border bg-secondary/70 shadow-sm text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                  Submitted Claim
                </span>
                <p className="text-xs sm:text-sm font-medium text-foreground line-clamp-2">
                  &quot;{claimText}&quot;
                </p>
              </div>

              {/* Connecting Edges Down to Sources */}
              <div className="w-full flex justify-center items-center relative">
                <div className="h-6 w-0.5 bg-border" />
              </div>

              {/* Sources Layer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
                {evidenceItems.slice(0, 3).map((item, idx) => {
                  const color = getRelColor(item.relationship);
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedNode(item)}
                      className="cursor-pointer p-3 rounded-xl border border-border bg-card/80 hover:border-emerald-500/50 hover:bg-secondary/40 transition-all text-left shadow-sm relative group"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-muted-foreground truncate">
                          {item.publisher || "Source"}
                        </span>
                        <span
                          className="text-[9px] font-extrabold px-1.5 py-0.5 rounded border"
                          style={{
                            color: color,
                            borderColor: `${color}40`,
                            backgroundColor: `${color}15`,
                          }}
                        >
                          {item.relationship}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">
                        {item.evidence_text}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Connecting Edges Down to Verdict */}
              <div className="w-full flex justify-center items-center relative">
                <div className="h-6 w-0.5 bg-border" />
              </div>

              {/* Final Aggregated Verdict Node */}
              <div
                className="px-6 py-3 rounded-2xl border shadow-lg flex items-center gap-3 text-center"
                style={{
                  borderColor: `${getVerdictColor(verdict)}40`,
                  backgroundColor: `${getVerdictColor(verdict)}10`,
                }}
              >
                <div className="text-left">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Deterministic Verdict
                  </div>
                  <div
                    className="text-base font-extrabold"
                    style={{ color: getVerdictColor(verdict) }}
                  >
                    {verdict}
                  </div>
                </div>
                <div className="pl-3 border-l border-border/60 text-left">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Evidence Confidence
                  </div>
                  <div className="text-xs font-bold text-foreground">
                    {confidence}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Node Details Drawer */}
          {selectedNode && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground text-sm">
                  {selectedNode.publisher} ({selectedNode.source_type})
                </span>
                <a
                  href={selectedNode.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-500 hover:underline flex items-center gap-1 font-semibold"
                >
                  View Source <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {selectedNode.evidence_text}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
