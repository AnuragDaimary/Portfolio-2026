import { z } from "zod";

/**
 * Environment validation, split by concern.
 *
 * Deliberately NOT one big schema: a single `serverEnv()` means a missing
 * RESEND_API_KEY breaks IP hashing, which has nothing to do with email. Each
 * group below is validated lazily and independently, so a code path only
 * fails on the variables it actually uses.
 */

const databaseEnvSchema = z.object({
  // Pooled connection, used at runtime. The direct URL is migrations-only and
  // is read by prisma.config.ts, not by the app.
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

const emailEnvSchema = z.object({
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  CONTACT_FROM_EMAIL: z.email("CONTACT_FROM_EMAIL must be an email address"),
  CONTACT_TO_EMAIL: z.email("CONTACT_TO_EMAIL must be an email address"),
});

const securityEnvSchema = z.object({
  IP_HASH_SALT: z
    .string()
    .min(32, "IP_HASH_SALT must be at least 32 characters"),
});

const appEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export type DatabaseEnv = z.infer<typeof databaseEnvSchema>;
export type EmailEnv = z.infer<typeof emailEnvSchema>;
export type SecurityEnv = z.infer<typeof securityEnvSchema>;
export type AppEnv = z.infer<typeof appEnvSchema>;

function lazyEnv<T>(label: string, schema: z.ZodType<T>): () => T {
  let cached: T | undefined;

  return () => {
    if (cached !== undefined) return cached;

    const parsed = schema.safeParse(process.env);

    if (!parsed.success) {
      const details = parsed.error.issues
        .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
      throw new Error(`Invalid ${label} environment:\n${details}`);
    }

    cached = parsed.data;
    return cached;
  };
}

export const databaseEnv = lazyEnv("database", databaseEnvSchema);
export const emailEnv = lazyEnv("email", emailEnvSchema);
export const securityEnv = lazyEnv("security", securityEnvSchema);
export const appEnv = lazyEnv("app", appEnvSchema);

/**
 * Validate everything at once. Not used on request paths — call it from a
 * preflight check or CI step where you *want* one loud failure listing every
 * missing variable.
 */
export function assertServerEnv(): void {
  const errors: string[] = [];

  for (const check of [databaseEnv, emailEnv, securityEnv, appEnv]) {
    try {
      check();
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  if (!process.env["DIRECT_URL"]) {
    errors.push("Invalid database environment:\n  - DIRECT_URL is required");
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}
