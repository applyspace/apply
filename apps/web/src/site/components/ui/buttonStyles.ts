import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/site/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

const SHADCN_VARIANT = { primary: 'default', secondary: 'outline', ghost: 'ghost' } as const;

/**
 * Website buttons on top of the shadcn/ui Button (components/ui/button, tokens in site.css), art direction v3:
 * aubergine pill (primary), outlined pill (secondary), Geist SemiBold. Returns classes for links and buttons.
 */
export function buttonStyles(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(
    buttonVariants({ variant: SHADCN_VARIANT[variant] }),
    'gap-2 rounded-full font-semibold',
    size === 'md' ? 'h-11 px-5 text-[15px]' : 'h-[50px] px-6 text-base',
    variant === 'primary' && 'hover:bg-stone-800',
    variant === 'secondary' && 'border-stone-950/[0.18] bg-white/70 hover:bg-white',
    className,
  );
}
