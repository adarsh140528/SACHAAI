"use client";

import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  ExternalLink,
  Activity,
  Layers,
  Sparkles,
  Link2,
  Check,
  Building2,
  Newspaper,
  ShieldAlert,
  ArrowUpRight
} from "lucide-react";

export interface SourceNode {
  id: string;
  name: string;
  shortName: string;
  tier: string;
  tierNumber: number;
  tierLabel: string;
  stance: "CONTRADICTS" | "SUPPORTS" | "PARTIALLY_CONTRADICTS";
  date: string;
  snippet: string;
  xPercent: number; // Position X in % (0 to 100)
  yPercent: number; // Position Y in % (0 to 100)
  reliability: string;
  reliabilityScore: number;
  urlDomain: string;
  iconType: "gov" | "news" | "factcheck";
}

const EVIDENCE_NODES: SourceNode[] = [
  {
    id: "rbi",
    name: "Reserve Bank of India",
    shortName: "RBI Central Bank",
    tier: "Tier 1 Primary",
    tierNumber: 1,
    tierLabel: "Primary Statutory Authority",
    stance: "CONTRADICTS",
    date: "Aug 2026",
    snippet: "₹2000 denomination banknotes continue to remain legal tender in India and have not been declared illegal or zero-value paper.",
    xPercent: 78,
    yPercent: 24,
    reliability: "1.00 (Official Statutory)",
    reliabilityScore: 100,
    urlDomain: "rbi.org.in",
    iconType: "gov",
  },
  {
    id: "altnews",
    name: "AltNews / BoomLive",
    shortName: "AltNews & Boom",
    tier: "Tier 3 Fact-Check",
    tierNumber: 3,
    tierLabel: "IFCN Certified Fact Checkers",
    stance: "CONTRADICTS",
    date: "Aug 2026",
    snippet: "Viral WhatsApp forwards claiming complete invalidation of currency from midnight are fabricated misinformation.",
    xPercent: 50,
    yPercent: 12,
    reliability: "0.85 (IFCN Certified)",
    reliabilityScore: 85,
    urlDomain: "altnews.in",
    iconType: "factcheck",
  },
  {
    id: "reuters",
    name: "Reuters World",
    shortName: "Reuters News",
    tier: "Tier 2 Wire",
    tierNumber: 2,
    tierLabel: "Global Independent Wire Service",
    stance: "CONTRADICTS",
    date: "Aug 2026",
    snippet: "Indian monetary authorities confirm notes remain valid tender while exchange facilities operate through designated postal channels.",
    xPercent: 22,
    yPercent: 24,
    reliability: "0.90 (Tier 2 Wire)",
    reliabilityScore: 90,
    urlDomain: "reuters.com",
    iconType: "news",
  },
  {
    id: "pti",
    name: "Press Trust of India (PTI)",
    shortName: "PTI News Wire",
    tier: "Tier 2 Wire",
    tierNumber: 2,
    tierLabel: "National Wire Service",
    stance: "CONTRADICTS",
    date: "Aug 2026",
    snippet: "Official government spokesperson refutes viral social media claims regarding sudden currency demonetization.",
    xPercent: 22,
    yPercent: 76,
    reliability: "0.85 (Tier 2 Wire)",
    reliabilityScore: 85,
    urlDomain: "ptinews.com",
    iconType: "news",
  },
  {
    id: "gazette",
    name: "Gazette of India",
    shortName: "The Gazette of India",
    tier: "Tier 1 Primary",
    tierNumber: 1,
    tierLabel: "Official Government Gazette",
    stance: "PARTIALLY_CONTRADICTS",
    date: "May 2023",
    snippet: "Statutory Order issued under Section 24 of Reserve Bank of India Act regulating note withdrawal timelines.",
    xPercent: 78,
    yPercent: 76,
    reliability: "1.00 (Official Statutory)",
    reliabilityScore: 100,
    urlDomain: "egazette.gov.in",
    iconType: "gov",
  },
];

export default function EvidenceOrbit3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeNodeId, setActiveNodeId] = useState<string>("rbi");
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Subtle interactive parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotation({
      x: -y * 8,
      y: x * 10,
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovering(false);
  };

  const activeNode = EVIDENCE_NODES.find((n) => n.id === activeNodeId) || EVIDENCE_NODES[0];

  const getStanceTheme = (stance: string) => {
    switch (stance) {
      case "SUPPORTS":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-950/40",
          border: "border-emerald-500/50",
          text: "text-emerald-700 dark:text-emerald-400",
          badge: "bg-emerald-600 text-white",
          glow: "rgba(16, 185, 129, 0.4)",
          stroke: "#10B981",
        };
      case "PARTIALLY_CONTRADICTS":
        return {
          bg: "bg-amber-50 dark:bg-amber-950/40",
          border: "border-amber-500/50",
          text: "text-amber-700 dark:text-amber-400",
          badge: "bg-amber-600 text-white",
          glow: "rgba(245, 158, 11, 0.4)",
          stroke: "#F59E0B",
        };
      case "CONTRADICTS":
      default:
        return {
          bg: "bg-rose-50 dark:bg-rose-950/40",
          border: "border-rose-500/50",
          text: "text-rose-700 dark:text-rose-400",
          badge: "bg-rose-600 text-white",
          glow: "rgba(239, 68, 68, 0.4)",
          stroke: "#EF4444",
        };
    }
  };

  const currentStanceTheme = getStanceTheme(activeNode.stance);

  return (
    <div className="w-full max-w-5xl mx-auto my-6 select-none flex flex-col gap-4">
      {/* Top Bar: Controls & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/80">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-accent-blue animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-wider text-foreground uppercase">
            Interactive Evidence Orbit & Provenance Map
          </span>
        </div>

        {/* Source Switcher Quick Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          {EVIDENCE_NODES.map((node) => {
            const isSelected = node.id === activeNodeId;
            return (
              <button
                key={node.id}
                onClick={() => setActiveNodeId(node.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all shrink-0 border flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-sm font-bold"
                    : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-secondary"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getStanceTheme(node.stance).stroke }} />
                <span>{node.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 3D Orbital Canvas */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        className="relative h-[480px] sm:h-[520px] w-full rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden perspective-container transition-all duration-300 shadow-sm"
      >
        {/* Fine Technical Grid Texture */}
        <div className="absolute inset-0 bg-fine-grid opacity-50 pointer-events-none" />

        {/* Concentric Radar Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[340px] w-[340px] sm:h-[380px] sm:w-[380px] rounded-full border border-dashed border-border/70 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[220px] w-[220px] sm:h-[260px] sm:w-[260px] rounded-full border border-border/40 pointer-events-none" />

        {/* Dynamic 3D Transform Layer */}
        <div
          className="relative w-full h-full preserve-3d transition-transform duration-200 ease-out"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {/* SVG Connector Rays from Center to Nodes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {EVIDENCE_NODES.map((node) => {
              const isActive = activeNodeId === node.id;
              const stanceTheme = getStanceTheme(node.stance);

              return (
                <g key={`ray-${node.id}`}>
                  {/* Outer Glow Ray for Active */}
                  {isActive && (
                    <line
                      x1="50%"
                      y1="50%"
                      x2={`${node.xPercent}%`}
                      y2={`${node.yPercent}%`}
                      stroke={stanceTheme.stroke}
                      strokeWidth="4"
                      strokeOpacity="0.25"
                    />
                  )}

                  {/* Main Line */}
                  <line
                    x1="50%"
                    y1="50%"
                    x2={`${node.xPercent}%`}
                    y2={`${node.yPercent}%`}
                    stroke={isActive ? stanceTheme.stroke : "currentColor"}
                    strokeWidth={isActive ? "2" : "1"}
                    strokeDasharray={isActive ? "none" : "4 4"}
                    className={isActive ? "opacity-100" : "text-border opacity-50"}
                  />

                  {/* Node Anchor Point */}
                  <circle
                    cx={`${node.xPercent}%`}
                    cy={`${node.yPercent}%`}
                    r={isActive ? "4" : "2.5"}
                    fill={isActive ? stanceTheme.stroke : "hsl(var(--muted-foreground))"}
                  />

                  {/* Animated Signal Pulse on Active Line */}
                  {isActive && (
                    <circle
                      cx={`${(50 + node.xPercent) / 2}%`}
                      cy={`${(50 + node.yPercent) / 2}%`}
                      r="3.5"
                      fill={stanceTheme.stroke}
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Central Claim Hub (The Investigation Centerpiece) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[240px] sm:w-[280px] p-4 rounded-xl border-2 border-primary/20 bg-card shadow-2xl text-center space-y-2 preserve-3d transition-transform hover:scale-105 duration-200">
            <div className="inline-flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-widest text-accent-blue uppercase font-mono">
              <ShieldCheck className="h-3.5 w-3.5 text-accent-blue" />
              <span>Claim Under Investigation</span>
            </div>

            <p className="text-xs font-bold text-foreground leading-snug font-sans px-1">
              &ldquo;RBI announced ₹2000 banknotes are completely invalid and illegal in 2026.&rdquo;
            </p>

            <div className="pt-1 flex items-center justify-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-verdict-false text-white tracking-wider">
                FALSE
              </span>
              <span className="text-[10px] text-muted-foreground font-mono font-medium">
                Confidence: <strong className="text-foreground">HIGH (99.8%)</strong>
              </span>
            </div>
          </div>

          {/* Orbiting Source Node Cards */}
          {EVIDENCE_NODES.map((node) => {
            const isActive = activeNodeId === node.id;
            const stanceTheme = getStanceTheme(node.stance);

            return (
              <div
                key={node.id}
                onClick={() => setActiveNodeId(node.id)}
                onMouseEnter={() => setActiveNodeId(node.id)}
                className={`absolute z-10 cursor-pointer p-2.5 sm:p-3 rounded-lg border transition-all duration-200 text-left w-[140px] sm:w-[170px] shadow-sm -translate-x-1/2 -translate-y-1/2 ${
                  isActive
                    ? `${stanceTheme.bg} ${stanceTheme.border} shadow-lg scale-110 ring-2 ring-primary/20 z-30`
                    : "bg-card/95 border-border hover:border-primary/50 hover:bg-card opacity-90 hover:opacity-100 hover:scale-105"
                }`}
                style={{
                  left: `${node.xPercent}%`,
                  top: `${node.yPercent}%`,
                }}
              >
                {/* Header: Tier + Stance Pill */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase font-mono truncate">
                    Tier {node.tierNumber}
                  </span>
                  <span className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${stanceTheme.badge}`}>
                    {node.stance === "CONTRADICTS" ? "CONTRADICTS" : node.stance === "SUPPORTS" ? "SUPPORTS" : "PARTIAL"}
                  </span>
                </div>

                {/* Source Name */}
                <div className="text-xs font-bold text-foreground leading-tight line-clamp-1">
                  {node.name}
                </div>

                {/* Subtitle */}
                <div className="text-[9.5px] text-muted-foreground line-clamp-1 mt-0.5">
                  {node.tierLabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dedicated Evidence Citation Inspector Dock (Cleanly Separated Below Canvas) */}
      <div className={`p-4 rounded-xl border transition-all duration-300 shadow-md ${currentStanceTheme.bg} ${currentStanceTheme.border}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-border/60">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-extrabold text-foreground font-sans">{activeNode.name}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-background font-mono font-semibold text-foreground">
              {activeNode.tier}
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              • Reliability: <strong className="text-foreground">{activeNode.reliability}</strong>
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              • Published: <strong className="text-foreground">{activeNode.date}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider ${currentStanceTheme.badge}`}>
              {activeNode.stance === "CONTRADICTS" ? "Stance: CONTRADICTS" : activeNode.stance === "SUPPORTS" ? "Stance: SUPPORTS" : "Stance: PARTIAL"}
            </span>
          </div>
        </div>

        {/* Verbatim Excerpt */}
        <div className="pt-3 flex flex-col sm:flex-row items-start justify-between gap-3">
          <div className="space-y-1 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
              Primary Extracted Evidence Snippet
            </span>
            <p className="text-xs sm:text-sm text-foreground italic leading-relaxed">
              &ldquo;{activeNode.snippet}&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2 sm:pt-0 shrink-0">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-accent-blue bg-accent-blue/10 px-2.5 py-1.5 rounded-md border border-accent-blue/20">
              <span>{activeNode.urlDomain}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
