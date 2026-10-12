'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  CircleArrowUp02Icon,
  Download04Icon,
  Globe02Icon,
  HelpCircleIcon,
  InformationCircleIcon,
  Logout01Icon,
  Settings01Icon,
  UnfoldMoreIcon,
} from '@hugeicons/core-free-icons';
import { useAuth, useLocale } from '@/components/providers/Providers';
import { useSettingsModal } from '@/components/settings/SettingsModalProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LOCALES, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { AccountPlan } from '@apply/core/candidate-profile';

function initialsOf(name: string): string {
  const parts = name.split(/[\s@.]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
}

/** Plan pill: neutral for FREE, brand color for PLUS. Nothing when the plan is unknown. */
export function PlanBadge({ plan, className }: { plan: AccountPlan | null; className?: string }) {
  const { t } = useLocale();
  if (!plan) return null;
  return (
    <span
      className={cn(
        'inline-flex h-4 shrink-0 items-center rounded px-1 text-[10px] leading-none font-semibold tracking-wide',
        plan === 'plus'
          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
          : 'bg-sidebar-accent text-muted-foreground ring-1 ring-sidebar-border ring-inset',
        className,
      )}
    >
      {plan === 'plus' ? t.sidebar.planPlus : t.sidebar.planFree}
    </span>
  );
}

interface UserMenuProps {
  collapsed: boolean;
  firstName: string;
  lastName: string;
  plan: AccountPlan | null;
  /** Called before an item opens another surface (closes the mobile sheet). */
  onNavigate?: () => void;
}

/** Sidebar footer: avatar, name and plan, opening the account menu. */
export function UserMenu({ collapsed, firstName, lastName, plan, onNavigate }: UserMenuProps) {
  const { user, signOut } = useAuth();
  const { t, locale, setLocale } = useLocale();
  const { openSettings } = useSettingsModal();

  // Account name first, then the sign-in provider's name, then email; "Guest" in demo mode.
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const displayName = fullName || user?.name || user?.email || t.sidebar.guest;
  const email = user?.email && user.email !== displayName ? user.email : null;

  const settings = (section: 'general' | 'billing') => {
    onNavigate?.();
    openSettings(section);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t.sidebar.account}
        className={cn(
          'flex w-full items-center rounded-lg text-left text-sm outline-none transition-colors',
          'hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring aria-expanded:bg-sidebar-accent',
          collapsed ? 'justify-center p-1.5' : 'gap-2.5 px-2 py-1.5',
        )}
      >
        <Avatar size="sm">
          <AvatarImage src={user?.image ?? ''} alt="" />
          <AvatarFallback className="text-[10px]">{initialsOf(displayName)}</AvatarFallback>
        </Avatar>
        {!collapsed && (
          <>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="flex items-center gap-1.5">
                <span className="truncate font-medium text-sidebar-foreground">{displayName}</span>
                <PlanBadge plan={plan} />
              </span>
              {email && <span className="truncate text-xs text-muted-foreground">{email}</span>}
            </span>
            <HugeiconsIcon icon={UnfoldMoreIcon} size={14} className="shrink-0 text-muted-foreground" />
          </>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={collapsed ? 'right' : 'top'}
        align={collapsed ? 'end' : 'start'}
        sideOffset={6}
        className="min-w-60"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2">
            <span className="truncate">{email ?? displayName}</span>
            <PlanBadge plan={plan} className="ml-auto" />
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => settings('general')}>
          <HugeiconsIcon icon={Settings01Icon} />
          {t.nav.settings}
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <HugeiconsIcon icon={Globe02Icon} />
            {t.menu.language}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={locale}
              onValueChange={(value) => setLocale(value as Locale)}
            >
              {LOCALES.map((l) => (
                <DropdownMenuRadioItem key={l.value} value={l.value}>
                  {l.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem render={<a href="#" />}>
          <HugeiconsIcon icon={HelpCircleIcon} />
          {t.sidebar.getHelp}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {plan === 'free' && (
          <DropdownMenuItem onClick={() => settings('billing')}>
            <HugeiconsIcon icon={CircleArrowUp02Icon} />
            {t.sidebar.upgrade}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem render={<a href="#" />}>
          <HugeiconsIcon icon={Download04Icon} />
          {t.sidebar.getApps}
        </DropdownMenuItem>
        <DropdownMenuItem render={<a href="#" />}>
          <HugeiconsIcon icon={InformationCircleIcon} />
          {t.sidebar.learnMore}
        </DropdownMenuItem>

        {user && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <HugeiconsIcon icon={Logout01Icon} />
              {t.sidebar.logOut}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
