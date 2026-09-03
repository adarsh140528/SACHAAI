"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  LogIn,
  Shield
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
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<string>("Verification requires an account");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("sachai_token");
      setIsLoggedIn(!!token);
    }
  }, []);

  const handleTabChange = (tab: "TEXT" | "URL" | "IMAGE" | "WHATSAPP") => {
    if (!isLoggedIn && tab !== "TEXT") {
      setAuthModalReason("News URL verification, Image OCR, and WhatsApp analysis require an account.");
      setShowAuthModal(true);
      return;
    }
    setActiveTab(tab);
    setErrorMsg("");
  };

  const handleFileSelect = async (file: File) => {
    if (!isLoggedIn) {
      setAuthModalReason("Uploading image evidence and multimodal OCR requires signing in.");
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
      const token = localStorage.getItem("sachai_token");
      const res = await fetch(`${API_URL}/api/v1/uploads`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
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

    // STRICT: Require authentication before running ANY fact-check
    if (!isLoggedIn) {
      setAuthModalReason("Please sign in or create an account to run factual verifications.");
      setShowAuthModal(true);
      return;
    }

    if (!inputVal.trim()) {
      setErrorMsg("Please enter a claim, URL, or statement to verify.");
      return;
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
            <span>SACHAI v2.1</span>
          </div>
        </div>

        {/* Auth Required Notification Banner */}
        {!isLoggedIn && (
          <div className="flex items-center justify-between px-4 py-2.5 bg-accent-blue/10 border-b border-accent-blue/20 text-xs text-foreground">
            <div className="flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-accent-blue shrink-0" />
              <span className="text-[11px] text-muted-foreground">
                <strong className="text-foreground">Sign in required:</strong> Create an account or sign in to verify claims and inspect evidence.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/sign-in" className="text-[11px] font-semibold text-muted-foreground hover:text-foreground">
                Sign in
              </Link>
              <Link href="/sign-up" className="text-[11px] font-bold text-accent-blue hover:underline flex items-center gap-0.5">
                Sign up <ArrowRight className="h-2.5 w-2.5" />
              </Link>
            </div>
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
                  onClick={() => {
                    if (!isLoggedIn) {
                      setAuthModalReason("Uploading image evidence and multimodal OCR requires signing in.");
                      setShowAuthModal(true);
                      return;
                    }
                    fileInputRef.current?.click();
                  }}
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
                  ? "Paste entire forwarded WhatsApp message here. SACHAI will decompose claims..."
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
                if (!isLoggedIn) {
                  setAuthModalReason("Uploading image evidence requires signing in.");
                  setShowAuthModal(true);
                  return;
                }
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

      {/* Global Full-Screen Auth Prompt Modal (Rendered to body via createPortal) */}
      {mounted && showAuthModal && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowAuthModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200"
            style={{ backgroundColor: "hsl(var(--card))" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Header & Icon */}
            <div className="text-center space-y-3 pt-2">
              <div className="h-14 w-14 rounded-2xl bg-accent-blue/10 text-accent-blue mx-auto flex items-center justify-center border border-accent-blue/20 shadow-inner">
                <Lock className="h-7 w-7" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold tracking-tight text-foreground font-sans">
                  Sign In Required to Verify Facts
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {authModalReason || "Please sign in or create an account to run factual verifications."}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <Link
                href="/sign-up"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs text-center transition-all hover:opacity-90 flex items-center justify-center gap-2 shadow-md shadow-primary/10"
              >
                <UserPlus className="h-4 w-4" />
                <span>Create Free Account</span>
              </Link>
              <Link
                href="/sign-in"
                className="w-full py-3 rounded-xl border border-border bg-secondary/60 hover:bg-secondary text-foreground font-bold text-xs text-center transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In to Existing Account</span>
              </Link>
            </div>

            {/* Trust Footer */}
            <div className="pt-2 border-t border-border/60 text-center">
              <p className="text-[10px] font-mono text-muted-foreground flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-verdict-true" />
                <span>Verifiable primary records • IFCN certified • Free access</span>
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
