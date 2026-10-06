"use client";

import * as React from "react";
import Link from "next/link";
import {
  Coins,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Wallet,
  Sparkles,
  TrendingUp,
  CreditCard,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";

interface WalletBalanceCardProps {
  onTopUpClick?: () => void;
}

export default function WalletBalanceCard({ onTopUpClick }: WalletBalanceCardProps) {
  const { balance, equivalentBDT, isLoading, isError, refetch } = useWallet();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-surface border border-border p-6 sm:p-8 shadow-xs">
      {/* Decorative ambient gradient glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 size-72 rounded-full bg-amber/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 size-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left side: Balance numbers & details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20">
              <Coins className="size-3.5" /> DevWallet Balance
            </span>
            <button
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              title="Refresh Balance"
              className="p-1.5 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-raised transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`size-3.5 ${isRefreshing || isLoading ? "animate-spin text-amber" : ""}`}
              />
            </button>
          </div>

          <div>
            <div className="flex items-baseline gap-2.5">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
                {isLoading ? "..." : balance.toLocaleString()}
              </h2>
              <span className="text-base sm:text-lg font-bold text-text-secondary uppercase tracking-wide">
                Credits
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-muted mt-1.5 flex items-center gap-1.5">
              <span>Equivalent Value:</span>
              <span className="font-bold text-text-primary font-mono">
                {isLoading ? "..." : `৳${equivalentBDT.toLocaleString()} BDT`}
              </span>
              <span className="text-[11px] text-text-muted">(Fixed Rate: 1 Credit = ৳4 BDT)</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-text-secondary">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-surface-raised border border-border">
              <ShieldCheck className="size-3.5 text-emerald" /> Escrow Protected
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-surface-raised border border-border">
              <Lock className="size-3.5 text-amber" /> 100% Refundable on Unclaimed
            </div>
          </div>
        </div>

        {/* Right side: Quick Actions & Highlights */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
          {onTopUpClick ? (
            <Button
              onClick={onTopUpClick}
              size="lg"
              className="h-12 px-6 gap-2 bg-amber hover:bg-amber-hover text-surface-dark font-bold text-sm cursor-pointer shadow-xs"
            >
              <ArrowUpRight className="size-4" /> Top Up Credits with bKash
            </Button>
          ) : (
            <a href="#top-up-section">
              <Button
                size="lg"
                className="w-full h-12 px-6 gap-2 bg-amber hover:bg-amber-hover text-surface-dark font-bold text-sm cursor-pointer shadow-xs"
              >
                <ArrowUpRight className="size-4" /> Top Up Credits with bKash
              </Button>
            </a>
          )}

          <div className="p-3 rounded-2xl bg-surface-raised/70 border border-border/80 text-[11px] text-text-muted max-w-xs text-left lg:text-right">
            Instant credit deposits powered by bKash Gateway with automated PDF tax invoice receipt.
          </div>
        </div>
      </div>
    </div>
  );
}
