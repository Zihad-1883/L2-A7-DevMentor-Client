"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { codeReviewService } from "@/services/code-review.service";
import type { CodeReviewRequestItem } from "@/types/code-review.types";
import { toast } from "sonner";

interface PreviewLockButtonProps {
  request: CodeReviewRequestItem;
  onLockSuccess?: (updatedRequest: CodeReviewRequestItem) => void;
  className?: string;
  size?: "default" | "sm" | "lg";
  disabled?: boolean;
}

export default function PreviewLockButton({
  request,
  onLockSuccess,
  className = "",
  size = "default",
  disabled = false,
}: PreviewLockButtonProps) {
  const queryClient = useQueryClient();

  const lockMutation = useMutation({
    mutationFn: () => codeReviewService.previewLock(request.id),
    onSuccess: (data) => {
      toast.success(
        "10-Minute Preview Lock acquired! You have exclusive reservation while reviewing this code."
      );
      queryClient.invalidateQueries({ queryKey: ["code-review", request.id] });
      queryClient.invalidateQueries({ queryKey: ["mentor", "code-reviews-pool"] });
      onLockSuccess?.(data);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to acquire preview lock");
    },
  });

  const isAlreadyLocked =
    request.status === "PREVIEW_LOCKED" &&
    request.previewExpiresAt &&
    new Date(request.previewExpiresAt) > new Date();

  return (
    <Button
      size={size}
      variant="outline"
      onClick={() => lockMutation.mutate()}
      disabled={disabled || isAlreadyLocked || lockMutation.isPending}
      className={`border-border hover:border-amber/40 hover:bg-amber-50/50 cursor-pointer gap-2 ${className}`}
      title="Temporarily reserves this request for 10 minutes so no other mentor can claim it while you inspect"
    >
      {lockMutation.isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" /> Locking...
        </>
      ) : isAlreadyLocked ? (
        <>
          <Lock className="size-4 text-amber" /> Preview Active
        </>
      ) : (
        <>
          <Lock className="size-4 text-amber" /> Lock 10-Min Preview
        </>
      )}
    </Button>
  );
}
