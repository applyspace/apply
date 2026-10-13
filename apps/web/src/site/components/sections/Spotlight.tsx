import Link from 'next/link';
import { body, eyebrow, h2, sectionTop, textLink, wrap } from './styles';
import { LiveDemo } from '@/site/components/demos/LiveDemo';
import { FeatureIcon } from '@/site/components/ui/icons';
import type { Section } from '@/site/content/types';
import { cn } from '@/site/lib/cn';
import type { Locale } from '@/site/lib/i18n';
import { internalHref } from '@/site/lib/links';

/** One product space: text (5 columns) beside its live demo (7 columns), alternating sides. */
export function Spotlight({ locale, section, figure }: { locale: Locale; section: Extract<Section, { type: 'spotlight' }>; figure: number }) {
  const demoLeft = section.demoSide === 'left';
  const id = section.anchor ? `h-${section.anchor}` : undefined;

  return (
    <section id={section.anchor} aria-labelledby={id} className={cn(wrap, sectionTop)}>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-6">
        <div data-reveal className={cn('lg:col-span-5', demoLeft ? 'lg:order-2 lg:col-start-8' : 'lg:pr-6')}>
          <p className={eyebrow}>{section.eyebrow}</p>
          <h2 id={id} className={cn(h2, 'mt-4')}>
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
          {section.link && (
            <p className="mt-6">
              <Link href={internalHref(locale, section.link.href)} className={textLink}>
                {section.link.label}
                <span aria-hidden>→</span>
              </Link>
            </p>
          )}
        </div>

        <LiveDemo locale={locale} demo={section.demo} figure={figure} className={cn('lg:col-span-7', demoLeft && 'lg:order-1 lg:col-start-1')} />
      </div>
    </section>
  );
}
