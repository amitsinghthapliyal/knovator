import { z } from "zod";

export const JobSchema = z.object({
  externalId: z.string().min(1),
  source: z.string().min(1),

  title: z.string().min(1),

  company: z.string().optional().default("Unknown"),
  location: z.string().optional().default("Remote"),
  type: z.string().optional().default("N/A"),
  category: z.string().optional().default("General"),

  description: z.string().optional().default(""),

  url: z
    .string()
    .min(1)
    .refine(
      (val) => {
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Invalid URL" }
    ),

  publishedAt: z.coerce.date().optional(),
});
