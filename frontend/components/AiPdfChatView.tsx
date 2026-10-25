"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Bot, User, Sparkles, RefreshCw } from "lucide-react";

interface AiPdfChatViewProps {
  scanId: string;
  filename: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  relevantPage?: number;
}

export default function AiPdfChatView({ scanId, filename }: AiPdfChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "bot",
      text: `Hello! I have analyzed **${filename}**. What would you like to know or extract from this document?`,
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    "Summarize this document",
    "List all technical skills and tools",
    "Extract work experience and projects",
    "What contact details are listed?",
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: "Just now",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`/api/v1/scans/${scanId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: ChatMessage = {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: data.reply,
          timestamp: "Just now",
          relevantPage: data.relevant_page,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "bot",
            text: "Sorry, I encountered an error processing your query against this document.",
            timestamp: "Just now",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "bot",
          text: "Connection interrupted. Please try again.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2">
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-bold text-cyan-400">
            BETA
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
            AI PDF Chat
          </h1>
        </div>
        <p className="text-xs text-[#9BAABC] mt-1">
          Ask questions, summarize key sections, and extract insights from <span className="text-[#35C987] font-mono">{filename}</span>.
        </p>
      </div>

      {/* Chat Container */}
      <div className="rounded-2xl bg-[#141F30] border border-[#283548] shadow-2xl overflow-hidden flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.sender === "bot" && (
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-wrap ${
                  m.sender === "user"
                    ? "bg-[#35C987] text-[#0C1421] font-medium"
                    : "bg-[#0C1421] text-[#CBD5E1] border border-[#283548]"
                }`}
              >
                {m.text}
                {m.relevantPage && (
                  <div className="mt-2 pt-2 border-t border-[#283548]/60 text-[10px] text-cyan-400 font-mono">
                    Referenced from Page {m.relevantPage}
                  </div>
                )}
              </div>

              {m.sender === "user" && (
                <div className="w-8 h-8 rounded-xl bg-[#35C987]/15 border border-[#35C987]/30 flex items-center justify-center text-[#35C987] shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-xl bg-[#0C1421] border border-[#283548] text-xs text-[#9BAABC]">
                Analyzing document text...
              </div>
            </div>
          )}
        </div>

        {/* Suggested Prompt Chips */}
        <div className="p-3 bg-[#0C1421]/60 border-t border-[#283548] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1" />
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(p)}
              className="px-3 py-1 rounded-full bg-[#141F30] hover:bg-[#1A273D] border border-[#283548] text-[11px] text-[#9BAABC] hover:text-[#F5F7FA] shrink-0 transition-colors cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-[#0C1421] border-t border-[#283548] flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about this document..."
            className="flex-1 bg-[#141F30] border border-[#283548] rounded-xl px-4 py-2.5 text-xs text-[#F5F7FA] placeholder-[#64748B] focus:outline-none focus:border-cyan-400 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-[#0C1421] font-bold transition-all shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
