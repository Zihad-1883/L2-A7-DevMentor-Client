"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, type UserProfileResponse } from "@/services/user.service";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/lib/validations/profile.schema";
import { queryKeys } from "@/lib/query-keys";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Image as ImageIcon,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Shield,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import { uploadService } from "@/services/upload.service";

interface ProfileDetailsFormProps {
  profile: UserProfileResponse;
}

export default function ProfileDetailsForm({ profile }: ProfileDetailsFormProps) {
  const queryClient = useQueryClient();
  const { refetch: refetchAuth } = useAuthContext();
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);
  const avatarFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: profile.name || "",
      image: profile.image || "",
      bio: profile.mentorProfile?.bio || "",
    },
  });

  const avatarUrl = watch("image");

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WebP, GIF).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file exceeds the 5MB limit.");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const res = await uploadService.uploadFile(file);
      setValue("image", res.url, { shouldDirty: true, shouldValidate: true });
      toast.success("Profile photo uploaded to Cloudinary!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to upload photo to Cloudinary");
    } finally {
      setIsUploadingAvatar(false);
      if (avatarFileInputRef.current) {
        avatarFileInputRef.current.value = "";
      }
    }
  };

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileInput) =>
      userService.updateMyProfile({
        name: data.name,
        image: data.image ? data.image : null,
        bio: data.bio || undefined,
      }),
    onSuccess: async (updated) => {
      setSuccessMessage("Your profile information has been successfully updated.");
      setErrorMessage(null);
      // Invalidate relevant queries
      queryClient.setQueryData(queryKeys.users.me, updated);
      await refetchAuth();
      reset({
        name: updated.name || "",
        image: updated.image || "",
        bio: updated.mentorProfile?.bio || "",
      });
      setTimeout(() => setSuccessMessage(null), 4000);
    },
    onError: (err: Error) => {
      setErrorMessage(err.message || "Failed to update profile. Please try again.");
      setSuccessMessage(null);
    },
  });

  const onSubmit = (values: UpdateProfileInput) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    updateMutation.mutate(values);
  };

  return (
    <Card className="border border-border/80 shadow-xs bg-surface">
      <CardHeader className="pb-4 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-amber-light text-amber flex items-center justify-center border border-amber/20">
            <User className="size-4" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-text-primary">
              Personal Information
            </CardTitle>
            <CardDescription className="text-xs text-text-muted mt-0.5">
              Update your public display name, avatar photo, and bio.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-light/50 border border-emerald/30 text-emerald text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-orange/10 border border-orange/30 text-orange text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
              <User className="size-3.5 text-text-muted" />
              Full Name <span className="text-orange">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. Alex Johnson"
              {...register("name")}
              className={`bg-surface-raised border-border/80 focus:border-amber ${
                errors.name ? "border-orange focus-visible:ring-orange" : ""
              }`}
            />
            {errors.name && (
              <p className="text-[11px] text-orange font-medium mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Address (Read-only) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                <Mail className="size-3.5 text-text-muted" />
                Email Address
              </label>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald bg-emerald-light px-2 py-0.5 rounded-full border border-emerald/20 flex items-center gap-1">
                <Shield className="size-2.5" /> Verified
              </span>
            </div>
            <Input
              type="email"
              disabled
              value={profile.email || ""}
              className="bg-surface-sunken/60 text-text-muted cursor-not-allowed border-border/60"
            />
            <p className="text-[11px] text-text-muted">
              Primary email address is linked to your authentication provider and cannot be changed directly.
            </p>
          </div>

          {/* Avatar Image URL + Upload */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                <ImageIcon className="size-3.5 text-text-muted" />
                Profile Avatar
              </label>
              <input
                ref={avatarFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={handleAvatarFileUpload}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploadingAvatar}
                onClick={() => avatarFileInputRef.current?.click()}
                className="h-7 text-[11px] gap-1.5 border-dashed border-border hover:border-amber/60 hover:bg-amber/5 text-text-secondary hover:text-amber"
              >
                {isUploadingAvatar ? (
                  <>
                    <Loader2 className="size-3 animate-spin text-amber" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud className="size-3 text-amber" />
                    Upload Image
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar preview"
                  className="size-10 rounded-full object-cover border border-border/80 shrink-0"
                />
              ) : (
                <div className="size-10 rounded-full bg-surface-sunken border border-border/60 flex items-center justify-center text-text-muted text-xs font-semibold shrink-0">
                  {profile.name?.slice(0, 2).toUpperCase() || "ME"}
                </div>
              )}
              <Input
                type="url"
                placeholder="https://images.unsplash.com/... or upload image directly"
                {...register("image")}
                className={`bg-surface-raised border-border/80 focus:border-amber flex-1 ${
                  errors.image ? "border-orange focus-visible:ring-orange" : ""
                }`}
              />
            </div>

            {errors.image && (
              <p className="text-[11px] text-orange font-medium mt-1">
                {errors.image.message}
              </p>
            )}
            <p className="text-[11px] text-text-muted">
              Upload a picture directly (stored securely on Cloudinary) or paste a custom image URL.
            </p>
          </div>

          {/* Bio / Headline */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
              <FileText className="size-3.5 text-text-muted" />
              Short Bio / About You
            </label>
            <textarea
              rows={3}
              placeholder="Aspiring full-stack engineer passionate about React, TypeScript, and clean architecture..."
              {...register("bio")}
              className={`w-full rounded-md border border-border/80 bg-surface-raised px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-amber focus:border-amber transition-colors ${
                errors.bio ? "border-orange focus:ring-orange" : ""
              }`}
            />
            {errors.bio && (
              <p className="text-[11px] text-orange font-medium mt-1">
                {errors.bio.message}
              </p>
            )}
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-end pt-2">
            <Button
              type="submit"
              disabled={updateMutation.isPending || !isDirty}
              className="gap-2 font-medium text-xs px-5 h-9"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
