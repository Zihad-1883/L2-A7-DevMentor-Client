"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@/lib/auth-client";
import {
  registerSchema,
  type RegisterInput,
} from "@/lib/validations/auth.schema";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const result = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        toast.error(result.error.message || "Registration failed");
        return;
      }

      toast.success("Account created successfully! Welcome to DevMentor.");
      router.push("/dashboard");
    } catch {
      toast.error("Network error during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
      <div className="space-y-1.5 text-center mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
          Create an account 🚀
        </h1>
        <p className="text-sm text-text-muted">
          Start accelerating your developer skills with 1-on-1 sprint mentorship
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Full Name
          </label>
          <div className="relative flex items-center">
            <User className="absolute left-3 size-4 text-text-muted pointer-events-none" />
            <input
              type="text"
              {...register("name")}
              placeholder="e.g. Rafin Ahmed"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 pl-9 text-sm text-text-primary placeholder:text-text-muted focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/20"
            />
          </div>
          {errors.name && (
            <p className="text-xs text-orange font-medium">{errors.name.message}</p>
          )}
        </div>

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
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Password
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
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 size-4 text-text-muted pointer-events-none" />
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Re-enter your password"
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
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-text-muted border-t border-border/40 pt-4">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-amber hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
