export default function GlobalLoadingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-4 animate-in fade-in duration-300">
      <div className="relative">
        <div className="size-12 rounded-2xl bg-amber-light flex items-center justify-center border border-amber/30 animate-pulse">
          <span className="font-serif font-bold text-amber text-xl">D.</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-sm font-semibold text-text-primary tracking-tight">
          Loading DevMentor...
        </p>
        <p className="text-xs text-text-muted">
          Preparing workspace data
        </p>
      </div>
    </div>
  );
}
