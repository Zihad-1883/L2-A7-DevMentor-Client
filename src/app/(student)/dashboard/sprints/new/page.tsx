import Link from "next/link";
import { ArrowLeft, Rocket, Sparkles, ShieldCheck, HelpCircle } from "lucide-react";
import SprintRequestForm from "@/features/sprint/SprintRequestForm";

export const metadata = {
  title: "Book 1-on-1 Mentorship Sprint",
  description:
    "Request custom 1-on-1 technical sprints with verified senior engineering mentors. Set problem scopes, pick session cadences, and solve engineering challenges faster.",
};

export default function NewSprintPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Breadcrumb & Introduction */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <Link
            href="/dashboard/sprints"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-amber transition-colors mb-2"
          >
            <ArrowLeft className="size-3.5" /> Back to My Sprints
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20">
              <Sparkles className="size-3.5" /> 1-on-1 Mentorship
            </span>
            <span className="text-xs text-text-muted hidden sm:inline">•</span>
            <span className="text-xs text-text-muted hidden sm:inline flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-emerald" /> Escrow Milestone Protected
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mt-1.5">
            Create 1-on-1 Mentorship Sprint
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
            Specify your technical roadblock, target architecture, or stack challenges. Matched senior mentors will review your issue and schedule dedicated deep-dive sessions.
          </p>
        </div>

        {/* How it works info badge */}
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-2xs max-w-xs shrink-0 hidden lg:block">
          <div className="flex items-center gap-2 text-xs font-bold text-text-primary mb-1">
            <HelpCircle className="size-4 text-amber" />
            <span>How Sprints Work</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Your request enters the open mentor pool. A verified mentor claims it, confirms session times, and collaborates live via Google Meet or Zoom.
          </p>
        </div>
      </div>

      {/* Main Form Body */}
      <SprintRequestForm />
    </div>
  );
}
