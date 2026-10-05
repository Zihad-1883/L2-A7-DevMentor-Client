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
          /* ======================================================== */
          /* MENTOR VIEW: Live Open Sprint Request Pool from DB      */
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
                  {initialSprint?.student?.name
                    ? initialSprint.student.name.slice(0, 2).toUpperCase()
                    : "ST"}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-text-primary truncate">
                      {initialSprint?.student?.name || "Student Sprint Request"}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-surface-raised text-text-muted text-[10px] font-bold tracking-wider uppercase border border-border">
                      STUDENT
                    </span>
                  </div>
                  <p className="text-xs text-text-muted truncate">
                    {initialSprint?.title || "1-on-1 Fullstack Architecture Sprint"}
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
              {(initialSprint?.techStackTags && initialSprint.techStackTags.length > 0
                ? initialSprint.techStackTags
                : ["Node.js", "TypeScript", "PostgreSQL", "System Design"]
              ).map((tag) => (
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
                    {initialSprint?.durationDays || 14}-Day Sprint Program
                  </p>
                  <p className="text-[11px] text-text-muted">
                    {initialSprint?.selectedDays?.length
                      ? `${initialSprint.selectedDays.length} Scheduled Sessions`
                      : "4 Live Sessions · Flexible Timing"}
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
                  {initialCohort?.mentor?.name
                    ? initialCohort.mentor.name.slice(0, 2).toUpperCase()
                    : "TZ"}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-text-primary truncate">
                      {initialCohort?.mentor?.name || "Tanzid Zihad"}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-light text-amber text-[10px] font-bold tracking-wider uppercase border border-amber/20">
                      MENTOR
                    </span>
                  </div>
                  <p className="text-xs text-text-muted truncate">
                    Staff Engineer · Mentor-Led Cohort
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
                {initialCohort?.title ||
                  "Advanced Backend Engineering & System Architecture"}
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mt-1">
                {initialCohort?.description ||
                  "Learn to design scalable PostgreSQL databases, write clean Express 5 microservices, and integrate payment gateways. From zero to production-ready."}
              </p>
            </div>

            {/* Tech stack tags */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {(initialCohort?.techStackTags && initialCohort.techStackTags.length > 0
                ? initialCohort.techStackTags
                : ["Node.js", "TypeScript", "PostgreSQL", "Prisma", "Express"]
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
                      {initialCohort?.durationWeeks || 6} Weeks Intensive
                    </p>
                    <span className="text-[10px] text-text-muted">·</span>
                    <span className="text-xs font-bold text-amber">
                      {initialCohort?.totalCost || 400} Credits
                    </span>
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
            AR
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-primary">Alex Rivera</span>
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
