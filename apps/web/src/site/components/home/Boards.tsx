import { SoonBadge } from './SoonBadge';
import { brandIconUrl } from '@/lib/brandfetch';
import type { HomeContent } from '@/site/content/types';

/**
 * The job boards apply searches at once, with their logos (Brandfetch, same CDN and public client id as the app's
 * onboarding, `NEXT_PUBLIC_BRANDFETCH_CLIENT_ID`). No JavaScript: each logo is a CSS background over the board's first
 * letter, so a logo that fails to load leaves a clean letter tile; the name is always written next to it. Board
 * search is planned (Soon). Brand names appear only here, with the "Brands belong to their owners" note (founder
 * decision, 11 Oct 2026).
 */
export function Boards({ boards, note, soon }: { boards: HomeContent['boards']; note: string; soon: string }) {
  return (
    <section aria-labelledby="boards-title" className="px-4 pb-6 pt-16 sm:px-6 sm:pb-8 sm:pt-24">
      <div className="mx-auto max-w-[1240px] text-center">
        <SoonBadge label={soon} />
        <h2 id="boards-title" className="font-display mx-auto mt-4 max-w-[760px] text-balance text-[clamp(40px,5vw,64px)] leading-none">
          {boards.title}
        </h2>
        <p className="mx-auto mt-5 max-w-[620px] text-pretty text-lg leading-[1.45] text-stone-600">{boards.text}</p>
        <ul className="mx-auto mt-10 flex max-w-[1000px] flex-wrap justify-center gap-2.5 sm:gap-3">
          {boards.items.map((b) => (
            <li key={b.domain} className="flex h-14 items-center gap-3 rounded-full border border-stone-950/[0.07] bg-white pl-2.5 pr-5">
              <span aria-hidden className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-stone-100 text-sm text-stone-600">
                {b.name[0]}
                {/* Background image, not <img>: a logo that fails to load shows nothing, so the letter stays. */}
                <span className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${brandIconUrl(b.domain)})` }} />
              </span>
              <span className="whitespace-nowrap text-[15px] text-stone-950">{b.name}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-stone-500">{note}</p>
      </div>
    </section>
  );
}
