import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";
import ExamAttemptEngine from "@/features/exam/ExamAttemptEngine";
import { SEED_EXAMS } from "@/features/exam/seedExams";
import type { Exam } from "@/types/exam.types";

async function getExamForAttempt(id: string): Promise<Exam | null> {
  const backendUrl =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://dev-mentor-server.vercel.app";

  try {
    const res = await fetch(`${backendUrl}/api/v1/exams/${id}`, {
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data) return json.data;
    }
  } catch {
    // fallback
  }

  const seed = SEED_EXAMS.find((e) => e.id === id);
  return seed || null;
}

export default async function ExamAttemptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exam = await getExamForAttempt(id);

  if (!exam) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Top Banner Navigation */}
      <div className="w-full border-b border-border/80 bg-surface">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href={`/exams/${exam.id}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-amber transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Back to Exam Overview
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
            <ShieldCheck className="size-3.5 text-emerald" />
            <span>Anti-Cheat Timed Engine</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 sm:py-12">
        <ExamAttemptEngine exam={exam} />
      </div>
    </div>
  );
}
