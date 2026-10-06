"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle, ArrowLeft, RefreshCw, Wallet, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const paymentID = searchParams.get("paymentID") || searchParams.get("paymentId") || "";

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-surface border border-border text-center space-y-6 shadow-xs animate-in zoom-in-95 duration-200">
        <div className="size-16 rounded-full bg-amber-light text-amber border border-amber/20 flex items-center justify-center mx-auto shadow-xs">
          <XCircle className="size-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-light text-amber border border-amber/20 inline-block">
            Checkout Cancelled
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
            Payment Not Completed
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            You exited the bKash payment window or cancelled the checkout session. No charges were made to your account.
          </p>
        </div>

        {paymentID && (
          <div className="p-3.5 rounded-2xl bg-surface-raised border border-border text-xs text-left">
            <span className="text-text-muted">Cancelled Session:</span>
            <span className="ml-2 font-mono text-[11px] text-text-primary truncate block mt-0.5">
              {paymentID}
            </span>
          </div>
        )}

        <div className="pt-2 flex flex-col gap-3">
          <Link href="/dashboard/wallet">
            <Button className="w-full h-11 gap-2 bg-amber hover:bg-amber-hover text-surface-dark font-bold text-xs cursor-pointer shadow-xs">
              <RefreshCw className="size-4" /> Try Top-Up Again
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="w-full h-10 text-xs font-semibold border-border bg-surface hover:bg-surface-raised cursor-pointer"
            >
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
