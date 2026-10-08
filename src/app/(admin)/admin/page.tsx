"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import { useAuthContext } from "@/components/providers/AuthProvider";
import PlatformStatsGrid from "@/features/admin/PlatformStatsGrid";
import RevenueChart from "@/features/admin/RevenueChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Loader2,
  Users,
  ShieldCheck,
  CheckSquare,
  DollarSign,
  Settings,
  ArrowRight,
  Activity,
  UserCheck,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuthContext();

  const {
    data: stats,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: () => adminService.getPlatformStats(),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Header & Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-terracotta-light text-terracotta border border-terracotta/20 mb-2">
            <ShieldAlert className="size-3.5" /> Platform Administration
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Platform Command Center
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-xl">
            Welcome back, {user?.name?.split(" ")[0] || "Administrator"}. Monitor live platform transactions, moderate pending applications, and manage system operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface border border-border hover:border-amber/40 hover:text-amber transition-colors shadow-2xs text-text-primary cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 text-amber ${isRefetching ? "animate-spin" : ""}`} />
            Refresh Metrics
          </button>
        </div>
      </div>

      {/* 2. Quick Action Moderation Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Link
          href="/admin/mentors"
          className="p-3.5 rounded-2xl bg-surface border border-border hover:border-amber/40 hover:shadow-2xs transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="size-8 rounded-lg bg-amber-light text-amber flex items-center justify-center border border-amber/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="size-4" />
            </div>
            {stats && stats.pendingMentorApplications > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber text-white">
                {stats.pendingMentorApplications}
              </span>
            )}
          </div>
          <div className="mt-3">
            <span className="text-xs font-bold text-text-primary group-hover:text-amber transition-colors block">
              Mentor Queue
            </span>
            <span className="text-[11px] text-text-muted">Applications review</span>
          </div>
        </Link>

        <Link
          href="/admin/cohorts"
          className="p-3.5 rounded-2xl bg-surface border border-border hover:border-purple-500/40 hover:shadow-2xs transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="size-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20 group-hover:scale-105 transition-transform">
              <CheckSquare className="size-4" />
            </div>
            {stats && stats.pendingCohorts > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500 text-white">
                {stats.pendingCohorts}
              </span>
            )}
          </div>
          <div className="mt-3">
            <span className="text-xs font-bold text-text-primary group-hover:text-purple-500 transition-colors block">
              Cohort Queue
            </span>
            <span className="text-[11px] text-text-muted">Course moderation</span>
          </div>
        </Link>

        <Link
          href="/admin/users"
          className="p-3.5 rounded-2xl bg-surface border border-border hover:border-blue-500/40 hover:shadow-2xs transition-all group flex flex-col justify-between"
        >
          <div className="size-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 group-hover:scale-105 transition-transform">
            <Users className="size-4" />
          </div>
          <div className="mt-3">
            <span className="text-xs font-bold text-text-primary group-hover:text-blue-500 transition-colors block">
              User Directory
            </span>
            <span className="text-[11px] text-text-muted">Roles & blocking</span>
          </div>
        </Link>

        <Link
          href="/admin/payouts"
          className="p-3.5 rounded-2xl bg-surface border border-border hover:border-emerald/40 hover:shadow-2xs transition-all group flex flex-col justify-between"
        >
          <div className="size-8 rounded-lg bg-emerald/10 text-emerald flex items-center justify-center border border-emerald/20 group-hover:scale-105 transition-transform">
            <DollarSign className="size-4" />
          </div>
          <div className="mt-3">
            <span className="text-xs font-bold text-text-primary group-hover:text-emerald transition-colors block">
              Payout Requests
            </span>
            <span className="text-[11px] text-text-muted">bKash cash-outs</span>
          </div>
        </Link>

        <Link
          href="/admin/settings"
          className="p-3.5 rounded-2xl bg-surface border border-border hover:border-amber/40 hover:shadow-2xs transition-all group flex flex-col justify-between col-span-2 sm:col-span-1"
        >
          <div className="size-8 rounded-lg bg-surface-raised text-text-primary flex items-center justify-center border border-border group-hover:scale-105 transition-transform">
            <Settings className="size-4" />
          </div>
          <div className="mt-3">
            <span className="text-xs font-bold text-text-primary group-hover:text-amber transition-colors block">
              System Settings
            </span>
            <span className="text-[11px] text-text-muted">Fee & rates configuration</span>
          </div>
        </Link>
      </div>

      {isLoading || !stats ? (
        <div className="p-16 rounded-2xl border border-border/80 bg-surface flex flex-col items-center justify-center gap-3 text-text-muted">
          <Loader2 className="size-7 animate-spin text-amber" />
          <span className="text-sm font-medium">Aggregating platform statistics...</span>
        </div>
      ) : (
        <>
          {/* 3. Platform Statistics Grid */}
          <PlatformStatsGrid stats={stats} />

          {/* 4. Revenue & Platform Commission Chart */}
          <RevenueChart data={stats.monthlyRevenue} />

          {/* 5. Live Moderation Status & Recent Activity Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Health & Commission Metrics */}
            <Card className="border border-border/80 shadow-xs bg-surface">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="size-4 text-emerald" />
                    <CardTitle className="text-sm font-bold text-text-primary">
                      Platform Financial Health
                    </CardTitle>
                  </div>
                  <span className="text-[10px] font-bold text-emerald uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-light border border-emerald/20">
                    Operational
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3.5 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-raised/60 border border-border/70">
                  <div>
                    <span className="font-semibold text-text-primary block">Platform Commission Rate</span>
                    <span className="text-[11px] text-text-muted">Deducted from student sprint & cohort transactions</span>
                  </div>
                  <span className="font-bold text-amber font-mono text-sm">15.0%</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-raised/60 border border-border/70">
                  <div>
                    <span className="font-semibold text-text-primary block">Credit Exchange Parity</span>
                    <span className="text-[11px] text-text-muted">Fixed conversion value per credit point</span>
                  </div>
                  <span className="font-bold text-text-primary font-mono text-sm">৳4.00 BDT</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-raised/60 border border-border/70">
                  <div>
                    <span className="font-semibold text-text-primary block">Minimum Cash-Out Threshold</span>
                    <span className="text-[11px] text-text-muted">Minimum mentor withdrawal limit</span>
                  </div>
                  <span className="font-bold text-text-primary font-mono text-sm">50 Cr (৳200)</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Audit & Security Highlights */}
            <Card className="border border-border/80 shadow-xs bg-surface">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-amber" />
                    <CardTitle className="text-sm font-bold text-text-primary">
                      Recent Moderation Audit Events
                    </CardTitle>
                  </div>
                  <Link
                    href="/admin/audit-logs"
                    className="text-[11px] font-semibold text-amber hover:underline flex items-center gap-0.5"
                  >
                    View Logs <ArrowRight className="size-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs">
                <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-raised/60 transition-colors">
                  <div className="size-7 rounded-lg bg-emerald/10 text-emerald flex items-center justify-center shrink-0 border border-emerald/20 mt-0.5">
                    <UserCheck className="size-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary">Mentor Application Approved</p>
                    <p className="text-[11px] text-text-muted truncate">
                      Alex Rivera promoted to Senior Mentor
                    </p>
                  </div>
                  <span className="text-[10px] text-text-muted font-mono whitespace-nowrap">Today</span>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-raised/60 transition-colors">
                  <div className="size-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 border border-purple-500/20 mt-0.5">
                    <CheckSquare className="size-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary">Cohort Program Approved</p>
                    <p className="text-[11px] text-text-muted truncate">
                      Full-Stack Next.js Mastery published live
                    </p>
                  </div>
                  <span className="text-[10px] text-text-muted font-mono whitespace-nowrap">Yesterday</span>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-raised/60 transition-colors">
                  <div className="size-7 rounded-lg bg-amber-light text-amber flex items-center justify-center shrink-0 border border-amber/20 mt-0.5">
                    <DollarSign className="size-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary">bKash Cash-Out Payout</p>
                    <p className="text-[11px] text-text-muted truncate">
                      ৳4,000 processed to mentor wallet
                    </p>
                  </div>
                  <span className="text-[10px] text-text-muted font-mono whitespace-nowrap">2 days ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
