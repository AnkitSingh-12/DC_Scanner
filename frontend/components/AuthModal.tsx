"use client";

import React, { useState } from "react";
import { Lock, Mail, User, AlertCircle, RefreshCw, X, ShieldCheck } from "lucide-react";
import { loginWithGoogle } from "@/lib/googleAuth";

export interface AuthUser {
  user_id: string;
  email: string;
  full_name: string;
  avatar_color: string;
}

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: "login" | "signup";
  onClose: () => void;
  onSuccess: (user: AuthUser, token: string) => void;
}

export default function AuthModal({
  isOpen,
  initialMode = "login",
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = mode === "signup" ? "/api/v1/auth/signup" : "/api/v1/auth/login";
      const payload =
        mode === "signup"
          ? { email, password, full_name: fullName }
          : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Authentication request failed.");
      }

      // Save session in localStorage
      localStorage.setItem("dc_user", JSON.stringify(data.user));
      localStorage.setItem("dc_token", data.token);

      onSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleDemo = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await loginWithGoogle();
      onSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0C1421]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#141F30] border border-[#283548] rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl shadow-black/80 relative text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          id="auth-close-btn"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#9BAABC] hover:text-[#F5F7FA] p-1.5 rounded-lg hover:bg-[#0C1421] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#35C987]/15 border border-[#35C987]/30 text-[10px] font-bold text-[#35C987] uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" />
            <span>Secure Access</span>
          </div>
          <h2 className="text-xl font-black text-[#F5F7FA]">
            {mode === "login" ? "Log In to DC Scanner" : "Create your DC Scanner Account"}
          </h2>
          <p className="text-xs text-[#9BAABC]">
            {mode === "login"
              ? "Access persistent inspection dossiers, export reports, and generate API keys."
              : "Start scanning documents, inspecting active scripts, and managing portfolios."}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 rounded-xl bg-[#0C1421] border border-[#283548]">
          <button
            type="button"
            id="auth-tab-login"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              mode === "login"
                ? "bg-[#141F30] text-[#35C987] shadow-sm"
                : "text-[#9BAABC] hover:text-[#F5F7FA]"
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            id="auth-tab-signup"
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              mode === "signup"
                ? "bg-[#141F30] text-[#35C987] shadow-sm"
                : "text-[#9BAABC] hover:text-[#F5F7FA]"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Quick Sign-In */}
        <button
          type="button"
          id="auth-google-btn"
          onClick={handleGoogleDemo}
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-[#0C1421] hover:bg-[#1A273D] border border-[#283548] text-xs font-semibold text-[#F5F7FA] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#283548] w-full" />
          <span className="bg-[#141F30] px-3 text-[#64748B] text-[10px] uppercase font-bold tracking-wider absolute">
            or with email
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#9BAABC] block uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
                <input
                  type="text"
                  id="auth-fullname-input"
                  required
                  placeholder="e.g. Ankit Singh"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0C1421] border border-[#283548] text-xs text-[#F5F7FA] placeholder-[#64748B] focus:outline-none focus:border-[#35C987]"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#9BAABC] block uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
              <input
                type="email"
                id="auth-email-input"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0C1421] border border-[#283548] text-xs text-[#F5F7FA] placeholder-[#64748B] focus:outline-none focus:border-[#35C987]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#9BAABC] block uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
              <input
                type="password"
                id="auth-password-input"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0C1421] border border-[#283548] text-xs text-[#F5F7FA] placeholder-[#64748B] focus:outline-none focus:border-[#35C987]"
              />
            </div>
          </div>

          <button
            type="submit"
            id="auth-submit-btn"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#35C987] hover:bg-[#2EB377] text-[#0C1421] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#35C987]/20 active:scale-95 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            <span>{mode === "login" ? "Sign In to Account" : "Create Free Account"}</span>
          </button>
        </form>

        {/* Footer info */}
        <p className="text-[10px] text-center text-[#64748B] pt-1">
          By continuing, you agree to DC Scanner&apos;s Terms of Service and Zero-Retention Privacy Policy.
        </p>
      </div>
    </div>
  );
}
