"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/auth.schema";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      // In Better Auth or custom flow, trigger password reset request
      // Simulating API call response
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      toast.success("Password reset instructions sent to your email!");
    } catch {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xs text-center space-y-4">
        <div className="size-12 rounded-full bg-emerald-light text-emerald mx-auto flex items-center justify-center">
          <CheckCircle2 className="size-6" />
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-text-primary">
          Check your email ✉️
        </h1>
        <p className="text-sm text-text-muted leading-relaxed">
          We have sent password recovery instructions to{" "}
          <strong className="text-text-primary">{submittedEmail}</strong>.
        </p>
        <div className="pt-4">
          <Link href="/login">
            <Button variant="default" className="w-full gap-2">
              <ArrowLeft className="size-4" />
              <span>Back to Sign In</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
      <div className="space-y-1.5 text-center mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
          Forgot Password? 🔑
        </h1>
        <p className="text-sm text-text-muted">
          Enter your email and we will send you a recovery link
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3 size-4 text-text-muted pointer-events-none" />
            <input
              type="email"
              {...register("email")}
              placeholder="you@domain.com"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 pl-9 text-sm text-text-primary placeholder:text-text-muted focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/20"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-orange font-medium">{errors.email.message}</p>
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
              <span>Sending link...</span>
            </>
          ) : (
            <>
              <span>Send Reset Instructions</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-text-muted border-t border-border/40 pt-4">
        Remember your password?{" "}
        <Link href="/login" className="font-semibold text-amber hover:underline">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
