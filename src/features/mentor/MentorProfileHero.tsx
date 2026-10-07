"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import type { UserProfileResponse } from "@/services/user.service";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  Calendar,
  Wallet,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Code2,
  Award,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface MentorProfileHeroProps {
  profile: UserProfileResponse;
}

export default function MentorProfileHero({ profile }: MentorProfileHeroProps) {
  const [imgError, setImgError] = React.useState(false);
  const mentor = profile.mentorProfile;

  const initials = (profile.name || "Mentor")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const formattedDate = profile.createdAt
    ? formatDate(profile.createdAt)
    : "Member";

  const publicProfileHref = mentor?.id ? `/mentors/${mentor.id}` : "/mentors";

  return (
    <Card className="border border-border/80 bg-linear-to-r from-surface to-surface-raised overflow-hidden shadow-xs relative">
      <div className="absolute top-0 right-0 w-96 h-full bg-linear-to-bl from-amber/10 via-transparent to-transparent pointer-events-none" />

      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              {profile.image && !imgError ? (
                <div className="size-20 sm:size-24 rounded-2xl overflow-hidden border-2 border-border/80 shadow-xs relative bg-surface-sunken">
                  <Image
                    src={profile.image}
                    alt={profile.name || "Mentor Profile"}
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

              <span
                className="absolute -bottom-1 -right-1 size-5 rounded-full bg-emerald border-2 border-surface flex items-center justify-center"
                title="Active Approved Mentor"
              >
                <span className="size-2 rounded-full bg-white animate-pulse" />
              </span>
            </div>

            {/* Profile Meta Info */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-text-primary">
                  {profile.name}
                </h2>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20">
                  <Award className="size-3" /> Mentor
                </span>

                {mentor?.approvalStatus === "APPROVED" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-light text-emerald border border-emerald/20">
                    <ShieldCheck className="size-3" /> Verified Instructor
                  </span>
                )}

                {mentor?.experienceLevel && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-raised border border-border text-text-secondary">
                    <Sparkles className="size-3 text-amber" /> {mentor.experienceLevel}
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
                    <Wallet className="size-3.5" /> {profile.wallet.balance} Credits Available
                  </span>
                )}

                {mentor?.techStackTags && mentor.techStackTags.length > 0 && (
                  <span className="flex items-center gap-1.5 text-text-secondary font-medium">
                    <Code2 className="size-3.5 text-amber" /> {mentor.techStackTags.length} Verified Skills
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-border/60">
            <Link
              href={publicProfileHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-surface border border-border hover:border-amber/40 hover:text-amber transition-colors shadow-2xs text-text-primary"
            >
              <ExternalLink className="size-3.5 text-amber" />
              View Public Page
            </Link>

            <Link
              href="/mentor/earnings"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber text-white hover:bg-amber-hover transition-colors shadow-xs"
            >
              <Wallet className="size-3.5" />
              Earnings & Payouts
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
