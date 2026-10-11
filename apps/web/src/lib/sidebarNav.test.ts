import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SIDEBAR_DEFAULT_WIDTH,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
  clampSidebarWidth,
  countActiveApplications,
  countUpcomingInterviews,
  formatNavCount,
  isNavActive,
  isSidebarShortcut,
  parseSidebarWidth,
} from './sidebarNav.ts';

test('Home is active only on /', () => {
  assert.equal(isNavActive('/', '/'), true);
  assert.equal(isNavActive('/offers', '/'), false);
});

test('sections stay active on nested pages, not on look-alike paths', () => {
  assert.equal(isNavActive('/applications', '/applications'), true);
  assert.equal(isNavActive('/applications/acme-1', '/applications'), true);
  assert.equal(isNavActive('/applications/', '/applications'), true);
  assert.equal(isNavActive('/applicationsx', '/applications'), false);
  assert.equal(isNavActive('/interviews', '/applications'), false);
});

test('exact matching for a single search profile', () => {
  assert.equal(isNavActive('/offers/designer-1', '/offers/designer-1', true), true);
  assert.equal(isNavActive('/offers', '/offers/designer-1', true), false);
  assert.equal(isNavActive('/offers/designer-1/x', '/offers/designer-1', true), false);
});

test('width parsing falls back to the default', () => {
  assert.equal(parseSidebarWidth(null), SIDEBAR_DEFAULT_WIDTH);
  assert.equal(parseSidebarWidth('abc'), SIDEBAR_DEFAULT_WIDTH);
  assert.equal(parseSidebarWidth('20'), SIDEBAR_DEFAULT_WIDTH);
  assert.equal(parseSidebarWidth('280'), 280);
  assert.equal(clampSidebarWidth(10), SIDEBAR_MIN_WIDTH);
  assert.equal(clampSidebarWidth(9999), SIDEBAR_MAX_WIDTH);
});

test('counts', () => {
  assert.equal(
    countActiveApplications([{ status: 'accepted' }, { status: 'rejected' }, { status: 'waiting' }, { status: 'interviewing' }]),
    2,
  );
  assert.equal(countUpcomingInterviews([{ completedAt: null }, { completedAt: '2026-10-01' }]), 1);
  assert.equal(formatNavCount(0), null);
  assert.equal(formatNavCount(7), '7');
  assert.equal(formatNavCount(120), '99+');
});

test('Cmd+B / Ctrl+B toggles, not while typing', () => {
  const base = { key: 'b', metaKey: true, ctrlKey: false, altKey: false, shiftKey: false, targetIsEditable: false };
  assert.equal(isSidebarShortcut(base), true);
  assert.equal(isSidebarShortcut({ ...base, metaKey: false, ctrlKey: true }), true);
  assert.equal(isSidebarShortcut({ ...base, targetIsEditable: true }), false);
  assert.equal(isSidebarShortcut({ ...base, shiftKey: true }), false);
  assert.equal(isSidebarShortcut({ ...base, metaKey: false }), false);
});
