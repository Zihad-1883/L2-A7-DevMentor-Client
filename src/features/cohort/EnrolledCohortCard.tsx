"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Layers,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import type { CohortItem } from "@/types/cohort.types";
import { formatDate } from "@/lib/utils";

interface EnrolledCohortCardProps {
  cohort: CohortItem;
  enrolledAt: string;
}

export default function EnrolledCohortCard({
  cohort,
  enrolledAt,
}: EnrolledCohortCardProps) {
  const mentorName = cohort.mentor?.name || "DevMentor Faculty Lead";
  const mentorInitials = mentorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sessions = cohort.sessions || [];
  const completedSessions = sessions.filter((s) => s.status === "COMPLETED").length;
  const totalSessions = sessions.length;

  return (
    <div className="p-6 rounded-2xl bg-surface border border-border shadow-2xs hover:border-amber/40 hover:shadow-md transition-all flex flex-col justify-between group">
      <div className="space-y-4">
        {/* Top Mentor & Badge Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-9 rounded-full bg-amber-light text-amber font-serif font-bold text-xs flex items-center justify-center border border-amber/30 shrink-0">
              {mentorInitials}
            </div>
            <div className="min-w-0">
              <p className="font-serif text-xs font-bold text-text-primary truncate">
                {mentorName}
              </p>
              <p className="text-[10px] text-text-muted truncate">
                {cohort.mentor?.mentorProfile?.experienceLevel || "SENIOR"} Lead
              </p>
            </div>
          </div>

          <StatusBadge
            status={cohort.status === "PUBLISHED" ? "ACTIVE" : cohort.status}
            label={cohort.status === "PUBLISHED" ? "In Progress" : undefined}
            size="sm"
          />
        </div>

        {/* Title & Description */}
        <div>
          <Link href={`/dashboard/cohorts/${cohort.id}`}>
            <h3 className="font-serif text-base font-bold text-text-primary group-hover:text-amber transition-colors line-clamp-2">
              {cohort.title}
            </h3>
          </Link>
          <p className="text-xs text-text-secondary line-clamp-2 mt-1.5 leading-relaxed">
            {cohort.description}
          </p>
        </div>

        {/* Tech Stack Tags */}
        {cohort.techStackTags && cohort.techStackTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {cohort.techStackTags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-surface-raised text-text-secondary border border-border/70"
              >
                {tag}
              </span>
            ))}
            {cohort.techStackTags.length > 4 && (
              <span className="text-[10px] text-text-muted self-center font-medium">
                +{cohort.techStackTags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Program Specifications Box */}
        <div className="p-3.5 rounded-xl bg-surface-raised/70 border border-border/80 space-y-2 text-xs">
          <div className="flex items-center justify-between text-text-muted">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-amber" /> Duration
            </span>
            <span className="font-semibold text-text-primary">
              {cohort.durationWeeks} Weeks
            </span>
          </div>

          <div className="flex items-center justify-between text-text-muted">
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-amber" /> Sessions
            </span>
            <span className="font-mono font-medium text-text-primary">
              {totalSessions > 0 ? `${completedSessions}/${totalSessions} Completed` : "Weekly Schedule"}
            </span>
          </div>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between">
            <span className="text-[11px] text-text-muted">Enrolled on:</span>
            <span className="text-[11px] font-medium text-text-secondary">
              {formatDate(enrolledAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-5 mt-4 border-t border-border/60 flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold text-emerald flex items-center gap-1">
          <CheckCircle2 className="size-3.5" /> Enrolled Student
        </span>

        <Link href={`/dashboard/cohorts/${cohort.id}`}>
          <Button
            size="sm"
            className="bg-amber text-white hover:bg-amber-hover text-xs font-semibold gap-1 shadow-xs cursor-pointer"
          >
            <span>Enter Workspace</span>
            <ChevronRight className="size-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
