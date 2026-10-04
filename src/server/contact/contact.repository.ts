import type { ContactSubmission, SubmissionStatus } from "@prisma/client";

import { db } from "@/lib/db";

import type {
  ContactRequestContext,
  ContactSubmissionInput,
} from "./contact.schema";

/**
 * All contact-related database access lives here. The service layer never
 * touches Prisma directly, so switching the data store means rewriting this
 * file only.
 */

export async function createSubmission(
  input: ContactSubmissionInput,
  context: ContactRequestContext,
  status: SubmissionStatus = "PENDING",
): Promise<ContactSubmission> {
  return db.contactSubmission.create({
    data: {
      name: input.name,
      email: input.email,
      subject: input.subject ?? null,
      message: input.message,
      status,
      ipHash: context.ipHash,
      userAgent: context.userAgent,
      referrer: context.referrer,
    },
  });
}

export async function markSubmissionSent(id: string): Promise<void> {
  await db.contactSubmission.update({
    where: { id },
    data: { status: "SENT" },
  });
}

export async function markSubmissionFailed(id: string): Promise<void> {
  await db.contactSubmission.update({
    where: { id },
    data: { status: "FAILED", failureCount: { increment: 1 } },
  });
}

/** Submissions stored but never delivered — for a retry job or admin view. */
export async function listFailedSubmissions(
  limit = 50,
): Promise<ContactSubmission[]> {
  return db.contactSubmission.findMany({
    where: { status: "FAILED" },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
