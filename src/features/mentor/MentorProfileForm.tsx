"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, type UserProfileResponse } from "@/services/user.service";
import { queryKeys } from "@/lib/query-keys";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  User,
  Image as ImageIcon,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  ShieldCheck,
  ExternalLink,
  Code2,
  Sparkles,
  FileCode,
  Eye,
} from "lucide-react";
import { z } from "zod";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const mentorProfileFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters"),
  image: z
    .string()
    .trim()
    .url("Please enter a valid image URL")
    .or(z.literal(""))
    .optional(),
  bio: z
    .string()
    .trim()
    .min(10, "Bio must be at least 10 characters long")
    .max(1000, "Bio cannot exceed 1000 characters"),
});

interface MentorProfileFormProps {
  profile: UserProfileResponse;
}

export default function MentorProfileForm({ profile }: MentorProfileFormProps) {
  const queryClient = useQueryClient();
  const { refetch: refetchAuth } = useAuthContext();

  const mentor = profile.mentorProfile;

  const [name, setName] = React.useState(profile.name || "");
  const [image, setImage] = React.useState(profile.image || "");
  const [bio, setBio] = React.useState(mentor?.bio || "");

  const [fieldErrors, setFieldErrors] = React.useState<{
    name?: string;
    image?: string;
    bio?: string;
  }>({});

  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [avatarPreviewError, setAvatarPreviewError] = React.useState(false);

  const initialValues = React.useMemo(
    () => ({
      name: profile.name || "",
      image: profile.image || "",
      bio: mentor?.bio || "",
    }),
    [profile.name, profile.image, mentor?.bio]
  );

  const isDirty =
    name !== initialValues.name ||
    image !== initialValues.image ||
    bio !== initialValues.bio;

  // Remove useEffect - reset avatar error directly on input change

  const updateMutation = useMutation({
    mutationFn: (data: { name: string; image: string | null; bio: string }) =>
      userService.updateMyProfile(data),
    onSuccess: async (updated) => {
      setSuccessMessage("Your mentor profile and biography have been successfully saved.");
      setErrorMessage(null);
      queryClient.setQueryData(queryKeys.users.me, updated);
      await refetchAuth();
      setName(updated.name || "");
      setImage(updated.image || "");
      setBio(updated.mentorProfile?.bio || "");
      setTimeout(() => setSuccessMessage(null), 5000);
    },
    onError: (err: Error) => {
      setErrorMessage(err.message || "Failed to update profile. Please try again.");
      setSuccessMessage(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const result = mentorProfileFormSchema.safeParse({ name, image, bio });

    if (!result.success) {
      const formattedErrors: { name?: string; image?: string; bio?: string } = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as "name" | "image" | "bio";
        if (!formattedErrors[fieldName]) {
          formattedErrors[fieldName] = issue.message;
        }
      }
      setFieldErrors(formattedErrors);
      return;
    }

    setFieldErrors({});

    updateMutation.mutate({
      name: result.data.name,
      image: result.data.image ? result.data.image : null,
      bio: result.data.bio,
    });
  };

  const bioLength = bio.length;

  return (
    <div className="space-y-8">
      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl border border-emerald/30 bg-emerald/5 flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="size-5 text-emerald shrink-0" />
          <p className="text-sm font-medium text-emerald">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl border border-orange/30 bg-orange/5 flex items-center gap-3 animate-in fade-in duration-200">
          <AlertCircle className="size-5 text-orange shrink-0" />
          <p className="text-sm font-medium text-orange">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Form Fields */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border border-border/80 shadow-xs bg-surface">
            <CardHeader className="pb-4 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-amber-light text-amber flex items-center justify-center border border-amber/20">
                  <User className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-text-primary">
                    Public Identity & Biography
                  </CardTitle>
                  <CardDescription className="text-xs text-text-muted mt-0.5">
                    Customize the public persona and background details shown to students.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label htmlFor="mentor-name-input" className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                    <User className="size-3.5 text-text-muted" /> Full Name
                  </label>
                  <Input
                    id="mentor-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined }));
                    }}
                    placeholder="e.g. Alex Rivera"
                    className={fieldErrors.name ? "border-orange/60 focus-visible:ring-orange/30" : ""}
                  />
                  {fieldErrors.name ? (
                    <p className="text-xs text-orange font-medium">{fieldErrors.name}</p>
                  ) : (
                    <p className="text-[11px] text-text-muted">
                      Your legal or preferred professional display name across all cohorts & code reviews.
                    </p>
                  )}
                </div>

                {/* Profile Photo / Avatar URL */}
                <div className="space-y-2">
                  <label htmlFor="mentor-image-input" className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                    <ImageIcon className="size-3.5 text-text-muted" /> Profile Avatar URL
                  </label>
                  <div className="flex gap-3">
                    <div className="relative size-12 rounded-xl overflow-hidden border border-border shrink-0 bg-surface-sunken flex items-center justify-center">
                      {image && !avatarPreviewError ? (
                        <Image
                          src={image}
                          alt="Avatar preview"
                          fill
                          sizes="48px"
                          unoptimized
                          onError={() => setAvatarPreviewError(true)}
                          className="object-cover"
                        />
                      ) : (
                        <User className="size-5 text-text-muted" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <Input
                        id="mentor-image-input"
                        type="url"
                        value={image}
                        onChange={(e) => {
                          setImage(e.target.value);
                          setAvatarPreviewError(false);
                          if (fieldErrors.image) setFieldErrors((p) => ({ ...p, image: undefined }));
                        }}
                        placeholder="https://images.unsplash.com/... or GitHub avatar"
                        className={fieldErrors.image ? "border-orange/60 focus-visible:ring-orange/30" : ""}
                      />
                      {fieldErrors.image ? (
                        <p className="text-xs text-orange font-medium">{fieldErrors.image}</p>
                      ) : (
                        <p className="text-[11px] text-text-muted">
                          Provide a direct public image URL (PNG, JPEG, WebP) for your mentor avatar.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Preset Avatar Suggestions if empty */}
                  {!image && (
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-text-muted">
                      <span>Quick avatars:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setImage("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80");
                          setAvatarPreviewError(false);
                          if (fieldErrors.image) setFieldErrors((p) => ({ ...p, image: undefined }));
                        }}
                        className="text-amber hover:underline font-medium"
                      >
                        Sample 1
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => {
                          setImage("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80");
                          setAvatarPreviewError(false);
                          if (fieldErrors.image) setFieldErrors((p) => ({ ...p, image: undefined }));
                        }}
                        className="text-amber hover:underline font-medium"
                      >
                        Sample 2
                      </button>
                    </div>
                  )}
                </div>

                {/* Mentor Bio */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="mentor-bio-input" className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                      <FileText className="size-3.5 text-text-muted" /> Mentor Biography & Background
                    </label>
                    <span
                      className={`text-[11px] font-mono ${
                        bioLength > 1000
                          ? "text-orange font-bold"
                          : bioLength < 10
                          ? "text-text-muted"
                          : "text-emerald font-medium"
                      }`}
                    >
                      {bioLength} / 1000 chars
                    </span>
                  </div>

                  <textarea
                    id="mentor-bio-input"
                    rows={6}
                    value={bio}
                    onChange={(e) => {
                      setBio(e.target.value);
                      if (fieldErrors.bio) setFieldErrors((p) => ({ ...p, bio: undefined }));
                    }}
                    placeholder="Describe your engineering background, production experience, and how you mentor students in 1-on-1 sprint reviews..."
                    className={`w-full rounded-xl border bg-surface-raised/40 px-3 py-2 text-xs text-text-primary placeholder:text-text-muted/60 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber transition-all resize-none ${
                      fieldErrors.bio ? "border-orange/60 focus:ring-orange/30" : "border-border"
                    }`}
                  />

                  {fieldErrors.bio ? (
                    <p className="text-xs text-orange font-medium">{fieldErrors.bio}</p>
                  ) : (
                    <p className="text-[11px] text-text-muted">
                      A compelling bio with at least 10 characters helps students understand your expertise when booking 1-on-1 sessions.
                    </p>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-between border-t border-border/60">
                  <span className="text-xs text-text-muted">
                    {isDirty ? "You have unsaved changes" : "All changes up to date"}
                  </span>

                  <Button
                    type="submit"
                    disabled={updateMutation.isPending || !isDirty}
                    className="gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-amber text-white hover:bg-amber-hover transition-colors shadow-xs"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" /> Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="size-3.5" /> Save Profile Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Expertise, Credentials & Live Preview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Expertise & Skills Badges Card */}
          <Card className="border border-border/80 shadow-xs bg-surface">
            <CardHeader className="pb-4 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                  <Code2 className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-text-primary">
                    Verified Expertise & Stack
                  </CardTitle>
                  <CardDescription className="text-xs text-text-muted mt-0.5">
                    Your technical competencies vetted during onboarding.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-5 space-y-4">
              <div>
                <span className="text-xs font-semibold text-text-secondary block mb-2">
                  Technical Tags & Domains
                </span>

                {mentor?.techStackTags && mentor.techStackTags.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.techStackTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-raised border border-border text-text-primary shadow-2xs hover:border-amber/30 transition-colors"
                      >
                        <span className="size-1.5 rounded-full bg-amber" />
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted italic">No tech stack tags registered yet.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/60 text-xs">
                <div>
                  <span className="text-text-muted block text-[11px]">Experience Level</span>
                  <span className="font-bold text-text-primary mt-0.5 inline-flex items-center gap-1">
                    <Sparkles className="size-3 text-amber" />
                    {mentor?.experienceLevel || "SENIOR"}
                  </span>
                </div>

                <div>
                  <span className="text-text-muted block text-[11px]">Approval Status</span>
                  <span className="font-bold text-emerald mt-0.5 inline-flex items-center gap-1">
                    <ShieldCheck className="size-3" />
                    {mentor?.approvalStatus || "APPROVED"}
                  </span>
                </div>
              </div>

              {/* Social / Portfolio Links */}
              <div className="pt-2 border-t border-border/60 space-y-2 text-xs">
                <span className="text-text-muted block text-[11px] font-semibold">
                  Professional Credentials
                </span>

                {mentor?.githubUrl ? (
                  <a
                    href={mentor.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-surface-raised/60 border border-border hover:border-amber/40 text-text-primary transition-colors"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <GithubIcon className="size-3.5 text-text-muted" /> GitHub Profile
                    </span>
                    <ExternalLink className="size-3 text-text-muted" />
                  </a>
                ) : (
                  <div className="p-2 rounded-lg bg-surface-raised/40 border border-border/60 text-text-muted text-[11px]">
                    No GitHub profile linked
                  </div>
                )}

                {mentor?.resumeUrl && (
                  <a
                    href={mentor.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-surface-raised/60 border border-border hover:border-amber/40 text-text-primary transition-colors"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <FileCode className="size-3.5 text-text-muted" /> Resume / CV
                    </span>
                    <ExternalLink className="size-3 text-text-muted" />
                  </a>
                )}
              </div>

              <div className="p-3 rounded-xl bg-amber-light/40 border border-amber/20 text-[11px] text-text-secondary leading-relaxed">
                <strong className="text-amber block font-semibold mb-0.5">Verified Credentials</strong>
                Domain tags and experience ratings are audited during application to uphold platform quality. Contact admin support if you need to add new specializations.
              </div>
            </CardContent>
          </Card>

          {/* Live Preview Card */}
          <Card className="border border-border/80 shadow-xs bg-linear-to-b from-surface to-surface-raised overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="size-4 text-amber" />
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Live Public Directory Preview
                  </CardTitle>
                </div>
                <span className="text-[10px] text-text-muted font-mono">Student View</span>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative size-12 rounded-xl overflow-hidden border border-border shrink-0 bg-surface-sunken">
                  {image && !avatarPreviewError ? (
                    <Image
                      src={image}
                      alt="Preview"
                      fill
                      sizes="48px"
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="size-full bg-linear-to-br from-amber to-amber-hover text-white flex items-center justify-center font-bold text-sm">
                      {(name || "M").charAt(0)}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-text-primary truncate">
                    {name || "Your Name"}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-light text-amber border border-amber/20">
                      {mentor?.experienceLevel || "SENIOR"}
                    </span>
                    <span className="text-[10px] text-emerald font-medium flex items-center gap-0.5">
                      <ShieldCheck className="size-3" /> Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio snippet preview */}
              <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed italic bg-surface/70 p-2.5 rounded-lg border border-border/60">
                &ldquo;{bio || "No biography entered yet. Introduce yourself to prospective students here."}&rdquo;
              </p>

              {/* Tag preview */}
              {mentor?.techStackTags && mentor.techStackTags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {mentor.techStackTags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-surface border border-border text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                  {mentor.techStackTags.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium text-text-muted">
                      +{mentor.techStackTags.length - 4} more
                    </span>
                  )}
                </div>
              )}

              {mentor?.id && (
                <div className="pt-2">
                  <Link
                    href={`/mentors/${mentor.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-surface border border-border hover:border-amber/40 text-text-secondary hover:text-amber transition-colors"
                  >
                    <ExternalLink className="size-3" /> Full Profile Page
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
