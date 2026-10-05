import Link from "next/link";
import {
  Clock,
  HelpCircle,
  Award,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  User,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Exam } from "@/types/exam.types";

interface ExamCardProps {
  exam: Exam;
}

export default function ExamCard({ exam }: ExamCardProps) {
  const mentorName = exam.mentor?.name || "DevMentor Faculty";
  const mentorInitials = mentorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isFree = exam.isFree;
  const passMark = exam.passMark ?? 60;
  const totalQuestions = exam.totalQuestions || exam.questions?.length || 10;
  const duration = exam.durationMinutes || 20;

  return (
    <div className="bg-surface rounded-2xl p-7 border border-border shadow-xs hover:border-amber/50 hover:shadow-lg transition-all flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-9 rounded-full bg-amber-light text-amber font-serif font-bold text-xs flex items-center justify-center border border-amber/30 shrink-0">
              {mentorInitials}
            </div>
            <div className="min-w-0">
              <p className="font-serif text-xs font-bold text-text-primary truncate">
                {mentorName}
              </p>
              <p className="text-[10px] text-text-muted truncate">
                {exam.cohort?.title
                  ? `Cohort: ${exam.cohort.title}`
                  : exam.sprint?.title
                  ? `Sprint: ${exam.sprint.title}`
                  : "Curated Practice"}
              </p>
            </div>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border shrink-0 ${
              isFree
                ? "bg-emerald-light text-emerald border-emerald/20"
                : "bg-surface-raised text-amber border-amber/20"
            }`}
          >
            {isFree ? "Free Practice" : "Enrolled Only"}
          </span>
        </div>

        {/* Exam Title */}
        <h3 className="font-serif text-lg font-bold text-text-primary mb-2 group-hover:text-amber transition-colors line-clamp-2">
          {exam.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-5">
          {exam.description ||
            "Challenge yourself with verified real-world engineering MCQs designed to test depth of understanding, edge cases, and industry standards."}
        </p>

        {/* Key Metrics Pill Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-surface-raised border border-border/80 mb-5 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] font-bold text-text-primary">
              <Clock className="size-3 text-amber" />
              <span>{duration}m</span>
            </div>
            <span className="text-[10px] text-text-muted">Duration</span>
          </div>

          <div className="flex flex-col items-center border-x border-border/80">
            <div className="flex items-center gap-1 text-[11px] font-bold text-text-primary">
              <HelpCircle className="size-3 text-amber" />
              <span>{totalQuestions}</span>
            </div>
            <span className="text-[10px] text-text-muted">Questions</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] font-bold text-text-primary">
              <Award className="size-3 text-emerald" />
              <span>{passMark}%</span>
            </div>
            <span className="text-[10px] text-text-muted">Pass Mark</span>
          </div>
        </div>

        {/* Tech Stack Tags if present */}
        {exam.techStackTags && exam.techStackTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {exam.techStackTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-surface text-text-secondary text-[11px] font-medium border border-border"
              >
                {tag}
              </span>
            ))}
            {exam.techStackTags.length > 3 && (
              <span className="text-[11px] text-text-muted self-center">
                +{exam.techStackTags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer & CTA */}
      <div className="pt-4 border-t border-border/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <ShieldCheck className="size-3.5 text-emerald" />
          <span>Auto-Graded</span>
        </div>

        <Link href={`/exams/${exam.id}`}>
          <Button
            size="sm"
            className="bg-amber text-white hover:bg-amber-hover font-semibold text-xs shadow-xs"
          >
            Exam Details <ArrowRight className="size-3 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
