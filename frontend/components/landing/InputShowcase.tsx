"use client";

import { useState } from "react";
import {
  FileText,
  ImageIcon,
  MessageSquare,
  Globe,
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function InputShowcase() {
  const [selectedTab, setSelectedTab] = useState<"TEXT" | "IMAGE" | "WHATSAPP" | "URL">("WHATSAPP");

  return (
    <div className="w-full max-w-5xl mx-auto py-12 space-y-8">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-secondary text-xs font-semibold text-primary uppercase tracking-wider">
          <Layers className="h-3.5 w-3.5" />
          <span>Multimodal Ingestion Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Engineered for Real-World Misinformation Formats
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Misinformation rarely arrives as clean text. SACHAI parses raw viral screenshots, forwarded chats, and full news articles.
        </p>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedTab("WHATSAPP")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${
            selectedTab === "WHATSAPP"
              ? "bg-primary text-white border-primary shadow-sm"
              : "bg-card border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>WhatsApp Forwards</span>
        </button>

        <button
          onClick={() => setSelectedTab("IMAGE")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${
            selectedTab === "IMAGE"
              ? "bg-primary text-white border-primary shadow-sm"
              : "bg-card border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          <ImageIcon className="h-4 w-4" />
          <span>Image & OCR</span>
        </button>

        <button
          onClick={() => setSelectedTab("URL")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${
            selectedTab === "URL"
              ? "bg-primary text-white border-primary shadow-sm"
              : "bg-card border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>News & URLs</span>
        </button>

        <button
          onClick={() => setSelectedTab("TEXT")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${
            selectedTab === "TEXT"
              ? "bg-primary text-white border-primary shadow-sm"
              : "bg-card border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Raw Text Claims</span>
        </button>
      </div>

      {/* Interactive Showcase Container */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        {selectedTab === "WHATSAPP" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* WhatsApp Chat Simulation */}
            <div className="rounded-xl border border-border bg-[#0B141B] p-4 space-y-3 font-sans shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
                <span>Forwarded many times</span>
                <span>Today, 10:42 AM</span>
              </div>
              <div className="rounded-lg bg-[#005C4B] p-3 text-xs text-white space-y-2">
                <p className="font-semibold text-emerald-300">🚨 URGENT NOTICE FOR ALL CITIZENS:</p>
                <p className="leading-relaxed">
                  Government has officially banned all UPI transactions between 10 PM and 6 AM starting tonight! Share this with family groups before accounts get frozen.
                </p>
                <p className="text-[10px] text-emerald-200/80 text-right">10:42 AM ✓✓</p>
              </div>
            </div>

            {/* Decomposition Outcome */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  Automated Noise Stripping & Claim Isolation
                </span>
                <h3 className="text-base font-bold text-foreground">
                  Multi-Claim Deconstruction
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  SACHAI removes sensational clickbait warnings, isolates verifiable assertions, and verifies each statement independently.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/5 flex items-start gap-3">
                  <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-foreground">Claim 1: UPI 10 PM Ban</span>
                    <p className="text-muted-foreground">NPCI operates 24/7. Statement is refuted by national payments authority.</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 flex items-start gap-3">
                  <XCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-foreground">Claim 2: Account Freezing Warning</span>
                    <p className="text-muted-foreground">Fabricated urgency tactic common in phishing forwards.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "IMAGE" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Image Preview */}
            <div className="rounded-xl border border-border bg-secondary/50 p-4 space-y-3 flex flex-col items-center justify-center text-center">
              <div className="h-44 w-full rounded-lg border border-dashed border-border bg-card flex flex-col items-center justify-center p-4 space-y-2 relative overflow-hidden">
                <div className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded bg-secondary font-mono">
                  MAGIC_BYTE: PNG_HEADER
                </div>
                <ImageIcon className="h-8 w-8 text-primary" />
                <p className="text-xs font-semibold text-foreground max-w-xs">
                  Screenshot of alleged news bulletin or circular
                </p>
                <span className="text-[10px] text-muted-foreground">
                  Multimodal OCR extracts headline, timestamp, and visual artifact context
                </span>
              </div>
            </div>

            {/* OCR Analysis */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  Vision + Forensic Text Extraction
                </span>
                <h3 className="text-base font-bold text-foreground">
                  Deep OCR with Source Verification
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Validates file signature magic bytes to prevent exploit vectors, extracts text via vision models, and matches against official publication registries.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-border bg-secondary/40 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>OCR Confidence: 99.2%</span>
                  <span>Extracted in 240ms</span>
                </div>
                <p className="text-xs text-foreground font-mono bg-card p-2 rounded border border-border/60">
                  &ldquo;Ministry of Finance releases ₹50,000 direct subsidy for all ration card holders...&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "URL" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* URL Scraper Container */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground border-b border-border pb-2">
                <Globe className="h-3.5 w-3.5 text-primary" />
                <span className="truncate">https://reuters.com/world/india/article-2026</span>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-foreground">
                  India Approves New Quantum Technology Initiative
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-3">
                  The union cabinet today approved the national roadmap for quantum computing infrastructure with an outlay of ₹6,000 crore over eight years.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-600 text-white font-bold">
                  TIER 2 NEWS (REUTERS)
                </span>
              </div>
            </div>

            {/* URL Outcome */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  SSRF-Guarded Content Extraction
                </span>
                <h3 className="text-base font-bold text-foreground">
                  Full Article Cross-Referencing
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Safely fetches public web pages, blocks internal IP networks (RFC 1918 / cloud metadata), and extracts individual claims with publisher credibility tiers.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-secondary/30 text-xs">
                  <span>Claim 1: ₹6,000 Cr Quantum Budget</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> TRUE
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-secondary/30 text-xs">
                  <span>Claim 2: 8-Year Implementation Period</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> TRUE
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "TEXT" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Input statement */}
            <div className="rounded-xl border border-border bg-secondary/30 p-5 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Raw Input Statement
              </span>
              <p className="text-sm font-semibold text-foreground italic">
                &ldquo;India landed Chandrayaan-3 on the Moon&rsquo;s south polar region.&rdquo;
              </p>
            </div>

            {/* Extracted Assertion */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  Subject-Predicate Extraction
                </span>
                <h3 className="text-base font-bold text-foreground">
                  Atomic Claim Isolation
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Translates natural prose into testable assertions mapped to ISRO press releases and global space telemetry.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <span>ISRO Lunar South Pole Landing</span>
                <span className="font-bold bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px]">
                  TRUE (HIGH CONFIDENCE)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
