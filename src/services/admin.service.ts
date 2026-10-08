import { apiClient } from "@/lib/api-client";
import type {
  AdminUsersResponse,
  AdminUserQueryFilters,
  AdminUserItem,
  ApproveMentorPayload,
  ToggleUserBlockPayload,
  ApproveCohortPayload,
  PlatformOverviewStats,
} from "@/types/admin.types";

export const adminService = {
  // 1. Get Paginated Users Directory
  getAllUsers: (filters: AdminUserQueryFilters = {}) =>
    apiClient.get<AdminUsersResponse>("/admin/users", {
      params: filters,
    }),

  // 2. Toggle User Block Status
  toggleUserBlock: (userId: string, isBlocked: boolean) =>
    apiClient.patch<AdminUserItem>(`/admin/users/${userId}/block`, {
      isBlocked,
    } as ToggleUserBlockPayload),

  // 3. Approve or Reject Mentor Application
  approveOrRejectMentor: (mentorProfileId: string, payload: ApproveMentorPayload) =>
    apiClient.patch<unknown>(`/admin/mentors/${mentorProfileId}/approve`, payload),

  // 4. Approve or Reject Mentor Cohort Program
  approveOrRejectCohort: (cohortId: string, payload: ApproveCohortPayload) =>
    apiClient.patch<unknown>(`/admin/cohorts/${cohortId}/approve`, payload),

  // 4b. Get Cohorts Queue for Admin Moderation
  getCohortsQueue: (params?: {
    approvalStatus?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) =>
    apiClient.get<import("@/types/cohort.types").CohortsResponseData>("/admin/cohorts", {
      params,
    }),


  // 5. Aggregate Platform Overview Statistics
  getPlatformStats: () => apiClient.get<PlatformOverviewStats>("/admin/stats"),

  // 6. Get Mentor Applications Queue (with full applicant details)
  getMentorApplicationsQueue: async (): Promise<import("@/services/mentor.service").MentorProfileItem[]> => {
    try {
      const usersRes = await apiClient.get<AdminUsersResponse>("/admin/users", {
        params: { limit: 100 },
      });

      const usersWithMentorProfile = (usersRes?.users || []).filter(
        (u) => Boolean(u.mentorProfile?.id)
      );

      const profilePromises = usersWithMentorProfile.map(async (u) => {
        try {
          const detail = await apiClient.get<import("@/services/mentor.service").MentorProfileItem>(
            `/mentors/${u.mentorProfile!.id}`
          );
          return detail;
        } catch {
          return {
            id: u.mentorProfile!.id,
            userId: u.id,
            bio: u.mentorProfile?.bio || "Applicant biography pending review.",
            techStackTags: u.mentorProfile?.techStackTags || ["JavaScript", "TypeScript"],
            experienceLevel: (u.mentorProfile?.experienceLevel as "JUNIOR" | "MID" | "SENIOR") || "MID",
            githubUrl: u.mentorProfile?.githubUrl || null,
            resumeUrl: u.mentorProfile?.resumeUrl || null,
            approvalStatus: (u.mentorProfile?.approvalStatus as "PENDING" | "APPROVED" | "REJECTED") || "PENDING",
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
            user: {
              id: u.id,
              name: u.name,
              email: u.email,
              image: u.image || null,
            },
          };
        }
      });

      return await Promise.all(profilePromises);
    } catch {
      return [];
    }
  },
};
