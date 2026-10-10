"use client";

import * as React from "react";
import { Search, ChevronLeft, ChevronRight, Inbox, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface ColumnDef<T> {
  id: string;
  header: React.ReactNode;
  accessorKey?: keyof T;
  cell?: (item: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor?: (item: T, index: number) => string;
  isLoading?: boolean;
  skeletonRows?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  onRowClick?: (item: T) => void;
  pageSize?: number;
  className?: string;
  minWidth?: string;
  toolbarRight?: React.ReactNode;
}

export default function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  skeletonRows = 5,
  emptyTitle = "No records found",
  emptyDescription = "There are no entries matching your current filters.",
  emptyIcon,
  searchPlaceholder,
  searchFilter,
  onRowClick,
  pageSize,
  className = "",
  minWidth = "min-w-[680px]",
  toolbarRight,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Client-side search filtering
  const filteredData = React.useMemo(() => {
    if (!searchFilter || !searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase().trim();
    return data.filter((item) => searchFilter(item, q));
  }, [data, searchFilter, searchQuery]);

  // Pagination calculation with derived safeCurrentPage (no cascading effect setState needed)
  const totalItems = filteredData.length;
  const effectivePageSize = pageSize || totalItems || 1;
  const totalPages = Math.max(1, Math.ceil(totalItems / effectivePageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedData = React.useMemo(() => {
    if (!pageSize) return filteredData;
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, safeCurrentPage, pageSize]);

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Optional Toolbar: Search & Actions */}
      {(searchFilter || toolbarRight) && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {searchFilter ? (
            <div className="relative w-full sm:w-72">
              <Search className="size-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder || "Search entries..."}
                className="pl-9 text-xs rounded-xl bg-surface border-border"
              />
            </div>
          ) : (
            <div />
          )}

          {toolbarRight && <div className="flex items-center gap-2">{toolbarRight}</div>}
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-2xl border border-border/80 bg-surface shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className={cn("w-full text-sm", minWidth)}>
            <thead>
              <tr className="border-b border-border/80 bg-surface-raised/60 text-[11px] uppercase tracking-wider text-text-muted font-semibold">
                {columns.map((col) => (
                  <th
                    key={col.id}
                    className={cn(
                      "px-4 py-3.5",
                      alignClasses[col.align || "left"],
                      col.headerClassName
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                // Skeleton Loading State
                Array.from({ length: skeletonRows }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="animate-pulse">
                    {columns.map((col) => (
                      <td key={col.id} className="px-4 py-4">
                        <div className="h-4 rounded-md bg-surface-raised/80 max-w-[80%]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={columns.length} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto text-center">
                      <div className="size-12 rounded-2xl bg-surface-raised border border-border flex items-center justify-center text-text-muted mb-1 shadow-2xs">
                        {emptyIcon || <Inbox className="size-6 stroke-1" />}
                      </div>
                      <h4 className="font-serif text-base font-bold text-text-primary">
                        {emptyTitle}
                      </h4>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {emptyDescription}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Data Rows
                paginatedData.map((item, rowIndex) => {
                  const itemRecord = item as Record<string, unknown>;
                  const key = keyExtractor
                    ? keyExtractor(item, rowIndex)
                    : typeof itemRecord?.id === "string" || typeof itemRecord?.id === "number"
                    ? String(itemRecord.id)
                    : rowIndex;

                  return (
                    <tr
                      key={key}
                      onClick={() => onRowClick?.(item)}
                      className={cn(
                        "transition-colors",
                        onRowClick
                          ? "cursor-pointer hover:bg-surface-raised/60"
                          : "hover:bg-surface-raised/40"
                      )}
                    >
                      {columns.map((col) => {
                        const cellContent = col.cell
                          ? col.cell(item, rowIndex)
                          : col.accessorKey
                          ? String(item[col.accessorKey] ?? "")
                          : null;

                        return (
                          <td
                            key={col.id}
                            className={cn(
                              "px-4 py-3.5 text-text-primary align-middle",
                              alignClasses[col.align || "left"],
                              col.className
                            )}
                          >
                            {cellContent}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pageSize && totalItems > 0 && !isLoading && (
          <div className="px-4 py-3 border-t border-border/70 bg-surface-raised/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary">
            <div>
              Showing{" "}
              <span className="font-semibold text-text-primary">
                {(safeCurrentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-text-primary">
                {Math.min(safeCurrentPage * pageSize, totalItems)}
              </span>{" "}
              of <span className="font-semibold text-text-primary">{totalItems}</span> entries
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage <= 1}
                className="h-8 px-2.5 rounded-lg border-border text-xs gap-1 cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft className="size-3.5" />
                Previous
              </Button>

              <div className="px-2 font-mono text-[11px] font-semibold text-text-primary">
                {safeCurrentPage} / {totalPages}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage >= totalPages}
                className="h-8 px-2.5 rounded-lg border-border text-xs gap-1 cursor-pointer disabled:opacity-40"
              >
                Next
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
