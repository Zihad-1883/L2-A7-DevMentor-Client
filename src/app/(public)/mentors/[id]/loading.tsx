export default function MentorDetailLoading() {
  return (
    <div className="w-full min-h-screen bg-background animate-in fade-in duration-200">
      {/* Breadcrumb strip skeleton */}
      <div className="w-full border-b border-border/80 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="h-4 w-36 rounded bg-surface-raised animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Profile Info (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Mentor Header Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-surface border border-border shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="size-20 rounded-2xl bg-amber/15 border-2 border-amber/20 shrink-0 animate-pulse" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-48 rounded-xl bg-surface-raised animate-pulse" />
                      <div className="h-5 w-16 rounded-full bg-amber/15 animate-pulse" />
                    </div>
                    <div className="h-4 w-64 rounded bg-surface-raised/80 animate-pulse" />
                  </div>
                </div>

                <div className="h-7 w-28 rounded-full bg-surface-raised animate-pulse" />
              </div>

              {/* Bio lines */}
              <div className="space-y-2.5 pt-2 border-t border-border/60">
                <div className="h-4 w-full rounded bg-surface-raised/80 animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-surface-raised/70 animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-surface-raised/60 animate-pulse" />
              </div>

              {/* Tech Stack Tags Skeleton */}
              <div className="space-y-2 pt-2">
                <div className="h-3 w-24 rounded bg-surface-raised animate-pulse" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="h-7 w-20 rounded-md bg-surface-raised animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* What you get card */}
            <div className="p-8 rounded-3xl bg-surface border border-border shadow-xs space-y-4">
              <div className="h-5 w-48 rounded bg-surface-raised animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-surface-raised border border-border/60 flex items-start gap-3"
                  >
                    <div className="size-5 rounded-full bg-amber/20 shrink-0 mt-0.5 animate-pulse" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3.5 w-28 rounded bg-surface-raised animate-pulse" />
                      <div className="h-3 w-40 rounded bg-surface-raised/60 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Action Card (Right 4 Cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-xs space-y-6">
              <div className="space-y-2 border-b border-border/80 pb-4">
                <div className="h-3.5 w-24 rounded bg-amber/15 animate-pulse" />
                <div className="h-8 w-32 rounded-xl bg-surface-raised animate-pulse" />
                <div className="h-3 w-44 rounded bg-surface-raised/60 animate-pulse" />
              </div>

              <div className="space-y-3">
                <div className="h-11 w-full rounded-xl bg-amber/20 animate-pulse" />
                <div className="h-10 w-full rounded-xl bg-surface-raised animate-pulse" />
              </div>

              <div className="space-y-2 pt-2 border-t border-border/60">
                <div className="h-3 w-full rounded bg-surface-raised/60 animate-pulse" />
                <div className="h-3 w-4/5 rounded bg-surface-raised/50 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
