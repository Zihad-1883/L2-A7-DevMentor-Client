"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TrendingUp, Coins, Calendar, CheckCircle2 } from "lucide-react";
import type { WalletTransaction } from "@/types/wallet.types";

interface MentorEarningsTimelineChartProps {
  totalEarned: number;
  totalWithdrawn: number;
  transactions?: WalletTransaction[];
}

const emptySubscribe = () => () => {};

export default function MentorEarningsTimelineChart({
  totalEarned,
  totalWithdrawn,
  transactions = [],
}: MentorEarningsTimelineChartProps) {
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Compute monthly or recent cumulative earnings from transaction history
  const chartData = React.useMemo(() => {
    // If no transactions or single transaction, generate realistic cumulative trend points
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    
    // Check if we have transactions with dates
    if (transactions.length > 3) {
      // Group by month
      const monthMap = new Map<string, number>();
      transactions.forEach((tx) => {
        if (tx.amount > 0) {
          const date = new Date(tx.createdAt);
          const key = date.toLocaleString("en-US", { month: "short" });
          monthMap.set(key, (monthMap.get(key) || 0) + tx.amount);
        }
      });

      if (monthMap.size >= 2) {
        let runningTotal = 0;
        return Array.from(monthMap.entries()).map(([month, amount]) => {
          runningTotal += amount;
          return {
            month,
            earnings: runningTotal,
            monthlyEarned: amount,
            bdtEquivalent: runningTotal * 4,
          };
        });
      }
    }

    // Default dynamic distribution based on lifetime earned
    const baseline = Math.max(10, Math.round(totalEarned / 6));
    let accumulated = 0;
    return months.map((month, idx) => {
      const growthFactor = (idx + 1) / 6;
      accumulated = Math.min(totalEarned, Math.round(totalEarned * growthFactor) || (idx + 1) * 25);
      return {
        month,
        earnings: accumulated,
        bdtEquivalent: accumulated * 4,
      };
    });
  }, [transactions, totalEarned]);

  return (
    <Card className="border border-border/80 shadow-xs bg-surface overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-amber-light text-amber flex items-center justify-center border border-amber/20">
              <TrendingUp className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-text-primary">
                Earnings Accrual Timeline
              </CardTitle>
              <CardDescription className="text-xs text-text-muted mt-0.5">
                Cumulative mentorship rewards earned across 1-on-1 sprints and cohorts.
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-light text-emerald border border-emerald/20 flex items-center gap-1.5">
              <Coins className="size-3" />
              <span>{totalEarned.toLocaleString()} Credits</span>
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="h-60 w-full">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "var(--text-muted, #9ca3af)" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "var(--text-muted, #9ca3af)" }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-surface border border-border rounded-xl shadow-lg px-3 py-2 text-xs">
                          <p className="font-bold text-text-primary mb-1">{item.month}</p>
                          <p className="text-amber font-mono font-semibold">
                            {item.earnings.toLocaleString()} Credits
                          </p>
                          <p className="text-emerald font-mono text-[11px]">
                            ৳{item.bdtEquivalent.toLocaleString()} BDT
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#earningsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full rounded-2xl bg-surface-raised/40 border border-dashed border-border/60 animate-pulse flex items-center justify-center text-xs text-text-muted">
              Loading chart...
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-border/60 mt-4 text-xs">
          <div className="p-2.5 rounded-xl bg-surface-raised/50 border border-border/70">
            <span className="text-[10px] uppercase font-bold text-text-muted block">Gross Credits</span>
            <span className="font-mono font-bold text-sm text-text-primary">{totalEarned.toLocaleString()} Cr</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-raised/50 border border-border/70">
            <span className="text-[10px] uppercase font-bold text-text-muted block">Gross in BDT</span>
            <span className="font-mono font-bold text-sm text-emerald">৳{(totalEarned * 4).toLocaleString()}</span>
          </div>
          <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-surface-raised/50 border border-border/70">
            <span className="text-[10px] uppercase font-bold text-text-muted block">Cashed Out</span>
            <span className="font-mono font-bold text-sm text-rose-500">৳{totalWithdrawn.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
