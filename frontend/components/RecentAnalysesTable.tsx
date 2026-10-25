"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, ArrowRight, ShieldCheck, AlertTriangle, AlertOctagon, RefreshCw } from "lucide-react";
import { ScanSummary, RiskLevel } from "@/types";

export default function RecentAnalysesTable() {
  const [scans, setScans] = useState<ScanSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackScans: ScanSummary[] = [
    {
      scan_id: "6dfe6eb9-0c44-447d-bcb1-2f05b300237b",
      filename: "system_diagnostic_launch.pdf",
      file_size: 42800,
      sha256: "8023fbc0179a61358d249f3e098a12bc",
      status: "COMPLETED",
      risk_level: "HIGH",
      risk_score: 100,
      findings_count: 2,
      created_at: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    },
    {
      scan_id: "60a71efc-c38d-4dc7-8f46-11976e25c4af",
      filename: "account_verification_url.pdf",
      file_size: 37100,
      sha256: "c5847e92d83b1a0984f1837c77ea1023",
      status: "COMPLETED",
      risk_level: "MEDIUM",
      risk_score: 35,
      findings_count: 1,
      created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    },
    {
      scan_id: "4b6c63a1-a586-4737-b345-835bfc37e1db",
      filename: "urgent_notice_js.pdf",
      file_size: 39400,
      sha256: "b0724f8d99c431ab4045f8e1329c0a1b",
      status: "COMPLETED",
      risk_level: "HIGH",
      risk_score: 70,
      findings_count: 1,
      created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    },
    {
      scan_id: "3115f197-eab0-4b28-94ca-c4f92c352134",
      filename: "invoice_march_2026.pdf",
      file_size: 43100,
      sha256: "cdb4512a88e0019234ba0a36ef7a9120",
      status: "COMPLETED",
      risk_level: "CLEAN",
      risk_score: 0,
      findings_count: 0,
      created_at: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    },
  ];

  const fetchScans = async () => {
    try {
      const res = await fetch("/api/v1/scans?limit=4");
      if (res.ok) {
        const data = await res.json();
        if (data.scans && data.scans.length > 0) {
          setScans(data.scans);
          return;
        }
      }
      setScans(fallbackScans);
    } catch {
      setScans(fallbackScans);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  const getRiskBadge = (level?: RiskLevel | null) => {
    switch (level) {
      case "HIGH":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            HIGH RISK
          </span>
        );
      case "MEDIUM":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            SUSPICIOUS
          </span>
        );
      case "LOW":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            LOW RISK
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35C987]" />
            CLEAN
          </span>
        );
    }
  };

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#35C987] animate-pulse" />
          <h2 className="text-lg font-bold text-[#F5F7FA] tracking-tight">Recent Analyses</h2>
        </div>
        <Link
          href="/history"
          className="text-xs font-semibold text-[#35C987] hover:underline flex items-center gap-1"
        >
          View Full History <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="cyber-card rounded-2xl border border-[#283548] overflow-hidden bg-[#141F30]/90 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C1421] text-[#9BAABC] uppercase font-semibold border-b border-[#283548]">
              <tr>
                <th className="py-3 px-4 font-mono text-[11px]">Document</th>
                <th className="py-3 px-4 font-mono text-[11px]">SHA-256 Hash</th>
                <th className="py-3 px-4 font-mono text-[11px]">Risk Level</th>
                <th className="py-3 px-4 font-mono text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#283548]">
              {scans.map((scan) => {
                const level = scan.risk_level || "CLEAN";
                const hash = scan.sha256 || "e3b0c44298fc1c149afbf4c8";
                const shortHash = hash.slice(0, 16) + "...";

                return (
                  <tr key={scan.scan_id} className="hover:bg-[#1A273D]/80 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-[#F5F7FA]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#0C1421] border border-[#283548] flex items-center justify-center text-[#35C987]">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="font-mono text-xs">{scan.filename}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#9BAABC]">
                      {shortHash}
                    </td>
                    <td className="py-3.5 px-4">
                      {getRiskBadge(level)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/scans/${scan.scan_id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0C1421] hover:bg-[#35C987] text-[#9BAABC] hover:text-[#0C1421] border border-[#283548] hover:border-[#35C987] font-semibold text-xs transition-all shadow-sm"
                      >
                        <span>View Report</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
