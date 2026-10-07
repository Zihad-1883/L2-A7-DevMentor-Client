"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Plus,
  Calendar,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Coins,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { cohortService } from "@/services/cohort.service";
import type { CohortItem } from "@/types/cohort.types";
import { formatDate } from "@/lib/utils";

export default function MentorCohortsPage() {
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // 1. Fetch Mentor's Created Cohorts
  const {
    data: cohortsData,
    isLoading,
    error,
    refetch,
  } = useQuery<CohortItem[]>({
    queryKey: ["mentor", "my-created-cohorts"],
    queryFn: () => cohortService.getMyCreatedCohorts(),
    staleTime: 1000 * 30,
  });

  const cohorts = cohortsData || [];

  // Filter cohorts
  const filteredCohorts = React.useMemo(() => {
    return cohorts.filter((cohort) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PUBLISHED" && cohort.status === "PUBLISHED") ||
        (statusFilter === "DRAFT" && cohort.status === "DRAFT") ||
        (statusFilter === "PENDING" && cohort.approvalStatus === "PENDING_APPROVAL");

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        cohort.title.toLowerCase().includes(q) ||
        cohort.description?.toLowerCase().includes(q) ||
        (cohort.techStackTags &&
          cohort.techStackTags.some((tag) => tag.toLowerCase().includes(q)));

      return matchesStatus && matchesSearch;
    });
  }, [cohorts, statusFilter, searchQuery]);

  const totalEnrollments = cohorts.reduce(
    (acc, curr) => acc + (curr._count?.enrollments || 0),
    0
  );
  const totalSessionsCount = cohorts.reduce(
    (acc, curr) => acc + (curr.sessions?.length || curr._count?.sessions || 0),
    0
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-linear-to-r from-amber-50/70 via-surface to-surface border border-amber/20 shadow-xs relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-light text-amber text-xs font-bold uppercase tracking-wider border border-amber/20">
            <Sparkles className="size-3.5" /> Group Courses Studio
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            My Cohort Programs
          </h1>
          <p className="text-sm text-text-secondary max-w-xl leading-relaxed">
            Manage your teaching cohorts, schedule group workshops, upload learning materials, and track student enrollments.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <Link href="/mentor/cohorts/new">
            <Button
              size="sm"
              className="bg-amber text-white hover:bg-amber-hover font-semibold text-xs h-9 px-4 shadow-2xs gap-1.5 cursor-pointer"
            >
              <Plus className="size-3.5" /> Launch New Cohort
            </Button>
          </Link>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute -right-10 -bottom-10 size-40 bg-amber/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. Key Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
            Total Cohorts Created
          </span>
          <span className="font-serif text-2xl font-bold text-text-primary block">
            {cohorts.length} Programs
          </span>
          <span className="text-xs text-text-muted">
            {cohorts.filter((c) => c.status === "PUBLISHED").length} currently published
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
            Total Students Enrolled
          </span>
          <span className="font-serif text-2xl font-bold text-emerald block">
            {totalEnrollments} Students
          </span>
          <span className="text-xs text-text-muted">Across all teaching programs</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
            Curriculum Sessions
          </span>
          <span className="font-serif text-2xl font-bold text-amber block">
            {totalSessionsCount} Workshops
          </span>
          <span className="text-xs text-text-muted">Live meetings scheduled</span>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
          <Input
            type="text"
            placeholder="Search your cohorts by title, tag, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 text-sm bg-surface border-border rounded-xl"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "ALL", label: "All Programs" },
            { id: "PUBLISHED", label: "Published Live" },
            { id: "PENDING", label: "Pending Approval" },
            { id: "DRAFT", label: "Drafts" },
          ].map((tab) => {
            const isSelected = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-amber text-white shadow-2xs"
                    : "bg-surface-raised border border-border text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Cohorts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-surface border border-border animate-pulse space-y-4"
            >
              <div className="h-4 w-28 bg-border/80 rounded" />
              <div className="h-6 w-3/4 bg-border/80 rounded" />
              <div className="h-14 w-full bg-border/60 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl bg-surface border border-rose/20 text-center space-y-3">
          <AlertCircle className="size-8 text-rose mx-auto" />
          <h3 className="text-sm font-bold text-text-primary">Failed to load cohorts</h3>
          <p className="text-xs text-text-secondary">
            {error instanceof Error ? error.message : "Something went wrong while fetching your cohorts."}
          </p>
          <Button size="sm" variant="outline" onClick={() => refetch()} className="text-xs">
            Try Again
          </Button>
        </div>
      ) : filteredCohorts.length === 0 ? (
        <EmptyState
          title="No cohorts found"
          description={
            searchQuery || statusFilter !== "ALL"
              ? "No cohort programs match your active filters. Try picking another status tab."
              : "You haven't created any cohort programs yet. Launch your first group course now!"
          }
          icon={BookOpen}
          action={
            searchQuery || statusFilter !== "ALL"
              ? {
                  label: "Clear Filters",
                  onClick: () => {
                    setStatusFilter("ALL");
                    setSearchQuery("");
                  },
                }
              : {
                  label: "Create First Cohort",
                  onClick: () => (window.location.href = "/mentor/cohorts/new"),
                }
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCohorts.map((cohort) => {
            const enrolled = cohort._count?.enrollments || 0;
            const cap = cohort.capacity || 20;
            const sessionsTotal = cohort.sessions?.length || cohort._count?.sessions || 0;

            return (
              <div
                key={cohort.id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-surface border border-border hover:border-amber/40 shadow-xs hover:shadow-sm transition-all group"
              >
                <div className="space-y-4">
                  {/* Status header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={cohort.status} />
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-raised border border-border text-text-muted">
                        {cohort.approvalStatus}
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-text-muted">
                      {cohort.durationWeeks} Weeks
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-serif text-lg font-bold text-text-primary group-hover:text-amber transition-colors line-clamp-1">
                      {cohort.title}
                    </h3>
                    <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                      {cohort.description}
                    </p>
                  </div>

                  {/* Tech stack */}
                  {cohort.techStackTags && cohort.techStackTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cohort.techStackTags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-amber-light/70 text-amber border border-amber/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Specs & Enrollment progress */}
                  <div className="pt-3 border-t border-border/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted flex items-center gap-1.5">
                        <Users className="size-3.5 text-amber" />
                        Seats Filled: <strong className="text-text-primary">{enrolled} / {cap}</strong>
                      </span>
                      <span className="font-bold text-amber">
                        {cohort.totalCost === 0 ? "Free" : `${cohort.totalCost} Credits`}
                      </span>
                    </div>

                    <div className="h-1.5 w-full bg-surface-raised rounded-full overflow-hidden border border-border/60">
                      <div
                        className="h-full bg-amber"
                        style={{ width: `${Math.min(100, (enrolled / cap) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="pt-4 mt-4 border-t border-border/80 flex items-center justify-between">
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {sessionsTotal} Sessions
                  </span>

                  <Link href={`/mentor/cohorts/${cohort.id}`}>
                    <Button
                      size="sm"
                      className="bg-amber text-white hover:bg-amber-hover font-semibold text-xs h-8 px-3 shadow-2xs gap-1.5 cursor-pointer"
                    >
                      Manage Cohort &amp; Schedule <ArrowRight className="size-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
