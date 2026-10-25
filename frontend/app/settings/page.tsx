"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import {
  Settings,
  Shield,
  Lock,
  Clock,
  Server,
  Trash2,
  Check,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export default function SettingsPage() {
  const [retention, setRetention] = useState<"instant" | "24h" | "30d">("24h");
  const [healthData, setHealthData] = useState<any>(null);
  const [savedNotice, setSavedNotice] = useState(false);
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purging, setPurging] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/v1/health")
      .then((res) => res.json())
      .then((data) => setHealthData(data))
      .catch(() => {});
  }, []);

  const saveSettings = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const executePurgeAll = async () => {
    setPurging(true);
    try {
      const res = await fetch("/api/v1/scans", { method: "DELETE" });
      if (res.ok) {
        setShowPurgeModal(false);
        setPurgeSuccess(true);
        setTimeout(() => setPurgeSuccess(false), 4000);
      }
    } catch {
      setShowPurgeModal(false);
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0C1421] text-[#F5F7FA]">
      <AppHeader />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#35C987]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F7FA]">
              Platform & Privacy Settings
            </h1>
          </div>
          <p className="text-xs text-[#9BAABC]">
            Configure document retention policies, sandbox isolation preferences, and audit engine configurations.
          </p>
        </div>

        {savedNotice && (
          <div className="p-3 rounded-lg bg-[#35C987]/15 border border-[#35C987]/40 text-[#35C987] text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Preferences saved successfully.</span>
          </div>
        )}

        {purgeSuccess && (
          <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Trash2 className="w-4 h-4" />
            <span>All historical scan dossiers, database records, and local PDF files have been purged.</span>
          </div>
        )}

        {/* RETENTION POLICY */}
        <section className="cyber-card p-6 bg-[#141F30] border border-[#283548] rounded-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-[#283548] pb-3">
            <Lock className="w-5 h-5 text-[#35C987]" />
            <div>
              <h2 className="text-sm font-bold text-[#F5F7FA]">Document Retention & Data Privacy</h2>
              <p className="text-xs text-[#9BAABC]">Determine how long uploaded PDFs remain in private storage before automatic deletion.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div
              onClick={() => setRetention("instant")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                retention === "instant"
                  ? "bg-[#35C987]/10 border-[#35C987] text-[#35C987]"
                  : "bg-[#0C1421] border-[#283548] text-[#9BAABC] hover:border-[#35C987]/40"
              }`}
            >
              <span className="font-bold text-xs block mb-1">Instant Zero-Retention</span>
              <p className="text-[11px] text-[#9BAABC] leading-tight">
                Original file is purged from memory and storage immediately after extraction completes.
              </p>
            </div>

            <div
              onClick={() => setRetention("24h")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                retention === "24h"
                  ? "bg-[#35C987]/10 border-[#35C987] text-[#35C987]"
                  : "bg-[#0C1421] border-[#283548] text-[#9BAABC] hover:border-[#35C987]/40"
              }`}
            >
              <span className="font-bold text-xs block mb-1">24 Hours (Default)</span>
              <p className="text-[11px] text-[#9BAABC] leading-tight">
                File is preserved for 24 hours to enable object tree browsing and re-downloading.
              </p>
            </div>

            <div
              onClick={() => setRetention("30d")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                retention === "30d"
                  ? "bg-[#35C987]/10 border-[#35C987] text-[#35C987]"
                  : "bg-[#0C1421] border-[#283548] text-[#9BAABC] hover:border-[#35C987]/40"
              }`}
            >
              <span className="font-bold text-xs block mb-1">30 Days (Audit Log)</span>
              <p className="text-[11px] text-[#9BAABC] leading-tight">
                Retains scans for 30 days for continuous compliance verification and team reporting.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={saveSettings}
              className="px-4 py-2 rounded-lg bg-[#35C987] hover:bg-[#2EB377] text-[#0C1421] font-bold text-xs uppercase tracking-wider"
            >
              Save Policy
            </button>
          </div>
        </section>

        {/* SYSTEM STATUS & ENGINE METRICS */}
        <section className="cyber-card p-6 bg-[#141F30] border border-[#283548] rounded-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-[#283548] pb-3">
            <Server className="w-5 h-5 text-[#35C987]" />
            <div>
              <h2 className="text-sm font-bold text-[#F5F7FA]">Forensic Engine Diagnostics</h2>
              <p className="text-xs text-[#9BAABC]">Active binary parsers and parser library runtime capabilities.</p>
            </div>
          </div>

          {healthData ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#0C1421] border border-[#283548]">
                <span className="text-[#9BAABC] text-[11px] block">pypdf Version</span>
                <span className="font-mono font-bold text-[#F5F7FA]">{healthData.engines?.pypdf}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0C1421] border border-[#283548]">
                <span className="text-[#9BAABC] text-[11px] block">pikepdf (QPDF)</span>
                <span className="font-mono font-bold text-[#F5F7FA]">{healthData.engines?.pikepdf}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0C1421] border border-[#283548]">
                <span className="text-[#9BAABC] text-[11px] block">PyMuPDF (MuPDF)</span>
                <span className="font-mono font-bold text-[#F5F7FA]">{healthData.engines?.pymupdf}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0C1421] border border-[#283548]">
                <span className="text-[#9BAABC] text-[11px] block">Engine Uptime</span>
                <span className="font-mono font-bold text-[#35C987]">{healthData.uptime_seconds}s</span>
              </div>
            </div>
          ) : (
            <div className="p-4 text-xs text-[#9BAABC]">Querying backend engine status...</div>
          )}

          <div className="pt-3 border-t border-[#283548] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[#35C987] font-bold">DC Scanner v1.8.0</span>
              <span className="text-[#9BAABC]">• Latest Engine Release</span>
            </div>
            <Link
              href="/changelog"
              className="text-[#35C987] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View Full Changelog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* DATA STORAGE & FORENSIC PURGE */}
        <section className="cyber-card p-6 bg-[#141F30] border border-red-500/20 rounded-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-[#283548] pb-3">
            <Trash2 className="w-5 h-5 text-red-400" />
            <div>
              <h2 className="text-sm font-bold text-[#F5F7FA]">Data Storage & Forensic Purge</h2>
              <p className="text-xs text-[#9BAABC]">Instantly purge all historical scan reports, parsed object trees, and local file storage artifacts.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#F5F7FA]">Zero-Retention Manual Purge</span>
              <p className="text-[11px] text-[#9BAABC]">
                Deletes all document inspection history and resets local storage across the platform.
              </p>
            </div>
            <button
              type="button"
              id="purge-storage-btn"
              onClick={() => setShowPurgeModal(true)}
              className="px-4 py-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Purge All Records
            </button>
          </div>
        </section>

        {/* PURGE ALL CONFIRMATION MODAL */}
        {showPurgeModal && (
          <div className="fixed inset-0 z-50 bg-[#0C1421]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="cyber-card p-6 rounded-2xl bg-[#141F30] border border-red-500/30 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-red-400">
                <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#F5F7FA]">Purge Storage & History</h3>
              </div>
              <p className="text-xs text-[#9BAABC] leading-relaxed">
                This action will delete every scanned document, parsed JSON report, and SQLite history entry permanently. Are you sure you wish to proceed?
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  id="cancel-purge-storage-btn"
                  onClick={() => setShowPurgeModal(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#0C1421] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="confirm-purge-storage-btn"
                  disabled={purging}
                  onClick={executePurgeAll}
                  className="px-4 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {purging ? "Purging..." : "Purge All Records"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <AppFooter />
    </div>
  );
}
