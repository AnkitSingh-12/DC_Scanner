"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import {
  History,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Info,
  Trash2,
  ChevronRight,
  RefreshCw,
  PlusCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { ScanSummary, RiskLevel } from "@/types";

export default function HistoryPage() {
  const [scans, setScans] = useState<ScanSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("ALL");

  // In-app delete modals (replacing native window.confirm)
  const [deleteTarget, setDeleteTarget] = useState<{ scanId: string; filename: string } | null>(null);
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchScans = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/v1/scans", window.location.origin);
      if (search) url.searchParams.set("search", search);
      if (riskFilter !== "ALL") url.searchParams.set("risk_level", riskFilter);
      url.searchParams.set("limit", "50");

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setScans(data.items || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, [riskFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchScans();
  };

  const executeDelete = async (scanId: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/v1/scans/${scanId}`, { method: "DELETE" });
      if (res.ok) {
        setScans((prev) => prev.filter((s) => s.scan_id !== scanId));
        setTotal((prev) => Math.max(0, prev - 1));
        setDeleteTarget(null);
        showToast("Scan record deleted successfully.");
      } else {
        showToast("Failed to delete record from storage.");
      }
    } catch {
      showToast("Failed to delete record.");
    } finally {
      setDeleting(false);
    }
  };

  const executeBulkDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/v1/scans", { method: "DELETE" });
      if (res.ok) {
        setScans([]);
        setTotal(0);
        setBulkDeleteModal(false);
        showToast("All scan records and files have been purged.");
      } else {
        showToast("Failed to purge scan records.");
      }
    } catch {
      showToast("Failed to purge scan records.");
    } finally {
      setDeleting(false);
    }
  };

  const getRiskChip = (level?: RiskLevel | null, score?: number | null) => {
    switch (level) {
      case "HIGH":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30">
            <AlertOctagon className="w-3.5 h-3.5" /> HIGH ({score ?? 0})
          </span>
        );
      case "MEDIUM":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" /> MEDIUM ({score ?? 0})
          </span>
        );
      case "LOW":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Info className="w-3.5 h-3.5" /> LOW ({score ?? 0})
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30">
            <ShieldCheck className="w-3.5 h-3.5" /> CLEAN (0)
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0C1421] text-[#F5F7FA]">
      <AppHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        {/* Toast Feedback */}
        {toastMessage && (
          <div className="p-3 rounded-xl bg-[#35C987]/15 border border-[#35C987]/40 text-[#35C987] text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <span>{toastMessage}</span>
            <button type="button" onClick={() => setToastMessage(null)} className="text-[#35C987] hover:text-white">✕</button>
          </div>
        )}

        {/* Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-6 h-6 text-[#35C987]" />
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F7FA]">
                Scan Audit History
              </h1>
            </div>
            <p className="text-xs text-[#9BAABC] mt-1">
              Historical ledger of analyzed documents, threat classifications, and cryptographic hashes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {scans.length > 0 && (
              <button
                type="button"
                id="btn-purge-all"
                onClick={() => setBulkDeleteModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold text-xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Purge All</span>
              </button>
            )}

            <Link
              href="/scanner"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#35C987] hover:bg-[#2EB377] text-[#0C1421] font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#35C987]/20 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Scan</span>
            </Link>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="cyber-card p-4 bg-[#141F30] border border-[#283548] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#9BAABC] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by filename or SHA-256..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0C1421] border border-[#283548] text-xs text-[#F5F7FA] placeholder-[#64748B] focus:outline-none focus:border-[#35C987]"
            />
          </form>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {["ALL", "CLEAN", "LOW", "MEDIUM", "HIGH"].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setRiskFilter(lvl)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                  riskFilter === lvl
                    ? "bg-[#35C987] text-[#0C1421]"
                    : "bg-[#0C1421] text-[#9BAABC] border border-[#283548] hover:text-[#F5F7FA]"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="cyber-card rounded-2xl border border-[#283548] overflow-hidden bg-[#141F30] shadow-xl">
          {loading ? (
            <div className="p-16 text-center text-xs text-[#9BAABC] flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#35C987]" />
              <span>Querying audit ledger...</span>
            </div>
          ) : scans.length === 0 ? (
            <div className="p-16 text-center text-xs text-[#9BAABC] space-y-3">
              <p>No document scans found matching current filters.</p>
              <Link
                href="/scanner"
                className="inline-block px-4 py-2 rounded-lg bg-[#35C987] text-[#0C1421] font-bold text-xs uppercase"
              >
                Launch First Scan
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0C1421] text-[#9BAABC] uppercase font-semibold border-b border-[#283548]">
                  <tr>
                    <th className="py-3 px-4">Filename</th>
                    <th className="py-3 px-4">Risk Level</th>
                    <th className="py-3 px-4">SHA-256 Checksum</th>
                    <th className="py-3 px-4">File Size</th>
                    <th className="py-3 px-4">Scanned At</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#283548]/60">
                  {scans.map((s) => (
                    <tr key={s.scan_id} className="hover:bg-[#1A273D]/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#F5F7FA] font-mono">
                        <Link href={`/scans/${s.scan_id}`} className="hover:text-[#35C987] hover:underline">
                          {s.filename}
                        </Link>
                      </td>
                      <td className="py-3 px-4">{getRiskChip(s.risk_level, s.risk_score)}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[#9BAABC]">
                        {s.sha256 ? `${s.sha256.slice(0, 16)}...` : "—"}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#9BAABC]">
                        {(s.file_size / 1024).toFixed(1)} KB
                      </td>
                      <td className="py-3 px-4 text-[#9BAABC] text-[11px]">
                        {new Date(s.created_at).toLocaleDateString()} {new Date(s.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/scans/${s.scan_id}`}
                            className="px-2.5 py-1 rounded bg-[#0C1421] border border-[#283548] text-[#F5F7FA] hover:text-[#35C987] font-semibold text-[11px] transition-colors"
                          >
                            Inspect
                          </Link>
                          <button
                            type="button"
                            id={`delete-btn-${s.scan_id}`}
                            onClick={() => setDeleteTarget({ scanId: s.scan_id, filename: s.filename })}
                            className="p-1.5 rounded-lg text-[#9BAABC] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Delete Scan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* SINGLE SCAN DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-[#0C1421]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="cyber-card p-6 rounded-2xl bg-[#141F30] border border-[#283548] max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/30">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#F5F7FA]">Delete Scan Record</h3>
            </div>
            <p className="text-xs text-[#9BAABC] leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-[#F5F7FA] font-mono">{deleteTarget.filename}</strong>? This removes all analysis streams and stored artifacts.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#0C1421] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-delete-btn"
                disabled={deleting}
                onClick={() => executeDelete(deleteTarget.scanId)}
                className="px-4 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK DELETE ALL CONFIRMATION MODAL */}
      {bulkDeleteModal && (
        <div className="fixed inset-0 z-50 bg-[#0C1421]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="cyber-card p-6 rounded-2xl bg-[#141F30] border border-red-500/30 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/30">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#F5F7FA]">Purge All History</h3>
            </div>
            <p className="text-xs text-[#9BAABC] leading-relaxed">
              This will permanently delete all <strong className="text-[#F5F7FA]">{total}</strong> scan dossiers and purge the local document storage directory. This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBulkDeleteModal(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#0C1421] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-bulk-delete-btn"
                disabled={deleting}
                onClick={executeBulkDelete}
                className="px-4 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Purging..." : "Purge All Records"}
              </button>
            </div>
          </div>
        </div>
      )}

      <AppFooter />
    </div>
  );
}
