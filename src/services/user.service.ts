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
  techStackTags?: string[];
  githubUrl?: string | null;
  resumeUrl?: string | null;
}

export interface StudentDashboardSummary {
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

export interface MentorDashboardSummary {
  user: {
    id: string;
    name: string;
    role: string;
  };
  wallet: {
    balance: number;
    totalEarned: number;
    totalWithdrawn: number;
  };
  summary: {
    totalCohortsCreated: number;
    totalSprintsClaimed: number;
    createdCohorts: unknown[];
    claimedSprints: unknown[];
  };
}

export type UserDashboardSummary = StudentDashboardSummary | MentorDashboardSummary;

export const userService = {
  getMyProfile: () => apiClient.get<UserProfileResponse>("/users/me"),

  updateMyProfile: (data: UpdateUserProfilePayload) =>
    apiClient.patch<UserProfileResponse>("/users/me", data),

  getMyDashboard: <T = UserDashboardSummary>() => apiClient.get<T>("/users/me/dashboard"),
};
