import { body, eyebrow, h2, sectionTop, wrap } from './styles';
import { Icon } from '@/site/components/demos/parts';
import { buttonStyles } from '@/site/components/ui/buttonStyles';
import { FeatureIcon } from '@/site/components/ui/icons';
import type { Section } from '@/site/content/types';
import { ui } from '@/site/content/ui';
import { cn } from '@/site/lib/cn';
import { DESKTOP_DOWNLOAD_URL } from '@/site/lib/env';
import type { Locale } from '@/site/lib/i18n';
import { appHref } from '@/site/lib/links';

const PROFILES = [
  { name: 'Product Designer, Paris', meta: 'Permanent · Hybrid', found: '6 new offers' },
  { name: 'Senior UX Designer', meta: 'Remote · Freelance', found: '2 new offers' },
];

/**
 * The desktop app section, anchor `#download`: every "Download for macOS" button points here until
 * NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL is set. With the URL, the section offers the download; without it, the way in
 * is the web app.
 */
export function Download({ locale, section }: { locale: Locale; section: Extract<Section, { type: 'download' }> }) {
  const t = ui[locale];
  return (
    <section id="download" aria-labelledby="h-download" className={cn(wrap, sectionTop, 'scroll-mt-24')}>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-6">
        <div data-reveal className="lg:col-span-5 lg:pr-6">
          <p className={eyebrow}>{section.eyebrow}</p>
          <h2 id="h-download" className={cn(h2, 'mt-4')}>
            {section.title}
          </h2>
          <p className={cn(body, 'mt-5 max-w-[64ch]')}>{section.body}</p>
          {section.bullets.length > 0 && (
            <ul className="mt-6 space-y-3">
              {section.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-body text-stone-800">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-700">
                    <FeatureIcon name="tick" size={12} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {DESKTOP_DOWNLOAD_URL ? (
              <a href={DESKTOP_DOWNLOAD_URL} data-cta="download-section" className={buttonStyles('primary', 'lg', 'w-full sm:w-auto')}>
                <FeatureIcon name="apple" size={18} />
                {t.download}
              </a>
            ) : (
              <a href={appHref('/login', 'download-section')} className={buttonStyles('primary', 'lg', 'w-full sm:w-auto')}>
                {t.startFree}
              </a>
            )}
          </div>
        </div>

        <div aria-hidden className="lg:col-span-6 lg:col-start-7">
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <div className="flex h-10 items-center gap-1.5 border-b border-stone-200 bg-stone-50 px-4">
              <span className="size-2.5 rounded-full bg-stone-300" />
              <span className="size-2.5 rounded-full bg-stone-300" />
              <span className="size-2.5 rounded-full bg-stone-300" />
              <span className="ml-3 text-xs font-medium text-stone-500">applyspace for macOS</span>
            </div>
            <div className="flex flex-col gap-3 p-4 sm:p-5">
              <p className="text-xs font-medium uppercase tracking-[0.06em] text-stone-500">Search profiles</p>
              {PROFILES.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 rounded-xl border border-stone-200 p-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-stone-950">
                    <Icon name="search" size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-stone-950">{p.name}</span>
                    <span className="block truncate text-xs text-stone-500">{p.meta}</span>
                  </span>
                  <span className={cn('inline-flex h-7 shrink-0 items-center gap-1 rounded-full px-2.5 text-xs font-medium', i === 0 ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-600')}>
                    {i === 0 && <Icon name="tick" size={12} />}
                    {p.found}
                  </span>
                </div>
              ))}
              <p className="flex items-center gap-2 rounded-xl bg-stone-50 px-3 py-2.5 text-xs text-stone-600">
                <Icon name="board" size={14} />
                Saved to your account. Open them on the web or here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
