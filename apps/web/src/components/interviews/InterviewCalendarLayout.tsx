'use client';

import { useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { CompanyLogo } from '@/components/applications/CompanyLogo';
import {
  CALENDAR_VIEWS,
  addDays,
  addMonths,
  dayKeyOf,
  monthGrid,
  monthOf,
  moveFocus,
  outcomeOf,
  weekDays,
  type CalendarView,
  type InterviewItem,
} from '@/lib/interviewsHub';
import { useInterviewsT } from '@/lib/interviewsI18n';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { OutcomeBadge, StageChip } from './InterviewBadges';
import { STAGE_TONE } from './tones';
import { formatDayKey, formatLongDay, formatTime, weekdayNames } from './time';

const MAX_IN_CELL = 3;

/** Month grid or week columns, with the selected day's interviews and the unscheduled ones below. */
export function InterviewCalendarLayout({
  interviews,
  byDay,
  now,
  timeZone,
  initialView,
  onOpen,
}: {
  interviews: InterviewItem[];
  /** Scheduled interviews per local day key. */
  byDay: Map<string, InterviewItem[]>;
  now: number;
  timeZone: string;
  initialView: CalendarView;
  onOpen: (interview: InterviewItem) => void;
}) {
  const { t, locale } = useInterviewsT();
  const todayKey = dayKeyOf(now, timeZone);
  const [view, setView] = useState<CalendarView>(initialView);
  const [picked, setPicked] = useState<string | null>(null);
  const focus = picked ?? todayKey;
  const gridRef = useRef<HTMLDivElement>(null);

  function changeView(next: CalendarView) {
    setView(next);
    const url = new URL(window.location.href);
    if (next === 'month') url.searchParams.delete('view');
    else url.searchParams.set('view', next);
    window.history.replaceState(null, '', url);
  }

  const step = (dir: 1 | -1) => setPicked(view === 'month' ? addMonths(focus, dir) : addDays(focus, dir * 7));

  function onGridKey(e: React.KeyboardEvent) {
    const next = moveFocus(focus, e.key);
    if (!next) return;
    e.preventDefault();
    setPicked(next);
    requestAnimationFrame(() => gridRef.current?.querySelector<HTMLElement>(`[data-day="${next}"]`)?.focus());
  }

  const week = weekDays(focus);
  const title =
    view === 'month'
      ? formatDayKey(`${monthOf(focus)}-01`, locale, { month: 'long', year: 'numeric' })
      : `${formatDayKey(week[0], locale, { day: 'numeric', month: 'short' })} – ${formatDayKey(week[6], locale, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}`;
  const unscheduled = interviews.filter((i) => !i.scheduledAt);
  const selected = byDay.get(focus) ?? [];

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            onClick={() => step(-1)}
            aria-label={view === 'month' ? t.calendar.previousMonth : t.calendar.previousWeek}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          </Button>
          <Button variant="outline" onClick={() => setPicked(null)} disabled={focus === todayKey}>
            {t.calendar.today}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => step(1)}
            aria-label={view === 'month' ? t.calendar.nextMonth : t.calendar.nextWeek}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </Button>
          <h2 className="ml-2 text-base font-medium text-foreground first-letter:uppercase" aria-live="polite">
            {title}
          </h2>
        </div>
        <div role="group" aria-label={t.calendar.viewLabel} className="flex items-center gap-0.5 rounded-full border bg-background p-0.5">
          {CALENDAR_VIEWS.map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => changeView(v)}
              className={cn(
                'inline-flex h-7 items-center rounded-full px-3 text-xs font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30',
                view === v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t.calendar.views[v]}
            </button>
          ))}
        </div>
      </div>

      {view === 'month' ? (
        <MonthGrid
          gridRef={gridRef}
          focus={focus}
          todayKey={todayKey}
          byDay={byDay}
          timeZone={timeZone}
          locale={locale}
          onPick={setPicked}
          onKey={onGridKey}
          onOpen={onOpen}
        />
      ) : (
        <WeekColumns
          gridRef={gridRef}
          days={week}
          focus={focus}
          todayKey={todayKey}
          byDay={byDay}
          timeZone={timeZone}
          locale={locale}
          onPick={setPicked}
          onKey={onGridKey}
          onOpen={onOpen}
        />
      )}

      {view === 'month' && (
        <section aria-labelledby="calendar-day" className="flex flex-col gap-2.5">
          <h3 id="calendar-day" className="flex items-center gap-2 text-sm font-medium text-foreground first-letter:uppercase">
            {formatLongDay(focus, locale)}
            <span className="text-xs font-normal text-muted-foreground">{t.calendar.dayCount(selected.length)}</span>
          </h3>
          {selected.length === 0 ? (
            <p className="rounded-xl border border-dashed px-3 py-5 text-center text-xs text-muted-foreground">
              {t.calendar.noneThisDay}
            </p>
          ) : (
            <AgendaList items={selected} timeZone={timeZone} locale={locale} onOpen={onOpen} />
          )}
        </section>
      )}

      {unscheduled.length > 0 && (
        <section aria-labelledby="calendar-unscheduled" className="flex flex-col gap-2.5">
          <h3 id="calendar-unscheduled" className="flex items-center gap-2 text-sm font-medium text-foreground">
            {t.calendar.notScheduled}
            <span className="text-xs font-normal tabular-nums text-muted-foreground">{unscheduled.length}</span>
          </h3>
          <AgendaList items={unscheduled} timeZone={timeZone} locale={locale} onOpen={onOpen} />
        </section>
      )}
    </div>
  );
}

interface GridProps {
  gridRef: React.RefObject<HTMLDivElement | null>;
  focus: string;
  todayKey: string;
  byDay: Map<string, InterviewItem[]>;
  timeZone: string;
  locale: Locale;
  onPick: (key: string) => void;
  onKey: (e: React.KeyboardEvent) => void;
  onOpen: (interview: InterviewItem) => void;
}

function MonthGrid({ gridRef, focus, todayKey, byDay, timeZone, locale, onPick, onKey, onOpen }: GridProps) {
  const { t } = useInterviewsT();
  const weeks = monthGrid(focus);
  const names = weekdayNames(locale, 'short');
  const narrow = weekdayNames(locale, 'narrow');

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <p id="calendar-hint" className="sr-only">
        {t.calendar.gridHint}
      </p>
      <div
        ref={gridRef}
        role="grid"
        aria-describedby="calendar-hint"
        aria-label={formatDayKey(focus, locale, { month: 'long', year: 'numeric' })}
        onKeyDown={onKey}
      >
        <div role="row" className="grid grid-cols-7 border-b bg-muted/40">
          {names.map((n, idx) => (
            <span key={n} role="columnheader" aria-label={n} className="px-2 py-2 text-center text-xs font-medium text-muted-foreground md:text-left">
              <span aria-hidden="true" className="md:hidden">
                {narrow[idx]}
              </span>
              <span aria-hidden="true" className="hidden md:inline">
                {n}
              </span>
            </span>
          ))}
        </div>
        {weeks.map((w) => (
          <div key={w[0].key} role="row" className="grid grid-cols-7 border-b last:border-b-0">
            {w.map((d) => {
              const items = byDay.get(d.key) ?? [];
              const isFocus = d.key === focus;
              const isToday = d.key === todayKey;
              const label = `${formatLongDay(d.key, locale)}, ${t.calendar.dayCount(items.length)}`;
              return (
                <div
                  key={d.key}
                  role="gridcell"
                  aria-selected={isFocus}
                  className={cn(
                    'flex min-h-14 min-w-0 flex-col gap-1 border-r p-1 last:border-r-0 md:min-h-28 md:p-1.5',
                    !d.inMonth && 'bg-muted/30',
                    isFocus && 'bg-accent/50',
                  )}
                >
                  <button
                    type="button"
                    data-day={d.key}
                    tabIndex={isFocus ? 0 : -1}
                    aria-label={label}
                    aria-current={isToday ? 'date' : undefined}
                    onClick={() => onPick(d.key)}
                    className="flex flex-col items-center gap-1 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/30 md:items-start"
                  >
                    <span
                      className={cn(
                        'flex size-7 items-center justify-center rounded-full text-sm tabular-nums',
                        isToday && 'bg-primary font-semibold text-primary-foreground',
                        !isToday && isFocus && 'ring-1 ring-foreground/30',
                        !d.inMonth && !isToday && 'text-muted-foreground',
                      )}
                    >
                      {formatDayKey(d.key, locale, { day: 'numeric' })}
                    </span>
                    {/* Mobile: one dot per interview (up to three). */}
                    {items.length > 0 && (
                      <span className="flex gap-0.5 md:hidden" aria-hidden="true">
                        {items.slice(0, MAX_IN_CELL).map((i) => (
                          <span key={i.id} className={cn('size-1.5 rounded-full', STAGE_TONE[i.stage].dot)} />
                        ))}
                      </span>
                    )}
                  </button>
                  {/* Desktop: the interviews themselves. */}
                  <div className="hidden min-w-0 flex-col gap-0.5 md:flex">
                    {items.slice(0, MAX_IN_CELL).map((i) => (
                      <button
                        key={i.id}
                        type="button"
                        tabIndex={isFocus ? 0 : -1}
                        onClick={() => onOpen(i)}
                        className="flex min-w-0 items-center gap-1.5 rounded-md px-1.5 py-0.5 text-left text-xs outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/30"
                      >
                        <span className={cn('size-1.5 shrink-0 rounded-full', STAGE_TONE[i.stage].dot)} />
                        <span className="shrink-0 text-muted-foreground tabular-nums">
                          {formatTime(i.scheduledAt!, locale, timeZone)}
                        </span>
                        <span className="truncate text-foreground">{i.companyName}</span>
                      </button>
                    ))}
                    {items.length > MAX_IN_CELL && (
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => onPick(d.key)}
                        className="rounded-md px-1.5 text-left text-xs text-muted-foreground hover:text-foreground"
                      >
                        {t.calendar.more(items.length - MAX_IN_CELL)}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function WeekColumns({
  gridRef,
  days,
  focus,
  todayKey,
  byDay,
  timeZone,
  locale,
  onPick,
  onKey,
  onOpen,
}: GridProps & { days: string[] }) {
  const { t } = useInterviewsT();
  return (
    <div
      ref={gridRef}
      role="group"
      aria-label={t.calendar.views.week}
      onKeyDown={onKey}
      className="grid grid-cols-1 gap-2 md:grid-cols-7"
    >
      {days.map((key) => {
        const items = byDay.get(key) ?? [];
        const isToday = key === todayKey;
        const isFocus = key === focus;
        return (
          <section
            key={key}
            aria-label={formatLongDay(key, locale)}
            className={cn(
              'flex min-w-0 flex-row gap-3 rounded-2xl bg-muted/50 p-2 md:min-h-64 md:flex-col md:gap-2',
              isFocus && 'ring-1 ring-ring/40',
            )}
          >
            <button
              type="button"
              data-day={key}
              tabIndex={isFocus ? 0 : -1}
              aria-current={isToday ? 'date' : undefined}
              onClick={() => onPick(key)}
              className="flex w-12 shrink-0 flex-col items-center rounded-lg py-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/30 md:w-auto md:flex-row md:gap-2 md:px-1.5"
            >
              <span className="text-xs font-medium text-muted-foreground first-letter:uppercase">
                {formatDayKey(key, locale, { weekday: 'short' })}
              </span>
              <span
                className={cn(
                  'flex size-7 items-center justify-center rounded-full text-sm font-medium tabular-nums',
                  isToday && 'bg-primary text-primary-foreground',
                )}
              >
                {formatDayKey(key, locale, { day: 'numeric' })}
              </span>
            </button>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              {items.length === 0 ? (
                <p className="py-2 text-xs text-muted-foreground md:px-1.5">–</p>
              ) : (
                items.map((i) => (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => onOpen(i)}
                    className="flex min-w-0 flex-col gap-1.5 rounded-xl border bg-card p-2.5 text-left outline-none transition-shadow hover:shadow-sm focus-visible:ring-3 focus-visible:ring-ring/30"
                  >
                    <span className="text-xs font-medium text-muted-foreground tabular-nums">
                      {formatTime(i.scheduledAt!, locale, timeZone)}
                    </span>
                    <span className="truncate text-sm font-medium text-foreground">{i.companyName}</span>
                    <span className="truncate text-xs text-muted-foreground">{i.jobTitle}</span>
                    <StageChip stage={i.stage} className="self-start" />
                  </button>
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function AgendaList({
  items,
  timeZone,
  locale,
  onOpen,
}: {
  items: InterviewItem[];
  timeZone: string;
  locale: Locale;
  onOpen: (interview: InterviewItem) => void;
}) {
  const { t } = useInterviewsT();
  return (
    <ul className="flex flex-col divide-y overflow-hidden rounded-2xl border bg-card">
      {items.map((i) => (
        <li key={i.id}>
          <button
            type="button"
            onClick={() => onOpen(i)}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-left outline-none transition-colors hover:bg-accent/60 focus-visible:bg-accent/60 focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:ring-inset sm:px-4"
          >
            <span className="w-12 shrink-0 text-sm font-medium text-foreground tabular-nums">
              {i.scheduledAt ? formatTime(i.scheduledAt, locale, timeZone) : '–'}
            </span>
            <CompanyLogo name={i.companyName} domain={i.companyDomain} className="size-8" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-foreground">{i.companyName}</span>
              <span className="block truncate text-xs text-muted-foreground">{i.jobTitle}</span>
            </span>
            <StageChip stage={i.stage} />
            <OutcomeBadge outcome={outcomeOf(i)} className="hidden sm:inline-flex" />
            {!i.scheduledAt && <span className="sr-only">{t.unscheduled}</span>}
          </button>
        </li>
      ))}
    </ul>
  );
}
