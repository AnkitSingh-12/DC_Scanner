"use client";

import React, { useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
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
  Search,
  ArrowRight,
} from "lucide-react";

export default function ToolsDirectoryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const categories = [
    {
      id: "ANALYZE",
      title: "Analyze PDF",
      color: "text-[#35C987]",
      bgColor: "bg-[#35C987]/15",
      borderColor: "border-[#35C987]/30",
      tools: [
        { name: "Verify Metadata", desc: "Inspect authoring software, timestamps, and trailer ID", icon: FileText, href: "/" },
        { name: "Validate PDF", desc: "Verify syntax and structure against ISO 32000 specs", icon: CheckCircle2, href: "/scanner?tool=validate" },
        { name: "AI Detection", desc: "Heuristic scan for AI-generated document patterns", icon: Sparkles, href: "/scanner?tool=ai" },
        { name: "Check Signatures", desc: "Validate digital certificates and cryptographic hashes", icon: ShieldCheck, href: "/scanner?tool=signatures" },
        { name: "Accessibility Check", desc: "Audit PDF/UA compliance, tags, and reading order", icon: Eye, href: "/scanner?tool=accessibility" },
        { name: "PDF/A Validator", desc: "Check long-term preservation archive conformance", icon: Archive, href: "/scanner?tool=pdfa" },
        { name: "PDF Font Checker", desc: "Inspect embedded font glyphs and encoding sets", icon: Type, href: "/scanner?tool=fonts" },
        { name: "Compare PDFs", desc: "Diff visual layouts and structural object changes", icon: ArrowLeftRight, href: "/scanner?tool=compare" },
        { name: "Batch PDF Checker", desc: "Bulk forensic scanning across multi-file archives", icon: Layers, href: "/scanner?tool=batch" },
      ],
    },
    {
      id: "OPTIMIZE",
      title: "Optimize PDF",
      color: "text-amber-400",
      bgColor: "bg-amber-500/15",
      borderColor: "border-amber-500/30",
      tools: [
        { name: "Compress PDF", desc: "Lossless stream compression and unreferenced object purge", icon: Minimize2, href: "/scanner?tool=compress" },
        { name: "Metadata Editor", desc: "Modify document info dictionary and XMP headers", icon: Tag, href: "/scanner?tool=metadata_editor" },
        { name: "Metadata Remover", desc: "Sanitize privacy-sensitive metadata before sharing", icon: ShieldAlert, href: "/scanner?tool=metadata_remover" },
        { name: "PDF Password", desc: "Audit encryption algorithms and permission flags", icon: Lock, href: "/scanner?tool=password" },
      ],
    },
    {
      id: "TRANSFORM",
      title: "Transform PDF",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/15",
      borderColor: "border-cyan-500/30",
      tools: [
        { name: "AI PDF Chat", desc: "Ask questions and summarize document contents", icon: MessageSquare, badge: "BETA", href: "/scanner?tool=ai_chat" },
        { name: "Extract Text", desc: "Extract clean plain text streams and page contents", icon: FileCode2, href: "/scanner?tool=extract_text" },
        { name: "Extract Images", desc: "Discover and dump embedded raster and vector graphics", icon: ImageIcon, href: "/scanner?tool=extract_images" },
        { name: "PDF to Markdown", desc: "Convert document outlines, tables, and text to Markdown", icon: Hash, href: "/scanner?tool=pdf_to_md" },
        { name: "PDF to Image", desc: "Render high-DPI page previews in PNG/WebP format", icon: Camera, href: "/scanner?tool=pdf_to_img" },
      ],
    },
    {
      id: "BUILD",
      title: "Build & Edit",
      color: "text-purple-400",
      bgColor: "bg-purple-500/15",
      borderColor: "border-purple-500/30",
      tools: [
        { name: "Merge PDF", desc: "Combine multiple PDF streams into a unified document", icon: Copy, href: "/scanner?tool=merge" },
        { name: "Split PDF", desc: "Extract page ranges and bursts into individual files", icon: Scissors, href: "/scanner?tool=split" },
        { name: "PDF Editor", desc: "Direct object and annotation stream editor", icon: Edit3, badge: "NEW", href: "/scanner?tool=editor" },
        { name: "PDF Highlighter", desc: "Add highlight and markup annotation overlays", icon: Highlighter, badge: "NEW", href: "/scanner?tool=highlighter" },
        { name: "Fill PDF Form", desc: "Populate AcroForm fields with structured data", icon: CheckSquare, badge: "NEW", href: "/scanner?tool=fill_form" },
        { name: "Build PDF Form", desc: "Design interactive text boxes, checkboxes, and signatures", icon: LayoutGrid, badge: "NEW", href: "/scanner?tool=build_form" },
      ],
    },
  ];

  const filteredCategories = categories
    .filter((cat) => activeCategory === "ALL" || cat.id === activeCategory)
    .map((cat) => ({
      ...cat,
      tools: cat.tools.filter((t) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
      }),
    }))
    .filter((cat) => cat.tools.length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#0C1421] text-[#F5F7FA]">
      <AppHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Banner */}
        <div className="space-y-3 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#35C987]/10 border border-[#35C987]/30 text-xs font-semibold text-[#35C987]">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Complete Forensic & Transformation Suite</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F7FA]">
            All PDF Security & Diagnostic Tools
          </h1>
          <p className="text-sm text-[#9BAABC] leading-relaxed">
            Inspect, validate, optimize, transform, and analyze PDF documents with specialized standalone engines.
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <Link
              href="/changelog"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141F30] border border-[#283548] hover:border-[#35C987]/50 text-[#35C987] text-xs font-semibold transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>Latest updates: See what&apos;s new in Changelog v1.8.0</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="cyber-card p-4 bg-[#141F30] border border-[#283548] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#9BAABC] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search tools (e.g. metadata, compress, chat)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0C1421] border border-[#283548] text-xs text-[#F5F7FA] placeholder-[#64748B] focus:outline-none focus:border-[#35C987]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {["ALL", "ANALYZE", "OPTIMIZE", "TRANSFORM", "BUILD"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  activeCategory === cat
                    ? "bg-[#35C987] text-[#0C1421]"
                    : "bg-[#0C1421] text-[#9BAABC] border border-[#283548] hover:text-[#F5F7FA]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Categorized Tools Sections */}
        <div className="space-y-12">
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#283548] pb-2">
                <span className={`text-sm font-bold uppercase tracking-wider ${cat.color}`}>
                  {cat.title}
                </span>
                <span className="text-xs text-[#64748B]">({cat.tools.length} tools)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      className="p-5 rounded-xl bg-[#141F30] hover:bg-[#1A273D] border border-[#283548] hover:border-[#35C987]/50 transition-all flex flex-col justify-between group shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-10 h-10 rounded-xl ${cat.bgColor} border ${cat.borderColor} flex items-center justify-center ${cat.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          {tool.badge && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-[#F5F7FA] group-hover:text-[#35C987] transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-[#9BAABC] mt-1 leading-relaxed">{tool.desc}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs font-semibold text-[#64748B] group-hover:text-[#35C987] transition-colors">
                        <span>Launch Tool</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
