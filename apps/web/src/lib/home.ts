import { readApplications, readInterviews } from '@/lib/applications';
import { listDocuments } from '@/lib/candidate-profile';
import { buildHomeDashboard, type HomeDashboard } from '@/lib/homeDashboard';
import { readOffers } from '@/lib/offers';
import { readSettings } from '@/lib/settings';
import { getSupabaseScope } from '@/lib/supabase/scope';

/** Whether a CV is in the user's documents. Never throws; false on the demo and when signed out. */
async function readHasCv(): Promise<boolean> {
  const scope = await getSupabaseScope();
  if (!scope) return false;
  try {
    return (await listDocuments(scope)).some((d) => d.kind === 'cv');
  } catch {
    return false;
  }
}

/**
 * Everything the Home dashboard shows, built from the shared readers
 * (Supabase when signed in, fixtures on the public demo). No new query:
 * the view model is computed by `buildHomeDashboard` (pure, unit-tested).
 */
export async function readHomeDashboard(): Promise<HomeDashboard> {
  const [settings, applications, interviews, offers, hasCv] = await Promise.all([
    readSettings(),
    readApplications(),
    readInterviews(),
    readOffers(),
    readHasCv(),
  ]);

  return buildHomeDashboard({
    applications,
    interviews,
    offers,
    profile: {
      firstName: settings.firstName,
      lastName: settings.lastName,
      jobTitle: settings.jobTitle,
      location: settings.location,
      searchTitles: settings.searchTitles,
      salaryMin: settings.salaryMin,
      hasCv,
    },
    now: Date.now(),
  });
}
