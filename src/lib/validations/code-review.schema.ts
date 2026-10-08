import { z } from "zod";

export const createCodeReviewFormSchema = z
  .object({
    tier: z.enum(["QUICK", "DEEP"], {
      message: "Please select either Quick Review (10c) or Deep Architectural Review (50c)",
    }),
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(150, "Title must not exceed 150 characters"),
    description: z
      .string()
      .trim()
      .min(10, "Please provide at least 10 characters explaining what to review or look out for"),
    submissionMode: z.enum(["snippet", "github", "patch"], {
      message: "Please choose whether to paste code, provide a GitHub repository link, or upload a patch/file",
    }),
    codeSnippet: z.string().optional(),
    language: z.string().trim().default("typescript"),
    githubRepoUrl: z
      .string()
      .trim()
      .optional()
      .or(z.literal("")),
    branchName: z.string().trim().optional().default("main"),
    specificFiles: z.string().trim().optional(),
    attachmentUrl: z.string().trim().optional().or(z.literal("")),
    attachmentName: z.string().trim().optional(),
    attachmentSize: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.submissionMode === "snippet") {
      if (!data.codeSnippet || data.codeSnippet.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please provide the code snippet you want reviewed.",
          path: ["codeSnippet"],
        });
      }
    } else if (data.submissionMode === "github") {
      if (!data.githubRepoUrl || data.githubRepoUrl.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter your GitHub repository URL.",
          path: ["githubRepoUrl"],
        });
      } else {
        try {
          const url = new URL(data.githubRepoUrl);
          if (!url.hostname.includes("github.com")) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "URL must be a valid GitHub URL (e.g. https://github.com/owner/repo)",
              path: ["githubRepoUrl"],
            });
          }
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please provide a valid URL (including https://)",
            path: ["githubRepoUrl"],
          });
        }
      }
    } else if (data.submissionMode === "patch") {
      if (!data.attachmentUrl || data.attachmentUrl.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please upload a git diff patch or source file for review.",
          path: ["attachmentUrl"],
        });
      }
    }
  });

export type CreateCodeReviewFormData = z.input<typeof createCodeReviewFormSchema>;
