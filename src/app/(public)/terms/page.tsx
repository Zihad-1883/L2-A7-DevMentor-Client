import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Official Terms of Service, credit escrow rules, and usage policies for DevMentor.",
};

export default function TermsPage() {
  return (
    <div className="w-full min-h-screen bg-background py-16 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto bg-surface rounded-3xl border border-border p-8 sm:p-12 shadow-xs">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-amber transition-colors mb-6">
          <ArrowLeft className="size-3.5" /> Back to Home
        </Link>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary mb-3">
          Terms of Service &amp; Escrow Agreement
        </h1>
        <p className="text-xs text-text-muted mb-8 pb-6 border-b border-border/80">
          Last updated: October 2026 · Effective across all students, mentors, and administrators.
        </p>

        <div className="space-y-8 text-sm text-text-secondary leading-relaxed">
          <section>
            <h2 className="font-serif text-xl font-bold text-text-primary mb-2.5">
              1. Platform Nature &amp; Role Definitions
            </h2>
            <p>
              DevMentor operates an escrow-managed marketplace connecting independent verified engineering mentors with students seeking 1-on-1 sprint mentorship, cohort education, and asynchronous code review services. DevMentor does not act as an employer of mentors.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-text-primary mb-2.5">
              2. DevCredit Economics &amp; Escrow Guarantee
            </h2>
            <p>
              All transactions on the platform are denominated in DevCredits (fixed conversion rate: 1 Credit = 4 BDT). Credits purchased via bKash are non-transferable outside the platform. When booking a 1-on-1 sprint session or requesting a code review, credits are placed into automated escrow. Escrowed credits are only transferred to the mentor once the service has been confirmed or approved by the student.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-text-primary mb-2.5">
              3. Cancellation &amp; Refund Cutoff Policy
            </h2>
            <p>
              Students may cancel a scheduled sprint session up to <strong>1 hour before</strong> the agreed session start time for an immediate 100% credit refund to their wallet. Cancellations requested less than 1 hour prior to scheduled start time are non-refundable to protect mentor calendar reservations.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-text-primary mb-2.5">
              4. Code Review SLAs &amp; Quality Standards
            </h2>
            <p>
              Mentors claiming code review tickets commit to delivering comprehensive feedback, refactored code snippets, and severity comments within the tier SLA (+2 hours for QUICK reviews, +24 hours for DEEP reviews). If an SLA expires without delivery, the ticket returns to the open pool.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-text-primary mb-2.5">
              5. Mentor Payouts &amp; Cash-Outs
            </h2>
            <p>
              Approved mentors may request withdrawal of their earned credits to their verified bKash accounts (minimum withdrawal: 50 credits). Payout requests are verified by administrators and disbursed within 24 to 48 business hours.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
