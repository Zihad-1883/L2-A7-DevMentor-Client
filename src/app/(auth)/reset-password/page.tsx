"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/auth.schema";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock, Loader2, ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Password has been reset successfully! Please sign in.");
      router.push("/login");
    } catch {
      toast.error("Failed to reset password. The link may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
      <div className="space-y-1.5 text-center mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
          Set New Password 🔒
        </h1>
        <p className="text-sm text-text-muted">
          Create a new strong password for your DevMentor account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            New Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 size-4 text-text-muted pointer-events-none" />
            <input
              type="password"
              {...register("password")}
              placeholder="Minimum 6 characters"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 pl-9 text-sm text-text-primary placeholder:text-text-muted focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/20"
            />
          </div>
          {errors.password && (
            <p className="text-xs text-orange font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Confirm New Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 size-4 text-text-muted pointer-events-none" />
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Re-enter your new password"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 pl-9 text-sm text-text-primary placeholder:text-text-muted focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/20"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-orange font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 gap-2 font-semibold shadow-sm mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Updating password...</span>
            </>
          ) : (
            <>
              <span>Reset Password</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-text-muted border-t border-border/40 pt-4">
        Remembered your password?{" "}
        <Link href="/login" className="font-semibold text-amber hover:underline">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
