import { PROCESS, STEPS, type InterviewStep } from './data';
import { AppWindow, CompanyMark, Icon, PageHeader } from './parts';
import { cn } from '@/site/lib/cn';

export type InterviewState = { step: number; checked: string[] };

/** Prep items already ticked: every item of past rounds, the first one of the next round. */
export const INTERVIEW_INITIAL: InterviewState = {
  step: STEPS.findIndex((s) => s.state === 'next'),
  checked: STEPS.flatMap((s) => (s.state === 'done' ? s.prep.map((_, i) => `${s.id}-${i}`) : s.state === 'next' ? [`${s.id}-0`] : [])),
};

type Handlers = {
  onStep?: (i: number) => void;
  onStepKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onCheck?: (key: string) => void;
};

const STATE_LABEL: Record<InterviewStep['state'], string> = { done: 'Done', next: 'Next', later: 'Later' };

/** One interview process, as a stepper (ARIA tabs): each round keeps its date, people, prep notes and questions. */
export function InterviewScreen({ state, onStep, onStepKeyDown, onCheck }: { state: InterviewState } & Handlers) {
  const step = STEPS[state.step];
  return (
    <AppWindow active="interviews" rail>
      <PageHeader title="Interviews">
        <span className="ml-auto inline-flex items-center gap-2 text-xs text-stone-500">
          <CompanyMark company={PROCESS.company} className="size-6 rounded-md text-[11px]" />
          <span className="truncate">
            <span className="font-medium text-stone-950">{PROCESS.company.name}</span> · {PROCESS.title}
          </span>
        </span>
      </PageHeader>
      <div className="flex flex-col gap-4 p-3 sm:p-5">
        <div role="tablist" aria-label="Interview rounds" className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {STEPS.map((s, i) => {
            const on = i === state.step;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                id={`interview-tab-${s.id}`}
                aria-selected={on}
                aria-controls="interview-panel"
                tabIndex={on ? 0 : -1}
                onClick={onStep ? () => onStep(i) : undefined}
                onKeyDown={onStepKeyDown}
                className={cn(
                  'group flex min-w-0 flex-col items-center gap-2 rounded-xl border p-2 text-left transition-colors sm:items-start sm:p-3',
                  on ? 'border-stone-950 bg-white' : 'border-stone-200 bg-stone-50 hover:border-stone-400',
                )}
              >
                <span className="flex w-full items-center gap-2">
                  <span
                    aria-hidden
                    className={cn(
                      'flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
                      s.state === 'done' && 'bg-green-100 text-green-700',
                      s.state === 'next' && 'bg-brand-100 text-stone-950 ring-2 ring-brand-300',
                      s.state === 'later' && 'border border-stone-300 text-stone-500',
                    )}
                  >
                    {s.state === 'done' ? <Icon name="tick" size={12} /> : i + 1}
                  </span>
                  <span className="sr-only">{STATE_LABEL[s.state]}, </span>
                </span>
                <span className="sr-only sm:not-sr-only sm:line-clamp-2 sm:min-h-10 sm:w-full sm:text-sm sm:leading-5 sm:font-medium sm:text-stone-950">{s.stage}</span>
              </button>
            );
          })}
        </div>

        <div role="tabpanel" id="interview-panel" aria-labelledby={`interview-tab-${step.id}`} key={step.id} className="site-fade-in grid h-[480px] content-start gap-4 overflow-hidden md:h-[316px] md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="flex min-w-0 flex-col gap-3">
            <p className="text-base font-semibold tracking-tight text-stone-950">
              {step.stage}
              <span className="ml-2 text-xs font-medium text-stone-500">{STATE_LABEL[step.state]}</span>
            </p>
            <p className="flex items-center gap-2 text-sm font-medium text-stone-950">
              <Icon name="calendar" size={15} />
              {step.when}
            </p>
            <p className="flex items-center gap-2 text-sm text-stone-600">
              <Icon name="clock" size={15} />
              {step.format}
            </p>
            <ul className="flex list-none flex-col gap-1.5">
              {step.people.map((p) => (
                <li key={p.name} className="flex items-center gap-2.5 text-sm">
                  <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-semibold text-stone-700">
                    {p.name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-stone-950">{p.name}</span>
                    <span className="block truncate text-xs text-stone-500">{p.role}</span>
                  </span>
                </li>
              ))}
            </ul>
            {step.debrief && <p className="mt-auto hidden rounded-xl bg-stone-50 p-3 text-[13px] leading-[1.5] text-stone-700 md:block">{step.debrief}</p>}
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.06em] text-stone-500">Prep notes</p>
              <ul className="mt-2 flex list-none flex-col gap-1">
                {step.prep.map((item, i) => {
                  const key = `${step.id}-${i}`;
                  const on = state.checked.includes(key);
                  return (
                    <li key={key}>
                      <button type="button" role="checkbox" aria-checked={on} onClick={onCheck ? () => onCheck(key) : undefined} className="flex min-h-8 w-full items-center gap-2.5 rounded-lg px-1.5 text-left text-sm hover:bg-stone-50">
                        <span aria-hidden className={cn('flex size-4 shrink-0 items-center justify-center rounded border', on ? 'border-stone-950 bg-stone-950 text-white' : 'border-stone-300 bg-white')}>
                          {on && <Icon name="tick" size={11} />}
                        </span>
                        <span className={cn('min-w-0', on ? 'text-stone-500 line-through decoration-stone-300' : 'text-stone-950')}>{item}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.06em] text-stone-500">Questions to ask</p>
              <ul className="mt-2 flex list-none flex-col gap-1.5">
                {step.questions.map((q) => (
                  <li key={q} className="rounded-lg border border-stone-200 px-2.5 py-1.5 text-sm text-stone-800">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-stone-200 pt-3">
          <button
            type="button"
            disabled={state.step === 0}
            onClick={onStep ? () => onStep(state.step - 1) : undefined}
            className="inline-flex h-8 items-center gap-1 rounded-full border border-stone-200 px-3 text-xs font-medium text-stone-800 hover:border-stone-400 disabled:opacity-40"
          >
            <Icon name="left" size={14} />
            Previous round
          </button>
          <span className="text-xs tabular-nums text-stone-500">
            Round {state.step + 1} of {STEPS.length}
          </span>
          <button
            type="button"
            disabled={state.step === STEPS.length - 1}
            onClick={onStep ? () => onStep(state.step + 1) : undefined}
            className="inline-flex h-8 items-center gap-1 rounded-full border border-stone-200 px-3 text-xs font-medium text-stone-800 hover:border-stone-400 disabled:opacity-40"
          >
            Next round
            <Icon name="right" size={14} />
          </button>
        </div>
      </div>
    </AppWindow>
  );
}
