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
}): Promise<MentorProfileItem[]> {
  const backendUrl =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://dev-mentor-server.vercel.app";

  try {
    const params = new URLSearchParams();
    if (searchParams.tag) params.set("tag", searchParams.tag);
    if (searchParams.experienceLevel) params.set("experienceLevel", searchParams.experienceLevel);
    if (searchParams.search) params.set("search", searchParams.search);
    params.set("limit", "50");

    const res = await fetch(`${backendUrl}/api/v1/mentors?${params.toString()}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];
    const json = await res.json();
    const list = (json?.data?.mentors as MentorProfileItem[] | undefined) || [];

    return list.filter((m) => {
      if (searchParams.experienceLevel && m.experienceLevel !== searchParams.experienceLevel) {
        return false;
      }
      if (searchParams.tag) {
        const hasTag = m.techStackTags.some(
          (t) => t.toLowerCase() === searchParams.tag?.toLowerCase()
        );
        if (!hasTag) return false;
      }
      if (searchParams.search) {
        const query = searchParams.search.toLowerCase();
        const matchesName = m.user?.name?.toLowerCase().includes(query);
        const matchesBio = m.bio?.toLowerCase().includes(query);
        const matchesTag = m.techStackTags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesBio && !matchesTag) return false;
      }
      return true;
    });
  } catch {
    return [];
  }
}

export default async function MentorsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    tag?: string;
    experienceLevel?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const mentors = await getMentors(resolvedParams);

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
          <MentorFilters totalCount={mentors.length} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
