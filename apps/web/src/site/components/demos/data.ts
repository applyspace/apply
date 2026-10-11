/**
 * Demo data of the homepage product demos: the fictional job search of Camille Aubert, product designer in
 * Paris. Companies are invented, logos are initials (no real brand). Dates are fixed, so the server render and
 * the interactive version always match. No React here: the static views (server) and the live demos (client)
 * both read it.
 */

export type DemoStatus = 'waiting' | 'interviewing' | 'accepted' | 'rejected' | 'ghosted';

/** Board columns, in the product order (Ghosted and Withdrawn are left out to keep the demo readable). */
export const BOARD_COLUMNS: DemoStatus[] = ['waiting', 'interviewing', 'accepted', 'rejected'];

export const STATUS_LABEL: Record<DemoStatus, string> = {
  waiting: 'Waiting for answer',
  interviewing: 'Interviewing',
  accepted: 'Accepted',
  rejected: 'Rejected',
  ghosted: 'Ghosted',
};

export const STATUS_SHORT: Record<DemoStatus, string> = {
  waiting: 'Waiting',
  interviewing: 'Interviewing',
  accepted: 'Accepted',
  rejected: 'Rejected',
  ghosted: 'Ghosted',
};

/** Same tones as the product (components/applications/statusTone.ts), literal classes for the Tailwind scanner. */
export const STATUS_TONE: Record<DemoStatus, { dot: string; badge: string }> = {
  waiting: { dot: 'bg-stone-400', badge: 'bg-stone-100 text-stone-700' },
  interviewing: { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700' },
  accepted: { dot: 'bg-green-500', badge: 'bg-green-50 text-green-700' },
  rejected: { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700' },
  ghosted: { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700' },
};

/** Company marks: an initial on a quiet tint. */
const TINTS = [
  'bg-brand-100 text-stone-950',
  'bg-sky-100 text-sky-800',
  'bg-emerald-100 text-emerald-800',
  'bg-amber-100 text-amber-800',
  'bg-rose-100 text-rose-800',
  'bg-stone-200 text-stone-800',
] as const;

export type Company = { name: string; tint: (typeof TINTS)[number] };

const co = (name: string, tint: number): Company => ({ name, tint: TINTS[tint % TINTS.length] });

export const COMPANIES = {
  marea: co('Maréa', 0),
  kiwimo: co('Kiwimo', 2),
  brindille: co('Brindille', 3),
  opaline: co('Opaline', 1),
  nordlys: co('Nordlys Studio', 5),
  cobaltine: co('Cobaltine', 1),
  papillote: co('Papillote', 4),
  vergerie: co('Vergerie', 2),
  halotec: co('Halotec', 3),
  nimbalo: co('Nimbalo', 0),
  ferma: co('Ferma', 4),
  lumeo: co('Lumeo Santé', 2),
} as const;

export type PlaceKey = 'paris2' | 'paris9' | 'paris10' | 'paris11' | 'paris13' | 'defense' | 'boulogne' | 'montreuil' | 'stdenis' | 'remote';

/** Stylised map of Paris and its inner suburbs: coordinates in the 0..400 x 0..260 map box (no map tiles). */
export const PLACES: Record<PlaceKey, { label: string; x: number; y: number } | { label: string; remote: true }> = {
  paris2: { label: 'Paris 2e', x: 205, y: 112 },
  paris9: { label: 'Paris 9e', x: 196, y: 96 },
  paris10: { label: 'Paris 10e', x: 222, y: 98 },
  paris11: { label: 'Paris 11e', x: 240, y: 128 },
  paris13: { label: 'Paris 13e', x: 222, y: 172 },
  defense: { label: 'La Défense', x: 92, y: 92 },
  boulogne: { label: 'Boulogne-Billancourt', x: 108, y: 168 },
  montreuil: { label: 'Montreuil', x: 306, y: 122 },
  stdenis: { label: 'Saint-Denis', x: 214, y: 30 },
  remote: { label: 'Remote', remote: true },
};

export type DemoApplication = {
  id: string;
  company: Company;
  title: string;
  place: PlaceKey;
  status: DemoStatus;
  /** ISO days, fixed. */
  applied: string;
  replied?: string;
  interview?: string;
  salary: string;
};

/** "Today" of the demo, fixed so the server and the browser agree. */
export const TODAY = '2026-10-12';

export const APPLICATIONS: DemoApplication[] = [
  { id: 'a1', company: COMPANIES.marea, title: 'Senior Product Designer', place: 'paris10', status: 'interviewing', applied: '2026-09-18', replied: '2026-09-23', interview: '2026-10-15', salary: '€58-65k' },
  { id: 'a2', company: COMPANIES.kiwimo, title: 'Product Designer', place: 'paris10', status: 'waiting', applied: '2026-10-06', salary: '€48-55k' },
  { id: 'a3', company: COMPANIES.brindille, title: 'Product Designer, Growth', place: 'montreuil', status: 'waiting', applied: '2026-10-02', salary: '€50-56k' },
  { id: 'a4', company: COMPANIES.opaline, title: 'Lead Product Designer', place: 'defense', status: 'interviewing', applied: '2026-09-10', replied: '2026-09-17', interview: '2026-10-20', salary: '€65-75k' },
  { id: 'a5', company: COMPANIES.nordlys, title: 'UX/UI Designer', place: 'paris2', status: 'accepted', applied: '2026-09-01', replied: '2026-09-05', salary: '€52-58k' },
  { id: 'a6', company: COMPANIES.cobaltine, title: 'Design System Designer', place: 'remote', status: 'waiting', applied: '2026-09-29', salary: '€55-62k' },
  { id: 'a7', company: COMPANIES.papillote, title: 'Product Designer', place: 'paris9', status: 'rejected', applied: '2026-09-08', replied: '2026-09-22', salary: '€45-52k' },
  { id: 'a8', company: COMPANIES.vergerie, title: 'Senior UX Designer', place: 'boulogne', status: 'interviewing', applied: '2026-09-24', replied: '2026-10-01', interview: '2026-10-14', salary: '€56-62k' },
  { id: 'a9', company: COMPANIES.halotec, title: 'Product Designer, Mobile', place: 'stdenis', status: 'waiting', applied: '2026-10-08', salary: '€47-53k' },
  { id: 'a10', company: COMPANIES.nimbalo, title: 'Product Designer', place: 'remote', status: 'rejected', applied: '2026-09-03', replied: '2026-09-30', salary: '€50-55k' },
  { id: 'a11', company: COMPANIES.lumeo, title: 'Senior Product Designer', place: 'paris13', status: 'waiting', applied: '2026-09-26', salary: '€57-64k' },
];

/** Card the hero hint moves once, from Waiting to Interviewing. */
export const HINT_CARD = 'a3';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** `12 Oct`, from an ISO day, without Intl or time zones. */
export function day(iso: string): string {
  const [, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}

const toDays = (iso: string) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) / 86_400_000;

/** `today`, `yesterday`, `5 days ago`, relative to the demo's TODAY. */
export function ago(iso: string): string {
  const n = toDays(TODAY) - toDays(iso);
  if (n <= 0) return 'today';
  if (n === 1) return 'yesterday';
  return `${n} days ago`;
}

/** Timeline range of the demo. */
export const RANGE = { from: '2026-08-31', to: '2026-10-25' };

/** Position of an ISO day in RANGE, in percent. */
export function percent(iso: string): number {
  const from = toDays(RANGE.from);
  const to = toDays(RANGE.to);
  return Math.min(100, Math.max(0, ((toDays(iso) - from) / (to - from)) * 100));
}

/** Week ticks of the timeline (Mondays). */
export const WEEKS = ['2026-08-31', '2026-09-07', '2026-09-14', '2026-09-21', '2026-09-28', '2026-10-05', '2026-10-12', '2026-10-19'];

// ── Job offers ─────────────────────────────────────────────────────────────

export type Contract = 'Permanent' | 'Fixed-term' | 'Freelance';
export type WorkMode = 'On-site' | 'Hybrid' | 'Remote';
export type City = 'Paris' | 'Lyon' | 'Nantes';

export type DemoOffer = {
  id: string;
  company: Company;
  title: string;
  city: City;
  contract: Contract;
  mode: WorkMode;
  salary: string;
  posted: string;
};

export const CONTRACTS: Contract[] = ['Permanent', 'Fixed-term', 'Freelance'];
export const CITIES: City[] = ['Paris', 'Lyon', 'Nantes'];

export const OFFERS: DemoOffer[] = [
  { id: 'o1', company: COMPANIES.ferma, title: 'Senior Product Designer', city: 'Paris', contract: 'Permanent', mode: 'Hybrid', salary: '€58-66k', posted: 'Today' },
  { id: 'o2', company: COMPANIES.cobaltine, title: 'Product Designer, Design System', city: 'Paris', contract: 'Permanent', mode: 'Remote', salary: '€55-62k', posted: 'Yesterday' },
  { id: 'o3', company: COMPANIES.lumeo, title: 'Product Designer, Patient app', city: 'Lyon', contract: 'Permanent', mode: 'Hybrid', salary: '€48-54k', posted: '2 days ago' },
  { id: 'o4', company: COMPANIES.halotec, title: 'UX Designer', city: 'Paris', contract: 'Fixed-term', mode: 'On-site', salary: '€44-48k', posted: '2 days ago' },
  { id: 'o5', company: COMPANIES.nimbalo, title: 'Lead Product Designer', city: 'Paris', contract: 'Permanent', mode: 'On-site', salary: '€68-78k', posted: '3 days ago' },
  { id: 'o6', company: COMPANIES.vergerie, title: 'Product Designer, Checkout', city: 'Nantes', contract: 'Permanent', mode: 'Remote', salary: '€46-52k', posted: '4 days ago' },
  { id: 'o7', company: COMPANIES.papillote, title: 'Freelance Product Designer', city: 'Paris', contract: 'Freelance', mode: 'Remote', salary: '€550/day', posted: '5 days ago' },
  { id: 'o8', company: COMPANIES.kiwimo, title: 'Product Designer, Mobility', city: 'Paris', contract: 'Permanent', mode: 'Hybrid', salary: '€50-56k', posted: '6 days ago' },
  { id: 'o9', company: COMPANIES.opaline, title: 'Senior UX Researcher', city: 'Lyon', contract: 'Fixed-term', mode: 'Hybrid', salary: '€52-58k', posted: '1 week ago' },
  { id: 'o10', company: COMPANIES.brindille, title: 'Product Designer', city: 'Paris', contract: 'Permanent', mode: 'Remote', salary: '€50-56k', posted: '1 week ago' },
];

// ── Interviews ─────────────────────────────────────────────────────────────

export type StepState = 'done' | 'next' | 'later';

export type InterviewStep = {
  id: string;
  /** Interview stage, as in the product (HR, Manager, Design case, Team fit, Final). */
  stage: string;
  state: StepState;
  when: string;
  format: string;
  people: { name: string; role: string }[];
  prep: string[];
  questions: string[];
  /** How it went, for past rounds. */
  debrief?: string;
};

export const PROCESS = {
  company: COMPANIES.marea,
  title: 'Senior Product Designer',
  place: 'Paris 10e · Hybrid',
};

export const STEPS: InterviewStep[] = [
  {
    id: 's1',
    stage: 'HR call',
    state: 'done',
    when: 'Wed 23 Sep, 10:00',
    format: 'Video call, 30 min',
    people: [{ name: 'Inès Laurent', role: 'Talent partner' }],
    prep: ['Two-minute pitch of my path', 'Salary range: €58-65k', 'Notice period: one month'],
    questions: ['How is the design team organised?', 'What does hybrid mean in practice?'],
    debrief: 'Warm call. Team of six designers, two days a week at the office. Next: the hiring manager.',
  },
  {
    id: 's2',
    stage: 'Hiring manager',
    state: 'done',
    when: 'Thu 1 Oct, 16:30',
    format: 'On site, 45 min',
    people: [{ name: 'Hugo Martin', role: 'Head of Design' }],
    prep: ['Walk through the Atelier Brume booking redesign', 'One project that failed, and what changed', 'Read their latest release notes'],
    questions: ['What would success look like after six months?', 'How do designers and engineers decide together?'],
    debrief: 'Good fit on research habits. He asked for a design case on the onboarding flow.',
  },
  {
    id: 's3',
    stage: 'Design case',
    state: 'next',
    when: 'Thu 15 Oct, 14:00',
    format: 'On site, 1 h, presentation',
    people: [
      { name: 'Hugo Martin', role: 'Head of Design' },
      { name: 'Sarah Benali', role: 'Product manager' },
    ],
    prep: ['Rehearse the case in 20 minutes', 'Bring two process artefacts', 'Name one trade-off I would revisit'],
    questions: ['Which metric do you watch for onboarding?', 'Who owns the design system today?'],
  },
  {
    id: 's4',
    stage: 'Team fit',
    state: 'later',
    when: 'To be scheduled',
    format: 'Lunch with the team',
    people: [{ name: 'Product team', role: 'Designers and engineers' }],
    prep: ['Ask how critiques run', 'Note what they enjoy in the week'],
    questions: ['What is a typical week like?'],
  },
  {
    id: 's5',
    stage: 'Final',
    state: 'later',
    when: 'To be scheduled',
    format: 'Video call, 30 min',
    people: [{ name: 'Léa Moreau', role: 'Chief Product Officer' }],
    prep: ['Summarise why Maréa, in three sentences'],
    questions: ['Where do you want the product to be in two years?'],
  },
];

// ── Profile from a resume ──────────────────────────────────────────────────

export const RESUME_FILE = 'camille-aubert-cv.pdf';

export const PROFILE = {
  name: 'Camille Aubert',
  headline: 'Product Designer',
  location: 'Paris, France',
  experience: [
    { title: 'Product Designer', company: 'Atelier Brume', dates: '2022 - now' },
    { title: 'UX/UI Designer', company: 'Studio Ondine', dates: '2020 - 2022' },
    { title: 'UX Designer', company: 'Agence Pivot', dates: '2018 - 2020' },
  ],
  education: [{ title: 'Master, Interaction design', company: 'École de design de Nantes', dates: '2016 - 2018' }],
  languages: ['French, native', 'English, fluent'],
  skills: ['Figma', 'Design systems', 'User research', 'Prototyping', 'Accessibility', 'Workshops'],
};

/** Reading steps shown while the resume is parsed. */
export const READING_STEPS = ['Reading the file', 'Finding your experience', 'Finding education and languages', 'Listing your skills'];
