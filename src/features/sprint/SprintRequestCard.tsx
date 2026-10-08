"use client";

import * as React from "react";
import Link from "next/link";
import {
  Rocket,
  Calendar,
  Clock,
  ArrowRight,
  User,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import type { SprintRequestItem } from "@/types/sprint.types";
import { formatDate } from "@/lib/utils";

interface SprintRequestCardProps {
  sprint: SprintRequestItem;
}

export default function SprintRequestCard({ sprint }: SprintRequestCardProps) {
  const sessions = sprint.sessions || [];
  const completedSessions = sessions.filter((s) => s.status === "COMPLETED").length;
  const totalSessions = sessions.length > 0 ? sessions.length : sprint.selectedDays.length;

  const mentorName = sprint.claimedByMentor?.name || sprint.mentor?.name;
  const isClaimed = Boolean(mentorName && sprint.status !== "PENDING_CLAIM");

  // Format start date cleanly
  const startDateFormatted = sprint.startDate ? formatDate(sprint.startDate) : "Flexible";

  return (
    <div className="p-6 rounded-2xl bg-surface border border-border shadow-2xs hover:border-amber/40 hover:shadow-md transition-all flex flex-col justify-between group">
      <div className="space-y-4">
        {/* Top Header: Status & Session Count */}
        <div className="flex items-center justify-between gap-3">
          <StatusBadge
            status={sprint.status}
            label={
              sprint.status === "PENDING_CLAIM"
                ? "Seeking Mentor"
                : sprint.status === "ACTIVE"
                ? "Active Sprint"
                : undefined
            }
            size="sm"
          />

          <span className="text-[11px] font-semibold text-text-muted bg-surface-raised px-2.5 py-0.5 rounded-full border border-border">
            {totalSessions} Session{totalSessions > 1 ? "s" : ""} ({sprint.durationDays} Days)
          </span>
        </div>

        {/* Title */}
        <div>
          <Link href={`/dashboard/sprints/${sprint.id}`}>
            <h3 className="font-serif text-base font-bold text-text-primary group-hover:text-amber transition-colors line-clamp-2">
              {sprint.title}
            </h3>
          </Link>
          <p className="text-xs text-text-secondary line-clamp-2 mt-1.5 leading-relaxed">
            {sprint.description}
          </p>
        </div>

        {/* Tech Stack Tags */}
        {sprint.techStackTags && sprint.techStackTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {sprint.techStackTags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-surface-raised text-text-secondary border border-border/70"
              >
                {tag}
              </span>
            ))}
            {sprint.techStackTags.length > 4 && (
              <span className="text-[10px] text-text-muted self-center font-medium">
                +{sprint.techStackTags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Timeline & Mentor Details */}
        <div className="p-3.5 rounded-xl bg-surface-raised/70 border border-border/80 space-y-2 text-xs">
          <div className="flex items-center justify-between text-text-muted">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-amber" /> Starts {startDateFormatted}
            </span>
            <span className="flex items-center gap-1 font-mono font-medium text-text-secondary">
              <Clock className="size-3.5 text-amber" />
              {completedSessions}/{totalSessions} Done
            </span>
          </div>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between">
            <span className="text-[11px] text-text-muted">Assigned Mentor:</span>
            {isClaimed ? (
              <span className="font-medium text-text-primary text-xs flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald" />
                {mentorName}
              </span>
            ) : sprint.targetMentorId ? (
              <span className="text-purple-600 dark:text-purple-400 text-[11px] font-semibold flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-purple-600 animate-pulse" />
                Targeted: {sprint.targetMentor?.name || "Dedicated Mentor"}
              </span>
            ) : (
              <span className="text-amber text-[11px] font-semibold flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-amber animate-pulse" />
                Open in Mentor Pool
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-5 mt-4 border-t border-border/60 flex items-center justify-between gap-3">
        <span className="text-[11px] text-text-muted">
          Created {formatDate(sprint.createdAt)}
        </span>

        <Link href={`/dashboard/sprints/${sprint.id}`}>
          <Button
            size="sm"
            variant="outline"
            className="text-xs font-semibold gap-1.5 border-border group-hover:border-amber/40 cursor-pointer"
          >
            <span>View Details</span>
            <ChevronRight className="size-3.5 text-text-muted group-hover:text-amber" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
