"use client";

import * as React from "react";
import Link from "next/link";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useWallet } from "@/hooks/useWallet";
import { useQuery } from "@tanstack/react-query";
import { sprintService, type SprintRequestItem, type SprintSessionItem } from "@/services/sprint.service";
import { cohortService, type CohortItem } from "@/services/cohort.service";
import { codeReviewService } from "@/services/code-review.service";
import { examService } from "@/services/exam.service";
import type { CodeReviewRequestItem } from "@/types/code-review.types";
import type { ExamAttempt } from "@/types/exam.types";
import {
  Timer,
  Users,
  Code2,
  GraduationCap,
  Wallet,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  AlertCircle,
  FileCode2,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import CreditDisplay from "@/components/shared/CreditDisplay";
import EmptyState from "@/components/shared/EmptyState";
import ExamAttemptDetailModal from "@/features/exam/ExamAttemptDetailModal";
import { formatDate } from "@/lib/utils";

export default function StudentDashboardPage() {
  const { user } = useAuthContext();
  const { balance, isLoading: isWalletLoading } = useWallet();
  const [selectedAttempt, setSelectedAttempt] = React.useState<ExamAttempt | null>(null);

  // 1. Fetch Student Sprints
  const { data: sprintsData, isLoading: isSprintsLoading } = useQuery({
    queryKey: ["student", "sprints"],
    queryFn: () => sprintService.getUserSprints(),
    staleTime: 1000 * 30,
  });

  // 2. Fetch Enrolled Cohorts
  const { data: cohortsData, isLoading: isCohortsLoading } = useQuery({
    queryKey: ["student", "cohorts"],
    queryFn: () => cohortService.getMyEnrolledCohorts(),
    staleTime: 1000 * 30,
  });

  // 3. Fetch Recent Exam Attempts
  const { data: attemptsData, isLoading: isAttemptsLoading } = useQuery({
    queryKey: ["student", "exam-attempts"],
    queryFn: () => examService.getStudentAttempts(1, 5),
    staleTime: 1000 * 30,
  });

  // 4. Fetch Open/Active Code Reviews
  const { data: codeReviewsData, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["student", "code-reviews"],
    queryFn: () => codeReviewService.getOpenPool({ limit: 10 }),
    staleTime: 1000 * 30,
  });

  const sprints = sprintsData ?? [];
  const enrolledCohorts = cohortsData?.enrollments ?? [];
  const examAttempts = attemptsData?.data ?? [];

  // Filter student-specific reviews if studentId matches or fallback to open reviews
  const activeCodeReviews = (codeReviewsData?.requests ?? []).filter(
    (r: CodeReviewRequestItem) => !user?.id || r.studentId === user.id || r.status !== "COMPLETED"
  ).slice(0, 4);

  // Active sprints count
  const activeSprints = sprints.filter(
    (s: SprintRequestItem) => s.status === "ACTIVE" || s.status === "PENDING_CLAIM"
  );

  // Collect scheduled upcoming sprint sessions
  const upcomingSprintSessions = sprints
    .flatMap((s: SprintRequestItem) =>
      (s.sessions || []).map((sess: SprintSessionItem) => ({
        ...sess,
        sprintTitle: s.title,
        sprintId: s.id,
      }))
    )
    .filter((sess) => sess.status === "PENDING" && sess.scheduledAt)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-linear-to-r from-amber-50/70 via-surface to-surface border border-amber/20 shadow-xs relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-light text-amber text-xs font-bold uppercase tracking-wider border border-amber/20">
            <Sparkles className="size-3.5" /> Student Workspace
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Welcome back, {user?.name?.split(" ")[0] || "Developer"}
          </h1>
          <p className="text-sm text-text-secondary max-w-xl leading-relaxed">
            Here is your daily engineering overview. Track active sprint bookings, upcoming sessions, code review feedback, and skill test results.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <Link href="/dashboard/sprints/new">
            <Button size="sm" className="bg-amber text-white hover:bg-amber-hover font-semibold text-xs shadow-xs gap-1.5">
              <Plus className="size-3.5" /> New Sprint
            </Button>
          </Link>
          <Link href="/dashboard/wallet">
            <Button size="sm" variant="outline" className="border-border text-xs gap-1.5 bg-surface hover:bg-surface-raised">
              <Wallet className="size-3.5 text-amber" /> Top up Credits
            </Button>
          </Link>
        </div>

        {/* Ambient subtle decorative circle */}
        <div className="absolute -right-10 -bottom-10 size-40 bg-amber/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Credit Balance"
          value={isWalletLoading ? "..." : `${balance} Credits`}
          subtitle="Available for bookings"
          icon={Wallet}
          variant="amber"
        />
        <StatCard
          title="Active Sprints"
          value={isSprintsLoading ? "..." : activeSprints.length}
          subtitle="1-on-1 problem coaching"
          icon={Timer}
          variant="default"
        />
        <StatCard
          title="Enrolled Cohorts"
          value={isCohortsLoading ? "..." : enrolledCohorts.length}
          subtitle="Group training programs"
          icon={Users}
          variant="emerald"
        />
        <StatCard
          title="MCQ Tests Taken"
          value={isAttemptsLoading ? "..." : examAttempts.length}
          subtitle="Skill assessments"
          icon={GraduationCap}
          variant="terracotta"
        />
      </div>

      {/* Main Grid: Upcoming Sessions & Active Code Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upcoming Sessions & Active Sprints */}
        <div className="lg:col-span-7 space-y-6">
          {/* Upcoming Sessions Card */}
          <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-amber" />
                <h2 className="font-serif text-lg font-bold text-text-primary">
                  Upcoming Sessions
                </h2>
              </div>
              <Link
                href="/dashboard/sprints"
                className="text-xs font-semibold text-amber hover:text-amber-hover transition-colors inline-flex items-center gap-1"
              >
                View all <ArrowRight className="size-3" />
              </Link>
            </div>

            {upcomingSprintSessions.length > 0 ? (
              <div className="space-y-3">
                {upcomingSprintSessions.map((session, idx) => (
                  <div
                    key={session.id || idx}
                    className="p-4 rounded-xl bg-surface-raised/70 border border-border/80 flex items-center justify-between gap-4 hover:border-amber/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-text-primary truncate max-w-[200px] sm:max-w-xs">
                          {session.sprintTitle}
                        </span>
                        <StatusBadge status={session.status} size="sm" />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3 text-amber" />
                          Day {session.dayNumber}
                        </span>
                        <span>•</span>
                        <span>{formatDate(session.scheduledAt)}</span>
                      </div>
                    </div>

                    <Link href={`/dashboard/sprints/${session.sprintId}`}>
                      <Button size="sm" variant="outline" className="text-xs h-8 border-border">
                        Join / Details
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center bg-surface-raised/30 rounded-xl border border-dashed border-border/80">
                <Calendar className="size-8 text-text-muted mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-text-primary">No upcoming sessions scheduled</p>
                <p className="text-[11px] text-text-muted mt-0.5 mb-3">
                  Book a new sprint or join an active cohort to schedule sessions.
                </p>
                <Link href="/dashboard/sprints/new">
                  <Button size="sm" className="bg-amber text-white hover:bg-amber-hover text-xs h-7">
                    Book a Sprint
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Enrolled Cohorts Preview */}
          <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-emerald" />
                <h2 className="font-serif text-lg font-bold text-text-primary">
                  My Enrolled Cohorts
                </h2>
              </div>
              <Link
                href="/dashboard/cohorts"
                className="text-xs font-semibold text-amber hover:text-amber-hover transition-colors inline-flex items-center gap-1"
              >
                View all <ArrowRight className="size-3" />
              </Link>
            </div>

            {enrolledCohorts.length > 0 ? (
              <div className="space-y-3">
                {enrolledCohorts.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-surface-raised/70 border border-border/80 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold text-text-primary">
                        {item.cohort.title}
                      </h3>
                      <p className="text-[11px] text-text-muted line-clamp-1">
                        Mentor: {item.cohort.mentor?.name || "DevMentor Lead"} • {item.cohort.durationWeeks} weeks
                      </p>
                    </div>

                    <Link href={`/dashboard/cohorts/${item.cohortId}`}>
                      <Button size="sm" variant="outline" className="text-xs h-8 border-border">
                        Details
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center bg-surface-raised/30 rounded-xl border border-dashed border-border/80">
                <Users className="size-8 text-text-muted mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-text-primary">Not enrolled in any cohorts yet</p>
                <p className="text-[11px] text-text-muted mt-0.5 mb-3">
                  Explore available group cohorts led by experienced engineers.
                </p>
                <Link href="/cohorts">
                  <Button size="sm" variant="outline" className="text-xs h-7 border-border">
                    Browse Cohorts
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Code Reviews & Recent Exam Scores */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Code Reviews */}
          <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode2 className="size-4 text-amber" />
                <h2 className="font-serif text-lg font-bold text-text-primary">
                  Code Reviews
                </h2>
              </div>
              <Link
                href="/dashboard/code-reviews"
                className="text-xs font-semibold text-amber hover:text-amber-hover transition-colors inline-flex items-center gap-1"
              >
                Submit <ArrowRight className="size-3" />
              </Link>
            </div>

            {activeCodeReviews.length > 0 ? (
              <div className="space-y-3">
                {activeCodeReviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-3.5 rounded-xl bg-surface-raised/70 border border-border/80 space-y-2 hover:border-amber/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-text-primary truncate">
                        {review.title}
                      </span>
                      <StatusBadge status={review.status} size="sm" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-text-muted">
                      <span>{review.tier} Tier • {review.creditReward} CR</span>
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center bg-surface-raised/30 rounded-xl border border-dashed border-border/80">
                <Code2 className="size-8 text-text-muted mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-text-primary">No code reviews submitted</p>
                <p className="text-[11px] text-text-muted mt-0.5 mb-3">
                  Submit code snippets or pull requests for expert architectural review.
                </p>
                <Link href="/dashboard/code-reviews">
                  <Button size="sm" variant="outline" className="text-xs h-7 border-border">
                    Request Review
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Recent Exam Scores */}
          <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="size-4 text-emerald" />
                <h2 className="font-serif text-lg font-bold text-text-primary">
                  Recent Exam Scores
                </h2>
              </div>
              <Link
                href="/exams"
                className="text-xs font-semibold text-amber hover:text-amber-hover transition-colors inline-flex items-center gap-1"
              >
                Take test <ArrowRight className="size-3" />
              </Link>
            </div>

            {examAttempts.length > 0 ? (
              <div className="space-y-3">
                {examAttempts.map((attempt: ExamAttempt) => (
                  <div
                    key={attempt.id}
                    onClick={() => setSelectedAttempt(attempt)}
                    className="p-3.5 rounded-xl bg-surface-raised/70 border border-border/80 flex items-center justify-between gap-3 hover:border-amber/40 hover:bg-surface-raised cursor-pointer transition-all group"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-text-primary group-hover:text-amber transition-colors truncate block max-w-[170px]">
                        {attempt.exam?.title || "MCQ Assessment"}
                      </span>
                      <span className="text-[11px] text-text-muted">
                        Score: {attempt.score} / {attempt.exam?.totalMarks || 100} ({Math.round(attempt.percentage)}%)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${attempt.isPassed
                          ? "bg-emerald-light text-emerald border-emerald/30"
                          : "bg-orange-light text-orange border-orange/30"
                          }`}
                      >
                        {attempt.isPassed ? "PASSED" : "FAILED"}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="size-7 p-0 text-text-muted group-hover:text-amber"
                        aria-label="View score report"
                      >
                        <ExternalLink className="size-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center bg-surface-raised/30 rounded-xl border border-dashed border-border/80">
                <GraduationCap className="size-8 text-text-muted mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-text-primary">No MCQ test attempts yet</p>
                <p className="text-[11px] text-text-muted mt-0.5 mb-3">
                  Test your skills on TypeScript, React, and System Design for free.
                </p>
                <Link href="/exams">
                  <Button size="sm" variant="outline" className="text-xs h-7 border-border">
                    Browse Free Tests
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Exam Attempt Score Breakdown Modal */}
      <ExamAttemptDetailModal
        isOpen={Boolean(selectedAttempt)}
        onClose={() => setSelectedAttempt(null)}
        attempt={selectedAttempt}
        allAttempts={examAttempts}
      />
    </div>
  );
}

