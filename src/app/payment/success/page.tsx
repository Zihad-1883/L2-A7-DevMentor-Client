"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, ArrowRight, Wallet, Coins, Download, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/query-keys";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const paymentID = searchParams.get("paymentID") || searchParams.get("paymentId") || "";
  const trxID = searchParams.get("trxID") || searchParams.get("trxId") || "";

  React.useEffect(() => {
    // Invalidate wallet query so new balance reflects immediately
    queryClient.invalidateQueries({ queryKey: queryKeys.wallet.me });
  }, [queryClient]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-surface border border-border text-center space-y-6 shadow-xs animate-in zoom-in-95 duration-200">
        <div className="size-16 rounded-full bg-emerald-light text-emerald border border-emerald/20 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="size-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-light text-emerald border border-emerald/20 inline-block">
            Payment Settled
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
            Credits Deposited Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Your bKash transaction has been verified. Your spendable universal credits have been credited to your DevWallet.
          </p>
        </div>

        {(paymentID || trxID) && (
          <div className="p-4 rounded-2xl bg-surface-raised border border-border text-xs space-y-2 text-left">
            {paymentID && (
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Payment ID:</span>
                <span className="font-mono font-semibold text-text-primary text-[11px] truncate max-w-[180px]">
                  {paymentID}
                </span>
              </div>
            )}
            {trxID && (
              <div className="flex items-center justify-between">
                <span className="text-text-muted">bKash TrxID:</span>
                <span className="font-mono font-bold text-emerald text-[11px]">
                  {trxID}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between pt-1 border-t border-border/60">
              <span className="text-text-muted">Receipt Invoice:</span>
              <span className="text-emerald font-semibold text-[11px]">
                Emailed with PDF
              </span>
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-col gap-3">
          <Link href="/dashboard/wallet">
            <Button className="w-full h-11 gap-2 bg-amber hover:bg-amber-hover text-surface-dark font-bold text-xs cursor-pointer shadow-xs">
              <Wallet className="size-4" /> Go to DevWallet Dashboard
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
          <Link href="/dashboard/sprints/new">
            <Button
              variant="outline"
              className="w-full h-10 text-xs font-semibold border-border bg-surface hover:bg-surface-raised cursor-pointer"
            >
              Book a 1-on-1 Mentorship Sprint
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
