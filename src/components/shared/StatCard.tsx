import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  variant?: "default" | "amber" | "emerald" | "terracotta";
  className?: string;
}

const variantStyles = {
  default: {
    iconBg: "bg-surface-raised text-text-primary border-border",
    badgeBg: "bg-surface-raised text-text-muted",
  },
  amber: {
    iconBg: "bg-amber-light text-amber border-amber/20",
    badgeBg: "bg-amber-light text-amber",
  },
  emerald: {
    iconBg: "bg-emerald-light text-emerald border-emerald/20",
    badgeBg: "bg-emerald-light text-emerald",
  },
  terracotta: {
    iconBg: "bg-terracotta-light text-terracotta border-terracotta/20",
    badgeBg: "bg-terracotta-light text-terracotta",
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "p-6 rounded-xl bg-surface border border-border shadow-xs hover:shadow-sm transition-all flex flex-col justify-between",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <span className="text-sm font-medium text-text-muted">{title}</span>
        {Icon && (
          <div
            className={cn(
              "size-10 rounded-lg flex items-center justify-center border shrink-0",
              styles.iconBg
            )}
          >
            <Icon className="size-5" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-bold font-serif text-text-primary tracking-tight">
          {value}
        </div>
        {(subtitle || trend) && (
          <div className="flex items-center gap-2 text-xs">
            {trend && (
              <span
                className={cn(
                  "font-semibold px-1.5 py-0.5 rounded",
                  trend.isPositive ? "text-emerald bg-emerald-light" : "text-orange bg-orange-light"
                )}
              >
                {trend.value}
              </span>
            )}
            {subtitle && <span className="text-text-muted">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
