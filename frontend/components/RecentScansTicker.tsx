"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, AlertTriangle, AlertOctagon, Info, ChevronRight, RefreshCw } from "lucide-react";
import { ScanSummary } from "@/types";

export default function RecentScansTicker() {
  const [scans, setScans] = useState<ScanSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScans = async () => {
    try {
      const res = await fetch("/api/v1/scans?limit=5");
      if (res.ok) {
        const data = await res.json();
        setScans(data.items || []);
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
    const interval = setInterval(fetchScans, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && scans.length === 0) {
    return (
      <div className="w-full bg-[#141F30]/60 border-y border-[#283548] py-2 px-4 text-xs text-[#9BAABC] flex items-center justify-center gap-2">
        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#35C987]" />
        <span>Loading live scan telemetry...</span>
      </div>
    );
  }

  if (scans.length === 0) return null;

  const getRiskBadge = (level?: string | null) => {
    switch (level) {
      case "HIGH":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
            <AlertOctagon className="w-3 h-3" /> HIGH RISK
          </span>
        );
      case "MEDIUM":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" /> SUSPICIOUS
          </span>
        );
      case "LOW":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Info className="w-3 h-3" /> LOW RISK
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30">
            <ShieldCheck className="w-3 h-3" /> CLEAN
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-[#111A29] border-y border-[#283548] py-2.5 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#9BAABC] font-medium shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#35C987] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#35C987]"></span>
          </span>
          <span className="text-[#F5F7FA] font-semibold">LIVE FORENSIC FEED:</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto scrollbar-none py-1">
          {scans.slice(0, 4).map((scan) => (
            <Link
              key={scan.scan_id}
              href={`/scans/${scan.scan_id}`}
              className="flex items-center gap-2.5 px-3 py-1 rounded bg-[#141F30] hover:bg-[#1A273C] border border-[#283548] hover:border-[#35C987]/40 transition-colors shrink-0 group"
            >
              <span className="font-mono text-[#F5F7FA] truncate max-w-[140px] font-medium group-hover:text-[#35C987]">
                {scan.filename}
              </span>
              {getRiskBadge(scan.risk_level)}
              <span className="text-[#64748B] text-[10px]">
                {scan.file_size ? `${(scan.file_size / 1024).toFixed(0)} KB` : ""}
              </span>
              <ChevronRight className="w-3 h-3 text-[#64748B] group-hover:text-[#35C987]" />
            </Link>
          ))}
        </div>

        <Link
          href="/history"
          className="shrink-0 text-[#35C987] hover:underline font-medium text-xs flex items-center gap-1"
        >
          View All History <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
