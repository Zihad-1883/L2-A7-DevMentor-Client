"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, role, refetch } = useAuthContext();

  React.useEffect(() => {
    const handleCallback = async () => {
      try {
        await refetch();
        const error = searchParams.get("error");
        if (error) {
          toast.error(`Authentication failed: ${error}`);
          router.push("/login");
          return;
        }

        toast.success("Successfully authenticated!");

        // Determine destination based on role
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "mentor") {
          router.push("/mentor");
        } else {
          router.push("/dashboard");
        }
      } catch {
        toast.error("Error processing authentication callback");
        router.push("/login");
      }
    };

    handleCallback();
  }, [refetch, searchParams, role, router]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-8 shadow-xs text-center space-y-4">
      <div className="size-12 rounded-full bg-amber-light text-amber mx-auto flex items-center justify-center">
        <Loader2 className="size-6 animate-spin" />
      </div>
      <h2 className="font-serif text-xl font-bold tracking-tight text-text-primary">
        Completing sign in...
      </h2>
      <p className="text-xs text-text-muted">
        Please wait while we verify your session and redirect to your dashboard.
      </p>
    </div>
  );
}
