'use client';

import { useState } from 'react';
import type { InterviewStage } from '@apply/core/applications';
import { INTERVIEW_STAGES, byStage, countByStage, phaseOf, type InterviewItem } from '@/lib/interviewsHub';
import { useInterviewsT } from '@/lib/interviewsI18n';
import { cn } from '@/lib/utils';
import { InterviewCard } from './InterviewCard';
import { STAGE_TONE } from './tones';

/**
 * One column per interview stage, upcoming interviews on top. Read-only: a
 * stage describes the kind of interview, so cards are not dragged between columns.
 */
export function InterviewKanbanLayout({
  interviews,
  now,
  timeZone,
  onOpen,
}: {
  interviews: InterviewItem[];
  now: number;
  timeZone: string;
  onOpen: (interview: InterviewItem) => void;
}) {
  const { t } = useInterviewsT();
  const counts = countByStage(interviews);
  // "Other" only shows when it holds something; the main stages always do.
  const stages = INTERVIEW_STAGES.filter((s) => s !== 'Other' || counts.Other > 0);
  const firstWithItems = stages.find((s) => counts[s] > 0) ?? stages[0];
  const [active, setActive] = useState<InterviewStage>(firstWithItems);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {/* Mobile: one column at a time, picked from a stage strip. */}
      <div role="tablist" aria-label={t.layouts.kanban} className="flex gap-1.5 overflow-x-auto md:hidden">
        {stages.map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={active === s}
            onClick={() => setActive(s)}
            className={cn(
              'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30',
              active === s ? 'border-transparent bg-primary text-primary-foreground' : 'bg-background text-muted-foreground',
            )}
          >
            {t.stages[s]}
            <span className="tabular-nums opacity-70">{counts[s]}</span>
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto pb-4">
        {stages.map((s) => {
          const items = byStage(interviews, s, now);
          return (
            <section
              key={s}
              aria-label={t.stages[s]}
              className={cn(
                'min-w-0 flex-col rounded-2xl bg-muted/50 p-2 md:flex md:w-72 md:shrink-0',
                active === s ? 'flex w-full' : 'hidden',
              )}
            >
              <header className="flex items-center gap-2 px-2 py-1.5">
                <span className={cn('size-2 rounded-full', STAGE_TONE[s].dot)} />
                <h2 className="text-sm font-medium text-foreground">{t.stages[s]}</h2>
                <span className="text-xs tabular-nums text-muted-foreground">{counts[s]}</span>
              </header>
              <div className="flex flex-col gap-2 overflow-y-auto p-0.5">
                {items.length === 0 ? (
                  <p className="rounded-xl border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
                    {t.emptyColumn}
                  </p>
                ) : (
                  items.map((i) => (
                    <InterviewCard
                      key={i.id}
                      interview={i}
                      timeZone={timeZone}
                      onOpen={onOpen}
                      muted={phaseOf(i, now) === 'past'}
                    />
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
