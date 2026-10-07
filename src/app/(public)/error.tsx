"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function PublicErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Public catalog boundary caught error:", error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5 animate-in fade-in duration-200">
      <div className="size-14 rounded-2xl bg-orange/10 text-orange flex items-center justify-center mx-auto border border-orange/20 shadow-2xs">
        <AlertCircle className="size-7" />
      </div>

      <div className="space-y-1.5">
        <h2 className="font-serif text-2xl font-bold text-text-primary tracking-tight">
          Failed to load catalog records
        </h2>
        <p className="text-xs text-text-secondary leading-relaxed">
          {error.message ||
            "Could not fetch directory resources from the server. Please verify your connection."}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber text-white hover:bg-amber-hover transition-colors shadow-2xs cursor-pointer"
        >
          <RefreshCw className="size-3.5" /> Retry
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-surface border border-border text-text-primary hover:bg-surface-raised transition-colors cursor-pointer"
        >
          <Home className="size-3.5" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
