import Link from 'next/link';
import type { SiteSettings } from '@/site/content/types';
import { Plume } from '@/site/components/ui/Plume';
import { ui } from '@/site/content/ui';
import { type Locale } from '@/site/lib/i18n';
import { downloadHref, internalHref } from '@/site/lib/links';

const linkCls = 'inline-flex min-h-8 items-center text-stone-950 underline decoration-transparent underline-offset-4 transition-colors hover:decoration-stone-400 focus-visible:rounded-sm';
const headCls = 'text-[13px] font-semibold text-stone-600';

/** Plume and copyright, then Product, Resources and Legal columns (art direction v3). */
export function Footer({ locale, settings }: { locale: Locale; settings: SiteSettings }) {
  const t = ui[locale];
  const columns: { title: string; links: { label: string; href: string; external?: boolean; cta?: string }[] }[] = [
    {
      title: t.footerProduct,
      links: [
        { label: t.footerFeatures, href: internalHref(locale, '/product') },
        { label: t.footerPricing, href: internalHref(locale, '/pricing') },
        { label: t.footerDesktop, href: downloadHref(locale), external: true, cta: 'footer-download' },
      ],
    },
    {
      title: t.footerResources,
      links: [
        { label: t.footerGuides, href: internalHref(locale, '/resources') },
        ...settings.social.map((s) => ({ label: s.label, href: s.url, external: true })),
        ...(settings.contactEmail ? [{ label: settings.contactEmail, href: `mailto:${settings.contactEmail}`, external: true }] : []),
      ],
    },
    {
      title: t.footerLegal,
      links: [
        { label: t.privacy, href: internalHref(locale, '/privacy') },
        { label: t.terms, href: internalHref(locale, '/terms') },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-hairline px-(--gutter) pb-36 pt-14">
      <nav aria-label={t.footerNav} className="mx-auto grid max-w-page grid-cols-2 gap-8 text-sm sm:grid-cols-4">
        <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
          <Plume className="h-auto w-9 text-stone-950" />
          <span className="text-stone-600">{t.copyright(new Date().getFullYear())}</span>
        </div>
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-1.5">
            <h2 className={headCls}>{col.title}</h2>
            <ul className="flex flex-col gap-0.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  {l.external ? (
                    <a href={l.href} className={linkCls} data-cta={l.cta}>
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className={linkCls}>
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
              {col.title === t.footerLegal && (
                <li>
                  {/* Opened by SiteAnalyticsLoader (click delegation), so the footer stays server-rendered. */}
                  <button type="button" data-cookie-settings className={linkCls}>
                    {t.cookieSettings}
                  </button>
                </li>
              )}
            </ul>
          </div>
        ))}
      </nav>
    </footer>
  );
}
