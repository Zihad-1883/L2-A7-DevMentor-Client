import { apiClient } from "@/lib/api-client";

export interface CohortItem {
  id: string;
  mentorId: string;
  title: string;
  description: string;
  durationWeeks: number;
  capacity: number;
  totalCost: number;
  techStackTags: string[];
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  status: "DRAFT" | "PUBLISHED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  mentor: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    mentorProfile?: {
      id: string;
      bio: string;
      techStackTags: string[] | string;
      experienceLevel: string;
      githubUrl?: string | null;
      resumeUrl?: string | null;
    };
  };
  _count?: {
    enrollments: number;
    sessions: number;
  };
}

export interface CohortsResponseData {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  cohorts: CohortItem[];
}

export const cohortService = {
  getAllPublishedCohorts: (params?: Record<string, string | number | boolean | null | undefined>) =>
    apiClient.get<CohortsResponseData>("/cohorts", { params }),

  getCohortById: (id: string) =>
    apiClient.get<CohortItem>(`/cohorts/${id}`),

  enrollInCohort: (id: string) =>
    apiClient.post(`/cohorts/${id}/enroll`),
};
