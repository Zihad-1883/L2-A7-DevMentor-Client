export default function AdminLoadingSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header skeleton */}
      <div className="space-y-2 pb-6 border-b border-border/80 animate-pulse">
        <div className="h-4 w-28 rounded-md bg-amber/15" />
        <div className="h-8 w-64 rounded-xl bg-surface-raised" />
        <div className="h-3 w-96 rounded-md bg-surface-raised" />
      </div>

      {/* Metrics skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-surface border border-border/80 shadow-2xs space-y-3 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-surface-raised" />
              <div className="size-8 rounded-lg bg-surface-raised" />
            </div>
            <div className="h-7 w-20 rounded bg-surface-raised" />
          </div>
        ))}
      </div>

      {/* Table / Content card skeleton */}
      <div className="p-6 rounded-2xl bg-surface border border-border/80 space-y-4 animate-pulse">
        <div className="h-5 w-40 rounded bg-surface-raised" />
        <div className="h-10 w-full rounded-xl bg-surface-raised/60" />
        <div className="h-10 w-full rounded-xl bg-surface-raised/40" />
        <div className="h-10 w-full rounded-xl bg-surface-raised/20" />
      </div>
    </div>
  );
}
