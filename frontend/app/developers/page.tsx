"use client";

import React, { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import {
  Terminal,
  Key,
  Copy,
  Check,
  Plus,
  Trash2,
  Code2,
  FileCode,
  Shield,
  ExternalLink,
  RefreshCw,
  Bot,
  Server,
  Building2,
  Monitor,
  ArrowRight,
  Sparkles,
  Cpu,
} from "lucide-react";
import { ApiKeyItem } from "@/types";

export default function DevelopersPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [keyName, setKeyName] = useState("");
  const [newKeyToken, setNewKeyToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSnippet, setActiveSnippet] = useState<"curl" | "python" | "node">("curl");
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [desktopEmail, setDesktopEmail] = useState("");
  const [desktopJoined, setDesktopJoined] = useState(false);
  const [copiedMcp, setCopiedMcp] = useState(false);

  const fetchKeys = async () => {
    try {
      const res = await fetch("/api/v1/keys");
      if (res.ok) {
        const data = await res.json();
        setKeys(data);
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const [genError, setGenError] = useState<string | null>(null);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;
    setGenError(null);

    try {
      const res = await fetch("/api/v1/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: keyName.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setNewKeyToken(data.api_key);
        setKeyName("");
        fetchKeys();
      } else {
        setGenError("Failed to generate API key.");
      }
    } catch {
      setGenError("Network error while generating API key.");
    }
  };

  const [keyToRevoke, setKeyToRevoke] = useState<{ id: string; name: string } | null>(null);
  const [revoking, setRevoking] = useState(false);

  const executeRevokeKey = async (keyId: string) => {
    setRevoking(true);
    try {
      const res = await fetch(`/api/v1/keys/${keyId}`, { method: "DELETE" });
      if (res.ok) {
        setKeys((prev) => prev.filter((k) => k.key_id !== keyId));
        setKeyToRevoke(null);
      }
    } catch {
      setKeyToRevoke(null);
    } finally {
      setRevoking(false);
    }
  };

  const copyToClipboard = (text: string, isSnippet = false) => {
    navigator.clipboard.writeText(text);
    if (isSnippet) {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const snippets = {
    curl: `curl -X POST https://api.dcscanner.io/api/v1/scans \\
  -H "Authorization: Bearer dcs_live_your_api_key_here" \\
  -F "file=@invoice.pdf" \\
  -F "profile=standard"`,
    python: `import httpx

API_KEY = "dcs_live_your_api_key_here"
BASE_URL = "https://api.dcscanner.io/api/v1"

with open("sample.pdf", "rb") as f:
    response = httpx.post(
        f"{BASE_URL}/scans",
        headers={"Authorization": f"Bearer {API_KEY}"},
        files={"file": ("sample.pdf", f, "application/pdf")},
        data={"profile": "standard"}
    )
scan_id = response.json()["scan_id"]
print(f"Scan initiated: {scan_id}")

# Retrieve results
report = httpx.get(f"{BASE_URL}/scans/{scan_id}").json()
print("Risk Level:", report["risk"]["risk_level"])`,
    node: `import fs from "fs";
import FormData from "form-data";
import axios from "axios";

const form = new FormData();
form.append("file", fs.createReadStream("document.pdf"));
form.append("profile", "standard");

const res = await axios.post("https://api.dcscanner.io/api/v1/scans", form, {
  headers: {
    ...form.getHeaders(),
    Authorization: "Bearer dcs_live_your_api_key_here",
  },
});

console.log("Scan Queued:", res.data.scan_id);`,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0C1421] text-[#F5F7FA]">
      <AppHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        {/* Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#35C987]/10 border border-[#35C987]/30 text-xs font-semibold text-[#35C987]">
            <Terminal className="w-3.5 h-3.5" />
            <span>Developer Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F7FA]">
            Developer API & Integration Guide
          </h1>
          <p className="text-sm text-[#9BAABC] max-w-2xl leading-relaxed">
            Programmatically ingest untrusted PDF documents, audit structural catalogs, and receive instant forensic threat verdicts in your security pipelines.
          </p>
        </div>

        {/* API KEY MANAGEMENT SECTION */}
        <section id="keys" className="space-y-6">
          <div className="border-b border-[#283548] pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2">
                <Key className="w-5 h-5 text-[#35C987]" /> API Key Management
              </h2>
              <p className="text-xs text-[#9BAABC] mt-0.5">
                Generate secret tokens for backend daemons, CI/CD pipelines, and automated scanners.
              </p>
            </div>
          </div>

          {/* New Key Form */}
          <form onSubmit={handleCreateKey} className="cyber-card p-4 bg-[#141F30] border border-[#283548] rounded-xl flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="Key Name (e.g. Production Ingestion Pipeline)"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              className="flex-1 w-full px-3.5 py-2 rounded-lg bg-[#0C1421] border border-[#283548] text-xs text-[#F5F7FA] placeholder-[#64748B] focus:outline-none focus:border-[#35C987]"
            />
            <button
              type="submit"
              disabled={!keyName.trim()}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#35C987] hover:bg-[#2EB377] text-[#0C1421] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Create API Key</span>
            </button>
          </form>

          {/* Modal / Banner for newly generated key */}
          {newKeyToken && (
            <div className="p-4 rounded-xl bg-[#35C987]/10 border border-[#35C987]/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#35C987]">
                  API Key Created Successfully (Copy now — it will not be displayed again):
                </span>
                <button
                  type="button"
                  onClick={() => setNewKeyToken(null)}
                  className="text-xs text-[#9BAABC] hover:text-[#F5F7FA]"
                >
                  Dismiss
                </button>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded bg-[#0C1421] border border-[#1E293B] font-mono text-xs text-[#F5F7FA]">
                <span className="truncate pr-4">{newKeyToken}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(newKeyToken)}
                  className="flex items-center gap-1 text-[#35C987] hover:underline shrink-0 text-[11px] font-sans font-semibold"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey ? "Copied" : "Copy Key"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Active Keys Table */}
          <div className="cyber-card bg-[#141F30] border border-[#283548] rounded-xl overflow-hidden text-xs">
            {loading ? (
              <div className="p-8 text-center text-[#9BAABC] flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#35C987]" />
                <span>Loading active API keys...</span>
              </div>
            ) : keys.length === 0 ? (
              <div className="p-8 text-center text-[#9BAABC]">
                No active API keys found. Create a key above to start integrating.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-[#0C1421] text-[#9BAABC] uppercase font-semibold border-b border-[#283548]">
                  <tr>
                    <th className="p-3">Key Name</th>
                    <th className="p-3">Token Prefix</th>
                    <th className="p-3">Created</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#283548]">
                  {keys.map((k) => (
                    <tr key={k.key_id} className="hover:bg-[#1A273C] transition-colors">
                      <td className="p-3 font-semibold text-[#F5F7FA]">{k.name}</td>
                      <td className="p-3 font-mono text-[#35C987]">{k.prefix}</td>
                      <td className="p-3 text-[#9BAABC]">
                        {new Date(k.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          id={`revoke-key-btn-${k.key_id}`}
                          onClick={() => setKeyToRevoke({ id: k.key_id, name: k.name })}
                          className="px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-semibold cursor-pointer"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* CODE INTEGRATION SNIPPETS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#35C987]" /> Quickstart Code Examples
            </h2>
            <div className="flex items-center gap-1 bg-[#141F30] p-1 rounded-lg border border-[#283548] text-xs">
              {(["curl", "python", "node"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveSnippet(tab)}
                  className={`px-3 py-1 rounded-md uppercase font-semibold transition-colors ${
                    activeSnippet === tab
                      ? "bg-[#35C987] text-[#0C1421]"
                      : "text-[#9BAABC] hover:text-[#F5F7FA]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="cyber-card rounded-xl overflow-hidden bg-[#0C1421] border border-[#283548] relative">
            <div className="flex items-center justify-between px-4 py-2 bg-[#141F30] border-b border-[#283548] text-xs">
              <span className="font-mono text-[#9BAABC] text-[11px]">
                {activeSnippet === "curl" ? "Terminal Shell" : activeSnippet === "python" ? "python_scanner.py" : "scanner.ts"}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(snippets[activeSnippet], true)}
                className="flex items-center gap-1 text-[11px] text-[#35C987] hover:underline font-semibold"
              >
                {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet ? "Copied" : "Copy Code"}</span>
              </button>
            </div>
            <pre className="p-4 font-mono text-xs text-[#F5F7FA] overflow-x-auto leading-relaxed">
              {snippets[activeSnippet]}
            </pre>
          </div>
        </section>

        {/* REST API ENDPOINTS SPEC */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#F5F7FA]">REST API Endpoints</h2>
          <div className="cyber-card bg-[#141F30] border border-[#283548] rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#0C1421] text-[#9BAABC] uppercase font-semibold border-b border-[#283548]">
                <tr>
                  <th className="p-3">Method</th>
                  <th className="p-3">Endpoint</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Authentication</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#283548] font-mono">
                <tr className="hover:bg-[#1A273C]">
                  <td className="p-3 font-bold text-[#35C987]">POST</td>
                  <td className="p-3 text-[#F5F7FA]">/api/v1/scans</td>
                  <td className="p-3 font-sans text-[#9BAABC]">Upload & queue document for asynchronous analysis</td>
                  <td className="p-3 font-sans text-[#F5F7FA]">Optional / API Key</td>
                </tr>
                <tr className="hover:bg-[#1A273C]">
                  <td className="p-3 font-bold text-blue-400">GET</td>
                  <td className="p-3 text-[#F5F7FA]">/api/v1/scans</td>
                  <td className="p-3 font-sans text-[#9BAABC]">List scan history with pagination and search</td>
                  <td className="p-3 font-sans text-[#F5F7FA]">Public / Session</td>
                </tr>
                <tr className="hover:bg-[#1A273C]">
                  <td className="p-3 font-bold text-blue-400">GET</td>
                  <td className="p-3 text-[#F5F7FA]">/api/v1/scans/&#123;scan_id&#125;</td>
                  <td className="p-3 font-sans text-[#9BAABC]">Retrieve live scan status, risk verdict, and findings</td>
                  <td className="p-3 font-sans text-[#F5F7FA]">Public / Session</td>
                </tr>
                <tr className="hover:bg-[#1A273C]">
                  <td className="p-3 font-bold text-blue-400">GET</td>
                  <td className="p-3 text-[#F5F7FA]">/api/v1/scans/&#123;scan_id&#125;/report</td>
                  <td className="p-3 font-sans text-[#9BAABC]">Export full JSON dossier or printable HTML format</td>
                  <td className="p-3 font-sans text-[#F5F7FA]">Public / Session</td>
                </tr>
                <tr className="hover:bg-[#1A273C]">
                  <td className="p-3 font-bold text-red-400">DELETE</td>
                  <td className="p-3 text-[#F5F7FA]">/api/v1/scans/&#123;scan_id&#125;</td>
                  <td className="p-3 font-sans text-[#9BAABC]">Permanently purge scan record and stored files</td>
                  <td className="p-3 font-sans text-[#F5F7FA]">Session / Owner</td>
                </tr>
                <tr className="hover:bg-[#1A273C]">
                  <td className="p-3 font-bold text-blue-400">GET</td>
                  <td className="p-3 text-[#F5F7FA]">/api/v1/health</td>
                  <td className="p-3 font-sans text-[#9BAABC]">Engine health, uptime, and library versions</td>
                  <td className="p-3 font-sans text-[#35C987]">None (Public)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 1. MCP SERVER SPECIFICATION */}
        <section id="mcp" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-[#35C987]" />
            <h2 className="text-lg font-bold text-[#F5F7FA]">
              Model Context Protocol (MCP) Server
            </h2>
          </div>
          <p className="text-xs text-[#9BAABC] leading-relaxed">
            Equip Claude Desktop, Cursor, Antigravity, and Cline with direct PDF intelligence. The DC Scanner MCP Server provides LLM agents with tools to inspect metadata, disassemble object trees, and verify signatures without executing code.
          </p>
          <div className="cyber-card p-5 rounded-xl bg-[#0C1421] border border-[#283548] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#9BAABC] border-b border-[#283548] pb-2">
              <span>claude_desktop_config.json</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`{\n  "mcpServers": {\n    "dc-scanner": {\n      "command": "npx",\n      "args": ["-y", "@dcscanner/mcp-server"],\n      "env": {\n        "DCSCANNER_API_KEY": "dcs_live_your_api_key_here"\n      }\n    }\n  }\n}`);
                  setCopiedMcp(true);
                  setTimeout(() => setCopiedMcp(false), 2000);
                }}
                className="text-[#35C987] hover:underline flex items-center gap-1 font-semibold"
              >
                {copiedMcp ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMcp ? "Copied" : "Copy Config"}</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-[#D8E1EC] overflow-x-auto leading-relaxed">
{`{
  "mcpServers": {
    "dc-scanner": {
      "command": "npx",
      "args": ["-y", "@dcscanner/mcp-server"],
      "env": {
        "DCSCANNER_API_KEY": "dcs_live_your_api_key_here"
      }
    }
  }
}`}
            </pre>
          </div>
        </section>

        {/* 2. AI AGENTS TOOLKIT */}
        <section id="agents" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-[#F5F7FA]">
              Autonomous AI Agents Integration
            </h2>
          </div>
          <p className="text-xs text-[#9BAABC] leading-relaxed">
            Protect autonomous LangChain and LlamaIndex agents from processing adversarial PDF payloads, SSRF prompts, and malicious AcroForm injection.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[#141F30] border border-[#283548] space-y-2">
              <span className="font-bold text-xs text-[#F5F7FA] block">Pre-Retrieval Guardrail</span>
              <p className="text-xs text-[#9BAABC] leading-relaxed">
                Filter documents before indexing into vector databases. DC Scanner automatically flags embedded macros and untrusted external URIs.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-[#141F30] border border-[#283548] space-y-2">
              <span className="font-bold text-xs text-[#F5F7FA] block">Zero-Execution Text Extraction</span>
              <p className="text-xs text-[#9BAABC] leading-relaxed">
                Extract sanitized text streams directly into agent context windows without triggering potential host exploits.
              </p>
            </div>
          </div>
        </section>

        {/* 3. WHITE LABEL & ENTERPRISE */}
        <section id="whitelabel" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-[#F5F7FA]">
              White Label & On-Premise Enterprise Solutions
            </h2>
          </div>
          <p className="text-xs text-[#9BAABC] leading-relaxed">
            Deploy DC Scanner within air-gapped sovereign clouds or private AWS, Azure, and GCP clusters with custom compliance rules and branded portals.
          </p>
          <div className="p-6 rounded-2xl bg-[#141F30] border border-[#283548] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="font-bold text-sm text-[#F5F7FA] block">Custom Domain & Compliance SLAs</span>
              <p className="text-xs text-[#9BAABC] leading-relaxed">
                Includes dedicated single-tenant Docker containers, SAML SSO integration, custom security policies, and 99.99% uptime guarantees.
              </p>
            </div>
            <a
              href="mailto:enterprise@dcscanner.io"
              className="px-5 py-2.5 rounded-xl bg-[#35C987] hover:bg-[#2EB377] text-[#0C1421] font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all shadow-md shadow-[#35C987]/20"
            >
              Contact Enterprise Team
            </a>
          </div>
        </section>

        {/* 4. DESKTOP APP WAITLIST */}
        <section id="desktop" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-[#F5F7FA]">
              DC Scanner Desktop (macOS, Windows, Linux)
            </h2>
          </div>
          <p className="text-xs text-[#9BAABC] leading-relaxed">
            Offline native client for air-gapped forensic laboratories and incident response teams. Powered by local PyMuPDF acceleration with zero cloud telemetry.
          </p>
          <div className="cyber-card p-6 rounded-2xl bg-[#141F30] border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <span className="font-bold text-xs text-[#F5F7FA] block">Join the Early Access Desktop Waitlist</span>
              <p className="text-[11px] text-[#9BAABC]">Get invited to the private macOS DMG and Windows binary beta release.</p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!desktopEmail.trim()) return;
                setDesktopJoined(true);
                setDesktopEmail("");
                setTimeout(() => setDesktopJoined(false), 4000);
              }}
              className="flex items-center gap-2 w-full md:w-auto"
            >
              <input
                type="email"
                required
                value={desktopEmail}
                onChange={(e) => setDesktopEmail(e.target.value)}
                placeholder="analyst@soc.mil"
                className="px-3.5 py-2 rounded-xl bg-[#0C1421] border border-[#283548] text-xs text-[#F5F7FA] placeholder-[#9BAABC]/50 focus:outline-none focus:border-[#35C987] w-full md:w-64"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer shadow-md shadow-amber-500/20"
              >
                Join Waitlist
              </button>
            </form>
          </div>
          {desktopJoined && (
            <div className="p-3 rounded-xl bg-[#35C987]/15 border border-[#35C987]/40 text-[#35C987] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>You have been added to the priority desktop waitlist! Invitation token dispatched.</span>
            </div>
          )}
        </section>

        {/* REVOKE KEY CONFIRMATION MODAL */}
        {keyToRevoke && (
          <div className="fixed inset-0 z-50 bg-[#0C1421]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="cyber-card p-6 rounded-2xl bg-[#141F30] border border-red-500/30 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-red-400">
                <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/30">
                  <Trash2 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#F5F7FA]">Revoke API Key</h3>
              </div>
              <p className="text-xs text-[#9BAABC] leading-relaxed">
                Are you sure you want to revoke key <strong className="text-[#F5F7FA] font-mono">{keyToRevoke.name}</strong>? Any script or service using this key will immediately lose access.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  id="cancel-revoke-btn"
                  onClick={() => setKeyToRevoke(null)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#0C1421] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="confirm-revoke-key-btn"
                  disabled={revoking}
                  onClick={() => executeRevokeKey(keyToRevoke.id)}
                  className="px-4 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {revoking ? "Revoking..." : "Revoke Key"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <AppFooter />
    </div>
  );
}
