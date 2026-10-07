import { z } from "zod";

export const createCohortSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  durationWeeks: z.coerce
    .number()
    .int("Duration must be an integer number of weeks")
    .positive("Duration must be at least 1 week")
    .max(52, "Duration cannot exceed 52 weeks"),
  capacity: z.coerce
    .number()
    .int("Capacity must be an integer")
    .min(1, "Capacity must be at least 1 student")
    .max(200, "Capacity cannot exceed 200 students"),
  totalCost: z.coerce
    .number()
    .int("Credit price must be an integer")
    .min(0, "Credit cost cannot be negative"),
  techStackTags: z
    .array(z.string())
    .min(1, "Select or add at least one tech stack tag"),
});

export type CreateCohortSchemaType = z.infer<typeof createCohortSchema>;
