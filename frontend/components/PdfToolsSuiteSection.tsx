"use client";

import React from "react";
import Link from "next/link";
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
  ArrowRight,
} from "lucide-react";

export default function PdfToolsSuiteSection() {
  const tools = [
    // ANALYZE PDF (Green)
    { name: "Verify Metadata", badge: "NEW", icon: FileText, color: "text-[#35C987]", bg: "bg-[#35C987]/15", border: "border-[#35C987]/30", href: "/" },
    { name: "Validate PDF", icon: CheckCircle2, color: "text-[#35C987]", bg: "bg-[#35C987]/15", border: "border-[#35C987]/30", href: "/scanner?tool=validate" },
    { name: "AI Detection", icon: Sparkles, color: "text-[#35C987]", bg: "bg-[#35C987]/15", border: "border-[#35C987]/30", href: "/scanner?tool=ai" },
    { name: "Check Signatures", icon: ShieldCheck, color: "text-[#35C987]", bg: "bg-[#35C987]/15", border: "border-[#35C987]/30", href: "/scanner?tool=signatures" },
    { name: "Accessibility Check", icon: Eye, color: "text-[#35C987]", bg: "bg-[#35C987]/15", border: "border-[#35C987]/30", href: "/scanner?tool=accessibility" },
    { name: "PDF/A Validator", icon: Archive, color: "text-[#35C987]", bg: "bg-[#35C987]/15", border: "border-[#35C987]/30", href: "/scanner?tool=pdfa" },
    { name: "PDF Font Checker", icon: Type, color: "text-[#35C987]", bg: "bg-[#35C987]/15", border: "border-[#35C987]/30", href: "/scanner?tool=fonts" },
    { name: "Compare PDFs", icon: ArrowLeftRight, color: "text-[#35C987]", bg: "bg-[#35C987]/15", border: "border-[#35C987]/30", href: "/scanner?tool=compare" },
    { name: "Batch PDF Checker", icon: Layers, color: "text-[#35C987]", bg: "bg-[#35C987]/15", border: "border-[#35C987]/30", href: "/scanner?tool=batch" },

    // OPTIMIZE PDF (Amber)
    { name: "Compress PDF", icon: Minimize2, color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/30", href: "/scanner?tool=compress" },
    { name: "Metadata Editor", icon: Tag, color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/30", href: "/scanner?tool=metadata_editor" },
    { name: "Metadata Remover", icon: ShieldAlert, color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/30", href: "/scanner?tool=metadata_remover" },
    { name: "PDF Password", icon: Lock, color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/30", href: "/scanner?tool=password" },

    // TRANSFORM PDF (Cyan)
    { name: "AI PDF Chat", badge: "BETA", icon: MessageSquare, color: "text-cyan-400", bg: "bg-cyan-500/15", border: "border-cyan-500/30", href: "/scanner?tool=ai_chat" },
    { name: "Extract Text", icon: FileCode2, color: "text-cyan-400", bg: "bg-cyan-500/15", border: "border-cyan-500/30", href: "/scanner?tool=extract_text" },
    { name: "Extract Images", icon: ImageIcon, color: "text-cyan-400", bg: "bg-cyan-500/15", border: "border-cyan-500/30", href: "/scanner?tool=extract_images" },
    { name: "PDF to Markdown", icon: Hash, color: "text-cyan-400", bg: "bg-cyan-500/15", border: "border-cyan-500/30", href: "/scanner?tool=pdf_to_md" },
    { name: "PDF to Image", icon: Camera, color: "text-cyan-400", bg: "bg-cyan-500/15", border: "border-cyan-500/30", href: "/scanner?tool=pdf_to_img" },

    // BUILD & EDIT (Purple)
    { name: "Merge PDF", icon: Copy, color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/30", href: "/scanner?tool=merge" },
    { name: "Split PDF", icon: Scissors, color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/30", href: "/scanner?tool=split" },
    { name: "PDF Editor", badge: "NEW", icon: Edit3, color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/30", href: "/scanner?tool=editor" },
    { name: "PDF Highlighter", badge: "NEW", icon: Highlighter, color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/30", href: "/scanner?tool=highlighter" },
    { name: "Fill PDF Form", badge: "NEW", icon: CheckSquare, color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/30", href: "/scanner?tool=fill_form" },
    { name: "Build PDF Form", badge: "NEW", icon: LayoutGrid, color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/30", href: "/scanner?tool=build_form" },
  ];

  return (
    <div className="space-y-10 text-center">
      {/* Title & Subtitle */}
      <div className="space-y-3 max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7FA] tracking-tight">
          PDF Tools
        </h2>
        <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#9BAABC]">
          ONE PLATFORM TO SOLVE ALL YOUR PDF SECURITY & UTILITY NEEDS
        </p>

        <div className="pt-2">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#35C987] hover:bg-[#2EB377] text-[#0C1421] font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#35C987]/20"
          >
            <span>Explore all 24 tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Popular Tools Subheading */}
      <div className="flex items-center justify-between text-left border-b border-[#283548] pb-3">
        <span className="text-xs font-bold text-[#35C987] uppercase tracking-wider">
          POPULAR TOOLS
        </span>
        <span className="text-xs text-[#9BAABC]">
          24 Specialized Utilities
        </span>
      </div>

      {/* 5-Column Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.name}
              href={tool.href}
              className="cyber-card p-4 rounded-2xl bg-[#141F30]/80 hover:bg-[#1A273D] border border-[#283548] hover:border-[#35C987]/50 transition-all flex flex-col items-center justify-center text-center group relative shadow-sm hover:shadow-md hover:-translate-y-0.5 min-h-[110px]"
            >
              {tool.badge && (
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30">
                  {tool.badge}
                </span>
              )}

              <div
                className={`w-10 h-10 rounded-xl ${tool.bg} border ${tool.border} flex items-center justify-center ${tool.color} mb-2.5 group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <h3 className="text-xs font-bold text-[#F5F7FA] group-hover:text-[#35C987] transition-colors leading-tight">
                {tool.name}
              </h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
