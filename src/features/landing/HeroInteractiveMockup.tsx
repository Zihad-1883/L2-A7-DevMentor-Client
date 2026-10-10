"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Zap,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  GitPullRequest,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/components/providers/AuthProvider";
import type { CohortItem } from "@/services/cohort.service";
import type { SprintRequestItem } from "@/services/sprint.service";

interface HeroInteractiveMockupProps {
  initialCohort?: CohortItem | null;
  initialSprint?: SprintRequestItem | null;
}

export default function HeroInteractiveMockup({
  initialCohort,
  initialSprint,
}: HeroInteractiveMockupProps) {
  const { role, isAuthenticated, isPending } = useAuthContext();
  // Subscribe to localStorage cleanly with useSyncExternalStore without cascading renders or useEffect setState
  const cachedRole = React.useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      return () => window.removeEventListener("storage", onStoreChange);
    },
    () => {
      try {
        return localStorage.getItem("devmentor_cached_role");
      } catch {
        return null;
      }
    },
    () => null // Server snapshot
  );

  React.useEffect(() => {
    if (!isPending) {
      if (isAuthenticated && role) {
        try {
          localStorage.setItem("devmentor_cached_role", role);
        } catch { }
      } else if (!isAuthenticated) {
        try {
          localStorage.removeItem("devmentor_cached_role");
        } catch { }
      }
    }
  }, [isPending, isAuthenticated, role]);

  // Determine mentor view: if resolved role is mentor, or while pending, cached role is mentor
  const effectiveRole = isPending ? (cachedRole || role) : role;
  const isMentorView = effectiveRole === "mentor";

  // Cohort destination
  const cohortLink = initialCohort ? `/cohorts/${initialCohort.id}` : "/cohorts";

  // Sprint destination: for mentors, goes to the specific sprint claim page if id exists, or mentor sprints pool
  const sprintLink = initialSprint
    ? `/mentor/sprints/${initialSprint.id}`
    : "/mentor/sprints";

  return (
    <div className="relative flex flex-col gap-5 w-full">
      {/* Decorative ambient background blur */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.15, 0.22, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-12 -right-12 size-72 bg-amber/20 rounded-full blur-3xl pointer-events-none -z-10"
      />

      <AnimatePresence mode="wait">
        {isMentorView ? (
          initialSprint ? (
            /* ======================================================== */
            /* MENTOR VIEW: Live Open Sprint Request from DB           */
            /* ======================================================== */
            <motion.div
              key="mentor-sprint-view"
              initial={{ opacity: 0, y: 25, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group bg-surface rounded-2xl p-6 lg:p-7 shadow-[0_12px_36px_-6px_rgba(180,83,9,0.12),0_2px_8px_rgba(26,23,20,0.04)] border border-border transition-all duration-300 hover:shadow-xl hover:border-amber/50 relative overflow-hidden"
            >
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber via-terracotta to-amber" />

              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="size-14 rounded-full bg-surface-raised flex items-center justify-center font-serif text-amber font-bold text-lg border-2 border-border shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                    {initialSprint.student?.name
                      ? initialSprint.student.name.slice(0, 2).toUpperCase()
                      : "ST"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg font-bold text-text-primary truncate">
                        {initialSprint.student?.name || "Student Sprint"}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-surface-raised text-text-muted text-[10px] font-bold tracking-wider uppercase border border-border">
                        STUDENT
                      </span>
                    </div>
                    <p className="text-xs text-text-muted truncate">
                      {initialSprint.title}
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-amber-light text-amber text-[11px] font-bold tracking-wider shrink-0 uppercase border border-amber/20 flex items-center gap-1 shadow-xs">
                  <span className="size-1.5 rounded-full bg-amber animate-ping" />
                  PENDING CLAIM
                </span>
              </div>

              {/* Tech stack tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {(initialSprint.techStackTags && initialSprint.techStackTags.length > 0
                  ? initialSprint.techStackTags
                  : ["Full-Stack", "Architecture"]
                ).map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-surface-raised text-text-secondary text-xs font-medium border border-border/80 group-hover:border-amber/30 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Sprint metadata bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-raised border border-border/60">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-amber/15 text-amber flex items-center justify-center shrink-0">
                    <Calendar className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary">
                      {initialSprint.durationDays}-Day Sprint Program
                    </p>
                    <p className="text-[11px] text-text-muted">
                      {initialSprint.selectedDays?.length
                        ? `${initialSprint.selectedDays.length} Scheduled Sessions`
                        : "Live Sessions · Flexible Timing"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <Link href={sprintLink}>
                    <motion.div whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }}>
                      <Button
                        type="button"
                        className="h-9 px-4 text-xs font-semibold shadow-xs bg-amber text-white hover:bg-amber-hover transition-all duration-200 cursor-pointer"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <Zap className="size-3.5" /> Claim Sprint
                        </span>
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ======================================================== */
            /* MENTOR VIEW: Clean Empty Pool / Action Hub              */
            /* ======================================================== */
            <motion.div
              key="mentor-empty-sprint-pool"
              initial={{ opacity: 0, y: 25, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group bg-surface rounded-2xl p-6 lg:p-7 shadow-[0_12px_36px_-6px_rgba(180,83,9,0.12),0_2px_8px_rgba(26,23,20,0.04)] border border-border transition-all duration-300 hover:shadow-xl hover:border-amber/50 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber via-terracotta to-amber" />

              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="size-14 rounded-full bg-surface-raised flex items-center justify-center font-serif text-amber font-bold text-lg border-2 border-border shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                    <Zap className="size-6 text-amber" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg font-bold text-text-primary truncate">
                        Sprint Request Pool
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-surface-raised text-text-muted text-[10px] font-bold tracking-wider uppercase border border-border">
                        MENTOR VIEW
                      </span>
                    </div>
                    <p className="text-xs text-text-muted truncate">
                      Active Student Guidance Pool
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-light text-emerald text-[11px] font-bold tracking-wider shrink-0 uppercase border border-emerald/20 flex items-center gap-1 shadow-xs">
                  <span className="size-1.5 rounded-full bg-emerald animate-pulse" />
                  POOL READY
                </span>
              </div>

              <div className="mb-4">
                <h4 className="font-serif text-base font-bold text-text-primary leading-snug group-hover:text-amber transition-colors">
                  No Pending 1-on-1 Sprint Requests
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mt-1">
                  All sprint requests have been claimed or none are pending. When students submit new sprint guidance requests, they will show up here instantly for you to claim.
                </p>
              </div>

              {/* Mentor Quick Actions */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <Link href="/mentor/cohorts/new" className="block">
                  <div className="p-2.5 rounded-xl bg-surface-raised border border-border/80 hover:border-amber/40 hover:bg-amber-light/20 transition-all flex items-center gap-2.5">
                    <div className="size-7 rounded-lg bg-amber/15 text-amber flex items-center justify-center shrink-0">
                      <BookOpen className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-primary truncate">Launch Cohort</p>
                      <p className="text-[10px] text-text-muted truncate">Host group class</p>
                    </div>
                  </div>
                </Link>

                <Link href="/mentor/code-reviews" className="block">
                  <div className="p-2.5 rounded-xl bg-surface-raised border border-border/80 hover:border-amber/40 hover:bg-amber-light/20 transition-all flex items-center gap-2.5">
                    <div className="size-7 rounded-lg bg-emerald/15 text-emerald flex items-center justify-center shrink-0">
                      <GitPullRequest className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-primary truncate">Review Pool</p>
                      <p className="text-[10px] text-text-muted truncate">Earn 10–50 Credits</p>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-raised border border-border/60">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Clock className="size-4 text-amber" />
                  <span>Real-Time Marketplace Stream</span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2">
                  <Link href="/mentor/sprints">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 text-xs font-semibold border-border hover:bg-surface cursor-pointer"
                    >
                      View Sprint Pool
                    </Button>
                  </Link>

                  <Link href="/mentor">
                    <motion.div whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }}>
                      <Button
                        type="button"
                        className="h-9 px-4 text-xs font-semibold shadow-xs bg-amber text-white hover:bg-amber-hover transition-all duration-200 cursor-pointer"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <Zap className="size-3.5" /> Dashboard
                        </span>
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )
        ) : (
          initialCohort ? (
            /* ======================================================== */
            /* STUDENT / VISITOR VIEW: Live Cohort Program from DB      */
            /* ======================================================== */
            <motion.div
              key="student-cohort-view"
              initial={{ opacity: 0, y: 25, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group bg-surface rounded-2xl p-6 lg:p-7 shadow-[0_12px_36px_-6px_rgba(180,83,9,0.12),0_2px_8px_rgba(26,23,20,0.04)] border border-border transition-all duration-300 hover:shadow-xl hover:border-amber/50 relative overflow-hidden"
            >
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber via-terracotta to-amber" />

              {/* Header: Mentor info & Cohort Badge */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="size-14 rounded-full bg-amber-light/70 text-amber flex items-center justify-center font-serif font-bold text-lg border-2 border-amber/30 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                    {initialCohort.mentor?.name
                      ? initialCohort.mentor.name.slice(0, 2).toUpperCase()
                      : "DM"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg font-bold text-text-primary truncate">
                        {initialCohort.mentor?.name || "Verified Mentor"}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-amber-light text-amber text-[10px] font-bold tracking-wider uppercase border border-amber/20">
                        MENTOR
                      </span>
                    </div>
                    <p className="text-xs text-text-muted truncate">
                      Mentor-Led Cohort
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-light text-emerald text-[11px] font-bold tracking-wider shrink-0 uppercase border border-emerald/20 flex items-center gap-1 shadow-xs">
                  <span className="size-1.5 rounded-full bg-emerald animate-ping" />
                  ENROLLING NOW
                </span>
              </div>

              {/* Cohort Title & Description */}
              <div className="mb-4">
                <h4 className="font-serif text-base font-bold text-text-primary leading-snug group-hover:text-amber transition-colors">
                  {initialCohort.title}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mt-1">
                  {initialCohort.description}
                </p>
              </div>

              {/* Tech stack tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {(initialCohort.techStackTags && initialCohort.techStackTags.length > 0
                  ? initialCohort.techStackTags
                  : ["Software Engineering"]
                ).map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-surface-raised text-text-secondary text-xs font-medium border border-border/80 group-hover:border-amber/30 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Cohort enrollment bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-raised border border-border/60">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-amber-light text-amber flex items-center justify-center shrink-0">
                    <BookOpen className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-text-primary">
                        {initialCohort.durationWeeks ? `${initialCohort.durationWeeks} Weeks Intensive` : "Cohort Program"}
                      </p>
                      {initialCohort.totalCost ? (
                        <>
                          <span className="text-[10px] text-text-muted">·</span>
                          <span className="text-xs font-bold text-amber">
                            {initialCohort.totalCost} Credits
                          </span>
                        </>
                      ) : null}
                    </div>
                    <p className="text-[11px] text-text-muted flex items-center gap-1">
                      <Users className="size-3" />
                      <span>Group Cohort · Live Mentorship</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2">
                  <Link href={cohortLink}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 text-xs font-semibold border-border hover:bg-surface cursor-pointer"
                    >
                      Details
                    </Button>
                  </Link>

                  <Link href={cohortLink}>
                    <motion.div whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }}>
                      <Button
                        type="button"
                        className="h-9 px-4 text-xs font-semibold shadow-xs bg-amber text-white hover:bg-amber-hover transition-all duration-200 cursor-pointer"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <Sparkles className="size-3.5" /> Join Cohort
                        </span>
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ======================================================== */
            /* STUDENT / VISITOR VIEW: Clean Marketplace Live Hub      */
            /* ======================================================== */
            <motion.div
              key="student-marketplace-hub"
              initial={{ opacity: 0, y: 25, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group bg-surface rounded-2xl p-6 lg:p-7 shadow-[0_12px_36px_-6px_rgba(180,83,9,0.12),0_2px_8px_rgba(26,23,20,0.04)] border border-border transition-all duration-300 hover:shadow-xl hover:border-amber/50 relative overflow-hidden"
            >
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber via-terracotta to-amber" />

              {/* Header Badge */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="size-14 rounded-full bg-amber-light/70 text-amber flex items-center justify-center font-serif font-bold text-lg border-2 border-amber/30 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                    <Sparkles className="size-6 text-amber" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg font-bold text-text-primary truncate">
                        Mentorship Marketplace Live
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-light text-emerald text-[10px] font-bold tracking-wider uppercase border border-emerald/20 flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-emerald animate-ping" />
                        ON-DEMAND
                      </span>
                    </div>
                    <p className="text-xs text-text-muted truncate">
                      1-on-1 Sprints · Production Code Audits · Skill Exams
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-surface-raised text-text-secondary text-[11px] font-bold tracking-wider shrink-0 uppercase border border-border shadow-xs">
                  ACTIVE POOL
                </span>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h4 className="font-serif text-base font-bold text-text-primary leading-snug group-hover:text-amber transition-colors">
                  Direct Senior Mentorship &amp; Fast Async Code Audits
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mt-1">
                  Cohorts launch on rolling schedules. Meanwhile, submit 1-on-1 sprint requests or request async code reviews with guaranteed 24h turnaround.
                </p>
              </div>

              {/* Quick Feature Badges */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="p-2.5 rounded-xl bg-surface-raised border border-border/80 flex items-center gap-2.5">
                  <div className="size-7 rounded-lg bg-amber/15 text-amber flex items-center justify-center shrink-0">
                    <Zap className="size-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-text-primary truncate">1-on-1 Sprints</p>
                    <p className="text-[10px] text-text-muted truncate">Custom roadmap &amp; sessions</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-surface-raised border border-border/80 flex items-center gap-2.5">
                  <div className="size-7 rounded-lg bg-emerald/15 text-emerald flex items-center justify-center shrink-0">
                    <GitPullRequest className="size-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-text-primary truncate">Code Review</p>
                    <p className="text-[10px] text-text-muted truncate">Quick (10 CR) &amp; Deep (50 CR)</p>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-raised border border-border/60">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Users className="size-4 text-amber" />
                  <span>Verified Mentors Ready to Guide</span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2">
                  <Link href="/mentors">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 text-xs font-semibold border-border hover:bg-surface cursor-pointer"
                    >
                      View Mentors
                    </Button>
                  </Link>

                  <Link href="/cohorts">
                    <motion.div whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }}>
                      <Button
                        type="button"
                        className="h-9 px-4 text-xs font-semibold shadow-xs bg-amber text-white hover:bg-amber-hover transition-all duration-200 cursor-pointer"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <Compass className="size-3.5" /> Explore Cohorts
                        </span>
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>

      {/* CARD 2: CODE REVIEW PREVIEW CARD (Offset visual depth with hover spring) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
        whileHover={{
          y: -5,
          scale: 1.01,
          transition: { duration: 0.2 },
        }}
        className="group bg-surface rounded-2xl p-5 lg:p-6 shadow-[0_8px_24px_-4px_rgba(180,83,9,0.08),0_2px_6px_rgba(26,23,20,0.03)] border border-border lg:ml-6 -mt-2 transition-all duration-300 hover:shadow-xl hover:border-amber/40"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-border-strong group-hover:bg-amber/60 transition-colors" />
            <span className="size-2.5 rounded-full bg-border-strong group-hover:bg-amber/60 transition-colors" />
            <span className="size-2.5 rounded-full bg-border-strong group-hover:bg-amber/60 transition-colors" />
            <span className="text-xs text-text-muted ml-2 font-mono">
              rate_limiter.go
            </span>
          </div>

          <span className="text-xs text-emerald font-semibold flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-light border border-emerald/20 shadow-2xs">
            DEEP Review · 50 CREDITS
          </span>
        </div>

        {/* Code snippet block */}
        <div className="bg-surface-raised rounded-xl p-3.5 font-mono text-xs leading-relaxed text-text-primary border border-border/60 mb-3.5 overflow-x-auto group-hover:border-amber/30 transition-colors">
          <div className="text-text-muted">
            <span className="text-amber font-semibold">func</span> (rl *TokenBucket){" "}
            <span className="font-semibold text-text-primary">Allow</span>() bool &#123;
          </div>
          <div className="text-terracotta pl-4 opacity-95">
            {"// Race condition under concurrent requests"}
          </div>
          <div className="pl-4">
            <span className="text-amber font-semibold">return</span> atomic.AddInt64(&amp;rl.tokens, -1) &gt;= 0
          </div>
          <div className="text-text-muted">&#125;</div>
        </div>

        {/* Mentor feedback annotation */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-raised border-l-4 border-amber group-hover:bg-amber-50/50 transition-colors">
          <div className="size-7 rounded-full bg-amber text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
            DM
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-primary">Staff Code Reviewer</span>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-light text-amber text-[10px] font-bold">
                SENIOR
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-snug">
              {'"Use atomic operations here to avoid mutex lock overhead on hot request paths. Benchmarks show a '}
              <strong className="text-amber">4.2x throughput increase</strong>
              {'! Let\'s review this in our call."'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
