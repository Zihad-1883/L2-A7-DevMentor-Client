"use client";

import * as React from "react";

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

function computeSecondsRemaining(expiresAt?: string | null): number {
  if (!expiresAt) return 0;
  const expiryTime = new Date(expiresAt).getTime();
  if (isNaN(expiryTime)) return 0;
  return Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
}

export function usePreviewLock({
  expiresAt,
  totalDurationSeconds = 600,
  onExpire,
}: UsePreviewLockOptions = {}): UsePreviewLockReturn {
  const [secondsLeft, setSecondsLeft] = React.useState<number>(() =>
    computeSecondsRemaining(expiresAt)
  );
  const [prevExpiresAt, setPrevExpiresAt] = React.useState<string | null | undefined>(
    expiresAt
  );

  // Adjust state during rendering when expiresAt changes (avoids cascading render effects)
  if (expiresAt !== prevExpiresAt) {
    setPrevExpiresAt(expiresAt);
    setSecondsLeft(computeSecondsRemaining(expiresAt));
  }

  // Subscribe to external timer interval
  React.useEffect(() => {
    if (!expiresAt) return;

    const remaining = computeSecondsRemaining(expiresAt);
    if (remaining <= 0) {
      onExpire?.();
      return;
    }

    const interval = setInterval(() => {
      const nextRemaining = computeSecondsRemaining(expiresAt);
      setSecondsLeft(nextRemaining);

      if (nextRemaining <= 0) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

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
