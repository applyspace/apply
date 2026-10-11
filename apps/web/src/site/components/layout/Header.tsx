import Link from 'next/link';
import { DesktopNav } from './DesktopNav';
import { MobileMenu } from './MobileMenu';
import { NavPanel } from './NavPanel';
import { Plume } from '@/site/components/ui/Plume';
import { buttonStyles } from '@/site/components/ui/buttonStyles';
import { navMenus } from '@/site/content/nav';
import type { SiteSettings } from '@/site/content/types';
import { ui } from '@/site/content/ui';
import { localePath, type Locale } from '@/site/lib/i18n';
import { appHref, internalHref } from '@/site/lib/links';

/**
 * Origin-like header: a white rounded bar inset from the viewport edges, sticky. Plume far left, navigation in the
 * centre (Product and Resources open menus), Sign in (ghost) and Get started for free right. Phones get the plume
 * and a menu with the same groups as an accordion.
 */
export function Header({ locale, settings }: { locale: Locale; settings: SiteSettings }) {
  const t = ui[locale];
  const menus = navMenus[locale];
  const signIn = appHref('/login', 'header-sign-in');
  const start = appHref('/login', 'header-start');

  const items = settings.nav.map((n) => {
    const menu = menus[n.href];
    return {
      key: n.href.replace(/[^a-z]/g, '') || 'home',
      label: n.label,
      href: internalHref(locale, n.href),
      wide: menu ? menu.groups.length > 1 : false,
      menu,
    };
  });

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
      <div className="relative mx-auto grid h-[60px] max-w-page grid-cols-[1fr_auto] items-center gap-4 rounded-tile border border-stone-950/[0.06] bg-white pl-4 pr-2.5 md:grid-cols-[1fr_auto_1fr] md:pl-5">
        <Link href={localePath(locale, '/')} aria-label={t.homeLabel} className="flex justify-self-start rounded-sm">
          <Plume className="h-auto w-9 text-stone-950" />
        </Link>

        <DesktopNav
          label={t.mainNav}
          items={items.map(({ key, label, href, wide, menu }) => ({
            key,
            label,
            href,
            wide,
            panel: menu ? <NavPanel menu={menu} locale={locale} labels={{ soon: t.soon }} /> : undefined,
          }))}
        />

        <div className="hidden items-center justify-end gap-1.5 md:flex">
          <a href={signIn} className={buttonStyles('ghost', 'md', 'h-10 px-4')}>
            {t.signIn}
          </a>
          <a href={start} className={buttonStyles('primary', 'md', 'h-10 px-4')}>
            {t.startFree}
          </a>
        </div>

        <MobileMenu
          nav={items.map(({ key, label, href, menu }) => ({
            key,
            label,
            href,
            groups: menu?.groups.map((g) => ({
              title: g.title,
              items: g.items.map((e) => ({ title: e.title, href: e.href ? internalHref(locale, e.href) : undefined, soon: e.soon })),
            })),
            footer: menu?.footer ? { label: menu.footer.label, href: internalHref(locale, menu.footer.href) } : undefined,
          }))}
          signInHref={signIn}
          startHref={start}
          labels={{ menu: t.menu, close: t.closeMenu, signIn: t.signIn, start: t.startFree, nav: t.mainNav, soon: t.soon }}
        />
      </div>
    </header>
  );
}
