import Link from "next/link";
import { ShieldAlert, ExternalLink, GitBranch, ShieldCheck, CheckCircle2, Shield, Scale, Terminal } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/90 backdrop-blur-sm mt-auto">
      <div className="container max-w-7xl px-4 py-10 sm:px-8">
        {/* Responsible AI Disclaimer Banner */}
        <div className="mb-8 rounded-lg border border-border bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground flex items-start gap-3">
          <ShieldAlert className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-foreground mr-1">Responsible AI & Auditable Evidence Notice:</span>
            SACHLAI.AI verifies assertions using publicly available records, gazettes, and independent journalism. It does not generate ungrounded opinions. When evidence is insufficient or contradictory, the deterministic verdict engine returns <strong className="text-foreground font-mono">UNVERIFIED</strong>.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <span className="text-base font-extrabold tracking-tight text-foreground font-sans">
                SACHLAI<span className="text-accent-blue font-mono text-xs ml-0.5">.AI</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The gold standard in algorithmic verification, multi-source forensic evidence aggregation, and claim auditing.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Claim Checker
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

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary mb-3">
              Developers
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/developers" className="text-muted-foreground hover:text-foreground transition-colors">
                  API Keys & SDKs
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

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary mb-3">
              Integrity & Standards
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-verdict-true" />
                <span>5-Tier Credibility Ranking</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-verdict-true" />
                <span>Syndication Clustering</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-verdict-true" />
                <span>Mathematical Verdict Engine</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted-foreground gap-2">
          <p>© 2026 SACHLAI.AI. Evidence Over Guesswork.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 font-mono">
              <GitBranch className="h-3 w-3" /> MIT License
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
