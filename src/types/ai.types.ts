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
