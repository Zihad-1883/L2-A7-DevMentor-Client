"use client";

import * as React from "react";
import Link from "next/link";
import {
  Clock,
  HelpCircle,
  Award,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExamTimer } from "@/hooks/useExamTimer";
import ExamResultCard from "@/features/exam/ExamResultCard";
import { examService, type ExamSubmitResult } from "@/services/exam.service";
import type { Exam, Question } from "@/types/exam.types";

interface ExamAttemptEngineProps {
  exam: Exam;
}

export default function ExamAttemptEngine({ exam }: ExamAttemptEngineProps) {
  const questions: Question[] = exam.questions || [];
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<
    Record<string, number>
  >({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<ExamSubmitResult | null>(null);

  const currentQuestion = questions[currentIdx];

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleSubmit = React.useCallback(async () => {
    if (isSubmitting || result) return;
    setIsSubmitting(true);

    try {
      const payload = questions.map((q) => ({
        questionId: q.id,
        selectedOption: selectedAnswers[q.id] ?? -1,
      }));

      // Try server submit if authenticated
      try {
        const res = await examService.submitExamAttempt(exam.id, payload);
        if (res && res.attemptId) {
          setResult(res);
          setIsSubmitting(false);
          return;
        }
      } catch {
        // Fallback to client-side scoring for public tests / seed exams
      }

      // Client auto-evaluation fallback
      let earnedMarks = 0;
      const breakdown = questions.map((q) => {
        const selected = selectedAnswers[q.id] ?? -1;
        const correct = q.correctOptionIndex ?? 0;
        const isCorrect = selected === correct;
        if (isCorrect) earnedMarks += q.marks || 1;

        return {
          questionId: q.id,
          questionText: q.questionText,
          options: q.options,
          selectedOption: selected,
          correctOptionIndex: correct,
          isCorrect,
          marksEarned: isCorrect ? q.marks || 1 : 0,
          totalMarks: q.marks || 1,
          explanation: q.explanation || null,
        };
      });

      const totalPossible = questions.reduce(
        (sum, q) => sum + (q.marks || 1),
        0
      );
      const percentage =
        totalPossible > 0
          ? Math.round((earnedMarks / totalPossible) * 100 * 10) / 10
          : 0;
      const passCutoff = exam.passMark ?? 60;

      setResult({
        attemptId: `attempt-local-${Date.now()}`,
        score: earnedMarks,
        totalMarks: totalPossible,
        percentage,
        passMark: passCutoff,
        isPassed: percentage >= passCutoff,
        submittedAt: new Date().toISOString(),
        breakdown,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [exam.id, exam.passMark, isSubmitting, questions, result, selectedAnswers]);

  // Timer countdown
  const { formattedTime, isLowTime, stop } = useExamTimer({
    durationMinutes: exam.durationMinutes || 20,
    onTimeUp: () => {
      handleSubmit();
    },
  });

  if (result) {
    return (
      <ExamResultCard
        result={result}
        examTitle={exam.title}
        onRetake={() => {
          setResult(null);
          setSelectedAnswers({});
          setCurrentIdx(0);
        }}
      />
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20 bg-surface rounded-3xl border border-border p-8">
        <AlertTriangle className="size-12 text-amber mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-text-primary mb-2">
          No Questions Available Yet
        </h2>
        <p className="text-sm text-text-secondary max-w-md mx-auto mb-6">
          The instructor has not added questions to this test track yet. Please check back shortly.
        </p>
        <Link href={`/exams/${exam.id}`}>
          <Button variant="outline" className="border-border">
            <ArrowLeft className="size-4 mr-2" /> Back to Exam Overview
          </Button>
        </Link>
      </div>
    );
  }

  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="space-y-6">
      {/* Top sticky test control header */}
      <div className="sticky top-24 z-20 bg-surface/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-border shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/exams/${exam.id}`}
            className="text-xs font-semibold text-text-muted hover:text-amber hidden sm:flex items-center gap-1"
          >
            <ArrowLeft className="size-3.5" /> Exit
          </Link>
          <div className="min-w-0">
            <h2 className="font-serif text-sm sm:text-base font-bold text-text-primary truncate">
              {exam.title}
            </h2>
            <p className="text-[11px] text-text-muted">
              Question {currentIdx + 1} of {questions.length} · {answeredCount} answered
            </p>
          </div>
        </div>

        {/* Timer pill */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider border shadow-2xs ${
            isLowTime
              ? "bg-orange/10 text-orange border-orange/30 animate-pulse"
              : "bg-surface-raised text-text-primary border-border"
          }`}
        >
          <Clock className="size-3.5" />
          <span>{formattedTime}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-surface-raised h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-amber h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="p-7 sm:p-9 rounded-3xl bg-surface border border-border shadow-xs space-y-6">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-xs font-bold text-text-muted px-2.5 py-1 rounded-md bg-surface-raised">
            QUESTION {currentIdx + 1}
          </span>
          <span className="text-xs text-text-muted">
            {currentQuestion.marks} Mark{currentQuestion.marks > 1 ? "s" : ""}
          </span>
        </div>

        <p className="font-serif text-lg sm:text-xl font-bold text-text-primary leading-relaxed">
          {currentQuestion.questionText}
        </p>

        {/* Options Selection */}
        <div className="space-y-3 pt-2">
          {currentQuestion.options.map((opt, optIdx) => {
            const isSelected = selectedAnswers[currentQuestion.id] === optIdx;

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? "border-amber bg-amber/5 text-text-primary shadow-xs"
                    : "border-border hover:border-text-muted/60 bg-surface text-text-secondary hover:text-text-primary"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`size-7 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-colors shrink-0 ${
                      isSelected
                        ? "bg-amber text-white border-amber"
                        : "bg-surface-raised border-border text-text-muted"
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <span className="text-sm font-medium leading-relaxed">{opt}</span>
                </div>

                {isSelected && (
                  <CheckCircle2 className="size-4 text-amber shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Footbar */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <Button
          variant="outline"
          onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="border-border text-xs gap-1.5"
        >
          <ChevronLeft className="size-4" /> Previous
        </Button>

        {/* Question bubble jump list (desktop) */}
        <div className="hidden md:flex items-center gap-1.5">
          {questions.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isCurrent = idx === currentIdx;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`size-8 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-text-primary text-surface shadow-xs"
                    : isAnswered
                    ? "bg-amber-light text-amber border border-amber/30"
                    : "bg-surface-raised text-text-muted hover:text-text-primary border border-border"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {currentIdx < questions.length - 1 ? (
          <Button
            onClick={() => setCurrentIdx((prev) => prev + 1)}
            className="bg-amber text-white hover:bg-amber-hover text-xs gap-1.5"
          >
            Next <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-emerald text-white hover:bg-emerald/90 text-xs gap-1.5 font-bold shadow-xs"
          >
            <Send className="size-3.5" />
            {isSubmitting ? "Evaluating..." : "Submit Exam"}
          </Button>
        )}
      </div>
    </div>
  );
}
