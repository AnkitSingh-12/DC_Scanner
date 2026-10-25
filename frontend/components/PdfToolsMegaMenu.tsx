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
  BarChart3,
  Clock,
  Building2,
  ArrowRight,
} from "lucide-react";

interface PdfToolsMegaMenuProps {
  onClose?: () => void;
}

export default function PdfToolsMegaMenu({ onClose }: PdfToolsMegaMenuProps) {
  const analyzeTools = [
    { name: "Verify Metadata", href: "/", icon: FileText },
    { name: "Validate PDF", href: "/scanner?tool=validate", icon: CheckCircle2 },
    { name: "AI Detection", href: "/scanner?tool=ai", icon: Sparkles },
    { name: "Check Signatures", href: "/scanner?tool=signatures", icon: ShieldCheck },
    { name: "Accessibility Check", href: "/scanner?tool=accessibility", icon: Eye },
    { name: "PDF/A Validator", href: "/scanner?tool=pdfa", icon: Archive },
    { name: "PDF Font Checker", href: "/scanner?tool=fonts", icon: Type },
    { name: "Compare PDFs", href: "/scanner?tool=compare", icon: ArrowLeftRight },
    { name: "Batch PDF Checker", href: "/scanner?tool=batch", icon: Layers },
  ];

  const optimizeTools = [
    { name: "Compress PDF", href: "/scanner?tool=compress", icon: Minimize2 },
    { name: "Metadata Editor", href: "/scanner?tool=metadata_editor", icon: Tag },
    { name: "Metadata Remover", href: "/scanner?tool=metadata_remover", icon: ShieldAlert },
    { name: "PDF Password", href: "/scanner?tool=password", icon: Lock },
  ];

  const transformTools = [
    { name: "AI PDF Chat", href: "/scanner?tool=ai_chat", icon: MessageSquare, badge: "BETA" },
    { name: "Extract Text", href: "/scanner?tool=extract_text", icon: FileCode2 },
    { name: "Extract Images", href: "/scanner?tool=extract_images", icon: ImageIcon },
    { name: "PDF to Markdown", href: "/scanner?tool=pdf_to_md", icon: Hash },
    { name: "PDF to Image", href: "/scanner?tool=pdf_to_img", icon: Camera },
  ];

  const buildTools = [
    { name: "Merge PDF", href: "/scanner?tool=merge", icon: Copy },
    { name: "Split PDF", href: "/scanner?tool=split", icon: Scissors },
    { name: "PDF Editor", href: "/scanner?tool=editor", icon: Edit3, badge: "NEW" },
    { name: "PDF Highlighter", href: "/scanner?tool=highlighter", icon: Highlighter, badge: "NEW" },
    { name: "Fill PDF Form", href: "/scanner?tool=fill_form", icon: CheckSquare, badge: "NEW" },
    { name: "Build PDF Form", href: "/scanner?tool=build_form", icon: LayoutGrid, badge: "NEW" },
  ];

  return (
    <div
      className="w-[960px] max-w-[95vw] bg-[#111A29] border border-[#283548] rounded-2xl shadow-2xl shadow-black/80 overflow-hidden text-xs z-50 animate-in fade-in zoom-in-95 duration-150"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 4 Columns Grid */}
      <div className="p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* COLUMN 1: ANALYZE PDF */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-bold tracking-wider uppercase text-[#9BAABC] px-1">
            ANALYZE PDF
          </h4>
          <div className="space-y-1">
            {analyzeTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.name}
                  href={tool.href}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1A273D] text-[#F5F7FA] hover:text-[#35C987] transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#35C987]/10 group-hover:bg-[#35C987]/20 border border-[#35C987]/20 flex items-center justify-center text-[#35C987] shrink-0 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-xs tracking-tight">{tool.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: OPTIMIZE PDF */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-bold tracking-wider uppercase text-[#9BAABC] px-1">
            OPTIMIZE PDF
          </h4>
          <div className="space-y-1">
            {optimizeTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.name}
                  href={tool.href}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1A273D] text-[#F5F7FA] hover:text-amber-400 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-xs tracking-tight">{tool.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* COLUMN 3: TRANSFORM PDF */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-bold tracking-wider uppercase text-[#9BAABC] px-1">
            TRANSFORM PDF
          </h4>
          <div className="space-y-1">
            {transformTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.name}
                  href={tool.href}
                  onClick={onClose}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-[#1A273D] text-[#F5F7FA] hover:text-cyan-400 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-xs tracking-tight">{tool.name}</span>
                  </div>
                  {tool.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30">
                      {tool.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* COLUMN 4: BUILD & EDIT */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-bold tracking-wider uppercase text-[#9BAABC] px-1">
            BUILD & EDIT
          </h4>
          <div className="space-y-1">
            {buildTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.name}
                  href={tool.href}
                  onClick={onClose}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-[#1A273D] text-[#F5F7FA] hover:text-purple-400 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-xs tracking-tight">{tool.name}</span>
                  </div>
                  {tool.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30">
                      {tool.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER BAR */}
      <div className="px-7 py-4 bg-[#0A101C] border-t border-[#283548] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9BAABC]">
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
            RESOURCES & TEMPLATES
          </span>
          <Link
            href="/history"
            onClick={onClose}
            className="flex items-center gap-1.5 hover:text-[#F5F7FA] transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#35C987]" />
            <span>Analytics</span>
          </Link>
          <Link
            href="/changelog"
            onClick={onClose}
            className="flex items-center gap-1.5 hover:text-[#F5F7FA] transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-[#35C987]" />
            <span>Changelog</span>
          </Link>
          <Link
            href="/developers#enterprise"
            onClick={onClose}
            className="flex items-center gap-1.5 hover:text-[#F5F7FA] transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-[#35C987]" />
            <span>White Label Solutions</span>
          </Link>
        </div>

        <Link
          href="/tools"
          onClick={onClose}
          className="flex items-center gap-1.5 font-bold text-[#35C987] hover:underline"
        >
          <span>View all PDF tools</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
