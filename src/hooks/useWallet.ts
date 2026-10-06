"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { walletService } from "@/services/wallet.service";
import { useAuthContext } from "@/components/providers/AuthProvider";

export function useWallet() {
  const { isAuthenticated, role } = useAuthContext();

  const query = useQuery({
    queryKey: queryKeys.wallet.me,
    queryFn: () => walletService.getMyWallet(),
    enabled: isAuthenticated && (role === "student" || role === "mentor"),
    staleTime: 1000 * 30, // 30 seconds
    retry: 1,
  });

  return {
    wallet: query.data ?? null,
    balance: query.data?.balance ?? 0,
    equivalentBDT: query.data?.equivalentBDT ?? 0,
    totalEarned: query.data?.totalEarned ?? 0,
    totalWithdrawn: query.data?.totalWithdrawn ?? 0,
    transactions: query.data?.transactions ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

