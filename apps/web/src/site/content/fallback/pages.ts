import type { PageContent, PageSlug, Section } from '../types';

/** Product sections shared by the homepage and /product (one source, same copy and demos). */
const searchSpotlight: Section = {
  type: 'spotlight',
  anchor: 'job-offers',
  eyebrow: 'Job offers',
  title: 'The offers that fit, in one list.',
  body: 'Describe what you look for once: title, city, contract, remote. Run the search from the desktop app and new offers land in your account, without duplicates.',
  bullets: ['Search profiles you can reuse', 'One list, no duplicates', 'Save an offer to your applications in one click'],
  demoSide: 'right',
  demo: {
    key: 'search',
    label: 'Live demo of the job offers search: type in the field, pick a contract, a city or remote, and save offers.',
    caption: "Search profile 'Product Designer, Paris'. Try the filters.",
  },
};

const applicationsViews: Section = {
  type: 'views',
  anchor: 'applications',
  eyebrow: 'Applications',
  title: 'See every application your way.',
  intro: 'Four views on the same data. Move a card, and the table, timeline and map follow.',
  label: 'Live demo of the Applications hub with Board, Table, Timeline and Map layouts',
  views: [
    { key: 'board', label: 'Board', caption: 'Drag applications from one status to the next.' },
    { key: 'table', label: 'Table', caption: 'Sort by company, status or date.' },
    { key: 'timeline', label: 'Timeline', caption: "See what happened, and what's next." },
    { key: 'map', label: 'Map', caption: 'See where your applications are, and how far.' },
  ],
};

const interviewsSpotlight: Section = {
  type: 'spotlight',
  anchor: 'interviews',
  eyebrow: 'Interviews',
  title: 'Walk into every interview prepared.',
  body: "Each interview keeps its date, the people you meet, your notes and your questions, linked to the application. After the call, write down how it went while it's fresh.",
  bullets: ['Every round on one timeline', 'Notes and questions per interview', 'Linked to the offer and the company'],
  demoSide: 'left',
  demo: {
    key: 'interviews',
    label: 'Live demo of an interview process: select a round to see its date, people, prep notes and questions.',
    caption: 'An interview process, round by round. Click through it.',
  },
};

const profileFlow: Section = {
  type: 'flow',
  anchor: 'profile',
  eyebrow: 'Profile',
  title: 'Your profile, filled from your resume.',
  body: 'Drop a PDF or DOCX, or your LinkedIn export. Your experience, education, languages and skills are filled in for you to review and edit.',
  steps: [{ label: 'Import your resume' }, { label: 'Fields are read' }, { label: 'Review your profile' }],
  demo: {
    key: 'profile',
    label: 'Live demo of the resume import: press Import a resume to fill the profile.',
    caption: 'Resume to profile. Press Import a resume.',
  },
};

const features: Section = {
  type: 'features',
  anchor: 'features',
  eyebrow: 'All features',
  title: 'Everything in applyspace.',
  intro: 'What you can use today, and what comes next.',
};

export const pages: Record<PageSlug, PageContent> = {
  /** SEO of the homepage; its sections are fixed in code (home.ts, components/home). */
  home: {
    slug: 'home',
    seo: {
      title: 'applyspace - When finding a job is not a job itself',
      description: 'Find offers, apply, and prepare your interviews in one space. Track every application on a board, table, timeline or map. Free to start.',
    },
    heading: 'When finding a job is not a job itself',
    intro: 'Find offers, apply, and prepare your interviews in one space.',
    sections: [],
  },
  product: {
    slug: 'product',
    seo: {
      title: 'Product: search, track and prepare in one app',
      description: 'Job offers search, an applications hub with board, table, timeline and map, interview tracking and a resume-powered profile.',
    },
    heading: 'Everything for your job search, in one app.',
    intro: 'From the first offer to the final interview, every space works on the same data. Try each one below.',
    sections: [
      applicationsViews,
      searchSpotlight,
      interviewsSpotlight,
      profileFlow,
      features,
      {
        type: 'cta',
        title: 'Give your job search one space.',
        text: 'Free to start. Import your resume and set up in minutes.',
        cta: { label: 'Get started free', href: '/login', kind: 'app' },
        secondary: { label: 'Download for macOS', href: '/download', kind: 'download' },
      },
    ],
  },
  pricing: {
    slug: 'pricing',
    seo: {
      title: 'Pricing: Free, Plus and Max',
      description: 'Start free with 15 applications. Plus raises the cap to 99 and Max has no limits.',
    },
    heading: 'Start free, upgrade when you need more',
    intro: 'Pick the room you need for your search. Change plan at any time.',
    sections: [
      {
        type: 'plans',
        variant: 'full',
      },
      {
        type: 'faq',
        title: 'Frequently asked questions',
        items: [
          { question: 'Is applyspace free?', answer: 'Yes. The Free plan includes application tracking, interview preparation and the core tools, with a cap of 15 applications, one search profile and one interview template.' },
          { question: 'What counts as an application?', answer: 'Every application you save counts toward your cap. Free allows 15, Plus 99 and Max has no limit.' },
          { question: 'Can I change plan later?', answer: 'Yes. You can upgrade when you need more room and return to Free at any time.' },
          { question: 'What happens to my data if I go back to Free?', answer: 'Your data is kept. You return to the Free possibilities, which means a lower cap and fewer search profiles.' },
          { question: 'Does applyspace pay for AI?', answer: 'No. AI features run on your own AI accounts (Claude, OpenAI or Gemini), so you stay in control of the cost and of your documents.' },
          { question: 'Where is my data stored?', answer: 'Everything is stored in the cloud, in a hosted database with per-user access rules, so you find your search on any device.' },
        ],
      },
      {
        type: 'cta',
        title: 'Start on the Free plan',
        text: 'No card needed.',
        cta: { label: 'Start for free', href: '/login', kind: 'app' },
      },
    ],
  },
  resources: {
    slug: 'resources',
    seo: {
      title: 'Resources: guides for a calmer job search',
      description: 'Practical guides on searching, tracking applications and preparing interviews.',
    },
    heading: 'Resources',
    intro: 'Practical guides on searching, tracking and interviewing.',
    sections: [],
  },
};
