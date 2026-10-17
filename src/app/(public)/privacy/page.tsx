import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "DevMentor privacy policy, data handling, and security protections.",
};

export default function PrivacyPage() {
  return (
    <div className="w-full min-h-screen bg-background py-16 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto bg-surface rounded-3xl border border-border p-8 sm:p-12 shadow-xs">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-amber transition-colors mb-6">
          <ArrowLeft className="size-3.5" /> Back to Home
        </Link>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary mb-3">
          Privacy &amp; Data Protection Policy
        </h1>
        <p className="text-xs text-text-muted mb-8 pb-6 border-b border-border/80">
          Last updated: October 2026 · Committed to data privacy and account safety.
        </p>

        <div className="space-y-8 text-sm text-text-secondary leading-relaxed">
          <section>
            <h2 className="font-serif text-xl font-bold text-text-primary mb-2.5">
              1. Information We Collect
            </h2>
            <p>
              We collect user account credentials (name, email address, avatar image via OAuth), mentor professional backgrounds (bio, tech stacks, GitHub portfolio links, resume documents), and transaction audit logs for credits purchased or withdrawn via bKash.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-text-primary mb-2.5">
              2. How We Protect Your Code Submissions
            </h2>
            <p>
              Code snippets, repository links, and PR branches submitted for code review remain strictly confidential. They are made accessible exclusively to the previewing and assigned mentor for the explicit purpose of conducting the review. DevMentor does not sell or distribute user code to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-text-primary mb-2.5">
              3. Payment Security &amp; Tokenization
            </h2>
            <p>
              Financial transactions are processed via the secure bKash Tokenized Checkout API. DevMentor never stores full payment pin codes or sensitive financial credentials on its servers. All payments generate encrypted transaction references and in-memory PDF receipts.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-text-primary mb-2.5">
              4. Data Retention &amp; User Rights
            </h2>
            <p>
              Users may update their personal details at any time from their profile settings or request full data deletion by contacting our privacy compliance desk at <a href="mailto:privacy@devmentor.com" className="text-amber underline">privacy@devmentor.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
