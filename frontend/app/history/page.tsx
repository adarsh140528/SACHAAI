"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { formatDate } from "@/lib/utils";

const VERDICT_FILTERS = ["ALL", "TRUE", "FALSE", "MISLEADING", "PARTLY_TRUE", "UNVERIFIED", "OUTDATED"];

export default function HistoryPage() {
  const router = useRouter();
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
    <div className="container max-w-7xl px-4 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-accent-blue uppercase tracking-wider mb-1">
            <Globe className="h-3.5 w-3.5" /> Public Auditable Repository
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-sans">
            Audit Archive & Investigation Feed
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Transparent network-wide fact check history with reproducible evidence trails
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Feed
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search audited claims, topics, or sources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-card text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue transition-all placeholder:text-muted-foreground"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {VERDICT_FILTERS.map((vf) => (
            <button
              key={vf}
              onClick={() => setSelectedVerdict(vf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border font-mono ${
                selectedVerdict === vf
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {vf}
            </button>
          ))}
        </div>
      </div>

      {/* High-Density Investigation Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-5 border-b border-border bg-secondary/30 flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Audited Claims Feed
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            Showing {filteredChecks.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/40 border-b border-border font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Claim Assertion</th>
                <th className="py-2.5 px-3 font-semibold">Verdict</th>
                <th className="py-2.5 px-3 font-semibold">Confidence</th>
                <th className="py-2.5 px-3 font-semibold">Modality</th>
                <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                <th className="py-2.5 px-4 text-right font-semibold">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground font-mono">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                    Fetching network archives...
                  </td>
                </tr>
              ) : filteredChecks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground font-mono">
                    No verified statements found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredChecks.map((chk) => {
                  const verdict = chk.overall_verdict || "UNVERIFIED";
                  return (
                    <tr
                      key={chk.id || chk.check_id}
                      onClick={() => router.push(`/check/${chk.check_id || chk.id}`)}
                      className="hover:bg-secondary/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4 max-w-[320px]">
                        <div className="truncate font-medium text-foreground group-hover:text-accent-blue transition-colors">
                          &ldquo;{chk.raw_input}&rdquo;
                        </div>
                        <div className="font-mono text-[10px] text-muted-foreground truncate">
                          ID: {chk.check_id?.slice(0, 12) || "chk_..."}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border"
                          style={{
                            backgroundColor:
                              verdict === "TRUE"
                                ? "rgba(21, 128, 61, 0.1)"
                                : verdict === "FALSE"
                                ? "rgba(220, 38, 38, 0.1)"
                                : verdict === "MISLEADING"
                                ? "rgba(217, 119, 6, 0.1)"
                                : "rgba(100, 116, 139, 0.1)",
                            color:
                              verdict === "TRUE"
                                ? "#15803D"
                                : verdict === "FALSE"
                                ? "#DC2626"
                                : verdict === "MISLEADING"
                                ? "#D97706"
                                : "#64748B",
                            borderColor:
                              verdict === "TRUE"
                                ? "rgba(21, 128, 61, 0.2)"
                                : verdict === "FALSE"
                                ? "rgba(220, 38, 38, 0.2)"
                                : verdict === "MISLEADING"
                                ? "rgba(217, 119, 6, 0.2)"
                                : "rgba(100, 116, 139, 0.2)",
                          }}
                        >
                          {verdict}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {chk.overall_confidence === "HIGH" ? "96%" : chk.overall_confidence === "MEDIUM" ? "78%" : "45%"}
                          </span>
                          <div className="w-12 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: chk.overall_confidence === "HIGH" ? "96%" : chk.overall_confidence === "MEDIUM" ? "78%" : "45%",
                                backgroundColor:
                                  verdict === "TRUE"
                                    ? "#15803D"
                                    : verdict === "FALSE"
                                    ? "#DC2626"
                                    : "#D97706",
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase">
                        {chk.input_type || "TEXT"}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-muted-foreground">
                        {formatDate(chk.created_at)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-muted-foreground group-hover:text-foreground font-mono text-[11px]">
                          Inspect →
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
