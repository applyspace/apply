import { CITIES, CONTRACTS, OFFERS, type City, type Contract, type DemoOffer } from './data';
import { AppWindow, CompanyMark, Icon, PageHeader } from './parts';
import { cn } from '@/site/lib/cn';

export type SearchState = { query: string; contracts: Contract[]; city: City | 'Anywhere'; remote: boolean; saved: string[] };

export const SEARCH_INITIAL: SearchState = { query: '', contracts: ['Permanent'], city: 'Paris', remote: false, saved: ['o2'] };

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function filterOffers(s: SearchState): DemoOffer[] {
  const q = fold(s.query.trim());
  return OFFERS.filter(
    (o) =>
      (!q || fold(`${o.title} ${o.company.name}`).includes(q)) &&
      (s.contracts.length === 0 || s.contracts.includes(o.contract)) &&
      (s.city === 'Anywhere' || o.city === s.city) &&
      (!s.remote || o.mode === 'Remote'),
  );
}

type Handlers = {
  onQuery?: (q: string) => void;
  onContract?: (c: Contract) => void;
  onCity?: (c: City | 'Anywhere') => void;
  onRemote?: () => void;
  onSave?: (id: string) => void;
  onReset?: () => void;
};

const chip = (on: boolean) =>
  cn(
    'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors',
    on ? 'border-transparent bg-stone-950 text-white' : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400',
  );

/** Job offers page (components/jobs): search field, filters and the result list, filtered live. */
export function SearchScreen({ state, ...h }: { state: SearchState } & Handlers) {
  const results = filterOffers(state);
  return (
    <AppWindow active="offers" rail>
      <PageHeader title="Job offers" count={`${results.length} ${results.length === 1 ? 'offer' : 'offers'}`}>
        <span className="ml-auto inline-flex h-7 items-center gap-1.5 rounded-full bg-brand-50 px-2.5 text-xs font-medium text-stone-950">
          <Icon name="search" size={12} />
          Product Designer, Paris
        </span>
      </PageHeader>
      <div className="flex flex-col gap-3 border-b border-stone-200 p-3 sm:p-4">
        <label className="flex h-10 items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 focus-within:border-stone-400">
          <Icon name="search" size={16} className="text-stone-500" />
          <span className="sr-only">Search offers by title or company</span>
          <input
            type="search"
            value={state.query}
            readOnly={!h.onQuery}
            onChange={h.onQuery ? (e) => h.onQuery?.(e.target.value) : undefined}
            placeholder="Title or company, e.g. design system"
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-stone-950 outline-none placeholder:text-stone-400"
          />
        </label>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <div role="group" aria-label="Contract" className="flex flex-wrap gap-1.5">
            {CONTRACTS.map((c) => (
              <button key={c} type="button" aria-pressed={state.contracts.includes(c)} onClick={h.onContract ? () => h.onContract?.(c) : undefined} className={chip(state.contracts.includes(c))}>
                {c}
              </button>
            ))}
          </div>
          <div role="group" aria-label="Location" className="flex flex-wrap gap-1.5">
            {([...CITIES, 'Anywhere'] as const).map((c) => (
              <button key={c} type="button" aria-pressed={state.city === c} onClick={h.onCity ? () => h.onCity?.(c) : undefined} className={chip(state.city === c)}>
                {c !== 'Anywhere' && <Icon name="pin" size={12} />}
                {c}
              </button>
            ))}
          </div>
          <button type="button" role="switch" aria-checked={state.remote} onClick={h.onRemote} className="inline-flex h-8 items-center gap-2 rounded-full px-1.5 text-xs font-medium text-stone-700">
            <span aria-hidden className={cn('relative h-5 w-9 rounded-full transition-colors', state.remote ? 'bg-stone-950' : 'bg-stone-200')}>
              <span className={cn('absolute top-0.5 size-4 rounded-full bg-white transition-[left] duration-150', state.remote ? 'left-[18px]' : 'left-0.5')} />
            </span>
            Remote only
          </button>
        </div>
      </div>

      <div className="site-scroll-quiet h-[300px] overflow-y-auto sm:h-[336px]">
        {results.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-sm text-stone-600">No offer matches these filters.</p>
            <button type="button" onClick={h.onReset} className="inline-flex h-8 items-center rounded-full border border-stone-200 px-3 text-xs font-medium text-stone-800 hover:border-stone-400">
              Reset filters
            </button>
          </div>
        ) : (
          <ul className="list-none divide-y divide-stone-200">
            {results.map((o) => {
              const saved = state.saved.includes(o.id);
              return (
                <li key={o.id} className="flex items-center gap-3 px-3 py-3 sm:px-4">
                  <CompanyMark company={o.company} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-stone-950">{o.title}</p>
                    <p className="truncate text-[13px] text-stone-500">
                      {o.company.name} · {o.city} · {o.mode}
                    </p>
                    <p className="mt-1.5 hidden flex-wrap gap-1.5 sm:flex">
                      <span className="inline-flex h-6 items-center rounded-full bg-stone-100 px-2 text-xs text-stone-700">{o.contract}</span>
                      <span className="inline-flex h-6 items-center rounded-full bg-stone-100 px-2 text-xs text-stone-700">{o.salary}</span>
                      <span className="inline-flex h-6 items-center px-1 text-xs text-stone-500">{o.posted}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-pressed={saved}
                    aria-label={`${saved ? 'Saved' : 'Save'}: ${o.title}, ${o.company.name}`}
                    onClick={h.onSave ? () => h.onSave?.(o.id) : undefined}
                    className={cn(
                      'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium transition-colors sm:px-3',
                      saved ? 'border-transparent bg-brand-100 text-stone-950' : 'border-stone-200 bg-white text-stone-800 hover:border-stone-400',
                    )}
                  >
                    <Icon name={saved ? 'tick' : 'bookmark'} size={14} />
                    <span aria-hidden>{saved ? 'Saved' : 'Save'}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <p aria-live="polite" className="border-t border-stone-200 px-4 py-2.5 text-xs text-stone-500">
        {results.length} {results.length === 1 ? 'offer' : 'offers'} · {state.saved.length} saved to your applications
      </p>
    </AppWindow>
  );
}
