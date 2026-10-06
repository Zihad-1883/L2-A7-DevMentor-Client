import { apiClient } from "@/lib/api-client";
import type { AuthUser } from "@/types/auth.types";

export interface UserProfileResponse extends AuthUser {
  wallet?: {
    balance: number;
    totalEarned?: number;
    totalWithdrawn?: number;
  };
  mentorProfile?: {
    id: string;
    bio: string;
    techStackTags: string[];
    experienceLevel: string;
    githubUrl?: string | null;
    resumeUrl?: string | null;
    approvalStatus: string;
  } | null;
}

export interface UpdateUserProfilePayload {
  name?: string;
  image?: string | null;
  bio?: string;
}

export interface UserDashboardSummary {
  user: {
    id: string;
    name: string;
    role: string;
  };
  wallet: {
    balance: number;
  };
  summary: {
    totalEnrolledCohorts: number;
    totalRequestedSprints: number;
    enrolledCohorts: unknown[];
    recentSprintRequests: unknown[];
  };
}

export const userService = {
  getMyProfile: () => apiClient.get<UserProfileResponse>("/users/me"),

  updateMyProfile: (data: UpdateUserProfilePayload) =>
    apiClient.patch<UserProfileResponse>("/users/me", data),

  getMyDashboard: () => apiClient.get<UserDashboardSummary>("/users/me/dashboard"),
};
