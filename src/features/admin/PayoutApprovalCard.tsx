"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Banknote,
  CheckCircle2,
  XCircle,
  Clock,
  Smartphone,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  ArrowRight,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { payoutService } from "@/services/payout.service";
import type { PayoutRequest } from "@/types/payout.types";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

export interface PayoutApprovalCardProps {
  payout: PayoutRequest;
  onProcessed?: () => void;
}

export default function PayoutApprovalCard({
  payout,
  onProcessed,
}: PayoutApprovalCardProps) {
  const queryClient = useQueryClient();
  const [showApproveModal, setShowApproveModal] = React.useState(false);
  const [showRejectModal, setShowRejectModal] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState("");

  const processMutation = useMutation({
    mutationFn: async (payload: {
      status: "PROCESSED" | "REJECTED";
      rejectionReason?: string;
    }) => {
      return await payoutService.processPayoutRequest(payout.id, payload);
    },
    onSuccess: (data, variables) => {
      toast.success(
        variables.status === "PROCESSED"
          ? `Payout of ৳${payout.amountBdt.toLocaleString()} approved and marked as processed!`
          : `Payout of ৳${payout.amountBdt.toLocaleString()} rejected and ${payout.amountCredits} credits refunded to mentor.`
      );
      setShowApproveModal(false);
      setShowRejectModal(false);
      setRejectionReason("");
      queryClient.invalidateQueries({ queryKey: ["admin", "payouts"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      onProcessed?.();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to process payout request.");
    },
  });

  const isPending = payout.status === "PENDING";
  const isProcessed = payout.status === "PROCESSED";
  const isRejected = payout.status === "REJECTED";

  return (
    <div className="flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-surface border border-border hover:border-amber/40 shadow-2xs hover:shadow-sm transition-all space-y-4">
      {/* 1. Header with Mentor Profile & Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative size-11 rounded-2xl overflow-hidden bg-surface-raised border border-border shrink-0 flex items-center justify-center">
            {payout.mentor?.image ? (
              <Image
                src={payout.mentor.image}
                alt={payout.mentor.name || "Mentor"}
                fill
                className="object-cover"
              />
            ) : (
              <User className="size-5 text-text-muted" />
            )}
          </div>
          <div>
            <h4 className="font-serif text-sm sm:text-base font-bold text-text-primary line-clamp-1">
              {payout.mentor?.name || "Verified Mentor"}
            </h4>
            <p className="text-xs text-text-secondary line-clamp-1">
              {payout.mentor?.email}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {isPending && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20">
              <Clock className="size-3.5" /> Pending Review
            </span>
          )}
          {isProcessed && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-light text-emerald border border-emerald/20">
              <CheckCircle2 className="size-3.5" /> Disbursed
            </span>
          )}
          {isRejected && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-light text-rose border border-rose/20">
              <XCircle className="size-3.5" /> Declined &amp; Refunded
            </span>
          )}
        </div>
      </div>

      {/* 2. Amount & Withdrawal Details Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-surface-raised/70 border border-border">
        <div>
          <span className="text-[10px] uppercase font-bold text-text-muted block">
            Requested BDT
          </span>
          <strong className="text-base sm:text-lg font-bold text-text-primary font-mono">
            ৳{payout.amountBdt.toLocaleString()}
          </strong>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-text-muted block">
            Credits Held
          </span>
          <strong className="text-base sm:text-lg font-bold text-amber font-mono">
            {payout.amountCredits}
          </strong>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-text-muted block">
            Account / Mobile
          </span>
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-text-primary">
            <Smartphone className="size-3 text-text-muted shrink-0" />
            <span className="truncate">
              {payout.method}: {payout.accountNumber}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Reason or Processing Audit Notes */}
      {isRejected && payout.rejectionReason && (
        <div className="p-3 rounded-2xl bg-rose-light/40 border border-rose/20 text-xs text-rose leading-relaxed flex items-start gap-2">
          <AlertTriangle className="size-4 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block">Decline Reason:</strong>
            <span>{payout.rejectionReason}</span>
          </div>
        </div>
      )}

      {isProcessed && payout.processedAt && (
        <div className="text-[11px] text-text-muted flex items-center justify-between">
          <span>Processed on {formatDate(payout.processedAt)}</span>
          {payout.admin && (
            <span>Approved by {payout.admin.name || "Administrator"}</span>
          )}
        </div>
      )}

      {/* 4. Footer Actions & Timestamp */}
      <div className="pt-3 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-[11px] text-text-muted font-medium">
          Submitted {formatDate(payout.createdAt)}
        </span>

        {isPending && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowRejectModal(true)}
              disabled={processMutation.isPending}
              className="text-xs h-8 px-3 gap-1.5 border-border bg-surface hover:bg-rose-light hover:text-rose hover:border-rose/30 cursor-pointer"
            >
              <XCircle className="size-3.5" />
              <span>Decline</span>
            </Button>

            <Button
              size="sm"
              onClick={() => setShowApproveModal(true)}
              disabled={processMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-8 px-3 gap-1.5 cursor-pointer shadow-2xs"
            >
              <CheckCircle2 className="size-3.5" />
              <span>Approve &amp; Disburse</span>
            </Button>
          </div>
        )}
      </div>

      {/* 5. Approve Confirmation Modal */}
      {showApproveModal && (
        <ConfirmModal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          onConfirm={() =>
            processMutation.mutate({ status: "PROCESSED" })
          }
          title="Approve & Disburse Payout?"
          description={`Confirm manual bKash/bank transfer of ৳${payout.amountBdt.toLocaleString()} to ${payout.accountNumber} for ${payout.mentor?.name || "this mentor"}. Once marked as disbursed, the payout status will become irreversible.`}
          confirmLabel="Mark as Disbursed"
          variant="success"
          isLoading={processMutation.isPending}
        />
      )}

      {/* 6. Reject & Refund Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-3xl bg-surface border border-border shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-rose-light text-rose flex items-center justify-center shrink-0">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-text-primary">
                  Decline Payout Request
                </h3>
                <p className="text-xs text-text-secondary">
                  The {payout.amountCredits} credits held in escrow will be immediately returned to the mentor&apos;s wallet.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-primary">
                Rejection Reason (Visible to Mentor)
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Invalid bKash account number, account unverified, or incorrect payment details..."
                className="w-full p-3 rounded-2xl bg-surface-raised border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-rose/40 resize-y"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowRejectModal(false)}
                disabled={processMutation.isPending}
                className="text-xs border-border"
              >
                Cancel
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={() =>
                  processMutation.mutate({
                    status: "REJECTED",
                    rejectionReason: rejectionReason.trim(),
                  })
                }
                disabled={processMutation.isPending}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs gap-1.5 cursor-pointer shadow-2xs"
              >
                {processMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <XCircle className="size-3.5" /> Decline &amp; Refund
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
