"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Lock,
  Zap,
  Layers,
  Terminal,
  Paperclip,
  ExternalLink,
  ChevronRight,
  Eye,
  FileCode,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  Star,
  Activity,
  Cpu,
  BookOpen,
  FileText,
  AlertOctagon,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import FileUpload from "@/components/FileUpload";
import RecentScansTicker from "@/components/RecentScansTicker";
import HeroSamplePreview from "@/components/HeroSamplePreview";
import RecentAnalysesTable from "@/components/RecentAnalysesTable";
import InspectionConsoleMockup from "@/components/InspectionConsoleMockup";
import AiThreatIntelligence from "@/components/AiThreatIntelligence";
import PdfToolsSuiteSection from "@/components/PdfToolsSuiteSection";
import RealTimeAuditsFeed from "@/components/RealTimeAuditsFeed";

export default function LandingPage() {
  const [threatTab, setThreatTab] = useState<"ALL" | "EXEC" | "PHISH" | "DATA">("ALL");

  const threatItems = [
    {
      category: "EXEC",
      title: "Hidden JavaScript Execution",
      tag: "/JavaScript, /JS",
      desc: "Malicious scripts embedded in AcroForm calculations, OpenActions, or annotations designed to trigger buffer overflows and memory corruption.",
      severity: "CRITICAL",
    },
    {
      category: "EXEC",
      title: "Weaponized /Launch Actions",
      tag: "/Launch, /Win",
      desc: "Direct instructions commanding the victim's host operating system to execute cmd.exe, PowerShell, or drop secondary binary payloads.",
      severity: "CRITICAL",
    },
    {
      category: "PHISH",
      title: "Credential Harvesting & Phishing",
      tag: "/URI, /SubmitForm",
      desc: "Obfuscated links pointing to direct IP addresses, deceptive login portals, or stealth form submission endpoints exfiltrating user credentials.",
      severity: "HIGH",
    },
    {
      category: "EXEC",
      title: "Embedded Binaries & Attachments",
      tag: "/EmbeddedFiles, /EF",
      desc: "Concealed PE executables (.exe, .dll), scripts (.vbs, .ps1), or compressed archives bundled inside PDF portfolios to evade email gateways.",
      severity: "CRITICAL",
    },
    {
      category: "PHISH",
      title: "Suspicious Direct IP Links",
      tag: "IPv4 /URI",
      desc: "Hyperlinks bypassing DNS resolution using direct IP addresses (e.g. http://192.168.1.105/login) often associated with malicious staging servers.",
      severity: "HIGH",
    },
    {
      category: "EXEC",
      title: "Cascaded Stream Obfuscation",
      tag: "/Filter chaining",
      desc: "Multi-stage compression chains (ASCIIHex + FlateDecode + LZW) specifically crafted to defeat single-pass antivirus stream scanners.",
      severity: "HIGH",
    },
    {
      category: "DATA",
      title: "Form Data Exfiltration",
      tag: "/SubmitForm",
      desc: "Background form actions configured to transmit user-entered form data, authentication tokens, or keystrokes to third-party endpoints.",
      severity: "MEDIUM",
    },
    {
      category: "EXEC",
      title: "Dynamic XFA Vulnerabilities",
      tag: "/AcroForm, /XFA",
      desc: "Complex dynamic XML forms containing calculation scripts and dynamic schema bindings vulnerable to remote code execution and heap corruption.",
      severity: "MEDIUM",
    },
    {
      category: "EXEC",
      title: "Zero-Day Font Exploit Buffers",
      tag: "/FontFile2, CFF",
      desc: "Corrupted embedded TrueType/OpenType font programs targeting memory corruption in underlying operating system font renderers.",
      severity: "HIGH",
      badge: "NEW",
    },
    {
      category: "DATA",
      title: "Incremental Update Tampering",
      tag: "Shadow Attacks (%%EOF)",
      desc: "Multiple EOF markers and shadow xref tables that rewrite document contents after digital cryptographic signatures were applied.",
      severity: "MEDIUM",
    },
    {
      category: "DATA",
      title: "Silent NTLM Hash Harvesting",
      tag: "/GoToR, SMB UNC",
      desc: "Remote document actions targeting internal SMB shares (\\\\evil\\share) designed to capture victim NTLMv2 challenge-response hashes.",
      severity: "HIGH",
    },
    {
      category: "DATA",
      title: "Steganography & Visual Layering",
      tag: "/OCG, /Layer",
      desc: "Hidden text layers and zero-opacity fonts placed behind deceptive invoice imagery to confuse optical character recognition and automated filters.",
      severity: "MEDIUM",
    },
  ];

  const filteredThreats =
    threatTab === "ALL"
      ? threatItems
      : threatItems.filter((t) => t.category === threatTab);

  return (
    <div className="min-h-screen flex flex-col bg-[#0C1421] text-[#F5F7FA]">
      <AppHeader />
      <RecentScansTicker />

      {/* 1. HERO SECTION */}
      <section className="relative pt-10 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141F30] border border-[#283548] text-xs font-semibold text-[#CBD5E1]">
              <svg
                className="w-4 h-4 text-[#35C987]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" stroke="#35C987" strokeWidth="2.5" />
                <line x1="16" y1="17" x2="8" y2="17" stroke="#35C987" strokeWidth="2.5" />
                <line x1="10" y1="9" x2="8" y2="9" stroke="#35C987" strokeWidth="2.5" />
              </svg>
              <span>Free online PDF metadata checker</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#F5F7FA] leading-[1.12]">
              Who made this PDF,<br />
              <span className="text-[#35C987]">and when was<br />it changed?</span>
            </h1>

            <p className="text-base sm:text-lg text-[#9BAABC] leading-relaxed max-w-xl">
              See who made a PDF, which app made it, and when it was created and last changed. Ten quick checks flag common problems.
            </p>

            {/* Glowing Direct Upload Card */}
            <div className="pt-2">
              <FileUpload />
            </div>
          </div>

          {/* Right Hero Column: Live Interactive Dossier Preview */}
          <div className="lg:col-span-5">
            <HeroSamplePreview />
          </div>
        </div>
      </section>

      {/* 2. RECENT ANALYSES (Directly below Hero, matching reference screenshot) */}
      <RecentAnalysesTable />

      {/* 3. HOW DC SCANNER INSPECTS PDFS (3-Step Feature Breakdown + Interactive Console Mockup) */}
      <section id="how-it-works" className="py-20 bg-[#09101C] border-y border-[#283548]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Steps */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <span className="text-xs font-bold text-[#35C987] uppercase tracking-wider">
                  Modular Analysis Engine
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F7FA] mt-1">
                  How DC Scanner analyzes your files
                </h2>
                <p className="text-sm text-[#9BAABC] mt-2 leading-relaxed">
                  Our multi-layered inspection engine dissects every byte, object, and stream without executing untrusted code.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#35C987]/15 border border-[#35C987]/30 flex items-center justify-center text-[#35C987] font-bold shrink-0">
                    1
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#F5F7FA]">Deep Metadata & Catalog Extraction</h3>
                    <p className="text-xs text-[#9BAABC] leading-relaxed">
                      Extracts author fingerprints, modification history, PDF versioning, trailer IDs, and encryption permissions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#35C987]/15 border border-[#35C987]/30 flex items-center justify-center text-[#35C987] font-bold shrink-0">
                    2
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#F5F7FA]">Active Content & Heuristics</h3>
                    <p className="text-xs text-[#9BAABC] leading-relaxed">
                      Hunts for hidden JavaScript, /Launch shell commands, /OpenAction zero-click triggers, and obfuscated streams.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#35C987]/15 border border-[#35C987]/30 flex items-center justify-center text-[#35C987] font-bold shrink-0">
                    3
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#F5F7FA]">Forensic Dossier & Threat Scoring</h3>
                    <p className="text-xs text-[#9BAABC] leading-relaxed">
                      Generates actionable severity-ranked findings mapped to MITRE ATT&CK techniques with structured JSON exports.
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating & Social Proof Badge */}
              <div className="pt-2 flex items-center gap-3 text-xs text-[#9BAABC]">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span>
                  <strong className="text-[#F5F7FA]">4.9/5 Rating</strong> • Trusted by 10,000+ security engineers
                </span>
              </div>
            </div>

            {/* Right Interactive Console Mockup */}
            <div className="lg:col-span-6">
              <InspectionConsoleMockup />
            </div>
          </div>

          {/* 3 Trust Items below mockup (matching reference screenshot) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#283548]/60 text-xs">
            <div className="flex items-center gap-2.5 text-[#CBD5E1]">
              <CheckCircle2 className="w-4 h-4 text-[#35C987] shrink-0" />
              <span><strong>Deterministic AST Parsing:</strong> Inspects objects without execution.</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#CBD5E1]">
              <CheckCircle2 className="w-4 h-4 text-[#35C987] shrink-0" />
              <span><strong>Zero Execution Risk:</strong> Isolated in-memory non-rendering buffer.</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#CBD5E1]">
              <CheckCircle2 className="w-4 h-4 text-[#35C987] shrink-0" />
              <span><strong>ISO 32000 Conforming:</strong> Full compatibility with PDF 1.0 - 2.0.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY DO YOU NEED TO INSPECT YOUR PDFS? (12 Threat Matrix in 4 Columns) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#35C987] uppercase tracking-wider">
              Vulnerability Landscape
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#F5F7FA] mt-1">
              Why do you need to inspect your PDFs?
            </h2>
            <p className="text-xs sm:text-sm text-[#9BAABC] mt-1 max-w-xl">
              PDFs are complex document programs capable of embedding active scripts, launching external executables, and exfiltrating sensitive data.
            </p>
          </div>

          {/* Threat Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-[#141F30] p-1.5 rounded-xl border border-[#283548]">
            {[
              { id: "ALL", label: "All (12)" },
              { id: "EXEC", label: "Active Execution (5)" },
              { id: "PHISH", label: "Phishing & Links (2)" },
              { id: "DATA", label: "Data Theft (5)" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setThreatTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  threatTab === tab.id
                    ? "bg-[#35C987] text-[#0C1421]"
                    : "text-[#9BAABC] hover:text-[#F5F7FA]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Grid of 12 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredThreats.map((item, idx) => (
            <div key={idx} className="cyber-card p-4 rounded-xl bg-[#141F30] border border-[#283548] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-[#35C987] bg-[#0C1421] px-2 py-0.5 rounded border border-[#283548]">
                    {item.tag}
                  </span>
                  <div className="flex items-center gap-1">
                    {item.badge && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30">
                        {item.badge}
                      </span>
                    )}
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        item.severity === "CRITICAL"
                          ? "bg-red-500/20 text-red-400"
                          : item.severity === "HIGH"
                          ? "bg-red-500/15 text-red-300"
                          : "bg-amber-500/15 text-amber-300"
                      }`}
                    >
                      {item.severity}
                    </span>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-[#F5F7FA]">{item.title}</h4>
                <p className="text-[11px] text-[#9BAABC] mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <div className="text-center pt-2">
          <p className="text-xs text-[#64748B]">
            All 12 security heuristics execute in parallel in under 800ms per file.
          </p>
        </div>
      </section>

      {/* 5. ASK DC SCANNER AI (Chat Mockup + 3 Value Pillars) */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <AiThreatIntelligence />
      </section>

      {/* 6. ALL PDF TOOLS (5-Column Suite Grid matching reference screenshot) */}
      <section className="py-20 bg-[#09101C] border-y border-[#283548]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PdfToolsSuiteSection />
        </div>
      </section>

      {/* 7. COMPARISON & LATEST AUDITS SECTION (2 Columns) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Comparison Table */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#35C987] uppercase tracking-wider">
                Architecture & Privacy Comparison
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F7FA] mt-1">
                DC Scanner vs Traditional Antivirus & Public Cloud Converters
              </h2>
              <p className="text-xs sm:text-sm text-[#9BAABC] mt-2 leading-relaxed">
                Most online PDF tools and legacy antivirus scanners fail when dealing with modern weaponized documents. They either execute files dangerously in shared cloud renderers or check static file hashes that miss polymorphically encoded PDF streams.
              </p>
            </div>

            {/* Feature Comparison Table */}
            <div className="cyber-card bg-[#141F30] border border-[#283548] rounded-2xl overflow-hidden text-xs shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#0C1421] text-[#9BAABC] uppercase font-semibold border-b border-[#283548]">
                    <tr>
                      <th className="p-3.5">Inspection Capability</th>
                      <th className="p-3.5 text-[#35C987]">DC Scanner</th>
                      <th className="p-3.5">Traditional Antivirus</th>
                      <th className="p-3.5">Public Cloud Converters</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#283548]">
                    <tr className="hover:bg-[#1A273C]">
                      <td className="p-3.5 font-semibold text-[#F5F7FA]">Deterministic AST Disassembly</td>
                      <td className="p-3.5 text-[#35C987] font-bold">✓ Full Object Graph</td>
                      <td className="p-3.5 text-[#9BAABC]">✗ Hash Signatures Only</td>
                      <td className="p-3.5 text-[#9BAABC]">✗ None</td>
                    </tr>
                    <tr className="hover:bg-[#1A273C]">
                      <td className="p-3.5 font-semibold text-[#F5F7FA]">Non-Executing Sandbox Isolation</td>
                      <td className="p-3.5 text-[#35C987] font-bold">✓ 100% In-Memory Safe</td>
                      <td className="p-3.5 text-[#9BAABC]">~ Varies</td>
                      <td className="p-3.5 text-red-400 font-semibold">✗ Spawns Full Renderers</td>
                    </tr>
                    <tr className="hover:bg-[#1A273C]">
                      <td className="p-3.5 font-semibold text-[#F5F7FA]">Zero-Retention Privacy Guarantee</td>
                      <td className="p-3.5 text-[#35C987] font-bold">✓ Instant Purge Option</td>
                      <td className="p-3.5 text-[#9BAABC]">✗ Telemetry Retained</td>
                      <td className="p-3.5 text-red-400 font-semibold">✗ Uploads Often Stored</td>
                    </tr>
                    <tr className="hover:bg-[#1A273C]">
                      <td className="p-3.5 font-semibold text-[#F5F7FA]">Cascaded Stream Decompression</td>
                      <td className="p-3.5 text-[#35C987] font-bold">✓ Multi-stage (Hex + Flate + LZW)</td>
                      <td className="p-3.5 text-[#9BAABC]">~ Single Pass Only</td>
                      <td className="p-3.5 text-[#9BAABC]">✗ None</td>
                    </tr>
                    <tr className="hover:bg-[#1A273C]">
                      <td className="p-3.5 font-semibold text-[#F5F7FA]">Structural Anomaly & Shadow Attack Audit</td>
                      <td className="p-3.5 text-[#35C987] font-bold">✓ Multi-%%EOF & Trailing Bytes</td>
                      <td className="p-3.5 text-[#9BAABC]">✗ None</td>
                      <td className="p-3.5 text-[#9BAABC]">✗ None</td>
                    </tr>
                    <tr className="hover:bg-[#1A273C]">
                      <td className="p-3.5 font-semibold text-[#F5F7FA]">Programmatic Developer REST API</td>
                      <td className="p-3.5 text-[#35C987] font-bold">✓ Included (v1)</td>
                      <td className="p-3.5 text-[#9BAABC]">~ Enterprise License Only</td>
                      <td className="p-3.5 text-[#9BAABC]">✗ None</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Latest Audits Feed */}
          <div className="lg:col-span-4">
            <RealTimeAuditsFeed />
          </div>
        </div>
      </section>

      {/* 8. IN-DEPTH FORENSIC & METADATA GUIDE (Technical Documentation from reference screenshot) */}
      <section className="py-20 bg-[#09101C] border-t border-[#283548]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#35C987]/15 border border-[#35C987]/30 text-xs font-bold text-[#35C987]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Technical Whitepaper & Forensic Guide</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F7FA]">
              Why You Need to Inspect PDF Metadata
            </h2>
            <p className="text-sm text-[#9BAABC] leading-relaxed">
              Most organizations share hundreds of PDF documents every day without realizing that PDF files are miniature databases containing extensive operational and personal metadata. When you convert a Word document, spreadsheet, or scan to PDF, author identities, internal network file paths, revision histories, printer identifiers, and software versions remain embedded inside document catalog and info dictionaries.
            </p>
          </div>

          {/* Subsections matching slice 4 & 5 */}
          <div className="space-y-8 text-xs text-[#CBD5E1] leading-relaxed">
            {/* Subsection 1 */}
            <div className="p-6 rounded-2xl bg-[#141F30] border border-[#283548] space-y-2.5">
              <h3 className="text-base font-bold text-[#F5F7FA] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#35C987]" />
                Hidden Metadata in Business Documents
              </h3>
              <p className="text-xs text-[#9BAABC]">
                In legal discovery, corporate acquisitions, and competitive RFP bids, uninspected PDF metadata frequently results in catastrophic leaks. Opposing legal counsel or competitors can inspect document info dictionaries to uncover original document authors, internal client names, deleted commentary, and previous revision timestamps that contradict finalized public releases.
              </p>
            </div>

            {/* Subsection 2 */}
            <div className="p-6 rounded-2xl bg-[#141F30] border border-[#283548] space-y-2.5">
              <h3 className="text-base font-bold text-[#F5F7FA] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#35C987]" />
                Anonymizing PDF Metadata
              </h3>
              <p className="text-xs text-[#9BAABC]">
                Before distributing documents externally, security best practices demand sanitizing sensitive metadata tags. DC Scanner identifies embedded XMP schemas, document trailer IDs, and Creator tags, allowing compliance officers to verify that documents are clean of identifiable employee usernames and local network paths before public release.
              </p>
            </div>

            {/* Subsection 3 */}
            <div className="p-6 rounded-2xl bg-[#141F30] border border-[#283548] space-y-2.5">
              <h3 className="text-base font-bold text-[#F5F7FA] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Technical Vulnerabilities in PDF Files
              </h3>
              <p className="text-xs text-[#9BAABC]">
                Beyond metadata leakage, PDF files pose grave cybersecurity risks due to their support for Turing-complete PostScript operators, embedded binary streams, and interactive forms. Vulnerabilities such as CVE-2023-21608 (Adobe Acrobat Use-After-Free) and CVE-2021-28550 (Arbitrary Code Execution) demonstrate that memory corruption exploits can be hidden inside corrupted font streams, dynamic XFA forms, and malformed XRef tables.
              </p>
            </div>

            {/* Subsection 4 */}
            <div className="p-6 rounded-2xl bg-[#141F30] border border-[#283548] space-y-2.5">
              <h3 className="text-base font-bold text-[#F5F7FA] flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-red-400" />
                Advanced Attack Vectors: JavaScript & /Launch Actions
              </h3>
              <p className="text-xs text-[#9BAABC]">
                Attackers frequently weaponize /OpenAction triggers paired with obfuscated /JavaScript to execute shell code when a document is opened. Alternatively, /Launch actions abuse helper application handlers to execute system shells (PowerShell, cmd.exe) without user confirmation. DC Scanner statically identifies these triggers without executing the file.
              </p>
            </div>

            {/* Subsection 5 */}
            <div className="p-6 rounded-2xl bg-[#141F30] border border-[#283548] space-y-2.5">
              <h3 className="text-base font-bold text-[#F5F7FA] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#35C987]" />
                Risk Mitigation with DC Scanner
              </h3>
              <p className="text-xs text-[#9BAABC]">
                DC Scanner eliminates these risks through deterministic AST object disassembly and zero-execution inspection containers. Every indirect object, stream, and dictionary is parsed without invoking Adobe Acrobat or browser JavaScript runtimes. The resulting threat dossier provides security operations teams with unambiguous forensic indicators mapped to MITRE ATT&CK standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT RELEASES & CHANGELOG PREVIEW */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141F30] border border-[#283548] text-[#35C987] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="uppercase text-[10px] tracking-wider font-bold">Continuous Engineering Releases</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
              Platform Releases & Security Changelog
            </h2>
            <p className="text-xs sm:text-sm text-[#9BAABC] max-w-2xl">
              Track real-time engine patches, forensic heuristics, and newly deployed PDF validation capabilities.
            </p>
          </div>

          <Link
            href="/changelog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141F30] hover:bg-[#1E2E48] border border-[#283548] hover:border-[#35C987]/40 text-[#35C987] font-bold text-xs uppercase tracking-wider transition-all self-start md:self-auto"
          >
            <span>View Full Changelog (20 Releases)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Release 1 */}
          <div className="cyber-card p-6 rounded-2xl bg-[#141F30] border border-[#283548] hover:border-[#35C987]/40 transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-[#35C987]/15 border border-[#35C987]/40 font-mono font-bold text-xs text-[#35C987]">
                  v1.8.0
                </span>
                <span className="px-2 py-0.5 rounded bg-[#35C987] text-[#0C1421] font-bold text-[9px] uppercase">
                  Latest
                </span>
              </div>
              <h3 className="text-base font-bold text-[#F5F7FA]">
                Interactive Forensic Dossier & 8-Tool Workspace
              </h3>
              <p className="text-xs text-[#9BAABC] leading-relaxed">
                Multi-tool switcher bar directly atop every scan dossier, allowing real-time switching between text, chat, signatures, font inspector, and compression.
              </p>
            </div>
            <div className="pt-2 border-t border-[#283548]/60 flex items-center justify-between text-xs">
              <span className="text-[#9BAABC] font-mono text-[11px]">Oct 25, 2026</span>
              <Link href="/changelog#v1.8.0" className="text-[#35C987] font-semibold hover:underline flex items-center gap-1">
                <span>Details</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Release 2 */}
          <div className="cyber-card p-6 rounded-2xl bg-[#141F30] border border-[#283548] hover:border-[#35C987]/40 transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/40 font-mono font-bold text-xs text-red-400">
                  v1.7.0
                </span>
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-[9px] uppercase">
                  Security
                </span>
              </div>
              <h3 className="text-base font-bold text-[#F5F7FA]">
                Full Authentication Suite & User Session Management
              </h3>
              <p className="text-xs text-[#9BAABC] leading-relaxed">
                Native account registration, encrypted password storage, and 1-click Google OAuth demo integration with session persistence.
              </p>
            </div>
            <div className="pt-2 border-t border-[#283548]/60 flex items-center justify-between text-xs">
              <span className="text-[#9BAABC] font-mono text-[11px]">Oct 24, 2026</span>
              <Link href="/changelog#v1.7.0" className="text-[#35C987] font-semibold hover:underline flex items-center gap-1">
                <span>Details</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Release 3 */}
          <div className="cyber-card p-6 rounded-2xl bg-[#141F30] border border-[#283548] hover:border-[#35C987]/40 transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/40 font-mono font-bold text-xs text-blue-400">
                  v1.5.0
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold text-[9px] uppercase">
                  Catalog
                </span>
              </div>
              <h3 className="text-base font-bold text-[#F5F7FA]">
                Comprehensive 24-Tool Forensic Catalog
              </h3>
              <p className="text-xs text-[#9BAABC] leading-relaxed">
                Dedicated tools directory classifying 24 specialized analyzers across Security, Forensics, Extraction, Conversion, and Privacy categories.
              </p>
            </div>
            <div className="pt-2 border-t border-[#283548]/60 flex items-center justify-between text-xs">
              <span className="text-[#9BAABC] font-mono text-[11px]">Oct 20, 2026</span>
              <Link href="/changelog#v1.5.0" className="text-[#35C987] font-semibold hover:underline flex items-center gap-1">
                <span>Details</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PRE-FOOTER CTA CARD (Matching reference screenshot) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="cyber-card p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-[#141F30] via-[#101A29] to-[#0D1522] border border-[#283548] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-[#F5F7FA] tracking-tight uppercase">
              Ready for Real-Time PDF Analysis?
            </h3>
            <p className="text-xs sm:text-sm text-[#9BAABC]">
              Inspect your PDF files instantly with our automated cybersecurity forensics engine.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/scanner"
              className="px-6 py-2.5 rounded-xl bg-[#35C987] hover:bg-[#2EB377] text-[#0C1421] font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#35C987]/25"
            >
              Start Free PDF Scan
            </Link>
            <Link
              href="/developers"
              className="px-5 py-2.5 rounded-xl bg-[#0C1421] hover:bg-[#141F30] text-[#CBD5E1] border border-[#283548] font-bold text-xs uppercase tracking-wider transition-all"
            >
              Explore API Docs
            </Link>
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
