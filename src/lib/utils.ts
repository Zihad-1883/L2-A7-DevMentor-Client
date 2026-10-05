import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function creditsToBdt(credits: number): number {
  return credits * 4;
}

export function formatCredits(credits: number): string {
  return new Intl.NumberFormat("en-US").format(credits);
}

export function formatBdt(amount: number): string {
  return `৳${new Intl.NumberFormat("en-US").format(amount)}`;
}

export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: string | Date | undefined | null): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
