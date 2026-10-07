"use client";

import * as React from "react";
import { useCurrentTime } from "@/hooks/useCurrentTime";

interface UsePreviewLockOptions {
  expiresAt?: string | null;
  totalDurationSeconds?: number; // Default 600 (10 minutes)
  onExpire?: () => void;
}

export interface UsePreviewLockReturn {
  secondsLeft: number;
  formattedTime: string; // e.g., "08:45"
  isExpired: boolean;
  isUrgent: boolean; // < 2 minutes remaining
  percentRemaining: number; // 0 to 100
  isActive: boolean;
}

export function usePreviewLock({
  expiresAt,
  totalDurationSeconds = 600,
  onExpire,
}: UsePreviewLockOptions = {}): UsePreviewLockReturn {
  const now = useCurrentTime();

  const secondsLeft = React.useMemo(() => {
    if (!expiresAt) return 0;
    const expiryTime = new Date(expiresAt).getTime();
    if (isNaN(expiryTime)) return 0;
    return Math.max(0, Math.floor((expiryTime - now) / 1000));
  }, [expiresAt, now]);

  const hasExpiredRef = React.useRef(false);

  React.useEffect(() => {
    if (!expiresAt) {
      hasExpiredRef.current = false;
      return;
    }
    if (secondsLeft <= 0 && !hasExpiredRef.current) {
      hasExpiredRef.current = true;
      onExpire?.();
    } else if (secondsLeft > 0) {
      hasExpiredRef.current = false;
    }
  }, [expiresAt, secondsLeft, onExpire]);

  const isExpired = Boolean(expiresAt && secondsLeft <= 0);
  const isUrgent = Boolean(expiresAt && secondsLeft > 0 && secondsLeft <= 120);
  const isActive = Boolean(expiresAt && secondsLeft > 0);

  const percentRemaining = React.useMemo(() => {
    if (!expiresAt || secondsLeft <= 0) return 0;
    return Math.min(100, Math.max(0, (secondsLeft / totalDurationSeconds) * 100));
  }, [expiresAt, secondsLeft, totalDurationSeconds]);

  const formattedTime = React.useMemo(() => {
    if (secondsLeft <= 0) return "00:00";
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [secondsLeft]);

  return {
    secondsLeft,
    formattedTime,
    isExpired,
    isUrgent,
    percentRemaining,
    isActive,
  };
}
