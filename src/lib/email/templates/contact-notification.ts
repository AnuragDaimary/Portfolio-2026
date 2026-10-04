export interface ContactNotificationData {
  name: string;
  email: string;
  subject?: string | undefined;
  message: string;
  submittedAt: Date;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Notification sent to the site owner when someone submits the contact form.
 * Every interpolated value is escaped — the message body is attacker-controlled.
 */
export function contactNotificationEmail(data: ContactNotificationData): {
  subject: string;
  html: string;
  text: string;
} {
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeSubject = data.subject ? escapeHtml(data.subject) : "(no subject)";
  const safeMessage = escapeHtml(data.message).replace(/\n/g, "<br />");

  const subject = data.subject
    ? `Portfolio contact: ${data.subject}`
    : `Portfolio contact from ${data.name}`;

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f5f5f5;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;color:#18181b;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:28px;">
      <h1 style="margin:0 0 20px;font-size:17px;font-weight:600;">New contact form submission</h1>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:6px 0;color:#71717a;width:90px;">From</td>
          <td style="padding:6px 0;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#71717a;">Email</td>
          <td style="padding:6px 0;"><a href="mailto:${safeEmail}" style="color:#2563eb;">${safeEmail}</a></td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#71717a;">Subject</td>
          <td style="padding:6px 0;">${safeSubject}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#71717a;">Received</td>
          <td style="padding:6px 0;">${data.submittedAt.toISOString()}</td>
        </tr>
      </table>
      <div style="margin-top:20px;padding-top:20px;border-top:1px solid #e4e4e7;font-size:14px;line-height:1.6;white-space:pre-wrap;">${safeMessage}</div>
    </div>
  </body>
</html>`;

  const text = [
    "New contact form submission",
    "",
    `From:     ${data.name}`,
    `Email:    ${data.email}`,
    `Subject:  ${data.subject ?? "(no subject)"}`,
    `Received: ${data.submittedAt.toISOString()}`,
    "",
    "---",
    "",
    data.message,
  ].join("\n");

  return { subject, html, text };
}
