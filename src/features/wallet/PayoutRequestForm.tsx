"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Banknote,
  Smartphone,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { payoutService } from "@/services/payout.service";
import { queryKeys } from "@/lib/query-keys";
import { payoutRequestSchema } from "@/lib/validations/payout.schema";
import { toast } from "sonner";

interface PayoutRequestFormProps {
  currentBalance: number; // in credits
  equivalentBDT: number; // in BDT (credits * 4)
  onSuccess?: () => void;
}

const CREDIT_RATE = 4; // 1 Credit = 4 BDT
const MIN_WITHDRAWAL_CREDITS = 50;
const MIN_WITHDRAWAL_BDT = 200;
const MAX_WITHDRAWAL_BDT = 100000;

export default function PayoutRequestForm({
  currentBalance,
  equivalentBDT,
  onSuccess,
}: PayoutRequestFormProps) {
  const queryClient = useQueryClient();

  const [amountStr, setAmountStr] = React.useState<string>("");
  const [bkashNumber, setBkashNumber] = React.useState<string>("");
  const [errors, setErrors] = React.useState<{ amount?: string; bkashNumber?: string }>({});

  const amountNumber = parseInt(amountStr) || 0;
  const creditsNeeded = Math.ceil(amountNumber / CREDIT_RATE);
  const remainingCredits = Math.max(0, currentBalance - creditsNeeded);
  const hasEnoughBalance = currentBalance >= MIN_WITHDRAWAL_CREDITS && amountNumber <= equivalentBDT;

  // Preset quick selections
  const handlePresetSelect = (bdt: number) => {
    const capped = Math.min(bdt, equivalentBDT);
    setAmountStr(capped.toString());
    setErrors((prev) => ({ ...prev, amount: undefined }));
  };

  const handleMaxSelect = () => {
    // Max available BDT
    const maxBdt = Math.floor(currentBalance * CREDIT_RATE);
    setAmountStr(maxBdt.toString());
    setErrors((prev) => ({ ...prev, amount: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: { amount?: string; bkashNumber?: string } = {};

    const schemaResult = payoutRequestSchema.safeParse({
      amount: amountNumber,
      bkashNumber: bkashNumber.trim(),
    });

    if (!schemaResult.success) {
      const fieldErrors = schemaResult.error.flatten().fieldErrors;
      if (fieldErrors.amount?.[0]) newErrors.amount = fieldErrors.amount[0];
      if (fieldErrors.bkashNumber?.[0]) newErrors.bkashNumber = fieldErrors.bkashNumber[0];
    }

    if (amountNumber > equivalentBDT) {
      newErrors.amount = `Insufficient balance. You have ৳${equivalentBDT.toLocaleString()} (${currentBalance} Credits) available.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const withdrawMutation = useMutation({
    mutationFn: async () => {
      return await payoutService.createPayoutRequest({
        amountBdt: amountNumber,
        method: "BKASH",
        accountNumber: bkashNumber.trim(),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.me });
      queryClient.invalidateQueries({ queryKey: ["mentor", "wallet"] });
      queryClient.invalidateQueries({ queryKey: ["mentor", "payouts"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "payouts"] });
      toast.success(
        data.message ||
          `Successfully submitted payout request of ৳${amountNumber.toLocaleString()} to bKash ${bkashNumber}!`
      );
      setAmountStr("");
      setBkashNumber("");
      setErrors({});
      onSuccess?.();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to submit payout request. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    withdrawMutation.mutate();
  };

  const isEligible = currentBalance >= MIN_WITHDRAWAL_CREDITS;

  return (
    <div className="rounded-3xl bg-surface border border-border p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
              <Banknote className="size-3.5" /> Cash-Out Withdrawal
            </span>
            <span className="text-xs font-semibold text-text-muted">
              bKash Direct Payout
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-primary">
            Request BDT Cash-Out
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Convert earned credits directly into Bangladeshi Taka (BDT) and transfer to your bKash wallet.
          </p>
        </div>

        {/* Exchange Rate Badge */}
        <div className="sm:text-right shrink-0 p-3 rounded-2xl bg-surface-raised border border-border">
          <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Conversion Rate
          </p>
          <p className="font-mono text-base font-bold text-text-primary">
            1 Credit = <span className="text-emerald">৳4.00 BDT</span>
          </p>
        </div>
      </div>

      {/* Low Balance Warning */}
      {!isEligible && (
        <div className="p-4 rounded-2xl bg-amber-light border border-amber/30 text-amber flex items-start gap-3 text-xs leading-relaxed">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Minimum Payout Threshold:</strong> You have{" "}
            <strong>{currentBalance} Credits (৳{equivalentBDT.toLocaleString()})</strong>. A minimum of{" "}
            <strong>50 Credits (৳200 BDT)</strong> is required to request a cash-out. Earn more by
            completing code reviews, sprints, or cohort programs.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Amount Input & Quick Presets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
              <span>Withdrawal Amount (BDT)</span>
              <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-text-muted">
              Available:{" "}
              <strong className="text-emerald font-semibold font-mono">
                ৳{equivalentBDT.toLocaleString()}
              </strong>
            </span>
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-text-muted">
              ৳
            </span>
            <Input
              type="number"
              min={MIN_WITHDRAWAL_BDT}
              max={MAX_WITHDRAWAL_BDT}
              step={100}
              placeholder="e.g. 500"
              value={amountStr}
              onChange={(e) => {
                setAmountStr(e.target.value);
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
              }}
              disabled={!isEligible || withdrawMutation.isPending}
              className={`pl-9 font-mono text-base font-bold bg-surface-raised h-12 rounded-2xl ${
                errors.amount ? "border-rose-500 focus:ring-rose-500" : ""
              }`}
            />
          </div>

          {errors.amount && (
            <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
              <AlertCircle className="size-3.5 shrink-0" />
              {errors.amount}
            </p>
          )}

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-semibold text-text-muted mr-1">Quick Fill:</span>
            {[200, 500, 1000, 2000, 5000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                disabled={!isEligible || preset > equivalentBDT || withdrawMutation.isPending}
                className="px-3 py-1 rounded-xl text-xs font-semibold font-mono bg-surface-raised hover:bg-amber-light hover:text-amber border border-border transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ৳{preset.toLocaleString()}
              </button>
            ))}
            <button
              type="button"
              onClick={handleMaxSelect}
              disabled={!isEligible || equivalentBDT < MIN_WITHDRAWAL_BDT || withdrawMutation.isPending}
              className="px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/30 hover:bg-amber hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Withdraw All
            </button>
          </div>
        </div>

        {/* 2. bKash Mobile Number */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
            <Smartphone className="size-3.5 text-amber" />
            <span>bKash Account Number</span>
            <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Input
              type="tel"
              placeholder="017XXXXXXXX"
              maxLength={11}
              value={bkashNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setBkashNumber(val);
                if (errors.bkashNumber) setErrors((prev) => ({ ...prev, bkashNumber: undefined }));
              }}
              disabled={!isEligible || withdrawMutation.isPending}
              className={`font-mono text-sm tracking-widest bg-surface-raised h-12 rounded-2xl ${
                errors.bkashNumber ? "border-rose-500 focus:ring-rose-500" : ""
              }`}
            />
          </div>
          {errors.bkashNumber ? (
            <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
              <AlertCircle className="size-3.5 shrink-0" />
              {errors.bkashNumber}
            </p>
          ) : (
            <p className="text-[11px] text-text-muted">
              Enter your active 11-digit Bangladeshi bKash mobile number (Personal or Merchant).
            </p>
          )}
        </div>

        {/* 3. Live Breakdown HUD */}
        {amountNumber > 0 && (
          <div className="p-4 rounded-2xl bg-surface-raised border border-border/80 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-text-muted">
              <span>Requested Cash-Out Amount</span>
              <strong className="text-text-primary font-mono font-bold">
                ৳{amountNumber.toLocaleString()} BDT
              </strong>
            </div>
            <div className="flex items-center justify-between text-text-muted">
              <span>Credits to be Deducted</span>
              <strong className="text-rose-500 font-mono font-bold">
                -{creditsNeeded} Credits
              </strong>
            </div>
            <div className="pt-2 border-t border-border flex items-center justify-between text-text-primary">
              <span className="font-semibold">Remaining Wallet Balance</span>
              <strong className="text-emerald font-mono font-bold">
                {remainingCredits} Credits (৳{(remainingCredits * CREDIT_RATE).toLocaleString()})
              </strong>
            </div>
          </div>
        )}

        {/* 4. Action Button */}
        <Button
          type="submit"
          disabled={!isEligible || !hasEnoughBalance || withdrawMutation.isPending}
          className="w-full h-12 rounded-2xl bg-amber text-white hover:bg-amber-hover font-semibold text-sm shadow-sm gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {withdrawMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Processing Payout Transfer...</span>
            </>
          ) : (
            <>
              <span>Confirm &amp; Cash Out ৳{amountNumber > 0 ? amountNumber.toLocaleString() : "BDT"}</span>
              <ArrowUpRight className="size-4" />
            </>
          )}
        </Button>

        {/* Security Assurance */}
        <div className="flex items-center justify-center gap-2 text-center text-xs text-text-muted pt-1">
          <ShieldCheck className="size-4 text-emerald shrink-0" />
          <span>Instant ledger settlement with automated bKash payout logging.</span>
        </div>
      </form>
    </div>
  );
}
