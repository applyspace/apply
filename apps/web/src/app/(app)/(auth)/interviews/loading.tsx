export default function InterviewsLoading() {
  return (
    <div className="flex h-full flex-col gap-5 px-4 py-6 sm:px-8 md:px-12 md:py-10" aria-busy="true">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
      <div className="h-8 w-full max-w-xl animate-pulse rounded-full bg-muted" />
      <div className="flex flex-col gap-2.5">
        <div className="h-5 w-24 animate-pulse rounded-md bg-muted" />
        <div className="flex flex-col divide-y overflow-hidden rounded-2xl border">
          {Array.from({ length: 5 }, (_, row) => (
            <div key={row} className="flex items-center gap-4 px-4 py-3">
              <div className="h-14 w-12 animate-pulse rounded-xl bg-muted" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
