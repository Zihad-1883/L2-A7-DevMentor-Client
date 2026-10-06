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

export const codeReviewService = {
  getOpenPool: (params?: Record<string, string | number | boolean | null | undefined>) =>
    apiClient.get<{ requests: CodeReviewRequestItem[]; meta: { total: number } }>(
      "/code-reviews/pool",
      { params }
    ),

  createRequest: (payload: CreateCodeReviewInput) =>
    apiClient.post<{ request: CodeReviewRequestItem }>("/code-reviews", payload),

  approveAndRelease: (id: string) =>
    apiClient.post(`/code-reviews/${id}/approve`),

  cancelRequest: (id: string) =>
    apiClient.post(`/code-reviews/${id}/cancel`),
};

