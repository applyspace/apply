import type { Locale } from '@/site/lib/i18n';

/** Interface strings that are not CMS content. One object per locale. */
export type Ui = {
  signIn: string;
  startFree: string;
  menu: string;
  closeMenu: string;
  skipToContent: string;
  mainNav: string;
  footerNav: string;
  perMonth: string;
  perMonthLong: string;
  free: string;
  unlimited: string;
  applications: string;
  searchProfiles: string;
  interviewTemplates: string;
  searchProfile: string;
  interviewTemplate: string;
  application: string;
  planTag: Record<'free' | 'plus' | 'max', string>;
  readMore: string;
  readingTime: (min: number) => string;
  published: string;
  updated: string;
  by: string;
  breadcrumbHome: string;
  allResources: string;
  comparePlans: string;
  noArticles: string;
  notFoundTitle: string;
  notFoundText: string;
  backHome: string;
  copyright: (year: number) => string;
  featuresTitle: string;
  soon: string;
  soonLegend: string;
  cookieSettings: string;
  figure: string;
  getStarted: string;
  startPlan: string;
  choosePlan: (name: string) => string;
  footerProduct: string;
  footerResources: string;
  footerFeatures: string;
  footerPricing: string;
  footerDesktop: string;
  footerGuides: string;
  download: string;
  footerLegal: string;
  privacy: string;
  terms: string;
  consent: { title: string; body: string; accept: string; decline: string; policy: string; label: string };
  learnMore: string;
  homeLabel: string;
};

const en: Ui = {
  signIn: 'Sign in',
  startFree: 'Get started for free',
  menu: 'Menu',
  closeMenu: 'Close menu',
  skipToContent: 'Skip to content',
  mainNav: 'Main',
  footerNav: 'Footer',
  perMonth: '/mo',
  perMonthLong: ' / month',
  free: 'Free',
  unlimited: 'Unlimited',
  applications: 'applications',
  searchProfiles: 'search profiles',
  interviewTemplates: 'interview templates',
  searchProfile: 'search profile',
  interviewTemplate: 'interview template',
  application: 'application',
  planTag: { free: 'Free', plus: 'Plus', max: 'Max' },
  readMore: 'Read the guide',
  readingTime: (min) => `${min} min read`,
  published: 'Published',
  updated: 'Updated',
  by: 'By',
  breadcrumbHome: 'Home',
  allResources: 'All resources',
  comparePlans: 'Compare plans',
  noArticles: 'No guides yet.',
  notFoundTitle: 'Page not found',
  notFoundText: 'The page you are looking for does not exist or has moved.',
  backHome: 'Back to home',
  copyright: (year) => `© ${year} apply · Made in France`,
  featuresTitle: 'Everything in applyspace.',
  soon: 'Soon',
  soonLegend: 'On the roadmap, not in the app yet.',
  cookieSettings: 'Cookie settings',
  figure: 'Fig.',
  getStarted: 'Get started',
  startPlan: 'Start free',
  choosePlan: (name) => `Choose ${name}`,
  footerProduct: 'Product',
  footerResources: 'Resources',
  footerFeatures: 'Features',
  footerPricing: 'Pricing',
  footerDesktop: 'Desktop app',
  footerGuides: 'Guides',
  download: 'Download for macOS',
  footerLegal: 'Legal',
  privacy: 'Privacy',
  terms: 'Terms',
  consent: {
    title: 'apply uses cookies to offer you a better experience.',
    body: 'By clicking “Accept all”, you agree to the storing of cookies on your device for functional and analytics purposes.',
    accept: 'Accept all',
    decline: 'Reject all',
    policy: 'Privacy policy',
    label: 'Cookies',
  },
  learnMore: 'Learn more',
  homeLabel: 'apply home',
};

export const ui: Record<Locale, Ui> = { en };
