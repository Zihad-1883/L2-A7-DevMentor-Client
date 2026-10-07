"use client";

import * as React from "react";
import Link from "next/link";
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
  Sparkles,
  ShieldCheck,
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
  ChevronRight,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/components/providers/AuthProvider";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmModal from "@/components/shared/ConfirmModal";
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

  // Search & Filters
  const [searchQuery, setSearchQuery] = React.useState("");
  const [tierFilter, setTierFilter] = React.useState<"ALL" | CodeReviewTier>("ALL");
  const [languageFilter, setLanguageFilter] = React.useState("ALL");

  // Inspection Drawer / Modal State
  const [inspectedRequest, setInspectedRequest] =
    React.useState<CodeReviewRequestItem | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);

  // Check if currently inspected request is preview locked by another mentor
  const isInspectedLockedByOther = Boolean(
    inspectedRequest &&
    inspectedRequest.status === "PREVIEW_LOCKED" &&
    inspectedRequest.previewExpiresAt &&
    new Date(inspectedRequest.previewExpiresAt).getTime() > Date.now() &&
    (!user?.id || inspectedRequest.previewMentorId !== user.id)
  );

  // Claim Confirmation Modal
  const [requestToClaim, setRequestToClaim] =
    React.useState<CodeReviewRequestItem | null>(null);

  // 1. Fetch Open Code Review Pool
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

  // Merge mentor's active preview locks into the pool so they NEVER disappear for this mentor
  const myActiveLocks = React.useMemo(() => {
    return codeReviewCache.getMyActiveLocks(user?.id);
  }, [data, user?.id]);

  const requests: CodeReviewRequestItem[] = React.useMemo(() => {
    const list = Array.isArray(rawRequests) ? [...rawRequests] : [];
    myActiveLocks.forEach((locked) => {
      const idx = list.findIndex((r) => r.id === locked.id);
      if (idx === -1) {
        list.unshift(locked);
      } else {
        list[idx] = { ...list[idx], ...locked };
      }
    });
    return list;
  }, [rawRequests, myActiveLocks]);

  // Metrics Calculations
  const totalOpenCount = requests.length;
  const quickCount = requests.filter((r) => r.tier === "QUICK").length;
  const deepCount = requests.filter((r) => r.tier === "DEEP").length;
  const totalBountyCredits = requests.reduce(
    (acc, curr) => acc + (curr.creditReward || (curr.tier === "QUICK" ? 10 : 50)),
    0
  );

  // Mutation: Acquire 10-Minute Preview Lock
  const previewLockMutation = useMutation({
    mutationFn: (requestId: string) => codeReviewService.previewLock(requestId),
    onSuccess: (updated) => {
      toast.success(
        "10-Minute Preview Lock acquired! Other mentors cannot claim this request while you inspect it."
      );
      if (updated) {
        codeReviewCache.save(updated);
        queryClient.setQueryData(["code-review", updated.id], updated);
      }
      if (inspectedRequest && updated) {
        setInspectedRequest({ ...inspectedRequest, ...updated });
      }
      refetch();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to acquire preview lock.");
    },
  });

  // Mutation: Officially Claim Request
  const claimMutation = useMutation({
    mutationFn: (requestId: string) => codeReviewService.claimRequest(requestId),
    onSuccess: (updated) => {
      toast.success("Code review claimed! SLA delivery clock has started.");
      setRequestToClaim(null);
      setInspectedRequest(null);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["mentor", "code-reviews"] });
      // Redirect to delivery workspace
      if (updated?.id) {
        router.push(`/mentor/code-reviews/${updated.id}`);
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to claim code review request.");
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
            Browse submitted codebases from student developers. Lock 10-minute preview windows to review complexity, claim requests, and earn escrow credits upon review delivery.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            className="text-xs border-border bg-surface hover:bg-surface-raised gap-1.5 h-9"
          >
            <Clock className="size-3.5 text-amber" /> Refresh Pool
          </Button>
        </div>
      </div>

      {/* 2. Top Metrics Strip (4 Stat Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
            Open in Pool
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-text-primary">
              {totalOpenCount}
            </span>
            <span className="text-[11px] font-semibold text-text-muted">
              requests
            </span>
          </div>
          <span className="text-[11px] text-text-muted block">
            Ready for mentor inspection
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
            Total Bounty Pool
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-amber">
              {totalBountyCredits}
            </span>
            <span className="text-[11px] font-semibold text-emerald">
              ৳{totalBountyCredits * 4} BDT
            </span>
          </div>
          <span className="text-[11px] text-text-muted block">
            100% platform escrow locked
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
            Quick Reviews (10 Cr)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-text-primary">
              {quickCount}
            </span>
            <span className="text-[11px] font-bold text-amber">
              2h SLA Target
            </span>
          </div>
          <span className="text-[11px] text-text-muted block">
            Focused functions & bug fixes
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
            Deep Reviews (50 Cr)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-text-primary">
              {deepCount}
            </span>
            <span className="text-[11px] font-bold text-indigo-600">
              24h SLA Target
            </span>
          </div>
          <span className="text-[11px] text-text-muted block">
            Full architecture & PR teardowns
          </span>
        </div>
      </div>

      {/* 3. Mentor Educational Banner: 3-Step Review Flow */}
      <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber/20 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-amber" />
          <h3 className="font-serif text-sm font-bold text-text-primary">
            How Code Review Delivery Works for Mentors
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-text-secondary pt-1">
          <div className="p-3.5 rounded-2xl bg-surface border border-border/80 space-y-1">
            <span className="font-bold text-text-primary flex items-center gap-1.5">
              <span className="size-5 rounded-full bg-amber-light text-amber font-mono font-bold text-[10px] flex items-center justify-center">
                1
              </span>
              10-Minute Preview Lock
            </span>
            <p className="leading-relaxed">
              Click &ldquo;Inspect Code&rdquo; to review the snippet. You can acquire a 10-min lock to hold the request while reading.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface border border-border/80 space-y-1">
            <span className="font-bold text-text-primary flex items-center gap-1.5">
              <span className="size-5 rounded-full bg-amber-light text-amber font-mono font-bold text-[10px] flex items-center justify-center">
                2
              </span>
              Claim &amp; SLA Clock
            </span>
            <p className="leading-relaxed">
              Officially claim the request to start your delivery clock: <strong>2 Hours</strong> for Quick, <strong>24 Hours</strong> for Deep reviews.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface border border-border/80 space-y-1">
            <span className="font-bold text-text-primary flex items-center gap-1.5">
              <span className="size-5 rounded-full bg-amber-light text-amber font-mono font-bold text-[10px] flex items-center justify-center">
                3
              </span>
              Deliver &amp; 100% Payout
            </span>
            <p className="leading-relaxed">
              Submit refactored code and inline comments. On delivery approval, 100% of escrow credits release directly to your wallet.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border shadow-xs">
        {/* Search */}
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

        {/* Tier Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted mr-1 flex items-center gap-1">
            <Filter className="size-3" /> Tier:
          </span>

          <button
            type="button"
            onClick={() => setTierFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              tierFilter === "ALL"
                ? "bg-amber text-white"
                : "bg-surface-raised text-text-secondary hover:text-text-primary border border-border"
            }`}
          >
            All Tiers
          </button>

          <button
            type="button"
            onClick={() => setTierFilter("QUICK")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
              tierFilter === "QUICK"
                ? "bg-amber text-white"
                : "bg-surface-raised text-text-secondary hover:text-text-primary border border-border"
            }`}
          >
            <Zap className="size-3" /> Quick (10 Cr)
          </button>

          <button
            type="button"
            onClick={() => setTierFilter("DEEP")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
              tierFilter === "DEEP"
                ? "bg-amber text-white"
                : "bg-surface-raised text-text-secondary hover:text-text-primary border border-border"
            }`}
          >
            <Layers className="size-3" /> Deep (50 Cr)
          </button>
        </div>

        {/* Language Filter */}
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

      {/* 5. Code Review Requests Grid */}
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
            {error instanceof Error ? error.message : "Something went wrong fetching available reviews."}
          </p>
          <Button size="sm" variant="outline" onClick={() => refetch()} className="text-xs">
            Try Again
          </Button>
        </div>
      ) : requests.length === 0 ? (
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
          {requests.map((request) => (
            <ReviewPoolCard
              key={request.id}
              request={request}
              onInspect={(req) => setInspectedRequest(req)}
            />
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: Code Snippet Quick Inspector & Preview Lock */}
      {/* ========================================================================= */}
      {inspectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-3xl rounded-3xl bg-surface border border-border shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-border/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      inspectedRequest.tier === "QUICK"
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
                    {inspectedRequest.creditReward ||
                      (inspectedRequest.tier === "QUICK" ? 10 : 50)}{" "}
                    Credits (৳
                    {(inspectedRequest.creditReward ||
                      (inspectedRequest.tier === "QUICK" ? 10 : 50)) * 4}{" "}
                    BDT)
                  </span>

                  {isInspectedLockedByOther && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange/10 border border-orange/20 text-orange flex items-center gap-1">
                      <Lock className="size-3" /> Reserved by Mentor
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-lg font-bold text-text-primary">
                  {inspectedRequest.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setInspectedRequest(null)}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Problem Statement */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text-primary">
                Student Problem Description
              </label>
              <div className="p-3.5 rounded-xl bg-surface-raised border border-border text-xs text-text-secondary leading-relaxed whitespace-pre-line">
                {inspectedRequest.description}
              </div>
            </div>

            {/* Code Snippet Container */}
            {inspectedRequest.codeSnippet && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                  <FileCode2 className="size-3.5 text-amber" /> Submitted Code Snippet
                </label>

                <div className="rounded-2xl bg-[#141416] border border-neutral-800 overflow-hidden shadow-sm">
                  {/* IDE Window Titlebar */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#1b1b1f] border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2.5 rounded-full bg-rose-500/80" />
                        <span className="size-2.5 rounded-full bg-amber-500/80" />
                        <span className="size-2.5 rounded-full bg-emerald-500/80" />
                      </div>
                      <span className="font-mono text-[11px] text-neutral-300 ml-1.5 font-medium">
                        {inspectedRequest.specificFiles || `snippet.${inspectedRequest.language || "ts"}`}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                        {inspectedRequest.language || "code"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-neutral-400">
                        {inspectedRequest.codeSnippet.split("\n").length} lines
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleCopyCode(inspectedRequest.codeSnippet || "")
                        }
                        className="text-[11px] h-7 px-2.5 gap-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 cursor-pointer"
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

                  {/* Code Body with High-Contrast Text */}
                  <div className="p-4 font-mono text-xs text-[#f4f4f5] overflow-auto max-h-80 leading-relaxed bg-[#141416]">
                    <pre className="font-mono leading-relaxed selection:bg-amber-600/40 selection:text-white">
                      <code>{inspectedRequest.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Warning if preview locked by another mentor */}
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

            {/* Action Bar */}
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
                    onClick={() =>
                      previewLockMutation.mutate(inspectedRequest.id)
                    }
                    disabled={previewLockMutation.isPending}
                    className="text-xs h-9 px-3 gap-1.5 border-border cursor-pointer"
                    title="Lock this request for 10 minutes so no other mentor can claim it while you review"
                  >
                    {previewLockMutation.isPending ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" /> Locking...
                      </>
                    ) : (
                      <>
                        <Lock className="size-3.5 text-amber" /> Lock 10-Min Preview
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => setRequestToClaim(inspectedRequest)}
                    className="bg-amber text-white hover:bg-amber-hover font-semibold text-xs h-9 px-4 shadow-2xs gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="size-3.5" /> Claim Review Request
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: Claim Review Request Confirmation Modal */}
      {/* ========================================================================= */}
      <ConfirmModal
        isOpen={Boolean(requestToClaim)}
        title="Claim Code Review Request?"
        description={
          requestToClaim
            ? `You are claiming "${requestToClaim.title}" for ${
                requestToClaim.creditReward ||
                (requestToClaim.tier === "QUICK" ? 10 : 50)
              } Credits (৳${
                (requestToClaim.creditReward ||
                  (requestToClaim.tier === "QUICK" ? 10 : 50)) * 4
              } BDT). The delivery countdown (${
                requestToClaim.tier === "QUICK" ? "2 Hours" : "24 Hours"
              } SLA) will begin immediately upon claiming. Do you want to proceed?`
            : ""
        }
        confirmLabel="Claim & Start SLA Clock"
        variant="success"
        isLoading={claimMutation.isPending}
        onConfirm={async () => {
          if (requestToClaim) {
            await claimMutation.mutateAsync(requestToClaim.id);
          }
        }}
        onClose={() => setRequestToClaim(null)}
      />
    </div>
  );
}
