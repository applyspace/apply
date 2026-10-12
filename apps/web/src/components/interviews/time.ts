'use client';

import { useSyncExternalStore } from 'react';
import type { Locale } from '@/lib/i18n';
import { dayKeyOf } from '@/lib/interviewsHub';

const intlLocale = (locale: Locale) => (locale === 'fr' ? 'fr-FR' : 'en-GB');

const noop = () => () => {};
const browserZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

/**
 * The viewer's time zone. The server renders in UTC; the client switches to
 * the browser zone right after hydration, without a mismatch.
 */
export function useTimeZone(): string {
  return useSyncExternalStore(noop, browserZone, () => 'UTC');
}

/** "14:00" in the zone. */
export function formatTime(iso: string, locale: Locale, timeZone: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { hour: '2-digit', minute: '2-digit', timeZone }).format(
    Date.parse(iso),
  );
}

/** A `YYYY-MM-DD` day key with the given parts ("Wed 14 Oct"). Keys are calendar days, so UTC is right. */
export function formatDayKey(key: string, locale: Locale, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { ...options, timeZone: 'UTC' }).format(Date.parse(`${key}T00:00:00Z`));
}

/**
 * "Wed 14 Oct, 14:00" in the zone. Built from separate parts: Node and browsers
 * punctuate a combined weekday and date differently, which breaks hydration.
 */
export function formatDateTime(iso: string, locale: Locale, timeZone: string): string {
  const key = dayKeyOf(iso, timeZone);
  const weekday = formatDayKey(key, locale, { weekday: 'short' });
  const date = formatDayKey(key, locale, { day: 'numeric', month: 'short' });
  return `${weekday} ${date}, ${formatTime(iso, locale, timeZone)}`;
}

/** "Wednesday 14 October" for a day key, from separate parts (same reason as above). */
export function formatLongDay(key: string, locale: Locale): string {
  const weekday = formatDayKey(key, locale, { weekday: 'long' });
  const date = formatDayKey(key, locale, { day: 'numeric', month: 'long' });
  return `${weekday} ${date}`;
}

/** Short weekday names, Monday first. */
export function weekdayNames(locale: Locale, width: 'short' | 'narrow'): string[] {
  // 2026-10-05 is a Monday.
  return Array.from({ length: 7 }, (_, i) =>
    formatDayKey(`2026-10-${String(5 + i).padStart(2, '0')}`, locale, { weekday: width }),
  );
}
