"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import {
  Sparkles,
  Search,
  Tag,
  Calendar,
  CheckCircle2,
  Shield,
  Zap,
  Lock,
  FileText,
  Code2,
  Cpu,
  Layers,
  ArrowRight,
  ExternalLink,
  Bell,
  Check,
  ChevronRight,
  Sliders,
  Filter,
  Copy,
  Terminal,
  Bookmark,
  Share2,
} from "lucide-react";

interface ChangelogEntry {
  version: string;
  isLatest?: boolean;
  date: string;
  title: string;
  category: "feature" | "security" | "forensics" | "optimization" | "bugfix";
  summary: string;
  highlights: string[];
  tags: string[];
  technicalNote?: string;
  actionLink?: {
    label: string;
    href: string;
  };
}

const CHANGELOG_DATA: ChangelogEntry[] = [
  {
    version: "v1.8.0",
    isLatest: true,
    date: "October 25, 2026",
    title: "Interactive Forensic Dossier & 8-Tool Workspace",
    category: "feature",
    summary:
      "Introduces the unified multi-tool workspace switcher directly atop every inspection dossier, enabling seamless forensic navigation across text extraction, AI chat, signatures, font forensics, and compression without re-uploading documents.",
    highlights: [
      "New 8-tool top switcher bar synchronizing views between Forensic Dossier, Extract Text, Ask AI, PDF to Markdown, Extract Images, Signatures Audit, Font Inspector, and Compress PDF.",
      "URL query parameter synchronization (?tool=extract_text, ?tool=ai_chat) for bookmarking and instant forensic sharing.",
      "Synchronized state preserve: Inspect fonts, extract pictures, or execute compression directly on the active document.",
      "Refined cybersecurity cyber-card aesthetics with dark theme contrast and micro-animations.",
    ],
    tags: ["NEW FEATURE", "ENHANCEMENT", "WORKSPACE", "FORENSICS"],
    technicalNote: "FastAPI endpoints updated to cascade analysis across subcomponents without regenerating full scan profiles.",
    actionLink: {
      label: "Open Scanner",
      href: "/scanner",
    },
  },
  {
    version: "v1.7.5",
    date: "October 25, 2026",
    title: "In-App Purge Confirmation Modals (Zero Browser Dialogs)",
    category: "bugfix",
    summary:
      "Replaced all browser-native window.confirm and alert prompts with styled in-app confirmation modals, resolving unhandled modal suppressions in headless agents and modern mobile browsers.",
    highlights: [
      "Single scan deletion modal with explicit target confirmation and immediate SQLite purge.",
      "Bulk history wipe modal permanently resetting local document storage and active scan entries.",
      "Developer secret key revocation modal preventing unintended token deletions.",
      "Toast notification feedback confirming successful disk deletions without intrusive alert popups.",
    ],
    tags: ["BUG FIX", "DATA PRIVACY", "RELIABILITY"],
    technicalNote: "Eliminated window.confirm blocking threads; replaced with reactive React state dialogs.",
    actionLink: {
      label: "View History",
      href: "/history",
    },
  },
  {
    version: "v1.7.0",
    date: "October 24, 2026",
    title: "Full Authentication Suite & User Session Management",
    category: "security",
    summary:
      "Complete user authentication infrastructure with encrypted credentials, session persistence, and instant 1-click Google OAuth demo integration.",
    highlights: [
      "Native sign-up and log-in architecture backed by PBKDF2/SHA-256 password hashing and secure token generation.",
      "Google 1-Click Demo OAuth authentication with session persistence in localStorage and cookie headers.",
      "User profile pill & dropdown in application header displaying user identity, account tier, and secure logout.",
      "Dedicated /login and /signup standalone landing pages alongside the persistent modal dialog.",
    ],
    tags: ["SECURITY", "AUTHENTICATION", "USER MANAGEMENT"],
    technicalNote: "Backend auth service manages SQLite 'users' and 'sessions' tables with automated token expiry validation.",
    actionLink: {
      label: "View Login Portal",
      href: "/login",
    },
  },
  {
    version: "v1.6.8",
    date: "October 24, 2026",
    title: "Google 1-Click Demo OAuth Integration",
    category: "feature",
    summary:
      "Frictionless onboarding allowing security researchers to test enterprise-grade scanning capabilities without manual form entry.",
    highlights: [
      "Single-click demo login generating a verified researcher session token.",
      "Session state preserved seamlessly across page reloads and browser tab transitions.",
      "Automatic assignment of forensic auditor tier credentials.",
    ],
    tags: ["AUTHENTICATION", "OAUTH", "ONBOARDING"],
    technicalNote: "Simulates OAuth2 PKCE authorization flow with secure mock tokens in dev environments.",
  },
  {
    version: "v1.6.5",
    date: "October 23, 2026",
    title: "User Profile Pill & Header Navigation Menu",
    category: "feature",
    summary:
      "Added an avatar pill and reactive popover dropdown menu in the top navigation header for logged-in researchers.",
    highlights: [
      "Custom avatar circle displaying initial letter with unique deterministic color branding.",
      "Quick-access links to My Scans History, API Keys & Settings, and Changelog.",
      "One-click secure sign-out clearing local credentials and revoking session cookies.",
    ],
    tags: ["UI/UX", "NAVIGATION", "SESSION"],
  },
  {
    version: "v1.6.0",
    date: "October 22, 2026",
    title: "Resilient SQLite & Disk Storage Deletion Engine",
    category: "security",
    summary:
      "Engineered a zero-retention storage cleanup pipeline ensuring complete synchronization between SQLite metadata records and disk artifacts.",
    highlights: [
      "Fixed 404 deletion errors for reloaded scans by querying both memory caches and SQLite tables directly.",
      "Automated unlink of cached PDF uploads and parsed JSON files upon user deletion request.",
      "New Data Storage & Forensic Purge section added to Platform Settings.",
    ],
    tags: ["SECURITY", "STORAGE", "DATA PRIVACY"],
    technicalNote: "DELETE /api/v1/scans cascades to uploads/ and storage/ directories with error recovery.",
    actionLink: {
      label: "Platform Settings",
      href: "/settings",
    },
  },
  {
    version: "v1.5.5",
    date: "October 21, 2026",
    title: "Unified PDF Tools Mega Menu Popover",
    category: "feature",
    summary:
      "Header dropdown mega menu organizing all 24 forensic utilities into logical operational categories with quick jump links.",
    highlights: [
      "Categorized columns: Security & Forensic, Extraction & Content, Conversion & Forms, Analytics & System.",
      "Hover animations with emerald accent highlights and feature badges (Beta, New).",
      "Keyboard accessible and auto-closes on outside clicks or route navigation.",
    ],
    tags: ["NAVIGATION", "MEGA MENU", "UI/UX"],
  },
  {
    version: "v1.5.0",
    date: "October 20, 2026",
    title: "Comprehensive 24-Tool Forensic Catalog",
    category: "feature",
    summary:
      "Launched the unified All PDF Tools directory featuring 24 specialized forensic, extraction, validation, and conversion utilities.",
    highlights: [
      "Categorized catalog for Security, Analysis, Extraction, Conversion, Privacy, and Developer utilities.",
      "Real-time search filtering across tool titles, descriptions, and technology tags.",
      "Direct routing from each tool card to pre-configured scan profiles for specialized document inspections.",
    ],
    tags: ["CATALOG", "TOOLS", "DIRECTORY"],
    technicalNote: "Integrated with client-side reactive filtering and mega-menu navigation popovers in header.",
    actionLink: {
      label: "Browse All 24 Tools",
      href: "/tools",
    },
  },
  {
    version: "v1.4.8",
    date: "October 18, 2026",
    title: "Raw Embedded Font Stream Extractor (.ttf / .otf)",
    category: "forensics",
    summary:
      "Forensic binary stream extractor enabling security researchers to download and analyze raw embedded TrueType and OpenType fonts.",
    highlights: [
      "Direct download buttons for every embedded FontFile and FontFile2 stream.",
      "Inspection of font tables (glyf, head, hhea, post) to uncover covert data exfiltration channels.",
      "File size and glyph count diagnostics.",
    ],
    tags: ["FONTS", "EXTRACTION", "BINARY FORENSICS"],
    technicalNote: "Extracts font binary buffers via PyMuPDF doc.extract_font(xref).",
  },
  {
    version: "v1.4.0",
    date: "October 17, 2026",
    title: "Deep Font Forensics & Embedded Font Descriptor Inspector",
    category: "forensics",
    summary:
      "Advanced font inspection engine analyzing TrueType, OpenType, Type 1, and CID font dictionaries embedded in PDF streams.",
    highlights: [
      "Font descriptor inspection revealing font family, embedding status, encoding tables, and subtype classifications.",
      "Detection of non-embedded external font dependencies that can cause rendering discrepancies across platforms.",
      "Direct raw binary font stream extraction with one-click .ttf / .otf file downloads.",
    ],
    tags: ["FORENSICS", "FONTS", "SECURITY"],
    technicalNote: "Utilizes PyMuPDF doc.extract_font() to parse FontDescriptor, FontBBox, and FontFile3 streams.",
    actionLink: {
      label: "Try Font Inspector",
      href: "/scanner?tool=fonts",
    },
  },
  {
    version: "v1.3.8",
    date: "October 15, 2026",
    title: "Cryptographic ByteRange Consistency & SubFilter Auditing",
    category: "security",
    summary:
      "Strict ByteRange validation engine ensuring no rogue bytes have been appended outside the signature hash envelope.",
    highlights: [
      "ByteRange gap detection flagging malicious append attacks and payload injections.",
      "SubFilter standard verification for adbe.pkcs7.detached, adbe.pkcs7.sha1, and ETSI.CAdES.detached.",
      "Visual timeline mapping signatures against document revisions.",
    ],
    tags: ["SECURITY", "CRYPTOGRAPHY", "SIGNATURES"],
    technicalNote: "Calculates file offset gaps between ByteRange[1] and ByteRange[2] against total file size.",
  },
  {
    version: "v1.3.0",
    date: "October 14, 2026",
    title: "Digital Signature & Cryptographic Integrity Audits",
    category: "security",
    summary:
      "PKCS#7 / CMS cryptographic validation engine inspecting document approval workflows, certificate validity, and incremental updates.",
    highlights: [
      "Signature dictionary parsing extracting signer common name, contact info, reason, and signing timestamps.",
      "SubFilter validation (adbe.pkcs7.detached, ETSI.CAdES.detached) and ByteRange consistency verification.",
      "Incremental update audit flagging post-signing revision tampering and uncertified additions.",
    ],
    tags: ["SECURITY", "CRYPTOGRAPHY", "SIGNATURES"],
    technicalNote: "Parses /ByteRange offsets against file EOF and verifies certificate validity windows.",
    actionLink: {
      label: "Inspect Signatures",
      href: "/scanner?tool=signatures",
    },
  },
  {
    version: "v1.2.8",
    date: "October 12, 2026",
    title: "Printable HTML Forensic Dossier & JSON Exporter",
    category: "feature",
    summary:
      "Export comprehensive forensic audit reports in structured JSON or executive print-ready HTML dossiers.",
    highlights: [
      "Complete JSON tree download containing all parsed dictionaries, streams, and finding scores.",
      "Printable executive layout formatted with clean page breaks for legal compliance records.",
      "One-click report share link generator with clipboard copy confirmation.",
    ],
    tags: ["REPORTS", "EXPORT", "COMPLIANCE"],
  },
  {
    version: "v1.2.0",
    date: "October 10, 2026",
    title: "AI-Powered PDF Assistant & Contextual Q&A",
    category: "feature",
    summary:
      "Native document intelligence allowing users to ask natural language questions about any uploaded PDF with prompt templates.",
    highlights: [
      "Context-aware extraction feeding full document text and metadata into an intelligent analytical pipeline.",
      "One-click quick prompts for Security Audits, Executive Summaries, Red Flag Detection, and Key Clause Extraction.",
      "Markdown-rendered responses with full syntax formatting and copy-to-clipboard functionality.",
    ],
    tags: ["AI ENGINE", "ASSISTANT", "INTELLIGENCE"],
    technicalNote: "Implemented with dynamic prompt engineering and fallback heuristics when offline.",
    actionLink: {
      label: "Chat with PDF",
      href: "/scanner?tool=ai_chat",
    },
  },
  {
    version: "v1.1.5",
    date: "October 08, 2026",
    title: "Embedded Image Extractor with DPI & Color Space Diagnostics",
    category: "forensics",
    summary:
      "Forensic image inspection engine extracting embedded raster graphics, XObjects, and metadata stamps.",
    highlights: [
      "Color space auditing (DeviceRGB, DeviceCMYK, Indexed, Separation) for covert steganography indicators.",
      "Resolution, dimensions, and compression format (DCTDecode, FlateDecode, JPXDecode) breakdown.",
      "Individual and bulk image downloads with direct thumbnail previews.",
    ],
    tags: ["IMAGES", "STEGANOGRAPHY", "EXTRACTION"],
    technicalNote: "Parses /Subtype /Image XObjects and decodes raw streams to PNG buffers.",
  },
  {
    version: "v1.1.0",
    date: "October 05, 2026",
    title: "Advanced PDF Stream Compression & Size Optimization",
    category: "optimization",
    summary:
      "Multi-level binary compression engine reducing PDF file size while preserving structural integrity and vector assets.",
    highlights: [
      "Lossless stream re-encoding utilizing Deflate with garbage collection of unused XObjects and descriptors.",
      "Three optimization presets: Normal, Maximum, and Extreme with real-time byte savings calculation.",
      "Instant optimized document download straight from the browser.",
    ],
    tags: ["OPTIMIZATION", "COMPRESSION", "PERFORMANCE"],
    technicalNote: "Configured doc.save(garbage=4, deflate=True, clean=True) without obsolete linearization flags.",
    actionLink: {
      label: "Optimize PDF",
      href: "/scanner?tool=compress",
    },
  },
  {
    version: "v1.0.8",
    date: "October 03, 2026",
    title: "Forensic Text Extractor & Markdown Converter",
    category: "feature",
    summary:
      "Dual-mode document text extractor converting complex multi-column PDF layouts into clean plaintext or formatted Markdown.",
    highlights: [
      "Heading hierarchy detection mapping font sizes to h1, h2, and h3 Markdown tags.",
      "Table formatting preserving tabular structure in standard GFM pipe format.",
      "One-click copy and .md file download.",
    ],
    tags: ["TEXT", "MARKDOWN", "CONVERSION"],
  },
  {
    version: "v1.0.5",
    date: "October 02, 2026",
    title: "Incremental Update Timeline & Revision Graph Visualizer",
    category: "forensics",
    summary:
      "Forensic timeline reconstructor mapping every trailer revision and xref table in multi-version documents.",
    highlights: [
      "Chronological tree displaying initial publication and subsequent revision offsets.",
      "Detection of stealth changes, modified text streams, and redacted commentary.",
      "Byte offset mapping identifying hidden appended data past the legitimate EOF marker.",
    ],
    tags: ["FORENSICS", "REVISIONS", "INCREMENTAL UPDATES"],
  },
  {
    version: "v1.0.2",
    date: "October 01, 2026",
    title: "Static Security Heuristic Engine (CVE & Exploit Rules)",
    category: "security",
    summary:
      "Cybersecurity threat analyzer scanning document objects for known exploit primitives without code execution.",
    highlights: [
      "Detection of /JavaScript and /JS actions in AcroForms and OpenAction triggers.",
      "/Launch and /Win action detection targeting Windows PowerShell or Command Prompt.",
      "Direct IP address URI link detection bypassing DNS verification.",
      "Embedded file (/EF, /EmbeddedFiles) payload scanners.",
    ],
    tags: ["SECURITY", "CVE", "HEURISTICS", "MALWARE"],
  },
  {
    version: "v1.0.0",
    date: "October 01, 2026",
    title: "Initial Production Launch: DC Scanner Core Engine",
    category: "feature",
    summary:
      "Production launch of DC Scanner, the next-generation PDF intelligence, metadata analysis, and security verification platform.",
    highlights: [
      "Triple-engine architecture powered by PyMuPDF, pikepdf (QPDF), and pypdf.",
      "Comprehensive security heuristic analyzer identifying malicious JavaScript, OpenAction triggers, URI spoofing, and embedded payloads.",
      "Full metadata timeline analysis, incremental revision tracking, and object catalog explorer.",
      "REST API with bearer token authentication for automated CI/CD pipeline integration.",
      "Zero-retention privacy mode ensuring confidential documents leave no persistent trace.",
    ],
    tags: ["MAJOR RELEASE", "CORE ENGINE", "LAUNCH"],
    technicalNote: "FastAPI asynchronous backend with PyMuPDF 2.0, pikepdf 10.17, and Next.js 16 frontend.",
    actionLink: {
      label: "Scan First PDF",
      href: "/scanner",
    },
  },
];

export default function ChangelogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [copiedVersion, setCopiedVersion] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Releases" },
    { id: "feature", label: "Features" },
    { id: "security", label: "Security & Cryptography" },
    { id: "forensics", label: "Forensics" },
    { id: "optimization", label: "Optimization" },
    { id: "bugfix", label: "Bug Fixes" },
  ];

  const filteredEntries = useMemo(() => {
    return CHANGELOG_DATA.filter((entry) => {
      const matchesCategory =
        selectedCategory === "all" || entry.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        entry.title.toLowerCase().includes(q) ||
        entry.version.toLowerCase().includes(q) ||
        entry.summary.toLowerCase().includes(q) ||
        entry.tags.some((t) => t.toLowerCase().includes(q)) ||
        entry.highlights.some((h) => h.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
    setEmailInput("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  const copyReleaseLink = (version: string) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/changelog#${version}`;
      navigator.clipboard.writeText(url);
      setCopiedVersion(version);
      setTimeout(() => setCopiedVersion(null), 2000);
    }
  };

  const getCategoryBadge = (cat: ChangelogEntry["category"]) => {
    switch (cat) {
      case "security":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-500/15 text-red-400 border border-red-500/30">
            <Shield className="w-3 h-3" /> Security
          </span>
        );
      case "forensics":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Cpu className="w-3 h-3" /> Forensics
          </span>
        );
      case "optimization":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Zap className="w-3 h-3" /> Optimization
          </span>
        );
      case "bugfix":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <CheckCircle2 className="w-3 h-3" /> Bug Fix
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30">
            <Sparkles className="w-3 h-3" /> Feature
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0C1421] text-[#F5F7FA]">
      <AppHeader />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        {/* HERO SECTION */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141F30] border border-[#283548] text-[#35C987] text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="tracking-wide uppercase text-[11px] font-bold">
              Product Releases & Updates
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F7FA]">
            Changelog
          </h1>

          <p className="text-sm text-[#9BAABC] leading-relaxed">
            Track every forensic tool release, security heuristic update, parser enhancement, and platform patch added to{" "}
            <strong className="text-[#F5F7FA]">DC Scanner</strong>. Built for security analysts, incident responders, and document researchers.
          </p>
        </div>

        {/* CONTROLS: SEARCH & CATEGORY FILTER */}
        <div className="cyber-card p-4 rounded-2xl bg-[#141F30] border border-[#283548] space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#9BAABC] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search releases (e.g., delete, modal, signatures, oauth, fonts)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0C1421] border border-[#283548] text-xs text-[#F5F7FA] placeholder-[#9BAABC]/50 focus:outline-none focus:border-[#35C987]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9BAABC] hover:text-[#F5F7FA]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick stats badge */}
            <div className="flex items-center gap-2 text-xs text-[#9BAABC] px-3 py-1.5 rounded-xl bg-[#0C1421] border border-[#283548] self-start md:self-auto font-mono">
              <Layers className="w-3.5 h-3.5 text-[#35C987]" />
              <span>Showing {filteredEntries.length} of {CHANGELOG_DATA.length} releases</span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#35C987] text-[#0C1421] font-bold shadow-md shadow-[#35C987]/20"
                    : "bg-[#0C1421] border border-[#283548] text-[#9BAABC] hover:text-[#F5F7FA] hover:border-[#35C987]/40"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* TIMELINE FEED */}
        {filteredEntries.length === 0 ? (
          <div className="p-12 text-center cyber-card rounded-2xl bg-[#141F30] border border-[#283548] space-y-3">
            <Search className="w-8 h-8 text-[#9BAABC] mx-auto opacity-50" />
            <h3 className="text-sm font-bold text-[#F5F7FA]">No Releases Found</h3>
            <p className="text-xs text-[#9BAABC]">
              No changelog entries matched your query &ldquo;{searchQuery}&rdquo;. Try another keyword.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-4 py-1.5 rounded-lg bg-[#35C987] text-[#0C1421] font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="relative border-l-2 border-[#283548] ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-10">
            {filteredEntries.map((entry) => (
              <div key={entry.version} id={entry.version} className="relative group scroll-mt-24">
                {/* TIMELINE NODE */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-4 w-4 h-4 rounded-full border-2 transition-transform duration-200 group-hover:scale-125 ${
                    entry.isLatest
                      ? "bg-[#35C987] border-[#0C1421] ring-4 ring-[#35C987]/25"
                      : "bg-[#141F30] border-[#35C987]/60"
                  }`}
                />

                {/* CHANGELOG CARD */}
                <div className="cyber-card p-6 sm:p-7 rounded-2xl bg-[#141F30] border border-[#283548] hover:border-[#35C987]/40 transition-all space-y-5 shadow-xl">
                  {/* Top Meta Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#283548]/80 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 rounded-lg bg-[#35C987]/15 border border-[#35C987]/40 font-mono font-extrabold text-xs text-[#35C987]">
                        {entry.version}
                      </span>
                      {entry.isLatest && (
                        <span className="px-2.5 py-0.5 rounded-md bg-[#35C987] text-[#0C1421] font-bold text-[10px] tracking-wider uppercase">
                          Latest Release
                        </span>
                      )}
                      {getCategoryBadge(entry.category)}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#9BAABC] font-mono">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#35C987]" />
                        <span>{entry.date}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyReleaseLink(entry.version)}
                        className="hover:text-[#35C987] transition-colors p-1 rounded"
                        title="Copy direct link to release"
                      >
                        {copiedVersion === entry.version ? (
                          <Check className="w-3.5 h-3.5 text-[#35C987]" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <div className="space-y-2">
                    <h2 className="text-lg sm:text-xl font-bold text-[#F5F7FA] tracking-tight group-hover:text-[#35C987] transition-colors">
                      {entry.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#9BAABC] leading-relaxed">
                      {entry.summary}
                    </p>
                  </div>

                  {/* Key Highlights */}
                  <div className="space-y-2.5 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9BAABC] block">
                      Release Highlights
                    </span>
                    <ul className="space-y-2">
                      {entry.highlights.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-[#D8E1EC] leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-[#35C987] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technical Architecture Note */}
                  {entry.technicalNote && (
                    <div className="p-3 rounded-xl bg-[#0C1421] border border-[#283548] text-[11px] font-mono text-[#9BAABC] flex items-start gap-2">
                      <Code2 className="w-4 h-4 text-[#35C987] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#F5F7FA]">Engine Note:</strong> {entry.technicalNote}
                      </div>
                    </div>
                  )}

                  {/* Tags and Action CTA */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {entry.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded bg-[#0C1421] border border-[#283548] text-[10px] font-mono text-[#9BAABC]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {entry.actionLink && (
                      <Link
                        href={entry.actionLink.href}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#35C987] hover:underline"
                      >
                        <span>{entry.actionLink.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STAY INFORMED SUBSCRIPTION CALLOUT */}
        <section className="cyber-card p-6 sm:p-8 rounded-2xl bg-[#141F30] border border-[#283548] relative overflow-hidden space-y-4">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 rounded-full bg-[#35C987]/5 pointer-events-none blur-2xl" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-[#35C987]">
                <Bell className="w-5 h-5" />
                <h3 className="text-base font-bold text-[#F5F7FA]">
                  Subscribe to Security Advisories & Changelogs
                </h3>
              </div>
              <p className="text-xs text-[#9BAABC] leading-relaxed">
                Receive notifications when new PDF vulnerability rules (CVE signatures, font exploits, incremental update attacks) are deployed to the DC Scanner engine.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="security@enterprise.com"
                className="w-full sm:w-64 px-3.5 py-2 rounded-xl bg-[#0C1421] border border-[#283548] text-xs text-[#F5F7FA] placeholder-[#9BAABC]/50 focus:outline-none focus:border-[#35C987]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#35C987] hover:bg-[#2EB377] text-[#0C1421] font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shadow-md shadow-[#35C987]/20"
              >
                Subscribe
              </button>
            </form>
          </div>

          {subscribed && (
            <div className="p-3 rounded-xl bg-[#35C987]/15 border border-[#35C987]/40 text-[#35C987] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>You have been subscribed to DC Scanner product & security advisory dispatches.</span>
            </div>
          )}
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
