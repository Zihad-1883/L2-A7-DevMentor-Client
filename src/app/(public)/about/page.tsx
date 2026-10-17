import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  Users,
  Target,
  ShieldCheck,
  Award,
  ArrowRight,
  TrendingUp,
  Layers,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about DevMentor's mission to empower software engineers with real-world 1-on-1 sprint mentorship, live group cohorts, and production-grade code reviews.",
};

const VALUES = [
  {
    icon: Target,
    title: "Real Engineers, Not AI Placeholders",
    description:
      "We believe true software craftsmanship is passed down from engineers who have built, broken, and scaled real systems in production.",
  },
  {
    icon: ShieldCheck,
    title: "100% Escrow Financial Integrity",
    description:
      "Every credit spent is backed by automated escrow. Credits are never released until you receive and approve your review or session.",
  },
  {
    icon: Award,
    title: "Vetted Senior Leadership",
    description:
      "Our mentors undergo rigorous GitHub audits and background validation. Only verified mid and senior engineers are permitted to mentor.",
  },
  {
    icon: HeartHandshake,
    title: "Pay-As-You-Grow Flexibility",
    description:
      "No predatory monthly subscriptions or locked contracts. Buy DevCredits via bKash and spend only on the exact sessions you need.",
  },
];

const MILESTONES = [
  { year: "2024", title: "DevMentor Founded", desc: "Started as a peer code-review initiative for aspiring full-stack engineers in Bangladesh." },
  { year: "2025", title: "Credit Economy Launch", desc: "Introduced bKash tokenized gateway, escrow guarantees, and structured 1-on-1 sprint mentorship." },
  { year: "2026", title: "Enterprise Cohorts & MCQ Engine", desc: "Scaled to 50+ verified mentors, 1,200+ completed code reviews, and automated assessments." },
];

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-background">
      {/* Hero Header */}
      <section className="relative border-b border-border/80 bg-surface py-16 sm:py-24 overflow-hidden">
        <div className="absolute top-0 right-0 size-96 bg-amber/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-raised border border-border shadow-xs mb-5">
              <span className="size-2 rounded-full bg-amber animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-text-secondary">
                Our Mission &amp; Story
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight mb-6">
              Empowering Developers Through{" "}
              <span className="text-amber italic font-serif">Human Mentorship</span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              DevMentor is an engineering mentorship and code review platform designed to bridge the gap between academic theory and high-scale production systems. We connect aspiring developers directly with experienced engineers for personalized 1-on-1 sprints, live group cohorts, and comprehensive code reviews.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-amber block mb-2">
            What Drives Us
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Our Core Principles
          </h2>
          <p className="text-sm text-text-muted mt-2">
            Every feature on DevMentor is built around transparency, engineering rigor, and student outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((val) => {
            const Icon = val.icon;
            return (
              <div
                key={val.title}
                className="p-6 rounded-2xl border border-border bg-surface hover:border-amber/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="size-12 rounded-xl bg-amber-light text-amber flex items-center justify-center mb-5 border border-amber/20">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-text-primary mb-2.5">
                    {val.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Journey & Milestones */}
      <section className="py-20 bg-surface-raised/40 border-y border-border/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-amber block mb-2">
              Our Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
              From Community Idea to Engineering Platform
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {MILESTONES.map((m, idx) => (
              <div
                key={m.year}
                className="p-7 rounded-2xl border border-border bg-surface shadow-xs relative"
              >
                <span className="font-serif text-3xl font-bold text-amber block mb-2">
                  {m.year}
                </span>
                <h3 className="font-serif text-lg font-bold text-text-primary mb-2">
                  {m.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="rounded-3xl p-10 lg:p-14 bg-linear-to-r from-amber-hover via-amber to-amber-hover text-white text-center shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 text-white">
              Ready to grow with a dedicated mentor?
            </h2>
            <p className="text-sm sm:text-base text-white/90 mb-8 max-w-lg mx-auto">
              Join thousands of developers leveling up their technical skills through 1-on-1 sprints and production code audits.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/mentors">
                <Button size="lg" className="rounded-full bg-text-primary text-surface hover:bg-black font-semibold text-xs px-7">
                  Explore Mentors <ArrowRight className="size-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/apply-mentor">
                <Button size="lg" variant="outline" className="rounded-full border-white/30 text-white bg-white/10 hover:bg-white/20 font-semibold text-xs px-7">
                  Become a Mentor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
