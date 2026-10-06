import { z } from "zod";

export const createSprintSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Please provide at least 10 characters explaining your goals and issues"),
  techStackTags: z
    .array(z.string().trim())
    .min(1, "Please specify at least one relevant technology or stack tag"),
  startDate: z
    .string()
    .min(1, "Please choose a desired start date")
    .refine((val) => !isNaN(Date.parse(val)), "Please enter a valid start date"),
  durationDays: z
    .number()
    .int()
    .positive("Duration must be at least 1 day"),
  selectedDays: z
    .array(z.number().int().positive())
    .min(1, "Please select at least one session day within the sprint duration"),
});

export type CreateSprintFormData = z.infer<typeof createSprintSchema>;
