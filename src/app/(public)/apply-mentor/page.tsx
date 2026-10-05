import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Award,
  Users,
  Coins,
} from "lucide-react";
import MentorApplicationForm from "@/features/mentor/MentorApplicationForm";

export const metadata = {
  title: "Apply to Become a Mentor | DevMentor",
  description:
    "Join DevMentor as an instructor. Lead 1-on-1 sprint coaching, host group cohorts, conduct code reviews, and earn withdrawable credits.",
};

export default function MentorApplyPage() {
  return (
    <div className="w-full min-h-screen bg-background">
      {/* Top Banner Navigation */}
      <div className="w-full border-b border-border/80 bg-surface">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/mentors"
            className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-amber transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Back to Mentors Pool
          </Link>
          <div className="flex items-center gap-2 text-xs text-text-muted font-medium">
            <span className="size-2 rounded-full bg-emerald" />
            <span>Open for Applications</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16 space-y-12">
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border shadow-xs">
            <Sparkles className="size-3.5 text-amber" />
            <span className="text-xs font-semibold tracking-wider uppercase text-text-secondary">
              Mentor Onboarding
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-text-primary tracking-tight">
            Share Your Engineering Expertise
          </h1>

          <p className="text-base text-text-secondary leading-relaxed">
            Help junior &amp; mid-level developers grow through hands-on sprint guidance, architecture code reviews, and interactive cohort programs.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-2">
            <div className="size-10 rounded-xl bg-amber-light text-amber flex items-center justify-center border border-amber/30">
              <Coins className="size-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-text-primary">
              Direct Credit Earnings
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Earn DevCredits on every sprint, cohort session, and deep code review delivered, redeemable for bKash cash-out payouts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-2">
            <div className="size-10 rounded-xl bg-emerald-light text-emerald flex items-center justify-center border border-emerald/30">
              <Users className="size-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-text-primary">
              Host Group Cohorts
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Build your personal engineering brand by teaching structured, multi-week programs to eager developer cohorts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-2">
            <div className="size-10 rounded-xl bg-amber-light text-amber flex items-center justify-center border border-amber/30">
              <Award className="size-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-text-primary">
              Flexible Commitment
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Accept sprint requests on your own schedule. Set your own availability and guide mentees at your own pace.
            </p>
          </div>
        </div>

        {/* Application Form Component */}
        <MentorApplicationForm />
      </div>
    </div>
  );
}
