// MCQ exam & question TypeScript interfaces

export type ExamStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface CreateQuestionInput {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  marks?: number;
}

export interface CreateExamInput {
  title: string;
  description?: string;
  durationMinutes?: number;
  totalMarks?: number;
  passMark?: number;
  isFree?: boolean;
  cohortId?: string | null;
  sprintId?: string | null;
}

export interface Question {
  id: string;
  examId: string;
  questionText: string;
  options: string[];
  correctOptionIndex?: number;
  explanation?: string | null;
  marks: number;
}

export interface Exam {
  id: string;
  mentorId: string;
  mentor?: {
    id: string;
    name: string | null;
    image?: string | null;
  };
  cohortId?: string | null;
  cohort?: {
    id: string;
    title: string;
  } | null;
  sprintId?: string | null;
  sprint?: {
    id: string;
    title: string;
  } | null;
  isFree: boolean;
  title: string;
  description?: string | null;
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  passMark?: number | null;
  status: ExamStatus;
  category?: string;
  difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  techStackTags?: string[];
  createdAt: string;
  updatedAt: string;
  questions?: Question[];
  _count?: {
    questions?: number;
    attempts?: number;
  };
}

export interface ExamAttemptAnswer {
  questionId: string;
  questionText: string;
  options: string[];
  selectedOption: number;
  correctOptionIndex: number;
  isCorrect: boolean;
  marksEarned: number;
  totalMarks: number;
  explanation?: string | null;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  exam?: {
    id: string;
    title: string;
    totalMarks: number;
    passMark: number | null;
    mentor?: { name: string | null };
  };
  studentId: string;
  score: number;
  percentage: number;
  isPassed: boolean;
  startedAt: string;
  submittedAt?: string | null;
  answers?: ExamAttemptAnswer[];
}
