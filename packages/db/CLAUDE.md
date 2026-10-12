# packages/db — Claude instructions

> For git conventions and monorepo structure, see the root [CLAUDE.md](../../CLAUDE.md).

## Purpose

The local offers cache of the desktop app (APP-124), and nothing else. Design, sync rule and eviction: [docs/offers-cache.md](../../docs/offers-cache.md).

## Stack

- better-sqlite3, plain SQL (no ORM, no migrations): the cache is disposable, a schema change bumps `SCHEMA_VERSION` and old files are rebuilt.
- API in `src/offer-cache.ts` (`openOfferCache`), tests next to it: `pnpm --filter @apply/db test`.

## Rules

- One table, `offer_cache`. Do not add another kind of data here: user records live in Supabase (types in `@apply/core/records`), platform sessions stay on the device outside this database (ADR-004).
- The key mirrors the Supabase unique key `(user_id, platform_slug, external_id)`. Every read and write is scoped by user id.
- Never store cookies, tokens, credentials or profile data. Offer content only.
- `src/legacy` and `drizzle/legacy-migrations` are the former full schema, kept only for `packages/scraper`. Do not import them elsewhere; APP-148 deletes them with the scraper.
