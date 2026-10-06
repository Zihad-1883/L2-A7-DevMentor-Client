"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { queryKeys } from "@/lib/query-keys";
import ProfileHeroCard from "@/features/profile/ProfileHeroCard";
import ProfileDetailsForm from "@/features/profile/ProfileDetailsForm";
import ChangePasswordForm from "@/features/profile/ChangePasswordForm";
import {
  User,
  Shield,
  Sparkles,
  Loader2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export default function StudentProfilePage() {
  const [activeTab, setActiveTab] = React.useState<"general" | "security">("general");

  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.users.me,
    queryFn: () => userService.getMyProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20 mb-2">
            <Sparkles className="size-3.5" /> Account Center
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Account & Profile Settings
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-xl">
            Manage your personal profile details and security credentials.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface border border-border flex items-center gap-3 shadow-2xs">
          <div className="size-9 rounded-xl bg-amber-light text-amber border border-amber/20 flex items-center justify-center shrink-0">
            <Shield className="size-5" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-text-primary block">Student Profile</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-16 rounded-2xl border border-border/80 bg-surface flex flex-col items-center justify-center gap-3 text-text-muted">
          <Loader2 className="size-7 animate-spin text-amber" />
          <span className="text-sm font-medium">Loading profile details...</span>
        </div>
      ) : error || !profile ? (
        <div className="p-8 rounded-2xl border border-orange/30 bg-orange/5 flex flex-col items-center justify-center gap-3 text-center">
          <AlertCircle className="size-8 text-orange" />
          <h3 className="font-bold text-text-primary">Failed to load profile</h3>
          <p className="text-xs text-text-secondary max-w-md">
            {error instanceof Error
              ? error.message
              : "Could not retrieve your user profile information. Please verify your connection."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber text-white hover:bg-amber-hover transition-colors"
          >
            Retry Loading
          </button>
        </div>
      ) : (
        <>
          {/* Profile Overview Banner Card */}
          <ProfileHeroCard profile={profile} />

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-border/80 pb-px">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer border-b-2 -mb-px ${activeTab === "general"
                ? "border-amber text-amber bg-amber/5"
                : "border-transparent text-text-muted hover:text-text-primary hover:bg-surface-raised"
                }`}
            >
              <User className="size-3.5" />
              Personal Info
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer border-b-2 -mb-px ${activeTab === "security"
                ? "border-amber text-amber bg-amber/5"
                : "border-transparent text-text-muted hover:text-text-primary hover:bg-surface-raised"
                }`}
            >
              <Shield className="size-3.5" />
              Security & Password
            </button>
          </div>

          {/* Tab Content Panes */}
          <div className="pt-2">
            {activeTab === "general" && (
              <div className="max-w-2xl animate-in fade-in duration-200">
                <ProfileDetailsForm profile={profile} />
              </div>
            )}

            {activeTab === "security" && (
              <div className="max-w-2xl animate-in fade-in duration-200">
                <ChangePasswordForm />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
