// Group cohort program TypeScript interfaces

export type CohortStatus = "DRAFT" | "PUBLISHED" | "COMPLETED" | "CANCELLED";
export type CohortApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface CohortSessionItem {
  id: string;
  cohortId?: string;
  title: string;
  description?: string | null;
  scheduledAt: string;
  durationMinutes?: number;
  meetingLink?: string | null;
  joinLink?: string | null;
  status: "PENDING" | "SCHEDULED" | "COMPLETED" | "CANCELLED";
  recordingUrl?: string | null;
}

export interface CohortItem {
  id: string;
  mentorId: string;
  title: string;
  description: string;
  durationWeeks: number;
  capacity: number;
  totalCost: number;
  techStackTags: string[];
  approvalStatus: CohortApprovalStatus;
  status: CohortStatus;
  createdAt: string;
  updatedAt?: string;
  mentor: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    mentorProfile?: {
      id?: string;
      bio?: string;
      techStackTags?: string[] | string;
      experienceLevel?: string;
      githubUrl?: string | null;
      resumeUrl?: string | null;
    } | null;
  };
  sessions?: CohortSessionItem[];
  _count?: {
    enrollments: number;
    sessions: number;
  };
}

export interface CohortEnrollmentItem {
  id: string;
  cohortId: string;
  studentId: string;
  enrolledAt: string;
  cohort: CohortItem;
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

export interface GetEnrolledCohortsResponse {
  enrollments: CohortEnrollmentItem[];
  meta: {
    total: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}
