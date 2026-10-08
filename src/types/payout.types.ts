export type PayoutStatus = "PENDING" | "PROCESSED" | "REJECTED";
export type PayoutMethod = "BKASH" | "NAGAD" | "BANK";

export interface PayoutRequest {
  id: string;
  mentorId: string;
  walletId: string;
  amountCredits: number;
  amountBdt: number;
  method: PayoutMethod | string;
  accountNumber: string;
  status: PayoutStatus;
  processedBy?: string | null;
  processedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  mentor?: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  };
  admin?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

export interface CreatePayoutInput {
  amountBdt: number;
  method?: PayoutMethod;
  accountNumber: string;
}

export interface ProcessPayoutInput {
  status: "PROCESSED" | "REJECTED";
  rejectionReason?: string;
}

export interface AdminPayoutsResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    pendingCount: number;
    processedCount: number;
    rejectedCount: number;
    totalPendingBdt: number;
    totalPendingCredits: number;
  };
  data: PayoutRequest[];
}

export interface MyPayoutsResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: PayoutRequest[];
}
