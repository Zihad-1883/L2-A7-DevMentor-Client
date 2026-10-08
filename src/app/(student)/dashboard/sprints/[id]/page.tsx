"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Rocket,
  ShieldCheck,
  User,
  Coins,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Sparkles,
  HelpCircle,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import { sprintService } from "@/services/sprint.service";
import { queryKeys } from "@/lib/query-keys";
import { useAuthContext } from "@/components/providers/AuthProvider";
import SprintSessionList from "@/features/sprint/SprintSessionList";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import ConfirmModal from "@/components/shared/ConfirmModal";

export default function SprintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sprintId = typeof params?.id === "string" ? params.id : "";

  const { user } = useAuthContext();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);

  // Fetch Sprint Details
  const {
    data: sprint,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.sprints.detail(sprintId),
    queryFn: () => sprintService.getSprintById(sprintId),
    enabled: Boolean(sprintId),
    staleTime: 1000 * 20, // 20 seconds
  });

  const isStudentOwner = Boolean(user?.id && sprint?.studentId === user.id);
  const mentor = sprint?.claimedByMentor || sprint?.mentor;
  const sessions = sprint?.sessions || [];
  const completedSessionsCount = sessions.filter((s) => s.status === "COMPLETED").length;
  const totalSessionsCount = sessions.length > 0 ? sessions.length : (sprint?.selectedDays?.length || 0);

  // Handle student sprint cancellation before claimed
  const handleDeleteSprint = async () => {
    setIsDeleting(true);
    try {
      await sprintService.deleteSprint(sprintId);
      toast.success("Sprint request cancelled successfully");
      router.push("/dashboard/sprints");
    } catch (err: unknown) {
      const errMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        "Failed to cancel sprint request";
      toast.error(errMsg);
    } finally {
      setIsDeleting(false);
      setIsCancelModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="size-8 text-amber animate-spin" />
        <p className="text-sm font-semibold text-text-secondary">Loading sprint details...</p>
      </div>
    );
  }

  if (isError || !sprint) {
    const errorMsg =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      (error as Error)?.message ||
      "Sprint details could not be found or you do not have permission to view them.";

    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="p-8 rounded-3xl bg-surface border border-border shadow-xs space-y-3">
          <AlertCircle className="size-10 text-orange mx-auto" />
          <h2 className="font-serif text-xl font-bold text-text-primary">Sprint Not Accessible</h2>
          <p className="text-xs text-text-secondary leading-relaxed">{errorMsg}</p>
          <div className="pt-2">
            <Link href="/dashboard/sprints">
              <Button size="sm" variant="outline" className="text-xs border-border">
                <ArrowLeft className="size-3.5 mr-1" /> Back to My Sprints
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl">
      {/* Top Breadcrumb & Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <Link
            href="/dashboard/sprints"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-amber transition-colors mb-2"
          >
            <ArrowLeft className="size-3.5" /> Back to My Sprints
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20">
              <Rocket className="size-3.5" /> 1-on-1 Mentorship Sprint
            </span>
            <span className="text-xs text-text-muted">•</span>
            <StatusBadge status={sprint.status} size="sm" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mt-2">
            {sprint.title}
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Created on {formatDate(sprint.createdAt)}
          </p>
        </div>

        {/* Delete button if unclaimed */}
        {sprint.status === "PENDING_CLAIM" && isStudentOwner && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCancelModalOpen(true)}
            disabled={isDeleting}
            className="text-xs border-orange/40 text-orange hover:bg-orange/5 cursor-pointer self-start sm:self-auto gap-1.5"
          >
            <Trash2 className="size-3.5" />
            <span>Cancel Request</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Problem Details & Session Schedule */}
        <div className="lg:col-span-8 space-y-8">
          {/* Problem Statement Card */}
          <div className="p-7 rounded-3xl bg-surface border border-border shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2">
              <Sparkles className="size-4 text-amber" /> Sprint Scope &amp; Problem Statement
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-line">
              {sprint.description}
            </p>

            {/* Tech Stack Tags */}
            {sprint.techStackTags && sprint.techStackTags.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-2">
                  Target Tech Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sprint.techStackTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-raised text-text-primary border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Session Timeline & Booking Confirmation */}
          <div className="p-7 rounded-3xl bg-surface border border-border shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2">
                  <Calendar className="size-4 text-amber" /> Mentorship Sessions Schedule
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  {completedSessionsCount} of {totalSessionsCount} sessions completed
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-surface-raised border border-border text-text-primary">
                {sprint.durationDays} Day Sprint
              </span>
            </div>

            <SprintSessionList
              sessions={sessions}
              sprintStatus={sprint.status}
              isStudentOwner={isStudentOwner}
              isClaimed={Boolean(mentor && sprint.status !== "PENDING_CLAIM")}
              onSessionUpdated={() => refetch()}
            />
          </div>
        </div>

        {/* Right Sticky Column: Assigned Mentor & Escrow Specs */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Mentor Assignment Card */}
          <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
              Assigned Mentor
            </span>

            {mentor ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-amber-light text-amber font-serif font-bold text-base flex items-center justify-center border-2 border-amber/30 shrink-0">
                    {mentor.name
                      ? mentor.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                      : "ME"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif text-base font-bold text-text-primary truncate">
                      {mentor.name}
                    </h3>
                    <p className="text-xs text-text-muted truncate">
                      {mentor.mentorProfile?.title || "Senior Engineering Mentor"}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-light/40 border border-emerald/20 flex items-center gap-2 text-xs text-emerald font-semibold">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>Claimed &amp; actively mentoring</span>
                </div>
              </div>
            ) : sprint.targetMentorId ? (
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-center space-y-2">
                <div className="size-10 rounded-full bg-surface text-purple-600 flex items-center justify-center mx-auto shadow-2xs">
                  <User className="size-5" />
                </div>
                <h3 className="text-xs font-bold text-text-primary">
                  Direct Request: {sprint.targetMentor?.name || "Targeted Mentor"}
                </h3>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  This sprint is routed exclusively to your selected mentor. We are waiting for them to accept and schedule your sessions.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-light/30 border border-amber/30 text-center space-y-2">
                <div className="size-10 rounded-full bg-surface text-amber flex items-center justify-center mx-auto shadow-2xs">
                  <Clock className="size-5" />
                </div>
                <h3 className="text-xs font-bold text-text-primary">Seeking Senior Mentor</h3>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Your request is published in the open mentor pool. Verified mentors in your stack will review and claim it shortly.
                </p>
              </div>
            )}
          </div>

          {/* Escrow Guarantee Specs */}
          <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
              <ShieldCheck className="size-4 text-emerald" />
              <span>Escrow Protection Rules</span>
            </div>

            <div className="space-y-2.5 text-xs text-text-secondary leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-amber mt-1.5 shrink-0" />
                <span>
                  Credits remain locked in platform escrow until each session concludes.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-amber mt-1.5 shrink-0" />
                <span>
                  Meeting links (Google Meet or Zoom) become clickable once the time slot is confirmed.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-amber mt-1.5 shrink-0" />
                <span>
                  Cancellations permitted up to 1 hour before scheduled time with automatic credit refund.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isCancelModalOpen}
        title="Cancel Sprint Request?"
        description="Are you sure you want to cancel and delete this sprint request? Your escrow credits will be returned to your wallet balance."
        confirmLabel="Yes, Cancel Sprint"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteSprint}
        onClose={() => setIsCancelModalOpen(false)}
      />
    </div>
  );
}
