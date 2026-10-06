"use client";

import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Calendar, Clock, Video, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sprintService } from "@/services/sprint.service";
import type { SprintSessionItem } from "@/types/sprint.types";

interface ProposeSessionFormProps {
  session: SprintSessionItem;
  dayNumber: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProposeSessionForm({
  session,
  dayNumber,
  onSuccess,
  onCancel,
}: ProposeSessionFormProps) {
  // Pre-fill default datetime if existing or tomorrow around current hour
  const defaultDateStr = React.useMemo(() => {
    if (session.scheduledAt) {
      try {
        const d = new Date(session.scheduledAt);
        // format YYYY-MM-DDThh:mm
        return d.toISOString().slice(0, 16);
      } catch {
        // ignore
      }
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(18, 0, 0, 0); // 6:00 PM default
    return tomorrow.toISOString().slice(0, 16);
  }, [session.scheduledAt]);

  const [dateTime, setDateTime] = React.useState<string>(defaultDateStr);
  const [joinLink, setJoinLink] = React.useState<string>(session.joinLink || session.meetingLink || "");
  const [duration, setDuration] = React.useState<number>(session.durationMinutes || 60);

  const proposeMutation = useMutation({
    mutationFn: () => {
      if (!dateTime) {
        throw new Error("Please select a valid date and time");
      }
      const isoDate = new Date(dateTime).toISOString();
      return sprintService.proposeSessionSlot(session.id, {
        scheduledAt: isoDate,
        joinLink: joinLink.trim() ? joinLink.trim() : undefined,
        durationMinutes: Number(duration) || 60,
      });
    },
    onSuccess: (res) => {
      toast.success(res.message || `Session #${dayNumber} slot proposed successfully!`);
      if (onSuccess) onSuccess();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to propose session slot.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    proposeMutation.mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 sm:p-5 rounded-2xl bg-surface-raised border border-amber/30 space-y-4 animate-in fade-in duration-200"
    >
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-amber-light text-amber flex items-center justify-center font-bold text-xs">
            #{dayNumber}
          </div>
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Propose Meeting Slot
          </h4>
        </div>
        <span className="text-[11px] text-text-muted">
          Student will confirm this schedule
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Date and Time Picker */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
            <Calendar className="size-3.5 text-amber" /> Session Date & Time
          </label>
          <Input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
            className="text-xs bg-surface border-border rounded-xl h-9"
          />
        </div>

        {/* Duration in Minutes */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
            <Clock className="size-3.5 text-amber" /> Duration (Minutes)
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full text-xs bg-surface border border-border rounded-xl h-9 px-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-amber"
          >
            <option value={30}>30 Minutes</option>
            <option value={45}>45 Minutes</option>
            <option value={60}>60 Minutes (1 Hour)</option>
            <option value={90}>90 Minutes (1.5 Hours)</option>
            <option value={120}>120 Minutes (2 Hours)</option>
          </select>
        </div>
      </div>

      {/* Meeting Link (Google Meet / Zoom) */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
          <Video className="size-3.5 text-amber" /> Video Meeting Link (Optional)
        </label>
        <Input
          type="url"
          placeholder="https://meet.google.com/abc-defg-hij or Zoom URL"
          value={joinLink}
          onChange={(e) => setJoinLink(e.target.value)}
          className="text-xs bg-surface border-border rounded-xl h-9"
        />
        <p className="text-[11px] text-text-muted">
          You can also provide or update the meeting link later before the session begins.
        </p>
      </div>

      {/* Form Action Controls */}
      <div className="flex items-center justify-end gap-2.5 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={proposeMutation.isPending}
            className="text-xs h-8 px-3"
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          size="sm"
          disabled={proposeMutation.isPending}
          className="bg-amber text-white hover:bg-amber-hover font-semibold text-xs h-8 px-4 gap-1.5 shadow-2xs"
        >
          {proposeMutation.isPending ? (
            <>
              <Loader2 className="size-3 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Sparkles className="size-3.5" /> Submit Slot Proposal
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
