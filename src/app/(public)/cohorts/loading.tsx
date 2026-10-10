export default function CohortsLoading() {
  return (
    <div className="w-full min-h-screen bg-background py-10 sm:py-16 animate-in fade-in duration-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="h-5 w-32 rounded-full bg-amber/15 animate-pulse" />
          <div className="h-10 w-80 rounded-xl bg-surface-raised animate-pulse" />
          <div className="h-4 w-96 rounded bg-surface-raised/70 animate-pulse" />
        </div>

        {/* Filter bar */}
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="h-10 w-full sm:w-80 rounded-xl bg-surface-raised animate-pulse" />
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 w-20 rounded-lg bg-surface-raised animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Cohort Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-surface border border-border shadow-xs space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="size-12 rounded-2xl bg-amber/15 animate-pulse" />
                  <div className="h-5 w-24 rounded-full bg-surface-raised animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-5 w-48 rounded bg-surface-raised animate-pulse" />
                  <div className="h-3.5 w-full rounded bg-surface-raised/80 animate-pulse" />
                  <div className="h-3.5 w-3/4 rounded bg-surface-raised/60 animate-pulse" />
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[1, 2, 3].map((t) => (
                    <div
                      key={t}
                      className="h-6 w-16 rounded-md bg-surface-raised animate-pulse"
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border/70 flex items-center justify-between">
                <div className="h-5 w-20 rounded bg-surface-raised animate-pulse" />
                <div className="h-9 w-28 rounded-xl bg-amber/20 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
