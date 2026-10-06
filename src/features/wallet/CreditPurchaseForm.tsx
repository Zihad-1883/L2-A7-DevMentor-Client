"use client";

import * as React from "react";
import Link from "next/link";
import {
  CreditCard,
  Coins,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ExternalLink,
  Lock,
  Zap,
  Sparkles,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { walletService } from "@/services/wallet.service";

const PRICING_PACKAGES = [
  {
    id: "quick-review",
    category: "Quick Review",
    credits: 10,
    amountBDT: 40,
    headline: "Bug Diagnosis & Snippet",
    bullets: [
      "Up to 150 lines of code",
      "Inline bug diagnosis & fixes",
      "2-Hour guaranteed SLA delivery",
    ],
    popular: false,
    badgeText: null,
  },
  {
    id: "deep-code-audit",
    category: "Deep Code Audit",
    credits: 50,
    amountBDT: 200,
    headline: "Full Architecture Audit",
    bullets: [
      "Full PR / repo architectural review",
      "Security & performance audit",
      "Direct Q&A follow-up & video",
    ],
    popular: false,
    badgeText: null,
  },
  {
    id: "sprint-pack",
    category: "Foundation Sprint Pack",
    credits: 150,
    amountBDT: 600,
    headline: "3 Dedicated 1-on-1 Sessions",
    bullets: [
      "Dedicated 1-on-1 live screen share",
      "Interactive pair debugging (50c/session)",
      "Escrow held per session completed",
    ],
    popular: true,
    badgeText: "Most Popular",
  },
  {
    id: "mastery-bundle",
    category: "Mastery Track Bundle",
    credits: 300,
    amountBDT: 1200,
    headline: "Full Track & Cohorts",
    bullets: [
      "Equivalent to 6 live sprint sessions",
      "Usable across cohorts & audits",
      "100% escrow milestone protected",
    ],
    popular: false,
    badgeText: "Best Value",
  },
];

export default function CreditPurchaseForm() {
  const [selectedCredits, setSelectedCredits] = React.useState<number>(50);
  const [customCredits, setCustomCredits] = React.useState<string>("");
  const [isCustom, setIsCustom] = React.useState<boolean>(false);
  const [isInitiating, setIsInitiating] = React.useState(false);

  // Fixed platform conversion rate: 1 Credit = 4 BDT
  const activeCredits = isCustom ? Number(customCredits) || 0 : selectedCredits;
  const totalBDT = activeCredits * 4;

  const handleSelectPackage = (credits: number) => {
    setIsCustom(false);
    setSelectedCredits(credits);
    setCustomCredits("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCustomCredits(val);
    setIsCustom(true);
  };

  const handleInitiateTopUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeCredits < 1) {
      toast.error("Minimum purchase is 1 Credit (4 BDT).");
      return;
    }

    if (totalBDT < 4 || totalBDT % 4 !== 0) {
      toast.error("Top-up amount must be a multiple of 4 BDT (1 Credit = 4 BDT).");
      return;
    }

    setIsInitiating(true);

    try {
      const response = await walletService.initiateTopUp(totalBDT);
      if (response?.bkashURL) {
        toast.info("Redirecting to secure bKash payment gateway...");
        window.location.href = response.bkashURL;
      } else {
        toast.error("Could not obtain checkout gateway URL from bKash.");
      }
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
      const msg =
        apiErr?.response?.data?.message || apiErr?.message || "Failed to initiate top-up.";
      toast.error(msg);
    } finally {
      setIsInitiating(false);
    }
  };

  return (
    <form
      onSubmit={handleInitiateTopUp}
      className="p-6 sm:p-8 rounded-3xl bg-surface border border-border space-y-8 shadow-xs"
    >
      {/* Header section matching landing page typography */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber block">
          Transparent Prepaid Credit Economics
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mt-1.5">
          No hidden fees. Pay only for the mentorship you consume.
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed max-w-3xl">
          Every service on DevMentor is priced in universal credits. Top up your wallet in Bangladeshi Taka (BDT) via bKash at a fixed conversion rate of{" "}
          <strong className="text-text-primary">1 Credit = 4 BDT</strong>.
        </p>
      </div>

      {/* Pricing Cards Grid (Identical structure to Landing Page) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PRICING_PACKAGES.map((pkg) => {
          const isSelected = !isCustom && selectedCredits === pkg.credits;
          return (
            <div
              key={pkg.id}
              onClick={() => handleSelectPackage(pkg.credits)}
              className={`rounded-2xl p-5 flex flex-col justify-between transition-all cursor-pointer relative ${isSelected
                ? "border-2 border-amber bg-surface-raised shadow-xs ring-2 ring-amber/20"
                : "border border-border bg-surface hover:border-amber/40 hover:bg-surface-raised/40"
                }`}
            >
              {pkg.badgeText && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs ${pkg.popular
                    ? "bg-amber text-surface-dark"
                    : "bg-surface-raised border border-border text-text-primary"
                    }`}
                >
                  {pkg.badgeText}
                </div>
              )}

              <div>
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider block ${pkg.popular ? "text-amber" : "text-text-muted"
                    }`}
                >
                  {pkg.category}
                </span>

                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="font-serif text-3xl font-bold text-text-primary">
                    {pkg.credits}
                  </span>
                  <span className="text-xs font-semibold text-amber">
                    Credits
                  </span>
                </div>

                <div className="text-xs text-text-muted mt-0.5 font-medium">
                  = ৳{pkg.amountBDT.toLocaleString()} BDT equivalent
                </div>

                <div className="text-xs font-semibold text-text-primary mt-3 pt-3 border-t border-border/60">
                  {pkg.headline}
                </div>

                <ul className="mt-2.5 space-y-2 text-xs text-text-secondary">
                  {pkg.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald shrink-0 mt-0.5" />
                      <span className="leading-tight">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
                <span className="text-[11px] text-text-muted font-medium">Click to Select</span>
                <span
                  className={`size-4 rounded-full border flex items-center justify-center ${isSelected
                    ? "border-amber bg-amber text-surface-dark"
                    : "border-border"
                    }`}
                >
                  {isSelected && <span className="size-1.5 rounded-full bg-surface-dark" />}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Amount Bar */}
      <div className="p-5 rounded-2xl bg-surface-raised/70 border border-border space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <label className="text-xs font-bold text-text-primary flex items-center gap-1.5 uppercase tracking-wide">
              <Coins className="size-3.5 text-amber" /> Custom Credit Top-Up
            </label>
            <p className="text-[11px] text-text-muted mt-0.5">
              Need a custom credit quantity? Enter any amount (1 Credit = ৳4 BDT).
            </p>
          </div>

          {isCustom && activeCredits > 0 && (
            <div className="text-xs font-bold text-amber font-mono">
              = ৳{totalBDT.toLocaleString()} BDT
            </div>
          )}
        </div>

        <div className="relative max-w-sm">
          <Coins className="size-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            type="text"
            inputMode="numeric"
            value={customCredits}
            onChange={handleCustomChange}
            placeholder="e.g. 150 (Credits)"
            className="h-10 pl-10 pr-24 bg-background text-sm font-mono"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
            Credits
          </div>
        </div>
      </div>

      {/* Checkout Total & bKash Submit Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-surface-raised/90 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
            Selected Deposit Total
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-text-primary">
              ৳{totalBDT.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-text-secondary uppercase">
              BDT
            </span>
            <span className="text-xs text-text-muted font-medium">
              ({activeCredits} universal credits)
            </span>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isInitiating || activeCredits <= 0}
          className="h-12 px-7 gap-2 bg-[#E2136E] hover:bg-[#c90f61] text-white font-bold text-sm cursor-pointer shadow-xs disabled:opacity-50"
        >
          {isInitiating ? (
            "Connecting to bKash Gateway..."
          ) : (
            <>
              Top Up with bKash
              <ExternalLink className="size-4" />
            </>
          )}
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-text-muted pt-1">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-emerald" /> 256-bit Encrypted Checkout
        </span>
        <span>•</span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-emerald" /> Instant Crediting to DevWallet
        </span>
        <span>•</span>
        <span className="flex items-center gap-1.5">
          <Lock className="size-3.5 text-amber" /> 100% Escrow Milestone Protection
        </span>
      </div>
    </form>
  );
}
