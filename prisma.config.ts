import { defineConfig, env } from "prisma/config";

// Prisma 7 no longer auto-loads .env. Node 22+ can do it natively, so we don't
// need a dotenv dependency. Missing file is fine — CI/hosting inject real vars.
try {
  process.loadEnvFile(".env");
} catch {
  // no local .env — expected in CI and on the hosting platform
}

/**
 * Prisma CLI configuration (migrate / introspect / studio).
 *
 * Runtime connections do NOT come from here — the app builds its own
 * PrismaClient with a driver adapter in src/lib/db.ts. This URL is the
 * *direct*, unpooled connection, because migrations cannot run through a
 * transaction pooler.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
