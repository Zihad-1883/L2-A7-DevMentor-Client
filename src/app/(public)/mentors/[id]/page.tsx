import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Award,
  Calendar,
  Clock,
  Timer,
  Code2,
  Users,
  ShieldCheck,
  Star,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TechStackTags from "@/components/shared/TechStackTags";
import SmartAuthButton from "@/components/shared/SmartAuthButton";
import type { MentorProfileItem } from "@/services/mentor.service";

async function getMentor(id: string): Promise<MentorProfileItem | null> {
  const backendUrl =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://dev-mentor-server.vercel.app";

  try {
    const res = await fetch(`${backendUrl}/api/v1/mentors/${id}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data) return json.data;
    }
    return null;
  } catch {
    return null;
  }
}

export default async function MentorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mentor = await getMentor(id);

  if (!mentor) {
    notFound();
  }

  const name = mentor.user?.name || "Senior Mentor";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const levelColorMap: Record<string, string> = {
    JUNIOR: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    MID: "text-emerald bg-emerald/10 border-emerald/20",
    SENIOR: "text-amber bg-amber/10 border-amber/20",
    LEAD: "text-terracotta bg-terracotta/10 border-terracotta/20",
  };

  const levelBadge = levelColorMap[mentor.experienceLevel] || levelColorMap.SENIOR;

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Breadcrumb strip */}
      <div className="w-full border-b border-border/80 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <Link
            href="/mentors"
            className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-amber transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Back to All Mentors
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Profile Info (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Mentor Header Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-surface border border-border shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="size-20 rounded-2xl bg-amber-light text-amber font-serif font-bold text-2xl flex items-center justify-center border-2 border-amber/30 shrink-0 shadow-inner">
                    {initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                        {name}
                      </h1>
                      <BadgeCheck className="size-5 text-emerald shrink-0" />
                    </div>
                    <p className="text-sm text-text-muted mt-0.5">
                      Verified Engineering Mentor · Active on DevMentor
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border self-start sm:self-auto ${levelBadge}`}
                >
                  <Award className="size-3.5" />
                  {mentor.experienceLevel} ENGINEER
                </span>
              </div>

              {/* Bio & Philosophy */}
              <div className="space-y-3 pt-6 border-t border-border/60">
                <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  About the Mentor
                </h2>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                  {mentor.bio}
                </p>
              </div>

              {/* Tech Stack expertise */}
              <div className="space-y-3 pt-6 border-t border-border/60 mt-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Technical Expertise
                </h2>
                <div className="flex flex-wrap gap-2">
                  {mentor.techStackTags.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-lg bg-surface-raised text-text-primary text-xs font-medium border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* External Links */}
              {mentor.githubUrl && (
                <div className="pt-6 border-t border-border/60 mt-6 flex items-center gap-4">
                  <a
                    href={mentor.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-surface-raised hover:bg-border/60 text-xs font-semibold text-text-primary border border-border transition-colors"
                  >
                    <span>View GitHub Profile</span>
                    <ExternalLink className="size-3.5 text-text-muted" />
                  </a>
                </div>
              )}
            </div>

            {/* Mentorship Offerings & Scope */}
            <div className="p-8 rounded-3xl bg-surface border border-border shadow-xs space-y-6">
              <h2 className="font-serif text-xl font-bold text-text-primary">
                Mentorship Programs Offered by {name.split(" ")[0]}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-surface-raised border border-border/70 flex flex-col justify-between">
                  <div className="space-y-2 mb-4">
                    <div className="size-10 rounded-xl bg-amber-light text-amber flex items-center justify-center">
                      <Timer className="size-5" />
                    </div>
                    <h3 className="font-serif text-base font-bold text-text-primary">
                      1-on-1 Sprints
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Custom intensive multi-session sprint with dedicated paired programming, architecture planning, and debugging.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-amber">
                    50 Credits / session (~400 CR for 8 sessions)
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-surface-raised border border-border/70 flex flex-col justify-between">
                  <div className="space-y-2 mb-4">
                    <div className="size-10 rounded-xl bg-terracotta-light text-terracotta flex items-center justify-center">
                      <Code2 className="size-5" />
                    </div>
                    <h3 className="font-serif text-base font-bold text-text-primary">
                      Deep Code Reviews
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Line-by-line pull request audits, concurrency safety checks, and architectural refactoring suggestions.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-terracotta">
                    10 - 50 Credits / review
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Booking & Wallet Escrow Card (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 bg-surface rounded-3xl p-7 border border-border shadow-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-light text-emerald text-xs font-bold uppercase tracking-wider mb-4 border border-emerald/20">
                <span className="size-2 rounded-full bg-emerald animate-ping" />
                Available for Booking
              </div>

              <div className="border-b border-border/60 pb-6 mb-6">
                <span className="text-xs text-text-muted block font-medium">Sprint Session Rate</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-serif text-3xl font-bold text-text-primary">
                    50
                  </span>
                  <span className="text-sm font-semibold text-amber">Credits / session</span>
                </div>
                <p className="text-xs text-text-muted mt-1">= 200 BDT via bKash wallet</p>
              </div>

              <div className="space-y-3.5 mb-6 text-xs text-text-secondary">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald shrink-0" />
                  <span>Verified 1-on-1 private video calls</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald shrink-0" />
                  <span>Interactive screen share &amp; code reviews</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald shrink-0" />
                  <span>Escrow protection until session ends</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href={`/dashboard/sprints/new?mentorId=${mentor.userId || mentor.user?.id || mentor.id}&mentorName=${encodeURIComponent(name)}`}
                  className="w-full block"
                >
                  <Button
                    size="lg"
                    className="w-full bg-amber text-white hover:bg-amber-hover font-bold shadow-md py-6 text-sm cursor-pointer"
                  >
                    Request 1-on-1 Sprint with {name.split(" ")[0]}
                  </Button>
                </Link>

                <Link href="/mentors" className="w-full block">
                  <Button variant="outline" size="sm" className="w-full border-border text-xs">
                    Browse Other Mentors
                  </Button>
                </Link>
              </div>

              <div className="mt-5 pt-5 border-t border-border/60 flex items-center justify-center gap-2 text-center text-xs text-text-muted">
                <ShieldCheck className="size-4 text-emerald shrink-0" />
                <span>100% money-back escrow guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
