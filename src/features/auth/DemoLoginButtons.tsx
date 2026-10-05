"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GraduationCap, Code2, ShieldAlert, Loader2 } from "lucide-react";

interface DemoLoginButtonsProps {
  onSuccess?: () => void;
}

export default function DemoLoginButtons({ onSuccess }: DemoLoginButtonsProps) {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = React.useState<string | null>(null);

  const demoAccounts = [
    {
      role: "student",
      label: "Demo Student",
      email: "student@devmentor.com",
      password: "Student@123456",
      redirect: "/dashboard",
      icon: GraduationCap,
      variant: "outline" as const,
      badge: "Learner",
    },
    {
      role: "mentor",
      label: "Demo Mentor",
      email: "mentor@devmentor.com",
      password: "Mentor@123456",
      redirect: "/mentor",
      icon: Code2,
      variant: "outline" as const,
      badge: "Engineer",
    },
    {
      role: "admin",
      label: "Demo Admin",
      email: "admin@devmentor.com",
      password: "Admin@123456",
      redirect: "/admin",
      icon: ShieldAlert,
      variant: "outline" as const,
      badge: "Platform Admin",
    },
  ];

  const handleDemoLogin = async (acc: typeof demoAccounts[0]) => {
    setLoadingRole(acc.role);
    try {
      const result = await signIn.email({
        email: acc.email,
        password: acc.password,
      });

      if (result.error) {
        toast.error(result.error.message || `Failed to sign in as ${acc.label}`);
        return;
      }

      toast.success(`Welcome back! Signed in as ${acc.label}`);
      if (onSuccess) onSuccess();

      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo = searchParams.get("redirectTo");
      if (redirectTo && redirectTo.startsWith(`/${acc.role === "student" ? "dashboard" : acc.role}`)) {
        router.push(redirectTo);
      } else {
        router.push(acc.redirect);
      }
    } catch {
      toast.error("Network error during demo login. Please check server.");
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative flex items-center justify-center my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/80" />
        </div>
        <span className="relative bg-surface px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
          🚀 Instant Demo Logins
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {demoAccounts.map((acc) => {
          const Icon = acc.icon;
          const isLoading = loadingRole === acc.role;

          return (
            <Button
              key={acc.role}
              type="button"
              variant={acc.variant}
              disabled={Boolean(loadingRole)}
              onClick={() => handleDemoLogin(acc)}
              className="flex flex-col items-center justify-center h-auto py-3 px-2 gap-1.5 border border-border/80 hover:border-amber/60 hover:bg-surface-raised transition-all"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin text-amber" />
              ) : (
                <Icon className="size-4 text-amber" />
              )}
              <span className="text-xs font-semibold text-text-primary leading-tight">
                {acc.label}
              </span>
              <span className="text-[10px] text-text-muted leading-none">
                {acc.badge}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
