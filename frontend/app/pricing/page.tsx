import Link from "next/link";
import { Check, ShieldCheck, Terminal, ArrowRight } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="container max-w-5xl px-4 py-12 sm:py-16 mx-auto space-y-12">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-secondary text-primary text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="h-3.5 w-3.5" /> Platform Plans
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Transparent Verification Tiers
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          From individual claim research to programmatic developer APIs. Free during open beta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="p-6 rounded-xl border border-border bg-card space-y-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">Community Guest</h3>
            <p className="text-xs text-muted-foreground">
              Single-use quick check for anonymous visitors.
            </p>
            <div className="text-2xl font-extrabold">₹0</div>

            <ul className="space-y-2 text-xs text-muted-foreground pt-4 border-t border-border">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>1 free text fact check</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Google Fact Check Tools query</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Basic Evidence Graph</span>
              </li>
            </ul>
          </div>

          <Link
            href="/"
            className="w-full py-2 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs text-center transition-colors block"
          >
            Check 1 Claim Free
          </Link>
        </div>

        {/* Registered User Plan */}
        <div className="p-6 rounded-xl border-2 border-primary bg-card space-y-6 flex flex-col justify-between shadow-md relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
            Active Beta
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">Registered User</h3>
            <p className="text-xs text-muted-foreground">
              Full multimodal fact-checking for researchers and journalists.
            </p>
            <div className="text-2xl font-extrabold">Free <span className="text-xs font-normal text-muted-foreground">in Beta</span></div>

            <ul className="space-y-2 text-xs text-muted-foreground pt-4 border-t border-border">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Unlimited Text Claim Verification</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Image Screenshot & OCR Analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>News URL & WhatsApp Decomposition</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Personal Dashboard & Saved Reports</span>
              </li>
            </ul>
          </div>

          <Link
            href="/sign-up"
            className="w-full py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold text-xs text-center transition-colors block shadow-sm"
          >
            Create Free Account
          </Link>
        </div>

        {/* Developer Plan */}
        <div className="p-6 rounded-xl border border-border bg-card space-y-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">Developer API</h3>
            <p className="text-xs text-muted-foreground">
              REST endpoints and API keys for bots and newsrooms.
            </p>
            <div className="text-2xl font-extrabold">Beta Access</div>

            <ul className="space-y-2 text-xs text-muted-foreground pt-4 border-t border-border">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>API Key Generation (`sach_live_...`)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>JSON REST API (`POST /api/v1/checks`)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>60 Requests / minute</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Python & JS Code Snippets</span>
              </li>
            </ul>
          </div>

          <Link
            href="/developers"
            className="w-full py-2 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs text-center transition-colors block"
          >
            Access Developer Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
