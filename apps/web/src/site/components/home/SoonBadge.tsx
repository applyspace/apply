import { Badge } from '@/components/ui/badge';
import { cn } from '@/site/lib/cn';

/** "Soon" pill for planned features (shadcn/ui Badge). */
export function SoonBadge({ label, className }: { label: string; className?: string }) {
  return (
    <Badge variant="secondary" className={cn('h-6 rounded-full bg-[image:var(--tile-lilac)] px-2.5 text-xs font-semibold text-stone-950', className)}>
      {label}
    </Badge>
  );
}
