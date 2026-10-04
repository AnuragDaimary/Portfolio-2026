import { Resend } from "resend";

import { emailEnv } from "@/lib/env";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Set so a reply goes to the person who filled in the form. */
  replyTo?: string;
}

export interface SendEmailResult {
  ok: boolean;
  id?: string;
  error?: string;
}

let client: Resend | undefined;

function getClient(): Resend {
  return (client ??= new Resend(emailEnv().RESEND_API_KEY));
}

/**
 * Thin wrapper over the mail provider. Returns a result instead of throwing,
 * because a delivery failure should not lose the submission — the caller
 * stores it either way and marks it FAILED for later retry.
 *
 * Swapping Resend for SES/Postmark means changing this file only.
 */
export async function sendEmail(
  options: SendEmailOptions,
): Promise<SendEmailResult> {
  const env = emailEnv();

  try {
    const { data, error } = await getClient().emails.send({
      from: env.CONTACT_FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      ...(options.replyTo ? { replyTo: options.replyTo } : {}),
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, ...(data?.id ? { id: data.id } : {}) };
  } catch (cause) {
    return {
      ok: false,
      error: cause instanceof Error ? cause.message : "Unknown email error",
    };
  }
}

/** Test-only: drop the memoized Resend client. */
export function resetEmailClient(): void {
  client = undefined;
}
