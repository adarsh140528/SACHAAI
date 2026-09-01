"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  History,
  Search,
  Filter,
  ArrowRight,
  Trash2,
  ExternalLink,
  RefreshCw,
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
      let url = `${API_URL}/api/v1/checks?limit=50`;
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
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Verification History
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Search, filter, and inspect past evidence-based verification runs
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search verified statements or claims..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>

        {/* Verdict Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {VERDICT_FILTERS.map((vf) => (
            <button
              key={vf}
              onClick={() => setSelectedVerdict(vf)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedVerdict === vf
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {vf}
            </button>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-3xl border border-border/80 bg-card/80 backdrop-blur-sm p-6 shadow-sm">
        {loading ? (
          <div className="py-12 text-center space-y-2 text-muted-foreground">
            <RefreshCw className="h-6 w-6 text-emerald-500 animate-spin mx-auto" />
            <p className="text-xs">Loading verification records...</p>
          </div>
        ) : filteredChecks.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            No verification records found matching your filters.
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filteredChecks.map((item) => {
              const relClass = getVerdictBadgeClass(item.overall_verdict);
              return (
                <div
                  key={item.check_id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/20 px-3 rounded-xl transition-colors"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <Link
                      href={`/check/${item.check_id}`}
                      className="text-sm font-semibold text-foreground hover:text-emerald-500 transition-colors line-clamp-2"
                    >
                      &quot;{item.raw_input}&quot;
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="uppercase font-mono text-[10px] px-2 py-0.5 rounded bg-secondary border border-border">
                        {item.input_type}
                      </span>
                      <span>Verified: {formatDate(item.created_at)}</span>
                      <span>•</span>
                      <span>{item.claims?.[0]?.evidence?.length || 0} Sources</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <span className={`px-3 py-1 rounded-md text-xs font-extrabold border ${relClass}`}>
                      {item.overall_verdict || "PROCESSING"}
                    </span>
                    <Link
                      href={`/check/${item.check_id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-secondary transition-colors"
                    >
                      Inspect <ArrowRight className="h-3.5 w-3.5" />
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
