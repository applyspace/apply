import type {
  ContractType,
  ExperienceLevel,
  RemoteMode,
  SearchCriteria,
  SearchLocation,
} from './types.js';

/**
 * Columns of a saved search profile (`public.searches`). The list columns come from the
 * onboarding v2 migration (`locations` is a jsonb array of `{ label, ... }`); the single-value
 * columns of the first schema (`search_title`, `location`, `remote_mode`, `salary_min_eur`) are
 * used when the list is empty.
 */
export interface SearchProfileRow {
  job_titles?: string[] | null;
  locations?: unknown;
  remote_modes?: string[] | null;
  contract_types?: string[] | null;
  experience_levels?: string[] | null;
  salary_min?: number | null;
  salary_currency?: string | null;
  search_title?: string | null;
  location?: string | null;
  remote_mode?: string | null;
  salary_min_eur?: number | null;
}

const CONTRACT_MAP: Record<string, ContractType> = {
  cdi: 'permanent',
  cdd: 'fixed_term',
  stage: 'internship',
  freelance: 'freelance',
  apprentissage: 'apprenticeship',
  alternance: 'apprenticeship',
  benevolat: 'volunteer',
  bénévolat: 'volunteer',
};

const REMOTE_VALUES: readonly RemoteMode[] = ['onsite', 'hybrid', 'remote'];
const EXPERIENCE_VALUES: readonly ExperienceLevel[] = ['entry', 'mid', 'senior', 'lead'];

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function mapLocations(raw: unknown): SearchLocation[] {
  if (!Array.isArray(raw)) return [];
  const out: SearchLocation[] = [];
  for (const item of raw) {
    if (typeof item === 'string' && item.trim()) {
      out.push({ label: item.trim() });
    } else if (item && typeof item === 'object') {
      const o = item as Record<string, unknown>;
      const label = typeof o.label === 'string' ? o.label.trim() : '';
      if (!label) continue;
      const loc: SearchLocation = { label };
      if (typeof o.countryCode === 'string') loc.countryCode = o.countryCode.toUpperCase();
      else if (typeof o.country_code === 'string') loc.countryCode = o.country_code.toUpperCase();
      if (typeof o.postalCode === 'string') loc.postalCode = o.postalCode;
      else if (typeof o.postal_code === 'string') loc.postalCode = o.postal_code;
      out.push(loc);
    }
  }
  return out;
}

function orFallback<T>(list: T[], fallback: T | null | undefined): T[] {
  return list.length || fallback == null ? list : [fallback];
}

/** Maps a saved search profile row to platform independent criteria. */
export function searchCriteriaFromProfile(row: SearchProfileRow): SearchCriteria {
  const titles = (row.job_titles ?? []).map((t) => t.trim()).filter(Boolean);
  const locations = mapLocations(row.locations);
  const remoteModes = row.remote_modes?.length ? row.remote_modes : row.remote_mode ? [row.remote_mode] : [];
  const criteria: SearchCriteria = {
    jobTitles: unique(orFallback(titles, row.search_title?.trim() || null)),
    locations: orFallback(locations, row.location?.trim() ? { label: row.location.trim() } : null),
    remoteModes: unique(
      remoteModes.filter((m): m is RemoteMode =>
        (REMOTE_VALUES as readonly string[]).includes(m),
      ),
    ),
    contractTypes: unique(
      (row.contract_types ?? [])
        .map((c) => CONTRACT_MAP[c.trim().toLowerCase()])
        .filter((c): c is ContractType => c !== undefined),
    ),
    experienceLevels: unique(
      (row.experience_levels ?? []).filter((l): l is ExperienceLevel =>
        (EXPERIENCE_VALUES as readonly string[]).includes(l),
      ),
    ),
  };
  if (typeof row.salary_min === 'number' && row.salary_min > 0) {
    criteria.salaryMin = row.salary_min;
    criteria.salaryCurrency = row.salary_currency ?? 'EUR';
  } else if (typeof row.salary_min_eur === 'number' && row.salary_min_eur > 0) {
    criteria.salaryMin = row.salary_min_eur;
    criteria.salaryCurrency = 'EUR';
  }
  return criteria;
}

/**
 * Connectors search one title in one place per call. This fans a criteria object out into one
 * criteria per (title x location). With no location, a single location-less query is returned.
 */
export function splitCriteria(criteria: SearchCriteria): SearchCriteria[] {
  const titles = criteria.jobTitles.length ? criteria.jobTitles : [''];
  const places = criteria.locations.length ? criteria.locations : [];
  const out: SearchCriteria[] = [];
  for (const title of titles) {
    if (!places.length) {
      out.push({ ...criteria, jobTitles: title ? [title] : [], locations: [] });
      continue;
    }
    for (const place of places) {
      out.push({ ...criteria, jobTitles: title ? [title] : [], locations: [place] });
    }
  }
  return out;
}
