import { NextResponse } from "next/server";

import {
  AppError,
  RateLimitError,
  ValidationError,
} from "@/server/shared/errors";

/**
 * The ONLY place that knows about both domain errors and HTTP.
 *
 * Everything under src/server is framework-agnostic; this module is the
 * adapter. Porting the backend to Fastify/Express means rewriting this file
 * and the route handlers, and nothing else.
 */

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string[]>;
  };
}

export function jsonOk<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function jsonError(error: unknown): NextResponse {
  if (error instanceof ValidationError) {
    return NextResponse.json<ApiErrorBody>(
      {
        error: {
          code: error.code,
          message: error.message,
          fieldErrors: error.fieldErrors,
        },
      },
      { status: 400 },
    );
  }

  if (error instanceof RateLimitError) {
    return NextResponse.json<ApiErrorBody>(
      { error: { code: error.code, message: error.message } },
      {
        status: 429,
        headers: { "Retry-After": String(error.retryAfter) },
      },
    );
  }

  if (error instanceof AppError) {
    const status = error.code === "NOT_FOUND" ? 404 : 500;
    return NextResponse.json<ApiErrorBody>(
      { error: { code: error.code, message: error.message } },
      { status },
    );
  }

  // Unknown failure: log the detail, tell the client nothing useful to an attacker.
  console.error("[api] unhandled error", error);

  return NextResponse.json<ApiErrorBody>(
    { error: { code: "INTERNAL", message: "Something went wrong." } },
    { status: 500 },
  );
}

/** Parse a JSON body, turning malformed JSON into a clean 400. */
export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ValidationError({ _: ["Request body must be valid JSON."] });
  }
}
