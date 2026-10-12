# Local offers cache

Linear: APP-124. Related: APP-123 (records moved to Supabase), APP-134 (platform sessions on the device), APP-147 (local search runner), APP-148 (remove the legacy scraper). Implementation: `packages/db/src/offer-cache.ts`.

## Rule

Everything the user owns lives in Supabase, per user, under RLS: profiles, searches, applications, interviews, companies, platforms, offers, settings. The desktop app stores locally only:

| Local data | Where | Why |
|---|---|---|
| Fetched offers (the cache) | SQLite, table `offer_cache` | Hold scraping results until they are saved, and serve as an offline read copy. |
| Platform sessions (cookies) | Device keychain / local state, outside this database (APP-134, ADR-004) | Never leave the device. |
| UI preferences (sidebar, column widths, last locale) | Browser `localStorage` | Per-device convenience, not records. |

Audit at APP-124: no app opens SQLite any more (APP-123). The cache was the missing piece, and the old schema in `@apply/db` still described every record. That schema is now only a deprecated import for the unused scraper (`@apply/db/legacy`).

## Cache

One table, offer content only. Key: `(user_id, platform_slug, external_id)`, the same triple `saveOffers` upserts on in Supabase (`offers_user_id_platform_slug_external_id_key`).

Columns: key, `title`, `company`, `url`, `location`, `contract`, `salary_raw`, `description`, `posted_at`, `first_seen_at`, `last_seen_at`, `synced_at`. These are the `ConnectorOffer` fields plus bookkeeping. No cookies, tokens, profile data or search criteria. `user_id` is the opaque Supabase user id and scopes every query, so two accounts on one device never see each other's rows.

API (`@apply/db`): `openOfferCache(path)` then `upsertFetched`, `listPending`, `markSynced`, `list`, `evict`, `clearUser`, `close`.

## Sync rule (cache to Supabase)

1. A connector run returns offers for one search. `upsertFetched` stores them as pending (`synced_at` null). A key seen again keeps `first_seen_at`, takes the new content and `last_seen_at`, and becomes pending again, like `saveOffers` today.
2. The runner calls `listPending`, filters (the second-level filter of APP-80: only offers matching a search or kept by the user are saved), then saves through the user's Supabase session with `saveOffers` (never a service key).
3. For the rows saved, `markSynced` receives the `lastSeenAt` read from `listPending`. A row fetched again in between stays pending.
4. Offers rejected by the filter are not saved; they age out as pending rows (30 days).
5. `user_status` and the user's own edits exist only in Supabase; the cache never carries them.

## Eviction

Ages count from `last_seen_at`. Applied on open and after each sync (`evict`).

| Rows | Rule |
|---|---|
| Synced | Deleted after 14 days (offline copy only). |
| Pending | Deleted after 30 days without being seen again. Never evicted by the cap. |
| Synced, per user | Capped at 2000, oldest first. |
| Sign-out | `clearUser` deletes all rows of that user, unsynced ones included. |

## Decisions and open points

- Plain SQL with better-sqlite3, no Drizzle, no migrations: the cache is disposable and a version bump rebuilds it.
- Not wired into the desktop main process yet: the runner is APP-147. better-sqlite3 is a native module; wiring it needs electron-builder `npmRebuild` back on (it is off since the SQLite removal) or another engine. To decide with APP-147.
- ADR-004 holds unchanged: sessions never reach Supabase. The cache adds no new rule to it, only the scope above.
