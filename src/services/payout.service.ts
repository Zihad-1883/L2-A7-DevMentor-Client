import { apiClient } from "@/lib/api-client";
import type {
  CreatePayoutInput,
  ProcessPayoutInput,
  PayoutRequest,
  AdminPayoutsResponse,
  MyPayoutsResponse,
} from "@/types/payout.types";

export const payoutService = {
  // Mentor creates a payout request (deducts credits from wallet)
  createPayoutRequest: (payload: CreatePayoutInput) =>
    apiClient.post<{ message: string; payoutRequest: PayoutRequest }>(
      "/payouts",
      payload
    ),

  // Mentor gets their own payout history
  getMyPayoutRequests: (page = 1, limit = 20) =>
    apiClient.get<MyPayoutsResponse>(`/payouts/my?page=${page}&limit=${limit}`),

  // Admin gets the payout request queue
  getAdminPayouts: (status?: string, page = 1, limit = 20) => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status && status !== "ALL") {
      query.append("status", status);
    }
    return apiClient.get<AdminPayoutsResponse>(`/admin/payouts?${query.toString()}`);
  },

  // Admin processes (approves or rejects) a payout request
  processPayoutRequest: (id: string, payload: ProcessPayoutInput) =>
    apiClient.patch<{ message: string; payoutRequest: PayoutRequest }>(
      `/admin/payouts/${id}/process`,
      payload
    ),
};
