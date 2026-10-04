import { db } from "@/lib/db";

import { RateLimitError } from "./errors";

export interface RateLimitOptions {
  /** Stable identifier for the caller, e.g. a hashed IP. */
  identifier: string;
  /** Namespace so different endpoints don't share a budget. */
  scope: string;
  /** Max requests allowed inside the window. */
  limit: number;
  /** Window length in seconds. */
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
}

/**
 * Fixed-window rate limiting backed by Postgres.
 *
 * Deliberately not in-memory: on serverless every cold start would reset the
 * counter, which makes an in-memory limiter close to decorative. If this ever
 * becomes a hot path, swap the body for Redis — the signature stays the same.
 */
export async function checkRateLimit(
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  const { identifier, scope, limit, windowSeconds } = options;

  const key = `${scope}:${identifier}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowSeconds * 1000);

  const existing = await db.rateLimit.findUnique({ where: { key } });

  // No record, or the previous window has lapsed — start a fresh window.
  if (!existing || existing.expiresAt <= now) {
    await db.rateLimit.upsert({
      where: { key },
      create: { key, count: 1, expiresAt },
      update: { count: 1, expiresAt },
    });
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }

  const retryAfter = Math.max(
    1,
    Math.ceil((existing.expiresAt.getTime() - now.getTime()) / 1000),
  );

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, retryAfter };
  }

  const updated = await db.rateLimit.update({
    where: { key },
    data: { count: { increment: 1 } },
  });

  return {
    allowed: true,
    remaining: Math.max(0, limit - updated.count),
    retryAfter,
  };
}

/** Same check, but throws instead of returning a flag. */
export async function enforceRateLimit(
  options: RateLimitOptions,
): Promise<void> {
  const result = await checkRateLimit(options);
  if (!result.allowed) {
    throw new RateLimitError(result.retryAfter);
  }
}
