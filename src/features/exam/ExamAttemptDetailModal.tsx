"use client";

import * as React from "react";
import Link from "next/link";
import {
  X,
  Award,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  RotateCcw,
  GraduationCap,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExamAttempt } from "@/types/exam.types";
import { formatDate } from "@/lib/utils";

interface ExamAttemptDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  attempt: ExamAttempt | null;
  allAttempts?: ExamAttempt[];
}

export default function ExamAttemptDetailModal({
  isOpen,
  onClose,
  attempt,
  allAttempts = [],
}: ExamAttemptDetailModalProps) {
  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !attempt) return null;

  const examTitle = attempt.exam?.title || "Engineering Skill Assessment";
  const mentorName = attempt.exam?.mentor?.name || "DevMentor Engineering Faculty";
  const passMark = attempt.exam?.passMark ?? 65;
  const totalMarks = attempt.exam?.totalMarks || 100;
  const isPassed = attempt.isPassed;
  const percentage = Math.round(attempt.percentage);

  // Find other attempts for the exact same exam to show progress comparison
  const relatedAttempts = allAttempts
    .filter((a) => a.examId === attempt.examId)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

  const dateFormatted = attempt.submittedAt
    ? formatDate(attempt.submittedAt)
    : formatDate(attempt.startedAt);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-surface border border-border/80 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div
          className={`h-2 w-full ${isPassed
              ? "bg-linear-to-r from-emerald via-emerald-hover to-teal-500"
              : "bg-linear-to-r from-orange via-terracotta to-amber"
            }`}
        />

        {/* Modal Header */}
        <div className="p-6 pb-4 flex items-start justify-between gap-4 border-b border-border/60">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-raised border border-border text-text-muted">
              <GraduationCap className="size-3 text-amber" /> Assessment Report
            </div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-text-primary leading-snug">
              {examTitle}
            </h2>
            <p className="text-xs text-text-muted">Curated by {mentorName}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[calc(85vh-140px)] overflow-y-auto">
          {/* Main Score Result Card */}
          <div
            className={`p-6 rounded-2xl border text-center relative overflow-hidden ${isPassed
                ? "bg-emerald-light/40 border-emerald/30 text-emerald"
                : "bg-orange/5 border-orange/20 text-orange"
              }`}
          >
            <div className="size-14 rounded-2xl mx-auto mb-3 flex items-center justify-center bg-surface shadow-xs">
              {isPassed ? (
                <CheckCircle2 className="size-8 text-emerald" />
              ) : (
                <XCircle className="size-8 text-orange" />
              )}
            </div>

            <span
              className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border inline-block mb-2 ${isPassed
                  ? "bg-emerald-light text-emerald border-emerald/30"
                  : "bg-orange-light text-orange border-orange/30"
                }`}
            >
              {isPassed ? "PASSED ASSESSMENT" : "NEEDS PRACTICE"}
            </span>

            <p className="text-xs text-text-secondary max-w-sm mx-auto mb-5">
              {isPassed
                ? `You met the benchmark requirement of ${passMark}% for this technical assessment.`
                : `You scored ${percentage}%, below the ${passMark}% pass threshold. We encourage retaking the test to solidify concepts.`}
            </p>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-3 gap-3 bg-surface p-4 rounded-xl border border-border/80 shadow-2xs text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-text-muted block">
                  Score
                </span>
                <span className="font-serif text-lg sm:text-xl font-bold text-text-primary">
                  {attempt.score} <span className="text-xs font-normal text-text-muted">/ {totalMarks}</span>
                </span>
              </div>

              <div className="border-x border-border/80 px-2">
                <span className="text-[10px] uppercase font-bold text-text-muted block">
                  Accuracy
                </span>
                <span
                  className={`font-serif text-lg sm:text-xl font-bold ${isPassed ? "text-emerald" : "text-orange"
                    }`}
                >
                  {percentage}%
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-text-muted block">
                  Cutoff
                </span>
                <span className="font-serif text-lg sm:text-xl font-bold text-text-primary">
                  {passMark}%
                </span>
              </div>
            </div>
          </div>

          {/* Test Metadata details */}
          <div className="p-4 rounded-xl bg-surface-raised/70 border border-border/80 flex items-center justify-between text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-text-muted" /> Completed {dateFormatted}
            </span>
          </div>

          {/* Past Attempts Comparison Timeline (if attempted > 1 time) */}
          {relatedAttempts.length > 1 && (
            <div className="space-y-2.5 pt-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <TrendingUp className="size-3.5 text-amber" /> Attempt History ({relatedAttempts.length} total)
              </h4>
              <div className="space-y-2">
                {relatedAttempts.map((item, idx) => {
                  const isCurrent = item.id === attempt.id;
                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${isCurrent
                          ? "bg-amber-light/30 border-amber/40 shadow-2xs"
                          : "bg-surface-raised/40 border-border/60 text-text-muted"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[11px] text-text-secondary">
                          Attempt #{relatedAttempts.length - idx}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber text-white">
                            Viewing
                          </span>
                        )}
                        <span className="text-[11px] text-text-muted">
                          {formatDate(item.startedAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text-primary">
                          {Math.round(item.percentage)}%
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.isPassed
                              ? "bg-emerald-light text-emerald"
                              : "bg-orange-light text-orange"
                            }`}
                        >
                          {item.isPassed ? "PASS" : "FAIL"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 pt-4 border-t border-border/60 bg-surface-raised/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto text-xs border-border cursor-pointer"
          >
            Close
          </Button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <Link
              href={`/dashboard/exams/${attempt.examId}/attempt`}
              className="w-full sm:w-auto"
            >
              <Button
                type="button"
                className="w-full sm:w-auto bg-amber text-white hover:bg-amber-hover text-xs font-semibold gap-1.5 shadow-xs cursor-pointer"
              >
                <RotateCcw className="size-3.5" /> Retake Assessment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
