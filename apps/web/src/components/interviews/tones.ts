import type { InterviewOutcome, InterviewStage } from '@apply/core/applications';

/** Tailwind classes per interview stage: a dot and a soft chip (light and dark). */
export const STAGE_TONE: Record<InterviewStage, { dot: string; chip: string }> = {
  HR: { dot: 'bg-stone-400', chip: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200' },
  Manager: { dot: 'bg-blue-500', chip: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
  'Design Case': { dot: 'bg-violet-500', chip: 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300' },
  'Team-Fit': { dot: 'bg-teal-500', chip: 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300' },
  Technical: { dot: 'bg-indigo-500', chip: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
  Final: { dot: 'bg-green-500', chip: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' },
  Other: { dot: 'bg-stone-300 dark:bg-stone-600', chip: 'bg-muted text-muted-foreground' },
};

export const OUTCOME_TONE: Record<InterviewOutcome, { dot: string; badge: string }> = {
  pending: { dot: 'bg-stone-400', badge: 'bg-muted text-muted-foreground' },
  passed: { dot: 'bg-green-500', badge: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' },
  failed: { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300' },
  ghosted: { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
};
