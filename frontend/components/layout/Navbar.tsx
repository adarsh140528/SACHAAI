"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Sparkles, Terminal, BarChart2, History, Bookmark, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Default to dark mode for modern sleek aesthetic
    document.documentElement.classList.add("dark");
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  const navLinks = [
    { href: "/", label: "Verify Claim", icon: ShieldCheck },
    { href: "/demo", label: "Demo Suite", icon: Sparkles },
    { href: "/dashboard", label: "Dashboard", icon: BarChart2 },
    { href: "/history", label: "History", icon: History },
    { href: "/developers", label: "API & Devs", icon: Terminal },
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
          <Link
            href="/sign-in"
            className="hidden sm:inline-flex items-center justify-center rounded-lg border border-border px-3.5 py-1.5 text-sm font-medium hover:bg-secondary transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm shadow-emerald-600/30 hover:bg-emerald-500 transition-all active:scale-95"
          >
            Check Now
          </Link>
        </div>
      </div>
    </header>
  );
}
