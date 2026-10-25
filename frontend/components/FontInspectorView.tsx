"use client";

import React, { useState, useEffect } from "react";
import { Type, CheckCircle2, AlertCircle, RefreshCw, Layers } from "lucide-react";

interface FontItem {
  name: string;
  full_name: string;
  type: string;
  encoding: string;
  is_embedded: boolean;
  format: string;
  pages: number[];
}

interface FontsResponse {
  scan_id: string;
  filename: string;
  total_fonts: number;
  fonts: FontItem[];
}

interface FontInspectorViewProps {
  scanId: string;
  filename: string;
}

export default function FontInspectorView({ scanId, filename }: FontInspectorViewProps) {
  const [data, setData] = useState<FontsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFonts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/v1/scans/${scanId}/fonts`);
        if (!res.ok) throw new Error("Failed to audit document fonts");
        const json: FontsResponse = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Failed to analyze fonts");
      } finally {
        setLoading(false);
      }
    }
    fetchFonts();
  }, [scanId]);

  if (loading) {
    return (
      <div className="p-16 text-center text-sm text-[#9BAABC] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-[#35C987]" />
        <span>Parsing document font descriptors, CID mappings, and glyph encodings...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-12 text-center text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-2xl">
        <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-400" />
        <p>{error || "Unable to retrieve fonts."}</p>
      </div>
    );
  }

  const embeddedCount = data.fonts.filter((f) => f.is_embedded).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#141F30] border border-[#283548] shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#35C987]/15 border border-[#35C987]/30 flex items-center justify-center text-[#35C987]">
            <Type className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#F5F7FA]">PDF Font Checker & Encoding Inspector</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30">
                {embeddedCount}/{data.total_fonts} Embedded
              </span>
            </div>
            <p className="text-xs text-[#9BAABC] mt-1">
              Typography and glyph analysis for <span className="font-mono text-[#F5F7FA]">{filename}</span>
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-[#9BAABC]">
          Total Fonts: <strong className="text-[#35C987] text-base">{data.total_fonts}</strong>
        </div>
      </div>

      {/* Font Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.fonts.map((f, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#141F30] border border-[#283548] space-y-3 shadow-md hover:border-[#35C987]/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#F5F7FA] text-sm font-mono truncate max-w-[180px]">
                {f.name}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                  f.is_embedded
                    ? "bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30"
                    : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                }`}
              >
                {f.is_embedded ? "Embedded" : "System Font"}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-[#9BAABC] font-mono">
              <div className="flex justify-between">
                <span>Font Subtype:</span>
                <span className="text-[#F5F7FA] font-bold">{f.type}</span>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <span className="text-[#35C987]">{f.format}</span>
              </div>
              <div className="flex justify-between">
                <span>Encoding:</span>
                <span className="text-[#F5F7FA] truncate max-w-[140px]">{f.encoding}</span>
              </div>
              <div className="flex justify-between">
                <span>Pages Used:</span>
                <span className="text-[#9BAABC]">Pages {f.pages.join(", ")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
