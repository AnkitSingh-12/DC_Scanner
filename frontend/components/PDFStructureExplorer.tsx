"use client";

import React, { useState, useEffect } from "react";
import { FolderTree, FileCode, Layers, Image as ImageIcon, Type, Eye, RefreshCw } from "lucide-react";

interface PDFStructureExplorerProps {
  scanId: string;
}

export default function PDFStructureExplorer({ scanId }: PDFStructureExplorerProps) {
  const [treeData, setTreeData] = useState<any>(null);
  const [objects, setObjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"catalog" | "pages" | "fonts" | "objects">("catalog");

  useEffect(() => {
    async function fetchTree() {
      try {
        const [resTree, resObjs] = await Promise.all([
          fetch(`/api/v1/scans/${scanId}/explorer/tree`),
          fetch(`/api/v1/scans/${scanId}/explorer/objects?limit=50`),
        ]);
        if (resTree.ok) {
          const t = await resTree.json();
          setTreeData(t);
        }
        if (resObjs.ok) {
          const o = await resObjs.json();
          setObjects(o);
        }
      } catch (err) {
        console.error("Failed to load PDF structure:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTree();
  }, [scanId]);

  if (loading) {
    return (
      <div className="p-8 text-center bg-[#141F30] border border-[#283548] rounded-xl flex items-center justify-center gap-2 text-xs text-[#9BAABC]">
        <RefreshCw className="w-4 h-4 animate-spin text-[#35C987]" />
        <span>Loading PDF Object Structure Tree...</span>
      </div>
    );
  }

  if (!treeData) {
    return (
      <div className="p-8 text-center bg-[#141F30] border border-[#283548] rounded-xl text-xs text-[#9BAABC]">
        Document structure tree could not be retrieved. The file may have been processed in zero-retention mode.
      </div>
    );
  }

  return (
    <div className="bg-[#141F30] border border-[#283548] rounded-xl overflow-hidden shadow-sm">
      {/* Sub Tabs */}
      <div className="flex items-center gap-1 p-2 border-b border-[#283548] bg-[#0C1421] overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("catalog")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
            activeTab === "catalog"
              ? "bg-[#141F30] text-[#35C987] border border-[#283548]"
              : "text-[#9BAABC] hover:text-[#F5F7FA]"
          }`}
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>Catalog /Root Dictionary</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pages")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
            activeTab === "pages"
              ? "bg-[#141F30] text-[#35C987] border border-[#283548]"
              : "text-[#9BAABC] hover:text-[#F5F7FA]"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Page Tree ({treeData.page_count})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("fonts")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
            activeTab === "fonts"
              ? "bg-[#141F30] text-[#35C987] border border-[#283548]"
              : "text-[#9BAABC] hover:text-[#F5F7FA]"
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Fonts & Images ({treeData.fonts?.length || 0} fonts)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("objects")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
            activeTab === "objects"
              ? "bg-[#141F30] text-[#35C987] border border-[#283548]"
              : "text-[#9BAABC] hover:text-[#F5F7FA]"
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Indirect Objects ({treeData.total_indirect_objects})</span>
        </button>
      </div>

      <div className="p-5">
        {/* CATALOG TAB */}
        {activeTab === "catalog" && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-[#0C1421] border border-[#283548]">
                <span className="text-[#9BAABC] block text-[11px]">AcroForm Present</span>
                <strong className={`font-mono ${treeData.has_acroform ? "text-[#35C987]" : "text-[#64748B]"}`}>
                  {treeData.has_acroform ? "Yes (Interactive)" : "No"}
                </strong>
              </div>
              <div className="p-3 rounded-lg bg-[#0C1421] border border-[#283548]">
                <span className="text-[#9BAABC] block text-[11px]">Outlines / Bookmarks</span>
                <strong className={`font-mono ${treeData.has_outlines ? "text-[#35C987]" : "text-[#64748B]"}`}>
                  {treeData.has_outlines ? "Yes" : "No"}
                </strong>
              </div>
              <div className="p-3 rounded-lg bg-[#0C1421] border border-[#283548]">
                <span className="text-[#9BAABC] block text-[11px]">Embedded Files</span>
                <strong className={`font-mono ${treeData.has_embedded_files ? "text-amber-400" : "text-[#64748B]"}`}>
                  {treeData.has_embedded_files ? "Yes" : "No"}
                </strong>
              </div>
              <div className="p-3 rounded-lg bg-[#0C1421] border border-[#283548]">
                <span className="text-[#9BAABC] block text-[11px]">Indirect Objects</span>
                <strong className="font-mono text-[#F5F7FA]">{treeData.total_indirect_objects}</strong>
              </div>
            </div>

            <div className="rounded-lg bg-[#0C1421] border border-[#283548] p-4">
              <h4 className="font-bold text-[#F5F7FA] mb-3 text-xs uppercase tracking-wider">Root Catalog Key Map:</h4>
              <div className="space-y-2">
                {Object.entries(treeData.catalog || {}).map(([key, val]: [string, any]) => (
                  <div key={key} className="flex items-start justify-between font-mono p-2 rounded bg-[#141F30] border border-[#1E293B] gap-4">
                    <span className="text-[#35C987] font-semibold">{key}</span>
                    <span className="text-[#9BAABC] text-right truncate max-w-xl">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PAGES TAB */}
        {activeTab === "pages" && (
          <div className="space-y-3">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#283548] text-[#9BAABC]">
                    <th className="pb-2">Page #</th>
                    <th className="pb-2">MediaBox Dimensions</th>
                    <th className="pb-2">Rotation</th>
                    <th className="pb-2">Annotations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#283548] font-mono">
                  {(treeData.pages || []).map((p: any) => (
                    <tr key={p.page_index} className="hover:bg-[#1A273C] transition-colors">
                      <td className="py-2.5 text-[#F5F7FA] font-bold">Page {p.page_index}</td>
                      <td className="py-2.5 text-[#9BAABC]">
                        [{p.media_box.join(", ")}] pt
                      </td>
                      <td className="py-2.5 text-[#9BAABC]">{p.rotate}°</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[11px] ${p.annotations_count > 0 ? "bg-[#35C987]/15 text-[#35C987]" : "text-[#64748B]"}`}>
                          {p.annotations_count} annots
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FONTS TAB */}
        {activeTab === "fonts" && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[#0C1421] border border-[#283548]">
                <h4 className="font-bold text-[#F5F7FA] mb-2 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-[#35C987]" /> Embedded / Referenced Fonts
                </h4>
                {treeData.fonts && treeData.fonts.length > 0 ? (
                  <ul className="space-y-1 font-mono text-[#9BAABC]">
                    {treeData.fonts.map((f: string, i: number) => (
                      <li key={i} className="p-1.5 rounded bg-[#141F30] border border-[#1E293B]">
                        {f}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#64748B]">No named font resources registered in catalog.</p>
                )}
              </div>

              <div className="p-4 rounded-lg bg-[#0C1421] border border-[#283548]">
                <h4 className="font-bold text-[#F5F7FA] mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#35C987]" /> Image XObjects
                </h4>
                <p className="text-[#9BAABC] font-mono text-sm">
                  {treeData.images_count} image stream(s) referenced across page resources.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* OBJECTS TAB */}
        {activeTab === "objects" && (
          <div className="space-y-3 text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#283548] text-[#9BAABC]">
                    <th className="pb-2">Object ID</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Stream / Filter</th>
                    <th className="pb-2">Definition Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#283548] font-mono">
                  {objects.map((obj: any) => (
                    <tr key={`${obj.object_number}-${obj.generation}`} className="hover:bg-[#1A273C] transition-colors">
                      <td className="py-2.5 text-[#35C987] font-bold">
                        {obj.object_number} {obj.generation} R
                      </td>
                      <td className="py-2.5 text-[#F5F7FA]">{obj.object_type}</td>
                      <td className="py-2.5 text-[#9BAABC]">
                        {obj.is_stream ? (
                          <span className="text-amber-400">
                            Stream ({obj.stream_length || 0} B) {obj.filter ? `[${obj.filter}]` : ""}
                          </span>
                        ) : (
                          <span className="text-[#64748B]">None</span>
                        )}
                      </td>
                      <td className="py-2.5 text-[#9BAABC] max-w-md truncate pr-2">
                        {obj.content_preview}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
