"""
DC Scanner - Risk Assessment Engine
Calculates transparent risk scores and assigns risk tiers based on findings, correlation, and check coverage.
"""
from typing import List, Optional
from ..models.schemas import RiskAssessment, RiskLevel, Finding, FindingSeverity, CheckResult, CheckStatus

class RiskEngine:
    @staticmethod
    def calculate(findings: list[Finding], checks: list[CheckResult]) -> RiskAssessment:
        # Check if analysis was incomplete or failed
        failed_critical_checks = [
            c for c in checks if c.status == CheckStatus.FAILED and c.category in ["Active Content", "Structure"]
        ]
        
        if failed_critical_checks and len(findings) == 0:
            return RiskAssessment(
                risk_level=RiskLevel.INCONCLUSIVE,
                risk_score=50,
                safety_score=50,
                verdict_headline="Analysis Inconclusive",
                verdict_summary="Core structural or security checks could not complete due to file corruption or parsing limits. Security guarantees cannot be established.",
                score_breakdown={"check_failure_penalty": 50},
                confidence="LOW"
            )

        # Base scoring
        risk_score = 0
        breakdown: dict[str, int] = {
            "critical_findings": 0,
            "high_findings": 0,
            "medium_findings": 0,
            "low_findings": 0,
            "correlation_penalties": 0
        }

        # Severity tallies
        crit_count = sum(1 for f in findings if f.severity == FindingSeverity.CRITICAL)
        high_count = sum(1 for f in findings if f.severity == FindingSeverity.HIGH)
        med_count = sum(1 for f in findings if f.severity == FindingSeverity.MEDIUM)
        low_count = sum(1 for f in findings if f.severity == FindingSeverity.LOW)

        crit_points = min(crit_count * 70, 95)
        high_points = min(high_count * 35, 80)
        med_points = min(med_count * 15, 45)
        low_points = min(low_count * 5, 20)

        breakdown["critical_findings"] = crit_points
        breakdown["high_findings"] = high_points
        breakdown["medium_findings"] = med_points
        breakdown["low_findings"] = low_points

        risk_score += crit_points + high_points + med_points + low_points

        # Correlation heuristics
        rule_ids = {f.rule_id for f in findings}
        correlation_penalty = 0

        # Correlation 1: OpenAction + JavaScript (automatic zero-click payload execution)
        if "SEC-OPENACTION-001" in rule_ids and "SEC-JS-001" in rule_ids:
            correlation_penalty += 20
        
        # Correlation 2: Trailing data + Nested streams
        if "STRUCT-TRAIL-001" in rule_ids and "STRUCT-STREAM-001" in rule_ids:
            correlation_penalty += 15

        # Correlation 3: Launch action present
        if "SEC-LAUNCH-001" in rule_ids:
            correlation_penalty += 25

        breakdown["correlation_penalties"] = correlation_penalty
        risk_score += correlation_penalty

        # Clamp between 0 and 100
        risk_score = max(0, min(100, risk_score))
        safety_score = max(0, 100 - risk_score)

        # Classification mapping
        if crit_count > 0 or risk_score >= 70:
            level = RiskLevel.HIGH
            headline = "High Threat Risk Detected"
            summary = (
                f"Document contains {crit_count} critical and {high_count} high-severity indicators. "
                "Active payloads or dangerous execution vectors were identified. Do not open or trust without isolation."
            )
        elif high_count > 0 or risk_score >= 40:
            level = RiskLevel.MEDIUM
            headline = "Suspicious Characteristics Identified"
            summary = (
                f"Document exhibits {high_count} high and {med_count} medium-severity features. "
                "Suspicious active content or non-standard structures warrant manual review."
            )
        elif risk_score >= 15 or med_count > 0:
            level = RiskLevel.LOW
            headline = "Low Risk / Minor Warnings"
            summary = (
                "No active malicious triggers detected. Minor informational structural or metadata anomalies were noted."
            )
        else:
            level = RiskLevel.CLEAN
            headline = "No Suspicious Features Detected"
            summary = (
                f"All {len(checks)} security and structure checks completed successfully. "
                "No embedded active scripts, weaponized launch actions, or malicious URLs were found. "
                "Note: Negative scan results do not guarantee absolute absence of unknown zero-day vulnerabilities."
            )

        return RiskAssessment(
            risk_level=level,
            risk_score=risk_score,
            safety_score=safety_score,
            verdict_headline=headline,
            verdict_summary=summary,
            score_breakdown=breakdown,
            confidence="HIGH" if len(failed_critical_checks) == 0 else "MEDIUM"
        )
