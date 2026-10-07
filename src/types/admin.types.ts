export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: "student" | "mentor" | "admin";
  isBlocked: boolean;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
  mentorProfile?: {
    id: string;
    approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
    experienceLevel: "JUNIOR" | "MID" | "SENIOR" | "LEAD";
    bio?: string;
    techStackTags?: string[];
    githubUrl?: string | null;
    resumeUrl?: string | null;
  } | null;
}

export interface AdminUsersResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  users: AdminUserItem[];
}

export interface AdminUserQueryFilters {
  [key: string]: string | number | boolean | null | undefined;
  search?: string;
  role?: string;
  isBlocked?: string | boolean;
  page?: number;
  limit?: number;
}

export interface ApproveMentorPayload {
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string;
}

export interface ToggleUserBlockPayload {
  isBlocked: boolean;
}

export interface ApproveCohortPayload {
  status: "APPROVED" | "REJECTED";
}

export interface PlatformOverviewStats {
  totalUsers: number;
  totalStudents: number;
  totalMentors: number;
  pendingMentorApplications: number;
  totalCohorts: number;
  pendingCohorts: number;
  totalRevenueBdt: number;
  platformCommissionEarnedBdt: number;
  totalCreditsCirculating: number;
}

export interface RevenueMonthlyDataPoint {
  month: string;
  grossRevenue: number;
  platformCommission: number;
  mentorPayouts: number;
}
