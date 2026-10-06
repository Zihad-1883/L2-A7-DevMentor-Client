"use client";

import * as React from "react";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Coins,
  Loader2,
  CalendarCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import type { SprintSessionItem } from "@/types/sprint.types";
import { formatDateTime, formatDate } from "@/lib/utils";
import { sprintService } from "@/services/sprint.service";
import { toast } from "sonner";

interface SprintSessionListProps {
  sessions: SprintSessionItem[];
  sprintStatus: string;
  isStudentOwner: boolean;
  isClaimed: boolean;
  onSessionUpdated?: () => void;
}

export default function SprintSessionList({
  sessions,
  sprintStatus,
  isStudentOwner,
  isClaimed,
  onSessionUpdated,
}: SprintSessionListProps) {
  const [confirmingSessionId, setConfirmingSessionId] = React.useState<string | null>(null);

  const handleConfirmSession = async (sessionId: string) => {
    setConfirmingSessionId(sessionId);
    try {
      const res = await sprintService.confirmSession(sessionId);
      toast.success(res.message || "Session confirmed successfully! Escrow credits locked.");
      if (onSessionUpdated) onSessionUpdated();
    } catch (err: unknown) {
      const errMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        "Failed to confirm session";
      toast.error(errMsg);
    } finally {
      setConfirmingSessionId(null);
    }
  };

  if (!sessions || sessions.length === 0) {
    return (
      <div className="p-8 text-center bg-surface-raised/40 rounded-2xl border border-dashed border-border/80">
        <Clock className="size-8 text-text-muted mx-auto mb-2 opacity-50" />
        <p className="text-xs font-semibold text-text-primary">No sessions scheduled yet</p>
        <p className="text-[11px] text-text-muted mt-0.5">
          Sessions will populate automatically once mentor proposes time slots.
        </p>
      </div>
    );
  }

  // Sort sessions by dayNumber
  const sortedSessions = [...sessions].sort((a, b) => a.dayNumber - b.dayNumber);

  return (
    <div className="space-y-4">
      {sortedSessions.map((session) => {
        const hasScheduledTime = Boolean(session.scheduledAt);
        const joinLink = session.joinLink || session.meetingLink;
        const isConfirming = confirmingSessionId === session.id;

        return (
          <div
            key={session.id}
            className={`p-5 rounded-2xl border transition-all ${
              session.status === "CONFIRMED"
                ? "bg-surface border-emerald/30 shadow-2xs"
                : session.status === "COMPLETED"
                ? "bg-surface-raised/50 border-border/70"
                : "bg-surface border-border hover:border-amber/40 shadow-2xs"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Left Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-surface-raised border border-border text-text-primary">
                    SESSION #{session.dayNumber}
                  </span>
                  <StatusBadge status={session.status} size="sm" />
                  {session.durationMinutes && (
                    <span className="text-[11px] text-text-muted font-medium">
                      ({session.durationMinutes} min)
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-amber" />
                    {!isClaimed
                      ? "Awaiting mentor claim"
                      : hasScheduledTime
                      ? formatDateTime(session.scheduledAt)
                      : "Awaiting mentor proposed time"}
                  </span>

                  {session.creditCost && (
                    <span className="flex items-center gap-1 text-emerald font-semibold">
                      <Coins className="size-3.5" />
                      {session.creditCost} Credits
                    </span>
                  )}
                </div>

                {session.notes && (
                  <p className="text-xs text-text-muted italic bg-surface-raised/40 p-2 rounded-lg border border-border/50 max-w-xl">
                    &ldquo;{session.notes}&rdquo;
                  </p>
                )}
              </div>

              {/* Right Action Controls */}
              <div className="flex items-center gap-2.5 shrink-0">
                {/* 1. Unclaimed sprint notice */}
                {!isClaimed && session.status === "PENDING" && (
                  <span className="text-[11px] text-text-muted italic bg-surface-raised px-2.5 py-1 rounded-lg border border-border/60">
                    Awaiting mentor assignment
                  </span>
                )}

                {/* 2. Claimed sprint - Pending mentor's specific time proposal */}
                {isClaimed && session.status === "PENDING" && !hasScheduledTime && (
                  <span className="text-[11px] text-amber font-medium bg-amber-light px-2.5 py-1 rounded-lg border border-amber/30">
                    Awaiting mentor time proposal
                  </span>
                )}

                {/* 3. Claimed sprint - Mentor proposed time, student confirms */}
                {isClaimed && session.status === "PENDING" && isStudentOwner && hasScheduledTime && (
                  <Button
                    size="sm"
                    onClick={() => handleConfirmSession(session.id)}
                    disabled={isConfirming}
                    className="bg-amber text-white hover:bg-amber-hover text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
                  >
                    {isConfirming ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        <span>Confirming...</span>
                      </>
                    ) : (
                      <>
                        <CalendarCheck className="size-3.5" />
                        <span>Confirm Slot</span>
                      </>
                    )}
                  </Button>
                )}

                {/* 2. Confirmed Session - Join Meeting */}
                {session.status === "CONFIRMED" && joinLink && (
                  <a
                    href={joinLink.startsWith("http") ? joinLink : `https://${joinLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      className="bg-emerald text-white hover:bg-emerald-hover text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Video className="size-3.5" />
                      <span>Join Meeting</span>
                      <ExternalLink className="size-3 ml-0.5 opacity-80" />
                    </Button>
                  </a>
                )}

                {/* 3. Completed Status Pill */}
                {session.status === "COMPLETED" && (
                  <div className="flex items-center gap-1 text-xs text-emerald font-semibold px-3 py-1 rounded-full bg-emerald-light border border-emerald/20">
                    <CheckCircle2 className="size-3.5" />
                    <span>Completed</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
