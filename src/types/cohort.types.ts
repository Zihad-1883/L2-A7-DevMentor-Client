
export type CohortStatus = "DRAFT" | "PUBLISHED" | "COMPLETED" | "CANCELLED" | "ARCHIVED";
export type CohortApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "PENDING_APPROVAL";

export interface CreateCohortInput {
  title: string;
  description: string;
  durationWeeks: number;
  capacity: number;
  totalCost: number;
  techStackTags: string[];
}

export interface UpdateCohortInput {
  title?: string;
  description?: string;
  durationWeeks?: number;
  capacity?: number;
  totalCost?: number;
  techStackTags?: string[];
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export interface CreateCohortSessionInput {
  title: string;
  scheduledAt: string;
  durationMinutes?: number;
  creditCost?: number;
  joinLink?: string | null;
  sessionNumber?: number;
  dayNumber?: number;
  resources?: ICohortResourceItem[];
}

export interface UpdateCohortSessionInput {
  title?: string;
  scheduledAt?: string;
  durationMinutes?: number;
  creditCost?: number;
  joinLink?: string | null;
  sessionNumber?: number;
  dayNumber?: number;
  status?: "PENDING" | "SCHEDULED" | "COMPLETED" | "CANCELLED";
  resources?: ICohortResourceItem[];
}

export interface ICohortResourceItem {
  id: string;
  title: string;
  type?: "FILE" | "LINK" | "NOTE" | "CODE_SNIPPET" | string;
  url?: string | null;
  publicId?: string | null;
  fileSize?: number | null;
  fileType?: string | null;
  content?: string | null;
  createdAt?: string;
}

export interface CohortSessionItem {
  id: string;
  cohortId?: string;
  sessionNumber?: number;
  dayNumber?: number;
  title: string;
  description?: string | null;
  scheduledAt: string;
  durationMinutes?: number;
  creditCost?: number;
  meetingLink?: string | null;
  joinLink?: string | null;
  status: "PENDING" | "SCHEDULED" | "COMPLETED" | "CANCELLED";
  recordingUrl?: string | null;
  hasAccess?: boolean;
  resources?: ICohortResourceItem[] | null;
  createdAt?: string;
  updatedAt?: string;
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

export interface CohortRosterEnrollmentItem {
  id: string;
  cohortId: string;
  studentId: string;
  enrolledAt: string;
  student: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
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

export interface GetEnrolledCohortsResponse {
  enrollments: CohortEnrollmentItem[];
  meta: {
    total: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}
