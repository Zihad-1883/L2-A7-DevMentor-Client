export default function MentorLoadingSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="space-y-2 pb-6 border-b border-border/80 animate-pulse">
        <div className="h-4 w-28 rounded-md bg-emerald/15" />
        <div className="h-8 w-60 rounded-xl bg-surface-raised" />
        <div className="h-3 w-80 rounded-md bg-surface-raised" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-surface border border-border/80 shadow-2xs space-y-3 animate-pulse"
          >
            <div className="h-3 w-20 rounded bg-surface-raised" />
            <div className="h-7 w-24 rounded bg-surface-raised" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-surface border border-border/80 space-y-3 animate-pulse"
          >
            <div className="h-5 w-48 rounded bg-surface-raised" />
            <div className="h-3 w-full rounded bg-surface-raised" />
            <div className="h-8 w-28 rounded-xl bg-surface-raised mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
