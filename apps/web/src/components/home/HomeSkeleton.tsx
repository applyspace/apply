/** Placeholder of the Home dashboard while its data streams in (same grid, no layout shift). */
export function HomeSkeleton() {
  return (
    <div
      className="mx-auto flex w-full max-w-[72rem] flex-col gap-6 px-4 py-8 sm:px-8 md:px-12 md:py-12"
      aria-busy="true"
    >
      <div>
        <div className="h-11 w-64 animate-pulse rounded-xl bg-muted sm:h-12" />
        <div className="mt-3 h-4 w-72 max-w-full animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-[7.5rem] animate-pulse rounded-2xl bg-muted sm:h-[8.5rem]" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
