import type { InterviewWithRelations } from '@apply/core/applications';
import { readInterviews as readSupabaseInterviews } from '@/lib/applications';
import { demoInterviews } from '@/lib/demo';
import { isDemoRequest } from '@/lib/hosted';
import type { InterviewItem } from '@/lib/interviewsHub';
import { entrySlug } from '@/lib/slug';
import { getSupabaseScope } from '@/lib/supabase/scope';

/**
 * Interview readers. `lib/applications.ts` keeps `readInterviews` for the
 * sidebar and Home (Supabase only); the Interviews page reads from here, which
 * also serves the demo fixtures on the demo host.
 */
export { readInterview } from '@/lib/applications';

/** Supabase when signed in, the demo fixtures on the demo host, nothing otherwise. */
export async function readInterviews(): Promise<InterviewWithRelations[]> {
  if (await getSupabaseScope()) return readSupabaseInterviews();
  return (await isDemoRequest()) ? demoInterviews() : [];
}

const blankToNull = (value: string | null | undefined) => {
  const v = value?.trim();
  return v ? v : null;
};

/** View model of the Interviews page; the slugs match the detail routes. */
export function toInterviewItems(interviews: InterviewWithRelations[]): InterviewItem[] {
  return interviews.map((i) => {
    const a = i.application as InterviewWithRelations['application'] & { location?: string | null };
    return {
      id: i.id,
      slug: entrySlug([a.company.name, a.jobTitle], i.id),
      applicationId: a.id,
      applicationSlug: entrySlug([a.company.name, a.jobTitle], a.id),
      applicationStatus: a.status,
      companyName: a.company.name,
      companyDomain: blankToNull(a.company.domain),
      jobTitle: a.jobTitle,
      location: blankToNull(a.location) ?? blankToNull(a.company.headquarters),
      stage: i.stage,
      scheduledAt: i.scheduledAt,
      completedAt: i.completedAt,
      outcome: i.outcome,
      notes: blankToNull(i.notes),
    };
  });
}
