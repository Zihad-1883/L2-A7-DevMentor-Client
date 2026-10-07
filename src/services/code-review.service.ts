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
    severity?: "SUGGESTION" | "WARNING" | "CRITICAL";
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

export const codeReviewService = {
  getOpenPool: (params?: Record<string, string | number | boolean | null | undefined>) =>
    apiClient.get<CodeReviewPoolResponse>("/code-reviews/pool", { params }),

  createRequest: (payload: CreateCodeReviewInput) =>
    apiClient.post<{ request: CodeReviewRequestItem }>("/code-reviews", payload),

  previewLock: (id: string) =>
    apiClient.post<CodeReviewRequestItem>(`/code-reviews/${id}/preview`),

  claimRequest: (id: string) =>
    apiClient.post<CodeReviewRequestItem>(`/code-reviews/${id}/claim`),

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
