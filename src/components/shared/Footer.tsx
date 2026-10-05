import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-border">          <div className="lg:col-span-1 space-y-4">
          <Link href="/" className="inline-block">
            <span className="font-serif text-2xl text-text-primary tracking-tight font-bold">
              DevMentor<span className="text-amber font-serif">.</span>
            </span>
          </Link>
          <p className="text-sm text-text-muted leading-relaxed">
            Engineering mentorship through structured 1-on-1 sprints, mentor-led group cohorts, and code reviews.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-border text-xs text-text-muted">
            <span className="size-2 rounded-full bg-emerald"></span>
            <span>100% bKash & Escrow Secured</span>
          </div>
        </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">Programs</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cohorts" className="text-text-muted hover:text-text-primary transition-colors">
                  Group Cohorts
                </Link>
              </li>
              <li>
                <Link href="/dashboard/code-reviews" className="text-text-muted hover:text-text-primary transition-colors">
                  Code Reviews
                </Link>
              </li>
              <li>
                <Link href="/mentors" className="text-text-muted hover:text-text-primary transition-colors">
                  Mentor Pool
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">Learn</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/exams" className="text-text-muted hover:text-text-primary transition-colors">
                  Free Skill Exams
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-text-muted hover:text-text-primary transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">Mentors</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/mentor/apply" className="text-text-muted hover:text-text-primary transition-colors">
                  Become a Mentor
                </Link>
              </li>
              <li>
                <Link href="/mentor" className="text-text-muted hover:text-text-primary transition-colors">
                  Mentor Workspace
                </Link>
              </li>
              <li>
                <Link href="/mentor/earnings" className="text-text-muted hover:text-text-primary transition-colors">
                  Earnings & Cash-out
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/how-it-works" className="text-text-muted hover:text-text-primary transition-colors">
                  About DevMentor
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-text-muted hover:text-text-primary transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-text-muted hover:text-text-primary transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© 2026 DevMentor. Built by a developer, for developers.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-text-primary transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
