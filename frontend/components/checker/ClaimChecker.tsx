"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Search,
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { submitCheck } from "@/lib/api";

const QUICK_EXAMPLES = [
  { label: "UPI 10 PM Ban", text: "India has completely banned UPI transactions after 10 PM." },
  { label: "₹50,000 Gov Scheme", text: "Government has announced ₹50,000 for every citizen under new relief fund. Share this with everyone." },
  { label: "Chandrayaan-3", text: "ISRO successfully launched the Chandrayaan-3 lunar exploration mission." },
  { label: "₹2000 Note Status", text: "RBI announced ₹2000 denomination banknotes are completely banned in 2026." },
];

export default function ClaimChecker() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"TEXT" | "URL" | "IMAGE" | "WHATSAPP">("TEXT");
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setCurrentStage("Extracting factual claims...");

    try {
      // Simulate real progressive stage updates during pipeline processing
      const stageTimer1 = setTimeout(() => setCurrentStage("Searching primary sources and official records..."), 800);
      const stageTimer2 = setTimeout(() => setCurrentStage("Ranking source reliability & independence..."), 1600);
      const stageTimer3 = setTimeout(() => setCurrentStage("Evaluating evidence relationships & computing verdict..."), 2400);

      const data = await submitCheck({
        input: inputVal.trim(),
        input_type: activeTab,
      });

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);

      if (data.check_id) {
        router.push(`/check/${data.check_id}`);
      } else {
        throw new Error("No check ID returned from verification engine.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while verifying the claim.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Input Mode Selector Tabs */}
      <div className="flex items-center justify-center p-1.5 mb-4 rounded-2xl bg-secondary/70 border border-border/80 backdrop-blur-md max-w-lg mx-auto shadow-sm">
        <button
          type="button"
          onClick={() => { setActiveTab("TEXT"); setErrorMsg(""); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "TEXT"
              ? "bg-background text-foreground shadow-sm shadow-black/5"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="h-4 w-4 text-emerald-500" />
          <span>Text Claim</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab("URL"); setErrorMsg(""); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "URL"
              ? "bg-background text-foreground shadow-sm shadow-black/5"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LinkIcon className="h-4 w-4 text-cyan-500" />
          <span>News URL</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab("IMAGE"); setErrorMsg(""); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "IMAGE"
              ? "bg-background text-foreground shadow-sm shadow-black/5"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ImageIcon className="h-4 w-4 text-amber-500" />
          <span>Image</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab("WHATSAPP"); setErrorMsg(""); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "WHATSAPP"
              ? "bg-background text-foreground shadow-sm shadow-black/5"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquare className="h-4 w-4 text-emerald-400" />
          <span>WhatsApp</span>
        </button>
      </div>

      {/* Main Verification Card */}
      <div className="rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl p-5 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle glowing accent */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="relative">
            <textarea
              rows={activeTab === "TEXT" || activeTab === "WHATSAPP" ? 4 : 2}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                activeTab === "TEXT"
                  ? "Paste a news statement, viral headline, or factual claim to verify with evidence..."
                  : activeTab === "URL"
                  ? "https://example.com/news/article-headline..."
                  : activeTab === "IMAGE"
                  ? "Describe or paste text extracted from screenshot / infographic..."
                  : "Paste viral WhatsApp forward message here..."
              }
              disabled={loading}
              className="w-full rounded-2xl border border-border/90 bg-background/90 p-4 sm:p-5 text-sm sm:text-base placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all resize-none shadow-inner"
            />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground w-full sm:w-auto justify-center sm:justify-start">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Evidence-based retrieval from official records & news</span>
            </div>

            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-md shadow-emerald-600/30 transition-all active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying Evidence...</span>
                </>
              ) : (
                <>
                  <span>Check Now</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Stage Progress Indicator while Loading */}
        {loading && (
          <div className="mt-6 pt-6 border-t border-border/50 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/40 border border-border/60">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">
                  Verification Pipeline Active
                </div>
                <div className="text-sm font-medium text-foreground">
                  {currentStage}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Example Pills */}
        <div className="mt-6 pt-5 border-t border-border/40">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Try an Example Claim</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => {
                  setInputVal(ex.text);
                  setActiveTab("TEXT");
                  setErrorMsg("");
                }}
                className="px-3 py-1.5 rounded-lg border border-border/70 bg-secondary/40 hover:bg-secondary hover:border-emerald-500/40 text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
