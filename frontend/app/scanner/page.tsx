"use client";

import React, { useState, useEffect, Suspense } from "react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import FileUpload from "@/components/FileUpload";
import ScanProgress from "@/components/ScanProgress";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Eye,
  Archive,
  Type,
  ArrowLeftRight,
  Layers,
  Minimize2,
  Tag,
  ShieldAlert,
  Lock,
  MessageSquare,
  FileCode2,
  Image as ImageIcon,
  Hash,
  Camera,
  Copy,
  Scissors,
  Edit3,
  Highlighter,
  CheckSquare,
  LayoutGrid,
  FileSearch,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { ScanRecord } from "@/types";

const TOOL_REGISTRY: Record<
  string,
  { title: string; subtitle: string; badge: string; icon: any }
> = {
  // 1. ANALYZE PDF
  metadata: {
    title: "Verify Metadata & Header Integrity",
    subtitle: "Inspect authoring software, timestamps, producer context, and ISO trailer dictionaries.",
    badge: "Analyze PDF • Verify Metadata",
    icon: FileText,
  },
  validate: {
    title: "Validate PDF Specification",
    subtitle: "Audit PDF document syntax, indirect object tables, and ISO 32000 conformance.",
    badge: "Analyze PDF • Specification Validator",
    icon: CheckCircle2,
  },
  ai: {
    title: "AI Detection & Author Heuristics",
    subtitle: "Detect generative AI markers (ChatGPT, Claude, Jasper) and synthetic structural traits.",
    badge: "Analyze PDF • AI Detection",
    icon: Sparkles,
  },
  signatures: {
    title: "Check Signatures & Digital Certificates",
    subtitle: "Validate cryptographic signatures, PKCS#7 containers, and document modification seals.",
    badge: "Analyze PDF • Check Signatures",
    icon: ShieldCheck,
  },
  accessibility: {
    title: "Accessibility & PDF/UA Checker",
    subtitle: "Inspect logical document structure, tagged tree elements, and Section 508 compliance.",
    badge: "Analyze PDF • Accessibility",
    icon: Eye,
  },
  pdfa: {
    title: "PDF/A Archival Conformance Validator",
    subtitle: "Verify ISO 19005 compliance for permanent, long-term archival preservation.",
    badge: "Analyze PDF • PDF/A Validator",
    icon: Archive,
  },
  fonts: {
    title: "PDF Font Checker & Encoding Inspector",
    subtitle: "Analyze embedded TrueType/Type 1 fonts, CID character sets, and WinAnsi encoding.",
    badge: "Analyze PDF • Font Checker",
    icon: Type,
  },
  compare: {
    title: "Compare PDF Editions & Revisions",
    subtitle: "Diff structural object streams, incremental updates, and metadata revisions.",
    badge: "Analyze PDF • Compare PDFs",
    icon: ArrowLeftRight,
  },
  batch: {
    title: "Batch PDF Multi-Document Checker",
    subtitle: "Bulk forensic scanning across multi-file document portfolios.",
    badge: "Analyze PDF • Batch Checker",
    icon: Layers,
  },

  // 2. OPTIMIZE PDF
  compress: {
    title: "Compress PDF & Stream Optimizer",
    subtitle: "Lossless Flate compression, unreferenced stream purging, and fast web view linearization.",
    badge: "Optimize PDF • Compress PDF",
    icon: Minimize2,
  },
  metadata_editor: {
    title: "PDF Metadata Editor",
    subtitle: "Inspect and modify document Info dictionaries, title, author, and XMP metadata packets.",
    badge: "Optimize PDF • Metadata Editor",
    icon: Tag,
  },
  metadata_remover: {
    title: "Metadata Sanitizer & Privacy Purge",
    subtitle: "Strip privacy-sensitive metadata, GPS coordinates, author tags, and revision history.",
    badge: "Optimize PDF • Metadata Remover",
    icon: ShieldAlert,
  },
  password: {
    title: "PDF Password & Encryption Audit",
    subtitle: "Audit Standard Security Handlers, AES-256 ciphers, and document permission bitmasks.",
    badge: "Optimize PDF • Password & Security",
    icon: Lock,
  },

  // 3. TRANSFORM PDF
  ai_chat: {
    title: "AI PDF Chat (BETA)",
    subtitle: "Ask questions, summarize key sections, and extract insights directly from your PDF.",
    badge: "Transform PDF • AI PDF Chat",
    icon: MessageSquare,
  },
  extract_text: {
    title: "Extract Text from PDF",
    subtitle: "Instant plain text extraction with per-page breakdown and character statistics.",
    badge: "Transform PDF • Extract Text",
    icon: FileCode2,
  },
  extract_images: {
    title: "Extract Images from PDF",
    subtitle: "Discover and dump embedded raster and vector graphics from PDF streams.",
    badge: "Transform PDF • Extract Images",
    icon: ImageIcon,
  },
  pdf_to_md: {
    title: "PDF to Markdown Converter",
    subtitle: "Convert document outlines, tables, and text streams to clean Markdown.",
    badge: "Transform PDF • PDF to Markdown",
    icon: Hash,
  },
  pdf_to_img: {
    title: "PDF to Image Converter",
    subtitle: "Render high-DPI page previews in PNG/WebP format.",
    badge: "Transform PDF • PDF to Image",
    icon: Camera,
  },

  // 4. BUILD & EDIT
  merge: {
    title: "Merge PDF Documents",
    subtitle: "Combine multiple PDF files and page catalogs into a single unified stream.",
    badge: "Build & Edit • Merge PDF",
    icon: Copy,
  },
  split: {
    title: "Split PDF Pages & Range Extractor",
    subtitle: "Burst multi-page documents, extract custom page intervals, and generate standalone files.",
    badge: "Build & Edit • Split PDF",
    icon: Scissors,
  },
  editor: {
    title: "PDF Content & Stream Editor",
    subtitle: "Direct object tree and annotation editor for low-level document tweaks.",
    badge: "Build & Edit • PDF Editor (NEW)",
    icon: Edit3,
  },
  highlighter: {
    title: "PDF Markup & Highlighter",
    subtitle: "Add highlight annotations, stamp overlays, and redaction bounding boxes.",
    badge: "Build & Edit • PDF Highlighter (NEW)",
    icon: Highlighter,
  },
  fill_form: {
    title: "Fill PDF Form & AcroForm Data",
    subtitle: "Audit and populate interactive form fields, checkboxes, and text inputs.",
    badge: "Build & Edit • Fill PDF Form (NEW)",
    icon: CheckSquare,
  },
  build_form: {
    title: "Build PDF Form & Field Designer",
    subtitle: "Create interactive AcroForm text fields, radio buttons, and signature widgets.",
    badge: "Build & Edit • Build PDF Form (NEW)",
    icon: LayoutGrid,
  },
};

function ScannerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTool = searchParams.get("tool");

  useEffect(() => {
    if (!rawTool || rawTool.toLowerCase() === "metadata") {
      router.replace("/");
    }
  }, [rawTool, router]);

  if (!rawTool || rawTool.toLowerCase() === "metadata") {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-[#9BAABC]">
        <RefreshCw className="w-6 h-6 animate-spin text-[#35C987]" />
      </div>
    );
  }

  const toolKey = rawTool.toLowerCase().replace(/-/g, "_");

  const config =
    TOOL_REGISTRY[toolKey] || {
      title: "Analyze Document Security",
      subtitle: "Upload any PDF document for automated structure inspection, active script detection, and transparent risk scoring.",
      badge: "Forensic PDF Studio",
      icon: FileSearch,
    };

  const BadgeIcon = config.icon;
  const [activeScanId, setActiveScanId] = useState<string | null>(null);
  const [scanRecord, setScanRecord] = useState<ScanRecord | null>(null);
  const [pollError, setPollError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeScanId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/v1/scans/${activeScanId}`);
        if (res.ok) {
          const data: ScanRecord = await res.json();
          setScanRecord(data);
          if (data.status === "COMPLETED") {
            clearInterval(interval);
            setTimeout(() => {
              router.push(`/scans/${activeScanId}?tool=${toolKey}`);
            }, 500);
          } else if (data.status === "FAILED") {
            clearInterval(interval);
            setPollError(data.error || "Analysis pipeline encountered a fatal error.");
          }
        }
      } catch {
        setPollError("Connection interrupted while polling analysis engine.");
      }
    }, 500);

    return () => clearInterval(interval);
  }, [activeScanId, router, toolKey]);

  return (
    <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8 animate-in fade-in duration-200">
      {/* Page Title & Category Badge */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#35C987]/10 border border-[#35C987]/30 text-xs font-semibold text-[#35C987]">
          <BadgeIcon className="w-3.5 h-3.5" />
          <span>{config.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F7FA]">
          {config.title}
        </h1>
        <p className="text-sm text-[#9BAABC] max-w-xl mx-auto">
          {config.subtitle}
        </p>
      </div>

      {/* Upload Box or Live Progress */}
      {!activeScanId ? (
        <div className="max-w-2xl mx-auto">
          <FileUpload onScanStarted={(id) => setActiveScanId(id)} />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          <ScanProgress
            progressPercent={scanRecord?.progress_percent || 10}
            currentStage={scanRecord?.current_stage || "Processing document streams..."}
            status={scanRecord?.status || "PROCESSING"}
          />

          {pollError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{pollError}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveScanId(null)}
                className="px-3 py-1 rounded bg-red-500/20 text-red-300 font-semibold cursor-pointer"
              >
                Retry Upload
              </button>
            </div>
          )}
        </div>
      )}

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-[#283548]">
        <div className="p-4 rounded-xl bg-[#141F30] border border-[#283548] space-y-2">
          <div className="text-[#35C987] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Non-Executing Sandbox
          </div>
          <p className="text-xs text-[#9BAABC] leading-relaxed">
            Files are evaluated without opening in reader engines, preventing memory corruptions or zero-day execution on your system.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#141F30] border border-[#283548] space-y-2">
          <div className="text-[#35C987] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Deterministic Stream Parser
          </div>
          <p className="text-xs text-[#9BAABC] leading-relaxed">
            Decodes text streams, font mappings, and character layouts directly from binary PDF objects with 100% precision.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#141F30] border border-[#283548] space-y-2">
          <div className="text-[#35C987] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Instant Privacy Purge
          </div>
          <p className="text-xs text-[#9BAABC] leading-relaxed">
            Configurable zero-retention policies delete files immediately following extraction, leaving zero persistent copies.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function ScannerPage() {
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
        <ScannerContent />
      </Suspense>
      <AppFooter />
    </div>
  );
}
