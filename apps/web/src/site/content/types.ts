import type { PortableTextBlock } from '@portabletext/react';

/** `download` opens the desktop download (NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL), falling back to the `/#download` section. */
export type Cta = { label: string; href: string; kind?: 'app' | 'internal' | 'download' };

export type Seo = {
  title: string;
  description: string;
  noindex?: boolean;
  /** Sanity image URL, when the editor set one. Otherwise the generated card from /og is used. */
  ogImageUrl?: string;
};

export type ImageRef = { url: string; alt: string; width?: number; height?: number };

export type PlanKey = 'free' | 'plus' | 'max';

export type SiteSettings = {
  siteName: string;
  tagline: string;
  description: string;
  nav: { label: string; href: string }[];
  footerNav: { label: string; href: string }[];
  social: { label: string; url: string }[];
  contactEmail?: string;
};

export type Feature = {
  /** Anchor id on /product. */
  key: string;
  theme: ThemeKey;
  title: string;
  summary: string;
  bullets: string[];
  icon?: string;
  /** Lowest plan; only a paid plan is shown, as a tag. */
  plan: PlanKey;
  /** Planned, not in the product yet: shown with a "Soon" tag. */
  soon?: boolean;
  order: number;
};

/** Areas of the feature grid, in display order (see `themes` in content/fallback/features.ts). */
export type ThemeKey = 'track' | 'prepare' | 'everywhere' | 'control';

export type PricingPlan = {
  key: PlanKey;
  name: string;
  tagline: string;
  /** Monthly price. Shown only when priceVisible. */
  priceMonthly: number;
  currency: 'EUR';
  priceVisible: boolean;
  /** Caps. null means unlimited. */
  caps: { applications: number | null; searchProfiles: number | null; interviewTemplates: number | null };
  intro?: string;
  features: string[];
  ctaLabel: string;
  order: number;
};

/**
 * Live product demos of the homepage (React islands fed with demo data, see components/demos). Content picks a
 * demo by key; the demo itself is code, so it always matches the product.
 */
export const DEMO_KEYS = ['board', 'applications', 'search', 'interviews', 'profile'] as const;
export type DemoKey = (typeof DEMO_KEYS)[number];

export type Demo = {
  key: DemoKey;
  /** Accessible name of the demo (what it shows and what you can do). */
  label: string;
  /** Figure caption without the "Fig. N" prefix, which is numbered in page order. */
  caption?: string;
};

/** Layouts of the Applications demo. */
export const VIEW_KEYS = ['board', 'table', 'timeline', 'map'] as const;
export type ViewKey = (typeof VIEW_KEYS)[number];

export type TextLink = { label: string; href: string };

export type FragmentKind = 'tab' | 'sheet' | 'note' | 'email' | 'calendar';

export type Section =
  | { type: 'cards'; title: string; intro?: string; items: { title: string; text: string; href?: string; icon?: string }[] }
  | { type: 'steps'; eyebrow?: string; title: string; intro?: string; items: { title: string; text: string }[] }
  | { type: 'text'; title: string; body: string; tone?: 'plain' | 'tinted' }
  | { type: 'faq'; title: string; items: { question: string; answer: string }[]; link?: TextLink }
  | { type: 'plans'; title?: string; intro?: string; variant: 'compact' | 'full'; note?: string; footnote?: string }
  /** Every Feature document as a grid of short cards, grouped by area (shipped and planned). */
  | { type: 'features'; anchor?: string; eyebrow?: string; title?: string; intro?: string; link?: TextLink }
  /** `preview`: a faded, non-interactive crop of a demo under the buttons. */
  | { type: 'cta'; title: string; text?: string; cta: Cta; secondary?: Cta; preview?: DemoKey }
  /** The problem told as a scenario: the scattered tools of one application. */
  | { type: 'scatter'; title: string; body: string; fragments: { kind: FragmentKind; label: string; text: string }[] }
  /** One product space: text on one side, a live demo on the other. */
  | {
      type: 'spotlight';
      anchor?: string;
      eyebrow: string;
      title: string;
      body: string;
      bullets: string[];
      link?: TextLink;
      demo: Demo;
      /** Side of the demo on large screens. */
      demoSide: 'left' | 'right';
    }
  /** Same data, several layouts: the live Applications demo with its tabs. */
  | { type: 'views'; anchor?: string; eyebrow: string; title: string; intro: string; label: string; views: { key: ViewKey; label: string; caption?: string }[] }
  /** A flow shown live in one figure (resume to profile). */
  | { type: 'flow'; anchor?: string; eyebrow: string; title: string; body: string; demo: Demo; steps: { label: string }[] }
  /** The desktop app, with the `#download` anchor that download buttons fall back to. */
  | { type: 'download'; eyebrow: string; title: string; body: string; bullets: string[] }
  /** Trust cards on a tinted band. */
  | { type: 'trust'; title: string; intro?: string; items: { title: string; text: string; icon?: string }[]; link?: TextLink }
  /** Product facts in words (no figures that depend on a plan, no user counts, no quotes). */
  | { type: 'facts'; eyebrow?: string; title: string; items: { value: string; label: string; text?: string }[] };

export type PageSlug = 'home' | 'product' | 'pricing' | 'resources';

/** Bento cards of the homepage (inline SVG components in components/visuals/bento.tsx). */
export const BENTO_KEYS = ['track', 'resume', 'search', 'match', 'alerts', 'prepare', 'letter', 'autofill'] as const;
export type BentoKey = (typeof BENTO_KEYS)[number];
export type TileKey = 'peach' | 'pink' | 'lilac' | 'green' | 'blue' | 'butter';

/** A bento card: `span` is its width on the 12-column grid (large screens); `soon`: planned, not in the product yet. */
export type BentoCard = { key: BentoKey; title: string; text: string; tile: TileKey; span: 3 | 4 | 5 | 7; soon?: boolean };

/**
 * Homepage, art direction v3 (11 Oct 2026; founder feedback of 10-11 Oct: fewer, more visual sections). Fixed
 * structure, content from code (content/fallback/home.ts); SEO still comes from the `home` page document.
 */
export type HomeContent = {
  hero: { heading: string; intro: string; ctas: Cta[] };
  boards: { title: string; text: string; items: { name: string; domain: string }[] };
  bento: { title: string; intro: string; cards: BentoCard[]; link: TextLink };
  views: { title: string; intro: string; label: string; items: { key: ViewKey; label: string; caption: string }[] };
  apps: { title: string; items: { key: 'desktop' | 'mobile' | 'extension'; title: string; text: string; soon?: boolean; cta: Cta }[] };
  closing: { title: string; ctas: Cta[] };
};

export type PageContent = {
  slug: PageSlug;
  seo: Seo;
  heading: string;
  intro: string;
  /** Small line above the H1. */
  eyebrow?: string;
  /** Microcopy under the hero buttons. */
  note?: string;
  ctas?: Cta[];
  /** Live demo right under the hero. */
  heroDemo?: Demo;
  sections: Section[];
};

export type Resource = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  cover?: ImageRef;
  body: PortableTextBlock[];
  readingMinutes: number;
  seo?: Partial<Seo>;
};
