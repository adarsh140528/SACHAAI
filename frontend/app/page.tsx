"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  FileText,
  ImageIcon,
  MessageSquare,
  Globe,
  Network,
  CheckCircle2,
  Lock,
  ArrowRight,
  Gavel,
  Newspaper,
  CheckSquare,
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  Layers,
  Activity,
  Check,
  XCircle,
  BarChart2,
  History,
  Terminal,
  UserCheck
} from "lucide-react";
import ClaimChecker from "@/components/checker/ClaimChecker";
import EvidenceOrbit3D from "@/components/landing/EvidenceOrbit3D";
import InputShowcase from "@/components/landing/InputShowcase";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("sachai_token");
        const userRaw = localStorage.getItem("sachai_user");
        setIsLoggedIn(!!token);
        if (userRaw) {
          try {
            const u = JSON.parse(userRaw);
            setUserName(u.full_name || u.email?.split("@")[0] || "Analyst");
          } catch {
            setUserName("Analyst");
          }
        }
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const scrollToChecker = () => {
    const el = document.getElementById("verify-input");
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Investigation Section (Adaptive: Pro Workbench after Login / 2-Column Hero before Login) */}
      <section className="relative pt-8 sm:pt-12 pb-14 sm:pb-16 border-b border-border bg-background overflow-hidden">
        {/* Subtle Fine Grid Texture */}
        <div className="absolute inset-0 bg-fine-grid opacity-40 pointer-events-none" />

        <div className="container max-w-container-max mx-auto px-4 sm:px-8 relative z-10">
          {isLoggedIn ? (
            /* Logged In: Streamlined Pro Investigation Workstation */
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Pro Workspace Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-verdict-true animate-pulse" />
                    <span className="font-mono text-[11px] font-bold text-accent-blue uppercase tracking-wider">
                      Forensic Investigation Workspace
                    </span>
                    <span className="text-border">•</span>
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                      <UserCheck className="h-3.5 w-3.5 text-verdict-true" /> {userName}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-sans">
                    New Claim Investigation
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Submit text claims, OCR screenshots, news URLs, or WhatsApp forwards for automated 11-stage verification.
                  </p>
                </div>

                {/* Quick Navigation Shortcuts */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/dashboard"
                    className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-semibold text-foreground transition-colors inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <BarChart2 className="h-3.5 w-3.5 text-accent-blue" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/history"
                    className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-semibold text-foreground transition-colors inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <History className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>History</span>
                  </Link>
                  <Link
                    href="/developers"
                    className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-semibold text-foreground transition-colors inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>API</span>
                  </Link>
                </div>
              </div>

              {/* Full Width Centered Claim Checker */}
              <div className="w-full">
                <ClaimChecker />
              </div>
            </div>
          ) : (
            /* Logged Out: 2-Column Editorial Landing Hero */
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              {/* Left Column: Headline & Value Proposition */}
              <div className="flex-1 flex flex-col gap-4 relative z-20 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-secondary w-max rounded-full border border-border shadow-sm mb-2">
                  <span className="w-2 h-2 rounded-full bg-verdict-true animate-pulse" />
                  <span className="font-mono text-[11px] font-semibold text-foreground uppercase tracking-widest">
                    v2.1 Verification Engine Online
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-[60px] leading-[1.1] font-extrabold text-foreground tracking-tight font-sans">
                  Don&apos;t just believe it.<br />
                  <span className="text-accent-blue relative inline-block">
                    Verify it.
                    <span className="absolute bottom-1 left-0 w-full h-1 bg-accent-blue/30 -z-10 transform -skew-x-12" />
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground max-w-xl mt-2 leading-relaxed">
                  Verify claims, news, images and forwards using evidence from trusted sources. The gold standard in algorithmic verification.
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={scrollToChecker}
                    className="bg-primary text-primary-foreground font-semibold text-xs px-6 py-3 rounded-lg hover:opacity-90 transition-all shadow-md shadow-primary/10 flex items-center gap-2 group"
                  >
                    <span>Start Investigation</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Right Column: Ingestion Centerpiece */}
              <div className="flex-1 w-full relative z-10 flex justify-end">
                <ClaimChecker />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trust & Methodology Section (Exact Stitch Spec) */}
      <section id="methodology" className="py-16 sm:py-20 border-b border-border bg-card/60 relative z-20">
        <div className="container max-w-container-max mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column: 3-Step Methodology Thread */}
            <div className="flex flex-col gap-5">
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-sans">
                  Evidence over guesswork.
                </h2>
                <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                  Our methodology relies on transparent, auditable paths to truth. We cross-reference claims against authoritative databases, verified reporting, and primary source documents.
                </p>
              </div>

              {/* Vertical Step Thread */}
              <div className="mt-4 flex flex-col gap-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
                {/* Step 1 */}
                <div className="flex gap-4 relative z-10 group">
                  <div className="w-6 h-6 rounded-full bg-card border-2 border-primary flex items-center justify-center mt-1 group-hover:bg-primary transition-colors shrink-0">
                    <Gavel className="h-3 w-3 text-primary group-hover:text-card" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground font-sans">Primary Sources</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Direct data from institutional repositories (RBI, WHO, Supreme Court, Gov.in gazettes).
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 relative z-10 group">
                  <div className="w-6 h-6 rounded-full bg-card border-2 border-border flex items-center justify-center mt-1 group-hover:border-primary transition-colors shrink-0">
                    <Newspaper className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground font-sans">Independent Reporting</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Cross-verification with globally recognized journalistic standards (Reuters, AP, PTI).
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 relative z-10 group">
                  <div className="w-6 h-6 rounded-full bg-card border-2 border-border flex items-center justify-center mt-1 group-hover:border-primary transition-colors shrink-0">
                    <CheckSquare className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground font-sans">Fact Checks</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Aggregation and matching of certified fact-checking networks (IFCN).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Result Preview Box */}
            <div className="bg-card border border-border rounded-lg shadow-xl flex flex-col overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-verdict-false/5 to-transparent pointer-events-none" />

              <div className="border-b border-border bg-secondary/30 px-5 py-3 flex justify-between items-center">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  Analysis Report #A892-F
                </span>
                <div className="bg-verdict-false/10 text-verdict-false font-mono text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-verdict-false/20">
                  <XCircle className="h-3.5 w-3.5" /> FALSE
                </div>
              </div>

              <div className="p-5 flex flex-col gap-4 bg-card">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                    Claim Analyzed
                  </span>
                  <p className="text-sm text-foreground italic border-l-4 border-verdict-false/60 pl-3 py-0.5 leading-relaxed">
                    &ldquo;The Reserve Bank of India has introduced a new ₹1000 note featuring a completely different design, effective next month.&rdquo;
                  </p>
                </div>

                <div className="h-px w-full bg-border my-1" />

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      Primary Evidence
                    </span>
                    <span className="font-mono text-[11px] text-verdict-true flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Source Authentic
                    </span>
                  </div>

                  <div className="bg-secondary/40 border-l-2 border-primary p-3.5 rounded-r relative space-y-1.5 shadow-inner">
                    <span className="font-mono text-[10px] text-muted-foreground absolute top-2.5 right-3 uppercase tracking-widest font-bold">
                      RBI.ORG.IN
                    </span>
                    <p className="text-xs text-foreground pr-12 leading-relaxed italic">
                      &ldquo;There is no proposal to reintroduce ₹1000 notes. Notifications circulating on social media regarding a new design are fake and unauthorized.&rdquo;
                    </p>
                    <div className="mt-2 flex items-center gap-4 font-mono text-[10px] text-muted-foreground pt-1">
                      <span>RETRIEVED: 2026-08-20</span>
                      <span>CONFIDENCE: 99.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Visual Provenance Section */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container max-w-6xl px-4 sm:px-8 mx-auto space-y-4">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent-blue font-mono">
              Visual Provenance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-sans">
              See the Evidence Behind Every Verdict
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              We do not ask &ldquo;What does an AI model think?&rdquo; — We construct an auditable evidence trail from independent primary publications.
            </p>
          </div>

          <EvidenceOrbit3D />
        </div>
      </section>

      {/* Multimodal Input Types Showcase */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container max-w-6xl px-4 sm:px-8 mx-auto">
          <InputShowcase />
        </div>
      </section>
    </div>
  );
}

