"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  Download,
  Globe,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  Check,
  ExternalLink,
  X,
  Shield,
  FileText,
  Sparkles,
} from "lucide-react";

export default function AppFooter() {
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const [bookmarked, setBookmarked] = useState(false);
  const [installedToast, setInstalledToast] = useState(false);
  const [privacyModal, setPrivacyModal] = useState(false);
  const [termsModal, setTermsModal] = useState(false);
  const [editorialModal, setEditorialModal] = useState(false);
  const [chromeModal, setChromeModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);
  const [operatorModal, setOperatorModal] = useState(false);
  const [chromeEmail, setChromeEmail] = useState("");
  const [chromeJoined, setChromeJoined] = useState(false);

  const handleBookmark = () => {
    setBookmarked(true);
    setTimeout(() => setBookmarked(false), 2500);
  };

  const handleInstall = () => {
    setInstalledToast(true);
    setTimeout(() => setInstalledToast(false), 2500);
  };

  const languages = [
    "English",
    "Español",
    "Deutsch",
    "Français",
    "Italiano",
    "Português",
    "日本語",
    "中文",
  ];

  return (
    <footer className="w-full border-t border-[#1E293B] bg-[#070D18] text-[#9BAABC] text-xs mt-20">
      {/* Toast Notification */}
      {bookmarked && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#141F30] border border-[#35C987] text-[#F5F7FA] shadow-2xl flex items-center gap-2 text-xs animate-in fade-in slide-in-from-bottom-2">
          <Bookmark className="w-4 h-4 text-[#35C987]" />
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-[#0C1421] text-[#35C987] border border-[#283548]">Ctrl+D</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-[#0C1421] text-[#35C987] border border-[#283548]">⌘+D</kbd> to bookmark!</span>
        </div>
      )}

      {installedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#141F30] border border-[#35C987] text-[#F5F7FA] shadow-2xl flex items-center gap-2 text-xs animate-in fade-in slide-in-from-bottom-2">
          <Download className="w-4 h-4 text-[#35C987]" />
          <span>PWA install package initialized for your desktop browser.</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* TOP BRAND & ACTIONS ROW */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Brand Headline */}
          <div className="space-y-3 max-w-2xl">
            {/* Brand Logo matching DC Scanner reference */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#141F30] border border-[#283548] flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[#35C987]"
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
              <span className="font-extrabold text-xl tracking-tight text-[#F5F7FA]">
                DC Scanner
              </span>
            </Link>

            <h3 className="text-sm font-bold text-[#F5F7FA]">
              Professional PDF Metadata Analyzer & Validator
            </h3>

            <p className="text-xs text-[#9BAABC] leading-relaxed max-w-xl">
              A free online PDF checker and metadata viewer. Analyze PDF metadata, check for AI-generator indicators, inspect signatures, and run basic file checks.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Chrome Web Store Badge */}
            <a
              href="https://chromewebstore.google.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#141F30] hover:bg-[#1A273D] border border-[#283548] hover:border-[#35C987]/50 transition-all text-left shadow-sm group"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#35C987" opacity="0.2" />
                <circle cx="12" cy="12" r="5" fill="#4285F4" />
                <path d="M12 2A10 10 0 0 0 3.34 7.07L7.67 14.56A5 5 0 0 1 12 7h9.54A10 10 0 0 0 12 2Z" fill="#EA4335" />
                <path d="M21.54 7H12a5 5 0 0 0-4.33 2.5L3.34 17A10 10 0 0 0 12 22a9.96 9.96 0 0 0 8.66-5.01L16.33 9.5A4.97 4.97 0 0 1 21.54 7Z" fill="#FBBC05" />
                <circle cx="12" cy="12" r="4" fill="#FFFFFF" />
                <circle cx="12" cy="12" r="3" fill="#1A73E8" />
              </svg>
              <div>
                <span className="block text-[8px] uppercase tracking-wider text-[#64748B] font-semibold leading-tight">
                  Available in the
                </span>
                <span className="block text-[11px] font-bold text-[#F5F7FA] group-hover:text-[#35C987] transition-colors leading-tight">
                  chrome web store
                </span>
              </div>
            </a>

            {/* Install App Button */}
            <button
              type="button"
              onClick={handleInstall}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141F30] hover:bg-[#1A273D] border border-[#283548] hover:border-[#35C987]/50 text-[#F5F7FA] font-semibold text-xs transition-all shadow-sm"
            >
              <Download className="w-4 h-4 text-[#35C987]" />
              <span>Install DC Scanner app</span>
            </button>

            {/* Bookmark This Page Button */}
            <button
              type="button"
              onClick={handleBookmark}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141F30] hover:bg-[#1A273D] border border-[#283548] hover:border-[#35C987]/50 text-[#F5F7FA] font-semibold text-xs transition-all shadow-sm"
            >
              <Bookmark className="w-4 h-4 text-[#35C987]" />
              <span>Bookmark this page</span>
            </button>
          </div>
        </div>

        {/* TOP DIVIDER LINE */}
        <div className="border-t border-[#1E293B]" />

        {/* 4-COLUMN LINKS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          {/* 1. PDF TOOLS */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#F5F7FA]">
              PDF TOOLS
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="hover:text-[#35C987] transition-colors">
                  PDF Metadata Checker
                </Link>
              </li>
              <li>
                <Link href="/scanner?tool=validate" className="hover:text-[#35C987] transition-colors">
                  PDF Validator
                </Link>
              </li>
              <li>
                <Link href="/scanner?tool=ai" className="hover:text-[#35C987] transition-colors">
                  AI Detection Tool
                </Link>
              </li>
              <li>
                <Link href="/scanner?tool=ai_chat" className="hover:text-[#35C987] transition-colors inline-flex items-center gap-2">
                  <span>AI PDF Chat</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30">
                    BETA
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/scanner?tool=signatures" className="hover:text-[#35C987] transition-colors">
                  Signature Checker
                </Link>
              </li>
              <li>
                <Link href="/scanner?tool=compress" className="hover:text-[#35C987] transition-colors">
                  PDF Optimizer
                </Link>
              </li>
              <li>
                <Link href="/scanner?tool=accessibility" className="hover:text-[#35C987] transition-colors">
                  Accessibility Checker
                </Link>
              </li>
              <li>
                <Link href="/scanner?tool=merge" className="hover:text-[#35C987] transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/tools" className="text-[#35C987] font-bold hover:underline flex items-center gap-1">
                  <span>All 24 PDF tools</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* 2. DEVELOPERS */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#F5F7FA]">
              DEVELOPERS
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/developers" className="hover:text-[#35C987] transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="/developers#mcp" className="hover:text-[#35C987] transition-colors">
                  MCP Server
                </Link>
              </li>
              <li>
                <Link href="/developers#agents" className="hover:text-[#35C987] transition-colors">
                  AI Agents
                </Link>
              </li>
              <li>
                <Link href="/developers#whitelabel" className="hover:text-[#35C987] transition-colors">
                  White Label Solutions
                </Link>
              </li>
              <li>
                <Link href="/developers#desktop" className="hover:text-[#35C987] transition-colors">
                  Desktop app waitlist
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setChromeModal(true)}
                  className="hover:text-[#35C987] transition-colors cursor-pointer text-left"
                >
                  Chrome Extension
                </button>
              </li>
              <li>
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#35C987] transition-colors font-mono text-[11px]"
                >
                  LLMs.txt
                </a>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#35C987] transition-colors"
                >
                  Sitemap XML
                </a>
              </li>
              <li>
                <Link href="/tools" className="hover:text-[#35C987] transition-colors">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. RESOURCES */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#F5F7FA]">
              RESOURCES
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/#how-it-works" className="hover:text-[#35C987] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setAboutModal(true)}
                  className="hover:text-[#35C987] transition-colors cursor-pointer text-left"
                >
                  About
                </button>
              </li>
              <li>
                <Link href="/scanner?tool=validate" className="hover:text-[#35C987] transition-colors">
                  How We Validate PDFs
                </Link>
              </li>
              <li>
                <Link href="/scanner?tool=ai" className="hover:text-[#35C987] transition-colors">
                  How We Detect AI PDFs
                </Link>
              </li>
              <li>
                <Link href="/scanner?tool=compress" className="hover:text-[#35C987] transition-colors">
                  How We Optimize PDFs
                </Link>
              </li>
              <li>
                <Link href="/scanner?tool=signatures" className="hover:text-[#35C987] transition-colors">
                  How We Check Signatures
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#35C987] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-[#35C987] transition-colors">
                  Changelog
                </Link>
              </li>
              <li>
                <a href="mailto:support@dcscanner.io" className="hover:text-[#35C987] transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* 4. LEGAL */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#F5F7FA]">
              LEGAL
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[#35C987] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#35C987] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/editorial-policy"
                  className="hover:text-[#35C987] transition-colors"
                >
                  Editorial Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM DIVIDER LINE */}
        <div className="border-t border-[#1E293B]" />

        {/* BOTTOM METADATA BAR */}
        <div className="pt-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-[11px] text-[#64748B]">
          {/* Left: Language Selector Button + Privacy link */}
          <div className="space-y-2">
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141F30] hover:bg-[#1A273D] border border-[#283548] text-[#CBD5E1] font-medium transition-colors"
              >
                <span className="font-serif font-bold text-xs">文A</span>
                <span>{selectedLang}</span>
                <ChevronUp className={`w-3.5 h-3.5 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
              </button>

              {langOpen && (
                <div className="absolute bottom-10 left-0 w-36 rounded-xl bg-[#141F30] border border-[#283548] p-1.5 shadow-2xl z-50 space-y-0.5">
                  {languages.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => {
                        setSelectedLang(l);
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1 rounded-md text-xs transition-colors flex items-center justify-between ${
                        selectedLang === l
                          ? "bg-[#35C987] text-[#0C1421] font-bold"
                          : "text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#1A273D]"
                      }`}
                    >
                      <span>{l}</span>
                      {selectedLang === l && <Check className="w-3 h-3 text-[#0C1421]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setPrivacyModal(true)}
                className="text-[11px] text-[#64748B] hover:text-[#9BAABC] hover:underline transition-colors"
              >
                Privacy and cookie settings
              </button>
            </div>
          </div>

          {/* Center Copyright */}
          <div className="text-left md:text-center text-[#64748B]">
            <p>
              © {new Date().getFullYear()} DC Scanner - Professional PDF Metadata Checker & Forensic Security Platform
            </p>
          </div>

          {/* Right Operator Info */}
          <div className="text-left md:text-right text-[#64748B] max-w-xs">
            <p>
              Operated by DC Scanner Technologies India Pvt. Ltd., Bengaluru, India.{" "}
              <button
                type="button"
                onClick={() => setOperatorModal(true)}
                className="text-[#9BAABC] hover:text-[#35C987] underline transition-colors cursor-pointer"
              >
                About the operator
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* 1. Privacy and Cookie Settings Modal */}
      {privacyModal && (
        <div className="fixed inset-0 z-50 bg-[#0C1421]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="cyber-card p-6 rounded-2xl bg-[#141F30] border border-[#283548] max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#283548] pb-3">
              <h4 className="text-sm font-bold text-[#F5F7FA] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#35C987]" /> Privacy & Data Retention Policy
              </h4>
              <button onClick={() => setPrivacyModal(false)} className="text-[#9BAABC] hover:text-[#F5F7FA]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#9BAABC] leading-relaxed">
              DC Scanner operates under an uncompromising Zero-Retention architecture. Files uploaded for scanning are parsed in volatile sandbox memory and purged immediately after extraction.
            </p>
            <div className="p-3 rounded-lg bg-[#0C1421] border border-[#283548] text-xs space-y-1.5 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[#CBD5E1]">Regulatory Compliance</span>
                <span className="text-[#35C987] font-bold">India DPDP & GDPR</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#CBD5E1]">Third-Party Tracking</span>
                <span className="text-[#35C987] font-bold">Zero (Disabled)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#CBD5E1]">Document Retention</span>
                <span className="text-[#35C987] font-bold">Immediate Purge</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#CBD5E1]">Local Storage Encryption</span>
                <span className="text-[#35C987] font-bold">AES-256-GCM</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Link
                href="/privacy"
                onClick={() => setPrivacyModal(false)}
                className="text-xs text-[#35C987] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Read Full Privacy Charter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setPrivacyModal(false)}
                className="px-4 py-1.5 rounded-lg bg-[#35C987] text-[#0C1421] font-bold text-xs cursor-pointer"
              >
                Close & Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Chrome Extension Modal */}
      {chromeModal && (
        <div className="fixed inset-0 z-50 bg-[#0C1421]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="cyber-card p-6 rounded-2xl bg-[#141F30] border border-[#283548] max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#283548] pb-3">
              <h4 className="text-sm font-bold text-[#F5F7FA] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#35C987]" /> DC Scanner for Google Chrome
              </h4>
              <button onClick={() => setChromeModal(false)} className="text-[#9BAABC] hover:text-[#F5F7FA]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#9BAABC] leading-relaxed">
              Scan PDF links before clicking them. The DC Scanner extension uses Manifest V3 to inspect online documents, flag malicious JavaScript, and inspect metadata in one click.
            </p>
            <div className="space-y-2 text-xs text-[#D8E1EC]">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#35C987]" />
                <span>Right-click &quot;Inspect PDF with DC Scanner&quot;</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#35C987]" />
                <span>Instant phishing URL & /Launch action warning</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#35C987]" />
                <span>Offline local cache verification</span>
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!chromeEmail.trim()) return;
                setChromeJoined(true);
                setChromeEmail("");
                setTimeout(() => setChromeJoined(false), 4000);
              }}
              className="space-y-2 pt-2"
            >
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  value={chromeEmail}
                  onChange={(e) => setChromeEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#0C1421] border border-[#283548] text-xs text-[#F5F7FA] placeholder-[#64748B] focus:outline-none focus:border-[#35C987]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-[#35C987] text-[#0C1421] font-bold text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer"
                >
                  Join Waitlist
                </button>
              </div>
              {chromeJoined && (
                <div className="text-[11px] text-[#35C987] font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Added to Chrome Extension early access queue!</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* 3. About DC Scanner Modal */}
      {aboutModal && (
        <div className="fixed inset-0 z-50 bg-[#0C1421]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="cyber-card p-6 rounded-2xl bg-[#141F30] border border-[#283548] max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#283548] pb-3">
              <h4 className="text-sm font-bold text-[#F5F7FA] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#35C987]" /> About DC Scanner
              </h4>
              <button onClick={() => setAboutModal(false)} className="text-[#9BAABC] hover:text-[#F5F7FA]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#9BAABC] leading-relaxed">
              DC Scanner was founded by cybersecurity engineers, digital forensic examiners, and cryptography researchers. Our mission is to dismantle weaponized PDF threat vectors through deterministic structural inspection without executing malicious payloads.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#0C1421] border border-[#283548]">
                <span className="text-[#35C987] font-bold block mb-0.5">Triple-Engine</span>
                <span className="text-[#9BAABC] text-[11px]">PyMuPDF, pikepdf (QPDF), and pypdf multi-layer heuristics.</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0C1421] border border-[#283548]">
                <span className="text-[#35C987] font-bold block mb-0.5">Zero-Retention</span>
                <span className="text-[#9BAABC] text-[11px]">Wipes sensitive document streams immediately following parsing.</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAboutModal(false)}
                className="px-4 py-1.5 rounded-lg bg-[#35C987] text-[#0C1421] font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Terms of Service Modal */}
      {termsModal && (
        <div className="fixed inset-0 z-50 bg-[#0C1421]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="cyber-card p-6 rounded-2xl bg-[#141F30] border border-[#283548] max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#283548] pb-3">
              <h4 className="text-sm font-bold text-[#F5F7FA] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#35C987]" /> Terms of Service
              </h4>
              <button onClick={() => setTermsModal(false)} className="text-[#9BAABC] hover:text-[#F5F7FA]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-[#9BAABC] leading-relaxed max-h-64 overflow-y-auto pr-2">
              <p>
                <strong className="text-[#F5F7FA]">1. Permitted Use:</strong> DC Scanner is provided for defensive cybersecurity analysis, legal metadata verification, and document auditing. Users agree not to weaponize scan findings for malicious exploitation.
              </p>
              <p>
                <strong className="text-[#F5F7FA]">2. Data Ownership:</strong> You retain 100% of the rights to all uploaded files. DC Scanner claims zero intellectual property or copyright over uploaded materials.
              </p>
              <p>
                <strong className="text-[#F5F7FA]">3. Service Availability:</strong> While we guarantee 99.9% uptime for enterprise API tiers, the free public scanning engine is provided on an &quot;as-is&quot; basis without warranty of uninterrupted availability.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Link
                href="/terms"
                onClick={() => setTermsModal(false)}
                className="text-xs text-[#35C987] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Read Full Terms of Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setTermsModal(false)}
                className="px-4 py-1.5 rounded-lg bg-[#35C987] text-[#0C1421] font-bold text-xs cursor-pointer"
              >
                Accept & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Editorial Policy Modal */}
      {editorialModal && (
        <div className="fixed inset-0 z-50 bg-[#0C1421]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="cyber-card p-6 rounded-2xl bg-[#141F30] border border-[#283548] max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#283548] pb-3">
              <h4 className="text-sm font-bold text-[#F5F7FA] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#35C987]" /> Editorial & Responsible Disclosure Policy
              </h4>
              <button onClick={() => setEditorialModal(false)} className="text-[#9BAABC] hover:text-[#F5F7FA]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#9BAABC] leading-relaxed">
              Our research team adheres to the highest standards of responsible disclosure. We coordinate with ISO, Adobe, and software vendors prior to publishing technical analyses of zero-day vulnerabilities.
            </p>
            <div className="p-3 rounded-lg bg-[#0C1421] border border-[#283548] text-xs space-y-1">
              <div className="text-[#35C987] font-bold">Vulnerability Disclosure Timeline:</div>
              <p className="text-[#9BAABC] text-[11px]">
                We allow a standard 90-day patch window before releasing proof-of-concept heuristics and detection rules to the open threat feed.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Link
                href="/editorial-policy"
                onClick={() => setEditorialModal(false)}
                className="text-xs text-[#35C987] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Read Full Editorial Charter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setEditorialModal(false)}
                className="px-4 py-1.5 rounded-lg bg-[#35C987] text-[#0C1421] font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. About the Operator Modal */}
      {operatorModal && (
        <div className="fixed inset-0 z-50 bg-[#0C1421]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="cyber-card p-6 rounded-2xl bg-[#141F30] border border-[#283548] max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#283548] pb-3">
              <h4 className="text-sm font-bold text-[#F5F7FA] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#35C987]" /> Operator Information
              </h4>
              <button onClick={() => setOperatorModal(false)} className="text-[#9BAABC] hover:text-[#F5F7FA]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-[#9BAABC] leading-relaxed">
              <p>
                <strong className="text-[#F5F7FA]">Entity:</strong> DC Scanner Technologies India Private Limited
              </p>
              <p>
                <strong className="text-[#F5F7FA]">Corporate ID (CIN):</strong> U72900KA2024PTC184920 (Registrar of Companies, Bengaluru, India)
              </p>
              <p>
                <strong className="text-[#F5F7FA]">Registered Address:</strong> DC Tech Hub, 4th Floor, Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103, India
              </p>
              <p>
                <strong className="text-[#F5F7FA]">Compliance:</strong> India DPDP Act 2023, EU GDPR Article 28, ISO/IEC 27001:2022 ISMS.
              </p>
              <p>
                <strong className="text-[#F5F7FA]">Grievance & Privacy Officer:</strong> grievance@dcscanner.io / privacy@dcscanner.io
              </p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Link
                href="/privacy"
                onClick={() => setOperatorModal(false)}
                className="text-xs text-[#35C987] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>View Full Privacy Policy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setOperatorModal(false)}
                className="px-4 py-1.5 rounded-lg bg-[#35C987] text-[#0C1421] font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
