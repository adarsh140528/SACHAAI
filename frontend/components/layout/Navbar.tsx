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
  Sparkles
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

  // Logged-out links vs Logged-in links
  const navLinks = isLoggedIn
    ? [
        { href: "/", label: "Verify Claim", icon: ShieldCheck },
        { href: "/dashboard", label: "Dashboard", icon: BarChart2 },
        { href: "/history", label: "History", icon: History },
        { href: "/developers", label: "API & Devs", icon: Terminal },
        { href: "/pricing", label: "Pricing", icon: Bookmark },
      ]
    : [
        { href: "/", label: "Verify Claim", icon: ShieldCheck },
        { href: "/pricing", label: "Pricing", icon: Bookmark },
      ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
              SACHAI<span className="text-emerald-500">.AI</span>
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest -mt-1">
              Evidence Engine
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-secondary text-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-secondary/50 text-xs font-semibold">
                <User className="h-3.5 w-3.5 text-emerald-500" />
                <span>{userName}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-destructive/30 hover:bg-destructive/10 text-destructive text-xs font-semibold transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-xl border border-border px-3.5 py-1.5 text-xs sm:text-sm font-medium hover:bg-secondary transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-1.5 text-xs sm:text-sm font-medium text-white shadow-sm shadow-emerald-600/30 hover:bg-emerald-500 transition-all active:scale-95"
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
