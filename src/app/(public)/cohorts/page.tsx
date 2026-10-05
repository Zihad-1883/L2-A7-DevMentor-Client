import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Users,
  ArrowRight,
  Sparkles,
  Layers,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CohortItem } from "@/services/cohort.service";

async function getPublishedCohorts(): Promise<CohortItem[]> {
  const backendUrl =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://dev-mentor-server.vercel.app";

  try {
    const res = await fetch(`${backendUrl}/api/v1/cohorts?limit=20`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.cohorts || [];
  } catch {
    return [];
  }
}

export default async function CohortsPage() {
  const cohorts = await getPublishedCohorts();

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero header */}
      <section className="border-b border-border/80 bg-surface py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-raised border border-border shadow-xs mb-4">
              <span className="size-2 rounded-full bg-emerald animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-text-secondary">
                Admin-Approved Cohorts
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-text-primary tracking-tight mb-4">
              Engineering Cohort Programs
            </h1>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              Intensive, multi-week programs led by seasoned engineering leaders. Deep dive into system design, scalable databases, and production practices with peers.
            </p>
          </div>
        </div>
      </section>

      {/* Cohorts Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {cohorts.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-3xl border border-border p-8">
            <BookOpen className="size-12 text-amber mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold text-text-primary mb-2">
              No Published Cohorts Found
            </h2>
            <p className="text-sm text-text-secondary max-w-md mx-auto mb-6">
              Check back shortly as our mentors submit new curriculum tracks for admin review.
            </p>
            <Link href="/">
              <Button variant="outline" className="border-border">
                <ArrowLeft className="size-4 mr-2" /> Back to Home
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cohorts.map((cohort) => {
              const enrolledCount = cohort._count?.enrollments ?? 0;
              const mentorInitials = cohort.mentor?.name
                ? cohort.mentor.name.slice(0, 2).toUpperCase()
                : "ME";

              return (
                <div
                  key={cohort.id}
                  className="bg-surface rounded-2xl p-7 border border-border shadow-xs hover:border-amber/50 hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top mentor header */}
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-11 rounded-full bg-amber-light text-amber font-serif font-bold text-sm flex items-center justify-center border border-amber/30 shrink-0">
                          {mentorInitials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-serif text-sm font-bold text-text-primary truncate">
                            {cohort.mentor?.name || "Mentor"}
                          </p>
                          <p className="text-[11px] text-text-muted truncate">
                            {cohort.mentor?.mentorProfile?.experienceLevel || "SENIOR"} Lead
                          </p>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-light text-emerald text-[10px] font-bold tracking-wider uppercase border border-emerald/20 shrink-0">
                        OPEN
                      </span>
                    </div>

                    {/* Title & description */}
                    <h2 className="font-serif text-xl font-bold text-text-primary mb-2.5 group-hover:text-amber transition-colors line-clamp-2">
                      {cohort.title}
                    </h2>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-3 mb-5">
                      {cohort.description}
                    </p>

                    {/* Tech Stack tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {cohort.techStackTags.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md bg-surface-raised text-text-secondary text-[11px] font-medium border border-border"
                        >
                          {tech}
                        </span>
                      ))}
                      {cohort.techStackTags.length > 4 && (
                        <span className="text-[11px] text-text-muted self-center">
                          +{cohort.techStackTags.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Stats & CTA */}
                  <div className="pt-5 border-t border-border/80 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif text-lg font-bold text-text-primary">
                          {cohort.totalCost}
                        </span>
                        <span className="text-xs font-semibold text-amber">Credits</span>
                      </div>
                      <p className="text-[11px] text-text-muted">
                        {cohort.durationWeeks} Weeks Intensive · Mentor-Led
                      </p>
                    </div>

                    <Link href={`/cohorts/${cohort.id}`}>
                      <Button
                        size="sm"
                        className="bg-amber text-white hover:bg-amber-hover font-semibold text-xs shadow-xs"
                      >
                        View Cohort <ArrowRight className="size-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
