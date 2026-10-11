import { CtaButton } from '@/site/components/ui/CtaButton';
import { Plume } from '@/site/components/ui/Plume';
import type { HomeContent } from '@/site/content/types';
import type { Locale } from '@/site/lib/i18n';

/** Final call to action. */
export function Closing({ locale, closing }: { locale: Locale; closing: HomeContent['closing'] }) {
  return (
    <section aria-labelledby="closing-title" className="px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-12">
      <div className="mx-auto flex max-w-[1240px] flex-col items-center rounded-[40px] px-6 py-14 text-center sm:py-20" style={{ background: 'linear-gradient(135deg, #f1c2be 0%, #e7c9f5 40%, #c9d3fb 75%, #c8e6cc 100%)' }}>
        <span className="flex size-16 items-center justify-center rounded-[20px] bg-white/80">
          <Plume className="h-auto w-9 text-stone-950" />
        </span>
        <h2 id="closing-title" className="font-display mt-8 max-w-[760px] text-balance text-[clamp(44px,6vw,80px)] leading-[0.98]">
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
