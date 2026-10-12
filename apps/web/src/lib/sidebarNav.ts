/**
 * Pure helpers for the app sidebar (no React, no Next imports) so they can be
 * unit-tested with `node --test`.
 */

export const SIDEBAR_COLLAPSED_WIDTH = 56;
export const SIDEBAR_DEFAULT_WIDTH = 248;
export const SIDEBAR_MIN_WIDTH = 200;
export const SIDEBAR_MAX_WIDTH = 360;
/** Step of one arrow key press on the resize handle. */
export const SIDEBAR_RESIZE_STEP = 16;

/**
 * Whether `href` is the current page. `exact` matches only the same path
 * (Home, a single search profile); otherwise nested pages count too
 * (`/applications/acme-123` keeps Applications active).
 */
export function isNavActive(pathname: string, href: string, exact = false): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (path === href) return true;
  if (exact || href === '/') return false;
  return path.startsWith(href + '/');
}

/** A stored width when it is valid, else the default. */
export function parseSidebarWidth(raw: string | null | undefined): number {
  const width = raw ? parseInt(raw, 10) : NaN;
  return width >= SIDEBAR_MIN_WIDTH && width <= SIDEBAR_MAX_WIDTH ? width : SIDEBAR_DEFAULT_WIDTH;
}

/** Keeps a width inside the allowed range. */
export function clampSidebarWidth(width: number): number {
  return Math.min(Math.max(Math.round(width), SIDEBAR_MIN_WIDTH), SIDEBAR_MAX_WIDTH);
}

/** Applications still in progress: anything not accepted or rejected yet. */
export function countActiveApplications(applications: { status: string }[]): number {
  return applications.filter((a) => a.status !== 'accepted' && a.status !== 'rejected').length;
}

/** Interviews not completed yet. */
export function countUpcomingInterviews(interviews: { completedAt: string | null }[]): number {
  return interviews.filter((i) => !i.completedAt).length;
}

/** Badge text for a count: hidden at 0, capped at 99+. */
export function formatNavCount(count: number): string | null {
  if (count <= 0) return null;
  return count > 99 ? '99+' : String(count);
}

/** The Cmd+B / Ctrl+B shortcut that toggles the sidebar, ignored while typing. */
export function isSidebarShortcut(event: {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  targetIsEditable: boolean;
}): boolean {
  if (event.targetIsEditable || event.altKey || event.shiftKey) return false;
  return event.key.toLowerCase() === 'b' && (event.metaKey || event.ctrlKey);
}
