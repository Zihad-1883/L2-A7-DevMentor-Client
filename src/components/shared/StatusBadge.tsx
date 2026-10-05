import * as React from "react";
import { cn } from "@/lib/utils";

export type StatusType =
  | "OPEN"
  | "PENDING"
  | "PENDING_CLAIM"
  | "CLAIMED"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "COMPLETED"
  | "CONFIRMED"
  | "CANCELLED"
  | "REJECTED"
  | "APPROVED"
  | "PUBLISHED"
  | "DRAFT"
  | "ARCHIVED"
  | "EXPIRED"
  | "ACTIVE";

interface StatusBadgeProps {
  status: string;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

const statusColorMap: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  // Positive / Finished
  COMPLETED: {
    bg: "bg-emerald-light",
    text: "text-emerald",
    border: "border-emerald/30",
    dot: "bg-emerald",
  },
  APPROVED: {
    bg: "bg-emerald-light",
    text: "text-emerald",
    border: "border-emerald/30",
    dot: "bg-emerald",
  },
  PUBLISHED: {
    bg: "bg-emerald-light",
    text: "text-emerald",
    border: "border-emerald/30",
    dot: "bg-emerald",
  },
  CONFIRMED: {
    bg: "bg-emerald-light",
    text: "text-emerald",
    border: "border-emerald/30",
    dot: "bg-emerald",
  },
  ACTIVE: {
    bg: "bg-emerald-light",
    text: "text-emerald",
    border: "border-emerald/30",
    dot: "bg-emerald",
  },

  // In Progress / Action required
  IN_PROGRESS: {
    bg: "bg-amber-light",
    text: "text-amber-hover",
    border: "border-amber/30",
    dot: "bg-amber",
  },
  CLAIMED: {
    bg: "bg-amber-light",
    text: "text-amber-hover",
    border: "border-amber/30",
    dot: "bg-amber",
  },
  DELIVERED: {
    bg: "bg-amber-light",
    text: "text-amber-hover",
    border: "border-amber/30",
    dot: "bg-amber",
  },
  OPEN: {
    bg: "bg-amber-50",
    text: "text-amber",
    border: "border-amber/30",
    dot: "bg-amber",
  },

  // Pending
  PENDING: {
    bg: "bg-surface-raised",
    text: "text-text-muted",
    border: "border-border",
    dot: "bg-text-muted",
  },
  PENDING_CLAIM: {
    bg: "bg-surface-raised",
    text: "text-text-muted",
    border: "border-border",
    dot: "bg-text-muted",
  },
  DRAFT: {
    bg: "bg-surface-raised",
    text: "text-text-muted",
    border: "border-border",
    dot: "bg-text-muted",
  },

  // Negative / Cancelled
  CANCELLED: {
    bg: "bg-orange-light",
    text: "text-orange",
    border: "border-orange/30",
    dot: "bg-orange",
  },
  REJECTED: {
    bg: "bg-orange-light",
    text: "text-orange",
    border: "border-orange/30",
    dot: "bg-orange",
  },
  EXPIRED: {
    bg: "bg-surface-raised",
    text: "text-text-muted",
    border: "border-border",
    dot: "bg-text-muted",
  },
  ARCHIVED: {
    bg: "bg-surface-raised",
    text: "text-text-muted",
    border: "border-border",
    dot: "bg-text-muted",
  },
};

export default function StatusBadge({
  status,
  label,
  size = "md",
  className,
}: StatusBadgeProps) {
  const normalizedStatus = status.toUpperCase();
  const theme =
    statusColorMap[normalizedStatus] || {
      bg: "bg-surface-raised",
      text: "text-text-muted",
      border: "border-border",
      dot: "bg-text-muted",
    };

  const displayText =
    label ||
    status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border transition-colors",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        theme.bg,
        theme.text,
        theme.border,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full shrink-0", theme.dot)} />
      <span>{displayText}</span>
    </span>
  );
}
