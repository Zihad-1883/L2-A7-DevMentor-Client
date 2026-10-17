import { Star, Quote, CheckCircle2 } from "lucide-react";

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarText: string;
  avatarBg: string;
  rating: number;
  quote: string;
  programType: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "1",
    name: "Tanzim Hasan",
    role: "Full-Stack Engineer",
    company: "Shopify Partner",
    avatarText: "TH",
    avatarBg: "bg-amber-light text-amber border-amber/30",
    rating: 5,
    quote:
      "The 1-on-1 Sprint Mentorship was a game-changer. My mentor conducted live pair-debugging sessions and showed me how to structure enterprise Prisma transactions with zero race conditions.",
    programType: "Sprint Mentorship Graduate",
  },
  {
    id: "2",
    name: "Sadia Rahman",
    role: "Frontend Developer",
    company: "Fintech Startup",
    avatarText: "SR",
    avatarBg: "bg-emerald-light text-emerald border-emerald/30",
    rating: 5,
    quote:
      "I submitted my entire Next.js portfolio PR for a DEEP code review. Within 12 hours, the mentor provided line-by-line security suggestions, memoization fixes, and refactored my custom hooks. Worth every credit!",
    programType: "Deep Code Review Client",
  },
  {
    id: "3",
    name: "Mahmudul Karim",
    role: "Backend Specialist",
    company: "Cloud Scale Labs",
    avatarText: "MK",
    avatarBg: "bg-terracotta-light text-terracotta border-terracotta/30",
    rating: 5,
    quote:
      "The Cohort Program gave me a structured 6-week curriculum with Google Meet workshops, code snippets, and direct mentor Q&A. The credit-per-session model gave me 100% financial flexibility.",
    programType: "System Design Cohort Graduate",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-surface-raised/40 border-y border-border/80 w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-light border border-amber/20 text-amber text-xs font-bold uppercase tracking-wider mb-3">
            <Quote className="size-3.5 fill-amber" />
            <span>Success Stories</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
            Engineers Advancing Their Careers
          </h2>
          <p className="text-base text-text-muted mt-3">
            Real outcomes from students who booked sprints, enrolled in cohorts, and leveled up their code quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-7 rounded-2xl border border-border bg-surface shadow-xs flex flex-col justify-between hover:border-amber/40 hover:shadow-md transition-all"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-amber mb-5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-amber" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-text-secondary leading-relaxed italic mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-5 border-t border-border/60">
                <div className="flex items-center gap-3">
                  <div
                    className={`size-11 rounded-full font-serif font-bold text-sm flex items-center justify-center border shrink-0 ${t.avatarBg}`}
                  >
                    {t.avatarText}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif text-sm font-bold text-text-primary truncate">
                      {t.name}
                    </h4>
                    <p className="text-xs text-text-muted truncate">
                      {t.role} • <span className="font-semibold text-text-secondary">{t.company}</span>
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald mt-1">
                      <CheckCircle2 className="size-3" />
                      {t.programType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
