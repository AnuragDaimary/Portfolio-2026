/**
 * Domain errors. The service layer throws these; the HTTP adapter layer maps
 * them to status codes. Keeping them framework-free is what makes the services
 * portable to a different server later.
 */

export type AppErrorCode =
  | "VALIDATION_FAILED"
  | "RATE_LIMITED"
  | "NOT_FOUND"
  | "EMAIL_DELIVERY_FAILED"
  | "INTERNAL";

export class AppError extends Error {
  readonly code: AppErrorCode;
  /** Extra context for logs — never returned to the client verbatim. */
  readonly meta: Record<string, unknown>;

  constructor(
    code: AppErrorCode,
    message: string,
    meta: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.meta = meta;
  }
}

export class ValidationError extends AppError {
  readonly fieldErrors: Record<string, string[]>;

  constructor(fieldErrors: Record<string, string[]>) {
    super("VALIDATION_FAILED", "The submitted data was invalid.");
    this.name = "ValidationError";
    this.fieldErrors = fieldErrors;
  }
}

export class RateLimitError extends AppError {
  /** Seconds until the caller may retry. */
  readonly retryAfter: number;

  constructor(retryAfter: number) {
    super("RATE_LIMITED", "Too many requests.", { retryAfter });
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}
