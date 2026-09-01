"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Sparkles,
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
  Layers
} from "lucide-react";
import ClaimChecker from "@/components/checker/ClaimChecker";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="container max-w-6xl px-4 sm:px-8 mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-wide uppercase shadow-sm">
            <Sparkles className="h-3.5 w-3.5" /> Evidence-First AI Fact-Checking
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Don&apos;t Just Believe It. <br />
            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Verify It.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            AI-powered verification for claims, news, images, and URLs — backed by transparent evidence and primary sources you can inspect.
          </p>

          {/* Interactive Claim Checker Container */}
          <div className="pt-6">
            <ClaimChecker />
          </div>
        </div>
      </section>

      {/* Core Product Principle Banner (Section 71) */}
      <section className="border-y border-border/40 bg-secondary/30 py-8">
        <div className="container max-w-4xl px-4 text-center mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">
            The Fundamental SACHAI Principle
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            &ldquo;SACHAI.AI does not ask &lsquo;What does AI think?&rsquo; — It asks &lsquo;What does the available evidence show?&rsquo;&rdquo;
          </h2>
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            Gemini is used to reason over retrieved primary records and independent reporting, rather than fabricating ungrounded verdicts.
          </p>
        </div>
      </section>

      {/* Feature Showcase Grid (Section 28) */}
      <section className="py-20 bg-background">
        <div className="container max-w-6xl px-4 sm:px-8 mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Comprehensive Fact-Checking Engine
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Designed to handle real-world misinformation across multi-modal formats with mathematical rigor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md space-y-3 hover:border-emerald-500/40 transition-colors shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Text & Viral Claims</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Extracts atomic claims, removes emotional clickbait rhetoric, and cross-references government gazettes and primary records.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md space-y-3 hover:border-cyan-500/40 transition-colors shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                <ImageIcon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Image Verification</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Multimodal OCR and visual context analysis to verify dates, locations, and statement text embedded within screenshots.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md space-y-3 hover:border-amber-500/40 transition-colors shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">WhatsApp Forwards</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Decomposes viral forwarded messages with multiple claims, verifying each factual statement independently.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md space-y-3 hover:border-blue-500/40 transition-colors shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">News & Article URLs</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                SSRF-safe scraper extracts article contents and validates multi-claim reporting without falling for paywalls or cloaking.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md space-y-3 hover:border-purple-500/40 transition-colors shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Network className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Evidence Graph</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Interactive visual provenance showing how retrieved sources and relationship stances connect directly to the final verdict.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md space-y-3 hover:border-emerald-500/40 transition-colors shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Explainable Verdicts</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Transparent reasoning answering &ldquo;Why this verdict?&rdquo; with verifiable citations, source tiers, and confidence levels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step How It Works Section (Section 29) */}
      <section className="py-20 border-t border-border/40 bg-secondary/20">
        <div className="container max-w-6xl px-4 sm:px-8 mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">
              Pipeline Architecture
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              How SACHAI Verifies Claims
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-2 relative">
              <span className="text-xs font-mono font-bold text-emerald-500">01</span>
              <h3 className="text-sm font-bold text-foreground">Submit</h3>
              <p className="text-xs text-muted-foreground">
                Paste any claim, article URL, screenshot, or WhatsApp forward.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-2 relative">
              <span className="text-xs font-mono font-bold text-emerald-500">02</span>
              <h3 className="text-sm font-bold text-foreground">Extract</h3>
              <p className="text-xs text-muted-foreground">
                Filters noise and isolates atomic factual subject-predicate assertions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-2 relative">
              <span className="text-xs font-mono font-bold text-emerald-500">03</span>
              <h3 className="text-sm font-bold text-foreground">Search</h3>
              <p className="text-xs text-muted-foreground">
                Executes multi-angle queries across primary records, gazettes, and fact-checks.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-2 relative">
              <span className="text-xs font-mono font-bold text-emerald-500">04</span>
              <h3 className="text-sm font-bold text-foreground">Compare</h3>
              <p className="text-xs text-muted-foreground">
                Classifies atomic evidence relationships and clusters syndicated copies.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-2 relative">
              <span className="text-xs font-mono font-bold text-emerald-500">05</span>
              <h3 className="text-sm font-bold text-foreground">Verify</h3>
              <p className="text-xs text-muted-foreground">
                Deterministic engine outputs verdict with evidence confidence level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Source Reliability Section (Section 30) */}
      <section className="py-20 border-t border-border/40">
        <div className="container max-w-5xl px-4 sm:px-8 mx-auto text-center space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">
              Source Transparency
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Evidence Over Guesswork
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Every verdict cites the exact publication, domain tier, snippet, and relationship stance.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl border border-border bg-card/60">
              <div className="text-emerald-500 font-bold text-base mb-1">Tier 1 Primary</div>
              <p className="text-xs text-muted-foreground">Government gazettes, RBI, WHO, Supreme Court (1.00 weight)</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card/60">
              <div className="text-cyan-500 font-bold text-base mb-1">Tier 2 News</div>
              <p className="text-xs text-muted-foreground">Reuters, AP, BBC, The Hindu, PTI (0.85 weight)</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card/60">
              <div className="text-amber-500 font-bold text-base mb-1">Tier 3 Fact-Checks</div>
              <p className="text-xs text-muted-foreground">AltNews, BoomLive, Snopes, PolitiFact (0.85 weight)</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card/60">
              <div className="text-purple-500 font-bold text-base mb-1">Independence</div>
              <p className="text-xs text-muted-foreground">Wire syndication clustered so 10 copies count as 1 source</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
