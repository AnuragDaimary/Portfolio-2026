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
// `prisma generate` only reads the schema and never connects, so it must not demand a
// database URL: `npm run build` runs it, and a fresh deploy (Vercel/CI) may have no database
// variables at all while the site itself is static. Every command that does connect
// (migrate, studio, db push) still requires DIRECT_URL and fails loudly if it is missing.
const isGenerate = process.argv.includes("generate");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: isGenerate
      ? (process.env.DIRECT_URL ?? "postgresql://unused:unused@localhost:5432/unused")
      : env("DIRECT_URL"),
  },
});
