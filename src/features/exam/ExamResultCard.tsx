import Link from "next/link";
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Sparkles,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExamSubmitResult } from "@/services/exam.service";

interface ExamResultCardProps {
  result: ExamSubmitResult;
  examTitle: string;
  onRetake: () => void;
}

export default function ExamResultCard({
  result,
  examTitle,
  onRetake,
}: ExamResultCardProps) {
  const isPassed = result.isPassed;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Score Banner */}
      <div
        className={`p-8 rounded-3xl border text-center relative overflow-hidden shadow-md ${
          isPassed
            ? "bg-emerald-light/40 border-emerald/30 text-emerald"
            : "bg-orange/5 border-orange/20 text-orange"
        }`}
      >
        <div className="size-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-surface shadow-xs">
          {isPassed ? (
            <CheckCircle2 className="size-10 text-emerald" />
          ) : (
            <XCircle className="size-10 text-orange" />
          )}
        </div>

        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-surface border border-border inline-block mb-3">
          {isPassed ? "Assessment Passed" : "Needs Review"}
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary mb-2">
          {isPassed ? "Congratulations! Great Work" : "Keep Practicing!"}
        </h2>
        <p className="text-sm text-text-secondary max-w-md mx-auto mb-6">
          {isPassed
            ? `You scored above the required ${result.passMark}% passing threshold on "${examTitle}".`
            : `You scored ${result.percentage}%. The passing cutoff is ${result.passMark}%. Review the answer key below to strengthen your understanding.`}
        </p>

        {/* Score metrics pill box */}
        <div className="inline-grid grid-cols-3 gap-6 bg-surface px-8 py-4 rounded-2xl border border-border shadow-xs">
          <div>
            <p className="text-xs text-text-muted">Total Score</p>
            <p className="font-serif text-2xl font-bold text-text-primary">
              {result.score} / {result.totalMarks}
            </p>
          </div>
          <div className="border-x border-border/80 px-4">
            <p className="text-xs text-text-muted">Accuracy</p>
            <p
              className={`font-serif text-2xl font-bold ${
                isPassed ? "text-emerald" : "text-orange"
              }`}
            >
              {result.percentage}%
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Passing Cutoff</p>
            <p className="font-serif text-2xl font-bold text-text-muted">
              {result.passMark}%
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <Button
          onClick={onRetake}
          variant="outline"
          className="border-border text-xs gap-2"
        >
          <RotateCcw className="size-3.5" /> Retake Test
        </Button>

        <div className="flex items-center gap-3">
          <Link href="/exams">
            <Button variant="ghost" className="text-xs">
              Browse More Exams
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-amber text-white hover:bg-amber-hover text-xs">
              Go to Dashboard <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Detailed Question Explanations Breakdown */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-text-primary flex items-center gap-2">
          <BookOpen className="size-5 text-amber" /> Detailed Question Analysis &amp; Answer Key
        </h3>

        <div className="space-y-4">
          {result.breakdown.map((item, idx) => {
            return (
              <div
                key={item.questionId || idx}
                className={`p-6 rounded-2xl border bg-surface transition-all ${
                  item.isCorrect
                    ? "border-emerald/30 shadow-2xs"
                    : "border-orange/30 shadow-2xs"
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className="font-mono text-xs font-bold text-text-muted px-2 py-0.5 rounded bg-surface-raised">
                    Q{idx + 1}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      item.isCorrect
                        ? "bg-emerald-light text-emerald border-emerald/20"
                        : "bg-orange/10 text-orange border-orange/20"
                    }`}
                  >
                    {item.isCorrect ? "Correct (+1)" : "Incorrect (0)"}
                  </span>
                </div>

                <p className="text-sm font-semibold text-text-primary mb-4">
                  {item.questionText}
                </p>

                {/* Options List */}
                <div className="space-y-2 mb-4">
                  {item.options.map((opt, optIdx) => {
                    const isSelected = item.selectedOption === optIdx;
                    const isCorrectAnswer = item.correctOptionIndex === optIdx;

                    let optionStyle =
                      "bg-surface border-border/80 text-text-secondary";
                    if (isCorrectAnswer) {
                      optionStyle =
                        "bg-emerald-light/60 border-emerald text-emerald font-semibold";
                    } else if (isSelected && !item.isCorrect) {
                      optionStyle =
                        "bg-orange/10 border-orange text-orange font-semibold";
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${optionStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="size-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-surface border border-border">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isCorrectAnswer && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald">
                            Correct Answer
                          </span>
                        )}
                        {isSelected && !isCorrectAnswer && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-orange">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {item.explanation && (
                  <div className="p-3.5 rounded-xl bg-surface-raised border border-border/80 text-xs text-text-secondary">
                    <strong className="text-text-primary">Explanation: </strong>
                    {item.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
