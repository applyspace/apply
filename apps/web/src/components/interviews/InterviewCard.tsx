'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { Clock01Icon } from '@hugeicons/core-free-icons';
import { CompanyLogo } from '@/components/applications/CompanyLogo';
import { outcomeOf, type InterviewItem } from '@/lib/interviewsHub';
import { useInterviewsT } from '@/lib/interviewsI18n';
import { cn } from '@/lib/utils';
import { OutcomeBadge, StageChip } from './InterviewBadges';
import { formatDateTime } from './time';

/** Kanban card: company, role, date and outcome. The whole card opens the peek. */
export function InterviewCard({
  interview,
  timeZone,
  onOpen,
  showStage = false,
  muted = false,
}: {
  interview: InterviewItem;
  timeZone: string;
  onOpen: (interview: InterviewItem) => void;
  showStage?: boolean;
  /** Past interviews read quieter than upcoming ones. */
  muted?: boolean;
}) {
  const { t, locale } = useInterviewsT();
  const i = interview;
  return (
    <button
      type="button"
      onClick={() => onOpen(i)}
      className={cn(
        'flex w-full min-w-0 flex-col gap-3 rounded-2xl border bg-card p-3.5 text-left text-card-foreground outline-none transition-shadow hover:shadow-sm focus-visible:ring-3 focus-visible:ring-ring/30',
        muted && 'bg-card/70',
      )}
    >
      <span className="flex items-center gap-2.5">
        <CompanyLogo name={i.companyName} domain={i.companyDomain} />
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-foreground">{i.companyName}</span>
          <span className="block truncate text-sm text-muted-foreground">{i.jobTitle}</span>
        </span>
      </span>
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <HugeiconsIcon icon={Clock01Icon} size={13} className="shrink-0" />
        {i.scheduledAt ? formatDateTime(i.scheduledAt, locale, timeZone) : t.unscheduled}
      </span>
      <span className="flex flex-wrap gap-1.5">
        {showStage && <StageChip stage={i.stage} />}
        <OutcomeBadge outcome={outcomeOf(i)} />
      </span>
    </button>
  );
}
