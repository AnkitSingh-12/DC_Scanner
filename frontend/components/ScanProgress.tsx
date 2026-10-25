"use client";

import React from "react";
import { CheckCircle2, Loader2, Shield, FileSearch, Code2, AlertTriangle, Layers } from "lucide-react";

interface ScanProgressProps {
  progressPercent: number;
  currentStage: string;
  status: string;
}

const STAGES = [
  { label: "File Validation & Signature Check", threshold: 15, icon: FileSearch },
  { label: "Metadata & Trailer Parsing", threshold: 35, icon: Layers },
  { label: "Object Streams & Structural Forensics", threshold: 60, icon: Code2 },
  { label: "Active Content & Exploit Hunting", threshold: 85, icon: AlertTriangle },
  { label: "Risk Score & Dossier Synthesis", threshold: 100, icon: Shield },
];

export default function ScanProgress({ progressPercent, currentStage, status }: ScanProgressProps) {
  return (
    <div className="w-full bg-[#141F30] border border-[#283548] rounded-xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-[#35C987] animate-spin" />
            <h3 className="text-lg font-bold text-[#F5F7FA]">Deep Inspection in Progress</h3>
          </div>
          <p className="text-xs text-[#9BAABC] mt-1">{currentStage}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-[#35C987] font-mono">{progressPercent}%</span>
          <p className="text-[10px] text-[#64748B] uppercase tracking-wider">Engine Processing</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#0C1421] h-3 rounded-full overflow-hidden border border-[#283548] p-0.5">
        <div
          className="bg-gradient-to-r from-[#2EB377] to-[#35C987] h-full rounded-full transition-all duration-300 shadow-sm"
          style={{ width: `${Math.max(5, progressPercent)}%` }}
        />
      </div>

      {/* Stages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
        {STAGES.map((s, idx) => {
          const Icon = s.icon;
          const isDone = progressPercent >= s.threshold;
          const isCurrent =
            !isDone && (idx === 0 || progressPercent >= STAGES[idx - 1].threshold);

          return (
            <div
              key={s.label}
              className={`p-3 rounded-lg border transition-all ${
                isDone
                  ? "bg-[#35C987]/10 border-[#35C987]/30 text-[#35C987]"
                  : isCurrent
                  ? "bg-[#1E2E48] border-[#35C987] text-[#F5F7FA] shadow-md animate-pulse"
                  : "bg-[#0C1421]/60 border-[#283548] text-[#64748B]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-4 h-4" />
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#35C987]" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#35C987]" />
                ) : (
                  <span className="text-[10px] font-mono text-[#64748B]">{idx + 1}</span>
                )}
              </div>
              <p className="text-[11px] font-medium leading-tight">{s.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
