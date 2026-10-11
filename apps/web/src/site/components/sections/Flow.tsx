import { body, eyebrow, h2, sectionTop, wrap } from './styles';
import { LiveDemo } from '@/site/components/demos/LiveDemo';
import type { Section } from '@/site/content/types';
import { cn } from '@/site/lib/cn';
import type { Locale } from '@/site/lib/i18n';

/** A flow told in numbered steps, then played live in one figure (resume to profile). */
export function Flow({ locale, section, figure }: { locale: Locale; section: Extract<Section, { type: 'flow' }>; figure: number }) {
  const key = section.anchor ?? 'flow';
  return (
    <section id={section.anchor} aria-labelledby={`h-${key}`} className={cn(wrap, sectionTop)}>
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <div data-reveal className="max-w-[720px] lg:col-span-7">
          <p className={eyebrow}>{section.eyebrow}</p>
          <h2 id={`h-${key}`} className={cn(h2, 'mt-4')}>
            {section.title}
          </h2>
          <p className={cn(body, 'mt-5')}>{section.body}</p>
        </div>
        {section.steps.length > 0 && (
          <ol className="flex list-none flex-col gap-3 sm:flex-row sm:gap-6 lg:col-span-5 lg:justify-end">
            {section.steps.map((step, i) => (
              <li key={step.label} data-reveal style={{ '--reveal-step': i } as React.CSSProperties} className="flex items-center gap-2 text-sm font-medium text-stone-800">
                <span className="font-display flex size-7 shrink-0 items-center justify-center rounded-full border border-stone-300 bg-white text-sm text-stone-950">{i + 1}</span>
                {step.label}
              </li>
            ))}
          </ol>
        )}
      </div>
      <LiveDemo locale={locale} demo={section.demo} figure={figure} className="mt-10 sm:mt-12" />
    </section>
  );
}
