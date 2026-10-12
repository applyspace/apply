'use client';

import { useCallback, useEffect } from 'react';
import { MobileSidebar, Sidebar } from './Sidebar';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { SettingsModalProvider } from '@/components/settings/SettingsModalProvider';
import { analytics } from '@/lib/analytics';
import { useLocalStorageItem } from '@/lib/useLocalStorage';
import { isSidebarShortcut, parseSidebarWidth } from '@/lib/sidebarNav';
import type {
  ApplicationWithRelations,
  InterviewWithRelations,
} from '@apply/core/applications';
import type { SearchWithCount } from '@apply/core/searches';
import type { AccountPlan } from '@apply/core/candidate-profile';

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

/**
 * Signed-in frame: the sidebar (a resizable, collapsible rail from `md` up, a
 * top bar with a sheet below) and the page. Cmd/Ctrl+B toggles the rail.
 */
export function AppShell({
  children,
  searches,
  applications,
  interviews,
  firstName,
  lastName,
  platformStatuses,
  plan,
}: {
  children: React.ReactNode;
  searches: SearchWithCount[];
  applications: ApplicationWithRelations[];
  interviews: InterviewWithRelations[];
  /** Account name from settings (empty strings when not set). */
  firstName: string;
  lastName: string;
  /** Job board connection status per source, for Settings > Connectors. */
  platformStatuses: Record<string, boolean>;
  /** Account plan, or null when nobody is signed in (demo, desktop). */
  plan: AccountPlan | null;
}) {
  useEffect(() => {
    analytics.setPlan(plan);
  }, [plan]);

  const [savedCollapsed, saveCollapsed] = useLocalStorageItem('apply-sidebar-collapsed');
  const [savedWidth, saveWidth] = useLocalStorageItem('apply-sidebar-width');

  const collapsed = savedCollapsed === 'true';
  const sidebarWidth = parseSidebarWidth(savedWidth);

  const toggle = useCallback(() => saveCollapsed(String(!collapsed)), [collapsed, saveCollapsed]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const shortcut = isSidebarShortcut({
        key: e.key,
        metaKey: e.metaKey,
        ctrlKey: e.ctrlKey,
        altKey: e.altKey,
        shiftKey: e.shiftKey,
        targetIsEditable: isEditable(e.target),
      });
      if (!shortcut) return;
      e.preventDefault();
      toggle();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggle]);

  const data = { searches, applications, interviews, firstName, lastName, plan };

  return (
    <SettingsModalProvider>
      <div className="flex h-dvh flex-col overflow-hidden bg-background md:flex-row">
        <Sidebar
          {...data}
          collapsed={collapsed}
          onToggle={toggle}
          width={sidebarWidth}
          onWidthChange={(w) => saveWidth(String(w))}
        />
        <MobileSidebar {...data} />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
      <SettingsModal firstName={firstName} lastName={lastName} statuses={platformStatuses} />
    </SettingsModalProvider>
  );
}
