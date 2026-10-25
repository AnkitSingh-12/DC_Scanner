"use client";

import React, { useState } from "react";
import { Terminal, Code2, ShieldCheck, FileText, Layers, AlertCircle, CheckCircle2 } from "lucide-react";

export default function InspectionConsoleMockup() {
  const [activeTab, setActiveTab] = useState<"overview" | "objects" | "streams" | "warnings">("overview");

  return (
    <div className="cyber-card rounded-2xl overflow-hidden bg-[#0C1421] border border-[#283548] shadow-2xl">
      {/* Console Window Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#141F30] border-b border-[#283548]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-3 font-mono text-xs font-bold text-[#F5F7FA]">
            Inspection Console — invoice_march_2026.pdf
          </span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30 flex items-center gap-1 font-mono">
          <ShieldCheck className="w-3 h-3" /> VERIFIED SAFE
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-3 pt-2 bg-[#111A29] border-b border-[#283548] text-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`px-3 py-1.5 rounded-t-lg font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === "overview"
              ? "bg-[#141F30] text-[#35C987] border-t border-x border-[#283548]"
              : "text-[#9BAABC] hover:text-[#F5F7FA]"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("objects")}
          className={`px-3 py-1.5 rounded-t-lg font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === "objects"
              ? "bg-[#141F30] text-[#35C987] border-t border-x border-[#283548]"
              : "text-[#9BAABC] hover:text-[#F5F7FA]"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Object AST</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("streams")}
          className={`px-3 py-1.5 rounded-t-lg font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === "streams"
              ? "bg-[#141F30] text-[#35C987] border-t border-x border-[#283548]"
              : "text-[#9BAABC] hover:text-[#F5F7FA]"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Streams (Flate)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("warnings")}
          className={`px-3 py-1.5 rounded-t-lg font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === "warnings"
              ? "bg-[#141F30] text-[#35C987] border-t border-x border-[#283548]"
              : "text-[#9BAABC] hover:text-[#F5F7FA]"
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Warnings (0)</span>
        </button>
      </div>

      {/* Console Content */}
      <div className="p-4 bg-[#0C1421] text-xs font-mono space-y-4">
        {activeTab === "overview" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded bg-[#141F30] border border-[#283548]">
                <span className="text-[#9BAABC] text-[10px] block">Risk Score</span>
                <span className="text-[#35C987] font-bold text-sm">0 / 100</span>
              </div>
              <div className="p-2.5 rounded bg-[#141F30] border border-[#283548]">
                <span className="text-[#9BAABC] text-[10px] block">Indirect Objects</span>
                <span className="text-[#F5F7FA] font-bold text-sm">6 Objects</span>
              </div>
              <div className="p-2.5 rounded bg-[#141F30] border border-[#283548]">
                <span className="text-[#9BAABC] text-[10px] block">Content Streams</span>
                <span className="text-[#F5F7FA] font-bold text-sm">2 Streams</span>
              </div>
              <div className="p-2.5 rounded bg-[#141F30] border border-[#283548]">
                <span className="text-[#9BAABC] text-[10px] block">XREF Structure</span>
                <span className="text-[#35C987] font-bold text-sm">Valid Clean</span>
              </div>
            </div>

            <div className="p-3 rounded bg-[#070D16] border border-[#1E293B] space-y-1.5 text-[11px]">
              <div className="text-[#35C987] flex items-center gap-1.5 font-sans font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> No active JavaScript or /Launch execution triggers
              </div>
              <div className="text-[#35C987] flex items-center gap-1.5 font-sans font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Standard FlateDecode compression filters verified
              </div>
              <div className="text-[#35C987] flex items-center gap-1.5 font-sans font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Zero payload bytes appended past %%EOF delimiter
              </div>
            </div>
          </div>
        )}

        {activeTab === "objects" && (
          <pre className="text-[#9BAABC] text-[11px] leading-relaxed overflow-x-auto p-2 bg-[#070D16] rounded border border-[#1E293B]">
{`1 0 obj
<<
  /Type /Catalog
  /Pages 4 0 R
  /Version /1.7
>>
endobj

2 0 obj
<<
  /Title (Quarterly Invoice INV-2026-089)
  /Author (DC Enterprise Billing Systems)
  /Producer (DC PDF Engine 2.1)
  /CreationDate (D:20261025100000+00'00')
>>
endobj`}
          </pre>
        )}

        {activeTab === "streams" && (
          <pre className="text-[#35C987] text-[11px] leading-relaxed overflow-x-auto p-2 bg-[#070D16] rounded border border-[#1E293B]">
{`3 0 obj
<<
  /Filter /FlateDecode
  /Length 94
>>
stream
78 9c 33 30 30 50 28 28 56 00 02 4d 01 14 0b 2c ...
[Decompressed byte sequence: 218 bytes UTF-8 clean text]
endstream
endobj`}
          </pre>
        )}

        {activeTab === "warnings" && (
          <div className="p-6 text-center text-[#9BAABC] text-xs font-sans">
            <CheckCircle2 className="w-8 h-8 text-[#35C987] mx-auto mb-2 opacity-75" />
            <p>Pristine structure. Zero warnings or parser ambiguities.</p>
          </div>
        )}
      </div>

      {/* Footer bar of console */}
      <div className="px-4 py-2 bg-[#141F30] border-t border-[#283548] flex items-center justify-between text-[10px] text-[#64748B]">
        <span>AST Parser: pikepdf + pypdf hybrid</span>
        <span className="text-[#35C987]">Latency: 84 ms</span>
      </div>
    </div>
  );
}
