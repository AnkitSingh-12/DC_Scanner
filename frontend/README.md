# DC Scanner — Frontend Client (Next.js 16)

The web frontend for **DC Scanner**, built with **Next.js 16 (Turbopack)**, **React 19**, **Tailwind CSS**, and **Lucide React Icons**.

## Available Scripts

In the project directory, you can run:

```bash
# Run development server with hot-reload
npm run dev

# Build optimized production bundle
npm run build

# Start production server on port 3000
npm start

# Lint TypeScript and JSX
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the application in the browser.

## Application Architecture

- `app/page.tsx`: Unified DC Scanner landing & metadata verification inspection suite.
- `app/verify-metadata/page.tsx`: Dedicated Verify Metadata route.
- `app/scans/[id]/page.tsx`: Interactive multi-tool Forensic Dossier report.
- `app/scanner/page.tsx`: Dynamic 24-tool inspection studio workspace.
- `app/tools/page.tsx`: Directory of all 24 PDF tools categorized across Analyze, Optimize, Transform, and Build.
- `app/changelog/page.tsx`: Platform releases and security updates from v1.8.0 to v1.0.0.
- `app/developers/page.tsx`: REST API docs, API key manager, and Model Context Protocol (MCP) server integration.
- `app/blog/page.tsx`: Forensic research articles on PDF exploitation primitives.
- `app/privacy/page.tsx`: Complete DPDP Act 2023 & GDPR Privacy Charter.
- `app/terms/page.tsx`: Master Terms of Service & 99.9% Enterprise SLA.
- `app/editorial-policy/page.tsx`: Coordinated Vulnerability Disclosure (CVD) & Bug Bounty Charter.
- `components/`: Cyber-themed components, modals, and navigation suites.

For full system architecture, backend setup, and API specifications, please refer to the root [README.md](../README.md).
