"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Sparkles,
  BookOpen,
  Calendar,
  Users,
  Coins,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  Layers,
  Plus,
  X,
  Clock,
  Flame,
  Check,
  Loader2,
  DollarSign,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cohortService } from "@/services/cohort.service";
import type { CreateCohortInput } from "@/types/cohort.types";

const POPULAR_TAGS = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "Tailwind CSS",
  "Docker",
  "Express",
  "GraphQL",
  "Redis",
  "System Design",
];

const DURATION_PRESETS = [4, 6, 8, 12];
const CAPACITY_PRESETS = [10, 15, 25, 50];

const WIZARD_STEPS = [
  { id: 1, title: "Program Essentials", icon: BookOpen, subtitle: "Title & Tech Stack" },
  { id: 2, title: "Capacity & Schedule", icon: Calendar, subtitle: "Duration & Seats" },
  { id: 3, title: "Pricing & Economics", icon: Coins, subtitle: "Credits & Revenue" },
  { id: 4, title: "Review & Publish", icon: CheckCircle2, subtitle: "Final Validation" },
];

export default function CohortCreateWizard() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Wizard state
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [customTagInput, setCustomTagInput] = React.useState<string>("");

  // Form state
  const [title, setTitle] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [techStackTags, setTechStackTags] = React.useState<string[]>([
    "Next.js",
    "TypeScript",
  ]);
  const [durationWeeks, setDurationWeeks] = React.useState<number>(6);
  const [capacity, setCapacity] = React.useState<number>(20);
  const [totalCost, setTotalCost] = React.useState<number>(50);
  const [isFree, setIsFree] = React.useState<boolean>(false);

  // Field validation error state
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Tag management
  const toggleTag = (tag: string) => {
    if (techStackTags.includes(tag)) {
      setTechStackTags(techStackTags.filter((t) => t !== tag));
    } else {
      setTechStackTags([...techStackTags, tag]);
    }
    if (errors.tags) {
      setErrors((prev) => ({ ...prev, tags: "" }));
    }
  };

  const handleAddCustomTag = () => {
    const trimmed = customTagInput.trim();
    if (!trimmed) return;
    if (!techStackTags.includes(trimmed)) {
      setTechStackTags([...techStackTags, trimmed]);
    }
    setCustomTagInput("");
    if (errors.tags) {
      setErrors((prev) => ({ ...prev, tags: "" }));
    }
  };

  const handleKeyDownTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddCustomTag();
    }
  };

  // Step navigation validations
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!title.trim() || title.trim().length < 3) {
        newErrors.title = "Cohort title must be at least 3 characters long.";
      } else if (title.trim().length > 100) {
        newErrors.title = "Cohort title cannot exceed 100 characters.";
      }

      if (!description.trim() || description.trim().length < 10) {
        newErrors.description =
          "Please write a comprehensive syllabus description (at least 10 characters).";
      }

      if (techStackTags.length === 0) {
        newErrors.tags = "Please select or add at least one tech stack tag.";
      }
    }

    if (stepNumber === 2) {
      if (!durationWeeks || durationWeeks < 1) {
        newErrors.duration = "Duration must be at least 1 week.";
      } else if (durationWeeks > 52) {
        newErrors.duration = "Duration cannot exceed 52 weeks.";
      }

      if (!capacity || capacity < 1) {
        newErrors.capacity = "Maximum seats capacity must be at least 1 student.";
      } else if (capacity > 200) {
        newErrors.capacity = "Maximum seats capacity cannot exceed 200 students.";
      }
    }

    if (stepNumber === 3) {
      if (!isFree && (totalCost === undefined || totalCost < 0)) {
        newErrors.cost = "Credit cost cannot be negative.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Mutation to create cohort
  const createMutation = useMutation({
    mutationFn: async () => {
      const payload: CreateCohortInput = {
        title: title.trim(),
        description: description.trim(),
        durationWeeks: Number(durationWeeks),
        capacity: Number(capacity),
        totalCost: isFree ? 0 : Number(totalCost),
        techStackTags,
      };
      return await cohortService.createCohort(payload);
    },
    onSuccess: (data) => {
      toast.success(
        "Cohort successfully created and submitted for Admin approval!"
      );
      queryClient.invalidateQueries({ queryKey: ["cohorts"] });
      queryClient.invalidateQueries({ queryKey: ["mentor", "my-created-cohorts"] });
      queryClient.invalidateQueries({ queryKey: ["mentor", "dashboard-summary"] });
      router.push(`/mentor/cohorts`);
    },
    onError: (err: Error) => {
      toast.error(
        err.message ||
          "Failed to create cohort. Please check your inputs and try again."
      );
    },
  });

  const handleSubmit = () => {
    if (validateStep(1) && validateStep(2) && validateStep(3)) {
      createMutation.mutate();
    } else {
      toast.error("Please complete all required fields before submitting.");
    }
  };

  // Calculations
  const effectiveCost = isFree ? 0 : totalCost;
  const bdtEquivalent = effectiveCost * 4;
  const grossEscrowCredits = effectiveCost * capacity;
  const grossEscrowBdt = grossEscrowCredits * 4;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-linear-to-r from-amber-50/70 via-surface to-surface border border-amber/20 shadow-xs relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-light text-amber text-xs font-bold uppercase tracking-wider border border-amber/20">
            <Sparkles className="size-3.5" /> Group Mentorship Studio
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Create New Cohort Program
          </h1>
          <p className="text-sm text-text-secondary max-w-xl leading-relaxed">
            Design an intensive group learning program, schedule milestone sessions, and teach up to dozens of aspiring developers together.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push("/mentor/cohorts")}
            className="border-border text-xs gap-1.5 bg-surface hover:bg-surface-raised"
          >
            Cancel &amp; Exit
          </Button>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute -right-10 -bottom-10 size-40 bg-amber/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. Stepper Progress Bar */}
      <div className="p-4 sm:p-6 rounded-2xl bg-surface border border-border shadow-xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {WIZARD_STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div
                key={step.id}
                onClick={() => {
                  if (step.id < currentStep) setCurrentStep(step.id);
                }}
                className={`p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                  isCurrent
                    ? "bg-amber-light/50 border-amber text-amber shadow-2xs"
                    : isCompleted
                    ? "bg-emerald-light/40 border-emerald/30 text-emerald cursor-pointer hover:bg-emerald-light/60"
                    : "bg-surface-raised/40 border-border/80 text-text-muted opacity-70"
                }`}
              >
                <div
                  className={`size-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    isCurrent
                      ? "bg-amber text-white shadow-2xs"
                      : isCompleted
                      ? "bg-emerald text-white"
                      : "bg-surface border border-border text-text-muted"
                  }`}
                >
                  {isCompleted ? <Check className="size-4" /> : <Icon className="size-4" />}
                </div>

                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
                    Step {step.id}
                  </span>
                  <span className="text-xs font-bold text-text-primary block truncate">
                    {step.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Wizard Content Area */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-xs space-y-6">
        {/* STEP 1: Program Essentials */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-serif text-xl font-bold text-text-primary">
                1. Program Essentials
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                Give your cohort a clear, compelling title and outline what students will learn.
              </p>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                  Cohort Title <span className="text-rose">*</span>
                </label>
                <span className="text-[11px] text-text-muted">
                  {title.length}/100 chars
                </span>
              </div>
              <Input
                type="text"
                placeholder="e.g., Fullstack Next.js 15 & PostgreSQL Production Mastery"
                value={title}
                maxLength={100}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                }}
                className={`h-11 text-sm bg-surface rounded-xl ${
                  errors.title ? "border-rose focus-visible:ring-rose" : "border-border"
                }`}
              />
              {errors.title && (
                <p className="text-xs text-rose flex items-center gap-1">
                  <AlertCircle className="size-3.5" /> {errors.title}
                </p>
              )}
            </div>

            {/* Description / Syllabus */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                Cohort Description &amp; Syllabus Overview <span className="text-rose">*</span>
              </label>
              <textarea
                rows={5}
                placeholder="Describe the learning objectives, practical projects, prerequisites, and live workshop roadmap for prospective students..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description)
                    setErrors((prev) => ({ ...prev, description: "" }));
                }}
                className={`w-full p-3.5 text-sm bg-surface rounded-xl border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/50 transition-all ${
                  errors.description ? "border-rose" : "border-border"
                }`}
              />
              {errors.description && (
                <p className="text-xs text-rose flex items-center gap-1">
                  <AlertCircle className="size-3.5" /> {errors.description}
                </p>
              )}
            </div>

            {/* Tech Stack Tags */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                Technology Stack <span className="text-rose">*</span>
              </label>

              {/* Tag selector presets */}
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map((tag) => {
                  const isSelected = techStackTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-amber text-white shadow-2xs"
                          : "bg-surface-raised border border-border text-text-secondary hover:text-text-primary hover:border-border-strong"
                      }`}
                    >
                      {isSelected && <Check className="size-3.5" />}
                      {tag}
                    </button>
                  );
                })}
              </div>

              {/* Custom tag input */}
              <div className="flex items-center gap-2 max-w-sm pt-2">
                <Input
                  type="text"
                  placeholder="Add custom tag (e.g., Redis, Kafka)..."
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={handleKeyDownTag}
                  className="h-9 text-xs bg-surface border-border rounded-lg"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddCustomTag}
                  disabled={!customTagInput.trim()}
                  className="h-9 text-xs border-border gap-1 shrink-0"
                >
                  <Plus className="size-3.5" /> Add
                </Button>
              </div>

              {/* Selected Tags Display */}
              <div className="pt-2">
                <span className="text-[11px] text-text-muted block mb-1.5 font-semibold">
                  Selected Tags ({techStackTags.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {techStackTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-light text-amber border border-amber/20"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className="hover:text-rose cursor-pointer ml-0.5"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {errors.tags && (
                <p className="text-xs text-rose flex items-center gap-1">
                  <AlertCircle className="size-3.5" /> {errors.tags}
                </p>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Capacity & Schedule */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-serif text-xl font-bold text-text-primary">
                2. Capacity &amp; Schedule
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                Configure program duration and classroom seat limits for optimal cohort engagement.
              </p>
            </div>

            {/* Duration Weeks */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                Program Duration (Weeks) <span className="text-rose">*</span>
              </label>

              {/* Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {DURATION_PRESETS.map((weeks) => (
                  <button
                    key={weeks}
                    type="button"
                    onClick={() => {
                      setDurationWeeks(weeks);
                      if (errors.duration)
                        setErrors((prev) => ({ ...prev, duration: "" }));
                    }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      durationWeeks === weeks
                        ? "bg-amber-light border-amber text-amber font-bold shadow-2xs"
                        : "bg-surface-raised/40 border-border text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <span className="text-lg font-bold block">{weeks}</span>
                    <span className="text-xs">Weeks</span>
                  </button>
                ))}
              </div>

              {/* Custom Duration Input */}
              <div className="pt-2 max-w-xs">
                <span className="text-xs text-text-muted block mb-1">
                  Or enter custom duration in weeks:
                </span>
                <Input
                  type="number"
                  min={1}
                  max={52}
                  value={durationWeeks}
                  onChange={(e) => {
                    setDurationWeeks(Number(e.target.value));
                    if (errors.duration)
                      setErrors((prev) => ({ ...prev, duration: "" }));
                  }}
                  className="h-10 text-sm bg-surface border-border rounded-xl"
                />
              </div>

              {errors.duration && (
                <p className="text-xs text-rose flex items-center gap-1">
                  <AlertCircle className="size-3.5" /> {errors.duration}
                </p>
              )}
            </div>

            {/* Capacity (Max Seats) */}
            <div className="space-y-3 pt-3 border-t border-border/60">
              <label className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                Maximum Student Capacity (Seats) <span className="text-rose">*</span>
              </label>

              {/* Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CAPACITY_PRESETS.map((seats) => (
                  <button
                    key={seats}
                    type="button"
                    onClick={() => {
                      setCapacity(seats);
                      if (errors.capacity)
                        setErrors((prev) => ({ ...prev, capacity: "" }));
                    }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      capacity === seats
                        ? "bg-amber-light border-amber text-amber font-bold shadow-2xs"
                        : "bg-surface-raised/40 border-border text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <span className="text-lg font-bold block">{seats}</span>
                    <span className="text-xs">Students</span>
                  </button>
                ))}
              </div>

              {/* Custom Capacity Input */}
              <div className="pt-2 max-w-xs">
                <span className="text-xs text-text-muted block mb-1">
                  Or enter custom seat capacity:
                </span>
                <Input
                  type="number"
                  min={1}
                  max={200}
                  value={capacity}
                  onChange={(e) => {
                    setCapacity(Number(e.target.value));
                    if (errors.capacity)
                      setErrors((prev) => ({ ...prev, capacity: "" }));
                  }}
                  className="h-10 text-sm bg-surface border-border rounded-xl"
                />
              </div>

              {errors.capacity && (
                <p className="text-xs text-rose flex items-center gap-1">
                  <AlertCircle className="size-3.5" /> {errors.capacity}
                </p>
              )}
            </div>

            {/* Guidance Callout */}
            <div className="p-4 rounded-2xl bg-surface-raised border border-border/80 flex items-start gap-3 text-xs text-text-secondary">
              <Info className="size-4 text-amber shrink-0 mt-0.5" />
              <p>
                We recommend keeping cohorts between 15–30 students so you can provide meaningful code reviews and live Q&amp;A feedback in workshops.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Pricing & Economics */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-serif text-xl font-bold text-text-primary">
                3. Pricing &amp; Economics
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                Set student enrollment investment in DevMentor credits (`1 Credit = ৳4 BDT`).
              </p>
            </div>

            {/* Free vs Paid Toggle */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-raised border border-border">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-text-primary">
                <input
                  type="checkbox"
                  checked={isFree}
                  onChange={(e) => setIsFree(e.target.checked)}
                  className="size-4 text-amber rounded border-border"
                />
                Offer this as a Free Community Cohort (0 Credits)
              </label>
            </div>

            {/* Credit Cost */}
            {!isFree && (
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                  Total Program Cost (In Credits) <span className="text-rose">*</span>
                </label>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="max-w-xs relative">
                    <Coins className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-amber" />
                    <Input
                      type="number"
                      min={0}
                      value={totalCost}
                      onChange={(e) => {
                        setTotalCost(Number(e.target.value));
                        if (errors.cost) setErrors((prev) => ({ ...prev, cost: "" }));
                      }}
                      className="pl-10 h-11 text-sm bg-surface border-border rounded-xl font-bold text-text-primary"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-amber-light/60 border border-amber/20 text-xs text-amber font-semibold flex items-center gap-2">
                    <DollarSign className="size-4" />
                    <span>
                      Equivalent to <strong className="font-bold">৳{bdtEquivalent} BDT</strong> per enrolled student
                    </span>
                  </div>
                </div>

                {errors.cost && (
                  <p className="text-xs text-rose flex items-center gap-1">
                    <AlertCircle className="size-3.5" /> {errors.cost}
                  </p>
                )}
              </div>
            )}

            {/* Revenue Estimator Card */}
            <div className="p-5 rounded-2xl bg-linear-to-br from-amber-50/50 via-surface to-surface border border-amber/20 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber">
                  <Sparkles className="size-4" /> Revenue Projection
                </div>
                <span className="text-xs text-text-muted">
                  Full capacity ({capacity} students)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-text-muted block">Student Price:</span>
                  <span className="font-bold text-text-primary text-sm">
                    {isFree ? "Free" : `${totalCost} Credits (৳${bdtEquivalent})`}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted block">Max Enrollment:</span>
                  <span className="font-bold text-text-primary text-sm">
                    {capacity} Students
                  </span>
                </div>
                <div>
                  <span className="text-text-muted block">Total Gross Pool:</span>
                  <span className="font-bold text-emerald text-sm">
                    {isFree ? "0 Credits" : `${grossEscrowCredits} Credits (৳${grossEscrowBdt})`}
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Gate Notice */}
            <div className="p-4 rounded-2xl bg-surface-raised border border-border flex items-start gap-3 text-xs text-text-secondary">
              <ShieldCheck className="size-4 text-emerald shrink-0 mt-0.5" />
              <p>
                Per platform rules, submitted cohorts enter <strong className="text-text-primary font-bold">PENDING_APPROVAL</strong> status. Once approved by an Admin, you can publish and invite students. Mentors may have 1 active published cohort at a time.
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Publish */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-serif text-xl font-bold text-text-primary">
                4. Review &amp; Submit Cohort
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                Review your program details before submitting to Admin moderation.
              </p>
            </div>

            {/* Preview Card */}
            <div className="p-6 rounded-2xl bg-surface-raised/40 border border-border shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20">
                  <Clock className="size-3.5" /> Draft — Ready for Admin Review
                </span>

                <span className="text-xs font-semibold text-text-muted">
                  {durationWeeks} Weeks • Max {capacity} Seats
                </span>
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-text-primary">
                  {title}
                </h3>
                <p className="text-xs text-text-secondary mt-2 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {techStackTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-surface border border-border text-text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Specs Grid */}
              <div className="pt-4 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-text-muted block">Duration</span>
                  <strong className="text-text-primary">{durationWeeks} Weeks</strong>
                </div>
                <div>
                  <span className="text-text-muted block">Seat Capacity</span>
                  <strong className="text-text-primary">{capacity} Students</strong>
                </div>
                <div>
                  <span className="text-text-muted block">Student Price</span>
                  <strong className="text-text-primary">
                    {isFree ? "Free (0 Credits)" : `${totalCost} Credits`}
                  </strong>
                </div>
                <div>
                  <span className="text-text-muted block">BDT Value</span>
                  <strong className="text-emerald">
                    {isFree ? "৳0 BDT" : `৳${bdtEquivalent} BDT`}
                  </strong>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber/20 text-xs text-text-secondary flex items-start gap-2.5">
              <AlertCircle className="size-4 text-amber shrink-0 mt-0.5" />
              <p>
                After submitting, you can manage syllabus milestones, add live Google Meet/Zoom session links, and attach resources inside your Cohort Workspace.
              </p>
            </div>
          </div>
        )}

        {/* 4. Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-border/80">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBack}
            disabled={currentStep === 1 || createMutation.isPending}
            className="text-xs border-border gap-1.5"
          >
            <ArrowLeft className="size-3.5" /> Back
          </Button>

          <div className="flex items-center gap-3">
            {currentStep < 4 ? (
              <Button
                type="button"
                size="sm"
                onClick={handleNext}
                className="bg-amber text-white hover:bg-amber-hover font-semibold text-xs h-9 px-5 shadow-2xs gap-1.5 cursor-pointer"
              >
                Continue <ArrowRight className="size-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={handleSubmit}
                disabled={createMutation.isPending}
                className="bg-amber text-white hover:bg-amber-hover font-semibold text-xs h-10 px-6 shadow-2xs gap-1.5 cursor-pointer"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" /> Submitting Cohort...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" /> Submit for Admin Approval
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
