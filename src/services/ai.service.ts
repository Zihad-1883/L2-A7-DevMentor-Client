import { apiClient } from "@/lib/api-client";
import type { ChatPayload, ChatResponse, MatchPayload, MatchResultResponse } from "@/types/ai.types";

export const aiService = {

  // Send a chat message to DevMentor AI Assistant & FAQ Bot
  chatWithAssistant: (payload: ChatPayload) =>
    apiClient.post<ChatResponse>("/ai/chat", payload),

  // Match students with top mentors and cohorts based on their learning goal
  matchMentorsAndCohorts: (payload: MatchPayload) =>
    apiClient.post<MatchResultResponse>("/ai/match", payload)
};
