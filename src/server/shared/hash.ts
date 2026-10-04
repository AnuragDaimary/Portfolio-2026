import { createHmac } from "node:crypto";

import { securityEnv } from "@/lib/env";

/**
 * One-way salted hash for values we must recognise but must not store:
 * visitor IPs, primarily. HMAC-SHA256 with a server-side secret means the
 * stored digest isn't reversible by rainbow table even if the DB leaks.
 */
export function hashIdentifier(value: string): string {
  return createHmac("sha256", securityEnv().IP_HASH_SALT)
    .update(value.trim().toLowerCase())
    .digest("hex");
}

/**
 * Best-effort client IP from proxy headers. Vercel/Cloudflare set these;
 * the first entry of x-forwarded-for is the original client.
 */
export function clientIpFrom(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip") ?? headers.get("cf-connecting-ip");
}

/** Convenience: hashed client IP, or null when it can't be determined. */
export function hashedClientIp(headers: Headers): string | null {
  const ip = clientIpFrom(headers);
  return ip ? hashIdentifier(ip) : null;
}
