"use client";

import * as React from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Coins,
  History,
  ShieldCheck,
} from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import DataTable, { type ColumnDef } from "@/components/shared/DataTable";
import type { WalletTransaction } from "@/types/wallet.types";

export default function TransactionHistory() {
  const { transactions, isLoading } = useWallet();

  const getTransactionBadge = (type: string, amount: number) => {
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

  const columns: ColumnDef<WalletTransaction>[] = [
    {
      id: "event",
      header: "Transaction",
      cell: (tx) => {
        const badge = getTransactionBadge(tx.type, tx.amount);
        const Icon = badge.icon;
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`size-9 rounded-xl border flex items-center justify-center shrink-0 ${badge.bg}`}
            >
              <Icon className="size-4" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="font-semibold text-text-primary text-xs sm:text-sm truncate">
                {tx.description || badge.label}
              </div>
              {tx.referenceId && (
                <div className="font-mono text-[10px] text-text-muted truncate max-w-[200px]">
                  Ref: {tx.referenceId}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "type",
      header: "Category",
      cell: (tx) => {
        const badge = getTransactionBadge(tx.type, tx.amount);
        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.bg}`}
          >
            {badge.label}
          </span>
        );
      },
    },
    {
      id: "date",
      header: "Timestamp",
      cell: (tx) => {
        const txDate = new Date(tx.createdAt);
        return (
          <div className="text-xs text-text-secondary whitespace-nowrap">
            <div>
              {txDate.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="text-[10px] text-text-muted">
              {txDate.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        );
      },
    },
    {
      id: "amount",
      header: "Impact",
      align: "right",
      cell: (tx) => {
        const isPositive = tx.amount > 0;
        return (
          <div className="text-right">
            <span
              className={`font-serif text-sm sm:text-base font-bold ${
                isPositive ? "text-emerald" : "text-text-primary"
              }`}
            >
              {isPositive ? `+${tx.amount}` : tx.amount} Credits
            </span>
            <span className="text-[10px] text-text-muted block">
              {isPositive
                ? `+৳${(tx.amount * 4).toLocaleString()} BDT`
                : `৳${Math.abs(tx.amount * 4).toLocaleString()} BDT`}
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <h3 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2">
            <History className="size-4 text-amber" /> Credit Transaction History
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Audit log of all deposits, escrow locks, and sprint disbursements
          </p>
        </div>
        <span className="text-xs font-semibold text-text-muted">
          {transactions.length} total events
        </span>
      </div>

      <DataTable
        data={transactions}
        columns={columns}
        keyExtractor={(tx) => tx.id}
        isLoading={isLoading}
        pageSize={8}
        searchPlaceholder="Filter transactions by description or reference..."
        searchFilter={(tx, q) =>
          tx.description.toLowerCase().includes(q) ||
          tx.type.toLowerCase().includes(q) ||
          (tx.referenceId ? tx.referenceId.toLowerCase().includes(q) : false)
        }
        emptyTitle="No transactions yet"
        emptyDescription="Your credit deposit and booking transaction records will appear here once you top up your DevWallet."
        emptyIcon={<Coins className="size-6 stroke-1 text-text-muted" />}
      />
    </div>
  );
}
