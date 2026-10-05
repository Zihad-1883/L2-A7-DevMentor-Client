import { apiClient } from "@/lib/api-client";

export interface SprintSessionItem {
  id: string;
  dayNumber: number;
  scheduledAt: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
}

export interface SprintRequestItem {
  id: string;
  studentId: string;
  mentorId?: string | null;
  title: string;
  description: string;
  techStackTags: string[];
  startDate: string;
  durationDays: number;
  selectedDays: number[];
  status: "PENDING_CLAIM" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  student: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  sessions?: SprintSessionItem[];
}

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
  getOpenSprintPool: (params?: Record<string, string | number | boolean | null | undefined>) =>
    apiClient.get<SprintPoolResponseData>("/sprints/open-pool", { params }),

  getUserSprints: () =>
    apiClient.get<SprintRequestItem[]>("/sprints/my-sprints"),

  getSprintById: (sprintId: string) =>
    apiClient.get<SprintRequestItem>(`/sprints/${sprintId}`),

  claimSprint: (sprintId: string) =>
    apiClient.post<{ sprint: SprintRequestItem; message: string }>(`/sprints/${sprintId}/claim`),
};
