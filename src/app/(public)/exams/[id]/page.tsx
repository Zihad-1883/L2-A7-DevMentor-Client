import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  HelpCircle,
  Award,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SmartAuthButton from "@/components/shared/SmartAuthButton";
import { SEED_EXAMS } from "@/features/exam/seedExams";
import type { Exam } from "@/types/exam.types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exam = SEED_EXAMS.find((e) => e.id === id);
  return {
    title: exam ? `${exam.title} | DevMentor Exams` : "Exam Details | DevMentor",
    description: exam?.description || "Online engineering multiple-choice exam.",
  };
}

async function getExamDetails(id: string): Promise<Exam | null> {
  const backendUrl =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://dev-mentor-server.vercel.app";

  try {
    const res = await fetch(`${backendUrl}/api/v1/exams/${id}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data) return json.data;
    }
  } catch {
    // fallback
  }

  // Also try searching in general exams catalog
  try {
    const listRes = await fetch(`${backendUrl}/api/v1/exams?limit=50`, {
      next: { revalidate: 60 },
    });
    if (listRes.ok) {
      const listJson = await listRes.json();
      const items: Exam[] = listJson?.data?.data || listJson?.data || [];
      const matched = items.find((e) => e.id === id);
      if (matched) return matched;
    }
  } catch {
    // fallback
  }

  const seed = SEED_EXAMS.find((e) => e.id === id);
  return seed || null;
}

export default async function ExamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exam = await getExamDetails(id);

  if (!exam) {
    notFound();
  }

  const mentorName = exam.mentor?.name || "DevMentor Engineering Faculty";
  const mentorInitials = mentorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const duration = exam.durationMinutes || 25;
  const totalQuestions = exam.totalQuestions || 15;
  const passMark = exam.passMark ?? 65;

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Top Breadcrumb Header */}
      <div className="w-full border-b border-border/80 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <Link
            href="/exams"
            className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-amber transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Back to Practice Exams Catalog
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
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${exam.isFree
                    ? "bg-emerald-light text-emerald border-emerald/20"
                    : "bg-amber-light text-amber border-amber/20"
                    }`}
                >
                  {exam.isFree ? "Free Practice Exam" : "Enrolled Cohort Exam"}
                </span>
                <span className="px-3 py-1 rounded-full bg-surface-raised text-text-muted text-xs font-semibold uppercase tracking-wider border border-border">
                  Auto-Graded
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-4">
                {exam.title}
              </h1>

              <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                {exam.description ||
                  "Gauge your understanding of real-world patterns, pitfalls, and design best practices with this standardized engineering skill evaluation."}
              </p>
            </div>

            {/* Test Specifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-center gap-4">
                <div className="size-11 rounded-xl bg-amber-light text-amber flex items-center justify-center border border-amber/30 shrink-0">
                  <Clock className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Time Limit</p>
                  <p className="font-serif text-lg font-bold text-text-primary">
                    {duration} Minutes
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-center gap-4">
                <div className="size-11 rounded-xl bg-amber-light text-amber flex items-center justify-center border border-amber/30 shrink-0">
                  <HelpCircle className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Questions</p>
                  <p className="font-serif text-lg font-bold text-text-primary">
                    {totalQuestions} MCQs
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-center gap-4">
                <div className="size-11 rounded-xl bg-emerald-light text-emerald flex items-center justify-center border border-emerald/30 shrink-0">
                  <Award className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Passing Cutoff</p>
                  <p className="font-serif text-lg font-bold text-text-primary">
                    {passMark}% Score
                  </p>
                </div>
              </div>
            </div>

            {/* Exam Rules & Instructions */}
            <div className="p-7 rounded-2xl bg-surface border border-border shadow-xs">
              <h2 className="font-serif text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <FileCheck2 className="size-5 text-amber" /> Rules &amp; Assessment Guidelines
              </h2>
              <div className="space-y-3.5 text-sm text-text-secondary">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-emerald mt-0.5 shrink-0" />
                  <span>
                    <strong>Timed Countdown:</strong> The clock starts immediately once you launch the test. The attempt auto-submits when time expires.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-emerald mt-0.5 shrink-0" />
                  <span>
                    <strong>One Answer per Question:</strong> Each multiple-choice question presents 2-4 curated choices with exactly 1 correct answer.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-emerald mt-0.5 shrink-0" />
                  <span>
                    <strong>Instant Auto-Grading:</strong> Receive your exact percentage score, pass/fail status, and a breakdown with explanations as soon as you submit.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-emerald mt-0.5 shrink-0" />
                  <span>
                    <strong>Retake Policy:</strong> You may retake public practice assessments to benchmark your knowledge retention and progression over time.
                  </span>
                </div>
              </div>
            </div>

            {/* Attached Cohort context if restricted */}
            {exam.cohort && (
              <div className="p-6 rounded-2xl bg-surface-raised border border-border/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                  Part of Cohort Program
                </h3>
                <p className="font-serif text-base font-bold text-text-primary mb-1">
                  {exam.cohort.title}
                </p>
                <p className="text-xs text-text-secondary mb-4">
                  This examination is calibrated as an assessment benchmark for students enrolled in this cohort track.
                </p>
                <Link
                  href={`/cohorts/${exam.cohort.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber hover:text-amber-hover transition-colors"
                >
                  <span>View Cohort Details</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Right Sticky Attempt Trigger Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="bg-surface rounded-2xl p-7 border-2 border-amber/30 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-amber via-terracotta to-amber" />

              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Examination Access
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-serif text-3xl font-bold text-text-primary">
                    {exam.isFree ? "Free Practice" : "Cohort Enrolled"}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1.5">
                  {exam.isFree
                    ? "Available to all registered DevMentor students at no credit cost."
                    : "Included for students enrolled in the corresponding cohort track."}
                </p>
              </div>

              {/* Specs */}
              <div className="space-y-3 pb-6 mb-6 border-b border-border/80 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Total Marks</span>
                  <span className="font-bold text-text-primary">{exam.totalMarks} Pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Required to Pass</span>
                  <span className="font-bold text-emerald">{passMark}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Duration</span>
                  <span className="font-bold text-text-primary">{duration} min</span>
                </div>
              </div>

              {/* Start Exam CTA */}
              <div className="space-y-3">
                <Link href={`/exams/${exam.id}/attempt`}>
                  <Button className="w-full bg-amber text-white hover:bg-amber-hover font-semibold h-11 text-sm shadow-sm cursor-pointer">
                    Start Timed Exam <ArrowRight className="size-4 ml-1.5" />
                  </Button>
                </Link>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-text-muted">
                <ShieldCheck className="size-4 text-emerald" />
                <span>Timer begins immediately on start</span>
              </div>
            </div>

            {/* Creator / Mentor Info Card */}
            <div className="bg-surface rounded-2xl p-6 border border-border shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-4">
                Curated By
              </span>

              <div className="flex items-center gap-3.5 mb-2">
                <div className="size-12 rounded-full bg-amber-light text-amber font-serif font-bold text-sm flex items-center justify-center border-2 border-amber/30 shrink-0">
                  {mentorInitials}
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-base font-bold text-text-primary truncate">
                    {mentorName}
                  </h3>
                  <p className="text-xs text-text-muted">DevMentor Faculty</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
