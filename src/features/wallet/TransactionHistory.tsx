"use client";

import * as React from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Coins,
  History,
  ShieldCheck,
  CreditCard,
  FileText,
} from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import type { WalletTransaction } from "@/types/wallet.types";

export default function TransactionHistory() {
  const { transactions, isLoading } = useWallet();

  const getTransactionBadge = (type: string, amount: number) => {
    const isCredit = amount > 0;
    switch (type) {
      case "TOP_UP":
        return {
          label: "Deposit",
          bg: "bg-emerald-light text-emerald border-emerald/20",
          icon: ArrowDownLeft,
        };
      case "SPRINT_ESCROW":
      case "COHORT_FEE":
        return {
          label: "Escrow Hold",
          bg: "bg-amber-light text-amber border-amber/20",
          icon: Clock,
        };
      case "SPRINT_REFUND":
        return {
          label: "Escrow Refund",
          bg: "bg-primary/10 text-primary border-primary/20",
          icon: ArrowDownLeft,
        };
      case "SPRINT_RELEASE":
      case "COHORT_RELEASE":
        return {
          label: "Settled",
          bg: "bg-surface-raised text-text-secondary border-border",
          icon: ShieldCheck,
        };
      case "WITHDRAWAL":
        return {
          label: "Cash-Out",
          bg: "bg-rose-light text-rose border-rose/20",
          icon: ArrowUpRight,
        };
      default:
        return {
          label: type,
          bg: "bg-surface-raised text-text-muted border-border",
          icon: Coins,
        };
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border space-y-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2">
            <History className="size-4 text-amber" /> Credit Transaction History
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Audit log of all deposits, escrow locks, and sprint disbursements
          </p>
        </div>
        <span className="text-xs text-text-muted">
          Showing latest {transactions.length} events
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-surface-raised border border-border" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-12 text-center space-y-2">
          <Coins className="size-8 text-text-muted mx-auto stroke-1" />
          <h4 className="font-serif text-base font-bold text-text-primary">
            No transactions yet
          </h4>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            Your credit deposit and booking transaction records will appear here once you top up your DevWallet.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {transactions.map((tx) => {
            const isPositive = tx.amount > 0;
            const badge = getTransactionBadge(tx.type, tx.amount);
            const Icon = badge.icon;
            const txDate = new Date(tx.createdAt);

            return (
              <div
                key={tx.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-raised/40 transition-colors px-2 rounded-xl"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`size-10 rounded-2xl border flex items-center justify-center shrink-0 ${badge.bg}`}
                  >
                    <Icon className="size-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary">
                        {tx.description}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.bg}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <div className="text-[11px] text-text-muted flex items-center gap-3">
                      <span>
                        {txDate.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <span>
                        {txDate.toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {tx.referenceId && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-[10px] truncate max-w-[120px]">
                            Ref: {tx.referenceId}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right self-end sm:self-center shrink-0">
                  <span
                    className={`font-serif text-base font-bold ${
                      isPositive ? "text-emerald" : "text-text-primary"
                    }`}
                  >
                    {isPositive ? `+${tx.amount}` : tx.amount} Credits
                  </span>
                  <span className="text-[11px] text-text-muted block">
                    {isPositive
                      ? `+৳${(tx.amount * 4).toLocaleString()} BDT`
                      : `৳${Math.abs(tx.amount * 4).toLocaleString()} BDT`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
