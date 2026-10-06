"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  GraduationCap,
  Sparkles,
  Search,
  Clock,
  HelpCircle,
  Award,
  ArrowRight,
  TrendingUp,
  History,
  CheckCircle2,
  XCircle,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { examService } from "@/services/exam.service";
import { SEED_EXAMS } from "@/features/exam/seedExams";
import ExamAttemptDetailModal from "@/features/exam/ExamAttemptDetailModal";
import type { Exam, ExamAttempt } from "@/types/exam.types";
import { formatDate } from "@/lib/utils";

export default function StudentExamsPage() {
  const [activeTab, setActiveTab] = React.useState<"available" | "history">("available");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedAttempt, setSelectedAttempt] = React.useState<ExamAttempt | null>(null);

  // 1. Fetch available exams
  const { data: examsData, isLoading: isExamsLoading } = useQuery({
    queryKey: ["student", "available-exams"],
    queryFn: () => examService.getAvailableExams(1, 30),
    staleTime: 1000 * 60,
  });

  // 2. Fetch student's attempt history
  const { data: attemptsData, isLoading: isAttemptsLoading } = useQuery({
    queryKey: ["student", "my-attempts"],
    queryFn: () => examService.getStudentAttempts(1, 30),
    staleTime: 1000 * 30,
  });

  // Merge backend exams with SEED_EXAMS so mock/seed tests always remain available
  const availableExams = React.useMemo(() => {
    const remote = examsData?.data ?? [];
    const remoteIds = new Set(remote.map((r) => r.id));
    const nonDuplicatedSeeds = SEED_EXAMS.filter((s) => !remoteIds.has(s.id));
    return [...remote, ...nonDuplicatedSeeds];
  }, [examsData]);

  const myAttempts: ExamAttempt[] = attemptsData?.data ?? [];

  const filteredExams = availableExams.filter((e) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      e.title.toLowerCase().includes(q) ||
      (e.category && e.category.toLowerCase().includes(q)) ||
      (e.techStackTags && e.techStackTags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  const passedCount = myAttempts.filter((a) => a.isPassed).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20 mb-2">
            <Sparkles className="size-3.5" /> Skill Benchmarking
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            MCQ Assessments &amp; Skill Tests
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-xl">
            Demonstrate your engineering proficiency in modern stacks. Partake in timed, auto-graded MCQ tests or review past score reports.
          </p>
        </div>

        {/* Quick summary metric pills */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-surface border border-border text-center shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-text-muted block">Tests Taken</span>
            <span className="font-serif text-lg font-bold text-text-primary">{myAttempts.length}</span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-emerald-light/40 border border-emerald/30 text-center shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-emerald block">Passed</span>
            <span className="font-serif text-lg font-bold text-emerald">{passedCount}</span>
          </div>
        </div>
      </div>

      {/* Tabs navigation & live search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-surface-raised/80 rounded-2xl border border-border/80 self-start">
          <button
            type="button"
            onClick={() => setActiveTab("available")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "available"
              ? "bg-surface text-amber shadow-xs"
              : "text-text-muted hover:text-text-primary"
              }`}
          >
            Available Tests ({availableExams.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "history"
              ? "bg-surface text-amber shadow-xs"
              : "text-text-muted hover:text-text-primary"
              }`}
          >
            My Attempt History ({myAttempts.length})
          </button>
        </div>

        {activeTab === "available" && (
          <div className="relative max-w-xs w-full">
            <Search className="size-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter by title, stack, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-surface border border-border focus:outline-hidden focus:border-amber transition-colors"
            />
          </div>
        )}
      </div>

      {/* Tab 1: Available Exams Catalog */}
      {activeTab === "available" && (
        <div>
          {isExamsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-56 rounded-2xl bg-surface-raised/40 border border-border animate-pulse" />
              ))}
            </div>
          ) : filteredExams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredExams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-6 rounded-2xl bg-surface border border-border hover:border-amber/40 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-raised text-text-muted border border-border">
                        {exam.category || "Engineering"}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${exam.isFree
                          ? "bg-emerald-light text-emerald border-emerald/20"
                          : "bg-amber-light text-amber border-amber/20"
                          }`}
                      >
                        {exam.isFree ? "Free Practice" : "Cohort Exam"}
                      </span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-text-primary group-hover:text-amber transition-colors line-clamp-2">
                      {exam.title}
                    </h3>

                    <p className="text-xs text-text-secondary line-clamp-2">
                      {exam.description || "Timed multiple-choice evaluation."}
                    </p>

                    {/* Metadata specs */}
                    <div className="flex items-center gap-4 text-xs text-text-muted pt-2 border-t border-border/60">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5 text-amber" /> {exam.durationMinutes}m
                      </span>
                      <span className="flex items-center gap-1">
                        <HelpCircle className="size-3.5 text-amber" /> {exam.totalQuestions} MCQs
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="size-3.5 text-emerald" /> {exam.passMark || 65}% Pass
                      </span>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-border/60 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-text-muted truncate max-w-[120px]">
                      By {exam.mentor?.name || "DevMentor"}
                    </span>
                    <Link href={`/dashboard/exams/${exam.id}/attempt`}>
                      <Button size="sm" className="bg-amber text-white hover:bg-amber-hover text-xs font-semibold gap-1.5 cursor-pointer">
                        Start Exam <ArrowRight className="size-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface-raised/30 rounded-2xl border border-dashed border-border p-6">
              <GraduationCap className="size-10 text-text-muted mx-auto mb-3 opacity-50" />
              <p className="text-sm font-semibold text-text-primary">No assessments matching search</p>
              <p className="text-xs text-text-muted mt-1">Try another search keyword or clear filters.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Student Attempt History */}
      {activeTab === "history" && (
        <div>
          {isAttemptsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-surface-raised/40 border border-border animate-pulse" />
              ))}
            </div>
          ) : myAttempts.length > 0 ? (
            <div className="space-y-3">
              {myAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  onClick={() => setSelectedAttempt(attempt)}
                  className="p-4 rounded-2xl bg-surface border border-border hover:border-amber/40 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-text-primary group-hover:text-amber transition-colors">
                        {attempt.exam?.title || "MCQ Assessment"}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${attempt.isPassed
                          ? "bg-emerald-light text-emerald border-emerald/30"
                          : "bg-orange-light text-orange border-orange/30"
                          }`}
                      >
                        {attempt.isPassed ? "PASSED" : "FAILED"}
                      </span>
                    </div>

                    <p className="text-xs text-text-muted flex items-center gap-3">
                      <span>Completed {formatDate(attempt.startedAt)}</span>
                      <span>•</span>
                      <span>Pass Cutoff: {attempt.exam?.passMark || 65}%</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="font-serif text-lg font-bold text-text-primary block">
                        {attempt.score} <span className="text-xs font-normal text-text-muted">/ {attempt.exam?.totalMarks || 100}</span>
                      </span>
                      <span className="text-xs font-semibold text-text-muted">
                        Accuracy: {Math.round(attempt.percentage)}%
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-8 gap-1.5 border-border group-hover:border-amber/40"
                    >
                      <span>View Breakdown</span>
                      <ExternalLink className="size-3 text-text-muted group-hover:text-amber" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface-raised/30 rounded-2xl border border-dashed border-border p-6">
              <GraduationCap className="size-10 text-text-muted mx-auto mb-3 opacity-50" />
              <p className="text-sm font-semibold text-text-primary">No assessment history yet</p>
              <p className="text-xs text-text-muted mt-1 mb-4">
                You haven&apos;t taken any MCQ skill tests yet. Browse available tests above to get started.
              </p>
              <Button
                size="sm"
                onClick={() => setActiveTab("available")}
                className="bg-amber text-white hover:bg-amber-hover text-xs"
              >
                Explore Available Tests
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Reusable Score Breakdown & Retake Modal */}
      <ExamAttemptDetailModal
        isOpen={Boolean(selectedAttempt)}
        onClose={() => setSelectedAttempt(null)}
        attempt={selectedAttempt}
        allAttempts={myAttempts}
      />
    </div>
  );
}
