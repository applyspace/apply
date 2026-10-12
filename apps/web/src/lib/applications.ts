import type {
  ApplicationWithRelations,
  InterviewWithRelations,
} from '@apply/core/applications';
import { getSupabaseScope } from '@/lib/supabase/scope';
import * as supabaseData from '@/lib/supabase/queries';
import { demoApplications, demoInterviews } from '@/lib/demo';
import { isDemoRequest } from '@/lib/hosted';

// Supabase for signed-in users, invented fixtures on the hosted demo, nothing otherwise.

/**
 * All applications, newest `appliedAt` first. Pre-joins `company` (the FK now
 * owns the company name) and `offer` (nullable — `null` when the user logged
 * an application that didn't come from the scraper).
 */
export async function readApplications(): Promise<ApplicationWithRelations[]> {
  const scope = await getSupabaseScope();
  if (scope) return supabaseData.readApplications(scope);
  return (await isDemoRequest()) ? demoApplications() : [];
}

export async function readApplication(
  id: string,
): Promise<ApplicationWithRelations | null> {
  const scope = await getSupabaseScope();
  if (scope) return supabaseData.readApplication(scope, id);
  return (await isDemoRequest()) ? (demoApplications().find((a) => a.id === id) ?? null) : null;
}

/**
 * All interviews, newest `createdAt` first. Pre-joins its parent application
 * and that application's company so the sidebar / list pages can render
 * "{company}, {jobTitle}" without a second query.
 */
export async function readInterviews(): Promise<InterviewWithRelations[]> {
  const scope = await getSupabaseScope();
  if (scope) return supabaseData.readInterviews(scope);
  return (await isDemoRequest()) ? demoInterviews() : [];
}

export async function readInterview(
  id: string,
): Promise<InterviewWithRelations | null> {
  const scope = await getSupabaseScope();
  if (scope) return supabaseData.readInterview(scope, id);
  return (await isDemoRequest()) ? (demoInterviews().find((i) => i.id === id) ?? null) : null;
}
