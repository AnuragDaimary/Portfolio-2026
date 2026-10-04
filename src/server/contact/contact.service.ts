import { sendEmail } from "@/lib/email/client";
import { contactNotificationEmail } from "@/lib/email/templates/contact-notification";
import { emailEnv } from "@/lib/env";

import { ValidationError } from "../shared/errors";
import { enforceRateLimit } from "../shared/rate-limit";
import * as repository from "./contact.repository";
import {
  contactSubmissionSchema,
  type ContactRequestContext,
} from "./contact.schema";

export interface SubmitContactResult {
  id: string;
  delivered: boolean;
}

/** At most 3 submissions per IP per hour. */
const RATE_LIMIT = { limit: 3, windowSeconds: 60 * 60 } as const;

/**
 * Handle a contact form submission end to end.
 *
 * Order matters: validate, rate limit, THEN persist, then attempt delivery.
 * The message is stored before the email is sent, so a provider outage costs
 * a notification, never the message itself.
 *
 * Pure TypeScript — no Request, no Response, no framework imports. That is
 * what lets this run unchanged behind a different HTTP layer.
 */
export async function submitContact(
  rawInput: unknown,
  context: ContactRequestContext,
): Promise<SubmitContactResult> {
  const parsed = contactSubmissionSchema.safeParse(rawInput);

  if (!parsed.success) {
    throw new ValidationError(toFieldErrors(parsed.error.issues));
  }

  const input = parsed.data;

  // Honeypot: pretend it worked so bots don't learn they were caught.
  if (input.website && input.website.length > 0) {
    const spam = await repository.createSubmission(input, context, "SPAM");
    return { id: spam.id, delivered: false };
  }

  if (context.ipHash) {
    await enforceRateLimit({
      identifier: context.ipHash,
      scope: "contact",
      limit: RATE_LIMIT.limit,
      windowSeconds: RATE_LIMIT.windowSeconds,
    });
  }

  const submission = await repository.createSubmission(input, context);

  const email = contactNotificationEmail({
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
    submittedAt: submission.createdAt,
  });

  const result = await sendEmail({
    to: emailEnv().CONTACT_TO_EMAIL,
    subject: email.subject,
    html: email.html,
    text: email.text,
    replyTo: input.email,
  });

  if (result.ok) {
    await repository.markSubmissionSent(submission.id);
  } else {
    await repository.markSubmissionFailed(submission.id);
    console.error("[contact] email delivery failed", {
      submissionId: submission.id,
      error: result.error,
    });
  }

  return { id: submission.id, delivered: result.ok };
}

/** Collapse Zod issues into { field: [messages] }. */
function toFieldErrors(
  issues: { path: PropertyKey[]; message: string }[],
): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = issue.path.map(String).join(".") || "_";
    (out[key] ??= []).push(issue.message);
  }
  return out;
}
