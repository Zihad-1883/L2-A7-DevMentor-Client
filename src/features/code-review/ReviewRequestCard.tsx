"use client";

import * as React from "react";
import Link from "next/link";
import {
  Code2,
  Zap,
  Layers,
  Clock,
  Coins,
  ArrowRight,
  GitBranch,
  FileCode2,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileDiff,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CodeReviewRequestItem, CodeReviewStatus } from "@/types/code-review.types";
import { formatDate } from "@/lib/utils";

interface ReviewRequestCardProps {
  request: CodeReviewRequestItem;
}

const STATUS_CONFIG: Record<
  CodeReviewStatus,
  { label: string; bg: string; text: string; icon: React.ReactNode }
> = {
  OPEN: {
    label: "Open in Pool",
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  PREVIEW_LOCKED: {
    label: "Mentor Inspecting",
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  CLAIMED: {
    label: "Under Review",
    bg: "bg-purple-50 border-purple-200",
    text: "text-purple-700",
    icon: <UserCheck className="w-3.5 h-3.5" />,
  },
  DELIVERED: {
    label: "Feedback Ready",
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  CANCELLED: {
    label: "Cancelled & Refunded",
    bg: "bg-stone-100 border-stone-200",
    text: "text-stone-600",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
  EXPIRED: {
    label: "Expired",
    bg: "bg-stone-100 border-stone-200",
    text: "text-stone-600",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

export default function ReviewRequestCard({ request }: ReviewRequestCardProps) {
  const isQuick = request.tier === "QUICK";
  const rewardCredits = request.creditReward || (isQuick ? 10 : 50);
  const statusInfo = STATUS_CONFIG[request.status] || STATUS_CONFIG.OPEN;

  return (
    <Card className="p-5 border border-stone-200/80 bg-white hover:border-amber-300 transition-all shadow-xs flex flex-col justify-between group">
      <div>
        {/* Header: Tier Pill + Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                isQuick
                  ? "bg-amber-100/70 text-amber-900 border border-amber-200"
                  : "bg-purple-100/70 text-purple-900 border border-purple-200"
              }`}
            >
              {isQuick ? <Zap className="w-3 h-3 text-amber-600" /> : <Layers className="w-3 h-3 text-purple-600" />}
              {isQuick ? "Quick Review" : "Deep Audit"}
            </span>

            {request.language && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-xs font-mono">
                <Code2 className="w-3 h-3 text-stone-500" />
                {request.language}
              </span>
            )}
          </div>

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.bg} ${statusInfo.text}`}
          >
            {statusInfo.icon}
            {statusInfo.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-base text-stone-900 line-clamp-1 group-hover:text-amber-800 transition-colors">
          {request.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-stone-600 line-clamp-2 mt-1 mb-4 leading-relaxed">
          {request.description}
        </p>

        {/* Details Pill Row */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 pb-4 border-b border-stone-100">
          {request.githubRepoUrl && (
            <span className="inline-flex items-center gap-1 bg-stone-50 px-2 py-1 rounded border border-stone-200/60 max-w-[200px] truncate">
              <GitBranch className="w-3 h-3 text-stone-400 shrink-0" />
              <span className="truncate">{request.githubRepoUrl.replace("https://github.com/", "")}</span>
            </span>
          )}

          {request.attachmentUrl && (
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-1 rounded border border-amber-200/60 max-w-[200px] truncate">
              <FileDiff className="w-3 h-3 text-amber-600 shrink-0" />
              <span className="truncate">{request.attachmentName || "Diff Patch Attached"}</span>
            </span>
          )}

          {request.specificFiles && (
            <span className="inline-flex items-center gap-1 bg-stone-50 px-2 py-1 rounded border border-stone-200/60 max-w-[150px] truncate">
              <FileCode2 className="w-3 h-3 text-stone-400 shrink-0" />
              <span className="truncate">{request.specificFiles}</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1 ml-auto text-stone-400">
            {formatDate(request.createdAt)}
          </span>
        </div>
      </div>

      {/* Footer: Mentor assigned + Credit Escrow + Action Button */}
      <div className="flex items-center justify-between gap-3 pt-4 mt-auto">
        <div className="flex items-center gap-2">
          {request.assignedMentor ? (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs uppercase border border-amber-200">
                {request.assignedMentor.name?.charAt(0) || "M"}
              </div>
              <div className="text-xs">
                <p className="font-medium text-stone-900 line-clamp-1">{request.assignedMentor.name}</p>
                <p className="text-[10px] text-stone-500">Assigned Reviewer</p>
              </div>
            </div>
          ) : (
            <div className="text-xs text-stone-500 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-semibold text-stone-900">{rewardCredits} Cr</span> in Escrow
            </div>
          )}
        </div>

        <Link href={`/dashboard/code-reviews/${request.id}`}>
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3 text-xs border-stone-200 hover:border-amber-300 hover:bg-amber-50/50 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500 transition-all"
          >
            Inspect
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
