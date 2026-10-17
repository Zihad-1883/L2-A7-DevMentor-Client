"use client";

import * as React from "react";
import Link from "next/link";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { signOut } from "@/lib/auth-client";
import { useWallet } from "@/hooks/useWallet";
import {
  User as UserIcon,
  LayoutDashboard,
  Coins,
  LogOut,
  ChevronDown,
  Sparkles,
  Shield,
  Briefcase,
  ExternalLink,
} from "lucide-react";

export default function ProfileDropdown() {
  const { user, role } = useAuthContext();
  const { balance, isLoading: isWalletLoading } = useWallet();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click or Escape key
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const getDashboardHref = () => {
    if (role === "admin") return "/admin";
    if (role === "mentor") return "/mentor";
    return "/dashboard";
  };

  const getProfileHref = () => {
    if (role === "mentor") return "/mentor/profile";
    return "/dashboard/profile";
  };

  const handleSignOut = async () => {
    setIsOpen(false);
    try {
      localStorage.removeItem("devmentor_cached_role");
    } catch {}
    await signOut();
    window.location.assign("/login");
  };

  const name = user?.name || "DevMentor User";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const roleBadgeConfig = {
    admin: { label: "Admin", color: "bg-terracotta/15 text-terracotta border-terracotta/30", icon: Shield },
    mentor: { label: "Mentor", color: "bg-emerald/15 text-emerald border-emerald/30", icon: Briefcase },
    student: { label: "Student", color: "bg-amber/15 text-amber border-amber/30", icon: Sparkles },
  }[role || "student"] || { label: "Member", color: "bg-surface-raised text-text-secondary border-border", icon: Sparkles };

  const RoleIcon = roleBadgeConfig.icon;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-border/80 bg-surface hover:bg-surface-raised hover:border-amber/40 transition-all cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-amber/40"
      >
        {user?.image ? (
          <img
            src={user.image}
            alt={name}
            className="size-8 rounded-full object-cover border border-border shadow-xs"
          />
        ) : (
          <div className="size-8 rounded-full bg-amber-light text-amber font-serif font-bold text-xs flex items-center justify-center border border-amber/30 shadow-xs group-hover:scale-105 transition-transform">
            {initials || "DM"}
          </div>
        )}

        <span className="hidden sm:inline text-xs font-semibold text-text-primary max-w-[100px] truncate">
          {name.split(" ")[0]}
        </span>

        <ChevronDown
          className={`size-3.5 text-text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180 text-amber" : "group-hover:text-text-primary"
          }`}
        />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-72 rounded-2xl border border-border bg-surface p-2 shadow-xl backdrop-blur-xl z-50 animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {/* User Profile Header */}
          <div className="px-3 py-3 rounded-xl bg-surface-raised border border-border/60 mb-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-text-primary truncate">{name}</p>
                <p className="text-xs text-text-muted truncate mt-0.5">{user?.email}</p>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${roleBadgeConfig.color}`}
              >
                <RoleIcon className="size-3" />
                {roleBadgeConfig.label}
              </span>
            </div>

            {/* Credit Wallet Pill (Students and Mentors) */}
            {(role === "student" || role === "mentor") && (
              <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between">
                <span className="text-[11px] text-text-muted font-medium flex items-center gap-1">
                  <Coins className="size-3.5 text-amber" />
                  DevWallet
                </span>
                <span className="text-xs font-bold text-amber">
                  {isWalletLoading ? "..." : `${balance.toLocaleString()} Credits`}
                </span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-0.5">
            <Link
              href={getDashboardHref()}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-text-primary rounded-lg hover:bg-surface-raised hover:text-amber transition-colors"
              role="menuitem"
            >
              <LayoutDashboard className="size-4 text-text-muted group-hover:text-amber" />
              <span>Dashboard Overview</span>
            </Link>

            <Link
              href={getProfileHref()}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-text-primary rounded-lg hover:bg-surface-raised hover:text-amber transition-colors"
              role="menuitem"
            >
              <UserIcon className="size-4 text-text-muted" />
              <span>Profile &amp; Account</span>
            </Link>

            {(role === "student" || role === "mentor") && (
              <Link
                href={role === "mentor" ? "/mentor/earnings" : "/dashboard/wallet"}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-text-primary rounded-lg hover:bg-surface-raised hover:text-amber transition-colors"
                role="menuitem"
              >
                <div className="flex items-center gap-2.5">
                  <Coins className="size-4 text-text-muted" />
                  <span>{role === "mentor" ? "Earnings & Cash Out" : "Wallet & Top Up"}</span>
                </div>
                <ExternalLink className="size-3 text-text-muted" />
              </Link>
            )}
          </div>

          {/* Divider & Logout */}
          <div className="mt-2 pt-2 border-t border-border/60">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-orange rounded-lg hover:bg-surface-raised hover:text-orange-hover transition-colors cursor-pointer"
              role="menuitem"
            >
              <LogOut className="size-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
