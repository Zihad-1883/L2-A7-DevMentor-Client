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
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentSize?: number;
}

export interface SubmitCodeReviewInput {
  summary: string;
  reviewedCodeSnippet?: string;
  videoUrl?: string;
  pullRequestUrl?: string;
  attachmentUrl?: string;
  attachmentName?: string;
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

const STORAGE_PREFIX = "devmentor_cr_item_";
const IN_PROGRESS_KEY = "devmentor_mentor_in_progress_reviews";

export const codeReviewCache = {
  save: (review: CodeReviewRequestItem, currentUserId?: string) => {
    if (typeof window === "undefined" || !review?.id) return;
    try {
      const serialized = JSON.stringify(review);
      sessionStorage.setItem(`${STORAGE_PREFIX}${review.id}`, serialized);
      localStorage.setItem(`${STORAGE_PREFIX}${review.id}`, serialized);

      const now = Date.now();
      const isMyLock =
        review.status === "PREVIEW_LOCKED" &&
        review.previewExpiresAt != null &&
        new Date(review.previewExpiresAt).getTime() > now &&
        (!currentUserId || !review.previewMentorId || review.previewMentorId === currentUserId);

      const isMyClaim =
        (review.status === "CLAIMED" || review.status === "DELIVERED") &&
        (!currentUserId || !review.assignedMentorId || review.assignedMentorId === currentUserId);

      const raw = localStorage.getItem(IN_PROGRESS_KEY);
      const list: CodeReviewRequestItem[] = raw ? JSON.parse(raw) : [];
      const filtered = list.filter((item) => item.id !== review.id);

      if (isMyLock || isMyClaim) {
        filtered.unshift(review);
      }
      localStorage.setItem(IN_PROGRESS_KEY, JSON.stringify(filtered));
    } catch {
      // quota or private browsing
    }
  },

  get: (id: string): CodeReviewRequestItem | null => {
    if (typeof window === "undefined" || !id) return null;
    try {
      const local = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
      if (local) return JSON.parse(local);
      const session = sessionStorage.getItem(`${STORAGE_PREFIX}${id}`);
      if (session) return JSON.parse(session);
      return null;
    } catch {
      return null;
    }
  },

  getMyInProgressReviews: (userId?: string): CodeReviewRequestItem[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(IN_PROGRESS_KEY);
      if (!raw) return [];
      const list: CodeReviewRequestItem[] = JSON.parse(raw);
      const now = Date.now();

      const active = list.filter((item) => {
        if (item.status === "PREVIEW_LOCKED") {
          const notExpired =
            item.previewExpiresAt != null &&
            new Date(item.previewExpiresAt).getTime() > now;
          const belongsToMe =
            !userId || !item.previewMentorId || item.previewMentorId === userId;
          return notExpired && belongsToMe;
        }

        if (item.status === "CLAIMED" || item.status === "DELIVERED") {
          const belongsToMe =
            !userId || !item.assignedMentorId || item.assignedMentorId === userId;
          return belongsToMe;
        }

        return false;
      });

      if (active.length !== list.length) {
        localStorage.setItem(IN_PROGRESS_KEY, JSON.stringify(active));
      }
      return active;
    } catch {
      return [];
    }
  },

  getMyActiveLocks: (userId?: string): CodeReviewRequestItem[] => {
    return codeReviewCache
      .getMyInProgressReviews(userId)
      .filter((r) => r.status === "PREVIEW_LOCKED");
  },

  remove: (id: string) => {
    if (typeof window === "undefined" || !id) return;
    try {
      sessionStorage.removeItem(`${STORAGE_PREFIX}${id}`);
      localStorage.removeItem(`${STORAGE_PREFIX}${id}`);
      const raw = localStorage.getItem(IN_PROGRESS_KEY);
      if (raw) {
        const list: CodeReviewRequestItem[] = JSON.parse(raw);
        const filtered = list.filter((item) => item.id !== id);
        localStorage.setItem(IN_PROGRESS_KEY, JSON.stringify(filtered));
      }
    } catch {
      // ignore
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

  getMyRequests: async (
    params?: Record<string, string | number | boolean | null | undefined>
  ): Promise<CodeReviewPoolResponse> => {
    const data = await apiClient.get<CodeReviewPoolResponse>("/code-reviews/my-requests", { params });
    data.requests?.forEach((r) => codeReviewCache.save(r));
    return data;
  },

  getById: async (id: string): Promise<CodeReviewRequestItem> => {
    // 1. Try local storage cache first
    const cached = codeReviewCache.get(id);
    if (cached) return cached;

    // 2. Try remote API
    try {
      const remote = await apiClient.get<CodeReviewRequestItem>(`/code-reviews/${id}`);
      if (remote) {
        codeReviewCache.save(remote);
        return remote;
      }
    } catch {
      // Endpoint may not exist on backend
    }

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

  previewLock: async (id: string, mentorId?: string): Promise<CodeReviewRequestItem> => {
    const updated = await apiClient.post<CodeReviewRequestItem>(`/code-reviews/${id}/preview`);
    const current = codeReviewCache.get(id);
    const resolvedMentorId = updated?.previewMentorId || mentorId || current?.previewMentorId;
    const enriched: CodeReviewRequestItem = {
      ...(current || {}),
      ...updated,
      status: "PREVIEW_LOCKED",
      previewMentorId: resolvedMentorId,
      previewExpiresAt:
        updated?.previewExpiresAt ||
        new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    } as CodeReviewRequestItem;
    codeReviewCache.save(enriched, resolvedMentorId || undefined);
    return enriched;
  },

  claimRequest: async (id: string, mentorId?: string): Promise<CodeReviewRequestItem> => {
    const updated = await apiClient.post<CodeReviewRequestItem>(`/code-reviews/${id}/claim`);
    const current = codeReviewCache.get(id);
    const resolvedMentorId = updated?.assignedMentorId || mentorId || current?.assignedMentorId;
    const isQuick = (updated?.tier || current?.tier) === "QUICK";
    const slaMs = isQuick ? 2 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const enriched: CodeReviewRequestItem = {
      ...(current || {}),
      ...updated,
      status: "CLAIMED",
      assignedMentorId: resolvedMentorId,
      deliveryDeadline:
        updated?.deliveryDeadline ||
        new Date(Date.now() + slaMs).toISOString(),
      previewMentorId: null,
      previewExpiresAt: null,
    } as CodeReviewRequestItem;
    codeReviewCache.save(enriched, resolvedMentorId || undefined);
    return enriched;
  },

  submitReview: async (id: string, payload: SubmitCodeReviewInput) => {
    const res = await apiClient.post<{ request: CodeReviewRequestItem; submission: unknown }>(
      `/code-reviews/${id}/submit`,
      payload
    );
    if (res?.request) {
      codeReviewCache.save(res.request);
    }
    return res;
  },

  approveAndRelease: (id: string) =>
    apiClient.post(`/code-reviews/${id}/approve`),

  cancelRequest: (id: string) =>
    apiClient.post(`/code-reviews/${id}/cancel`),
};
