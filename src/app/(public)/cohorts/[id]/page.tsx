import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CohortItem } from "@/services/cohort.service";

async function getCohortDetails(id: string): Promise<CohortItem | null> {
  const backendUrl =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://dev-mentor-server.vercel.app";

  try {
    const res = await fetch(`${backendUrl}/api/v1/cohorts/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

export default async function CohortDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cohort = await getCohortDetails(id);

  if (!cohort) {
    notFound();
  }

  const mentorName = cohort.mentor?.name || "Senior Mentor";
  const mentorBio =
    cohort.mentor?.mentorProfile?.bio ||
    "Seasoned software engineer providing rigorous mentorship, architectural guidance, and production engineering practices.";
  const mentorInitials = mentorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const mentorProfileId = cohort.mentor?.mentorProfile?.id || cohort.mentor?.id;
  const mentorProfileHref = mentorProfileId ? `/mentors/${mentorProfileId}` : "/mentors";

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Top Banner / Breadcrumb */}
      <div className="w-full border-b border-border/80 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <Link
            href="/cohorts"
            className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-amber transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Back to Cohort Programs
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Main Left Content */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-amber-light text-amber text-xs font-bold tracking-wider uppercase border border-amber/20">
                  Mentor-Led Cohort
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-light text-emerald text-xs font-bold tracking-wider uppercase border border-emerald/20 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald animate-ping" />
                  Enrolling Now
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-4">
                {cohort.title}
              </h1>

              <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                {cohort.description}
              </p>
            </div>

            {/* Tech Stack Badges */}
            <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
                <FileCode className="size-4 text-amber" /> Technologies &amp; Architecture Covered
              </h2>
              <div className="flex flex-wrap gap-2">
                {cohort.techStackTags.map((tech) => (
                  <span
                    key={tech}
                    className="px-3.5 py-1.5 rounded-lg bg-surface-raised text-text-primary text-xs font-semibold border border-border/80 shadow-2xs hover:border-amber/40 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* What Students Experience */}
            <div className="p-7 rounded-2xl bg-surface-raised border border-border/80">
              <h3 className="font-serif text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <Award className="size-5 text-amber" /> What You Will Experience in This Cohort
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm text-text-secondary">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald mt-0.5 shrink-0" />
                  <span>Live interactive group sessions with hands-on architecture Q&amp;A</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald mt-0.5 shrink-0" />
                  <span>Curated production code repositories, blueprints, and clean architecture guides</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald mt-0.5 shrink-0" />
                  <span>Cohort peer discussions and direct collaboration with your instructor</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald mt-0.5 shrink-0" />
                  <span>Structured code reviews and constructive feedback on real-world projects</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar Right Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            {/* Enrollment Pricing Card */}
            <div className="bg-surface rounded-2xl p-7 border-2 border-amber/30 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-amber via-terracotta to-amber" />

              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Cohort Investment
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-serif text-4xl font-bold text-text-primary">
                    {cohort.totalCost}
                  </span>
                  <span className="text-amber font-semibold text-sm uppercase tracking-wider">
                    DevCredits
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Includes full access to all {cohort.durationWeeks} weeks and scheduled mentor sessions.
                </p>
              </div>

              {/* Specs Grid */}
              <div className="space-y-3.5 pb-6 mb-6 border-b border-border/80 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-2">
                    <Calendar className="size-4 text-amber" /> Program Duration
                  </span>
                  <span className="font-bold text-text-primary">
                    {cohort.durationWeeks} Weeks
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-2">
                    <Users className="size-4 text-amber" /> Group Format
                  </span>
                  <span className="font-bold text-text-primary">
                    Mentor-Led Cohort
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href="/register" className="w-full block">
                  <Button
                    size="lg"
                    className="w-full bg-amber text-white hover:bg-amber-hover font-semibold shadow-md py-6 text-sm cursor-pointer"
                  >
                    Enroll Now · {cohort.totalCost} Credits
                  </Button>
                </Link>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-text-muted">
                <ShieldCheck className="size-4 text-emerald" />
                <span>Credits deducted upon cohort launch confirmation</span>
              </div>
            </div>

            {/* Mentor Profile Card */}
            <div className="bg-surface rounded-2xl p-6 border border-border shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-4">
                Lead Cohort Instructor
              </span>

              <div className="flex items-start gap-3.5 mb-4">
                <div className="size-14 rounded-full bg-amber-light text-amber font-serif font-bold text-lg flex items-center justify-center border-2 border-amber/30 shrink-0 shadow-inner">
                  {mentorInitials}
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-lg font-bold text-text-primary truncate">
                    {mentorName}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="px-2 py-0.5 rounded-full bg-amber-light text-amber text-[10px] font-bold uppercase">
                      {cohort.mentor?.mentorProfile?.experienceLevel || "SENIOR"} ENGINEER
                    </span>
                    <span className="text-xs text-text-muted">· Verified Mentor</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                {mentorBio}
              </p>

              <Link
                href={mentorProfileHref}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber hover:text-amber-hover transition-colors"
              >
                <span>View Mentor Profile</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
