"use client";

import React, { useState } from "react";
import { Finding, FindingSeverity } from "@/types";
import FindingCard from "./FindingCard";
import { Filter, Search, ShieldCheck } from "lucide-react";

interface FindingsListProps {
  findings: Finding[];
}

export default function FindingsList({ findings }: FindingsListProps) {
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const filtered = findings.filter((f) => {
    if (severityFilter !== "ALL" && f.severity !== severityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        f.title.toLowerCase().includes(q) ||
        f.rule_id.toLowerCase().includes(q) ||
        f.evidence.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#141F30] border border-[#283548] rounded-xl p-3">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#9BAABC] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search findings, rule IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0C1421] border border-[#283548] text-xs text-[#F5F7FA] placeholder-[#64748B] focus:outline-none focus:border-[#35C987]"
          />
        </div>

        {/* Severity buttons */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"].map((sev) => {
            const count =
              sev === "ALL"
                ? findings.length
                : findings.filter((f) => f.severity === sev).length;

            return (
              <button
                key={sev}
                type="button"
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors shrink-0 flex items-center gap-1.5 ${
                  severityFilter === sev
                    ? "bg-[#35C987] text-[#0C1421]"
                    : "bg-[#0C1421] text-[#9BAABC] border border-[#283548] hover:text-[#F5F7FA]"
                }`}
              >
                <span>{sev}</span>
                <span
                  className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                    severityFilter === sev
                      ? "bg-[#0C1421]/20 text-[#0C1421]"
                      : "bg-[#141F30] text-[#9BAABC]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Findings List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl bg-[#141F30]/60 border border-[#283548] space-y-2">
          <ShieldCheck className="w-10 h-10 text-[#35C987] mx-auto opacity-75" />
          <h4 className="text-sm font-semibold text-[#F5F7FA]">No findings matching selected criteria</h4>
          <p className="text-xs text-[#9BAABC]">
            {findings.length === 0
              ? "All forensic checks passed without detecting suspicious indicators."
              : "Try clearing search filters or changing the severity selection."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((finding) => (
            <FindingCard key={`${finding.rule_id}-${finding.title}`} finding={finding} />
          ))}
        </div>
      )}
    </div>
  );
}
