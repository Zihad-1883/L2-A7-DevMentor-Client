"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  iconBadgeClassName?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  contentClassName?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-4xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  iconBadgeClassName,
  children,
  footer,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = "",
  contentClassName = "",
}: ModalProps) {
  // Close on Escape key & body scroll lock
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape) {
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
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => {
        if (closeOnOverlayClick) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "w-full rounded-3xl bg-surface border border-border/80 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 relative max-h-[92vh] flex flex-col overflow-hidden",
          sizeClasses[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors cursor-pointer z-10"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
        )}

        {/* Header */}
        {(title || description || icon) && (
          <div className="flex items-start gap-3.5 pr-8 shrink-0">
            {icon && (
              <div
                className={cn(
                  "size-11 rounded-2xl border border-border/80 bg-surface-raised flex items-center justify-center shrink-0 shadow-2xs",
                  iconBadgeClassName
                )}
              >
                {icon}
              </div>
            )}
            <div className="space-y-1 min-w-0">
              {title && (
                <h3 className="font-serif text-lg sm:text-xl font-bold text-text-primary leading-snug tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Scrollable Body Content */}
        <div className={cn("overflow-y-auto flex-1 pr-0.5 space-y-4", contentClassName)}>
          {children}
        </div>

        {/* Optional Footer */}
        {footer && (
          <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2.5 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
