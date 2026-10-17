"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

interface ThemeToggleProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export default function ThemeToggle({
  className = "",
  size = "icon",
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  // Safe SSR mounting check using useSyncExternalStore (eliminates cascading render warnings)
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div
        className={`size-9 rounded-full bg-surface-raised border border-border/60 animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size={size}
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative size-9 rounded-full border border-border/70 hover:bg-surface-raised hover:border-amber/40 transition-all cursor-pointer ${className}`}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-label="Toggle visual theme"
    >
      <Sun className="size-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-amber" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
