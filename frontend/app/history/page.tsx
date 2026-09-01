"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  History,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Globe,
  SlidersHorizontal
} from "lucide-react";
import { getVerdictBadgeClass, formatDate } from "@/lib/utils";

const VERDICT_FILTERS = ["ALL", "TRUE", "FALSE", "MISLEADING", "PARTLY_TRUE", "UNVERIFIED", "OUTDATED"];

export default function HistoryPage() {
  const [checks, setChecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVerdict, setSelectedVerdict] = useState("ALL");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchHistory = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/v1/checks?limit=50&filter_by_user=false`;
      if (selectedVerdict !== "ALL") {
        url += `&verdict=${selectedVerdict}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setChecks(data.items || []);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedVerdict]);

  const filteredChecks = checks.filter((c) =>
    c.raw_input.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container max-w-6xl px-4 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1">
            <Globe className="h-3.5 w-3.5" /> Public Community Feed
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Verification History
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Search, filter, and inspect verified claims across the entire network in real time
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Archive
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search verified statements, keywords, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-card text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-muted-foreground"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {VERDICT_FILTERS.map((vf) => (
            <button
              key={vf}
              onClick={() => setSelectedVerdict(vf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                selectedVerdict === vf
                  ? "bg-primary text-white border-primary"
                  : "bg-card border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {vf === "ALL" ? "All Verdicts" : vf}
            </button>
          ))}
        </div>
      </div>

      {/* History Table-First List */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-muted-foreground space-y-2">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary" />
            <p>Loading community verification records...</p>
          </div>
        ) : filteredChecks.length === 0 ? (
          <div className="py-16 text-center text-xs text-muted-foreground space-y-3">
            <History className="h-8 w-8 mx-auto text-muted-foreground/50" />
            <p className="font-semibold text-foreground">No verification records found</p>
            <p>Try clearing filters or search terms.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90"
            >
              Verify New Claim
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredChecks.map((item) => {
              const relClass = getVerdictBadgeClass(item.overall_verdict);
              return (
                <div
                  key={item.check_id}
                  className="p-4 sm:px-6 hover:bg-secondary/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <Link
                      href={`/check/${item.check_id}`}
                      className="text-xs sm:text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.raw_input}
                    </Link>
                    <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-muted-foreground">
                      <span className="uppercase font-mono">{item.input_type}</span>
                      <span>•</span>
                      <span>{formatDate(item.created_at)}</span>
                      <span>•</span>
                      <span>{item.processing_time_ms}ms</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold border ${relClass}`}>
                      {item.overall_verdict || "PROCESSING"}
                    </span>
                    <Link
                      href={`/check/${item.check_id}`}
                      className="p-1.5 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      title="Inspect Report"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
