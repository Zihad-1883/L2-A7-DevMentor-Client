import { Suspense } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
} from "lucide-react";
import MentorCard from "@/features/mentor/MentorCard";
import MentorFilters from "@/features/mentor/MentorFilters";
import { Button } from "@/components/ui/button";
import type { MentorProfileItem } from "@/services/mentor.service";

export const metadata = {
  title: "Find a Mentor",
  description:
    "Browse verified senior engineers and technical leaders for 1-on-1 mentorship sprints, code reviews, and career guidance.",
};

async function getMentors(searchParams: {
  search?: string;
  tag?: string;
  experienceLevel?: string;
  offering?: string;
  sortBy?: string;
  page?: string;
}): Promise<{ mentors: MentorProfileItem[]; total: number; page: number; totalPages: number }> {
  const backendUrl =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://dev-mentor-server.vercel.app";

  try {
    const params = new URLSearchParams();
    if (searchParams.tag) params.set("tag", searchParams.tag);
    if (searchParams.experienceLevel) params.set("experienceLevel", searchParams.experienceLevel);
    if (searchParams.search) params.set("search", searchParams.search);
    params.set("limit", "100");

    const res = await fetch(`${backendUrl}/api/v1/mentors?${params.toString()}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return { mentors: [], total: 0, page: 1, totalPages: 1 };
    const json = await res.json();
    let list = (json?.data?.mentors as MentorProfileItem[] | undefined) || [];

    // Filter by Experience Level
    if (searchParams.experienceLevel) {
      list = list.filter((m) => m.experienceLevel === searchParams.experienceLevel);
    }

    // Filter by Technology Tag
    if (searchParams.tag) {
      list = list.filter((m) =>
        m.techStackTags.some((t) => t.toLowerCase() === searchParams.tag?.toLowerCase())
      );
    }

    // Filter by Search Query (Name, Bio, Tag)
    if (searchParams.search) {
      const query = searchParams.search.toLowerCase();
      list = list.filter((m) => {
        const matchesName = m.user?.name?.toLowerCase().includes(query);
        const matchesBio = m.bio?.toLowerCase().includes(query);
        const matchesTag = m.techStackTags.some((t) => t.toLowerCase().includes(query));
        return matchesName || matchesBio || matchesTag;
      });
    }

    // Filter 3: Offering / Availability
    if (searchParams.offering === "sprint") {
      list = list.filter((m) => m.approvalStatus === "APPROVED");
    }

    // Sorting
    const sortBy = searchParams.sortBy || "newest";
    if (sortBy === "seniority") {
      const rank: Record<string, number> = { LEAD: 4, SENIOR: 3, MID: 2, JUNIOR: 1 };
      list.sort((a, b) => (rank[b.experienceLevel] || 0) - (rank[a.experienceLevel] || 0));
    } else if (sortBy === "name_asc") {
      list.sort((a, b) => (a.user?.name || "").localeCompare(b.user?.name || ""));
    }

    // Client-side pagination (8 per page for clean 2 rows of 4 columns)
    const page = Math.max(1, parseInt(searchParams.page || "1", 10));
    const pageSize = 8;
    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const paginated = list.slice((page - 1) * pageSize, page * pageSize);

    return { mentors: paginated, total, page, totalPages };
  } catch {
    return { mentors: [], total: 0, page: 1, totalPages: 1 };
  }
}

export default async function MentorsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    tag?: string;
    experienceLevel?: string;
    offering?: string;
    sortBy?: string;
    page?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const { mentors, total, page, totalPages } = await getMentors(resolvedParams);

  const buildPageUrl = (newPage: number) => {
    const p = new URLSearchParams();
    if (resolvedParams.search) p.set("search", resolvedParams.search);
    if (resolvedParams.tag) p.set("tag", resolvedParams.tag);
    if (resolvedParams.experienceLevel) p.set("experienceLevel", resolvedParams.experienceLevel);
    if (resolvedParams.offering) p.set("offering", resolvedParams.offering);
    if (resolvedParams.sortBy) p.set("sortBy", resolvedParams.sortBy);
    p.set("page", String(newPage));
    return `/mentors?${p.toString()}`;
  };

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header section */}
      <section className="border-b border-border/80 bg-surface py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-raised border border-border shadow-xs mb-4">
              <span className="size-2 rounded-full bg-amber animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-text-secondary">
                Verified Engineering Mentors
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h1 className="font-serif text-3xl sm:text-5xl font-bold text-text-primary tracking-tight mb-3">
                  Find Your Engineering Mentor
                </h1>
                <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                  Connect with senior engineers from top companies for intensive 1-on-1 sprint coaching, async code reviews, and architectural deep dives.
                </p>
              </div>
              <Link href="/apply-mentor" className="shrink-0">
                <Button
                  variant="outline"
                  className="border-amber/40 text-amber hover:bg-amber-light font-semibold text-xs rounded-xl h-11 px-5 shadow-xs cursor-pointer gap-2"
                >
                  <Sparkles className="size-3.5" />
                  <span>Apply as Mentor</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Directory & Filter Grid */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <Suspense fallback={<div className="h-28 bg-surface rounded-2xl animate-pulse mb-8" />}>
          <MentorFilters totalCount={total} />
        </Suspense>

        {mentors.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-3xl bg-surface border border-dashed border-border">
            <div className="size-14 rounded-2xl bg-amber-light text-amber mx-auto flex items-center justify-center mb-4">
              <Users className="size-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-text-primary mb-2">
              No Mentors Match Your Search
            </h3>
            <p className="text-sm text-text-muted max-w-md mx-auto mb-6">
              Try adjusting your search terms or clearing technology and experience level filters to see more mentors.
            </p>
            <Link href="/mentors">
              <Button variant="outline" size="sm" className="border-border">
                Clear Filters
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Strict 4-Column Desktop Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {mentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-6 border-t border-border/60">
                <Link href={buildPageUrl(page - 1)} className={page <= 1 ? "pointer-events-none opacity-40" : ""}>
                  <Button variant="outline" size="sm" disabled={page <= 1} className="text-xs font-semibold">
                    Previous
                  </Button>
                </Link>

                <span className="text-xs font-medium text-text-muted px-2">
                  Page <strong className="text-text-primary">{page}</strong> of <strong>{totalPages}</strong>
                </span>

                <Link href={buildPageUrl(page + 1)} className={page >= totalPages ? "pointer-events-none opacity-40" : ""}>
                  <Button variant="outline" size="sm" disabled={page >= totalPages} className="text-xs font-semibold">
                    Next
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
