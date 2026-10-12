import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, afterEach, beforeEach, describe, it } from 'node:test';

import {
  CACHE_POLICY,
  openOfferCache,
  type FetchedOffer,
  type OfferCache,
} from './offer-cache.js';

const DAY = 24 * 60 * 60 * 1000;
const dir = mkdtempSync(path.join(tmpdir(), 'offer-cache-'));
after(() => rmSync(dir, { recursive: true, force: true }));
const file = (name: string) => path.join(dir, `${name}.sqlite`);
const T0 = new Date('2026-10-12T10:00:00.000Z');
const later = (days: number) => new Date(T0.getTime() + days * DAY);

function offer(id: string, extra: Partial<FetchedOffer> = {}): FetchedOffer {
  return { externalId: id, title: `Job ${id}`, company: 'Acme', url: `https://x.test/${id}`, ...extra };
}

describe('offer cache', () => {
  let cache: OfferCache;
  beforeEach(() => {
    cache = openOfferCache(':memory:');
  });
  afterEach(() => cache.close());

  it('inserts fetched offers as pending and tells new from refreshed', () => {
    const first = cache.upsertFetched('u1', 'wttj', [offer('a'), offer('b')], T0);
    assert.deepEqual(first, { inserted: 2, updated: 0, skipped: 0 });
    const again = cache.upsertFetched('u1', 'wttj', [offer('a')], later(1));
    assert.deepEqual(again, { inserted: 0, updated: 1, skipped: 0 });
    assert.equal(cache.listPending('u1').length, 2);
  });

  it('dedupes on (user, platform, external id)', () => {
    cache.upsertFetched('u1', 'wttj', [offer('a')], T0);
    cache.upsertFetched('u1', 'linkedin', [offer('a')], T0);
    cache.upsertFetched('u2', 'wttj', [offer('a')], T0);
    assert.equal(cache.list('u1').length, 2);
    assert.equal(cache.list('u2').length, 1);
  });

  it('keeps one row per external id inside a batch (last wins)', () => {
    const r = cache.upsertFetched('u1', 'wttj', [offer('a', { title: 'old' }), offer('a', { title: 'new' })], T0);
    assert.equal(r.inserted, 1);
    assert.equal(cache.list('u1')[0]?.title, 'new');
  });

  it('skips rows Supabase could not store', () => {
    const r = cache.upsertFetched(
      'u1',
      'wttj',
      [offer('a', { company: '  ' }), offer('b', { url: '' }), { ...offer('c'), externalId: '' }, offer('d')],
      T0,
    );
    assert.deepEqual(r, { inserted: 1, updated: 0, skipped: 3 });
  });

  it('keeps first_seen_at and takes new content and last_seen_at on re-sight', () => {
    cache.upsertFetched('u1', 'wttj', [offer('a', { title: 'v1' })], T0);
    cache.upsertFetched('u1', 'wttj', [offer('a', { title: 'v2', salary: '45K à 60K €' })], later(2));
    const [row] = cache.list('u1');
    assert.equal(row?.title, 'v2');
    assert.equal(row?.salary, '45K à 60K €');
    assert.equal(row?.firstSeenAt, T0.toISOString());
    assert.equal(row?.lastSeenAt, later(2).toISOString());
  });

  it('marks synced rows and takes them out of the pending list', () => {
    cache.upsertFetched('u1', 'wttj', [offer('a'), offer('b')], T0);
    const pending = cache.listPending('u1');
    const n = cache.markSynced('u1', [pending[0]!], later(0));
    assert.equal(n, 1);
    assert.equal(cache.listPending('u1').length, 1);
    assert.equal(cache.list('u1').filter((o) => o.syncedAt).length, 1);
  });

  it('does not mark synced a row fetched again since it was listed', () => {
    cache.upsertFetched('u1', 'wttj', [offer('a')], T0);
    const listed = cache.listPending('u1');
    cache.upsertFetched('u1', 'wttj', [offer('a')], later(1));
    assert.equal(cache.markSynced('u1', listed, later(1)), 0);
    assert.equal(cache.listPending('u1').length, 1);
  });

  it('puts a synced row back to pending when it is fetched again', () => {
    cache.upsertFetched('u1', 'wttj', [offer('a')], T0);
    cache.markSynced('u1', cache.listPending('u1'), T0);
    assert.equal(cache.listPending('u1').length, 0);
    cache.upsertFetched('u1', 'wttj', [offer('a')], later(1));
    assert.equal(cache.listPending('u1').length, 1);
  });

  it('filters by platform and honours the limit', () => {
    cache.upsertFetched('u1', 'wttj', [offer('a'), offer('b'), offer('c')], T0);
    cache.upsertFetched('u1', 'linkedin', [offer('d')], T0);
    assert.equal(cache.listPending('u1', { platformSlug: 'linkedin' }).length, 1);
    assert.equal(cache.list('u1', { limit: 2 }).length, 2);
  });

  it('never returns another user rows', () => {
    cache.upsertFetched('u1', 'wttj', [offer('a')], T0);
    assert.equal(cache.list('u2').length, 0);
    assert.equal(cache.listPending('u2').length, 0);
    assert.equal(cache.markSynced('u2', cache.listPending('u1'), T0), 0);
  });

  it('rejects an empty user id', () => {
    assert.throws(() => cache.upsertFetched('', 'wttj', [offer('a')], T0));
    assert.throws(() => cache.list(' '));
  });

  describe('eviction', () => {
    it('drops synced rows after the synced TTL, keeps fresher ones', () => {
      cache.upsertFetched('u1', 'wttj', [offer('old')], T0);
      cache.upsertFetched('u1', 'wttj', [offer('new')], later(10));
      cache.markSynced('u1', cache.listPending('u1'), later(10));
      const r = cache.evict(later(CACHE_POLICY.syncedTtlDays + 1));
      assert.equal(r.expiredSynced, 1);
      assert.deepEqual(cache.list('u1').map((o) => o.externalId), ['new']);
    });

    it('keeps pending rows past the synced TTL, drops them after the pending TTL', () => {
      cache.upsertFetched('u1', 'wttj', [offer('a')], T0);
      assert.equal(cache.evict(later(CACHE_POLICY.syncedTtlDays + 1)).expiredPending, 0);
      assert.equal(cache.list('u1').length, 1);
      assert.equal(cache.evict(later(CACHE_POLICY.pendingTtlDays + 1)).expiredPending, 1);
      assert.equal(cache.list('u1').length, 0);
    });

    it('caps synced rows per user, oldest first, and never touches pending rows', () => {
      const total = CACHE_POLICY.maxSyncedPerUser + 5;
      const batch = Array.from({ length: total }, (_, i) => offer(`s${i}`));
      // Spread last_seen_at so the order is deterministic: s0 oldest.
      batch.forEach((o, i) => cache.upsertFetched('u1', 'wttj', [o], new Date(T0.getTime() + i * 1000)));
      cache.markSynced('u1', cache.listPending('u1', { limit: total }), T0);
      cache.upsertFetched('u1', 'wttj', [offer('pending-one')], new Date(T0.getTime() + total * 1000));
      const r = cache.evict(new Date(T0.getTime() + total * 1000));
      assert.equal(r.overCap, 5);
      const ids = new Set(cache.list('u1', { limit: total + 10 }).map((o) => o.externalId));
      assert.equal(ids.has('s0'), false);
      assert.equal(ids.has('s4'), false);
      assert.equal(ids.has('s5'), true);
      assert.equal(ids.has('pending-one'), true);
    });

    it('applies on open', () => {
      // A file-backed cache reopened after the TTL loses its expired rows.
      const dbFile = file('x');
      const a = openOfferCache(dbFile);
      a.upsertFetched('u1', 'wttj', [offer('a')], new Date(Date.now() - 40 * DAY));
      a.close();
      const b = openOfferCache(dbFile);
      assert.equal(b.list('u1').length, 0);
      b.close();
    });
  });

  it('clears a user (sign-out) without touching others', () => {
    cache.upsertFetched('u1', 'wttj', [offer('a'), offer('b')], T0);
    cache.upsertFetched('u2', 'wttj', [offer('a')], T0);
    assert.equal(cache.clearUser('u1'), 2);
    assert.equal(cache.list('u1').length, 0);
    assert.equal(cache.list('u2').length, 1);
  });

  it('stores nothing but offer content: fixed column set, no secrets', async () => {
    const dbFile = file('cols');
    const c = openOfferCache(dbFile);
    c.close();
    const { default: Database } = await import('better-sqlite3');
    const raw = new Database(dbFile, { readonly: true });
    const tables = raw.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all() as { name: string }[];
    assert.deepEqual(tables.map((t) => t.name), ['offer_cache']);
    const cols = (raw.prepare('PRAGMA table_info(offer_cache)').all() as { name: string }[]).map((c) => c.name);
    assert.deepEqual(cols, [
      'user_id', 'platform_slug', 'external_id', 'title', 'company', 'url', 'location', 'contract',
      'salary_raw', 'description', 'posted_at', 'first_seen_at', 'last_seen_at', 'synced_at',
    ]);
    raw.close();
  });

  it('rebuilds a cache file written by another schema version', async () => {
    const dbFile = file('ver');
    const { default: Database } = await import('better-sqlite3');
    const old = new Database(dbFile);
    old.exec('CREATE TABLE offer_cache (x TEXT)');
    old.pragma('user_version = 0');
    old.close();
    const c = openOfferCache(dbFile);
    assert.equal(c.upsertFetched('u1', 'wttj', [offer('a')], new Date()).inserted, 1);
    c.close();
  });
});
