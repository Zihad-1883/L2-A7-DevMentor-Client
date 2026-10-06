"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { UserProfileResponse } from "@/services/user.service";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  ShieldCheck,
  Calendar,
  Wallet,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ProfileHeroCardProps {
  profile: UserProfileResponse;
}

export default function ProfileHeroCard({ profile }: ProfileHeroCardProps) {
  const [imgError, setImgError] = React.useState(false);
  const initials = (profile.name || "Student")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const formattedDate = profile.createdAt
    ? formatDate(profile.createdAt)
    : "Member";

  return (
    <Card className="border border-border/80 bg-linear-to-r from-surface to-surface-raised overflow-hidden shadow-xs relative">
      <div className="absolute top-0 right-0 w-96 h-full bg-linear-to-bl from-amber/5 via-transparent to-transparent pointer-events-none" />

      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              {profile.image && !imgError ? (
                <div className="size-20 sm:size-24 rounded-2xl overflow-hidden border-2 border-border/80 shadow-xs relative bg-surface-sunken">
                  <Image
                    src={profile.image}
                    alt={profile.name || "Profile"}
                    fill
                    sizes="96px"
                    unoptimized
                    onError={() => setImgError(true)}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="size-20 sm:size-24 rounded-2xl bg-linear-to-br from-amber to-amber-hover text-white flex items-center justify-center font-bold text-2xl tracking-wider shadow-xs border-2 border-white/20">
                  {initials}
                </div>
              )}

              <span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-emerald border-2 border-surface flex items-center justify-center" title="Active Account">
                <span className="size-2 rounded-full bg-white animate-pulse" />
              </span>
            </div>

            {/* Profile Meta */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-text-primary">
                  {profile.name}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20">
                  <GraduationCap className="size-3" /> Student
                </span>
                {profile.emailVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-light text-emerald border border-emerald/20">
                    <ShieldCheck className="size-3" /> Verified
                  </span>
                )}
              </div>

              <p className="text-sm text-text-secondary">{profile.email}</p>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-text-muted">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" /> Joined {formattedDate}
                </span>
                {profile.wallet && (
                  <span className="flex items-center gap-1.5 text-amber font-semibold">
                    <Wallet className="size-3.5" /> {profile.wallet.balance} Credits
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-border/60">
            <Link
              href="/dashboard/wallet"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-surface border border-border hover:border-amber/40 hover:text-amber transition-colors shadow-2xs text-text-primary"
            >
              <Wallet className="size-3.5 text-amber" />
              Manage Credits
              <ArrowRight className="size-3" />
            </Link>

            <Link
              href="/apply-mentor"
              className="text-xs text-text-muted hover:text-text-primary transition-colors flex items-center gap-1 font-medium"
            >
              <Sparkles className="size-3 text-amber" /> Apply as a Mentor
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
