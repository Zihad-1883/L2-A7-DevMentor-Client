"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Rocket,
  Calendar,
  Clock,
  Coins,
  Code2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Info,
  Wallet,
  ShieldCheck,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useWallet } from "@/hooks/useWallet";
import { sprintService } from "@/services/sprint.service";
import { queryKeys } from "@/lib/query-keys";
import { createSprintSchema } from "@/lib/validations/sprint.schema";

const POPULAR_TECH_TAGS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "Docker",
  "System Architecture",
  "Tailwind CSS",
  "Express.js",
  "MongoDB",
  "GraphQL",
];

const DURATION_PRESETS = [
  { days: 3, label: "3-Day Fast Sprint", description: "Quick debugging, issue fixing, or PR review" },
  { days: 7, label: "7-Day Foundation Sprint", description: "Standard feature development or core refactoring" },
  { days: 14, label: "14-Day Deep Architecture", description: "Full module build, systems design, or production rollout" },
];

export default function SprintRequestForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { balance, isLoading: isWalletLoading } = useWallet();

  // Form State
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState<string[]>(["TypeScript", "Next.js"]);
  const [customTagInput, setCustomTagInput] = React.useState("");

  // Tomorrow as min date formatted as YYYY-MM-DD
  const tomorrowStr = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  const [startDateStr, setStartDateStr] = React.useState(tomorrowStr);
  const [durationDays, setDurationDays] = React.useState(7);
  // selectedDays relative to duration (e.g. Day 1, Day 3, Day 5)
  const [selectedDays, setSelectedDays] = React.useState<number[]>([1, 3, 5]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});

  // Cost calculation (default platform rate: 50 credits per 1-on-1 sprint session)
  const creditCostPerSession = 50;
  const totalRequiredCredits = selectedDays.length * creditCostPerSession;
  const hasSufficientCredits = balance >= totalRequiredCredits;

  // Toggle tag
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    if (fieldErrors.techStackTags) {
      setFieldErrors((prev) => ({ ...prev, techStackTags: "" }));
    }
  };

  const handleAddCustomTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = customTagInput.trim().replace(/^,+|,+$/g, "");
      if (trimmed && !selectedTags.includes(trimmed)) {
        setSelectedTags((prev) => [...prev, trimmed]);
        setCustomTagInput("");
        if (fieldErrors.techStackTags) {
          setFieldErrors((prev) => ({ ...prev, techStackTags: "" }));
        }
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // Adjust selected days when duration changes
  const handleDurationChange = (days: number) => {
    setDurationDays(days);
    // Keep only days within new duration bounds
    setSelectedDays((prev) => {
      const valid = prev.filter((d) => d <= days);
      if (valid.length > 0) return valid;
      // Default to 1st and middle day
      if (days === 3) return [1, 2];
      if (days === 7) return [1, 3, 5];
      return [1, 5, 10];
    });
  };

  // Toggle relative day (1-indexed)
  const toggleRelativeDay = (dayNum: number) => {
    setSelectedDays((prev) => {
      const exists = prev.includes(dayNum);
      if (exists) {
        if (prev.length === 1) {
          toast.error("At least one session day is required for your sprint");
          return prev;
        }
        return prev.filter((d) => d !== dayNum).sort((a, b) => a - b);
      } else {
        return [...prev, dayNum].sort((a, b) => a - b);
      }
    });
    if (fieldErrors.selectedDays) {
      setFieldErrors((prev) => ({ ...prev, selectedDays: "" }));
    }
  };

  // Compute scheduled session dates preview
  const scheduledDatesPreview = React.useMemo(() => {
    if (!startDateStr) return [];
    const base = new Date(`${startDateStr}T09:00:00Z`);
    if (isNaN(base.getTime())) return [];

    return selectedDays.map((dayNum) => {
      const sessionDate = new Date(base);
      sessionDate.setDate(sessionDate.getDate() + (dayNum - 1));
      return {
        dayNumber: dayNum,
        date: sessionDate,
        dateFormatted: sessionDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      };
    });
  }, [startDateStr, selectedDays]);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Validate inputs with Zod
    const startIso = new Date(`${startDateStr}T09:00:00.000Z`).toISOString();
    const parseResult = createSprintSchema.safeParse({
      title,
      description,
      techStackTags: selectedTags,
      startDate: startIso,
      durationDays,
      selectedDays,
    });

    if (!parseResult.success) {
      const formattedErrors: Record<string, string> = {};
      parseResult.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (!formattedErrors[path]) {
          formattedErrors[path] = issue.message;
        }
      });
      setFieldErrors(formattedErrors);
      toast.error("Please resolve the highlighted form fields");
      return;
    }

    if (!hasSufficientCredits) {
      toast.error(
        `Insufficient credit balance (${balance} CR). You need ${totalRequiredCredits} credits to book ${selectedDays.length} sessions.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const createdSprint = await sprintService.createSprintRequest(parseResult.data);
      toast.success("Sprint request posted successfully to the open mentor pool!");

      // Invalidate relevant queries
      await queryClient.invalidateQueries({ queryKey: queryKeys.sprints.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.wallet.me });

      router.push(`/dashboard/sprints`);
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        "Failed to create sprint request. Please verify your details.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* 1. Sprint Objective & Details */}
      <div className="p-7 sm:p-9 rounded-3xl bg-surface border border-border shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/80">
          <div className="size-10 rounded-xl bg-amber-light text-amber flex items-center justify-center border border-amber/30 shrink-0">
            <Rocket className="size-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-text-primary">
              Sprint Objective &amp; Problem Statement
            </h2>
            <p className="text-xs text-text-secondary">
              Describe what you want to achieve or debug with your senior mentor.
            </p>
          </div>
        </div>

        {/* Sprint Title */}
        <div className="space-y-1.5">
          <label htmlFor="sprint-title" className="text-xs font-bold text-text-primary uppercase tracking-wider block">
            Sprint Title <span className="text-amber">*</span>
          </label>
          <Input
            id="sprint-title"
            type="text"
            placeholder="e.g. Next.js 15 Server Action Authentication & SSR Session Debugging"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (fieldErrors.title) setFieldErrors((prev) => ({ ...prev, title: "" }));
            }}
            className={`bg-surface ${fieldErrors.title ? "border-orange focus:border-orange" : ""}`}
            maxLength={100}
            required
          />
          {fieldErrors.title ? (
            <p className="text-[11px] text-orange font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="size-3" /> {fieldErrors.title}
            </p>
          ) : (
            <p className="text-[11px] text-text-muted">
              A clear, concise title helps matched mentors claim your sprint faster (max 100 chars).
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label htmlFor="sprint-desc" className="text-xs font-bold text-text-primary uppercase tracking-wider block">
            Technical Problem Description &amp; Goals <span className="text-amber">*</span>
          </label>
          <textarea
            id="sprint-desc"
            rows={5}
            placeholder="Outline your existing repository structure, error logs, architecture bottlenecks, or specific goals for each scheduled session..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (fieldErrors.description) setFieldErrors((prev) => ({ ...prev, description: "" }));
            }}
            className={`w-full rounded-2xl bg-surface border p-4 text-xs sm:text-sm text-text-primary focus:outline-hidden focus:border-amber transition-colors resize-y leading-relaxed ${
              fieldErrors.description ? "border-orange" : "border-border"
            }`}
            required
          />
          {fieldErrors.description ? (
            <p className="text-[11px] text-orange font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="size-3" /> {fieldErrors.description}
            </p>
          ) : (
            <p className="text-[11px] text-text-muted">
              Minimum 10 characters. Include GitHub links or relevant snippet contexts if applicable.
            </p>
          )}
        </div>

        {/* Tech Stack Tags */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-text-primary uppercase tracking-wider block">
            Relevant Tech Stack Tags <span className="text-amber">*</span>
          </label>

          {/* Selected Tag Pills */}
          <div className="flex flex-wrap items-center gap-2 min-h-8">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-light text-amber border border-amber/30 animate-in fade-in"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-terracotta cursor-pointer transition-colors"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Popular Tag Picker Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-text-muted block">Select from common technologies:</span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_TECH_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-amber text-white border-amber shadow-2xs"
                        : "bg-surface-raised text-text-secondary border-border hover:border-amber/40"
                    }`}
                  >
                    {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Tag Input */}
          <div className="pt-1 max-w-sm">
            <Input
              type="text"
              placeholder="Add custom tag (press Enter)..."
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              onKeyDown={handleAddCustomTag}
              className="text-xs h-8 bg-surface"
            />
          </div>
          {fieldErrors.techStackTags && (
            <p className="text-[11px] text-orange font-medium flex items-center gap-1">
              <AlertCircle className="size-3" /> {fieldErrors.techStackTags}
            </p>
          )}
        </div>
      </div>

      {/* 2. Timeline, Duration & Session Frequency */}
      <div className="p-7 sm:p-9 rounded-3xl bg-surface border border-border shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/80">
          <div className="size-10 rounded-xl bg-amber-light text-amber flex items-center justify-center border border-amber/30 shrink-0">
            <Calendar className="size-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-text-primary">
              Schedule &amp; Session Days
            </h2>
            <p className="text-xs text-text-secondary">
              Configure sprint length and select which days your 1-on-1 mentorship sessions take place.
            </p>
          </div>
        </div>

        {/* Start Date */}
        <div className="space-y-1.5 max-w-xs">
          <label htmlFor="sprint-start" className="text-xs font-bold text-text-primary uppercase tracking-wider block">
            Sprint Start Date <span className="text-amber">*</span>
          </label>
          <Input
            id="sprint-start"
            type="date"
            min={tomorrowStr}
            value={startDateStr}
            onChange={(e) => setStartDateStr(e.target.value)}
            className="bg-surface"
            required
          />
          <p className="text-[11px] text-text-muted">
            Earliest available start date is tomorrow.
          </p>
        </div>

        {/* Duration Presets */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-primary uppercase tracking-wider block">
            Sprint Program Duration
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DURATION_PRESETS.map((preset) => {
              const isSelected = durationDays === preset.days;
              return (
                <button
                  key={preset.days}
                  type="button"
                  onClick={() => handleDurationChange(preset.days)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-amber bg-amber/5 shadow-xs"
                      : "border-border bg-surface hover:border-amber/40"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-serif text-sm font-bold text-text-primary block">
                      {preset.label}
                    </span>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      {preset.description}
                    </p>
                  </div>
                  <span
                    className={`mt-3 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block self-start border ${
                      isSelected
                        ? "bg-amber text-white border-amber"
                        : "bg-surface-raised text-text-muted border-border"
                    }`}
                  >
                    {preset.days} Calendar Days
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Relative Days Matrix */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Select Session Days ({selectedDays.length} Active Sessions)
            </label>
            <span className="text-[11px] text-amber font-semibold">
              {selectedDays.length} sessions × {creditCostPerSession} CR = {totalRequiredCredits} Credits
            </span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            Click on each day below to toggle whether a 1-on-1 sprint session should occur on that day:
          </p>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: durationDays }, (_, i) => i + 1).map((dayNum) => {
              const isSelected = selectedDays.includes(dayNum);
              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => toggleRelativeDay(dayNum)}
                  className={`size-11 sm:size-12 rounded-xl flex flex-col items-center justify-center font-mono text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-amber text-white border-amber shadow-xs scale-105"
                      : "bg-surface-raised border-border text-text-muted hover:border-amber/40 hover:text-text-primary"
                  }`}
                >
                  <span className="text-[9px] uppercase font-normal opacity-80">Day</span>
                  <span>{dayNum}</span>
                </button>
              );
            })}
          </div>

          {/* Calendar Preview of Scheduled Days */}
          {scheduledDatesPreview.length > 0 && (
            <div className="p-4 rounded-2xl bg-surface-raised border border-border/80 space-y-2 mt-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Clock className="size-3.5 text-amber" /> Scheduled Mentorship Timeline Preview:
              </span>
              <div className="flex flex-wrap gap-2">
                {scheduledDatesPreview.map((item) => (
                  <span
                    key={item.dayNumber}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-surface border border-border/80 text-text-primary shadow-2xs"
                  >
                    <span className="text-amber font-mono font-bold">Session #{item.dayNumber}:</span>
                    <span>{item.dateFormatted}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Escrow Economics & Credit Investment Summary */}
      <div className="p-7 sm:p-9 rounded-3xl bg-surface border-2 border-amber/30 shadow-md space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-border/80">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-light text-amber flex items-center justify-center border border-amber/30 shrink-0">
              <Coins className="size-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-text-primary">
                DevWallet Escrow &amp; Budget Authorization
              </h2>
              <p className="text-xs text-text-secondary">
                Protected by platform escrow. Credits are held securely and only released per completed session.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald font-semibold">
            <ShieldCheck className="size-4" />
            <span>Escrow Protected</span>
          </div>
        </div>

        {/* Investment Breakdown Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-surface-raised border border-border text-center">
            <span className="text-[10px] uppercase font-bold text-text-muted block">
              Your Available Balance
            </span>
            <span className="font-serif text-2xl font-bold text-text-primary mt-0.5 block">
              {isWalletLoading ? "..." : `${balance} CR`}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-raised border border-border text-center">
            <span className="text-[10px] uppercase font-bold text-text-muted block">
              Total Required Investment
            </span>
            <span className="font-serif text-2xl font-bold text-amber mt-0.5 block">
              {totalRequiredCredits} CR
            </span>
          </div>

          <div
            className={`p-4 rounded-2xl border text-center ${
              hasSufficientCredits
                ? "bg-emerald-light/40 border-emerald/30 text-emerald"
                : "bg-orange-light/40 border-orange/30 text-orange"
            }`}
          >
            <span className="text-[10px] uppercase font-bold block">
              Balance Status
            </span>
            <span className="font-serif text-2xl font-bold mt-0.5 block">
              {hasSufficientCredits
                ? `+${balance - totalRequiredCredits} CR Left`
                : `-${totalRequiredCredits - balance} CR Deficit`}
            </span>
          </div>
        </div>

        {/* Insufficient Balance Notice */}
        {!hasSufficientCredits && (
          <div className="p-4 rounded-2xl bg-orange/10 border border-orange/30 flex items-start justify-between gap-4">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="size-4 text-orange mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-orange">
                  Insufficient DevWallet Credits
                </p>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  You need {totalRequiredCredits} credits for this sprint, but currently hold {balance} credits.
                  Please top up your wallet via bKash to proceed.
                </p>
              </div>
            </div>

            <Link href="/dashboard/wallet" className="shrink-0">
              <Button
                type="button"
                size="sm"
                className="bg-orange text-white hover:bg-orange/90 text-xs gap-1.5 cursor-pointer"
              >
                <Wallet className="size-3.5" /> Top up Credits
              </Button>
            </Link>
          </div>
        )}

        {/* Submit Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/80">
          <Link href="/dashboard/sprints" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto text-xs border-border cursor-pointer"
            >
              Cancel &amp; Return to Sprints
            </Button>
          </Link>

          <Button
            type="submit"
            disabled={isSubmitting || !hasSufficientCredits}
            className="w-full sm:w-auto bg-amber text-white hover:bg-amber-hover font-semibold text-xs h-11 px-8 gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Broadcasting Sprint Request...</span>
            ) : (
              <>
                <span>Broadcast Sprint Request ({totalRequiredCredits} CR)</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
