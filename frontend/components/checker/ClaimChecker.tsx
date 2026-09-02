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
      <div className="w-full bg-card border border-border shadow-xl shadow-primary/5 rounded-lg overflow-hidden flex flex-col transition-all hover:shadow-2xl">
        {/* Top Bar with Modality Tabs & Brand Tag */}
        <div className="bg-secondary/40 border-b border-border px-4 py-2.5 flex items-center justify-between">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleTabChange("TEXT")}
              className={`font-mono text-xs uppercase flex items-center gap-1 pb-1 transition-all ${
                activeTab === "TEXT"
                  ? "text-primary font-bold border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Text</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("IMAGE")}
              className={`font-mono text-xs uppercase flex items-center gap-1 pb-1 transition-all ${
                activeTab === "IMAGE"
                  ? "text-primary font-bold border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Image</span>
              {!isLoggedIn && <Lock className="h-3 w-3 opacity-60 ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("URL")}
              className={`font-mono text-xs uppercase flex items-center gap-1 pb-1 transition-all ${
                activeTab === "URL"
                  ? "text-primary font-bold border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LinkIcon className="h-3.5 w-3.5" />
              <span>URL</span>
              {!isLoggedIn && <Lock className="h-3 w-3 opacity-60 ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("WHATSAPP")}
              className={`font-mono text-xs uppercase flex items-center gap-1 pb-1 transition-all ${
                activeTab === "WHATSAPP"
                  ? "text-primary font-bold border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
              {!isLoggedIn && <Lock className="h-3 w-3 opacity-60 ml-0.5" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-verdict-true animate-pulse" />
            <span>SACHLAI v2.1</span>
          </div>
        </div>

        {/* Guest 1-Check Banner */}
        {!isLoggedIn && (
          <div className="flex items-center justify-between px-4 py-2 bg-secondary/30 border-b border-border text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span>
                Guest Mode: <strong>{1 - Math.min(guestChecksCount, 1)} free text check remaining</strong>
              </span>
            </div>
            <Link href="/sign-up" className="text-accent-blue font-semibold hover:underline flex items-center gap-0.5">
              Sign up <ArrowRight className="h-2.5 w-2.5" />
            </Link>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 flex flex-col gap-3.5">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-xs animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Image Upload Zone */}
          {activeTab === "IMAGE" && (
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />

              {imagePreview ? (
                <div className="relative rounded-md border border-border overflow-hidden bg-secondary/30 p-2.5 flex items-center gap-3">
                  <img src={imagePreview} alt="Preview" className="h-14 w-14 object-cover rounded border border-border" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{selectedFile?.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {uploadingImage ? "Transcribing text via Multimodal Vision..." : "Image text transcribed into box below"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearImage}
                    className="p-1 rounded border border-border hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors mr-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer border border-dashed border-border hover:border-accent-blue rounded-md p-4 text-center space-y-1.5 bg-secondary/20 hover:bg-secondary/40 transition-colors"
                >
                  <div className="h-8 w-8 rounded bg-card text-primary mx-auto flex items-center justify-center border border-border shadow-sm">
                    <UploadCloud className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-semibold text-foreground">Click to upload screenshot or photo</p>
                  <p className="text-[10px] text-muted-foreground font-mono">PNG, JPEG, or WEBP up to 10MB (Magic-byte verified)</p>
                </div>
              )}
            </div>
          )}

          {/* Text Area */}
          <div className="relative">
            <textarea
              rows={activeTab === "WHATSAPP" ? 5 : 4}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={loading}
              placeholder={
                activeTab === "URL"
                  ? "Paste a public news article URL to verify embedded claims..."
                  : activeTab === "IMAGE"
                  ? "Transcribed text from image appears here, or type extra context..."
                  : activeTab === "WHATSAPP"
                  ? "Paste entire forwarded WhatsApp message here. SACHLAI will decompose claims..."
                  : "Paste a claim, forward, or statement here to begin forensic analysis..."
              }
              className="w-full bg-card resize-none border border-border rounded-md p-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 transition-all shadow-inner leading-relaxed"
            />
          </div>

          {/* Bottom Controls Row: Upload Evidence + Check Claim Button */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab("IMAGE");
                fileInputRef.current?.click();
              }}
              className="flex items-center gap-2 font-medium text-muted-foreground hover:text-foreground transition-colors group text-xs"
            >
              <div className="w-7 h-7 rounded border border-border flex items-center justify-center bg-card group-hover:border-primary transition-colors shadow-sm">
                <UploadCloud className="h-3.5 w-3.5 text-foreground" />
              </div>
              <span>Upload Evidence</span>
            </button>

            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="bg-primary text-primary-foreground font-semibold text-xs px-5 py-2 rounded hover:opacity-90 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>{currentStage || "Analyzing..."}</span>
                </>
              ) : (
                <>
                  <Search className="h-3.5 w-3.5" />
                  <span>Check Claim</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Examples */}
          <div className="pt-2 border-t border-border/60 flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
              Try:
            </span>
            {QUICK_EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => {
                  setInputVal(ex.text);
                  setActiveTab("TEXT");
                }}
                className="px-2 py-0.5 rounded text-[11px] font-medium border border-border bg-secondary/30 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Auth Prompt Modal for Guest Limits & Modality Lock */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xl space-y-6 relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center space-y-3">
              <div className="h-10 w-10 rounded-lg bg-secondary text-primary mx-auto flex items-center justify-center border border-border">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-foreground font-sans">
                {authModalReason === "guest_limit"
                  ? "Free Guest Check Used"
                  : "Sign In Required for This Feature"}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {authModalReason === "guest_limit"
                  ? "You have completed your free guest fact check. Create a free account or sign in to continue unlimited evidence verification."
                  : "News URL scraping, Multimodal Image OCR, and WhatsApp forward decomposition require an account."}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href="/sign-up"
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs text-center transition-opacity hover:opacity-90 flex items-center justify-center gap-2 shadow-sm"
              >
                <UserPlus className="h-3.5 w-3.5" /> Create Free Account
              </Link>
              <Link
                href="/sign-in"
                className="w-full py-2.5 rounded-lg border border-border bg-secondary hover:bg-secondary/70 text-foreground font-semibold text-xs text-center transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="h-3.5 w-3.5" /> Sign In to Existing Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
