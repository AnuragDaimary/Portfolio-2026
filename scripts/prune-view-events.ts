/**
 * Delete PageViewEvent rows older than N days. The aggregate counts in
 * PageView are untouched — only the granular event log is trimmed.
 *
 *   npx tsx scripts/prune-view-events.ts 90
 */
import { pruneViewEventsOlderThan } from "../src/server/analytics/analytics.repository";

const days = Number(process.argv[2] ?? 90);

if (!Number.isFinite(days) || days < 1) {
  console.error("Usage: prune-view-events.ts <days>");
  process.exit(1);
}

const deleted = await pruneViewEventsOlderThan(days);
console.log(`Pruned ${deleted} view events older than ${days} days.`);
