import Database, { type Database as SqliteDatabase } from 'better-sqlite3';

/**
 * Local offers cache (APP-124): the ONLY thing the desktop app keeps in SQLite.
 *
 * Records (offers, searches, applications, companies, profiles, platforms) live
 * in Supabase per user. The cache holds fetched offers in two situations:
 *   - `pending`: fetched on this device, not saved to Supabase yet;
 *   - `synced`: saved, kept for a while as an offline read copy.
 * Platform sessions (cookies) are never stored here (ADR-004).
 *
 * The table is disposable: a schema change bumps `SCHEMA_VERSION`, and a
 * mismatching file is dropped and recreated. No migrations.
 */

export const SCHEMA_VERSION = 1;

/** Eviction policy. Ages are counted from `last_seen_at`. */
export const CACHE_POLICY = {
  /** Synced rows are only an offline copy: forget them after 14 days. */
  syncedTtlDays: 14,
  /** Unsynced rows whose listing was not seen again for 30 days are stale: drop them. */
  pendingTtlDays: 30,
  /** Hard cap on synced rows per user (oldest `last_seen_at` go first). Pending rows are never evicted by the cap. */
  maxSyncedPerUser: 2000,
} as const;

/**
 * Identity of an offer. Same triple as the Supabase unique key
 * `(user_id, platform_slug, external_id)` that `saveOffers` upserts on.
 */
export interface OfferRef {
  platformSlug: string;
  externalId: string;
}

/** One offer as a connector returns it (mirrors `ConnectorOffer` in apps/web). Offer content only. */
export interface FetchedOffer {
  externalId: string;
  title: string;
  company: string;
  url: string;
  location?: string;
  contract?: string;
  /** Raw salary text, parsed on save. */
  salary?: string;
  description?: string;
  /** ISO date. */
  postedAt?: string;
}

export interface CachedOffer extends OfferRef {
  userId: string;
  title: string;
  company: string;
  url: string;
  location: string;
  contract: string | null;
  salary: string | null;
  description: string;
  postedAt: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
  /** Null while the row waits to be saved to Supabase. */
  syncedAt: string | null;
}

/** A row to mark as saved; `lastSeenAt` must be the value read from `listPending`. */
export interface SyncedRef extends OfferRef {
  lastSeenAt: string;
}

export interface UpsertResult {
  inserted: number;
  updated: number;
  /** Rows skipped for a missing id, url, title or company (same rule as `saveOffers`). */
  skipped: number;
}

export interface EvictResult {
  expiredSynced: number;
  expiredPending: number;
  overCap: number;
}

export interface ListOptions {
  platformSlug?: string;
  limit?: number;
}

export interface OfferCache {
  /**
   * Store offers just fetched for `userId`. A new key is inserted as pending; a key
   * already cached keeps its `first_seen_at`, takes the new content and `last_seen_at`
   * and becomes pending again (Supabase gets the refreshed row, like `saveOffers`).
   */
  upsertFetched(
    userId: string,
    platformSlug: string,
    offers: FetchedOffer[],
    now?: Date,
  ): UpsertResult;
  /** Offers waiting to be saved to Supabase, oldest first. */
  listPending(userId: string, options?: ListOptions): CachedOffer[];
  /**
   * Mark rows as saved. A row fetched again since `listPending` (different `lastSeenAt`)
   * stays pending. Returns the number of rows marked.
   */
  markSynced(userId: string, refs: SyncedRef[], now?: Date): number;
  /** Offline read: cached offers (pending and synced), most recently seen first. */
  list(userId: string, options?: ListOptions): CachedOffer[];
  /** Apply the eviction policy. */
  evict(now?: Date): EvictResult;
  /** Delete everything cached for a user (sign-out). Unsynced rows are lost. */
  clearUser(userId: string): number;
  close(): void;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_LIMIT = 500;

const CREATE_SQL = `
CREATE TABLE offer_cache (
  user_id       TEXT NOT NULL,
  platform_slug TEXT NOT NULL,
  external_id   TEXT NOT NULL,
  title         TEXT NOT NULL,
  company       TEXT NOT NULL,
  url           TEXT NOT NULL,
  location      TEXT NOT NULL DEFAULT '',
  contract      TEXT,
  salary_raw    TEXT,
  description   TEXT NOT NULL DEFAULT '',
  posted_at     TEXT,
  first_seen_at TEXT NOT NULL,
  last_seen_at  TEXT NOT NULL,
  synced_at     TEXT,
  PRIMARY KEY (user_id, platform_slug, external_id)
);
CREATE INDEX idx_offer_cache_sync ON offer_cache (user_id, synced_at);
CREATE INDEX idx_offer_cache_last_seen ON offer_cache (last_seen_at);
`;

interface Row {
  user_id: string;
  platform_slug: string;
  external_id: string;
  title: string;
  company: string;
  url: string;
  location: string;
  contract: string | null;
  salary_raw: string | null;
  description: string;
  posted_at: string | null;
  first_seen_at: string;
  last_seen_at: string;
  synced_at: string | null;
}

function toCached(r: Row): CachedOffer {
  return {
    userId: r.user_id,
    platformSlug: r.platform_slug,
    externalId: r.external_id,
    title: r.title,
    company: r.company,
    url: r.url,
    location: r.location,
    contract: r.contract,
    salary: r.salary_raw,
    description: r.description,
    postedAt: r.posted_at,
    firstSeenAt: r.first_seen_at,
    lastSeenAt: r.last_seen_at,
    syncedAt: r.synced_at,
  };
}

function requireText(name: string, value: string): void {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`${name} is required`);
}

function limitOf(options?: ListOptions): number {
  const n = options?.limit ?? DEFAULT_LIMIT;
  return Number.isInteger(n) && n > 0 ? n : DEFAULT_LIMIT;
}

/**
 * Open (or create) the cache at `dbPath` (`:memory:` for tests). A file written by
 * another schema version is dropped and rebuilt; expired rows are evicted on open.
 */
export function openOfferCache(dbPath: string): OfferCache {
  const raw: SqliteDatabase = new Database(dbPath);
  raw.pragma('journal_mode = WAL');
  raw.pragma('synchronous = NORMAL');

  const version = raw.pragma('user_version', { simple: true }) as number;
  if (version !== SCHEMA_VERSION) {
    raw.exec('DROP TABLE IF EXISTS offer_cache');
    raw.exec(CREATE_SQL);
    raw.pragma(`user_version = ${SCHEMA_VERSION}`);
  }

  const find = raw.prepare<[string, string, string], { one: 1 }>(
    'SELECT 1 AS one FROM offer_cache WHERE user_id = ? AND platform_slug = ? AND external_id = ?',
  );
  const upsert = raw.prepare(`
    INSERT INTO offer_cache
      (user_id, platform_slug, external_id, title, company, url, location, contract,
       salary_raw, description, posted_at, first_seen_at, last_seen_at, synced_at)
    VALUES
      (@userId, @platformSlug, @externalId, @title, @company, @url, @location, @contract,
       @salary, @description, @postedAt, @now, @now, NULL)
    ON CONFLICT (user_id, platform_slug, external_id) DO UPDATE SET
      title = excluded.title, company = excluded.company, url = excluded.url,
      location = excluded.location, contract = excluded.contract,
      salary_raw = excluded.salary_raw, description = excluded.description,
      posted_at = excluded.posted_at, last_seen_at = excluded.last_seen_at,
      synced_at = NULL
  `);
  const markOne = raw.prepare(`
    UPDATE offer_cache SET synced_at = ?
    WHERE user_id = ? AND platform_slug = ? AND external_id = ?
      AND last_seen_at = ? AND synced_at IS NULL
  `);

  const cache: OfferCache = {
    upsertFetched(userId, platformSlug, offers, now = new Date()) {
      requireText('userId', userId);
      requireText('platformSlug', platformSlug);
      // One row per external id (last one wins), skipping rows Supabase could not store.
      const byId = new Map<string, FetchedOffer>();
      let skipped = 0;
      for (const o of offers) {
        if (o.externalId && o.url && o.title && o.company?.trim()) byId.set(o.externalId, o);
        else skipped += 1;
      }
      const stamp = now.toISOString();
      let inserted = 0;
      let updated = 0;
      raw.transaction(() => {
        for (const o of byId.values()) {
          if (find.get(userId, platformSlug, o.externalId)) updated += 1;
          else inserted += 1;
          upsert.run({
            userId,
            platformSlug,
            externalId: o.externalId,
            title: o.title,
            company: o.company.trim(),
            url: o.url,
            location: o.location ?? '',
            contract: o.contract ?? null,
            salary: o.salary ?? null,
            description: o.description ?? '',
            postedAt: o.postedAt ?? null,
            now: stamp,
          });
        }
      })();
      return { inserted, updated, skipped };
    },

    listPending(userId, options) {
      requireText('userId', userId);
      const rows = raw
        .prepare<[string, string | null, string | null, number], Row>(
          `SELECT * FROM offer_cache
           WHERE user_id = ? AND synced_at IS NULL AND (? IS NULL OR platform_slug = ?)
           ORDER BY first_seen_at, platform_slug, external_id LIMIT ?`,
        )
        .all(userId, options?.platformSlug ?? null, options?.platformSlug ?? null, limitOf(options));
      return rows.map(toCached);
    },

    markSynced(userId, refs, now = new Date()) {
      requireText('userId', userId);
      const stamp = now.toISOString();
      let marked = 0;
      raw.transaction(() => {
        for (const r of refs) {
          marked += markOne.run(stamp, userId, r.platformSlug, r.externalId, r.lastSeenAt).changes;
        }
      })();
      return marked;
    },

    list(userId, options) {
      requireText('userId', userId);
      const rows = raw
        .prepare<[string, string | null, string | null, number], Row>(
          `SELECT * FROM offer_cache
           WHERE user_id = ? AND (? IS NULL OR platform_slug = ?)
           ORDER BY last_seen_at DESC, platform_slug, external_id LIMIT ?`,
        )
        .all(userId, options?.platformSlug ?? null, options?.platformSlug ?? null, limitOf(options));
      return rows.map(toCached);
    },

    evict(now = new Date()) {
      const syncedCutoff = new Date(now.getTime() - CACHE_POLICY.syncedTtlDays * DAY_MS).toISOString();
      const pendingCutoff = new Date(now.getTime() - CACHE_POLICY.pendingTtlDays * DAY_MS).toISOString();
      let result: EvictResult = { expiredSynced: 0, expiredPending: 0, overCap: 0 };
      raw.transaction(() => {
        const expiredSynced = raw
          .prepare('DELETE FROM offer_cache WHERE synced_at IS NOT NULL AND last_seen_at < ?')
          .run(syncedCutoff).changes;
        const expiredPending = raw
          .prepare('DELETE FROM offer_cache WHERE synced_at IS NULL AND last_seen_at < ?')
          .run(pendingCutoff).changes;
        let overCap = 0;
        const users = raw
          .prepare<[number], { user_id: string }>(
            'SELECT user_id FROM offer_cache WHERE synced_at IS NOT NULL GROUP BY user_id HAVING COUNT(*) > ?',
          )
          .all(CACHE_POLICY.maxSyncedPerUser);
        const trim = raw.prepare(`
          DELETE FROM offer_cache WHERE rowid IN (
            SELECT rowid FROM offer_cache WHERE user_id = ? AND synced_at IS NOT NULL
            ORDER BY last_seen_at DESC, platform_slug, external_id LIMIT -1 OFFSET ?
          )`);
        for (const u of users) overCap += trim.run(u.user_id, CACHE_POLICY.maxSyncedPerUser).changes;
        result = { expiredSynced, expiredPending, overCap };
      })();
      return result;
    },

    clearUser(userId) {
      requireText('userId', userId);
      return raw.prepare('DELETE FROM offer_cache WHERE user_id = ?').run(userId).changes;
    },

    close() {
      raw.close();
    },
  };

  cache.evict();
  return cache;
}
