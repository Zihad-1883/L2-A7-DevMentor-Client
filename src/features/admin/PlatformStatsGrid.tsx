"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { PlatformOverviewStats } from "@/types/admin.types";
import {
  Users,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  CheckSquare,
  Coins,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

interface PlatformStatsGridProps {
  stats: PlatformOverviewStats;
}

export default function PlatformStatsGrid({ stats }: PlatformStatsGridProps) {
  const cards = [
    {
      title: "Total Registered Users",
      value: stats.totalUsers.toLocaleString(),
      subtext: `${stats.totalStudents} Students • ${stats.totalMentors} Mentors`,
      icon: Users,
      color: "blue",
      href: "/admin/users",
      actionText: "Manage Directory",
    },
    {
      title: "Pending Mentor Queue",
      value: stats.pendingMentorApplications.toString(),
      subtext: stats.pendingMentorApplications > 0 ? "Applications awaiting moderation" : "All applications reviewed",
      icon: ShieldCheck,
      color: stats.pendingMentorApplications > 0 ? "amber" : "emerald",
      badge: stats.pendingMentorApplications > 0 ? "Action Required" : "Clean",
      href: "/admin/mentors",
      actionText: "Review Applicants",
    },
    {
      title: "Gross Platform Revenue",
      value: `৳${stats.totalRevenueBdt.toLocaleString()}`,
      subtext: "Total student credit top-up payments",
      icon: DollarSign,
      color: "emerald",
      href: "/admin/payouts",
      actionText: "View Transactions",
    },
    {
      title: "Platform Net Commission",
      value: `৳${stats.platformCommissionEarnedBdt.toLocaleString()}`,
      subtext: "15% platform fee on sprints & cohorts",
      icon: TrendingUp,
      color: "amber",
      href: "/admin/settings",
      actionText: "Fee Settings",
    },
    {
      title: "Cohort Programs",
      value: stats.totalCohorts.toString(),
      subtext: `${stats.pendingCohorts} Pending admin moderation`,
      icon: CheckSquare,
      color: "purple",
      badge: stats.pendingCohorts > 0 ? `${stats.pendingCohorts} New` : undefined,
      href: "/admin/cohorts",
      actionText: "Moderate Courses",
    },
    {
      title: "Credits in Circulation",
      value: stats.totalCreditsCirculating.toLocaleString(),
      subtext: `1 Credit = ৳4.00 BDT Base Rate`,
      icon: Coins,
      color: "terracotta",
      href: "/admin/payouts",
      actionText: "Payout Queue",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cards.map((c) => {
        const IconComponent = c.icon;
        return (
          <Card
            key={c.title}
            className="border border-border/80 shadow-2xs hover:shadow-xs transition-all duration-200 bg-surface group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-amber/5 via-transparent to-transparent pointer-events-none" />

            <CardContent className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-xl bg-surface-raised border border-border flex items-center justify-center text-text-primary group-hover:scale-105 group-hover:border-amber/40 transition-all">
                  <IconComponent className="size-5 text-amber" />
                </div>

                {c.badge && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/30">
                    <AlertCircle className="size-3" />
                    {c.badge}
                  </span>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  {c.title}
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold font-mono text-text-primary mt-1 tracking-tight">
                  {c.value}
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  {c.subtext}
                </p>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                <Link
                  href={c.href}
                  className="font-semibold text-text-secondary hover:text-amber transition-colors inline-flex items-center gap-1 group/link"
                >
                  {c.actionText}
                  <ArrowRight className="size-3 transition-transform group-hover/link:translate-x-0.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
