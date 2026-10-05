"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Menu, X, Coins, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, role } = useAuthContext();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Cohorts", href: "/cohorts" },
    { label: "Code Reviews", href: "/dashboard/code-reviews" },
    { label: "Exams", href: "/exams" },
    { label: "Mentors", href: "/mentors" },
  ];

  const getDashboardHref = () => {
    if (role === "admin") return "/admin";
    if (role === "mentor") return "/mentor";
    return "/dashboard";
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-b border-border/40 shadow-xs">
      <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl text-text-primary tracking-tight font-bold group-hover:text-amber transition-colors">
              DevMentor<span className="text-amber font-serif">.</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                      ? "text-text-primary bg-surface-raised font-semibold"
                      : "text-text-muted hover:text-text-primary hover:bg-surface-raised/60"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard/wallet"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-raised text-amber text-xs font-medium border border-border/50 hover:border-amber/40 transition-colors"
              >
                <Coins className="size-3.5 text-amber" />
                <span className="font-semibold text-text-primary">Credits</span>
              </Link>

              <Link href={getDashboardHref()}>
                <Button variant="outline" size="sm" className="gap-2">
                  <UserIcon className="size-4 text-amber" />
                  <span>Dashboard</span>
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3.5 py-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link href="/mentors">
                <Button variant="default" size="sm">
                  Find a Mentor
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-text-muted hover:text-text-primary"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-surface px-6 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text-primary hover:bg-surface-raised"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {isAuthenticated ? (
              <Link href={getDashboardHref()} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full">
                    Join DevMentor
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
