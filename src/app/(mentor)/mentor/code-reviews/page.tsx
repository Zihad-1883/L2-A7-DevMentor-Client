"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Code2,
  Zap,
  Layers,
  Coins,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  FileCode2,
  ExternalLink,
  Lock,
  ArrowRight,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import EmptyState from "@/components/shared/EmptyState";
import ReviewPoolCard from "@/features/code-review/ReviewPoolCard";
import { codeReviewService, codeReviewCache } from "@/services/code-review.service";
import type {
  CodeReviewRequestItem,
  CodeReviewTier,
} from "@/types/code-review.types";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

const LANGUAGES = [
  { value: "ALL", label: "All Languages" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "sql", label: "SQL" },
];

export default function MentorCodeReviewsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const now = useCurrentTime();

  const [activeTab, setActiveTab] = React.useState<"pool" | "in_progress">("pool");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [tierFilter, setTierFilter] = React.useState<"ALL" | CodeReviewTier>("ALL");
  const [languageFilter, setLanguageFilter] = React.useState("ALL");

  const [inspectedRequest, setInspectedRequest] =
    React.useState<CodeReviewRequestItem | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);

  const isInspectedLockedByOther = Boolean(
    inspectedRequest &&
    inspectedRequest.status === "PREVIEW_LOCKED" &&
    inspectedRequest.previewExpiresAt &&
    new Date(inspectedRequest.previewExpiresAt).getTime() > now &&
    (!user?.id || inspectedRequest.previewMentorId !== user.id)
  );

  // 1. Fetch Open Code Review Pool from Backend
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [
      "mentor",
      "code-reviews",
      "pool",
      {
        tier: tierFilter !== "ALL" ? tierFilter : undefined,
        language: languageFilter !== "ALL" ? languageFilter : undefined,
        search: searchQuery.trim() || undefined,
      },
    ],
    queryFn: async () => {
      const params: Record<string, string | number> = {};
      if (tierFilter !== "ALL") params.tier = tierFilter;
      if (languageFilter !== "ALL") params.language = languageFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      params.limit = 50;

      const res = await codeReviewService.getOpenPool(params);
      return res;
    },
    staleTime: 1000 * 15,
  });

  const rawRequests =
    (data as unknown as { requests?: CodeReviewRequestItem[]; data?: CodeReviewRequestItem[] })?.requests ||
    (data as unknown as { requests?: CodeReviewRequestItem[]; data?: CodeReviewRequestItem[] })?.data ||
    [];

  // 2. Mentor's In-Progress Reviews (Active preview locks & claimed delivery workspaces)
  const inProgressReviews = React.useMemo(() => {
    return codeReviewCache.getMyInProgressReviews(user?.id);
  }, [user?.id, data, now]);

  // 3. Filter Available Requests Pool:
  const availableRequests: CodeReviewRequestItem[] = React.useMemo(() => {
    const list = Array.isArray(rawRequests) ? rawRequests : [];
    return list.filter((r) => {
      if (
        r.status === "CLAIMED" ||
        r.status === "DELIVERED" ||
        r.status === "COMPLETED" ||
        r.status === "CANCELLED"
      ) {
        return false;
      }

      if (r.status === "PREVIEW_LOCKED") {
        const isExpired =
          r.previewExpiresAt == null ||
          new Date(r.previewExpiresAt).getTime() <= now;

        if (isExpired) {
          return true;
        }

        return false;
      }

      return true;
    });
  }, [rawRequests, now]);
  const totalOpenCount = availableRequests.length;
  const quickCount = availableRequests.filter((r) => r.tier === "QUICK").length;
  const deepCount = availableRequests.filter((r) => r.tier === "DEEP").length;
  const totalBountyCredits = availableRequests.reduce(
    (acc, curr) => acc + (curr.creditReward || (curr.tier === "QUICK" ? 10 : 50)),
    0
  );

  const previewLockMutation = useMutation({
    mutationFn: (requestId: string) =>
      codeReviewService.previewLock(requestId, user?.id),
    onSuccess: (updated) => {
      toast.success(
        "10-Minute Preview Lock acquired! Opening your code review workspace..."
      );
      if (updated) {
        codeReviewCache.save(updated, user?.id);
        queryClient.setQueryData(["code-review", updated.id], updated);
      }
      setInspectedRequest(null);
      refetch();
      if (updated?.id) {
        router.push(`/mentor/code-reviews/${updated.id}`);
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to acquire preview lock.");
    },
  });

  const handleCopyCode = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setIsCopied(true);
    toast.success("Code snippet copied to clipboard.");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* 1. Header Overview & Economics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20">
              <Code2 className="size-3.5" /> Async Code Review Pool
            </span>
            <span className="text-xs font-semibold text-text-muted">•</span>
            <span className="text-xs text-text-muted font-medium">
              SLA Backed Escrow
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Code Review Delivery Hub
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
            Browse submitted codebases from student developers. Lock 10-minute preview windows to inspect complexity, claim requests, and deliver architectural feedback within SLA.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            className="text-xs border-border bg-surface hover:bg-surface-raised gap-1.5 h-9 cursor-pointer"
          >
            <Clock className="size-3.5 text-amber" /> Refresh Pool
          </Button>
        </div>
      </div>

      {/* 2. Key Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex items-center gap-3.5 shadow-2xs">
          <div className="size-11 rounded-xl bg-amber-light text-amber flex items-center justify-center shrink-0">
            <Code2 className="size-5" />
          </div>
          <div>
            <span className="text-xs text-text-muted font-medium block">
              Available Requests
            </span>
            <span className="text-xl sm:text-2xl font-bold text-text-primary font-serif">
              {totalOpenCount}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex items-center gap-3.5 shadow-2xs">
          <div className="size-11 rounded-xl bg-amber-light text-amber flex items-center justify-center shrink-0">
            <Zap className="size-5" />
          </div>
          <div>
            <span className="text-xs text-text-muted font-medium block">
              Quick Reviews (2h SLA)
            </span>
            <span className="text-xl sm:text-2xl font-bold text-text-primary font-serif">
              {quickCount}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex items-center gap-3.5 shadow-2xs">
          <div className="size-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Layers className="size-5" />
          </div>
          <div>
            <span className="text-xs text-text-muted font-medium block">
              Deep Reviews (24h SLA)
            </span>
            <span className="text-xl sm:text-2xl font-bold text-text-primary font-serif">
              {deepCount}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex items-center gap-3.5 shadow-2xs">
          <div className="size-11 rounded-xl bg-emerald-light text-emerald flex items-center justify-center shrink-0">
            <Coins className="size-5" />
          </div>
          <div>
            <span className="text-xs text-text-muted font-medium block">
              Total Bounty Pool
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold text-text-primary font-serif">
                {totalBountyCredits}
              </span>
              <span className="text-xs font-semibold text-text-muted">Cr</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tab Selector: Available Pool vs My In-Progress Reviews */}
      <div className="flex items-center gap-3 border-b border-border/80 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("pool")}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === "pool"
            ? "bg-amber text-white shadow-xs"
            : "bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-raised border border-border"
            }`}
        >
          <Code2 className="size-4" />
          <span>Available Requests Pool</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${activeTab === "pool"
              ? "bg-white/20 text-white"
              : "bg-surface-raised text-text-muted border border-border"
              }`}
          >
            {availableRequests.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("in_progress")}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === "in_progress"
            ? "bg-amber text-white shadow-xs"
            : "bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-raised border border-border"
            }`}
        >
          <Clock className="size-4" />
          <span>My In-Progress Reviews</span>
          {inProgressReviews.length > 0 ? (
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${activeTab === "in_progress"
                ? "bg-white text-amber"
                : "bg-amber text-white shadow-xs"
                }`}
            >
              {inProgressReviews.length} Active
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-surface-raised text-text-muted border border-border">
              0
            </span>
          )}
        </button>
      </div>

      {activeTab === "pool" && (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="size-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search by title, description, or target files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-xs bg-surface-raised rounded-xl"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted mr-1 flex items-center gap-1">
                <Filter className="size-3" /> Tier:
              </span>

              <button
                type="button"
                onClick={() => setTierFilter("ALL")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${tierFilter === "ALL"
                  ? "bg-amber text-white"
                  : "bg-surface-raised text-text-secondary hover:text-text-primary border border-border"
                  }`}
              >
                All Tiers
              </button>

              <button
                type="button"
                onClick={() => setTierFilter("QUICK")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${tierFilter === "QUICK"
                  ? "bg-amber text-white"
                  : "bg-surface-raised text-text-secondary hover:text-text-primary border border-border"
                  }`}
              >
                <Zap className="size-3" /> Quick (10 Cr)
              </button>

              <button
                type="button"
                onClick={() => setTierFilter("DEEP")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${tierFilter === "DEEP"
                  ? "bg-amber text-white"
                  : "bg-surface-raised text-text-secondary hover:text-text-primary border border-border"
                  }`}
              >
                <Layers className="size-3" /> Deep (50 Cr)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted shrink-0">
                Language:
              </label>
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="h-9 px-3 text-xs bg-surface-raised border border-border rounded-xl text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-amber/50 cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-6 rounded-3xl bg-surface border border-border animate-pulse space-y-4"
                >
                  <div className="flex justify-between">
                    <div className="h-5 w-28 bg-border/80 rounded" />
                    <div className="h-5 w-24 bg-border/80 rounded" />
                  </div>
                  <div className="h-6 w-3/4 bg-border/80 rounded" />
                  <div className="h-16 w-full bg-border/50 rounded-xl" />
                  <div className="h-8 w-full bg-border/40 rounded" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="p-8 rounded-3xl bg-surface border border-rose/20 text-center space-y-3">
              <AlertCircle className="size-8 text-rose mx-auto" />
              <h3 className="text-sm font-bold text-text-primary">
                Failed to load code review pool
              </h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong fetching available reviews."}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => refetch()}
                className="text-xs cursor-pointer"
              >
                Try Again
              </Button>
            </div>
          ) : availableRequests.length === 0 ? (
            <EmptyState
              title="No code reviews available in pool"
              description={
                searchQuery || tierFilter !== "ALL" || languageFilter !== "ALL"
                  ? "No review requests match your active filters. Try resetting your search or tier selector."
                  : "There are currently no open code review requests from students. Check back soon!"
              }
              icon={Code2}
              action={
                searchQuery || tierFilter !== "ALL" || languageFilter !== "ALL"
                  ? {
                    label: "Clear All Filters",
                    onClick: () => {
                      setSearchQuery("");
                      setTierFilter("ALL");
                      setLanguageFilter("ALL");
                    },
                  }
                  : {
                    label: "Refresh Pool",
                    onClick: () => refetch(),
                  }
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {availableRequests.map((request) => (
                <ReviewPoolCard
                  key={request.id}
                  request={request}
                  onInspect={(req) => setInspectedRequest(req)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "in_progress" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-serif text-text-primary">
                Your Active Reservations &amp; In-Progress Workspaces
              </h2>
              <p className="text-xs text-text-secondary">
                You can leave the UI and return anytime. Active 10-minute preview locks and delivery workspaces remain accessible here.
              </p>
            </div>
          </div>

          {inProgressReviews.length === 0 ? (
            <EmptyState
              title="No in-progress code reviews"
              description="You do not hold any active preview locks or claimed reviews right now. Browse the available requests pool to lock a preview or claim a request."
              icon={Clock}
              action={{
                label: "Browse Available Requests",
                onClick: () => setActiveTab("pool"),
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {inProgressReviews.map((item) => {
                const isQuick = item.tier === "QUICK";
                const reward = item.creditReward || (isQuick ? 10 : 50);
                const bdt = reward * 4;

                const previewSecsLeft = item.previewExpiresAt
                  ? Math.max(0, Math.floor((new Date(item.previewExpiresAt).getTime() - now) / 1000))
                  : 0;
                const previewMins = Math.floor(previewSecsLeft / 60);
                const previewSecs = previewSecsLeft % 60;

                const slaSecsLeft = item.deliveryDeadline
                  ? Math.max(0, Math.floor((new Date(item.deliveryDeadline).getTime() - now) / 1000))
                  : 0;
                const slaHrs = Math.floor(slaSecsLeft / 3600);
                const slaMins = Math.floor((slaSecsLeft % 3600) / 60);

                return (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between p-6 rounded-3xl bg-surface border border-border shadow-xs hover:border-amber/40 transition-all space-y-5"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${isQuick
                              ? "bg-amber-light text-amber border-amber/20"
                              : "bg-indigo-50 text-indigo-600 border-indigo-200"
                              }`}
                          >
                            {isQuick ? <Zap className="size-3.5" /> : <Layers className="size-3.5" />}
                            {item.tier} Review
                          </span>

                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-surface-raised border border-border text-text-primary capitalize">
                            <Code2 className="size-3 text-text-muted" />
                            {item.language || "TypeScript"}
                          </span>

                          {item.status === "PREVIEW_LOCKED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-50 text-amber border border-amber/30">
                              <Lock className="size-3" /> Preview Lock Active
                            </span>
                          )}

                          {item.status === "CLAIMED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-200">
                              <Clock className="size-3" /> Claimed (In Delivery)
                            </span>
                          )}

                          {item.status === "DELIVERED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200">
                              <CheckCircle2 className="size-3" /> Feedback Delivered
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-surface-raised border border-border/80">
                          <Coins className="size-4 text-amber" />
                          <span className="font-bold text-sm text-text-primary">
                            +{reward} Credits
                          </span>
                          <span className="text-[11px] font-semibold text-emerald">
                            (≈ ৳{bdt} BDT)
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-serif text-lg font-bold text-text-primary line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {item.status === "PREVIEW_LOCKED" && (
                        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber/30 text-amber-950 dark:text-amber-200 space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-amber flex items-center gap-1.5">
                              <Lock className="size-3.5" /> 10-Minute Lock Countdown:
                            </span>
                            <span className="font-mono text-sm text-amber font-bold">
                              {previewMins}:{previewSecs < 10 ? "0" : ""}{previewSecs} remaining
                            </span>
                          </div>
                          <p className="text-[11px] text-text-secondary leading-normal">
                            You have exclusive reservation. Open the workspace to claim before the timer expires!
                          </p>
                        </div>
                      )}

                      {item.status === "CLAIMED" && (
                        <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-indigo-950 space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-indigo-700 flex items-center gap-1.5">
                              <Clock className="size-3.5" /> Delivery SLA Clock:
                            </span>
                            <span className="font-mono text-sm text-indigo-700 font-bold">
                              {slaHrs > 0 ? `${slaHrs}h ${slaMins}m` : `${slaMins}m`} left
                            </span>
                          </div>
                          <p className="text-[11px] text-indigo-800 leading-normal">
                            Target deadline:{" "}
                            <strong>
                              {item.deliveryDeadline ? formatDate(item.deliveryDeadline) : "Active"}
                            </strong>
                            . Submit refactored code and architectural feedback.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border/70 flex items-center justify-between">
                      <span className="text-xs text-text-muted">
                        Student: <strong>{item.student?.name || "Student"}</strong>
                      </span>

                      <Button
                        size="sm"
                        onClick={() => router.push(`/mentor/code-reviews/${item.id}`)}
                        className="bg-amber text-white hover:bg-amber-hover font-semibold text-xs h-9 px-4 gap-1.5 cursor-pointer shadow-xs"
                      >
                        {item.status === "PREVIEW_LOCKED" ? (
                          <>
                            <span>Resume Preview &amp; Claim</span>
                            <ArrowRight className="size-3.5" />
                          </>
                        ) : item.status === "CLAIMED" ? (
                          <>
                            <span>Open Workspace &amp; Deliver</span>
                            <ArrowRight className="size-3.5" />
                          </>
                        ) : (
                          <>
                            <span>View Review Workspace</span>
                            <ArrowRight className="size-3.5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {inspectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-3xl rounded-3xl bg-surface border border-border shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-border/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${inspectedRequest.tier === "QUICK"
                      ? "bg-amber-light text-amber border-amber/20"
                      : "bg-indigo-50 text-indigo-600 border-indigo-200"
                      }`}
                  >
                    {inspectedRequest.tier === "QUICK" ? (
                      <Zap className="size-3" />
                    ) : (
                      <Layers className="size-3" />
                    )}
                    {inspectedRequest.tier} Review
                  </span>

                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-raised border border-border text-text-primary capitalize">
                    {inspectedRequest.language || "code"}
                  </span>

                  <span className="text-xs font-bold text-amber flex items-center gap-1">
                    <Coins className="size-3.5" />
                    +{inspectedRequest.creditReward ||
                      (inspectedRequest.tier === "QUICK" ? 10 : 50)}{" "}
                    Credits (≈ ৳
                    {(inspectedRequest.creditReward ||
                      (inspectedRequest.tier === "QUICK" ? 10 : 50)) * 4}{" "}
                    BDT)
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-text-primary">
                  {inspectedRequest.title}
                </h3>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => setInspectedRequest(null)}
                className="size-8 rounded-full hover:bg-surface-raised text-text-muted hover:text-text-primary cursor-pointer shrink-0"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Student Request &amp; Question:
              </span>
              <div className="p-3.5 rounded-2xl bg-surface-raised border border-border text-xs text-text-secondary leading-relaxed whitespace-pre-line max-h-32 overflow-y-auto">
                {inspectedRequest.description}
              </div>
            </div>

            {inspectedRequest.githubRepoUrl && (
              <div className="p-3 rounded-2xl bg-surface-raised border border-border flex items-center justify-between text-xs">
                <span className="text-text-muted">
                  Repository:{" "}
                  <strong className="text-text-primary">
                    {inspectedRequest.githubRepoUrl.replace("https://github.com/", "")}
                  </strong>
                </span>
                <a
                  href={inspectedRequest.githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber font-semibold hover:underline"
                >
                  View on GitHub <ExternalLink className="size-3" />
                </a>
              </div>
            )}

            {inspectedRequest.codeSnippet && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                    <FileCode2 className="size-3.5 text-amber" /> Submitted Code Preview:
                  </span>
                </div>

                <div className="rounded-2xl bg-[#141416] border border-neutral-800 overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between px-3.5 py-2 bg-[#1b1b1f] border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="size-2 rounded-full bg-rose-500/80" />
                        <span className="size-2 rounded-full bg-amber-500/80" />
                        <span className="size-2 rounded-full bg-emerald-500/80" />
                      </div>
                      <span className="font-mono text-[11px] text-neutral-300 ml-1">
                        {inspectedRequest.specificFiles ||
                          `snippet.${inspectedRequest.language || "ts"}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-neutral-400">
                        {inspectedRequest.codeSnippet.split("\n").length} lines
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleCopyCode(inspectedRequest.codeSnippet || "")
                        }
                        className="text-[11px] h-6 px-2 gap-1 text-neutral-300 hover:text-white hover:bg-neutral-800 cursor-pointer"
                      >
                        {isCopied ? (
                          <>
                            <Check className="size-3 text-emerald" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="size-3" /> Copy Snippet
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 font-mono text-xs text-[#f4f4f5] overflow-auto max-h-80 leading-relaxed bg-[#141416]">
                    <pre className="font-mono leading-relaxed selection:bg-amber-600/40 selection:text-white">
                      <code>{inspectedRequest.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {isInspectedLockedByOther && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber/30 text-amber-950 dark:text-amber-200 flex items-start gap-3">
                <div className="size-8 rounded-xl bg-amber/20 text-amber flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="size-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber">
                    Preview Lock Active — Reserved by Another Mentor
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Another mentor currently holds the 10-minute preview lock on this code review. You cannot claim this request or enter the delivery workspace until their reservation expires.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border/60">
              <div className="text-xs text-text-muted flex items-center gap-1.5">
                <Clock className="size-3.5 text-amber" />
                Delivery SLA:{" "}
                <strong className="text-text-primary">
                  {inspectedRequest.tier === "QUICK" ? "2 Hours" : "24 Hours"}
                </strong>
              </div>

              {isInspectedLockedByOther ? (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    disabled
                    variant="outline"
                    className="text-xs h-9 px-3 gap-1.5 border-border opacity-70 cursor-not-allowed text-text-muted"
                  >
                    <Lock className="size-3.5 text-amber" /> Reserved by Another Mentor
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setInspectedRequest(null)}
                    className="text-xs h-9 px-4 border-border hover:bg-surface-raised cursor-pointer"
                  >
                    Close Preview
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setInspectedRequest(null)}
                    className="text-xs h-9 px-4 border-border hover:bg-surface-raised cursor-pointer"
                  >
                    Cancel
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => previewLockMutation.mutate(inspectedRequest.id)}
                    disabled={previewLockMutation.isPending}
                    className="bg-amber text-white hover:bg-amber-hover font-bold text-xs h-9 px-5 shadow-xs gap-2 cursor-pointer"
                    title="Lock this request for 10 minutes and open the workspace to claim and review"
                  >
                    {previewLockMutation.isPending ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" /> Locking &amp; Opening Workspace...
                      </>
                    ) : (
                      <>
                        <Lock className="size-3.5" /> Lock 10-Min Preview &amp; Review
                        <ArrowRight className="size-3.5" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
