'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { cn } from '@/site/lib/cn';

export type DesktopNavItem = { key: string; label: string; href: string; panel?: React.ReactNode; wide?: boolean };

const noop = () => () => {};
const FOCUSABLE = 'a[href], button:not([disabled])';

/**
 * Header navigation with disclosure menus (Product mega menu, Resources), hand-written to stay light (no menu library
 * in the first-load JavaScript). Opens on hover (small delays), click, Enter, Space or ArrowDown; Escape closes and
 * returns focus to the trigger; ArrowUp/ArrowDown move through a panel, ArrowLeft/ArrowRight across the top items;
 * leaving the item (pointer or focus) closes it. Panels are server-rendered: before hydration or without JavaScript,
 * CSS opens them on hover and focus (site.css, `.site-nav`), so every link stays reachable.
 */
export function DesktopNav({ items, label }: { items: DesktopNavItem[]; label: string }) {
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const [open, setOpen] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const root = useRef<HTMLElement>(null);

  const schedule = useCallback((next: string | null, delay: number) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), delay);
  }, []);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const panelLinks = (key: string) => Array.from(root.current?.querySelectorAll<HTMLElement>(`#nav-panel-${key} ${FOCUSABLE.split(', ').join(`, #nav-panel-${key} `)}`) ?? []);
  const topItems = () => Array.from(root.current?.querySelectorAll<HTMLElement>('[data-nav-top]') ?? []);
  const focusFirst = (key: string) => requestAnimationFrame(() => panelLinks(key)[0]?.focus());

  const moveTop = (current: HTMLElement, dir: 1 | -1) => {
    const list = topItems();
    const i = list.indexOf(current);
    list[(i + dir + list.length) % list.length]?.focus();
  };

  return (
    <nav ref={root} aria-label={label} className="site-nav hidden md:block" data-ready={hydrated ? '' : undefined}>
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const isOpen = open === item.key;
          if (!item.panel) {
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  data-nav-top
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                      e.preventDefault();
                      moveTop(e.currentTarget, e.key === 'ArrowRight' ? 1 : -1);
                    }
                  }}
                  className="site-nav-trigger"
                >
                  {item.label}
                </Link>
              </li>
            );
          }
          return (
            <li
              key={item.key}
              className={cn('site-nav-item', !item.wide && 'relative')}
              onPointerEnter={(e) => e.pointerType === 'mouse' && schedule(item.key, open ? 0 : 80)}
              onPointerLeave={(e) => e.pointerType === 'mouse' && schedule(null, 160)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen((o) => (o === item.key ? null : o));
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape' && isOpen) {
                  e.preventDefault();
                  setOpen(null);
                  e.currentTarget.querySelector<HTMLElement>('[data-nav-trigger]')?.focus();
                }
              }}
            >
              <button
                type="button"
                data-nav-top
                data-nav-trigger={item.key}
                aria-expanded={isOpen}
                aria-controls={`nav-panel-${item.key}`}
                className="site-nav-trigger"
                onClick={() => {
                  if (timer.current) clearTimeout(timer.current);
                  setOpen(isOpen ? null : item.key);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setOpen(item.key);
                    focusFirst(item.key);
                  } else if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (timer.current) clearTimeout(timer.current);
                    setOpen(item.key);
                    focusFirst(item.key);
                  } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    setOpen(null);
                    moveTop(e.currentTarget, e.key === 'ArrowRight' ? 1 : -1);
                  }
                }}
              >
                {item.label}
                <svg aria-hidden width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="site-nav-chevron">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div
                id={`nav-panel-${item.key}`}
                data-nav-panel={item.key}
                data-open={isOpen ? '' : undefined}
                className={cn('site-nav-panel', item.wide ? 'site-nav-panel-wide' : 'site-nav-panel-narrow')}
                onClick={(e) => (e.target as HTMLElement).closest('a') && setOpen(null)}
                onKeyDown={(e) => {
                  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
                  const links = panelLinks(item.key);
                  const i = links.indexOf(document.activeElement as HTMLElement);
                  e.preventDefault();
                  const next =
                    e.key === 'Home' ? 0 : e.key === 'End' ? links.length - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
                  links[next]?.focus();
                }}
              >
                {item.panel}
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
