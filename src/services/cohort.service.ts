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

  // Mentor: Create a new cohort program
  createCohort: async (
    data: import("@/types/cohort.types").CreateCohortInput
  ): Promise<CohortItem> => {
    return await apiClient.post<CohortItem>("/cohorts", data);
  },

  // Mentor: Get my created cohorts
  getMyCreatedCohorts: async (): Promise<CohortItem[]> => {
    return await apiClient.get<CohortItem[]>("/cohorts/my-created");
  },

  // Mentor: Update cohort program
  updateCohort: async (
    id: string,
    data: import("@/types/cohort.types").UpdateCohortInput
  ): Promise<CohortItem> => {
    return await apiClient.patch<CohortItem>(`/cohorts/${id}`, data);
  },

  // Mentor: Delete cohort program (soft delete)
  deleteCohort: async (id: string): Promise<{ message: string }> => {
    return await apiClient.delete<{ message: string }>(`/cohorts/${id}`);
  },

  // Mentor: Add session to cohort
  addCohortSession: async (
    cohortId: string,
    data: import("@/types/cohort.types").CreateCohortSessionInput
  ): Promise<import("@/types/cohort.types").CohortSessionItem> => {
    return await apiClient.post<import("@/types/cohort.types").CohortSessionItem>(
      `/cohort-sessions/cohort/${cohortId}`,
      data
    );
  },

  // Mentor: Update session
  updateCohortSession: async (
    sessionId: string,
    data: import("@/types/cohort.types").UpdateCohortSessionInput
  ): Promise<import("@/types/cohort.types").CohortSessionItem> => {
    return await apiClient.patch<import("@/types/cohort.types").CohortSessionItem>(
      `/cohort-sessions/${sessionId}`,
      data
    );
  },

  // Mentor: Delete session
  deleteCohortSession: async (sessionId: string): Promise<{ message: string }> => {
    return await apiClient.delete<{ message: string }>(
      `/cohort-sessions/${sessionId}`
    );
  },

  // Mentor: Add resource to session
  addSessionResource: async (
    sessionId: string,
    resource: import("@/types/cohort.types").ICohortResourceItem
  ): Promise<import("@/types/cohort.types").CohortSessionItem> => {
    return await apiClient.post<import("@/types/cohort.types").CohortSessionItem>(
      `/cohort-sessions/${sessionId}/resources`,
      resource
    );
  },

  // Mentor: Remove resource from session
  removeSessionResource: async (
    sessionId: string,
    resourceId: string
  ): Promise<import("@/types/cohort.types").CohortSessionItem> => {
    return await apiClient.delete<import("@/types/cohort.types").CohortSessionItem>(
      `/cohort-sessions/${sessionId}/resources/${resourceId}`
    );
  },

  // Mentor: Mark session completed
  completeCohortSession: async (
    sessionId: string
  ): Promise<import("@/types/cohort.types").CohortSessionItem> => {
    return await apiClient.patch<import("@/types/cohort.types").CohortSessionItem>(
      `/cohort-sessions/${sessionId}/complete`
    );
  },

  // Mentor: Cancel session
  cancelCohortSession: async (
    sessionId: string
  ): Promise<import("@/types/cohort.types").CohortSessionItem> => {
    return await apiClient.patch<import("@/types/cohort.types").CohortSessionItem>(
      `/cohort-sessions/${sessionId}/cancel`
    );
  },
};
