'use client';

import { CompanyLogo } from '@/components/applications/CompanyLogo';
import {
  dayDiff,
  dayKeyOf,
  outcomeOf,
  splitByPhase,
  type InterviewItem,
  type InterviewPhase,
} from '@/lib/interviewsHub';
import { useInterviewsT, type InterviewsT } from '@/lib/interviewsI18n';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { OutcomeBadge, StageChip } from './InterviewBadges';
import { formatDayKey, formatLongDay, formatTime } from './time';

const SECTIONS: readonly InterviewPhase[] = ['upcoming', 'unscheduled', 'past'];

function relative(t: InterviewsT, diff: number): string {
  if (diff === 0) return t.today;
  if (diff === 1) return t.tomorrow;
  return diff > 0 ? t.inDays(diff) : t.daysAgo(-diff);
}

/** Interviews by phase: upcoming (soonest first), not scheduled, past (latest first). */
export function InterviewListLayout({
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
  const { t, locale } = useInterviewsT();
  const sections = splitByPhase(interviews, now);
  const todayKey = dayKeyOf(now, timeZone);

  return (
    <div className="flex flex-col gap-8 pb-6">
      {SECTIONS.map((phase) => {
        const items = sections[phase];
        if (phase === 'unscheduled' && items.length === 0) return null;
        return (
          <section key={phase} aria-labelledby={`interviews-${phase}`} className="flex flex-col gap-2.5">
            <h2 id={`interviews-${phase}`} className="flex items-center gap-2 text-sm font-medium text-foreground">
              {t.phases[phase]}
              <span className="text-xs tabular-nums text-muted-foreground">{items.length}</span>
            </h2>
            {items.length === 0 ? (
              <p className="rounded-xl border border-dashed px-3 py-5 text-center text-xs text-muted-foreground">
                {t.emptySection}
              </p>
            ) : (
              <ul className="flex flex-col divide-y overflow-hidden rounded-2xl border bg-card">
                {items.map((i) => {
                  const key = i.scheduledAt ? dayKeyOf(i.scheduledAt, timeZone) : null;
                  return (
                    <li key={i.id}>
                      <button
                        type="button"
                        onClick={() => onOpen(i)}
                        className={cn(
                          'flex w-full items-center gap-3 px-3 py-3 text-left outline-none transition-colors hover:bg-accent/60 focus-visible:bg-accent/60 focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:ring-inset sm:gap-4 sm:px-4',
                          phase === 'past' && 'text-muted-foreground',
                        )}
                      >
                        <DateBlock dayKey={key} muted={phase === 'past'} locale={locale} />
                        <CompanyLogo name={i.companyName} domain={i.companyDomain} className="hidden sm:flex" />
                        <span className="flex min-w-0 flex-1 flex-col gap-1">
                          <span className="flex min-w-0 items-baseline gap-1.5">
                            <span className="truncate text-sm font-medium text-foreground">{i.companyName}</span>
                            <span className="hidden truncate text-sm text-muted-foreground sm:inline">{i.jobTitle}</span>
                          </span>
                          <span className="truncate text-xs text-muted-foreground sm:hidden">{i.jobTitle}</span>
                          <span className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                            {i.scheduledAt && key ? (
                              <span className="tabular-nums">
                                <span className="sr-only">
                                  {formatLongDay(key, locale)},{' '}
                                </span>
                                {formatTime(i.scheduledAt, locale, timeZone)} · {relative(t, dayDiff(todayKey, key))}
                              </span>
                            ) : (
                              <span>{t.unscheduled}</span>
                            )}
                            <StageChip stage={i.stage} className="sm:hidden" />
                          </span>
                        </span>
                        <StageChip stage={i.stage} className="hidden sm:inline-flex" />
                        <OutcomeBadge outcome={outcomeOf(i)} className="hidden sm:inline-flex" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

function DateBlock({ dayKey, muted, locale }: { dayKey: string | null; muted: boolean; locale: Locale }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex w-12 shrink-0 flex-col items-center rounded-xl border bg-background py-1 leading-tight',
        muted && 'opacity-70',
      )}
    >
      {dayKey ? (
        <>
          <span className="text-[10px] font-medium text-muted-foreground uppercase">
            {formatDayKey(dayKey, locale, { month: 'short' })}
          </span>
          <span className="text-lg font-semibold text-foreground tabular-nums">
            {formatDayKey(dayKey, locale, { day: 'numeric' })}
          </span>
          <span className="text-[10px] text-muted-foreground">{formatDayKey(dayKey, locale, { weekday: 'short' })}</span>
        </>
      ) : (
        <span className="py-2.5 text-lg text-muted-foreground">–</span>
      )}
    </span>
  );
}
