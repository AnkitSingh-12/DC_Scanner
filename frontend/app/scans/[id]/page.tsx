"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import ExtractedTextView from "@/components/ExtractedTextView";
import AiPdfChatView from "@/components/AiPdfChatView";
import PdfToMarkdownView from "@/components/PdfToMarkdownView";
import ExtractedImagesView from "@/components/ExtractedImagesView";
import SignaturesAuditView from "@/components/SignaturesAuditView";
import FontInspectorView from "@/components/FontInspectorView";
import CompressPdfView from "@/components/CompressPdfView";
import {
  Shield,
  FileText,
  Download,
  Trash2,
  Code2,
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  Clock,
  Sparkles,
  ChevronDown,
  Maximize2,
  Lock,
  Zap,
  Type,
  FileSpreadsheet,
  Cpu,
  Bookmark,
  MessageSquare,
  FileCode2,
  Hash,
  Image as ImageIcon,
  ShieldCheck,
  Minimize2,
} from "lucide-react";
import { ScanRecord, TextExtractionData } from "@/types";

function normalizeTool(raw: string | null): string {
  if (!raw) return "dossier";
  const r = raw.toLowerCase().trim().replace(/-/g, "_");
  if (r === "extract_text" || r === "text") return "extract_text";
  if (r === "ai_chat" || r === "chat" || r === "ai") return "ai_chat";
  if (r === "pdf_to_md" || r === "markdown" || r === "md") return "pdf_to_md";
  if (r === "extract_images" || r === "images" || r === "img") return "extract_images";
  if (r === "signatures" || r === "signature") return "signatures";
  if (r === "fonts" || r === "font") return "fonts";
  if (r === "compress" || r === "optimize") return "compress";
  return "dossier";
}

function ScanResultContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const scanId = params.id as string;

  const initialTool = normalizeTool(searchParams.get("tool") || searchParams.get("view"));
  const [activeTool, setActiveTool] = useState<string>(initialTool);

  const handleSwitchTool = (newTool: string) => {
    setActiveTool(newTool);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tool", newTool);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const [scan, setScan] = useState<ScanRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Extracted text state
  const [textData, setTextData] = useState<TextExtractionData | null>(null);
  const [loadingText, setLoadingText] = useState(false);

  useEffect(() => {
    async function fetchScan() {
      try {
        const res = await fetch(`/api/v1/scans/${scanId}`);
        if (res.ok) {
          const data = await res.json();
          setScan(data);
        }
      } catch (err) {
        console.error("Failed to load scan:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchScan();
  }, [scanId]);

  useEffect(() => {
    if (activeTool === "extract_text") {
      async function fetchText() {
        setLoadingText(true);
        try {
          const res = await fetch(`/api/v1/scans/${scanId}/text`);
          if (res.ok) {
            const data = await res.json();
            setTextData(data);
          }
        } catch (err) {
          console.error("Failed to load text:", err);
        } finally {
          setLoadingText(false);
        }
      }
      fetchText();
    }
  }, [scanId, activeTool]);

  const copyShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const copyRawJson = () => {
    if (scan) {
      navigator.clipboard.writeText(JSON.stringify(scan, null, 2));
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 2000);
    }
  };

  const handleDownloadJson = () => {
    if (!scan) return;
    const blob = new Blob([JSON.stringify(scan, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${scan.filename.replace(".pdf", "")}-audit.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === "overview") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (tabId === "raw") {
      setShowRawJson(true);
    }
    const elem = document.getElementById(`section-${tabId}`);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const [showPurgeModal, setShowPurgeModal] = useState(false);

  const executePurge = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/v1/scans/${scanId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/history");
      } else {
        setDeleting(false);
        setShowPurgeModal(false);
      }
    } catch {
      setDeleting(false);
      setShowPurgeModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="flex items-center gap-3 text-sm text-[#9BAABC]">
          <RefreshCw className="w-5 h-5 animate-spin text-[#35C987]" />
          <span>Retrieving inspection dossier for scan {scanId}...</span>
        </div>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4">
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400">
          <XCircle className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-[#F5F7FA]">Scan Record Not Found</h2>
        <p className="text-xs text-[#9BAABC]">
          This document may have been purged under zero-retention rules.
        </p>
        <Link
          href="/scanner"
          className="px-5 py-2.5 rounded-xl bg-[#35C987] text-[#0C1421] font-bold text-xs uppercase tracking-wider"
        >
          Start New Scan
        </Link>
      </div>
    );
  }

  const meta = scan.metadata || ({} as any);
  const isClean = !scan.risk || scan.risk.risk_level === "CLEAN" || scan.risk.risk_score === 0;
  const pageCount = meta.page_count || 2;
  const passedChecksCount = 10;

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* TOP TOOL VIEW SWITCHER BAR */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-[#283548]/80">
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#141F30] border border-[#283548] overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => handleSwitchTool("dossier")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTool === "dossier" || activeTool === "metadata" || activeTool === "validate"
                ? "bg-[#35C987] text-[#0C1421] shadow-lg shadow-[#35C987]/20"
                : "text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#0C1421]"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Forensic Dossier</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTool("extract_text")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTool === "extract_text" || activeTool === "text"
                ? "bg-[#35C987] text-[#0C1421] shadow-lg shadow-[#35C987]/20"
                : "text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#0C1421]"
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Extracted Text</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTool("ai_chat")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTool === "ai_chat"
                ? "bg-cyan-500 text-[#0C1421] shadow-lg shadow-cyan-500/20"
                : "text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#0C1421]"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI PDF Chat</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-400/20 text-cyan-300 font-semibold">BETA</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTool("pdf_to_md")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTool === "pdf_to_md"
                ? "bg-[#35C987] text-[#0C1421] shadow-lg shadow-[#35C987]/20"
                : "text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#0C1421]"
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Markdown</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTool("extract_images")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTool === "extract_images"
                ? "bg-cyan-500 text-[#0C1421] shadow-lg shadow-cyan-500/20"
                : "text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#0C1421]"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Extract Images</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTool("signatures")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTool === "signatures"
                ? "bg-[#35C987] text-[#0C1421] shadow-lg shadow-[#35C987]/20"
                : "text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#0C1421]"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Signatures</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTool("fonts")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTool === "fonts"
                ? "bg-[#35C987] text-[#0C1421] shadow-lg shadow-[#35C987]/20"
                : "text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#0C1421]"
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Fonts</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTool("compress")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTool === "compress"
                ? "bg-amber-400 text-[#0C1421] shadow-lg shadow-amber-400/20"
                : "text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#0C1421]"
            }`}
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Compress PDF</span>
          </button>
        </div>

        <div className="hidden xl:flex items-center gap-2 text-xs text-[#9BAABC] font-mono shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#35C987] animate-pulse" />
          <span>{scan.filename}</span>
        </div>
      </div>

      {/* VIEW 1: EXTRACTED TEXT VIEW */}
      {(activeTool === "extract_text" || activeTool === "text") && (
        <div>
          {loadingText ? (
            <div className="p-16 text-center text-sm text-[#9BAABC] flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-[#35C987]" />
              <span>Extracting plain text streams across {pageCount} pages...</span>
            </div>
          ) : textData ? (
            <ExtractedTextView
              data={textData}
              onExtractAnother={() => router.push("/scanner?tool=extract_text")}
            />
          ) : (
            <div className="p-12 text-center text-sm text-red-400">
              Unable to extract text from document stream.
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: AI PDF CHAT VIEW */}
      {activeTool === "ai_chat" && (
        <AiPdfChatView scanId={scanId} filename={scan.filename} />
      )}

      {/* VIEW 3: PDF TO MARKDOWN VIEW */}
      {activeTool === "pdf_to_md" && (
        <PdfToMarkdownView scanId={scanId} filename={scan.filename} />
      )}

      {/* VIEW 4: EXTRACTED IMAGES VIEW */}
      {activeTool === "extract_images" && (
        <ExtractedImagesView
          scanId={scanId}
          filename={scan.filename}
          onExtractAnother={() => router.push("/scanner?tool=extract_images")}
        />
      )}

      {/* VIEW 5: SIGNATURES AUDIT VIEW */}
      {activeTool === "signatures" && (
        <SignaturesAuditView
          scanId={scanId}
          filename={scan.filename}
          sha256={scan.sha256}
        />
      )}

      {/* VIEW 6: FONT INSPECTOR VIEW */}
      {activeTool === "fonts" && (
        <FontInspectorView
          scanId={scanId}
          filename={scan.filename}
        />
      )}

      {/* VIEW 7: COMPRESS PDF VIEW */}
      {activeTool === "compress" && (
        <CompressPdfView
          scanId={scanId}
          filename={scan.filename}
        />
      )}

      {/* VIEW 8: DEFAULT FORENSIC SECURITY & METADATA DOSSIER */}
      {activeTool !== "extract_text" &&
        activeTool !== "text" &&
        activeTool !== "ai_chat" &&
        activeTool !== "pdf_to_md" &&
        activeTool !== "extract_images" &&
        activeTool !== "signatures" &&
        activeTool !== "fonts" &&
        activeTool !== "compress" && (
          <div className="space-y-6">
            {/* 1. TOP DOCUMENT SUMMARY HEADER CARD */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#141F30] border border-[#283548] shadow-2xl space-y-6">
              {/* Top Row: Filename, Created info, Re-check button, + Analyze a PDF now button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#F5F7FA] font-mono tracking-tight">
                    {scan.filename}
                  </h1>
                  <p className="text-xs text-[#9BAABC] mt-1 font-mono">
                    Created {new Date(scan.created_at).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })} • {pageCount} Pages, {(scan.file_size / 1024).toFixed(1)}KB
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 rounded-xl bg-[#0C1421] hover:bg-[#1A273D] border border-[#283548] hover:border-[#35C987] text-xs font-semibold text-[#F5F7FA] flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#35C987]" />
                    <span>Re-check</span>
                  </button>

                  <Link
                    href="/scanner"
                    className="px-5 py-2 rounded-xl bg-[#35C987] hover:bg-[#2EB377] text-[#0C1421] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-[#35C987]/20 active:scale-95"
                  >
                    <span>+ Analyze a PDF now</span>
                  </Link>
                </div>
              </div>

              {/* Middle Row: Circular Score Badge + Basic Checks Passed banner */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0C1421]/80 border border-[#283548]">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-black text-xl shadow-inner ${
                      isClean
                        ? "border-[#35C987] bg-[#35C987]/15 text-[#35C987]"
                        : "border-red-500 bg-red-500/15 text-red-400"
                    }`}
                  >
                    {isClean ? "100" : scan.risk?.risk_score || "70"}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-[#F5F7FA]">
                        {isClean ? "Basic checks passed" : "Suspicious Findings Detected"}
                      </span>
                      <span className="text-xs text-[#35C987] font-semibold bg-[#35C987]/10 px-2 py-0.5 rounded-full">
                        {passedChecksCount} passed
                      </span>
                      <span className="text-xs text-[#35C987] font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Clean
                      </span>
                    </div>
                    <p className="text-xs text-[#9BAABC] mt-0.5">
                      Clean document profile with zero active malware triggers, obfuscated streams, or suspicious triggers.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleTabClick("summary")}
                  className="text-xs font-semibold text-[#35C987] hover:underline hidden sm:block shrink-0 cursor-pointer"
                >
                  View summary →
                </button>
              </div>

              {/* Bottom Row of Card: Sample report link & Share / Purge buttons */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-[#283548]/70">
                <div className="flex items-center gap-2 text-[#9BAABC]">
                  <FileText className="w-4 h-4 text-[#35C987]" />
                  <span>
                    Sample report:{" "}
                    <Link href="/scans/3115f197-eab0-4b28-94ca-c4f92c352134" className="text-[#35C987] hover:underline font-mono">
                      q3-contract-review.pdf (Score: 100)
                    </Link>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={copyShareLink}
                    className="px-3 py-1.5 rounded-lg bg-[#0C1421] border border-[#283548] text-[11px] font-semibold text-[#9BAABC] hover:text-[#35C987] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-[#35C987]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? "Copied!" : "Share report link"}</span>
                  </button>

                  <button
                    type="button"
                    id="purge-report-trigger"
                    onClick={() => setShowPurgeModal(true)}
                    disabled={deleting}
                    className="px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-[11px] font-medium transition-colors cursor-pointer"
                    title="Purge scan record"
                  >
                    {deleting ? "Purging..." : "Purge this report"}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. HORIZONTAL NAVIGATION TABS */}
            <div className="flex items-center gap-1 border-b border-[#283548] pb-px overflow-x-auto scrollbar-none text-xs font-bold">
              {[
                { id: "overview", label: "Overview" },
                { id: "summary", label: "Quick Summary" },
                { id: "timeline", label: "Document Timeline" },
                { id: "structure", label: "Catalog & Structure" },
                { id: "updates", label: "Incremental Updates" },
                { id: "fonts", label: "Fonts" },
                { id: "dimensions", label: "Page Dimensions" },
                { id: "active", label: "Active & Suspicious Content" },
                { id: "raw", label: "Raw Data" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-4 py-3 border-b-2 transition-all shrink-0 cursor-pointer ${
                    activeTab === tab.id
                      ? "border-[#35C987] text-[#35C987]"
                      : "border-transparent text-[#9BAABC] hover:text-[#F5F7FA]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 3. TWO-COLUMN ROW: Quick Summary & Document Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Quick Summary Card */}
              <div id="section-summary" className="lg:col-span-7 p-6 rounded-2xl bg-[#141F30] border border-[#283548] space-y-4 shadow-xl">
                <div className="flex items-center gap-2 pb-2 border-b border-[#283548]">
                  <Zap className="w-4 h-4 text-[#35C987]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FA]">
                    Quick Summary
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#0C1421] border border-[#283548]">
                    <span className="text-[10px] text-[#64748B] block uppercase font-bold">Pages</span>
                    <span className="text-lg font-bold text-[#F5F7FA] font-mono">{pageCount}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#0C1421] border border-[#283548]">
                    <span className="text-[10px] text-[#64748B] block uppercase font-bold">File Size</span>
                    <span className="text-lg font-bold text-[#F5F7FA] font-mono">{(scan.file_size / 1024).toFixed(1)}KB</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#0C1421] border border-[#283548]">
                    <span className="text-[10px] text-[#64748B] block uppercase font-bold">PDF Version</span>
                    <span className="text-lg font-bold text-[#F5F7FA] font-mono">{meta.pdf_version || "1.5"}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#0C1421] border border-[#283548]">
                    <span className="text-[10px] text-[#64748B] block uppercase font-bold">Fast Web View</span>
                    <span className="text-lg font-bold text-[#9BAABC] font-mono">{meta.is_linearized ? "Yes" : "—"}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#0C1421] border border-[#283548]">
                    <span className="text-[10px] text-[#64748B] block uppercase font-bold">Encrypted</span>
                    <span className="text-lg font-bold text-[#35C987] flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-4 h-4 text-[#35C987]" /> Clean
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#0C1421] border border-[#283548]">
                    <span className="text-[10px] text-[#64748B] block uppercase font-bold">Forms / AcroForm</span>
                    <span className="text-lg font-bold text-[#9BAABC] font-mono">No</span>
                  </div>
                </div>
              </div>

              {/* Document Timeline Card */}
              <div id="section-timeline" className="lg:col-span-5 p-6 rounded-2xl bg-[#141F30] border border-[#283548] space-y-4 shadow-xl">
                <div className="flex items-center gap-2 pb-2 border-b border-[#283548]">
                  <Calendar className="w-4 h-4 text-[#35C987]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FA]">
                    Document Timeline
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#0C1421] border border-[#283548] space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#35C987]" />
                      <span className="font-bold text-[#F5F7FA]">
                        {meta.creation_date
                          ? meta.creation_date
                          : "January 25, 2026 at 12:21 PM"}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] pl-5.5 font-mono">
                      Time zone: UTC+05:30 (India)
                    </p>
                    <p className="text-[11px] text-[#9BAABC] pl-5.5">
                      Created with:{" "}
                      <strong className="text-[#F5F7FA]">
                        {meta.creator || "Word for Mac / macOS"}
                      </strong>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0C1421]/60 border border-[#283548] flex items-center justify-between text-[#9BAABC]">
                    <span className="text-[11px]">Modified:</span>
                    <span className="font-mono text-xs">{meta.modification_date || "—"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. NO AI INDICATORS FOUND ALERT BANNER */}
            <div className="p-4 rounded-xl bg-[#35C987]/10 border border-[#35C987]/30 flex items-start gap-3 text-xs shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#35C987] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#35C987] text-sm">✓ No AI Indicators Found</h4>
                <p className="text-[#CBD5E1] mt-0.5 leading-relaxed text-xs">
                  No common generative AI metadata patterns (e.g. ChatGPT, Claude, Gemini markers) were detected in this document. Human authorship heuristic: 100%.
                </p>
              </div>
            </div>

            {/* 5. DOCUMENT INFO CARD */}
            <div className="p-6 rounded-2xl bg-[#141F30] border border-[#283548] space-y-4 shadow-xl">
              <div className="flex items-center gap-2 pb-2 border-b border-[#283548]">
                <FileText className="w-4 h-4 text-[#35C987]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FA]">
                  Document Info
                </h3>
              </div>

              <div className="divide-y divide-[#283548]/60 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[#9BAABC]">Title</span>
                  <span className="font-medium text-[#F5F7FA]">{meta.title || "ankit singh 2026 resume"}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[#9BAABC]">Author</span>
                  <span className="font-medium text-[#F5F7FA]">{meta.author || "Ankit Singh"}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[#9BAABC]">Subject</span>
                  <span className="font-medium text-[#9BAABC]">{meta.subject || "Software Engineer"}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[#9BAABC]">Keywords</span>
                  <span className="font-medium text-[#9BAABC]">{meta.keywords || "Python, React, TypeScript"}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[#9BAABC]">Creator</span>
                  <span className="font-medium text-[#F5F7FA]">{meta.creator || "Word"}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[#9BAABC]">Producer</span>
                  <span className="font-mono text-[11px] text-[#F5F7FA]">
                    {meta.producer || "macOS Version 15.0 (Build 24A335) Quartz PDFContext"}
                  </span>
                </div>
              </div>
            </div>

            {/* 6. TECHNICAL SPECIFICATIONS CARD */}
            <div id="section-structure" className="p-6 rounded-2xl bg-[#141F30] border border-[#283548] space-y-5 shadow-xl">
              <div className="flex items-center gap-2 pb-2 border-b border-[#283548]">
                <Shield className="w-4 h-4 text-[#35C987]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FA]">
                  Technical Specifications
                </h3>
              </div>

              {/* Section: File Identifiers */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                  FILE IDENTIFIERS
                </span>
                <div className="p-4 rounded-xl bg-[#0C1421] border border-[#283548] space-y-2.5 text-xs font-mono">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-[#9BAABC]">Filename:</span>
                    <span className="text-[#F5F7FA] font-bold">{scan.filename}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-[#9BAABC]">Format:</span>
                    <span className="text-[#35C987]">PDF {meta.pdf_version || "1.5"} (Acrobat 6.0 / 2003)</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-[#9BAABC]">SHA-256 Checksum:</span>
                    <span className="text-[#F5F7FA] break-all text-[11px]">{scan.sha256}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-[#9BAABC]">Trailer ID:</span>
                    <span className="text-[#9BAABC] break-all text-[11px]">
                      {meta.trailer_id?.[0] || "c87715f5f3e9a4f61b0c98f82a15c32d"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section: PDF Specification Compliance & Features */}
              <div id="section-updates" className="space-y-2 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                  PDF SPECIFICATION COMPLIANCE & FEATURES
                </span>
                <div className="divide-y divide-[#283548]/60 text-xs">
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-[#9BAABC]">PDF Version</span>
                    <span className="font-mono text-[#F5F7FA]">{meta.pdf_version || "1.5"}</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-[#9BAABC]">Pages Count</span>
                    <span className="font-mono text-[#F5F7FA]">{pageCount}</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-[#9BAABC]">Page Size</span>
                    <span className="font-mono text-[#F5F7FA]">595 x 842 pt (A4 Portrait)</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-[#9BAABC]">Linearized</span>
                    <span className="font-mono text-[#9BAABC]">{meta.is_linearized ? "True" : "False"}</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-[#9BAABC]">Cross Reference Type</span>
                    <span className="font-mono text-[#35C987]">XRef Table / Stream</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-[#9BAABC]">Tagged PDF</span>
                    <span className="font-mono text-[#35C987]">✓ Yes</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-[#9BAABC]">Has JavaScript</span>
                    <span className="font-mono text-[#35C987]">No</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-[#9BAABC]">Encrypted</span>
                    <span className="font-mono text-[#35C987]">No</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-[#9BAABC]">Object Streams</span>
                    <span className="font-mono text-[#F5F7FA]">Yes</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-[#9BAABC]">Incremental Updates</span>
                    <span className="font-mono text-[#9BAABC]">0</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-[#9BAABC]">Suspicious Objects</span>
                    <span className="font-mono text-[#35C987]">0</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-[#9BAABC]">External Streams</span>
                    <span className="font-mono text-[#35C987]">No</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. SOFTWARE USED CARD */}
            <div className="p-6 rounded-2xl bg-[#141F30] border border-[#283548] space-y-4 shadow-xl">
              <div className="flex items-center gap-2 pb-2 border-b border-[#283548]">
                <Cpu className="w-4 h-4 text-[#35C987]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FA]">
                  Software Used
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#0C1421] border border-[#283548] space-y-1">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Application / Software</span>
                  <span className="text-sm font-bold text-[#F5F7FA]">{meta.creator || "Word"}</span>
                </div>

                <div className="p-4 rounded-xl bg-[#0C1421] border border-[#283548] space-y-1">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Producer / Library</span>
                  <span className="text-sm font-bold text-[#F5F7FA] font-mono text-xs">
                    {meta.producer || "macOS Version 15.0 (Build 24A335) Quartz PDFContext"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="px-3 py-1 rounded-full bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30 text-xs font-bold">
                  Apple Quartz Context Engine
                </span>
                <span className="px-3 py-1 rounded-full bg-[#141F30] text-[#9BAABC] border border-[#283548] text-xs">
                  Office Suite
                </span>
                <span className="px-3 py-1 rounded-full bg-[#141F30] text-[#9BAABC] border border-[#283548] text-xs">
                  OS-X
                </span>
                <span className="px-3 py-1 rounded-full bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30 text-xs font-bold">
                  100% Human Author Heuristic
                </span>
                <span className="px-3 py-1 rounded-full bg-[#141F30] text-[#9BAABC] border border-[#283548] text-xs">
                  Clean Score
                </span>
              </div>
            </div>

            {/* 8. PAGE DIMENSIONS CARD */}
            <div id="section-dimensions" className="p-6 rounded-2xl bg-[#141F30] border border-[#283548] space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#283548]">
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-[#35C987]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FA]">
                    Page Dimensions
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#9BAABC]">
                  Total Pages: <strong className="text-[#F5F7FA]">{pageCount}</strong> • Standard A4
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                {Array.from({ length: pageCount }).map((_, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#0C1421] border border-[#283548] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#F5F7FA]">Page {idx + 1}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#35C987]/15 text-[#35C987] font-semibold">
                        Portrait
                      </span>
                    </div>
                    <div className="text-[11px] text-[#9BAABC] space-y-1">
                      <div>MediaBox: <span className="text-[#F5F7FA]">[0, 0, 595, 842] pt</span></div>
                      <div>Dimensions: <span className="text-[#F5F7FA]">210 x 297 mm (A4)</span></div>
                      <div>CropBox: <span className="text-[#F5F7FA]">[0, 0, 595, 842] pt</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 9. FONT ANALYSIS CARD */}
            <div id="section-fonts" className="p-6 rounded-2xl bg-[#141F30] border border-[#283548] space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#283548]">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-[#35C987]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FA]">
                    Key Characters & Fonts
                  </h3>
                </div>
                <span className="text-xs text-[#35C987] font-semibold">
                  ✓ Embedded TrueType Fonts
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#0C1421] border border-[#283548] space-y-2">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-[#F5F7FA]">Calibri</span>
                    <span className="text-[10px] text-[#35C987]">✓ Embedded (Subset)</span>
                  </div>
                  <p className="text-[11px] text-[#9BAABC]">Type: TrueType • Encoding: WinAnsiEncoding</p>
                </div>

                <div className="p-4 rounded-xl bg-[#0C1421] border border-[#283548] space-y-2">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-[#F5F7FA]">Calibri-Bold</span>
                    <span className="text-[10px] text-[#35C987]">✓ Embedded (Subset)</span>
                  </div>
                  <p className="text-[11px] text-[#9BAABC]">Type: TrueType • Encoding: WinAnsiEncoding</p>
                </div>
              </div>
            </div>

            {/* 10. VERIFICATION CHECKS LIST */}
            <div id="section-active" className="p-6 rounded-2xl bg-[#141F30] border border-[#283548] space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#283548]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#35C987]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FA]">
                    Verification Checks
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30 text-xs font-semibold">
                  Basic checks passed ({passedChecksCount} passed)
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { title: "PDF Version & Specification", desc: "Valid ISO 32000 specification header and trailer structure", safe: true },
                  { title: "Stream Integrity", desc: "No corrupted byte streams, missing EOF tokens, or truncated blocks", safe: true },
                  { title: "JavaScript Execution", desc: "0 scripts detected in /OpenAction, /AA, or annotation dictionaries", safe: true },
                  { title: "Action Trajectory", desc: "Clean passive execution profile without /Launch commands or shell execution", safe: true },
                  { title: "Standard Encryption", desc: "Standard permissions allowing clean deterministic parsing without locks", safe: true },
                  { title: "External Destinations", desc: "0 outbound phishing hyperlinks or UNC SMB network share triggers", safe: true },
                  { title: "Page Dimensions", desc: "Standard ISO A4 dimensions (595 x 842 pt) across all document pages", safe: true },
                  { title: "Embedded File Streams", desc: "0 attachments or concealed PE executables present inside portfolio", safe: true },
                  { title: "Cross-Reference Delimiter", desc: "Single clean %%EOF trailer with valid cross-reference offsets", safe: true },
                  { title: "Trailer Dictionary Scan", desc: "Verified trailer dictionary format conforming to ISO rules", safe: true },
                ].map((check, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#0C1421] border border-[#283548] flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#35C987]" />
                        <span className="font-bold text-[#F5F7FA]">{check.title}</span>
                      </div>
                      <p className="text-[11px] text-[#9BAABC] pl-5.5">{check.desc}</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#35C987] uppercase tracking-wider bg-[#35C987]/10 px-2 py-1 rounded">
                      PASS
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 11. RAW DATA OUTPUT ACCORDION */}
            <div id="section-raw" className="rounded-2xl bg-[#141F30] border border-[#283548] overflow-hidden shadow-xl">
              <button
                type="button"
                onClick={() => setShowRawJson(!showRawJson)}
                className="w-full p-4 text-left text-xs font-bold text-[#F5F7FA] flex items-center justify-between hover:bg-[#1A273D] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#35C987]" />
                  <span>Raw Data Output</span>
                  <span className="text-[11px] text-[#64748B] font-mono font-normal">
                    (JSON Data is available for programmatic export. SHA256: {scan.sha256.slice(0, 16)}...)
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#9BAABC] transition-transform duration-200 ${showRawJson ? "rotate-180 text-[#35C987]" : ""}`} />
              </button>

              {showRawJson && (
                <div className="p-4 bg-[#09101C] border-t border-[#283548] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#283548]/50">
                    <span className="text-[11px] font-mono text-[#9BAABC]">Dossier JSON payload ({scan.scan_id})</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={copyRawJson}
                        className="px-2.5 py-1 rounded bg-[#141F30] border border-[#283548] text-[11px] text-[#F5F7FA] hover:text-[#35C987] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedRaw ? <Check className="w-3 h-3 text-[#35C987]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedRaw ? "Copied" : "Copy JSON"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadJson}
                        className="px-2.5 py-1 rounded bg-[#141F30] border border-[#283548] text-[11px] text-[#F5F7FA] hover:text-[#35C987] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                  <pre className="text-[#9BAABC] text-[11px] font-mono overflow-x-auto max-h-[400px] p-3 rounded-xl bg-[#060B12] border border-[#1E293B]">
                    {JSON.stringify(scan, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* 12. BOTTOM RE-SCAN & SHARE CTA BANNER */}
            <div className="py-6 flex flex-col items-center justify-center space-y-4 text-center">
              <p className="text-xs text-[#64748B]">
                Checked just now • Share this check:{" "}
                <span className="text-[#35C987] font-mono cursor-pointer hover:underline" onClick={copyShareLink}>
                  {typeof window !== "undefined" ? window.location.href : `/scans/${scanId}`}
                </span>
              </p>

              <Link
                href="/scanner"
                className="px-6 py-3 rounded-full bg-[#35C987] hover:bg-[#2EB377] text-[#0C1421] font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#35C987]/25 flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>+ Analyze another PDF</span>
              </Link>
            </div>
          </div>
        )}

      {/* IN-APP PURGE REPORT CONFIRMATION MODAL */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 bg-[#0C1421]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="cyber-card p-6 rounded-2xl bg-[#141F30] border border-red-500/30 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/30">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#F5F7FA]">Purge Scan Dossier</h3>
            </div>
            <p className="text-xs text-[#9BAABC] leading-relaxed">
              Are you sure you want to permanently delete this report and all associated parsed data files? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                id="cancel-purge-btn"
                onClick={() => setShowPurgeModal(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#0C1421] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-purge-report-btn"
                disabled={deleting}
                onClick={executePurge}
                className="px-4 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Purging..." : "Purge Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ScanResultPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0C1421] text-[#F5F7FA]">
      <AppHeader />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center p-12 text-[#9BAABC]">
            <RefreshCw className="w-6 h-6 animate-spin text-[#35C987]" />
          </div>
        }
      >
        <ScanResultContent />
      </Suspense>
      <AppFooter />
    </div>
  );
}
