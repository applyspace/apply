'use client';

import Link from 'next/link';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import {
  Add01Icon,
  AlarmClockIcon,
  Calendar03Icon,
  ChartBarLineIcon,
  MailReceive01Icon,
  NewReleasesIcon,
  SentIcon,
  UserCircleIcon,
} from '@hugeicons/core-free-icons';
import { CompanyLogo } from '@/components/applications/CompanyLogo';
import { STATUS_TONE } from '@/components/applications/statusTone';
import { useLocale } from '@/components/providers/Providers';
import { buttonVariants } from '@/components/ui/button';
import { HUB_STATUSES } from '@/lib/applicationsHub';
import { hubStrings } from '@/lib/applicationsI18n';
import type { HomeDashboard as HomeDashboardModel, ProfileItem } from '@/lib/homeDashboard';
import type { Locale, T } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { HomeCard, HomeCardEmpty, HomeCardHeader } from './HomeCard';

type HomeT = T['home'];

/** `{n}` / `{name}` placeholders of the dictionary. */
const fill = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''));

const intlLocale = (locale: Locale) => (locale === 'fr' ? 'fr-FR' : 'en-GB');

/** Where each missing profile item is filled in. */
const PROFILE_HREF: Record<ProfileItem, string> = {
  name: '/?settings=account',
  jobTitle: '/?settings=profile',
  location: '/?settings=profile',
  search: '/offers',
  salary: '/offers',
  cv: '/?settings=documents',
};

const ROW_LINK =
  'flex items-center gap-3 rounded-xl px-2 py-2 -mx-2 transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none';

export function HomeDashboard({ data, canCreate }: { data: HomeDashboardModel; canCreate: boolean }) {
  const { t: dict, locale } = useLocale();
  const t = dict.home;
  const isNew = data.totals.applications === 0;

  return (
    <div className="mx-auto flex w-full max-w-[72rem] flex-col gap-6 px-4 py-8 sm:px-8 md:px-12 md:py-12">
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div className="min-w-0">
          <h1
            className="font-[family-name:var(--font-display)] text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground sm:text-[3rem]"
            style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 64' }}
          >
            {data.firstName ? fill(t.greeting, { name: data.firstName }) : t.greetingAnonymous}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">{t.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/offers" className={cn(buttonVariants({ variant: 'outline' }))}>
            {t.browseOffers}
          </Link>
          {canCreate && (
            <Link href="/applications?new=1" className={cn(buttonVariants(), 'gap-1.5')}>
              <HugeiconsIcon icon={Add01Icon} size={16} aria-hidden="true" />
              {t.newApplication}
            </Link>
          )}
        </div>
      </header>

      {isNew && <EmptyBanner t={t} />}

      <StatTiles data={data} t={t} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InterviewsCard data={data} t={t} locale={locale} />
        <FollowUpsCard data={data} t={t} />
        <StatusCard data={data} t={t} locale={locale} />
        <OffersCard data={data} t={t} />
      </div>

      {data.profile.percent < 100 && <ProfileNudge data={data} t={t} />}
    </div>
  );
}

function EmptyBanner({ t }: { t: HomeT }) {
  return (
    <section className="rounded-2xl bg-muted p-5">
      <h2 className="text-sm font-medium text-foreground">{t.empty.title}</h2>
      <p className="mt-1 max-w-[34rem] text-sm text-muted-foreground">{t.empty.body}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/offers" className={cn(buttonVariants())}>
          {t.empty.search}
        </Link>
        <Link href="/applications" className={cn(buttonVariants({ variant: 'outline' }))}>
          {t.empty.track}
        </Link>
      </div>
    </section>
  );
}

function StatTiles({ data, t }: { data: HomeDashboardModel; t: HomeT }) {
  const tiles: { icon: IconSvgElement; label: string; value: number; hint: string; href: string }[] = [
    {
      icon: SentIcon,
      label: t.stats.applications,
      value: data.totals.applications,
      hint: fill(t.stats.applicationsHint, { n: data.totals.active }),
      href: '/applications',
    },
    {
      icon: MailReceive01Icon,
      label: t.stats.answers,
      value: data.totals.answers,
      hint: t.stats.answersHint,
      href: '/applications',
    },
    {
      icon: Calendar03Icon,
      label: t.stats.interviews,
      value: data.totals.upcomingInterviews,
      hint: t.stats.interviewsHint,
      href: '/interviews',
    },
    {
      icon: NewReleasesIcon,
      label: t.stats.offers,
      value: data.totals.newOffers,
      hint: t.stats.offersHint,
      href: '/offers',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {tiles.map((tile) => (
        <Link
          key={tile.label}
          href={tile.href}
          className="group rounded-2xl border bg-card p-4 transition-colors hover:bg-muted/50 sm:p-5"
        >
          <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
            <HugeiconsIcon icon={tile.icon} size={16} aria-hidden="true" className="shrink-0" />
            <span className="truncate">{tile.label}</span>
          </span>
          <span className="mt-2 block text-3xl font-semibold tracking-tight tabular-nums text-foreground sm:mt-3 sm:text-4xl">
            {tile.value}
          </span>
          <span className="mt-1 line-clamp-2 text-xs text-muted-foreground">{tile.hint}</span>
        </Link>
      ))}
    </div>
  );
}

function InterviewsCard({ data, t, locale }: { data: HomeDashboardModel; t: HomeT; locale: Locale }) {
  const day = new Intl.DateTimeFormat(intlLocale(locale), { day: 'numeric' });
  const month = new Intl.DateTimeFormat(intlLocale(locale), { month: 'short' });
  const time = new Intl.DateTimeFormat(intlLocale(locale), { hour: '2-digit', minute: '2-digit' });
  const when = (inDays: number) =>
    inDays === 0 ? t.interviews.today : inDays === 1 ? t.interviews.tomorrow : fill(t.interviews.inDays, { n: inDays });

  return (
    <HomeCard aria-labelledby="home-interviews">
      <HomeCardHeader
        id="home-interviews"
        icon={Calendar03Icon}
        title={t.interviews.title}
        count={data.totals.upcomingInterviews}
        href="/interviews"
        linkLabel={t.seeAll}
      />
      {data.interviews.length === 0 ? (
        <HomeCardEmpty>{t.interviews.empty}</HomeCardEmpty>
      ) : (
        <ul className="mt-3 flex flex-col">
          {data.interviews.map((iv) => {
            const date = new Date(iv.scheduledAt);
            const hasTime = iv.scheduledAt.includes('T');
            return (
              <li key={iv.id}>
                <Link href={`/interviews/${iv.slug}`} className={ROW_LINK}>
                  {/* Viewer's time zone: the server may render another day or hour, the client corrects it. */}
                  <time
                    dateTime={iv.scheduledAt}
                    suppressHydrationWarning
                    className={cn(
                      'flex size-11 shrink-0 flex-col items-center justify-center rounded-xl border leading-none',
                      iv.inDays <= 1 ? 'border-foreground/15 bg-foreground text-background' : 'bg-background',
                    )}
                  >
                    <span className="text-[0.625rem] font-medium uppercase tracking-wide opacity-70" suppressHydrationWarning>
                      {month.format(date)}
                    </span>
                    <span className="mt-0.5 text-base font-semibold tabular-nums" suppressHydrationWarning>
                      {day.format(date)}
                    </span>
                  </time>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">{iv.companyName}</span>
                    <span className="block truncate text-xs text-muted-foreground">{iv.jobTitle}</span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1">
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[0.6875rem] font-medium text-muted-foreground">
                      {t.stages[iv.stage] ?? iv.stage}
                    </span>
                    <span className="text-xs tabular-nums text-muted-foreground" suppressHydrationWarning>
                      {when(iv.inDays)}
                      {hasTime && ` · ${time.format(date)}`}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </HomeCard>
  );
}

function FollowUpsCard({ data, t }: { data: HomeDashboardModel; t: HomeT }) {
  const reason = (f: HomeDashboardModel['followUps'][number]) => {
    if (f.reason === 'stale') return fill(t.followUps.stale, { n: f.days });
    if (f.days === 0) return t.followUps.deadlineToday;
    if (f.days === 1) return t.followUps.deadlineTomorrow;
    return fill(t.followUps.deadline, { n: f.days });
  };
  const more = data.followUpCount - data.followUps.length;

  return (
    <HomeCard aria-labelledby="home-follow-ups">
      <HomeCardHeader
        id="home-follow-ups"
        icon={AlarmClockIcon}
        title={t.followUps.title}
        count={data.followUpCount}
        href="/applications"
        linkLabel={t.seeAll}
      />
      {data.followUps.length === 0 ? (
        <HomeCardEmpty>{t.followUps.empty}</HomeCardEmpty>
      ) : (
        <ul className="mt-3 flex flex-col">
          {data.followUps.map((f) => (
            <li key={f.id}>
              <Link href={`/applications/${f.slug}`} className={ROW_LINK}>
                <CompanyLogo name={f.companyName} domain={f.companyDomain} className="size-11 rounded-xl" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">{f.companyName}</span>
                  <span className="block truncate text-xs text-muted-foreground">{f.jobTitle}</span>
                </span>
                <span
                  className={cn(
                    'shrink-0 rounded-md px-1.5 py-0.5 text-[0.6875rem] font-medium',
                    f.reason === 'deadline'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {reason(f)}
                </span>
              </Link>
            </li>
          ))}
          {more > 0 && (
            <li className="px-2 pt-2 text-xs text-muted-foreground">{fill(t.followUps.more, { n: more })}</li>
          )}
        </ul>
      )}
    </HomeCard>
  );
}

function StatusCard({ data, t, locale }: { data: HomeDashboardModel; t: HomeT; locale: Locale }) {
  const labels = hubStrings[locale].statusesShort;
  const total = data.totals.applications;

  return (
    <HomeCard aria-labelledby="home-status">
      <HomeCardHeader
        id="home-status"
        icon={ChartBarLineIcon}
        title={t.byStatus.title}
        href="/applications"
        linkLabel={t.seeAll}
      />
      {total === 0 ? (
        <HomeCardEmpty>{t.byStatus.empty}</HomeCardEmpty>
      ) : (
        <>
          {/* One bar, one segment per status; the legend below carries the numbers. */}
          <div className="mt-5 flex h-2.5 gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
            {HUB_STATUSES.filter((s) => data.statusCounts[s] > 0).map((s) => (
              <span
                key={s}
                className={cn('h-full first:rounded-l-full last:rounded-r-full', STATUS_TONE[s].dot)}
                style={{ width: `${(data.statusCounts[s] / total) * 100}%` }}
              />
            ))}
          </div>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
            {HUB_STATUSES.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm">
                <span className={cn('size-2 shrink-0 rounded-full', STATUS_TONE[s].dot)} aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-muted-foreground">{labels[s]}</span>
                <span
                  className={cn(
                    'font-medium tabular-nums',
                    data.statusCounts[s] > 0 ? 'text-foreground' : 'text-muted-foreground/60',
                  )}
                >
                  {data.statusCounts[s]}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </HomeCard>
  );
}

function OffersCard({ data, t }: { data: HomeDashboardModel; t: HomeT }) {
  return (
    <HomeCard aria-labelledby="home-offers">
      <HomeCardHeader
        id="home-offers"
        icon={NewReleasesIcon}
        title={t.offers.title}
        count={data.totals.newOffers}
        href="/offers"
        linkLabel={t.seeAll}
      />
      {data.offers.length === 0 ? (
        <HomeCardEmpty>{t.offers.empty}</HomeCardEmpty>
      ) : (
        <ul className="mt-3 flex flex-col">
          {data.offers.map((o) => (
            <li key={o.id}>
              <Link href="/offers" className={ROW_LINK}>
                <CompanyLogo name={o.companyName} domain={null} className="size-11 rounded-xl" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">{o.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {[o.companyName, o.location].filter(Boolean).join(' · ')}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <span className="max-w-[8rem] truncate text-[0.6875rem] font-medium text-muted-foreground">
                    {o.platformLabel}
                  </span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {o.ageDays === 0 ? t.offers.today : fill(t.offers.daysAgo, { n: o.ageDays })}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </HomeCard>
  );
}

function ProfileNudge({ data, t }: { data: HomeDashboardModel; t: HomeT }) {
  const { percent, missing } = data.profile;
  return (
    <section
      aria-labelledby="home-profile"
      className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:flex-row sm:items-center"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <span className="relative flex size-12 shrink-0 items-center justify-center">
          <svg viewBox="0 0 36 36" className="size-12 -rotate-90" aria-hidden="true">
            <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3" className="stroke-muted" />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={`${percent} 100`}
              className="stroke-foreground"
            />
          </svg>
          <HugeiconsIcon icon={UserCircleIcon} size={18} className="absolute text-muted-foreground" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 id="home-profile" className="text-sm font-medium text-foreground">
            {fill(t.profile.title, { n: percent })}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{t.profile.body}</p>
        </div>
      </div>
      <ul className="flex flex-wrap gap-2">
        {missing.map((item) => (
          <li key={item}>
            <Link
              href={PROFILE_HREF[item]}
              className="inline-flex h-8 items-center gap-1 rounded-full border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <HugeiconsIcon icon={Add01Icon} size={12} aria-hidden="true" />
              {t.profile.items[item]}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
