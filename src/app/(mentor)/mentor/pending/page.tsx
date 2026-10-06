"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { queryKeys } from "@/lib/query-keys";
import { useAuthContext } from "@/components/providers/AuthProvider";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  RefreshCw,
  FileText,
  Code2,
  Mail,
  ExternalLink,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default function MentorPendingPage() {
  const router = useRouter();
  const { user, role, refetch: refetchAuth } = useAuthContext();

  const {
    data: profile,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: queryKeys.users.me,
    queryFn: () => userService.getMyProfile(),
    refetchInterval: 1000 * 30, // Poll every 30s in case admin approves
  });

  const mentorProfile = profile?.mentorProfile;
  const approvalStatus = mentorProfile?.approvalStatus || "PENDING";

  // If already approved as mentor, redirect to /mentor
  React.useEffect(() => {
    if (role === "mentor" || approvalStatus === "APPROVED") {
      router.push("/mentor");
    }
  }, [role, approvalStatus, router]);

  const handleManualCheck = async () => {
    await refetch();
    await refetchAuth();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300 py-6">
      {/* Header Badge */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20 shadow-2xs">
          <Sparkles className="size-3.5" /> Mentor Onboarding
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
          Application Status
        </h1>

        <p className="text-sm text-text-secondary max-w-lg mx-auto">
          Track the verification process of your engineering credentials and platform privileges.
        </p>
      </div>

      {/* Main Status Hero Card */}
      <Card className="border border-border/80 shadow-md bg-surface overflow-hidden relative">
        <div className="h-2 w-full bg-linear-to-r from-amber via-amber-hover to-emerald" />

        <CardContent className="p-8 sm:p-10 space-y-6">
          {approvalStatus === "REJECTED" ? (
            <div className="text-center space-y-4">
              <div className="size-16 rounded-2xl bg-orange/10 text-orange flex items-center justify-center mx-auto border border-orange/20 shadow-xs">
                <AlertCircle className="size-8" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-orange/10 text-orange border border-orange/20 inline-block">
                  Application Not Approved
                </span>
                <h2 className="font-serif text-2xl font-bold text-text-primary mt-2">
                  Review Notice
                </h2>
                <p className="text-sm text-text-secondary mt-1 max-w-md mx-auto">
                  Unfortunately, your mentor application did not meet our verification criteria at this time. You can re-apply with updated engineering credentials or a refreshed portfolio.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <Link href="/apply-mentor">
                  <Button className="bg-amber text-white hover:bg-amber-hover text-xs font-semibold">
                    Submit New Application <ArrowRight className="size-3.5 ml-1.5" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="text-xs">
                    Return to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="size-16 rounded-2xl bg-amber-light text-amber flex items-center justify-center mx-auto border border-amber/20 shadow-xs relative">
                <Clock className="size-8 animate-pulse" />
                <span className="absolute -top-1 -right-1 size-4 rounded-full bg-amber flex items-center justify-center">
                  <span className="size-2 rounded-full bg-white animate-ping" />
                </span>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-light text-amber border border-amber/20 inline-block">
                  Under Admin Review
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary mt-3">
                  Verification in Progress
                </h2>
                <p className="text-sm text-text-secondary mt-2 max-w-lg mx-auto leading-relaxed">
                  Thank you for applying to mentor on DevMentor,{" "}
                  <strong className="text-text-primary">{user?.name || "Engineer"}</strong>! Our administrative team conducts manual background reviews on all submissions within 24 to 48 hours.
                </p>
              </div>

              {/* Refresh / Status Check Button */}
              <div className="pt-2 flex items-center justify-center gap-3">
                <Button
                  onClick={handleManualCheck}
                  disabled={isLoading || isRefetching}
                  variant="outline"
                  className="text-xs gap-1.5 border-border shadow-2xs"
                >
                  <RefreshCw
                    className={`size-3.5 ${isRefetching ? "animate-spin text-amber" : ""}`}
                  />
                  {isRefetching ? "Checking Status..." : "Refresh Approval Status"}
                </Button>

                <Link href="/dashboard">
                  <Button variant="secondary" className="text-xs">
                    Continue to Student Hub
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Submitted Application Snapshot */}
          {mentorProfile && (
            <div className="mt-8 pt-6 border-t border-border/70 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                  <FileText className="size-3.5 text-amber" /> Submitted Application Overview
                </h3>
                <span className="text-[11px] text-text-muted">
                  Level: <strong className="text-text-primary">{mentorProfile.experienceLevel}</strong>
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-surface-raised border border-border/80 space-y-3 text-left">
                {/* Bio snippet */}
                <div>
                  <span className="text-[11px] font-semibold text-text-muted block">Engineering Bio:</span>
                  <p className="text-xs text-text-primary italic mt-0.5 line-clamp-3">
                    &ldquo;{mentorProfile.bio}&rdquo;
                  </p>
                </div>

                {/* Tech Stack */}
                {mentorProfile.techStackTags && mentorProfile.techStackTags.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-text-muted block mb-1.5">
                      Specializations:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {mentorProfile.techStackTags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-surface border border-border text-text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-text-secondary">
                  {mentorProfile.githubUrl && (
                    <a
                      href={mentorProfile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-amber hover:underline"
                    >
                      <ExternalLink className="size-3" /> GitHub Profile
                    </a>
                  )}
                  {mentorProfile.resumeUrl && (
                    <a
                      href={mentorProfile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-amber hover:underline"
                    >
                      <ExternalLink className="size-3" /> Portfolio / Resume
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Process Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-2xs space-y-2">
          <div className="size-8 rounded-lg bg-emerald-light text-emerald flex items-center justify-center font-bold text-xs border border-emerald/20">
            ✓ 1
          </div>
          <h4 className="text-xs font-bold text-text-primary">Submission Received</h4>
          <p className="text-[11px] text-text-muted leading-relaxed">
            Your application details and technical portfolio have been saved securely in our database.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-amber/40 shadow-2xs space-y-2 bg-amber-light/10">
          <div className="size-8 rounded-lg bg-amber-light text-amber flex items-center justify-center font-bold text-xs border border-amber/20">
            2
          </div>
          <h4 className="text-xs font-bold text-text-primary">Identity & Code Audit</h4>
          <p className="text-[11px] text-text-muted leading-relaxed">
            Admins verify your repository history, tech stack competencies, and experience level.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-2xs space-y-2">
          <div className="size-8 rounded-lg bg-surface-sunken text-text-muted flex items-center justify-center font-bold text-xs border border-border">
            3
          </div>
          <h4 className="text-xs font-bold text-text-primary">Hub Access Granted</h4>
          <p className="text-[11px] text-text-muted leading-relaxed">
            Once approved, you are promoted to Mentor role and unlock sprint claims and cohort creation.
          </p>
        </div>
      </div>
    </div>
  );
}
