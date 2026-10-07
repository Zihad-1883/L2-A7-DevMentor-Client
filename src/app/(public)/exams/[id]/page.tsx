"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Clock,
  HelpCircle,
  Award,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  FileCheck2,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { SEED_EXAMS } from "@/features/exam/seedExams";
import { examService } from "@/services/exam.service";
import type { Exam } from "@/types/exam.types";
import { toast } from "sonner";

export default function ExamDetailPage() {
  const params = useParams();
  const examId = typeof params?.id === "string" ? params.id : "";
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const isMentor = user?.role === "mentor";

  // 1. Check local seed exams
  const localSeedExam = React.useMemo(() => {
    return SEED_EXAMS.find((e) => e.id === examId) || null;
  }, [examId]);

  // 2. Query mentor's created exams (if logged in as mentor)
  const {
    data: mentorExamsData,
    isLoading: isLoadingMentorExams,
  } = useQuery({
    queryKey: ["mentor", "exams", "detail-lookup"],
    queryFn: async () => {
      try {
        return await examService.getMentorExams(1, 100);
      } catch {
        return null;
      }
    },
    enabled: Boolean(examId) && !localSeedExam,
    staleTime: 30000,
  });

  // 3. Query student's available exams
  const {
    data: availableExamsData,
    isLoading: isLoadingAvailableExams,
  } = useQuery({
    queryKey: ["public", "available-exams", "detail-lookup"],
    queryFn: async () => {
      try {
        return await examService.getAvailableExams(1, 100);
      } catch {
        return null;
      }
    },
    enabled: Boolean(examId) && !localSeedExam,
    staleTime: 30000,
  });

  // Resolve exam from seeds, mentor exams, or public/student exams
  const exam: Exam | null = React.useMemo(() => {
    if (localSeedExam) return localSeedExam;

    // Check mentor's exams
    if (mentorExamsData?.data) {
      const foundInMentor = mentorExamsData.data.find((e) => e.id === examId);
      if (foundInMentor) return foundInMentor;
    }

    // Check available student exams
    if (availableExamsData?.data) {
      const foundInAvailable = availableExamsData.data.find((e) => e.id === examId);
      if (foundInAvailable) return foundInAvailable;
    }

    return null;
  }, [localSeedExam, mentorExamsData, availableExamsData, examId]);

  const isLoading =
    !localSeedExam && (isLoadingMentorExams || isLoadingAvailableExams);

  // Mentor publish mutation
  const publishMutation = useMutation({
    mutationFn: async () => {
      if (!exam?.id) return;
      return await examService.publishExam(exam.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor", "exams"] });
      queryClient.invalidateQueries({ queryKey: ["public", "available-exams"] });
      toast.success("Assessment published successfully! Students can now take this exam.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to publish assessment.");
    },
  });

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="size-8 text-amber animate-spin" />
        <p className="text-sm font-semibold text-text-secondary">
          Loading assessment specifications...
        </p>
      </div>
    );
  }

  // Not Found State
  if (!exam) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-surface border border-border shadow-md text-center space-y-6">
          <div className="size-16 rounded-2xl bg-amber-light text-amber mx-auto flex items-center justify-center">
            <AlertCircle className="size-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif text-2xl font-bold text-text-primary">
              Assessment Not Found
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              We couldn&apos;t find an active exam with ID <code className="font-mono text-xs text-amber px-1 py-0.5 rounded bg-surface-raised">{examId}</code>. It may have been archived or is restricted to a cohort.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/exams" className="flex-1">
              <Button variant="outline" className="w-full cursor-pointer">
                Browse Exams
              </Button>
            </Link>
            <Link href="/mentor/exams" className="flex-1">
              <Button className="w-full bg-amber text-white hover:bg-amber-hover cursor-pointer">
                Mentor Studio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const mentorName = exam.mentor?.name || "DevMentor Faculty";
  const mentorInitials = mentorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const duration = exam.durationMinutes || 25;
  const totalQuestions = exam.totalQuestions || exam.questions?.length || 15;
  const passMark = exam.passMark ?? 65;
  const isDraft = exam.status === "DRAFT";

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Top Breadcrumb Header */}
      <div className="w-full border-b border-border/80 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link
            href={isMentor ? "/mentor/exams" : "/exams"}
            className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-amber transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            {isMentor ? "Back to Mentor Studio" : "Back to Practice Exams Catalog"}
          </Link>
          {isDraft && (
            <Link
              href="/mentor/exams"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber hover:underline"
            >
              Mentor Studio <ArrowRight className="size-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Draft Mode Notification Banner for Mentor */}
      {isDraft && (
        <div className="bg-amber-light border-b border-amber/30 px-6 py-3.5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-amber">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Sparkles className="size-4 shrink-0" />
              <span>
                <strong>Mentor Preview (Draft Mode):</strong> This assessment is currently in draft. Only you can view this page until published.
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => {
                if (totalQuestions === 0) {
                  toast.error(
                    "Cannot publish an assessment with 0 questions. Please add questions first."
                  );
                  return;
                }
                publishMutation.mutate();
              }}
              disabled={publishMutation.isPending || totalQuestions === 0}
              title={
                totalQuestions === 0
                  ? "Cannot publish an assessment with 0 questions"
                  : "Publish assessment"
              }
              className="bg-amber text-white hover:bg-amber-hover text-xs font-semibold h-8 gap-1.5 shrink-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Send className="size-3.5" />
              {publishMutation.isPending ? "Publishing..." : "Publish Assessment Now"}
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Main Left Content */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${
                    exam.isFree
                      ? "bg-emerald-light text-emerald border-emerald/20"
                      : "bg-amber-light text-amber border-amber/20"
                  }`}
                >
                  {exam.isFree ? "Free Practice Exam" : "Enrolled Cohort Exam"}
                </span>
                <span className="px-3 py-1 rounded-full bg-surface-raised text-text-muted text-xs font-semibold uppercase tracking-wider border border-border">
                  Auto-Graded
                </span>
                {isDraft && (
                  <span className="px-3 py-1 rounded-full bg-amber-light text-amber text-xs font-bold uppercase tracking-wider border border-amber/20">
                    Draft
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-4">
                {exam.title}
              </h1>

              <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                {exam.description ||
                  "Gauge your understanding of real-world patterns, pitfalls, and design best practices with this standardized engineering skill evaluation."}
              </p>
            </div>

            {/* Test Specifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-center gap-4">
                <div className="size-11 rounded-xl bg-amber-light text-amber flex items-center justify-center border border-amber/30 shrink-0">
                  <Clock className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Time Limit</p>
                  <p className="font-serif text-lg font-bold text-text-primary">
                    {duration} Minutes
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-center gap-4">
                <div className="size-11 rounded-xl bg-amber-light text-amber flex items-center justify-center border border-amber/30 shrink-0">
                  <HelpCircle className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Questions</p>
                  <p className="font-serif text-lg font-bold text-text-primary">
                    {totalQuestions} MCQs
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-center gap-4">
                <div className="size-11 rounded-xl bg-emerald-light text-emerald flex items-center justify-center border border-emerald/30 shrink-0">
                  <Award className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Passing Cutoff</p>
                  <p className="font-serif text-lg font-bold text-text-primary">
                    {passMark}% Score
                  </p>
                </div>
              </div>
            </div>

            {/* Exam Rules & Instructions */}
            <div className="p-7 rounded-2xl bg-surface border border-border shadow-xs">
              <h2 className="font-serif text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <FileCheck2 className="size-5 text-amber" /> Rules &amp; Assessment Guidelines
              </h2>
              <div className="space-y-3.5 text-sm text-text-secondary">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-emerald mt-0.5 shrink-0" />
                  <span>
                    <strong>Timed Countdown:</strong> The clock starts immediately once you launch the test. The attempt auto-submits when time expires.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-emerald mt-0.5 shrink-0" />
                  <span>
                    <strong>One Answer per Question:</strong> Each multiple-choice question presents 2-6 curated choices with exactly 1 correct answer.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-emerald mt-0.5 shrink-0" />
                  <span>
                    <strong>Instant Auto-Grading:</strong> Receive your exact percentage score, pass/fail status, and a breakdown with explanations as soon as you submit.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-emerald mt-0.5 shrink-0" />
                  <span>
                    <strong>Retake Policy:</strong> You may retake practice assessments to benchmark your knowledge retention and progression over time.
                  </span>
                </div>
              </div>
            </div>

            {/* Attached Cohort context if restricted */}
            {exam.cohort && (
              <div className="p-6 rounded-2xl bg-surface-raised border border-border/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                  Part of Cohort Program
                </h3>
                <p className="font-serif text-base font-bold text-text-primary mb-1">
                  {exam.cohort.title}
                </p>
                <p className="text-xs text-text-secondary mb-4">
                  This examination is calibrated as an assessment benchmark for students enrolled in this cohort track.
                </p>
                <Link
                  href={`/cohorts/${exam.cohort.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber hover:text-amber-hover transition-colors"
                >
                  <span>View Cohort Details</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Right Sticky Attempt Trigger Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="bg-surface rounded-2xl p-7 border-2 border-amber/30 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-amber via-terracotta to-amber" />

              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Examination Access
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-serif text-3xl font-bold text-text-primary">
                    {exam.isFree ? "Free Practice" : "Cohort Enrolled"}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1.5">
                  {exam.isFree
                    ? "Available to all registered DevMentor students at no credit cost."
                    : "Included for students enrolled in the corresponding cohort track."}
                </p>
              </div>

              {/* Specs */}
              <div className="space-y-3 pb-6 mb-6 border-b border-border/80 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Total Marks</span>
                  <span className="font-bold text-text-primary">
                    {exam.totalMarks ?? totalQuestions} Pts
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Required to Pass</span>
                  <span className="font-bold text-emerald">{passMark}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Duration</span>
                  <span className="font-bold text-text-primary">{duration} min</span>
                </div>
              </div>

              {/* Start Exam CTA */}
              <div className="space-y-3">
                {isMentor ? (
                  isDraft ? (
                    <Button
                      onClick={() => {
                        if (totalQuestions === 0) {
                          toast.error(
                            "Cannot publish an assessment with 0 questions. Please add questions first."
                          );
                          return;
                        }
                        publishMutation.mutate();
                      }}
                      disabled={publishMutation.isPending || totalQuestions === 0}
                      className="w-full bg-amber text-white hover:bg-amber-hover font-semibold h-11 text-sm shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {publishMutation.isPending ? "Publishing..." : "Publish Assessment"}
                    </Button>
                  ) : (
                    <div className="p-4 rounded-xl bg-surface-raised border border-border text-center space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-light text-amber border border-amber/20">
                        <ShieldAlert className="size-3.5" /> Mentor Preview Mode
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">
                        You are previewing this assessment. Exam attempts are restricted to student accounts.
                      </p>
                      <Link href="/mentor/exams" className="block pt-1">
                        <Button variant="outline" size="sm" className="w-full text-xs font-semibold cursor-pointer">
                          Back to Mentor Studio
                        </Button>
                      </Link>
                    </div>
                  )
                ) : isDraft ? (
                  <div className="p-4 rounded-xl bg-surface-raised border border-border text-center space-y-1">
                    <p className="text-xs font-semibold text-text-primary">Under Preparation</p>
                    <p className="text-xs text-text-muted">
                      This assessment is currently in draft mode and cannot be attempted yet.
                    </p>
                  </div>
                ) : (
                  <Link href={`/exams/${exam.id}/attempt`}>
                    <Button className="w-full bg-amber text-white hover:bg-amber-hover font-semibold h-11 text-sm shadow-sm cursor-pointer">
                      Start Timed Exam <ArrowRight className="size-4 ml-1.5" />
                    </Button>
                  </Link>
                )}
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-text-muted">
                <ShieldCheck className="size-4 text-emerald" />
                <span>
                  {isMentor
                    ? "Mentor View: Assessment specifications active"
                    : isDraft
                    ? "Draft mode: Questions can be previewed"
                    : "Timer begins immediately on start"}
                </span>
              </div>
            </div>

            {/* Creator / Mentor Info Card */}
            <div className="bg-surface rounded-2xl p-6 border border-border shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-4">
                Curated By
              </span>

              <div className="flex items-center gap-3.5 mb-2">
                <div className="size-12 rounded-full bg-amber-light text-amber font-serif font-bold text-sm flex items-center justify-center border-2 border-amber/30 shrink-0">
                  {mentorInitials}
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-base font-bold text-text-primary truncate">
                    {mentorName}
                  </h3>
                  <p className="text-xs text-text-muted">DevMentor Faculty</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
