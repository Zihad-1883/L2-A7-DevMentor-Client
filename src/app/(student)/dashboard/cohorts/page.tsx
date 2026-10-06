"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Search,
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cohortService } from "@/services/cohort.service";
import { queryKeys } from "@/lib/query-keys";
import EnrolledCohortCard from "@/features/cohort/EnrolledCohortCard";
import type { CohortEnrollmentItem } from "@/types/cohort.types";

export default function StudentCohortsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Fetch student's enrolled cohorts
  const {
    data: enrollmentData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.enrollments.myCohorts,
    queryFn: () => cohortService.getMyEnrolledCohorts(),
    staleTime: 1000 * 30, // 30 seconds
  });

  const enrollments: CohortEnrollmentItem[] = enrollmentData?.enrollments ?? [];

  // Filter enrolled cohorts by query
  const filteredEnrollments = React.useMemo(() => {
    return enrollments.filter((item) => {
      const cohort = item.cohort;
      if (!cohort) return false;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      return (
        cohort.title.toLowerCase().includes(q) ||
        cohort.description.toLowerCase().includes(q) ||
        (cohort.mentor?.name && cohort.mentor.name.toLowerCase().includes(q)) ||
        (cohort.techStackTags &&
          cohort.techStackTags.some((t) => t.toLowerCase().includes(q)))
      );
    });
  }, [enrollments, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20 mb-2">
            <Sparkles className="size-3.5" /> Group Engineering Cohorts
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            My Enrolled Cohorts
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-xl">
            Access your multi-week cohort tracks, attend scheduled live workshops, and download class materials.
          </p>
        </div>

        {/* Action button & metric stats */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-surface border border-border text-center shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-text-muted block">Enrolled Tracks</span>
            <span className="font-serif text-base font-bold text-text-primary">{enrollments.length}</span>
          </div>

          <Link href="/cohorts">
            <Button
              variant="outline"
              className="text-xs font-semibold h-10 px-4 gap-1.5 border-border bg-surface hover:bg-surface-raised cursor-pointer"
            >
              <BookOpen className="size-3.5 text-amber" /> Browse All Cohorts
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="size-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search enrolled cohorts by title, topic, or tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-surface border border-border focus:outline-hidden focus:border-amber transition-colors"
          />
        </div>

        <span className="text-xs text-text-muted self-start sm:self-center">
          Showing {filteredEnrollments.length} of {enrollments.length} cohorts
        </span>
      </div>

      {/* Main Enrolled Cohorts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-72 rounded-2xl bg-surface-raised/40 border border-border animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-surface rounded-2xl border border-orange/20 max-w-md mx-auto space-y-3">
          <AlertCircle className="size-8 text-orange mx-auto" />
          <h3 className="font-serif text-base font-bold text-text-primary">
            Unable to Load Enrolled Cohorts
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            There was an error communicating with the server. Please check your network connection and try again.
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
      ) : filteredEnrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((item) => (
            <EnrolledCohortCard
              key={item.id}
              cohort={item.cohort}
              enrolledAt={item.enrolledAt}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-surface-raised/30 rounded-3xl border border-dashed border-border p-8 max-w-xl mx-auto space-y-4">
          <div className="size-14 rounded-2xl mx-auto flex items-center justify-center bg-amber-light text-amber border border-amber/20">
            <GraduationCap className="size-7" />
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-text-primary">
              {searchQuery ? "No Cohorts Matching Search" : "No Cohort Enrollments Yet"}
            </h3>
            <p className="text-xs text-text-secondary max-w-md mx-auto mt-1 leading-relaxed">
              {searchQuery
                ? "Try searching with another keyword or tech stack name."
                : "You haven't enrolled in any multi-week engineering cohorts yet. Browse open cohort programs to learn with mentor leads and peers."}
            </p>
          </div>

          {searchQuery ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSearchQuery("")}
              className="text-xs border-border cursor-pointer"
            >
              Clear Search
            </Button>
          ) : (
            <Link href="/cohorts">
              <Button size="sm" className="bg-amber text-white hover:bg-amber-hover text-xs font-semibold gap-1.5 shadow-xs cursor-pointer">
                <BookOpen className="size-3.5" /> Explore Open Cohorts
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
