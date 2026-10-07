export type CreditTransactionType =
  | "TOP_UP"
  | "SPRINT_ESCROW"
  | "SPRINT_RELEASE"
  | "SPRINT_REFUND"
  | "COHORT_FEE"
  | "COHORT_RELEASE"
  | "WITHDRAWAL";

export interface WalletTransaction {
  id: string;
  walletId: string;
  amount: number;
  type: CreditTransactionType;
  description: string;
  referenceId?: string | null;
  createdAt: string;
}

export interface CreditWalletData {
  id?: string;
  userId: string;
  balance: number;
  equivalentBDT: number;
  totalEarned: number;
  totalWithdrawn: number;
  transactions: WalletTransaction[];
}

export interface WithdrawalRequestInput {
  amount: number; // in BDT
  bkashNumber: string;
}

export interface WithdrawalPaymentRecord {
  id: string;
  userId: string;
  amount: number;
  merchantInvoiceNumber: string;
  status: string;
  createdAt: string;
  gatewayResponse?: {
    type?: string;
    bkashNumber?: string;
    processedAt?: string;
  } | null;
}

export interface WithdrawalResponse {
  success: boolean;
  message: string;
  wallet: CreditWalletData;
  payment: WithdrawalPaymentRecord;
}

