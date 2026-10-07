import { z } from "zod";

export const questionItemSchema = z.object({
  questionText: z
    .string()
    .min(5, "Question statement must be at least 5 characters long"),
  options: z
    .array(z.string().min(1, "Option text cannot be empty"))
    .min(2, "Each question must have at least 2 choices")
    .max(6, "Each question can have at most 6 choices"),
  correctOptionIndex: z
    .number()
    .min(0, "Please select the correct choice index"),
  explanation: z.string().optional(),
  marks: z.number().min(1, "Marks must be at least 1").default(1),
});

export type QuestionItemFormData = z.infer<typeof questionItemSchema>;

export const createExamSchema = z.object({
  title: z
    .string()
    .min(3, "Exam title must be at least 3 characters long")
    .max(150, "Exam title cannot exceed 150 characters"),
  description: z.string().optional(),
  durationMinutes: z
    .number()
    .min(5, "Duration must be at least 5 minutes")
    .max(300, "Duration cannot exceed 300 minutes")
    .default(30),
  totalMarks: z
    .number()
    .min(1, "Total marks must be at least 1")
    .optional(),
  passMark: z
    .number()
    .min(1, "Pass mark must be at least 1%")
    .max(100, "Pass mark cannot exceed 100%")
    .default(70),
  isFree: z.boolean().default(true),
  cohortId: z.string().optional(),
  sprintId: z.string().optional(),
});

export const examBuilderSchema = createExamSchema.extend({
  questions: z
    .array(questionItemSchema)
    .min(1, "Exam must contain at least 1 MCQ question"),
});

export type ExamBuilderFormData = z.infer<typeof examBuilderSchema>;
