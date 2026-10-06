"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Sliders,
  CheckCircle2,
  Mail,
  Zap,
  BookOpen,
  Code2,
  Save,
} from "lucide-react";

interface NotificationPreferences {
  emailSprintUpdates: boolean;
  emailCohortAnnouncements: boolean;
  emailCodeReviewDelivery: boolean;
  marketingEmails: boolean;
}

export default function NotificationPreferencesForm() {
  const [preferences, setPreferences] = React.useState<NotificationPreferences>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("devmentor_preferences");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      emailSprintUpdates: true,
      emailCohortAnnouncements: true,
      emailCodeReviewDelivery: true,
      marketingEmails: false,
    };
  });

  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const toggle = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("devmentor_preferences", JSON.stringify(preferences));
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <Card className="border border-border/80 shadow-xs bg-surface">
      <CardHeader className="pb-4 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-emerald-light text-emerald flex items-center justify-center border border-emerald/20">
            <Sliders className="size-4" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-text-primary">
              Preferences & Notifications
            </CardTitle>
            <CardDescription className="text-xs text-text-muted mt-0.5">
              Choose what notifications and platform updates you want to receive.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSave} className="space-y-4">
          {savedSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-light/50 border border-emerald/30 text-emerald text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>Preferences saved successfully!</span>
            </div>
          )}

          <div className="divide-y divide-border/60">
            {/* Sprint updates */}
            <div className="py-3 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                  <Zap className="size-3.5 text-amber" /> 1-on-1 Sprint Updates
                </span>
                <p className="text-xs text-text-muted">
                  Get notified when a mentor claims your sprint or schedules upcoming sessions.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailSprintUpdates}
                  onChange={() => toggle("emailSprintUpdates")}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-surface-sunken peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber"></div>
              </label>
            </div>

            {/* Cohort announcements */}
            <div className="py-3 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                  <BookOpen className="size-3.5 text-indigo" /> Cohort Announcements & Class Links
                </span>
                <p className="text-xs text-text-muted">
                  Receive live session links, schedule reminders, and curriculum materials.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailCohortAnnouncements}
                  onChange={() => toggle("emailCohortAnnouncements")}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-surface-sunken peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber"></div>
              </label>
            </div>

            {/* Code Review Delivery */}
            <div className="py-3 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                  <Code2 className="size-3.5 text-emerald" /> Code Review Deliveries
                </span>
                <p className="text-xs text-text-muted">
                  Instant alert when a senior engineer posts line-by-line feedback or refactored pull requests.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailCodeReviewDelivery}
                  onChange={() => toggle("emailCodeReviewDelivery")}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-surface-sunken peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber"></div>
              </label>
            </div>

            {/* Product Updates & News */}
            <div className="py-3 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                  <Mail className="size-3.5 text-text-muted" /> DevMentor Product News & Tips
                </span>
                <p className="text-xs text-text-muted">
                  Occasional digest with top developer tips, engineering insights, and new platform tools.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.marketingEmails}
                  onChange={() => toggle("marketingEmails")}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-surface-sunken peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber"></div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end pt-3">
            <Button type="submit" variant="outline" className="gap-2 font-medium text-xs px-5 h-9">
              <Save className="size-3.5" />
              Save Preferences
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
