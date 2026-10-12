import Link from 'next/link';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

/** The shared card surface of the Home page: card background, hairline border, no shadow. */
export function HomeCard({
  className,
  children,
  'aria-labelledby': labelledBy,
}: {
  className?: string;
  children: React.ReactNode;
  'aria-labelledby'?: string;
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn('flex min-w-0 flex-col rounded-2xl border bg-card p-5 text-card-foreground', className)}
    >
      {children}
    </section>
  );
}

/** Card title row: icon, label, optional count, and an optional "See all" link on the right. */
export function HomeCardHeader({
  id,
  icon,
  title,
  count,
  href,
  linkLabel,
}: {
  id: string;
  icon: IconSvgElement;
  title: string;
  count?: number;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-muted-foreground">
        <HugeiconsIcon icon={icon} size={16} aria-hidden="true" />
        <h2 id={id} className="truncate">
          {title}
        </h2>
        {count !== undefined && count > 0 && (
          <span className="rounded-full bg-muted px-1.5 text-xs tabular-nums text-muted-foreground">{count}</span>
        )}
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {linkLabel}
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

/** Quiet text shown in a card that has nothing to list. */
export function HomeCardEmpty({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 rounded-xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}
