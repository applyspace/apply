import type { ApplicationStatus, InterviewOutcome, InterviewStage } from '@apply/core/applications';

/**
 * Pure view model and helpers of the Interviews page (no React, no I/O, no
 * `@/` runtime import so `node --test` can load it). Every layout (List,
 * Kanban, Calendar) renders the same `InterviewItem` list.
 */

export const INTERVIEW_STAGES: readonly InterviewStage[] = [
  'HR',
  'Manager',
  'Design Case',
  'Team-Fit',
  'Technical',
  'Final',
  'Other',
];

export const INTERVIEW_OUTCOMES: readonly InterviewOutcome[] = ['pending', 'passed', 'failed', 'ghosted'];

export type InterviewLayout = 'list' | 'kanban' | 'calendar';
export const INTERVIEW_LAYOUTS: readonly InterviewLayout[] = ['list', 'kanban', 'calendar'];
export const DEFAULT_INTERVIEW_LAYOUT: InterviewLayout = 'list';

export type CalendarView = 'month' | 'week';
export const CALENDAR_VIEWS: readonly CalendarView[] = ['month', 'week'];

const first = (value: string | string[] | undefined | null) => (Array.isArray(value) ? value[0] : value);

export function parseInterviewLayout(value: string | string[] | undefined | null): InterviewLayout {
  const v = first(value);
  return INTERVIEW_LAYOUTS.find((l) => l === v) ?? DEFAULT_INTERVIEW_LAYOUT;
}

export function parseCalendarView(value: string | string[] | undefined | null): CalendarView {
  return first(value) === 'week' ? 'week' : 'month';
}

export interface InterviewItem {
  id: string;
  /** `/interviews/[slug]` segment. */
  slug: string;
  applicationId: string;
  /** `/applications/[slug]` segment. */
  applicationSlug: string;
  applicationStatus: ApplicationStatus;
  companyName: string;
  companyDomain: string | null;
  jobTitle: string;
  location: string | null;
  stage: InterviewStage;
  scheduledAt: string | null;
  completedAt: string | null;
  outcome: InterviewOutcome | null;
  notes: string | null;
}

// --- phase and ordering -----------------------------------------------------------

export type InterviewPhase = 'upcoming' | 'past' | 'unscheduled';

const time = (iso: string | null) => (iso ? Date.parse(iso) : Number.NaN);

/** Upcoming: scheduled from now on and not completed. Past: completed or scheduled before now. */
export function phaseOf(item: InterviewItem, now: number): InterviewPhase {
  const at = time(item.scheduledAt);
  if (Number.isNaN(at)) return item.completedAt ? 'past' : 'unscheduled';
  if (item.completedAt) return 'past';
  return at >= now ? 'upcoming' : 'past';
}

const byDateAsc = (a: InterviewItem, b: InterviewItem) => time(a.scheduledAt) - time(b.scheduledAt);

/** The three sections of the List layout: soonest upcoming first, latest past first. */
export function splitByPhase(items: InterviewItem[], now: number): Record<InterviewPhase, InterviewItem[]> {
  const out: Record<InterviewPhase, InterviewItem[]> = { upcoming: [], unscheduled: [], past: [] };
  for (const i of items) out[phaseOf(i, now)].push(i);
  out.upcoming.sort(byDateAsc);
  out.past.sort((a, b) => byDateAsc(b, a));
  out.unscheduled.sort((a, b) => a.companyName.localeCompare(b.companyName));
  return out;
}

/** Interviews of one stage for the Kanban: upcoming (soonest first), then unscheduled, then past (latest first). */
export function byStage(items: InterviewItem[], stage: InterviewStage, now: number): InterviewItem[] {
  const s = splitByPhase(
    items.filter((i) => i.stage === stage),
    now,
  );
  return [...s.upcoming, ...s.unscheduled, ...s.past];
}

export function countByStage(items: InterviewItem[]): Record<InterviewStage, number> {
  const counts = Object.fromEntries(INTERVIEW_STAGES.map((s) => [s, 0])) as Record<InterviewStage, number>;
  for (const i of items) counts[i.stage] = (counts[i.stage] ?? 0) + 1;
  return counts;
}

/** Outcome shown to the user; a missing outcome reads as pending. */
export const outcomeOf = (item: InterviewItem): InterviewOutcome => item.outcome ?? 'pending';

export function countByOutcome(items: InterviewItem[]): Record<InterviewOutcome, number> {
  const counts = Object.fromEntries(INTERVIEW_OUTCOMES.map((o) => [o, 0])) as Record<InterviewOutcome, number>;
  for (const i of items) counts[outcomeOf(i)] += 1;
  return counts;
}

// --- filters ----------------------------------------------------------------------

export interface InterviewFilters {
  query: string;
  outcomes: InterviewOutcome[];
  upcomingOnly: boolean;
}

export const NO_INTERVIEW_FILTERS: InterviewFilters = { query: '', outcomes: [], upcomingOnly: false };

export const hasInterviewFilters = (f: InterviewFilters) =>
  f.query.trim() !== '' || f.outcomes.length > 0 || f.upcomingOnly;

const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

export function filterInterviews(items: InterviewItem[], f: InterviewFilters, now: number): InterviewItem[] {
  const q = fold(f.query.trim());
  return items.filter((i) => {
    if (f.outcomes.length > 0 && !f.outcomes.includes(outcomeOf(i))) return false;
    if (f.upcomingOnly && phaseOf(i, now) !== 'upcoming') return false;
    if (q && !fold(`${i.companyName} ${i.jobTitle} ${i.stage} ${i.location ?? ''}`).includes(q)) return false;
    return true;
  });
}

// --- calendar ---------------------------------------------------------------------
// Days are `YYYY-MM-DD` keys in the viewer's time zone. Arithmetic on keys runs in
// UTC, where every day lasts 24 hours, so daylight saving never shifts a day.

const DAY_MS = 86_400_000;

const keyToUtc = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};
const utcToKey = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/** Day key of an instant in a time zone (IANA name, e.g. `Europe/Paris`). */
export function dayKeyOf(iso: string | number, timeZone: string): string {
  const at = typeof iso === 'number' ? iso : Date.parse(iso);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(at);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** Whole days from day `from` to day `to` (negative when `to` is earlier). */
export const dayDiff = (from: string, to: string) => Math.round((keyToUtc(to) - keyToUtc(from)) / DAY_MS);

export const addDays = (key: string, days: number) => utcToKey(keyToUtc(key) + days * DAY_MS);

/** Monday = 0 ... Sunday = 6. */
export const weekdayIndex = (key: string) => (new Date(keyToUtc(key)).getUTCDay() + 6) % 7;

export const startOfWeek = (key: string) => addDays(key, -weekdayIndex(key));

/** The seven days (Monday first) of the week holding `key`. */
export function weekDays(key: string): string[] {
  const start = startOfWeek(key);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export const monthOf = (key: string) => key.slice(0, 7);

/** Same day number in the month `months` away, clamped to that month's length. */
export function addMonths(key: string, months: number): string {
  const [y, m, d] = key.split('-').map(Number);
  const target = new Date(Date.UTC(y, m - 1 + months, 1));
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  return utcToKey(Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), Math.min(d, last)));
}

export interface CalendarDay {
  key: string;
  /** False for the leading and trailing days of the neighbour months. */
  inMonth: boolean;
}

/**
 * Month grid of the month holding `key`: whole weeks, Monday first, from the
 * week of the 1st to the week of the last day (4 to 6 rows).
 */
export function monthGrid(key: string): CalendarDay[][] {
  const month = monthOf(key);
  const firstDay = `${month}-01`;
  const lastDay = addDays(addMonths(firstDay, 1), -1);
  const weeks: CalendarDay[][] = [];
  for (let start = startOfWeek(firstDay); start <= lastDay; start = addDays(start, 7)) {
    weeks.push(weekDays(start).map((k) => ({ key: k, inMonth: monthOf(k) === month })));
  }
  return weeks;
}

/** Scheduled interviews per day key, each day sorted by time. */
export function groupByDay(items: InterviewItem[], timeZone: string): Map<string, InterviewItem[]> {
  const days = new Map<string, InterviewItem[]>();
  for (const i of items) {
    if (!i.scheduledAt || Number.isNaN(Date.parse(i.scheduledAt))) continue;
    const key = dayKeyOf(i.scheduledAt, timeZone);
    const list = days.get(key) ?? [];
    list.push(i);
    days.set(key, list);
  }
  for (const list of days.values()) list.sort(byDateAsc);
  return days;
}

/** Arrow-key move on a Monday-first grid: left and right by a day, up and down by a week. */
export function moveFocus(key: string, arrow: string): string | null {
  switch (arrow) {
    case 'ArrowLeft':
      return addDays(key, -1);
    case 'ArrowRight':
      return addDays(key, 1);
    case 'ArrowUp':
      return addDays(key, -7);
    case 'ArrowDown':
      return addDays(key, 7);
    case 'Home':
      return startOfWeek(key);
    case 'End':
      return addDays(startOfWeek(key), 6);
    default:
      return null;
  }
}
