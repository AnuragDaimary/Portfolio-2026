# Portfolio 2026 — Backend

Next.js (App Router) API routes on Postgres via Prisma. Two features are live:
a contact form with email delivery, and per-page view counts.

## Architecture

The layout exists to keep business logic independent of the web framework:

```
src/
├── app/api/            HTTP adapters — thin. Parse request, call a service,
│   ├── contact/        map errors to status codes. No logic lives here.
│   ├── views/[slug]/
│   └── health/
│
├── server/             ← the actual backend. Pure TypeScript, zero framework
│   ├── contact/           imports. This is the portable part.
│   │   ├── contact.schema.ts       Zod validation, shared with the frontend
│   │   ├── contact.repository.ts   all Prisma calls for this domain
│   │   └── contact.service.ts      orchestration + business rules
│   ├── analytics/      same three-file shape
│   └── shared/         errors, rate limiting, IP hashing
│
└── lib/                framework/vendor bindings
    ├── db.ts           Prisma client (lazy — importing it connects nothing)
    ├── env.ts          Zod-validated environment, grouped by concern
    ├── http.ts         the only module that knows domain errors AND HTTP
    └── email/          Resend wrapper + templates
```

**Why this shape:** you asked whether you could switch stacks later. The answer
depends entirely on this boundary. `src/server/**` imports nothing from Next —
no `Request`, no `Response`, no `next/*`. So:

- **Switching to Fastify/Express/Hono** — rewrite `src/lib/http.ts` and the
  three files under `src/app/api/`. That's roughly 120 lines total. Every
  service, schema and repository moves across untouched.
- **Switching database** — each domain's Prisma calls are isolated in its
  `*.repository.ts`. Postgres → MySQL/SQLite is a `provider` change plus a new
  migration. Postgres → MongoDB means rewriting the two repository files.
- **Switching email provider** — `src/lib/email/client.ts` only.

Environment variables are validated in independent groups (`databaseEnv()`,
`emailEnv()`, `securityEnv()`) rather than as one object, so a missing email
key can't break an unrelated code path like IP hashing.

The cost of this is one extra file per domain. It's the reason the question
"can I change my mind later" has a cheap answer.

## Setup

1. Create a Postgres database ([Neon](https://neon.tech) and
   [Supabase](https://supabase.com) both have usable free tiers).
2. Copy the env template and fill it in:
   ```bash
   cp .env.example .env
   ```
   - `DATABASE_URL` — pooled connection, used at runtime
   - `DIRECT_URL` — unpooled connection, used by migrations only
   - `RESEND_API_KEY` — from [Resend](https://resend.com); the sending domain
     must be verified before mail will go out
   - `IP_HASH_SALT` — already generated for you in `.env`
3. Create the tables:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Run it:
   ```bash
   npm run dev
   ```

## Endpoints

| Method | Path                | Purpose                                  |
| ------ | ------------------- | ---------------------------------------- |
| `POST` | `/api/contact`      | Submit the contact form                  |
| `GET`  | `/api/views/[slug]` | Read a view count                        |
| `POST` | `/api/views/[slug]` | Record a view (de-duplicated per visitor)|
| `GET`  | `/api/health`       | Liveness + database connectivity         |

```bash
curl -X POST localhost:3000/api/contact \
  -H 'content-type: application/json' \
  -d '{"name":"Test","email":"a@b.com","message":"Hello there, testing."}'
```

## Behaviour worth knowing

- **Messages are stored before email is attempted.** A Resend outage marks the
  row `FAILED` and returns success to the sender — the message is never lost.
  `listFailedSubmissions()` is there for a retry job.
- **Rate limiting is database-backed**, not in-memory: 3 contact submissions
  per IP per hour. In-memory counters reset on every serverless cold start,
  which makes them close to decorative.
- **Raw IPs are never stored.** Only an HMAC-SHA256 digest salted with
  `IP_HASH_SALT`, used for rate limiting and view de-duplication.
- **The contact form has a honeypot field** (`website`). Filled means bot: the
  row is marked `SPAM` and a success response is returned anyway.
- **View counts de-duplicate per visitor for 30 minutes**, so a refresh doesn't
  inflate the number.

## Housekeeping

`PageViewEvent` grows one row per counted view. If it ever gets large:

```bash
npx tsx scripts/prune-view-events.ts 90
```

## Known issues

`npm audit` reports 4 high-severity advisories in `deepmerge-ts` and `mysql2`.
Both are transitive dependencies of the **Prisma CLI** (a devDependency), not
of anything that ships to production — and `mysql2` isn't reachable at all on
Postgres. `npm audit fix --force` "fixes" them by downgrading to Prisma 6,
which is worse. Left as-is deliberately; revisit when Prisma 8 ships stable.
