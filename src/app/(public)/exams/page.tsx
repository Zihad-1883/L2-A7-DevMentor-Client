import Link from "next/link";
import {
  FileCheck2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ExamCard from "@/features/exam/ExamCard";
import ExamFilters from "@/features/exam/ExamFilters";
import MentorExamCalloutButton from "@/features/exam/MentorExamCalloutButton";
import { SEED_EXAMS } from "@/features/exam/seedExams";
import type { Exam } from "@/types/exam.types";

export const metadata = {
  title: "MCQ Practice Exams & Skill Tests",
  description:
    "Test your engineering knowledge with curated, timed multiple-choice practice exams in Next.js, TypeScript, PostgreSQL, and System Architecture.",
};

async function getExams(): Promise<Exam[]> {
  const backendUrl =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://dev-mentor-server.vercel.app";

  try {
    const res = await fetch(`${backendUrl}/api/v1/exams?limit=30`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return SEED_EXAMS;
    const json = await res.json();
    const fetched: Exam[] = json?.data?.data || json?.data || [];
    return fetched.length > 0 ? fetched : SEED_EXAMS;
  } catch {
    return SEED_EXAMS;
  }
}

interface ExamsPageProps {
  searchParams: Promise<{
    search?: string;
    topic?: string;
    access?: string;
  }>;
}

export default async function ExamsPage({ searchParams }: ExamsPageProps) {
  const params = await searchParams;
  const search = params.search?.toLowerCase().trim() || "";
  const topic = params.topic?.toLowerCase().trim() || "";
  const access = params.access?.toLowerCase().trim() || "";

  const allExams = await getExams();

  const filteredExams = allExams.filter((exam) => {
    // Search match
    if (search) {
      const matchTitle = exam.title.toLowerCase().includes(search);
      const matchDesc = exam.description?.toLowerCase().includes(search) ?? false;
      const matchCategory = exam.category?.toLowerCase().includes(search) ?? false;
      const matchTags =
        exam.techStackTags?.some((t) => t.toLowerCase().includes(search)) ?? false;
      if (!matchTitle && !matchDesc && !matchCategory && !matchTags) {
        return false;
      }
    }

    // Topic match
    if (topic && topic !== "all") {
      const matchCategory = exam.category?.toLowerCase() === topic;
      const matchTags =
        exam.techStackTags?.some((t) => t.toLowerCase() === topic) ?? false;
      const matchTitle = exam.title.toLowerCase().includes(topic);
      if (!matchCategory && !matchTags && !matchTitle) {
        return false;
      }
    }

    // Access mode match
    if (access === "free" && !exam.isFree) return false;
    if (access === "enrolled" && exam.isFree) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="border-b border-border/80 bg-surface py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-raised border border-border shadow-xs mb-4">
              <span className="size-2 rounded-full bg-amber animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-text-secondary">
                Practice &amp; Assessment Engine
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-text-primary tracking-tight mb-4">
              Engineering Skill Tests &amp; Practice Exams
            </h1>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              Timed, rigorous MCQs built by principal engineers and mentors. Gauge your depth in TypeScript, Next.js 15, PostgreSQL, and distributed system trade-offs with instant scoring and detailed explanations.
            </p>

            {/* Quick value badges */}
            <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-text-muted">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald" />
                <span>Auto-evaluated instantly</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald" />
                <span>Anti-cheat randomized timers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileCheck2 className="size-4 text-emerald" />
                <span>No credit fee for public tests</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        {/* URL Synced Filters */}
        <ExamFilters totalCount={filteredExams.length} />

        {/* Exams Grid */}
        {filteredExams.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-3xl border border-border p-8">
            <FileCheck2 className="size-12 text-amber mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold text-text-primary mb-2">
              No Exams Matched Your Criteria
            </h2>
            <p className="text-sm text-text-secondary max-w-md mx-auto mb-6">
              Try adjusting your topic tags or search query to browse other available skill evaluations.
            </p>
            <Link href="/exams">
              <Button variant="outline" className="border-border">
                Clear Filters &amp; View All
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        )}

        {/* Banner callout */}
        <div className="mt-16 p-8 rounded-3xl bg-surface-raised border border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-serif text-xl font-bold text-text-primary">
              Are you a Mentor interested in publishing tests?
            </h3>
            <p className="text-xs text-text-secondary">
              Craft custom MCQ assessments for your cohorts or sprints with automated grading, passing cutoffs, and performance analytics.
            </p>
          </div>
          <MentorExamCalloutButton />
        </div>
      </section>
    </div>
  );
}
