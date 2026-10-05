"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useUrlFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getParam = React.useCallback(
    (key: string, defaultValue: string = "") => {
      return searchParams.get(key) || defaultValue;
    },
    [searchParams]
  );

  const setParam = React.useCallback(
    (key: string, value: string | null | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      // Reset page to 1 on any filter change if page exists
      if (key !== "page" && params.has("page")) {
        params.set("page", "1");
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const setMultipleParams = React.useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === undefined || val === "") {
          params.delete(key);
        } else {
          params.set(key, val);
        }
      });
      if (!updates.page && params.has("page")) {
        params.set("page", "1");
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const clearAllFilters = React.useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  return {
    searchParams,
    getParam,
    setParam,
    setMultipleParams,
    clearAllFilters,
  };
}
