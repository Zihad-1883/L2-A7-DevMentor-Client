export default function StudentSprintsLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div className="space-y-2">
          <div className="h-4 w-28 rounded bg-amber/15 animate-pulse" />
          <div className="h-8 w-56 rounded-xl bg-surface-raised animate-pulse" />
          <div className="h-3.5 w-72 rounded bg-surface-raised/70 animate-pulse" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-amber/20 animate-pulse" />
      </div>

      {/* Sprints List Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-6 rounded-3xl bg-surface border border-border shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5">
                  <div className="h-5 w-56 rounded-lg bg-surface-raised animate-pulse" />
                  <div className="h-5 w-20 rounded-full bg-surface-raised animate-pulse" />
                </div>
                <div className="h-3.5 w-80 rounded bg-surface-raised/70 animate-pulse" />
              </div>
              <div className="h-9 w-28 rounded-xl bg-surface-raised animate-pulse" />
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/60">
              {[1, 2, 3].map((tag) => (
                <div
                  key={tag}
                  className="h-6 w-16 rounded-md bg-surface-raised animate-pulse"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
