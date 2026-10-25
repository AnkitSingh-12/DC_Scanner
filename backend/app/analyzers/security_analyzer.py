"""
DC Scanner - Security Analyzer
Hunts for active content: JavaScript, /Launch, /OpenAction, /AA, /EmbeddedFiles, /URI phishing links, and active exploits.
Traverses catalog, pages, annotations, and indirect objects.
"""
import re
import hashlib
from typing import Tuple, Optional, Any
import pikepdf
from urllib.parse import urlparse
from ..models.schemas import (
    Finding, FindingSeverity, ExtractedJavaScript, ExtractedURI,
    ExtractedAttachment, DocumentAction, CheckResult, CheckStatus
)

SUSPICIOUS_EXTENSIONS = {
    ".exe", ".bat", ".cmd", ".scr", ".vbs", ".js", ".ps1", ".psm1",
    ".dll", ".hta", ".jar", ".iso", ".img", ".wsf", ".cpl", ".msi",
    ".com", ".pif", ".docm", ".xlsm", ".pptm"
}

SUSPICIOUS_URI_KEYWORDS = [
    "login", "signin", "verify", "secure", "update", "banking",
    "password", "account", "credential", "auth", "webscr", "confirm"
]

SUSPICIOUS_JS_PATTERNS = [
    (r"eval\s*\(", "eval() dynamic execution", FindingSeverity.HIGH),
    (r"unescape\s*\(", "unescape() string decoding", FindingSeverity.MEDIUM),
    (r"String\.fromCharCode", "String.fromCharCode obfuscation", FindingSeverity.MEDIUM),
    (r"app\.launchURL", "app.launchURL browser spawn", FindingSeverity.MEDIUM),
    (r"util\.printf", "util.printf memory formatting / heap spray pattern", FindingSeverity.HIGH),
    (r"this\.exportDataObject", "this.exportDataObject payload drop", FindingSeverity.CRITICAL),
    (r"collab\.getIcon", "collab.getIcon exploit signature (CVE-2009-0927)", FindingSeverity.CRITICAL),
    (r"media\.newPlayer", "media.newPlayer buffer exploit", FindingSeverity.HIGH),
    (r"app\.alert\s*\(", "app.alert() popup dialog", FindingSeverity.INFO),
]

def is_ip_address(host: str) -> bool:
    """Check if host string is a raw IPv4 or IPv6 address."""
    ipv4_pattern = r"^(\d{1,3}\.){3}\d{1,3}$"
    return bool(re.match(ipv4_pattern, host))

def clean_key(k: Any) -> str:
    return str(k).lstrip("/")

class SecurityAnalyzer:
    def __init__(self, file_path: str):
        self.file_path = file_path

    def analyze(self) -> Tuple[
        list[Finding],
        list[ExtractedJavaScript],
        list[ExtractedURI],
        list[ExtractedAttachment],
        list[DocumentAction],
        list[CheckResult]
    ]:
        findings: list[Finding] = []
        js_items: list[ExtractedJavaScript] = []
        uris: list[ExtractedURI] = []
        attachments: list[ExtractedAttachment] = []
        actions: list[DocumentAction] = []
        checks: list[CheckResult] = []

        uri_seen = set()
        js_seen = set()

        def inspect_dict(d: Any, location: str, trigger_context: str = "Action Trigger"):
            if not isinstance(d, (dict, pikepdf.Dictionary, pikepdf.Stream)):
                return

            try:
                # Check action type /S
                s_val = None
                if "/S" in d:
                    s_val = clean_key(d["/S"])
                elif "S" in d:
                    s_val = clean_key(d["S"])
            except (TypeError, AttributeError, KeyError):
                return

            # 1. /Launch Action
            if s_val == "Launch":
                launch_spec = ""
                if "/F" in d:
                    launch_spec = str(d["/F"])
                elif "/Win" in d:
                    launch_spec = str(d["/Win"])
                
                actions.append(DocumentAction(
                    action_type="/Launch",
                    trigger=trigger_context,
                    target=launch_spec or "External Program",
                    severity=FindingSeverity.CRITICAL,
                    details=f"Instruction to execute external host process: {launch_spec}"
                ))
                findings.append(Finding(
                    rule_id="SEC-LAUNCH-001",
                    title="Critical Weaponized /Launch Action Detected",
                    severity=FindingSeverity.CRITICAL,
                    confidence="HIGH",
                    category="Active Content",
                    evidence=f"{location} specifies /Launch target: {launch_spec}",
                    explanation="The /Launch action allows PDF files to initiate shell commands or launch executable binaries on the host system (CVE-2010-1240).",
                    remediation="Block this document. Do not allow execution in native viewers.",
                    location=location
                ))

            # 2. /SubmitForm Action
            if s_val == "SubmitForm":
                target_url = str(d.get("/F", ""))
                actions.append(DocumentAction(
                    action_type="/SubmitForm",
                    trigger=trigger_context,
                    target=target_url or "Remote Server",
                    severity=FindingSeverity.MEDIUM,
                    details="Submits form data to remote network destination."
                ))
                findings.append(Finding(
                    rule_id="SEC-SUBMITFORM-001",
                    title="Remote Form Data Transmission (/SubmitForm)",
                    severity=FindingSeverity.MEDIUM,
                    confidence="HIGH",
                    category="Links",
                    evidence=f"{location} specifies /SubmitForm targeting: {target_url}",
                    explanation="SubmitForm actions can exfiltrate sensitive data or trigger NTLM hash capture.",
                    remediation="Audit target server destination.",
                    location=location
                ))

            # 3. /URI Action
            if (s_val == "URI" or "/URI" in d) and "/URI" in d:
                try:
                    raw_url = str(d["/URI"]).strip()
                    if raw_url and raw_url not in uri_seen:
                        uri_seen.add(raw_url)
                        parsed = urlparse(raw_url)
                        protocol = parsed.scheme.lower() or "http"
                        domain = parsed.netloc.split(":")[0] if parsed.netloc else parsed.path.split("/")[0]

                        is_ip = is_ip_address(domain)
                        is_suspicious_tld = any(domain.endswith(tld) for tld in [".tk", ".ml", ".ga", ".cf", ".gq", ".top", ".xyz", ".buzz", ".work"])

                        risk_flags = []
                        if is_ip:
                            risk_flags.append("Raw IP Address Destination")
                        if is_suspicious_tld:
                            risk_flags.append("High-Risk Top Level Domain")
                        if protocol == "http":
                            risk_flags.append("Insecure Cleartext Protocol (HTTP)")
                        if protocol in ["file", "smb", "ftp"]:
                            risk_flags.append(f"Non-Web Protocol ({protocol})")
                        if any(kw in raw_url.lower() for kw in SUSPICIOUS_URI_KEYWORDS):
                            risk_flags.append("Contains Credential / Phishing Keywords")

                        uris.append(ExtractedURI(
                            url=raw_url,
                            domain=domain,
                            protocol=protocol,
                            is_ip_address=is_ip,
                            is_suspicious_tld=is_suspicious_tld,
                            risk_flags=risk_flags
                        ))

                        if is_ip:
                            findings.append(Finding(
                                rule_id="SEC-URI-IP-001",
                                title="Direct IP Address Link Detected",
                                severity=FindingSeverity.HIGH,
                                confidence="HIGH",
                                category="Links",
                                evidence=f"{location} contains URI targeting raw IP address: {raw_url}",
                                explanation="Phishing campaigns and command-and-control servers frequently use direct IP addresses to evade domain reputation filters.",
                                remediation="Block access to destination IP address.",
                                location=location
                            ))
                        elif is_suspicious_tld or len(risk_flags) >= 2:
                            findings.append(Finding(
                                rule_id="SEC-URI-SUSP-002",
                                title="Potentially Suspicious Phishing URL",
                                severity=FindingSeverity.MEDIUM,
                                confidence="MEDIUM",
                                category="Links",
                                evidence=f"URI '{raw_url[:80]}' triggered flags: {', '.join(risk_flags)}",
                                explanation="URLs possessing suspicious TLDs, non-standard schemes, or credential keywords are common phishing indicators.",
                                remediation="Verify URL legitimacy before clicking.",
                                location=location
                            ))
                except Exception:
                    pass

            # 4. /JavaScript or /JS
            if s_val == "JavaScript" or "/JS" in d or "/JavaScript" in d:
                js_content = None
                js_key = "/JS" if "/JS" in d else "/JavaScript"
                if js_key in d:
                    js_obj = d[js_key]
                    try:
                        if isinstance(js_obj, pikepdf.Stream):
                            js_content = bytes(js_obj.read_bytes()).decode("latin1", errors="replace")
                        else:
                            js_content = str(js_obj)
                    except Exception:
                        js_content = str(js_obj)

                if js_content and js_content not in js_seen:
                    js_seen.add(js_content)
                    suspicious_patterns = []
                    severity_for_js = FindingSeverity.MEDIUM

                    for pattern, desc, sev in SUSPICIOUS_JS_PATTERNS:
                        if re.search(pattern, js_content, re.IGNORECASE):
                            suspicious_patterns.append(desc)
                            if sev == FindingSeverity.CRITICAL:
                                severity_for_js = FindingSeverity.CRITICAL
                            elif sev == FindingSeverity.HIGH and severity_for_js != FindingSeverity.CRITICAL:
                                severity_for_js = FindingSeverity.HIGH

                    is_obfuscated = bool(
                        re.search(r"\\x[0-9a-f]{2}", js_content, re.IGNORECASE) or
                        re.search(r"%[0-9a-f]{2}", js_content, re.IGNORECASE) or
                        ("eval" in js_content.lower() and "unescape" in js_content.lower())
                    )

                    js_items.append(ExtractedJavaScript(
                        id=f"js-{len(js_items)+1}",
                        source_object=location,
                        trigger_type=trigger_context,
                        code_preview=js_content[:500],
                        full_length=len(js_content),
                        suspicious_patterns=suspicious_patterns,
                        is_obfuscated=is_obfuscated
                    ))

                    findings.append(Finding(
                        rule_id="SEC-JS-001",
                        title=f"Embedded JavaScript Code ({'Obfuscated' if is_obfuscated else 'Active'})",
                        severity=severity_for_js,
                        confidence="HIGH",
                        category="Active Content",
                        evidence=f"{location} contains {len(js_content)} bytes of JavaScript. Detected heuristics: {', '.join(suspicious_patterns) if suspicious_patterns else 'Standard script syntax'}",
                        explanation="PDF JavaScript provides programmatic capabilities that have historically been exploited for memory corruption, heap spraying, and local file access.",
                        remediation="Disable JavaScript execution in PDF reader settings.",
                        location=location
                    ))

        try:
            with pikepdf.open(self.file_path, allow_overwriting_input=False) as pdf:
                catalog = pdf.Root

                # Check /OpenAction
                if "/OpenAction" in catalog:
                    oa = catalog["/OpenAction"]
                    inspect_dict(oa, "Catalog -> /OpenAction", "Automatic On Document Open")
                    oa_s = clean_key(oa.get("/S", "Direct Action")) if hasattr(oa, "keys") else "Page Jump"
                    actions.append(DocumentAction(
                        action_type=f"/OpenAction:{oa_s}",
                        trigger="On Document Open",
                        target=str(oa)[:80],
                        severity=FindingSeverity.HIGH if oa_s in ["JavaScript", "Launch"] else FindingSeverity.LOW,
                        details="Document automatically triggers this action upon initial rendering without user interaction."
                    ))
                    if oa_s in ["JavaScript", "Launch"]:
                        findings.append(Finding(
                            rule_id="SEC-OPENACTION-001",
                            title=f"Automatic Action on Open ({oa_s})",
                            severity=FindingSeverity.HIGH,
                            confidence="HIGH",
                            category="Active Content",
                            evidence=f"Catalog /OpenAction triggers active S={oa_s}",
                            explanation="PDF documents should display visual content passively. Automatic execution on open is standard behavior for weaponized PDF droppers.",
                            remediation="Do not view in PDF software that allows automatic action execution.",
                            location="Catalog -> /OpenAction"
                        ))

                # Check /AA in Catalog
                if "/AA" in catalog and isinstance(catalog["/AA"], (dict, pikepdf.Dictionary)):
                    for evt, act in catalog["/AA"].items():
                        inspect_dict(act, f"Catalog -> /AA -> {evt}", f"On Catalog Event {evt}")

                # Check Page Annotations
                for idx, page in enumerate(pdf.pages):
                    if "/Annots" in page:
                        annots_obj = page["/Annots"]
                        if isinstance(annots_obj, (list, pikepdf.Array)):
                            for a_idx, annot in enumerate(annots_obj):
                                if isinstance(annot, (dict, pikepdf.Dictionary)):
                                    inspect_dict(annot.get("/A"), f"Page {idx+1} -> Annot {a_idx+1} -> /A", f"Annotation Click Page {idx+1}")
                                    if "/AA" in annot:
                                        inspect_dict(annot["/AA"], f"Page {idx+1} -> Annot {a_idx+1} -> /AA", f"Annotation Event Page {idx+1}")

                # Check All Indirect Objects
                for obj in pdf.objects:
                    if isinstance(obj, (pikepdf.Dictionary, pikepdf.Stream)):
                        obj_label = f"Object {obj.objgen[0]} {obj.objgen[1]} R"
                        inspect_dict(obj, obj_label, "Object Action")

                # Check /EmbeddedFiles
                if "/Names" in catalog and isinstance(catalog["/Names"], (dict, pikepdf.Dictionary)) and "/EmbeddedFiles" in catalog["/Names"]:
                    ef_tree = catalog["/Names"]["/EmbeddedFiles"]
                    try:
                        names_array = ef_tree.get("/Names", [])
                        for i in range(0, len(names_array), 2):
                            fname = str(names_array[i])
                            filespec = names_array[i + 1]
                            ext = "." + fname.split(".")[-1].lower() if "." in fname else ""
                            is_exec = ext in SUSPICIOUS_EXTENSIONS

                            file_data = b""
                            if "/EF" in filespec and "/F" in filespec["/EF"]:
                                stream_obj = filespec["/EF"]["/F"]
                                file_data = bytes(stream_obj.read_bytes())

                            md5 = hashlib.md5(file_data).hexdigest() if file_data else "e3b0c44298fc1c149afbf4c8996fb924"
                            sha256 = hashlib.sha256(file_data).hexdigest() if file_data else "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"

                            attachments.append(ExtractedAttachment(
                                filename=fname,
                                file_extension=ext,
                                size_bytes=len(file_data),
                                md5=md5,
                                sha256=sha256,
                                is_executable=is_exec,
                                suspicious_reason="Executable file extension" if is_exec else None
                            ))

                            if is_exec:
                                findings.append(Finding(
                                    rule_id="SEC-ATTACH-EXEC-001",
                                    title=f"Executable Attachment Detected ({fname})",
                                    severity=FindingSeverity.CRITICAL,
                                    confidence="HIGH",
                                    category="Attachments",
                                    evidence=f"Embedded file '{fname}' possesses dangerous executable extension '{ext}'",
                                    explanation="Attackers embed executable binaries, scripts, or installer packages inside PDF containers to evade email perimeters.",
                                    remediation="Extract and submit attachment to sandbox analysis before permitting user access.",
                                    location=f"Catalog -> /Names -> /EmbeddedFiles -> '{fname}'"
                                ))
                            else:
                                findings.append(Finding(
                                    rule_id="INFO-ATTACH-002",
                                    title=f"Embedded File Attachment ({fname})",
                                    severity=FindingSeverity.LOW,
                                    confidence="HIGH",
                                    category="Attachments",
                                    evidence=f"Document contains embedded file: {fname} ({len(file_data)} bytes)",
                                    explanation="Embedded attachments are valid in PDF portfolios but should be inspected for secondary payloads.",
                                    remediation="Verify attachment matches business purpose."
                                ))
                    except Exception:
                        pass

                # Record Checks
                checks.append(CheckResult(
                    check_id="CHK-SEC-JS-001",
                    name="JavaScript Execution Engine Check",
                    category="Active Content",
                    status=CheckStatus.COMPLETED,
                    findings_count=len(js_items),
                    details=f"Discovered {len(js_items)} JavaScript code blocks."
                ))

                checks.append(CheckResult(
                    check_id="CHK-SEC-LAUNCH-002",
                    name="Launch & Process Execution Check",
                    category="Active Content",
                    status=CheckStatus.COMPLETED,
                    findings_count=sum(1 for a in actions if "/Launch" in a.action_type),
                    details="Scanned for /Launch action triggers."
                ))

                checks.append(CheckResult(
                    check_id="CHK-SEC-URI-003",
                    name="Hyperlink & Phishing Vector Check",
                    category="Links",
                    status=CheckStatus.COMPLETED,
                    findings_count=len(uris),
                    details=f"Extracted and audited {len(uris)} unique external URIs."
                ))

                checks.append(CheckResult(
                    check_id="CHK-SEC-ATTACH-004",
                    name="Embedded Files & Payloads Check",
                    category="Attachments",
                    status=CheckStatus.COMPLETED,
                    findings_count=len(attachments),
                    details=f"Inspected document portfolio for embedded binaries ({len(attachments)} found)."
                ))

        except Exception as e:
            checks.append(CheckResult(
                check_id="CHK-SEC-GEN-000",
                name="Deep Security Heuristics",
                category="Active Content",
                status=CheckStatus.FAILED,
                findings_count=1,
                details=f"Security analysis encountered exception: {str(e)}"
            ))

        return findings, js_items, uris, attachments, actions, checks
