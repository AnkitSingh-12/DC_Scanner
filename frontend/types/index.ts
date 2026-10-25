export type RiskLevel = "CLEAN" | "LOW" | "MEDIUM" | "HIGH" | "INCONCLUSIVE";
export type FindingSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
export type ScanStatus = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
export type ScanProfile = "standard" | "deep" | "fast";

export interface Finding {
  rule_id: string;
  title: string;
  severity: FindingSeverity;
  confidence: string;
  category: string;
  evidence: string;
  explanation: string;
  remediation: string;
  location?: string | null;
  object_id?: string | null;
}

export interface ExtractedJavaScript {
  id: string;
  source_object: string;
  trigger_type: string;
  code_preview: string;
  full_length: number;
  suspicious_patterns: string[];
  is_obfuscated: boolean;
}

export interface ExtractedURI {
  url: string;
  domain: string;
  protocol: string;
  page?: number | null;
  is_ip_address: boolean;
  is_suspicious_tld: boolean;
  risk_flags: string[];
}

export interface ExtractedAttachment {
  filename: string;
  file_extension: string;
  size_bytes: number;
  mime_type?: string | null;
  md5: string;
  sha256: string;
  is_executable: boolean;
  suspicious_reason?: string | null;
}

export interface DocumentAction {
  action_type: string;
  trigger: string;
  target: string;
  severity: FindingSeverity;
  details: string;
}

export interface StructuralAnomaly {
  code: string;
  name: string;
  severity: FindingSeverity;
  description: string;
  raw_evidence?: string | null;
}

export interface CheckResult {
  check_id: string;
  name: string;
  category: string;
  status: "COMPLETED" | "FAILED" | "SKIPPED" | "UNAVAILABLE";
  findings_count: number;
  duration_ms: number;
  details?: string | null;
}

export interface PDFMetadata {
  pdf_version: string;
  page_count: number;
  file_size_bytes: number;
  title?: string | null;
  author?: string | null;
  subject?: string | null;
  keywords?: string | null;
  creator?: string | null;
  producer?: string | null;
  creation_date?: string | null;
  modification_date?: string | null;
  is_encrypted: boolean;
  is_linearized: boolean;
  permissions: Record<string, boolean>;
  trailer_id?: string[] | null;
  stream_count: number;
  indirect_objects_count: number;
}

export interface RiskAssessment {
  risk_level: RiskLevel;
  risk_score: number;
  safety_score: number;
  verdict_headline: string;
  verdict_summary: string;
  score_breakdown: Record<string, number>;
  confidence: string;
}

export interface ScanRecord {
  scan_id: string;
  filename: string;
  file_size: number;
  sha256: string;
  md5: string;
  sha1: string;
  mime_type: string;
  status: ScanStatus;
  profile: ScanProfile;
  progress_percent: number;
  current_stage: string;
  created_at: string;
  completed_at?: string | null;
  duration_ms?: number | null;
  error?: string | null;
  metadata?: PDFMetadata | null;
  risk?: RiskAssessment | null;
  findings: Finding[];
  javascript_items: ExtractedJavaScript[];
  detected_uris: ExtractedURI[];
  attachments: ExtractedAttachment[];
  document_actions: DocumentAction[];
  structural_anomalies: StructuralAnomaly[];
  checks: CheckResult[];
}

export interface ScanSummary {
  scan_id: string;
  filename: string;
  file_size: number;
  sha256: string;
  status: ScanStatus;
  risk_level?: RiskLevel | null;
  risk_score?: number | null;
  findings_count: number;
  created_at: string;
  completed_at?: string | null;
}

export interface ApiKeyItem {
  key_id: string;
  name: string;
  prefix: string;
  created_at: string;
  last_used_at?: string | null;
  is_active: boolean;
}

export interface ExtractedPageText {
  page_number: number;
  word_count: number;
  character_count: number;
  text: string;
}

export interface TextExtractionData {
  scan_id: string;
  filename: string;
  file_size: number;
  pages_count: number;
  total_words: number;
  total_characters: number;
  duration_seconds: number;
  pages: ExtractedPageText[];
}
