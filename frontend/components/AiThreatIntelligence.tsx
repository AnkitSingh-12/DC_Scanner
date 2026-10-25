"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Shield,
  Bot,
  Send,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Zap,
  Terminal,
  ArrowRight,
  Code2,
} from "lucide-react";

export default function AiThreatIntelligence() {
  const [selectedPrompt, setSelectedPrompt] = useState<number>(0);

  const sampleChats = [
    {
      q: "Is the JavaScript in this document attempting to execute shell code?",
      risk: "HIGH RISK THREAT DETECTED",
      riskColor: "text-red-400 bg-red-500/15 border-red-500/30",
      answer:
        "Yes. The OpenAction object references a /Launch action executing powershell.exe with an encoded base64 bypass payload designed to drop secondary binaries in %TEMP%.",
      code: `Root -> /OpenAction [Indirect Obj 14 0 R]
<<
  /Type /Action
  /S /Launch
  /F (powershell.exe)
  /P (-NoProfile -WindowStyle Hidden -Enc JABjAGwAaQBlAG4AdAA...)
>>`,
    },
    {
      q: "Where does the external URI redirect and is it a known phishing portal?",
      risk: "SUSPICIOUS DESTINATION",
      riskColor: "text-amber-400 bg-amber-500/15 border-amber-500/30",
      answer:
        "The document contains an active annotation link targeting a raw IPv4 address (http://192.168.1.105/auth/login.php) with credential-harvesting URL parameters, bypassing standard domain reputation filters.",
      code: `Page 1 -> /Annots -> [Indirect Obj 8 0 R]
<<
  /Type /Annot
  /Subtype /Link
  /A << /S /URI /URI (http://192.168.1.105/login.php?ref=invoice) >>
>>`,
    },
    {
      q: "Are there concealed binary attachments or embedded executables?",
      risk: "CLEAN VERIFIED",
      riskColor: "text-[#35C987] bg-[#35C987]/15 border-[#35C987]/30",
      answer:
        "No hidden PE executables or scripts were found. The /EmbeddedFiles portfolio is empty, and all indirect content streams conform to standard FlateDecode stream compression.",
      code: `Catalog -> /Names -> /EmbeddedFiles (Null)
Indirect Streams: 4 valid FlateDecode streams
Entropy: 4.12 / 8.00 (Standard Text & Font Data)`,
    },
  ];

  const currentChat = sampleChats[selectedPrompt];

  return (
    <div className="space-y-12">
      {/* Interactive AI Chat Section */}
      <div className="cyber-card p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#141F30] via-[#101A29] to-[#0D1522] border border-[#283548] shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Explanatory & CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#35C987]/15 border border-[#35C987]/30 text-xs font-bold text-[#35C987]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI PDF Threat Intelligence</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7FA] tracking-tight leading-tight">
              Ask DC Scanner AI about your document
            </h2>

            <p className="text-sm text-[#9BAABC] leading-relaxed">
              Chat with your PDF's internal structure. Ask questions about detected scripts, hidden metadata, or suspicious links and get clear security explanations with exact AST line numbers.
            </p>

            {/* Social Proof Avatars */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2 overflow-hidden">
                <span className="inline-block h-8 w-8 rounded-full ring-2 ring-[#141F30] bg-[#35C987]/30 flex items-center justify-center text-xs font-bold text-[#35C987]">
                  JD
                </span>
                <span className="inline-block h-8 w-8 rounded-full ring-2 ring-[#141F30] bg-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400">
                  AK
                </span>
                <span className="inline-block h-8 w-8 rounded-full ring-2 ring-[#141F30] bg-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-400">
                  MR
                </span>
                <span className="inline-block h-8 w-8 rounded-full ring-2 ring-[#141F30] bg-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-400">
                  SL
                </span>
              </div>
              <span className="text-xs text-[#9BAABC]">
                Trusted by <strong className="text-[#F5F7FA]">5,000+</strong> security analysts
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/scanner?tool=ai_chat"
                className="px-5 py-2.5 rounded-xl bg-[#35C987] hover:bg-[#2EB377] text-[#0C1421] font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#35C987]/20 flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                <span>Try AI Assistant Free</span>
              </Link>
              <Link
                href="/developers"
                className="text-xs font-semibold text-[#9BAABC] hover:text-[#35C987] flex items-center gap-1 transition-colors"
              >
                <span>Explore sample conversations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: AI Interactive Window */}
          <div className="lg:col-span-7">
            <div className="cyber-card rounded-2xl bg-[#0C1421] border border-[#283548] overflow-hidden shadow-2xl">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#141F30] border-b border-[#283548]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#35C987]" />
                  <span className="ml-2 font-mono text-xs font-bold text-[#F5F7FA] flex items-center gap-2">
                    <Bot className="w-3.5 h-3.5 text-[#35C987]" /> DC Scanner AI Assistant
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#35C987]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#35C987] animate-pulse" />
                  <span>Online</span>
                </div>
              </div>

              {/* Suggested Questions */}
              <div className="p-3 bg-[#101A28] border-b border-[#283548] flex items-center gap-2 overflow-x-auto scrollbar-none">
                <span className="text-[10px] uppercase font-bold text-[#64748B] shrink-0">Sample Prompts:</span>
                {sampleChats.map((chat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPrompt(idx)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 transition-colors ${
                      selectedPrompt === idx
                        ? "bg-[#35C987] text-[#0C1421] font-semibold"
                        : "bg-[#141F30] text-[#9BAABC] border border-[#283548] hover:text-[#F5F7FA]"
                    }`}
                  >
                    Question {idx + 1}
                  </button>
                ))}
              </div>

              {/* Chat Body */}
              <div className="p-5 space-y-4 text-xs font-sans">
                {/* User Message */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="p-3.5 rounded-2xl rounded-tr-none bg-[#141F30] border border-[#283548] text-[#F5F7FA] max-w-md shadow-sm">
                    <p className="font-medium text-xs leading-relaxed">{currentChat.q}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#283548] flex items-center justify-center text-[10px] font-bold text-[#F5F7FA] shrink-0">
                    YOU
                  </div>
                </div>

                {/* Assistant Response Card */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#35C987]/15 border border-[#35C987]/30 flex items-center justify-center text-[#35C987] shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="space-y-3 max-w-lg">
                    {/* Threat Flag Pill */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border tracking-wide uppercase">
                      <span className={`px-2 py-0.5 rounded border font-mono font-bold ${currentChat.riskColor}`}>
                        {currentChat.risk}
                      </span>
                    </div>

                    <p className="text-xs text-[#CBD5E1] leading-relaxed">
                      {currentChat.answer}
                    </p>

                    {/* Dissected AST Code Block */}
                    <div className="rounded-xl bg-[#09101C] border border-[#283548] p-3 font-mono text-[11px] overflow-x-auto text-[#35C987]">
                      <div className="text-[10px] text-[#64748B] mb-1 uppercase font-bold flex items-center gap-1">
                        <Code2 className="w-3 h-3" /> Dissected AST Evidence:
                      </div>
                      <pre className="text-[11px] leading-tight text-[#9BAABC]">
                        {currentChat.code}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Privacy & Performance Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="cyber-card p-6 rounded-2xl bg-[#141F30]/60 border border-[#283548] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#35C987]/15 border border-[#35C987]/30 flex items-center justify-center text-[#35C987]">
            <Lock className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#F5F7FA] uppercase tracking-wider">
            STRICT PRIVACY
          </h4>
          <p className="text-xs text-[#9BAABC] leading-relaxed">
            We don't read your documents. Data is analyzed in ephemeral memory buffers and immediately discarded after parsing.
          </p>
        </div>

        <div className="cyber-card p-6 rounded-2xl bg-[#141F30]/60 border border-[#283548] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#F5F7FA] uppercase tracking-wider">
            LIGHTNING FAST
          </h4>
          <p className="text-xs text-[#9BAABC] leading-relaxed">
            Multi-threaded parallel extraction inspects metadata, structural objects, and stream entropy in sub-second latency.
          </p>
        </div>

        <div className="cyber-card p-6 rounded-2xl bg-[#141F30]/60 border border-[#283548] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Terminal className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#F5F7FA] uppercase tracking-wider">
            DEVELOPER READY
          </h4>
          <p className="text-xs text-[#9BAABC] leading-relaxed">
            Simple JSON REST API, automated webhooks, and official Python / Node.js SDKs for CI/CD and secure email gateways.
          </p>
        </div>
      </div>
    </div>
  );
}
