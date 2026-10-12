'use client';

import type { InterviewOutcome, InterviewStage } from '@apply/core/applications';
import { useInterviewsT } from '@/lib/interviewsI18n';
import { cn } from '@/lib/utils';
import { OUTCOME_TONE, STAGE_TONE } from './tones';

export function StageChip({ stage, className }: { stage: InterviewStage; className?: string }) {
  const { t } = useInterviewsT();
  return (
    <span
      className={cn(
        'inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2 text-xs font-medium',
        STAGE_TONE[stage].chip,
        className,
      )}
    >
      {t.stages[stage]}
    </span>
  );
}

export function OutcomeBadge({ outcome, className }: { outcome: InterviewOutcome; className?: string }) {
  const { t } = useInterviewsT();
  return (
    <span
      className={cn(
        'inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2 text-xs font-medium',
        OUTCOME_TONE[outcome].badge,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', OUTCOME_TONE[outcome].dot)} />
      {t.outcomes[outcome]}
    </span>
  );
}
