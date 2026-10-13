'use client';

import { useEffect, useState, type ComponentType } from 'react';
import type { ConsentLabels } from './SiteAnalytics';

type Loaded = ComponentType<{ labels: ConsentLabels; reopen: number }>;

/**
 * Fetches the consent and analytics island once the browser is idle, so not even the dialog is in the first-load
 * JavaScript (skipped when PostHog is not configured). A click on any `[data-cookie-settings]` element (the footer's
 * "Cookie settings") fetches it if needed and opens the dialog again.
 */
export function SiteAnalyticsLoader({ labels }: { labels: ConsentLabels }) {
  const [Island, setIsland] = useState<Loaded | null>(null);
  const [reopen, setReopen] = useState(0);

  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    let alive = true;
    const load = () => void import('./SiteAnalytics').then((m) => alive && setIsland(() => m.SiteAnalytics));
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element | null)?.closest?.('[data-cookie-settings]')) return;
      e.preventDefault();
      load();
      setReopen((n) => n + 1);
    };
    document.addEventListener('click', onClick);
    const configured = Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST);
    const id = configured ? (w.requestIdleCallback ? w.requestIdleCallback(load, { timeout: 3000 }) : window.setTimeout(load, 1500)) : undefined;
    return () => {
      alive = false;
      document.removeEventListener('click', onClick);
      if (id !== undefined) (w.cancelIdleCallback ?? window.clearTimeout)(id);
    };
  }, []);

  return Island ? <Island labels={labels} reopen={reopen} /> : null;
}
