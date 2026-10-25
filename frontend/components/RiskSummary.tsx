"use client";

import React from "react";
import { ShieldCheck, AlertTriangle, AlertOctagon, Info, HelpCircle } from "lucide-react";
import { RiskAssessment } from "@/types";

interface RiskSummaryProps {
  risk: RiskAssessment;
}

export default function RiskSummary({ risk }: RiskSummaryProps) {
  const isClean = risk.risk_level === "CLEAN";
  const isLow = risk.risk_level === "LOW";
  const isMed = risk.risk_level === "MEDIUM";
  const isHigh = risk.risk_level === "HIGH";

  const getTheme = () => {
    if (isHigh) {
      return {
        border: "border-red-500/40",
        bg: "bg-red-500/10",
        text: "text-red-400",
        badgeBg: "bg-red-500/20 text-red-300 border-red-500/40",
        icon: AlertOctagon,
        strokeColor: "#EF4444",
      };
    }
    if (isMed) {
      return {
        border: "border-amber-500/40",
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        icon: AlertTriangle,
        strokeColor: "#F59E0B",
      };
    }
    if (isLow) {
      return {
        border: "border-blue-500/40",
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        badgeBg: "bg-blue-500/20 text-blue-300 border-blue-500/40",
        icon: Info,
        strokeColor: "#3B82F6",
      };
    }
    return {
      border: "border-[#35C987]/40",
      bg: "bg-[#35C987]/10",
      text: "text-[#35C987]",
      badgeBg: "bg-[#35C987]/20 text-[#35C987] border-[#35C987]/40",
      icon: ShieldCheck,
      strokeColor: "#35C987",
    };
  };

  const theme = getTheme();
  const Icon = theme.icon;

  // Gauge calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (risk.risk_score / 100) * circumference;

  return (
    <div className={`w-full bg-[#141F30] border ${theme.border} rounded-xl p-6 relative overflow-hidden`}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Verdict Section */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${theme.badgeBg}`}
            >
              <Icon className="w-4 h-4" />
              {risk.risk_level} RISK
            </span>
            <span className="text-xs text-[#9BAABC]">Confidence: {risk.confidence}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7FA] tracking-tight">
            {risk.verdict_headline}
          </h2>

          <p className="text-sm text-[#9BAABC] leading-relaxed max-w-2xl">
            {risk.verdict_summary}
          </p>

          {/* Transparent Score Breakdown Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            {Object.entries(risk.score_breakdown).map(([key, val]) => (
              <span
                key={key}
                className="px-2.5 py-1 rounded bg-[#0C1421] border border-[#283548] text-[#9BAABC] text-[11px]"
              >
                <strong className="text-[#F5F7FA]">{key.replace("_", " ")}:</strong> +{val} pts
              </span>
            ))}
          </div>
        </div>

        {/* Right Radial Gauge Card */}
        <div className="flex items-center gap-6 bg-[#0C1421] border border-[#283548] rounded-xl p-4 shrink-0">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-[#283548]"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={theme.strokeColor}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-[#F5F7FA] font-mono leading-none">
                {risk.risk_score}
              </span>
              <span className="text-[9px] text-[#9BAABC] uppercase font-bold tracking-wider mt-0.5">
                Risk Score
              </span>
            </div>
          </div>

          <div className="space-y-1 text-right">
            <div className="text-xs text-[#9BAABC]">Safety Rating</div>
            <div className="text-xl font-bold text-[#35C987] font-mono">{risk.safety_score}/100</div>
            <p className="text-[10px] text-[#64748B]">
              {risk.risk_score < 20 ? "Safe for viewing" : risk.risk_score < 60 ? "Inspect in sandbox" : "High exploit threat"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
