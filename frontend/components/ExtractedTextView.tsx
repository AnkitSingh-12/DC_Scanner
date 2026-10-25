"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Copy, Check, FileText, ArrowLeft, RefreshCw, Download, Sparkles } from "lucide-react";
import { TextExtractionData } from "@/types";

interface ExtractedTextViewProps {
  data: TextExtractionData;
  onExtractAnother?: () => void;
}

export default function ExtractedTextView({ data, onExtractAnother }: ExtractedTextViewProps) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedPage, setCopiedPage] = useState<number | null>(null);

  const copyAllText = () => {
    const fullText = data.pages.map((p) => `--- Page ${p.page_number} ---\n\n${p.text}`).join("\n\n");
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const copyPageText = (pageNumber: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPage(pageNumber);
    setTimeout(() => setCopiedPage(null), 2000);
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* 1. Header Row matching reference screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
            Extracted Text
          </h1>
          <p className="text-xs sm:text-sm text-[#9BAABC] mt-1 font-mono">
            {data.pages_count} pages, {data.total_words.toLocaleString()} words, {data.total_characters.toLocaleString()} characters
          </p>
          <p className="text-[11px] text-[#64748B] font-mono mt-0.5">
            Processed in {data.duration_seconds} seconds • {(data.file_size / 1024).toFixed(1)} KB file
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onExtractAnother ? (
            <button
              type="button"
              onClick={onExtractAnother}
              className="px-4 py-2 rounded-xl bg-[#141F30] hover:bg-[#1A273D] border border-[#283548] text-xs font-semibold text-[#F5F7FA] transition-all cursor-pointer"
            >
              Extract Another
            </button>
          ) : (
            <Link
              href="/scanner?tool=extract_text"
              className="px-4 py-2 rounded-xl bg-[#141F30] hover:bg-[#1A273D] border border-[#283548] text-xs font-semibold text-[#F5F7FA] transition-all"
            >
              Extract Another
            </Link>
          )}

          <button
            type="button"
            onClick={copyAllText}
            className="px-5 py-2.5 rounded-xl bg-[#35C987] hover:bg-[#2EB377] text-[#0C1421] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-[#35C987]/20 active:scale-95 cursor-pointer"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? "Copied All Text!" : "Copy All Text"}</span>
          </button>
        </div>
      </div>

      {/* 2. Page Cards matching reference screenshot */}
      <div className="space-y-6">
        {data.pages.map((page) => (
          <div
            key={page.page_number}
            className="rounded-2xl bg-[#141F30] border border-[#283548] overflow-hidden shadow-xl"
          >
            {/* Page Header Bar */}
            <div className="p-4 sm:px-6 flex items-center justify-between bg-[#141F30]">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#35C987] text-[#0C1421] font-black text-xs flex items-center justify-center shrink-0">
                  {page.page_number}
                </div>
                <span className="font-bold text-[#F5F7FA] text-sm tracking-wide">
                  Page {page.page_number}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-[#9BAABC] font-mono hidden sm:inline">
                  {page.word_count.toLocaleString()} words • {page.character_count.toLocaleString()} characters
                </span>

                <button
                  type="button"
                  onClick={() => copyPageText(page.page_number, page.text)}
                  className="px-3 py-1.5 rounded-lg bg-[#0C1421] hover:bg-[#1A273D] border border-[#283548] hover:border-[#35C987] text-xs font-medium text-[#F5F7FA] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedPage === page.page_number ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#35C987]" />
                      <span className="text-[#35C987]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#9BAABC]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Page Text Stream Box */}
            <div className="p-5 sm:p-6 bg-[#09101C] border-t border-[#283548] overflow-x-auto">
              <pre className="font-mono text-xs sm:text-[13px] text-[#CBD5E1] whitespace-pre-wrap leading-relaxed select-text font-normal">
                {page.text}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
