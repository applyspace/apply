import { HeroBoardVisual } from '@/site/components/visuals/HeroBoardVisual';
import { CtaButton } from '@/site/components/ui/CtaButton';
import { Plume } from '@/site/components/ui/Plume';
import type { HomeContent } from '@/site/content/types';
import type { Locale } from '@/site/lib/i18n';

/** Floating plume tiles around the headline (decorative, hidden on small screens). */
const TILES = [
  { tile: 'peach', top: '9%', left: '12%', size: 112, rot: '-10deg' },
  { tile: 'green', top: '50%', left: '4%', size: 118, rot: '14deg' },
  { tile: 'lilac', top: '30%', left: '72%', size: 112, rot: '12deg' },
  { tile: 'pink', top: '6%', left: '86%', size: 112, rot: '-11deg' },
  { tile: 'blue', top: '72%', left: '86%', size: 118, rot: '16deg' },
] as const;

export function HomeHero({ locale, hero }: { locale: Locale; hero: HomeContent['hero'] }) {
  return (
    <section aria-labelledby="hero-title" className="relative px-4 pt-16 text-center sm:px-6 sm:pt-24">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 mx-auto hidden h-[560px] max-w-[1440px] lg:block">
        {TILES.map((t) => (
          <span
            key={t.tile}
            className="site-tile shadow-[0_10px_24px_-14px_rgb(60_30_90/0.35)]"
            style={{ top: t.top, left: t.left, ['--size' as string]: `${t.size}px`, ['--rot' as string]: t.rot, background: `var(--tile-${t.tile})` }}
          >
            <Plume className="h-auto w-[52%] text-stone-950" />
          </span>
        ))}
      </div>

      <div className="relative">
        <h1 id="hero-title" className="font-display mx-auto max-w-[900px] text-balance text-[clamp(52px,7vw,96px)] leading-[0.98]">
          {hero.heading}
        </h1>
        <p className="mx-auto mt-7 max-w-[620px] text-pretty text-lg leading-[1.45] text-stone-700 sm:text-xl">{hero.intro}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {hero.ctas.map((cta, i) => (
            <CtaButton key={cta.label} cta={cta} locale={locale} placement={`hero-${i === 0 ? 'primary' : 'secondary'}`} variant={i === 0 ? 'primary' : 'secondary'} />
          ))}
        </div>
      </div>

      <div className="relative mx-auto mt-16 max-w-[1180px] sm:mt-20">
        <HeroBoardVisual idPrefix="hero" />
      </div>
    </section>
  );
}
