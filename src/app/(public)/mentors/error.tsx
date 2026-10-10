"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MentorsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Mentors directory error:", error);
  }, [error]);

  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center p-6 bg-background animate-in fade-in duration-200">
      <div className="p-8 sm:p-12 rounded-3xl border border-border/80 bg-surface shadow-xs text-center space-y-5 max-w-md w-full">
        <div className="size-14 rounded-2xl bg-amber-light text-amber flex items-center justify-center mx-auto border border-amber/20">
          <Users className="size-7 text-amber" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-text-primary">
            Unable to Load Mentors
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            {error.message ||
              "We encountered an issue fetching the verified mentors directory. Please try refreshing or check your connection."}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            onClick={() => reset()}
            className="h-10 px-4 text-xs font-semibold bg-amber text-white hover:bg-amber-hover transition-colors cursor-pointer gap-1.5"
          >
            <RefreshCw className="size-3.5" /> Retry Request
          </Button>

          <Link href="/">
            <Button
              type="button"
              variant="outline"
              className="h-10 px-4 text-xs font-semibold border-border hover:bg-surface-raised transition-colors cursor-pointer gap-1.5"
            >
              <Home className="size-3.5" /> Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
