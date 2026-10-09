"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { signOut } from "@/lib/auth-client";
import { useUiStore } from "@/store/ui.store";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { queryKeys } from "@/lib/query-keys";
import {
  LayoutDashboard,
  Timer,
  Users,
  Code2,
  GraduationCap,
  Wallet,
  User,
  ShieldCheck,
  CheckSquare,
  DollarSign,
  X,
  LogOut,
  Sparkles,
  Clock,
  AlertCircle,
  Settings,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MENTOR_STATUS_CACHE_KEY = "devmentor_mentor_status";
const noopSubscribe = () => () => { };
const readCachedStatus = (): string | null => {
  try {
    return localStorage.getItem(MENTOR_STATUS_CACHE_KEY);
  } catch {
    return null;
  }
};

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, role } = useAuthContext();
  const { isSidebarOpen, setSidebarOpen } = useUiStore();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const { data: userProfile, isFetched } = useQuery({
    queryKey: queryKeys.users.me,
    queryFn: () => userService.getMyProfile(),
    enabled: role === "student",
    staleTime: 1000 * 60,
  });

  const cachedStatus = React.useSyncExternalStore(
    noopSubscribe,
    readCachedStatus,
    () => null,
  );

  const liveStatus = userProfile?.mentorProfile?.approvalStatus ?? "NONE";

  React.useEffect(() => {
    if (!isFetched || role !== "student") return;
    try {
      localStorage.setItem(MENTOR_STATUS_CACHE_KEY, liveStatus);
    } catch { }
  }, [isFetched, liveStatus, role]);

  const resolvedStatus = isFetched ? liveStatus : cachedStatus;
  const isStatusResolved = resolvedStatus !== null;
  const mentorStatus = resolvedStatus === "NONE" ? undefined : resolvedStatus;

  const studentNavItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Sprints", href: "/dashboard/sprints", icon: Timer },
    { label: "My Cohorts", href: "/dashboard/cohorts", icon: Users },
    { label: "Code Reviews", href: "/dashboard/code-reviews", icon: Code2 },
    { label: "Exams", href: "/dashboard/exams", icon: GraduationCap },
    { label: "Wallet", href: "/dashboard/wallet", icon: Wallet },
    { label: "Profile", href: "/dashboard/profile", icon: User },
    ...(!isStatusResolved
      ? []
      : mentorStatus === "PENDING"
        ? [{ label: "Application Status", href: "/mentor/pending", icon: Clock }]
        : mentorStatus === "REJECTED"
          ? [
            { label: "Application Status", href: "/mentor/pending", icon: AlertCircle },
            { label: "Become Mentor", href: "/apply-mentor", icon: Sparkles },
          ]
          : mentorStatus === "APPROVED" || role === "mentor"
            ? [{ label: "Mentor Hub", href: "/mentor", icon: ShieldCheck }]
            : [{ label: "Become Mentor", href: "/apply-mentor", icon: Sparkles }]),
  ];

  const mentorNavItems: NavItem[] = [
    { label: "Overview", href: "/mentor", icon: LayoutDashboard },
    { label: "Sprint Requests", href: "/mentor/sprints", icon: Timer },
    { label: "My Cohorts", href: "/mentor/cohorts", icon: Users },
    { label: "Code Reviews", href: "/mentor/code-reviews", icon: Code2 },
    { label: "Exam Builder", href: "/mentor/exams", icon: GraduationCap },
    { label: "Earnings & Payouts", href: "/mentor/earnings", icon: DollarSign },
    { label: "Profile", href: "/mentor/profile", icon: User },
  ];

  const adminNavItems: NavItem[] = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Mentor Queue", href: "/admin/mentors", icon: ShieldCheck },
    { label: "Cohort Approvals", href: "/admin/cohorts", icon: CheckSquare },
    { label: "Payout Requests", href: "/admin/payouts", icon: DollarSign },
    { label: "Users Directory", href: "/admin/users", icon: Users },
    { label: "Platform Settings", href: "/admin/settings", icon: Settings },
  ];

  const navItems =
    role === "admin"
      ? adminNavItems
      : role === "mentor"
        ? mentorNavItems
        : studentNavItems;

  const roleBadgeText =
    role === "admin"
      ? "Platform Admin"
      : role === "mentor"
        ? "Approved Mentor"
        : "Student";

  const roleBadgeStyle =
    role === "admin"
      ? "bg-terracotta-light text-terracotta border-terracotta/30"
      : role === "mentor"
        ? "bg-emerald-light text-emerald border-emerald/30"
        : "bg-amber-light text-amber border-amber/30";

  return (
    <>
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-surface border-r border-border z-50 flex flex-col justify-between shadow-xs transition-transform duration-200 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          <div className="h-20 px-6 flex items-center justify-between border-b border-border/40">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-serif text-2xl text-text-primary tracking-tight font-bold group-hover:text-amber transition-colors">
                DevMentor<span className="text-amber font-serif">.</span>
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-raised"
              aria-label="Close sidebar"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  item.href !== "/mentor" &&
                  item.href !== "/admin" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all ${isActive
                    ? "bg-amber-light text-amber-hover font-semibold border-l-4 border-amber shadow-xs"
                    : "text-text-muted hover:bg-surface-raised hover:text-text-primary font-medium"
                    }`}
                >
                  <Icon
                    className={`size-4.5 ${isActive ? "text-amber" : "text-text-muted"
                      }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Become a Mentor Prompt for Students */}
          {role === "student" && (
            <div className="p-4 mx-3 mb-2 rounded-2xl bg-amber-light/40 border border-amber/20 space-y-2">
              {!isStatusResolved ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-3 w-2/3 rounded bg-amber/20" />
                  <div className="h-2.5 w-full rounded bg-amber/10" />
                  <div className="h-2.5 w-1/2 rounded bg-amber/10" />
                </div>
              ) : mentorStatus === "PENDING" ? (
                <>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber">
                    <Clock className="size-3.5 animate-pulse" />
                    <span>Application Under Review</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    Our team is auditing your portfolio. Check back for verification updates.
                  </p>
                  <Link href="/mentor/pending" className="block pt-1">
                    <span className="text-xs font-bold text-amber hover:underline inline-flex items-center gap-1">
                      Check Status →
                    </span>
                  </Link>
                </>
              ) : mentorStatus === "REJECTED" ? (
                <>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange">
                    <AlertCircle className="size-3.5" />
                    <span>Application Notice</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    Application was not approved. You can submit a refreshed portfolio.
                  </p>
                  <Link href="/apply-mentor" className="block pt-1">
                    <span className="text-xs font-bold text-orange hover:underline inline-flex items-center gap-1">
                      Re-apply Now →
                    </span>
                  </Link>
                </>
              ) : mentorStatus === "APPROVED" ? (
                <>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald">
                    <ShieldCheck className="size-3.5" />
                    <span>Approved Mentor!</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    You have mentor privileges. Switch to the Mentor Workspace.
                  </p>
                  <Link href="/mentor" className="block pt-1">
                    <span className="text-xs font-bold text-emerald hover:underline inline-flex items-center gap-1">
                      Enter Workspace →
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber">
                    <Sparkles className="size-3.5" />
                    <span>Want to Mentor?</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    Senior engineers can host cohorts, review PRs, and earn cash-out credits.
                  </p>
                  <Link href="/apply-mentor" className="block pt-1">
                    <span className="text-xs font-bold text-amber hover:underline inline-flex items-center gap-1">
                      Apply as Mentor →
                    </span>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border/60 bg-surface-raised/40">
          <div className="flex items-center justify-between p-2 rounded-xl bg-surface border border-border shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 rounded-full bg-amber-light text-amber flex items-center justify-center font-serif font-bold border border-amber/20 shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-text-primary truncate">
                  {user?.name || "DevMentor User"}
                </span>
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium border mt-0.5 w-fit ${roleBadgeStyle}`}
                >
                  {roleBadgeText}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSignOutModalOpen(true)}
              className="p-2 text-text-muted hover:text-orange rounded-lg hover:bg-surface-raised transition-colors shrink-0 cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      <ConfirmModal
        isOpen={isSignOutModalOpen}
        title="Sign Out of DevMentor?"
        description="Are you sure you want to end your active session? You will be returned to the login screen."
        confirmLabel="Yes, Sign Out"
        variant="primary"
        isLoading={isSigningOut}
        onConfirm={async () => {
          setIsSigningOut(true);
          try {
            localStorage.removeItem("devmentor_cached_role");
          } catch { }
          await signOut();
          window.location.assign("/login");
        }}
        onClose={() => setIsSignOutModalOpen(false)}
      />
    </>
  );
}
