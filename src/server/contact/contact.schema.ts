import { z } from "zod";

/**
 * The single source of truth for what a valid contact submission is.
 * The API route and (later) the frontend form both import this, so client
 * and server validation can never drift apart.
 */
export const contactSubmissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "That name is too long."),

  email: z.email("Please enter a valid email address.").max(254),

  subject: z
    .string()
    .trim()
    .max(150, "That subject is too long.")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters.")
    .max(5000, "That message is too long."),

  /**
   * Honeypot. Hidden from real users via CSS; bots fill it in.
   * Anything non-empty here is silently treated as spam.
   */
  website: z.string().max(0).optional().or(z.string().optional()),
});

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;

/** Request metadata collected server-side — never trusted from the client. */
export interface ContactRequestContext {
  ipHash: string | null;
  userAgent: string | null;
  referrer: string | null;
}
