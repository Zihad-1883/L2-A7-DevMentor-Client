"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ShieldCheck, Loader2, AlertTriangle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/components/providers/AuthProvider";
import ExamAttemptEngine from "@/features/exam/ExamAttemptEngine";
import { SEED_EXAMS } from "@/features/exam/seedExams";
import { examService } from "@/services/exam.service";
import type { Exam } from "@/types/exam.types";

export default function ExamAttemptPage() {
  const params = useParams();
  const examId = typeof params?.id === "string" ? params.id : "";

  // 1. Check local seed exams
  const localSeedExam = React.useMemo(() => {
    return SEED_EXAMS.find((e) => e.id === examId) || null;
  }, [examId]);

  // 2. Query server for live DB exams via authenticated endpoint
  const {
    data: startAttemptData,
    isLoading: isStartingAttempt,
    error: startError,
  } = useQuery({
    queryKey: ["public", "start-exam", examId],
    queryFn: async () => {
      return await examService.startExamAttempt(examId);
    },
    enabled: Boolean(examId) && !localSeedExam,
    retry: 1,
    staleTime: 0,
  });

  const exam: Exam | null = React.useMemo(() => {
    if (localSeedExam) return localSeedExam;
    if (startAttemptData?.exam) {
      return startAttemptData.exam;
    }
    return null;
  }, [localSeedExam, startAttemptData]);

  const { user } = useAuthContext();
  const isMentor = user?.role === "mentor";

  if (isMentor) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-surface border border-border shadow-xs text-center space-y-4">
          <div className="size-14 rounded-2xl mx-auto flex items-center justify-center bg-amber-light text-amber">
            <ShieldAlert className="size-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-text-primary">
            Mentor Access Notice
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Exam attempts are strictly reserved for students. Mentors can preview assessment structures and curricula from the Mentor Studio.
          </p>
          <div className="pt-2">
            <Link href="/mentor/exams">
              <Button className="w-full bg-amber text-white hover:bg-amber-hover font-semibold cursor-pointer">
                Return to Mentor Studio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!localSeedExam && isStartingAttempt) {
    return (
      <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="size-8 text-amber animate-spin" />
        <p className="text-sm font-semibold text-text-secondary">
          Initializing assessment engine...
        </p>
      </div>
    );
  }

  if (!exam) {
    const errorMessage =
      (startError as Error & { response?: { data?: { message?: string } } })
        ?.response?.data?.message ||
      (startError as Error)?.message ||
      "This exam could not be loaded or requires student authentication.";

    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-surface border border-border shadow-xs text-center space-y-4">
          <div className="size-14 rounded-2xl mx-auto flex items-center justify-center bg-orange-light text-orange">
            <AlertTriangle className="size-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-text-primary">
            Unable to Start Exam
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {errorMessage}
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <Link href="/exams">
              <Button variant="outline" className="text-xs border-border gap-1.5 cursor-pointer">
                <ArrowLeft className="size-3.5" /> Back to Practice Catalog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Top Banner Navigation */}
      <div className="w-full border-b border-border/80 bg-surface">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href={`/exams/${exam.id}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-amber transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Back to Exam Overview
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
            <ShieldCheck className="size-3.5 text-emerald" />
            <span>Anti-Cheat Timed Engine</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 sm:py-12">
        <ExamAttemptEngine exam={exam} backHref={`/exams/${exam.id}`} />
      </div>
    </div>
  );
}
