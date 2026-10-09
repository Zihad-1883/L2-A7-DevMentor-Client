"use client";

import * as React from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import type { CohortApprovalStatus, CohortItem } from "@/types/cohort.types";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import ConfirmModal from "@/components/shared/ConfirmModal";
import {
  Check,
  X,
  Clock,
  Users,
  CalendarDays,
  Layers,
  Wallet,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface CohortApprovalCardProps {
  cohort: CohortItem;
  /** Effective approval status (may be overridden after a moderation action). */
  status: CohortApprovalStatus;
  onActionComplete?: (cohortId: string, status: "APPROVED" | "REJECTED") => void;
}

export default function CohortApprovalCard({
  cohort,
  status,
  onActionComplete,
}: CohortApprovalCardProps) {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [modalAction, setModalAction] = React.useState<"APPROVED" | "REJECTED" | null>(null);

  const mutation = useMutation({
    mutationFn: (next: "APPROVED" | "REJECTED") =>
      adminService.approveOrRejectCohort(cohort.id, { status: next }),
    onSuccess: (_, next) => {
      const msg =
        next === "APPROVED"
          ? `Cohort "${cohort.title}" approved! The mentor can now publish it.`
          : `Cohort "${cohort.title}" rejected and hidden from the public directory.`;

      toast.success(msg);
      setFeedback({
        type: "success",
        message: msg,
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.cohorts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.cohortsQueue() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats });
      onActionComplete?.(cohort.id, next);
    },
    onError: (err: Error) => {
      const errMsg = err.message || "Failed to update cohort status. Please try again.";
      toast.error(errMsg);
      setFeedback({
        type: "error",
        message: errMsg,
      });
    },
  });

  const isPending = status === "PENDING" || status === "PENDING_APPROVAL";
  const isApproved = status === "APPROVED";

  const badge = isApproved
    ? { label: "Approved", cls: "bg-emerald-light text-emerald border-emerald/20", Icon: CheckCircle2 }
    : status === "REJECTED"
      ? { label: "Rejected", cls: "bg-orange/10 text-orange border-orange/20", Icon: XCircle }
      : { label: "Pending Review", cls: "bg-amber-light text-amber border-amber/20", Icon: Clock };

  const sessionCount = cohort._count?.sessions ?? cohort.sessions?.length ?? 0;
  const enrolled = cohort._count?.enrollments ?? 0;

  const run = (next: "APPROVED" | "REJECTED") => {
    setFeedback(null);
    mutation.mutate(next);
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-surface shadow-2xs hover:shadow-xs transition-all p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.cls}`}
            >
              <badge.Icon className="size-3" /> {badge.label}
            </span>
            <span className="text-[11px] text-text-muted font-mono">
              {cohort.status}
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-text-primary truncate">
            {cohort.title}
          </h3>
          <p className="text-xs text-text-muted">
            by{" "}
            <span className="font-semibold text-text-secondary">
              {cohort.mentor?.name ?? "Unknown mentor"}
            </span>
            {cohort.mentor?.email ? ` · ${cohort.mentor.email}` : ""}
            {cohort.createdAt ? ` · Submitted ${formatDate(cohort.createdAt)}` : ""}
          </p>
        </div>
        <Link
          href={`/cohorts/${cohort.id}`}
          target="_blank"
          className="inline-flex items-center gap-1 text-xs font-semibold text-amber hover:underline shrink-0"
        >
          Preview <ExternalLink className="size-3" />
        </Link>
      </div>

      <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
        {cohort.description}
      </p>

      {cohort.techStackTags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {cohort.techStackTags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-surface-raised border border-border text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-2 text-text-secondary">
          <CalendarDays className="size-4 text-amber" />
          {cohort.durationWeeks} weeks
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <Users className="size-4 text-amber" />
          {enrolled}/{cohort.capacity || "∞"} enrolled
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <Layers className="size-4 text-amber" />
          {sessionCount} sessions
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <Wallet className="size-4 text-amber" />৳{cohort.totalCost}
        </div>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border ${
            feedback.type === "success"
              ? "bg-emerald-light text-emerald border-emerald/20"
              : "bg-orange/10 text-orange border-orange/20"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="size-4" />
          ) : (
            <AlertCircle className="size-4" />
          )}
          {feedback.message}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-border/60">
        {(isPending || isApproved) && (
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={() => setModalAction("REJECTED")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-orange/30 text-orange hover:bg-orange/10 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="size-3.5" />
            {isApproved ? "Revoke Approval" : "Reject"}
          </button>
        )}
        {!isApproved && (
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={() => setModalAction("APPROVED")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
          >
            <Check className="size-3.5" />
            Approve
          </button>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(modalAction)}
        title={
          modalAction === "APPROVED"
            ? "Approve Cohort Submission?"
            : isApproved
            ? "Revoke Cohort Approval?"
            : "Reject Cohort Submission?"
        }
        description={
          modalAction === "APPROVED"
            ? `Are you sure you want to approve "${cohort.title}"? The mentor will be able to publish it to the public directory.`
            : `Are you sure you want to ${
                isApproved ? "revoke approval for" : "reject"
              } "${cohort.title}"? It will not appear in the public directory.`
        }
        confirmLabel={
          modalAction === "APPROVED"
            ? "Yes, Approve Cohort"
            : isApproved
            ? "Yes, Revoke Approval"
            : "Yes, Reject"
        }
        variant={modalAction === "APPROVED" ? "success" : "danger"}
        isLoading={mutation.isPending}
        onConfirm={() => {
          if (modalAction) {
            run(modalAction);
            setModalAction(null);
          }
        }}
        onClose={() => setModalAction(null)}
      />
    </div>
  );
}
