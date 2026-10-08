"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TrendingUp, ArrowUpRight, BarChart3, AlertCircle } from "lucide-react";
import type { RevenueMonthlyDataPoint } from "@/types/admin.types";

interface RevenueChartProps {
  data?: RevenueMonthlyDataPoint[];
}

export default function RevenueChart({ data }: RevenueChartProps = {}) {
  const [activeMetric, setActiveMetric] = React.useState<"all" | "commission" | "gross">("all");
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const chartData = data ?? [];
  const hasRevenueData = chartData.some((d) => d.grossRevenue > 0 || d.platformCommission > 0);

  if (!hasRevenueData) {
    return (
      <Card className="border border-border/80 shadow-xs bg-surface overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-emerald/10 text-emerald flex items-center justify-center border border-emerald/20">
              <TrendingUp className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-text-primary">
                Revenue & Platform Commission Trends
              </CardTitle>
              <CardDescription className="text-xs text-text-muted mt-0.5">
                Monthly breakdown of top-up intake, mentor withdrawals, and platform 15% margin.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-10 pb-12 flex flex-col items-center justify-center text-center space-y-3">
          <div className="size-12 rounded-2xl bg-surface-raised border border-border flex items-center justify-center text-text-muted">
            <BarChart3 className="size-6 text-amber" />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h4 className="text-sm font-bold text-text-primary">
              No Revenue Transaction History Recorded Yet
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Real-time financial charts and monthly commission intake will populate automatically as students complete bKash wallet top-ups and enroll in mentorship sessions.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-amber-light text-amber border border-amber/20 mt-1">
            <AlertCircle className="size-3" /> Live database aggregation active
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxVal = Math.max(...chartData.map((d) => d.grossRevenue), 1);
  const totalGross = chartData.reduce((acc, curr) => acc + curr.grossRevenue, 0);
  const totalCommission = chartData.reduce((acc, curr) => acc + curr.platformCommission, 0);
  const avgMonthly = Math.round(totalGross / Math.max(1, chartData.length));

  return (
    <Card className="border border-border/80 shadow-xs bg-surface overflow-hidden">
      <CardHeader className="pb-4 border-b border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-emerald/10 text-emerald flex items-center justify-center border border-emerald/20">
              <TrendingUp className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-text-primary">
                Revenue & Platform Commission Trends
              </CardTitle>
              <CardDescription className="text-xs text-text-muted mt-0.5">
                Monthly breakdown of top-up intake, mentor withdrawals, and platform margin.
              </CardDescription>
            </div>
          </div>

          {/* Toggle buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-raised border border-border text-xs">
            <button
              type="button"
              onClick={() => setActiveMetric("all")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeMetric === "all"
                  ? "bg-surface text-text-primary shadow-2xs border border-border/60"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              All Metrics
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric("commission")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeMetric === "commission"
                  ? "bg-surface text-amber shadow-2xs border border-border/60"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              Platform Margin
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric("gross")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeMetric === "gross"
                  ? "bg-surface text-emerald shadow-2xs border border-border/60"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              Gross Intake
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Metric Summary Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-surface-raised/60 border border-border/70">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
              Gross Top-Up Volume
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-mono text-text-primary">
                ৳{totalGross.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald font-semibold flex items-center">
                <ArrowUpRight className="size-3" /> Live
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-raised/60 border border-border/70">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
              Net Platform Commission
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-mono text-amber">
                ৳{totalCommission.toLocaleString()}
              </span>
              <span className="text-[11px] text-text-muted font-medium">Earned Margin</span>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-surface-raised/60 border border-border/70">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
              Average Monthly Intake
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-mono text-text-primary">
                ৳{avgMonthly.toLocaleString()}
              </span>
              <span className="text-[11px] text-text-muted font-medium">per month</span>
            </div>
          </div>
        </div>

        {/* Visual Responsive Bar/Area Chart */}
        <div className="pt-4">
          <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 px-2 sm:px-4 pb-4 border-b border-border/60">
            {chartData.map((d, idx) => {
              const grossPercent = maxVal > 0 ? (d.grossRevenue / maxVal) * 100 : 0;
              const commissionPercent = maxVal > 0 ? (d.platformCommission / maxVal) * 100 : 0;
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={d.month}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Floating tooltip */}
                  {isHovered && (
                    <div className="absolute -top-16 z-20 px-3 py-1.5 rounded-lg bg-surface border border-border shadow-lg text-[11px] whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
                      <p className="font-bold text-text-primary">{d.month}</p>
                      <p className="text-emerald font-semibold">Gross: ৳{d.grossRevenue.toLocaleString()}</p>
                      <p className="text-amber font-semibold">Platform Fee: ৳{d.platformCommission.toLocaleString()}</p>
                    </div>
                  )}

                  {/* Dual Bar Stack */}
                  <div className="w-full max-w-[48px] flex items-end justify-center gap-1 h-full">
                    {/* Gross Bar */}
                    {(activeMetric === "all" || activeMetric === "gross") && (
                      <div
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          isHovered
                            ? "bg-emerald shadow-sm shadow-emerald/30 scale-y-105"
                            : "bg-emerald/75 hover:bg-emerald"
                        }`}
                        style={{ height: `${Math.max(d.grossRevenue > 0 ? 8 : 2, grossPercent)}%` }}
                      />
                    )}

                    {/* Platform Commission Bar */}
                    {(activeMetric === "all" || activeMetric === "commission") && (
                      <div
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          isHovered
                            ? "bg-amber shadow-sm shadow-amber/30 scale-y-105"
                            : "bg-amber/75 hover:bg-amber"
                        }`}
                        style={{ height: `${Math.max(d.platformCommission > 0 ? 6 : 2, commissionPercent * 2.5)}%` }}
                      />
                    )}
                  </div>

                  {/* Month Label */}
                  <span className="text-xs font-semibold text-text-muted mt-2 group-hover:text-text-primary transition-colors">
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-xs bg-emerald" />
              <span className="font-medium text-text-secondary">Gross Student Top-Ups</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-xs bg-amber" />
              <span className="font-medium text-text-secondary">Platform Commission</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <BarChart3 className="size-3.5" />
              <span>Hover bars for detailed monthly breakdowns</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
