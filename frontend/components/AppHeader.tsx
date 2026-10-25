"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Sun,
  Moon,
  User,
  LogOut,
  Key,
  History,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import PdfToolsMegaMenu from "./PdfToolsMegaMenu";
import AuthModal, { AuthUser } from "./AuthModal";

export default function AppHeader() {
  const pathname = usePathname();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: "login" | "signup" }>({
    isOpen: false,
    mode: "login",
  });
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Restore user session from localStorage
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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("dc_user");
    localStorage.removeItem("dc_token");
    setCurrentUser(null);
    setUserMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#1E293B] bg-[#0C1421]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
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
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-[#F5F7FA]">DC Scanner</span>
            </div>
          </Link>

          {/* Navigation Links with Mega Menu */}
          <nav className="hidden md:flex items-center gap-2 relative" ref={dropdownRef}>
            {/* Verify Metadata Pill */}
            <Link
              href="/"
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                pathname === "/" || pathname === "/verify-metadata"
                  ? "bg-[#141F30] text-[#35C987] border border-[#35C987]/40 shadow-sm shadow-[#35C987]/10"
                  : "bg-[#141F30]/70 text-[#9BAABC] border border-[#283548] hover:text-[#35C987] hover:border-[#35C987]/30"
              }`}
            >
              Verify Metadata
            </Link>

            {/* All PDF Tools Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setToolsOpen(!toolsOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  toolsOpen
                    ? "bg-[#141F30] text-[#35C987]"
                    : "text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#141F30]/50"
                }`}
              >
                <span>All PDF Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsOpen ? "rotate-180 text-[#35C987]" : "text-[#9BAABC]"}`} />
              </button>

              {/* Floating Mega Menu Popover */}
              {toolsOpen && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 pt-2 z-50">
                  <PdfToolsMegaMenu onClose={() => setToolsOpen(false)} />
                </div>
              )}
            </div>

            {/* Pricing */}
            <Link
              href="/settings"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#141F30]/50 transition-colors"
            >
              Pricing
            </Link>

            {/* Changelog */}
            <Link
              href="/changelog"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#141F30]/50 transition-colors"
            >
              Changelog
            </Link>
          </nav>

          {/* Right Actions: Theme Toggle, User Profile or Log In / Sign Up */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
              className="w-8 h-8 rounded-lg text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#141F30] flex items-center justify-center transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {themeMode === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {currentUser ? (
              /* Logged In User Pill & Menu */
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-[#141F30] hover:bg-[#1E2E48] border border-[#283548] text-xs transition-all cursor-pointer"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-[#0C1421] shadow-sm"
                    style={{ backgroundColor: currentUser.avatar_color || "#35C987" }}
                  >
                    {currentUser.full_name ? currentUser.full_name[0].toUpperCase() : "U"}
                  </div>
                  <span className="font-bold text-[#F5F7FA] max-w-[100px] truncate">
                    {currentUser.full_name.split(" ")[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#9BAABC] transition-transform ${userMenuOpen ? "rotate-180 text-[#35C987]" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-64 rounded-2xl bg-[#141F30] border border-[#283548] shadow-2xl p-3 space-y-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-3 rounded-xl bg-[#0C1421] border border-[#283548] space-y-1">
                      <div className="font-bold text-[#F5F7FA] truncate">{currentUser.full_name}</div>
                      <div className="text-[11px] font-mono text-[#9BAABC] truncate">{currentUser.email}</div>
                      <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded bg-[#35C987]/15 text-[#35C987] font-semibold text-[10px]">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Active Session • Free Tier</span>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <Link
                        href="/history"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#0C1421] transition-colors"
                      >
                        <History className="w-4 h-4 text-[#35C987]" />
                        <span>My Scans History</span>
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#0C1421] transition-colors"
                      >
                        <Key className="w-4 h-4 text-cyan-400" />
                        <span>API Keys & Settings</span>
                      </Link>

                      <Link
                        href="/changelog"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#0C1421] transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span>Changelog & Releases</span>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-[#283548]">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Unauthenticated: Log In & Sign Up buttons */
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="header-login-btn"
                  onClick={() => setAuthModal({ isOpen: true, mode: "login" })}
                  className="text-xs font-semibold text-[#9BAABC] hover:text-[#F5F7FA] px-3 py-1.5 rounded-lg hover:bg-[#141F30]/50 transition-colors cursor-pointer"
                >
                  Log In
                </button>

                <button
                  type="button"
                  id="header-signup-btn"
                  onClick={() => setAuthModal({ isOpen: true, mode: "signup" })}
                  className="px-4 py-1.5 rounded-lg bg-[#35C987] hover:bg-[#2EB377] text-[#0C1421] font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#35C987]/20 active:scale-95 cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal (Handles both Log In and Sign Up) */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    </>
  );
}
