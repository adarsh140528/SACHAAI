"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldCheck,
  Terminal,
  BarChart2,
  History,
  Bookmark,
  Moon,
  Sun,
  LogOut,
  User,
  ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    document.documentElement.classList.add("dark");
    checkAuthStatus();
    
    // Listen for storage events (login/logout across tabs)
    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, [pathname]);

  const checkAuthStatus = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("sachai_token");
      const userRaw = localStorage.getItem("sachai_user");
      if (token) {
        setIsLoggedIn(true);
        if (userRaw) {
          try {
            const u = JSON.parse(userRaw);
            setUserName(u.full_name || u.email?.split("@")[0] || "User");
          } catch {
            setUserName("User");
          }
        }
      } else {
        setIsLoggedIn(false);
        setUserName("");
      }
    }
  };

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("sachai_token");
      localStorage.removeItem("sachai_user");
    }
    setIsLoggedIn(false);
    setUserName("");
    router.push("/");
  };

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  // Editorial Navigation Links
  const navLinks = isLoggedIn
    ? [
        { href: "/", label: "Verify Claim" },
        { href: "/dashboard", label: "Dashboard" },
        { href: "/history", label: "History" },
        { href: "/developers", label: "API & Devs" },
        { href: "/pricing", label: "Pricing" },
      ]
    : [
        { href: "/", label: "Verify Claim" },
        { href: "/pricing", label: "Pricing" },
      ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="container flex h-14 max-w-7xl items-center justify-between px-4 sm:px-8">
        {/* Minimal Geometric Brand Mark */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-sm group-hover:bg-primary/90 transition-colors">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-foreground">
              SACHAI<span className="text-primary">.AI</span>
            </span>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest -mt-1">
              Evidence Engine
            </span>
          </div>
        </Link>

        {/* Clean Editorial Nav Links with Subtle Active Indicators */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Controls & Auth State */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-secondary text-xs font-semibold">
                <User className="h-3 w-3 text-primary" />
                <span>{userName}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-destructive/30 hover:bg-destructive/10 text-destructive text-xs font-semibold transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-3 w-3" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-1 text-xs font-semibold hover:bg-secondary transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-3.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-primary/90 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
