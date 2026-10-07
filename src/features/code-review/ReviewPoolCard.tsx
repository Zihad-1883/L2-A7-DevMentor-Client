"use client";

import * as React from "react";
import Link from "next/link";
import {
  Code2,
  Zap,
  Layers,
  Clock,
  Coins,
  GitBranch,
  FileCode2,
  ArrowRight,
  Lock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import type { CodeReviewRequestItem } from "@/types/code-review.types";
import { formatDate } from "@/lib/utils";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

interface ReviewPoolCardProps {
  request: CodeReviewRequestItem;
  onInspect?: (request: CodeReviewRequestItem) => void;
}

export default function ReviewPoolCard({
  request,
  onInspect,
}: ReviewPoolCardProps) {
  const { user } = useAuthContext();
  const now = useCurrentTime();
  const isQuick = request.tier === "QUICK";
  const rewardCredits = request.creditReward || (isQuick ? 10 : 50);
  const slaText = isQuick ? "2 Hours SLA" : "24 Hours SLA";
  const bdtValue = rewardCredits * 4;

  const isPreviewLocked =
    request.status === "PREVIEW_LOCKED" &&
    request.previewExpiresAt != null &&
    new Date(request.previewExpiresAt).getTime() > now;

  const isLockedByMe =
    isPreviewLocked &&
    Boolean(request.previewMentorId) &&
    request.previewMentorId === user?.id;

  const isLockedByOther = isPreviewLocked && !isLockedByMe;

  return (
    <div className="flex flex-col justify-between p-6 rounded-3xl bg-surface border border-border hover:border-amber/40 shadow-xs hover:shadow-md transition-all group">
      <div className="space-y-4">
        {/* 1. Header Badges: Tier, Language & Reward */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                isQuick
                  ? "bg-amber-light text-amber border-amber/20"
                  : "bg-indigo-50 text-indigo-600 border-indigo-200"
              }`}
            >
              {isQuick ? <Zap className="size-3.5" /> : <Layers className="size-3.5" />}
              {isQuick ? "Quick Review" : "Deep Architecture"}
            </span>

            {request.language && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-surface-raised border border-border text-text-primary capitalize">
                <Code2 className="size-3 text-text-muted" />
                {request.language}
              </span>
            )}

            {isPreviewLocked && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${
                  isLockedByMe
                    ? "bg-amber-light text-amber border-amber/30"
                    : "bg-orange/10 text-orange border-orange/20"
                }`}
              >
                <Lock className="size-3" />
                {isLockedByMe ? "Your Preview Lock" : "Reserved by Mentor"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-surface-raised border border-border/80">
            <Coins className="size-4 text-amber" />
            <span className="font-bold text-sm text-text-primary">
              {rewardCredits} Credits
            </span>
            <span className="text-[11px] font-semibold text-emerald">
              (৳{bdtValue} BDT)
            </span>
          </div>
        </div>

        {/* 2. Title & Student Statement */}
        <div className="space-y-1.5">
          <h3 className="font-serif text-lg font-bold text-text-primary group-hover:text-amber transition-colors line-clamp-1">
            {request.title}
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
            {request.description}
          </p>
        </div>

        {/* 3. Code Snippet Preview (if present) */}
        {request.codeSnippet ? (
          <div className="rounded-2xl bg-[#18181b] p-3.5 border border-neutral-800 font-mono text-[11px] text-neutral-200 relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800/80 text-[10px] text-neutral-400">
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-rose-500/80" />
                  <span className="size-2 rounded-full bg-amber-500/80" />
                  <span className="size-2 rounded-full bg-emerald-500/80" />
                </span>
                <span className="flex items-center gap-1 ml-1 text-neutral-300 font-medium">
                  <FileCode2 className="size-3 text-amber" />
                  {request.specificFiles || `snippet.${request.language || "ts"}`}
                </span>
              </div>
              <span className="text-neutral-400">{request.codeSnippet.split("\n").length} lines</span>
            </div>
            <pre className="line-clamp-3 leading-relaxed text-neutral-200 overflow-x-hidden font-mono selection:bg-amber/30 selection:text-white">
              <code>{request.codeSnippet}</code>
            </pre>
          </div>
        ) : request.githubRepoUrl ? (
          <div className="p-3 rounded-xl bg-surface-raised/70 border border-border flex items-center justify-between text-xs text-text-secondary">
            <div className="flex items-center gap-2 truncate">
              <GithubIcon className="size-4 text-text-primary shrink-0" />
              <span className="font-semibold text-text-primary truncate">
                {request.githubRepoUrl.replace("https://github.com/", "")}
              </span>
            </div>
            {request.branchName && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-surface border border-border shrink-0 ml-2">
                <GitBranch className="size-3 text-text-muted" /> {request.branchName}
              </span>
            )}
          </div>
        ) : null}

        {/* 4. Target Files & Specs */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted pt-1">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-amber" />
            {slaText}
          </span>

          <span className="text-border">•</span>

          <span className="flex items-center gap-1.5">
            <User className="size-3.5 text-text-muted" />
            {request.student?.name || "Student Developer"}
          </span>

          <span className="text-border">•</span>

          <span>{formatDate(request.createdAt)}</span>
        </div>
      </div>

      {/* 5. Bottom Action Controls */}
      <div className="pt-4 mt-4 border-t border-border/70 flex items-center justify-between">
        <span className="text-xs font-semibold text-text-muted">
          Escrow Guaranteed
        </span>

        <div className="flex items-center gap-2">
          {onInspect ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onInspect(request)}
              className="text-xs h-8 px-3 border-border bg-surface hover:bg-surface-raised cursor-pointer gap-1.5"
            >
              <FileCode2 className="size-3.5 text-amber" /> Inspect Code
            </Button>
          ) : null}

          <Button
            size="sm"
            onClick={() => (onInspect ? onInspect(request) : undefined)}
            className="bg-amber text-white hover:bg-amber-hover font-semibold text-xs h-8 px-3 shadow-2xs gap-1.5 cursor-pointer"
          >
            <Lock className="size-3" />
            <span>Preview &amp; Lock</span>
            <ArrowRight className="size-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
