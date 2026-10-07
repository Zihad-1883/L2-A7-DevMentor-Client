"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { codeReviewService } from "@/services/code-review.service";
import type { CodeReviewRequestItem } from "@/types/code-review.types";
import { toast } from "sonner";

interface ClaimReviewButtonProps {
  request: CodeReviewRequestItem;
  onClaimSuccess?: (updatedRequest: CodeReviewRequestItem) => void;
  className?: string;
  size?: "default" | "sm" | "lg";
  disabled?: boolean;
}

export default function ClaimReviewButton({
  request,
  onClaimSuccess,
  className = "",
  size = "default",
  disabled = false,
}: ClaimReviewButtonProps) {
  const queryClient = useQueryClient();
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);

  const isQuick = request.tier === "QUICK";
  const rewardCredits = request.creditReward || (isQuick ? 10 : 50);
  const slaText = isQuick ? "2 Hours" : "24 Hours";

  const claimMutation = useMutation({
    mutationFn: () => codeReviewService.claimRequest(request.id),
    onSuccess: (data) => {
      toast.success(
        `Code review claimed! Your ${slaText} SLA delivery clock is now active.`
      );
      queryClient.setQueryData<CodeReviewRequestItem>(
        ["code-review", request.id],
        (prev) => ({
          ...(prev || request),
          ...data,
          status: "CLAIMED",
        })
      );
      queryClient.invalidateQueries({ queryKey: ["mentor", "dashboard-summary"] });
      setShowConfirmModal(false);
      onClaimSuccess?.(data);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to claim code review request");
    },
  });

  const isAlreadyClaimed =
    request.status === "CLAIMED" ||
    request.status === "DELIVERED" ||
    request.status === "COMPLETED";

  return (
    <>
      <Button
        size={size}
        onClick={() => setShowConfirmModal(true)}
        disabled={disabled || isAlreadyClaimed || claimMutation.isPending}
        className={`bg-amber text-white hover:bg-amber-hover font-bold shadow-xs cursor-pointer gap-2 ${className}`}
      >
        {claimMutation.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Claiming...
          </>
        ) : (
          <>
            <Sparkles className="size-4" /> Claim Review Request
          </>
        )}
      </Button>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => claimMutation.mutate()}
        title={`Claim ${request.tier} Code Review`}
        description={`You are officially claiming "${request.title}". Your ${slaText} SLA countdown timer starts immediately upon confirmation. Once you deliver feedback and the student approves, ${rewardCredits} Credits will be credited to your balance.`}
        confirmLabel="Confirm & Start SLA Clock"
        cancelLabel="Keep Looking"
        variant="success"
        isLoading={claimMutation.isPending}
      />
    </>
  );
}
