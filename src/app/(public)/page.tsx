import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Layers,
  BookOpen,
  CheckCircle2,
  Users,
  GitPullRequest,
  GraduationCap,
  Coins,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/shared/StatCard";
import MentorCard from "@/features/mentor/MentorCard";
import HeroInteractiveMockup from "@/features/landing/HeroInteractiveMockup";
import { MotionFadeIn, MotionStagger } from "@/components/shared/MotionWrappers";
import type { MentorProfileItem } from "@/services/mentor.service";

export const metadata: Metadata = {
  title: "DevMentor — Credit-Based Mentorship & Code Review Marketplace",
  description:
    "Accelerate your engineering growth with 1-on-1 sprint mentorship, structured multi-week cohorts, and async production-grade code reviews.",
  openGraph: {
    title: "DevMentor — Credit-Based Mentorship & Code Review Marketplace",
    description:
      "Accelerate your engineering growth with 1-on-1 sprint mentorship, structured multi-week cohorts, and async production-grade code reviews.",
  },
};

async function getFeaturedMentors(): Promise<MentorProfileItem[]> {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "https://dev-mentor-server.vercel.app";

    const res = await fetch(`${backendUrl}/api/v1/mentors?limit=6`, {
      cache: "no-store",
    });

    if (!res.ok) return [];
    const json = await res.json();
    const fetched = (json?.data?.mentors as MentorProfileItem[] | undefined) || [];
    return fetched.slice(0, 3);
  } catch {
    return [];
  }
}

async function getHeroData() {
  const backendUrl =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://dev-mentor-server.vercel.app";

  try {
    const [cohortRes, sprintRes] = await Promise.all([
      fetch(`${backendUrl}/api/v1/cohorts?limit=1`, {
        cache: "no-store",
      }).catch(() => null),
      fetch(`${backendUrl}/api/v1/sprints/open-pool?limit=1`, {
        cache: "no-store",
      }).catch(() => null),
    ]);

    const cohortJson = cohortRes?.ok ? await cohortRes.json() : null;
    const sprintJson = sprintRes?.ok ? await sprintRes.json() : null;

    const cohort = cohortJson?.data?.cohorts?.[0] || null;
    const sprint = sprintJson?.data?.sprints?.[0] || null;

    return { cohort, sprint };
  } catch {
    return { cohort: null, sprint: null };
  }
}

export default async function HomePage() {
  const [featuredMentors, heroData] = await Promise.all([
    getFeaturedMentors(),
    getHeroData(),
  ]);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 pt-8 sm:pt-14 pb-16 lg:pb-24">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4/5 h-80 bg-linear-to-br from-amber-light/40 via-amber/10 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          <div className="lg:col-span-6 flex flex-col items-start pr-0 lg:pr-4">
            <MotionFadeIn direction="down" delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border shadow-xs mb-6">
                <span className="size-2 rounded-full bg-amber animate-pulse" />
                <span className="text-xs font-semibold tracking-wider uppercase text-text-secondary">
                  Verified Senior &amp; Mid-Level Engineers
                </span>
              </div>
            </MotionFadeIn>

            <MotionFadeIn direction="up" delay={0.2}>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-[1.12] mb-6">
                Get Mentored by{" "}
                <span className="relative inline-block text-amber italic font-serif">
                  Real Engineers
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full text-amber/40"
                    fill="none"
                    height="7"
                    viewBox="0 0 240 7"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 4.5C65 1.5 175 1.5 238 4.8"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                  </svg>
                </span>
              </h1>
            </MotionFadeIn>

            <MotionFadeIn direction="up" delay={0.3}>
              <p className="text-base sm:text-lg text-text-muted mb-8 max-w-xl leading-relaxed">
                Submit a 1-on-1 sprint request, enroll in mentor-led cohort programs, or get async code reviews from experienced engineers — all powered by a flexible credit wallet.
              </p>
            </MotionFadeIn>

            <MotionFadeIn direction="up" delay={0.4} className="w-full sm:w-auto">
              <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
                <Link href="/mentors" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-full font-semibold shadow-md gap-2"
                  >
                    <span>Find a Mentor</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/apply-mentor" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-full font-semibold border-border bg-surface hover:bg-surface-raised cursor-pointer"
                  >
                    <span>Become a Mentor</span>
                  </Button>
                </Link>
              </div>
            </MotionFadeIn>

            <MotionFadeIn direction="up" delay={0.5} className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-5 border-t border-border/80 w-full">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber font-bold text-sm">★ 4.9/5</span>
                  <span className="text-xs text-text-muted">
                    from 1,200+ engineers building at
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-surface-raised text-text-secondary text-xs font-semibold tracking-wide border border-border/60">
                    Shopify
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-surface-raised text-text-secondary text-xs font-semibold tracking-wide border border-border/60">
                    Grab
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-surface-raised text-text-secondary text-xs font-semibold tracking-wide border border-border/60">
                    Notion
                  </span>
                </div>
              </div>
            </MotionFadeIn>
          </div>

          <div className="lg:col-span-6 w-full">
            <HeroInteractiveMockup
              initialCohort={heroData.cohort}
              initialSprint={heroData.sprint}
            />
          </div>
        </div>
      </section>

      {/* PLATFORM STATISTICS */}
      <section className="py-12 bg-surface-raised/60 border-y border-border/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <MotionStagger staggerDelay={0.12} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              title="Verified Mentors"
              value="50+"
              subtitle="Specializing in Web, Mobile & Cloud"
              icon={Users}
              variant="amber"
            />
            <StatCard
              title="Code Reviews Delivered"
              value="1,240+"
              subtitle="Average turnaround under 18 hours"
              icon={GitPullRequest}
              variant="emerald"
            />
            <StatCard
              title="Cohort Graduates"
              value="850+"
              subtitle="94% job or internship placement"
              icon={GraduationCap}
              variant="default"
            />
            <StatCard
              title="Credit Satisfaction"
              value="99.2%"
              subtitle="Protected by satisfaction guarantee"
              icon={Coins}
              variant="terracotta"
            />
          </MotionStagger>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="bg-surface-raised/70 rounded-3xl p-8 lg:p-12 border border-border shadow-xs relative overflow-hidden">
          <div className="absolute -right-16 -top-16 size-72 bg-amber-light/30 rounded-full blur-3xl pointer-events-none" />

          <MotionFadeIn direction="up">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber px-3 py-1 rounded-full bg-amber-light mb-3">
                How It Works
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
                Level up your engineering career in three steps.
              </h2>
            </div>
          </MotionFadeIn>

          <MotionStagger staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="bg-surface rounded-2xl p-7 border border-border shadow-xs flex flex-col justify-between hover:shadow-md hover:border-amber/40 transition-all">
              <div>
                <span className="font-serif text-4xl text-amber font-bold block mb-4">
                  01
                </span>
                <h3 className="font-serif text-xl font-bold text-text-primary mb-2.5">
                  Buy DevCredits
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Top up your credit wallet via bKash. Credits never expire and there are no subscriptions — spend only when you book a sprint, enroll in a cohort, or unlock a code review.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-border flex items-center text-amber text-xs font-semibold gap-1.5">
                <CreditCard className="size-4" />
                <span>Pay-as-you-grow, via bKash</span>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-7 border border-border shadow-xs flex flex-col justify-between hover:shadow-md hover:border-amber/40 transition-all">
              <div>
                <span className="font-serif text-4xl text-amber font-bold block mb-4">
                  02
                </span>
                <h3 className="font-serif text-xl font-bold text-text-primary mb-2.5">
                  Submit a Sprint or Join a Cohort
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Post a 1-on-1 sprint request with your goals and preferred days — verified mentors browse the pool and claim it. Or enroll directly in a mentor-led cohort program and pay per session.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-border flex items-center text-amber text-xs font-semibold gap-1.5">
                <Layers className="size-4" />
                <span>Mentor-matched, not algorithm-matched</span>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-7 border border-border shadow-xs flex flex-col justify-between hover:shadow-md hover:border-amber/40 transition-all">
              <div>
                <span className="font-serif text-4xl text-amber font-bold block mb-4">
                  03
                </span>
                <h3 className="font-serif text-xl font-bold text-text-primary mb-2.5">
                  Learn, Grow &amp; Get Reviewed
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Attend live sessions via Google Meet or Zoom, take free MCQ skill exams, access mentor study materials, and submit code for async deep reviews — all tracked in your dashboard.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-border flex items-center text-emerald text-xs font-semibold gap-1.5">
                <TrendingUp className="size-4" />
                <span>Track progress across every session</span>
              </div>
            </div>
          </MotionStagger>
        </div>
      </section>

      {/* PLATFORM FEATURES GRID */}
      <section className="py-16 max-w-7xl mx-auto px-6 lg:px-12">
        <MotionFadeIn direction="up">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber px-3 py-1 rounded-full bg-surface-raised mb-3 border border-border">
              Platform Features
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-3">
              Everything You Need to Advance
            </h2>
            <p className="text-base text-text-muted">
              Built for developers who want real mentorship, actionable code feedback, and measurable progress.
            </p>
          </div>
        </MotionFadeIn>

        <MotionStagger staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="bg-surface rounded-2xl p-6 lg:p-7 border border-border shadow-xs hover:border-amber/60 hover:shadow-md transition-all group">
            <div className="size-12 rounded-xl bg-amber-light text-amber flex items-center justify-center mb-5 group-hover:scale-105 transition-transform border border-amber/20">
              <Zap className="size-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-text-primary mb-2">
              Sprint Programs
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Submit a 1-on-1 sprint request with your tech goals, duration, and preferred session days. Verified mentors browse the open pool and claim your request — no cold outreach needed.
            </p>
          </div>

          <div className="bg-surface rounded-2xl p-6 lg:p-7 border border-border shadow-xs hover:border-amber/60 hover:shadow-md transition-all group">
            <div className="size-12 rounded-xl bg-amber-light text-amber flex items-center justify-center mb-5 group-hover:scale-105 transition-transform border border-amber/20">
              <Users className="size-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-text-primary mb-2">
              Cohort Programs
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Enroll in admin-approved, mentor-led group cohorts with structured weekly sessions, embedded resources (links, code snippets, notes), and pay per session with your credits.
            </p>
          </div>

          <div className="bg-surface rounded-2xl p-6 lg:p-7 border border-border shadow-xs hover:border-amber/60 hover:shadow-md transition-all group">
            <div className="size-12 rounded-xl bg-amber-light text-amber flex items-center justify-center mb-5 group-hover:scale-105 transition-transform border border-amber/20">
              <GitPullRequest className="size-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-text-primary mb-2">
              Code Review Marketplace
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Submit code snippets or GitHub repo links for async review. Choose QUICK (10 CR, 2h SLA) or DEEP (50 CR, 24h SLA). Mentors deliver refactored code and inline comments.
            </p>
          </div>

          <div className="bg-surface rounded-2xl p-6 lg:p-7 border border-border shadow-xs hover:border-amber/60 hover:shadow-md transition-all group">
            <div className="size-12 rounded-xl bg-amber-light text-amber flex items-center justify-center mb-5 group-hover:scale-105 transition-transform border border-amber/20">
              <GraduationCap className="size-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-text-primary mb-2">
              Free MCQ Skill Exams
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Take free MCQ assessments created by mentors covering DSA, system design, React, and Node.js. Attempt as many times as you like — your best score is always retained.
            </p>
          </div>

          <div className="bg-surface rounded-2xl p-6 lg:p-7 border border-border shadow-xs hover:border-amber/60 hover:shadow-md transition-all group">
            <div className="size-12 rounded-xl bg-amber-light text-amber flex items-center justify-center mb-5 group-hover:scale-105 transition-transform border border-amber/20">
              <Coins className="size-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-text-primary mb-2">
              Unified DevWallet
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Top up via bKash and spend flexibly across sprint sessions, cohort enrollments, and code reviews. Mentors accumulate credits and withdraw as BDT — one transparent ledger.
            </p>
          </div>

          <div className="bg-surface rounded-2xl p-6 lg:p-7 border border-border shadow-xs hover:border-amber/60 hover:shadow-md transition-all group">
            <div className="size-12 rounded-xl bg-amber-light text-amber flex items-center justify-center mb-5 group-hover:scale-105 transition-transform border border-amber/20">
              <CheckCircle2 className="size-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-text-primary mb-2">
              Vetted Senior Engineers
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Every mentor undergoes admin review, GitHub code audit, and domain credential validation before claiming sprint requests or launching cohorts. Guaranteed quality guidance.
            </p>
          </div>
        </MotionStagger>
      </section>

      {/* FEATURED TOP MENTORS */}
      <section className="py-20 bg-surface-raised/50 border-y border-border/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <MotionFadeIn direction="up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber mb-2">
                  <Star className="size-3.5 fill-amber text-amber" />
                  Verified Mentors
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary">
                  Top Tier Mentors
                </h2>
                <p className="text-sm text-text-muted mt-1">
                  Every mentor is manually reviewed and approved by our admin team.
                </p>
              </div>

              <Link href="/mentors">
                <Button variant="outline" className="gap-2 group">
                  <span>View All Mentors</span>
                  <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </MotionFadeIn>

          {featuredMentors.length > 0 ? (
            <MotionStagger staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredMentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </MotionStagger>
          ) : (
            <div className="text-center py-12 px-6 rounded-2xl bg-surface border border-border">
              <p className="text-sm text-text-secondary">No approved mentors listed yet. Be the first to join as a verified instructor!</p>
              <Link href="/apply-mentor" className="inline-block mt-4">
                <Button size="sm" className="bg-amber text-white hover:bg-amber-hover text-xs">
                  Apply as Mentor
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/*  PRICING & CREDIT MODEL */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 lg:px-12">
        <MotionFadeIn direction="up">
          <div className="rounded-3xl border border-border bg-surface p-8 sm:p-12 lg:p-16 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 size-96 bg-amber/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-amber">
                Transparent Prepaid Credit Economics
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-text-primary mt-2">
                No hidden fees. Pay only for the mentorship you consume.
              </h2>
              <p className="mt-4 text-base text-text-muted leading-relaxed">
                Every service on DevMentor is priced in universal credits. Top up your wallet in Bangladeshi Taka (BDT) via bKash or card at a fixed conversion rate of <strong>1 Credit = 4 BDT</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tier 1 */}
              <div className="rounded-2xl border border-border bg-surface-raised p-6 flex flex-col justify-between hover:border-amber/40 transition-colors">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Quick Review
                  </span>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-serif text-4xl font-bold text-text-primary">10</span>
                    <span className="text-sm font-semibold text-amber">Credits</span>
                  </div>
                  <div className="text-xs text-text-muted mt-1 font-medium">
                    = 40 BDT equivalent
                  </div>
                  <ul className="mt-6 space-y-2.5 text-xs text-text-secondary">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald shrink-0" />
                      <span>Up to 150 lines of code</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald shrink-0" />
                      <span>Bug diagnosis &amp; sanity check</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald shrink-0" />
                      <span>24-hour turnaround</span>
                    </li>
                  </ul>
                </div>

                <Link href="/register" className="mt-8">
                  <Button variant="outline" className="w-full text-xs font-semibold">
                    Get Started
                  </Button>
                </Link>
              </div>

              {/* Tier 2 (Highlighted) */}
              <div className="rounded-2xl border-2 border-amber bg-surface-raised p-6 flex flex-col justify-between relative shadow-sm">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
                  Most Popular
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber">
                    Foundation Sprint Pack (3 Sessions)
                  </span>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-serif text-4xl font-bold text-text-primary">150</span>
                    <span className="text-sm font-semibold text-amber">Credits</span>
                  </div>
                  <div className="text-xs text-text-muted mt-1 font-medium">
                    = 600 BDT equivalent (50 CR / live session)
                  </div>
                  <ul className="mt-6 space-y-2.5 text-xs text-text-secondary">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald shrink-0" />
                      <span>Dedicated 1-on-1 live screen share &amp; code review</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald shrink-0" />
                      <span>Interactive pair debugging &amp; architecture guidance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald shrink-0" />
                      <span>Escrow held until each session completes</span>
                    </li>
                  </ul>
                </div>

                <Link href="/register" className="mt-8">
                  <Button className="w-full text-xs font-semibold shadow-sm">
                    Book First Sprint
                  </Button>
                </Link>
              </div>

              {/* Tier 3 */}
              <div className="rounded-2xl border border-border bg-surface-raised p-6 flex flex-col justify-between hover:border-amber/40 transition-colors">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Deep Code Audit
                  </span>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-serif text-4xl font-bold text-text-primary">50</span>
                    <span className="text-sm font-semibold text-amber">Credits</span>
                  </div>
                  <div className="text-xs text-text-muted mt-1 font-medium">
                    = 200 BDT equivalent
                  </div>
                  <ul className="mt-6 space-y-2.5 text-xs text-text-secondary">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald shrink-0" />
                      <span>Full PR / repository architectural review</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald shrink-0" />
                      <span>Security &amp; performance optimization audit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald shrink-0" />
                      <span>Direct Q&amp;A follow-up in thread</span>
                    </li>
                  </ul>
                </div>

                <Link href="/register" className="mt-8">
                  <Button variant="outline" className="w-full text-xs font-semibold">
                    Submit PR
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </MotionFadeIn>
      </section>

      {/* CTA BANNER */}
      <section className="my-12 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <MotionFadeIn direction="up">
          <div className="rounded-3xl p-10 lg:p-14 bg-linear-to-r from-amber-hover via-amber to-amber-hover text-white text-center shadow-[0_20px_40px_-12px_rgba(217,119,6,0.35)] relative overflow-hidden">
            <div className="absolute -top-12 -left-12 size-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 size-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 text-white backdrop-blur-sm text-xs font-semibold mb-5 border border-white/20">
                <Sparkles className="size-3.5" />
                <span>Transparent Prepaid Mentorship</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4 text-white">
                Ready to accelerate your career?
              </h2>

              <p className="text-base sm:text-lg text-white/90 mb-8 max-w-xl leading-relaxed">
                Top up your DevWallet via bKash and submit your first sprint request in minutes. Verified mentors are waiting to claim it.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="h-12 px-8 rounded-full bg-text-primary text-surface hover:bg-black font-semibold shadow-xl gap-2 active:scale-98 transition-all"
                  >
                    <span>Get Started Now</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/apply-mentor">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-8 rounded-full border-white/30 text-white bg-white/10 hover:bg-white/20 font-semibold cursor-pointer"
                  >
                    <span>Apply as a Mentor</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </MotionFadeIn>
      </section>
    </div>
  );
}
