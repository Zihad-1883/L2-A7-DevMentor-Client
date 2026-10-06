"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Sparkles,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Coins,
  Video,
  ExternalLink,
  ChevronRight,
  Flame,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import { sprintService } from "@/services/sprint.service";
import { queryKeys } from "@/lib/query-keys";
import { useAuthContext } from "@/components/providers/AuthProvider";
import ProposeSessionForm from "@/features/sprint/ProposeSessionForm";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function MentorSprintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const sprintId = typeof params?.id === "string" ? params.id : "";
  const { user } = useAuthContext();

  const [isClaimModalOpen, setIsClaimModalOpen] = React.useState(false);
  const [editingSessionId, setEditingSessionId] = React.useState<string | null>(null);

  // 1. Fetch Sprint Details (with fallback to open pool if unclaimed/403)
  const {
    data: sprint,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.sprints.detail(sprintId),
    queryFn: async () => {
      try {
        return await sprintService.getSprintById(sprintId);
      } catch (err: unknown) {
        // If backend throws 403 ("You cannot access this sprint details") because it is unclaimed,
        // fetch it from the mentor open-pool or my-sprints
        const is403 =
          (err as { status?: number })?.status === 403 ||
          (err as { response?: { status?: number } })?.response?.status === 403 ||
          (err as Error)?.message?.includes("cannot access this sprint");

        if (is403) {
          const poolData = await sprintService.getOpenSprintPool({ limit: 100 });
          const foundInPool = poolData?.sprints?.find((s) => s.id === sprintId);
          if (foundInPool) return foundInPool;

          const mySprints = await sprintService.getUserSprints();
          const foundInMy = mySprints?.find((s) => s.id === sprintId);
          if (foundInMy) return foundInMy;
        }
        throw err;
      }
    },
    enabled: Boolean(sprintId),
    staleTime: 1000 * 20,
    retry: false,
  });

  // 2. Claim Sprint Mutation
  const claimMutation = useMutation({
    mutationFn: () => sprintService.claimSprint(sprintId),
    onSuccess: () => {
      toast.success("Sprint successfully claimed! You are now the assigned mentor.");
      setIsClaimModalOpen(false);
      queryClient.invalidateQueries({ queryKey: queryKeys.sprints.detail(sprintId) });
      queryClient.invalidateQueries({ queryKey: ["mentor", "open-sprint-pool"] });
      queryClient.invalidateQueries({ queryKey: ["mentor", "open-sprints-pool"] });
      queryClient.invalidateQueries({ queryKey: ["mentor", "my-sprints"] });
      queryClient.invalidateQueries({ queryKey: ["mentor", "sprints"] });
      queryClient.invalidateQueries({ queryKey: ["mentor", "dashboard-summary"] });
      refetch();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to claim sprint. It may have already been claimed.");
      setIsClaimModalOpen(false);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="size-8 text-amber animate-spin" />
        <p className="text-sm font-semibold text-text-secondary">Loading sprint details...</p>
      </div>
    );
  }

  if (isError || !sprint) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="p-8 rounded-3xl bg-surface border border-border shadow-xs space-y-3">
          <AlertCircle className="size-10 text-orange mx-auto" />
          <h2 className="font-serif text-xl font-bold text-text-primary">Sprint Not Found</h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            {error instanceof Error ? error.message : "This sprint request is not available or has expired."}
          </p>
          <Link href="/mentor/sprints">
            <Button size="sm" variant="outline" className="text-xs border-border mt-2">
              Back to Sprint Pool
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isClaimedByMe =
    Boolean(user?.id) &&
    (sprint.claimedByMentorId === user?.id || sprint.mentorId === user?.id);

  const isUnclaimed = sprint.status === "PENDING_CLAIM" && !sprint.claimedByMentorId;
  const sessions = sprint.sessions || [];
  const completedSessionsCount = sessions.filter((s) => s.status === "COMPLETED").length;
  const totalSessionsCount = sessions.length > 0 ? sessions.length : sprint.durationDays;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/mentor/sprints"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Sprints Pool
        </Link>

        {isClaimedByMe && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald bg-emerald-light px-2.5 py-1 rounded-full border border-emerald/20">
            <CheckCircle2 className="size-3.5" /> You are mentoring this sprint
          </span>
        )}
      </div>

      {/* 2. Header Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={sprint.status} />
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-light text-amber border border-amber/20">
                <Clock className="size-3" /> {sprint.durationDays} Days ({totalSessionsCount} Sessions)
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              {sprint.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-amber" />
                <span>Starts {formatDate(sprint.startDate)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="size-3.5 text-amber" />
                <span>Student: {sprint.student?.name || "Student"}</span>
              </div>
            </div>
          </div>

          {/* Action Trigger in Header */}
          <div className="shrink-0 flex items-center gap-3">
            {isUnclaimed ? (
              <Button
                onClick={() => setIsClaimModalOpen(true)}
                disabled={claimMutation.isPending}
                className="bg-amber text-white hover:bg-amber-hover font-semibold text-xs h-10 px-5 shadow-2xs gap-1.5 cursor-pointer"
              >
                <Sparkles className="size-4" /> Claim Sprint Request
              </Button>
            ) : isClaimedByMe ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => refetch()}
                className="text-xs border-border bg-surface-raised gap-1.5"
              >
                <Clock className="size-3.5 text-amber" /> Refresh Sessions
              </Button>
            ) : (
              <span className="text-xs font-medium text-text-muted bg-surface-raised px-3 py-1.5 rounded-xl border border-border">
                Claimed by another mentor
              </span>
            )}
          </div>
        </div>

        {/* Tech Stack Tags */}
        {sprint.techStackTags && sprint.techStackTags.length > 0 && (
          <div className="pt-2 border-t border-border/60">
            <div className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
              Required Tech Stack
            </div>
            <div className="flex flex-wrap gap-2">
              {sprint.techStackTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-light text-amber border border-amber/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Main Body Grid: Sprint Details + Sessions Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Sprint Scope & Sessions Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Sprint Scope / Problem Description */}
          <div className="p-6 sm:p-7 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-text-primary">
              Student Goal &amp; Scope
            </h3>
            <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-line bg-surface-raised/40 p-4 rounded-xl border border-border/60">
              {sprint.description || "No detailed description provided by the student."}
            </div>
          </div>

          {/* Sessions Management Timeline */}
          <div className="p-6 sm:p-7 rounded-2xl bg-surface border border-border shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/80">
              <div>
                <h3 className="font-serif text-lg font-bold text-text-primary">
                  Sprint Sessions ({sessions.length})
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  {isClaimedByMe
                    ? "Propose session times and meeting links for each day."
                    : "Scheduled sprint milestones."}
                </p>
              </div>

              <div className="text-xs font-semibold text-text-muted">
                {completedSessionsCount} / {totalSessionsCount} Completed
              </div>
            </div>

            {sessions.length === 0 ? (
              <div className="p-8 text-center bg-surface-raised/30 rounded-2xl border border-dashed border-border text-xs text-text-muted">
                No session slots generated yet for this sprint.
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((sess, idx) => {
                  const dayNum = sess.dayNumber || idx + 1;
                  const isEditingThis = editingSessionId === sess.id;

                  return (
                    <div
                      key={sess.id}
                      className="p-5 rounded-2xl bg-surface-raised/40 border border-border hover:border-amber/30 transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-xl bg-amber-light text-amber border border-amber/20 flex items-center justify-center font-bold text-xs shrink-0">
                            #{dayNum}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-text-primary block">
                              Day {dayNum} Session
                            </span>
                            <span className="text-[11px] text-text-muted">
                              {sess.scheduledAt
                                ? formatDateTime(sess.scheduledAt)
                                : "Awaiting proposed schedule"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <StatusBadge status={sess.status} />

                          {isClaimedByMe && sess.status === "PENDING" && !isEditingThis && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingSessionId(sess.id)}
                              className="text-xs h-7 px-2.5 border-border bg-surface hover:bg-surface-raised"
                            >
                              {sess.scheduledAt ? "Reschedule" : "Propose Slot"}
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Video Join Link preview if scheduled */}
                      {(sess.joinLink || sess.meetingLink) && (
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-border text-xs">
                          <div className="flex items-center gap-2 text-text-secondary truncate">
                            <Video className="size-3.5 text-amber shrink-0" />
                            <span className="truncate">{sess.joinLink || sess.meetingLink}</span>
                          </div>
                          <a
                            href={sess.joinLink || sess.meetingLink || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-amber hover:underline shrink-0 ml-2"
                          >
                            Join Link
                          </a>
                        </div>
                      )}

                      {/* Inline Propose / Reschedule Form for Mentor */}
                      {isEditingThis && (
                        <div className="pt-2">
                          <ProposeSessionForm
                            session={sess}
                            dayNumber={dayNum}
                            onSuccess={() => {
                              setEditingSessionId(null);
                              refetch();
                            }}
                            onCancel={() => setEditingSessionId(null)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Student Info & Escrow Information */}
        <div className="space-y-6">
          {/* Student Profile Card */}
          <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
            <h3 className="font-serif text-sm font-bold text-text-primary uppercase tracking-wider text-text-muted">
              Student Information
            </h3>

            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-amber-light text-amber border border-amber/20 flex items-center justify-center font-bold text-base">
                {sprint.student?.name ? sprint.student.name.charAt(0).toUpperCase() : "S"}
              </div>
              <div>
                <h4 className="text-sm font-bold text-text-primary">
                  {sprint.student?.name || "Student"}
                </h4>
                <p className="text-xs text-text-muted">{sprint.student?.email || "Student on DevMentor"}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 text-xs text-text-secondary space-y-2">
              <div className="flex justify-between">
                <span className="text-text-muted">Target Duration:</span>
                <span className="font-semibold text-text-primary">{sprint.durationDays} Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Start Date:</span>
                <span className="font-semibold text-text-primary">{formatDate(sprint.startDate)}</span>
              </div>
            </div>
          </div>

          {/* Escrow Guarantee Card */}
          <div className="p-6 rounded-2xl bg-linear-to-br from-amber-50/50 to-surface border border-amber/20 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="size-4" /> Escrow Protected
            </div>
            <h4 className="font-serif text-sm font-bold text-text-primary">
              Guaranteed Mentor Compensation
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Upon student confirmation of proposed slots, sprint credits are locked safely into escrow. Credits transfer straight to your mentor wallet immediately as sessions complete.
            </p>
          </div>

          {/* Claim Action CTA Card for Unclaimed Sprints */}
          {isUnclaimed && (
            <div className="p-6 rounded-2xl bg-surface border border-amber/30 shadow-xs space-y-4">
              <h4 className="font-serif text-sm font-bold text-text-primary">
                Ready to lead this sprint?
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Review the student requirements and claims to schedule meetings that fit your availability.
              </p>
              <Button
                onClick={() => setIsClaimModalOpen(true)}
                disabled={claimMutation.isPending}
                className="w-full bg-amber text-white hover:bg-amber-hover font-semibold text-xs h-10 shadow-2xs gap-1.5 cursor-pointer"
              >
                <Sparkles className="size-3.5" /> Claim This Sprint
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Claim Sprint Confirmation Modal */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-md rounded-3xl bg-surface border border-border shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 relative"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-amber-light text-amber border border-amber/20 flex items-center justify-center">
                  <Sparkles className="size-4" />
                </div>
                <h3 className="font-serif text-base font-bold text-text-primary">
                  Claim Sprint Request
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsClaimModalOpen(false)}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-text-secondary leading-relaxed">
              <p>
                You are about to accept and claim <span className="font-bold text-text-primary">&ldquo;{sprint.title}&rdquo;</span> for <span className="font-semibold text-text-primary">{sprint.student?.name || "the student"}</span>.
              </p>
              <div className="p-3.5 rounded-xl bg-surface-raised border border-border space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-text-muted">Duration:</span>
                  <span className="font-bold text-text-primary">{sprint.durationDays} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Total Sessions:</span>
                  <span className="font-bold text-text-primary">{totalSessionsCount} Sessions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Student:</span>
                  <span className="font-bold text-text-primary">{sprint.student?.name || "Student"}</span>
                </div>
              </div>
              <p className="text-[11px] text-text-muted">
                After claiming, you will propose meeting dates and time slots for each session that the student will confirm.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsClaimModalOpen(false)}
                disabled={claimMutation.isPending}
                className="text-xs border-border"
              >
                Cancel
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={() => claimMutation.mutate()}
                disabled={claimMutation.isPending}
                className="bg-amber text-white hover:bg-amber-hover font-semibold text-xs h-9 px-4 shadow-2xs gap-1.5 cursor-pointer"
              >
                {claimMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" /> Claiming...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3.5" /> Confirm &amp; Claim Sprint
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
