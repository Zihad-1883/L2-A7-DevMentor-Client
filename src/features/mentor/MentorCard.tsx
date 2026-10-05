import Link from "next/link";
import { BadgeCheck, ArrowRight, Award } from "lucide-react";
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
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-amber/50 hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-xl bg-amber/10 border border-amber/20 text-amber font-bold text-base flex items-center justify-center shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif text-lg font-bold text-text-primary group-hover:text-amber transition-colors">
                  {name}
                </h3>
                <BadgeCheck className="size-4 text-emerald shrink-0" />
              </div>
              <span className="text-xs text-text-muted">Engineering Mentor</span>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${levelBadge}`}
          >
            <Award className="size-3" />
            {mentor.experienceLevel}
          </span>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 mb-4">
          {mentor.bio}
        </p>

        <div className="mb-6">
          <TechStackTags tags={mentor.techStackTags} maxVisible={4} size="sm" />
        </div>
      </div>

      <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {mentor.githubUrl && (
            <a
              href={mentor.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors"
              aria-label="GitHub Profile"
            >
              <svg className="size-4 fill-currentColor" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          )}
          <span className="text-xs text-text-muted font-medium">
            1-on-1 Sprints Available
          </span>
        </div>

        <Link href={`/mentors/${mentor.id}`}>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold group-hover:border-amber/60">
            <span>View Profile</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
