"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Rocket,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { sprintService } from "@/services/sprint.service";
import { queryKeys } from "@/lib/query-keys";
import SprintRequestCard from "@/features/sprint/SprintRequestCard";
import type { SprintRequestItem, SprintStatus } from "@/types/sprint.types";

const STATUS_FILTERS: { label: string; value: "ALL" | SprintStatus }[] = [
  { label: "All Sprints", value: "ALL" },
  { label: "Seeking Mentor", value: "PENDING_CLAIM" },
  { label: "Active", value: "ACTIVE" },
  { label: "Completed", value: "COMPLETED" },
];

export default function StudentSprintsPage() {
  const [activeFilter, setActiveFilter] = React.useState<"ALL" | SprintStatus>("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Fetch student's own sprints
  const { data: sprints, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.sprints.mySprints(),
    queryFn: () => sprintService.getUserSprints(),
    staleTime: 1000 * 30, // 30 seconds
  });

  const allSprints: SprintRequestItem[] = sprints ?? [];

  // Filter sprints based on tab and search query
  const filteredSprints = React.useMemo(() => {
    return allSprints.filter((sprint) => {
      const matchesFilter =
        activeFilter === "ALL" || sprint.status === activeFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        sprint.title.toLowerCase().includes(q) ||
        sprint.description.toLowerCase().includes(q) ||
        sprint.techStackTags.some((t) => t.toLowerCase().includes(q));

      return matchesFilter && matchesSearch;
    });
  }, [allSprints, activeFilter, searchQuery]);

  // Metric counts
  const activeCount = allSprints.filter((s) => s.status === "ACTIVE").length;
  const pendingCount = allSprints.filter((s) => s.status === "PENDING_CLAIM").length;
  const completedCount = allSprints.filter((s) => s.status === "COMPLETED").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20 mb-2">
            <Sparkles className="size-3.5" /> 1-on-1 Mentorship
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            My Engineering Sprints
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-xl">
            Track and manage your scheduled 1-on-1 sprint sessions, monitor mentor claims, and request technical deep-dives.
          </p>
        </div>

        {/* Action button & quick summary metrics */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="px-3.5 py-2 rounded-2xl bg-surface border border-border text-center shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-text-muted block">Seeking</span>
              <span className="font-serif text-base font-bold text-text-primary">{pendingCount}</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-emerald-light/40 border border-emerald/30 text-center shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-emerald block">Active</span>
              <span className="font-serif text-base font-bold text-emerald">{activeCount}</span>
            </div>
          </div>

          <Link href="/dashboard/sprints/new">
            <Button className="bg-amber text-white hover:bg-amber-hover font-semibold text-xs h-10 px-4 gap-1.5 shadow-xs cursor-pointer">
              <Plus className="size-4" /> New Sprint Request
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Live Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Filter Pill Buttons */}
        <div className="flex items-center gap-1 p-1 bg-surface-raised/80 rounded-2xl border border-border/80 self-start overflow-x-auto max-w-full">
          {STATUS_FILTERS.map((tab) => {
            const isSelected = activeFilter === tab.value;
            const count =
              tab.value === "ALL"
                ? allSprints.length
                : tab.value === "ACTIVE"
                  ? activeCount
                  : tab.value === "PENDING_CLAIM"
                    ? pendingCount
                    : completedCount;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveFilter(tab.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${isSelected
                    ? "bg-surface text-amber shadow-xs"
                    : "text-text-muted hover:text-text-primary"
                  }`}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Live Search */}
        <div className="relative max-w-xs w-full">
          <Search className="size-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, stack, keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-surface border border-border focus:outline-hidden focus:border-amber transition-colors"
          />
        </div>
      </div>

      {/* Main Sprints Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-surface-raised/40 border border-border animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-surface rounded-2xl border border-orange/20 max-w-md mx-auto space-y-3">
          <AlertCircle className="size-8 text-orange mx-auto" />
          <h3 className="font-serif text-base font-bold text-text-primary">
            Unable to Load Sprints
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            There was a problem communicating with the server. Please check your network connection and try again.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            className="text-xs border-border"
          >
            Retry Fetch
          </Button>
        </div>
      ) : filteredSprints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSprints.map((sprint) => (
            <SprintRequestCard key={sprint.id} sprint={sprint} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-surface-raised/30 rounded-3xl border border-dashed border-border p-8 max-w-xl mx-auto space-y-4">
          <div className="size-14 rounded-2xl mx-auto flex items-center justify-center bg-amber-light text-amber border border-amber/20">
            <Rocket className="size-7" />
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-text-primary">
              {searchQuery || activeFilter !== "ALL"
                ? "No Sprints Matching Filter"
                : "No Mentorship Sprints Yet"}
            </h3>
            <p className="text-xs text-text-secondary max-w-md mx-auto mt-1 leading-relaxed">
              {searchQuery || activeFilter !== "ALL"
                ? "Try clearing your search keyword or switching between status filters."
                : "1-on-1 Sprints connect you directly with senior mentors for deep-dive technical guidance, architecture reviews, and hands-on debugging."}
            </p>
          </div>

          {searchQuery || activeFilter !== "ALL" ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("ALL");
              }}
              className="text-xs border-border cursor-pointer"
            >
              Clear Filters
            </Button>
          ) : (
            <Link href="/dashboard/sprints/new">
              <Button size="sm" className="bg-amber text-white hover:bg-amber-hover text-xs font-semibold gap-1.5 shadow-xs cursor-pointer">
                <Plus className="size-3.5" /> Book Your First Sprint
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
