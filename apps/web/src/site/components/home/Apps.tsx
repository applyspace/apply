import { SoonBadge } from './SoonBadge';
import { CtaButton } from '@/site/components/ui/CtaButton';
import { DeviceVisual } from '@/site/components/visuals/devices';
import type { HomeContent } from '@/site/content/types';
import type { Locale } from '@/site/lib/i18n';

const TILE = { desktop: 'var(--tile-lilac)', mobile: 'var(--tile-peach)', extension: 'var(--tile-blue)' } as const;

/** Desktop app, mobile app and Chrome extension, each with a device sketch on its pastel tile. */
export function Apps({ locale, apps, soon }: { locale: Locale; apps: HomeContent['apps']; soon: string }) {
  return (
    <section id="download" aria-labelledby="apps-title" className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1240px]">
        <h2 id="apps-title" className="font-display text-center text-[clamp(40px,5vw,64px)] leading-none">
          {apps.title}
        </h2>
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {apps.items.map((app) => (
            <li key={app.key} className="flex flex-col overflow-hidden rounded-[28px] border border-stone-950/[0.06] bg-white">
              <div className="px-6 pt-6" style={{ background: TILE[app.key] }}>
                <DeviceVisual name={app.key} />
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-xl">{app.title}</h3>
                  {app.soon && <SoonBadge label={soon} />}
                </div>
                <p className="mt-2 flex-1 text-pretty text-[15px] leading-[1.55] text-stone-600">{app.text}</p>
                <CtaButton cta={app.cta} locale={locale} placement={`apps-${app.key}`} variant={app.soon ? 'secondary' : 'primary'} className="mt-6 self-start" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
