"use client";

import React, { useState } from "react";
import {
  ExtractedJavaScript,
  ExtractedURI,
  ExtractedAttachment,
  DocumentAction,
} from "@/types";
import {
  Code2,
  Globe,
  Paperclip,
  Zap,
  AlertTriangle,
  AlertOctagon,
  ExternalLink,
  Copy,
  Check,
  ShieldAlert,
} from "lucide-react";

interface ActiveContentInspectorProps {
  javascriptItems: ExtractedJavaScript[];
  uris: ExtractedURI[];
  attachments: ExtractedAttachment[];
  actions: DocumentAction[];
}

export default function ActiveContentInspector({
  javascriptItems,
  uris,
  attachments,
  actions,
}: ActiveContentInspectorProps) {
  const [activeTab, setActiveTab] = useState<"js" | "uris" | "attachments" | "actions">("js");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#141F30] border border-[#283548] rounded-xl overflow-hidden shadow-sm">
      {/* Sub-Tabs */}
      <div className="flex items-center gap-1 p-2 border-b border-[#283548] bg-[#0C1421] overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("js")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
            activeTab === "js"
              ? "bg-[#141F30] text-[#35C987] border border-[#283548]"
              : "text-[#9BAABC] hover:text-[#F5F7FA]"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>JavaScript Actions ({javascriptItems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("uris")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
            activeTab === "uris"
              ? "bg-[#141F30] text-[#35C987] border border-[#283548]"
              : "text-[#9BAABC] hover:text-[#F5F7FA]"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>External Hyperlinks ({uris.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("attachments")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
            activeTab === "attachments"
              ? "bg-[#141F30] text-[#35C987] border border-[#283548]"
              : "text-[#9BAABC] hover:text-[#F5F7FA]"
          }`}
        >
          <Paperclip className="w-3.5 h-3.5" />
          <span>Embedded Files ({attachments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("actions")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
            activeTab === "actions"
              ? "bg-[#141F30] text-[#35C987] border border-[#283548]"
              : "text-[#9BAABC] hover:text-[#F5F7FA]"
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Document Actions ({actions.length})</span>
        </button>
      </div>

      <div className="p-5">
        {/* TAB 1: JAVASCRIPT */}
        {activeTab === "js" && (
          <div>
            {javascriptItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#9BAABC]">
                No JavaScript actions or embedded code streams detected in this document.
              </div>
            ) : (
              <div className="space-y-4">
                {javascriptItems.map((js) => (
                  <div key={js.id} className="p-4 rounded-lg bg-[#0C1421] border border-[#283548] space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#F5F7FA]">{js.source_object}</span>
                        <span className="text-[11px] text-[#9BAABC] bg-[#141F30] px-2 py-0.5 rounded border border-[#283548]">
                          Trigger: {js.trigger_type}
                        </span>
                        {js.is_obfuscated && (
                          <span className="text-[10px] font-bold text-red-400 bg-red-500/15 border border-red-500/30 px-2 py-0.5 rounded">
                            OBFUSCATED CODE
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(js.code_preview, js.id)}
                        className="flex items-center gap-1 text-[11px] text-[#9BAABC] hover:text-[#35C987]"
                      >
                        {copiedId === js.id ? <Check className="w-3.5 h-3.5 text-[#35C987]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === js.id ? "Copied" : "Copy Code"}</span>
                      </button>
                    </div>

                    {js.suspicious_patterns.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {js.suspicious_patterns.map((pat, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-medium flex items-center gap-1">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            {pat}
                          </span>
                        ))}
                      </div>
                    )}

                    <pre className="p-3 rounded bg-[#070D16] border border-[#1E293B] font-mono text-[11px] text-[#F5F7FA] overflow-x-auto max-h-48 leading-relaxed">
                      {js.code_preview}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: HYPERLINKS */}
        {activeTab === "uris" && (
          <div>
            {uris.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#9BAABC]">
                No external URLs or /URI actions discovered in document annotations.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#283548] text-[#9BAABC] font-semibold">
                      <th className="pb-3">Destination URL</th>
                      <th className="pb-3">Domain</th>
                      <th className="pb-3">Protocol</th>
                      <th className="pb-3">Risk Flags</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#283548]">
                    {uris.map((uri, idx) => (
                      <tr key={idx} className="hover:bg-[#1A273C] transition-colors">
                        <td className="py-3 font-mono text-[#F5F7FA] max-w-[280px] truncate pr-4">
                          <a
                            href={uri.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#35C987] flex items-center gap-1 inline"
                          >
                            <span>{uri.url}</span>
                            <ExternalLink className="w-3 h-3 shrink-0 inline ml-1 opacity-60" />
                          </a>
                        </td>
                        <td className="py-3 font-mono text-[#9BAABC]">{uri.domain}</td>
                        <td className="py-3 uppercase font-mono text-[11px]">{uri.protocol}</td>
                        <td className="py-3">
                          {uri.risk_flags.length === 0 ? (
                            <span className="text-[#35C987] text-[11px]">Clean</span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {uri.risk_flags.map((flag, fIdx) => (
                                <span
                                  key={fIdx}
                                  className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                >
                                  {flag}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ATTACHMENTS */}
        {activeTab === "attachments" && (
          <div>
            {attachments.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#9BAABC]">
                No embedded files or attachments (/EmbeddedFiles) found in document portfolio.
              </div>
            ) : (
              <div className="space-y-3">
                {attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg bg-[#0C1421] border ${
                      att.is_executable ? "border-red-500/40 bg-red-500/5" : "border-[#283548]"
                    } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-[#35C987]" />
                        <span className="font-bold text-[#F5F7FA] text-sm">{att.filename}</span>
                        {att.is_executable && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1">
                            <AlertOctagon className="w-3 h-3" /> EXECUTABLE PAYLOAD
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#9BAABC] mt-1 space-x-3">
                        <span>Size: {(att.size_bytes / 1024).toFixed(1)} KB</span>
                        <span>Extension: {att.file_extension || "None"}</span>
                      </div>
                      <div className="font-mono text-[11px] text-[#64748B] mt-1">
                        SHA-256: {att.sha256}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ACTIONS */}
        {activeTab === "actions" && (
          <div>
            {actions.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#9BAABC]">
                No active document triggers or automatic events registered.
              </div>
            ) : (
              <div className="space-y-3">
                {actions.map((act, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-[#0C1421] border border-[#283548] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-[#F5F7FA]">{act.action_type}</span>
                      <span className="text-[11px] text-[#9BAABC] bg-[#141F30] px-2 py-0.5 rounded border border-[#283548]">
                        Trigger: {act.trigger}
                      </span>
                    </div>
                    <div className="text-xs text-[#9BAABC]">
                      <strong>Target:</strong> <code className="text-[#35C987]">{act.target}</code>
                    </div>
                    <p className="text-[11px] text-[#64748B]">{act.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
