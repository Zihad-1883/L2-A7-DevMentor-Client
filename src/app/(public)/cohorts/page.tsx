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
import CohortCard from "@/features/cohort/CohortCard";
import type { CohortItem } from "@/services/cohort.service";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering Cohorts & Live Bootcamps",
  description:
    "Join intensive, multi-week software engineering cohorts led by industry staff mentors. Small class sizes, live workshops, and real-world projects.",
};

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cohorts.map((cohort) => (
              <CohortCard key={cohort.id} cohort={cohort} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
