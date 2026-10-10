export default function CohortDetailLoading() {
  return (
    <div className="w-full min-h-screen bg-background animate-in fade-in duration-200">
      {/* Breadcrumb strip */}
      <div className="w-full border-b border-border/80 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="h-4 w-36 rounded bg-surface-raised animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Info (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="p-8 sm:p-10 rounded-3xl bg-surface border border-border shadow-xs space-y-6">
              <div className="space-y-3">
                <div className="h-6 w-32 rounded-full bg-amber/15 animate-pulse" />
                <div className="h-9 w-3/4 rounded-xl bg-surface-raised animate-pulse" />
                <div className="h-4 w-full rounded bg-surface-raised/80 animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-surface-raised/60 animate-pulse" />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-7 w-20 rounded-md bg-surface-raised animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Syllabus / Sessions skeleton */}
            <div className="p-8 rounded-3xl bg-surface border border-border shadow-xs space-y-4">
              <div className="h-6 w-44 rounded bg-surface-raised animate-pulse" />
              <div className="space-y-3 pt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-surface-raised border border-border/60 flex items-center justify-between"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-48 rounded bg-surface-raised animate-pulse" />
                      <div className="h-3 w-32 rounded bg-surface-raised/60 animate-pulse" />
                    </div>
                    <div className="h-6 w-20 rounded-full bg-surface-raised animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Enrollment Card (Right 4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-xs space-y-6">
              <div className="space-y-2 border-b border-border/80 pb-4">
                <div className="h-3.5 w-24 rounded bg-amber/15 animate-pulse" />
                <div className="h-8 w-32 rounded-xl bg-surface-raised animate-pulse" />
                <div className="h-3 w-40 rounded bg-surface-raised/60 animate-pulse" />
              </div>

              <div className="space-y-3">
                <div className="h-11 w-full rounded-xl bg-amber/20 animate-pulse" />
              </div>

              <div className="space-y-2.5 pt-2 border-t border-border/60">
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
