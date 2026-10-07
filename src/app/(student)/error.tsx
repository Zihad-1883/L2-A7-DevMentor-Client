"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, LayoutDashboard } from "lucide-react";

export default function StudentErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Student dashboard boundary caught error:", error);
  }, [error]);

  return (
    <div className="p-8 sm:p-12 rounded-3xl border border-border/80 bg-surface shadow-xs text-center space-y-4 max-w-xl mx-auto my-8">
      <div className="size-12 rounded-2xl bg-orange/10 text-orange flex items-center justify-center mx-auto border border-orange/20">
        <AlertCircle className="size-6" />
      </div>

      <div className="space-y-1">
        <h2 className="font-serif text-xl font-bold text-text-primary">
          Dashboard Error
        </h2>
        <p className="text-xs text-text-secondary leading-relaxed">
          {error.message ||
            "Unable to synchronize your enrolled programs or wallet balance. Please try again."}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber text-white hover:bg-amber-hover transition-colors cursor-pointer"
        >
          <RefreshCw className="size-3.5" /> Try Again
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-raised border border-border text-text-primary hover:bg-surface transition-colors"
        >
          <LayoutDashboard className="size-3.5" /> My Dashboard
        </Link>
      </div>
    </div>
  );
}
