"use client";

import * as React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, Shield, GraduationCap, Award } from "lucide-react";

interface UserRoleDistributionChartProps {
  totalUsers: number;
  totalStudents: number;
  totalMentors: number;
}

const COLORS = [
  "#f59e0b", // Amber for Students
  "#10b981", // Emerald for Mentors
  "#6366f1", // Indigo for Admins
];

const emptySubscribe = () => () => {};

export default function UserRoleDistributionChart({
  totalUsers,
  totalStudents,
  totalMentors,
}: UserRoleDistributionChartProps) {
  // Avoid hydration mismatch without triggering cascading render effect
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const totalAdmins = Math.max(1, totalUsers - (totalStudents + totalMentors));

  const data = [
    { name: "Students", value: Math.max(0, totalStudents), icon: GraduationCap },
    { name: "Verified Mentors", value: Math.max(0, totalMentors), icon: Award },
    { name: "Administrators", value: totalAdmins, icon: Shield },
  ];

  const totalCalculated = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="border border-border/80 shadow-xs bg-surface overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
              <Users className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-text-primary">
                User Role Distribution
              </CardTitle>
              <CardDescription className="text-xs text-text-muted mt-0.5">
                Breakdown of active platform accounts by permission tier.
              </CardDescription>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-surface-raised border border-border text-text-secondary">
            {totalUsers} Total
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Recharts Donut */}
          <div className="md:col-span-7 h-56 flex items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="transparent"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0];
                        const percent = totalCalculated > 0
                          ? Math.round(((item.value as number) / totalCalculated) * 100)
                          : 0;
                        return (
                          <div className="bg-surface border border-border rounded-xl shadow-lg px-3 py-2 text-xs">
                            <span className="font-bold text-text-primary block">{item.name}</span>
                            <span className="font-mono text-amber font-semibold">
                              {item.value} users ({percent}%)
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="size-40 rounded-full border-4 border-dashed border-border/60 animate-pulse flex items-center justify-center text-xs text-text-muted">
                Loading...
              </div>
            )}
          </div>

          {/* Role Summary Badges */}
          <div className="md:col-span-5 space-y-3">
            {data.map((item, index) => {
              const Icon = item.icon;
              const color = COLORS[index % COLORS.length];
              const percent = totalCalculated > 0
                ? Math.round((item.value / totalCalculated) * 100)
                : 0;

              return (
                <div
                  key={item.name}
                  className="p-3 rounded-xl bg-surface-raised/60 border border-border/70 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="size-3 rounded-xs shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div>
                      <span className="text-xs font-semibold text-text-primary block">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-text-muted font-mono">
                        {percent}% of accounts
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold font-mono text-text-primary">
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
