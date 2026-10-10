export default function StudentDashboardLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner Skeleton */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="h-4 w-28 rounded bg-amber/15 animate-pulse" />
          <div className="h-8 w-64 rounded-xl bg-surface-raised animate-pulse" />
          <div className="h-3.5 w-80 rounded bg-surface-raised/70 animate-pulse" />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="h-10 w-32 rounded-xl bg-amber/20 animate-pulse" />
          <div className="h-10 w-28 rounded-xl bg-surface-raised animate-pulse" />
        </div>
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-surface border border-border/80 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-surface-raised animate-pulse" />
              <div className="size-8 rounded-lg bg-surface-raised animate-pulse" />
            </div>
            <div className="h-7 w-20 rounded bg-surface-raised animate-pulse" />
            <div className="h-2.5 w-32 rounded bg-surface-raised/60 animate-pulse" />
          </div>
        ))}
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Section (8 cols): Sprints & Cohorts */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-surface border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-5 w-40 rounded bg-surface-raised animate-pulse" />
              <div className="h-4 w-24 rounded bg-surface-raised/60 animate-pulse" />
            </div>

            <div className="space-y-3 pt-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-surface-raised border border-border/60 flex items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-52 rounded bg-surface-raised animate-pulse" />
                    <div className="h-3 w-36 rounded bg-surface-raised/60 animate-pulse" />
                  </div>
                  <div className="h-6 w-20 rounded-full bg-surface-raised animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section (4 cols): Wallet Card & Exams */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs space-y-4">
            <div className="h-5 w-32 rounded bg-surface-raised animate-pulse" />
            <div className="p-4 rounded-2xl bg-surface-raised border border-border/60 space-y-3">
              <div className="h-4 w-28 rounded bg-surface-raised animate-pulse" />
              <div className="h-8 w-24 rounded-lg bg-amber/20 animate-pulse" />
            </div>
            <div className="space-y-2 pt-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-surface-raised border border-border/60 flex items-center justify-between"
                >
                  <div className="h-3.5 w-32 rounded bg-surface-raised animate-pulse" />
                  <div className="h-5 w-14 rounded-full bg-surface-raised animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
