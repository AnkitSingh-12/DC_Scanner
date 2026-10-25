# DC Scanner — PDF Intelligence & Forensic Security Platform

<div align="center">

```
  ██████╗   ██████╗    ███████╗ ██████╗ █████╗ ███╗   ██╗███╗   ██╗███████╗██████╗ 
  ██╔══██╗ ██╔════╝    ██╔════╝██╔════╝██╔══██╗████╗  ██║████╗  ██║██╔════╝██╔══██╗
  ██║  ██║ ██║         ███████╗██║     ███████║██╔██╗ ██║██╔██╗ ██║█████╗  ██████╔╝
  ██║  ██║ ██║         ╚════██║██║     ██╔══██║██║╚██╗██║██║╚██╗██║██╔══╝  ██╔══██╗
  ██████╔╝ ╚██████╗    ███████║╚██████╗██║  ██║██║ ╚████║██║ ╚████║███████╗██║  ██║
  ╚═════╝   ╚═════╝    ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝
```

**Next-Generation Forensic PDF Analysis, Threat Dissection, and Structural Security Audit Platform**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.115+-009688.svg?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016%20(Turbopack)-black.svg?style=flat-square&logo=next.js)](https://nextjs.org)
[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.12%20%7C%203.14-3776AB.svg?style=flat-square&logo=python)](https://python.org)
[![Triple-Engine](https://img.shields.io/badge/Engines-PyMuPDF%20%2B%20pikepdf%20%2B%20pypdf-35C987.svg?style=flat-square)](#triple-engine-parsing-architecture)
[![Zero-Retention](https://img.shields.io/badge/Privacy-Zero--Retention%20Ephemeral%20Memory-35C987.svg?style=flat-square)](#zero-retention-architecture)
[![DPDP & GDPR](https://img.shields.io/badge/Compliance-India%20DPDP%202023%20%7C%20EU%20GDPR-blue.svg?style=flat-square)](#statutory-compliance--legal-entity)
[![License](https://img.shields.io/badge/License-Proprietary%20%2F%20Enterprise-orange.svg?style=flat-square)](#license--terms)

</div>

---

## Table of Contents
- [Executive Overview](#executive-overview)
- [Triple-Engine Forensic Architecture](#triple-engine-forensic-architecture)
- [Key Capabilities & Detection Vectors](#key-capabilities--detection-vectors)
- [24 Modular PDF Tools Suite](#24-modular-pdf-tools-suite)
- [Zero-Retention Security Model](#zero-retention-security-model)
- [Repository Structure](#repository-structure)
- [Local Installation & Setup](#local-installation--setup)
- [Automated Test Suite](#automated-test-suite)
- [Developer REST API Reference](#developer-rest-api-reference)
- [Model Context Protocol (MCP) Server for AI Agents](#model-context-protocol-mcp-server-for-ai-agents)
- [Coordinated Vulnerability Disclosure (CVD) & Bug Bounty](#coordinated-vulnerability-disclosure-cvd--bug-bounty)
- [Statutory Compliance & Legal Entity](#statutory-compliance--legal-entity)
- [License & Terms](#license--terms)

---

## Executive Overview

**DC Scanner** is a defense-grade PDF intelligence and forensic security analysis suite developed by **DC Scanner Technologies India Private Limited** (Bengaluru, Karnataka, India). Designed for security researchers, incident response teams, enterprise compliance auditors, and forensic examiners, DC Scanner deterministically analyzes document internals without executing malicious code.

Unlike conventional viewers or online converters that risk host compromise, DC Scanner executes **zero-execution static analysis** on Abstract Syntax Trees (AST), flagging zero-day exploits, evasive obfuscation, incremental shadow attacks, and credential harvesting vectors in milliseconds.

```
[ Incoming PDF Document ]
           │
           ▼
┌────────────────────────────────────────────────────────┐
│           Ephemeral In-Memory Isolation Buffer         │
└────────────────────────────────────────────────────────┘
           │
     ┌─────┴──────────────────┬─────────────────────┐
     ▼                        ▼                     ▼
┌──────────────┐     ┌────────────────┐     ┌──────────────┐
│   PyMuPDF    │     │ pikepdf (QPDF) │     │    pypdf     │
│  Fast Text   │     │ Low-Level AST  │     │ Conformance  │
│ Stream Audit │     │ Object Tree    │     │ & Trailer ID │
└──────────────┘     └────────────────┘     └──────────────┘
     │                        │                     │
     └─────┬──────────────────┴─────────────────────┘
           ▼
┌────────────────────────────────────────────────────────┐
│     Forensic Security Heuristics Engine (6 Checks)     │
│  • JS / Launch Actions      • Phishing & Direct IPs    │
│  • Embedded Binaries        • Font Stream Anomalies    │
│  • ByteRange Signatures     • Obfuscated Stream Filters│
└────────────────────────────────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────────────────────┐
│  Interactive Dossier / JSON Report / Instant Purge     │
└────────────────────────────────────────────────────────┘
```

---

## Triple-Engine Forensic Architecture

To eliminate blind spots caused by parser discrepancies across ISO 32000 implementations, DC Scanner combines three distinct parsing engines:

1. **pikepdf (libqpdf)**: Deep low-level object tree traversal, indirect object dictionary auditing, unreferenced stream detection, and linearized trailer parsing.
2. **PyMuPDF (MuPDF v2)**: High-speed rasterization, character coordinate mapping, font descriptor stream validation, and image stream extraction.
3. **pypdf**: Specification syntax validation, ISO conformance checks, and cryptographic signature dictionary auditing.

---

## Key Capabilities & Detection Vectors

| Threat Vector | PDF Structural Primitives | Forensic Detection Method | Severity |
| :--- | :--- | :--- | :--- |
| **Hidden Script Execution** | `/JavaScript`, `/JS`, `/AcroForm` | Decodes obfuscated script streams in AST; audits calculations without runtime execution. | **CRITICAL** |
| **Host Process Execution** | `/Launch`, `/Win`, `/DOS` | Detects direct instructions commanding host shell (`cmd.exe`, `powershell.exe`) execution. | **CRITICAL** |
| **Credential Phishing** | `/URI`, `/SubmitForm`, Direct IPv4 | Extracts external hyperlinks, flags raw IP URLs, and audits automated form data exfiltration. | **HIGH** |
| **Embedded Binaries** | `/EmbeddedFiles`, `/EF` | Audits document portfolios for concealed PE files (`.exe`, `.dll`), batch files, and scripts. | **CRITICAL** |
| **Digital Signature Tampering** | Incremental Updates, `%%EOF` | Audits signature `/ByteRange` boundaries to detect post-signing shadow updates. | **HIGH** |
| **Font Stream Exploits** | `/FontFile2`, `/FontFile3`, CFF | Inspects TrueType/OpenType tables for glyph corruption and memory overflow primitives. | **HIGH** |
| **Filter Chaining Obfuscation**| `/ASCIIHexDecode`, `/FlateDecode` | Detects cascaded compression layers designed to evade perimeter antivirus scanners. | **MEDIUM** |

---

## 24 Modular PDF Tools Suite

DC Scanner provides a comprehensive directory of 24 specialized forensic and utility tools categorized across 4 operational domains:

### 1. Analyze PDF
- **Verify Metadata**: Inspect document metadata dictionaries, authoring software, timestamps, and trailer IDs (`/`).
- **Validate PDF**: Audit syntax and structure against ISO 32000 specifications (`/scanner?tool=validate`).
- **AI Detection Tool**: Heuristic detection of generative AI text patterns and synthetic formatting (`/scanner?tool=ai`).
- **Signature Checker**: Validate cryptographic signatures, PKCS#7 containers, and ByteRanges (`/scanner?tool=signatures`).
- **Accessibility Checker**: Inspect PDF/UA tagged trees, logical reading order, and alt text (`/scanner?tool=accessibility`).
- **PDF/A Validator**: Validate permanent long-term archival conformance against ISO 19005 (`/scanner?tool=pdfa`).
- **PDF Font Checker**: Inspect embedded font glyphs, CID encoding, and WinAnsi tables (`/scanner?tool=fonts`).
- **Compare PDFs**: Structural and visual diffing across incremental revisions (`/scanner?tool=compare`).
- **Batch PDF Checker**: Multi-file automated folder scanning for SOC triage (`/scanner?tool=batch`).

### 2. Optimize PDF
- **Compress PDF**: Lossless Flate compression, unreferenced stream purging, and linearization (`/scanner?tool=compress`).
- **Metadata Editor**: Modify or update document Info dictionaries and XMP packets (`/scanner?tool=metadata_editor`).
- **Metadata Remover**: Sanitize privacy-sensitive GPS coordinates and revision history (`/scanner?tool=metadata_remover`).
- **PDF Password**: Audit standard security handlers, permission bitmasks, and encryption algorithms (`/scanner?tool=password`).

### 3. Transform PDF
- **AI PDF Chat (BETA)**: In-context interactive Q&A and clause extraction without external model training (`/scanner?tool=ai_chat`).
- **Extract Text**: Plain text extraction with per-page breakdown and character statistics (`/scanner?tool=extract_text`).
- **Extract Images**: Discover and dump embedded raster/vector images (`/scanner?tool=extract_images`).
- **PDF to Markdown**: Convert outlines, headers, tables, and streams to clean Markdown (`/scanner?tool=pdf_to_md`).
- **PDF to Image**: High-DPI page preview rendering in PNG/WebP format (`/scanner?tool=pdf_to_img`).

### 4. Build & Edit
- **Merge PDF**: Concatenate multiple PDF streams into unified catalogs (`/scanner?tool=merge`).
- **Split PDF**: Burst multi-page documents and extract custom page ranges (`/scanner?tool=split`).
- **PDF Editor**: In-browser client-side IndexedDB sandbox editor with zero server network calls (`/edit-pdf`).
- **PDF Highlighter**: Draw annotations and visual callouts entirely client-side (`/scanner?tool=highlight`).
- **Fill PDF Form**: Populate interactive AcroForm fields and checkboxes (`/scanner?tool=fill_form`).
- **Build PDF Form**: Design interactive AcroForm inputs and widgets (`/scanner?tool=build_form`).

---

## Zero-Retention Security Model

DC Scanner is built upon strict defensive privacy engineering:

1. **RAM-Only Analysis**: Files uploaded for metadata verification and security checks are processed strictly in volatile RAM buffers and immediately overwritten upon response delivery.
2. **Automated File Purge**: Files generated during multi-file operations (Merge, Compress) are held on encrypted transient mounts and deleted immediately post-download, with an hourly automated hard deletion worker capping lifetime at 24 hours.
3. **Zero AI Training**: Customer files, extracted text, and user prompts are **never used to train or fine-tune public artificial intelligence models**.
4. **Local Browser Isolation**: Client-side drafting tools run entirely in the browser's local `IndexedDB` sandbox without transmitting document bytes to our backend.

---

## Repository Structure

```
DC_Scanner/
├── backend/
│   ├── app/
│   │   ├── analyzers/            # Forensic detection engines
│   │   │   ├── active_content_analyzer.py   # /JavaScript, /Launch actions
│   │   │   ├── metadata_analyzer.py         # Trailer ID, timestamps, producers
│   │   │   ├── structural_analyzer.py       # Indirect objects & stream filters
│   │   │   └── url_analyzer.py              # Phishing links & raw IP analysis
│   │   ├── api/v1/endpoints/     # REST API routes (scans, keys, health)
│   │   ├── core/                 # Config, logging, and security settings
│   │   ├── models/               # Pydantic schemas and database models
│   │   ├── services/             # Scan orchestration & storage cleanups
│   │   └── main.py               # FastAPI application entry point
│   ├── tests/                    # Pytest unit and integration test suite
│   ├── requirements.txt          # Python dependencies
│   └── run.py                    # Local uvicorn development launcher
├── frontend/
│   ├── app/                      # Next.js 16 (App Router)
│   │   ├── page.tsx              # Main DC Scanner home & inspection interface
│   │   ├── verify-metadata/      # Unified Verify Metadata route
│   │   ├── scanner/              # Dynamic tool scanner workspace
│   │   ├── scans/[id]/           # Interactive Forensic Dossier report
│   │   ├── tools/                # 24 PDF tools directory
│   │   ├── changelog/            # 20 version releases with filters
│   │   ├── developers/           # API docs, MCP config, and waitlists
│   │   ├── blog/                 # 4 deep forensic research articles
│   │   ├── privacy/              # Complete DPDP Act & GDPR Privacy Charter
│   │   ├── terms/                # Master Terms of Service & SLA agreement
│   │   ├── editorial-policy/     # CVD disclosure & Bug Bounty Charter
│   │   ├── history/              # Local scan audit history & batch purge
│   │   └── settings/             # Enterprise data purge & tier diagnostics
│   ├── components/               # Cyber-themed UI components & modals
│   ├── public/                   # Static assets, sitemap.xml, llms.txt
│   ├── types/                    # TypeScript interfaces
│   └── package.json              # Next.js dependencies
└── samples/                      # Forensic test PDF files (clean, js, launch, url)
```

---

## Local Installation & Setup

### Prerequisites
- **Python**: 3.11, 3.12, or 3.14
- **Node.js**: v18.18+ or v20+
- **npm**: v9+ or v10+

### 1. Backend Service Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend server on port 8008
PYTHONPATH=. uvicorn backend.app.main:app --host 127.0.0.1 --port 8008 --reload
```

The FastAPI Swagger documentation will be available at:
- **Interactive OpenAPI UI**: `http://127.0.0.1:8008/docs`
- **Health Check Endpoint**: `http://127.0.0.1:8008/api/v1/health`

### 2. Frontend Application Setup (Next.js 16)

```bash
# Navigate to frontend directory in a separate terminal
cd frontend

# Install Node modules
npm install

# Run in Development mode
npm run dev

# Or compile for Production (Turbopack)
npm run build
npm start
```

The application will be live at:
- **Web Platform**: `http://localhost:3000`

---

## Automated Test Suite

DC Scanner maintains comprehensive test coverage across parser analyzers and API endpoints:

```bash
# Run backend pytest suite from repository root
PYTHONPATH=. ./backend/venv/bin/pytest -v
```

### Verified Test Cases:
- `test_clean_invoice_scan`: Verifies zero false-positives on benign invoices.
- `test_javascript_detection`: Detects embedded AcroForm scripts and OpenActions.
- `test_suspicious_url_detection`: Flags direct IPv4 links and phishing patterns.
- `test_launch_action_critical`: Detects `/Launch` actions targeting `cmd.exe`.
- `test_corrupt_file_handling`: Ensures graceful handling of malformed PDF headers.
- `test_health_endpoint`: Validates engine version telemetry (`PyMuPDF`, `pikepdf`, `pypdf`).
- `test_scan_upload_and_pipeline`: End-to-end multipart upload, hash generation, and report export.
- `test_api_keys_workflow`: API key generation, listing, and revocation.

---

## Developer REST API Reference

All requests can be authenticated via `Bearer <api_key>` (generated from the [Developers Console](http://localhost:3000/developers)).

### 1. Upload Document for Forensic Analysis
```http
POST /api/v1/scans
Content-Type: multipart/form-data

file: <binary_pdf_stream>
profile: "standard" | "deep" | "passive"
```
**Response (`202 Accepted`):**
```json
{
  "scan_id": "da0cb6f5-e43f-4b1a-a0d2-8d38076c953d",
  "status": "QUEUED",
  "filename": "suspicious_invoice.pdf",
  "file_size": 142080,
  "sha256": "cdb4ae92758d02e4d146dcd1e2d167ab972bcc9e4b854eea61e70fab41680a36",
  "message": "PDF accepted and queued for forensic security analysis."
}
```

### 2. Poll Scan Status & Retrieve Findings
```http
GET /api/v1/scans/{scan_id}
```
**Response (`200 OK`):**
```json
{
  "scan_id": "da0cb6f5-e43f-4b1a-a0d2-8d38076c953d",
  "filename": "suspicious_invoice.pdf",
  "status": "COMPLETED",
  "risk": {
    "risk_level": "CRITICAL",
    "risk_score": 95,
    "verdict_headline": "Active Weaponization Detected",
    "verdict_summary": "Discovered 1 critical /Launch action targeting host shell execution."
  },
  "findings": [
    {
      "finding_id": "FND-001",
      "severity": "CRITICAL",
      "title": "Weaponized /Launch Command Execution",
      "details": "Catalog contains /OpenAction referencing /Launch command 'powershell.exe -enc ...'"
    }
  ]
}
```

### 3. Permanently Purge Scan & Artifacts
```http
DELETE /api/v1/scans/{scan_id}
```
**Response (`200 OK`):**
```json
{
  "message": "Scan and stored files deleted successfully.",
  "scan_id": "da0cb6f5-e43f-4b1a-a0d2-8d38076c953d"
}
```

---

## Model Context Protocol (MCP) Server for AI Agents

DC Scanner natively integrates with the **Model Context Protocol (MCP)**, enabling autonomous AI agents (Claude Desktop, Cursor, LangChain, AutoGen) to inspect untrusted PDFs before ingesting them into LLM context windows.

### Claude Desktop / Cursor MCP Configuration (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "dc-scanner": {
      "command": "python",
      "args": ["-m", "backend.scripts.mcp_server"],
      "env": {
        "DC_SCANNER_API_KEY": "dcs_live_your_api_key_here",
        "DC_SCANNER_ENDPOINT": "http://127.0.0.1:8008/api/v1"
      }
    }
  }
}
```

### Exposed MCP Tools:
- `scan_pdf_security(file_path: str)`: Audits document for active threats and returns CVSS risk score.
- `verify_pdf_metadata(file_path: str)`: Extracts metadata dictionary, trailer ID, and producer timestamps.
- `extract_clean_text(file_path: str)`: Returns sanitized plaintext streams stripped of prompt injection vectors.

---

## Coordinated Vulnerability Disclosure (CVD) & Bug Bounty

DC Scanner maintains a formal **Coordinated Vulnerability Disclosure** policy in alignment with **ISO/IEC 29147** and **ISO/IEC 30111**:

- **Standard Embargo Window**: 90 calendar days from initial vendor PSIRT notification to public advisory release.
- **Expedited Wild Zero-Day Protocol**: 7 calendar days if malicious campaigns are actively exploiting the flaw.
- **Reporting Channel**: `security@dcscanner.io` (PGP Encrypted).
- **PGP Fingerprint**: `7E4A 9B12 3CD8 55E1 FA03 6612 BC44 9811 D302 7A1F`.

### Bug Bounty Program (INR / USD):
| Severity Tier | CVSS Score | Reward Bracket |
| :--- | :--- | :--- |
| **CRITICAL** (Parser Escape / Host RCE) | 9.0 – 10.0 | **₹2,50,000 – ₹5,00,000** ($3,000 – $6,000) |
| **HIGH** (Auth Bypass / Key Leakage) | 7.0 – 8.9 | **₹1,00,000 – ₹2,00,000** ($1,200 – $2,500) |
| **MEDIUM** (Storage Leak / Denial of Service) | 4.0 – 6.9 | **₹40,000 – ₹80,000** ($500 – $1,000) |

*Full details available at [Editorial & Responsible Disclosure Policy](/editorial-policy).*

---

## Statutory Compliance & Legal Entity

**DC Scanner** is operated by:

- **Entity**: **DC Scanner Technologies India Private Limited**
- **Corporate Identity Number (CIN)**: `U72900KA2024PTC184920` (Registrar of Companies, Bengaluru, India)
- **Registered Office**: DC Tech Hub, 4th Floor, Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103, India
- **Data Protection Frameworks**:
  - **India**: Digital Personal Data Protection Act, 2023 (DPDP Act) — *Data Fiduciary*
  - **European Union**: EU General Data Protection Regulation (GDPR Article 28) — *Data Controller*
  - **Security Standards**: ISO/IEC 27001:2022 ISMS & SOC 2 Type II Alignment
- **Grievance Officer**: Rohit Sharma, Chief Information Security Officer (`grievance@dcscanner.io`)

---

## License & Terms

- **Master Terms of Service**: Governed by the laws of the Republic of India; fast-track arbitration under the Arbitration and Conciliation Act, 1996 in Bengaluru, Karnataka. See [Terms of Service](/terms).
- **Privacy Policy**: Comprehensive zero-retention data protection charter. See [Privacy Policy](/privacy).
- **Copyright**: © 2026 DC Scanner Technologies India Private Limited. All rights reserved.
