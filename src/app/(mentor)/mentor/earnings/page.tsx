"use client";

import * as React from "react";
import {
  Coins,
  TrendingUp,
  Banknote,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Clock,
  Sparkles,
  HelpCircle,
  FileText,
  CheckCircle2,
  ArrowDownLeft,
  Code2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import PayoutRequestForm from "@/features/wallet/PayoutRequestForm";
import { formatDate } from "@/lib/utils";

export default function MentorEarningsPage() {
  const {
    balance,
    equivalentBDT,
    totalEarned,
    totalWithdrawn,
    transactions,
    isLoading,
    refetch,
  } = useWallet();

  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [filterType, setFilterType] = React.useState<"ALL" | "EARNINGS" | "WITHDRAWALS">("ALL");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Filter transactions
  const filteredTransactions = React.useMemo(() => {
    if (filterType === "EARNINGS") {
      return transactions.filter((t) => t.amount > 0);
    }
    if (filterType === "WITHDRAWALS") {
      return transactions.filter((t) => t.type === "WITHDRAWAL" || t.amount < 0);
    }
    return transactions;
  }, [transactions, filterType]);

  const getTransactionBadge = (type: string, amount: number) => {
    const isCredit = amount > 0;
    switch (type) {
      case "TOP_UP":
        return {
          label: "Deposit",
          bg: "bg-emerald-light text-emerald border-emerald/20",
          icon: ArrowDownLeft,
        };
      case "SPRINT_RELEASE":
      case "COHORT_RELEASE":
        return {
          label: "Earning Settled",
          bg: "bg-emerald-light text-emerald border-emerald/20",
          icon: ShieldCheck,
        };
      case "WITHDRAWAL":
        return {
          label: "bKash Cash-Out",
          bg: "bg-rose-50 text-rose-600 border-rose-200",
          icon: ArrowUpRight,
        };
      default:
        return {
          label: isCredit ? "Credit Inflow" : "Credit Outflow",
          bg: isCredit
            ? "bg-emerald-light text-emerald border-emerald/20"
            : "bg-surface-raised text-text-secondary border-border",
          icon: Coins,
        };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* 1. Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20">
              <Banknote className="size-3.5" /> Mentor Revenue Studio
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Earnings &amp; Cash-Out Payouts
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Monitor your earned mentorship credits, cash out directly to your bKash wallet, and audit transaction records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            className="text-xs font-semibold h-9 gap-2 border-border cursor-pointer"
          >
            <RefreshCw
              className={`size-3.5 ${isRefreshing || isLoading ? "animate-spin text-amber" : ""}`}
            />
            <span>{isRefreshing ? "Refreshing..." : "Sync Balance"}</span>
          </Button>
        </div>
      </div>

      {/* 2. Key Metrics HUD Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Available Withdrawable Balance */}
        <div className="relative overflow-hidden p-6 rounded-3xl bg-surface border-2 border-amber/30 shadow-xs space-y-3">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 size-32 rounded-full bg-amber/10 blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Withdrawable Balance
            </span>
            <div className="size-8 rounded-xl bg-amber-light text-amber flex items-center justify-center border border-amber/20">
              <Coins className="size-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h2 className="font-serif text-3xl font-bold text-text-primary font-mono">
                {balance.toLocaleString()}
              </h2>
              <span className="text-xs font-bold uppercase tracking-wider text-amber">
                Credits
              </span>
            </div>
            <p className="text-xs font-semibold text-emerald mt-1 font-mono">
              ≈ ৳{equivalentBDT.toLocaleString()} BDT
            </p>
          </div>
        </div>

        {/* Card 2: Total Lifetime Earned */}
        <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Lifetime Earned
            </span>
            <div className="size-8 rounded-xl bg-emerald-light text-emerald flex items-center justify-center border border-emerald/20">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h2 className="font-serif text-3xl font-bold text-text-primary font-mono">
                {totalEarned.toLocaleString()}
              </h2>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald">
                Credits
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1 font-mono">
              Total gross revenue: ৳{(totalEarned * 4).toLocaleString()} BDT
            </p>
          </div>
        </div>

        {/* Card 3: Total Withdrawn Cash-Outs */}
        <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Total Cashed Out
            </span>
            <div className="size-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <ArrowUpRight className="size-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h2 className="font-serif text-3xl font-bold text-text-primary font-mono">
                ৳{totalWithdrawn.toLocaleString()}
              </h2>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                BDT
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1 font-mono">
              {Math.round(totalWithdrawn / 4).toLocaleString()} Credits withdrawn
            </p>
          </div>
        </div>

        {/* Card 4: Exchange Benchmark & Protection */}
        <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Exchange Benchmark
            </span>
            <div className="size-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
              <ShieldCheck className="size-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <h2 className="font-serif text-2xl font-bold text-text-primary">
                100% Payout
              </h2>
            </div>
            <p className="text-xs text-text-muted mt-1">
              Fixed rate: 1 Credit = <strong className="text-emerald">৳4.00 BDT</strong>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cash-Out Form & Payout Policy */}
        <div className="lg:col-span-7 space-y-6">
          {/* Payout Request Form */}
          <PayoutRequestForm
            currentBalance={balance}
            equivalentBDT={equivalentBDT}
            onSuccess={() => {
              refetch();
            }}
          />

          {/* Payout Policy & FAQ Guide */}
          <div className="p-6 sm:p-7 rounded-3xl bg-surface border border-border shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2">
              <HelpCircle className="size-5 text-amber" /> Payout Policy &amp; Terms
            </h3>
            <div className="space-y-3.5 text-xs text-text-secondary leading-relaxed">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald shrink-0 mt-0.5" />
                <span>
                  <strong>Threshold &amp; Limits:</strong> The minimum single cash-out is <strong>৳1,000 BDT (250 Credits)</strong> and the maximum is <strong>৳100,000 BDT</strong> per transaction.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald shrink-0 mt-0.5" />
                <span>
                  <strong>bKash Disbursement:</strong> Funds are transferred instantly to the provided Bangladeshi bKash mobile number. Personal and Merchant accounts are both accepted.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald shrink-0 mt-0.5" />
                <span>
                  <strong>Ledger Transparency:</strong> Every withdrawal creates an immutable ledger entry with timestamp and merchant invoice ID for audit verification.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ledger Activity & Income Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Ledger History */}
          <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2">
                  <FileText className="size-4 text-amber" /> Transaction Ledger
                </h3>
                <p className="text-xs text-text-muted">
                  Recent balance movements &amp; payouts
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-raised border border-border">
                {(["ALL", "EARNINGS", "WITHDRAWALS"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFilterType(tab)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                      filterType === tab
                        ? "bg-amber text-white"
                        : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    {tab === "ALL" ? "All" : tab === "EARNINGS" ? "Earnings" : "Cash-Outs"}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            {filteredTransactions.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <div className="size-12 rounded-2xl bg-surface-raised mx-auto flex items-center justify-center text-text-muted border border-border">
                  <Coins className="size-6" />
                </div>
                <p className="text-sm font-semibold text-text-primary">
                  No records found
                </p>
                <p className="text-xs text-text-muted max-w-xs mx-auto">
                  {filterType === "WITHDRAWALS"
                    ? "You haven't requested any cash-outs yet."
                    : "No credit movements recorded for this filter."}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {filteredTransactions.map((tx) => {
                  const badge = getTransactionBadge(tx.type, tx.amount);
                  const Icon = badge.icon;
                  const isPositive = tx.amount > 0;

                  return (
                    <div
                      key={tx.id}
                      className="p-3.5 rounded-2xl bg-surface-raised border border-border/80 flex items-center justify-between gap-3 hover:border-border transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`size-9 rounded-xl flex items-center justify-center shrink-0 border ${badge.bg}`}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-text-primary truncate">
                            {tx.description || badge.label}
                          </p>
                          <p className="text-[10px] text-text-muted">
                            {formatDate(tx.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p
                          className={`font-mono text-xs font-bold ${
                            isPositive ? "text-emerald" : "text-rose-500"
                          }`}
                        >
                          {isPositive ? `+${tx.amount}` : tx.amount} Cr
                        </p>
                        <p className="text-[10px] text-text-muted font-mono">
                          ৳{(Math.abs(tx.amount) * 4).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mentorship Revenue Sources Info Card */}
          <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-amber" /> Earning Revenue Streams
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-surface-raised border border-border flex items-start gap-3">
                <Code2 className="size-4 text-amber shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-text-primary">Code Review Delivery</p>
                  <p className="text-text-muted text-[11px] mt-0.5">
                    Claim student code reviews, deliver line-by-line feedback, and receive 100% of the bounty credits upon student approval.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-surface-raised border border-border flex items-start gap-3">
                <Clock className="size-4 text-emerald shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-text-primary">1-on-1 Sprints Pool</p>
                  <p className="text-text-muted text-[11px] mt-0.5">
                    Accept sprint requests from students. Credits held in escrow are released as you complete scheduled mentoring sessions.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-surface-raised border border-border flex items-start gap-3">
                <Users className="size-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-text-primary">Cohort Programs</p>
                  <p className="text-text-muted text-[11px] mt-0.5">
                    Launch multi-week engineering cohorts and earn tuition credits when enrolled students join your track.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
