import { eyebrow as eyebrowCls } from './styles';
import { CtaButton } from '@/site/components/ui/CtaButton';
import { LiveDemo } from '@/site/components/demos/LiveDemo';
import type { Cta, Demo } from '@/site/content/types';
import type { Locale } from '@/site/lib/i18n';

/** `wide`: aligned with the 1248px sections (pages built from the homepage sections, like /product). */
export function Hero({ locale, heading, intro, ctas, align = 'center', placement = 'hero', wide = false }: { locale: Locale; heading: string; intro: string; ctas?: Cta[]; align?: 'center' | 'left'; placement?: string; wide?: boolean }) {
  return (
    <section className={align === 'center' ? 'mx-auto max-w-3xl px-4 pt-16 text-center sm:px-6 sm:pt-24' : wide ? 'mx-auto w-full max-w-[1248px] px-4 pt-14 sm:px-6 sm:pt-20' : 'mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20'}>
      <h1 className="font-display text-balance text-4xl text-stone-950 sm:text-6xl">{heading}</h1>
      <p className={align === 'center' ? 'mx-auto mt-5 max-w-xl text-pretty text-lg text-stone-600' : 'mt-5 max-w-2xl text-pretty text-lg text-stone-600'}>{intro}</p>
      {ctas?.length ? (
        <div className={align === 'center' ? 'mt-8 flex flex-wrap items-center justify-center gap-3' : 'mt-8 flex flex-wrap items-center gap-3'}>
          {ctas.map((cta, i) => (
            <CtaButton key={cta.label} cta={cta} locale={locale} placement={`${placement}-${i === 0 ? 'primary' : 'secondary'}`} variant={i === 0 ? 'primary' : 'secondary'} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

/**
 * Homepage hero: eyebrow, H1, scope subhead, two buttons and microcopy, then the live Board demo in a
 * product window that overlaps into a stone band (hydrated right after idle, ahead of the other demos). Left-aligned with stacked full-width buttons on phones, centred above.
 */
export function HomeHero({
  locale,
  eyebrow,
  heading,
  intro,
  ctas,
  note,
  demo,
}: {
  locale: Locale;
  eyebrow?: string;
  heading: string;
  intro: string;
  ctas?: Cta[];
  note?: string;
  demo?: Demo;
}) {
  return (
    <section aria-labelledby="home-title" className="pt-12 sm:pt-24">
      <div className="mx-auto max-w-[768px] px-4 sm:px-6 sm:text-center">
        {eyebrow && <p className={eyebrowCls}>{eyebrow}</p>}
        <h1 id="home-title" className="font-display mt-4 text-balance text-[40px] leading-[1.05] tracking-[-0.02em] text-stone-950 sm:text-[64px]">
          {heading}
        </h1>
        <p className="mt-5 text-pretty text-lg leading-[1.5] text-stone-600 sm:mx-auto sm:mt-6 sm:max-w-[640px] sm:text-xl">{intro}</p>
        {ctas?.length ? (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {ctas.map((cta, i) => (
              <CtaButton
                key={cta.label}
                cta={cta}
                locale={locale}
                placement={`home-hero-${i === 0 ? 'primary' : 'secondary'}`}
                variant={i === 0 ? 'primary' : 'secondary'}
                className="w-full sm:w-auto"
              />
            ))}
          </div>
        ) : null}
        {note && <p className="mt-4 text-sm text-stone-600">{note}</p>}
      </div>

      {demo && (
        <div className="relative mt-12 sm:mt-16">
          <div aria-hidden className="absolute inset-x-0 bottom-0 top-1/3 border-t border-stone-200 bg-stone-100" />
          <div className="relative mx-auto max-w-[1168px] px-4 pb-14 sm:px-6 sm:pb-20">
            <LiveDemo locale={locale} demo={demo} figure={1} eager />
          </div>
        </div>
      )}
    </section>
  );
}
