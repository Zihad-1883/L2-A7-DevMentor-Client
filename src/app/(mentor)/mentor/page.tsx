import Link from "next/link";
import {
  Timer,
  Users,
  Code2,
  DollarSign,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MentorDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-light text-amber text-xs font-bold uppercase tracking-wider mb-3 border border-amber/20">
          <Sparkles className="size-3.5" /> Mentor Workspace
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
          Mentor Overview
        </h1>
        <p className="text-sm sm:text-base text-text-secondary mt-1">
          Browse open student sprint requests, manage your cohorts, and review submitted code.
        </p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs hover:border-amber/50 transition-all">
          <div className="size-11 rounded-xl bg-amber-light text-amber flex items-center justify-center mb-4">
            <Timer className="size-5" />
          </div>
          <h2 className="font-serif text-lg font-bold text-text-primary mb-1">
            Open Sprint Pool
          </h2>
          <p className="text-xs text-text-secondary mb-4 leading-relaxed">
            Browse and claim 1-on-1 sprint requests submitted by developers.
          </p>
          <Link href="/mentor/sprints">
            <Button size="sm" className="bg-amber text-white hover:bg-amber-hover text-xs">
              View Sprints <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs hover:border-amber/50 transition-all">
          <div className="size-11 rounded-xl bg-amber-light text-amber flex items-center justify-center mb-4">
            <Users className="size-5" />
          </div>
          <h2 className="font-serif text-lg font-bold text-text-primary mb-1">
            My Cohorts
          </h2>
          <p className="text-xs text-text-secondary mb-4 leading-relaxed">
            Manage your group curriculum, schedule live sessions, and track enrollments.
          </p>
          <Link href="/mentor/cohorts">
            <Button size="sm" variant="outline" className="border-border text-xs">
              Manage Cohorts <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs hover:border-amber/50 transition-all">
          <div className="size-11 rounded-xl bg-amber-light text-amber flex items-center justify-center mb-4">
            <DollarSign className="size-5" />
          </div>
          <h2 className="font-serif text-lg font-bold text-text-primary mb-1">
            Earnings &amp; Payouts
          </h2>
          <p className="text-xs text-text-secondary mb-4 leading-relaxed">
            Track earned DevCredits from completed sprints, cohorts, and reviews.
          </p>
          <Link href="/mentor/earnings">
            <Button size="sm" variant="outline" className="border-border text-xs">
              View Earnings <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
