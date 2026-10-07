"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import MentorApprovalCard from "@/features/mentor/MentorApprovalCard";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  Search,
  RefreshCw,
  Loader2,
  Clock,
  CheckCircle2,
  Users,
  AlertCircle,
} from "lucide-react";

export default function AdminMentorsPage() {
  const [filterTab, setFilterTab] = React.useState<"PENDING" | "APPROVED" | "ALL">("PENDING");
  const [searchQuery, setSearchQuery] = React.useState("");

  const {
    data: applications = [],
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.mentorsQueue(),
    queryFn: () => adminService.getMentorApplicationsQueue(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const pendingCount = applications.filter((a) => a.approvalStatus === "PENDING").length;
  const approvedCount = applications.filter((a) => a.approvalStatus === "APPROVED").length;

  const filteredApplications = applications.filter((app) => {
    // Tab filter
    if (filterTab === "PENDING" && app.approvalStatus !== "PENDING") return false;
    if (filterTab === "APPROVED" && app.approvalStatus !== "APPROVED") return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = app.user.name?.toLowerCase().includes(q);
      const emailMatch = app.user.email?.toLowerCase().includes(q);
      const tagMatch = app.techStackTags?.some((t) => t.toLowerCase().includes(q));
      if (!nameMatch && !emailMatch && !tagMatch) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20 mb-2">
            <ShieldCheck className="size-3.5" /> Mentor Moderation
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Mentor Applications Queue
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-xl">
            Audit applicant profiles, inspect technical repositories and resumes, and approve verified instructors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface border border-border hover:border-amber/40 hover:text-amber transition-colors shadow-2xs text-text-primary cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 text-amber ${isRefetching ? "animate-spin" : ""}`} />
            Refresh Queue
          </button>
        </div>
      </div>

      {/* 2. Metric Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border/80 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
              Pending Moderation
            </span>
            <span className="text-2xl font-bold font-mono text-amber mt-1 block">
              {pendingCount}
            </span>
          </div>
          <div className="size-10 rounded-xl bg-amber-light text-amber flex items-center justify-center border border-amber/20">
            <Clock className="size-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border/80 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
              Approved Mentors
            </span>
            <span className="text-2xl font-bold font-mono text-emerald mt-1 block">
              {approvedCount}
            </span>
          </div>
          <div className="size-10 rounded-xl bg-emerald-light text-emerald flex items-center justify-center border border-emerald/20">
            <CheckCircle2 className="size-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border/80 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
              Total Applicants
            </span>
            <span className="text-2xl font-bold font-mono text-text-primary mt-1 block">
              {applications.length}
            </span>
          </div>
          <div className="size-10 rounded-xl bg-surface-raised text-text-primary flex items-center justify-center border border-border">
            <Users className="size-5 text-text-muted" />
          </div>
        </div>
      </div>

      {/* 3. Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-raised border border-border text-xs self-start">
          <button
            type="button"
            onClick={() => setFilterTab("PENDING")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${filterTab === "PENDING"
                ? "bg-surface text-amber shadow-2xs border border-border/60"
                : "text-text-muted hover:text-text-primary"
              }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("APPROVED")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${filterTab === "APPROVED"
                ? "bg-surface text-emerald shadow-2xs border border-border/60"
                : "text-text-muted hover:text-text-primary"
              }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("ALL")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${filterTab === "ALL"
                ? "bg-surface text-text-primary shadow-2xs border border-border/60"
                : "text-text-muted hover:text-text-primary"
              }`}
          >
            All ({applications.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="size-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or skill..."
            className="pl-9 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* 4. Applications List */}
      {isLoading ? (
        <div className="p-16 rounded-2xl border border-border/80 bg-surface flex flex-col items-center justify-center gap-3 text-text-muted">
          <Loader2 className="size-7 animate-spin text-amber" />
          <span className="text-sm font-medium">Loading mentor applications queue...</span>
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl border border-orange/30 bg-orange/5 flex flex-col items-center justify-center gap-3 text-center">
          <AlertCircle className="size-8 text-orange" />
          <h3 className="font-bold text-text-primary">Failed to load applications</h3>
          <p className="text-xs text-text-secondary max-w-md">
            {error instanceof Error ? error.message : "Could not retrieve mentor applications queue."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber text-white hover:bg-amber-hover transition-colors"
          >
            Retry Loading
          </button>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="p-16 rounded-3xl border border-border/80 bg-surface text-center space-y-3">
          <div className="size-14 rounded-2xl bg-emerald-light text-emerald flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 className="size-8" />
          </div>
          <h3 className="font-serif text-lg font-bold text-text-primary">
            {filterTab === "PENDING"
              ? "All Applications Moderated"
              : "No Mentor Applications Found"}
          </h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            {filterTab === "PENDING"
              ? "Great job! There are currently no pending mentor applications awaiting review in the moderation queue."
              : "No applicant records matched your active filter or search keywords."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filteredApplications.map((app) => (
            <MentorApprovalCard
              key={app.id}
              application={app}
              onActionComplete={() => refetch()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
