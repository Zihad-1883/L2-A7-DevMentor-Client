"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import type { PlatformSettingsResponse } from "@/types/admin.types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Percent,
  Coins,
  Save,
  RotateCcw,
  Loader2,
  AlertCircle,
  Calculator,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

const COMMISSION_PRESETS = [10, 15, 20, 25];
const SPRINT_CREDIT_PRESETS = [25, 50, 75, 100];
const BDT_PER_CREDIT = 4;

export default function CommissionSettingsForm() {
  const {
    data: settings,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.settings,
    queryFn: () => adminService.getPlatformSettings(),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <Card className="border border-border/80 shadow-xs bg-surface p-12 flex flex-col items-center justify-center gap-3 text-text-muted">
        <Loader2 className="size-8 animate-spin text-amber" />
        <p className="text-sm font-medium">Loading platform configuration settings...</p>
      </Card>
    );
  }

  if (error || !settings) {
    return (
      <Card className="border border-orange/30 bg-orange/5 p-8 text-center space-y-3">
        <AlertCircle className="size-8 text-orange mx-auto" />
        <h3 className="font-bold text-text-primary text-sm">Failed to Load Platform Settings</h3>
        <p className="text-xs text-text-secondary max-w-md mx-auto">
          {error instanceof Error ? error.message : "Unable to retrieve platform configuration."}
        </p>
        <Button
          type="button"
          onClick={() => refetch()}
          size="sm"
          className="bg-amber text-white hover:bg-amber-hover text-xs cursor-pointer"
        >
          Retry Connection
        </Button>
      </Card>
    );
  }

  return (
    <CommissionSettingsFormFields
      key={settings.updatedAt}
      initialSettings={settings}
    />
  );
}

function CommissionSettingsFormFields({
  initialSettings,
}: {
  initialSettings: PlatformSettingsResponse;
}) {
  const queryClient = useQueryClient();

  const [commissionPercent, setCommissionPercent] = React.useState<number>(
    initialSettings.sessionCommissionPercent
  );
  const [sprintCredits, setSprintCredits] = React.useState<number>(
    initialSettings.sprintCreditPerSession
  );

  const isDirty =
    commissionPercent !== initialSettings.sessionCommissionPercent ||
    sprintCredits !== initialSettings.sprintCreditPerSession;

  const updateMutation = useMutation({
    mutationFn: (data: { sessionCommissionPercent: number; sprintCreditPerSession: number }) =>
      adminService.updatePlatformSettings(data),
    onSuccess: (updated) => {
      toast.success("Platform commission & sprint rate settings updated successfully!");
      queryClient.setQueryData(queryKeys.admin.settings, updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update platform settings. Please try again.");
    },
  });

  const handleReset = () => {
    setCommissionPercent(initialSettings.sessionCommissionPercent);
    setSprintCredits(initialSettings.sprintCreditPerSession);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (commissionPercent < 0 || commissionPercent > 100) {
      toast.error("Commission percent must be between 0% and 100%");
      return;
    }

    if (sprintCredits < 1 || sprintCredits > 5000) {
      toast.error("Sprint credits must be between 1 and 5,000 credits");
      return;
    }

    updateMutation.mutate({
      sessionCommissionPercent: commissionPercent,
      sprintCreditPerSession: sprintCredits,
    });
  };

  // Live simulation calculations
  const simulatedCostBdt = sprintCredits * BDT_PER_CREDIT;
  const platformCutBdt = Math.round((simulatedCostBdt * commissionPercent) / 100);
  const mentorEarningsBdt = simulatedCostBdt - platformCutBdt;
  const platformCutCredits = Math.round((sprintCredits * commissionPercent) / 100);
  const mentorEarningsCredits = sprintCredits - platformCutCredits;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Settings Fields */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border border-border/80 shadow-xs bg-surface">
            <CardHeader className="pb-4 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-amber-light text-amber flex items-center justify-center border border-amber/20">
                    <Percent className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-text-primary">
                      Commission & Rate Parameters
                    </CardTitle>
                    <CardDescription className="text-xs text-text-muted mt-0.5">
                      Configure dynamic fee rates applied to student bookings and sprint sessions.
                    </CardDescription>
                  </div>
                </div>

                {initialSettings.updatedAt && (
                  <span className="text-[10px] text-text-muted font-mono">
                    Updated {formatDate(initialSettings.updatedAt)}
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Field 1: Commission Percentage */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="commission-input"
                    className="text-xs font-semibold text-text-secondary flex items-center gap-1.5"
                  >
                    <Percent className="size-3.5 text-text-muted" /> Platform Session Commission Rate
                  </label>
                  <span className="text-xs font-mono font-bold text-amber">
                    {commissionPercent}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Input
                    id="commission-input"
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={commissionPercent}
                    onChange={(e) => setCommissionPercent(Number(e.target.value))}
                    className="w-28 font-mono text-sm font-bold"
                  />
                  <div className="flex flex-wrap items-center gap-1.5 flex-1">
                    {COMMISSION_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setCommissionPercent(preset)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          commissionPercent === preset
                            ? "bg-amber text-white border-amber shadow-2xs"
                            : "bg-surface-raised border-border text-text-secondary hover:text-text-primary hover:border-amber/40"
                        }`}
                      >
                        {preset}%
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-text-muted leading-relaxed">
                  Percentage withheld from mentor payouts on each confirmed sprint session and cohort session. The remainder ({100 - commissionPercent}%) is deposited directly into the mentor&apos;s wallet.
                </p>
              </div>

              {/* Field 2: Sprint Credits Per Session */}
              <div className="space-y-3 pt-4 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="credits-input"
                    className="text-xs font-semibold text-text-secondary flex items-center gap-1.5"
                  >
                    <Coins className="size-3.5 text-text-muted" /> Base Sprint Credits per Session
                  </label>
                  <span className="text-xs font-mono font-bold text-text-primary">
                    {sprintCredits} Credits (৳{(sprintCredits * BDT_PER_CREDIT).toLocaleString()} BDT)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Input
                    id="credits-input"
                    type="number"
                    min={1}
                    max={5000}
                    step={5}
                    value={sprintCredits}
                    onChange={(e) => setSprintCredits(Number(e.target.value))}
                    className="w-28 font-mono text-sm font-bold"
                  />
                  <div className="flex flex-wrap items-center gap-1.5 flex-1">
                    {SPRINT_CREDIT_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setSprintCredits(preset)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          sprintCredits === preset
                            ? "bg-amber text-white border-amber shadow-2xs"
                            : "bg-surface-raised border-border text-text-secondary hover:text-text-primary hover:border-amber/40"
                        }`}
                      >
                        {preset} Cr
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-text-muted leading-relaxed">
                  Fixed wallet credit charge required per 1-on-1 sprint review session. At the platform exchange parity (1 Credit = ৳4.00 BDT), students purchase these credits via bKash.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <div className="text-xs text-text-muted">
                  {isDirty ? (
                    <span className="text-amber font-medium inline-flex items-center gap-1">
                      <Zap className="size-3" /> Unsaved changes pending
                    </span>
                  ) : (
                    <span>All settings in sync with database</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={!isDirty || updateMutation.isPending}
                    size="sm"
                    className="gap-1.5 text-xs text-text-secondary cursor-pointer"
                  >
                    <RotateCcw className="size-3.5" /> Reset
                  </Button>

                  <Button
                    type="submit"
                    disabled={!isDirty || updateMutation.isPending}
                    size="sm"
                    className="gap-1.5 text-xs bg-amber text-white hover:bg-amber-hover font-semibold shadow-2xs cursor-pointer"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="size-3.5" /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Settlement Simulator & Policies */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Simulator Card */}
          <Card className="border border-border/80 shadow-xs bg-surface">
            <CardHeader className="pb-4 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-emerald/10 text-emerald flex items-center justify-center border border-emerald/20">
                  <Calculator className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-text-primary">
                    Live Session Settlement Breakdown
                  </CardTitle>
                  <CardDescription className="text-xs text-text-muted mt-0.5">
                    Real-time transaction simulation based on active parameters.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-5 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-surface-raised/60 border border-border/70 space-y-2">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                  Student Session Booking Cost
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-text-primary">
                    {sprintCredits} Credits
                  </span>
                  <span className="text-sm font-mono text-text-secondary font-semibold">
                    ৳{simulatedCostBdt.toLocaleString()} BDT
                  </span>
                </div>
              </div>

              {/* Split visualization */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary font-medium">Split Distribution</span>
                  <span className="text-[11px] font-mono text-text-muted">
                    {100 - commissionPercent}% Mentor / {commissionPercent}% Platform
                  </span>
                </div>

                <div className="h-2.5 w-full rounded-full bg-surface-sunken overflow-hidden flex">
                  <div
                    className="bg-emerald transition-all duration-300"
                    style={{ width: `${100 - commissionPercent}%` }}
                    title={`Mentor Share: ${100 - commissionPercent}%`}
                  />
                  <div
                    className="bg-amber transition-all duration-300"
                    style={{ width: `${commissionPercent}%` }}
                    title={`Platform Fee: ${commissionPercent}%`}
                  />
                </div>
              </div>

              {/* Payout breakdowns */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-raised/40 border border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald shrink-0" />
                    <div>
                      <span className="font-semibold text-text-primary block">Mentor Net Wallet Credit</span>
                      <span className="text-[10px] text-text-muted">{100 - commissionPercent}% Net Earnings</span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-emerald block">+{mentorEarningsCredits} Cr</span>
                    <span className="text-[10px] text-text-muted">৳{mentorEarningsBdt.toLocaleString()} BDT</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-raised/40 border border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-amber shrink-0" />
                    <div>
                      <span className="font-semibold text-text-primary block">Platform Treasury Margin</span>
                      <span className="text-[10px] text-text-muted">{commissionPercent}% System Commission</span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-amber block">+{platformCutCredits} Cr</span>
                    <span className="text-[10px] text-text-muted">৳{platformCutBdt.toLocaleString()} BDT</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-light/30 border border-amber/20 text-[11px] text-text-secondary leading-relaxed">
                <strong className="text-amber font-semibold block mb-0.5">Platform Integrity Note</strong>
                Changes saved here instantly apply across all new sprint requests and cohort session escrow settlements. Ongoing active sessions maintain their existing locked credit agreements.
              </div>
            </CardContent>
          </Card>

          {/* Platform Policy Card */}
          <Card className="border border-border/80 shadow-xs bg-surface p-5 space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald" />
              <h4 className="font-bold text-text-primary">Policy & Conversion Standards</h4>
            </div>
            <ul className="space-y-2 text-text-muted text-[11px] leading-relaxed">
              <li className="flex items-start gap-1.5">
                <ArrowRight className="size-3 text-amber shrink-0 mt-0.5" />
                <span><strong>Fixed Parity:</strong> 1 Credit = ৳4.00 BDT. Top-ups and payouts remain bound to this base exchange rate.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ArrowRight className="size-3 text-amber shrink-0 mt-0.5" />
                <span><strong>Automatic Escrow:</strong> Credits are deducted from student wallets on confirmation and held in escrow until session completion.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ArrowRight className="size-3 text-amber shrink-0 mt-0.5" />
                <span><strong>Admin Oversight:</strong> Commission takes are accounted into platform financial analytics automatically.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </form>
  );
}
