export default function PublicLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-in fade-in duration-200">
      <div className="space-y-3 max-w-xl mx-auto text-center animate-pulse">
        <div className="h-4 w-32 rounded-full bg-amber/20 mx-auto" />
        <div className="h-9 w-72 rounded-xl bg-surface-raised mx-auto" />
        <div className="h-4 w-96 rounded-md bg-surface-raised mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-6 rounded-3xl bg-surface border border-border/80 shadow-2xs space-y-4 animate-pulse"
          >
            <div className="h-40 w-full rounded-2xl bg-surface-raised" />
            <div className="h-5 w-3/4 rounded bg-surface-raised" />
            <div className="h-3 w-full rounded bg-surface-raised/70" />
            <div className="h-3 w-2/3 rounded bg-surface-raised/70" />
            <div className="pt-2 flex items-center justify-between">
              <div className="h-5 w-20 rounded bg-surface-raised" />
              <div className="h-8 w-24 rounded-xl bg-surface-raised" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
