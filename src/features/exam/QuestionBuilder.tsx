"use client";

import * as React from "react";
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  HelpCircle,
  FileQuestion,
  Sparkles,
  Award,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { QuestionItemFormData } from "@/lib/validations/exam.schema";

interface QuestionBuilderProps {
  questions: QuestionItemFormData[];
  onChange: (questions: QuestionItemFormData[]) => void;
  errors?: Record<number, Partial<Record<keyof QuestionItemFormData, string>>>;
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function QuestionBuilder({
  questions,
  onChange,
  errors = {},
}: QuestionBuilderProps) {
  // Add a brand new empty question
  const handleAddQuestion = () => {
    const newQuestion: QuestionItemFormData = {
      questionText: "",
      options: ["", ""],
      correctOptionIndex: 0,
      explanation: "",
      marks: 1,
    };
    onChange([...questions, newQuestion]);
  };

  // Add sample / template question
  const handleAddSampleQuestion = () => {
    const sample: QuestionItemFormData = {
      questionText:
        "Which React hook should be used to synchronize with an external browser DOM subscription without causing visual tearing?",
      options: [
        "useSyncExternalStore",
        "useEffect",
        "useTransition",
        "useDeferredValue",
      ],
      correctOptionIndex: 0,
      explanation:
        "useSyncExternalStore is specifically designed for subscribing to external stores with concurrent rendering safety and zero tearing.",
      marks: 1,
    };
    onChange([...questions, sample]);
  };

  // Remove a question
  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) return;
    const updated = questions.filter((_, i) => i !== index);
    onChange(updated);
  };

  // Duplicate a question
  const handleDuplicateQuestion = (index: number) => {
    const target = questions[index];
    const duplicated: QuestionItemFormData = {
      ...target,
      questionText: `${target.questionText} (Copy)`,
      options: [...target.options],
    };
    const updated = [...questions];
    updated.splice(index + 1, 0, duplicated);
    onChange(updated);
  };

  // Move question up/down
  const handleMoveQuestion = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === questions.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...questions];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  // Update question field
  const handleUpdateField = <K extends keyof QuestionItemFormData>(
    index: number,
    field: K,
    value: QuestionItemFormData[K]
  ) => {
    const updated = [...questions];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  // Option actions
  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updated = [...questions];
    const targetOptions = [...updated[questionIndex].options];
    targetOptions[optionIndex] = value;
    updated[questionIndex] = {
      ...updated[questionIndex],
      options: targetOptions,
    };
    onChange(updated);
  };

  const handleAddOption = (questionIndex: number) => {
    const target = questions[questionIndex];
    if (target.options.length >= 6) return;
    const updated = [...questions];
    updated[questionIndex] = {
      ...target,
      options: [...target.options, ""],
    };
    onChange(updated);
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const target = questions[questionIndex];
    if (target.options.length <= 2) return;
    const updated = [...questions];
    const targetOptions = target.options.filter((_, i) => i !== optionIndex);

    // Adjust correctOptionIndex if needed
    let newCorrectIndex = target.correctOptionIndex;
    if (newCorrectIndex === optionIndex) {
      newCorrectIndex = 0;
    } else if (newCorrectIndex > optionIndex) {
      newCorrectIndex -= 1;
    }

    updated[questionIndex] = {
      ...target,
      options: targetOptions,
      correctOptionIndex: newCorrectIndex,
    };
    onChange(updated);
  };

  const handleSetCorrectOption = (
    questionIndex: number,
    optionIndex: number
  ) => {
    handleUpdateField(questionIndex, "correctOptionIndex", optionIndex);
  };

  return (
    <div className="space-y-6">
      {/* Question Cards List */}
      <div className="space-y-6">
        {questions.map((question, qIdx) => {
          const qError = errors[qIdx];
          const hasError = Boolean(qError);

          return (
            <div
              key={qIdx}
              className={`p-6 rounded-3xl bg-surface border transition-all ${
                hasError
                  ? "border-rose-300 dark:border-rose-900 shadow-rose-500/5 shadow-md"
                  : "border-border shadow-xs hover:border-border/80"
              } space-y-5`}
            >
              {/* Question Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
                <div className="flex items-center gap-2.5">
                  <span className="size-8 rounded-xl bg-amber-light text-amber font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    #{qIdx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                      Multiple Choice Question {qIdx + 1}
                    </h4>
                    <span className="text-[11px] text-text-muted">
                      Select 1 correct option key from choices below
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  {/* Marks Input */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-surface-raised border border-border mr-1">
                    <Award className="size-3.5 text-amber" />
                    <span className="text-[11px] font-semibold text-text-secondary">
                      Marks:
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={question.marks || 1}
                      onChange={(e) =>
                        handleUpdateField(
                          qIdx,
                          "marks",
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      }
                      className="w-10 bg-transparent text-xs font-bold font-mono text-text-primary text-center focus:outline-none focus:ring-1 focus:ring-amber rounded"
                    />
                  </div>

                  {/* Reordering */}
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleMoveQuestion(qIdx, "up")}
                    disabled={qIdx === 0}
                    title="Move question up"
                    className="size-8 rounded-xl text-text-muted hover:text-text-primary cursor-pointer disabled:opacity-30"
                  >
                    <ChevronUp className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleMoveQuestion(qIdx, "down")}
                    disabled={qIdx === questions.length - 1}
                    title="Move question down"
                    className="size-8 rounded-xl text-text-muted hover:text-text-primary cursor-pointer disabled:opacity-30"
                  >
                    <ChevronDown className="size-4" />
                  </Button>

                  {/* Duplicate */}
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDuplicateQuestion(qIdx)}
                    title="Duplicate question"
                    className="size-8 rounded-xl text-text-muted hover:text-amber cursor-pointer"
                  >
                    <Copy className="size-3.5" />
                  </Button>

                  {/* Delete */}
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveQuestion(qIdx)}
                    disabled={questions.length <= 1}
                    title={
                      questions.length <= 1
                        ? "An exam requires at least 1 question"
                        : "Delete question"
                    }
                    className="size-8 rounded-xl text-text-muted hover:text-rose-500 cursor-pointer disabled:opacity-30"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>

              {/* Question Statement Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-text-primary flex items-center gap-1.5">
                    <FileQuestion className="size-3.5 text-amber" /> Question
                    Statement <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-text-muted">
                    Min 5 characters
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={question.questionText}
                  onChange={(e) =>
                    handleUpdateField(qIdx, "questionText", e.target.value)
                  }
                  placeholder="e.g. Which React hook is best suited for memoizing complex derived calculations?"
                  className={`w-full p-3 rounded-2xl bg-surface-raised border text-xs text-text-primary leading-relaxed placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-amber/50 resize-y ${
                    qError?.questionText
                      ? "border-rose-400 focus:border-rose-500"
                      : "border-border focus:border-amber/50"
                  }`}
                />
                {qError?.questionText && (
                  <p className="text-[11px] text-rose-500 flex items-center gap-1">
                    <AlertCircle className="size-3" /> {qError.questionText}
                  </p>
                )}
              </div>

              {/* Answer Choices & Correct Answer Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
                      Answer Choices
                    </span>
                    <span className="text-[11px] text-text-muted">
                      (Click radio to select correct answer key)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-text-secondary">
                    {question.options.length} / 6 Choices
                  </span>
                </div>

                <div className="space-y-2.5">
                  {question.options.map((option, optIdx) => {
                    const isCorrect = question.correctOptionIndex === optIdx;
                    const letter = OPTION_LETTERS[optIdx] || `${optIdx + 1}`;

                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-3 p-2.5 rounded-2xl border transition-all ${
                          isCorrect
                            ? "bg-emerald-500/10 border-emerald-500/40 text-text-primary shadow-xs"
                            : "bg-surface-raised border-border hover:border-border/80"
                        }`}
                      >
                        {/* Radio Selector for Correct Answer Key */}
                        <button
                          type="button"
                          onClick={() => handleSetCorrectOption(qIdx, optIdx)}
                          className={`size-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 cursor-pointer transition-all ${
                            isCorrect
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "bg-surface border border-border text-text-secondary hover:border-emerald-500/60 hover:text-emerald-600"
                          }`}
                          title={
                            isCorrect
                              ? "Currently selected correct answer"
                              : "Click to set as correct answer"
                          }
                        >
                          {letter}
                        </button>

                        {/* Option Text Input */}
                        <div className="flex-1">
                          <Input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(qIdx, optIdx, e.target.value)
                            }
                            placeholder={`Choice ${letter} text...`}
                            className="h-8 text-xs bg-surface border-border rounded-xl focus:ring-1 focus:ring-amber"
                          />
                        </div>

                        {/* Correct Option Status Pill */}
                        {isCorrect && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald border border-emerald-500/30 shrink-0">
                            <CheckCircle2 className="size-3" /> Correct Key
                          </span>
                        )}

                        {/* Delete Choice Button */}
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveOption(qIdx, optIdx)}
                          disabled={question.options.length <= 2}
                          title={
                            question.options.length <= 2
                              ? "A question must have at least 2 choices"
                              : "Remove choice"
                          }
                          className="size-7 rounded-lg text-text-muted hover:text-rose-500 cursor-pointer disabled:opacity-20 shrink-0"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                </div>

                {/* Add Choice Button */}
                {question.options.length < 6 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddOption(qIdx)}
                    className="text-xs h-8 px-3 gap-1.5 border-dashed border-border hover:border-amber/60 hover:text-amber cursor-pointer rounded-xl bg-surface"
                  >
                    <Plus className="size-3" /> Add Choice{" "}
                    {OPTION_LETTERS[question.options.length] || ""}
                  </Button>
                )}
              </div>

              {/* Optional Explanation / Solution Note */}
              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-text-secondary flex items-center gap-1.5">
                    <HelpCircle className="size-3.5 text-text-muted" /> Answer
                    Explanation &amp; Teaching Rationale (Optional)
                  </label>
                  <span className="text-[11px] text-text-muted">
                    Visible to students after submitting
                  </span>
                </div>
                <Input
                  type="text"
                  value={question.explanation || ""}
                  onChange={(e) =>
                    handleUpdateField(qIdx, "explanation", e.target.value)
                  }
                  placeholder="e.g. useMemo memoizes computed values across renders, whereas useCallback memoizes function definitions."
                  className="h-8 text-xs bg-surface-raised border-border rounded-xl placeholder:text-text-muted"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-surface-raised border border-border">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={handleAddQuestion}
            className="bg-amber text-white hover:bg-amber-hover font-bold text-xs h-9 px-4 gap-2 cursor-pointer shadow-xs rounded-xl"
          >
            <Plus className="size-4" /> Add Question #{questions.length + 1}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleAddSampleQuestion}
            className="text-xs h-9 px-3.5 gap-1.5 border-border bg-surface hover:bg-surface-raised cursor-pointer rounded-xl text-text-secondary hover:text-text-primary"
          >
            <Sparkles className="size-3.5 text-amber" /> Add Sample MCQ
          </Button>
        </div>

        <div className="text-xs text-text-muted font-medium flex items-center gap-3">
          <span>
            Total:{" "}
            <strong className="text-text-primary font-bold">
              {questions.length} Questions
            </strong>
          </span>
          <span className="text-border">•</span>
          <span>
            Total Marks:{" "}
            <strong className="text-amber font-bold">
              {questions.reduce((sum, q) => sum + (q.marks || 1), 0)} Marks
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
