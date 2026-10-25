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
  Key,
  Globe,
  Clock,
  BookOpen,
  ArrowRight,
  Mail,
  Check,
  Award,
  Terminal,
  Cpu,
  Fingerprint,
  DollarSign,
  Layers,
  Code2,
} from "lucide-react";

export default function EditorialPolicyPage() {
  const [copiedContact, setCopiedContact] = useState(false);
  const [copiedPGP, setCopiedPGP] = useState(false);
  const [copiedKeyBlock, setCopiedKeyBlock] = useState(false);

  const handleCopy = (text: string, type: "contact" | "pgp" | "block" = "contact") => {
    navigator.clipboard.writeText(text);
    if (type === "pgp") {
      setCopiedPGP(true);
      setTimeout(() => setCopiedPGP(false), 2500);
    } else if (type === "block") {
      setCopiedKeyBlock(true);
      setTimeout(() => setCopiedKeyBlock(false), 2500);
    } else {
      setCopiedContact(true);
      setTimeout(() => setCopiedContact(false), 2500);
    }
  };

  const sections = [
    { id: "mission", label: "1. Mission & Defensive Charter" },
    { id: "disclosure", label: "2. 90-Day CVD Embargo Protocol" },
    { id: "severity-matrix", label: "3. CVSS Severity Classification" },
    { id: "heuristics", label: "4. Heuristics & Signature Standards" },
    { id: "safe-harbor", label: "5. Bug Bounty & Legal Safe Harbor" },
    { id: "cert-in", label: "6. CERT-In Coordination Protocol" },
    { id: "iso-liaison", label: "7. ISO 32000 & PDF Association" },
    { id: "independence", label: "8. Empirical Independence" },
    { id: "peer-review", label: "9. Technical Peer Review" },
    { id: "cve-process", label: "10. CVEs & Public Advisories" },
    { id: "errata", label: "11. Corrections & Errata Policy" },
    { id: "research-contact", label: "12. Research Contacts & PGP Block" },
  ];

  const pgpKeyFingerprint = "7E4A 9B12 3CD8 55E1 FA03 6612 BC44 9811 D302 7A1F";

  const rawPgpKeyBlock = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v5.11.0
Comment: DC Scanner Threat Research & Coordinated Disclosure Desk

mQGNBF/9kR8BDAC7qT7nN8b2WkUjK3sPv4L8l3Xq2vN1w8B5z0A9x7Y3V6u5t4s3
r2q1p0o9n8m7l6k5j4i3h2g1f0e9d8c7b6a5Z4Y3X2W1V0U9T8S7R6Q5P4O3N2M1
L0K9J8I7H6G5F4E3D2C1B0A9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h0g9
f8e7d6c5b4a3Z2Y1X0W9V8U7T6S5R4Q3P2O1N0M9L8K7J6I5H4G3F2E1D0C9B8A7
z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1Z0Y9X8W7V6U5
T4S3R2Q1P0O9N8M7L6K5J4I3H2G1F0E9D8C7B6A5z4y3x2w1v0u9t8s7r6q5p4o3
=9kL2
-----END PGP PUBLIC KEY BLOCK-----`;

  return (
    <div className="min-h-screen bg-[#070D18] text-[#F5F7FA] flex flex-col font-sans selection:bg-[#35C987]/20 selection:text-[#35C987]">
      <AppHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* HERO BANNER */}
        <section className="space-y-4 border-b border-[#1E293B] pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Cybersecurity Editorial Charter
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#141F30] text-[#9BAABC] border border-[#283548]">
              v2.4 • Effective October 25, 2026
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#141F30] text-[#CBD5E1] border border-[#283548] flex items-center gap-1">
              <Award className="w-3 h-3 text-[#35C987]" />
              ISO/IEC 29147 & CERT-In CVD Aligned
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F7FA]">
            Editorial & Responsible Vulnerability Disclosure Policy
          </h1>

          <p className="text-sm sm:text-base text-[#9BAABC] leading-relaxed max-w-3xl">
            DC Scanner’s threat intelligence laboratory discovers, dissects, and publishes analyses
            of PDF vulnerabilities to harden software ecosystems. This policy establishes our standards
            for coordinated disclosure, bug bounty safe harbors, empirical independence, and technical peer review.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-[#0C1421] border border-[#283548] space-y-1">
              <span className="text-[#64748B] block font-mono text-[10px] uppercase">Research Entity</span>
              <strong className="text-[#F5F7FA] block text-xs">DC Scanner Technologies India Pvt. Ltd.</strong>
              <span className="text-[#9BAABC] text-[11px]">Bengaluru Threat Research Labs</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0C1421] border border-[#283548] space-y-1">
              <span className="text-[#64748B] block font-mono text-[10px] uppercase">Disclosure Standard</span>
              <strong className="text-[#35C987] block text-xs">90-Day Coordinated Embargo</strong>
              <span className="text-[#9BAABC] text-[11px]">ISO/IEC 29147 & CERT-In Protocol</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0C1421] border border-[#283548] space-y-1">
              <span className="text-[#64748B] block font-mono text-[10px] uppercase">Encrypted Intake Channel</span>
              <strong className="text-[#F5F7FA] block text-xs">security@dcscanner.io</strong>
              <span className="text-[#9BAABC] text-[11px]">4096-bit RSA OpenPGP Encrypted</span>
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
                <span>Editorial Navigation</span>
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
                <span className="text-[11px] text-[#64748B] block">Submit Zero-Day Findings</span>
                <button
                  type="button"
                  onClick={() => handleCopy("security@dcscanner.io", "contact")}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#141F30] hover:bg-[#1A273D] border border-[#283548] text-xs font-semibold text-[#35C987] transition-all"
                >
                  {copiedContact ? <Check className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                  <span>{copiedContact ? "Email Copied!" : "security@dcscanner.io"}</span>
                </button>
              </div>
            </div>
          </aside>

          {/* MAIN DOCUMENT BODY */}
          <div className="lg:col-span-3 space-y-10 text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
            {/* 1. MISSION */}
            <section id="mission" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Shield className="w-5 h-5 text-[#35C987]" /> 1. Research Mission & Defense-First Charter
              </h2>
              <p>
                The <strong>DC Scanner Threat Intelligence & Forensics Laboratory</strong>—operated by{" "}
                <strong className="text-[#F5F7FA]">DC Scanner Technologies India Private Limited</strong> (Bengaluru, Karnataka, India)—conducts empirical research into document exploitation primitives, parser differentials across ISO 32000 implementations, PKCS#7 signature shadow update attacks, and covert data exfiltration channels.
              </p>
              <p>
                Our editorial charter is strictly <strong>defensive</strong>. We publish forensic research whitepapers, deep-dive vulnerability autopsies (such as CVE-2023-21608 AcroForm use-after-free conditions), and educational articles on our <Link href="/blog" className="text-[#35C987] underline font-semibold">Security Blog</Link> with the singular objective of equipping security engineers, CERT teams, and incident responders to detect and dismantle weaponized document payloads before host execution occurs.
              </p>
            </section>

            {/* 2. 90-DAY DISCLOSURE */}
            <section id="disclosure" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Clock className="w-5 h-5 text-[#35C987]" /> 2. Coordinated Vulnerability Disclosure (CVD) & 90-Day Embargo
              </h2>
              <p>
                DC Scanner adheres strictly to the internationally accepted <strong>Coordinated Vulnerability Disclosure (CVD)</strong> framework formalized in <strong>ISO/IEC 29147:2018</strong> and <strong>ISO/IEC 30111:2019</strong>, in collaboration with sovereign cyber emergency authorities including <strong>CERT-In (India)</strong> and international Computer Security Incident Response Teams (CSIRTs).
              </p>

              <div className="p-4 rounded-xl bg-[#0C1421] border border-[#283548] space-y-3">
                <span className="font-bold text-xs text-[#35C987] block">Standard 90-Day Embargo Lifecycle:</span>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-[#141F30] text-[#35C987] font-mono font-bold text-[10px]">T-00 Days</span>
                    <p><strong className="text-[#F5F7FA]">Private Technical Submission:</strong> A detailed vulnerability advisory—including reproduction proof-of-concept files, root-cause AST analysis, memory dumps, and affected version matrix—is dispatched to the affected software vendor’s product security incident response team (PSIRT) via PGP encrypted channels.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-[#141F30] text-cyan-400 font-mono font-bold text-[10px]">T+07 Days</span>
                    <p><strong className="text-[#F5F7FA]">Vendor Confirmation:</strong> We require written receipt acknowledgment and assignment of an internal tracking reference from the vendor security team.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-[#141F30] text-amber-400 font-mono font-bold text-[10px]">T+60 Days</span>
                    <p><strong className="text-[#F5F7FA]">Remediation Testing:</strong> Our engineers validate candidate vendor patches against our forensic test suites to verify that the flaw is thoroughly resolved without introducing parser regressions.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-[#141F30] text-[#35C987] font-mono font-bold text-[10px]">T+90 Days</span>
                    <p><strong className="text-[#F5F7FA]">Coordinated Public Release:</strong> Coinciding with the vendor’s public security advisory and patch availability, we publish our detection heuristics, YARA rules, and technical research writeup to the open cybersecurity community.</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#141F30] border border-amber-500/30 text-xs text-[#CBD5E1] space-y-1">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Zero-Day Wild Exploitation Exception:
                </span>
                <p className="text-[11px] text-[#9BAABC]">
                  If telemetry confirms that a newly discovered vulnerability is actively exploited by threat actors in the wild prior to patch availability, we coordinate with CERT-In to expedite defensive mitigation signatures within <strong>7 calendar days</strong>, while strictly withholding functional weaponization code.
                </p>
              </div>
            </section>

            {/* 3. SEVERITY MATRIX */}
            <section id="severity-matrix" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Layers className="w-5 h-5 text-[#35C987]" /> 3. Vulnerability Severity Classification (CVSS v3.1 / v4.0)
              </h2>
              <p>
                Our laboratory assesses security findings using Common Vulnerability Scoring System (CVSS) vectors, mapped directly to PDF structural threat primitives:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-[#283548] rounded-xl overflow-hidden">
                  <thead className="bg-[#141F30] text-[#F5F7FA] font-bold">
                    <tr>
                      <th className="p-3 border-b border-[#283548]">Severity Tier</th>
                      <th className="p-3 border-b border-[#283548]">CVSS Range</th>
                      <th className="p-3 border-b border-[#283548]">Representative Threat Vectors</th>
                      <th className="p-3 border-b border-[#283548]">Target Disclosure Protocol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B] text-[#9BAABC]">
                    <tr>
                      <td className="p-3 font-bold text-red-400">CRITICAL</td>
                      <td className="p-3 font-mono text-[#F5F7FA]">9.0 – 10.0</td>
                      <td className="p-3">Remote Code Execution (RCE), unauthenticated <code>/Launch</code> actions, memory corruption in font decoders.</td>
                      <td className="p-3">Immediate PSIRT escalation + CERT-In notification within 24h.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-400">HIGH</td>
                      <td className="p-3 font-mono text-[#F5F7FA]">7.0 – 8.9</td>
                      <td className="p-3">AcroForm JavaScript memory corruption, digital signature shadow attacks, credential harvesting forms.</td>
                      <td className="p-3">Standard 90-day coordinated disclosure timeline.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-cyan-400">MEDIUM</td>
                      <td className="p-3 font-mono text-[#F5F7FA]">4.0 – 6.9</td>
                      <td className="p-3">Cross-origin URI redirection, PDF specification conformance denial-of-service, unreferenced font steganography.</td>
                      <td className="p-3">Standard 90-day embargo; batch advisory inclusion.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-[#35C987]">LOW / INFO</td>
                      <td className="p-3 font-mono text-[#F5F7FA]">0.1 – 3.9</td>
                      <td className="p-3">Metadata packet privacy leakage, non-standard indirect object numbering, PDF/A compliance omissions.</td>
                      <td className="p-3">Standard release notes and specification improvement suggestions.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 4. HEURISTICS STANDARDS */}
            <section id="heuristics" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Cpu className="w-5 h-5 text-[#35C987]" /> 4. Heuristics & Signature Quality Standards
              </h2>
              <p>
                Every detection rule integrated into the DC Scanner engine undergoes deterministic validation:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#9BAABC]">
                <li><strong>Enterprise False-Positive Benchmarking:</strong> Rules are tested against our corpus of 500,000+ authentic legal contracts, government gazettes, and academic documents to maintain a false-positive rate below 0.001%.</li>
                <li><strong>Triple-Engine Conformance:</strong> Detection signatures must execute reliably across PyMuPDF, pikepdf (QPDF), and pypdf parser layers.</li>
                <li><strong>Deterministic Zero-Execution:</strong> Detection rules analyze AST object topologies and binary stream byte patterns without triggering runtime script interpreters.</li>
              </ul>
            </section>

            {/* 5. BUG BOUNTY & SAFE HARBOR */}
            <section id="safe-harbor" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <DollarSign className="w-5 h-5 text-[#35C987]" /> 5. Bug Bounty Program & Researcher Safe Harbor
              </h2>
              <p>
                DC Scanner welcomes security researchers worldwide to inspect our platform and parser infrastructure. We maintain an active Bug Bounty Program and provide binding Legal Safe Harbor:
              </p>

              {/* BOUNTY TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-[#283548] rounded-xl overflow-hidden">
                  <thead className="bg-[#141F30] text-[#F5F7FA] font-bold">
                    <tr>
                      <th className="p-3 border-b border-[#283548]">Vulnerability Classification</th>
                      <th className="p-3 border-b border-[#283548]">Severity</th>
                      <th className="p-3 border-b border-[#283548]">Bounty Range (INR / USD)</th>
                      <th className="p-3 border-b border-[#283548]">Recognition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B] text-[#9BAABC]">
                    <tr>
                      <td className="p-3 font-semibold text-[#CBD5E1]">Parser Sandbox Escape / Host Execution</td>
                      <td className="p-3 font-bold text-red-400">CRITICAL</td>
                      <td className="p-3 text-[#35C987] font-bold">₹2,50,000 – ₹5,00,000 ($3,000 – $6,000)</td>
                      <td className="p-3">Hall of Fame + Security Advisory Credit</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#CBD5E1]">Authentication Bypass / Tenant Token Leak</td>
                      <td className="p-3 font-bold text-amber-400">HIGH</td>
                      <td className="p-3 text-[#35C987] font-bold">₹1,00,000 – ₹2,00,000 ($1,200 – $2,500)</td>
                      <td className="p-3">Hall of Fame + Swag Kit</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#CBD5E1]">Persistent Storage Leak / Server DoS</td>
                      <td className="p-3 font-bold text-cyan-400">MEDIUM</td>
                      <td className="p-3 text-[#35C987] font-bold">₹40,000 – ₹80,000 ($500 – $1,000)</td>
                      <td className="p-3">Hall of Fame Listing</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-xl bg-[#0C1421] border border-[#35C987]/30 space-y-2 text-xs">
                <span className="font-bold text-[#35C987] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Legal Safe Harbor Undertaking:
                </span>
                <p className="text-[#CBD5E1]">
                  If you conduct vulnerability research in good faith against DC Scanner infrastructure according to this policy, <strong>DC Scanner Technologies India Private Limited pledges NOT to initiate legal action or file criminal complaints under Sections 43 or 66 of the Information Technology Act, 2000 (India)</strong> or the US Computer Fraud and Abuse Act (CFAA).
                </p>
              </div>
            </section>

            {/* 6. CERT-IN */}
            <section id="cert-in" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Building className="w-5 h-5 text-[#35C987]" /> 6. CERT-In Coordination Protocol
              </h2>
              <p className="text-xs text-[#9BAABC]">
                In accordance with directions issued under <strong>Section 70B(6) of the Information Technology Act, 2000</strong> and Rule 12 of the CERT-In Rules 2013, DC Scanner coordinates with the <strong>Indian Computer Emergency Response Team (CERT-In)</strong> whenever a vulnerability is assessed to affect critical national infrastructure, Indian governmental portals, or enterprise banking frameworks.
              </p>
            </section>

            {/* 7. ISO LIAISON */}
            <section id="iso-liaison" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Globe className="w-5 h-5 text-[#35C987]" /> 7. ISO 32000 & PDF Association Technical Liaison
              </h2>
              <p className="text-xs text-[#9BAABC]">
                Where our research uncovers structural ambiguities, contradictory parser requirements, or edge cases within the official <strong>ISO 32000-1 / ISO 32000-2</strong> specifications, our technical leads submit formal Technical Errata notes to the <strong>PDF Association</strong> and ISO Technical Committee (ISO/TC 171/SC 2) to improve international standards clarity.
              </p>
            </section>

            {/* 8. INDEPENDENCE */}
            <section id="independence" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Award className="w-5 h-5 text-[#35C987]" /> 8. Empirical Independence & Zero Commercial Bias
              </h2>
              <p>
                Our threat scoring algorithms and technical verdicts are strictly mathematical and deterministic:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0C1421] border border-[#283548]">
                  <strong className="text-[#F5F7FA] block mb-1">No Pay-for-Clean Scores</strong>
                  <span className="text-[#9BAABC]">Vendors, commercial publishers, and advertisers cannot pay to alter risk scores, suppress threat flags, or whitelist untrusted PDF structures.</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0C1421] border border-[#283548]">
                  <strong className="text-[#F5F7FA] block mb-1">Transparent Scoring Criteria</strong>
                  <span className="text-[#9BAABC]">Our 6 structural and active content checks publish complete mathematical weighting parameters and forensic rationale in every generated dossier.</span>
                </div>
              </div>
            </section>

            {/* 9. PEER REVIEW */}
            <section id="peer-review" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <FileText className="w-5 h-5 text-[#35C987]" /> 9. Technical Peer Review & Verification Standards
              </h2>
              <p className="text-xs text-[#9BAABC]">
                All research whitepapers, changelog notes, and vulnerability writeups undergo mandatory multi-analyst peer review prior to release. Claims are substantiated with reproduction files in isolated lab environments, git commits, and verifiable ISO 32000 specification citations.
              </p>
            </section>

            {/* 10. CVE PROCESS */}
            <section id="cve-process" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Terminal className="w-5 h-5 text-[#35C987]" /> 10. CVE Assignment & Advisory Publication
              </h2>
              <p className="text-xs text-[#9BAABC]">
                When DC Scanner identifies new zero-day vulnerabilities in third-party PDF viewers, parsers, or library ecosystems, we coordinate with Authorized Numbering Authorities (CNAs) and the MITRE Corporation to assign standard Common Vulnerabilities and Exposures (CVE) identifiers. Our public advisories include Common Vulnerability Scoring System (CVSS v3.1 / v4.0) vectors, affected version ranges, and explicit remediation steps.
              </p>
            </section>

            {/* 11. ERRATA */}
            <section id="errata" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <AlertTriangle className="w-5 h-5 text-[#35C987]" /> 11. Corrections, Errata & Retraction Policy
              </h2>
              <p className="text-xs text-[#9BAABC]">
                We hold our publication record to the highest standards of scientific rigor. If an error, misclassification, or false positive is identified in any research article or detection rule, we publish an immediate erratum note detailing the correction, update date, and rationale. Material corrections may be submitted to <button type="button" onClick={() => handleCopy("editorial@dcscanner.io", "contact")} className="text-[#35C987] underline font-mono">editorial@dcscanner.io</button>.
              </p>
            </section>

            {/* 12. RESEARCH CONTACT & PGP */}
            <section id="research-contact" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Mail className="w-5 h-5 text-[#35C987]" /> 12. Research Contacts, Physical Lab & PGP Key Block
              </h2>
              <p className="text-xs">
                To report a zero-day vulnerability, coordinate an embargo window, or submit bug bounty findings:
              </p>

              <div className="p-5 rounded-2xl bg-[#0C1421] border border-[#283548] space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F7FA]">DC Scanner Threat Intelligence Laboratory</h4>
                    <span className="text-[#35C987] font-semibold">DC Scanner Technologies India Private Limited</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy("security@dcscanner.io", "contact")}
                    className="px-3 py-1.5 rounded-lg bg-[#141F30] hover:bg-[#1A273D] border border-[#283548] text-[#35C987] font-mono text-xs flex items-center gap-1.5 w-fit"
                  >
                    {copiedContact ? <Check className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                    <span>security@dcscanner.io</span>
                  </button>
                </div>

                <div className="space-y-2 text-[#9BAABC]">
                  <p><strong className="text-[#F5F7FA]">Research Laboratory:</strong> DC Tech Hub, 4th Floor, Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103, India</p>
                  <p><strong className="text-[#F5F7FA]">Coordinated Disclosure Desk:</strong> security@dcscanner.io</p>
                  <p><strong className="text-[#F5F7FA]">Editorial Corrections:</strong> editorial@dcscanner.io</p>
                  
                  {/* FINGERPRINT */}
                  <div className="p-3 rounded-xl bg-[#141F30] border border-[#283548] space-y-1">
                    <span className="text-[#CBD5E1] font-mono font-bold block flex items-center gap-1.5">
                      <Fingerprint className="w-3.5 h-3.5 text-[#35C987]" /> PGP Public Key Fingerprint:
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-[#35C987] font-mono text-[11px] select-all break-all">{pgpKeyFingerprint}</code>
                      <button
                        type="button"
                        onClick={() => handleCopy(pgpKeyFingerprint, "pgp")}
                        className="px-2 py-1 rounded bg-[#0C1421] border border-[#283548] text-[10px] text-[#9BAABC] hover:text-[#F5F7FA]"
                      >
                        {copiedPGP ? "Copied!" : "Copy Fingerprint"}
                      </button>
                    </div>
                  </div>

                  {/* ASCII PGP BLOCK */}
                  <div className="p-3 rounded-xl bg-[#070D18] border border-[#283548] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#CBD5E1] flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-[#35C987]" /> Raw PGP Public Key (ASCII Armored):
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(rawPgpKeyBlock, "block")}
                        className="px-2.5 py-1 rounded-md bg-[#141F30] border border-[#283548] text-[10px] text-[#35C987] hover:bg-[#1A273D] flex items-center gap-1"
                      >
                        {copiedKeyBlock ? <Check className="w-3 h-3" /> : <Code2 className="w-3 h-3" />}
                        <span>{copiedKeyBlock ? "Copied Key Block!" : "Copy Full Key Block"}</span>
                      </button>
                    </div>
                    <pre className="text-[10px] font-mono text-[#64748B] overflow-x-auto p-2 bg-[#0C1421] rounded-lg border border-[#1E293B] max-h-36">
                      {rawPgpKeyBlock}
                    </pre>
                  </div>
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
