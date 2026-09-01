import { GitCommit, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ChangelogPage() {
  return (
    <div className="container max-w-4xl px-4 py-12 sm:py-16 mx-auto space-y-10">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight">Product Changelog</h1>
        <p className="text-sm text-muted-foreground">Continuous updates and releases for the SACHAI.AI engine</p>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-border/60">
        {/* Release v1.0 */}
        <div className="relative pl-10 space-y-3">
          <div className="absolute left-2 top-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-4 ring-background" />
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-foreground">v1.0 — Production Release</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Latest
            </span>
          </div>
          <p className="text-xs text-muted-foreground">September 2026</p>

          <div className="p-5 rounded-2xl border border-border/80 bg-card/80 space-y-3 text-xs">
            <div className="font-semibold text-foreground">Core Highlights:</div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Evidence-Based Verification:</strong> Full separation between AI claim extraction, web search retrieval, and deterministic verdict rules.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>5-Tier Source Ranking:</strong> Automatic classification across Official Primary (1.0), Scientific (0.95), Established News (0.85), Fact-Checkers (0.85), and General/Social tiers.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Syndication Deduplication:</strong> Identical wire report clustering prevents 10 copied stories from counting as 10 independent sources.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Multimodal OCR & Vision:</strong> Magic-byte validated image uploads and screenshot analysis.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>SSRF Protection:</strong> Strict IP blocking against loopback, private subnets, and cloud metadata.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Interactive Evidence Graph:</strong> Visual tree representation tracing claims to sources and deterministic verdicts.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
