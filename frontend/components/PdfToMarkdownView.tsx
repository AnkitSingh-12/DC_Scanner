"use client";

import React, { useState, useEffect } from "react";
import { Hash, Copy, Check, Download, RefreshCw } from "lucide-react";

interface PdfToMarkdownViewProps {
  scanId: string;
  filename: string;
}

export default function PdfToMarkdownView({ scanId, filename }: PdfToMarkdownViewProps) {
  const [markdown, setMarkdown] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchMarkdown() {
      try {
        const res = await fetch(`/api/v1/scans/${scanId}/markdown`);
        if (res.ok) {
          const data = await res.json();
          setMarkdown(data.markdown || "");
        }
      } catch (err) {
        console.error("Failed to load markdown:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMarkdown();
  }, [scanId]);

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename.replace(".pdf", "")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-sm text-[#9BAABC] flex items-center justify-center gap-3">
        <RefreshCw className="w-5 h-5 animate-spin text-[#35C987]" />
        <span>Converting PDF structure to Markdown...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
            PDF to Markdown
          </h1>
          <p className="text-xs text-[#9BAABC] mt-1 font-mono">
            Clean structured Markdown generated from <span className="text-[#35C987]">{filename}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={downloadMarkdown}
            className="px-4 py-2 rounded-xl bg-[#141F30] hover:bg-[#1A273D] border border-[#283548] text-xs font-semibold text-[#F5F7FA] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .md</span>
          </button>

          <button
            type="button"
            onClick={copyMarkdown}
            className="px-5 py-2.5 rounded-xl bg-[#35C987] hover:bg-[#2EB377] text-[#0C1421] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-[#35C987]/20 active:scale-95 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied Markdown!" : "Copy Markdown"}</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-[#141F30] border border-[#283548] overflow-hidden shadow-2xl">
        <div className="p-4 bg-[#09101C] border-b border-[#283548] flex items-center justify-between">
          <span className="text-xs font-mono text-[#9BAABC]">{filename.replace(".pdf", "")}.md</span>
          <span className="text-[11px] text-[#64748B] font-mono">{markdown.length} bytes</span>
        </div>
        <pre className="p-6 bg-[#060B12] text-xs sm:text-[13px] font-mono text-[#CBD5E1] whitespace-pre-wrap overflow-x-auto leading-relaxed max-h-[600px]">
          {markdown}
        </pre>
      </div>
    </div>
  );
}
