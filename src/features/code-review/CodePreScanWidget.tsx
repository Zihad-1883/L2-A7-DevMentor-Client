"use client";

import React, { useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  HardDrive,
  ShieldAlert,
  Loader2,
  ChevronDown,
  ChevronUp,
  Brain,
  Lightbulb,
} from "lucide-react";
import { aiService } from "@/services/ai.service";
import type { CodeScanResponse } from "@/types/ai.types";

interface CodePreScanWidgetProps {
  code: string;
  language?: string;
  context?: string;
  onApplyNotes?: (notes: string) => void;
}

export default function CodePreScanWidget({
  code,
  language = "typescript",
  context,
  onApplyNotes,
}: CodePreScanWidgetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CodeScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleScan = async () => {
    if (!code || code.trim().length < 10) {
      setError("Please paste a code snippet with at least 10 characters to analyze.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await aiService.scanCodeSnippet({
        code: code.trim(),
        language,
        context,
      });

      setResult(response);
      setIsExpanded(true);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(
        message ||
          "Could not complete AI code scan at this time. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/25";
    if (score >= 60) return "text-amber-500 bg-amber-500/10 border-amber-500/25";
    return "text-rose-500 bg-rose-500/10 border-rose-500/25";
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-surface-raised/40 p-4 sm:p-5 space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-amber/10 border border-amber/25 flex items-center justify-center text-amber shrink-0">
            <Brain className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-text-primary">
                AI Code Pre-Scan Diagnostic
              </h4>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber/15 text-amber border border-amber/20">
                Static Review
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Run automated complexity, security & maintainability audit before mentor review.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isLoading || !code || code.trim().length < 10}
          onClick={handleScan}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber text-white hover:bg-amber-600 transition-all shadow-xs shrink-0 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Analyzing Code...</span>
            </>
          ) : (
            <>
              <Sparkles className="size-3.5" />
              <span>Run AI Pre-Scan</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive">
          {error}
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="pt-3 border-t border-border/80 space-y-4 animate-in fade-in duration-300">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Maintainability Score */}
            <div className="p-3.5 rounded-xl border border-border bg-surface flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider block">
                  Maintainability
                </span>
                <span className="text-lg font-bold text-text-primary">
                  {result.complexitySummary.maintainabilityScore}/100
                </span>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${getScoreColor(
                  result.complexitySummary.maintainabilityScore
                )}`}
              >
                {result.complexitySummary.maintainabilityScore >= 80
                  ? "Good"
                  : result.complexitySummary.maintainabilityScore >= 60
                  ? "Moderate"
                  : "Needs Attention"}
              </span>
            </div>

            {/* Time Complexity */}
            <div className="p-3.5 rounded-xl border border-border bg-surface flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider block">
                  Time Complexity
                </span>
                <span className="text-lg font-bold font-mono text-text-primary">
                  {result.complexitySummary.timeComplexity}
                </span>
              </div>
              <div className="size-8 rounded-lg bg-surface-raised flex items-center justify-center text-text-secondary">
                <Clock className="size-4" />
              </div>
            </div>

            {/* Space Complexity */}
            <div className="p-3.5 rounded-xl border border-border bg-surface flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider block">
                  Space Complexity
                </span>
                <span className="text-lg font-bold font-mono text-text-primary">
                  {result.complexitySummary.spaceComplexity}
                </span>
              </div>
              <div className="size-8 rounded-lg bg-surface-raised flex items-center justify-center text-text-secondary">
                <HardDrive className="size-4" />
              </div>
            </div>
          </div>

          {/* Findings List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Static Findings ({result.findings.length})
              </span>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-medium text-amber hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{isExpanded ? "Collapse Details" : "Expand All"}</span>
                {isExpanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
              </button>
            </div>

            {result.findings.length === 0 ? (
              <div className="p-4 rounded-xl border border-border bg-surface text-center text-xs text-text-secondary">
                No major static warnings detected. Code looks clear for mentor review!
              </div>
            ) : (
              isExpanded && (
                <div className="space-y-2.5 animate-in fade-in duration-200">
                  {result.findings.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-border bg-surface space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {item.severity === "critical" ? (
                            <ShieldAlert className="size-4 text-rose-500 shrink-0" />
                          ) : item.severity === "warning" ? (
                            <AlertTriangle className="size-4 text-amber-500 shrink-0" />
                          ) : (
                            <Info className="size-4 text-sky-500 shrink-0" />
                          )}
                          <span className="text-xs font-bold text-text-primary">
                            {item.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.lineRange && (
                            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-surface-raised border border-border text-text-tertiary">
                              {item.lineRange}
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              item.severity === "critical"
                                ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                                : item.severity === "warning"
                                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                : "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                            }`}
                          >
                            {item.severity}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed pl-6">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

          {/* Mentor Focus Notes */}
          {(result.mentorFocusNotes || result.suggestedMentorFocus.length > 0) && (
            <div className="p-3.5 rounded-xl bg-amber/5 border border-amber/25 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber">
                <Lightbulb className="size-4" />
                <span>Suggested Mentor Focus</span>
              </div>
              <p className="text-text-secondary leading-relaxed">
                {result.mentorFocusNotes || result.suggestedMentorFocus.join(" ")}
              </p>
              {onApplyNotes && (
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      onApplyNotes(
                        result.mentorFocusNotes || result.suggestedMentorFocus.join(" ")
                      )
                    }
                    className="text-xs font-semibold text-amber hover:underline cursor-pointer"
                  >
                    + Copy to Request Description
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
