"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileCode2,
  Send,
  Plus,
  Trash2,
  Video,
  GitPullRequest,
  AlertCircle,
  Sparkles,
  Loader2,
  Copy,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { codeReviewService } from "@/services/code-review.service";
import type { CodeReviewRequestItem } from "@/types/code-review.types";
import { toast } from "sonner";

interface InlineComment {
  id: string;
  filePath: string;
  lineNumber: number;
  commentText: string;
  severity: "SUGGESTION" | "BUG" | "SECURITY";
}

interface DeliverReviewFormProps {
  request: CodeReviewRequestItem;
  onSuccess?: () => void;
}

export default function DeliverReviewForm({
  request,
  onSuccess,
}: DeliverReviewFormProps) {
  const queryClient = useQueryClient();

  const [summary, setSummary] = React.useState("");
  const [reviewedCodeSnippet, setReviewedCodeSnippet] = React.useState("");
  const [videoUrl, setVideoUrl] = React.useState("");
  const [pullRequestUrl, setPullRequestUrl] = React.useState("");

  // Inline Line-by-Line Annotations
  const defaultFile =
    request.specificFiles?.split(",")[0]?.trim() ||
    `solution.${request.language === "typescript" ? "ts" : request.language === "javascript" ? "js" : request.language || "ts"}`;

  const [comments, setComments] = React.useState<InlineComment[]>([]);
  const [newFilePath, setNewFilePath] = React.useState(defaultFile);
  const [newLineNumber, setNewLineNumber] = React.useState<number>(1);
  const [newSeverity, setNewSeverity] = React.useState<"SUGGESTION" | "BUG" | "SECURITY">("SUGGESTION");
  const [newCommentText, setNewCommentText] = React.useState("");
  const [showAddCommentForm, setShowAddCommentForm] = React.useState(false);

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);

  // Quick populate original code as template
  const handlePopulateOriginalCode = () => {
    if (request.codeSnippet) {
      setReviewedCodeSnippet(request.codeSnippet);
      toast.success("Loaded original code snippet into refactored editor as base template");
    }
  };

  // Add Inline Comment
  const handleAddComment = () => {
    if (!newCommentText.trim()) {
      toast.error("Please enter comment text");
      return;
    }
    if (!newLineNumber || newLineNumber < 1) {
      toast.error("Line number must be at least 1");
      return;
    }

    const commentItem: InlineComment = {
      id: `${Date.now()}-${Math.random()}`,
      filePath: newFilePath.trim() || defaultFile,
      lineNumber: Number(newLineNumber),
      commentText: newCommentText.trim(),
      severity: newSeverity,
    };

    setComments((prev) => [...prev, commentItem]);
    setNewCommentText("");
    setNewLineNumber((prev) => prev + 1);
    toast.success(`Line ${commentItem.lineNumber} annotation added`);
  };

  const handleRemoveComment = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  // Submit Mutation
  const submitMutation = useMutation({
    mutationFn: () => {
      return codeReviewService.submitReview(request.id, {
        summary: summary.trim(),
        reviewedCodeSnippet: reviewedCodeSnippet.trim() || undefined,
        videoUrl: videoUrl.trim() || undefined,
        pullRequestUrl: pullRequestUrl.trim() || undefined,
        comments: comments.map((c) => ({
          filePath: c.filePath,
          lineNumber: c.lineNumber,
          commentText: c.commentText,
          severity: c.severity,
        })),
      });
    },
    onSuccess: () => {
      toast.success("Code review delivery submitted successfully! Waiting for student approval.");
      queryClient.invalidateQueries({ queryKey: ["code-review", request.id] });
      queryClient.invalidateQueries({ queryKey: ["mentor", "code-reviews-pool"] });
      queryClient.invalidateQueries({ queryKey: ["mentor", "dashboard-summary"] });
      setShowConfirmModal(false);
      onSuccess?.();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to deliver code review");
    },
  });

  const handleValidateAndOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!summary.trim() || summary.trim().length < 10) {
      newErrors.summary = "Executive summary must be at least 10 characters";
    }

    if (videoUrl.trim() && !videoUrl.startsWith("http")) {
      newErrors.videoUrl = "Please provide a valid URL starting with http:// or https://";
    }

    if (pullRequestUrl.trim() && !pullRequestUrl.startsWith("http")) {
      newErrors.pullRequestUrl = "Please provide a valid URL starting with http:// or https://";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required feedback fields before submitting");
      return;
    }

    setErrors({});
    setShowConfirmModal(true);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleValidateAndOpenModal} className="space-y-6">
        {/* 1. Executive Summary & Architecture Guidance */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center justify-between">
            <span>Executive Feedback & Architectural Guidance *</span>
            <span className="text-[11px] font-normal text-text-muted">
              {summary.length} characters (min 10)
            </span>
          </label>
          <p className="text-xs text-text-secondary">
            Summarize key findings, strengths, areas of improvement, and architectural patterns you recommend.
          </p>
          <textarea
            rows={5}
            value={summary}
            onChange={(e) => {
              setSummary(e.target.value);
              if (errors.summary) setErrors((p) => ({ ...p, summary: "" }));
            }}
            placeholder="e.g., Overall this implementation is solid. The data structures can be simplified to O(1) lookups by using a Map instead of Array.filter, and error handling should include try/catch for async boundary cases..."
            className="w-full p-4 rounded-2xl bg-surface border border-border focus:border-amber focus:ring-2 focus:ring-amber/20 focus:outline-none text-xs leading-relaxed text-text-primary resize-y"
          />
          {errors.summary && (
            <p className="text-xs text-red-500 flex items-center gap-1 font-medium">
              <AlertCircle className="size-3.5" /> {errors.summary}
            </p>
          )}
        </div>

        {/* 2. Refactored Solution Code Snippet */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                <FileCode2 className="size-3.5 text-amber" /> Refactored Solution / Fixed Code
              </label>
              <p className="text-xs text-text-secondary">
                Provide cleaner, refactored, or idiomatic code that fixes the student&apos;s issue.
              </p>
            </div>

            {request.codeSnippet && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handlePopulateOriginalCode}
                className="text-xs h-8 gap-1.5 border-border hover:border-amber/40 cursor-pointer"
              >
                <Copy className="size-3 text-amber" /> Copy Original As Starter
              </Button>
            )}
          </div>

          <div className="rounded-2xl bg-[#141416] border border-neutral-800 overflow-hidden shadow-inner">
            {/* Titlebar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#1b1b1f] border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-rose-500/80" />
                  <span className="size-2.5 rounded-full bg-amber-500/80" />
                  <span className="size-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-mono text-[11px] text-neutral-300 ml-1.5 font-medium">
                  {request.specificFiles || `refactored.${request.language || "ts"}`}
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">
                {request.language || "code"}
              </span>
            </div>

            <textarea
              rows={12}
              value={reviewedCodeSnippet}
              onChange={(e) => setReviewedCodeSnippet(e.target.value)}
              placeholder="// Paste refactored, optimized, or fixed code here..."
              spellCheck={false}
              className="w-full p-4 font-mono text-xs text-[#f4f4f5] bg-[#141416] focus:outline-none resize-y leading-relaxed selection:bg-amber-600/40 selection:text-white"
            />
          </div>
        </div>

        {/* 3. Inline Line-by-Line Annotations & Comments */}
        <div className="space-y-3 p-5 rounded-3xl bg-surface-raised/50 border border-border">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-amber" /> Inline Line Comments ({comments.length})
              </h4>
              <p className="text-xs text-text-secondary">
                Pin precise feedback to specific file paths, line numbers, and severity tags.
              </p>
            </div>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowAddCommentForm(!showAddCommentForm)}
              className="text-xs h-8 gap-1.5 border-border hover:border-amber/40 cursor-pointer"
            >
              {showAddCommentForm ? (
                <>
                  <ChevronUp className="size-3.5" /> Close Form
                </>
              ) : (
                <>
                  <Plus className="size-3.5 text-amber" /> Add Inline Comment
                </>
              )}
            </Button>
          </div>

          {/* Add Inline Comment Form */}
          {showAddCommentForm && (
            <div className="p-4 rounded-2xl bg-surface border border-border/80 space-y-3 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-text-muted">Target File</label>
                  <Input
                    value={newFilePath}
                    onChange={(e) => setNewFilePath(e.target.value)}
                    placeholder="e.g. src/index.ts"
                    className="h-9 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-text-muted">Line Number</label>
                  <Input
                    type="number"
                    min={1}
                    value={newLineNumber}
                    onChange={(e) => setNewLineNumber(Number(e.target.value))}
                    className="h-9 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-text-muted">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) =>
                      setNewSeverity(
                        e.target.value as "SUGGESTION" | "BUG" | "SECURITY"
                      )
                    }
                    className="w-full h-9 px-3 rounded-xl bg-surface border border-border text-xs text-text-primary focus:outline-none focus:border-amber font-medium"
                  >
                    <option value="SUGGESTION">💡 Suggestion</option>
                    <option value="BUG">🐛 Bug / Defect</option>
                    <option value="SECURITY">🛡️ Security Risk</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-text-muted">Comment Text</label>
                <textarea
                  rows={2}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Explain the specific issue on this line and how to solve it..."
                  className="w-full p-3 rounded-xl bg-surface border border-border focus:border-amber focus:ring-1 focus:ring-amber text-xs text-text-primary resize-y"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddComment}
                  className="bg-amber text-white hover:bg-amber-hover font-semibold text-xs h-8 px-4 cursor-pointer gap-1.5"
                >
                  <Plus className="size-3.5" /> Save Comment
                </Button>
              </div>
            </div>
          )}

          {/* List of Inline Comments */}
          {comments.length > 0 ? (
            <div className="space-y-2 pt-1">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-surface border border-border/70"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          comment.severity === "BUG"
                            ? "bg-rose-50 text-rose-600 border-rose-200"
                            : comment.severity === "SECURITY"
                            ? "bg-purple-50 text-purple-600 border-purple-200"
                            : "bg-blue-50 text-blue-600 border-blue-200"
                        }`}
                      >
                        {comment.severity === "BUG"
                          ? "🐛 Bug"
                          : comment.severity === "SECURITY"
                          ? "🛡️ Security"
                          : "💡 Suggestion"}
                      </span>

                      <span className="font-mono text-xs font-semibold text-text-primary">
                        {comment.filePath}
                      </span>

                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-raised text-text-secondary border border-border">
                        Line {comment.lineNumber}
                      </span>
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed pt-1">
                      {comment.commentText}
                    </p>
                  </div>

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveComment(comment.id)}
                    className="size-7 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0 cursor-pointer"
                    title="Delete comment"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-text-muted">
              No inline line annotations added yet. Click &quot;Add Inline Comment&quot; to pin specific line notes.
            </div>
          )}
        </div>

        {/* 4. Optional External Delivery Links (Loom Video walkthrough & GitHub PR) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
              <Video className="size-3.5 text-amber" /> Video Walkthrough URL (Optional)
            </label>
            <Input
              value={videoUrl}
              onChange={(e) => {
                setVideoUrl(e.target.value);
                if (errors.videoUrl) setErrors((p) => ({ ...p, videoUrl: "" }));
              }}
              placeholder="e.g. https://www.loom.com/share/..."
              className="h-10 text-xs"
            />
            {errors.videoUrl && (
              <p className="text-xs text-red-500">{errors.videoUrl}</p>
            )}
            <p className="text-[11px] text-text-muted">
              Loom or Cloudinary video link giving recorded walkthrough.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
              <GitPullRequest className="size-3.5 text-indigo-600" /> Pull Request URL (Optional)
            </label>
            <Input
              value={pullRequestUrl}
              onChange={(e) => {
                setPullRequestUrl(e.target.value);
                if (errors.pullRequestUrl)
                  setErrors((p) => ({ ...p, pullRequestUrl: "" }));
              }}
              placeholder="e.g. https://github.com/org/repo/pull/42"
              className="h-10 text-xs"
            />
            {errors.pullRequestUrl && (
              <p className="text-xs text-red-500">{errors.pullRequestUrl}</p>
            )}
            <p className="text-[11px] text-text-muted">
              GitHub or GitLab PR link if review changes were branched.
            </p>
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="submit"
            disabled={submitMutation.isPending}
            className="bg-amber text-white hover:bg-amber-hover font-bold text-sm h-11 px-8 rounded-xl shadow-xs cursor-pointer gap-2"
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Submitting Delivery...
              </>
            ) : (
              <>
                <Send className="size-4" /> Submit Code Review Delivery
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => submitMutation.mutate()}
        title="Submit Code Review Delivery"
        description="Are you ready to submit this code review? The student will be notified immediately to review your refactored code and release the escrow credits to your balance."
        confirmLabel="Confirm & Submit Review"
        cancelLabel="Keep Editing"
        variant="success"
        isLoading={submitMutation.isPending}
      />
    </div>
  );
}
