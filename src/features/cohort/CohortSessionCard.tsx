"use client";

import * as React from "react";
import {
  Calendar,
  Clock,
  Video,
  FileText,
  Link2,
  Code2,
  Trash2,
  Plus,
  CheckCircle2,
  ExternalLink,
  Edit,
  Coins,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import type { CohortSessionItem, ICohortResourceItem } from "@/types/cohort.types";
import { formatDateTime } from "@/lib/utils";

interface CohortSessionCardProps {
  session: CohortSessionItem;
  sessionIndex: number;
  isMentorView?: boolean;
  onEdit?: (session: CohortSessionItem) => void;
  onDelete?: (sessionId: string) => void;
  onComplete?: (sessionId: string) => void;
  onAddResource?: (sessionId: string) => void;
  onRemoveResource?: (sessionId: string, resourceId: string) => void;
}

export default function CohortSessionCard({
  session,
  sessionIndex,
  isMentorView = true,
  onEdit,
  onDelete,
  onComplete,
  onAddResource,
  onRemoveResource,
}: CohortSessionCardProps) {
  const [isResourcesExpanded, setIsResourcesExpanded] = React.useState(true);

  const resources: ICohortResourceItem[] = Array.isArray(session.resources)
    ? session.resources
    : [];

  const getResourceIcon = (type?: string) => {
    switch (type) {
      case "LINK":
        return <Link2 className="size-3.5 text-amber" />;
      case "CODE_SNIPPET":
        return <Code2 className="size-3.5 text-indigo-500" />;
      case "FILE":
        return <FileText className="size-3.5 text-emerald" />;
      default:
        return <FileText className="size-3.5 text-text-secondary" />;
    }
  };

  const isCompleted = session.status === "COMPLETED";

  return (
    <div
      className={`p-5 sm:p-6 rounded-2xl border transition-all ${
        isCompleted
          ? "bg-emerald-50/20 border-emerald/20"
          : "bg-surface border-border hover:border-amber/30 shadow-2xs"
      }`}
    >
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-amber-light text-amber border border-amber/20 flex items-center justify-center font-bold text-xs shrink-0">
            #{session.sessionNumber || sessionIndex + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-serif text-base font-bold text-text-primary">
                {session.title}
              </h4>
              <StatusBadge status={session.status} />
            </div>
            <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
              <span className="flex items-center gap-1">
                <Calendar className="size-3 text-amber" />
                {formatDateTime(session.scheduledAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3 text-text-muted" />
                {session.durationMinutes || 60} mins
              </span>
              {Boolean(session.creditCost) && (
                <span className="flex items-center gap-1 text-amber font-semibold">
                  <Coins className="size-3" />
                  {session.creditCost} Credits
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls for Mentor */}
        {isMentorView && (
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
            {!isCompleted && onComplete && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onComplete(session.id)}
                className="h-8 px-2.5 text-xs text-emerald border-emerald/30 hover:bg-emerald-light/40 gap-1"
                title="Mark session as completed"
              >
                <CheckCircle2 className="size-3.5" />
                <span className="hidden sm:inline">Complete</span>
              </Button>
            )}

            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(session)}
                className="h-8 px-2.5 text-xs border-border hover:bg-surface-raised gap-1"
              >
                <Edit className="size-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            )}

            {onDelete && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(session.id)}
                className="h-8 px-2.5 text-xs text-rose border-rose/30 hover:bg-rose-50"
                title="Delete session"
              >
                <Trash2 className="size-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 2. Meeting / Video Join Link */}
      {(session.joinLink || session.meetingLink) && (
        <div className="mt-3.5 p-3 rounded-xl bg-surface-raised/70 border border-border/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-text-secondary truncate pr-2">
            <Video className="size-4 text-amber shrink-0" />
            <span className="font-semibold text-text-primary shrink-0">Meeting:</span>
            <span className="truncate text-text-muted">{session.joinLink || session.meetingLink}</span>
          </div>

          <a
            href={session.joinLink || session.meetingLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber hover:underline shrink-0 ml-2"
          >
            Launch <ExternalLink className="size-3" />
          </a>
        </div>
      )}

      {/* 3. Session Resources Section */}
      <div className="mt-4 pt-3 border-t border-border/50 space-y-2">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsResourcesExpanded(!isResourcesExpanded)}
            className="flex items-center gap-1.5 text-xs font-bold text-text-primary hover:text-amber transition-colors cursor-pointer"
          >
            <span>Learning Resources ({resources.length})</span>
            {isResourcesExpanded ? (
              <ChevronUp className="size-3.5 text-text-muted" />
            ) : (
              <ChevronDown className="size-3.5 text-text-muted" />
            )}
          </button>

          {isMentorView && onAddResource && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddResource(session.id)}
              className="h-7 px-2 text-[11px] font-semibold text-amber border-amber/30 hover:bg-amber-light/30 gap-1"
            >
              <Plus className="size-3" /> Add Resource
            </Button>
          )}
        </div>

        {isResourcesExpanded && (
          <div className="space-y-1.5 pt-1">
            {resources.length === 0 ? (
              <p className="text-xs text-text-muted italic bg-surface-raised/30 p-2.5 rounded-lg border border-dashed border-border/80">
                No materials or links attached yet.
              </p>
            ) : (
              resources.map((res) => (
                <div
                  key={res.id}
                  className="p-2.5 rounded-xl bg-surface-raised/50 border border-border/70 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="size-6 rounded-md bg-surface border border-border flex items-center justify-center shrink-0">
                      {getResourceIcon(res.type)}
                    </div>
                    <div className="min-w-0 truncate">
                      <span className="font-semibold text-text-primary block truncate">
                        {res.title}
                      </span>
                      {res.content && (
                        <span className="text-[11px] text-text-muted block truncate font-mono">
                          {res.content}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {res.url && (
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-amber hover:underline flex items-center gap-0.5"
                      >
                        Open <ExternalLink className="size-3" />
                      </a>
                    )}

                    {isMentorView && onRemoveResource && (
                      <button
                        type="button"
                        onClick={() => onRemoveResource(session.id, res.id)}
                        className="text-text-muted hover:text-rose p-1 rounded transition-colors cursor-pointer"
                        title="Remove resource"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
