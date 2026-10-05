"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/lib/auth-client";
import { loginSchema, type LoginInput } from "@/lib/validations/auth.schema";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/components/providers/AuthProvider";
import DemoLoginButtons from "./DemoLoginButtons";
import { toast } from "sonner";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const { user, isAuthenticated, isPending, role } = useAuthContext();

  const [isLoading, setIsLoading] = React.useState(false);

  // If already authenticated, inform the user and redirect to their role dashboard
  React.useEffect(() => {
    if (!isPending && isAuthenticated) {
      toast.info("You are already logged in!", {
        description: "Redirecting you to your dashboard...",
      });
      const target =
        redirectTo && redirectTo.startsWith(`/${role === "student" ? "dashboard" : role}`)
          ? redirectTo
          : role === "mentor"
          ? "/mentor"
          : role === "admin"
          ? "/admin"
          : "/dashboard";
      router.replace(target);
    }
  }, [isPending, isAuthenticated, role, redirectTo, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        toast.error(result.error.message || "Invalid email or password");
        return;
      }

      toast.success("Welcome back to DevMentor!");
      const targetUrl = redirectTo || "/dashboard";
      window.location.assign(targetUrl);
    } catch {
      toast.error("Failed to sign in. Please verify your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
      <div className="space-y-1.5 text-center mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
          Welcome back 👋
        </h1>
        <p className="text-sm text-text-muted">
          Sign in to access your sprints, cohorts, and reviews
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

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-amber hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 size-4 text-text-muted pointer-events-none" />
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 pl-9 text-sm text-text-primary placeholder:text-text-muted focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/20"
            />
          </div>
          {errors.password && (
            <p className="text-xs text-orange font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 gap-2 font-semibold shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <div className="pt-2">
        <DemoLoginButtons />
      </div>

      <div className="mt-6 text-center text-xs text-text-muted border-t border-border/40 pt-4">
        Don&apos;t have an account yet?{" "}
        <Link href="/register" className="font-semibold text-amber hover:underline">
          Create account
        </Link>
      </div>
    </div>
  );
}
