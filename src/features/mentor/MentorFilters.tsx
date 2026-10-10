"use client";

import * as React from "react";
import { Search, X, Filter, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { useDebounce } from "@/hooks/useDebounce";

const POPULAR_TAGS = [
  "All",
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "PostgreSQL",
  "Go",
  "Kubernetes",
  "TailwindCSS",
  "Prisma",
  "Python",
];

const EXPERIENCE_LEVELS = [
  { label: "All Levels", value: "" },
  { label: "Junior", value: "JUNIOR" },
  { label: "Mid-Level", value: "MID" },
  { label: "Senior", value: "SENIOR" },
];

interface MentorFiltersProps {
  totalCount?: number;
}

export default function MentorFilters({ totalCount }: MentorFiltersProps) {
  const { getParam, setParam, setMultipleParams, clearAllFilters } = useUrlFilters();

  const currentSearch = getParam("search", "");
  const currentTag = getParam("tag", "");
  const currentLevel = getParam("experienceLevel", "");

  const [localSearch, setLocalSearch] = React.useState(currentSearch);
  const [prevSearch, setPrevSearch] = React.useState(currentSearch);
  const debouncedSearch = useDebounce(localSearch, 300);

  // Sync external URL search param changes during render
  if (prevSearch !== currentSearch) {
    setPrevSearch(currentSearch);
    setLocalSearch(currentSearch);
  }

  // Sync debounced user typing to URL
  React.useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      setParam("search", debouncedSearch);
    }
  }, [debouncedSearch, currentSearch, setParam]);

  const hasActiveFilters = Boolean(currentSearch || currentTag || currentLevel);

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-6 mb-8">
      {/* Search Input & Active Count */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search mentors by name, bio, or domain expertise..."
            className="w-full h-11 pl-10 pr-9 rounded-xl border border-border bg-surface-raised/50 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch("");
                setParam("search", "");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5 rounded cursor-pointer"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3">
          {totalCount !== undefined && (
            <span className="text-xs text-text-muted font-medium">
              Showing <strong className="text-text-primary">{totalCount}</strong> verified mentors
            </span>
          )}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-orange hover:bg-orange/10 gap-1.5 h-9"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset Filters</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tech Stack Pills Filter */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted block">
          Filter by Technology
        </span>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TAGS.map((tag) => {
            const isSelected =
              tag === "All" ? !currentTag : currentTag.toLowerCase() === tag.toLowerCase();

            return (
              <button
                key={tag}
                type="button"
                onClick={() => setParam("tag", tag === "All" ? "" : tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${isSelected
                    ? "bg-amber text-white shadow-xs font-semibold"
                    : "bg-surface-raised text-text-secondary hover:text-text-primary hover:bg-border/60 border border-border/80"
                  }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Experience Level Badges Filter */}
      <div className="pt-4 border-t border-border/60 flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted mr-2">
          Experience Level:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {EXPERIENCE_LEVELS.map((lvl) => {
            const isSelected = currentLevel === lvl.value;
            return (
              <button
                key={lvl.value}
                type="button"
                onClick={() => setParam("experienceLevel", lvl.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${isSelected
                    ? "bg-text-primary text-surface border-text-primary font-semibold shadow-xs"
                    : "bg-surface text-text-muted border-border hover:border-text-muted hover:text-text-primary"
                  }`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
