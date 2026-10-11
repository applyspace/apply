import { ViewTabs } from './ViewTabs';
import { FeatureIcon } from '@/site/components/ui/icons';
import { ViewVisual } from '@/site/components/visuals/views';
import type { HomeContent } from '@/site/content/types';
import { hasHomeMap } from '@/site/lib/homeMap';

/**
 * "Your applications, your way": Board, Table, Timeline and Map as Linear-like product images that fade into the page.
 * The Map view uses the real map image (`/home-map.png`) when GEOAPIFY_API_KEY is set, else its SVG map.
 */
export function Views({ views }: { views: HomeContent['views'] }) {
  const mapSrc = hasHomeMap() ? '/home-map.png' : undefined;
  return (
    <section aria-labelledby="views-title" className="overflow-hidden px-4 pb-6 pt-14 sm:px-6 sm:pb-8 sm:pt-20">
      <div className="mx-auto max-w-[1240px] text-center">
        <h2 id="views-title" className="font-display text-balance text-[clamp(40px,5vw,64px)] leading-none">
          {views.title}
        </h2>
        <p className="mx-auto mt-5 max-w-[560px] text-pretty text-lg leading-[1.45] text-stone-600">{views.intro}</p>
        <ViewTabs
          label={views.label}
          tabs={views.items.map((v) => ({ key: v.key, label: v.label, caption: v.caption, icon: <FeatureIcon name={v.key} size={18} /> }))}
          panels={views.items.map((v) => (
            // Below 760px the window keeps a readable size and is cropped on the right, like a product shot.
            <div key={v.key} className="-mr-4 sm:mr-0">
              <div className="w-[max(100%,760px)]">
                <ViewVisual view={v.key} mapSrc={mapSrc} />
              </div>
            </div>
          ))}
        />
      </div>
    </section>
  );
}
