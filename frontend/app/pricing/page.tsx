import Link from "next/link";
import { Check, Sparkles, Terminal, Zap, ShieldCheck } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="container max-w-6xl px-4 py-12 sm:py-20 mx-auto space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs font-semibold uppercase">
          <Sparkles className="h-3.5 w-3.5" /> Transparent Pricing
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Evidence Verification for Everyone
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          From individual fact-checking to high-throughput developer APIs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="p-8 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md space-y-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Community Free</h3>
            <p className="text-xs text-muted-foreground">
              Essential evidence verification for public citizens and journalists.
            </p>
            <div className="text-3xl font-extrabold">₹0 <span className="text-xs font-normal text-muted-foreground">/ month</span></div>

            <ul className="space-y-2.5 text-xs text-muted-foreground pt-4 border-t border-border">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Text claim verification</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Google Fact Check Tools integration</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Standard web evidence citations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Basic Interactive Evidence Graph</span>
              </li>
            </ul>
          </div>

          <Link
            href="/"
            className="w-full py-2.5 rounded-xl border border-border bg-secondary hover:bg-secondary/70 text-foreground font-semibold text-xs text-center transition-colors block"
          >
            Get Started Free
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="p-8 rounded-3xl border-2 border-emerald-500/60 bg-card/90 backdrop-blur-md space-y-6 flex flex-col justify-between shadow-xl relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider">
            Most Popular
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Pro Investigator</h3>
            <p className="text-xs text-muted-foreground">
              Advanced multimodal verification for researchers and newsrooms.
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">₹999</span>
              <span className="text-xs text-muted-foreground">/ month</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                Coming Soon
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-foreground pt-4 border-t border-border">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Unlimited text & news URL verification</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Multimodal OCR & screenshot analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>WhatsApp multi-claim forward decomposition</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Full evidence history & bookmarking</span>
              </li>
            </ul>
          </div>

          <button
            disabled
            className="w-full py-2.5 rounded-xl bg-emerald-600/50 text-white font-semibold text-xs text-center cursor-not-allowed"
          >
            Coming Soon (Waitlist Open)
          </button>
        </div>

        {/* Developer Plan */}
        <div className="p-8 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md space-y-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Developer API</h3>
            <p className="text-xs text-muted-foreground">
              Programmatic REST API keys for automated fact-checking pipelines.
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">Pay as you go</span>
            </div>

            <ul className="space-y-2.5 text-xs text-muted-foreground pt-4 border-t border-border">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Instant API key provisioning</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Structured JSON response schema</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>60 requests / min default rate limit</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>cURL, Python & JavaScript SDK support</span>
              </li>
            </ul>
          </div>

          <Link
            href="/developers"
            className="w-full py-2.5 rounded-xl border border-border bg-secondary hover:bg-secondary/70 text-foreground font-semibold text-xs text-center transition-colors block"
          >
            Access Developer Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
