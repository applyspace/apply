import Link from 'next/link';
import { body, eyebrow, h2, sectionTop, textLink, wrap } from './styles';
import { FeatureIcon } from '@/site/components/ui/icons';
import { PlanTag } from '@/site/components/ui/PlanTag';
import { themes } from '@/site/content/fallback';
import type { Feature, Section } from '@/site/content/types';
import { ui } from '@/site/content/ui';
import { cn } from '@/site/lib/cn';
import type { Locale } from '@/site/lib/i18n';
import { internalHref } from '@/site/lib/links';

/** Neutral tag for a planned feature. */
export function SoonTag({ label }: { label: string }) {
  return <span className="inline-flex h-5 shrink-0 items-center rounded-full border border-stone-200 bg-stone-50 px-2 text-[11px] font-medium leading-none text-stone-600">{label}</span>;
}

/**
 * Every feature, shipped and planned, as short cards grouped by area. Server-rendered, no client JS.
 * Each card has an anchor id (`/product#applications-hub`).
 */
export function Features({ locale, section, features }: { locale: Locale; section: Extract<Section, { type: 'features' }>; features: Feature[] }) {
  const t = ui[locale];
  const groups = themes
    .map((th) => ({ ...th, items: features.filter((f) => f.theme === th.key).sort((a, b) => a.order - b.order) }))
    .filter((g) => g.items.length);
  const anchor = section.anchor ?? 'features';
  const hasSoon = features.some((f) => f.soon);

  return (
    <section id={anchor} aria-labelledby={`h-${anchor}`} className={cn(wrap, sectionTop)}>
      <div data-reveal className="max-w-[720px]">
        {section.eyebrow && <p className={eyebrow}>{section.eyebrow}</p>}
        <h2 id={`h-${anchor}`} className={cn(h2, section.eyebrow && 'mt-4')}>
          {section.title || t.featuresTitle}
        </h2>
        {section.intro && <p className={cn(body, 'mt-5')}>{section.intro}</p>}
        {hasSoon && (
          <p className="mt-4 flex items-center gap-2 text-sm text-stone-600">
            <SoonTag label={t.soon} />
            {t.soonLegend}
          </p>
        )}
      </div>

      <div className="mt-10 flex flex-col gap-10 sm:mt-14 sm:gap-14">
        {groups.map((g) => (
          <div key={g.key} className="grid gap-5 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-3">
              <h3 className="text-lg font-semibold tracking-tight text-stone-950">{g.title}</h3>
              <p className="mt-1 text-[15px] leading-[1.6] text-stone-600">{g.intro}</p>
            </div>
            <ul className="grid list-none gap-4 sm:grid-cols-2 lg:col-span-9 xl:grid-cols-3">
              {g.items.map((f) => (
                <li key={f.key} id={f.key} className="flex scroll-mt-24 flex-col rounded-2xl border border-stone-200 bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-stone-100 text-stone-800">
                      <FeatureIcon name={f.icon} size={18} />
                    </span>
                    <span className="flex gap-1.5">
                      {f.plan !== 'free' && <PlanTag plan={f.plan} label={t.planTag[f.plan]} size="sm" className="h-5 px-2 py-0 text-[11px]" />}
                      {f.soon && <SoonTag label={t.soon} />}
                    </span>
                  </div>
                  <h4 className="mt-4 text-base font-semibold tracking-tight text-stone-950">{f.title}</h4>
                  <p className="mt-1.5 text-pretty text-sm leading-[1.6] text-stone-600">{f.summary}</p>
                  {f.bullets.length > 0 && (
                    <ul className="mt-3 space-y-1 text-sm text-stone-700">
                      {f.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <FeatureIcon name="tick" size={14} className="mt-[3px] shrink-0 text-stone-400" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {section.link && (
        <p className="mt-8">
          <Link href={internalHref(locale, section.link.href)} className={textLink}>
            {section.link.label}
            <span aria-hidden>→</span>
          </Link>
        </p>
      )}
    </section>
  );
}
