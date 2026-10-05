import { apiClient } from "@/lib/api-client";
import type { Exam, ExamAttempt, ExamAttemptAnswer } from "@/types/exam.types";

export interface GetExamsResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: Exam[];
}

export interface ExamSubmitResult {
  attemptId: string;
  score: number;
  totalMarks: number;
  percentage: number;
  passMark: number;
  isPassed: boolean;
  submittedAt: string;
  breakdown: ExamAttemptAnswer[];
}

export interface GetStudentAttemptsResponse {
  meta: { page: number; limit: number; total: number; totalPages: number };
  data: ExamAttempt[];
}

export interface GetMentorExamsResponse {
  meta: { page: number; limit: number; total: number; totalPages: number };
  data: Exam[];
}

export const examService = {
  // Fetch available exams (public + enrolled)
  getAvailableExams: async (page = 1, limit = 12): Promise<GetExamsResponse> => {
    try {
      const data = await apiClient.get<GetExamsResponse>(
        `/exams?page=${page}&limit=${limit}`
      );
      return data;
    } catch {
      // Graceful fallback when unauthenticated on public page
      return {
        meta: { page: 1, limit, total: 0, totalPages: 1 },
        data: [],
      };
    }
  },

  // Start an exam attempt (student only)
  startExamAttempt: async (
    examId: string
  ): Promise<{
    attemptId: string;
    startedAt: string;
    exam: Exam;
  }> => {
    return await apiClient.get<{
      attemptId: string;
      startedAt: string;
      exam: Exam;
    }>(`/exams/${examId}/start`);
  },

  // Submit exam attempt (student only)
  submitExamAttempt: async (
    examId: string,
    answers: { questionId: string; selectedOption: number }[]
  ): Promise<ExamSubmitResult> => {
    return await apiClient.post<ExamSubmitResult>(`/exams/${examId}/submit`, {
      answers,
    });
  },

  // Get student's past attempts
  getStudentAttempts: async (
    page = 1,
    limit = 10
  ): Promise<GetStudentAttemptsResponse> => {
    return await apiClient.get<GetStudentAttemptsResponse>(
      `/exams/me/attempts?page=${page}&limit=${limit}`
    );
  },

  // Get mentor's created exams
  getMentorExams: async (
    page = 1,
    limit = 10
  ): Promise<GetMentorExamsResponse> => {
    return await apiClient.get<GetMentorExamsResponse>(
      `/exams/mentor/my-exams?page=${page}&limit=${limit}`
    );
  },
};
