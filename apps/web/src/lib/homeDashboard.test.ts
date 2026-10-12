import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Platform } from '@apply/db/schema';
import { buildDemoTracking } from './demoTracking.ts';
import {
  NEW_OFFER_WINDOW_DAYS,
  buildHomeDashboard,
  calendarDaysUntil,
  followUpsOf,
  newOffersOf,
  profileCompletion,
  upcomingInterviewsOf,
  type ProfileInput,
} from './homeDashboard.ts';

const NOW = Date.parse('2026-10-11T10:00:00.000Z');
const DAY = 86_400_000;

const PLATFORMS: Platform[] = ['wttj', 'linkedin', 'hellowork', 'jobsthatmakesense'].map((slug) => ({
  slug,
  label: slug,
  brandColor: null,
  loginUrl: null,
})) as unknown as Platform[];

const FULL_PROFILE: ProfileInput = {
  firstName: 'Camille',
  lastName: 'Aubert',
  jobTitle: 'Product Designer',
  location: 'Paris',
  searchTitles: ['Product Designer'],
  salaryMin: 45,
  hasCv: true,
};

const demo = () => buildDemoTracking(NOW, PLATFORMS);

test('calendarDaysUntil counts UTC calendar days, not 24-hour spans', () => {
  assert.equal(calendarDaysUntil('2026-10-11T23:00:00.000Z', NOW), 0);
  assert.equal(calendarDaysUntil('2026-10-12T01:00:00.000Z', NOW), 1);
  assert.equal(calendarDaysUntil('2026-10-12', NOW), 1);
  assert.equal(calendarDaysUntil('2026-10-10T23:59:00.000Z', NOW), -1);
  assert.equal(calendarDaysUntil('not a date', NOW), 0);
});

test('follow-ups: close deadlines first, then the longest waits; closed and recent ones are left out', () => {
  const { applications, interviews } = demo();
  const list = followUpsOf(applications, interviews, NOW);
  assert.deepEqual(
    list.map((f) => [f.companyName, f.reason, f.days]),
    [
      ['Tandem', 'deadline', 3],
      ['Kite Mobility', 'stale', 25],
      ['Paperplane', 'stale', 18],
    ],
  );
});

test('upcoming interviews: from today on, soonest first, completed and failed ones excluded', () => {
  const { interviews } = demo();
  const list = upcomingInterviewsOf(interviews, NOW);
  assert.deepEqual(
    list.map((i) => [i.companyName, i.stage, i.inDays]),
    [
      ['Maison Verte', 'HR', 1],
      ['Lumen Health', 'Design Case', 2],
      ['Orbital Labs', 'Final', 5],
    ],
  );
  assert.match(list[0].slug, /^maison-verte-ux-ui-designer-demoint\d+$/);
});

test('an interview earlier today still counts as upcoming until it is completed', () => {
  const [base] = demo().interviews;
  const today = { ...base, scheduledAt: '2026-10-11T07:00:00.000Z', completedAt: null, outcome: null };
  assert.equal(upcomingInterviewsOf([today], NOW).length, 1);
  assert.equal(upcomingInterviewsOf([{ ...today, outcome: 'failed' as const }], NOW).length, 0);
});

test('new offers: unopened and first seen within the window, freshest first', () => {
  const { offers } = demo();
  const list = newOffersOf(offers, NOW);
  assert.ok(list.length > 0);
  assert.ok(list.every((o) => o.ageDays < NEW_OFFER_WINDOW_DAYS));
  assert.ok(!list.some((o) => o.title === 'Lead Product Designer'), 'the 12-day-old offer is not new');
  const seen = offers.map((o) => (o.title === 'Product Designer' ? { ...o, userStatus: 'viewed' as const } : o));
  assert.ok(!newOffersOf(seen, NOW).some((o) => o.title === 'Product Designer'));
  for (let i = 1; i < list.length; i++) assert.ok(list[i - 1].firstSeenAt >= list[i].firstSeenAt);
});

test('profile completion: share of the six basics, missing ones in display order', () => {
  assert.deepEqual(profileCompletion(FULL_PROFILE), { percent: 100, missing: [] });
  assert.deepEqual(profileCompletion({ ...FULL_PROFILE, lastName: ' ', salaryMin: null, hasCv: false }), {
    percent: 50,
    missing: ['name', 'salary', 'cv'],
  });
  assert.equal(profileCompletion({ ...FULL_PROFILE, salaryMin: 0 }).missing[0], 'salary');
});

test('the dashboard model of the demo has every widget filled', () => {
  const { applications, interviews, offers } = demo();
  const d = buildHomeDashboard({ applications, interviews, offers, profile: FULL_PROFILE, now: NOW });
  assert.equal(d.firstName, 'Camille');
  assert.equal(d.totals.applications, 11);
  assert.equal(d.statusCounts.waiting + d.statusCounts.interviewing, d.totals.active);
  assert.deepEqual(d.statusCounts, { waiting: 4, interviewing: 3, accepted: 1, rejected: 1, ghosted: 1, withdrawn: 1 });
  // interviewing (3) + accepted + rejected; Brume and Atlas also had interviews.
  assert.equal(d.totals.answers, 5);
  assert.equal(d.totals.upcomingInterviews, 3);
  assert.equal(d.followUpCount, 3);
  assert.ok(d.offers.length <= 4 && d.totals.newOffers >= d.offers.length);
});

test('an empty account gives an empty dashboard, never a crash', () => {
  const d = buildHomeDashboard({
    applications: [],
    interviews: [],
    offers: [],
    profile: { ...FULL_PROFILE, firstName: '', lastName: '', hasCv: false },
    now: NOW,
  });
  assert.equal(d.firstName, '');
  assert.deepEqual(d.totals, { applications: 0, active: 0, answers: 0, upcomingInterviews: 0, newOffers: 0 });
  assert.deepEqual([d.followUps, d.interviews, d.offers], [[], [], []]);
  assert.deepEqual(d.profile.missing, ['name', 'cv']);
});

test('demo fixtures stay relative to now, so the demo never goes stale', () => {
  const later = buildDemoTracking(NOW + 100 * DAY, PLATFORMS);
  assert.equal(upcomingInterviewsOf(later.interviews, NOW + 100 * DAY).length, 3);
  // Ids have no dash, so `idFromSlug` finds them back from a URL slug.
  assert.ok([...later.applications, ...later.interviews].every((r) => !r.id.includes('-')));
});
