import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import '@/site/site.css';
import { SiteAnalyticsLoader } from '@/site/components/analytics/SiteAnalyticsLoader';
import { Footer } from '@/site/components/layout/Footer';
import { Header } from '@/site/components/layout/Header';
import { JsonLd } from '@/site/components/seo/JsonLd';
import { ui } from '@/site/content/ui';
import { getSiteSettings } from '@/site/lib/content';
import { fraunces, geist } from '@/site/lib/fonts';
import { SITE_URL, isIndexable } from '@/site/lib/env';
import { isLocale, locales } from '@/site/lib/i18n';
import { internalHref } from '@/site/lib/links';
import { organizationLd, websiteLd } from '@/site/lib/jsonld';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#F3ECFB' };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'applyspace', template: '%s | applyspace' },
  applicationName: 'applyspace',
  robots: isIndexable ? { index: true, follow: true } : { index: false, follow: false },
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const settings = await getSiteSettings(locale);
  const t = ui[locale];

  return (
    <html lang={locale} className={`${geist.variable} ${fraunces.variable}`}>
      <body className="min-h-screen overflow-x-clip text-stone-950 antialiased">
        <div aria-hidden className="site-grain" />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-stone-950 focus:px-4 focus:py-2 focus:text-white">
          {t.skipToContent}
        </a>
        <JsonLd data={[organizationLd(), websiteLd(locale)]} />
        <Header locale={locale} settings={settings} />
        <main id="main" className="relative">
          {children}
        </main>
        <Footer locale={locale} settings={settings} />
        <SiteAnalyticsLoader labels={{ ...t.consent, policyHref: internalHref(locale, '/privacy') }} />
      </body>
    </html>
  );
}
