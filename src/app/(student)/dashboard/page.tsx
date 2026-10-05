import Link from "next/link";
import {
  Timer,
  Users,
  Code2,
  Wallet,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-light text-amber text-xs font-bold uppercase tracking-wider mb-3 border border-amber/20">
          <Sparkles className="size-3.5" /> Student Workspace
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
          Student Dashboard
        </h1>
        <p className="text-sm sm:text-base text-text-secondary mt-1">
          Track your sprint requests, enrolled cohorts, and code review feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs hover:border-amber/50 transition-all">
          <div className="size-11 rounded-xl bg-amber-light text-amber flex items-center justify-center mb-4">
            <Timer className="size-5" />
          </div>
          <h2 className="font-serif text-lg font-bold text-text-primary mb-1">
            My Sprints
          </h2>
          <p className="text-xs text-text-secondary mb-4 leading-relaxed">
            Submit a new 1-on-1 sprint request or check status of active sprints.
          </p>
          <Link href="/dashboard/sprints/new">
            <Button size="sm" className="bg-amber text-white hover:bg-amber-hover text-xs">
              New Sprint <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs hover:border-amber/50 transition-all">
          <div className="size-11 rounded-xl bg-amber-light text-amber flex items-center justify-center mb-4">
            <Users className="size-5" />
          </div>
          <h2 className="font-serif text-lg font-bold text-text-primary mb-1">
            Enrolled Cohorts
          </h2>
          <p className="text-xs text-text-secondary mb-4 leading-relaxed">
            Access your cohort syllabus, scheduled live sessions, and materials.
          </p>
          <Link href="/dashboard/cohorts">
            <Button size="sm" variant="outline" className="border-border text-xs">
              Browse Cohorts <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs hover:border-amber/50 transition-all">
          <div className="size-11 rounded-xl bg-amber-light text-amber flex items-center justify-center mb-4">
            <Wallet className="size-5" />
          </div>
          <h2 className="font-serif text-lg font-bold text-text-primary mb-1">
            DevWallet
          </h2>
          <p className="text-xs text-text-secondary mb-4 leading-relaxed">
            Top up credits via bKash to unlock sprints, cohorts, and deep reviews.
          </p>
          <Link href="/dashboard/wallet">
            <Button size="sm" variant="outline" className="border-border text-xs">
              Manage Wallet <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
