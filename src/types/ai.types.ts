export type AiProvider = "gemini" | "groq" | "fallback";

export interface ChatMessage {
  role: "user" | "model" | "assistant";
  content: string;
}

export interface ChatPayload {
  message: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  answer: string;
  suggestedPrompts: string[];
  providerUsed: AiProvider;
}

// 2. Smart AI Matcher Types
export interface MatchPayload {
  prompt: string;
  preferredLevel?: "ALL" | "JUNIOR" | "MID" | "SENIOR" | "LEAD";
  maxResults?: number;
}

export interface MatchedMentor {
  id: string;
  name: string;
  bio?: string | null;
  experienceLevel: string;
  techStackTags: string[];
  matchScore: number;
  matchReason: string;
  avatarUrl?: string | null;
}

export interface MatchedCohort {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  techStackTags: string[];
  totalCost: number;
  matchScore: number;
  matchReason: string;
}

export interface MatchResultResponse {
  analysisSummary: string;
  recommendedMentors: MatchedMentor[];
  recommendedCohorts: MatchedCohort[];
  providerUsed: AiProvider;
}

