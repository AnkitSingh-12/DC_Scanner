"use client";

import React, { useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import {
  FileText,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Building,
  Scale,
  Lock,
  Globe,
  Clock,
  Zap,
  Mail,
  Check,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Cpu,
  Award,
  Layers,
  Terminal,
  Database,
} from "lucide-react";

export default function TermsOfServicePage() {
  const [copiedContact, setCopiedContact] = useState(false);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedContact(true);
    setTimeout(() => setCopiedContact(false), 2500);
  };

  const sections = [
    { id: "acceptance", label: "1. Acceptance & Contracting Entity" },
    { id: "acceptable-use", label: "2. Authorized Defensive Use" },
    { id: "data-ownership", label: "3. 100% Customer Data Ownership" },
    { id: "zero-retention", label: "4. Zero-Retention Guarantee" },
    { id: "service-tiers", label: "5. Service Tiers & 99.9% SLA" },
    { id: "mcp-agents", label: "6. MCP Server & AI Agents" },
    { id: "accounts-keys", label: "7. Accounts & API Key Security" },
    { id: "billing-gst", label: "8. Fees, GST & Refund Policy" },
    { id: "security-audit", label: "9. Security Standards & SOC 2" },
    { id: "warranties", label: "10. Warranty Disclaimers" },
    { id: "liability", label: "11. Limitation of Liability" },
    { id: "indemnification", label: "12. Indemnification Obligations" },
    { id: "export-control", label: "13. Export Controls & SCOMET" },
    { id: "governing-law", label: "14. Governing Law & Arbitration" },
    { id: "termination", label: "15. Termination & Survival" },
    { id: "legal-contact", label: "16. Legal Notices & Contact" },
  ];

  return (
    <div className="min-h-screen bg-[#070D18] text-[#F5F7FA] flex flex-col font-sans selection:bg-[#35C987]/20 selection:text-[#35C987]">
      <AppHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* HERO BANNER */}
        <section className="space-y-4 border-b border-[#1E293B] pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              Master Platform Agreement
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#141F30] text-[#9BAABC] border border-[#283548]">
              v2.4 • Effective October 25, 2026
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#141F30] text-[#CBD5E1] border border-[#283548] flex items-center gap-1">
              <Globe className="w-3 h-3 text-[#35C987]" />
              Governed by the Laws of India
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F7FA]">
            DC Scanner Terms of Service & Master Platform Agreement
          </h1>

          <p className="text-sm sm:text-base text-[#9BAABC] leading-relaxed max-w-3xl">
            These Terms of Service govern all access to and utilization of DC Scanner’s PDF intelligence,
            structural forensic verification, developer APIs, Model Context Protocol (MCP) servers, and client tooling.
            Our platform operates exclusively for defensive cybersecurity auditing, legal document verification, and zero-retention inspection.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-[#0C1421] border border-[#283548] space-y-1">
              <span className="text-[#64748B] block font-mono text-[10px] uppercase">Service Provider</span>
              <strong className="text-[#F5F7FA] block text-xs">DC Scanner Technologies India Pvt. Ltd.</strong>
              <span className="text-[#9BAABC] text-[11px]">Bengaluru, Karnataka, India</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0C1421] border border-[#283548] space-y-1">
              <span className="text-[#64748B] block font-mono text-[10px] uppercase">Corporate Identity No (CIN)</span>
              <strong className="text-[#35C987] font-mono block text-xs">U72900KA2024PTC184920</strong>
              <span className="text-[#9BAABC] text-[11px]">Ministry of Corporate Affairs, India</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0C1421] border border-[#283548] space-y-1">
              <span className="text-[#64748B] block font-mono text-[10px] uppercase">Dispute Jurisdiction</span>
              <strong className="text-[#F5F7FA] block text-xs">Courts of Bengaluru, Karnataka</strong>
              <span className="text-[#9BAABC] text-[11px]">Arbitration & Conciliation Act, 1996</span>
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
                <span>Terms Navigation</span>
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
                <span className="text-[11px] text-[#64748B] block">Legal & Enterprise Inquiries</span>
                <button
                  type="button"
                  onClick={() => handleCopyEmail("legal@dcscanner.io")}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#141F30] hover:bg-[#1A273D] border border-[#283548] text-xs font-semibold text-[#35C987] transition-all"
                >
                  {copiedContact ? <Check className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                  <span>{copiedContact ? "Email Copied!" : "legal@dcscanner.io"}</span>
                </button>
              </div>
            </div>
          </aside>

          {/* MAIN DOCUMENT BODY */}
          <div className="lg:col-span-3 space-y-10 text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
            {/* 1. ACCEPTANCE */}
            <section id="acceptance" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Building className="w-5 h-5 text-[#35C987]" /> 1. Acceptance of Terms & Contracting Entity
              </h2>
              <p>
                By accessing, browsing, submitting files to, provisioning API tokens from, or integrating client applications with{" "}
                <strong>DC Scanner</strong> (&quot;Platform&quot;, &quot;Service&quot;, &quot;Software&quot;), you enter into a legally enforceable agreement with{" "}
                <strong className="text-[#F5F7FA]">DC Scanner Technologies India Private Limited</strong> (&quot;DC Scanner&quot;, &quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;), an Indian technology corporation incorporated under the Companies Act, 2013 (Company Identification Number: <span className="font-mono text-[#35C987]">U72900KA2024PTC184920</span>), having its registered office at DC Tech Hub, 4th Floor, Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103, India.
              </p>
              <p>
                This Agreement constitutes an electronic record under the provisions of the <strong>Information Technology Act, 2000 (Section 10A)</strong> and rules framed thereunder. If you represent an enterprise, sovereign body, or legal partnership, you represent and warrant that you hold express statutory or corporate power of attorney to bind that entity. If you do not consent to every term herein, you must immediately terminate use of the Platform and associated developer endpoints.
              </p>
            </section>

            {/* 2. ACCEPTABLE USE */}
            <section id="acceptable-use" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Shield className="w-5 h-5 text-[#35C987]" /> 2. Authorized Defensive Use & Acceptable Use Policy
              </h2>
              <p>
                DC Scanner is engineered exclusively for <strong>defensive cybersecurity verification, legal e-discovery, digital forensics, document hygiene, and compliance auditing</strong>. You agree to use the Service strictly in compliance with all applicable Indian and international cyber laws.
              </p>

              <div className="p-4 rounded-xl bg-[#0C1421] border border-red-500/30 space-y-3">
                <span className="font-bold text-red-400 flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="w-4 h-4" /> Strictly Prohibited Offensive & Abusive Activities:
                </span>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#9BAABC]">
                  <li><strong>Offensive Weaponization:</strong> You shall NOT use scan findings, parsing differential anomalies, or AST signatures to construct weaponized exploits, evasive zero-day payloads, or offensive cyber weapons.</li>
                  <li><strong>Parser Bomb Attacks:</strong> You shall NOT submit recursive decompressor bombs (&quot;zip bombs&quot; in FlateDecode streams), cyclic indirect object loops, or nesting hierarchies deeper than 128 levels designed to exhaust CPU or memory runtimes.</li>
                  <li><strong>Unlawful Materials:</strong> You shall NOT upload documents containing Child Sexual Abuse Material (CSAM), non-consensual imagery, terrorist propaganda, espionage data, or materials violating the Indian Penal Code / Bharatiya Nyaya Sanhita (BNS).</li>
                  <li><strong>Unauthorized Scraping:</strong> You shall NOT deploy automated scrapers, headless browsers, or load generation scripts against public scanner endpoints to bypass tier rate limits.</li>
                  <li><strong>Reverse Engineering:</strong> You shall NOT reverse-compile, disassemble, or reconstruct the underlying heuristics or trained models, except as permitted by mandatory statute.</li>
                </ul>
              </div>

              <p className="text-xs">
                Any infraction of this section triggers immediate account termination, API token revocation, and mandatory referral to law enforcement and the <strong>Indian Computer Emergency Response Team (CERT-In)</strong> under the Information Technology (The Indian Computer Emergency Response Team and Manner of Performing Functions and Duties) Rules, 2013.
              </p>
            </section>

            {/* 3. DATA OWNERSHIP */}
            <section id="data-ownership" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <CheckCircle2 className="w-5 h-5 text-[#35C987]" /> 3. 100% Customer Data Ownership Guarantee
              </h2>
              <p>
                <strong>You retain 100% exclusive, perpetual, and unencumbered intellectual property rights over all files, documents, and data submitted to DC Scanner.</strong>
              </p>
              <div className="p-4 rounded-xl bg-[#0C1421] border border-[#35C987]/30 space-y-2">
                <span className="font-bold text-[#35C987] flex items-center gap-1.5 text-xs">
                  <Shield className="w-4 h-4" /> Zero Intellectual Property or Copyright Claims:
                </span>
                <p className="text-xs text-[#CBD5E1]">
                  DC Scanner claims <strong>zero copyright, patent, trademark, or commercial ownership</strong> over your uploaded files. You grant DC Scanner only the narrow, transient, non-exclusive license strictly necessary to parse the byte stream in volatile RAM and return technical indicators to your client session. This license automatically expires the instant processing completes.
                </p>
              </div>
            </section>

            {/* 4. ZERO-RETENTION */}
            <section id="zero-retention" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Lock className="w-5 h-5 text-[#35C987]" /> 4. Zero-Retention Architectural Commitments
              </h2>
              <p>
                In strict accordance with our <Link href="/privacy" className="text-[#35C987] underline font-semibold">Privacy Policy</Link>, DC Scanner operates on an uncompromising Zero-Retention architecture:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#9BAABC]">
                <li><strong>Volatile Memory Inspection:</strong> Single-file metadata and security audits are parsed entirely in request-scoped volatile RAM buffers. As soon as the result payload is dispatched, memory buffers are wiped.</li>
                <li><strong>Transient File Generation:</strong> Multi-file assembly tools (Merge, Compress, Split) utilize encrypted temporary filesystem volumes that are scrubbed immediately upon download, with a 24-hour automated hard purge cap.</li>
                <li><strong>Zero AI Model Training:</strong> Uploaded documents, extracted clauses, and prompt queries are <strong>NEVER used to train, fine-tune, or benchmark public AI models</strong>.</li>
              </ul>
            </section>

            {/* 5. SERVICE TIERS & SLAS */}
            <section id="service-tiers" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Zap className="w-5 h-5 text-[#35C987]" /> 5. Service Tiers, Developer APIs & 99.9% Enterprise SLA
              </h2>
              <div className="space-y-2 text-xs">
                <p>
                  <strong>Free Defensive Tier:</strong> Provided on an &quot;as-is&quot; and &quot;as-available&quot; defensive basis for forensic students, individual researchers, and open-source auditors without an uptime warranty. Hard limits: 50MB file size, 10 scans per day.
                </p>
                <p>
                  <strong>Enterprise & Paid Developer Tiers:</strong> Enterprise agreements guarantee a <strong>99.9% Monthly Uptime Service Level Agreement (SLA)</strong>, dedicated execution clusters, up to 500MB file uploads, and prioritized tier-1 engineering support.
                </p>
              </div>

              {/* SLA TABLE */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs border border-[#283548] rounded-xl overflow-hidden">
                  <thead className="bg-[#141F30] text-[#F5F7FA] font-bold">
                    <tr>
                      <th className="p-3 border-b border-[#283548]">Monthly Uptime Percentage</th>
                      <th className="p-3 border-b border-[#283548]">Service Credit (% of Monthly Fee)</th>
                      <th className="p-3 border-b border-[#283548]">Remediation Window</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B] text-[#9BAABC]">
                    <tr>
                      <td className="p-3 font-semibold text-[#CBD5E1]">99.0% – 99.89%</td>
                      <td className="p-3 text-amber-400 font-bold">10% Credit</td>
                      <td className="p-3">Applied to next billing invoice</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#CBD5E1]">95.0% – 98.99%</td>
                      <td className="p-3 text-amber-400 font-bold">25% Credit</td>
                      <td className="p-3">Applied to next billing invoice</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#CBD5E1]">&lt; 95.0%</td>
                      <td className="p-3 text-red-400 font-bold">50% Credit</td>
                      <td className="p-3">Applied to next billing invoice or refund option</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 6. MCP & AI AGENTS */}
            <section id="mcp-agents" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Cpu className="w-5 h-5 text-[#35C987]" /> 6. Model Context Protocol (MCP) & Autonomous AI Agent Terms
              </h2>
              <p>
                When utilizing the DC Scanner Model Context Protocol (MCP) server or connecting autonomous AI agents (such as LangChain, LlamaIndex, or AutoGen pipelines):
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#9BAABC]">
                <li><strong>Agent Decision Liability:</strong> DC Scanner supplies deterministic structural findings, threat scores, and metadata extraction. You remain solely responsible for any downstream actions, automated quarantine decisions, or document redactions executed by your agent pipelines based on scan results.</li>
                <li><strong>Token & Concurrency Guardrails:</strong> Autonomous agent pipelines must implement exponential backoff upon receiving HTTP 429 (Too Many Requests). Hard-coded concurrent request loops without backoff are grounds for automated throttling.</li>
                <li><strong>No Reverse Agent Poisoning:</strong> You agree not to supply synthetic adversarial PDF objects to MCP endpoints to induce halluncination or prompt injection in connected LLMs.</li>
              </ul>
            </section>

            {/* 7. ACCOUNTS & KEYS */}
            <section id="accounts-keys" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Lock className="w-5 h-5 text-[#35C987]" /> 7. Accounts, Credentials & API Key Security
              </h2>
              <p>
                When provisioning an enterprise account or generating secret API keys (<code>dcs_live_*</code>), you are solely responsible for maintaining the confidentiality of your tokens. You agree not to publish API keys in public Git repositories or client-side bundles. You must notify us immediately at <button type="button" onClick={() => handleCopyEmail("security@dcscanner.io")} className="text-[#35C987] underline font-mono">security@dcscanner.io</button> upon detecting any credential leakage.
              </p>
            </section>

            {/* 8. BILLING & GST */}
            <section id="billing-gst" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Scale className="w-5 h-5 text-[#35C987]" /> 8. Fees, Indian Goods and Services Tax (GST) & Refund Policy
              </h2>
              <div className="space-y-2 text-xs text-[#9BAABC]">
                <p>
                  <strong>Currency & Invoicing:</strong> All subscription fees are billed in Indian Rupees (INR) for Indian domestic customers, or United States Dollars (USD) for international accounts, through PCI-DSS Level 1 compliant payment partners (Razorpay, Stripe).
                </p>
                <p>
                  <strong>GST Compliance (India):</strong> In accordance with the Central Goods and Services Tax Act, 2017 (CGST Act) and Integrated Goods and Services Tax Act, 2017 (IGST Act), applicable Indian GST (18%) is levied on all domestic transactions. Invoices displaying valid GSTIN and HSN/SAC codes are generated automatically upon billing.
                </p>
                <p>
                  <strong>Refunds:</strong> Fees for completed computational scans, API consumption, and active billing periods are non-refundable, except where mandated by statutory consumer protection law or prolonged SLA failure.
                </p>
              </div>
            </section>

            {/* 9. SECURITY & AUDIT */}
            <section id="security-audit" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Award className="w-5 h-5 text-[#35C987]" /> 9. Security Standards, Compliance & SOC 2 Commitments
              </h2>
              <p className="text-xs text-[#9BAABC]">
                DC Scanner Technologies India Private Limited operates within the security management guidelines of <strong>ISO/IEC 27001:2022 (ISMS)</strong> and maintains enterprise SOC 2 Type II compliance controls. We conduct regular penetration testing and vulnerability assessments across all parsing clusters.
              </p>
            </section>

            {/* 10. WARRANTIES */}
            <section id="warranties" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <HelpCircle className="w-5 h-5 text-[#35C987]" /> 10. Warranty Disclaimers & Forensic Negative Result Note
              </h2>
              <div className="p-4 rounded-xl bg-[#0C1421] border border-[#283548] space-y-2 text-xs">
                <p className="font-semibold text-[#F5F7FA]">IMPORTANT DEFENSIVE NOTICE:</p>
                <p className="text-[#9BAABC]">
                  A scan finding of &quot;CLEAN&quot; or absence of detected structural anomalies confirms that no recognized malicious indicators or active code actions were discovered during AST static evaluation. <strong>A negative scan result does not provide an absolute mathematical guarantee of the total absence of novel, highly targeted zero-day exploits.</strong>
                </p>
                <p className="text-[#9BAABC]">
                  Except as expressly provided in an executed Enterprise SLA, the Platform is provided on an &quot;AS-IS&quot; and &quot;AS-AVAILABLE&quot; basis without warranties of any kind, whether express, implied, or statutory, including warranties of merchantability, fitness for a specific purpose, and non-infringement.
                </p>
              </div>
            </section>

            {/* 11. LIABILITY */}
            <section id="liability" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <AlertTriangle className="w-5 h-5 text-[#35C987]" /> 11. Limitation of Liability & Consequential Damages Waiver
              </h2>
              <p className="text-xs text-[#9BAABC]">
                To the maximum extent permitted by applicable Indian law, DC Scanner Technologies India Private Limited and its directors, officers, employees, and suppliers shall not be liable for any indirect, special, incidental, punitive, or consequential damages (including loss of profits, business interruption, data corruption, or recovery costs from third-party cyber attacks). In no event shall our total aggregate liability arising under these Terms exceed the total amounts actually paid by you to DC Scanner during the twelve (12) months preceding the incident.
              </p>
            </section>

            {/* 12. INDEMNIFICATION */}
            <section id="indemnification" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Shield className="w-5 h-5 text-[#35C987]" /> 12. Indemnification Obligations
              </h2>
              <p className="text-xs text-[#9BAABC]">
                You agree to defend, indemnify, and hold harmless DC Scanner, its affiliates, directors, and employees against any third-party claims, liabilities, damages, and legal expenses arising out of: (a) your breach of the Acceptable Use Policy; (b) any unlawful content or payload contained within your submitted documents; or (c) your violation of third-party intellectual property or privacy rights.
              </p>
            </section>

            {/* 13. EXPORT CONTROL */}
            <section id="export-control" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Globe className="w-5 h-5 text-[#35C987]" /> 13. Export Controls, SCOMET List & Dual-Use Compliance
              </h2>
              <p className="text-xs text-[#9BAABC]">
                DC Scanner software, source code, and threat intelligence telemetry are subject to dual-use export control laws of India (the Special Chemicals, Organisms, Materials, Equipment and Technologies - <strong>SCOMET</strong> list administered by the Directorate General of Foreign Trade - DGFT), the Wassenaar Arrangement on Export Controls for Conventional Arms and Dual-Use Goods and Technologies, and international trade sanctions. You warrant that you are not located in, or a national of, any comprehensively embargoed territory.
              </p>
            </section>

            {/* 14. GOVERNING LAW & ARBITRATION */}
            <section id="governing-law" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Scale className="w-5 h-5 text-[#35C987]" /> 14. Governing Law, Dispute Resolution & Fast-Track Arbitration
              </h2>
              <div className="space-y-2 text-xs text-[#9BAABC]">
                <p>
                  These Terms and any dispute arising out of or in connection with them shall be governed by and construed in accordance with the <strong>substantive laws of the Republic of India</strong>, without regard to principles of conflict of laws.
                </p>
                <p>
                  Any dispute, controversy, or claim shall be referred to and finally resolved by binding arbitration under the <strong>Arbitration and Conciliation Act, 1996</strong> (including any statutory modifications or re-enactments thereof). The arbitration shall be conducted by a <strong>sole arbitrator</strong> mutually appointed by the parties, possessing recognized expertise in information technology law or cybersecurity forensics.
                </p>
                <div className="p-3.5 rounded-xl bg-[#0C1421] border border-[#283548] space-y-1 font-mono text-xs">
                  <p><strong className="text-[#F5F7FA]">Seat & Venue of Arbitration:</strong> Bengaluru, Karnataka, India</p>
                  <p><strong className="text-[#F5F7FA]">Language of Proceedings:</strong> English</p>
                  <p><strong className="text-[#F5F7FA]">Procedural Fast Track:</strong> Governed by Section 29B of the Arbitration & Conciliation Act, 1996</p>
                </div>
                <p>
                  Subject to the arbitration clause, the courts of competent jurisdiction located in <strong>Bengaluru, Karnataka, India</strong> shall possess exclusive jurisdiction over any injunctive or equitable relief.
                </p>
              </div>
            </section>

            {/* 15. TERMINATION */}
            <section id="termination" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Clock className="w-5 h-5 text-[#35C987]" /> 15. Termination, Suspension & Survival
              </h2>
              <p className="text-xs text-[#9BAABC]">
                You may terminate this Agreement at any time by deleting your account and API tokens via the Settings dashboard. DC Scanner reserves the right to immediately suspend or revoke API credentials if abusive traffic, scraper loops, or malicious activity is detected. Sections 3 (Data Ownership), 8 (Fees & Taxes), 10 (Warranties), 11 (Liability), 12 (Indemnification), 14 (Governing Law & Arbitration), and 16 (Legal Notices) survive termination.
              </p>
            </section>

            {/* 16. LEGAL CONTACT */}
            <section id="legal-contact" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Mail className="w-5 h-5 text-[#35C987]" /> 16. Legal Notices & Communications
              </h2>
              <p className="text-xs">
                All legal notices, contractual notices, and regulatory service of process should be directed to:
              </p>

              <div className="p-5 rounded-2xl bg-[#0C1421] border border-[#283548] space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F7FA]">Office of the General Counsel</h4>
                    <span className="text-[#35C987] font-semibold">DC Scanner Technologies India Private Limited</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyEmail("legal@dcscanner.io")}
                    className="px-3 py-1.5 rounded-lg bg-[#141F30] hover:bg-[#1A273D] border border-[#283548] text-[#35C987] font-mono text-xs flex items-center gap-1.5 w-fit"
                  >
                    {copiedContact ? <Check className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                    <span>legal@dcscanner.io</span>
                  </button>
                </div>

                <div className="space-y-1.5 text-[#9BAABC]">
                  <p><strong className="text-[#F5F7FA]">Corporate Entity:</strong> DC Scanner Technologies India Private Limited</p>
                  <p><strong className="text-[#F5F7FA]">Corporate Identification Number (CIN):</strong> U72900KA2024PTC184920</p>
                  <p><strong className="text-[#F5F7FA]">Registered Office:</strong> DC Tech Hub, 4th Floor, Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103, India</p>
                  <p><strong className="text-[#F5F7FA]">Legal & Contractual Desk:</strong> legal@dcscanner.io</p>
                  <p><strong className="text-[#F5F7FA]">Data Privacy & Grievance:</strong> privacy@dcscanner.io / grievance@dcscanner.io</p>
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
