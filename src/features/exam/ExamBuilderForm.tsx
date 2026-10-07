"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Sparkles,
  Clock,
  Award,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Sliders,
  Send,
  Save,
  GraduationCap,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QuestionBuilder from "@/features/exam/QuestionBuilder";
import { examService } from "@/services/exam.service";
import { cohortService } from "@/services/cohort.service";
import type { QuestionItemFormData } from "@/lib/validations/exam.schema";
import { toast } from "sonner";

export default function ExamBuilderForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Basic Exam Details State
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [durationMinutes, setDurationMinutes] = React.useState<number>(30);
  const [passMark, setPassMark] = React.useState<number>(70);
  const [accessMode, setAccessMode] = React.useState<"free" | "cohort">("free");
  const [selectedCohortId, setSelectedCohortId] = React.useState<string>("");

  // Questions State
  const [questions, setQuestions] = React.useState<QuestionItemFormData[]>([
    {
      questionText:
        "What is the primary benefit of React Server Components (RSC) compared to traditional client rendering?",
      options: [
        "Zero bundle size for server dependencies and direct access to backend resources",
        "Automatic conversion of all client components into static HTML files",
        "Eliminates the requirement for HTTP cookies or tokens",
        "Replaces JavaScript with WebAssembly for DOM manipulation",
      ],
      correctOptionIndex: 0,
      explanation:
        "RSC executes solely on the server, reducing the client JavaScript bundle size and allowing direct access to databases without API routes.",
      marks: 1,
    },
    {
      questionText:
        "In TypeScript, what is the distinction between 'unknown' and 'any'?",
      options: [
        "'unknown' is type-safe and requires type narrowing before operations, while 'any' disables type checking completely",
        "'unknown' cannot be assigned to any variable, while 'any' can only hold primitive values",
        "'unknown' is only valid in interface declarations, while 'any' is for classes",
        "There is no difference; they are exact aliases in TypeScript compiler",
      ],
      correctOptionIndex: 0,
      explanation:
        "'unknown' enforces type checks and narrowing before you can invoke methods or access properties on it, maintaining compile-time safety.",
      marks: 1,
    },
  ]);

  // Validation Errors State
  const [formErrors, setFormErrors] = React.useState<{
    title?: string;
    duration?: string;
    passMark?: string;
    questions?: Record<number, Partial<Record<keyof QuestionItemFormData, string>>>;
  }>({});

  // Fetch Mentor's Cohorts (to optionally attach exam)
  const { data: cohorts = [] } = useQuery({
    queryKey: ["mentor", "cohorts", "my-created"],
    queryFn: async () => {
      try {
        return await cohortService.getMyCreatedCohorts();
      } catch {
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  // Calculate live exam stats
  const totalQuestions = questions.length;
  const totalMarks = questions.reduce((acc, q) => acc + (q.marks || 1), 0);
  const minsPerQuestion =
    totalQuestions > 0 ? (durationMinutes / totalQuestions).toFixed(1) : "0";

  // Validate entire builder
  const validateForm = (): boolean => {
    const errors: typeof formErrors = {};
    let isValid = true;

    if (!title.trim() || title.trim().length < 3) {
      errors.title = "Exam title must be at least 3 characters long.";
      isValid = false;
    } else if (title.trim().length > 150) {
      errors.title = "Exam title cannot exceed 150 characters.";
      isValid = false;
    }

    if (!durationMinutes || durationMinutes < 5 || durationMinutes > 300) {
      errors.duration = "Duration must be between 5 and 300 minutes.";
      isValid = false;
    }

    if (!passMark || passMark < 1 || passMark > 100) {
      errors.passMark = "Pass mark percentage must be between 1% and 100%.";
      isValid = false;
    }

    const questionErrors: Record<
      number,
      Partial<Record<keyof QuestionItemFormData, string>>
    > = {};

    questions.forEach((q, idx) => {
      const qErr: Partial<Record<keyof QuestionItemFormData, string>> = {};

      if (!q.questionText.trim() || q.questionText.trim().length < 5) {
        qErr.questionText = "Question text must be at least 5 characters.";
        isValid = false;
      }

      if (q.options.length < 2) {
        qErr.options = "Question must have at least 2 choices.";
        isValid = false;
      } else {
        const hasEmptyOption = q.options.some((opt) => !opt.trim());
        if (hasEmptyOption) {
          qErr.options = "All choice options must have text.";
          isValid = false;
        }
      }

      if (
        q.correctOptionIndex < 0 ||
        q.correctOptionIndex >= q.options.length
      ) {
        qErr.correctOptionIndex = "Invalid correct choice index.";
        isValid = false;
      }

      if (Object.keys(qErr).length > 0) {
        questionErrors[idx] = qErr;
      }
    });

    if (Object.keys(questionErrors).length > 0) {
      errors.questions = questionErrors;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Mutation: Create & Save Exam (Draft or Publish)
  const [isPublishing, setIsPublishing] = React.useState(false);

  const saveExamMutation = useMutation({
    mutationFn: async ({ publish }: { publish: boolean }) => {
      // 1. Create Base Exam
      const createdExam = await examService.createExam({
        title: title.trim(),
        description: description.trim() || undefined,
        durationMinutes,
        totalMarks: totalMarks >= 5 ? totalMarks : undefined,
        passMark,
        isFree: accessMode === "free",
        cohortId: accessMode === "cohort" ? selectedCohortId || undefined : undefined,
      });

      if (!createdExam?.id) {
        throw new Error("Failed to initialize exam record");
      }

      // 2. Add Questions to Exam
      await examService.addQuestionsToExam(
        createdExam.id,
        questions.map((q) => ({
          questionText: q.questionText.trim(),
          options: q.options.map((opt) => opt.trim()),
          correctOptionIndex: q.correctOptionIndex,
          explanation: q.explanation?.trim() || undefined,
          marks: q.marks || 1,
        }))
      );

      // 3. Publish Exam if requested
      if (publish) {
        await examService.publishExam(createdExam.id);
      }

      return { exam: createdExam, published: publish };
    },
    onSuccess: ({ published }) => {
      queryClient.invalidateQueries({ queryKey: ["mentor", "exams"] });
      queryClient.invalidateQueries({ queryKey: ["exams"] });

      if (published) {
        toast.success(
          "Exam created and published successfully! Students can now take this assessment."
        );
      } else {
        toast.success("Exam saved as DRAFT. You can publish it anytime.");
      }

      router.push("/mentor/exams");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create exam. Please check all fields.");
    },
  });

  const handleSubmit = (publish: boolean) => {
    if (!validateForm()) {
      toast.error(
        "Please fix the validation errors in your exam configuration and questions."
      );
      return;
    }
    setIsPublishing(publish);
    saveExamMutation.mutate({ publish });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(false);
      }}
      className="space-y-8 max-w-5xl mx-auto pb-16"
    >
      {/* 1. Header Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20">
            <Sparkles className="size-3.5" /> MCQ Assessment Studio
          </span>
          <span className="text-xs font-semibold text-text-muted">•</span>
          <span className="text-xs text-text-muted font-medium">
            Auto-Graded Engine
          </span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
          Create Custom Technical Exam
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
          Construct timed multiple-choice assessments with customized scoring, choice keys, and teaching explanations. Publish to the open student catalog or restrict to your cohort programs.
        </p>
      </div>

      {/* 2. Core Exam Configuration Details */}
      <div className="p-6 sm:p-7 rounded-3xl bg-surface border border-border shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-border/70">
          <Sliders className="size-4 text-amber" />
          <h3 className="text-sm font-bold font-serif text-text-primary uppercase tracking-wider">
            1. Exam Metadata &amp; Rules
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Exam Title */}
          <div className="md:col-span-8 space-y-1.5">
            <label className="text-xs font-bold text-text-primary flex items-center gap-1.5">
              <FileText className="size-3.5 text-amber" /> Exam Title{" "}
              <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (formErrors.title) {
                  setFormErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              placeholder="e.g. Modern React & Next.js Architecture Mastery Exam"
              className={`h-11 text-xs bg-surface-raised rounded-2xl ${
                formErrors.title ? "border-rose-400" : "border-border"
              }`}
            />
            {formErrors.title ? (
              <p className="text-[11px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="size-3" /> {formErrors.title}
              </p>
            ) : (
              <p className="text-[11px] text-text-muted">
                Catchy and descriptive title for students (3-150 characters).
              </p>
            )}
          </div>

          {/* Duration Minutes */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-text-primary flex items-center gap-1.5">
              <Clock className="size-3.5 text-amber" /> Time Limit (Minutes){" "}
              <span className="text-rose-500">*</span>
            </label>
            <Input
              type="number"
              min={5}
              max={300}
              value={durationMinutes}
              onChange={(e) =>
                setDurationMinutes(Math.max(5, parseInt(e.target.value) || 5))
              }
              className="h-11 text-xs font-mono font-bold bg-surface-raised rounded-2xl border-border"
            />
            <p className="text-[11px] text-text-muted">
              Auto-submits when countdown timer reaches 00:00.
            </p>
          </div>

          {/* Description */}
          <div className="md:col-span-12 space-y-1.5">
            <label className="text-xs font-bold text-text-primary">
              Exam Instructions &amp; Overview (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, required prerequisites, or rules for students before they begin..."
              className="w-full p-3 rounded-2xl bg-surface-raised border border-border text-xs text-text-primary leading-relaxed placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-amber/50 resize-y"
            />
          </div>

          {/* Passing Percentage & Access Control */}
          <div className="md:col-span-6 space-y-1.5">
            <label className="text-xs font-bold text-text-primary flex items-center gap-1.5">
              <Percent className="size-3.5 text-amber" /> Passing Grade Threshold
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={40}
                max={90}
                step={5}
                value={passMark}
                onChange={(e) => setPassMark(parseInt(e.target.value))}
                className="flex-1 accent-amber"
              />
              <span className="px-3 py-1 rounded-xl bg-surface-raised border border-border font-mono font-bold text-xs text-text-primary min-w-[55px] text-center">
                {passMark}%
              </span>
            </div>
            <p className="text-[11px] text-text-muted">
              Students scoring ≥ {passMark}% will receive a verified pass credential.
            </p>
          </div>

          {/* Access Control (Free vs Cohort Restricted) */}
          <div className="md:col-span-6 space-y-1.5">
            <label className="text-xs font-bold text-text-primary flex items-center gap-1.5">
              <GraduationCap className="size-3.5 text-amber" /> Catalog Access
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAccessMode("free")}
                className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  accessMode === "free"
                    ? "bg-amber text-white border-amber shadow-2xs"
                    : "bg-surface-raised border-border text-text-secondary hover:text-text-primary"
                }`}
              >
                <CheckCircle2 className="size-3.5" /> Open / Public (Free)
              </button>

              <button
                type="button"
                onClick={() => setAccessMode("cohort")}
                className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  accessMode === "cohort"
                    ? "bg-amber text-white border-amber shadow-2xs"
                    : "bg-surface-raised border-border text-text-secondary hover:text-text-primary"
                }`}
              >
                <Layers className="size-3.5" /> Cohort Exclusive
              </button>
            </div>

            {accessMode === "cohort" && (
              <div className="pt-2">
                <select
                  value={selectedCohortId}
                  onChange={(e) => setSelectedCohortId(e.target.value)}
                  className="w-full h-9 px-3 text-xs bg-surface-raised border border-border rounded-xl text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-amber/50 cursor-pointer"
                >
                  <option value="">Select one of your cohort programs...</option>
                  {cohorts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Live Assessment Configuration HUD Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
            Questions Count
          </span>
          <span className="text-xl sm:text-2xl font-bold font-serif text-text-primary">
            {totalQuestions} MCQs
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
            Total Points
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold font-serif text-amber">
              {totalMarks}
            </span>
            <span className="text-xs text-text-muted font-semibold">Marks</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
            Time Per Question
          </span>
          <span className="text-xl sm:text-2xl font-bold font-serif text-text-primary">
            ~{minsPerQuestion} min
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
            Pass Threshold
          </span>
          <span className="text-xl sm:text-2xl font-bold font-serif text-emerald">
            {Math.ceil((totalMarks * passMark) / 100)} / {totalMarks} Marks
          </span>
        </div>
      </div>

      {/* 4. Question Builder Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="size-4 text-amber" />
            <h3 className="text-sm font-bold font-serif text-text-primary uppercase tracking-wider">
              2. MCQ Questions &amp; Choice Keys
            </h3>
          </div>
          <span className="text-xs text-text-muted">
            Mark each question&apos;s correct key with the radio selector
          </span>
        </div>

        <QuestionBuilder
          questions={questions}
          onChange={setQuestions}
          errors={formErrors.questions}
        />
      </div>

      {/* 5. Sticky Bottom Action Controls */}
      <div className="sticky bottom-4 z-20 p-4 sm:p-5 rounded-3xl bg-surface/90 backdrop-blur-md border border-border/80 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs text-text-secondary leading-normal">
          <strong className="text-text-primary block">
            Ready to finalize this assessment?
          </strong>
          Save as a draft to edit later or publish immediately for students.
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Save as Draft */}
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSubmit(false)}
            disabled={saveExamMutation.isPending}
            className="text-xs h-10 px-4 gap-1.5 border-border bg-surface hover:bg-surface-raised cursor-pointer rounded-2xl font-semibold"
          >
            {saveExamMutation.isPending && !isPublishing ? (
              <>
                <Loader2 className="size-3.5 animate-spin" /> Saving Draft...
              </>
            ) : (
              <>
                <Save className="size-3.5 text-text-muted" /> Save as Draft
              </>
            )}
          </Button>

          {/* Save & Publish Immediately */}
          <Button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={saveExamMutation.isPending}
            className="bg-amber text-white hover:bg-amber-hover font-bold text-xs h-10 px-5 gap-2 cursor-pointer shadow-md rounded-2xl"
          >
            {saveExamMutation.isPending && isPublishing ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Publishing...
              </>
            ) : (
              <>
                <Send className="size-4" /> Save &amp; Publish Exam
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
