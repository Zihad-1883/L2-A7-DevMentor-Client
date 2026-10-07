"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  FileText,
  Download,
  ExternalLink,
  Lock,
  Unlock,
  CheckCircle2,
  Users,
  Sparkles,
  BookOpen,
  Layers,
  AlertCircle,
  HelpCircle,
  Code2,
  FileDown,
  Coins,
  ShieldCheck,
  ChevronRight,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cohortService } from "@/services/cohort.service";
import { queryKeys } from "@/lib/query-keys";
import ConfirmModal from "@/components/shared/ConfirmModal";
import type { CohortItem, CohortSessionItem, ICohortResourceItem } from "@/types/cohort.types";

export default function StudentCohortDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const cohortId = (params?.id as string) || "";

  const [activeTab, setActiveTab] = React.useState<"sessions" | "resources" | "overview">("sessions");
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = React.useState<string | null>(null);
  const [sessionToUnlock, setSessionToUnlock] = React.useState<CohortSessionItem | null>(null);

  // 1. Fetch cohort details
  const {
    data: cohort,
    isLoading: isLoadingCohort,
    isError: isCohortError,
    error: cohortError,
  } = useQuery<CohortItem>({
    queryKey: queryKeys.cohorts.detail(cohortId),
    queryFn: () => cohortService.getCohortById(cohortId),
    enabled: !!cohortId,
  });

  // 2. Fetch cohort sessions
  const {
    data: sessions = [],
    isLoading: isLoadingSessions,
    refetch: refetchSessions,
  } = useQuery<CohortSessionItem[]>({
    queryKey: queryKeys.cohorts.sessions(cohortId),
    queryFn: () => cohortService.getCohortSessions(cohortId),
    enabled: !!cohortId,
  });

  // 3. Mutation to join a session if gated/credit required
  const joinSessionMutation = useMutation({
    mutationFn: (sessionId: string) => cohortService.joinCohortSession(sessionId),
    onSuccess: (data) => {
      setActionSuccess(data.message || "Session access unlocked successfully!");
      setActionError(null);
      // Invalidate and refetch sessions and user wallet
      queryClient.invalidateQueries({ queryKey: queryKeys.cohorts.sessions(cohortId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.me });
    },
    onError: (err: unknown) => {
      const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = apiErr?.response?.data?.message || apiErr?.message || "Failed to join session.";
      setActionError(msg);
      setActionSuccess(null);
    },
  });

  // Consolidate resources across all accessible sessions
  const allResources = React.useMemo(() => {
    const list: Array<{
      resource: ICohortResourceItem;
      sessionTitle: string;
      sessionNumber?: number;
    }> = [];

    sessions.forEach((s) => {
      if (s.resources && Array.isArray(s.resources)) {
        s.resources.forEach((res) => {
          list.push({
            resource: res,
            sessionTitle: s.title,
            sessionNumber: s.sessionNumber,
          });
        });
      }
    });

    return list;
  }, [sessions]);

  // Loading state
  if (isLoadingCohort || isLoadingSessions) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-surface-raised rounded-lg" />
        <div className="h-44 bg-surface rounded-3xl border border-border" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-96 md:col-span-2 bg-surface rounded-2xl border border-border" />
          <div className="h-96 bg-surface rounded-2xl border border-border" />
        </div>
      </div>
    );
  }

  // Error state
  if (isCohortError || !cohort) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="size-14 rounded-2xl bg-rose-light text-rose border border-rose/20 mx-auto flex items-center justify-center">
          <AlertCircle className="size-7" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-text-primary">
          Cohort Workspace Not Found
        </h2>
        <p className="text-sm text-text-secondary">
          {cohortError instanceof Error
            ? cohortError.message
            : "The requested cohort could not be found or you may not have authorization to view this workspace."}
        </p>
        <Link href="/dashboard/cohorts">
          <Button variant="outline" className="mt-4 gap-2 border-border cursor-pointer">
            <ArrowLeft className="size-4" /> Back to My Cohorts
          </Button>
        </Link>
      </div>
    );
  }

  const completedSessionsCount = sessions.filter((s) => s.status === "COMPLETED").length;
  const progressPercent = sessions.length > 0 ? Math.round((completedSessionsCount / sessions.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/dashboard/cohorts"
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer group"
        >
          <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Enrolled Cohorts
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-light text-emerald border border-emerald/20">
          <CheckCircle2 className="size-3.5" /> Enrolled Member
        </div>
      </div>

      {/* Hero Cohort Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-surface border border-border p-6 sm:p-8 shadow-xs">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 size-64 rounded-full bg-amber/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 size-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-light text-amber border border-amber/20">
                Cohort Track
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface-raised text-text-secondary border border-border">
                {cohort.durationWeeks} Weeks Intensive
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface-raised text-text-secondary border border-border">
                {sessions.length} Live Workshops
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary tracking-tight">
              {cohort.title}
            </h1>

            <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
              {cohort.description}
            </p>

            {/* Mentor info */}
            <div className="flex items-center gap-3 pt-2">
              <div className="size-10 rounded-full bg-surface-raised border border-border overflow-hidden flex items-center justify-center font-serif font-bold text-text-primary text-sm shrink-0">
                {cohort.mentor?.image ? (
                  <img
                    src={cohort.mentor.image}
                    alt={cohort.mentor.name}
                    className="size-full object-cover"
                  />
                ) : (
                  cohort.mentor?.name?.[0] || "M"
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-text-primary">
                  {cohort.mentor?.name}
                </div>
                <div className="text-[11px] text-text-muted">
                  Lead Instructor & Program Mentor
                </div>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          <div className="w-full lg:w-72 shrink-0 p-5 rounded-2xl bg-surface-raised/70 border border-border/80 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-text-secondary mb-1.5">
                <span>Program Progress</span>
                <span className="text-text-primary font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-amber rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-text-muted mt-2">
                {completedSessionsCount} of {sessions.length} sessions completed
              </p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-text-muted">Curriculum Files</span>
              <span className="font-bold text-text-primary">{allResources.length} items</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {actionError && (
        <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-rose-light text-rose border border-rose/20 text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button
            onClick={() => setActionError(null)}
            className="text-xs font-bold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {actionSuccess && (
        <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-light text-emerald border border-emerald/20 text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button
            onClick={() => setActionSuccess(null)}
            className="text-xs font-bold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-px">
        <button
          onClick={() => setActiveTab("sessions")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === "sessions"
              ? "border-amber text-text-primary"
              : "border-transparent text-text-muted hover:text-text-secondary"
            }`}
        >
          <Calendar className="size-4" />
          Live Schedule & Sessions
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-surface-raised border border-border">
            {sessions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("resources")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === "resources"
              ? "border-amber text-text-primary"
              : "border-transparent text-text-muted hover:text-text-secondary"
            }`}
        >
          <FileText className="size-4" />
          Downloadable Materials
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-surface-raised border border-border">
            {allResources.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === "overview"
              ? "border-amber text-text-primary"
              : "border-transparent text-text-muted hover:text-text-secondary"
            }`}
        >
          <Info className="size-4" />
          Cohort Specs & Details
        </button>
      </div>

      {/* TAB CONTENT 1: SESSIONS TIMELINE */}
      {activeTab === "sessions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-text-primary">
              Workshop Schedule
            </h2>
            <p className="text-xs text-text-muted">
              All dates are shown in your local time zone
            </p>
          </div>

          {sessions.length === 0 ? (
            <div className="p-12 rounded-3xl bg-surface border border-border text-center space-y-3">
              <Calendar className="size-10 text-text-muted mx-auto stroke-1" />
              <h3 className="font-serif text-base font-bold text-text-primary">
                No sessions scheduled yet
              </h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">
                The mentor has not scheduled any workshop dates for this cohort track yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {sessions.map((session, index) => {
                const sessionDate = new Date(session.scheduledAt);
                const isUpcoming = sessionDate > new Date() && session.status !== "COMPLETED";
                const isPast = sessionDate <= new Date() || session.status === "COMPLETED";
                const hasAccess = session.hasAccess ?? true;
                const activeLink = session.joinLink || session.meetingLink;

                return (
                  <div
                    key={session.id}
                    className="p-5 sm:p-6 rounded-2xl bg-surface border border-border hover:border-border/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-2xs"
                  >
                    <div className="flex items-start gap-4">
                      {/* Session number circle */}
                      <div className="size-11 rounded-2xl bg-surface-raised border border-border flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-text-muted uppercase">DAY</span>
                        <span className="text-sm font-bold text-text-primary">
                          {session.dayNumber || session.sessionNumber || index + 1}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-serif text-base font-bold text-text-primary">
                            {session.title}
                          </h3>

                          {session.status === "COMPLETED" ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-raised text-text-secondary border border-border">
                              COMPLETED
                            </span>
                          ) : session.status === "SCHEDULED" ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-light text-amber border border-amber/20">
                              LIVE SOON
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-raised text-text-muted border border-border">
                              {session.status}
                            </span>
                          )}

                          {session.creditCost && session.creditCost > 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-light text-amber border border-amber/20 inline-flex items-center gap-1">
                              <Coins className="size-3" /> {session.creditCost} credits
                            </span>
                          ) : null}
                        </div>

                        {session.description && (
                          <p className="text-xs text-text-secondary line-clamp-2 max-w-2xl">
                            {session.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted pt-1">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="size-3.5 text-amber" />
                            {sessionDate.toLocaleDateString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="size-3.5 text-amber" />
                            {sessionDate.toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            ({session.durationMinutes || 60} mins)
                          </span>

                          {session.resources && session.resources.length > 0 && (
                            <span className="flex items-center gap-1.5 text-text-secondary">
                              <FileText className="size-3.5 text-amber" />
                              {session.resources.length} resource{session.resources.length > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions on the right */}
                    <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-end md:self-center">
                      {/* Recording Link if available */}
                      {session.recordingUrl && (
                        <a
                          href={session.recordingUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs font-semibold h-9 px-3 gap-1.5 border-border bg-surface hover:bg-surface-raised cursor-pointer"
                          >
                            <Video className="size-3.5 text-primary" /> Watch Recording
                          </Button>
                        </a>
                      )}

                      {/* Join meeting / Unlock button */}
                      {activeLink ? (
                        <a
                          href={activeLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button
                            size="sm"
                            className="text-xs font-bold h-9 px-4 gap-1.5 bg-amber hover:bg-amber-hover text-surface-dark cursor-pointer shadow-xs"
                          >
                            <Video className="size-3.5" /> Join Workshop
                            <ExternalLink className="size-3" />
                          </Button>
                        </a>
                      ) : !hasAccess && session.creditCost && session.creditCost > 0 ? (
                        <Button
                          size="sm"
                          onClick={() => setSessionToUnlock(session)}
                          disabled={joinSessionMutation.isPending}
                          className="text-xs font-bold h-9 px-4 gap-1.5 bg-amber hover:bg-amber-hover text-surface-dark cursor-pointer shadow-xs"
                        >
                          <Lock className="size-3.5" />
                          {joinSessionMutation.isPending ? "Unlocking..." : `Unlock Access (${session.creditCost}c)`}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                          className="text-xs font-semibold h-9 px-3 border-border bg-surface-raised text-text-muted"
                        >
                          Link Available Soon
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: DOWNLOADABLE MATERIALS & RESOURCES */}
      {activeTab === "resources" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-text-primary">
              Curriculum Assets & Files
            </h2>
            <p className="text-xs text-text-muted">
              Lecture slides, source code archives, and reading materials
            </p>
          </div>

          {allResources.length === 0 ? (
            <div className="p-12 rounded-3xl bg-surface border border-border text-center space-y-3">
              <FileText className="size-10 text-text-muted mx-auto stroke-1" />
              <h3 className="font-serif text-base font-bold text-text-primary">
                No materials uploaded yet
              </h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">
                Your instructor will upload downloadable code repositories, diagrams, and handouts here as sessions progress.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allResources.map((item, idx) => {
                const res = item.resource;
                return (
                  <div
                    key={res.id || idx}
                    className="p-5 rounded-2xl bg-surface border border-border hover:border-border/80 transition-all flex items-start justify-between gap-4 shadow-2xs"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="size-10 rounded-xl bg-amber-light text-amber border border-amber/20 flex items-center justify-center shrink-0">
                        {res.type === "CODE_SNIPPET" ? (
                          <Code2 className="size-5" />
                        ) : res.type === "LINK" ? (
                          <ExternalLink className="size-5" />
                        ) : (
                          <FileDown className="size-5" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-text-primary line-clamp-1">
                          {res.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-text-muted">
                          <span>Session: {item.sessionTitle}</span>
                          {res.fileType && (
                            <>
                              <span>•</span>
                              <span className="uppercase font-semibold">{res.fileType}</span>
                            </>
                          )}
                          {res.fileSize && (
                            <>
                              <span>•</span>
                              <span>{Math.round(res.fileSize / 1024)} KB</span>
                            </>
                          )}
                        </div>

                        {res.content && (
                          <p className="text-xs text-text-secondary line-clamp-2 mt-1">
                            {res.content}
                          </p>
                        )}
                      </div>
                    </div>

                    {res.url ? (
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2.5 text-xs font-semibold gap-1.5 border-border bg-surface hover:bg-surface-raised cursor-pointer"
                        >
                          <Download className="size-3.5 text-amber" /> Get
                        </Button>
                      </a>
                    ) : (
                      <span className="text-[11px] text-text-muted italic shrink-0">
                        In-app note
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: OVERVIEW & SPECS */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
              <h3 className="font-serif text-base font-bold text-text-primary">
                Program Syllabus & Details
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                {cohort.description}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
              <h3 className="font-serif text-base font-bold text-text-primary">
                Tech Stack & Core Competencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {cohort.techStackTags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-xl text-xs font-semibold bg-surface-raised text-text-primary border border-border"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
              <h3 className="font-serif text-base font-bold text-text-primary">
                Cohort Specifications
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-border/60">
                  <span className="text-text-muted">Duration</span>
                  <span className="font-bold text-text-primary">{cohort.durationWeeks} Weeks</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/60">
                  <span className="text-text-muted">Total Enrolled</span>
                  <span className="font-bold text-text-primary">
                    {cohort._count?.enrollments || 1} / {cohort.capacity} Students
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/60">
                  <span className="text-text-muted">Workshops</span>
                  <span className="font-bold text-text-primary">{sessions.length} Live Sessions</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-text-muted">Tuition Credits</span>
                  <span className="font-bold text-amber">{cohort.totalCost} Credits</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-surface-raised/60 border border-border space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                <ShieldCheck className="size-4 text-emerald" /> Platform Guarantee
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                As an enrolled cohort student, all live session links and educational resources are backed by DevMentor’s quality guarantee and mentor escrow system.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Unlock Session Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(sessionToUnlock)}
        title="Unlock Workshop Session?"
        description={
          sessionToUnlock
            ? `Unlocking "${sessionToUnlock.title}" will deduct ${sessionToUnlock.creditCost || 0} credits (৳${(sessionToUnlock.creditCost || 0) * 4} BDT) from your DevWallet to access the live workshop link and learning materials. Proceed?`
            : ""
        }
        confirmLabel={`Unlock for ${sessionToUnlock?.creditCost || 0} Credits`}
        variant="primary"
        isLoading={joinSessionMutation.isPending}
        onConfirm={async () => {
          if (sessionToUnlock) {
            await joinSessionMutation.mutateAsync(sessionToUnlock.id);
            setSessionToUnlock(null);
          }
        }}
        onClose={() => setSessionToUnlock(null)}
      />
    </div>
  );
}
