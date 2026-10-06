"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ExamAttemptEngine from "@/features/exam/ExamAttemptEngine";
import { SEED_EXAMS } from "@/features/exam/seedExams";
import { examService } from "@/services/exam.service";
import type { Exam } from "@/types/exam.types";

export default function StudentExamAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const examId = typeof params?.id === "string" ? params.id : "";

  // 1. Check if ID matches a local seed exam immediately
  const localSeedExam = React.useMemo(() => {
    return SEED_EXAMS.find((e) => e.id === examId) || null;
  }, [examId]);

  // 2. Fetch authenticated exam attempt from backend via /api/proxy/exams/:id/start
  const {
    data: startAttemptData,
    isLoading: isStartingAttempt,
    error: startError,
  } = useQuery({
    queryKey: ["student", "start-exam", examId],
    queryFn: async () => {
      return await examService.startExamAttempt(examId);
    },
    // Don't call backend if it's already identified as a seed-only exam
    enabled: Boolean(examId) && !localSeedExam,
    retry: 1,
    staleTime: 0,
  });

  // Determine active exam instance
  const exam: Exam | null = React.useMemo(() => {
    if (localSeedExam) return localSeedExam;
    if (startAttemptData?.exam) {
      return startAttemptData.exam;
    }
    return null;
  }, [localSeedExam, startAttemptData]);

  // Loading state
  if (!localSeedExam && isStartingAttempt) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="size-8 text-amber animate-spin" />
        <p className="text-sm font-semibold text-text-secondary">
          Initializing exam session &amp; timer...
        </p>
      </div>
    );
  }

  // Error state / Not eligible / Not found
  if (!exam) {
    const errorMessage =
      (startError as Error & { response?: { data?: { message?: string } } })
        ?.response?.data?.message ||
      (startError as Error)?.message ||
      "This exam could not be loaded or is no longer available.";

    return (
      <div className="max-w-xl mx-auto py-16 px-6 text-center">
        <div className="p-8 rounded-3xl bg-surface border border-border shadow-xs space-y-4">
          <div className="size-14 rounded-2xl mx-auto flex items-center justify-center bg-orange-light text-orange">
            <AlertTriangle className="size-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-text-primary">
            Unable to Start Assessment
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {errorMessage}
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <Link href="/dashboard/exams">
              <Button
                variant="outline"
                className="text-xs border-border gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="size-3.5" /> Back to My Tests
              </Button>
            </Link>
            <Link href="/exams">
              <Button className="bg-amber text-white hover:bg-amber-hover text-xs cursor-pointer">
                Browse Public Practice Exams
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-border/80">
        <Link
          href="/dashboard/exams"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-amber transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back to All Assessments
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
          <ShieldCheck className="size-3.5 text-emerald" />
          <span>Auto-Graded Timed Session</span>
        </div>
      </div>

      <ExamAttemptEngine exam={exam} backHref="/dashboard/exams" />
    </div>
  );
}
