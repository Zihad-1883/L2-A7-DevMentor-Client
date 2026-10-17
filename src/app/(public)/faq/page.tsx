import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, ArrowRight, ShieldCheck, Coins, BookOpen, Code2, Users } from "lucide-react";
import FaqSection from "@/features/landing/FaqSection";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Help & FAQ Knowledge Base",
  description:
    "Comprehensive guides and answers to frequently asked questions about DevCredits, escrow protection, 1-on-1 sprint mentorship, cohorts, and code reviews.",
};

const TOPICS = [
  {
    icon: Coins,
    title: "DevCredits & Payments",
    desc: "1 Credit = 4 BDT fixed conversion, bKash checkout, and automated PDF receipts.",
  },
  {
    icon: ShieldCheck,
    title: "Escrow & Refunds",
    desc: "Automated escrow protection and 1-hour cancellation refund policy.",
  },
  {
    icon: Code2,
    title: "Code Reviews",
    desc: "QUICK (10 Cr, 2h SLA) vs DEEP (50 Cr, 24h SLA) turnaround standards.",
  },
  {
    icon: Users,
    title: "Sprints & Cohorts",
    desc: "Scheduling 1-on-1 meetings, calendar conflict guards, and group workshop access.",
  },
];

export default function FaqPage() {
  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border/80 bg-surface py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-raised border border-border shadow-xs mb-4">
              <span className="size-2 rounded-full bg-amber animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-text-secondary">
                Knowledge Base &amp; FAQ
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-text-primary tracking-tight mb-3">
              Help Center &amp; Documentation
            </h1>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              Find answers to platform mechanics, credit economics, session reschedule cutoffs, and mentor verification requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Topic Grid */}
      <section className="py-12 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {TOPICS.map((topic) => {
            const Icon = topic.icon;
            return (
              <div
                key={topic.title}
                className="p-6 rounded-2xl border border-border bg-surface shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="size-11 rounded-xl bg-amber-light text-amber flex items-center justify-center mb-4 border border-amber/20">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-text-primary mb-1.5">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {topic.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Accordion FAQ Component */}
      <div className="border-t border-border/60">
        <FaqSection />
      </div>

      {/* Still need help CTA */}
      <section className="py-16 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div className="p-8 rounded-3xl border border-border bg-surface-raised flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h3 className="font-serif text-xl font-bold text-text-primary">
              Still have questions or need custom assistance?
            </h3>
            <p className="text-xs text-text-muted mt-1">
              Our engineering support team is online Saturday through Thursday to assist you.
            </p>
          </div>

          <Link href="/contact" className="shrink-0">
            <Button size="sm" className="bg-amber text-white hover:bg-amber-hover font-semibold text-xs px-5 h-10 shadow-xs">
              Contact Support <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
