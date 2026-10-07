import { z } from "zod";

export const payoutRequestSchema = z.object({
  amount: z
    .number({
      error: "Please enter a valid cash-out amount",
    })
    .min(1000, "Minimum withdrawal is 1,000 BDT (250 Credits)")
    .max(100000, "Maximum single withdrawal limit is 100,000 BDT"),
  bkashNumber: z
    .string()
    .regex(
      /^01[3-9]\d{8}$/,
      "Please enter a valid 11-digit Bangladeshi bKash number (e.g. 017XXXXXXXX)"
    ),
});

export type PayoutRequestFormData = z.infer<typeof payoutRequestSchema>;
