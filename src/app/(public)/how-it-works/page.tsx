import Link from "next/link";
import {
  Timer,
  Users,
  Code2,
  GraduationCap,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  CreditCard,
  Zap,
  Lock,
  Calendar,
  Layers,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SmartAuthButton from "@/components/shared/SmartAuthButton";
import { MotionFadeIn, MotionStagger } from "@/components/shared/MotionWrappers";

export const metadata = {
  title: "How It Works",
  description:
    "Explore how DevMentor accelerates software engineers through 1-on-1 Sprints, Mentor-Led Group Cohorts, Async Code Reviews, and Practice Exams.",
};

const MODALITIES = [
  {
    id: "sprints",
    title: "1-on-1 Mentorship Sprints",
    subtitle: "Custom-Tailored Intensive Coaching",
    badge: "1-on-1 Sessions",
    badgeColor: "bg-amber-light text-amber border-amber/20",
    icon: Timer,
    pricing: "50 Credits / session (~400 CR for 8-session sprint)",
    tagline: "Break through complex architectural hurdles with a dedicated senior engineer.",
    overview:
      "A Sprint is a focused 1-to-4 week mentorship engagement with 1-on-1 live sessions priced at 50 credits (~200 BDT) per session. An intensive 2-week sprint with 8 scheduled sessions typically totals 400 credits.",
    steps: [
      {
        step: "01",
        title: "Define Your Scope",
        description:
          "Submit a sprint request specifying your tech stack, goals, preferred weekly schedule, and credit budget (50 CR per session).",
      },
      {
        step: "02",
        title: "Mentor Pool Matching",
        description:
          "Vetted industry mentors review the pool. When an engineer with matching domain expertise claims it, you confirm the schedule.",
      },
      {
        step: "03",
        title: "Live Intensive Collaboration",
        description:
          "Meet 1-on-1 over Google Meet or Zoom. Get architecture diagrams, hands-on debugging, paired programming, and async guidance between sessions.",
      },
      {
        step: "04",
        title: "Milestone Completion & Escrow",
        description:
          "Credits are held securely in platform escrow and released only as sessions and deliverables are satisfied.",
      },
    ],
    features: [
      "Custom syllabus tailored to your personal goals",
      "Flexible schedule coordination across timezones",
      "Private Google Meet / Zoom meeting links",
      "Full escrow refund protection if unclaimed",
    ],
    ctaHref: "/dashboard/sprints/new",
    ctaText: "Request a Sprint",
  },
  {
    id: "cohorts",
    title: "Mentor-Led Group Cohorts",
    subtitle: "Structured Multi-Week Learning",
    badge: "Group Programs",
    badgeColor: "bg-emerald-light text-emerald border-emerald/20",
    icon: Users,
    pricing: "25 - 30 Credits / session (~350+ CR for 12-15 sessions)",
    tagline: "Learn in synchronized cohorts with live interactive workshops and real-world projects.",
    overview:
      "Cohorts bring together a curated group of 15–30 engineers guided by a staff or principal engineer. Pricing is mentor-set at ~25 to 30 credits (~100-120 BDT) per session, meaning a multi-week program with 12 to 15 sessions typically totals 350 to 450 credits.",
    steps: [
      {
        step: "01",
        title: "Browse Active Cohorts",
        description:
          "Explore upcoming cohorts with detailed week-by-week syllabi, prerequisites, mentor credentials, and seat availability.",
      },
      {
        step: "02",
        title: "One-Click Wallet Enrollment",
        description:
          "Enroll instantly using DevCredits from your DevWallet. Secure your seat before registration closes.",
      },
      {
        step: "03",
        title: "Synchronous Workshops",
        description:
          "Join scheduled live sessions, participate in technical discussions, complete weekly assignments, and ask questions in real-time.",
      },
      {
        step: "04",
        title: "Capstone & Graduation",
        description:
          "Submit your capstone project, receive mentor sign-off, and earn a verified completion badge for your resume.",
      },
    ],
    features: [
      "Live interactive workshops with recorded sessions",
      "Weekly milestone code reviews from the mentor",
      "Collaborative peer community of dedicated peers",
      "Curated resources, boilerplate repos, and architecture diagrams",
    ],
    ctaHref: "/cohorts",
    ctaText: "Browse Active Cohorts",
  },
  {
    id: "code-reviews",
    title: "Async Code Review Marketplace",
    subtitle: "Production-Grade Code Audits",
    badge: "Async Feedback",
    badgeColor: "bg-terracotta-light text-terracotta border-terracotta/20",
    icon: Code2,
    pricing: "10 - 50 Credits / review",
    tagline: "Stop wondering if your code is good. Get line-by-line feedback from production engineers.",
    overview:
      "Submit a pull request, GitHub repository, or code snippet. Senior engineers review your code for scalability, security vulnerabilities, edge-case race conditions, and clean architectural design patterns.",
    steps: [
      {
        step: "01",
        title: "Submit Code & Scope",
        description:
          "Share your GitHub PR or code snippet. Choose between a Standard Audit (20 CR) or Deep Review with benchmarks (50 CR).",
      },
      {
        step: "02",
        title: "10-Minute Preview Lock",
        description:
          "To guarantee reviewer quality, mentors inspect the problem in a 10-minute temporary lock before committing to deliver.",
      },
      {
        step: "03",
        title: "Detailed Diff & Analysis",
        description:
          "The mentor provides inline annotations, refactored code blocks, benchmark comparisons, and actionable architectural tips.",
      },
      {
        step: "04",
        title: "Follow-Up Questions",
        description:
          "Ask clarifying questions directly on the review thread to ensure you fully understand the optimizations.",
      },
    ],
    features: [
      "Sub-24 hour turnaround time on reviews",
      "Line-by-line git diff feedback with clean code alternatives",
      "Security, performance, and concurrency bug detection",
      "Actionable recommendations based on real production experience",
    ],
    ctaHref: "/dashboard/code-reviews",
    ctaText: "Submit Code for Review",
  },
  {
    id: "exams",
    title: "Free Skill Validation Exams",
    subtitle: "Timed Multiple-Choice Assessments",
    badge: "Skill Certification",
    badgeColor: "bg-surface-raised text-text-primary border-border",
    icon: GraduationCap,
    pricing: "Free to Take",
    tagline: "Benchmark your engineering competencies with rigorous, mentor-crafted assessments.",
    overview:
      "DevMentor exams are crafted by veteran engineers to test real-world architectural thinking, algorithmic edge cases, and language mastery — not trivia. Earn scorecards that showcase your strengths.",
    steps: [
      {
        step: "01",
        title: "Select an Assessment",
        description:
          "Choose from diverse domains: TypeScript & React Patterns, Distributed Systems, Go Concurrency, PostgreSQL Tuning, and more.",
      },
      {
        step: "02",
        title: "Live Timed Examination",
        description:
          "Complete the exam in our distraction-free exam engine featuring real-time countdown, question navigation, and auto-save.",
      },
      {
        step: "03",
        title: "Instant Scoring & Breakdown",
        description:
          "Get immediate evaluation with percentage score, percentile benchmarks, and detailed question-by-question explanations.",
      },
      {
        step: "04",
        title: "Targeted Growth Roadmaps",
        description:
          "Discover which specific sprints or cohort modules bridge your identified knowledge gaps.",
      },
    ],
    features: [
      "100% free for all registered developers",
      "Scenario-driven questions reflecting production realities",
      "Detailed answer rationales for continuous learning",
      "Track score history and improvement over time in your dashboard",
    ],
    ctaHref: "/exams",
    ctaText: "Take a Practice Exam",
  },
];

const FAQS = [
  {
    q: "How does the DevCredit wallet system work?",
    a: "DevCredits are our transparent platform currency: 1 Credit = 4 BDT. You can top up your wallet anytime via bKash. Credits never expire and there are no recurring subscriptions — you only spend credits when you book a sprint, enroll in a cohort, or request a code review.",
  },
  {
    q: "What happens if a mentor does not claim my sprint request?",
    a: "If no mentor claims your sprint request within your chosen timeframe, or if you decide to cancel before a mentor accepts, all allocated credits are immediately returned to your DevWallet balance in full.",
  },
  {
    q: "Who are the mentors on DevMentor?",
    a: "Every mentor on DevMentor is an industry engineer vetted for real production experience at top tech firms, startups, and open-source ecosystems. Mentors must pass an engineering background check and portfolio review before approving requests.",
  },
  {
    q: "Can I earn money as a mentor on DevMentor?",
    a: "Yes! Qualified engineers can apply via our 'Become a Mentor' application. Once approved, you can claim sprint requests, host group cohorts, and deliver code reviews. Earned credits can be cashed out directly to your bKash account or bank at the standard payout rate.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 pt-10 sm:pt-16 pb-16">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-72 bg-linear-to-br from-amber-light/50 via-amber/10 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-3xl mx-auto text-center">
          <MotionFadeIn direction="down">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border shadow-xs mb-6">
              <Sparkles className="size-3.5 text-amber" />
              <span className="text-xs font-semibold tracking-wider uppercase text-text-secondary">
                The DevMentor Blueprint
              </span>
            </div>
          </MotionFadeIn>

          <MotionFadeIn direction="up" delay={0.1}>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-[1.12] mb-6">
              How Mentorship Works at{" "}
              <span className="text-amber italic font-serif">DevMentor</span>
            </h1>
          </MotionFadeIn>

          <MotionFadeIn direction="up" delay={0.2}>
            <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-8">
              Four flexible modalities designed for modern developers. Whether you need an emergency architecture debug, a multi-week structured cohort, line-by-line PR feedback, or skill validation — we have you covered.
            </p>
          </MotionFadeIn>

          <MotionFadeIn direction="up" delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="#sprints">
                <Button variant="outline" size="sm" className="rounded-full border-border bg-surface hover:bg-surface-raised text-xs">
                  <Timer className="size-3.5 mr-1.5 text-amber" /> 1-on-1 Sprints
                </Button>
              </a>
              <a href="#cohorts">
                <Button variant="outline" size="sm" className="rounded-full border-border bg-surface hover:bg-surface-raised text-xs">
                  <Users className="size-3.5 mr-1.5 text-emerald" /> Group Cohorts
                </Button>
              </a>
              <a href="#code-reviews">
                <Button variant="outline" size="sm" className="rounded-full border-border bg-surface hover:bg-surface-raised text-xs">
                  <Code2 className="size-3.5 mr-1.5 text-terracotta" /> Code Reviews
                </Button>
              </a>
              <a href="#exams">
                <Button variant="outline" size="sm" className="rounded-full border-border bg-surface hover:bg-surface-raised text-xs">
                  <GraduationCap className="size-3.5 mr-1.5 text-text-primary" /> Free Exams
                </Button>
              </a>
            </div>
          </MotionFadeIn>
        </div>
      </section>

      {/* PLATFORM SUMMARY STRIP */}
      <section className="py-8 bg-surface border-y border-border/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">100% Escrow</div>
            <p className="text-xs text-text-muted mt-0.5">Protected satisfaction guarantee</p>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-amber">1 Credit = 4 BDT</div>
            <p className="text-xs text-text-muted mt-0.5">Simple, transparent pricing</p>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">&lt; 24h Review</div>
            <p className="text-xs text-text-muted mt-0.5">Average code review turnaround</p>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald">Verified Only</div>
            <p className="text-xs text-text-muted mt-0.5">Production engineers from top teams</p>
          </div>
        </div>
      </section>

      {/* 4 CORE MODALITIES IN-DEPTH */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-6 lg:px-12 space-y-24">
        {MODALITIES.map((modality, index) => {
          const Icon = modality.icon;
          const isReversed = index % 2 === 1;

          return (
            <div
              key={modality.id}
              id={modality.id}
              className="scroll-mt-28"
            >
              <div className="p-8 sm:p-10 lg:p-12 rounded-3xl bg-surface border border-border shadow-xs hover:border-amber/40 transition-all">
                {/* Header row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-border/60">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-2xl bg-surface-raised flex items-center justify-center text-amber border border-border shadow-2xs">
                        <Icon className="size-6" />
                      </div>
                      <div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${modality.badgeColor}`}>
                          {modality.badge}
                        </span>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mt-1">
                          {modality.title}
                        </h2>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-text-secondary max-w-2xl leading-relaxed pt-2">
                      {modality.tagline}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
                    <div className="text-left lg:text-right">
                      <span className="text-xs text-text-muted block">Typical Investment</span>
                      <span className="font-serif text-lg font-bold text-amber">
                        {modality.pricing}
                      </span>
                    </div>
                    <Link href={modality.ctaHref}>
                      <Button className="rounded-full px-6 text-xs font-semibold shadow-xs gap-1.5">
                        <span>{modality.ctaText}</span>
                        <ArrowRight className="size-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Body: Deep Dive and Step Flow */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8 items-start">
                  {/* Left Column: Context & Feature bullets */}
                  <div className="lg:col-span-5 space-y-6">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                        Overview
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {modality.overview}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-surface-raised border border-border/80">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-3">
                        What&apos;s Included
                      </h4>
                      <ul className="space-y-2.5">
                        {modality.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 text-xs text-text-secondary leading-normal">
                            <CheckCircle2 className="size-4 text-emerald shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column: 4-Step Process Sequence */}
                  <div className="lg:col-span-7">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">
                      How the Process Works
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {modality.steps.map((st) => (
                        <div
                          key={st.step}
                          className="p-5 rounded-2xl bg-background border border-border/70 hover:border-amber/40 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <span className="font-serif text-2xl font-bold text-amber block mb-2">
                              {st.step}
                            </span>
                            <h4 className="font-serif text-sm font-bold text-text-primary mb-1.5">
                              {st.title}
                            </h4>
                            <p className="text-xs text-text-muted leading-relaxed">
                              {st.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* WALLET & ESCROW EXPLAINER */}
      <section className="py-16 bg-surface-raised/80 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber px-3 py-1 rounded-full bg-surface mb-3 border border-border">
              DevWallet Economics
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-3">
              Fair, Transparent &amp; Escrow-Secured
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              We eliminated subscriptions. You only pay for active mentorship that accelerates your career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-2xl bg-surface border border-border shadow-xs">
              <div className="size-11 rounded-xl bg-amber-light text-amber flex items-center justify-center mb-4">
                <CreditCard className="size-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-text-primary mb-2">
                1 Credit = 4 BDT
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Top up your wallet via bKash whenever you need guidance. Credits never expire and carry over across all platform services.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-surface border border-border shadow-xs">
              <div className="size-11 rounded-xl bg-emerald-light text-emerald flex items-center justify-center mb-4">
                <Lock className="size-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-text-primary mb-2">
                Protected Escrow
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                When booking a sprint or code review, credits are held in trust. Mentors receive payment only once sessions or feedback are completed.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-surface border border-border shadow-xs">
              <div className="size-11 rounded-xl bg-terracotta-light text-terracotta flex items-center justify-center mb-4">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-text-primary mb-2">
                Satisfaction Guarantee
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                If an unclaimed sprint expires or a mentor fails to fulfill their commitment, your credits are refunded immediately with zero deduction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 sm:py-20 max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber px-3 py-1 rounded-full bg-surface-raised mb-3 border border-border">
            Got Questions?
          </span>
          <h2 className="font-serif text-3xl font-bold text-text-primary tracking-tight mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-text-muted">
            Everything you need to know about navigating the DevMentor platform.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq) => (
            <div
              key={faq.q}
              className="p-6 rounded-2xl bg-surface border border-border shadow-xs"
            >
              <h3 className="font-serif text-base font-bold text-text-primary mb-2 flex items-center gap-2">
                <HelpCircle className="size-4 text-amber shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="py-16 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="relative rounded-3xl bg-linear-to-r from-amber to-terracotta text-white p-8 sm:p-14 overflow-hidden shadow-xl text-center">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
              Join hundreds of developers getting mentored by experienced engineers. Start with a free skill exam or browse our mentor pool.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link href="/mentors">
                <Button size="lg" className="bg-white text-text-primary hover:bg-surface-raised font-bold rounded-full px-8 shadow-md">
                  Find a Mentor
                </Button>
              </Link>
              <Link href="/apply-mentor">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 text-white hover:bg-white/20 border-white/30 font-bold rounded-full px-8 shadow-md cursor-pointer"
                >
                  Apply as a Mentor
                </Button>
              </Link>
              <SmartAuthButton
                size="lg"
                className="bg-text-primary text-white hover:bg-black font-bold rounded-full px-8 border border-white/20 shadow-md cursor-pointer"
              >
                Create Free Account
              </SmartAuthButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
