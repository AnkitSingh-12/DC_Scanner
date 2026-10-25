"use client";

import React from "react";
import { PDFMetadata } from "@/types";
import { FileText, Lock, Globe, Clock, Server, Check, X } from "lucide-react";

interface MetadataTableProps {
  metadata?: PDFMetadata | null;
}

export default function MetadataTable({ metadata }: MetadataTableProps) {
  if (!metadata) {
    return (
      <div className="p-8 text-center text-xs text-[#9BAABC] bg-[#141F30] rounded-xl border border-[#283548]">
        No metadata extracted from document catalog.
      </div>
    );
  }

  const items = [
    { label: "PDF Format Specification", value: `PDF v${metadata.pdf_version}`, icon: FileText },
    { label: "Total Page Count", value: `${metadata.page_count} pages`, icon: FileText },
    { label: "File Size", value: `${(metadata.file_size_bytes / 1024).toFixed(1)} KB (${metadata.file_size_bytes.toLocaleString()} bytes)`, icon: Server },
    { label: "Document Title", value: metadata.title || "Not specified", icon: FileText },
    { label: "Author / Organization", value: metadata.author || "Not specified", icon: FileText },
    { label: "Subject", value: metadata.subject || "Not specified", icon: FileText },
    { label: "Keywords", value: metadata.keywords || "None", icon: FileText },
    { label: "Authoring Software (Creator)", value: metadata.creator || "Not specified", icon: Server },
    { label: "PDF Producer Engine", value: metadata.producer || "Not specified", icon: Server },
    { label: "Creation Timestamp", value: metadata.creation_date || "Not recorded", icon: Clock },
    { label: "Modification Timestamp", value: metadata.modification_date || "Not recorded", icon: Clock },
    { label: "Linearized (Fast Web View)", value: metadata.is_linearized ? "Enabled" : "Disabled", icon: Globe, highlight: metadata.is_linearized },
    { label: "Document Encryption", value: metadata.is_encrypted ? "Protected / Encrypted" : "Unencrypted Standard", icon: Lock, alert: metadata.is_encrypted },
    { label: "Indirect Objects Count", value: metadata.indirect_objects_count ? `${metadata.indirect_objects_count} objects` : "Dynamic", icon: Server },
    { label: "Content Streams Count", value: metadata.stream_count ? `${metadata.stream_count} streams` : "None", icon: Server },
  ];

  return (
    <div className="bg-[#141F30] border border-[#283548] rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-[#283548] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#F5F7FA]">Document Catalog & Extracted Metadata</h3>
          <p className="text-xs text-[#9BAABC] mt-0.5">Physical properties, creation fingerprints, and container attributes</p>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0C1421] border border-[#283548] text-[#35C987]">
          ISO 32000 Inspected
        </span>
      </div>

      <div className="divide-y divide-[#283548] text-xs">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-[#1A273C] transition-colors items-center gap-2"
            >
              <div className="flex items-center gap-2 text-[#9BAABC] font-medium">
                <Icon className="w-3.5 h-3.5 text-[#35C987] shrink-0" />
                <span>{item.label}</span>
              </div>
              <div className="sm:col-span-2 text-[#F5F7FA] font-mono break-all flex items-center gap-2">
                {item.alert ? (
                  <span className="text-amber-400 font-semibold">{item.value}</span>
                ) : (
                  <span>{item.value}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
