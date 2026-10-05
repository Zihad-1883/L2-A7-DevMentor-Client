import * as React from "react";
import { cn, formatCredits, creditsToBdt, formatBdt } from "@/lib/utils";
import { Coins } from "lucide-react";

interface CreditDisplayProps {
  credits: number;
  showCurrency?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function CreditDisplay({
  credits,
  showCurrency = false,
  size = "md",
  className,
}: CreditDisplayProps) {
  const sizeStyles = {
    sm: {
      pill: "px-2.5 py-1 text-xs gap-1.5",
      icon: "size-3.5",
      num: "font-semibold",
    },
    md: {
      pill: "px-3 py-1.5 text-sm gap-2",
      icon: "size-4",
      num: "font-bold",
    },
    lg: {
      pill: "px-4 py-2 text-base gap-2.5",
      icon: "size-5",
      num: "font-extrabold text-lg",
    },
  };

  const style = sizeStyles[size];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-amber-50 border border-amber/30 text-amber shadow-2xs",
        style.pill,
        className
      )}
    >
      <Coins className={cn("text-amber shrink-0", style.icon)} />
      <span className={cn("text-text-primary", style.num)}>
        {formatCredits(credits)} Credits
      </span>
      {showCurrency && (
        <span className="text-text-muted text-xs border-l border-amber/20 pl-1.5 font-normal">
          ({formatBdt(creditsToBdt(credits))})
        </span>
      )}
    </div>
  );
}
