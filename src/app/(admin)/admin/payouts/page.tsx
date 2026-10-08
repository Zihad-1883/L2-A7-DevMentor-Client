"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Banknote,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Coins,
  ArrowUpRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/EmptyState";
import PayoutApprovalCard from "@/features/admin/PayoutApprovalCard";
import { payoutService } from "@/services/payout.service";
import type { PayoutStatus } from "@/types/payout.types";

export default function AdminPayoutsPage() {
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | PayoutStatus>("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin", "payouts", statusFilter],
    queryFn: () => payoutService.getAdminPayouts(statusFilter, 1, 50),
    staleTime: 1000 * 30,
  });

  const payouts = React.useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data]);

  const summary = data?.summary || {
    pendingCount: 0,
    processedCount: 0,
    rejectedCount: 0,
    totalPendingBdt: 0,
    totalPendingCredits: 0,
  };

  const filteredPayouts = React.useMemo(() => {
    return payouts.filter((p) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.mentor?.name?.toLowerCase().includes(q) ||
        p.mentor?.email?.toLowerCase().includes(q) ||
        p.accountNumber?.toLowerCase().includes(q) ||
        p.method?.toLowerCase().includes(q) ||
        p.amountBdt.toString().includes(q)
      );
    });
  }, [payouts, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* 1. Header Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20">
              <Banknote className="size-3.5" /> Financial Treasury
            </span>
            <span className="text-xs font-semibold text-text-muted">•</span>
            <span className="text-xs text-text-muted font-medium">
              Audit-Ready Disbursal Engine
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Mentor Payout Requests
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
            Review and disburse BDT withdrawal requests submitted by verified mentors from their earned session credits.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs h-9 px-3 gap-1.5 border-border bg-surface hover:bg-surface-raised cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh Queue</span>
          </Button>
        </div>
      </div>

      {/* 2. Financial Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Requests */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex items-center gap-3.5 shadow-2xs">
          <div className="size-11 rounded-xl bg-amber-light text-amber flex items-center justify-center shrink-0">
            <Clock className="size-5" />
          </div>
          <div>
            <span className="text-xs text-text-muted font-medium block">
              Pending Queue
            </span>
            <span className="text-xl sm:text-2xl font-bold text-text-primary font-serif">
              {summary.pendingCount}
            </span>
          </div>
        </div>

        {/* Pending Payout Volume */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex items-center gap-3.5 shadow-2xs">
          <div className="size-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Coins className="size-5" />
          </div>
          <div>
            <span className="text-xs text-text-muted font-medium block">
              Pending Volume
            </span>
            <span className="text-xl sm:text-2xl font-bold text-text-primary font-serif font-mono">
              ৳{summary.totalPendingBdt.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Successfully Disbursed */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex items-center gap-3.5 shadow-2xs">
          <div className="size-11 rounded-xl bg-emerald-light text-emerald flex items-center justify-center shrink-0">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <span className="text-xs text-text-muted font-medium block">
              Total Disbursed
            </span>
            <span className="text-xl sm:text-2xl font-bold text-text-primary font-serif">
              {summary.processedCount}
            </span>
          </div>
        </div>

        {/* Declined Requests */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex items-center gap-3.5 shadow-2xs">
          <div className="size-11 rounded-xl bg-rose-light text-rose flex items-center justify-center shrink-0">
            <XCircle className="size-5" />
          </div>
          <div>
            <span className="text-xs text-text-muted font-medium block">
              Declined &amp; Refunded
            </span>
            <span className="text-xl sm:text-2xl font-bold text-text-primary font-serif">
              {summary.rejectedCount}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="size-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by mentor name, email, or bKash number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 text-xs bg-surface-raised rounded-xl"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted mr-1">
            Status:
          </span>
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === "ALL"
                ? "bg-amber text-white"
                : "bg-surface-raised text-text-secondary hover:text-text-primary border border-border"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("PENDING")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === "PENDING"
                ? "bg-amber text-white"
                : "bg-surface-raised text-text-secondary hover:text-text-primary border border-border"
            }`}
          >
            Pending ({summary.pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("PROCESSED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === "PROCESSED"
                ? "bg-amber text-white"
                : "bg-surface-raised text-text-secondary hover:text-text-primary border border-border"
            }`}
          >
            Disbursed ({summary.processedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("REJECTED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === "REJECTED"
                ? "bg-amber text-white"
                : "bg-surface-raised text-text-secondary hover:text-text-primary border border-border"
            }`}
          >
            Declined ({summary.rejectedCount})
          </button>
        </div>
      </div>

      {/* 4. Payout Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-surface border border-border animate-pulse space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-border/80" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-32 bg-border/80 rounded" />
                  <div className="h-3 w-48 bg-border/50 rounded" />
                </div>
              </div>
              <div className="h-16 w-full bg-border/40 rounded-2xl" />
              <div className="h-8 w-full bg-border/40 rounded" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 rounded-3xl bg-surface border border-rose/20 text-center space-y-3">
          <AlertCircle className="size-8 text-rose mx-auto" />
          <h3 className="text-sm font-bold text-text-primary">
            Failed to load payout queue
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            {error instanceof Error ? error.message : "Something went wrong fetching payouts."}
          </p>
          <Button size="sm" variant="outline" onClick={() => refetch()} className="text-xs">
            Try Again
          </Button>
        </div>
      ) : filteredPayouts.length === 0 ? (
        <EmptyState
          title={
            searchQuery || statusFilter !== "ALL"
              ? "No payout requests match your criteria"
              : "No payout requests submitted yet"
          }
          description={
            searchQuery || statusFilter !== "ALL"
              ? "Try adjusting your search terms or resetting the status filter."
              : "When mentors request BDT cash-outs for their earned credits, they will appear here for review."
          }
          icon={Banknote}
          action={
            searchQuery || statusFilter !== "ALL"
              ? {
                  label: "Reset Filters",
                  onClick: () => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
                  },
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPayouts.map((payout) => (
            <PayoutApprovalCard
              key={payout.id}
              payout={payout}
              onProcessed={() => refetch()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
