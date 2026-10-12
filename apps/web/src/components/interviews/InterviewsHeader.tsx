'use client';

import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { Calendar03Icon, KanbanIcon, LeftToRightListBulletIcon, Search01Icon } from '@hugeicons/core-free-icons';
import type { InterviewOutcome } from '@apply/core/applications';
import { Input } from '@/components/ui/input';
import { INTERVIEW_LAYOUTS, INTERVIEW_OUTCOMES, type InterviewFilters, type InterviewLayout } from '@/lib/interviewsHub';
import { useInterviewsT } from '@/lib/interviewsI18n';
import { cn } from '@/lib/utils';
import { OUTCOME_TONE } from './tones';

const LAYOUT_ICON: Record<InterviewLayout, IconSvgElement> = {
  list: LeftToRightListBulletIcon,
  kanban: KanbanIcon,
  calendar: Calendar03Icon,
};

/** Title, counts, layout switcher, search and outcome chips: shared by every layout. */
export function InterviewsHeader({
  total,
  upcoming,
  layout,
  onLayoutChange,
  filters,
  onFiltersChange,
  counts,
}: {
  total: number;
  upcoming: number;
  layout: InterviewLayout;
  onLayoutChange: (layout: InterviewLayout) => void;
  filters: InterviewFilters;
  onFiltersChange: (filters: InterviewFilters) => void;
  counts: Record<InterviewOutcome, number>;
}) {
  const { t } = useInterviewsT();

  function toggleOutcome(outcome: InterviewOutcome) {
    const outcomes = filters.outcomes.includes(outcome)
      ? filters.outcomes.filter((o) => o !== outcome)
      : [...filters.outcomes, outcome];
    onFiltersChange({ ...filters, outcomes });
  }

  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t.title}</h1>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
            {t.count(total)}
          </span>
          {upcoming > 0 && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 tabular-nums dark:bg-blue-950 dark:text-blue-300">
              {t.upcomingCount(upcoming)}
            </span>
          )}
        </div>

        <div role="group" aria-label={t.layoutLabel} className="flex items-center gap-0.5 rounded-full border bg-background p-0.5">
          {INTERVIEW_LAYOUTS.map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={layout === l}
              title={t.layouts[l]}
              onClick={() => onLayoutChange(l)}
              className={cn(
                'inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30',
                layout === l ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <HugeiconsIcon icon={LAYOUT_ICON[l]} size={15} />
              <span className="hidden sm:inline">{t.layouts[l]}</span>
              <span className="sr-only sm:hidden">{t.layouts[l]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-72">
          <HugeiconsIcon
            icon={Search01Icon}
            size={15}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={filters.query}
            onChange={(e) => onFiltersChange({ ...filters, query: e.target.value })}
            placeholder={t.search}
            aria-label={t.search}
            className="pl-9"
          />
        </div>
        <button
          type="button"
          aria-pressed={filters.upcomingOnly}
          onClick={() => onFiltersChange({ ...filters, upcomingOnly: !filters.upcomingOnly })}
          className={cn(
            'inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30',
            filters.upcomingOnly
              ? 'border-transparent bg-primary text-primary-foreground'
              : 'bg-background text-muted-foreground hover:text-foreground',
          )}
        >
          {t.upcomingOnly}
        </button>
        {INTERVIEW_OUTCOMES.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={filters.outcomes.includes(o)}
            onClick={() => toggleOutcome(o)}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30',
              filters.outcomes.includes(o)
                ? 'border-transparent bg-primary text-primary-foreground'
                : 'bg-background text-muted-foreground hover:text-foreground',
            )}
          >
            <span className={cn('size-1.5 rounded-full', OUTCOME_TONE[o].dot)} />
            {t.outcomes[o]}
            <span className="tabular-nums opacity-70">{counts[o]}</span>
          </button>
        ))}
      </div>
    </header>
  );
}
