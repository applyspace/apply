import type {
  ApplicationStatus,
  ApplicationWithRelations,
  InterviewStage,
  InterviewWithRelations,
} from '@apply/core/applications';
import type { OfferWithRelations } from '@apply/core/offers';
import {
  DEADLINE_WINDOW_DAYS,
  STALE_AFTER_DAYS,
  countByStatus,
  daysBetween,
  isClosed,
  toHubApplications,
} from './applicationsHub.ts';
import { entrySlug } from './slug.ts';

/**
 * Pure view model of the signed-in Home dashboard (APP-126): no React, no I/O.
 * Built on the server from the shared readers, rendered by `HomeDashboard`.
 */

/** An offer counts as new when the user has not opened it and it was first seen this recently. */
export const NEW_OFFER_WINDOW_DAYS = 7;
/** How many rows each list widget shows; the rest is behind "See all". */
export const HOME_LIST_LIMIT = 4;

/** Statuses that mean the company replied (an interview also counts, whatever the status). */
const ANSWERED_STATUSES: readonly ApplicationStatus[] = ['interviewing', 'accepted', 'rejected'];

export interface HomeFollowUp {
  id: string;
  slug: string;
  companyName: string;
  companyDomain: string | null;
  jobTitle: string;
  /** `stale`: waiting for an answer for a while; `deadline`: a deadline is close. */
  reason: 'stale' | 'deadline';
  /** Days since applied (`stale`) or days left before the deadline (`deadline`). */
  days: number;
}

export interface HomeInterview {
  id: string;
  slug: string;
  companyName: string;
  companyDomain: string | null;
  jobTitle: string;
  stage: InterviewStage;
  /** ISO date or date-time. A date-only value has no meaningful time. */
  scheduledAt: string;
  /** Whole calendar days from today (UTC): 0 today, 1 tomorrow. */
  inDays: number;
}

export interface HomeOffer {
  id: string;
  title: string;
  companyName: string;
  location: string;
  platformLabel: string;
  url: string;
  firstSeenAt: string;
  /** Days since first seen (0 today). */
  ageDays: number;
}

export type ProfileItem = 'name' | 'jobTitle' | 'location' | 'search' | 'salary' | 'cv';
export const PROFILE_ITEMS: readonly ProfileItem[] = ['name', 'jobTitle', 'location', 'search', 'salary', 'cv'];

export interface ProfileInput {
  firstName: string;
  lastName: string;
  jobTitle: string;
  location: string;
  searchTitles: string[];
  salaryMin: number | null;
  hasCv: boolean;
}

export interface HomeProfile {
  /** 0 to 100, rounded. */
  percent: number;
  missing: ProfileItem[];
}

export interface HomeDashboard {
  firstName: string;
  totals: {
    applications: number;
    /** Waiting or interviewing. */
    active: number;
    answers: number;
    upcomingInterviews: number;
    newOffers: number;
  };
  statusCounts: Record<ApplicationStatus, number>;
  followUps: HomeFollowUp[];
  followUpCount: number;
  interviews: HomeInterview[];
  offers: HomeOffer[];
  profile: HomeProfile;
}

export interface HomeDashboardInput {
  applications: ApplicationWithRelations[];
  interviews: InterviewWithRelations[];
  offers: OfferWithRelations[];
  profile: ProfileInput;
  now: number;
}

const DAY_MS = 86_400_000;
const utcDay = (t: number) => Math.floor(t / DAY_MS);

/** Calendar days from `now` to `iso`, by UTC date (0 today, 1 tomorrow, -1 yesterday). */
export function calendarDaysUntil(iso: string, now: number): number {
  const t = Date.parse(iso);
  return Number.isNaN(t) ? 0 : utcDay(t) - utcDay(now);
}

/**
 * Applications that need a follow-up: a close deadline first (soonest first),
 * then the ones waiting the longest. Same rules as the hub's "Needs attention".
 */
export function followUpsOf(
  applications: ApplicationWithRelations[],
  interviews: InterviewWithRelations[],
  now: number,
): HomeFollowUp[] {
  const out: HomeFollowUp[] = [];
  for (const a of toHubApplications(applications, interviews)) {
    if (isClosed(a.status) || a.status === 'accepted') continue;
    const base = {
      id: a.id,
      slug: a.slug,
      companyName: a.companyName,
      companyDomain: a.companyDomain,
      jobTitle: a.jobTitle,
    };
    const left = a.deadlineAt ? -daysBetween(a.deadlineAt, now) : -1;
    if (left >= 0 && left <= DEADLINE_WINDOW_DAYS) {
      out.push({ ...base, reason: 'deadline', days: left });
      continue;
    }
    const waited = daysBetween(a.appliedAt, now);
    if (a.status === 'waiting' && waited >= STALE_AFTER_DAYS) {
      out.push({ ...base, reason: 'stale', days: waited });
    }
  }
  return out.sort((x, y) => {
    if (x.reason !== y.reason) return x.reason === 'deadline' ? -1 : 1;
    return x.reason === 'deadline' ? x.days - y.days : y.days - x.days;
  });
}

/** Scheduled interviews from today on, not completed and not failed, soonest first. */
export function upcomingInterviewsOf(interviews: InterviewWithRelations[], now: number): HomeInterview[] {
  return interviews
    .filter(
      (i): i is InterviewWithRelations & { scheduledAt: string } =>
        !!i.scheduledAt && !i.completedAt && i.outcome !== 'failed' && calendarDaysUntil(i.scheduledAt, now) >= 0,
    )
    .sort((a, b) => Date.parse(a.scheduledAt) - Date.parse(b.scheduledAt))
    .map((i) => ({
      id: i.id,
      slug: entrySlug([i.application.company.name, i.application.jobTitle], i.id),
      companyName: i.application.company.name,
      companyDomain: i.application.company.domain?.trim() || null,
      jobTitle: i.application.jobTitle,
      stage: i.stage,
      scheduledAt: i.scheduledAt,
      inDays: calendarDaysUntil(i.scheduledAt, now),
    }));
}

/** Unopened offers first seen in the last `NEW_OFFER_WINDOW_DAYS` days, freshest first. */
export function newOffersOf(offers: OfferWithRelations[], now: number): HomeOffer[] {
  return offers
    .filter((o) => o.userStatus === 'new' && daysBetween(o.firstSeenAt, now) < NEW_OFFER_WINDOW_DAYS)
    .sort((a, b) => b.firstSeenAt.localeCompare(a.firstSeenAt))
    .map((o) => ({
      id: o.id,
      title: o.title,
      companyName: o.company.name,
      location: o.location,
      platformLabel: o.platform.label,
      url: o.url,
      firstSeenAt: o.firstSeenAt,
      ageDays: Math.max(0, daysBetween(o.firstSeenAt, now)),
    }));
}

/** Share of the profile basics that are filled in, and which ones are missing (in display order). */
export function profileCompletion(p: ProfileInput): HomeProfile {
  const done: Record<ProfileItem, boolean> = {
    name: p.firstName.trim() !== '' && p.lastName.trim() !== '',
    jobTitle: p.jobTitle.trim() !== '',
    location: p.location.trim() !== '',
    search: p.searchTitles.some((s) => s.trim() !== ''),
    salary: p.salaryMin !== null && p.salaryMin > 0,
    cv: p.hasCv,
  };
  const missing = PROFILE_ITEMS.filter((item) => !done[item]);
  return {
    percent: Math.round(((PROFILE_ITEMS.length - missing.length) / PROFILE_ITEMS.length) * 100),
    missing,
  };
}

export function buildHomeDashboard(input: HomeDashboardInput): HomeDashboard {
  const { applications, interviews, offers, profile, now } = input;
  const statusCounts = countByStatus(toHubApplications(applications, []));
  const interviewed = new Set(interviews.map((i) => i.applicationId));
  const followUps = followUpsOf(applications, interviews, now);
  const upcoming = upcomingInterviewsOf(interviews, now);
  const fresh = newOffersOf(offers, now);

  return {
    firstName: profile.firstName.trim(),
    totals: {
      applications: applications.length,
      active: statusCounts.waiting + statusCounts.interviewing,
      answers: applications.filter((a) => ANSWERED_STATUSES.includes(a.status) || interviewed.has(a.id)).length,
      upcomingInterviews: upcoming.length,
      newOffers: fresh.length,
    },
    statusCounts,
    followUps: followUps.slice(0, HOME_LIST_LIMIT),
    followUpCount: followUps.length,
    interviews: upcoming.slice(0, HOME_LIST_LIMIT),
    offers: fresh.slice(0, HOME_LIST_LIMIT),
    profile: profileCompletion(profile),
  };
}
