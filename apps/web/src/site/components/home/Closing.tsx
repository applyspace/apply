import { CtaButton } from '@/site/components/ui/CtaButton';
import { Plume } from '@/site/components/ui/Plume';
import type { HomeContent } from '@/site/content/types';
import type { Locale } from '@/site/lib/i18n';

/** Final call to action. */
export function Closing({ locale, closing }: { locale: Locale; closing: HomeContent['closing'] }) {
  return (
    <section aria-labelledby="closing-title" className="px-(--gutter) pb-(--section-xl) pt-(--section-sm)">
      <div className="mx-auto flex max-w-page flex-col items-center rounded-panel bg-(image:--closing-gradient) px-6 py-14 text-center sm:py-20">
        <span className="flex size-16 items-center justify-center rounded-tile bg-white/80">
          <Plume className="h-auto w-9 text-stone-950" />
        </span>
        <h2 id="closing-title" className="font-display mt-8 max-w-[760px] text-balance text-display-closing">
          {closing.title}
        </h2>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {closing.ctas.map((cta, i) => (
            <CtaButton key={cta.label} cta={cta} locale={locale} placement={`closing-${i === 0 ? 'primary' : 'secondary'}`} variant={i === 0 ? 'primary' : 'secondary'} />
          ))}
        </div>
      </div>
    </section>
  );
}
