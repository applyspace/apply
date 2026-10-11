'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buttonStyles } from '@/site/components/ui/buttonStyles';
import { cn } from '@/site/lib/cn';

type MobileEntry = { title: string; href?: string; soon?: boolean };
type MobileNavItem = {
  key: string;
  label: string;
  href: string;
  groups?: { title?: string; items: MobileEntry[] }[];
  footer?: { label: string; href: string };
};

const chevron = (
  <svg aria-hidden width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="transition-transform">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

/**
 * Menu for small screens: a disclosure panel under the header bar. Product and Resources are accordions with the
 * same groups as the desktop menus (text only, to keep the icon library out of this client component).
 */
export function MobileMenu({
  nav,
  signInHref,
  startHref,
  labels,
}: {
  nav: MobileNavItem[];
  signInHref: string;
  startHref: string;
  labels: { menu: string; close: string; signIn: string; start: string; nav: string; soon: string };
}) {
  // The menu is open for the path it was opened on, so navigating closes it without an effect.
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const [section, setSection] = useState<string | null>(null);
  const open = openOn === pathname;
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenOn(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="justify-self-end md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? labels.close : labels.menu}
        onClick={() => setOpenOn(open ? null : pathname)}
        className="flex size-10 items-center justify-center rounded-full text-stone-950 hover:bg-stone-100"
      >
        {/* Hugeicons Menu01 and Cancel01, inlined to keep the icon library out of the first-load JavaScript. */}
        <svg aria-hidden width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d={open ? 'M18 6L6 18M18 18L6 6' : 'M4 7H20M4 17H20'} />
        </svg>
      </button>
      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-[calc(100%+8px)] max-h-[calc(100dvh-96px)] overflow-y-auto rounded-[20px] border border-stone-950/[0.07] bg-white px-4 pb-4 pt-1 shadow-[0_24px_48px_-28px_rgb(31_13_44/0.35)]"
        >
          <nav aria-label={labels.nav}>
            <ul className="flex flex-col">
              {nav.map((item) => {
                if (!item.groups) {
                  return (
                    <li key={item.key} className="border-b border-stone-100">
                      <Link href={item.href} className="flex min-h-12 items-center text-base">
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                const expanded = section === item.key;
                return (
                  <li key={item.key} className="border-b border-stone-100">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`mobile-${item.key}`}
                      onClick={() => setSection(expanded ? null : item.key)}
                      className="flex min-h-12 w-full items-center justify-between text-left text-base [&[aria-expanded=true]>svg]:rotate-180"
                    >
                      {item.label}
                      {chevron}
                    </button>
                    <div id={`mobile-${item.key}`} hidden={!expanded} className="pb-3">
                      {item.groups.map((group, gi) => (
                        <div key={group.title ?? gi} className={cn(gi > 0 && 'mt-3')}>
                          {group.title && <p className="pb-1 text-[12px] text-stone-500">{group.title}</p>}
                          <ul>
                            {group.items.map((entry) => (
                              <li key={entry.title}>
                                {entry.href ? (
                                  <Link href={entry.href} className="flex min-h-10 items-center gap-2 text-[15px] text-stone-800">
                                    {entry.title}
                                    {entry.soon && <span className="rounded-full bg-[image:var(--tile-lilac)] px-2 text-[11px] leading-5 text-stone-950">{labels.soon}</span>}
                                  </Link>
                                ) : (
                                  <span className="flex min-h-10 items-center gap-2 text-[15px] text-stone-500">
                                    {entry.title}
                                    <span className="rounded-full bg-[image:var(--tile-lilac)] px-2 text-[11px] leading-5 text-stone-950">{labels.soon}</span>
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {item.footer && (
                        <Link href={item.footer.href} className="mt-2 inline-flex min-h-10 items-center text-[15px] underline decoration-stone-300 underline-offset-4">
                          {item.footer.label}
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <a href={startHref} className={buttonStyles('primary', 'lg', 'w-full')}>
              {labels.start}
            </a>
            <a href={signInHref} className={buttonStyles('ghost', 'lg', 'w-full')}>
              {labels.signIn}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
