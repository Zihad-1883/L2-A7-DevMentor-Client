"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SmartAuthButtonProps {
  children?: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
  unauthRedirect?: string;
}

export default function SmartAuthButton({
  children = "Create Free Account",
  className,
  size = "lg",
  variant,
  unauthRedirect = "/register",
}: SmartAuthButtonProps) {
  const router = useRouter();
  const { isAuthenticated, role } = useAuthContext();

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push(unauthRedirect);
      return;
    }

    // Authenticated user
    toast.info("You're already logged in!", {
      description: "Redirecting you to your dashboard...",
      action: {
        label: "Go to Dashboard",
        onClick: () => {
          const target = role === "mentor" ? "/mentor" : role === "admin" ? "/admin" : "/dashboard";
          router.push(target);
        },
      },
    });

    const target = role === "mentor" ? "/mentor" : role === "admin" ? "/admin" : "/dashboard";
    router.push(target);
  };

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleClick}
      className={className}
    >
      {children}
    </Button>
  );
}
