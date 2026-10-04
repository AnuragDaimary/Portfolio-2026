import { jsonError, jsonOk } from "@/lib/http";
import { getViews, recordView } from "@/server/analytics/analytics.service";
import { hashedClientIp } from "@/server/shared/hash";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

/** Read the current view count without incrementing it. */
export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<Response> {
  try {
    const { slug } = await context.params;
    return jsonOk(await getViews(slug));
  } catch (error) {
    return jsonError(error);
  }
}

/** Register a view. De-duplicated per visitor inside the service. */
export async function POST(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  try {
    const { slug } = await context.params;

    const result = await recordView(
      {
        slug,
        referrer: request.headers.get("referer") ?? undefined,
      },
      { visitorHash: hashedClientIp(request.headers) },
    );

    return jsonOk(result);
  } catch (error) {
    return jsonError(error);
  }
}
