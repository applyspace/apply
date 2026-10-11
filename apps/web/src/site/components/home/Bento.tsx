import Link from 'next/link';
import { SoonBadge } from './SoonBadge';
import { BentoVisual } from '@/site/components/visuals/bento';
import type { HomeContent } from '@/site/content/types';
import type { Locale } from '@/site/lib/i18n';
import { internalHref } from '@/site/lib/links';
import { cn } from '@/site/lib/cn';

const SPAN = { 3: 'lg:col-span-3', 4: 'lg:col-span-4', 5: 'lg:col-span-5', 7: 'lg:col-span-7' } as const;

/**
 * "Track your entire job search.": every feature as an Origin-like bento of pastel cards (12 columns on large
 * screens, 2 on tablets, 1 on phones). Replaces the v3 carousel and the Find/Apply/Track/Prepare switcher: one
 * section instead of two, every feature visible without interaction.
 */
export function Bento({ locale, bento, soon }: { locale: Locale; bento: HomeContent['bento']; soon: string }) {
  return (
    <section id="features" aria-labelledby="bento-title" className="px-(--gutter) py-(--section-md)">
      <div className="mx-auto max-w-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="bento-title" className="font-display max-w-[640px] text-balance text-display-lg">
            {bento.title}
          </h2>
          <div className="max-w-[380px] lg:pb-2">
            <p className="text-pretty text-lg leading-[1.45] text-stone-600">{bento.intro}</p>
            <Link href={internalHref(locale, bento.link.href)} className="mt-3 inline-flex min-h-8 items-center text-body text-stone-950 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-950">
              {bento.link.label}
            </Link>
          </div>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {bento.cards.map((card, i) => (
            <li key={card.key} className={cn('flex', (card.span === 7 || (i === bento.cards.length - 1 && bento.cards.length % 2 === 0)) && 'sm:col-span-2', SPAN[card.span])}>
              <article className="flex w-full flex-col overflow-hidden rounded-card" style={{ background: `var(--tile-${card.tile})` }}>
                <div className="px-6 pt-6 sm:px-7 sm:pt-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-card-title leading-tight text-stone-950">{card.title}</h3>
                    {card.soon && <SoonBadge label={soon} className="bg-white/70 bg-none" />}
                  </div>
                  <p className="mt-1.5 max-w-[440px] text-pretty text-body leading-[1.5] text-stone-950/65">{card.text}</p>
                </div>
                <div className="mt-auto pt-6">
                  <BentoVisual name={card.key} />
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
