import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  hasHeader?: boolean;
  lines?: number;
}

export default function SkeletonCard({
  className,
  hasHeader = true,
  lines = 3,
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-6 shadow-xs animate-pulse space-y-4",
        className
      )}
    >
      {hasHeader && (
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-border/60 rounded w-1/3" />
            <div className="h-3.5 bg-border/40 rounded w-1/2" />
          </div>
          <div className="size-10 bg-border/50 rounded-lg shrink-0" />
        </div>
      )}

      <div className="space-y-2.5 pt-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3.5 bg-border/40 rounded"
            style={{ width: `${Math.max(45, 95 - i * 18)}%` }}
          />
        ))}
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-border/40">
        <div className="h-7 w-20 bg-border/50 rounded-full" />
        <div className="h-8 w-24 bg-border/60 rounded-md" />
      </div>
    </div>
  );
}
