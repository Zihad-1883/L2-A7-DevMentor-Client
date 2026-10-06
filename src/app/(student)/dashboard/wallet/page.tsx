"use client";

import * as React from "react";
import Link from "next/link";
import {
  Wallet,
  Coins,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Lock,
} from "lucide-react";
import WalletBalanceCard from "@/features/wallet/WalletBalanceCard";
import CreditPurchaseForm from "@/features/wallet/CreditPurchaseForm";
import TransactionHistory from "@/features/wallet/TransactionHistory";

export default function StudentWalletPage() {
  const topUpRef = React.useRef<HTMLDivElement>(null);

  const scrollToTopUp = () => {
    topUpRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20 mb-2">
            <Sparkles className="size-3.5" /> DevWallet & Escrow
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Credit Wallet & Payments
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-xl">
            Manage your spendable engineering credits, deposit balance via bKash, and track escrow commitments.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface border border-border flex items-center gap-3 shadow-2xs">
          <div className="size-9 rounded-xl bg-emerald-light text-emerald border border-emerald/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="size-5" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-text-primary block">Escrow Guarantee</span>
            <span className="text-[11px] text-text-muted">Credits locked until sessions complete</span>
          </div>
        </div>
      </div>

      {/* 1. Real-time Credit Balance Card */}
      <WalletBalanceCard onTopUpClick={scrollToTopUp} />

      {/* 2. Top-Up Purchase Section */}
      <div id="top-up-section" ref={topUpRef} className="space-y-3 pt-2">
        <CreditPurchaseForm />
      </div>

      {/* 3. Transaction History Table / Ledger */}
      <div className="pt-2">
        <TransactionHistory />
      </div>
    </div>
  );
}
