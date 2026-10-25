"use client";

import React, { useState } from "react";
import { AlertOctagon, AlertTriangle, Info, ChevronDown, ChevronUp, ShieldAlert, CheckCircle, MapPin, Terminal } from "lucide-react";
import { Finding, FindingSeverity } from "@/types";

interface FindingCardProps {
  finding: Finding;
}

export default function FindingCard({ finding }: FindingCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getSeverityBadge = (severity: FindingSeverity) => {
    switch (severity) {
      case "CRITICAL":
        return {
          bg: "bg-red-500/15 text-red-400 border-red-500/40",
          icon: AlertOctagon,
          label: "CRITICAL",
          cardBorder: "border-red-500/30 hover:border-red-500/60",
        };
      case "HIGH":
        return {
          bg: "bg-red-500/15 text-red-400 border-red-500/40",
          icon: AlertOctagon,
          label: "HIGH",
          cardBorder: "border-red-500/30 hover:border-red-500/60",
        };
      case "MEDIUM":
        return {
          bg: "bg-amber-500/15 text-amber-400 border-amber-500/40",
          icon: AlertTriangle,
          label: "MEDIUM",
          cardBorder: "border-amber-500/30 hover:border-amber-500/60",
        };
      case "LOW":
        return {
          bg: "bg-blue-500/15 text-blue-400 border-blue-500/40",
          icon: Info,
          label: "LOW",
          cardBorder: "border-blue-500/30 hover:border-blue-500/60",
        };
      default:
        return {
          bg: "bg-gray-500/15 text-gray-400 border-gray-500/40",
          icon: Info,
          label: "INFORMATIONAL",
          cardBorder: "border-gray-500/30 hover:border-gray-500/60",
        };
    }
  };

  const badge = getSeverityBadge(finding.severity);
  const Icon = badge.icon;

  return (
    <div
      className={`w-full bg-[#141F30] border ${badge.cardBorder} rounded-xl p-5 transition-all shadow-sm`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${badge.bg}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {badge.label}
            </span>
            <span className="font-mono text-xs text-[#9BAABC] bg-[#0C1421] px-2 py-0.5 rounded border border-[#283548]">
              {finding.rule_id}
            </span>
            <span className="text-xs text-[#64748B]">Category: {finding.category}</span>
            {finding.location && (
              <span className="inline-flex items-center gap-1 text-[11px] text-[#9BAABC] bg-[#0C1421] px-2 py-0.5 rounded border border-[#283548]">
                <MapPin className="w-3 h-3 text-[#35C987]" />
                {finding.location}
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-[#F5F7FA] pt-1">{finding.title}</h3>
        </div>

        <button
          type="button"
          className="p-1.5 rounded-lg bg-[#0C1421] border border-[#283548] text-[#9BAABC] hover:text-[#F5F7FA]"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-[#283548] space-y-3.5 text-xs">
          {/* Evidence snippet */}
          <div>
            <div className="text-[11px] font-semibold text-[#9BAABC] uppercase tracking-wider mb-1 flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-[#35C987]" /> Forensic Evidence
            </div>
            <div className="p-3 rounded-lg bg-[#0C1421] border border-[#283548] font-mono text-[#F5F7FA] overflow-x-auto text-[11px]">
              {finding.evidence}
            </div>
          </div>

          {/* Explanation */}
          <div>
            <div className="text-[11px] font-semibold text-[#9BAABC] uppercase tracking-wider mb-1">
              Analysis & Threat Context
            </div>
            <p className="text-[#9BAABC] leading-relaxed">{finding.explanation}</p>
          </div>

          {/* Remediation */}
          <div className="p-3 rounded-lg bg-[#35C987]/10 border border-[#35C987]/25 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-[#35C987] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#35C987] block mb-0.5">Recommended Next Steps:</span>
              <p className="text-[#F5F7FA] leading-relaxed">{finding.remediation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
