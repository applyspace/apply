import type { Company, Offer, Platform } from '@apply/core/records';
import type {
  ApplicationStatus,
  ApplicationWithRelations,
  InterviewOutcome,
  InterviewStage,
  InterviewWithRelations,
} from '@apply/core/applications';
import type { OfferWithRelations } from '@apply/core/offers';

/**
 * Tracking fixtures of the public demo: invented companies, applications,
 * interviews and (when the committed offers snapshot is empty) a few offers.
 * Dates are relative to `now` so the demo always has follow-ups due, upcoming
 * interviews and fresh offers. Pure (no Next imports), so it is unit-testable.
 */

const DAY_MS = 86_400_000;
const PROFILE_ID = 'demo-profile';

interface CompanySeed {
  key: string;
  name: string;
  headquarters: string;
}

const COMPANIES: CompanySeed[] = [
  { key: 'lumen', name: 'Lumen Health', headquarters: 'Paris' },
  { key: 'orbital', name: 'Orbital Labs', headquarters: 'Lyon' },
  { key: 'verte', name: 'Maison Verte', headquarters: 'Bordeaux' },
  { key: 'paperplane', name: 'Paperplane', headquarters: 'Paris' },
  { key: 'kite', name: 'Kite Mobility', headquarters: 'Nantes' },
  { key: 'tandem', name: 'Tandem', headquarters: 'Paris' },
  { key: 'brume', name: 'Brume', headquarters: 'Lille' },
  { key: 'atlas', name: 'Atlas Finance', headquarters: 'Paris' },
  { key: 'pollen', name: 'Pollen', headquarters: 'Marseille' },
  { key: 'halo', name: 'Studio Halo', headquarters: 'Toulouse' },
  { key: 'fjord', name: 'Fjord Energy', headquarters: 'Grenoble' },
  { key: 'canopee', name: 'Canopée', headquarters: 'Paris' },
  { key: 'miel', name: 'Miel & Co', headquarters: 'Lyon' },
  { key: 'sillage', name: 'Sillage', headquarters: 'Rennes' },
];

interface ApplicationSeed {
  key: string;
  company: string;
  jobTitle: string;
  status: ApplicationStatus;
  /** Days before `now`. */
  appliedDaysAgo: number;
  location: string;
  /** Days after `now`. */
  deadlineInDays?: number;
  notes?: string;
}

const APPLICATIONS: ApplicationSeed[] = [
  { key: 'lumen', company: 'lumen', jobTitle: 'Senior Product Designer', status: 'interviewing', appliedDaysAgo: 12, location: 'Paris', notes: 'Referred by a former colleague.' },
  { key: 'orbital', company: 'orbital', jobTitle: 'Product Designer', status: 'interviewing', appliedDaysAgo: 21, location: 'Lyon' },
  { key: 'verte', company: 'verte', jobTitle: 'UX/UI Designer', status: 'interviewing', appliedDaysAgo: 9, location: 'Remote' },
  { key: 'tandem', company: 'tandem', jobTitle: 'Design Systems Designer', status: 'waiting', appliedDaysAgo: 6, location: 'Paris', deadlineInDays: 3, notes: 'Send the portfolio case study before the deadline.' },
  { key: 'paperplane', company: 'paperplane', jobTitle: 'Product Designer, Growth', status: 'waiting', appliedDaysAgo: 18, location: 'Paris' },
  { key: 'kite', company: 'kite', jobTitle: 'Product Designer', status: 'waiting', appliedDaysAgo: 25, location: 'Nantes' },
  { key: 'canopee', company: 'canopee', jobTitle: 'Product Designer', status: 'waiting', appliedDaysAgo: 4, location: 'Paris' },
  { key: 'brume', company: 'brume', jobTitle: 'Lead Product Designer', status: 'accepted', appliedDaysAgo: 40, location: 'Lille' },
  { key: 'atlas', company: 'atlas', jobTitle: 'Product Designer', status: 'rejected', appliedDaysAgo: 30, location: 'Paris' },
  { key: 'pollen', company: 'pollen', jobTitle: 'Product Designer', status: 'ghosted', appliedDaysAgo: 45, location: 'Marseille' },
  { key: 'halo', company: 'halo', jobTitle: 'Product Designer', status: 'withdrawn', appliedDaysAgo: 35, location: 'Toulouse' },
];

interface InterviewSeed {
  application: string;
  stage: InterviewStage;
  /** Days from `now` (negative in the past). */
  inDays: number;
  /** UTC hour and minute. */
  at: [number, number];
  outcome: InterviewOutcome | null;
}

const INTERVIEWS: InterviewSeed[] = [
  { application: 'lumen', stage: 'HR', inDays: -6, at: [8, 0], outcome: 'passed' },
  { application: 'lumen', stage: 'Design Case', inDays: 2, at: [12, 0], outcome: null },
  { application: 'orbital', stage: 'Manager', inDays: -8, at: [9, 30], outcome: 'passed' },
  { application: 'orbital', stage: 'Final', inDays: 5, at: [8, 30], outcome: null },
  { application: 'verte', stage: 'HR', inDays: 1, at: [7, 30], outcome: null },
  { application: 'brume', stage: 'Final', inDays: -20, at: [13, 0], outcome: 'passed' },
  { application: 'atlas', stage: 'HR', inDays: -22, at: [10, 0], outcome: 'failed' },
];

interface OfferSeed {
  key: string;
  company: string;
  title: string;
  location: string;
  platform: string;
  /** Days before `now`. */
  seenDaysAgo: number;
  contract: 'CDI' | 'CDD' | 'Freelance';
  remoteMode: 'remote' | 'hybrid' | 'onsite';
  salary: [number, number] | null;
}

const OFFERS: OfferSeed[] = [
  { key: 'fjord', company: 'fjord', title: 'Product Designer', location: 'Grenoble', platform: 'wttj', seenDaysAgo: 0, contract: 'CDI', remoteMode: 'hybrid', salary: [48000, 58000] },
  { key: 'miel', company: 'miel', title: 'Senior Product Designer', location: 'Lyon', platform: 'linkedin', seenDaysAgo: 1, contract: 'CDI', remoteMode: 'hybrid', salary: [55000, 65000] },
  { key: 'sillage', company: 'sillage', title: 'Product Designer, Mobile', location: 'Remote', platform: 'hellowork', seenDaysAgo: 2, contract: 'CDI', remoteMode: 'remote', salary: null },
  { key: 'canopee', company: 'canopee', title: 'UX Designer', location: 'Paris', platform: 'jobsthatmakesense', seenDaysAgo: 3, contract: 'CDD', remoteMode: 'onsite', salary: [42000, 48000] },
  { key: 'halo', company: 'halo', title: 'Product Designer, Design System', location: 'Toulouse', platform: 'wttj', seenDaysAgo: 5, contract: 'Freelance', remoteMode: 'hybrid', salary: null },
  { key: 'kite', company: 'kite', title: 'Lead Product Designer', location: 'Nantes', platform: 'linkedin', seenDaysAgo: 12, contract: 'CDI', remoteMode: 'hybrid', salary: [60000, 70000] },
];

const isoDate = (t: number) => new Date(t).toISOString().slice(0, 10);

function atUtc(now: number, inDays: number, [h, m]: [number, number]): string {
  const d = new Date(now + inDays * DAY_MS);
  d.setUTCHours(h, m, 0, 0);
  return d.toISOString();
}

export interface DemoTracking {
  companies: Company[];
  applications: ApplicationWithRelations[];
  interviews: InterviewWithRelations[];
  offers: OfferWithRelations[];
}

export function buildDemoTracking(now: number, platforms: Platform[]): DemoTracking {
  const stamp = new Date(now - 60 * DAY_MS).toISOString();
  const companies = new Map<string, Company>(
    COMPANIES.map((c) => [
      c.key,
      {
        id: `demo-co-${c.key}`,
        name: c.name,
        domain: null,
        linkedinHandle: null,
        sector: null,
        size: null,
        headquarters: c.headquarters,
        description: null,
        logoUrl: null,
        createdAt: stamp,
        updatedAt: stamp,
      },
    ]),
  );

  const applications: ApplicationWithRelations[] = APPLICATIONS.map((a) => {
    const appliedAt = isoDate(now - a.appliedDaysAgo * DAY_MS);
    return {
      id: `demoapp${a.key}`,
      offerId: null,
      profileId: PROFILE_ID,
      companyId: companies.get(a.company)!.id,
      jobTitle: a.jobTitle,
      appliedAt,
      status: a.status,
      coverLetter: null,
      notes: a.notes ?? null,
      createdAt: `${appliedAt}T09:00:00.000Z`,
      updatedAt: `${appliedAt}T09:00:00.000Z`,
      company: companies.get(a.company)!,
      offer: null,
      url: null,
      location: a.location,
      deadlineAt: a.deadlineInDays === undefined ? null : isoDate(now + a.deadlineInDays * DAY_MS),
      respondedAt: null,
    };
  }).sort((x, y) => y.appliedAt.localeCompare(x.appliedAt));

  const byKey = new Map(applications.map((a) => [a.id, a]));
  const interviews: InterviewWithRelations[] = INTERVIEWS.map((i, n) => {
    const application = byKey.get(`demoapp${i.application}`)!;
    const scheduledAt = atUtc(now, i.inDays, i.at);
    const row: InterviewWithRelations['application'] = {
      id: application.id,
      offerId: application.offerId,
      profileId: application.profileId,
      companyId: application.companyId,
      jobTitle: application.jobTitle,
      appliedAt: application.appliedAt,
      status: application.status,
      coverLetter: application.coverLetter,
      notes: application.notes,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      company: application.company,
    };
    return {
      id: `demoint${n + 1}`,
      applicationId: application.id,
      stage: i.stage,
      scheduledAt,
      completedAt: i.inDays < 0 ? scheduledAt : null,
      outcome: i.outcome,
      notes: null,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      application: row,
    };
  }).sort((x, y) => y.createdAt.localeCompare(x.createdAt));

  const platformBySlug = new Map(platforms.map((p) => [p.slug, p]));
  const offers: OfferWithRelations[] = OFFERS.flatMap((o) => {
    const platform = platformBySlug.get(o.platform);
    if (!platform) return [];
    const company = companies.get(o.company)!;
    const seenAt = new Date(now - o.seenDaysAgo * DAY_MS - 3_600_000).toISOString();
    const offer: Offer = {
      id: `demooffer${o.key}`,
      platformSlug: platform.slug,
      companyId: company.id,
      externalId: o.key,
      url: `https://example.com/demo-offers/${o.key}`,
      title: o.title,
      location: o.location,
      remoteMode: o.remoteMode,
      contract: o.contract,
      experienceLevel: 'mid',
      salaryMinEur: o.salary?.[0] ?? null,
      salaryMaxEur: o.salary?.[1] ?? null,
      salaryRaw: o.salary ? `${o.salary[0] / 1000}K à ${o.salary[1] / 1000}K €` : null,
      description: `${company.name} is looking for a ${o.title} to join its product team. Invented offer of the public demo.`,
      descriptionHtml: null,
      postedAt: isoDate(now - o.seenDaysAgo * DAY_MS),
      firstSeenAt: seenAt,
      lastSeenAt: seenAt,
      userStatus: 'new',
      createdAt: seenAt,
      updatedAt: seenAt,
    };
    return [{ ...offer, company, platform }];
  }).sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt));

  return { companies: [...companies.values()], applications, interviews, offers };
}
