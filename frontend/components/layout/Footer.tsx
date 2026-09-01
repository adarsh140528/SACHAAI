import Link from "next/link";
import { ShieldAlert, ExternalLink, GitBranch, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/80 backdrop-blur-sm mt-auto">
      <div className="container max-w-7xl px-4 py-10 sm:px-8">
        {/* Responsible AI Disclaimer Banner */}
        <div className="mb-8 rounded-lg border border-border bg-secondary/30 p-4 text-xs leading-relaxed text-muted-foreground flex items-start gap-3">
          <ShieldAlert className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-foreground mr-1">Responsible AI & Evidence Notice:</span>
            SACHAI.AI verifies assertions using publicly available records, gazettes, and independent journalism. It does not generate ungrounded opinions. When evidence is insufficient or contradictory, SACHAI returns <strong className="text-foreground">UNVERIFIED</strong>.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary text-white flex items-center justify-center">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <span className="text-base font-extrabold tracking-tight text-foreground">
                SACHAI<span className="text-primary">.AI</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              Evidence-based fact-checking engine. Grounded in primary sources, official gazettes, and mathematical truth aggregation.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
              Platform
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Claim Verification
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-muted-foreground hover:text-foreground transition-colors">
                  Public History
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
              Developers
            </h4>
            <ul className="space-y-1.5 text-xs">
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

        <div className="mt-8 border-t border-border pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted-foreground gap-2">
          <p>© 2026 SACHAI.AI. Evidence Over Guesswork.</p>
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
