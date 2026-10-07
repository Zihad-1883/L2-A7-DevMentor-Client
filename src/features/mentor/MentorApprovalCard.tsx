"use client";

import * as React from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import type { MentorProfileItem } from "@/services/mentor.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Check,
  X,
  ExternalLink,
  Calendar,
  Sparkles,
  FileText,
  User,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

interface MentorApprovalCardProps {
  application: MentorProfileItem;
  onActionComplete?: () => void;
}

export default function MentorApprovalCard({
  application,
  onActionComplete,
}: MentorApprovalCardProps) {
  const queryClient = useQueryClient();
  const [isRejecting, setIsRejecting] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; message: string } | null>(null);

  const initials = (application.user.name || "Applicant")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const formattedDate = application.createdAt ? formatDate(application.createdAt) : "Recently";

  // Mutation to Approve or Reject
  const moderationMutation = useMutation({
    mutationFn: ({ status, reason }: { status: "APPROVED" | "REJECTED"; reason?: string }) =>
      adminService.approveOrRejectMentor(application.id, {
        status,
        rejectionReason: reason,
      }),
    onSuccess: (_, vars) => {
      const msg =
        vars.status === "APPROVED"
          ? `${application.user.name} has been approved as an active mentor!`
          : `Application for ${application.user.name} has been rejected.`;
      setFeedback({ type: "success", message: msg });
      setIsRejecting(false);
      setRejectionReason("");

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.mentorsQueue() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });

      if (onActionComplete) onActionComplete();
    },
    onError: (err: Error) => {
      setFeedback({
        type: "error",
        message: err.message || "Failed to process mentor application. Please try again.",
      });
    },
  });

  const handleApprove = () => {
    setFeedback(null);
    moderationMutation.mutate({ status: "APPROVED" });
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    moderationMutation.mutate({
      status: "REJECTED",
      reason: rejectionReason.trim() || undefined,
    });
  };

  return (
    <Card className="border border-border/80 shadow-2xs hover:shadow-xs transition-all bg-surface overflow-hidden">
      <CardContent className="p-5 sm:p-6 space-y-5">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Avatar */}
            <div className="relative size-12 rounded-xl overflow-hidden border border-border shrink-0 bg-surface-sunken flex items-center justify-center">
              {application.user.image ? (
                <Image
                  src={application.user.image}
                  alt={application.user.name}
                  fill
                  sizes="48px"
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="size-full bg-linear-to-br from-amber to-amber-hover text-white flex items-center justify-center font-bold text-base">
                  {initials || <User className="size-5" />}
                </div>
              )}
            </div>

            {/* Name & Email */}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-text-primary">
                  {application.user.name}
                </h3>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-surface-raised border border-border text-text-secondary">
                  <Sparkles className="size-2.5 text-amber" />
                  {application.experienceLevel}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">{application.user.email}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {application.approvalStatus === "PENDING" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-light text-amber border border-amber/30">
                <Clock className="size-3.5 animate-pulse" />
                Pending Review
              </span>
            )}
            {application.approvalStatus === "APPROVED" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-light text-emerald border border-emerald/30">
                <ShieldCheck className="size-3.5" />
                Approved Mentor
              </span>
            )}
            {application.approvalStatus === "REJECTED" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-terracotta-light text-terracotta border border-terracotta/30">
                <X className="size-3.5" />
                Application Rejected
              </span>
            )}
          </div>
        </div>

        {/* Biography Quote */}
        <div className="p-3.5 rounded-xl bg-surface-raised/50 border border-border/70 text-xs text-text-secondary leading-relaxed">
          <p className="line-clamp-3 italic">
            &ldquo;{application.bio || "No candidate statement provided."}&rdquo;
          </p>
        </div>

        {/* Tech Stack Tags & Meta */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
            Competencies & Stack Tags
          </span>
          <div className="flex flex-wrap gap-1.5">
            {application.techStackTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-surface border border-border text-text-primary shadow-2xs"
              >
                <span className="size-1.5 rounded-full bg-amber" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Professional Proof Links & Applied Date */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60 text-xs">
          <div className="flex items-center gap-4">
            {application.githubUrl && (
              <a
                href={application.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-text-secondary hover:text-amber transition-colors font-medium"
              >
                <GithubIcon className="size-3.5" />
                GitHub
                <ExternalLink className="size-2.5 opacity-60" />
              </a>
            )}

            {application.resumeUrl ? (
              <a
                href={application.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-text-secondary hover:text-amber transition-colors font-medium"
              >
                <FileText className="size-3.5 text-blue-500" />
                Resume / CV
                <ExternalLink className="size-2.5 opacity-60" />
              </a>
            ) : (
              <span className="text-text-muted text-[11px]">No resume attached</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-text-muted text-[11px]">
            <Calendar className="size-3" />
            Applied {formattedDate}
          </div>
        </div>

        {/* Inline Feedback Banner */}
        {feedback && (
          <div
            className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-medium animate-in fade-in duration-150 ${
              feedback.type === "success"
                ? "border-emerald/30 bg-emerald/5 text-emerald"
                : "border-orange/30 bg-orange/5 text-orange"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="size-4 shrink-0" />
            ) : (
              <AlertCircle className="size-4 shrink-0" />
            )}
            <p>{feedback.message}</p>
          </div>
        )}

        {/* Action Controls for PENDING applications */}
        {application.approvalStatus === "PENDING" && (
          <div className="pt-2">
            {!isRejecting ? (
              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRejecting(true)}
                  disabled={moderationMutation.isPending}
                  className="gap-1.5 text-xs text-text-secondary hover:text-terracotta hover:border-terracotta/40 rounded-xl"
                >
                  <X className="size-3.5" />
                  Reject Application
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleApprove}
                  disabled={moderationMutation.isPending}
                  className="gap-1.5 text-xs font-bold bg-emerald text-white hover:bg-emerald-hover rounded-xl shadow-xs"
                >
                  {moderationMutation.isPending ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <Check className="size-3.5" />
                      Approve & Grant Mentor Role
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleRejectSubmit} className="space-y-3 p-3.5 rounded-xl bg-surface-raised border border-border animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-primary">
                    Rejection Feedback (Optional)
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsRejecting(false)}
                    className="text-[11px] text-text-muted hover:text-text-primary"
                  >
                    Cancel
                  </button>
                </div>

                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Insufficient production experience or missing code portfolio"
                  className="w-full text-xs rounded-lg border border-border bg-surface px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={moderationMutation.isPending}
                    className="text-xs font-semibold bg-terracotta text-white hover:bg-terracotta/90 rounded-lg shadow-2xs"
                  >
                    {moderationMutation.isPending ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      "Confirm Rejection"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
