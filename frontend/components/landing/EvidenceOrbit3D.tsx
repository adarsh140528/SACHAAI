"use client";

import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  ExternalLink,
  Layers,
  ArrowRight,
  Activity
} from "lucide-react";

interface SourceNode {
  id: string;
  name: string;
  tier: string;
  tierLabel: string;
  stance: "CONTRADICTS" | "SUPPORTS" | "PARTIALLY_CONTRADICTS";
  date: string;
  snippet: string;
  angle: number; // in degrees for orbital positioning
  distance: number; // in px
  reliability: string;
}

const NODES: SourceNode[] = [
  {
    id: "rbi",
    name: "Reserve Bank of India",
    tier: "Tier 1",
    tierLabel: "Primary Statutory Body",
    stance: "CONTRADICTS",
    date: "Aug 2026",
    snippet: "₹2000 denomination banknotes continue to remain legal tender under Clean Note Policy.",
    angle: 30,
    distance: 220,
    reliability: "1.00 (Official)",
  },
  {
    id: "reuters",
    name: "Reuters World",
    tier: "Tier 2",
    tierLabel: "Established News Agency",
    stance: "CONTRADICTS",
    date: "Aug 2026",
    snippet: "Central bank clarifies currency notes are withdrawn from regular banking exchange but retain value.",
    angle: 150,
    distance: 235,
    reliability: "0.85 (High)",
  },
  {
    id: "altnews",
    name: "AltNews / BoomLive",
    tier: "Tier 3",
    tierLabel: "IFCN Certified Fact-Check",
    stance: "CONTRADICTS",
    date: "Aug 2026",
    snippet: "Viral social media posts claiming ₹2000 notes are zero-value paper are false and debunked.",
    angle: 270,
    distance: 210,
    reliability: "0.85 (Verified)",
  },
  {
    id: "gazette",
    name: "Gazette of India",
    tier: "Tier 1",
    tierLabel: "Official Government Gazette",
    stance: "PARTIALLY_CONTRADICTS",
    date: "May 2023",
    snippet: "Notification under RBI Act Section 24 regarding currency management policy.",
    angle: 90,
    distance: 245,
    reliability: "1.00 (Statutory)",
  },
  {
    id: "pti",
    name: "Press Trust of India (PTI)",
    tier: "Tier 2",
    tierLabel: "National Wire Service",
    stance: "CONTRADICTS",
    date: "Aug 2026",
    snippet: "Exchange counters and postal facilities process note returns under official guidelines.",
    angle: 210,
    distance: 230,
    reliability: "0.85 (Wire)",
  },
];

export default function EvidenceOrbit3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [activeNodeId, setActiveNodeId] = useState<string>("rbi");
  const [isHovered, setIsHovered] = useState(false);

  // Subtle mouse parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotation({
      x: -y * 12, // tilt on X axis
      y: x * 16,  // pan on Y axis
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const activeNode = NODES.find((n) => n.id === activeNodeId) || NODES[0];

  const getStanceColor = (stance: string) => {
    switch (stance) {
      case "SUPPORTS":
        return {
          bg: "bg-emerald-500/10 dark:bg-emerald-950/30",
          border: "border-emerald-500/40",
          text: "text-emerald-700 dark:text-emerald-400",
          badge: "bg-emerald-600 text-white",
          dot: "#15803D",
        };
      case "CONTRADICTS":
        return {
          bg: "bg-rose-500/10 dark:bg-rose-950/30",
          border: "border-rose-500/40",
          text: "text-rose-700 dark:text-rose-400",
          badge: "bg-rose-600 text-white",
          dot: "#DC2626",
        };
      default:
        return {
          bg: "bg-amber-500/10 dark:bg-amber-950/30",
          border: "border-amber-500/40",
          text: "text-amber-700 dark:text-amber-400",
          badge: "bg-amber-600 text-white",
          dot: "#D97706",
        };
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-8 select-none">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/80 gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Activity className="h-4 w-4 text-primary" />
          <span>Interactive Evidence Orbit & Provenance Map</span>
        </div>
        <div className="text-[11px] text-muted-foreground">
          Hover over nodes to inspect primary citations and stance relationships
        </div>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative h-[480px] sm:h-[520px] w-full rounded-2xl border border-border bg-card/40 backdrop-blur-sm overflow-hidden flex items-center justify-center perspective-container transition-all duration-300"
      >
        {/* Fine Technical Grid & Radar Rings */}
        <div className="absolute inset-0 bg-fine-grid opacity-60 pointer-events-none" />
        
        {/* Orbital Distance Rings */}
        <div className="absolute h-[340px] w-[340px] rounded-full border border-dashed border-border/60 pointer-events-none" />
        <div className="absolute h-[460px] w-[460px] rounded-full border border-border/40 pointer-events-none hidden sm:block" />

        {/* 3D Transform Layer */}
        <div
          className="relative w-full h-full flex items-center justify-center preserve-3d transition-transform duration-200 ease-out"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {/* SVG Connection Rays */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {NODES.map((node) => {
              const rad = (node.angle * Math.PI) / 180;
              const cx = 50 + (Math.cos(rad) * 32);
              const cy = 50 + (Math.sin(rad) * 30);
              const isActive = activeNodeId === node.id;
              const stanceColors = getStanceColor(node.stance);

              return (
                <g key={`line-${node.id}`}>
                  <line
                    x1="50%"
                    y1="50%"
                    x2={`${cx}%`}
                    y2={`${cy}%`}
                    stroke={isActive ? stanceColors.dot : "currentColor"}
                    strokeWidth={isActive ? "2" : "1"}
                    strokeDasharray={isActive ? "none" : "4 4"}
                    className={isActive ? "opacity-90" : "text-border/70 opacity-40"}
                  />
                  {isActive && (
                    <circle
                      cx={`${(50 + cx) / 2}%`}
                      cy={`${(50 + cy) / 2}%`}
                      r="3"
                      fill={stanceColors.dot}
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Central Claim Node (Subject of Investigation) */}
          <div className="z-20 max-w-[240px] sm:max-w-[270px] p-4 rounded-xl border border-border bg-card shadow-xl text-center space-y-2 preserve-3d transform transition-transform hover:scale-105">
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-widest text-primary uppercase">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Claim Under Investigation</span>
            </div>
            <p className="text-xs font-semibold text-foreground leading-snug">
              &ldquo;RBI announced ₹2000 banknotes are completely invalid and illegal in 2026.&rdquo;
            </p>
            <div className="pt-1 flex items-center justify-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                FALSE
              </span>
              <span className="text-[10px] text-muted-foreground">
                Confidence: <strong>HIGH</strong>
              </span>
            </div>
          </div>

          {/* Orbiting Source Cards */}
          {NODES.map((node) => {
            const rad = (node.angle * Math.PI) / 180;
            // Coordinate math for responsive desktop/mobile orbit
            const xOffset = Math.cos(rad) * (typeof window !== "undefined" && window.innerWidth < 640 ? 140 : node.distance);
            const yOffset = Math.sin(rad) * (typeof window !== "undefined" && window.innerWidth < 640 ? 130 : node.distance * 0.75);
            const isActive = activeNodeId === node.id;
            const stanceStyles = getStanceColor(node.stance);

            return (
              <div
                key={node.id}
                onMouseEnter={() => setActiveNodeId(node.id)}
                onClick={() => setActiveNodeId(node.id)}
                className={`absolute z-10 cursor-pointer p-2.5 sm:p-3 rounded-lg border transition-all duration-200 text-left max-w-[150px] sm:max-w-[190px] shadow-sm ${
                  isActive
                    ? `${stanceStyles.bg} ${stanceStyles.border} shadow-md scale-105 ring-2 ring-primary/20`
                    : "bg-card/90 border-border hover:border-primary/40 hover:bg-card opacity-85"
                }`}
                style={{
                  transform: `translate(${xOffset}px, ${yOffset}px)`,
                }}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase truncate">
                    {node.tier}
                  </span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${stanceStyles.badge}`}>
                    {node.stance === "CONTRADICTS" ? "CONTRADICTS" : node.stance === "SUPPORTS" ? "SUPPORTS" : "PARTIAL"}
                  </span>
                </div>
                <div className="text-xs font-bold text-foreground truncate">{node.name}</div>
                <div className="text-[10px] text-muted-foreground line-clamp-1">{node.tierLabel}</div>
              </div>
            );
          })}
        </div>

        {/* Bottom Active Evidence Inspector Drawer */}
        <div className="absolute bottom-3 left-3 right-3 sm:left-6 sm:right-6 p-3.5 rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-30">
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">{activeNode.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded border border-border bg-secondary font-mono">
                {activeNode.tierLabel}
              </span>
              <span className="text-[10px] text-muted-foreground">• Reliability: {activeNode.reliability}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 italic">
              &ldquo;{activeNode.snippet}&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-bold px-2.5 py-1 rounded ${getStanceColor(activeNode.stance).badge}`}>
              {activeNode.stance}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
