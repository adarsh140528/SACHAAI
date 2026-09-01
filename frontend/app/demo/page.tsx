"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Globe,
  ImageIcon,
  Layers
} from "lucide-react";
import { getVerdictBadgeClass } from "@/lib/utils";

export default function DemoPage() {
  const [demoCases, setDemoCases] = useState<any[]>([]);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetch(`${API_URL}/api/v1/demo`)
      .then((res) => res.json())
      .then((data) => {
        setDemoCases(data);
        if (data.length > 0) setSelectedCase(data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Demo load error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container max-w-7xl px-4 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" /> Interactive Demonstration Suite
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Test Case Showcase
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Prepared real-world benchmark examples demonstrating how SACHAI evaluates evidence across all verdict categories and modalities.
        </p>
      </div>

      {/* Grid: Demo Case Selectors on Left, Detailed Result Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Case Selector Sidebar */}
        <div className="lg:col-span-5 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            Select a Scenario
          </span>

          <div className="space-y-2">
            {demoCases.map((item) => {
              const isSelected = selectedCase?.demo_id === item.demo_id;
              const relClass = getVerdictBadgeClass(item.verdict);
              return (
                <div
                  key={item.demo_id}
                  onClick={() => setSelectedCase(item)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all text-left space-y-2 ${
                    isSelected
                      ? "border-emerald-500/80 bg-secondary/80 shadow-md shadow-emerald-500/10"
                      : "border-border/80 bg-card/60 hover:bg-secondary/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-foreground">
                      {item.title}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${relClass}`}>
                      {item.verdict}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    &quot;{item.raw_input}&quot;
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Report Inspector */}
        <div className="lg:col-span-7 sticky top-20 space-y-6">
          {selectedCase && (
            <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-xl space-y-6 animate-in fade-in duration-200">
              {/* Badge & Mode Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase">
                  <span className="px-2 py-0.5 rounded bg-secondary border border-border font-bold">
                    DEMO MODE
                  </span>
                  <span>•</span>
                  <span>{selectedCase.input_type}</span>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getVerdictBadgeClass(selectedCase.verdict)}`}>
                  {selectedCase.verdict} ({selectedCase.confidence} CONFIDENCE)
                </span>
              </div>

              {/* Stated Claim */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Evaluated Claim
                </span>
                <p className="text-base font-bold text-foreground leading-snug">
                  &quot;{selectedCase.raw_input}&quot;
                </p>
              </div>

              {/* Explainable AI Reasoning */}
              <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-500">
                  <Sparkles className="h-4 w-4" /> Why this verdict?
                </div>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {selectedCase.summary}
                </p>
              </div>

              {/* Retrieved Evidence Sources */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Retrieved Primary Sources & Evidence
                </span>

                {selectedCase.evidence.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
                    No reliable primary evidence available for this unverified rumor.
                  </div>
                ) : (
                  selectedCase.evidence.map((ev: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl border border-border bg-secondary/30 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-foreground">{ev.publisher}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getVerdictBadgeClass(ev.relationship === "SUPPORTS" ? "TRUE" : "FALSE")}`}>
                          {ev.relationship}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground italic font-serif">
                        &ldquo;{ev.evidence_text}&rdquo;
                      </p>
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-emerald-500 hover:underline inline-flex items-center gap-1 font-semibold"
                      >
                        Inspect Official Citation <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
