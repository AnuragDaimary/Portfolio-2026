import { db } from "@/lib/db";
import { jsonOk } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Liveness + database connectivity. Useful as an uptime-monitor target and as
 * the first thing to curl when a deploy looks wrong.
 */
export async function GET(): Promise<Response> {
  const startedAt = Date.now();

  try {
    await db.$queryRaw`SELECT 1`;
    return jsonOk({
      status: "ok",
      database: "connected",
      latencyMs: Date.now() - startedAt,
    });
  } catch (error) {
    console.error("[health] database check failed", error);
    return jsonOk(
      {
        status: "degraded",
        database: "unreachable",
        latencyMs: Date.now() - startedAt,
      },
      503,
    );
  }
}
