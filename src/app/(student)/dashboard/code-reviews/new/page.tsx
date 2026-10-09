import Link from "next/link";
import { ArrowLeft, Code2, Sparkles, ShieldCheck, HelpCircle } from "lucide-react";
import CodeReviewRequestForm from "@/features/code-review/CodeReviewRequestForm";

export const metadata = {
  title: "Request Code Review",
  description:
    "Submit code snippets or GitHub pull requests for thorough inline code review, architecture feedback, and video walkthroughs from senior mentors.",
};

export default function NewCodeReviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header Breadcrumb & Introduction */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <Link
            href="/dashboard/code-reviews"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-amber transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="size-3.5" /> Back to My Code Reviews
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20">
              <Sparkles className="size-3.5" /> Peer Engineering Review
            </span>
            <span className="text-xs text-text-muted hidden sm:inline">•</span>
            <span className="text-xs text-text-muted hidden sm:inline flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-emerald" /> Escrow Milestone Protected
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mt-1.5">
            Submit Code Review Request
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
            Get targeted feedback from verified senior mentors. Choose between Quick single-file reviews or Deep architectural PR audits.
          </p>
        </div>

        {/* How Reviews Work Info Card */}
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-2xs max-w-xs shrink-0 hidden lg:block">
          <div className="flex items-center gap-2 text-xs font-bold text-text-primary mb-1">
            <HelpCircle className="size-4 text-amber" />
            <span>How Code Reviews Work</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Mentors preview your code, lock and claim the review ticket, deliver inline code annotations, and provide refactored code diffs before credits are released.
          </p>
        </div>
      </div>

      {/* Main Request Form */}
      <CodeReviewRequestForm />
    </div>
  );
}
