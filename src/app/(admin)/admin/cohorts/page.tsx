"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import CohortApprovalCard from "@/features/cohort/CohortApprovalCard";
import { Input } from "@/components/ui/input";
import type { CohortApprovalStatus, CohortItem } from "@/types/cohort.types";
import {
  CheckSquare,
  Search,
  RefreshCw,
  Loader2,
  Clock,
  CheckCircle2,
  Layers,
  AlertCircle,
} from "lucide-react";

type Tab = "PENDING" | "APPROVED" | "ALL";

const isPendingStatus = (s: CohortApprovalStatus) =>
  s === "PENDING" || s === "PENDING_APPROVAL";

interface CohortQueueEntry {
  cohort: CohortItem;
  status: CohortApprovalStatus;
}

export default function AdminCohortsPage() {
  const [tab, setTab] = React.useState<Tab>("PENDING");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [overrides, setOverrides] = React.useState<
    Record<string, CohortApprovalStatus>
  >({});

  const {
    data,
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.cohortsQueue(),
    queryFn: () => adminService.getCohortsQueue({ limit: 100 }),
    staleTime: 1000 * 60 * 2,
  });

  const cohorts: CohortQueueEntry[] = React.useMemo(
    () =>
      (data?.cohorts ?? []).map((c: CohortItem) => ({
        cohort: c,
        status: overrides[c.id] ?? c.approvalStatus,
      })),
    [data, overrides],
  );

  const pendingCount = cohorts.filter((c: CohortQueueEntry) => isPendingStatus(c.status)).length;
  const approvedCount = cohorts.filter((c: CohortQueueEntry) => c.status === "APPROVED").length;

  const filtered = cohorts.filter(({ cohort, status }: CohortQueueEntry) => {
    if (tab === "PENDING" && !isPendingStatus(status)) return false;
    if (tab === "APPROVED" && status !== "APPROVED") return false;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const hit =
        cohort.title.toLowerCase().includes(q) ||
        cohort.mentor?.name?.toLowerCase().includes(q) ||
        cohort.techStackTags?.some((t: string) => t.toLowerCase().includes(q));
      if (!hit) return false;
    }
    return true;
  });

  const tabBtn = (value: Tab, label: string, activeColor: string) => (
    <button
      type="button"
      onClick={() => setTab(value)}
      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${tab === value
          ? `bg-surface ${activeColor} shadow-2xs border border-border/60`
          : "text-text-muted hover:text-text-primary"
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20 mb-2">
            <CheckSquare className="size-3.5" /> Cohort Moderation
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Cohort Submission Approvals
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-xl">
            Review mentor cohorts before they can be published to the public
            directory.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface border border-border hover:border-amber/40 hover:text-amber transition-colors shadow-2xs text-text-primary cursor-pointer disabled:opacity-50 self-start"
        >
          <RefreshCw
            className={`size-3.5 text-amber ${isRefetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Pending Review", value: pendingCount, color: "text-amber", bg: "bg-amber-light border-amber/20", Icon: Clock },
          { label: "Approved Cohorts", value: approvedCount, color: "text-emerald", bg: "bg-emerald-light border-emerald/20", Icon: CheckCircle2 },
          { label: "Total Loaded", value: cohorts.length, color: "text-text-primary", bg: "bg-surface-raised border-border", Icon: Layers },
        ].map(({ label, value, color, bg, Icon }) => (
          <div
            key={label}
            className="p-4 rounded-2xl bg-surface border border-border/80 flex items-center justify-between shadow-2xs"
          >
            <div>
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                {label}
              </span>
              <span className={`text-2xl font-bold font-mono mt-1 block ${color}`}>
                {value}
              </span>
            </div>
            <div className={`size-10 rounded-xl flex items-center justify-center border ${bg} ${color}`}>
              <Icon className="size-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-raised border border-border text-xs self-start">
          {tabBtn("PENDING", `Pending (${pendingCount})`, "text-amber")}
          {tabBtn("APPROVED", `Approved (${approvedCount})`, "text-emerald")}
          {tabBtn("ALL", `All (${cohorts.length})`, "text-text-primary")}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="size-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, mentor, or tag..."
            className="pl-9 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="p-16 rounded-2xl border border-border/80 bg-surface flex flex-col items-center justify-center gap-3 text-text-muted">
          <Loader2 className="size-7 animate-spin text-amber" />
          <span className="text-sm font-medium">Loading cohorts...</span>
        </div>
      ) : error && cohorts.length === 0 ? (
        <div className="p-8 rounded-2xl border border-orange/30 bg-orange/5 flex flex-col items-center gap-3 text-center">
          <AlertCircle className="size-8 text-orange" />
          <h3 className="font-bold text-text-primary">Failed to load cohorts</h3>
          <p className="text-xs text-text-secondary max-w-md">
            {error instanceof Error ? error.message : "Could not retrieve cohorts."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber text-white hover:bg-amber-hover transition-colors cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 rounded-3xl border border-border/80 bg-surface text-center space-y-3">
          <div className="size-14 rounded-2xl bg-emerald-light text-emerald flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 className="size-8" />
          </div>
          <h3 className="font-serif text-lg font-bold text-text-primary">
            {tab === "PENDING" ? "No Cohorts Awaiting Review" : "No Cohorts Found"}
          </h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            {tab === "PENDING"
              ? "Pending cohort submissions will appear here once the admin listing API is available."
              : "No cohorts matched your filter or search keywords."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filtered.map(({ cohort, status }: CohortQueueEntry) => (
            <CohortApprovalCard
              key={cohort.id}
              cohort={cohort}
              status={status}
              onActionComplete={(id, next) =>
                setOverrides((prev) => ({ ...prev, [id]: next }))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
