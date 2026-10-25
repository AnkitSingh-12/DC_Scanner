"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import PDFStructureExplorer from "@/components/PDFStructureExplorer";
import { FolderTree, RefreshCw, FileText, ChevronDown } from "lucide-react";
import { ScanSummary } from "@/types";

function ExplorerContent() {
  const searchParams = useSearchParams();
  const urlScanId = searchParams.get("scan_id");

  const [scans, setScans] = useState<ScanSummary[]>([]);
  const [selectedScanId, setSelectedScanId] = useState<string | null>(urlScanId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScans() {
      try {
        const res = await fetch("/api/v1/scans?limit=20");
        if (res.ok) {
          const data = await res.json();
          const items: ScanSummary[] = data.items || [];
          setScans(items);
          if (!selectedScanId && items.length > 0) {
            setSelectedScanId(items[0].scan_id);
          }
        }
      } catch (err) {
        console.error("Failed to load scans for explorer:", err);
      } finally {
        setLoading(false);
      }
    }
    loadScans();
  }, []);

  useEffect(() => {
    if (urlScanId) {
      setSelectedScanId(urlScanId);
    }
  }, [urlScanId]);

  const selectedScan = scans.find((s) => s.scan_id === selectedScanId);

  return (
    <div className="space-y-6">
      {/* Selector Toolbar */}
      <div className="cyber-card p-4 bg-[#141F30] border border-[#283548] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-[#9BAABC] uppercase tracking-wider mb-1">
            Selected Document for Tree Introspection:
          </label>
          <div className="relative">
            <select
              value={selectedScanId || ""}
              onChange={(e) => setSelectedScanId(e.target.value)}
              className="appearance-none bg-[#0C1421] border border-[#283548] text-xs font-bold text-[#F5F7FA] rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-[#35C987] cursor-pointer"
            >
              {scans.map((s) => (
                <option key={s.scan_id} value={s.scan_id}>
                  {s.filename} ({(s.file_size / 1024).toFixed(0)} KB) — {s.risk_level || "CLEAN"}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#9BAABC] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {selectedScan && (
          <div className="text-right text-xs text-[#9BAABC] space-y-1">
            <div className="font-mono text-[#F5F7FA]">ID: {selectedScan.scan_id}</div>
            <div className="font-mono text-[11px] text-[#64748B]">SHA-256: {selectedScan.sha256.slice(0, 24)}...</div>
          </div>
        )}
      </div>

      {/* Explorer Component */}
      {selectedScanId ? (
        <PDFStructureExplorer scanId={selectedScanId} />
      ) : (
        <div className="p-12 text-center bg-[#141F30] border border-[#283548] rounded-xl text-xs text-[#9BAABC]">
          No document selected or no scans available. Please upload a PDF to inspect its internal structure.
        </div>
      )}
    </div>
  );
}

export default function ExplorerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0C1421] text-[#F5F7FA]">
      <AppHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-[#35C987]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F7FA]">
              PDF Object Tree Explorer
            </h1>
          </div>
          <p className="text-xs text-[#9BAABC]">
            Low-level structural navigator: inspect the Document Catalog (/Root), Page Tree, indirect objects, and decompressed content streams.
          </p>
        </div>

        <Suspense fallback={
          <div className="p-12 text-center text-xs text-[#9BAABC] flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#35C987]" />
            <span>Loading structure explorer...</span>
          </div>
        }>
          <ExplorerContent />
        </Suspense>
      </main>

      <AppFooter />
    </div>
  );
}
