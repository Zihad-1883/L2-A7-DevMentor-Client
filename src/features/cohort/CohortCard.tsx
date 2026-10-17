import Link from "next/link";
import { BookOpen, Calendar, Users, ArrowRight, Sparkles } from "lucide-react";
import TechStackTags from "@/components/shared/TechStackTags";
import { Button } from "@/components/ui/button";
import type { CohortItem } from "@/services/cohort.service";

interface CohortCardProps {
  cohort: CohortItem;
}

export default function CohortCard({ cohort }: CohortCardProps) {
  const mentorName = cohort.mentor?.name || "Senior Mentor";
  const mentorInitials = mentorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const enrolledCount = cohort._count?.enrollments ?? 0;
  const isFree = !cohort.totalCost || cohort.totalCost === 0;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-amber/50 hover:shadow-md h-full">
      <div>
        {/* Top Header: Mentor info + Status pill */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {cohort.mentor?.image ? (
              <img
                src={cohort.mentor.image}
                alt={mentorName}
                className="size-9 rounded-full object-cover border border-border shrink-0"
              />
            ) : (
              <div className="size-9 rounded-full bg-amber-light text-amber font-serif font-bold text-xs flex items-center justify-center border border-amber/30 shrink-0">
                {mentorInitials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-text-primary truncate">
                {mentorName}
              </p>
              <p className="text-[10px] text-text-muted">Lead Instructor</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-light text-emerald border border-emerald/20 shrink-0">
            <Sparkles className="size-2.5" />
            Approved
          </span>
        </div>

        {/* Cohort Title */}
        <h3 className="font-serif text-base font-bold text-text-primary group-hover:text-amber transition-colors line-clamp-1 mb-1.5">
          {cohort.title}
        </h3>

        {/* Short Description (Strictly clamped to 2 lines for card uniformity) */}
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-3.5 min-h-[2rem]">
          {cohort.description}
        </p>

        {/* Tech Stack Tags */}
        <div className="mb-4">
          <TechStackTags tags={cohort.techStackTags} maxVisible={3} size="sm" />
        </div>
      </div>

      <div>
        {/* Metadata info strip: Duration, Seats, Price */}
        <div className="pt-3 pb-3.5 border-t border-border/60 flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] text-text-secondary">
              <Calendar className="size-3 text-text-muted" />
              {cohort.durationWeeks}w
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-text-secondary">
              <Users className="size-3 text-text-muted" />
              {enrolledCount}/{cohort.capacity}
            </span>
          </div>

          <div>
            {isFree ? (
              <span className="font-bold text-emerald text-xs">Free Enrollment</span>
            ) : (
              <span className="font-bold text-amber text-xs">
                {cohort.totalCost} Cr{" "}
                <span className="text-[10px] font-normal text-text-muted">
                  (={cohort.totalCost * 4} BDT)
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Full-width View Details button */}
        <Link href={`/cohorts/${cohort.id}`} className="block w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs font-semibold group-hover:border-amber/60 group-hover:bg-amber-light group-hover:text-amber transition-all cursor-pointer gap-1.5"
          >
            <span>View Details</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
