"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  Zap,
  RefreshCw,
  Lock,
  User
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";
import { getVerdictBadgeClass, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentChecks, setRecentChecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{ full_name?: string; email?: string } | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchDashboardData = async () => {
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("sachai_token") : null;
    const userRaw = typeof window !== "undefined" ? localStorage.getItem("sachai_user") : null;

    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);
    if (userRaw) {
      try {
        setUserProfile(JSON.parse(userRaw));
      } catch {
        setUserProfile(null);
      }
    }

    try {
      const authHeaders: Record<string, string> = {
        "Authorization": `Bearer ${token}`
      };

      const [analyticsRes, checksRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/analytics`, { headers: authHeaders }),
        fetch(`${API_URL}/api/v1/checks?limit=8&filter_by_user=true`, { headers: authHeaders }),
      ]);

      if (analyticsRes.ok) {
        const aData = await analyticsRes.json();
        setAnalytics(aData);
      }
      if (checksRes.ok) {
        const cData = await checksRes.json();
        setRecentChecks(cData.items || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-3">
        <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">Loading your personal verification telemetry...</p>
      </div>
    );
  }

  // If user is not logged in, prompt to Sign In / Sign Up
  if (!isLoggedIn) {
    return (
      <div className="container max-w-lg px-4 py-20 mx-auto text-center space-y-6">
        <div className="h-16 w-16 rounded-3xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center border border-amber-500/20 shadow-lg">
          <Lock className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Account Required
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to view your individual verification analytics, historical trends, and personal claims breakdown.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/sign-in"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-md shadow-emerald-600/25 transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-border bg-secondary hover:bg-secondary/70 text-foreground text-sm font-semibold transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  const verdictData = analytics?.verdict_distribution?.filter((v: any) => v.value > 0) || [
    { name: "True", value: analytics?.true_count || 0, color: "#10b981" },
    { name: "False", value: analytics?.false_count || 0, color: "#ef4444" },
    { name: "Misleading", value: analytics?.misleading_count || 0, color: "#f59e0b" },
    { name: "Partly True", value: analytics?.partly_true_count || 0, color: "#f97316" },
  ];

  const inputData = analytics?.input_distribution || [
    { name: "Text Claims", count: 0 },
    { name: "News URLs", count: 0 },
    { name: "Images / OCR", count: 0 },
    { name: "WhatsApp", count: 0 },
  ];

  const displayName = userProfile?.full_name || userProfile?.email?.split("@")[0] || "User";

  return (
    <div className="container max-w-7xl px-4 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">
            <User className="h-3.5 w-3.5" /> Individual User Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {displayName}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Personal verification telemetry and evidence analytics for your account ({userProfile?.email})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-600/25 transition-all"
          >
            + New Verification
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Your Checks</span>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold">{analytics?.total_checks || 0}</div>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">True</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-500">{analytics?.true_count || 0}</div>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">False</span>
            <XCircle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-500">{analytics?.false_count || 0}</div>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Misleading</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-500">{analytics?.misleading_count || 0}</div>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Unverified</span>
            <HelpCircle className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-400">{analytics?.unverified_count || 0}</div>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-500">Avg Latency</span>
            <Zap className="h-4 w-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-500">{analytics?.avg_latency_ms || 0}ms</div>
        </div>
      </div>

      {/* Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verdict Distribution Donut Chart */}
        <div className="p-6 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-tight text-foreground">Your Verdict Distribution</h3>
            <span className="text-xs text-muted-foreground">Evidence Output</span>
          </div>
          <div className="h-64 w-full">
            {analytics?.total_checks === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No verifications recorded for your account yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={verdictData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {verdictData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color || "#10b981"} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#fff" }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Input Format Bar Chart */}
        <div className="p-6 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-tight text-foreground">Your Ingestion Breakdown</h3>
            <span className="text-xs text-muted-foreground">Multi-modal Ingestion</span>
          </div>
          <div className="h-64 w-full">
            {analytics?.total_checks === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No verifications recorded for your account yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inputData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#fff" }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Your Recent Verifications Table */}
      <div className="rounded-3xl border border-border/80 bg-card/80 backdrop-blur-sm p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold tracking-tight text-foreground">Your Recent Verifications</h3>
          <Link href="/history" className="text-xs font-semibold text-emerald-500 hover:underline flex items-center gap-1">
            View Community History <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-border/50">
          {recentChecks.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              You have not verified any claims with this account yet. Verify your first claim from the homepage!
            </div>
          ) : (
            recentChecks.map((item: any) => {
              const relClass = getVerdictBadgeClass(item.overall_verdict);
              return (
                <div
                  key={item.check_id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-secondary/30 px-3 rounded-xl transition-colors"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <Link
                      href={`/check/${item.check_id}`}
                      className="text-sm font-semibold text-foreground hover:text-emerald-500 transition-colors line-clamp-1"
                    >
                      {item.raw_input}
                    </Link>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="uppercase font-mono">{item.input_type}</span>
                      <span>•</span>
                      <span>{formatDate(item.created_at)}</span>
                      <span>•</span>
                      <span>{item.processing_time_ms}ms</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold border ${relClass}`}>
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
            })
          )}
        </div>
      </div>
    </div>
  );
}
