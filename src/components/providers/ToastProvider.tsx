"use client";

import { Toaster } from "sonner";

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            borderRadius: "0.5rem",
          },
          classNames: {
            toast: "border border-border shadow-md",
            title: "text-sm font-semibold",
            description: "text-xs text-text-muted",
          },
        }}
      />
    </>
  );
}
