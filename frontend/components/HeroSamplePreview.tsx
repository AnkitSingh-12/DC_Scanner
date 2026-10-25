"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Check, CheckCircle2, Zap, ArrowDown, FileText } from "lucide-react";
import { loginWithGoogle } from "@/lib/googleAuth";

export default function HeroSamplePreview() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("dc_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {
      // Ignore parsing errors
    }
  }, []);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const data = await loginWithGoogle();
      setCurrentUser(data.user);
      window.location.reload();
    } catch {
      window.location.href = "/login";
    } finally {
      setGoogleLoading(false);
    }
  };
  return (
    <div className="space-y-4">
      {/* CARD 1: SAMPLE REPORT CARD matching reference screenshot */}
      <div className="cyber-card p-6 rounded-2xl bg-[#141F30] border border-[#283548] shadow-2xl space-y-4">
        {/* Header: Document Icon + Title + Meta */}
        <div className="flex items-start gap-3.5 pb-3 border-b border-[#283548]">
          <div className="w-11 h-11 rounded-xl bg-[#0C1421] border border-[#283548] flex items-center justify-center text-[#35C987] shrink-0">
            <svg
              className="w-6 h-6 text-[#35C987]"
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
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#35C987]">
              SAMPLE REPORT
            </span>
            <h3 className="text-base font-bold text-[#F5F7FA] font-mono leading-tight">
              q3-contract-review.pdf
            </h3>
            <p className="text-xs text-[#9BAABC] mt-0.5">
              3 pages • 11.69 KB • PDF 1.7
            </p>
          </div>
        </div>

        {/* Checks Passed Pill */}
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Basic checks passed</span>
          </span>
          <span className="text-[#64748B] text-xs">8 passed</span>
        </div>

        {/* Key-Value Metadata Rows */}
        <div className="space-y-2 text-xs pt-1 border-t border-[#283548]/60">
          <div className="flex items-center justify-between py-1">
            <span className="text-[#9BAABC]">Author</span>
            <span className="font-semibold text-[#F5F7FA]">Jane Smith</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-[#9BAABC]">Software</span>
            <span className="font-medium text-[#CBD5E1]">Microsoft Word for Microsoft 365</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-[#9BAABC]">Created</span>
            <span className="font-mono text-[11px] text-[#F5F7FA]">Aug 14, 2026, 12:12 PM</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-[#9BAABC]">Modified</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[#F5F7FA]">Aug 21, 2026, 7:40 PM</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-semibold">
                <Zap className="w-3 h-3 text-amber-400" /> 7 days later
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-[#9BAABC]">AI indicators</span>
            <span className="text-[#35C987] font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> None found
            </span>
          </div>
        </div>

        {/* Disclaimer Note */}
        <p className="text-[11px] text-[#64748B] leading-relaxed pt-2 border-t border-[#283548]/60">
          From a real check of a sample PDF. Anyone can edit these fields, so double-check anything that matters.
        </p>

        {/* Open Full Sample Report Button */}
        <div>
          <Link
            href="/scans/3115f197-eab0-4b28-94ca-c4f92c352134"
            className="w-full py-2.5 rounded-xl bg-[#0C1421] hover:bg-[#1A273D] border border-[#283548] hover:border-[#35C987] text-[#F5F7FA] font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span>Open the full sample report</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#35C987]" />
          </Link>
        </div>
      </div>

      {/* CARD 2: CREATE A FREE ACCOUNT / ACTIVE SESSION CARD */}
      <div className="cyber-card p-5 rounded-2xl bg-[#141F30] border border-[#283548] shadow-xl space-y-3">
        {currentUser ? (
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#35C987] animate-pulse" />
              <h4 className="text-sm font-bold text-[#F5F7FA]">Welcome back, {currentUser.full_name}</h4>
            </div>
            <p className="text-xs text-[#9BAABC] mt-1 leading-relaxed">
              Signed in as <span className="text-[#35C987] font-semibold">{currentUser.email}</span>. Your forensic dossiers and API keys are active.
            </p>
            <div className="pt-3">
              <Link
                href="/history"
                className="w-full py-2.5 rounded-xl bg-[#35C987] hover:bg-[#2EB377] text-xs font-bold text-[#0C1421] flex items-center justify-center gap-2 transition-all shadow-md shadow-[#35C987]/20"
              >
                <span>View Saved Reports & History</span>
                <Check className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <h4 className="text-sm font-bold text-[#F5F7FA]">Create a free account</h4>
              <p className="text-xs text-[#9BAABC] mt-1 leading-relaxed">
                Save reports, share them by link and check several PDFs at once. No credit card needed.
              </p>
            </div>

            <div className="pt-3">
              <button
                type="button"
                id="hero-google-auth-btn"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full py-2.5 rounded-xl bg-[#0C1421] hover:bg-[#1A273D] border border-[#283548] hover:border-[#35C987] text-xs font-bold text-[#F5F7FA] flex items-center justify-center gap-2.5 transition-all shadow-sm group cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="group-hover:text-[#35C987] transition-colors">
                  {googleLoading ? "Signing in with Google..." : "Continue with Google"}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
