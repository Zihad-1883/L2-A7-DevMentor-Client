import { apiClient } from "@/lib/api-client";
import type {
  SprintRequestItem,
  SprintSessionItem,
  CreateSprintInput,
  UpdateSprintInput,
} from "@/types/sprint.types";

export type {
  SprintRequestItem,
  SprintSessionItem,
  CreateSprintInput,
  UpdateSprintInput,
};

export interface SprintPoolResponseData {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  sprints: SprintRequestItem[];
}

export const sprintService = {
  // Student: Create a new 1-on-1 sprint request
  createSprintRequest: async (payload: CreateSprintInput): Promise<SprintRequestItem> => {
    return await apiClient.post<SprintRequestItem>("/sprints", payload);
  },

  // Student / Mentor: Get student's or mentor's sprints
  getUserSprints: async (): Promise<SprintRequestItem[]> => {
    return await apiClient.get<SprintRequestItem[]>("/sprints/my-sprints");
  },

  // Student: Get enrolled sprints
  getMyEnrolledSprints: async (
    params?: Record<string, string | number | boolean | null | undefined>
  ): Promise<{ sprints: SprintRequestItem[]; meta: { total: number } }> => {
    return await apiClient.get<{ sprints: SprintRequestItem[]; meta: { total: number } }>(
      "/enrollments/my-sprints",
      { params }
    );
  },

  // Student / Mentor: Get single sprint by ID
  getSprintById: async (sprintId: string): Promise<SprintRequestItem> => {
    return await apiClient.get<SprintRequestItem>(`/sprints/${sprintId}`);
  },

  // Student: Update sprint details before it gets claimed
  updateSprint: async (
    sprintId: string,
    payload: UpdateSprintInput
  ): Promise<SprintRequestItem> => {
    return await apiClient.patch<SprintRequestItem>(`/sprints/${sprintId}`, payload);
  },

  // Student: Delete / cancel sprint before it gets claimed
  deleteSprint: async (sprintId: string): Promise<{ message: string }> => {
    return await apiClient.delete<{ message: string }>(`/sprints/${sprintId}`);
  },

  // Mentor: Get open sprint pool to claim
  getOpenSprintPool: async (
    params?: Record<string, string | number | boolean | null | undefined>
  ): Promise<SprintPoolResponseData> => {
    return await apiClient.get<SprintPoolResponseData>("/sprints/open-pool", { params });
  },

  // Mentor: Claim an open sprint request
  claimSprint: async (
    sprintId: string
  ): Promise<{ sprint: SprintRequestItem; message: string }> => {
    return await apiClient.post<{ sprint: SprintRequestItem; message: string }>(
      `/sprints/${sprintId}/claim`
    );
  },

  // Student: Confirm proposed sprint session slot
  confirmSession: async (
    sessionId: string
  ): Promise<{ message: string; session: SprintSessionItem }> => {
    return await apiClient.post<{ message: string; session: SprintSessionItem }>(
      `/sprint-sessions/${sessionId}/confirm`
    );
  },

  // Student / Mentor: Complete sprint session
  completeSession: async (
    sessionId: string
  ): Promise<{ message: string; session: SprintSessionItem }> => {
    return await apiClient.post<{ message: string; session: SprintSessionItem }>(
      `/sprint-sessions/${sessionId}/complete`
    );
  },

  // Student / Mentor: Cancel session
  cancelSession: async (
    sessionId: string
  ): Promise<{ message: string; refundIssued: boolean; session: SprintSessionItem }> => {
    return await apiClient.post<{ message: string; refundIssued: boolean; session: SprintSessionItem }>(
      `/sprint-sessions/${sessionId}/cancel`
    );
  },
};
