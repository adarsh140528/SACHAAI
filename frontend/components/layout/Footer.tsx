import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  GitBranch,
  Terminal,
  Activity,
  Layers,
  ArrowUpRight,
  Database,
  Cpu
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/95 backdrop-blur-md mt-auto">
      <div className="container max-w-7xl px-4 py-12 sm:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-border/80">
          {/* Brand & Mission Column (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block transition-opacity hover:opacity-90">
              <img
                src="/logo.png"
                alt="SACHAI.AI"
                className="h-10 w-auto object-contain dark:hidden"
              />
              <img
                src="/logo-dark.png"
                alt="SACHAI.AI"
                className="h-10 w-auto object-contain hidden dark:block"
              />
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              The gold standard in algorithmic verification, multi-source forensic evidence aggregation, and deterministic claim auditing. Verifying assertions against primary records and official gazettes.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-border text-[11px] font-mono text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-verdict-true animate-pulse" />
              <span className="font-semibold text-foreground">v2.1 Verification Engine Online</span>
            </div>
          </div>

          {/* Navigation Columns (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Column 1: Platform */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground">
                Platform
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <span>Claim Checker</span>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                    Research Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/history" className="text-muted-foreground hover:text-foreground transition-colors">
                    Public Audit History
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Developers */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground">
                Developers
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/developers" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <span>API Reference & SDKs</span>
                  </Link>
                </li>
                <li>
                  <Link href="/changelog" className="text-muted-foreground hover:text-foreground transition-colors">
                    Changelog v1.0
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Integrity Standards */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground">
                Methodology
              </h4>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-verdict-true shrink-0" />
                  <span>5-Tier Credibility</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-verdict-true shrink-0" />
                  <span>Wire Syndication</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-verdict-true shrink-0" />
                  <span>Deterministic Engine</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-3">
          <p className="font-sans text-[11px]">
            © 2026 SACHAI.AI — Algorithmic Truth Aggregation & Forensic Evidence Engine.
          </p>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="inline-flex items-center gap-1.5">
              <GitBranch className="h-3.5 w-3.5" /> MIT License
            </span>
            <span className="text-border">•</span>
            <span className="text-muted-foreground">Evidence Over Guesswork</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
