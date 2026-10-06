import { apiClient } from "@/lib/api-client";
import type {
  CohortItem,
  CohortsResponseData,
  GetEnrolledCohortsResponse,
} from "@/types/cohort.types";

export type { CohortItem, CohortsResponseData, GetEnrolledCohortsResponse };

export const cohortService = {
  // Public: Get all published approved cohorts
  getAllPublishedCohorts: async (
    params?: Record<string, string | number | boolean | null | undefined>
  ): Promise<CohortsResponseData> => {
    return await apiClient.get<CohortsResponseData>("/cohorts", { params });
  },

  // Public / Student / Mentor: Get single cohort by ID
  getCohortById: async (id: string): Promise<CohortItem> => {
    return await apiClient.get<CohortItem>(`/cohorts/${id}`);
  },

  // Student: Register / enroll in cohort
  enrollInCohort: async (
    id: string
  ): Promise<{ message: string; enrollment: unknown }> => {
    return await apiClient.post(`/cohorts/${id}/register`);
  },

  // Student: Get my enrolled cohorts
  getMyEnrolledCohorts: async (
    params?: Record<string, string | number | boolean | null | undefined>
  ): Promise<GetEnrolledCohortsResponse> => {
    return await apiClient.get<GetEnrolledCohortsResponse>(
      "/enrollments/my-cohorts",
      { params }
    );
  },

  // Student / Member: Get sessions for a cohort
  getCohortSessions: async (
    cohortId: string
  ): Promise<import("@/types/cohort.types").CohortSessionItem[]> => {
    return await apiClient.get<import("@/types/cohort.types").CohortSessionItem[]>(
      `/cohort-sessions/cohort/${cohortId}`
    );
  },

  // Student: Join session with credits (unlock joinLink & resources)
  joinCohortSession: async (
    sessionId: string
  ): Promise<{
    message: string;
    participant: unknown;
    remainingBalance?: number;
    session: import("@/types/cohort.types").CohortSessionItem;
  }> => {
    return await apiClient.post(`/cohort-sessions/${sessionId}/join`);
  },
};
