"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Code2,
  Plus,
  Search,
  Filter,
  Layers,
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import SkeletonCard from "@/components/shared/SkeletonCard";
import ReviewRequestCard from "@/features/code-review/ReviewRequestCard";
import { codeReviewService } from "@/services/code-review.service";
import { queryKeys } from "@/lib/query-keys";
import type { CodeReviewStatus } from "@/types/code-review.types";

const STATUS_TABS: Array<{ label: string; value: string }> = [
  { label: "All Requests", value: "ALL" },
  { label: "Open in Pool", value: "OPEN" },
  { label: "In Review", value: "CLAIMED" },
  { label: "Feedback Ready", value: "DELIVERED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function StudentCodeReviewsPage() {
  const [selectedStatus, setSelectedStatus] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = React.useState<string>("");

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.codeReviews.myRequests({
      status: selectedStatus === "ALL" ? undefined : selectedStatus,
      search: debouncedSearch || undefined,
    }),
    queryFn: () =>
      codeReviewService.getMyRequests({
        status: selectedStatus === "ALL" ? undefined : selectedStatus,
        search: debouncedSearch || undefined,
        limit: 50,
      }),
  });

  const requests = data?.requests || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="My Code Reviews"
        description="Track your submitted code review requests, inspect mentor feedback, and release escrow credits."
        actions={
          <Link href="/dashboard/code-reviews/new">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-xs">
              <Plus className="w-4 h-4 mr-1.5" />
              Request New Review
            </Button>
          </Link>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200/80 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by title, description, file..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-stone-900 placeholder:text-stone-400"
          />
        </div>

        {/* Status Filter Tabs (Scrollable on small screens) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {STATUS_TABS.map((tab) => {
            const isActive = selectedStatus === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setSelectedStatus(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-stone-900 text-white shadow-2xs"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Requests Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-red-50 rounded-xl border border-red-200 text-red-800">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="font-semibold text-sm">Failed to load code review requests</p>
          <p className="text-xs text-red-600 mt-1">
            {(error as Error)?.message || "Please check your network and try again"}
          </p>
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title={
            selectedStatus !== "ALL" || debouncedSearch
              ? "No matching code review requests"
              : "No code review requests submitted yet"
          }
          description={
            selectedStatus !== "ALL" || debouncedSearch
              ? "Try resetting your search query or switching status filters."
              : "Submit your code snippet or GitHub repo for a line-by-line senior review."
          }
          action={
            selectedStatus !== "ALL" || debouncedSearch
              ? {
                  label: "Clear Filters",
                  onClick: () => {
                    setSelectedStatus("ALL");
                    setSearchQuery("");
                  },
                }
              : {
                  label: "Submit Your First Code Review",
                  href: "/dashboard/code-reviews/new",
                }
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((request) => (
            <ReviewRequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}
