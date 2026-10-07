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
  Users,
  Coins,
  Plus,
  Video,
  FileText,
  Link2,
  Code2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
  Edit,
  Trash2,
  Share2,
  ShieldCheck,
  Eye,
  Layers,
  GraduationCap,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import CohortSessionCard from "@/features/cohort/CohortSessionCard";
import { cohortService } from "@/services/cohort.service";
import type {
  CohortItem,
  CohortSessionItem,
  CreateCohortSessionInput,
  UpdateCohortSessionInput,
  ICohortResourceItem,
  UpdateCohortInput,
} from "@/types/cohort.types";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function MentorCohortDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const cohortId = typeof params?.id === "string" ? params.id : "";

  // Active Tab: "sessions" | "students" | "settings"
  const [activeTab, setActiveTab] = React.useState<"sessions" | "students" | "settings">("sessions");

  // Modals
  const [isAddSessionOpen, setIsAddSessionOpen] = React.useState(false);
  const [editingSession, setEditingSession] = React.useState<CohortSessionItem | null>(null);
  const [activeResourceSessionId, setActiveResourceSessionId] = React.useState<string | null>(null);
  const [isEditCohortOpen, setIsEditCohortOpen] = React.useState(false);

  // Form states for Add/Edit Session
  const [sessionTitle, setSessionTitle] = React.useState("");
  const [sessionDateTime, setSessionDateTime] = React.useState("");
  const [sessionDuration, setSessionDuration] = React.useState<number>(60);
  const [sessionCreditCost, setSessionCreditCost] = React.useState<number>(0);
  const [sessionJoinLink, setSessionJoinLink] = React.useState("");

  // Form states for Add Resource
  const [resTitle, setResTitle] = React.useState("");
  const [resType, setResType] = React.useState<"LINK" | "FILE" | "NOTE" | "CODE_SNIPPET">("LINK");
  const [resUrl, setResUrl] = React.useState("");
  const [resContent, setResContent] = React.useState("");

  // Form states for Edit Cohort
  const [editTitle, setEditTitle] = React.useState("");
  const [editDescription, setEditDescription] = React.useState("");
  const [editCapacity, setEditCapacity] = React.useState<number>(20);
  const [editDurationWeeks, setEditDurationWeeks] = React.useState<number>(6);
  const [editTotalCost, setEditTotalCost] = React.useState<number>(50);

  // 1. Fetch Cohort Details
  const {
    data: cohort,
    isLoading: isCohortLoading,
    error: cohortError,
    refetch: refetchCohort,
  } = useQuery<CohortItem>({
    queryKey: ["cohorts", cohortId],
    queryFn: () => cohortService.getCohortById(cohortId),
    enabled: Boolean(cohortId),
    staleTime: 1000 * 20,
  });

  // 2. Fetch Cohort Sessions
  const {
    data: sessionsData,
    isLoading: isSessionsLoading,
    refetch: refetchSessions,
  } = useQuery<CohortSessionItem[]>({
    queryKey: ["cohort-sessions", cohortId],
    queryFn: () => cohortService.getCohortSessions(cohortId),
    enabled: Boolean(cohortId),
    staleTime: 1000 * 20,
  });

  const sessions = sessionsData || cohort?.sessions || [];
  const enrollmentsCount = cohort?._count?.enrollments ?? 0;
  const capacity = cohort?.capacity || 20;

  const openEditCohortModal = () => {
    if (cohort) {
      setEditTitle(cohort.title || "");
      setEditDescription(cohort.description || "");
      setEditCapacity(cohort.capacity || 20);
      setEditDurationWeeks(cohort.durationWeeks || 6);
      setEditTotalCost(cohort.totalCost || 0);
    }
    setIsEditCohortOpen(true);
  };

  // Mutation: Add Session
  const addSessionMutation = useMutation({
    mutationFn: async () => {
      const payload: CreateCohortSessionInput = {
        title: sessionTitle.trim(),
        scheduledAt: new Date(sessionDateTime).toISOString(),
        durationMinutes: Number(sessionDuration),
        creditCost: Number(sessionCreditCost),
        joinLink: sessionJoinLink.trim() || null,
        sessionNumber: sessions.length + 1,
      };
      return await cohortService.addCohortSession(cohortId, payload);
    },
    onSuccess: () => {
      toast.success("New cohort session scheduled successfully!");
      setIsAddSessionOpen(false);
      resetSessionForm();
      refetchSessions();
      refetchCohort();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to schedule session.");
    },
  });

  // Mutation: Update Session
  const updateSessionMutation = useMutation({
    mutationFn: async () => {
      if (!editingSession) return;
      const payload: UpdateCohortSessionInput = {
        title: sessionTitle.trim(),
        scheduledAt: new Date(sessionDateTime).toISOString(),
        durationMinutes: Number(sessionDuration),
        creditCost: Number(sessionCreditCost),
        joinLink: sessionJoinLink.trim() || null,
      };
      return await cohortService.updateCohortSession(editingSession.id, payload);
    },
    onSuccess: () => {
      toast.success("Session updated successfully!");
      setEditingSession(null);
      resetSessionForm();
      refetchSessions();
      refetchCohort();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update session.");
    },
  });

  // Mutation: Delete Session
  const deleteSessionMutation = useMutation({
    mutationFn: (sessionId: string) => cohortService.deleteCohortSession(sessionId),
    onSuccess: () => {
      toast.success("Session deleted successfully.");
      refetchSessions();
      refetchCohort();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete session.");
    },
  });

  // Mutation: Complete Session
  const completeSessionMutation = useMutation({
    mutationFn: (sessionId: string) => cohortService.completeCohortSession(sessionId),
    onSuccess: () => {
      toast.success("Session marked as completed! Escrow credits released.");
      refetchSessions();
      refetchCohort();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to complete session.");
    },
  });

  // Mutation: Add Resource to Session
  const addResourceMutation = useMutation({
    mutationFn: async () => {
      if (!activeResourceSessionId) return;
      const payload: ICohortResourceItem = {
        id: `res_${Date.now()}`,
        title: resTitle.trim(),
        type: resType,
        url: resUrl.trim() || null,
        content: resContent.trim() || null,
      };
      return await cohortService.addSessionResource(activeResourceSessionId, payload);
    },
    onSuccess: () => {
      toast.success("Learning resource attached successfully!");
      setActiveResourceSessionId(null);
      resetResourceForm();
      refetchSessions();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to add resource.");
    },
  });

  // Mutation: Remove Resource from Session
  const removeResourceMutation = useMutation({
    mutationFn: ({ sessionId, resourceId }: { sessionId: string; resourceId: string }) =>
      cohortService.removeSessionResource(sessionId, resourceId),
    onSuccess: () => {
      toast.success("Resource removed from session.");
      refetchSessions();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to remove resource.");
    },
  });

  // Mutation: Update Cohort Settings
  const updateCohortMutation = useMutation({
    mutationFn: async (payload: UpdateCohortInput) => {
      return await cohortService.updateCohort(cohortId, payload);
    },
    onSuccess: (updated) => {
      toast.success("Cohort details updated successfully!");
      setIsEditCohortOpen(false);
      refetchCohort();
      queryClient.invalidateQueries({ queryKey: ["mentor", "my-created-cohorts"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update cohort.");
    },
  });

  const resetSessionForm = () => {
    setSessionTitle("");
    setSessionDateTime("");
    setSessionDuration(60);
    setSessionCreditCost(0);
    setSessionJoinLink("");
  };

  const resetResourceForm = () => {
    setResTitle("");
    setResType("LINK");
    setResUrl("");
    setResContent("");
  };

  const openEditSessionModal = (sess: CohortSessionItem) => {
    setEditingSession(sess);
    setSessionTitle(sess.title || "");
    try {
      const dt = new Date(sess.scheduledAt);
      // Format to YYYY-MM-DDTHH:mm for datetime-local input
      const iso = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setSessionDateTime(iso);
    } catch {
      setSessionDateTime("");
    }
    setSessionDuration(sess.durationMinutes || 60);
    setSessionCreditCost(sess.creditCost || 0);
    setSessionJoinLink(sess.joinLink || sess.meetingLink || "");
  };

  if (isCohortLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="size-8 text-amber animate-spin" />
        <p className="text-sm font-semibold text-text-secondary">Loading cohort workspace...</p>
      </div>
    );
  }

  if (cohortError || !cohort) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="p-8 rounded-3xl bg-surface border border-border shadow-xs space-y-3">
          <AlertCircle className="size-10 text-orange mx-auto" />
          <h2 className="font-serif text-xl font-bold text-text-primary">Cohort Not Found</h2>
          <p className="text-xs text-text-secondary">
            {cohortError instanceof Error ? cohortError.message : "This cohort program does not exist or was deleted."}
          </p>
          <Link href="/mentor/cohorts">
            <Button size="sm" variant="outline" className="text-xs border-border mt-2">
              Back to My Cohorts
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isApproved = cohort.approvalStatus === "APPROVED";
  const isPublished = cohort.status === "PUBLISHED";
  const canPublish = isApproved && !isPublished;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Top Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/mentor/cohorts"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to My Cohorts
        </Link>

        <div className="flex items-center gap-2">
          {canPublish && (
            <Button
              size="sm"
              onClick={() => updateCohortMutation.mutate({ status: "PUBLISHED" })}
              disabled={updateCohortMutation.isPending}
              className="bg-emerald text-white hover:bg-emerald-hover text-xs h-8 px-3 shadow-2xs gap-1.5 font-semibold cursor-pointer"
            >
              <CheckCircle2 className="size-3.5" /> Publish Live to Directory
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={openEditCohortModal}
            className="border-border text-xs h-8 px-3 gap-1.5"
          >
            <Edit className="size-3.5" /> Edit Program
          </Button>
        </div>
      </div>

      {/* 2. Hero Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={cohort.status} />

              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  cohort.approvalStatus === "APPROVED"
                    ? "bg-emerald-light text-emerald border-emerald/20"
                    : cohort.approvalStatus === "REJECTED"
                    ? "bg-rose-50 text-rose border-rose/20"
                    : "bg-amber-light text-amber border-amber/20"
                }`}
              >
                Approval: {cohort.approvalStatus}
              </span>

              <span className="text-xs text-text-muted font-medium">
                Created {formatDate(cohort.createdAt)}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              {cohort.title}
            </h1>

            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
              {cohort.description}
            </p>

            {cohort.techStackTags && cohort.techStackTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {cohort.techStackTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-light text-amber border border-amber/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats Grid on the Right */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 min-w-[260px] lg:max-w-xs shrink-0">
            <div className="p-3.5 rounded-2xl bg-surface-raised border border-border/80 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
                Duration
              </span>
              <span className="font-bold text-base text-text-primary block">
                {cohort.durationWeeks} Weeks
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-raised border border-border/80 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
                Student Enrollment
              </span>
              <span className="font-bold text-base text-text-primary block">
                {enrollmentsCount} / {capacity}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-raised border border-border/80 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
                Program Fee
              </span>
              <span className="font-bold text-base text-amber block">
                {cohort.totalCost === 0 ? "Free" : `${cohort.totalCost} Credits`}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-raised border border-border/80 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
                BDT Value
              </span>
              <span className="font-bold text-base text-emerald block">
                ৳{(cohort.totalCost || 0) * 4} BDT
              </span>
            </div>
          </div>
        </div>

        {/* Status Callout if Pending Approval */}
        {cohort.approvalStatus === "PENDING_APPROVAL" && (
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber/20 flex items-start gap-3 text-xs text-text-secondary">
            <Clock className="size-4 text-amber shrink-0 mt-0.5" />
            <p>
              This cohort is currently under <strong className="text-text-primary">Admin Moderation</strong>. You can schedule all sessions and upload course materials in the meantime. Once approved, the &ldquo;Publish Live&rdquo; button will activate.
            </p>
          </div>
        )}
      </div>

      {/* 3. Primary Tab Switcher */}
      <div className="flex border-b border-border/80 gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("sessions")}
          className={`pb-3 text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "sessions"
              ? "text-amber border-b-2 border-amber"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          <Calendar className="size-4" />
          Sessions Schedule ({sessions.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("students")}
          className={`pb-3 text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "students"
              ? "text-amber border-b-2 border-amber"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          <Users className="size-4" />
          Enrolled Students ({enrollmentsCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`pb-3 text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "settings"
              ? "text-amber border-b-2 border-amber"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          <Info className="size-4" />
          Overview &amp; Guidelines
        </button>
      </div>

      {/* 4. TAB CONTENT: Sessions Schedule */}
      {activeTab === "sessions" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-text-primary">
                Classroom Sessions Roadmap
              </h2>
              <p className="text-xs text-text-secondary">
                Schedule live interactive workshops, Google Meet/Zoom links, and learning attachments.
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => {
                resetSessionForm();
                setIsAddSessionOpen(true);
              }}
              className="bg-amber text-white hover:bg-amber-hover text-xs font-semibold h-9 px-4 shadow-2xs gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="size-3.5" /> Schedule New Session
            </Button>
          </div>

          {isSessionsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 rounded-2xl bg-surface border border-border animate-pulse" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <EmptyState
              title="No sessions scheduled yet"
              description="Start mapping out your cohort curriculum by scheduling Session #1 with date, time, and video meeting link."
              icon={Calendar}
              action={{
                label: "Schedule First Session",
                onClick: () => {
                  resetSessionForm();
                  setIsAddSessionOpen(true);
                },
              }}
            />
          ) : (
            <div className="space-y-4">
              {sessions.map((sess, idx) => (
                <CohortSessionCard
                  key={sess.id}
                  session={sess}
                  sessionIndex={idx}
                  isMentorView={true}
                  onEdit={(s) => openEditSessionModal(s)}
                  onDelete={(id) => deleteSessionMutation.mutate(id)}
                  onComplete={(id) => completeSessionMutation.mutate(id)}
                  onAddResource={(id) => {
                    resetResourceForm();
                    setActiveResourceSessionId(id);
                  }}
                  onRemoveResource={(sessId, resId) =>
                    removeResourceMutation.mutate({ sessionId: sessId, resourceId: resId })
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. TAB CONTENT: Enrolled Students Roster */}
      {activeTab === "students" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-text-primary">
                  Classroom Capacity Meter
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  {enrollmentsCount} out of {capacity} seats currently filled
                </p>
              </div>

              <span className="text-xs font-bold text-amber">
                {Math.round((enrollmentsCount / capacity) * 100)}% Occupancy
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2.5 w-full bg-surface-raised rounded-full overflow-hidden border border-border">
              <div
                className="h-full bg-amber transition-all"
                style={{ width: `${Math.min(100, (enrollmentsCount / capacity) * 100)}%` }}
              />
            </div>
          </div>

          {enrollmentsCount === 0 ? (
            <EmptyState
              title="No students enrolled yet"
              description="Once your cohort is approved by an administrator and published, students will register and appear in this roster."
              icon={Users}
            />
          ) : (
            <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs space-y-4">
              <h3 className="font-serif text-base font-bold text-text-primary">
                Registered Students ({enrollmentsCount})
              </h3>
              <p className="text-xs text-text-secondary">
                Students who have enrolled in this cohort program.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 6. TAB CONTENT: Overview & Guidelines */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-xs space-y-6">
            <h3 className="font-serif text-lg font-bold text-text-primary">
              Cohort Platform Guidelines
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-secondary">
              <div className="p-4 rounded-2xl bg-surface-raised border border-border space-y-1.5">
                <span className="font-bold text-text-primary flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald" /> Admin Moderation Gate
                </span>
                <p>
                  Every group cohort requires Admin approval prior to being published live in the public catalog to maintain education standards.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-raised border border-border space-y-1.5">
                <span className="font-bold text-text-primary flex items-center gap-1.5">
                  <Layers className="size-4 text-amber" /> 1 Active Cohort Limit
                </span>
                <p>
                  Mentors may host a maximum of 1 active published cohort concurrently to guarantee student mentor focus and dedicated SLA delivery.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-raised border border-border space-y-1.5">
                <span className="font-bold text-text-primary flex items-center gap-1.5">
                  <Coins className="size-4 text-amber" /> Escrow Economics
                </span>
                <p>
                  Student payments are locked safely in platform escrow. As you mark each workshop session completed, credits release straight to your mentor wallet.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-raised border border-border space-y-1.5">
                <span className="font-bold text-text-primary flex items-center gap-1.5">
                  <Clock className="size-4 text-indigo-500" /> Conflict Protection
                </span>
                <p>
                  Scheduling cohort session slots runs automated overlap checks against your 1-on-1 sprint calendar to prevent double-booking.
                </p>
              </div>
            </div>

            {/* Danger Zone: Archive Cohort */}
            <div className="pt-6 border-t border-border/60 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-rose">Archive Cohort</h4>
                <p className="text-xs text-text-muted mt-0.5">
                  Soft-delete this cohort program and hide it from all directories.
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (confirm("Are you sure you want to archive this cohort program?")) {
                    cohortService.deleteCohort(cohortId).then(() => {
                      toast.success("Cohort archived successfully.");
                      router.push("/mentor/cohorts");
                    });
                  }
                }}
                className="text-xs text-rose border-rose/30 hover:bg-rose-50"
              >
                Archive Program
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: Add / Edit Session Modal */}
      {/* ========================================================================= */}
      {(isAddSessionOpen || Boolean(editingSession)) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg rounded-3xl bg-surface border border-border shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-amber-light text-amber border border-amber/20 flex items-center justify-center">
                  <Calendar className="size-4" />
                </div>
                <h3 className="font-serif text-base font-bold text-text-primary">
                  {editingSession ? "Edit Session Details" : "Schedule New Session"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAddSessionOpen(false);
                  setEditingSession(null);
                }}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Session Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  Session Title <span className="text-rose">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Session 1: Next.js 15 Server Components & Architecture"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  className="h-10 text-sm bg-surface rounded-xl"
                />
              </div>

              {/* Date & Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  Date &amp; Time <span className="text-rose">*</span>
                </label>
                <Input
                  type="datetime-local"
                  value={sessionDateTime}
                  onChange={(e) => setSessionDateTime(e.target.value)}
                  className="h-10 text-sm bg-surface rounded-xl"
                />
              </div>

              {/* Duration & Credit Cost */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Duration (Minutes)
                  </label>
                  <Input
                    type="number"
                    min={15}
                    max={240}
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(Number(e.target.value))}
                    className="h-10 text-sm bg-surface rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Per-Session Credits
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={sessionCreditCost}
                    onChange={(e) => setSessionCreditCost(Number(e.target.value))}
                    className="h-10 text-sm bg-surface rounded-xl"
                  />
                </div>
              </div>

              {/* Join Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  Video Meeting URL (Google Meet / Zoom)
                </label>
                <Input
                  type="url"
                  placeholder="https://meet.google.com/xyz-abc-def"
                  value={sessionJoinLink}
                  onChange={(e) => setSessionJoinLink(e.target.value)}
                  className="h-10 text-sm bg-surface rounded-xl"
                />
                <span className="text-[11px] text-text-muted block">
                  Link is gated and only displayed to enrolled students.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAddSessionOpen(false);
                  setEditingSession(null);
                }}
                className="text-xs border-border"
              >
                Cancel
              </Button>

              <Button
                type="button"
                size="sm"
                disabled={
                  !sessionTitle.trim() ||
                  !sessionDateTime ||
                  addSessionMutation.isPending ||
                  updateSessionMutation.isPending
                }
                onClick={() => {
                  if (editingSession) {
                    updateSessionMutation.mutate();
                  } else {
                    addSessionMutation.mutate();
                  }
                }}
                className="bg-amber text-white hover:bg-amber-hover font-semibold text-xs h-9 px-4 shadow-2xs gap-1.5 cursor-pointer"
              >
                {addSessionMutation.isPending || updateSessionMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3.5" />
                    {editingSession ? "Update Session" : "Schedule Session"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Add Learning Resource Modal */}
      {/* ========================================================================= */}
      {Boolean(activeResourceSessionId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-md rounded-3xl bg-surface border border-border shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 relative"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-amber-light text-amber border border-amber/20 flex items-center justify-center">
                  <FileText className="size-4" />
                </div>
                <h3 className="font-serif text-base font-bold text-text-primary">
                  Attach Session Resource
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveResourceSessionId(null)}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Resource Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  Resource Title <span className="text-rose">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Session 1 Slide Deck, System Architecture PDF"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  className="h-10 text-sm bg-surface rounded-xl"
                />
              </div>

              {/* Resource Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  Resource Type
                </label>
                <select
                  value={resType}
                  onChange={(e) =>
                    setResType(
                      e.target.value as "LINK" | "FILE" | "NOTE" | "CODE_SNIPPET"
                    )
                  }
                  className="w-full h-10 px-3 text-sm bg-surface border border-border rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/50"
                >
                  <option value="LINK">External Web Link / Slide Deck</option>
                  <option value="FILE">Downloadable File / Document</option>
                  <option value="CODE_SNIPPET">Code Snippet / Starter Repo</option>
                  <option value="NOTE">Lecture Notes / Preparation Guide</option>
                </select>
              </div>

              {/* URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  URL / Link (Optional)
                </label>
                <Input
                  type="url"
                  placeholder="https://github.com/... or https://docs.google.com/..."
                  value={resUrl}
                  onChange={(e) => setResUrl(e.target.value)}
                  className="h-10 text-sm bg-surface rounded-xl"
                />
              </div>

              {/* Note / Content snippet */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  Notes / Brief Snippet (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide additional instructions or repo branch info..."
                  value={resContent}
                  onChange={(e) => setResContent(e.target.value)}
                  className="w-full p-3 text-xs bg-surface border border-border rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveResourceSessionId(null)}
                className="text-xs border-border"
              >
                Cancel
              </Button>

              <Button
                type="button"
                size="sm"
                disabled={!resTitle.trim() || addResourceMutation.isPending}
                onClick={() => addResourceMutation.mutate()}
                className="bg-amber text-white hover:bg-amber-hover font-semibold text-xs h-9 px-4 shadow-2xs gap-1.5 cursor-pointer"
              >
                {addResourceMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" /> Attaching...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3.5" /> Attach Resource
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: Edit Cohort Details Modal */}
      {/* ========================================================================= */}
      {isEditCohortOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg rounded-3xl bg-surface border border-border shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-amber-light text-amber border border-amber/20 flex items-center justify-center">
                  <Edit className="size-4" />
                </div>
                <h3 className="font-serif text-base font-bold text-text-primary">
                  Edit Cohort Program
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsEditCohortOpen(false)}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  Cohort Title
                </label>
                <Input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="h-10 text-sm bg-surface rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-3 text-xs bg-surface border border-border rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Max Capacity
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={200}
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(Number(e.target.value))}
                    className="h-10 text-sm bg-surface rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Duration (Weeks)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={52}
                    value={editDurationWeeks}
                    onChange={(e) => setEditDurationWeeks(Number(e.target.value))}
                    className="h-10 text-sm bg-surface rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  Price in Credits (0 for Free)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={editTotalCost}
                  onChange={(e) => setEditTotalCost(Number(e.target.value))}
                  className="h-10 text-sm bg-surface rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditCohortOpen(false)}
                className="text-xs border-border"
              >
                Cancel
              </Button>

              <Button
                type="button"
                size="sm"
                disabled={!editTitle.trim() || updateCohortMutation.isPending}
                onClick={() =>
                  updateCohortMutation.mutate({
                    title: editTitle.trim(),
                    description: editDescription.trim(),
                    capacity: editCapacity,
                    durationWeeks: editDurationWeeks,
                    totalCost: editTotalCost,
                  })
                }
                className="bg-amber text-white hover:bg-amber-hover font-semibold text-xs h-9 px-4 shadow-2xs gap-1.5 cursor-pointer"
              >
                {updateCohortMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3.5" /> Save Changes
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
