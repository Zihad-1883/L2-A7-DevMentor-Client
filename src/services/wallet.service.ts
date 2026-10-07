import { apiClient } from "@/lib/api-client";
import type {
  CreditWalletData,
  WithdrawalRequestInput,
  WithdrawalResponse,
} from "@/types/wallet.types";

export interface InitiateTopUpResponse {
  paymentID: string;
  bkashURL: string;
  amount: number;
}

export const walletService = {
  getMyWallet: () => apiClient.get<CreditWalletData>("/payments/wallet/me"),

  initiateTopUp: (amount: number) =>
    apiClient.post<InitiateTopUpResponse>("/payments/top-up", { amount }),

  requestWithdrawal: (payload: WithdrawalRequestInput) =>
    apiClient.post<WithdrawalResponse>("/payments/withdraw", payload),
};

