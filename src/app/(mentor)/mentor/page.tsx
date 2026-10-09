"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { userService, type MentorDashboardSummary } from "@/services/user.service";
import { sprintService } from "@/services/sprint.service";
import { codeReviewService } from "@/services/code-review.service";
import type { SprintRequestItem } from "@/types/sprint.types";
import type { CodeReviewRequestItem } from "@/types/code-review.types";
import {
  Timer,
  Users,
  Code2,
  DollarSign,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Wallet,
  Coins,
  ChevronRight,
  Plus,
  BookOpen,
  AlertCircle,
  ExternalLink,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import CreditDisplay from "@/components/shared/CreditDisplay";
import EmptyState from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/utils";

export default function MentorDashboardPage() {
  const { user } = useAuthContext();

  // 1. Fetch Mentor Dashboard Summary (wallet balances, totals, created cohorts, claimed sprints)
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery<MentorDashboardSummary>({
    queryKey: ["mentor", "dashboard-summary"],
    queryFn: () => userService.getMyDashboard<MentorDashboardSummary>(),
    staleTime: 1000 * 30,
  });

  // 2. Fetch Mentor's Claimed Sprints List
  const { data: mySprintsData, isLoading: isSprintsLoading } = useQuery<SprintRequestItem[]>({
    queryKey: ["mentor", "my-sprints"],
    queryFn: () => sprintService.getUserSprints(),
    staleTime: 1000 * 30,
  });

  // 3. Fetch Open Code Review Pool (Pending reviews open for claiming)
  const { data: codeReviewsData, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["mentor", "code-reviews-pool"],
    queryFn: () => codeReviewService.getOpenPool({ limit: 5 }),
    staleTime: 1000 * 30,
  });

  // 4. Fetch Open Sprints Pool (Available student sprint requests waiting for mentors)
  const { data: openSprintsPoolData, isLoading: isPoolLoading } = useQuery({
    queryKey: ["mentor", "open-sprints-pool"],
    queryFn: () => sprintService.getOpenSprintPool({ limit: 5 }),
    staleTime: 1000 * 30,
  });

  const wallet = dashboardData?.wallet;
  const summary = dashboardData?.summary;
  const mySprints = mySprintsData || [];
  const openReviews = codeReviewsData?.requests || [];
  const openPoolSprints = openSprintsPoolData?.sprints || [];

  const activeSprints = mySprints.filter(
    (s) => s.status === "CLAIMED" || s.status === "IN_PROGRESS" || s.status === "ACTIVE"
  );
  const completedSprints = mySprints.filter((s) => s.status === "COMPLETED");

  const totalEarnedCredits = wallet?.totalEarned ?? 0;
  const currentCreditBalance = wallet?.balance ?? 0;
  const totalWithdrawnCredits = wallet?.totalWithdrawn ?? 0;
  const totalCohortsCreated = summary?.totalCohortsCreated ?? 0;
  const pendingReviewsCount = codeReviewsData?.meta?.total ?? openReviews.length;

  const directRequests = React.useMemo(() => {
    if (summary?.directSprintRequests && summary.directSprintRequests.length > 0) {
      return summary.directSprintRequests;
    }
    return openPoolSprints.filter((s) => s.targetMentorId === user?.id);
  }, [summary?.directSprintRequests, openPoolSprints, user?.id]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Welcome Banner (Consistent with Student Dashboard style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-linear-to-r from-amber-50/70 via-surface to-surface border border-amber/20 shadow-xs relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-light text-amber text-xs font-bold uppercase tracking-wider border border-amber/20">
            <Sparkles className="size-3.5" /> Mentor Workspace
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Welcome back, {user?.name?.split(" ")[0] || "Mentor"}
          </h1>
          <p className="text-sm text-text-secondary max-w-xl leading-relaxed">
            Track your earned credits, manage active student sprints, review open code submissions, and request cash-out payouts.
          </p>
        </div>

        {/* Quick action buttons aligned on the right, below the top header wallet */}
        <div className="flex items-center gap-3 z-10 shrink-0">
          <Link href="/mentor/sprints">
            <Button size="sm" className="bg-amber text-white hover:bg-amber-hover font-semibold text-xs shadow-xs gap-1.5 h-9 px-4">
              <Plus className="size-3.5" /> Explore Sprints
            </Button>
          </Link>
          <Link href="/mentor/earnings">
            <Button size="sm" variant="outline" className="border-border text-xs gap-1.5 bg-surface hover:bg-surface-raised h-9 px-4">
              <Wallet className="size-3.5 text-amber" /> Payouts & Earnings
            </Button>
          </Link>
        </div>

        {/* Ambient subtle decorative circle */}
        <div className="absolute -right-10 -bottom-10 size-40 bg-amber/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 1.5 Direct Sprint Requests Targeted Specifically to This Mentor */}
      {directRequests.length > 0 && (
        <div className="p-6 rounded-3xl bg-linear-to-r from-purple-500/10 via-purple-500/5 to-surface border-2 border-purple-500/30 shadow-xs space-y-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500" />
              </span>
              <div>
                <h2 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2">
                  🎯 Direct Sprint Requests ({directRequests.length})
                </h2>
                <p className="text-xs text-text-secondary">
                  Students requested 1-on-1 sprint coaching specifically targeting you. These are private and invisible to all other mentors.
                </p>
              </div>
            </div>

            <Link href="/mentor/sprints?tab=direct">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 px-4 shrink-0 shadow-xs cursor-pointer">
                View In Sprints Pool →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {directRequests.map((sprint) => (
              <div
                key={sprint.id}
                className="p-5 rounded-2xl bg-surface border border-purple-500/20 hover:border-purple-500/50 transition-all flex flex-col justify-between gap-4 shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                      🎯 Targeted Exclusively to You
                    </span>
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <Clock className="size-3" /> {sprint.durationDays} Days ({sprint.sessions?.length || sprint.durationDays} sessions)
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-text-primary line-clamp-1">
                    {sprint.title}
                  </h3>

                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {sprint.description}
                  </p>

                  {sprint.techStackTags && sprint.techStackTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {sprint.techStackTags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-surface-raised border border-border text-text-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="font-semibold text-text-primary flex items-center gap-1.5">
                      Student: {sprint.student?.name || "Student"}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      Starts {formatDate(sprint.startDate)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber">
                    50 CR / session
                  </span>
                  <Link href={`/mentor/sprints/${sprint.id}`}>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-8 px-3 font-semibold shadow-2xs cursor-pointer">
                      Review &amp; Claim <ArrowRight className="size-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Key Performance Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Lifetime Earnings"
          value={isDashboardLoading ? "..." : `${totalEarnedCredits} Credits`}
          subtitle={`৳${totalEarnedCredits * 4} BDT earned`}
          icon={DollarSign}
          variant="amber"
        />

        <StatCard
          title="Active Claimed Sprints"
          value={isSprintsLoading ? "..." : activeSprints.length}
          subtitle={`${completedSprints.length} sprints completed`}
          icon={Timer}
          variant="emerald"
        />

        <StatCard
          title="Open Code Reviews"
          value={isReviewsLoading ? "..." : pendingReviewsCount}
          subtitle="Waiting in pool to claim"
          icon={Code2}
          variant="default"
        />

        <StatCard
          title="Cohorts Created"
          value={isDashboardLoading ? "..." : totalCohortsCreated}
          subtitle="Teaching programs"
          icon={Users}
          variant="terracotta"
        />
      </div>

      {/* 3. Main Dashboard Grid: Active Sprints & Open Code Reviews Pool */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Active Student Sprints */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div>
              <h2 className="font-serif text-xl font-bold text-text-primary flex items-center gap-2">
                <Timer className="size-5 text-amber" />
                Active Claimed Sprints
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                1-on-1 sprint coaching requests currently under your guidance.
              </p>
            </div>
          </div>

          {isSprintsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-2xl bg-surface border border-border animate-pulse"
                />
              ))}
            </div>
          ) : activeSprints.length === 0 ? (
            <div className="p-8 rounded-2xl bg-surface border border-border text-center space-y-3">
              <div className="size-12 rounded-xl bg-amber-light text-amber flex items-center justify-center mx-auto border border-amber/20">
                <Timer className="size-6" />
              </div>
              <h3 className="font-bold text-text-primary text-sm">No Active Sprints Right Now</h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                There are open sprint coaching requests waiting in the pool. Claim a sprint to start earning credits!
              </p>
              <Link href="/mentor/sprints">
                <Button size="sm" className="bg-amber text-white hover:bg-amber-hover text-xs mt-2">
                  Explore Sprints Pool <ArrowRight className="size-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeSprints.slice(0, 4).map((sprint) => (
                <div
                  key={sprint.id}
                  className="p-5 rounded-2xl bg-surface border border-border hover:border-amber/40 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={sprint.status} />
                      <span className="text-[11px] font-semibold text-amber bg-amber-light px-2 py-0.5 rounded-md border border-amber/20">
                        {sprint.durationDays} Days Sprint
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-text-primary truncate">
                      {sprint.title}
                    </h3>

                    <p className="text-xs text-text-secondary line-clamp-1">
                      {sprint.description}
                    </p>

                    {sprint.techStackTags && sprint.techStackTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {sprint.techStackTags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-surface-raised border border-border text-text-secondary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-2">
                    <span className="text-xs font-semibold text-text-primary">
                      Student: {sprint.student?.name || "Developer"}
                    </span>
                    <Link href={`/mentor/sprints/${sprint.id}`}>
                      <Button size="sm" variant="outline" className="text-xs h-8 px-3">
                        Manage Sprint <ArrowRight className="size-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Open Sprint Pool Callout */}
          {openPoolSprints.length > 0 && (
            <div className="p-5 rounded-2xl bg-linear-to-r from-amber-light/30 via-surface to-surface border border-amber/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber flex items-center gap-1.5">
                  <Flame className="size-3.5" /> Open Requests Pool ({openPoolSprints.length} waiting)
                </span>
                <Link
                  href="/mentor/sprints"
                  className="text-xs font-semibold text-amber hover:underline"
                >
                  View Pool →
                </Link>
              </div>
              <p className="text-xs text-text-secondary">
                Students have submitted sprint requests waiting for mentor claim. Choose requests matching your tech stack.
              </p>
            </div>
          )}
        </div>

        {/* Right Column (1 col): Open Code Reviews Pool & Quick Tools */}
        <div className="space-y-6">
          {/* Open Code Reviews Pool */}
          <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-indigo-light text-indigo flex items-center justify-center border border-indigo/20">
                  <Code2 className="size-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-text-primary">
                    Code Reviews Pool
                  </h3>
                  <span className="text-[11px] text-text-muted">Earn up to 50 Credits/PR</span>
                </div>
              </div>

              <Link
                href="/mentor/code-reviews"
                className="text-xs font-semibold text-amber hover:underline"
              >
                View All
              </Link>
            </div>

            {isReviewsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-xl bg-surface-raised animate-pulse" />
                ))}
              </div>
            ) : openReviews.length === 0 ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="size-8 text-emerald mx-auto" />
                <p className="text-xs text-text-muted">
                  No open code reviews waiting right now. Check back soon!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {openReviews.slice(0, 3).map((review: CodeReviewRequestItem) => (
                  <Link
                    key={review.id}
                    href={`/mentor/code-reviews/${review.id}`}
                    className="p-3.5 rounded-xl bg-surface-raised border border-border/80 hover:border-amber/40 transition-all block space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface border border-border text-text-secondary">
                        {review.language || "TypeScript"}
                      </span>
                      <span className="text-xs font-bold text-amber">
                        +{review.creditReward} Credits
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-text-primary truncate group-hover:text-amber transition-colors">
                      {review.title}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-text-muted pt-1">
                      <span>{review.tier} Audit</span>
                      <span>By {review.student?.name || "Student"}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <Link href="/mentor/code-reviews" className="block pt-1">
              <Button variant="outline" size="sm" className="w-full text-xs border-border">
                Open Review Pool ({pendingReviewsCount})
              </Button>
            </Link>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-3">
            <h3 className="font-serif text-sm font-bold text-text-primary uppercase tracking-wider text-text-muted">
              Mentor Shortcuts
            </h3>

            <div className="space-y-2">
              <Link
                href="/mentor/cohorts/new"
                className="flex items-center justify-between p-3 rounded-xl bg-surface-raised border border-border/70 hover:border-amber/40 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-7 rounded-lg bg-emerald-light text-emerald flex items-center justify-center">
                    <Plus className="size-4" />
                  </div>
                  <span className="text-xs font-semibold text-text-primary group-hover:text-amber transition-colors">
                    Launch New Cohort
                  </span>
                </div>
                <ArrowRight className="size-3.5 text-text-muted group-hover:text-amber transition-colors" />
              </Link>

              <Link
                href="/mentor/exams/new"
                className="flex items-center justify-between p-3 rounded-xl bg-surface-raised border border-border/70 hover:border-amber/40 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-7 rounded-lg bg-amber-light text-amber flex items-center justify-center">
                    <BookOpen className="size-4" />
                  </div>
                  <span className="text-xs font-semibold text-text-primary group-hover:text-amber transition-colors">
                    Build MCQ Exam
                  </span>
                </div>
                <ArrowRight className="size-3.5 text-text-muted group-hover:text-amber transition-colors" />
              </Link>

              <Link
                href="/mentor/earnings"
                className="flex items-center justify-between p-3 rounded-xl bg-surface-raised border border-border/70 hover:border-amber/40 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-7 rounded-lg bg-amber-light text-amber flex items-center justify-center">
                    <Wallet className="size-4" />
                  </div>
                  <span className="text-xs font-semibold text-text-primary group-hover:text-amber transition-colors">
                    Request BDT Cash-Out
                  </span>
                </div>
                <ArrowRight className="size-3.5 text-text-muted group-hover:text-amber transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
