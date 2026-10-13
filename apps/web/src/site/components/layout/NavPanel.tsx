import Link from 'next/link';
import { SoonBadge } from '@/site/components/home/SoonBadge';
import { CtaButton } from '@/site/components/ui/CtaButton';
import { FeatureIcon } from '@/site/components/ui/icons';
import { Plume } from '@/site/components/ui/Plume';
import type { NavMenu, NavMenuEntry } from '@/site/content/nav';
import type { Locale } from '@/site/lib/i18n';
import { internalHref } from '@/site/lib/links';
import { cn } from '@/site/lib/cn';

/** Icon tile colour per menu column (Find, Apply, Track, Prepare), then for single-column menus. */
const TILES = ['var(--tile-blue)', 'var(--tile-lilac)', 'var(--tile-butter)', 'var(--tile-pink)'];

function Entry({ entry, tile, locale, soon }: { entry: NavMenuEntry; tile: string; locale: Locale; soon: string }) {
  const body = (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] text-stone-950" style={{ background: tile }}>
        <FeatureIcon name={entry.icon} size={18} />
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] leading-5 text-stone-950">
          {entry.title}
          {entry.soon && <SoonBadge label={soon} className="h-[18px] px-1.5 text-[10.5px]" />}
        </span>
        <span className="mt-0.5 block text-[13px] leading-[1.4] text-stone-500">{entry.text}</span>
      </span>
    </>
  );
  const cls = 'flex items-start gap-3 rounded-[14px] p-2.5';
  if (!entry.href) return <div className={cls}>{body}</div>;
  return (
    <Link href={internalHref(locale, entry.href)} className={cn(cls, 'transition-colors hover:bg-stone-100 focus-visible:bg-stone-100 focus-visible:outline-offset-0')}>
      {body}
    </Link>
  );
}

/**
 * Content of a header menu, rendered on the server and passed to DesktopNav: groups as columns (Product, Dovetail-like
 * mega menu) or one list (Resources), an optional featured card and a footer link.
 */
export function NavPanel({ menu, locale, labels }: { menu: NavMenu; locale: Locale; labels: { soon: string } }) {
  const wide = menu.groups.length > 1;
  return (
    <div className="rounded-[24px] border border-stone-950/[0.07] bg-white p-2 shadow-[0_24px_48px_-28px_rgb(31_13_44/0.35)]">
      <div className={cn('flex gap-2', !wide && 'flex-col')}>
        <div className={cn('grid flex-1 gap-x-2 gap-y-4 p-2', wide ? 'grid-cols-4' : 'grid-cols-1')}>
          {menu.groups.map((group, gi) => (
            <div key={group.title ?? gi}>
              {group.title && <h3 className="px-2.5 pb-1.5 pt-1 text-[12px] text-stone-500">{group.title}</h3>}
              <ul className="flex flex-col gap-0.5">
                {group.items.map((entry, i) => (
                  <li key={entry.title}>
                    <Entry entry={entry} tile={TILES[wide ? gi : i] ?? TILES[0]} locale={locale} soon={labels.soon} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {menu.featured && (
          <aside className="flex w-[220px] shrink-0 flex-col rounded-[18px] p-5" style={{ background: 'var(--tile-lilac)' }}>
            <span className="flex size-11 items-center justify-center rounded-[13px] bg-white/80">
              <Plume className="h-auto w-6 text-stone-950" />
            </span>
            <p className="font-display mt-5 text-[26px] leading-[1.05]">{menu.featured.title}</p>
            <p className="mt-2 flex-1 text-[13px] leading-[1.45] text-stone-700">{menu.featured.text}</p>
            <CtaButton
              cta={{ label: menu.featured.cta, href: menu.featured.href, kind: menu.featured.kind }}
              locale={locale}
              placement="nav-featured"
              className="mt-5 h-10 w-full px-4 text-[14px]"
            />
          </aside>
        )}
      </div>
      {menu.footer && (
        <div className="mt-1 border-t border-stone-100 px-4 pb-1.5 pt-2.5">
          <Link href={internalHref(locale, menu.footer.href)} className="inline-flex min-h-8 items-center gap-1.5 rounded-full text-[14px] text-stone-950 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-950">
            {menu.footer.label}
          </Link>
        </div>
      )}
    </div>
  );
}
