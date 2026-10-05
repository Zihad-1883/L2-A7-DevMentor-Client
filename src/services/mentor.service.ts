import { apiClient } from "@/lib/api-client";

export interface MentorProfileItem {
  id: string;
  userId: string;
  bio: string;
  techStackTags: string[];
  experienceLevel: "JUNIOR" | "MID" | "SENIOR" | "LEAD";
  githubUrl?: string | null;
  resumeUrl?: string | null;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

export interface MentorsResponseData {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  mentors: MentorProfileItem[];
}

export interface MentorQueryFilters {
  [key: string]: string | number | boolean | null | undefined;
  page?: number;
  limit?: number;
  tag?: string;
  experienceLevel?: string;
  search?: string;
}

export const mentorService = {
  getApprovedMentors: (filters: MentorQueryFilters = {}) =>
    apiClient.get<MentorsResponseData>("/mentors", {
      params: filters,
    }),

  getMentorById: (id: string) =>
    apiClient.get<MentorProfileItem>(`/mentors/${id}`),
};
