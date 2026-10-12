'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon,
  Briefcase08Icon,
  Chatting01Icon,
  Home01Icon,
  Menu01Icon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  Sent02Icon,
  Settings01Icon,
  UserCircleIcon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import { useLocale } from '@/components/providers/Providers';
import { useSettingsModal } from '@/components/settings/SettingsModalProvider';
import { ApplyLogo } from '@/components/brand/ApplyLogo';
import { UserMenu } from '@/components/layout/UserMenu';
import { NewSearchDialog } from '@/components/layout/NewSearchDialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { entrySlug } from '@/lib/slug';
import {
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
  SIDEBAR_RESIZE_STEP,
  clampSidebarWidth,
  countActiveApplications,
  countUpcomingInterviews,
  formatNavCount,
  isNavActive,
} from '@/lib/sidebarNav';
import type {
  ApplicationWithRelations,
  InterviewWithRelations,
} from '@apply/core/applications';
import type { SearchWithCount } from '@apply/core/searches';
import type { AccountPlan } from '@apply/core/candidate-profile';

type Icon = typeof Home01Icon;

/** Shared look of every row: hover, focus ring and active state. */
const itemBase =
  'flex w-full items-center gap-2.5 rounded-lg text-sm outline-none transition-colors ' +
  'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ' +
  'focus-visible:ring-2 focus-visible:ring-sidebar-ring ' +
  'aria-[current=page]:bg-sidebar-accent aria-[current=page]:font-medium aria-[current=page]:text-sidebar-accent-foreground';

/* ── Primitives ───────────────────────────────────────────────────── */

/** Wraps a row in a right-side tooltip when the sidebar is collapsed. */
function WithTooltip({
  collapsed,
  label,
  children,
}: {
  collapsed: boolean;
  label: string;
  children: React.ReactElement;
}) {
  if (!collapsed) return children;
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function CountBadge({ value, label }: { value: string | null; label?: string }) {
  if (!value) return null;
  return (
    <span
      className="ml-auto rounded-md bg-sidebar-accent px-1.5 text-[11px] leading-5 font-medium text-muted-foreground tabular-nums group-aria-[current=page]/item:bg-background"
      aria-label={label}
    >
      {value}
    </span>
  );
}

/** A top-level row: a link when `href` is set, otherwise a button. */
function NavItem({
  icon,
  label,
  collapsed,
  href,
  active = false,
  onClick,
  count,
  countLabel,
}: {
  icon: Icon;
  label: string;
  collapsed: boolean;
  href?: string;
  active?: boolean;
  onClick?: () => void;
  count?: string | null;
  countLabel?: string;
}) {
  const className = cn(
    itemBase,
    'group/item relative h-8',
    collapsed ? 'justify-center px-0' : 'px-2',
  );
  const content = (
    <>
      <HugeiconsIcon icon={icon} size={18} strokeWidth={1.8} className="shrink-0" />
      {collapsed ? (
        count && (
          <span
            aria-hidden
            className="absolute top-1.5 right-2 size-1.5 rounded-full bg-sidebar-primary"
          />
        )
      ) : (
        <>
          <span className="truncate">{label}</span>
          <CountBadge value={count ?? null} label={countLabel} />
        </>
      )}
    </>
  );

  const el = href ? (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      aria-label={collapsed ? label : undefined}
      className={className}
    >
      {content}
    </Link>
  ) : (
    <button
      type="button"
      onClick={onClick}
      aria-label={collapsed ? label : undefined}
      className={className}
    >
      {content}
    </button>
  );

  return (
    <WithTooltip collapsed={collapsed} label={label}>
      {el}
    </WithTooltip>
  );
}

/* ── Content (shared by the desktop rail and the mobile sheet) ─────── */

interface SidebarDataProps {
  searches: SearchWithCount[];
  applications: ApplicationWithRelations[];
  interviews: InterviewWithRelations[];
  firstName: string;
  lastName: string;
  /** Account plan, or null when nobody is signed in (demo, desktop). */
  plan: AccountPlan | null;
}

function SidebarBody({
  collapsed,
  onNavigate,
  onNewSearch,
  searches,
  applications,
  interviews,
  firstName,
  lastName,
  plan,
}: SidebarDataProps & {
  collapsed: boolean;
  /** Called after any navigation, so the mobile sheet can close. */
  onNavigate?: () => void;
  onNewSearch: () => void;
}) {
  const pathname = usePathname();
  const { t } = useLocale();
  const { section, openSettings } = useSettingsModal();

  const activeApps = countActiveApplications(applications);
  const upcoming = countUpcomingInterviews(interviews);
  const activeAppsCount = formatNavCount(activeApps);
  const upcomingCount = formatNavCount(upcoming);

  const open = (s: 'profile' | 'general') => {
    onNavigate?.();
    openSettings(s);
  };

  return (
    <>
      <nav aria-label={t.sidebar.navLabel} className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-2">
          <NavItem
            icon={Home01Icon}
            label={t.nav.home}
            href="/"
            active={isNavActive(pathname, '/')}
            collapsed={collapsed}
            onClick={onNavigate}
          />
          <NavItem
            icon={Briefcase08Icon}
            label={t.nav.offers}
            href="/offers"
            active={isNavActive(pathname, '/offers', true)}
            collapsed={collapsed}
            onClick={onNavigate}
          />

          {/* Search profiles, nested under Offers */}
          {!collapsed && (
            <div role="group" aria-labelledby="sidebar-search-profiles" className="mb-1">
              <div className="flex h-7 items-center justify-between pr-1 pl-[34px]">
                <span
                  id="sidebar-search-profiles"
                  className="truncate text-xs font-medium text-muted-foreground"
                >
                  {t.sidebar.searchProfiles}
                </span>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={onNewSearch}
                        aria-label={t.sidebar.newSearch}
                        className="rounded-md text-muted-foreground"
                      />
                    }
                  >
                    <HugeiconsIcon icon={Add01Icon} size={14} />
                  </TooltipTrigger>
                  <TooltipContent side="right">{t.sidebar.newSearch}</TooltipContent>
                </Tooltip>
              </div>
              <ul className="ml-[17px] flex flex-col gap-0.5 border-l border-sidebar-border pl-2">
                {searches.length === 0 ? (
                  <li className="px-2 py-1 text-xs text-muted-foreground/70">
                    {t.sidebar.noSearches}
                  </li>
                ) : (
                  searches.map((s) => {
                    const label = [s.searchTitle, s.location].filter(Boolean).join(', ');
                    const href = `/offers/${entrySlug([s.searchTitle, s.location ?? undefined], s.id)}`;
                    return (
                      <li key={s.id}>
                        <Link
                          href={href}
                          onClick={onNavigate}
                          aria-current={isNavActive(pathname, href, true) ? 'page' : undefined}
                          className={cn(itemBase, 'group/item h-7 px-2 text-[13px]')}
                        >
                          <span className="truncate">{label}</span>
                          <CountBadge value={formatNavCount(s.count)} />
                        </Link>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          )}

          <NavItem
            icon={Sent02Icon}
            label={t.nav.applications}
            href="/applications"
            active={isNavActive(pathname, '/applications')}
            collapsed={collapsed}
            onClick={onNavigate}
            count={activeAppsCount}
            countLabel={t.sidebar.applicationsActive.replace('{n}', String(activeApps))}
          />
          <NavItem
            icon={Chatting01Icon}
            label={t.nav.interviews}
            href="/interviews"
            active={isNavActive(pathname, '/interviews')}
            collapsed={collapsed}
            onClick={onNavigate}
            count={upcomingCount}
            countLabel={t.sidebar.interviewsUpcoming.replace('{n}', String(upcoming))}
          />
        </div>

        <div className="flex flex-col gap-0.5 px-2 pb-2">
          <NavItem
            icon={UserCircleIcon}
            label={t.sidebar.profile}
            collapsed={collapsed}
            active={section === 'profile'}
            onClick={() => open('profile')}
          />
          <NavItem
            icon={Settings01Icon}
            label={t.nav.settings}
            collapsed={collapsed}
            active={section !== null && section !== 'profile'}
            onClick={() => open('general')}
          />
        </div>
      </nav>

      <Separator className="bg-sidebar-border" />
      <div className="p-2">
        <UserMenu
          collapsed={collapsed}
          firstName={firstName}
          lastName={lastName}
          plan={plan}
          onNavigate={onNavigate}
        />
      </div>
    </>
  );
}

/* ── Desktop rail ─────────────────────────────────────────────────── */

interface SidebarProps extends SidebarDataProps {
  collapsed: boolean;
  onToggle: () => void;
  width: number;
  onWidthChange: (width: number) => void;
}

export function Sidebar({ collapsed, onToggle, width, onWidthChange, ...data }: SidebarProps) {
  const { t } = useLocale();
  const [isDragging, setIsDragging] = useState(false);
  const [newSearchOpen, setNewSearchOpen] = useState(false);

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = width;
      setIsDragging(true);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      const onMouseMove = (ev: MouseEvent) =>
        onWidthChange(clampSidebarWidth(startWidth + (ev.clientX - startX)));
      const onMouseUp = () => {
        setIsDragging(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [width, onWidthChange],
  );

  function handleResizeKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowLeft') onWidthChange(clampSidebarWidth(width - SIDEBAR_RESIZE_STEP));
    else if (e.key === 'ArrowRight') onWidthChange(clampSidebarWidth(width + SIDEBAR_RESIZE_STEP));
    else return;
    e.preventDefault();
  }

  const toggleLabel = collapsed ? t.sidebar.expand : t.sidebar.collapse;

  return (
    <aside
      style={{ width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : width }}
      data-collapsed={collapsed || undefined}
      className={cn(
        'relative hidden h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex',
        !isDragging && 'transition-[width] duration-200 ease-out motion-reduce:transition-none',
      )}
    >
      {/* Header: logo + collapse toggle */}
      <div
        className={cn(
          'flex h-14 shrink-0 items-center',
          collapsed ? 'justify-center px-2' : 'justify-between pr-2 pl-4',
        )}
      >
        {!collapsed && (
          <Link
            href="/"
            aria-label={t.sidebar.home}
            className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <ApplyLogo className="h-5 w-auto shrink-0" />
          </Link>
        )}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onToggle}
                aria-label={toggleLabel}
                aria-expanded={!collapsed}
                className="rounded-lg text-muted-foreground"
              />
            }
          >
            <HugeiconsIcon icon={collapsed ? PanelLeftOpenIcon : PanelLeftCloseIcon} size={18} />
          </TooltipTrigger>
          <TooltipContent side="right">
            {toggleLabel}
            <kbd className="ml-1 font-sans opacity-60">⌘B</kbd>
          </TooltipContent>
        </Tooltip>
      </div>

      <SidebarBody
        {...data}
        collapsed={collapsed}
        onNewSearch={() => setNewSearchOpen(true)}
      />

      <NewSearchDialog
        open={newSearchOpen}
        onOpenChange={setNewSearchOpen}
        plan={data.plan}
        searchCount={data.searches.length}
      />

      {/* Resize handle: drag, or focus it and use the arrow keys */}
      {!collapsed && (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label={t.sidebar.resize}
          aria-valuenow={width}
          aria-valuemin={SIDEBAR_MIN_WIDTH}
          aria-valuemax={SIDEBAR_MAX_WIDTH}
          tabIndex={0}
          onMouseDown={handleResizeMouseDown}
          onKeyDown={handleResizeKeyDown}
          className={cn(
            'absolute top-0 -right-px h-full w-1 cursor-col-resize outline-none transition-colors',
            'hover:bg-sidebar-ring/40 focus-visible:bg-sidebar-ring',
            isDragging && 'bg-sidebar-ring/60',
          )}
        />
      )}
    </aside>
  );
}

/* ── Mobile: top bar + sheet ──────────────────────────────────────── */

export function MobileSidebar(data: SidebarDataProps) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [newSearchOpen, setNewSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border bg-sidebar/95 px-2 backdrop-blur md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          aria-label={t.sidebar.openMenu}
          aria-expanded={open}
          className="rounded-lg"
        >
          <HugeiconsIcon icon={Menu01Icon} size={20} />
        </Button>
        <Link
          href="/"
          aria-label={t.sidebar.home}
          className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          <ApplyLogo className="h-5 w-auto" />
        </Link>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-[86vw] max-w-80 gap-0 bg-sidebar p-0 text-sidebar-foreground"
        >
          <SheetTitle className="sr-only">{t.sidebar.navLabel}</SheetTitle>
          <div className="flex h-14 shrink-0 items-center pl-4">
            <ApplyLogo className="h-5 w-auto" />
          </div>
          <SidebarBody
            {...data}
            collapsed={false}
            onNavigate={() => setOpen(false)}
            onNewSearch={() => {
              setOpen(false);
              setNewSearchOpen(true);
            }}
          />
        </SheetContent>
      </Sheet>

      <NewSearchDialog
        open={newSearchOpen}
        onOpenChange={setNewSearchOpen}
        plan={data.plan}
        searchCount={data.searches.length}
      />
    </>
  );
}
