'use client';

import { useEffect, useRef, useState } from 'react';
import { buttonStyles } from '@/site/components/ui/buttonStyles';

/**
 * Website cookie consent and analytics, out of the first load (SiteAnalyticsLoader fetches this island when the
 * browser is idle, or when "Cookie settings" is pressed). It shows a non-modal banner at the bottom centre while no
 * choice is stored. posthog-js is fetched only after the visitor accepts (or already accepted analytics in the app), and
 * only page views and CTA clicks are sent (no autocapture, no session replay, no surveys). The website's choice is
 * stored apart from the app's, because the app consent also covers identification by email: accepting here does
 * not opt in the app. A "no" given in the app is respected here. Dismissing the banner (Esc) is not a choice: it
 * opens again on the next page load.
 */

const TOKEN = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ?? '';
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? '';
const SITE_KEY = 'applyspace:site-analytics';
const APP_KEY = `__ph_opt_in_out_${TOKEN}`;
const YES = ['1', 'true', 'yes', 'granted'];
const NO = ['0', 'false', 'no', 'denied'];

type Status = 'off' | 'pending' | 'granted' | 'denied';
export type ConsentLabels = { title: string; body: string; accept: string; decline: string; policy: string; policyHref: string };

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key)?.replace(/"/g, '') ?? null;
  } catch {
    return null;
  }
}

function storedStatus(): Status {
  if (!TOKEN || !HOST || window.location.hostname.toLowerCase().startsWith('demo.')) return 'off';
  const app = read(APP_KEY);
  if (app && NO.includes(app)) return 'denied';
  const site = read(SITE_KEY);
  if (site && YES.includes(site)) return 'granted';
  if (site && NO.includes(site)) return 'denied';
  if (app && YES.includes(app)) return 'granted';
  return 'pending';
}

type PostHog = typeof import('posthog-js').default;
let client: Promise<PostHog> | null = null;
/** Events leave the page only while this is true (a later "Reject all" stops them without reloading). */
let allowed = false;

/** Loads and initialises posthog-js once. */
function loadPostHog(): Promise<PostHog> {
  client ??= import('posthog-js').then(({ default: posthog }) => {
    if (!posthog.__loaded) {
      posthog.init(TOKEN, {
        api_host: HOST,
        defaults: '2026-05-30',
        capture_pageview: 'history_change',
        capture_pageleave: false,
        autocapture: false,
        capture_dead_clicks: false,
        capture_exceptions: false,
        capture_performance: false,
        enable_heatmaps: false,
        disable_session_recording: true,
        disable_surveys: true,
        disable_external_dependency_loading: true,
        before_send: (event) => (allowed ? event : null),
      });
    }
    return posthog;
  });
  return client;
}

/** CTA clicks: buttons with `data-cta`, and every link into the app (they carry `utm_source=website`). */
function ctaOf(target: EventTarget | null): { placement: string; href: string } | null {
  const a = (target as Element | null)?.closest?.('a[data-cta], a[href*="utm_source=website"]');
  if (!(a instanceof HTMLAnchorElement)) return null;
  const url = new URL(a.href, window.location.href);
  const placement = a.dataset.cta || url.searchParams.get('utm_content') || 'unknown';
  return { placement, href: url.origin === window.location.origin ? url.pathname + url.hash : url.origin };
}

/** `reopen` grows each time "Cookie settings" is pressed. */
export function SiteAnalytics({ labels, reopen }: { labels: ConsentLabels; reopen: number }) {
  const [status, setStatus] = useState<Status>('off');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const s = storedStatus();
    setStatus(s); // eslint-disable-line react-hooks/set-state-in-effect -- reads localStorage once, after hydration
    if (s === 'pending') setOpen(true);
  }, []);

  useEffect(() => {
    if (reopen > 0) setOpen(true); // eslint-disable-line react-hooks/set-state-in-effect -- an outside request to open
  }, [reopen]);

  useEffect(() => {
    allowed = status === 'granted';
    if (status !== 'granted') return;
    let alive = true;
    loadPostHog().catch(() => undefined);
    const onClick = (e: MouseEvent) => {
      const cta = ctaOf(e.target);
      if (!cta) return;
      void loadPostHog().then((ph) => alive && ph.capture('website_cta_clicked', { placement: cta.placement, target: cta.href }));
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => {
      alive = false;
      document.removeEventListener('click', onClick, { capture: true });
    };
  }, [status]);

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  const choose = (accepted: boolean) => {
    try {
      window.localStorage.setItem(SITE_KEY, accepted ? 'granted' : 'denied');
    } catch {
      // Storage blocked: the choice lasts for this page only.
      setStatus(accepted && TOKEN && HOST ? 'granted' : 'denied');
      setOpen(false);
      return;
    }
    setStatus(storedStatus());
    setOpen(false);
  };

  if (!open) return null;

  return (
    <section
      ref={ref}
      tabIndex={-1}
      role="region"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-body"
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
      className="site-banner fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-[760px] flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 text-stone-950 shadow-[0_12px_32px_-12px_rgb(60_30_90/0.22)] outline-none sm:flex-row sm:items-center sm:gap-6 sm:p-5 sm:pl-6"
    >
      <div className="min-w-0 flex-1 text-sm leading-[1.55]">
        <p id="cookie-title" className="text-stone-950">
          {labels.title}
        </p>
        <p id="cookie-body" className="mt-1 text-stone-600">
          {labels.body}{' '}
          <a href={labels.policyHref} className="text-stone-950 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-950">
            {labels.policy}
          </a>
        </p>
      </div>
      <div className="grid shrink-0 grid-cols-2 gap-2">
        <button type="button" onClick={() => choose(false)} className={buttonStyles('secondary', 'md')}>
          {labels.decline}
        </button>
        <button type="button" onClick={() => choose(true)} className={buttonStyles('secondary', 'md')}>
          {labels.accept}
        </button>
      </div>
    </section>
  );
}
