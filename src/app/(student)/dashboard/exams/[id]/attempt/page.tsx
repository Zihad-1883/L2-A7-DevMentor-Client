import { notFound } from "next/navigation";
import ExamAttemptEngine from "@/features/exam/ExamAttemptEngine";
import { SEED_EXAMS } from "@/features/exam/seedExams";
import type { Exam } from "@/types/exam.types";

async function getExam(id: string): Promise<Exam | null> {
  const backendUrl =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://dev-mentor-server.vercel.app";

  try {
    const res = await fetch(`${backendUrl}/api/v1/exams/${id}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data) return json.data;
    }
  } catch {
    // fallback
  }

  return SEED_EXAMS.find((e) => e.id === id) || null;
}

export default async function StudentExamAttemptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exam = await getExam(id);

  if (!exam) {
    notFound();
  }

  return <ExamAttemptEngine exam={exam} />;
}
