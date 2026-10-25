"use client";

import React, { useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Shield,
  Tag,
  Search,
  Sparkles,
  ExternalLink,
  Lock,
  Cpu,
  FileText,
  X,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  author: string;
  role: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  content: string[];
  tags: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "cve-2023-21608-analysis",
    title: "Deconstructing CVE-2023-21608: How Malicious JavaScript Evades AcroForm Protections",
    author: "Dr. Marcus Vance",
    role: "Head of Threat Intelligence",
    date: "October 23, 2026",
    readTime: "6 min read",
    category: "Vulnerability Research",
    excerpt:
      "A deep dive into use-after-free conditions in Adobe Acrobat's JavaScript engine, examining how threat actors construct weaponized calculations in dynamic PDF forms.",
    tags: ["CVE-2023-21608", "JavaScript", "AcroForm", "Exploit Analysis"],
    content: [
      "In modern enterprise threat landscapes, PDF documents remain one of the most prolific delivery vectors for targeted intrusion campaigns. CVE-2023-21608 highlighted a critical use-after-free condition inside the Acrobat JavaScript runtime when handling cyclic object references in form calculation scripts.",
      "By chaining an obfuscated /JavaScript entry inside an /OpenAction catalog key, attackers trigger memory corruption prior to the document rendering pipeline finishing initialization.",
      "DC Scanner prevents exploitation by executing zero-execution static analysis: we parse indirect object trees into an abstract syntax tree without invoking ECMAScript runtimes, isolating weaponized triggers before the user ever opens the file.",
    ],
  },
  {
    id: "incremental-update-attacks",
    title: "The Anatomy of Incremental Update PDF Attacks & Post-Signing Tampering",
    author: "Elena Rostova",
    role: "Cryptographic Research Lead",
    date: "October 18, 2026",
    readTime: "8 min read",
    category: "Cryptography",
    excerpt:
      "Digital signatures in PDF documents are designed to guarantee non-repudiation, but shadow attacks exploit incremental xref updates to alter visible text without invalidating signatures.",
    tags: ["Digital Signatures", "ByteRange", "Tamper Detection", "PKCS#7"],
    content: [
      "The PDF specification allows documents to be updated incrementally by appending new cross-reference tables and updated trailer dictionaries to the end of the file. While beneficial for signing large documents without full re-serialization, this mechanism introduces serious security risks.",
      "In a Shadow Attack, an adversary defines two overlapping content streams or annotations. When the signer approves the document, the signature verifies the original stream; however, a subsequent incremental update overwrites the display coordinate without altering the signed ByteRange offsets.",
      "DC Scanner's cryptographic engine audits the entire ByteRange sequence, detecting any bytes appended outside the authenticated hash envelope and flagging modified object revisions.",
    ],
  },
  {
    id: "font-stream-covert-channels",
    title: "Covert Data Exfiltration via Embedded TrueType Font Streams",
    author: "Alex Chen",
    role: "Senior Binary Analyst",
    date: "October 14, 2026",
    readTime: "5 min read",
    category: "Forensics",
    excerpt:
      "Examining how threat actors utilize unreferenced glyph tables and corrupted FontFile3 streams to smuggle secondary payloads past perimeter firewalls.",
    tags: ["Font Forensics", "TrueType", "Steganography", "Binary Analysis"],
    content: [
      "Font streams in PDF files are treated with significant leniency by modern viewers to preserve visual fidelity across diverse operating systems. Attackers exploit this tolerance by concealing secondary payloads inside malformed TrueType font tables.",
      "By injecting encrypted shellcode into unused font glyph slots (such as non-standard CID mappings), malicious documents bypass conventional signature-based antivirus scanners that only inspect plaintext and standard streams.",
      "Our forensic engine unpacks every FontDescriptor, FontBBox, and FontFile stream, validating table checksums and isolating anomalies before they can be decoded by a host application.",
    ],
  },
  {
    id: "zero-retention-enterprise",
    title: "Enforcing Zero-Retention in Regulated Enterprise PDF Pipelines",
    author: "Sarah Jenkins",
    role: "Chief Compliance Officer",
    date: "October 08, 2026",
    readTime: "4 min read",
    category: "Compliance",
    excerpt:
      "Why GDPR, HIPAA, and SOC 2 frameworks require deterministic file memory purging after document inspection, and how DC Scanner achieves zero residual data.",
    tags: ["Compliance", "GDPR", "HIPAA", "Zero-Retention"],
    content: [
      "Confidential M&A dossiers, patient health summaries, and legal filings often require verification before distribution, but uploading these sensitive files to third-party SaaS validators exposes organizations to severe breach liabilities.",
      "DC Scanner operates under an uncompromising Zero-Retention architectural model. Uploaded PDF buffers exist only in volatile, sandboxed memory during AST extraction. Once validation scores are computed, the original file is wiped from disk.",
      "Furthermore, our instant purge controls empower security teams to clear forensic dossiers and database metadata on demand with complete cryptographic certainty.",
    ],
  },
];

export default function BlogPage() {
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = ["ALL", "Vulnerability Research", "Cryptography", "Forensics", "Compliance"];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCat = selectedCategory === "ALL" || post.category === selectedCategory;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0C1421] text-[#F5F7FA]">
      <AppHeader />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        {/* HERO SECTION */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141F30] border border-[#283548] text-[#35C987] text-xs font-semibold shadow-inner">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="tracking-wide uppercase text-[11px] font-bold">
              Research & Threat Intelligence
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F7FA]">
            DC Scanner Security Blog
          </h1>

          <p className="text-sm text-[#9BAABC] leading-relaxed">
            In-depth forensic investigations, CVE breakdowns, cryptographic signature research, and document security best practices from our engineering team.
          </p>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="cyber-card p-4 rounded-2xl bg-[#141F30] border border-[#283548] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#9BAABC] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles (e.g. CVE, signatures, font)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0C1421] border border-[#283548] text-xs text-[#F5F7FA] placeholder-[#9BAABC]/50 focus:outline-none focus:border-[#35C987]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#35C987] text-[#0C1421] font-bold"
                    : "bg-[#0C1421] border border-[#283548] text-[#9BAABC] hover:text-[#F5F7FA]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ARTICLES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="cyber-card p-6 sm:p-7 rounded-2xl bg-[#141F30] border border-[#283548] hover:border-[#35C987]/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#9BAABC]">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30 font-semibold text-[10px] uppercase">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3 h-3 text-[#35C987]" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-[#F5F7FA] group-hover:text-[#35C987] transition-colors leading-snug">
                  {post.title}
                </h2>

                <p className="text-xs text-[#9BAABC] leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-[#283548]/80">
                <div className="flex flex-wrap items-center gap-1.5">
                  {post.tags.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#0C1421] border border-[#283548] text-[10px] font-mono text-[#9BAABC]">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <div>
                    <span className="font-semibold text-[#F5F7FA] block">{post.author}</span>
                    <span className="text-[10px] text-[#9BAABC]">{post.role}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActivePost(post)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#35C987] hover:underline cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* FULL ARTICLE MODAL */}
        {activePost && (
          <div className="fixed inset-0 z-50 bg-[#0C1421]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="cyber-card p-6 sm:p-8 rounded-2xl bg-[#141F30] border border-[#283548] max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#283548] pb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-[#35C987]/15 text-[#35C987] border border-[#35C987]/30 font-semibold text-[10px] uppercase">
                  {activePost.category}
                </span>
                <button
                  type="button"
                  onClick={() => setActivePost(null)}
                  className="p-1 rounded-lg text-[#9BAABC] hover:text-[#F5F7FA] hover:bg-[#0C1421] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7FA] leading-tight">
                  {activePost.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-[#9BAABC]">
                  <span>By <strong className="text-[#F5F7FA]">{activePost.author}</strong> ({activePost.role})</span>
                  <span>•</span>
                  <span>{activePost.date}</span>
                  <span>•</span>
                  <span>{activePost.readTime}</span>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#D8E1EC] leading-relaxed pt-2">
                {activePost.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="pt-4 border-t border-[#283548] flex items-center justify-between">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {activePost.tags.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#0C1421] border border-[#283548] text-[10px] font-mono text-[#9BAABC]">
                      #{t}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setActivePost(null)}
                  className="px-4 py-1.5 rounded-xl bg-[#35C987] text-[#0C1421] font-bold text-xs cursor-pointer"
                >
                  Close
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
