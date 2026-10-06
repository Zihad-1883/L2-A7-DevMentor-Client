"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/lib/validations/profile.schema";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

export default function ChangePasswordForm() {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      revokeOtherSessions: true,
    },
  });

  const onSubmit = async (values: ChangePasswordInput) => {
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: values.revokeOtherSessions,
      });

      if (response.error) {
        setErrorMessage(
          response.error.message ||
            "Failed to change password. Please ensure your current password is correct."
        );
      } else {
        setSuccessMessage("Your password has been changed successfully.");
        reset();
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while updating your password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-border/80 shadow-xs bg-surface">
      <CardHeader className="pb-4 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-indigo-light text-indigo flex items-center justify-center border border-indigo/20">
            <Lock className="size-4" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-text-primary">
              Change Password
            </CardTitle>
            <CardDescription className="text-xs text-text-muted mt-0.5">
              Ensure your account is protected with a strong, secure password.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
              <KeyRound className="size-3.5 text-text-muted" />
              Current Password <span className="text-orange">*</span>
            </label>
            <div className="relative">
              <Input
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                {...register("currentPassword")}
                className={`pr-10 bg-surface-raised border-border/80 focus:border-amber ${
                  errors.currentPassword ? "border-orange focus-visible:ring-orange" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-[11px] text-orange font-medium mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
              <Lock className="size-3.5 text-text-muted" />
              New Password <span className="text-orange">*</span>
            </label>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                placeholder="Minimum 6 characters"
                {...register("newPassword")}
                className={`pr-10 bg-surface-raised border-border/80 focus:border-amber ${
                  errors.newPassword ? "border-orange focus-visible:ring-orange" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-[11px] text-orange font-medium mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
              <Lock className="size-3.5 text-text-muted" />
              Confirm New Password <span className="text-orange">*</span>
            </label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="Re-type new password"
                {...register("confirmPassword")}
                className={`pr-10 bg-surface-raised border-border/80 focus:border-amber ${
                  errors.confirmPassword ? "border-orange focus-visible:ring-orange" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-orange font-medium mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Revoke Sessions Checkbox */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="revokeOtherSessions"
              {...register("revokeOtherSessions")}
              className="mt-0.5 rounded border-border text-amber focus:ring-amber"
            />
            <label
              htmlFor="revokeOtherSessions"
              className="text-xs text-text-secondary cursor-pointer leading-tight"
            >
              Log out of all other active sessions across browsers and devices
            </label>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-end pt-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 font-medium text-xs px-5 h-9"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <ShieldCheck className="size-3.5" />
                  Update Password
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
