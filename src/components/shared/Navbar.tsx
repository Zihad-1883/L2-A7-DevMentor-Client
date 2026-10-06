"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Menu, X, Coins, User as UserIcon, LogOut, Sparkles } from "lucide-react";

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

        <div className="hidden lg:flex items-center gap-3">
          {(!isAuthenticated || role === "student") && (
            <Link
              href="/apply-mentor"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary hover:text-amber hover:bg-surface-raised transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="size-3 text-amber" />
              Apply as Mentor
            </Link>
          )}

          {isAuthenticated ? (
            <>
              {/* User Avatar + Profile / Logout */}
              <div className="flex items-center gap-2 pl-2 border-l border-border/80">
                <Link
                  href={getDashboardHref()}
                  className="flex items-center gap-2 group hover:opacity-90 transition-opacity"
                  title={user?.name || "User Profile"}
                >
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="size-9 rounded-full object-cover border border-border shadow-xs"
                    />
                  ) : (
                    <div className="size-9 rounded-full bg-amber-light text-amber font-serif font-bold text-xs flex items-center justify-center border border-amber/30 shadow-xs group-hover:scale-105 transition-transform">
                      {user?.name
                        ? user.name
                          .split(" ")
                          .map((p) => p[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                        : "DM"}
                    </div>
                  )}
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    try {
                      localStorage.removeItem("devmentor_cached_role");
                    } catch {}
                    await signOut();
                    window.location.assign("/login");
                  }}
                  className="h-8 px-2.5 text-xs text-text-muted hover:text-orange hover:bg-surface-raised gap-1.5 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="size-3.5" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </div>
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
              <>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-raised mb-2">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="size-10 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="size-10 rounded-full bg-amber-light text-amber font-serif font-bold text-sm flex items-center justify-center border border-amber/30">
                      {user?.name
                        ? user.name
                          .split(" ")
                          .map((p) => p[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                        : "DM"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary truncate">{user?.name || "DevMentor Member"}</p>
                    <p className="text-xs text-text-muted truncate capitalize">{role || "Member"}</p>
                  </div>
                </div>

                <Link href={getDashboardHref()} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
                {role === "student" && (
                  <Link href="/apply-mentor" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-amber/30 text-amber hover:bg-amber-light gap-1.5">
                      <Sparkles className="size-3.5" />
                      Apply as Mentor
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      localStorage.removeItem("devmentor_cached_role");
                    } catch {}
                    setMobileMenuOpen(false);
                    await signOut();
                    window.location.assign("/login");
                  }}
                  className="w-full border-border text-orange hover:bg-surface-raised gap-2"
                >
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </Button>
              </>
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
