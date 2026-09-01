"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
  AlertCircle,
  UploadCloud,
  X,
  Lock,
  UserPlus,
  LogIn
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"TEXT" | "URL" | "IMAGE" | "WHATSAPP">("TEXT");
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  // Auth & Guest restriction state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [guestChecksCount, setGuestChecksCount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<"guest_limit" | "modality_lock">("guest_limit");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("sachai_token");
      setIsLoggedIn(!!token);

      const guestChecks = parseInt(localStorage.getItem("sachai_guest_checks") || "0", 10);
      setGuestChecksCount(guestChecks);
    }
  }, []);

  const handleTabChange = (tab: "TEXT" | "URL" | "IMAGE" | "WHATSAPP") => {
    if (!isLoggedIn && tab !== "TEXT") {
      setAuthModalReason("modality_lock");
      setShowAuthModal(true);
      return;
    }
    setActiveTab(tab);
    setErrorMsg("");
  };

  const handleFileSelect = async (file: File) => {
    if (!isLoggedIn) {
      setAuthModalReason("modality_lock");
      setShowAuthModal(true);
      return;
    }

    if (!file) return;
    setErrorMsg("");
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/api/v1/uploads`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Image upload and OCR failed.");
      }

      const uploadData = await res.json();
      if (uploadData.extracted_text) {
        setInputVal(uploadData.extracted_text);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process image OCR.");
    } finally {
      setUploadingImage(false);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) {
      setErrorMsg("Please enter a claim, URL, or statement to verify.");
      return;
    }

    // Guest 1-check limit enforcement
    if (!isLoggedIn) {
      if (activeTab !== "TEXT") {
        setAuthModalReason("modality_lock");
        setShowAuthModal(true);
        return;
      }
      if (guestChecksCount >= 1) {
        setAuthModalReason("guest_limit");
        setShowAuthModal(true);
        return;
      }
    }

    setLoading(true);
    setErrorMsg("");
    setCurrentStage("Extracting and decomposing factual claim...");

    try {
      const progressTimer = setTimeout(() => {
        setCurrentStage("Searching primary sources & fact-check registries...");
      }, 1200);

      const progressTimer2 = setTimeout(() => {
        setCurrentStage("Ranking source reliability & evaluating evidence...");
      }, 2500);

      const data = await submitCheck({
        input: inputVal,
        input_type: activeTab,
      });

      clearTimeout(progressTimer);
      clearTimeout(progressTimer2);

      // Increment guest checks count if anonymous
      if (!isLoggedIn) {
        const newCount = guestChecksCount + 1;
        setGuestChecksCount(newCount);
        if (typeof window !== "undefined") {
          localStorage.setItem("sachai_guest_checks", newCount.toString());
        }
      }

      router.push(`/check/${data.check_id}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Verification request failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/10 space-y-6">
        {/* Modality Tabs */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
            <button
              type="button"
              onClick={() => handleTabChange("TEXT")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "TEXT"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Text Claim</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("URL")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "URL"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              <LinkIcon className="h-4 w-4" />
              <span>News URL</span>
              {!isLoggedIn && <Lock className="h-3 w-3 opacity-60 ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("IMAGE")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "IMAGE"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Image & OCR</span>
              {!isLoggedIn && <Lock className="h-3 w-3 opacity-60 ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("WHATSAPP")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "WHATSAPP"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>WhatsApp</span>
              {!isLoggedIn && <Lock className="h-3 w-3 opacity-60 ml-0.5" />}
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI + Live Evidence</span>
          </div>
        </div>

        {/* Guest 1-Check Banner */}
        {!isLoggedIn && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/40 border border-border/80 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span>
                Guest Mode: <strong>{1 - Math.min(guestChecksCount, 1)} free text check remaining</strong>
              </span>
            </div>
            <Link href="/sign-up" className="text-emerald-500 font-semibold hover:underline flex items-center gap-1">
              Sign up for unlimited <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Image Upload Zone */}
          {activeTab === "IMAGE" && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />

              {imagePreview ? (
                <div className="relative rounded-2xl border border-border overflow-hidden bg-secondary/30 p-2 flex items-center gap-4">
                  <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-xl border border-border" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{selectedFile?.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {uploadingImage ? "Transcribing text via Multimodal Vision..." : "Image text transcribed into box below"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearImage}
                    className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors mr-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-border hover:border-emerald-500/60 rounded-2xl p-6 text-center space-y-2 bg-secondary/20 hover:bg-secondary/40 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold text-foreground">Click to upload screenshot, photo, or infographic</p>
                  <p className="text-[11px] text-muted-foreground">PNG, JPEG, or WEBP up to 10MB (Magic-byte verified)</p>
                </div>
              )}
            </div>
          )}

          {/* Text Area */}
          <div className="relative">
            <textarea
              rows={activeTab === "WHATSAPP" ? 5 : 3}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={loading}
              placeholder={
                activeTab === "URL"
                  ? "Paste public news article URL (e.g. https://www.reuters.com/...)..."
                  : activeTab === "IMAGE"
                  ? "Transcribed text from image appears here, or type extra context..."
                  : activeTab === "WHATSAPP"
                  ? "Paste entire forwarded WhatsApp message here. SACHAI will decompose multiple claims automatically..."
                  : "Enter statement, news claim, or viral quote to verify (e.g. 'India banned 2000 rupee notes')..."
              }
              className="w-full rounded-2xl border border-border bg-background/60 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all placeholder:text-muted-foreground/60 resize-none font-normal"
            />
          </div>

          {/* Quick Example Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Quick Try:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {QUICK_EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  type="button"
                  onClick={() => {
                    setInputVal(ex.text);
                    setActiveTab("TEXT");
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium border border-border/80 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{currentStage || "Verifying with Evidence..."}</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Verify Claim Against Evidence</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Auth Prompt Modal for Guest Limits & Modality Lock */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center border border-amber-500/20">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {authModalReason === "guest_limit"
                  ? "Free Guest Check Used"
                  : "Sign In Required for This Feature"}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {authModalReason === "guest_limit"
                  ? "You have completed your 1 free guest fact check. Create a free account or sign in to continue unlimited evidence verification."
                  : "News URL scraping, Multimodal Image OCR, and WhatsApp forward decomposition require a free account."}
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <Link
                href="/sign-up"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs text-center transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25"
              >
                <UserPlus className="h-4 w-4" /> Create Free Account
              </Link>
              <Link
                href="/sign-in"
                className="w-full py-2.5 rounded-xl border border-border bg-secondary hover:bg-secondary/70 text-foreground font-semibold text-xs text-center transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="h-4 w-4" /> Sign In to Existing Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
