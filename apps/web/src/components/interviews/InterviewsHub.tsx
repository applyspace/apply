'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  NO_INTERVIEW_FILTERS,
  countByOutcome,
  filterInterviews,
  groupByDay,
  hasInterviewFilters,
  phaseOf,
  type CalendarView,
  type InterviewFilters,
  type InterviewItem,
  type InterviewLayout,
} from '@/lib/interviewsHub';
import { useInterviewsT } from '@/lib/interviewsI18n';
import { cn } from '@/lib/utils';
import { InterviewCalendarLayout } from './InterviewCalendarLayout';
import { InterviewKanbanLayout } from './InterviewKanbanLayout';
import { InterviewListLayout } from './InterviewListLayout';
import { InterviewPeek } from './InterviewPeek';
import { InterviewsHeader } from './InterviewsHeader';
import { useTimeZone } from './time';

/** The Interviews page: one list, three layouts (`?layout=list|kanban|calendar`), shared filters and peek. */
export function InterviewsHub({
  interviews,
  nowIso,
  initialLayout,
  initialCalendarView,
}: {
  interviews: InterviewItem[];
  /** Server time, so server and client agree on what is upcoming. */
  nowIso: string;
  initialLayout: InterviewLayout;
  initialCalendarView: CalendarView;
}) {
  const { t } = useInterviewsT();
  const now = Date.parse(nowIso);
  const timeZone = useTimeZone();
  const [layout, setLayout] = useState<InterviewLayout>(initialLayout);
  const [filters, setFilters] = useState<InterviewFilters>(NO_INTERVIEW_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function changeLayout(next: InterviewLayout) {
    if (next === layout) return;
    setLayout(next);
    // Keep the layout in the URL so a reload or a shared link opens the same view.
    const url = new URL(window.location.href);
    if (next === 'list') url.searchParams.delete('layout');
    else url.searchParams.set('layout', next);
    if (next !== 'calendar') url.searchParams.delete('view');
    window.history.replaceState(null, '', url);
  }

  const visible = filterInterviews(interviews, filters, now);
  const byDay = groupByDay(visible, timeZone);
  const upcoming = interviews.filter((i) => phaseOf(i, now) === 'upcoming').length;
  const selected = interviews.find((i) => i.id === selectedId) ?? null;
  const open = (i: InterviewItem) => setSelectedId(i.id);

  return (
    <div className="flex h-full flex-col gap-5 px-4 py-6 sm:px-8 md:px-12 md:py-10">
      <InterviewsHeader
        total={interviews.length}
        upcoming={upcoming}
        layout={layout}
        onLayoutChange={changeLayout}
        filters={filters}
        onFiltersChange={setFilters}
        counts={countByOutcome(interviews)}
      />

      {interviews.length === 0 ? (
        <EmptyState title={t.emptyTitle} body={t.emptyBody}>
          <Link href="/applications" className={cn(buttonVariants({ variant: 'outline' }))}>
            {t.openApplications}
          </Link>
        </EmptyState>
      ) : visible.length === 0 ? (
        <EmptyState title={t.noMatchTitle} body={t.noMatchBody}>
          {hasInterviewFilters(filters) && (
            <Button variant="outline" onClick={() => setFilters(NO_INTERVIEW_FILTERS)}>
              {t.clearFilters}
            </Button>
          )}
        </EmptyState>
      ) : (
        <>
          {layout === 'list' && <InterviewListLayout interviews={visible} now={now} timeZone={timeZone} onOpen={open} />}
          {layout === 'kanban' && <InterviewKanbanLayout interviews={visible} now={now} timeZone={timeZone} onOpen={open} />}
          {layout === 'calendar' && (
            <InterviewCalendarLayout
              interviews={visible}
              byDay={byDay}
              now={now}
              timeZone={timeZone}
              initialView={initialCalendarView}
              onOpen={open}
            />
          )}
        </>
      )}

      <InterviewPeek interview={selected} timeZone={timeZone} onClose={() => setSelectedId(null)} />
    </div>
  );
}

function EmptyState({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-16 text-center">
      <h2 className="text-base font-medium text-foreground">{title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{body}</p>
      {children}
    </div>
  );
}
