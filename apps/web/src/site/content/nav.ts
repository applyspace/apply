import type { Locale } from '@/site/lib/i18n';

/** An entry of a header menu. No `href`: there is no page yet, so it renders as text with a "Soon" pill. */
export type NavMenuEntry = { title: string; text: string; icon: string; href?: string; soon?: boolean };
export type NavMenuGroup = { title?: string; items: NavMenuEntry[] };
export type NavMenu = {
  groups: NavMenuGroup[];
  /** Small card on the side of the menu (large screens). */
  featured?: { title: string; text: string; href: string; cta: string; kind: 'download' | 'internal' };
  /** Link at the bottom of the menu, e.g. every feature. */
  footer?: { label: string; href: string };
};

/**
 * Header menus, keyed by the href of the CMS nav item they open from (`/product`, `/resources`). Planned features
 * keep `soon: true` (same rule as content/fallback/features.ts): flip it when they ship.
 */
const en: Record<string, NavMenu> = {
  '/product': {
    groups: [
      {
        title: 'Find',
        items: [
          { title: 'Board search', text: 'One search across the job boards you choose.', icon: 'search', href: '/product#job-offers', soon: true },
          { title: 'Job alerts', text: 'Hear about new matching offers first.', icon: 'bell', href: '/product#job-offers', soon: true },
        ],
      },
      {
        title: 'Apply',
        items: [
          { title: 'Resume & profile', text: 'Import your resume, review your profile.', icon: 'upload', href: '/product#profile' },
          { title: 'Offer analysis', text: 'See how each offer fits your profile.', icon: 'ai', href: '/product#features', soon: true },
          { title: 'Cover letters', text: 'A first draft from the offer and you.', icon: 'pen', href: '/product#features', soon: true },
          { title: 'Autofill', text: 'Fill application forms from your profile.', icon: 'browser', href: '/product#features', soon: true },
        ],
      },
      {
        title: 'Track',
        items: [
          { title: 'Applications', text: 'Board, table, timeline and map views.', icon: 'board', href: '/product#applications' },
          { title: 'Home overview', text: 'What matters today, on one page.', icon: 'home', href: '/product#features' },
          { title: 'Inbox sync', text: 'Replies and interviews, kept in sync.', icon: 'mail', href: '/product#features', soon: true },
        ],
      },
      {
        title: 'Prepare',
        items: [
          { title: 'Interviews', text: 'Rounds, people, notes and questions.', icon: 'interview', href: '/product#interviews' },
          { title: 'Templates', text: 'Start each interview type from a template.', icon: 'check', href: '/product#interviews' },
        ],
      },
    ],
    featured: {
      title: 'apply for macOS',
      text: 'Your searches run on your Mac, with your own job board sessions.',
      href: '/download',
      cta: 'Download for macOS',
      kind: 'download',
    },
    footer: { label: 'See every feature', href: '/product' },
  },
  '/resources': {
    groups: [
      {
        items: [
          { title: 'What’s new', text: 'Every update to apply.', icon: 'sparkle', soon: true },
          { title: 'Guides', text: 'Practical guides for a calmer job search.', icon: 'note', href: '/resources' },
          { title: 'Help center', text: 'Answers to common questions.', icon: 'help', soon: true },
        ],
      },
    ],
  },
};

export const navMenus: Record<Locale, Record<string, NavMenu>> = { en };
