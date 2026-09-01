import Link from "next/link";
import { ShieldAlert, ExternalLink, GitBranch, Terminal } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/40 backdrop-blur-sm mt-auto">
      <div className="container max-w-7xl px-4 py-12 sm:px-8">
        {/* Responsible AI Disclaimer Banner as per Section 59 */}
        <div className="mb-10 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5 text-sm leading-relaxed text-muted-foreground flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-foreground mr-1.5">Responsible AI & Evidence Disclaimer:</span>
            SACHAI.AI provides evidence-based verification using publicly available information. It does not guarantee absolute truth. Results depend on the quality, availability, independence, and freshness of retrieved evidence. When reliable evidence is insufficient or conflicting, SACHAI.AI may return <strong className="text-foreground font-semibold">UNVERIFIED</strong>.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="text-lg font-bold tracking-tight">
              SACHAI<span className="text-emerald-500">.AI</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Evidence-based AI verification engine. Grounded in primary sources, independent journalism, and deterministic logic.
            </p>
            <div className="text-xs text-muted-foreground/80 font-mono pt-2">
              Core Differentiator: SACHAI does not ask &quot;What does AI think?&quot; — it asks &quot;What does the available evidence show?&quot;
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Claim Verification
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-muted-foreground hover:text-foreground transition-colors">
                  Demo Test Suite
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard Analytics
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing & Tiers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Developers & Docs
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/developers" className="text-muted-foreground hover:text-foreground transition-colors">
                  API & SDKs
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Changelog v1.0
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:8000/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  FastAPI OpenAPI <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© 2026 SACHAI.AI. Evidence Over Guesswork.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <GitBranch className="h-3 w-3" /> v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
