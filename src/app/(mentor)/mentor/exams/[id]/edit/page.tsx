"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ExamBuilderForm from "@/features/exam/ExamBuilderForm";
import { examService } from "@/services/exam.service";

export default function EditExamPage() {
  const params = useParams();
  const examId = typeof params?.id === "string" ? params.id : "";

  const {
    data: exam,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["exams", "detail", examId],
    queryFn: () => examService.getExamById(examId),
    enabled: Boolean(examId),
    staleTime: 1000 * 30,
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="size-8 text-amber animate-spin" />
        <p className="text-sm font-semibold text-text-secondary">
          Loading assessment workspace...
        </p>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="p-8 rounded-3xl bg-surface border border-border shadow-xs space-y-3">
          <AlertCircle className="size-10 text-orange mx-auto" />
          <h2 className="font-serif text-xl font-bold text-text-primary">
            Assessment Not Found
          </h2>
          <p className="text-xs text-text-secondary">
            {error instanceof Error
              ? error.message
              : "This exam does not exist or was removed."}
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => refetch()}
              className="text-xs border-border"
            >
              Retry
            </Button>
            <Link href="/mentor/exams">
              <Button size="sm" className="bg-amber text-white text-xs">
                Back to Assessments
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/mentor/exams"
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-amber transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Assessments
        </Link>

        <span className="text-xs text-text-muted font-mono">
          Status: <strong className="text-text-primary uppercase">{exam.status}</strong>
        </span>
      </div>

      {/* Main Assessment Builder Form in Edit Mode */}
      <ExamBuilderForm key={exam.id} initialExam={exam} isEditMode={true} />
    </div>
  );
}
