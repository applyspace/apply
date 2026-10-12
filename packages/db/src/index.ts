/**
 * `@apply/db` — the local offers cache of the desktop app (APP-124), nothing else.
 *
 * User records live in Supabase. Types and enum tokens for them are in
 * `@apply/core/records`. The former SQLite schema is under `@apply/db/legacy`
 * (deprecated, scraper only, removed by APP-148).
 */

export * from './offer-cache.js';
