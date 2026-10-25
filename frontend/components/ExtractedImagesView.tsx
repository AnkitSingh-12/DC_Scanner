"use client";

import React, { useState, useEffect } from "react";
import { ImageIcon, Download, RefreshCw, AlertCircle, FileSearch } from "lucide-react";

interface ImageData {
  id: string;
  page: number;
  format: string;
  width: number;
  height: number;
  size_bytes: number;
  data_url: string;
}

interface ImagesResponse {
  scan_id: string;
  filename: string;
  total_images: number;
  images: ImageData[];
}

interface ExtractedImagesViewProps {
  scanId: string;
  filename: string;
  onExtractAnother?: () => void;
}

export default function ExtractedImagesView({
  scanId,
  filename,
  onExtractAnother,
}: ExtractedImagesViewProps) {
  const [data, setData] = useState<ImagesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/v1/scans/${scanId}/images`);
        if (!res.ok) throw new Error("Failed to load document images");
        const json: ImagesResponse = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Failed to extract images from PDF stream");
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, [scanId]);

  const downloadImage = (img: ImageData) => {
    const a = document.createElement("a");
    a.href = img.data_url;
    a.download = `${filename.replace(".pdf", "")}-page-${img.page}-${img.id}.${img.format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-sm text-[#9BAABC] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-[#35C987]" />
        <span>Scanning object streams and dumping embedded raster images...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-12 text-center text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-2xl">
        <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-400" />
        <p>{error || "Unable to retrieve images."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#141F30] border border-[#283548] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ImageIcon className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-[#F5F7FA]">Extracted Images Gallery</h2>
              <p className="text-xs text-[#9BAABC]">
                Found <strong className="text-[#35C987] font-mono">{data.total_images}</strong> embedded graphics across document streams in <span className="font-mono text-[#F5F7FA]">{filename}</span>
              </p>
            </div>
          </div>
        </div>

        {onExtractAnother && (
          <button
            type="button"
            onClick={onExtractAnother}
            className="px-4 py-2 rounded-xl bg-[#35C987] text-[#0C1421] font-bold text-xs uppercase tracking-wider hover:bg-[#2EB377] transition-all cursor-pointer shadow-md shadow-[#35C987]/20"
          >
            + Extract Another PDF
          </button>
        )}
      </div>

      {data.total_images === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-[#141F30] border border-[#283548] space-y-3">
          <FileSearch className="w-10 h-10 text-[#64748B] mx-auto" />
          <h3 className="text-base font-bold text-[#F5F7FA]">No Embedded Images Found</h3>
          <p className="text-xs text-[#9BAABC] max-w-md mx-auto">
            This PDF consists entirely of vector text outlines, glyph tables, and shapes without raster bitmap resources.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.images.map((img) => (
            <div
              key={img.id}
              className="rounded-2xl bg-[#141F30] border border-[#283548] overflow-hidden flex flex-col justify-between group hover:border-[#35C987]/50 transition-all shadow-lg"
            >
              {/* Preview container */}
              <div className="p-4 bg-[#09101C] flex items-center justify-center min-h-[220px] max-h-[260px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.data_url}
                  alt={`Extracted page ${img.page}`}
                  className="max-h-[200px] w-auto object-contain rounded-lg shadow-md group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* Info footer */}
              <div className="p-4 space-y-3 bg-[#141F30]">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#F5F7FA]">Page {img.page}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30">
                    {img.format}
                  </span>
                </div>

                <div className="text-[11px] text-[#9BAABC] flex items-center justify-between font-mono">
                  <span>{img.width} × {img.height} px</span>
                  <span>{(img.size_bytes / 1024).toFixed(1)} KB</span>
                </div>

                <button
                  type="button"
                  onClick={() => downloadImage(img)}
                  className="w-full py-2 rounded-xl bg-[#0C1421] hover:bg-[#1A273D] border border-[#283548] text-xs font-semibold text-[#F5F7FA] hover:text-[#35C987] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Image</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
