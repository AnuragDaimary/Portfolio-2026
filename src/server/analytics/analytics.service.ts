import { ValidationError } from "../shared/errors";
import * as repository from "./analytics.repository";
import {
  recordViewSchema,
  slugSchema,
  type ViewRequestContext,
} from "./analytics.schema";

/** A repeat view from the same visitor inside this window doesn't re-count. */
const DEDUPE_WINDOW_SECONDS = 60 * 30;

export interface RecordViewResult {
  slug: string;
  count: number;
  counted: boolean;
}

/**
 * Record a page view and return the running total.
 *
 * De-duplicated per visitor so a refresh doesn't inflate the number; when the
 * visitor can't be identified we count it rather than lose it.
 */
export async function recordView(
  rawInput: unknown,
  context: ViewRequestContext,
): Promise<RecordViewResult> {
  const parsed = recordViewSchema.safeParse(rawInput);

  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.map(String).join(".") || "_";
      (fieldErrors[key] ??= []).push(issue.message);
    }
    throw new ValidationError(fieldErrors);
  }

  const { slug, referrer, country } = parsed.data;

  if (context.visitorHash) {
    const seen = await repository.hasRecentView(
      slug,
      context.visitorHash,
      DEDUPE_WINDOW_SECONDS,
    );

    if (seen) {
      return { slug, count: await repository.getViewCount(slug), counted: false };
    }
  }

  const count = await repository.incrementViewCount(slug);

  await repository.recordViewEvent({
    slug,
    visitorHash: context.visitorHash,
    referrer: referrer ?? null,
    country: country ?? null,
  });

  return { slug, count, counted: true };
}

/** Read a single counter without mutating it. */
export async function getViews(rawSlug: unknown): Promise<RecordViewResult> {
  const parsed = slugSchema.safeParse(rawSlug);

  if (!parsed.success) {
    throw new ValidationError({
      slug: parsed.error.issues.map((issue) => issue.message),
    });
  }

  return {
    slug: parsed.data,
    count: await repository.getViewCount(parsed.data),
    counted: false,
  };
}

/** Batch read, for rendering a list of projects with their view counts. */
export async function getViewsForSlugs(
  rawSlugs: unknown,
): Promise<Record<string, number>> {
  if (!Array.isArray(rawSlugs)) {
    throw new ValidationError({ slugs: ["Expected an array of slugs."] });
  }

  const slugs: string[] = [];
  for (const candidate of rawSlugs) {
    const parsed = slugSchema.safeParse(candidate);
    if (parsed.success) slugs.push(parsed.data);
  }

  if (slugs.length === 0) return {};

  return repository.getViewCounts(slugs);
}
