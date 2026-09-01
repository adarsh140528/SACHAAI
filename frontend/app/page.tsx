"use client";

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
  TrendingUp,
  Award,
  Clock,
  Layers,
  Activity,
  Check
} from "lucide-react";
import ClaimChecker from "@/components/checker/ClaimChecker";
import EvidenceOrbit3D from "@/components/landing/EvidenceOrbit3D";
import InputShowcase from "@/components/landing/InputShowcase";

export default function HomePage() {
  const scrollToChecker = () => {
    const el = document.getElementById("checker-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Editorial Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-20 overflow-hidden border-b border-border/60">
        {/* Subtle Fine Grid Texture */}
        <div className="absolute inset-0 bg-fine-grid opacity-60 pointer-events-none" />

        <div className="container max-w-5xl px-4 sm:px-8 mx-auto text-center space-y-6 relative z-10">
          {/* Minimalist Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-secondary/80 text-foreground text-xs font-semibold tracking-wide uppercase">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Deterministic Evidence & Verification Engine</span>
          </div>

          {/* Core Product Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15] text-foreground">
            Don&apos;t just believe it. <br />
            <span className="text-primary">
              Verify it.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Verify claims, news, viral images, and forwarded messages using primary records and transparent evidence you can inspect.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={scrollToChecker}
              className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
            >
              <span>Check a Claim</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#how-it-works"
              className="px-6 py-2.5 rounded-lg border border-border bg-card hover:bg-secondary text-foreground font-semibold text-sm transition-colors"
            >
              See How It Works
            </a>
          </div>

          {/* Interactive Claim Checker Container */}
          <div id="checker-section" className="pt-8 text-left">
            <ClaimChecker />
          </div>
        </div>
      </section>

      {/* Trust & Source Reliability Strip */}
      <section className="border-b border-border/60 bg-secondary/30 py-6">
        <div className="container max-w-6xl px-4 sm:px-8 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center sm:text-left">
            <div className="space-y-0.5 border-r border-border/40 last:border-r-0 pr-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Tier 1 Primary</span>
              <p className="text-xs font-semibold text-foreground">Government Gazettes & Statutory Bodies</p>
            </div>
            <div className="space-y-0.5 border-r border-border/40 last:border-r-0 pr-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Tier 2 News</span>
              <p className="text-xs font-semibold text-foreground">Established Wire Services (Reuters, AP, PTI)</p>
            </div>
            <div className="space-y-0.5 border-r border-border/40 last:border-r-0 pr-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Tier 3 Fact-Checks</span>
              <p className="text-xs font-semibold text-foreground">IFCN Certified Fact Checkers (AltNews, Boom)</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Independence</span>
              <p className="text-xs font-semibold text-foreground">Syndication Clustering (10 Reprints = 1 Source)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Evidence Orbit & Provenance Map */}
      <section className="py-16 bg-background border-b border-border/60">
        <div className="container max-w-6xl px-4 sm:px-8 mx-auto space-y-4">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Visual Provenance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              See the Evidence Behind Every Verdict
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              We do not ask &ldquo;What does an AI model think?&rdquo; — We construct an auditable evidence trail from independent primary publications.
            </p>
          </div>

          <EvidenceOrbit3D />
        </div>
      </section>

      {/* The Problem Narrative: Information moves fast */}
      <section className="py-16 bg-secondary/20 border-b border-border/60">
        <div className="container max-w-5xl px-4 sm:px-8 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                The Problem & Solution
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
                Information moves fast. <br />Truth takes evidence.
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Misinformation spreads across social channels because emotional rhetoric mimics authority. Large Language Models often hallucinate verdicts when asked to evaluate claims in isolation.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                SACHAI separates <strong>language understanding</strong> from <strong>truth determination</strong>. AI extracts factual assertions, while a deterministic mathematical engine evaluates verified evidence.
              </p>
            </div>

            {/* Visual Process Contrast */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                  Typical AI Wrapper Flaw
                </span>
                <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 text-xs font-mono space-y-1 text-muted-foreground">
                  <div>Input Claim ➔ Single LLM Prompt ➔ Hallucinated Opinion</div>
                  <div className="text-[10px] text-rose-600 font-semibold">• No citations • Outdated cutoff • No primary records</div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  The SACHAI Evidence Pipeline
                </span>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs font-mono space-y-1 text-foreground">
                  <div>Claim ➔ Parallel Search ➔ 5-Tier Ranking ➔ Math Verdict</div>
                  <div className="text-[10px] text-primary font-semibold">• Verifiable URLs • Gazette cross-referencing • Deterministic math</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multimodal Input Types Showcase */}
      <section className="py-16 bg-background border-b border-border/60">
        <div className="container max-w-6xl px-4 sm:px-8 mx-auto">
          <InputShowcase />
        </div>
      </section>

      {/* Editorial 5-Stage Timeline ("How It Works") */}
      <section id="how-it-works" className="py-16 bg-secondary/20 border-b border-border/60">
        <div className="container max-w-6xl px-4 sm:px-8 mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Pipeline Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              How SACHAI Verifies Claims
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              A transparent 5-stage verification sequence engineered for mathematical rigor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-xl bg-card border border-border space-y-2 shadow-sm">
              <span className="text-xs font-mono font-bold text-primary">01</span>
              <h3 className="text-sm font-bold text-foreground">Submit</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ingest claim, news article URL, screenshot, or forwarded chat.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-card border border-border space-y-2 shadow-sm">
              <span className="text-xs font-mono font-bold text-primary">02</span>
              <h3 className="text-sm font-bold text-foreground">Extract</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Strips emotional rhetoric and isolates atomic subject-predicate assertions.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-card border border-border space-y-2 shadow-sm">
              <span className="text-xs font-mono font-bold text-primary">03</span>
              <h3 className="text-sm font-bold text-foreground">Search</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Queries Google Fact Check Tools and live web across primary sources.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-card border border-border space-y-2 shadow-sm">
              <span className="text-xs font-mono font-bold text-primary">04</span>
              <h3 className="text-sm font-bold text-foreground">Compare</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ranks source credibility tiers and clusters syndicated wire reprints.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-card border border-border space-y-2 shadow-sm">
              <span className="text-xs font-mono font-bold text-primary">05</span>
              <h3 className="text-sm font-bold text-foreground">Verify</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Mathematical engine computes final verdict with confidence level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Methodology ("Evidence Over Guesswork") */}
      <section className="py-16 bg-background border-b border-border/60">
        <div className="container max-w-5xl px-4 sm:px-8 mx-auto text-center space-y-8">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Scientific Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Evidence Over Guesswork
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              When reliable evidence is insufficient or contradictory, SACHAI explicitly outputs <strong>UNVERIFIED</strong> rather than generating a guess.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm text-left grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                1. Primary Sources (1.00)
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Government gazettes, RBI, Supreme Court, ISRO, WHO. Direct statutory announcements take highest priority.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                2. Independent Reporting (0.85)
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Established editorial newsrooms (Reuters, AP, The Hindu). Wire copies are clustered to prevent artificial consensus.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                3. Fact Check Registries (0.85)
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                IFCN-signatory fact-checking organizations. Existing debunks are matched via Google Fact Check Tools API.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-secondary/30">
        <div className="container max-w-3xl px-4 text-center mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Before you share it, check it.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Give every viral quote, policy claim, and forwarded screenshot a chance to meet verified evidence.
          </p>
          <div className="pt-2">
            <button
              onClick={scrollToChecker}
              className="px-8 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-sm transition-all"
            >
              Start Verification Now →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
