"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Code2,
  Zap,
  Layers,
  Clock,
  Coins,
  FileCode2,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  GitBranch,
  Video,
  GitPullRequest,
  User,
  ShieldCheck,
  Calendar,
  FileDiff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { codeReviewService, codeReviewCache } from "@/services/code-review.service";
import { usePreviewLock } from "@/hooks/usePreviewLock";
import ClaimReviewButton from "@/features/code-review/ClaimReviewButton";
import PreviewLockButton from "@/features/code-review/PreviewLockButton";
import DeliverReviewForm from "@/features/code-review/DeliverReviewForm";
import type { CodeReviewRequestItem } from "@/types/code-review.types";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function MentorCodeReviewDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const now = useCurrentTime();

  const [isCopiedOriginal, setIsCopiedOriginal] = React.useState(false);
  const [isCopiedRefactored, setIsCopiedRefactored] = React.useState(false);

  const cachedReview = React.useMemo(() => (id ? codeReviewCache.get(id) : null), [id]);

  const {
    data: request,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<CodeReviewRequestItem>({
    queryKey: ["code-review", id],
    queryFn: async () => {
      try {
        return await codeReviewService.getById(id);
      } catch (err) {
        const cached = codeReviewCache.get(id);
        if (cached) return cached;
        throw err;
      }
    },
    enabled: Boolean(id),
    staleTime: 1000 * 30,
    initialData: () => codeReviewCache.get(id) || undefined,
  });

  const {
    formattedTime: previewTimeLeft,
    isExpired: isPreviewExpired,
    isUrgent: isPreviewUrgent,
    percentRemaining: previewPercentRemaining,
    isActive: isPreviewActive,
  } = usePreviewLock({
    expiresAt: request?.previewExpiresAt,
    onExpire: () => {
      toast.warning("Preview lock expired. The request is now open for any mentor to claim.");
      queryClient.invalidateQueries({ queryKey: ["code-review", id] });
      queryClient.invalidateQueries({ queryKey: ["mentor", "code-reviews-pool"] });
    },
  });

  const handleCopy = (text: string, type: "original" | "refactored") => {
    navigator.clipboard.writeText(text);
    if (type === "original") {
      setIsCopiedOriginal(true);
      setTimeout(() => setIsCopiedOriginal(false), 2000);
    } else {
      setIsCopiedRefactored(true);
      setTimeout(() => setIsCopiedRefactored(false), 2000);
    }
    toast.success("Code copied to clipboard");
  };

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12 animate-pulse">
        <div className="h-6 w-36 bg-surface-raised rounded-lg" />
        <div className="h-44 bg-surface-raised rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-surface-raised rounded-3xl" />
          <div className="h-96 bg-surface-raised rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="size-14 rounded-2xl bg-amber-50 text-amber flex items-center justify-center mx-auto border border-amber/20">
          <AlertCircle className="size-7" />
        </div>
        <h2 className="text-xl font-bold font-serif text-text-primary">
          Code Review Request Not Found
        </h2>
        <p className="text-sm text-text-muted">
          This code review request may have already been claimed or does not exist.
        </p>
        <div className="pt-2">
          <Link href="/mentor/code-reviews">
            <Button variant="outline" className="gap-2 cursor-pointer border-border">
              <ArrowLeft className="size-4" /> Back to Code Review Pool
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isQuick = request.tier === "QUICK";
  const rewardCredits = request.creditReward || (isQuick ? 10 : 50);
  const bdtValue = rewardCredits * 4;
  const slaText = isQuick ? "2 Hours SLA" : "24 Hours SLA";

  const isLockExpired = Boolean(
    request.status === "PREVIEW_LOCKED" &&
    (isPreviewExpired || (request.previewExpiresAt != null && new Date(request.previewExpiresAt).getTime() <= now))
  );

  const isPreviewLocked =
    request.status === "PREVIEW_LOCKED" && !isLockExpired;

  const resolvedPreviewMentorId = request.previewMentorId || cachedReview?.previewMentorId;
  const resolvedAssignedMentorId = request.assignedMentorId || cachedReview?.assignedMentorId;

  const isLockedByMe =
    isPreviewLocked &&
    (
      (Boolean(resolvedPreviewMentorId) && resolvedPreviewMentorId === user?.id) ||
      codeReviewCache.getMyInProgressReviews(user?.id).some((r) => r.id === id && r.status === "PREVIEW_LOCKED")
    );

  const isLockedByOther = isPreviewLocked && !isLockedByMe;

  if (isLockedByOther) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-5 animate-in fade-in duration-300">
        <div className="size-16 rounded-2xl bg-amber-500/10 text-amber flex items-center justify-center mx-auto border border-amber/30 shadow-xs">
          <Lock className="size-8 text-amber" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber border border-amber/30">
            Preview Lock Active
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-text-primary">
            Reserved by Another Mentor
          </h2>
          <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
            Another mentor currently holds an exclusive 10-minute preview lock on this code review request. You cannot access this delivery workspace until their preview window expires.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border inline-flex items-center gap-2 text-xs text-text-muted">
          <Clock className="size-4 text-amber" />
          Time remaining on reservation:{" "}
          <strong className="text-text-primary font-mono font-semibold">
            {previewTimeLeft || "Active"}
          </strong>
        </div>

        <div className="pt-3">
          <Link href="/mentor/code-reviews">
            <Button className="bg-amber text-white hover:bg-amber-hover gap-2 cursor-pointer shadow-xs font-semibold h-10 px-5">
              <ArrowLeft className="size-4" /> Back to Code Review Pool
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isClaimedByMe =
    request.status === "CLAIMED" &&
    (
      (Boolean(resolvedAssignedMentorId) && resolvedAssignedMentorId === user?.id) ||
      request.assignedMentor?.id === user?.id ||
      codeReviewCache.getMyInProgressReviews(user?.id).some((r) => r.id === id && r.status === "CLAIMED")
    );

  const isClaimedByOther =
    request.status === "CLAIMED" &&
    !isClaimedByMe;

  // Calculate SLA countdown for claimed requests
  const deliveryDeadlineMs = request.deliveryDeadline
    ? new Date(request.deliveryDeadline).getTime()
    : null;
  const slaSecondsLeft = deliveryDeadlineMs
    ? Math.max(0, Math.floor((deliveryDeadlineMs - now) / 1000))
    : null;
  const formatSlaRemaining = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m left`;
    return `${mins}m ${secs}s left`;
  };

  if (isClaimedByOther) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-5 animate-in fade-in duration-300">
        <div className="size-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-200 shadow-xs">
          <Clock className="size-8 text-indigo-600" />
        </div>
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-200">
            Claimed by Another Mentor
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-text-primary">
            Workspace Assigned
          </h2>
          <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
            This code review request is currently being delivered by another mentor.
          </p>
        </div>
        <div className="pt-3">
          <Link href="/mentor/code-reviews">
            <Button className="bg-amber text-white hover:bg-amber-hover gap-2 cursor-pointer shadow-xs font-semibold h-10 px-5">
              <ArrowLeft className="size-4" /> Back to Code Review Pool
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isDelivered = request.status === "DELIVERED";
  const isCompleted = request.status === "COMPLETED";

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* 1. Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/mentor/code-reviews"
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-amber transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Code Review Pool
        </Link>
      </div>

      {/* 2. Hero Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-xs space-y-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${isQuick
                  ? "bg-amber-light text-amber border-amber/20"
                  : "bg-indigo-50 text-indigo-600 border-indigo-200"
                  }`}
              >
                {isQuick ? <Zap className="size-3.5" /> : <Layers className="size-3.5" />}
                {request.tier} Review
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-text-primary capitalize">
                <Code2 className="size-3.5 text-text-muted" />
                {request.language || "TypeScript"}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${request.status === "COMPLETED"
                  ? "bg-emerald-light text-emerald border-emerald/20"
                  : request.status === "DELIVERED"
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : request.status === "CLAIMED"
                      ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                      : request.status === "PREVIEW_LOCKED"
                        ? "bg-amber-50 text-amber border-amber/20"
                        : "bg-emerald-50 text-emerald border-emerald-200"
                  }`}
              >
                {request.status === "PREVIEW_LOCKED" ? (
                  <>
                    <Lock className="size-3.5" /> Preview Locked
                  </>
                ) : request.status === "CLAIMED" ? (
                  <>
                    <Clock className="size-3.5" /> Claimed (In Delivery)
                  </>
                ) : request.status === "DELIVERED" ? (
                  <>
                    <CheckCircle2 className="size-3.5" /> Delivered
                  </>
                ) : request.status === "COMPLETED" ? (
                  <>
                    <ShieldCheck className="size-3.5" /> Completed
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3.5" /> Open in Pool
                  </>
                )}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold font-serif text-text-primary">
              {request.title}
            </h1>

            <div className="flex items-center gap-3 text-xs text-text-muted flex-wrap">
              <span className="flex items-center gap-1.5">
                <User className="size-3.5 text-text-muted" />
                Requested by:{" "}
                <strong className="text-text-primary font-semibold">
                  {request.student?.name || "Student Developer"}
                </strong>
              </span>

              <span className="text-border">•</span>

              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-text-muted" />
                Submitted: {formatDate(request.createdAt)}
              </span>

              <span className="text-border">•</span>

              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-amber" />
                Target SLA: {slaText}
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-raised border border-border/80 flex lg:flex-col items-center justify-between gap-3 text-right lg:min-w-[180px]">
            <div className="text-left lg:text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
                Bounty Reward
              </span>
              <div className="flex items-center gap-1.5 text-amber font-bold text-xl sm:text-2xl">
                <Coins className="size-6 text-amber" />
                <span>{rewardCredits} Credits</span>
              </div>
            </div>
            <div className="text-xs font-semibold text-text-secondary bg-surface px-3 py-1 rounded-full border border-border">
              ≈ ৳{bdtValue} BDT (100% Payout)
            </div>
          </div>
        </div>

        {/* 3. Expired Preview Lock Alert Banner */}
        {isLockExpired && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber/30 text-amber-950 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-amber/20 text-amber flex items-center justify-center shrink-0">
                <Sparkles className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber">
                  Preview Lock Expired — Open for Claim
                </h4>
                <p className="text-xs text-text-secondary pt-0.5">
                  The previous 10-minute preview reservation has expired without being claimed. Any mentor can now claim this code review request.
                </p>
              </div>
            </div>
            <ClaimReviewButton
              request={request}
              onClaimSuccess={() => refetch()}
              size="sm"
            />
          </div>
        )}

        {/* 4. 10-Minute Preview Lock Countdown Banner */}
        {isPreviewLocked && (
          <div
            className={`p-4 rounded-2xl border transition-all ${isLockedByMe
              ? isPreviewUrgent
                ? "bg-rose-50/70 border-rose-300 text-rose-900"
                : "bg-amber-50/70 border-amber/30 text-amber-950"
              : "bg-surface-raised border-border text-text-secondary"
              }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${isPreviewUrgent
                    ? "bg-rose-100 text-rose-600 animate-pulse"
                    : "bg-amber-light text-amber"
                    }`}
                >
                  <Lock className="size-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold">
                      {isLockedByMe
                        ? "Exclusive Preview Reservation Active"
                        : "Reserved by Another Mentor"}
                    </h4>
                    <span className="font-mono text-sm font-bold px-2.5 py-0.5 rounded-full bg-surface border border-border">
                      {previewTimeLeft} remaining
                    </span>
                  </div>
                  <p className="text-xs opacity-90 pt-0.5">
                    {isLockedByMe
                      ? isPreviewUrgent
                        ? "⚠️ Less than 2 minutes left! Claim this review request now before it expires and returns to the pool."
                        : "You have 10 minutes of exclusive access to review this code without competition. Claim whenever ready."
                      : "Another mentor is currently inspecting this request. It will return to the open pool if not claimed."}
                  </p>
                </div>
              </div>

              {isLockedByMe && (
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <ClaimReviewButton
                    request={request}
                    onClaimSuccess={() => refetch()}
                    size="sm"
                  />
                </div>
              )}
            </div>

            {isLockedByMe && (
              <div className="w-full bg-border/50 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${isPreviewUrgent ? "bg-rose-500" : "bg-amber"
                    }`}
                  style={{ width: `${previewPercentRemaining}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* 5. Active Delivery SLA Target Banner */}
        {request.status === "CLAIMED" && (
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-indigo-950">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Clock className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-indigo-950">
                  Active Delivery SLA Clock: {slaText}
                </h4>
                <p className="text-xs text-indigo-800">
                  Target deadline:{" "}
                  <strong>
                    {request.deliveryDeadline
                      ? formatDate(request.deliveryDeadline)
                      : "Pending calculation"}
                  </strong>
                  . Deliver your refactored code and feedback below.
                </p>
              </div>
            </div>

            <div className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-indigo-200 text-indigo-700 self-start sm:self-center font-mono">
              {slaSecondsLeft !== null ? formatSlaRemaining(slaSecondsLeft) : "Clock Running"}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-surface border border-border space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
              Student Problem Description
            </h3>
            <div className="p-4 rounded-2xl bg-surface-raised border border-border text-xs text-text-secondary leading-relaxed whitespace-pre-line">
              {request.description}
            </div>
          </div>

          {request.githubRepoUrl && (
            <div className="p-5 rounded-3xl bg-surface border border-border space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                <GithubIcon className="size-4" /> GitHub Repository Context
              </h3>
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-raised border border-border text-xs flex-wrap gap-2">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-semibold text-text-primary truncate font-mono">
                    {request.githubRepoUrl.replace("https://github.com/", "")}
                  </span>
                  {request.branchName && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-text-secondary">
                      <GitBranch className="size-3 text-text-muted" /> {request.branchName}
                    </span>
                  )}
                </div>

                <a
                  href={request.githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber hover:underline ml-auto"
                >
                  View Repo <ExternalLink className="size-3.5" />
                </a>
              </div>

              {request.specificFiles && (
                <div className="text-xs text-text-secondary space-y-1">
                  <span className="font-semibold text-text-primary">Target Files: </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-raised border border-border">
                    {request.specificFiles}
                  </span>
                </div>
              )}
            </div>
          )}

          {request.attachmentUrl && (
            <div className="p-5 rounded-3xl bg-surface border border-border space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                <FileDiff className="size-4 text-amber" /> Attached Git Diff Patch / Source File
              </h3>
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-light/30 border border-amber/30 text-xs flex-wrap gap-2">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-semibold text-text-primary truncate font-mono">
                    {request.attachmentName || "Attached Patch File"}
                  </span>
                  {request.attachmentSize && (
                    <span className="text-[11px] text-text-muted">
                      ({Math.round(request.attachmentSize / 1024)} KB)
                    </span>
                  )}
                </div>

                <a
                  href={request.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber hover:underline ml-auto"
                >
                  Download / View Patch <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>
          )}

          {request.codeSnippet && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                  <FileCode2 className="size-3.5 text-amber" /> Submitted Code Snippet
                </h3>
              </div>

              <div className="rounded-2xl bg-[#141416] border border-neutral-800 overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#1b1b1f] border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-rose-500/80" />
                      <span className="size-2.5 rounded-full bg-amber-500/80" />
                      <span className="size-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="font-mono text-[11px] text-neutral-300 ml-1.5 font-medium">
                      {request.specificFiles || `snippet.${request.language || "ts"}`}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">
                      {request.language || "code"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-neutral-400">
                      {request.codeSnippet.split("\n").length} lines
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(request.codeSnippet || "", "original")}
                      className="text-[11px] h-7 px-2.5 gap-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 cursor-pointer"
                    >
                      {isCopiedOriginal ? (
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

                <div className="p-4 font-mono text-xs text-[#f4f4f5] overflow-auto max-h-[500px] leading-relaxed bg-[#141416]">
                  <pre className="font-mono leading-relaxed selection:bg-amber-600/40 selection:text-white">
                    <code>{request.codeSnippet}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6">
          {(request.status === "OPEN" || isLockExpired) && (
            <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs space-y-6">
              <div className="space-y-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isLockExpired
                    ? "bg-emerald-50 text-emerald border border-emerald-200"
                    : "bg-amber-light text-amber"
                  }`}>
                  <Sparkles className="size-3.5" />
                  {isLockExpired ? "Lock Expired — Open For Claim" : "Claim Workspace"}
                </span>
                <h3 className="text-lg font-bold font-serif text-text-primary">
                  {isLockExpired ? "Preview Lock Expired — Open to Claim" : "Review & Claim This Request"}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {isLockExpired
                    ? "The previous 10-minute preview lock expired without being claimed. You can claim this code review immediately to secure your bounty."
                    : `Before claiming, you can lock this request for 10 minutes to inspect the code without anyone else taking it. Once claimed, your ${slaText} begins.`}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-raised border border-border space-y-2 text-xs text-text-secondary">
                <div className="flex items-center justify-between">
                  <span>Credit Bounty:</span>
                  <strong className="text-amber font-bold text-sm">+{rewardCredits} Credits</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>BDT Cash Value:</span>
                  <strong className="text-text-primary font-semibold">≈ ৳{bdtValue} BDT</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery SLA:</span>
                  <strong className="text-text-primary font-semibold">{slaText}</strong>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <ClaimReviewButton
                  request={request}
                  onClaimSuccess={() => refetch()}
                  className="w-full h-11 text-sm font-bold"
                />

                <PreviewLockButton
                  request={request}
                  onLockSuccess={() => refetch()}
                  className="w-full h-10 text-xs font-medium"
                />
              </div>
            </div>
          )}

          {request.status === "PREVIEW_LOCKED" && !isLockExpired && isLockedByMe && (
            <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs space-y-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber text-xs font-bold uppercase tracking-wider border border-amber/20">
                  <Lock className="size-3.5" /> Preview Lock Active
                </span>
                <h3 className="text-lg font-bold font-serif text-text-primary">
                  Your Exclusive Reservation
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  You currently hold the exclusive 10-minute preview lock ({previewTimeLeft} remaining). Claim now to officially start your {slaText} delivery clock.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-raised border border-border space-y-2 text-xs text-text-secondary">
                <div className="flex items-center justify-between">
                  <span>Preview Time Remaining:</span>
                  <strong className="text-amber font-mono font-bold text-sm">{previewTimeLeft}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Credit Bounty:</span>
                  <strong className="text-amber font-bold text-sm">+{rewardCredits} Credits</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery SLA:</span>
                  <strong className="text-text-primary font-semibold">{slaText}</strong>
                </div>
              </div>

              <div className="pt-2">
                <ClaimReviewButton
                  request={request}
                  onClaimSuccess={() => refetch()}
                  className="w-full h-11 text-sm font-bold"
                />
              </div>
            </div>
          )}

          {request.status === "CLAIMED" && (
            <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs space-y-6">
              <div className="space-y-1.5 border-b border-border/80 pb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider border border-indigo-200">
                  <Clock className="size-3.5" /> Deliver Code Review
                </span>
                <h3 className="text-lg font-bold font-serif text-text-primary">
                  Submit Feedback & Refactored Code
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Provide your architectural feedback, refactored solution code, and line-by-line annotations for the student.
                </p>
              </div>

              <DeliverReviewForm
                request={request}
                onSuccess={() => refetch()}
              />
            </div>
          )}

          {(request.status === "DELIVERED" || request.status === "COMPLETED") && (
            <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs space-y-6">
              <div className="space-y-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${request.status === "COMPLETED"
                    ? "bg-emerald-light text-emerald border-emerald/20"
                    : "bg-blue-50 text-blue-600 border-blue-200"
                    }`}
                >
                  {request.status === "COMPLETED" ? (
                    <>
                      <ShieldCheck className="size-3.5" /> Review Completed & Paid
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-3.5" /> Feedback Delivered
                    </>
                  )}
                </span>
                <h3 className="text-lg font-bold font-serif text-text-primary">
                  Review Delivery Summary
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {request.status === "COMPLETED"
                    ? "The student has reviewed and approved your code review. The bounty credits have been credited to your wallet balance."
                    : "Feedback has been delivered to the student. Waiting for their approval to release the escrow credits."}
                </p>
              </div>

              {request.submission && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                      Executive Feedback
                    </span>
                    <div className="p-3.5 rounded-2xl bg-surface-raised border border-border text-xs text-text-secondary leading-relaxed">
                      {request.submission.summary}
                    </div>
                  </div>

                  {request.submission.reviewedCodeSnippet && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                          Refactored Code Solution
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleCopy(
                              request.submission?.reviewedCodeSnippet || "",
                              "refactored"
                            )
                          }
                          className="text-[11px] h-6 px-2 text-text-muted hover:text-text-primary cursor-pointer gap-1"
                        >
                          {isCopiedRefactored ? (
                            <>
                              <Check className="size-3 text-emerald" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="size-3" /> Copy
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="rounded-2xl bg-[#141416] p-4 border border-neutral-800 text-[#f4f4f5] font-mono text-xs overflow-auto max-h-60">
                        <pre>
                          <code>{request.submission.reviewedCodeSnippet}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-1">
                    {request.submission.videoUrl && (
                      <a
                        href={request.submission.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber text-xs font-semibold border border-amber/20 hover:bg-amber-100 transition-colors"
                      >
                        <Video className="size-3.5" /> Video Walkthrough <ExternalLink className="size-3" />
                      </a>
                    )}
                    {request.submission.pullRequestUrl && (
                      <a
                        href={request.submission.pullRequestUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-raised text-text-primary text-xs font-semibold border border-border hover:border-amber/40 transition-colors"
                      >
                        <GitPullRequest className="size-3.5" /> Pull Request <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
