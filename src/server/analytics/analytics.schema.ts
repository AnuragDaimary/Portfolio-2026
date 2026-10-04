import { z } from "zod";

/**
 * Slugs are the public identifier for a page or project. Constrained tightly
 * so the endpoint can't be used to write arbitrary junk rows into the table.
 */
export const slugSchema = z
  .string()
  .trim()
  .min(1, "A slug is required.")
  .max(120, "That slug is too long.")
  .regex(
    /^[a-z0-9]+(?:[-/][a-z0-9]+)*$/,
    "Slugs may contain lowercase letters, numbers, hyphens and slashes only.",
  );

export const recordViewSchema = z.object({
  slug: slugSchema,
  referrer: z.string().trim().max(500).optional(),
  country: z.string().trim().length(2).optional(),
});

export type RecordViewInput = z.infer<typeof recordViewSchema>;

export interface ViewRequestContext {
  visitorHash: string | null;
}
