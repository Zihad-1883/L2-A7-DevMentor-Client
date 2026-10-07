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

  // Create a new exam in DRAFT status (mentor only)
  createExam: async (
    payload: import("@/types/exam.types").CreateExamInput
  ): Promise<Exam> => {
    return await apiClient.post<Exam>("/exams", payload);
  },

  // Add questions to an existing exam (mentor only)
  // Sends questions sequentially in single-item batches to prevent Prisma interactive transaction
  // timeout (5000ms limit on serverless environments)
  addQuestionsToExam: async (
    examId: string,
    questions: import("@/types/exam.types").CreateQuestionInput[]
  ): Promise<Exam> => {
    if (!questions || questions.length === 0) {
      return (await apiClient.get<Exam>(`/exams/${examId}`)) as Exam;
    }
    let lastResult: Exam | null = null;
    for (const q of questions) {
      lastResult = await apiClient.post<Exam>(`/exams/${examId}/questions`, {
        questions: [q],
      });
    }
    return lastResult!;
  },

  // Publish exam to activate it for students (mentor only)
  publishExam: async (examId: string): Promise<Exam> => {
    return await apiClient.patch<Exam>(`/exams/${examId}/publish`);
  },
};
