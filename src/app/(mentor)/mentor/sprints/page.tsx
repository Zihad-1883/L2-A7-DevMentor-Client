"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { sprintService } from "@/services/sprint.service";
import type { SprintRequestItem } from "@/types/sprint.types";
import {
  Search,
  Sparkles,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/utils";

import { useSearchParams } from "next/navigation";

const TECH_STACK_FILTERS = [
  "All",
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Express",
  "PostgreSQL",
  "Prisma",
  "Tailwind CSS",
  "Docker",
  "Python",
];

export default function MentorSprintPoolPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = React.useState<"direct" | "pool" | "claimed">(
    tabParam === "direct" ? "direct" : "claimed"
  );
  const [selectedTag, setSelectedTag] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // 1. Fetch Open Sprint Pool (Unclaimed requests)
  const {
    data: poolData,
    isLoading: isPoolLoading,
    error: poolError,
    refetch: refetchPool,
  } = useQuery({
    queryKey: ["mentor", "open-sprint-pool"],
    queryFn: () => sprintService.getOpenSprintPool({ limit: 50 }),
    staleTime: 1000 * 30,
  });

  // 2. Fetch Mentor's Claimed Sprints
  const {
    data: mySprintsData,
    isLoading: isMySprintsLoading,
    error: mySprintsError,
    refetch: refetchMySprints,
  } = useQuery({
    queryKey: ["mentor", "my-sprints"],
    queryFn: () => sprintService.getUserSprints(),
    staleTime: 1000 * 30,
  });

  const openPoolSprints: SprintRequestItem[] = poolData?.sprints || [];
  const myClaimedSprints: SprintRequestItem[] = mySprintsData || [];

  const directSprints = React.useMemo(
    () => openPoolSprints.filter((s) => s.targetMentorId),
    [openPoolSprints]
  );
  const broadcastPoolSprints = React.useMemo(
    () => openPoolSprints.filter((s) => !s.targetMentorId),
    [openPoolSprints]
  );

  const rawSprints: SprintRequestItem[] =
    activeTab === "claimed"
      ? myClaimedSprints
      : activeTab === "direct"
      ? directSprints
      : broadcastPoolSprints;

  const isLoading = activeTab === "claimed" ? isMySprintsLoading : isPoolLoading;
  const error = activeTab === "claimed" ? mySprintsError : poolError;
  const refetch = activeTab === "claimed" ? refetchMySprints : refetchPool;

  // Filter sprints by selected tag and search query
  const filteredSprints = React.useMemo(() => {
    return rawSprints.filter((sprint) => {
      // Tech stack match
      const matchesTag =
        selectedTag === "All" ||
        (sprint.techStackTags &&
          sprint.techStackTags.some(
            (tag) => tag.toLowerCase() === selectedTag.toLowerCase()
          ));

      // Text query match (title, description, student name, or tags)
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        sprint.title.toLowerCase().includes(q) ||
        sprint.description?.toLowerCase().includes(q) ||
        sprint.student?.name?.toLowerCase().includes(q) ||
        (sprint.techStackTags &&
          sprint.techStackTags.some((tag) => tag.toLowerCase().includes(q)));

      return matchesTag && matchesSearch;
    });
  }, [rawSprints, selectedTag, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-linear-to-r from-amber-50/70 via-surface to-surface border border-amber/20 shadow-xs relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-light text-amber text-xs font-bold uppercase tracking-wider border border-amber/20">
            <Sparkles className="size-3.5" /> Sprint Matching Pool
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Student Sprint Requests
          </h1>
          <p className="text-sm text-text-secondary max-w-xl leading-relaxed">
            Browse real 1-on-1 sprint requests submitted by students. Filter by your core technologies and claim sprints you would love to mentor.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <Link href="/mentor">
            <Button size="sm" variant="outline" className="border-border text-xs gap-1.5 bg-surface hover:bg-surface-raised cursor-pointer">
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Subtle blur background element */}
        <div className="absolute -right-10 -bottom-10 size-40 bg-amber/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. Primary Tab Switcher */}
      <div className="flex border-b border-border/80 gap-3 sm:gap-6 overflow-x-auto pb-0.5">
        <button
          type="button"
          onClick={() => setActiveTab("direct")}
          className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "direct"
              ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 font-bold"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          <span>🎯 Direct to You</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              directSprints.length > 0
                ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 dark:border-purple-800"
                : "bg-surface-raised text-text-muted border border-border"
            }`}
          >
            {directSprints.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pool")}
          className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "pool"
              ? "text-amber border-b-2 border-amber font-bold"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          <span>🌐 Open Broadcast Pool</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-surface-raised text-text-muted border border-border">
            {broadcastPoolSprints.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("claimed")}
          className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "claimed"
              ? "text-emerald border-b-2 border-emerald font-bold"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          <span>✅ My Claimed Sprints</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-surface-raised text-text-muted border border-border">
            {myClaimedSprints.length}
          </span>
        </button>
      </div>

      {/* 3. Search & Tag Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
            <Input
              type="text"
              placeholder={
                activeTab === "claimed"
                  ? "Search your claimed sprints..."
                  : "Search open sprint requests in pool..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 text-sm bg-surface border-border rounded-xl"
            />
          </div>

          <div className="text-xs text-text-muted font-medium">
            Showing <span className="font-bold text-text-primary">{filteredSprints.length}</span>{" "}
            {activeTab === "claimed" ? "claimed" : "open"} {filteredSprints.length === 1 ? "sprint" : "sprints"}
          </div>
        </div>

        {/* Tech Stack Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-text-muted flex items-center gap-1 shrink-0 mr-1">
            <Filter className="size-3.5" /> Filter by:
          </span>
          {TECH_STACK_FILTERS.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${isSelected
                  ? "bg-amber text-white shadow-2xs"
                  : "bg-surface-raised border border-border text-text-secondary hover:text-text-primary hover:border-border-strong"
                  }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Sprints List / Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-surface border border-border shadow-xs animate-pulse space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-border/80 rounded" />
                <div className="h-4 w-16 bg-border/80 rounded" />
              </div>
              <div className="h-5 w-3/4 bg-border/80 rounded" />
              <div className="h-12 w-full bg-border/60 rounded" />
              <div className="h-8 w-full bg-border/80 rounded mt-4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl bg-surface border border-rose/20 text-center space-y-3">
          <AlertCircle className="size-8 text-rose mx-auto" />
          <h3 className="text-sm font-bold text-text-primary">Failed to load open sprints</h3>
          <p className="text-xs text-text-secondary">
            {error instanceof Error ? error.message : "Something went wrong while fetching the sprint pool."}
          </p>
          <Button size="sm" variant="outline" onClick={() => refetch()} className="text-xs">
            Try Again
          </Button>
        </div>
      ) : filteredSprints.length === 0 ? (
        <EmptyState
          title={
            activeTab === "direct"
              ? "No direct sprint requests pending"
              : activeTab === "claimed"
              ? "No claimed sprints yet"
              : "No open sprints found"
          }
          description={
            searchQuery || selectedTag !== "All"
              ? "No student sprint requests match your active filters. Try picking another tag or clearing your search."
              : activeTab === "direct"
              ? "You currently have no pending direct requests. When students select you for 1-on-1 sprint coaching, their private requests will appear here."
              : activeTab === "claimed"
              ? "You haven't claimed any student sprints yet. Check Direct requests or the Open Broadcast Pool to begin mentoring!"
              : "There are currently no unclaimed sprint requests in the pool. Check back soon!"
          }
          icon={Code2}
          action={
            searchQuery || selectedTag !== "All"
              ? {
                label: "Reset Filters",
                onClick: () => {
                  setSelectedTag("All");
                  setSearchQuery("");
                },
              }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSprints.map((sprint) => {
            const sessionsCount = sprint.sessions?.length || sprint.durationDays || 5;

            return (
              <div
                key={sprint.id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-surface border border-border hover:border-amber/40 shadow-xs hover:shadow-sm transition-all group"
              >
                <div className="space-y-4">
                  {/* Top Meta info */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={sprint.status} />
                      {sprint.targetMentorId && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                          🎯 Direct Request • Only Visible To You
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <Clock className="size-3.5" />
                      <span>{sprint.durationDays} Days ({sessionsCount} sessions)</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h2 className="font-serif text-lg font-bold text-text-primary group-hover:text-amber transition-colors line-clamp-1">
                      {sprint.title}
                    </h2>
                    <p className="text-xs text-text-secondary mt-1.5 line-clamp-3 leading-relaxed">
                      {sprint.description || "No specific details provided for this sprint request."}
                    </p>
                  </div>

                  {/* Tech Stack Pills */}
                  {sprint.techStackTags && sprint.techStackTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {sprint.techStackTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-amber-light/70 text-amber border border-amber/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Student & Date Info */}
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-text-muted">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-surface-raised border border-border flex items-center justify-center font-bold text-[10px] text-text-primary">
                        {sprint.student?.name ? sprint.student.name.charAt(0).toUpperCase() : "S"}
                      </div>
                      <span className="font-medium text-text-primary">
                        {sprint.student?.name || "Student"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      <span>Starts {formatDate(sprint.startDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-5 mt-5 border-t border-border/80 flex items-center justify-between gap-3">
                  <span className="text-xs text-text-muted">
                    {activeTab === "claimed"
                      ? "Claimed Mentorship Sprint"
                      : sprint.targetMentorId
                      ? "Private Direct Request"
                      : "Unclaimed Student Request"}
                  </span>

                  <Link href={`/mentor/sprints/${sprint.id}`}>
                    <Button
                      size="sm"
                      className={`font-semibold text-xs h-9 px-4 shadow-2xs gap-1.5 cursor-pointer text-white ${
                        sprint.targetMentorId && sprint.status === "PENDING_CLAIM"
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-amber hover:bg-amber-hover"
                      }`}
                    >
                      {activeTab === "claimed"
                        ? "Manage Sprint"
                        : sprint.targetMentorId
                        ? "Review & Accept"
                        : "View Details & Claim"}{" "}
                      <ArrowRight className="size-3.5" />
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
