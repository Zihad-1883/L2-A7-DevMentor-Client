"use client";

import * as React from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "How does the DevCredit prepaid wallet system work?",
    answer:
      "DevCredits are our universal platform currency. 1 Credit equals 4 BDT. You can top up your wallet via bKash Tokenized Checkout with zero subscription commitments. Credits never expire and are only deducted when you confirm a sprint session, enroll in a cohort workshop, or submit code for review.",
  },
  {
    id: "faq-2",
    question: "What happens to my credits if a mentor cancels or misses a session?",
    answer:
      "All session credits are held securely in escrow. If a mentor cancels or if you cancel at least 1 hour prior to the scheduled session start time, 100% of your credits are automatically refunded back to your spendable wallet immediately.",
  },
  {
    id: "faq-3",
    question: "What is the difference between QUICK and DEEP Code Reviews?",
    answer:
      "A QUICK review costs 10 Credits (40 BDT) and comes with a 2-Hour SLA turnaround—ideal for single scripts, bug diagnoses, or concise PRs under 150 lines. A DEEP review costs 50 Credits (200 BDT) with a 24-Hour SLA, providing comprehensive architectural audits, security checks, and line-by-line refactored snippets.",
  },
  {
    id: "faq-4",
    question: "How are mentors vetted before being approved?",
    answer:
      "Every mentor submits an application detailing their experience, tech stacks, GitHub portfolio, and resume. Our Admin team manually audits their past contributions, verifies code quality, and reviews applications before approving them to the mentor role.",
  },
  {
    id: "faq-5",
    question: "Can I take MCQ practice exams without paying any credits?",
    answer:
      "Yes! All MCQ skill assessment exams created by verified mentors are 100% free for all students. You can attempt them as many times as you want, review automated explanations, and your highest score is saved to your profile.",
  },
  {
    id: "faq-6",
    question: "How do mentors withdraw their earned credits into cash?",
    answer:
      "Mentors receive 100% of code review fees and the designated session payouts from cohorts and sprints. Mentors can navigate to their Earnings dashboard and request direct BDT withdrawals to their bKash account at the standard conversion rate (minimum 50 credits).",
  },
];

export default function FaqSection() {
  const [openId, setOpenId] = React.useState<string | null>("faq-1");

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-20 lg:py-28 max-w-4xl mx-auto px-6 lg:px-8 w-full">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-raised border border-border text-amber text-xs font-bold uppercase tracking-wider mb-3">
          <HelpCircle className="size-3.5" />
          <span>Got Questions?</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-base text-text-muted mt-3">
          Everything you need to know about DevCredits, mentor matching, and our escrow satisfaction guarantee.
        </p>
      </div>

      <div className="space-y-3.5">
        {FAQS.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all ${
                isOpen
                  ? "border-amber/50 bg-surface shadow-xs"
                  : "border-border bg-surface hover:border-border-strong hover:bg-surface-raised/40"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(faq.id)}
                aria-expanded={isOpen}
                className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-hidden"
              >
                <span className="font-serif text-base sm:text-lg font-bold text-text-primary">
                  {faq.question}
                </span>
                <div
                  className={`size-8 rounded-full border border-border flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 bg-amber-light text-amber border-amber/30" : "text-text-muted"
                  }`}
                >
                  <ChevronDown className="size-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-sm text-text-secondary leading-relaxed border-t border-border/40 animate-in fade-in-0 duration-150">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
