"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  BrainCircuit,
  UserCheck,
  BookOpen,
  ArrowRight,
  TrendingUp,
  X,
  Loader2,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { aiService } from "@/services/ai.service";
import type { MatchResultResponse, MatchedMentor, MatchedCohort } from "@/types/ai.types";

const PRESET_GOALS = [
  "Next.js 15 & Docker deployment",
  "PostgreSQL query optimization & indexing",
  "Fullstack MERN to Next.js migration",
  "System design & high-scale microservices",
  "React senior code review & architecture",
];

export default function SmartAiMatcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [preferredLevel, setPreferredLevel] = useState<"ALL" | "JUNIOR" | "MID" | "SENIOR" | "LEAD">("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MatchResultResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMatch = async (searchPrompt?: string) => {
    const query = searchPrompt || prompt;
    if (!query.trim() || query.length < 3) {
      setError("Please describe what you are looking to learn (minimum 3 characters).");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await aiService.matchMentorsAndCohorts({
        prompt: query.trim(),
        preferredLevel,
        maxResults: 2,
      });

      setResult(response);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(
        message ||
        "Could not analyze matches at the moment. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mb-10 rounded-2xl border border-amber/30 bg-gradient-to-br from-amber-500/5 via-surface to-surface-raised p-5 sm:p-7 shadow-xs">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="size-10 rounded-xl bg-amber/10 border border-amber/25 flex items-center justify-center text-amber shrink-0 mt-0.5">
            <BrainCircuit className="size-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber">
                AI Smart Discovery
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Live DB Matching
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-text-primary">
              Not sure which mentor or cohort fits your learning curve?
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
              Describe your project blocker, stack, or goal. Our AI scores real mentors and cohort curriculums to match you instantly.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber text-white hover:bg-amber-600 transition-colors shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="size-3.5" />
          <span>{isOpen ? "Collapse AI Matcher" : "Launch AI Matcher"}</span>
        </button>
      </div>

      {/* Expandable Interactive Area */}
      {isOpen && (
        <div className="mt-6 pt-6 border-t border-border/80 space-y-5 animate-in fade-in duration-200">
          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium text-text-tertiary">Quick Ideas:</span>
            {PRESET_GOALS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setPrompt(preset);
                  handleMatch(preset);
                }}
                className="text-xs px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-surface-raised hover:border-amber/40 text-text-secondary transition-all cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Input Controls */}
          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., I'm stuck on Next.js 15 App Router authentication with PostgreSQL and Redis. Need an experienced engineer for a code review or sprint..."
                rows={2}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-amber/40 resize-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Experience Level Pill Filter */}
              <div className="flex items-center gap-1.5 bg-surface-raised p-1 rounded-xl border border-border">
                <span className="text-[11px] font-medium text-text-tertiary px-2">Level:</span>
                {(["ALL", "JUNIOR", "MID", "SENIOR", "LEAD"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setPreferredLevel(level)}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${preferredLevel === level
                        ? "bg-amber text-white shadow-xs font-semibold"
                        : "text-text-secondary hover:text-text-primary"
                      }`}
                  >
                    {level}
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleMatch()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-text-primary text-background hover:bg-text-secondary transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin text-amber" />
                    <span>Analyzing Database & Ranking Matches...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3.5 text-amber" />
                    <span>Find My Matches</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)}>
                <X className="size-3.5 cursor-pointer" />
              </button>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="space-y-5 pt-3 animate-in fade-in duration-300">
              {/* AI Analysis Summary Banner */}
              <div className="p-4 rounded-xl bg-surface-raised border border-amber/30 text-xs text-text-primary flex items-start gap-3">
                <div className="size-6 rounded-lg bg-amber/15 text-amber flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="size-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-text-primary mb-0.5 flex items-center gap-2">
                    <span>AI Match Analysis</span>
                    <span className="text-[10px] uppercase font-bold text-text-tertiary">
                      ({result.providerUsed} engine)
                    </span>
                  </div>
                  <p className="text-text-secondary leading-relaxed">{result.analysisSummary}</p>
                </div>
              </div>

              {/* Mentors & Cohorts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Recommended Mentors */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
                    <UserCheck className="size-4 text-amber" />
                    <span>Matched Mentors ({result.recommendedMentors.length})</span>
                  </div>

                  {result.recommendedMentors.length === 0 ? (
                    <div className="p-6 rounded-xl border border-dashed border-border text-center text-xs text-text-tertiary">
                      No mentors matched this exact criteria. Try broadening your query.
                    </div>
                  ) : (
                    result.recommendedMentors.map((mentor) => (
                      <div
                        key={mentor.id}
                        className="p-4 rounded-xl border border-border bg-surface hover:border-amber/40 transition-all shadow-xs space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-surface-raised border border-border flex items-center justify-center font-bold text-text-primary text-sm overflow-hidden">
                              {mentor.avatarUrl ? (
                                <img
                                  src={mentor.avatarUrl}
                                  alt={mentor.name}
                                  className="size-full object-cover"
                                />
                              ) : (
                                mentor.name.slice(0, 2).toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-text-primary">
                                {mentor.name}
                              </div>
                              <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-surface-raised border border-border text-text-secondary">
                                {mentor.experienceLevel}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber/15 text-amber border border-amber/30">
                              {mentor.matchScore}% Match
                            </span>
                          </div>
                        </div>

                        {/* AI Reason */}
                        <div className="text-xs bg-surface-raised/60 p-2.5 rounded-lg border border-border/50 text-text-secondary italic">
                          &ldquo;{mentor.matchReason}&rdquo;
                        </div>

                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {mentor.techStackTags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-surface-raised text-text-secondary border border-border/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="pt-2 flex justify-end">
                          <Link
                            href={`/mentors/${mentor.id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber hover:text-amber-600 transition-colors"
                          >
                            <span>View Profile & Book</span>
                            <ChevronRight className="size-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* 2. Recommended Cohorts */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
                    <GraduationCap className="size-4 text-indigo-500" />
                    <span>Matched Cohorts ({result.recommendedCohorts.length})</span>
                  </div>

                  {result.recommendedCohorts.length === 0 ? (
                    <div className="p-6 rounded-xl border border-dashed border-border text-center text-xs text-text-tertiary">
                      No published cohort currently matches this specific curriculum.
                    </div>
                  ) : (
                    result.recommendedCohorts.map((cohort) => (
                      <div
                        key={cohort.id}
                        className="p-4 rounded-xl border border-border bg-surface hover:border-indigo-500/40 transition-all shadow-xs space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500">
                              {cohort.category || "Cohort Program"}
                            </span>
                            <h4 className="font-semibold text-sm text-text-primary line-clamp-1">
                              {cohort.title}
                            </h4>
                          </div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                            {cohort.matchScore}% Match
                          </span>
                        </div>

                        {/* AI Reason */}
                        <div className="text-xs bg-surface-raised/60 p-2.5 rounded-lg border border-border/50 text-text-secondary italic">
                          &ldquo;{cohort.matchReason}&rdquo;
                        </div>

                        {/* Tech tags & Cost */}
                        <div className="flex items-center justify-between text-xs pt-1">
                          <div className="flex flex-wrap gap-1">
                            {cohort.techStackTags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-surface-raised text-text-secondary border border-border/60"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <span className="font-bold text-text-primary">
                            {cohort.totalCost} Cr
                          </span>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <Link
                            href={`/cohorts/${cohort.id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            <span>Explore Cohort</span>
                            <ChevronRight className="size-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
