import { apiClient } from "@/lib/api-client";
import type { CodeReviewRequestItem, CodeReviewTier } from "@/types/code-review.types";

export interface CreateCodeReviewInput {
  tier: CodeReviewTier;
  title: string;
  description: string;
  codeSnippet?: string;
  language?: string;
  githubRepoUrl?: string;
  branchName?: string;
  specificFiles?: string;
}

export interface SubmitCodeReviewInput {
  summary: string;
  reviewedCodeSnippet?: string;
  videoUrl?: string;
  pullRequestUrl?: string;
  comments?: Array<{
    filePath: string;
    lineNumber: number;
    commentText: string;
    severity?: "SUGGESTION" | "BUG" | "SECURITY" | "WARNING" | "CRITICAL";
  }>;
}

export interface CodeReviewPoolResponse {
  requests: CodeReviewRequestItem[];
  meta: {
    page?: number;
    limit?: number;
    totalCount?: number;
    totalPages?: number;
    total?: number;
  };
}

const CACHE_PREFIX = "devmentor_cr_item_";
const MY_LOCKS_KEY = "devmentor_my_locked_crs";

export const codeReviewCache = {
  save: (review: CodeReviewRequestItem, currentUserId?: string) => {
    if (typeof window === "undefined" || !review?.id) return;
    try {
      sessionStorage.setItem(`${CACHE_PREFIX}${review.id}`, JSON.stringify(review));

      const isLockActive =
        review.status === "PREVIEW_LOCKED" &&
        review.previewExpiresAt &&
        new Date(review.previewExpiresAt).getTime() > Date.now();

      const belongsToMe =
        !currentUserId || !review.previewMentorId || review.previewMentorId === currentUserId;

      const raw = sessionStorage.getItem(MY_LOCKS_KEY);
      const list: CodeReviewRequestItem[] = raw ? JSON.parse(raw) : [];
      const filtered = list.filter((item) => item.id !== review.id);

      if (isLockActive && belongsToMe) {
        filtered.push(review);
      }
      sessionStorage.setItem(MY_LOCKS_KEY, JSON.stringify(filtered));
    } catch {
      // quota or private browsing
    }
  },

  get: (id: string): CodeReviewRequestItem | null => {
    if (typeof window === "undefined" || !id) return null;
    try {
      const raw = sessionStorage.getItem(`${CACHE_PREFIX}${id}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  getMyActiveLocks: (userId?: string): CodeReviewRequestItem[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = sessionStorage.getItem(MY_LOCKS_KEY);
      if (!raw) return [];
      const list: CodeReviewRequestItem[] = JSON.parse(raw);
      const now = Date.now();
      const valid = list.filter(
        (item) =>
          item.previewExpiresAt &&
          new Date(item.previewExpiresAt).getTime() > now &&
          item.status === "PREVIEW_LOCKED" &&
          (!userId || !item.previewMentorId || item.previewMentorId === userId)
      );
      if (valid.length !== list.length) {
        sessionStorage.setItem(MY_LOCKS_KEY, JSON.stringify(valid));
      }
      return valid;
    } catch {
      return [];
    }
  },
};

export const codeReviewService = {
  getOpenPool: async (
    params?: Record<string, string | number | boolean | null | undefined>
  ): Promise<CodeReviewPoolResponse> => {
    const data = await apiClient.get<CodeReviewPoolResponse>("/code-reviews/pool", { params });
    data.requests?.forEach((r) => codeReviewCache.save(r));
    return data;
  },

  getById: async (id: string): Promise<CodeReviewRequestItem> => {
    // 1. Try remote API first
    try {
      const remote = await apiClient.get<CodeReviewRequestItem>(`/code-reviews/${id}`);
      if (remote) {
        codeReviewCache.save(remote);
        return remote;
      }
    } catch {
      // Endpoint may not exist on backend
    }

    // 2. Try local cache
    const cached = codeReviewCache.get(id);
    if (cached) return cached;

    // 3. Fallback: search open pool
    try {
      const pool = await apiClient.get<CodeReviewPoolResponse>("/code-reviews/pool", {
        params: { limit: 100 },
      });
      const found = pool.requests?.find((r) => r.id === id);
      if (found) {
        codeReviewCache.save(found);
        return found;
      }
    } catch {
      // pool query failed
    }

    throw new Error("Code review request not found");
  },

  createRequest: (payload: CreateCodeReviewInput) =>
    apiClient.post<{ request: CodeReviewRequestItem }>("/code-reviews", payload),

  previewLock: async (id: string): Promise<CodeReviewRequestItem> => {
    const updated = await apiClient.post<CodeReviewRequestItem>(`/code-reviews/${id}/preview`);
    const current = codeReviewCache.get(id);
    const enriched: CodeReviewRequestItem = {
      ...(current || {}),
      ...updated,
      status: "PREVIEW_LOCKED",
      previewExpiresAt:
        updated?.previewExpiresAt ||
        new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    } as CodeReviewRequestItem;
    codeReviewCache.save(enriched);
    return enriched;
  },

  claimRequest: async (id: string): Promise<CodeReviewRequestItem> => {
    const updated = await apiClient.post<CodeReviewRequestItem>(`/code-reviews/${id}/claim`);
    const current = codeReviewCache.get(id);
    const enriched: CodeReviewRequestItem = {
      ...(current || {}),
      ...updated,
      status: "CLAIMED",
    } as CodeReviewRequestItem;
    codeReviewCache.save(enriched);
    return enriched;
  },

  submitReview: (id: string, payload: SubmitCodeReviewInput) =>
    apiClient.post<{ request: CodeReviewRequestItem; submission: unknown }>(
      `/code-reviews/${id}/submit`,
      payload
    ),

  approveAndRelease: (id: string) =>
    apiClient.post(`/code-reviews/${id}/approve`),

  cancelRequest: (id: string) =>
    apiClient.post(`/code-reviews/${id}/cancel`),
};
