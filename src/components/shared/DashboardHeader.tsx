"use client";

import * as React from "react";
import Link from "next/link";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useUiStore } from "@/store/ui.store";
import { useWallet } from "@/hooks/useWallet";
import { Menu, Plus } from "lucide-react";
import CreditDisplay from "./CreditDisplay";

export default function DashboardHeader() {
  const { role } = useAuthContext();
  const { toggleSidebar } = useUiStore();
  const { balance, isLoading: isWalletLoading } = useWallet();

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
        {/* Credit Balance Widget (Students & Mentors) */}
        {(role === "student" || role === "mentor") && (
          <div className="flex items-center gap-2">
            <Link
              href={role === "mentor" ? "/mentor/earnings" : "/dashboard/wallet"}
              className="group flex items-center gap-2 hover:opacity-95 transition-opacity"
              title={role === "mentor" ? "Mentor Earnings & Balance" : "DevWallet Balance"}
            >
              <CreditDisplay
                credits={isWalletLoading ? 0 : balance}
                size="sm"
                className="bg-amber/10 border-amber/30 text-amber font-semibold group-hover:border-amber/60 transition-colors"
              />
            </Link>

            <Link
              href={role === "mentor" ? "/mentor/earnings" : "/dashboard/wallet"}
              className="hidden sm:inline-flex items-center justify-center size-7 rounded-full bg-amber text-white hover:bg-amber-hover transition-colors shadow-2xs"
              title={role === "mentor" ? "Withdraw / Earnings" : "Top-up Credits"}
            >
              <Plus className="size-3.5" />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
