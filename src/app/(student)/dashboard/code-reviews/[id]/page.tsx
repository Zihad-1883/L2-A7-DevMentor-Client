"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Code2,
  Zap,
  Layers,
  Clock,
  Coins,
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
  MessageSquare,
  FileCode2,
  XCircle,
  FileDiff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ConfirmModal from "@/components/shared/ConfirmModal";
import SkeletonCard from "@/components/shared/SkeletonCard";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { codeReviewService } from "@/services/code-review.service";
import { queryKeys } from "@/lib/query-keys";
import type { CodeReviewRequestItem } from "@/types/code-review.types";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function StudentCodeReviewDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const [isCopiedOriginal, setIsCopiedOriginal] = React.useState(false);
  const [isCopiedRefactored, setIsCopiedRefactored] = React.useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = React.useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);

  // 1. Fetch Review Request Details
  const {
    data: request,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<CodeReviewRequestItem>({
    queryKey: queryKeys.codeReviews.detail(id),
    queryFn: () => codeReviewService.getById(id),
    enabled: Boolean(id),
  });

  // 2. Approve Mutation
  const approveMutation = useMutation({
    mutationFn: () => codeReviewService.approveAndRelease(id),
    onSuccess: () => {
      toast.success("Code review approved! Escrow credits released to mentor.");
      queryClient.invalidateQueries({ queryKey: queryKeys.codeReviews.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.me });
      refetch();
      setIsApproveModalOpen(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to approve code review");
    },
  });

  // 3. Cancel Mutation
  const cancelMutation = useMutation({
    mutationFn: () => codeReviewService.cancelRequest(id),
    onSuccess: () => {
      toast.success("Code review request cancelled. Credits refunded to your wallet.");
      queryClient.invalidateQueries({ queryKey: queryKeys.codeReviews.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.me });
      router.push("/dashboard/code-reviews");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to cancel code review request");
    },
  });

  const copyToClipboard = (text: string, type: "original" | "refactored") => {
    navigator.clipboard.writeText(text);
    if (type === "original") {
      setIsCopiedOriginal(true);
      setTimeout(() => setIsCopiedOriginal(false), 2000);
    } else {
      setIsCopiedRefactored(true);
      setTimeout(() => setIsCopiedRefactored(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 bg-stone-200 animate-pulse rounded" />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-xl border border-red-200 text-red-800">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="font-semibold text-sm">Failed to load code review details</p>
        <p className="text-xs text-red-600 mt-1">
          {(error as Error)?.message || "The request could not be found or you do not have permission to view it."}
        </p>
        <Link href="/dashboard/code-reviews" className="inline-block mt-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to My Requests
          </Button>
        </Link>
      </div>
    );
  }

  const isQuick = request.tier === "QUICK";
  const rewardCredits = request.creditReward || (isQuick ? 10 : 50);
  const isDelivered = request.status === "DELIVERED";
  const isCompleted = request.status === "COMPLETED";
  const isOpen = request.status === "OPEN";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard/code-reviews"
          className="inline-flex items-center text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to My Code Reviews
        </Link>
      </div>

      {/* Main Request Hero Card */}
      <Card className="p-6 border border-stone-200/80 bg-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isQuick
                    ? "bg-amber-100/70 text-amber-900 border border-amber-200"
                    : "bg-purple-100/70 text-purple-900 border border-purple-200"
                  }`}
              >
                {isQuick ? <Zap className="w-3.5 h-3.5 text-amber-600" /> : <Layers className="w-3.5 h-3.5 text-purple-600" />}
                {isQuick ? "Quick Review (10 Cr)" : "Deep Audit (50 Cr)"}
              </span>

              {request.language && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 text-xs font-mono font-medium">
                  <Code2 className="w-3.5 h-3.5 text-stone-500" />
                  {request.language}
                </span>
              )}

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 border border-stone-200 text-stone-700">
                Status: <strong className="font-semibold text-stone-900">{request.status}</strong>
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-stone-900">{request.title}</h1>
            <p className="text-sm text-stone-600 leading-relaxed max-w-3xl">{request.description}</p>
          </div>

          {/* Action triggers */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-2 shrink-0">
            {isDelivered && (
              <Button
                onClick={() => setIsApproveModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Approve & Release Credits
              </Button>
            )}

            {isOpen && (
              <Button
                variant="outline"
                onClick={() => setIsCancelModalOpen(true)}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <XCircle className="w-4 h-4 mr-1.5" />
                Cancel & Refund Credits
              </Button>
            )}

            {isCompleted && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Review Completed & Settled
              </div>
            )}
          </div>
        </div>

        {/* Repository & Meta Info Footer */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-4 text-xs text-stone-500">
          {request.githubRepoUrl && (
            <a
              href={request.githubRepoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-stone-900 font-mono bg-stone-50 px-2.5 py-1 rounded border border-stone-200 transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5 text-stone-400" />
              {request.githubRepoUrl.replace("https://github.com/", "")}
              {request.branchName && <span className="text-stone-400">({request.branchName})</span>}
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>
          )}

          {request.attachmentUrl && (
            <a
              href={request.attachmentUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-stone-900 font-mono bg-amber-50 text-amber-900 px-2.5 py-1 rounded border border-amber-200 transition-colors"
            >
              <FileDiff className="w-3.5 h-3.5 text-amber-600" />
              {request.attachmentName || "Attached Patch File"}
              {request.attachmentSize ? (
                <span className="text-amber-700/80">({Math.round(request.attachmentSize / 1024)} KB)</span>
              ) : null}
              <ExternalLink className="w-3 h-3 text-amber-600" />
            </a>
          )}

          {request.specificFiles && (
            <span className="inline-flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded border border-stone-200">
              <FileCode2 className="w-3.5 h-3.5 text-stone-400" />
              Focus: <span className="font-mono text-stone-700">{request.specificFiles}</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1 ml-auto text-stone-400">
            <Calendar className="w-3.5 h-3.5" />
            Submitted {formatDate(request.createdAt)}
          </span>
        </div>
      </Card>

      {/* Reviewer / Assigned Mentor Card */}
      {request.assignedMentor && (
        <Card className="p-4 border border-stone-200/80 bg-stone-50/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm border border-amber-200">
              {request.assignedMentor.name?.charAt(0) || "M"}
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-900">{request.assignedMentor.name}</p>
              <p className="text-[11px] text-stone-500">Assigned Reviewer & Senior Engineer</p>
            </div>
          </div>

          <div className="text-right text-xs text-stone-500">
            {request.deliveryDeadline && (
              <p>
                SLA Deadline: <span className="font-medium text-stone-800">{new Date(request.deliveryDeadline).toLocaleString()}</span>
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Mentor Feedback Section (If Delivered or Completed) */}
      {request.submission && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-stone-900">Mentor Review & Feedback</h2>
          </div>

          <Card className="p-6 border border-emerald-200 bg-white shadow-xs space-y-6">
            {/* Feedback Summary */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Executive Summary</h3>
              <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-100 text-stone-800 text-sm whitespace-pre-line leading-relaxed">
                {request.submission.summary}
              </div>
            </div>

            {/* Links (Video Walkthrough / PR) */}
            {(request.submission.videoUrl || request.submission.pullRequestUrl) && (
              <div className="flex flex-wrap gap-3">
                {request.submission.videoUrl && (
                  <a
                    href={request.submission.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs font-medium text-stone-800 hover:bg-stone-100 transition-colors"
                  >
                    <Video className="w-4 h-4 text-purple-600" />
                    Watch Video Walkthrough
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>
                )}

                {request.submission.pullRequestUrl && (
                  <a
                    href={request.submission.pullRequestUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs font-medium text-stone-800 hover:bg-stone-100 transition-colors"
                  >
                    <GitPullRequest className="w-4 h-4 text-emerald-600" />
                    View Pull Request
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>
                )}

                {request.submission.attachmentUrl && (
                  <a
                    href={request.submission.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs font-medium text-amber-900 hover:bg-amber-100 transition-colors"
                  >
                    <FileDiff className="w-4 h-4 text-amber-600" />
                    {request.submission.attachmentName || "Download Solution Patch"}
                    <ExternalLink className="w-3 h-3 text-amber-600" />
                  </a>
                )}
              </div>
            )}

            {/* Line-by-Line Comments */}
            {request.submission.comments && request.submission.comments.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Line-by-Line Comments ({request.submission.comments.length})
                </h3>

                <div className="space-y-2">
                  {request.submission.comments.map((comment, index) => (
                    <div
                      key={comment.id || index}
                      className="p-3 rounded-lg border border-stone-200/80 bg-stone-50/30 flex items-start gap-3"
                    >
                      <div className="px-2 py-0.5 rounded bg-stone-200 text-stone-800 font-mono text-[11px] font-semibold shrink-0">
                        Line {comment.lineNumber}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-stone-500 text-[11px]">{comment.filePath}</span>
                          {comment.severity && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                              {comment.severity}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-800 leading-relaxed">{comment.commentText}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Refactored Code Snippet */}
            {request.submission.reviewedCodeSnippet && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Refactored Solution Snippet
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(request.submission!.reviewedCodeSnippet!, "refactored")}
                    className="h-7 text-xs text-stone-500 hover:text-stone-900"
                  >
                    {isCopiedRefactored ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copy Code
                      </>
                    )}
                  </Button>
                </div>

                <div className="rounded-lg bg-stone-950 p-4 font-mono text-xs text-stone-100 overflow-x-auto border border-stone-800 shadow-inner">
                  <pre>{request.submission.reviewedCodeSnippet}</pre>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Original Code Snippet */}
      {request.codeSnippet && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-600">
              Submitted Code Snippet
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(request.codeSnippet!, "original")}
              className="h-7 text-xs text-stone-500 hover:text-stone-900"
            >
              {isCopiedOriginal ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" /> Copy Code
                </>
              )}
            </Button>
          </div>

          <div className="rounded-lg bg-stone-900 p-4 font-mono text-xs text-stone-100 overflow-x-auto border border-stone-800 shadow-inner">
            <pre>{request.codeSnippet}</pre>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Approve Review */}
      <ConfirmModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onConfirm={() => approveMutation.mutate()}
        title="Approve Code Review & Release Credits"
        description={`Are you satisfied with the mentor's feedback? Confirming will release ${rewardCredits} credits from escrow to the mentor.`}
        confirmLabel="Confirm & Release"
        variant="success"
        isLoading={approveMutation.isPending}
      />

      {/* Confirmation Modal: Cancel Review */}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={() => cancelMutation.mutate()}
        title="Cancel Code Review Request"
        description={`Are you sure you want to cancel this request? Your ${rewardCredits} credits will be refunded back to your wallet immediately.`}
        confirmLabel="Yes, Cancel & Refund"
        variant="danger"
        isLoading={cancelMutation.isPending}
      />
    </div>
  );
}
