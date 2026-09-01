"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Clock,
  ExternalLink,
  ArrowLeft,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Layers,
  Sparkles,
  Info,
  Calendar,
  Building2,
  Cpu,
  RefreshCw
} from "lucide-react";
import { getCheckById } from "@/lib/api";
import { formatDate, getVerdictBadgeClass, getConfidenceBadgeClass } from "@/lib/utils";
import EvidenceGraph from "@/components/graph/EvidenceGraph";

export default function CheckResultPage() {
  const params = useParams();
  const router = useRouter();
  const checkId = params.id as string;

  const [check, setCheck] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedbackSent, setFeedbackSent] = useState<boolean | null>(null);

  useEffect(() => {
    if (!checkId) return;
    setLoading(true);
    getCheckById(checkId)
      .then((data) => {
        setCheck(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load verification result.");
        setLoading(false);
      });
  }, [checkId]);

  const handleFeedback = (useful: boolean) => {
    setFeedbackSent(useful);
    // Submit feedback asynchronously to backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ check_id: checkId, is_useful: useful }),
    }).catch(() => {});
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
        <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">
          Loading evidence-backed verification report...
        </p>
      </div>
    );
  }

  if (error || !check) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 max-w-md mx-auto text-center">
        <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
          <XCircle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Result Not Found</h2>
        <p className="text-sm text-muted-foreground">{error || "The requested verification check does not exist."}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500"
        >
          <ArrowLeft className="h-4 w-4" /> Verify a New Claim
        </Link>
      </div>
    );
  }

  const primaryClaim = check.claims?.[0];
  const verdict = check.overall_verdict || primaryClaim?.verdict?.verdict || "UNVERIFIED";
  const confidence = check.overall_confidence || primaryClaim?.verdict?.confidence || "LOW";
  const reasoning = check.overall_summary || primaryClaim?.verdict?.reasoning || "Verification complete.";
  const allEvidence = primaryClaim?.evidence || [];

  const getVerdictIcon = (v: string) => {
    switch (v?.toUpperCase()) {
      case "TRUE": return <CheckCircle2 className="h-8 w-8 text-emerald-500" />;
      case "FALSE": return <XCircle className="h-8 w-8 text-rose-500" />;
      case "MISLEADING": return <AlertTriangle className="h-8 w-8 text-amber-500" />;
      case "PARTLY_TRUE": return <AlertTriangle className="h-8 w-8 text-orange-500" />;
      case "OUTDATED": return <Clock className="h-8 w-8 text-blue-500" />;
      default: return <HelpCircle className="h-8 w-8 text-slate-500" />;
    }
  };

  return (
    <div className="container max-w-5xl px-4 py-8 sm:py-12 space-y-8">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Check Another Claim
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert("Verification link copied to clipboard!");
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/80 text-xs font-semibold hover:bg-secondary transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" /> Share Report
          </button>
        </div>
      </div>

      {/* Hero Verdict Banner */}
      <div className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl p-6 sm:p-10 shadow-xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div className="flex items-center gap-4">
            {getVerdictIcon(verdict)}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Final Deterministic Verdict
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {verdict}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Evidence Confidence
              </div>
              <div className="text-xs font-bold text-foreground">{confidence}</div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getConfidenceBadgeClass(confidence)}`}>
              {confidence} CONFIDENCE
            </span>
          </div>
        </div>

        {/* Claim Text */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Submitted Claim
          </span>
          <p className="text-lg sm:text-xl font-semibold text-foreground leading-snug">
            &quot;{check.raw_input}&quot;
          </p>
        </div>

        {/* Why this verdict? Explainable Reasoning */}
        <div className="p-5 sm:p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-4 w-4" /> Why this verdict?
          </div>
          <p className="text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-line">
            {reasoning}
          </p>
        </div>
      </div>

      {/* Interactive Evidence Graph */}
      <EvidenceGraph
        claimText={check.raw_input}
        verdict={verdict}
        confidence={confidence}
        evidenceItems={allEvidence}
      />

      {/* Verification Process Stage Checklist */}
      <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
          <Layers className="h-4 w-4 text-emerald-500" /> Verification Process Stages
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-secondary/50 border border-border/60 flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Factual claim extracted & normalized</span>
          </div>
          <div className="p-3 rounded-xl bg-secondary/50 border border-border/60 flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Fact-Check Tools API queried</span>
          </div>
          <div className="p-3 rounded-xl bg-secondary/50 border border-border/60 flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Multi-angle web searches executed</span>
          </div>
          <div className="p-3 rounded-xl bg-secondary/50 border border-border/60 flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Sources ranked & syndicated clustered</span>
          </div>
          <div className="p-3 rounded-xl bg-secondary/50 border border-border/60 flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Atomic evidence extracted</span>
          </div>
          <div className="p-3 rounded-xl bg-secondary/50 border border-border/60 flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Evidence relationships classified</span>
          </div>
          <div className="p-3 rounded-xl bg-secondary/50 border border-border/60 flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Deterministic verdict computed</span>
          </div>
          <div className="p-3 rounded-xl bg-secondary/50 border border-border/60 flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Explainable summary synthesized</span>
          </div>
        </div>
      </div>

      {/* Retrieved Evidence Sources */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            Evaluated Evidence Sources ({allEvidence.length})
          </h3>
          <span className="text-xs text-muted-foreground font-mono">
            Sorted by Source Reliability Weight
          </span>
        </div>

        <div className="space-y-3">
          {allEvidence.map((ev: any, idx: number) => {
            const relBadgeClass = getVerdictBadgeClass(
              ev.relationship === "SUPPORTS" ? "TRUE" : ev.relationship === "CONTRADICTS" ? "FALSE" : "MISLEADING"
            );
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm p-5 space-y-3 hover:border-border transition-colors shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-bold text-sm text-foreground">{ev.publisher}</span>
                    <span className="text-xs font-mono text-muted-foreground">({ev.domain})</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/60 uppercase">
                      {ev.source_type?.replace("TIER_", "Tier ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold border ${relBadgeClass}`}>
                      {ev.relationship}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed bg-secondary/30 p-3.5 rounded-xl border border-border/40 font-serif">
                  &ldquo;{ev.evidence_text}&rdquo;
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <div className="flex items-center gap-4">
                    <span>Reliability: <strong className="text-foreground">{Math.round(ev.reliability_score * 100)}%</strong></span>
                    <span>Relevance: <strong className="text-foreground">{Math.round(ev.relevance_score * 100)}%</strong></span>
                  </div>
                  <a
                    href={ev.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-500 hover:text-emerald-400 font-semibold inline-flex items-center gap-1 hover:underline"
                  >
                    View Source <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verification Details & Metadata Footer */}
      <div className="rounded-2xl border border-border/60 bg-secondary/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="space-y-1 text-center sm:text-left">
          <div>Check ID: <span className="font-mono text-foreground">{check.check_id}</span></div>
          <div>Completed at: <span className="text-foreground">{formatDate(check.completed_at || check.created_at)}</span> ({check.processing_time_ms}ms)</div>
        </div>

        {/* Feedback Widget */}
        <div className="flex items-center gap-3">
          <span className="font-medium text-foreground">Was this verdict useful?</span>
          <button
            onClick={() => handleFeedback(true)}
            className={`p-2 rounded-lg border transition-all ${
              feedbackSent === true
                ? "bg-emerald-500 text-white border-emerald-600"
                : "bg-card hover:bg-secondary border-border text-muted-foreground hover:text-foreground"
            }`}
            title="Yes, accurate"
          >
            <ThumbsUp className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleFeedback(false)}
            className={`p-2 rounded-lg border transition-all ${
              feedbackSent === false
                ? "bg-rose-500 text-white border-rose-600"
                : "bg-card hover:bg-secondary border-border text-muted-foreground hover:text-foreground"
            }`}
            title="No, inaccurate"
          >
            <ThumbsDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
