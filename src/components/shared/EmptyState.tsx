import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

export default function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-surface-raised/30",
        className
      )}
    >
      <div className="size-12 rounded-full bg-surface-raised border border-border flex items-center justify-center text-text-muted mb-4 shadow-2xs">
        <Icon className="size-6 text-amber" />
      </div>
      <h3 className="font-serif text-lg font-semibold text-text-primary mb-1">
        {title}
      </h3>
      <p className="text-sm text-text-muted max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && (
        <>
          {action.href ? (
            <Button asChild variant="default" size="sm">
              <a href={action.href}>{action.label}</a>
            </Button>
          ) : (
            <Button onClick={action.onClick} variant="default" size="sm">
              {action.label}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
