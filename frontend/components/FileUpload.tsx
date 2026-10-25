"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, AlertCircle, Shield, Sliders, ArrowRight, Upload } from "lucide-react";
import { ScanProfile } from "@/types";

interface FileUploadProps {
  onScanStarted?: (scanId: string) => void;
  compact?: boolean;
}

export default function FileUpload({ onScanStarted, compact = false }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<ScanProfile>("standard");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setErrorMsg(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setErrorMsg("Invalid file type. Please select a valid PDF document (.pdf).");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrorMsg("File exceeds the 50 MB maximum size limit.");
      return;
    }
    setSelectedFile(file);
  };

  const startScan = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("profile", profile);

    try {
      const res = await fetch("/api/v1/scans", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Upload rejected by scanner engine.");
      }

      const data = await res.json();
      if (onScanStarted) {
        onScanStarted(data.scan_id);
      } else {
        window.location.href = `/scans/${data.scan_id}`;
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload and analyze document.");
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Upload Dropzone Card matching reference screenshot */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 transition-all duration-300 cursor-pointer p-5 sm:p-6 bg-[#0E1726] shadow-[0_0_25px_rgba(53,201,135,0.14)] ${
          isDragging
            ? "border-[#35C987] bg-[#35C987]/10 scale-[1.01]"
            : "border-[#35C987]/50 hover:border-[#35C987] hover:shadow-[0_0_30px_rgba(53,201,135,0.22)]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {!selectedFile ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            {/* Left: Icon + Text */}
            <div className="flex items-center gap-4 text-left">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#09101C] border border-[#283548] flex items-center justify-center text-[#35C987] shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <svg
                  className="w-7 h-7 text-[#35C987]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#F5F7FA]">
                  Drop your PDF here
                </h3>
                <p className="text-xs text-[#9BAABC] mt-0.5">
                  PDF files up to 50 MB
                </p>
              </div>
            </div>

            {/* Right: Solid Green Choose Button */}
            <div className="w-full sm:w-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#35C987] hover:bg-[#2EB377] text-[#0C1421] font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#35C987]/25 active:scale-95"
              >
                <svg
                  className="w-4 h-4 text-[#0C1421]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>Choose a PDF</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-2" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-xl bg-[#35C987]/15 border border-[#35C987]/30 flex items-center justify-center text-[#35C987]">
              <FileText className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-sm sm:text-base font-bold text-[#F5F7FA] font-mono">{selectedFile.name}</h3>
              <p className="text-xs text-[#9BAABC] mt-0.5">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for inspection
              </p>
            </div>

            {/* Scan Profile Selection */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-[#9BAABC] font-medium mr-1 flex items-center gap-1">
                <Sliders className="w-3 h-3" /> Profile:
              </span>
              {(["standard", "deep", "fast"] as ScanProfile[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProfile(p)}
                  className={`px-2.5 py-1 rounded text-xs font-medium uppercase tracking-wider transition-colors ${
                    profile === p
                      ? "bg-[#35C987] text-[#0C1421] font-semibold"
                      : "bg-[#0C1421] text-[#9BAABC] border border-[#283548] hover:text-[#F5F7FA]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="px-3.5 py-2 rounded-xl border border-[#283548] text-xs font-semibold text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#0C1421]"
              >
                Change File
              </button>
              <button
                type="button"
                onClick={startScan}
                disabled={isUploading}
                className="px-6 py-2.5 rounded-xl bg-[#35C987] hover:bg-[#2EB377] text-[#0C1421] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#35C987]/25 active:scale-95 disabled:opacity-50"
              >
                {isUploading ? (
                  <span>Analyzing AST & Metadata...</span>
                ) : (
                  <>
                    <span>Run Check Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3 Bullets Below Upload Card matching screenshot */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-[#9BAABC] pt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#35C987]" /> No signup needed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#35C987]" /> PDF deleted after the check
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#35C987]" /> <strong className="text-[#F5F7FA]">100</strong> free checks today
        </span>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
