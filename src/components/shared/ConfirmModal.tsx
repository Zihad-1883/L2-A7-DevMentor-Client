"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type ConfirmVariant = "danger" | "warning" | "success" | "primary";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  // Close on Escape key & body scroll lock
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      badge: "bg-orange/10 text-orange border-orange/20",
      icon: <AlertTriangle className="size-5" />,
      button: "bg-orange text-white hover:opacity-90 shadow-2xs",
    },
    warning: {
      badge: "bg-amber-light text-amber border-amber/20",
      icon: <AlertCircle className="size-5" />,
      button: "bg-amber text-white hover:bg-amber-hover shadow-2xs",
    },
    success: {
      badge: "bg-emerald-light text-emerald border-emerald/20",
      icon: <CheckCircle2 className="size-5" />,
      button: "bg-emerald text-white hover:opacity-90 shadow-2xs",
    },
    primary: {
      badge: "bg-surface-raised text-text-primary border-border",
      icon: <HelpCircle className="size-5" />,
      button: "bg-text-primary text-surface hover:bg-text-primary/90 shadow-2xs",
    },
  }[variant];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => {
        if (!isLoading) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="w-full max-w-md rounded-3xl bg-surface border border-border shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Close dialog"
        >
          <X className="size-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4">
          <div
            className={`size-11 rounded-2xl border flex items-center justify-center shrink-0 ${variantStyles.badge}`}
          >
            {variantStyles.icon}
          </div>

          <div className="space-y-1 pr-4">
            <h3
              id="confirm-modal-title"
              className="font-serif text-lg font-bold text-text-primary leading-snug"
            >
              {title}
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={onClose}
            className="text-xs border-border h-9 px-4 rounded-xl"
          >
            {cancelLabel}
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={isLoading}
            onClick={onConfirm}
            className={`text-xs h-9 px-4 rounded-xl font-semibold gap-1.5 cursor-pointer ${variantStyles.button}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" /> Processing...
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
