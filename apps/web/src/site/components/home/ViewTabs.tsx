'use client';

import { useId, useRef, useState } from 'react';
import { cn } from '@/site/lib/cn';

export type ViewTab = { key: string; label: string; caption: string; icon: React.ReactNode };

/**
 * Tabs over server-rendered panels (WAI-ARIA tabs: arrows, Home and End move and select). Without JavaScript the
 * first panel shows and the tabs stay as labels.
 */
export function ViewTabs({ tabs, panels, label }: { tabs: ViewTab[]; panels: React.ReactNode[]; label: string }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number) => {
    const n = (i + tabs.length) % tabs.length;
    setActive(n);
    refs.current[n]?.focus();
  };

  return (
    <>
      <div
        role="tablist"
        aria-label={label}
        className="mx-auto mt-9 inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-stone-950/[0.07] bg-white p-1"
        onKeyDown={(e) => {
          const map: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: tabs.length - 1 };
          if (e.key in map) {
            e.preventDefault();
            select(map[e.key]);
          }
        }}
      >
        {tabs.map((t, i) => {
          const on = i === active;
          return (
            <button
              key={t.key}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={on}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                'inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3 text-[14px] transition-colors sm:gap-2 sm:px-4 sm:text-[15px]',
                on ? 'bg-stone-950 text-white' : 'text-stone-700 hover:bg-stone-100',
              )}
            >
              {t.icon}
              {t.label}
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="mt-4 text-[15px] text-stone-600">
        {tabs[active].caption}
      </p>
      <div className="relative mt-10">
        {panels.map((panel, i) => (
          <div key={tabs[i].key} id={`${id}-panel-${i}`} role="tabpanel" aria-labelledby={`${id}-tab-${i}`} hidden={i !== active} className="site-fade-in">
            {panel}
          </div>
        ))}
      </div>
    </>
  );
}
