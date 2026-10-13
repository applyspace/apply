import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  ArrowUpDownIcon,
  Bookmark02Icon,
  Calendar03Icon,
  ChartLineData01Icon,
  Clock01Icon,
  FileUploadIcon,
  Home01Icon,
  JobSearchIcon,
  KanbanIcon,
  Location06Icon,
  MapsLocation01Icon,
  Mic01Icon,
  MoreHorizontalIcon,
  Pdf01Icon,
  RefreshIcon,
  Search01Icon,
  Table01Icon,
  Tick02Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';
import type { Company, DemoStatus } from './data';
import { STATUS_LABEL, STATUS_SHORT, STATUS_TONE } from './data';
import { cn } from '@/site/lib/cn';

const ICONS = {
  add: Add01Icon,
  down: ArrowDown01Icon,
  left: ArrowLeft01Icon,
  right: ArrowRight01Icon,
  up: ArrowUp01Icon,
  sort: ArrowUpDownIcon,
  bookmark: Bookmark02Icon,
  calendar: Calendar03Icon,
  timeline: ChartLineData01Icon,
  clock: Clock01Icon,
  upload: FileUploadIcon,
  home: Home01Icon,
  offers: JobSearchIcon,
  board: KanbanIcon,
  pin: Location06Icon,
  map: MapsLocation01Icon,
  interview: Mic01Icon,
  more: MoreHorizontalIcon,
  pdf: Pdf01Icon,
  again: RefreshIcon,
  search: Search01Icon,
  table: Table01Icon,
  tick: Tick02Icon,
  profile: UserIcon,
} satisfies Record<string, IconSvgElement>;

export type DemoIconName = keyof typeof ICONS;

/** Hugeicons, like the product. Decorative: the controls carry their own labels. */
export function Icon({ name, size = 14, className }: { name: DemoIconName; size?: number; className?: string }) {
  return <HugeiconsIcon icon={ICONS[name]} size={size} strokeWidth={1.8} className={cn('shrink-0', className)} aria-hidden />;
}

/** Company mark: an initial on a tint (no real logos in the demos). */
export function CompanyMark({ company, className }: { company: Company; className?: string }) {
  return (
    <span aria-hidden className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold', company.tint, className)}>
      {company.name[0]}
    </span>
  );
}

export function StatusBadge({ status, className }: { status: DemoStatus; className?: string }) {
  return (
    <span className={cn('inline-flex h-6 items-center gap-1.5 rounded-full px-2 text-xs font-medium whitespace-nowrap', STATUS_TONE[status].badge, className)}>
      <span aria-hidden className={cn('size-1.5 rounded-full', STATUS_TONE[status].dot)} />
      <span className="sm:hidden">{STATUS_SHORT[status]}</span>
      <span className="hidden sm:inline">{STATUS_LABEL[status]}</span>
    </span>
  );
}

/** The product window: a quiet sidebar (large screens) and the page area. Server-rendered around the live demos. */
export function AppWindow({
  active,
  rail = false,
  children,
  className,
}: {
  active: 'offers' | 'applications' | 'interviews' | 'profile';
  /** Icons-only sidebar, for demos in a half-width column. */
  rail?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const items: { key: typeof active | 'home'; label: string; icon: DemoIconName }[] = [
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'offers', label: 'Job offers', icon: 'offers' },
    { key: 'applications', label: 'Applications', icon: 'board' },
    { key: 'interviews', label: 'Interviews', icon: 'interview' },
    { key: 'profile', label: 'Profile', icon: 'profile' },
  ];
  return (
    <div className={cn('flex overflow-hidden rounded-2xl border border-stone-200 bg-white text-left', className)}>
      <div aria-hidden className={cn('hidden shrink-0 flex-col border-r border-stone-200 bg-stone-50 lg:flex', rail ? 'w-14 items-center px-2 py-3' : 'w-52 p-3')}>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="size-5 rounded-md bg-brand-300" />
          {!rail && <span className="text-sm font-semibold tracking-tight text-stone-950">applyspace</span>}
        </div>
        <ul className="mt-4 flex list-none flex-col gap-0.5">
          {items.map((it) => (
            <li
              key={it.key}
              className={cn('flex h-8 items-center gap-2.5 rounded-lg px-2 text-sm', it.key === active ? 'bg-white font-medium text-stone-950 ring-1 ring-stone-200' : 'text-stone-600')}
            >
              <Icon name={it.icon} size={16} />
              {!rail && it.label}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center gap-2 px-2 py-1.5">
          <span className="flex size-6 items-center justify-center rounded-full bg-brand-100 text-[11px] font-semibold text-stone-950">CA</span>
          {!rail && <span className="text-sm text-stone-700">Camille Aubert</span>}
        </div>
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/** Small header of a product page inside a demo. */
export function PageHeader({ title, count, children }: { title: string; count?: string; children?: React.ReactNode }) {
  return (
    <div className="flex min-h-14 flex-wrap items-center gap-x-3 gap-y-2 border-b border-stone-200 px-4 py-2.5 sm:px-5">
      <p className="text-[15px] font-semibold tracking-tight text-stone-950">
        {title}
        {count && <span className="ml-2 text-sm font-normal tabular-nums text-stone-500">{count}</span>}
      </p>
      {children}
    </div>
  );
}
