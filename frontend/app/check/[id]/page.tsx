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
  Info,
  Calendar,
  Building2,
  Activity,
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
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ check_id: checkId, is_useful: useful }),
    }).catch(() => {});
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-3">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">Evaluating primary evidence and computing verdict...</p>
      </div>
    );
  }

  if (error || !check) {
    return (
      <div className="container max-w-lg px-4 py-20 mx-auto text-center space-y-4">
        <div className="h-12 w-12 rounded-xl bg-destructive/10 text-destructive mx-auto flex items-center justify-center">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Result Not Found</h2>
        <p className="text-sm text-muted-foreground">{error || "The requested verification check does not exist."}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90"
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
      case "TRUE": return <CheckCircle2 className="h-8 w-8 text-emerald-600" />;
      case "FALSE": return <XCircle className="h-8 w-8 text-rose-600" />;
      case "MISLEADING": return <AlertTriangle className="h-8 w-8 text-amber-600" />;
      case "PARTLY_TRUE": return <AlertTriangle className="h-8 w-8 text-orange-600" />;
      case "OUTDATED": return <Clock className="h-8 w-8 text-blue-600" />;
      default: return <HelpCircle className="h-8 w-8 text-slate-500" />;
    }
  };

  return (
    <div className="container max-w-5xl px-4 py-8 sm:py-12 space-y-8">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Check Another Claim
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert("Verification report URL copied to clipboard!");
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-secondary transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" /> Share Report
          </button>
        </div>
      </div>

      {/* Hero Verdict Banner */}
      <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            {getVerdictIcon(verdict)}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Deterministic Verdict
              </div>
              <div className="text-3xl font-extrabold tracking-tight text-foreground">
                {verdict}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className={`px-3 py-1 rounded-md text-xs font-bold border ${getConfidenceBadgeClass(confidence)}`}>
              {confidence} CONFIDENCE
            </span>
          </div>
        </div>

        {/* Claim Text */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Subject Assertion Under Verification
          </span>
          <p className="text-base sm:text-lg font-semibold text-foreground leading-snug">
            &ldquo;{check.raw_input}&rdquo;
          </p>
        </div>

        {/* 4-Part Editorial "Why this verdict?" Section */}
        <div className="p-5 rounded-lg border border-border bg-secondary/30 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-4 w-4" /> Investigation Summary & Evidence Rationale
          </div>
          <p className="text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-line">
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

      {/* Evaluated Evidence Sources */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold tracking-tight text-foreground">
            Evaluated Primary Citations ({allEvidence.length})
          </h3>
          <span className="text-xs text-muted-foreground font-mono">
            Ranked by Source Reliability Weight
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
                className="rounded-lg border border-border bg-card p-4 space-y-2.5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-bold text-xs text-foreground">{ev.publisher}</span>
                    <span className="text-[11px] font-mono text-muted-foreground">({ev.domain})</span>
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded border border-border bg-secondary text-muted-foreground uppercase">
                      {ev.source_type?.replace("TIER_", "Tier ")}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${relBadgeClass}`}>
                    {ev.relationship}
                  </span>
                </div>

                <p className="text-xs text-foreground/90 leading-relaxed bg-secondary/30 p-3 rounded border border-border/60">
                  &ldquo;{ev.evidence_text}&rdquo;
                </p>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <div className="flex items-center gap-4">
                    <span>Reliability: <strong className="text-foreground">{Math.round(ev.reliability_score * 100)}%</strong></span>
                    <span>Relevance: <strong className="text-foreground">{Math.round(ev.relevance_score * 100)}%</strong></span>
                  </div>
                  <a
                    href={ev.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    <span>Inspect Source</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Metadata & Feedback Footer */}
      <div className="rounded-lg border border-border bg-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="space-y-0.5 text-center sm:text-left">
          <div>Verification ID: <span className="font-mono text-foreground">{check.check_id}</span></div>
          <div>Completed at: <span className="text-foreground">{formatDate(check.completed_at || check.created_at)}</span> ({check.processing_time_ms}ms)</div>
        </div>

        {/* Feedback Widget */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Was this report useful?</span>
          <button
            onClick={() => handleFeedback(true)}
            className={`p-1.5 rounded border transition-all ${
              feedbackSent === true
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-card hover:bg-secondary border-border text-muted-foreground"
            }`}
            title="Accurate"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleFeedback(false)}
            className={`p-1.5 rounded border transition-all ${
              feedbackSent === false
                ? "bg-rose-600 text-white border-rose-600"
                : "bg-card hover:bg-secondary border-border text-muted-foreground"
            }`}
            title="Inaccurate"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
