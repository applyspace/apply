import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// The site's own tokens in site.css (--text-*, --radius-*, --container-*) are classes too (text-body, rounded-card,
// max-w-page...). tailwind-merge does not know them unless they are listed here: it would take `text-body` for a text
// colour and drop it next to `text-stone-950`, and keep `rounded-card` next to `rounded-full`. When you add one of
// those tokens, add its name here too (lib/cn.test.ts fails until you do). Colours and spacing need nothing.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['display-xl', 'display-lg', 'display-md', 'display-closing', 'card-title', 'body'],
      radius: ['tile', 'card', 'panel'],
      container: ['page'],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
