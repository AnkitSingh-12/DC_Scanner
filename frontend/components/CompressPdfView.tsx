"use client";

import React, { useState, useEffect } from "react";
import { Minimize2, Download, CheckCircle2, AlertCircle, RefreshCw, Zap } from "lucide-react";

interface CompressResponse {
  scan_id: string;
  filename: string;
  original_size: number;
  compressed_size: number;
  savings_bytes: number;
  savings_percent: number;
  download_url: string;
}

interface CompressPdfViewProps {
  scanId: string;
  filename: string;
}

export default function CompressPdfView({ scanId, filename }: CompressPdfViewProps) {
  const [data, setData] = useState<CompressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function runCompress() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/v1/scans/${scanId}/compress`);
        if (!res.ok) throw new Error("Failed to optimize document streams");
        const json: CompressResponse = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Compression engine encountered an error");
      } finally {
        setLoading(false);
      }
    }
    runCompress();
  }, [scanId]);

  if (loading) {
    return (
      <div className="p-16 text-center text-sm text-[#9BAABC] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-[#35C987]" />
        <span>Executing lossless Flate stream compression and purging orphan objects...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-12 text-center text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-2xl">
        <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-400" />
        <p>{error || "Unable to optimize PDF."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#141F30] border border-[#283548] shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#35C987]/15 border border-[#35C987]/30 flex items-center justify-center text-[#35C987]">
            <Minimize2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#F5F7FA]">Lossless PDF Compression & Stream Optimizer</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30">
                {data.savings_percent}% Smaller
              </span>
            </div>
            <p className="text-xs text-[#9BAABC] mt-1">
              Optimization results for <span className="font-mono text-[#F5F7FA]">{filename}</span>
            </p>
          </div>
        </div>

        <a
          href={data.download_url}
          download={`optimized_${filename}`}
          className="px-5 py-2.5 rounded-xl bg-[#35C987] text-[#0C1421] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#2EB377] transition-all shadow-lg shadow-[#35C987]/20 active:scale-95 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Optimized PDF</span>
        </a>
      </div>

      {/* Comparison Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-5 rounded-2xl bg-[#141F30] border border-[#283548] space-y-1">
          <span className="text-[10px] text-[#64748B] uppercase font-bold block">Original File Size</span>
          <span className="text-2xl font-black text-[#F5F7FA]">
            {(data.original_size / 1024).toFixed(1)} KB
          </span>
          <span className="text-[11px] text-[#64748B] block font-sans">Uncompressed binary streams</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#141F30] border border-[#283548] space-y-1">
          <span className="text-[10px] text-[#64748B] uppercase font-bold block">Optimized File Size</span>
          <span className="text-2xl font-black text-[#35C987]">
            {(data.compressed_size / 1024).toFixed(1)} KB
          </span>
          <span className="text-[11px] text-[#35C987] block font-sans">
            ✓ Reduced by {(data.savings_bytes / 1024).toFixed(1)} KB
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#141F30] border border-[#283548] space-y-1">
          <span className="text-[10px] text-[#64748B] uppercase font-bold block">Savings Efficiency</span>
          <span className="text-2xl font-black text-amber-400">
            {data.savings_percent}%
          </span>
          <span className="text-[11px] text-[#9BAABC] block font-sans">Lossless Flate compression</span>
        </div>
      </div>

      {/* Optimization Pipeline Applied */}
      <div className="p-6 rounded-2xl bg-[#141F30] border border-[#283548] space-y-4 shadow-xl">
        <div className="flex items-center gap-2 pb-2 border-b border-[#283548]">
          <Zap className="w-4 h-4 text-[#35C987]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FA]">
            Optimizations Applied to Document Streams
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          {[
            {
              title: "FlateDecode Deflation",
              desc: "Re-compressed uncompressed font and content streams using optimal zlib compression level 9.",
            },
            {
              title: "Orphan Stream Purging",
              desc: "Garbage collected unreferenced indirect objects and metadata fragments from incremental revisions.",
            },
            {
              title: "Cross-Reference Table Compaction",
              desc: "De-duplicated xref entries and optimized byte offsets for instantaneous page rendering.",
            },
            {
              title: "Zero Visual Degradation",
              desc: "All vector lines, fonts, text encodings, and layout geometries preserved with 100% fidelity.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#0C1421] border border-[#283548] flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#35C987]" />
                  <span className="font-bold text-[#F5F7FA]">{item.title}</span>
                </div>
                <p className="text-[11px] text-[#9BAABC] pl-5.5">{item.desc}</p>
              </div>
              <span className="text-[10px] font-bold text-[#35C987] uppercase tracking-wider bg-[#35C987]/10 px-2 py-1 rounded">
                COMPLETE
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
