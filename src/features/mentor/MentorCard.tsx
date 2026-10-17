import Link from "next/link";
import { BadgeCheck, ArrowRight, Award, Zap } from "lucide-react";
import TechStackTags from "@/components/shared/TechStackTags";
import { Button } from "@/components/ui/button";
import type { MentorProfileItem } from "@/services/mentor.service";

interface MentorCardProps {
  mentor: MentorProfileItem;
}

export default function MentorCard({ mentor }: MentorCardProps) {
  const name = mentor.user?.name || "Senior Mentor";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const levelColorMap: Record<string, string> = {
    JUNIOR: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    MID: "text-emerald bg-emerald/10 border-emerald/20",
    SENIOR: "text-amber bg-amber/10 border-amber/20",
    LEAD: "text-terracotta bg-terracotta/10 border-terracotta/20",
  };

  const levelBadge = levelColorMap[mentor.experienceLevel] || levelColorMap.MID;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-amber/50 hover:shadow-md h-full">
      <div>
        {/* Top Header: Avatar & Experience Badge */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            {mentor.user?.image ? (
              <img
                src={mentor.user.image}
                alt={name}
                className="size-11 rounded-xl object-cover border border-border shrink-0"
              />
            ) : (
              <div className="size-11 rounded-xl bg-amber/10 border border-amber/20 text-amber font-serif font-bold text-sm flex items-center justify-center shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif text-base font-bold text-text-primary group-hover:text-amber transition-colors truncate">
                  {name}
                </h3>
                <BadgeCheck className="size-4 text-emerald shrink-0" />
              </div>
              <p className="text-xs text-text-muted truncate">Verified Engineer</p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${levelBadge}`}
          >
            <Award className="size-3" />
            {mentor.experienceLevel}
          </span>
        </div>

        {/* Short Bio (Strictly clamped to 2 lines for card uniformity) */}
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-3.5 min-h-[2rem]">
          {mentor.bio || "Staff-level software engineer offering 1-on-1 sprint pair programming and async production code reviews."}
        </p>

        {/* Tech Stack Tags */}
        <div className="mb-4">
          <TechStackTags tags={mentor.techStackTags} maxVisible={3} size="sm" />
        </div>
      </div>

      <div>
        {/* Metadata info strip */}
        <div className="pt-3 pb-3.5 border-t border-border/60 flex items-center justify-between text-xs text-text-muted">
          <span className="inline-flex items-center gap-1 font-semibold text-text-primary text-[11px]">
            <Zap className="size-3.5 text-amber fill-amber" />
            1-on-1 Sprints
          </span>
          <span className="font-bold text-amber text-xs">
            50 Cr <span className="text-[10px] font-normal text-text-muted">(=200 BDT)</span>
          </span>
        </div>

        {/* Full-width View Details button */}
        <Link href={`/mentors/${mentor.id}`} className="block w-full">
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
