import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  addDays,
  addMonths,
  dayDiff,
  byStage,
  dayKeyOf,
  filterInterviews,
  groupByDay,
  monthGrid,
  moveFocus,
  NO_INTERVIEW_FILTERS,
  parseCalendarView,
  parseInterviewLayout,
  phaseOf,
  splitByPhase,
  weekDays,
  type InterviewItem,
} from './interviewsHub.ts';

const NOW = Date.parse('2026-10-11T12:00:00Z');

const item = (over: Partial<InterviewItem>): InterviewItem => ({
  id: over.id ?? 'i',
  slug: 'slug',
  applicationId: 'a',
  applicationSlug: 'a-slug',
  applicationStatus: 'interviewing',
  companyName: 'Nordique Labs',
  companyDomain: null,
  jobTitle: 'Product Designer',
  location: 'Lille, France',
  stage: 'HR',
  scheduledAt: null,
  completedAt: null,
  outcome: 'pending',
  notes: null,
  ...over,
});

test('layout and view parsing fall back to the defaults', () => {
  assert.equal(parseInterviewLayout('kanban'), 'kanban');
  assert.equal(parseInterviewLayout(['calendar', 'list']), 'calendar');
  assert.equal(parseInterviewLayout('board'), 'list');
  assert.equal(parseInterviewLayout(undefined), 'list');
  assert.equal(parseCalendarView('week'), 'week');
  assert.equal(parseCalendarView('year'), 'month');
});

test('phase: upcoming, past (completed or elapsed) and unscheduled', () => {
  assert.equal(phaseOf(item({ scheduledAt: '2026-10-12T09:00:00Z' }), NOW), 'upcoming');
  assert.equal(phaseOf(item({ scheduledAt: '2026-10-10T09:00:00Z' }), NOW), 'past');
  assert.equal(
    phaseOf(item({ scheduledAt: '2026-10-12T09:00:00Z', completedAt: '2026-10-12T10:00:00Z' }), NOW),
    'past',
  );
  assert.equal(phaseOf(item({}), NOW), 'unscheduled');
});

test('splitByPhase sorts upcoming soonest first and past latest first', () => {
  const s = splitByPhase(
    [
      item({ id: 'later', scheduledAt: '2026-10-20T09:00:00Z' }),
      item({ id: 'soon', scheduledAt: '2026-10-12T09:00:00Z' }),
      item({ id: 'old', scheduledAt: '2026-09-01T09:00:00Z' }),
      item({ id: 'recent', scheduledAt: '2026-10-09T09:00:00Z' }),
      item({ id: 'none' }),
    ],
    NOW,
  );
  assert.deepEqual(s.upcoming.map((i) => i.id), ['soon', 'later']);
  assert.deepEqual(s.past.map((i) => i.id), ['recent', 'old']);
  assert.deepEqual(s.unscheduled.map((i) => i.id), ['none']);
});

test('byStage keeps one stage, upcoming before past', () => {
  const list = byStage(
    [
      item({ id: 'past', stage: 'Manager', scheduledAt: '2026-10-01T09:00:00Z' }),
      item({ id: 'hr', stage: 'HR', scheduledAt: '2026-10-13T09:00:00Z' }),
      item({ id: 'next', stage: 'Manager', scheduledAt: '2026-10-13T09:00:00Z' }),
    ],
    'Manager',
    NOW,
  );
  assert.deepEqual(list.map((i) => i.id), ['next', 'past']);
});

test('filters: text (accents ignored), outcome (null reads as pending), upcoming only', () => {
  const items = [
    item({ id: 'a', companyName: 'Pixelière', outcome: null, scheduledAt: '2026-10-13T09:00:00Z' }),
    item({ id: 'b', companyName: 'Cabestan', outcome: 'passed', scheduledAt: '2026-10-01T09:00:00Z' }),
  ];
  assert.deepEqual(filterInterviews(items, { ...NO_INTERVIEW_FILTERS, query: 'pixeliere' }, NOW).map((i) => i.id), ['a']);
  assert.deepEqual(filterInterviews(items, { ...NO_INTERVIEW_FILTERS, outcomes: ['pending'] }, NOW).map((i) => i.id), ['a']);
  assert.deepEqual(filterInterviews(items, { ...NO_INTERVIEW_FILTERS, upcomingOnly: true }, NOW).map((i) => i.id), ['a']);
  assert.equal(filterInterviews(items, NO_INTERVIEW_FILTERS, NOW).length, 2);
});

test('dayKeyOf follows the time zone', () => {
  assert.equal(dayKeyOf('2026-10-11T23:30:00Z', 'UTC'), '2026-10-11');
  assert.equal(dayKeyOf('2026-10-11T23:30:00Z', 'Europe/Paris'), '2026-10-12');
  assert.equal(dayKeyOf('2026-10-12T02:00:00Z', 'America/New_York'), '2026-10-11');
});

test('day arithmetic crosses months, years and daylight saving', () => {
  assert.equal(addDays('2026-10-31', 1), '2026-11-01');
  assert.equal(addDays('2026-01-01', -1), '2025-12-31');
  assert.equal(addDays('2026-10-24', 2), '2026-10-26');
  assert.equal(addMonths('2026-01-31', 1), '2026-02-28');
  assert.equal(addMonths('2026-12-15', 1), '2027-01-15');
  assert.equal(addMonths('2026-03-31', -1), '2026-02-28');
  assert.equal(dayDiff('2026-10-11', '2026-10-14'), 3);
  assert.equal(dayDiff('2026-10-26', '2026-10-24'), -2);
});

test('weekDays starts on Monday', () => {
  assert.deepEqual(weekDays('2026-10-11'), [
    '2026-10-05',
    '2026-10-06',
    '2026-10-07',
    '2026-10-08',
    '2026-10-09',
    '2026-10-10',
    '2026-10-11',
  ]);
});

test('monthGrid covers whole weeks from the week of the 1st to the week of the last day', () => {
  const oct = monthGrid('2026-10-11');
  assert.equal(oct.length, 5);
  assert.equal(oct[0][0].key, '2026-09-28');
  assert.equal(oct[0][0].inMonth, false);
  assert.equal(oct[0][3].key, '2026-10-01');
  assert.equal(oct[4][6].key, '2026-11-01');
  assert.ok(oct.every((w) => w.length === 7));
  // February 2027 starts on a Monday and has exactly four weeks.
  const feb = monthGrid('2027-02-10');
  assert.equal(feb.length, 4);
  assert.ok(feb.flat().every((d) => d.inMonth));
  // August 2026 starts on a Saturday and needs six rows.
  assert.equal(monthGrid('2026-08-01').length, 6);
});

test('groupByDay buckets scheduled interviews per local day, sorted by time', () => {
  const days = groupByDay(
    [
      item({ id: 'late', scheduledAt: '2026-10-14T16:00:00Z' }),
      item({ id: 'early', scheduledAt: '2026-10-14T08:00:00Z' }),
      item({ id: 'night', scheduledAt: '2026-10-14T23:00:00Z' }),
      item({ id: 'none' }),
    ],
    'Europe/Paris',
  );
  assert.deepEqual(days.get('2026-10-14')?.map((i) => i.id), ['early', 'late']);
  assert.deepEqual(days.get('2026-10-15')?.map((i) => i.id), ['night']);
  assert.equal([...days.values()].flat().length, 3);
});

test('moveFocus walks the grid with the arrow keys', () => {
  assert.equal(moveFocus('2026-10-11', 'ArrowLeft'), '2026-10-10');
  assert.equal(moveFocus('2026-10-11', 'ArrowDown'), '2026-10-18');
  assert.equal(moveFocus('2026-10-11', 'Home'), '2026-10-05');
  assert.equal(moveFocus('2026-10-07', 'End'), '2026-10-11');
  assert.equal(moveFocus('2026-10-11', 'Enter'), null);
});
