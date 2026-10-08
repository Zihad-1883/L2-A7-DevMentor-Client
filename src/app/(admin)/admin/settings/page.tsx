"use client";

import * as React from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import CommissionSettingsForm from "@/features/admin/CommissionSettingsForm";
import {
  Settings,
  RefreshCw,
  Sliders,
  DollarSign,
  ShieldAlert,
  ArrowLeft,
} from "lucide-react";

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.settings }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats }),
    ]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-amber transition-colors"
            >
              <ArrowLeft className="size-3" /> Admin Dashboard
            </Link>
            <span className="text-text-muted text-xs">•</span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20">
              <Sliders className="size-3" /> System Configuration
            </div>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Platform & Commission Settings
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-xl">
            Configure platform commission fee percentage, base sprint credit pricing, and manage transaction parameters across the ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface border border-border hover:border-amber/40 hover:text-amber transition-colors shadow-2xs text-text-primary cursor-pointer disabled:opacity-50 self-start sm:self-auto"
          >
            <RefreshCw
              className={`size-3.5 text-amber ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh Settings
          </button>
        </div>
      </div>

      {/* 2. Main Commission Settings Form */}
      <CommissionSettingsForm />
    </div>
  );
}
