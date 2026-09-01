import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string) {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function getVerdictBadgeClass(verdict?: string) {
  switch (verdict?.toUpperCase()) {
    case "TRUE":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800";
    case "FALSE":
      return "bg-rose-500/10 text-rose-600 border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800";
    case "MISLEADING":
      return "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800";
    case "PARTLY_TRUE":
      return "bg-orange-500/10 text-orange-600 border-orange-500/30 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800";
    case "OUTDATED":
      return "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800";
    case "UNVERIFIED":
    default:
      return "bg-slate-500/10 text-slate-600 border-slate-500/30 dark:bg-slate-900/40 dark:text-slate-400 dark:border-slate-700";
  }
}

export function getConfidenceBadgeClass(confidence?: string) {
  switch (confidence?.toUpperCase()) {
    case "HIGH":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
    case "MEDIUM":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";
    case "LOW":
    default:
      return "bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30";
  }
}
