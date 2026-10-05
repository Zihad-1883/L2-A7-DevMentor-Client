import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-surface">
      <header className="w-full h-16 px-6 lg:px-12 flex items-center border-b border-border/40">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-serif text-2xl text-text-primary tracking-tight font-bold group-hover:text-amber transition-colors">
            DevMentor<span className="text-amber font-serif">.</span>
          </span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="w-full py-4 px-6 text-center text-xs text-text-muted border-t border-border/40">
        © 2026 DevMentor. Secure authentication powered by Better Auth.
      </footer>
    </div>
  );
}
