import { db } from "@/lib/db";

/**
 * All analytics database access. Counter updates are atomic at the database
 * level — two concurrent readers of the same page cannot lose an increment
 * the way a read-modify-write in application code would.
 */

export async function incrementViewCount(slug: string): Promise<number> {
  const row = await db.pageView.upsert({
    where: { slug },
    create: { slug, count: 1 },
    update: { count: { increment: 1 } },
  });
  return row.count;
}

export async function recordViewEvent(params: {
  slug: string;
  visitorHash: string | null;
  referrer: string | null;
  country: string | null;
}): Promise<void> {
  await db.pageViewEvent.create({ data: params });
}

export async function getViewCount(slug: string): Promise<number> {
  const row = await db.pageView.findUnique({ where: { slug } });
  return row?.count ?? 0;
}

export async function getViewCounts(
  slugs: string[],
): Promise<Record<string, number>> {
  const rows = await db.pageView.findMany({
    where: { slug: { in: slugs } },
  });

  const counts: Record<string, number> = {};
  for (const slug of slugs) counts[slug] = 0;
  for (const row of rows) counts[row.slug] = row.count;
  return counts;
}

/** Has this visitor already been counted for this slug inside the window? */
export async function hasRecentView(
  slug: string,
  visitorHash: string,
  withinSeconds: number,
): Promise<boolean> {
  const since = new Date(Date.now() - withinSeconds * 1000);

  const existing = await db.pageViewEvent.findFirst({
    where: { slug, visitorHash, createdAt: { gte: since } },
    select: { id: true },
  });

  return existing !== null;
}

/** Housekeeping for the granular event table. */
export async function pruneViewEventsOlderThan(days: number): Promise<number> {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const { count } = await db.pageViewEvent.deleteMany({
    where: { createdAt: { lt: cutoff } },
  });
  return count;
}
