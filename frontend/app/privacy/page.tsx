"use client";

import React, { useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import {
  Shield,
  Lock,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Server,
  Cpu,
  Globe,
  Clock,
  Trash2,
  Eye,
  Key,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Mail,
  Building,
  Check,
  Search,
  BookOpen,
  Scale,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const [copiedContact, setCopiedContact] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedContact(true);
    setTimeout(() => setCopiedContact(false), 2500);
  };

  const sections = [
    { id: "overview", label: "1. Overview & Data Controller" },
    { id: "data-collected", label: "2. Data We Collect & Architecture" },
    { id: "legal-basis", label: "3. Legal Basis (DPDP Act & GDPR)" },
    { id: "how-we-use", label: "4. How We Use Your Data" },
    { id: "retention", label: "5. Data Retention & Purge Schedules" },
    { id: "your-rights", label: "6. Your Privacy Rights" },
    { id: "cookies", label: "7. Cookies & Local Storage" },
    { id: "security", label: "8. Forensic Data Security" },
    { id: "third-parties", label: "9. Subprocessors & Services" },
    { id: "transfers", label: "10. Cross-Border Data Transfers" },
    { id: "children", label: "11. Minors & Children's Privacy" },
    { id: "changes", label: "12. Policy Changes" },
    { id: "contact", label: "13. Grievance & Privacy Contact" },
  ];

  return (
    <div className="min-h-screen bg-[#070D18] text-[#F5F7FA] flex flex-col font-sans selection:bg-[#35C987]/20 selection:text-[#35C987]">
      <AppHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* HERO BANNER */}
        <section className="space-y-4 border-b border-[#1E293B] pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Legal & Compliance Charter
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#141F30] text-[#9BAABC] border border-[#283548]">
              v2.4 • Effective October 25, 2026
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#141F30] text-[#CBD5E1] border border-[#283548] flex items-center gap-1">
              <Globe className="w-3 h-3 text-[#35C987]" />
              India DPDP Act 2023 & EU GDPR Aligned
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F7FA]">
            Privacy Policy & Forensic Data Protection Charter
          </h1>

          <p className="text-sm sm:text-base text-[#9BAABC] leading-relaxed max-w-3xl">
            DC Scanner is engineered around a deterministic Zero-Retention architecture.
            We audit, validate, and extract PDF security heuristics in volatile memory without
            executing untrusted scripts or retaining confidential document bodies.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-[#0C1421] border border-[#283548] space-y-1">
              <span className="text-[#64748B] block font-mono text-[10px] uppercase">Data Fiduciary / Controller</span>
              <strong className="text-[#F5F7FA] block text-xs">DC Scanner Technologies India Pvt. Ltd.</strong>
              <span className="text-[#9BAABC] text-[11px]">Bengaluru, Karnataka, India</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0C1421] border border-[#283548] space-y-1">
              <span className="text-[#64748B] block font-mono text-[10px] uppercase">Corporate Identity No (CIN)</span>
              <strong className="text-[#35C987] font-mono block text-xs">U72900KA2024PTC184920</strong>
              <span className="text-[#9BAABC] text-[11px]">Ministry of Corporate Affairs, India</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0C1421] border border-[#283548] space-y-1">
              <span className="text-[#64748B] block font-mono text-[10px] uppercase">Grievance Redressal</span>
              <strong className="text-[#F5F7FA] block text-xs">grievance@dcscanner.io</strong>
              <span className="text-[#9BAABC] text-[11px]">Designated Officer (IT Rules & DPDP)</span>
            </div>
          </div>
        </section>

        {/* TWO-COLUMN LAYOUT: QUICK NAV & CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* STICKY QUICK NAV */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24 space-y-4 p-4 rounded-2xl bg-[#0C1421] border border-[#1E293B]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9BAABC]">
                <BookOpen className="w-3.5 h-3.5 text-[#35C987]" />
                <span>Policy Navigation</span>
              </div>
              <nav className="space-y-1 text-xs">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block px-2.5 py-1.5 rounded-lg text-[#9BAABC] hover:text-[#35C987] hover:bg-[#141F30] transition-colors truncate"
                  >
                    {s.label}
                  </a>
                ))}
              </nav>

              <div className="pt-2 border-t border-[#1E293B] space-y-2">
                <span className="text-[11px] text-[#64748B] block">Need compliance help?</span>
                <button
                  type="button"
                  onClick={() => handleCopyEmail("privacy@dcscanner.io")}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#141F30] hover:bg-[#1A273D] border border-[#283548] text-xs font-semibold text-[#35C987] transition-all"
                >
                  {copiedContact ? <Check className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                  <span>{copiedContact ? "Email Copied!" : "privacy@dcscanner.io"}</span>
                </button>
              </div>
            </div>
          </aside>

          {/* MAIN DOCUMENT BODY */}
          <div className="lg:col-span-3 space-y-10 text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
            {/* 1. OVERVIEW */}
            <section id="overview" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Building className="w-5 h-5 text-[#35C987]" /> 1. Overview & Data Fiduciary Details
              </h2>
              <p>
                <strong>DC Scanner</strong> (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is developed, owned, and operated by{" "}
                <strong className="text-[#F5F7FA]">DC Scanner Technologies India Private Limited</strong>, an Indian technology enterprise incorporated under the Companies Act, 2013 (Company Identification Number: <span className="font-mono text-[#35C987]">U72900KA2024PTC184920</span>, with registered corporate offices situated at DC Tech Hub, 4th Floor, Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103, India).
              </p>
              <p>
                Under the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act, India)</strong>, DC Scanner functions as a <em>Data Fiduciary</em>. For international data subjects governed by the <strong>General Data Protection Regulation (EU GDPR / UK GDPR)</strong>, DC Scanner operates as the designated <em>Data Controller</em>.
              </p>
              <p>
                This Privacy Policy establishes our commitments governing the collection, ephemeral parsing, algorithmic verification, retention, and deletion of data across the <strong>dcscanner.io</strong> web ecosystem, the DC Scanner Developer REST API, the Model Context Protocol (MCP) server integration, our Chrome browser extension, and forthcoming air-gapped desktop client builds.
              </p>
            </section>

            {/* 2. DATA WE COLLECT */}
            <section id="data-collected" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Server className="w-5 h-5 text-[#35C987]" /> 2. Data We Collect & Forensic Processing Architecture
              </h2>

              <div className="space-y-3">
                <h3 className="font-bold text-sm text-[#F5F7FA] text-[#35C987]">2.1 Request-Only PDF Forensic Analysis (Zero-Retention Ephemeral Memory)</h3>
                <p>
                  Our primary security analyzers—including the <em>PDF Metadata Checker</em>, <em>Specification Validator</em>, <em>AI Detection Tool</em>, <em>Signature & PKCS#7 Checker</em>, <em>Accessibility Inspector</em>, and <em>Font Stream Verifier</em>—operate in strictly request-scoped volatile memory buffers on our hardened servers.
                </p>
                <div className="p-3.5 rounded-xl bg-[#0C1421] border border-[#283548] space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-[#9BAABC]">
                    <span>Original Document Persistent Storage:</span>
                    <span className="text-[#35C987] font-bold">DISABLED (RAM Buffer Only)</span>
                  </div>
                  <div className="flex items-center justify-between text-[#9BAABC]">
                    <span>JavaScript Execution Sandbox:</span>
                    <span className="text-[#35C987] font-bold">ZERO-EXECUTION AST PARSING</span>
                  </div>
                  <div className="flex items-center justify-between text-[#9BAABC]">
                    <span>Post-Analysis Buffer Wipe:</span>
                    <span className="text-[#35C987] font-bold">IMMEDIATE UPON HTTP DISPATCH</span>
                  </div>
                </div>
                <p>
                  At no point is your raw uploaded PDF copied into permanent object stores. Once feature extraction completes and results are transmitted to your browser session, volatile memory buffers are overwritten.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-sm text-[#F5F7FA] text-[#35C987]">2.1a In-Browser Local PDF Editor & Annotator (Zero Server Transmission)</h3>
                <p>
                  Client-side utility workflows (such as our in-browser PDF Editor, form annotator, and local page view rendering) run entirely inside your web browser’s local client runtime.
                </p>
                <p>
                  Your browser utilizes its private <code>IndexedDB</code> sandbox (<code>dcscanner_editor_store</code>) to maintain draft edits and undo histories locally. Raw document bytes and interactive annotations are never transmitted to our backend infrastructure. These local device records are wiped automatically after 7 days without modification, or immediately when you trigger in-app document purging or clear browser cache.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-sm text-[#F5F7FA] text-[#35C987]">2.2 Short-Lived Transformation & Optimization Workflows</h3>
                <p>
                  Tools that compile or alter document byte streams (such as <em>Merge PDF</em>, <em>Split PDF Pages</em>, <em>Compress PDF</em>, <em>Metadata Editor/Remover</em>, and <em>PDF to Markdown</em>) require transient disk buffers to build the target binary.
                </p>
                <p>
                  These working copies are assigned non-sequential, cryptographically random UUIDs on encrypted filesystem mounts. Standard workflows remove inputs as soon as the deliverable artifact is assembled. A continuous cron cleanup worker forcefully purges any orphaned artifacts or interrupted session streams older than <strong>24 hours</strong>.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-sm text-[#F5F7FA] text-[#35C987]">2.3 AI PDF Chat & Semantic Clause Extraction</h3>
                <p>
                  When you explicitly utilize the AI PDF Chat (Beta) tool, extracted plaintext chunks, questions, and model answers are held in private ephemeral session memory to support multi-turn dialogue.
                </p>
                <p>
                  Inference is conducted via enterprise zero-data-retention API endpoints (OpenAI Enterprise / DeepSeek fallback). By contract, customer document vectors and prompts are <strong>never used to train, fine-tune, or improve public AI models</strong>. Deleting your conversation or clicking &quot;Purge Session&quot; permanently flushes all vector context.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-sm text-[#F5F7FA] text-[#35C987]">2.4 Conditional Threat Intelligence & Hash Reputation Scanning</h3>
                <p>
                  To detect weaponized exploits and known malicious campaigns, DC Scanner calculates cryptographic hashes (<span className="font-mono text-[#35C987]">SHA-256</span>, <span className="font-mono text-[#35C987]">MD5</span>, <span className="font-mono text-[#35C987]">SHA-1</span>).
                </p>
                <p>
                  When external reputation checking is enabled, only the mathematical SHA-256 hash string is queried against VirusTotal or threat telemetry feeds. Your original PDF document is <strong>never uploaded to external malware repositories</strong> without explicit, double-confirmed user opt-in.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-sm text-[#F5F7FA] text-[#35C987]">2.5 Stored Forensic Analysis Results & Dossier Records</h3>
                <p>
                  To enable post-scan review and compliance audits, DC Scanner stores structured technical findings (separate from the PDF file itself). Stored records may include:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-[#9BAABC]">
                  <li>Original filename and byte size</li>
                  <li>Cryptographic file hashes (SHA-256, SHA-1, MD5) for duplicate deduplication</li>
                  <li>Extracted PDF metadata dictionary entries (Producer, Title, Creation/Modification timestamps, PDF Version, Page Count, Trailer ID)</li>
                  <li>Automated security verdicts, anomaly classifications, and risk score breakdowns</li>
                  <li>High-entropy cryptographic share tokens (e.g., <code>/scans/13841314-7585-480e...</code>)</li>
                </ul>
                <p className="text-xs">
                  Guest analysis records are deleted automatically after <strong>90 days</strong>. Registered account holders retain dossiers until they manually execute the in-app &quot;Purge Report&quot; action or delete their account.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-sm text-[#F5F7FA] text-[#35C987]">2.6 Guest Sessions & Rate-Limiting Telemetry</h3>
                <p>
                  Guest users require no account creation. To prevent DDoS attacks, credential stuffing, and abuse of computational infrastructure, we assign a pseudonymous session identifier cookie (<code>dcscanner_session</code>) and log a cryptographically salted one-way hash of your IP address. We record coarse diagnostic telemetry (country code, browser/OS user-agent, daily scan volume counters) strictly for security operations.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-sm text-[#F5F7FA] text-[#35C987]">2.7 Registered Enterprise & Individual Accounts</h3>
                <p>
                  For users registering an account, we collect: full name, corporate email address, salted bcrypt-hashed password, account creation timestamp, generated API access keys (<code>dcs_live_*</code>), and linked scan records.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-sm text-[#F5F7FA] text-[#35C987]">2.8 DC Scanner Chrome Browser Extension</h3>
                <p>
                  The DC Scanner Chrome Extension adheres strictly to Google Chrome Web Store User Data Policy (including Limited Use criteria). It stores your optional API token and a local cache of recent inspection references on your device using <code>chrome.storage.local</code>. It does not record general web browsing history and activates only when you choose &quot;Inspect PDF with DC Scanner&quot;.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-sm text-[#F5F7FA] text-[#35C987]">2.9 Developer API & Model Context Protocol (MCP) Server</h3>
                <p>
                  API interactions are authenticated via Bearer tokens. We record endpoint invocation metrics, rate-limit counters, and HTTP status codes to enforce service tier quotas. API and MCP uploads adhere to identical ephemeral zero-retention lifecycles as our web platform.
                </p>
              </div>
            </section>

            {/* 3. LEGAL BASIS */}
            <section id="legal-basis" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Lock className="w-5 h-5 text-[#35C987]" /> 3. Legal Grounds for Processing (DPDP Act & GDPR)
              </h2>
              <p>
                We process personal and telemetry data under clear statutory grounds established by India’s Digital Personal Data Protection Act, 2023 (DPDP Act) and the EU General Data Protection Regulation (GDPR):
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-[#283548] rounded-xl overflow-hidden">
                  <thead className="bg-[#141F30] text-[#F5F7FA] font-bold">
                    <tr>
                      <th className="p-3 border-b border-[#283548]">Processing Activity</th>
                      <th className="p-3 border-b border-[#283548]">India DPDP Act 2023 Basis</th>
                      <th className="p-3 border-b border-[#283548]">EU GDPR Basis (Art. 6)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B] text-[#9BAABC]">
                    <tr>
                      <td className="p-3 font-semibold text-[#CBD5E1]">Analyzing uploaded PDF & generating security dossier</td>
                      <td className="p-3">Section 4(1)(a) — Performance of requested digital service</td>
                      <td className="p-3">Art. 6(1)(b) — Contractual necessity</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#CBD5E1]">DDoS protection & daily quota enforcement via hashed IP</td>
                      <td className="p-3">Section 7(b) — Legitimate use / Prevention of network fraud</td>
                      <td className="p-3">Art. 6(1)(f) — Legitimate interest (security)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#CBD5E1]">Registered account management & credentials</td>
                      <td className="p-3">Section 4(1)(a) — Account contract execution</td>
                      <td className="p-3">Art. 6(1)(b) — Contractual necessity</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#CBD5E1]">API token generation & rate limit logging</td>
                      <td className="p-3">Section 7(b) — Service delivery & authorization</td>
                      <td className="p-3">Art. 6(1)(b) — Contractual performance</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#CBD5E1]">Essential functional session cookies & dark mode state</td>
                      <td className="p-3">Section 7(b) — Legitimate use for UI delivery</td>
                      <td className="p-3">Art. 6(1)(f) — Legitimate interest (functional)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 4. HOW WE USE YOUR DATA */}
            <section id="how-we-use" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <CheckCircle2 className="w-5 h-5 text-[#35C987]" /> 4. How We Use Your Data & Strict Non-Monetization
              </h2>
              <p>We process collected data solely to:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#9BAABC]">
                <li>Deliver real-time structural, cryptographic, and malicious heuristic inspection results.</li>
                <li>Generate and host tokenized, shareable forensic report URLs authorized by you.</li>
                <li>Preserve authenticated scan history for enterprise account compliance records.</li>
                <li>Maintain network security, prevent automated web scraper abuse, and enforce tier quotas.</li>
                <li>Dispatch transactional security alerts (e.g., API key provisioning, password resets).</li>
              </ul>
              <div className="p-4 rounded-xl bg-[#0C1421] border border-[#35C987]/30 space-y-2">
                <span className="font-bold text-[#35C987] flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> Core Non-Monetization Guarantee:
                </span>
                <p className="text-xs text-[#CBD5E1]">
                  DC Scanner <strong>DOES NOT sell, rent, broker, or trade</strong> your personal information, uploaded documents, or extracted forensic results. We <strong>DOES NOT</strong> use customer files to train machine learning models or display targeted third-party advertising.
                </p>
              </div>
            </section>

            {/* 5. DATA RETENTION */}
            <section id="retention" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Clock className="w-5 h-5 text-[#35C987]" /> 5. Data Retention & Automated Purge Schedules
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-[#283548] rounded-xl overflow-hidden">
                  <thead className="bg-[#141F30] text-[#F5F7FA] font-bold">
                    <tr>
                      <th className="p-3 border-b border-[#283548]">Data Category</th>
                      <th className="p-3 border-b border-[#283548]">Retention Period</th>
                      <th className="p-3 border-b border-[#283548]">Purge Mechanism</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B] text-[#9BAABC]">
                    <tr>
                      <td className="p-3 font-semibold text-[#CBD5E1]">Request-only PDF analysis upload</td>
                      <td className="p-3 text-[#35C987] font-semibold">Immediate / In-Memory only</td>
                      <td className="p-3">Volatile RAM cleared upon HTTP response</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#CBD5E1]">Temporary transform / output files</td>
                      <td className="p-3">Immediate post-download (max 24 hours)</td>
                      <td className="p-3">Continuous automated filesystem cron purge</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#CBD5E1]">AI PDF Chat vectors & text excerpts</td>
                      <td className="p-3">Duration of active chat session</td>
                      <td className="p-3">Flushed on chat deletion or manual purge</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#CBD5E1]">Guest forensic dossiers & metadata</td>
                      <td className="p-3">90 calendar days</td>
                      <td className="p-3">Automatic retention job deletion</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#CBD5E1]">Registered account scan history</td>
                      <td className="p-3">Until user deletion or account closure</td>
                      <td className="p-3">Instant via in-app &quot;Purge Report&quot; button</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#CBD5E1]">Hashed IP rate-limit counters</td>
                      <td className="p-3">24 hours rolling window</td>
                      <td className="p-3">Daily automated counter reset</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#CBD5E1]">Session authentication cookies</td>
                      <td className="p-3">30 days rolling</td>
                      <td className="p-3">Automatic browser expiration</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 6. YOUR RIGHTS */}
            <section id="your-rights" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Sparkles className="w-5 h-5 text-[#35C987]" /> 6. Your Rights Under India DPDP Act & GDPR
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0C1421] border border-[#283548] space-y-2">
                  <span className="font-bold text-xs text-[#35C987] block">Under India DPDP Act 2023:</span>
                  <ul className="space-y-1.5 text-xs text-[#9BAABC]">
                    <li><strong>Right to Access:</strong> Request a summary of digital personal data being processed and third parties with whom data has been shared.</li>
                    <li><strong>Right to Correction & Erasure:</strong> Rectify inaccurate personal records or request immediate deletion of account records.</li>
                    <li><strong>Right of Grievance Redressal:</strong> Register complaints with our designated Grievance Officer, with escalation rights to the Data Protection Board of India (DPBI).</li>
                    <li><strong>Right to Nominate:</strong> Nominate an individual to exercise data principal rights in the event of death or incapacity.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#0C1421] border border-[#283548] space-y-2">
                  <span className="font-bold text-xs text-cyan-400 block">Under EU / UK GDPR:</span>
                  <ul className="space-y-1.5 text-xs text-[#9BAABC]">
                    <li><strong>Right of Access (Art. 15):</strong> Obtain confirmation and copy of processed personal data.</li>
                    <li><strong>Right to Rectification (Art. 16):</strong> Correct inaccurate personal credentials.</li>
                    <li><strong>Right to Erasure (Art. 17):</strong> Full erasure (&quot;Right to be Forgotten&quot;) via Settings.</li>
                    <li><strong>Right to Data Portability (Art. 20):</strong> Export account dossiers in standard JSON format.</li>
                    <li><strong>Right to Object & Restriction (Arts. 18, 21):</strong> Restrict processing under specific circumstances.</li>
                  </ul>
                </div>
              </div>

              {/* STATUTORY ESCALATION LADDER */}
              <div className="p-4 rounded-xl bg-[#141F30] border border-[#283548] space-y-2 text-xs">
                <span className="font-bold text-[#F5F7FA] block flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-[#35C987]" /> India DPDP Act Grievance Escalation Ladder:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-[#0C1421] border border-[#1E293B] space-y-1">
                    <span className="text-[#35C987] font-bold block text-[11px]">Level 1: Grievance Officer</span>
                    <p className="text-[11px] text-[#9BAABC]">Submit complaint to grievance@dcscanner.io. Acknowledged within 48h; resolved in 30 days.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0C1421] border border-[#1E293B] space-y-1">
                    <span className="text-cyan-400 font-bold block text-[11px]">Level 2: Internal Appellate</span>
                    <p className="text-[11px] text-[#9BAABC]">If unresolved within 30 days, dispute escalates to Chief Legal Officer, Bengaluru.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0C1421] border border-[#1E293B] space-y-1">
                    <span className="text-amber-400 font-bold block text-[11px]">Level 3: DPBI Escalation</span>
                    <p className="text-[11px] text-[#9BAABC]">File statutory complaint directly before the Data Protection Board of India (DPBI).</p>
                  </div>
                </div>
              </div>

              <p className="text-xs">
                To exercise any statutory right, visit your <Link href="/settings" className="text-[#35C987] underline font-semibold">Settings Console</Link> or email our privacy desk at <button type="button" onClick={() => handleCopyEmail("privacy@dcscanner.io")} className="text-[#35C987] underline font-mono">privacy@dcscanner.io</button>. We respond to all verified requests within 30 days.
              </p>
            </section>

            {/* 7. COOKIES & LOCAL STORAGE */}
            <section id="cookies" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Layers className="w-5 h-5 text-[#35C987]" /> 7. Cookies, Browser Storage & Zero-Ad Guarantee
              </h2>
              <p>
                DC Scanner does not deploy third-party advertising cookies or cross-site tracking pixels. We use only strictly necessary session cookies and device-local preferences:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-[#9BAABC]">
                <li><code>dcscanner_session</code>: Links your browser to your guest rate-limit counter (30 days).</li>
                <li><code>dcscanner_auth_token</code>: Authenticates logged-in enterprise accounts.</li>
                <li><code>dcscanner_editor_store</code> (IndexedDB): Holds client-side editor drafts on your device only.</li>
                <li><code>dcscanner_theme</code> (localStorage): Preserves your cybersecurity dark-mode preference.</li>
                <li><code>dcscanner_recent_tools</code> (localStorage): Remembers recently used tools to prioritize your toolbar.</li>
              </ul>
            </section>

            {/* 8. FORENSIC DATA SECURITY */}
            <section id="security" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Shield className="w-5 h-5 text-[#35C987]" /> 8. Forensic Data Security & Encryption Standards
              </h2>
              <p>We implement defense-grade technical and organizational safeguards:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0C1421] border border-[#283548]">
                  <strong className="text-[#F5F7FA] block mb-1">In-Transit Encryption</strong>
                  <span className="text-[#9BAABC]">Enforced TLS 1.3 with ECDHE key exchange, AES-256-GCM cipher suites, and HSTS preloading.</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0C1421] border border-[#283548]">
                  <strong className="text-[#F5F7FA] block mb-1">At-Rest Encryption</strong>
                  <span className="text-[#9BAABC]">Hardware-accelerated AES-256-GCM with PBKDF2/Argon2id key derivation for all worker disk volumes.</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0C1421] border border-[#283548]">
                  <strong className="text-[#F5F7FA] block mb-1">Zero-Execution AST Parsing</strong>
                  <span className="text-[#9BAABC]">PyMuPDF, pikepdf, and pypdf parse binary streams into syntax trees without executing embedded JavaScript or shell triggers.</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0C1421] border border-[#283548]">
                  <strong className="text-[#F5F7FA] block mb-1">Sandboxed Isolation</strong>
                  <span className="text-[#9BAABC]">Containerized worker nodes with non-root security contexts and read-only root filesystems.</span>
                </div>
              </div>
            </section>

            {/* 9. SUBPROCESSORS */}
            <section id="third-parties" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Cpu className="w-5 h-5 text-[#35C987]" /> 9. Third-Party Subprocessors & Service Integrations
              </h2>
              <p>Core parsing executes on our own dedicated server infrastructure. Specific integrations include:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#9BAABC]">
                <li><strong>Cloudflare Inc.:</strong> Bot detection, DDoS mitigation, and edge TLS termination (Turnstile processes IP and browser signals; does not receive uploaded PDF documents).</li>
                <li><strong>OpenAI L.L.C. / DeepSeek:</strong> Zero-retention enterprise API endpoints for opt-in AI PDF Chat and document summary extraction.</li>
                <li><strong>VirusTotal (Google LLC):</strong> Receives file SHA-256 hashes strictly for reputation checks; full binary submission requires separate affirmative user approval.</li>
                <li><strong>Stripe & Razorpay:</strong> PCI-DSS Level 1 payment processors for enterprise billing (DC Scanner does not store credit card numbers).</li>
                <li><strong>Resend Inc.:</strong> Transactional email delivery for account activation and security alerts.</li>
              </ul>
            </section>

            {/* 10. CROSS-BORDER TRANSFERS */}
            <section id="transfers" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Globe className="w-5 h-5 text-[#35C987]" /> 10. International Cross-Border Data Transfers
              </h2>
              <p>
                DC Scanner operates server infrastructure in India, the European Union, and the United States. Cross-border transfers comply with <strong>Section 16 of the India DPDP Act 2023</strong> (transfers permitted to notified sovereign jurisdictions with reciprocal protection) and <strong>Chapter V of the EU GDPR</strong> via Standard Contractual Clauses (SCCs).
              </p>
              <p>
                Enterprise clients may opt for dedicated in-country data residency (AWS Asia Pacific Mumbai / Azure Central India) under custom SLA agreements.
              </p>
            </section>

            {/* 11. CHILDREN'S PRIVACY */}
            <section id="children" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <AlertTriangle className="w-5 h-5 text-[#35C987]" /> 11. Minors & Children&apos;s Privacy
              </h2>
              <p>
                DC Scanner provides professional cybersecurity auditing, legal document inspection, and developer tooling. The service is not designed for or targeted at individuals under the age of 18. We do not knowingly process personal data belonging to minors under the DPDP Act or COPPA.
              </p>
            </section>

            {/* 12. CHANGES */}
            <section id="changes" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <FileText className="w-5 h-5 text-[#35C987]" /> 12. Updates to This Privacy Policy
              </h2>
              <p>
                We may periodically update this Charter to reflect evolving regulatory frameworks (including rules notified under the DPDP Act 2023) or architectural enhancements. When substantive revisions occur, we update the version header atop this page and provide notices across user dashboards.
              </p>
            </section>

            {/* 13. GRIEVANCE & CONTACT */}
            <section id="contact" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Mail className="w-5 h-5 text-[#35C987]" /> 13. Privacy Contact & Grievance Redressal
              </h2>
              <p>
                In compliance with Section 8(9) of the Digital Personal Data Protection Act, 2023 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, DC Scanner has appointed a designated <strong>Grievance Officer & Data Protection Officer</strong>:
              </p>

              <div className="p-5 rounded-2xl bg-[#0C1421] border border-[#283548] space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F7FA]">Rohit Sharma</h4>
                    <span className="text-[#35C987] font-semibold">Chief Information Security Officer & Designated Grievance Officer</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyEmail("grievance@dcscanner.io")}
                    className="px-3 py-1.5 rounded-lg bg-[#141F30] hover:bg-[#1A273D] border border-[#283548] text-[#35C987] font-mono text-xs flex items-center gap-1.5 w-fit"
                  >
                    {copiedContact ? <Check className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                    <span>grievance@dcscanner.io</span>
                  </button>
                </div>

                <div className="space-y-1.5 text-[#9BAABC]">
                  <p><strong className="text-[#F5F7FA]">Corporate Entity:</strong> DC Scanner Technologies India Private Limited</p>
                  <p><strong className="text-[#F5F7FA]">Corporate Identity Number (CIN):</strong> U72900KA2024PTC184920</p>
                  <p><strong className="text-[#F5F7FA]">Registered Office:</strong> DC Tech Hub, 4th Floor, Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103, India</p>
                  <p><strong className="text-[#F5F7FA]">General Privacy Inquiries:</strong> privacy@dcscanner.io</p>
                  <p><strong className="text-[#F5F7FA]">Statutory Redressal Window:</strong> Acknowledgment within 48 hours; resolution within 30 days.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
