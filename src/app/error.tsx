"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log unexpected runtime crashes
    console.error("Global application boundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl bg-surface border border-border/80 shadow-xl p-6 sm:p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
        <div className="size-14 rounded-2xl bg-orange/10 text-orange flex items-center justify-center mx-auto border border-orange/20 shadow-2xs">
          <AlertCircle className="size-7" />
        </div>

        <div className="space-y-1.5">
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            Something unexpected occurred
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            {error.message ||
              "An error occurred while loading this view. You can reload or return to the home page."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber text-white hover:bg-amber-hover transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className="size-3.5" /> Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-surface border border-border text-text-primary hover:bg-surface-raised transition-colors cursor-pointer"
          >
            <Home className="size-3.5" /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
