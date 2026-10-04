import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { appEnv, databaseEnv } from "@/lib/env";

/**
 * Prisma 7 requires an explicit driver adapter. We point it at the *pooled*
 * DATABASE_URL — migrations use the direct URL via prisma.config.ts instead.
 *
 * The client is cached on globalThis so Next.js hot reload in development
 * doesn't open a new connection pool on every file change.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  const nodeEnv = appEnv().NODE_ENV;

  const client = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseEnv().DATABASE_URL }),
    log: nodeEnv === "development" ? ["warn", "error"] : ["error"],
  });

  if (nodeEnv !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

export function getDb(): PrismaClient {
  return (globalForPrisma.prisma ??= createPrismaClient());
}

/**
 * Ergonomic handle: `db.contactSubmission.create(...)`.
 *
 * It's a Proxy so that nothing connects — and no env var is read — until a
 * property is actually touched. Importing this module stays side-effect free,
 * which is what lets `next build` and unit tests run without a live database.
 */
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});
