"use client";

import * as React from "react";
import { Search, X, RotateCcw, ArrowUpDown, Zap } from "lucide-react";
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
  "Docker",
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

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Experience: Senior to Junior", value: "seniority" },
  { label: "Name (A - Z)", value: "name_asc" },
];

interface MentorFiltersProps {
  totalCount?: number;
}

export default function MentorFilters({ totalCount }: MentorFiltersProps) {
  const { getParam, setParam, setMultipleParams, clearAllFilters } = useUrlFilters();

  const currentSearch = getParam("search", "");
  const currentTag = getParam("tag", "");
  const currentLevel = getParam("experienceLevel", "");
  const currentOffering = getParam("offering", "");
  const currentSort = getParam("sortBy", "newest");

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

  const hasActiveFilters = Boolean(
    currentSearch || currentTag || currentLevel || currentOffering || (currentSort && currentSort !== "newest")
  );

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-5 mb-8">
      {/* Row 1: Search Input & Sorting Dropdown */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar */}
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

        {/* Sorting Dropdown & Counter */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-3">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="size-3.5 text-text-muted" />
            <select
              value={currentSort}
              onChange={(e) => setParam("sortBy", e.target.value)}
              className="h-10 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-semibold text-text-primary focus:outline-none focus:border-amber cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-orange hover:bg-orange/10 gap-1.5 h-10 px-3"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Row 2: Filter 1 - Technology / Tech Stack Tag */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted block">
          Filter by Technology:
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
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
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

      {/* Row 3: Filter 2 (Experience Level) + Filter 3 (Offering / Availability) */}
      <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter 2: Experience Level */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted mr-1">
            Experience:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {EXPERIENCE_LEVELS.map((lvl) => {
              const isSelected = currentLevel === lvl.value;
              return (
                <button
                  key={lvl.value}
                  type="button"
                  onClick={() => setParam("experienceLevel", lvl.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    isSelected
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

        {/* Filter 3: Offering / Availability Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted mr-1">
            Offering:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setParam("offering", currentOffering === "sprint" ? "" : "sprint")}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer inline-flex items-center gap-1 ${
                currentOffering === "sprint"
                  ? "bg-amber text-white border-amber font-semibold"
                  : "bg-surface text-text-muted border-border hover:border-text-muted"
              }`}
            >
              <Zap className="size-3" />
              1-on-1 Sprints
            </button>
            <button
              type="button"
              onClick={() => setParam("offering", currentOffering === "cohort" ? "" : "cohort")}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                currentOffering === "cohort"
                  ? "bg-emerald text-white border-emerald font-semibold"
                  : "bg-surface text-text-muted border-border hover:border-text-muted"
              }`}
            >
              Group Cohorts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
