"use client";

import * as React from "react";
import Link from "next/link";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useUiStore } from "@/store/ui.store";
import { Menu, Coins, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";

export default function DashboardHeader() {
  const { user, role } = useAuthContext();
  const { toggleSidebar } = useUiStore();

  const userInitials = user?.name
    ? user.name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "DM";

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-surface/90 backdrop-blur-md border-b border-border/60 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {/* Mobile & Tablet Hamburger Toggle */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="size-5" />
        </button>

        <Link href="/" className="lg:hidden flex items-center gap-1.5 group">
          <span className="font-serif text-lg font-bold text-text-primary tracking-tight">
            DevMentor<span className="text-amber">.</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {role === "student" && (
          <Link
            href="/dashboard/wallet"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-raised text-amber text-xs font-medium border border-border/60 hover:border-amber/40 transition-colors shadow-2xs"
          >
            <Coins className="size-3.5 text-amber" />
            <span className="font-semibold text-text-primary">DevWallet</span>
          </Link>
        )}

        <div className="flex items-center gap-2 pl-2 border-l border-border/60">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="size-8 rounded-full object-cover border border-border shadow-xs"
            />
          ) : (
            <div className="size-8 rounded-full bg-amber-light text-amber font-serif font-bold text-xs flex items-center justify-center border border-amber/30 shadow-xs">
              {userInitials}
            </div>
          )}

          <span className="hidden sm:inline text-xs font-semibold text-text-primary max-w-[120px] truncate">
            {user?.name || "My Account"}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              try {
                localStorage.removeItem("devmentor_cached_role");
              } catch { }
              await signOut();
              window.location.assign("/login");
            }}
            className="h-8 px-2 text-xs text-text-muted hover:text-orange hover:bg-surface-raised gap-1 cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
