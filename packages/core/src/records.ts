/**
 * Row shapes of the user's records, as the app reads them (camelCase).
 *
 * These records live in Supabase per user (RLS), never in a local database.
 * They used to be inferred from the legacy SQLite schema of `@apply/db`; that
 * schema is gone (APP-124), so the shapes and enum tokens are declared here.
 * Enum values are canonical English tokens; translation happens at render.
 */

export const CONTRACT_VALUES = ['CDI', 'CDD', 'Stage', 'Freelance', 'Apprentissage'] as const;
export type Contract = (typeof CONTRACT_VALUES)[number];

export const EXPERIENCE_LEVEL_VALUES = ['entry', 'mid', 'senior', 'lead'] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVEL_VALUES)[number];

export const REMOTE_MODE_VALUES = ['onsite', 'hybrid', 'remote'] as const;
export type RemoteMode = (typeof REMOTE_MODE_VALUES)[number];

export const COMPANY_SIZE_VALUES = ['startup', 'scale-up', 'midsize', 'large'] as const;
export type CompanySize = (typeof COMPANY_SIZE_VALUES)[number];

export const APPLICATION_STATUS_VALUES = [
  'waiting',
  'interviewing',
  'accepted',
  'rejected',
  'ghosted',
  'withdrawn',
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUS_VALUES)[number];

export const INTERVIEW_STAGE_VALUES = [
  'HR',
  'Manager',
  'Design Case',
  'Team-Fit',
  'Technical',
  'Final',
  'Other',
] as const;
export type InterviewStage = (typeof INTERVIEW_STAGE_VALUES)[number];

export const INTERVIEW_OUTCOME_VALUES = ['pending', 'passed', 'failed', 'ghosted'] as const;
export type InterviewOutcome = (typeof INTERVIEW_OUTCOME_VALUES)[number];

export const OFFER_USER_STATUS_VALUES = ['new', 'viewed', 'passed', 'applied'] as const;
export type OfferUserStatus = (typeof OFFER_USER_STATUS_VALUES)[number];

export const LOCALE_VALUES = ['en', 'fr'] as const;
export type Locale = (typeof LOCALE_VALUES)[number];

export interface Platform {
  slug: string;
  label: string;
  brandColor: string | null;
  loginUrl: string;
}

/**
 * Device-local state of a platform session (ADR-004: never sent to Supabase).
 * Unrelated to the offers cache.
 */
export interface PlatformConnection {
  platformSlug: string;
  connectedAt: string | null;
  lastScrapedAt: string | null;
  cookieBlob: Uint8Array | null;
  cookieFilePath: string | null;
}

export interface Profile {
  id: string;
  jobTitle: string;
  isDefault: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  domain: string | null;
  linkedinHandle: string | null;
  sector: string | null;
  size: CompanySize | null;
  headquarters: string | null;
  description: string | null;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Search {
  id: string;
  profileId: string;
  searchTitle: string;
  location: string | null;
  contractTypes: Contract[] | null;
  experienceLevels: ExperienceLevel[] | null;
  remoteMode: RemoteMode | null;
  salaryMinEur: number | null;
  salaryMaxEur: number | null;
  enabledPlatforms: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  platformSlug: string;
  companyId: string;
  externalId: string;
  url: string;
  title: string;
  location: string;
  remoteMode: RemoteMode | null;
  contract: Contract | null;
  experienceLevel: ExperienceLevel | null;
  salaryMinEur: number | null;
  salaryMaxEur: number | null;
  salaryRaw: string | null;
  description: string;
  descriptionHtml: string | null;
  postedAt: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
  userStatus: OfferUserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  offerId: string | null;
  profileId: string;
  companyId: string;
  jobTitle: string;
  appliedAt: string;
  status: ApplicationStatus;
  coverLetter: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  stage: InterviewStage;
  scheduledAt: string | null;
  completedAt: string | null;
  outcome: InterviewOutcome | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
