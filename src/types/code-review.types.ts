export type CodeReviewTier = "QUICK" | "DEEP";

export type CodeReviewStatus =
  | "OPEN"
  | "PREVIEW_LOCKED"
  | "CLAIMED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

export interface CodeReviewComment {
  id: string;
  filePath: string;
  lineNumber: number;
  commentText: string;
  severity?: "SUGGESTION" | "WARNING" | "CRITICAL";
  createdAt: string;
}

export interface CodeReviewSubmission {
  id: string;
  summary: string;
  reviewedCodeSnippet?: string | null;
  videoUrl?: string | null;
  pullRequestUrl?: string | null;
  comments: CodeReviewComment[];
  createdAt: string;
  mentor?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

export interface CodeReviewRequestItem {
  id: string;
  studentId: string;
  tier: CodeReviewTier;
  title: string;
  description: string;
  codeSnippet?: string | null;
  language?: string | null;
  githubRepoUrl?: string | null;
  branchName?: string | null;
  specificFiles?: string | null;
  creditReward: number;
  status: CodeReviewStatus;
  deliveryDeadline?: string | null;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  assignedMentor?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  } | null;
  submission?: CodeReviewSubmission | null;
}

