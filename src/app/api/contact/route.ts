import { hashedClientIp } from "@/server/shared/hash";
import { jsonError, jsonOk, readJsonBody } from "@/lib/http";
import { submitContact } from "@/server/contact/contact.service";

// Needs Node APIs (crypto, pg) — not the Edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await readJsonBody(request);

    const result = await submitContact(body, {
      ipHash: hashedClientIp(request.headers),
      userAgent: request.headers.get("user-agent"),
      referrer: request.headers.get("referer"),
    });

    // `delivered: false` is not an error for the sender — we stored the
    // message and will retry delivery ourselves.
    return jsonOk(
      {
        id: result.id,
        message: "Thanks — your message came through.",
      },
      201,
    );
  } catch (error) {
    return jsonError(error);
  }
}
