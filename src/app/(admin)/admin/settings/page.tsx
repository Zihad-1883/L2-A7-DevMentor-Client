"use client";

import * as React from "react";
import CommissionSettingsForm from "@/features/admin/CommissionSettingsForm";
import {
  Settings,
  ShieldAlert,
  Server,
  Zap,
  CheckCircle2,
} from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20 mb-2">
            <Settings className="size-3.5" /> Platform Governance
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            System & Commission Settings
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-xl">
            Configure financial cut percentages, credit exchange rates, session commission rules, and platform governance policies.
          </p>
        </div>
      </div>

      {/* 2. Primary Configuration: Commission & Conversion Rates */}
      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-text-primary">
            Monetization & Commission Rates
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Default platform cut and exchange values applied across Sprint bookings, Cohort enrollments, and Code Reviews.
          </p>
        </div>

        <CommissionSettingsForm />
      </div>

      {/* 3. Platform Operational Policies & Architecture Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Sprint & Session Rules */}
        <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-border/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-amber-light text-amber flex items-center justify-center border border-amber/20">
              <Zap className="size-4.5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-text-primary">
                Sprint Session Rules
              </h3>
              <span className="text-[11px] text-text-muted">Standard booking constraints</span>
            </div>
          </div>

          <div className="space-y-3 text-xs divide-y divide-border/50">
            <div className="pt-2 flex items-center justify-between">
              <span className="text-text-secondary">Default Session Duration</span>
              <span className="font-mono font-semibold text-text-primary">60 minutes</span>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-text-secondary">Credit Cost per Session</span>
              <span className="font-mono font-semibold text-text-primary">50 Credits</span>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-text-secondary">Temporary Preview Lock Expiry</span>
              <span className="font-mono font-semibold text-text-primary">10 minutes</span>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-text-secondary">Code Review Platform Cut</span>
              <span className="font-mono font-semibold text-emerald">0% (100% to mentor)</span>
            </div>
          </div>
        </div>

        {/* Security & System Guardrails */}
        <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-border/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-surface-raised text-text-primary flex items-center justify-center border border-border">
              <Server className="size-4.5 text-text-muted" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-text-primary">
                Security & Guardrails
              </h3>
              <span className="text-[11px] text-text-muted">Platform safety policies</span>
            </div>
          </div>

          <div className="space-y-3 text-xs divide-y divide-border/50">
            <div className="pt-2 flex items-center justify-between">
              <span className="text-text-secondary">Published Cohort Limit / Mentor</span>
              <span className="font-mono font-semibold text-text-primary">1 Active Program</span>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-text-secondary">Admin Self-Block Protection</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald">
                <CheckCircle2 className="size-3.5" /> Enforced
              </span>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-text-secondary">Mentor Approval Required</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald">
                <CheckCircle2 className="size-3.5" /> Enforced
              </span>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-text-secondary">Authentication Engine</span>
              <span className="font-mono font-semibold text-text-primary">Better Auth</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-light/30 border border-amber/20 flex items-start gap-3">
        <ShieldAlert className="size-5 text-amber shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-text-primary">
            Dynamic Platform Settings Synchronizer Notice
          </h4>
          <p className="text-xs text-text-secondary leading-relaxed">
            The platform currently utilizes standard platform configuration constants across transaction calculation services. When backend endpoint <code className="font-mono text-[11px] bg-surface px-1 py-0.5 rounded border border-border">PATCH /api/v1/admin/settings</code> is implemented, all live percentage values will synchronize directly with the central PostgreSQL database.
          </p>
        </div>
      </div>
    </div>
  );
}
