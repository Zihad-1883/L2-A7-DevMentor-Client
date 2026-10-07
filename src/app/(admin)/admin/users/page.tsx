"use client";

import * as React from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import UserManagementTable from "@/features/admin/UserManagementTable";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  RefreshCw,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const LIMIT = 10;
const ROLES = [
  { value: "", label: "All Roles" },
  { value: "student", label: "Students" },
  { value: "mentor", label: "Mentors" },
  { value: "admin", label: "Admins" },
];
const STATUSES = [
  { value: "", label: "All Status" },
  { value: "false", label: "Active" },
  { value: "true", label: "Blocked" },
];

export default function AdminUsersPage() {
  const [searchInput, setSearchInput] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [role, setRole] = React.useState("");
  const [blocked, setBlocked] = React.useState("");
  const [page, setPage] = React.useState(1);

  // Debounce search input
  React.useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const filters = {
    page,
    limit: LIMIT,
    ...(search ? { search } : {}),
    ...(role ? { role } : {}),
    ...(blocked ? { isBlocked: blocked } : {}),
  };

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: queryKeys.admin.users(filters),
    queryFn: () => adminService.getAllUsers(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });

  const users = data?.users ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const selectCls =
    "px-3 py-2 rounded-xl text-xs font-semibold bg-surface border border-border text-text-primary cursor-pointer focus:outline-none focus:border-amber/50";

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20 mb-2">
            <Users className="size-3.5" /> User Management
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Users Directory
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-xl">
            Search every platform account, filter by role or status, and block or
            unblock access.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start">
          {meta && (
            <span className="text-xs font-semibold text-text-muted">
              {meta.total} total users
            </span>
          )}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface border border-border hover:border-amber/40 hover:text-amber transition-colors shadow-2xs text-text-primary cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 text-amber ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="size-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-9 text-xs rounded-xl"
          />
        </div>
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
          className={selectCls}
          aria-label="Filter by role"
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <select
          value={blocked}
          onChange={(e) => {
            setBlocked(e.target.value);
            setPage(1);
          }}
          className={selectCls}
          aria-label="Filter by status"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="p-16 rounded-2xl border border-border/80 bg-surface flex flex-col items-center justify-center gap-3 text-text-muted">
          <Loader2 className="size-7 animate-spin text-amber" />
          <span className="text-sm font-medium">Loading users...</span>
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl border border-orange/30 bg-orange/5 flex flex-col items-center gap-3 text-center">
          <AlertCircle className="size-8 text-orange" />
          <h3 className="font-bold text-text-primary">Failed to load users</h3>
          <p className="text-xs text-text-secondary max-w-md">
            {error instanceof Error ? error.message : "Could not retrieve users."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber text-white hover:bg-amber-hover transition-colors cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      ) : users.length === 0 ? (
        <div className="p-16 rounded-3xl border border-border/80 bg-surface text-center space-y-2">
          <div className="size-14 rounded-2xl bg-surface-raised text-text-muted flex items-center justify-center mx-auto border border-border">
            <Users className="size-7" />
          </div>
          <h3 className="font-serif text-lg font-bold text-text-primary">No Users Found</h3>
          <p className="text-xs text-text-secondary">
            No accounts matched your search or filters.
          </p>
        </div>
      ) : (
        <div className={`space-y-4 transition-opacity ${isFetching ? "opacity-70" : ""}`}>
          <UserManagementTable users={users} />

          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>
              Page {meta?.page ?? page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isFetching}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold bg-surface border border-border hover:border-amber/40 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="size-3.5" /> Prev
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isFetching}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold bg-surface border border-border hover:border-amber/40 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
