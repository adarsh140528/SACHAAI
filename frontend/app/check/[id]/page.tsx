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
      {/* Top Navigation & Report Meta Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-secondary border border-border"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="font-bold text-foreground">
              Investigation #{check.check_id?.slice(0, 8) || "REPORT"}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border font-bold">
              {check.input_type || "TEXT CLAIM"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert("Investigation report URL copied to clipboard!");
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-secondary transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" /> Share Report
          </button>
        </div>
      </div>

      {/* Hero Verdict Banner (Stitch Spec) */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border bg-secondary/30 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="px-3.5 py-1 rounded-full font-mono text-xs font-extrabold tracking-wider border"
              style={{
                backgroundColor:
                  verdict === "TRUE"
                    ? "rgba(21, 128, 61, 0.1)"
                    : verdict === "FALSE"
                    ? "rgba(220, 38, 38, 0.1)"
                    : verdict === "MISLEADING"
                    ? "rgba(217, 119, 6, 0.1)"
                    : "rgba(100, 116, 139, 0.1)",
                color:
                  verdict === "TRUE"
                    ? "#15803D"
                    : verdict === "FALSE"
                    ? "#DC2626"
                    : verdict === "MISLEADING"
                    ? "#D97706"
                    : "#64748B",
                borderColor:
                  verdict === "TRUE"
                    ? "rgba(21, 128, 61, 0.2)"
                    : verdict === "FALSE"
                    ? "rgba(220, 38, 38, 0.2)"
                    : verdict === "MISLEADING"
                    ? "rgba(217, 119, 6, 0.2)"
                    : "rgba(100, 116, 139, 0.2)",
              }}
            >
              VERDICT: {verdict}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              Confidence: <strong className="text-foreground font-semibold">{confidence}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] text-muted-foreground">
            <span>AUDIT TIME: {check.processing_time_ms || 120}ms</span>
            <span>SOURCES: {allEvidence.length}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Claim Analyzed Quote Box */}
          <div className="space-y-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Claim Analyzed
            </span>
            <p
              className="text-base sm:text-lg font-medium italic border-l-4 pl-4 py-1 text-foreground leading-relaxed"
              style={{
                borderColor:
                  verdict === "TRUE"
                    ? "#15803D"
                    : verdict === "FALSE"
                    ? "#DC2626"
                    : verdict === "MISLEADING"
                    ? "#D97706"
                    : "#64748B",
              }}
            >
              &ldquo;{check.raw_input}&rdquo;
            </p>
          </div>

          {/* Forensic Evidence Rationale */}
          <div className="p-5 rounded-lg border border-border bg-secondary/20 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary font-mono">
              <ShieldCheck className="h-4 w-4 text-accent-blue" />
              <span>Forensic Verification Analysis</span>
            </div>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-line">
              {reasoning}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive SVG Evidence Graph */}
      <EvidenceGraph
        claimText={check.raw_input}
        verdict={verdict}
        confidence={confidence}
        evidenceItems={allEvidence}
      />

      {/* Methodology Banner */}
      <div className="rounded-xl border border-border bg-secondary/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground font-sans">
              SACHAI Verification Methodology
            </h4>
            <p className="text-xs text-muted-foreground">
              Review our 11-stage pipeline, source credibility ranking, and clustering algorithms.
            </p>
          </div>
        </div>
        <Link
          href="/developers"
          className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-semibold text-foreground transition-colors shrink-0"
        >
          View Documentation →
        </Link>
      </div>

      {/* Metadata & Feedback Footer */}
      <div className="rounded-lg border border-border bg-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-mono">
        <div className="space-y-0.5 text-center sm:text-left">
          <div>Report Hash: <span className="text-foreground">{check.check_id}</span></div>
          <div>Verified: <span className="text-foreground">{formatDate(check.completed_at || check.created_at)}</span></div>
        </div>

        {/* Feedback Widget */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-sans">Helpful report?</span>
          <button
            onClick={() => handleFeedback(true)}
            className={`p-1.5 rounded border transition-all ${
              feedbackSent === true
                ? "bg-verdict-true text-white border-verdict-true"
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
                ? "bg-verdict-false text-white border-verdict-false"
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
