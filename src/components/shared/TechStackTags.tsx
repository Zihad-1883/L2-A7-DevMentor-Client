import * as React from "react";
import { cn } from "@/lib/utils";

interface TechStackTagsProps {
  tags: string[];
  maxVisible?: number;
  size?: "sm" | "md";
  className?: string;
}

export default function TechStackTags({
  tags,
  maxVisible,
  size = "md",
  className,
}: TechStackTagsProps) {
  if (!tags || tags.length === 0) return null;

  const visibleTags = maxVisible ? tags.slice(0, maxVisible) : tags;
  const remainingCount = maxVisible ? tags.length - maxVisible : 0;

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {visibleTags.map((tag) => (
        <span
          key={tag}
          className={cn(
            "rounded-md bg-surface-raised text-text-secondary border border-border/80 font-medium",
            size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
          )}
        >
          {tag}
        </span>
      ))}
      {remainingCount > 0 && (
        <span
          className={cn(
            "rounded-md bg-surface-raised text-text-muted border border-border/60 font-medium",
            size === "sm" ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-1 text-xs"
          )}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  );
}
