'use client';

import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowUpRight01Icon, Calendar03Icon, Location06Icon } from '@hugeicons/core-free-icons';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { buttonVariants } from '@/components/ui/button';
import { CompanyLogo } from '@/components/applications/CompanyLogo';
import { STATUS_TONE } from '@/components/applications/statusTone';
import { outcomeOf, type InterviewItem } from '@/lib/interviewsHub';
import { useInterviewsT } from '@/lib/interviewsI18n';
import { cn } from '@/lib/utils';
import { OutcomeBadge, StageChip } from './InterviewBadges';
import { formatDateTime } from './time';

/** Side view of one interview, with links to its page and to its application. */
export function InterviewPeek({
  interview,
  timeZone,
  onClose,
}: {
  interview: InterviewItem | null;
  timeZone: string;
  onClose: () => void;
}) {
  const { t, locale } = useInterviewsT();
  const i = interview;

  return (
    <Sheet open={i !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="gap-0 p-0 sm:max-w-md">
        {i && (
          <>
            <SheetHeader className="flex flex-row items-start gap-3 border-b px-6 py-5 pr-14">
              <CompanyLogo name={i.companyName} domain={i.companyDomain} className="size-11" />
              <div className="min-w-0 flex-1">
                <SheetTitle className="truncate text-base font-semibold">{i.companyName}</SheetTitle>
                <SheetDescription className="truncate">{i.jobTitle}</SheetDescription>
              </div>
            </SheetHeader>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
              <div className="flex flex-wrap gap-1.5">
                <StageChip stage={i.stage} />
                <OutcomeBadge outcome={outcomeOf(i)} />
              </div>

              <section className="space-y-2.5">
                <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{t.peek.details}</h3>
                <dl className="space-y-2 text-sm">
                  <Row label={t.peek.when} icon={Calendar03Icon}>
                    {i.scheduledAt ? formatDateTime(i.scheduledAt, locale, timeZone) : t.unscheduled}
                  </Row>
                  <Row label={t.peek.application}>
                    <span className="inline-flex items-center gap-1.5">
                      <span className={cn('size-1.5 rounded-full', STATUS_TONE[i.applicationStatus].dot)} />
                      {t.applicationStatus[i.applicationStatus]}
                    </span>
                  </Row>
                  {i.location && (
                    <Row label={t.peek.location} icon={Location06Icon}>
                      {i.location}
                    </Row>
                  )}
                </dl>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{t.peek.notes}</h3>
                <p className={cn('text-sm whitespace-pre-wrap', !i.notes && 'text-muted-foreground')}>
                  {i.notes ?? t.peek.noNotes}
                </p>
              </section>
            </div>

            <div className="flex flex-col gap-2 border-t px-6 py-4 sm:flex-row">
              <Link href={`/interviews/${i.slug}`} className={cn(buttonVariants({ variant: 'outline' }), 'flex-1')}>
                {t.peek.openInterview}
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} />
              </Link>
              <Link href={`/applications/${i.applicationSlug}`} className={cn(buttonVariants({ variant: 'ghost' }), 'flex-1')}>
                {t.peek.openApplication}
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Row({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: typeof Calendar03Icon;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
        {icon && <HugeiconsIcon icon={icon} size={14} />}
        {label}
      </dt>
      <dd className="min-w-0 text-right break-words text-foreground">{children}</dd>
    </div>
  );
}
