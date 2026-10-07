import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ExamBuilderForm from "@/features/exam/ExamBuilderForm";

export const metadata = {
  title: "Create MCQ Exam | Mentor Studio",
  description:
    "Build timed multiple-choice engineering assessments with auto-grading and teaching feedback for students.",
};

export default function NewExamPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/mentor/exams"
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-amber transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Assessments
        </Link>
      </div>

      {/* Main Assessment Builder Form */}
      <ExamBuilderForm />
    </div>
  );
}
