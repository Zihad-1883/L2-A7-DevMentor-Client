import { apiClient } from "@/lib/api-client";
import type { ChatPayload, ChatResponse } from "@/types/ai.types";

export const aiService = {
  /**
   * Send a chat message to DevMentor AI Assistant & FAQ Bot
   * POST /api/v1/ai/chat
   */
  chatWithAssistant: (payload: ChatPayload) =>
    apiClient.post<ChatResponse>("/ai/chat", payload),
};
