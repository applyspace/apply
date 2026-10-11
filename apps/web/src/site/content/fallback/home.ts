import type { Cta, HomeContent } from '../types';

const start: Cta = { label: 'Get started for free', href: '/login', kind: 'app' };
const download: Cta = { label: 'Download desktop app', href: '/download', kind: 'download' };

/**
 * Homepage copy, art direction v3 (11 Oct 2026) after the founder feedback: Hero, job boards, one bento of
 * features, the four views, the apps, the closing call. Keep it truthful: `soon` on anything not shipped.
 */
export const home: HomeContent = {
  hero: {
    heading: 'When finding a job is not a job itself',
    intro: 'Find offers, apply, and prepare your interviews in one space.',
    ctas: [start, download],
  },
  boards: {
    title: 'Every job board, one search',
    text: 'Set your search once. apply looks through the job boards you choose at the same time, from the desktop app with your own sessions, and brings every match into one list.',
    items: [
      { name: 'Welcome to the Jungle', domain: 'welcometothejungle.com' },
      { name: 'LinkedIn', domain: 'linkedin.com' },
      { name: 'Indeed', domain: 'indeed.com' },
      { name: 'HelloWork', domain: 'hellowork.com' },
      { name: 'Jobs That Make Sense', domain: 'jobsthatmakesense.com' },
      { name: 'Glassdoor', domain: 'glassdoor.com' },
      { name: 'Collective.work', domain: 'collective.work' },
      { name: 'France Travail', domain: 'francetravail.org' },
    ],
  },
  bento: {
    title: 'Track your entire job search.',
    intro: 'From the first offer to the last interview, everything lives in one space.',
    link: { label: 'See every feature', href: '/product' },
    cards: [
      { key: 'track', span: 7, tile: 'butter', title: 'Every application in one place', text: 'Status, documents, contacts and the next date to remember, from saved to offer.' },
      { key: 'resume', span: 5, tile: 'peach', title: 'Your resume becomes your profile', text: 'Drop your resume or LinkedIn export. apply fills your profile for you to review.' },
      { key: 'search', span: 4, tile: 'blue', soon: true, title: 'Search every board at once', text: 'One set of filters, every job board you choose, one list of matches.' },
      { key: 'match', span: 4, tile: 'lilac', soon: true, title: 'See how an offer fits you', text: 'apply reads the offer and shows what matches your profile and what to highlight.' },
      { key: 'alerts', span: 4, tile: 'green', soon: true, title: 'Be the first to know', text: 'A new offer matches your search: you hear about it while it is still fresh.' },
      { key: 'prepare', span: 5, tile: 'pink', title: 'Walk into every interview ready', text: 'Rounds, people, prep notes and the questions to ask, for each interview.' },
      { key: 'letter', span: 4, tile: 'peach', soon: true, title: 'Cover letters in your words', text: 'A first draft from the offer and your profile. You keep the final word.' },
      { key: 'autofill', span: 3, tile: 'blue', soon: true, title: 'Autofill any form', text: 'The extension fills applications from your profile.' },
    ],
  },
  views: {
    title: 'Your applications, your way',
    intro: 'The same applications, four ways to look at them.',
    label: 'Views',
    items: [
      { key: 'board', label: 'Board', caption: 'Move each application from saved to offer.' },
      { key: 'table', label: 'Table', caption: 'Sort and scan everything in rows.' },
      { key: 'timeline', label: 'Timeline', caption: 'See every process on the calendar.' },
      { key: 'map', label: 'Map', caption: 'See where each job is on the map.' },
    ],
  },
  apps: {
    title: 'With you, wherever you search',
    items: [
      {
        key: 'desktop',
        title: 'Desktop app',
        text: 'Runs your searches on your Mac with your own job board sessions. Same account as the web.',
        cta: { label: 'Download for macOS', href: '/download', kind: 'download' },
      },
      {
        key: 'mobile',
        title: 'Mobile app',
        soon: true,
        text: 'Check an application or read your prep notes on the way to an interview.',
        cta: { label: 'Get notified', href: '/login', kind: 'app' },
      },
      {
        key: 'extension',
        title: 'Chrome extension',
        soon: true,
        text: 'Save an offer from any page and fill application forms from your profile.',
        cta: { label: 'Get notified', href: '/login', kind: 'app' },
      },
    ],
  },
  closing: {
    title: 'Give your job search one space',
    ctas: [start, download],
  },
};
