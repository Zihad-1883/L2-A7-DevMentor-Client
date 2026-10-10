"use client";

import * as React from "react";

let currentTime = typeof window !== "undefined" ? Date.now() : 0;
const listeners = new Set<() => void>();
let timerId: ReturnType<typeof setInterval> | null = null;

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  if (!timerId && typeof window !== "undefined") {
    currentTime = Date.now();
    timerId = setInterval(() => {
      currentTime = Date.now();
      listeners.forEach((listener) => listener());
    }, 1000);
  }
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0 && timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  };
}

function getSnapshot(): number {
  return currentTime;
}

function getServerSnapshot(): number {
  return 0;
}

// Safe external store subscription to prevent React Compiler render purity warnings
export function useCurrentTime(): number {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
