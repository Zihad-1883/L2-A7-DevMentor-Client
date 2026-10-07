"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GraduationCap,
  Plus,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  Search,
  Eye,
  Users,
  Send,
  Loader2,
  FileQuestion,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmptyState from "@/components/shared/EmptyState";
import { examService } from "@/services/exam.service";
import type { Exam, ExamStatus } from "@/types/exam.types";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export default function MentorExamsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | ExamStatus>("ALL");

  // Fetch Mentor's Exams
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["mentor", "exams", "list"],
    queryFn: () => examService.getMentorExams(1, 50),
    staleTime: 1000 * 30,
  });

  const exams: Exam[] = React.useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data]);

  // Filter exams
  const filteredExams = React.useMemo(() => {
    return exams.filter((exam) => {
      const matchesStatus =
        statusFilter === "ALL" || exam.status === statusFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exam.description &&
          exam.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesStatus && matchesSearch;
    });
  }, [exams, statusFilter, searchQuery]);

  // Metrics
  const totalExams = exams.length;
  const publishedCount = exams.filter((e) => e.status === "PUBLISHED").length;
  const draftCount = exams.filter((e) => e.status === "DRAFT").length;
  const totalAttempts = exams.reduce(
    (acc, e) => acc + (e._count?.attempts || 0),
    0
  );

  // Publish Draft Mutation
  const publishMutation = useMutation({
    mutationFn: (examId: string) => examService.publishExam(examId),
    onSuccess: (updated) => {
      toast.success(`"${updated.title}" is now published and active for students!`);
      queryClient.invalidateQueries({ queryKey: ["mentor", "exams"] });
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to publish exam.");
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* 1. Header Overview & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20">
              <GraduationCap className="size-3.5" /> Mentor Assessments Hub
            </span>
            <span className="text-xs font-semibold text-text-muted">•</span>
            <span className="text-xs text-text-muted font-medium">
              Auto-Graded Engine
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            MCQ Assessments &amp; Exams
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
            Create and manage timed multiple-choice assessments with customized scoring, choice keys, and teaching explanations. Publish to the open student catalog or restrict to your cohort programs.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link href="/mentor/exams/new">
            <Button className="bg-amber text-white hover:bg-amber-hover font-bold text-xs h-9 px-4 gap-1.5 cursor-pointer shadow-xs">
              <Plus className="size-4" /> Create New Exam
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex items-center gap-3.5 shadow-2xs">
          <div className="size-11 rounded-xl bg-amber-light text-amber flex items-center justify-center shrink-0">
            <FileQuestion className="size-5" />
          </div>
          <div>
            <span className="text-xs text-text-muted font-medium block">
              Total Created
            </span>
            <span className="text-xl sm:text-2xl font-bold text-text-primary font-serif">
              {totalExams}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex items-center gap-3.5 shadow-2xs">
          <div className="size-11 rounded-xl bg-emerald-light text-emerald flex items-center justify-center shrink-0">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <span className="text-xs text-text-muted font-medium block">
              Active Published
            </span>
            <span className="text-xl sm:text-2xl font-bold text-text-primary font-serif">
              {publishedCount}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex items-center gap-3.5 shadow-2xs">
          <div className="size-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Layers className="size-5" />
          </div>
          <div>
            <span className="text-xs text-text-muted font-medium block">
              Draft Mode
            </span>
            <span className="text-xl sm:text-2xl font-bold text-text-primary font-serif">
              {draftCount}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex items-center gap-3.5 shadow-2xs">
          <div className="size-11 rounded-xl bg-amber-50 text-amber flex items-center justify-center shrink-0">
            <Users className="size-5" />
          </div>
          <div>
            <span className="text-xs text-text-muted font-medium block">
              Student Attempts
            </span>
            <span className="text-xl sm:text-2xl font-bold text-text-primary font-serif">
              {totalAttempts}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="size-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search exams by title or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 text-xs bg-surface-raised rounded-xl"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted mr-1">
            Status:
          </span>
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${statusFilter === "ALL"
                ? "bg-amber text-white"
                : "bg-surface-raised text-text-secondary hover:text-text-primary border border-border"
              }`}
          >
            All ({totalExams})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("PUBLISHED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${statusFilter === "PUBLISHED"
                ? "bg-amber text-white"
                : "bg-surface-raised text-text-secondary hover:text-text-primary border border-border"
              }`}
          >
            Published ({publishedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("DRAFT")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${statusFilter === "DRAFT"
                ? "bg-amber text-white"
                : "bg-surface-raised text-text-secondary hover:text-text-primary border border-border"
              }`}
          >
            Drafts ({draftCount})
          </button>
        </div>
      </div>

      {/* 4. Exams Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-surface border border-border animate-pulse space-y-4"
            >
              <div className="flex justify-between">
                <div className="h-5 w-24 bg-border/80 rounded" />
                <div className="h-5 w-20 bg-border/80 rounded" />
              </div>
              <div className="h-6 w-3/4 bg-border/80 rounded" />
              <div className="h-14 w-full bg-border/50 rounded-xl" />
              <div className="h-8 w-full bg-border/40 rounded" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 rounded-3xl bg-surface border border-rose/20 text-center space-y-3">
          <AlertCircle className="size-8 text-rose mx-auto" />
          <h3 className="text-sm font-bold text-text-primary">
            Failed to load created exams
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            {error instanceof Error ? error.message : "Something went wrong fetching exams."}
          </p>
          <Button size="sm" variant="outline" onClick={() => refetch()} className="text-xs">
            Try Again
          </Button>
        </div>
      ) : filteredExams.length === 0 ? (
        <EmptyState
          title={
            searchQuery || statusFilter !== "ALL"
              ? "No assessments match your filters"
              : "No MCQ assessments created yet"
          }
          description={
            searchQuery || statusFilter !== "ALL"
              ? "Try adjusting your search keywords or resetting the status filter."
              : "Build your first timed multiple-choice exam with automated scoring and teaching feedback."
          }
          icon={GraduationCap}
          action={
            searchQuery || statusFilter !== "ALL"
              ? {
                label: "Clear All Filters",
                onClick: () => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                },
              }
              : {
                label: "Create First Exam",
                onClick: () => router.push("/mentor/exams/new"),
              }
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredExams.map((exam) => {
            const isPublished = exam.status === "PUBLISHED";
            const qCount = exam._count?.questions ?? exam.totalQuestions ?? 0;
            const attemptsCount = exam._count?.attempts ?? 0;

            return (
              <div
                key={exam.id}
                className="flex flex-col justify-between p-6 rounded-3xl bg-surface border border-border hover:border-amber/40 shadow-xs hover:shadow-md transition-all space-y-5"
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${isPublished
                            ? "bg-emerald-light text-emerald border-emerald/20"
                            : "bg-indigo-50 text-indigo-600 border-indigo-200"
                          }`}
                      >
                        {isPublished ? (
                          <>
                            <CheckCircle2 className="size-3.5" /> Published
                          </>
                        ) : (
                          <>
                            <Layers className="size-3.5" /> Draft
                          </>
                        )}
                      </span>

                      {exam.cohort ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-surface-raised border border-border text-text-primary">
                          <Layers className="size-3 text-text-muted" />
                          {exam.cohort.title}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-surface-raised border border-border text-text-primary">
                          <Sparkles className="size-3 text-amber" /> Open Catalog
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-text-muted font-medium">
                      {formatDate(exam.createdAt)}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-lg font-bold text-text-primary line-clamp-1">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                      {exam.description || "No description provided for this assessment."}
                    </p>
                  </div>

                  {/* Metadata Indicators */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-surface-raised/70 border border-border text-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-text-muted block">
                        Questions
                      </span>
                      <strong className="text-xs font-bold text-text-primary font-mono">
                        {qCount} MCQs
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-text-muted block">
                        Duration
                      </span>
                      <strong className="text-xs font-bold text-text-primary font-mono flex items-center justify-center gap-1">
                        <Clock className="size-3 text-amber" />
                        {exam.durationMinutes}m
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-text-muted block">
                        Pass Mark
                      </span>
                      <strong className="text-xs font-bold text-emerald font-mono">
                        {exam.passMark || 70}%
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-border/70 flex items-center justify-between">
                  <div className="text-xs text-text-muted flex items-center gap-1.5">
                    <Users className="size-3.5 text-text-muted" />
                    <span>
                      <strong className="text-text-primary font-semibold">
                        {attemptsCount}
                      </strong>{" "}
                      Student {attemptsCount === 1 ? "Attempt" : "Attempts"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isPublished && (
                      <Button
                        size="sm"
                        onClick={() => {
                          if (qCount === 0) {
                            toast.error(
                              "Cannot publish an exam with 0 questions. Please add questions first."
                            );
                            return;
                          }
                          publishMutation.mutate(exam.id);
                        }}
                        disabled={publishMutation.isPending || qCount === 0}
                        title={
                          qCount === 0
                            ? "Cannot publish an exam with 0 questions"
                            : "Publish exam for students"
                        }
                        className={`font-semibold text-xs h-8 px-3 gap-1.5 shadow-2xs ${qCount === 0
                            ? "bg-surface-raised text-text-muted border border-border cursor-not-allowed opacity-60"
                            : "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                          }`}
                      >
                        {publishMutation.isPending ? (
                          <>
                            <Loader2 className="size-3 animate-spin" /> Publishing...
                          </>
                        ) : (
                          <>
                            <Send className="size-3" /> Publish Now
                          </>
                        )}
                      </Button>
                    )}

                    <Link href={`/exams/${exam.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-8 px-3 gap-1.5 border-border bg-surface hover:bg-surface-raised cursor-pointer"
                      >
                        <Eye className="size-3.5 text-text-muted" />
                        <span>Preview</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
