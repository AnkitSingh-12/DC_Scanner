"use client";

import React from "react";
import Link from "next/link";
import { AlertOctagon, AlertTriangle, CheckCircle2, Shield, ArrowRight } from "lucide-react";

export default function RealTimeAuditsFeed() {
  const events = [
    {
      title: "Weaponized /Launch Action",
      file: "system_diagnostic_launch.pdf",
      time: "0.8s ago",
      level: "HIGH",
      color: "text-red-400 bg-red-500/15 border-red-500/30",
      dot: "bg-red-500",
      id: "6dfe6eb9-0c44-447d-bcb1-2f05b300237b",
    },
    {
      title: "Direct IPv4 Phishing Link",
      file: "account_verification_url.pdf",
      time: "2.4s ago",
      level: "SUSPICIOUS",
      color: "text-amber-400 bg-amber-500/15 border-amber-500/30",
      dot: "bg-amber-400",
      id: "60a71efc-c38d-4dc7-8f46-11976e25c4af",
    },
    {
      title: "Verified Financial Invoice",
      file: "invoice_march_2026.pdf",
      time: "5.1s ago",
      level: "CLEAN",
      color: "text-[#35C987] bg-[#35C987]/15 border-[#35C987]/30",
      dot: "bg-[#35C987]",
      id: "3115f197-eab0-4b28-94ca-c4f92c352134",
    },
    {
      title: "Obfuscated /JavaScript Stream",
      file: "urgent_notice_js.pdf",
      time: "8.3s ago",
      level: "HIGH",
      color: "text-red-400 bg-red-500/15 border-red-500/30",
      dot: "bg-red-500",
      id: "4b6c63a1-a586-4737-b345-835bfc37e1db",
    },
    {
      title: "Clean Academic Paper ISO 32000",
      file: "iso_32000_standard_v2.pdf",
      time: "12.0s ago",
      level: "CLEAN",
      color: "text-[#35C987] bg-[#35C987]/15 border-[#35C987]/30",
      dot: "bg-[#35C987]",
      id: "3115f197-eab0-4b28-94ca-c4f92c352134",
    },
  ];

  return (
    <div className="cyber-card rounded-2xl bg-[#141F30] border border-[#283548] p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-[#283548]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#35C987] animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FA]">
            LATEST AUDITS
          </h3>
        </div>
        <span className="text-[10px] text-[#64748B] font-mono">Real-time Feed</span>
      </div>

      <div className="space-y-2.5">
        {events.map((ev, idx) => (
          <Link
            key={idx}
            href={`/scans/${ev.id}`}
            className="p-3 rounded-xl bg-[#0C1421] border border-[#283548] hover:border-[#35C987]/50 transition-all flex items-center justify-between group text-xs block"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${ev.dot}`} />
                <h4 className="font-bold text-[#F5F7FA] group-hover:text-[#35C987] transition-colors">
                  {ev.title}
                </h4>
              </div>
              <p className="text-[11px] font-mono text-[#9BAABC] pl-3.5">
                {ev.file} • <span className="text-[#64748B]">{ev.time}</span>
              </p>
            </div>

            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${ev.color}`}
            >
              {ev.level}
            </span>
          </Link>
        ))}
      </div>

      <div className="pt-2 border-t border-[#283548] text-center">
        <Link
          href="/history"
          className="text-xs font-semibold text-[#35C987] hover:underline inline-flex items-center gap-1"
        >
          <span>View all security telemetry</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
