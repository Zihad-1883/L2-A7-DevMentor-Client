"use client";

import * as React from "react";
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Bot,
  User,
  ChevronDown,
  ExternalLink,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { aiService } from "@/services/ai.service";
import type { ChatMessage } from "@/types/ai.types";

const INITIAL_PROMPTS = [
  "How does DevCredits escrow work?",
  "What is the difference between Quick & Deep code reviews?",
  "How do mentor payouts via bKash work?",
  "How are sprint sessions scheduled?",
];

export default function DevMentorAiBot() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputMessage, setInputMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm **DevMentor AI**. Ask me anything about finding mentors, booking 1-on-1 sprints, code reviews, or how DevCredits (৳4/Cr) and escrow protection work.",
    },
  ]);
  const [suggestedPrompts, setSuggestedPrompts] = React.useState<string[]>(INITIAL_PROMPTS);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Auto scroll to latest message
  React.useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input on open
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setInputMessage("");

    const newHistory: ChatMessage[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const response = await aiService.chatWithAssistant({
        message: text,
        history: newHistory.slice(-10), // Send last 10 messages for context
      });

      if (response?.answer) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.answer },
        ]);
        if (response.suggestedPrompts?.length > 0) {
          setSuggestedPrompts(response.suggestedPrompts);
        }
      } else {
        throw new Error("No answer returned");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I encountered a temporary connection issue. Please feel free to ask again or browse our official **/faq** page for detailed platform documentation.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Chat session reset. How can I help you navigate DevMentor today?",
      },
    ]);
    setSuggestedPrompts(INITIAL_PROMPTS);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* 1. Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-surface border border-amber/40 shadow-xl hover:shadow-amber/20 hover:border-amber transition-all duration-300 hover:scale-105 cursor-pointer"
          aria-label="Open DevMentor AI Assistant"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber" />
          </span>

          <div className="size-8 rounded-full bg-amber-light text-amber flex items-center justify-center border border-amber/30 group-hover:bg-amber group-hover:text-white transition-colors">
            <Sparkles className="size-4.5" />
          </div>

          <div className="text-left hidden sm:block pr-1">
            <p className="text-xs font-bold text-text-primary tracking-tight group-hover:text-amber transition-colors">
              DevMentor AI
            </p>
            <p className="text-[10px] text-text-muted font-medium">Ask anything</p>
          </div>
        </button>
      )}

      {/* 2. Expandable Chat Modal Window */}
      {isOpen && (
        <div className="w-[370px] sm:w-[420px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-6rem)] rounded-3xl bg-surface/95 backdrop-blur-2xl border border-border/80 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-border/60 bg-surface-raised/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-2xl bg-amber-light text-amber flex items-center justify-center border border-amber/30">
                <Bot className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-sm font-bold text-text-primary">
                    DevMentor AI
                  </h3>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-light text-emerald border border-emerald/20">
                    <span className="size-1.5 rounded-full bg-emerald animate-pulse" /> Live
                  </span>
                </div>
                <p className="text-[10px] text-text-muted">Platform Advisor &amp; Matcher</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                title="Reset conversation"
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors cursor-pointer"
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors cursor-pointer"
                aria-label="Close Assistant"
              >
                <X className="size-4.5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg, idx) => {
              const isAssistant = msg.role === "assistant" || msg.role === "model";
              return (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${isAssistant ? "justify-start" : "justify-end"}`}
                >
                  {isAssistant && (
                    <div className="size-6 rounded-full bg-amber-light text-amber flex items-center justify-center shrink-0 border border-amber/30 mt-0.5">
                      <Sparkles className="size-3" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                      isAssistant
                        ? "bg-surface-raised/80 text-text-primary border border-border/60 whitespace-pre-line"
                        : "bg-amber text-white font-medium"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {!isAssistant && (
                    <div className="size-6 rounded-full bg-surface-raised text-text-secondary flex items-center justify-center shrink-0 border border-border mt-0.5">
                      <User className="size-3" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2.5 text-text-muted pt-1">
                <div className="size-6 rounded-full bg-amber-light text-amber flex items-center justify-center shrink-0 border border-amber/30">
                  <Sparkles className="size-3 animate-spin" />
                </div>
                <div className="px-3.5 py-2 rounded-2xl bg-surface-raised/60 border border-border/50 text-[11px] flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-amber animate-bounce" />
                  <span className="size-1.5 rounded-full bg-amber animate-bounce [animation-delay:0.2s]" />
                  <span className="size-1.5 rounded-full bg-amber animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-text-muted">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompt Chips */}
          {suggestedPrompts.length > 0 && !isLoading && (
            <div className="px-3 py-2 border-t border-border/40 bg-surface/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface-raised text-text-secondary hover:text-amber hover:border-amber/40 border border-border/70 whitespace-nowrap transition-colors cursor-pointer shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Footer Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-border/60 bg-surface-raised/40 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask DevMentor AI anything..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 rounded-xl text-xs bg-surface border border-border focus:border-amber/50 focus:outline-none text-text-primary placeholder:text-text-muted disabled:opacity-50"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!inputMessage.trim() || isLoading}
              className="size-8 p-0 rounded-xl bg-amber text-white hover:bg-amber-hover shrink-0 cursor-pointer disabled:opacity-40"
            >
              {isLoading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Send className="size-3.5" />
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
