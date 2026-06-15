"""
HealthLedgerAI — EOPYY Pre-Validation Runner
Part 4 · Critical Missing item #3 — runner script

Loads the validation dataset, runs EOPYYPreValidator, prints a summary, and
writes every alert to an immutable audit log via AuditTrail.

Usage:
    python3 healthledgerai_eopyy_run.py

Output:
    HealthLedgerAI_EOPYY_PreValidation.jsonl   — hash-chained audit log

Version 0.1 (research prototype) | Maria Polychroniadou | healthledgerai.com
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

import pandas as pd

# ── paths ─────────────────────────────────────────────────────────────────────

BASE_DIR = Path(__file__).parent
DATASET_FILE = BASE_DIR / "HealthLedgerAI_Validation_Dataset_UPLOAD.xlsx"
OUTPUT_FILE = BASE_DIR / "HealthLedgerAI_EOPYY_PreValidation.jsonl"

# ── imports from sibling modules ──────────────────────────────────────────────

sys.path.insert(0, str(BASE_DIR))

from healthledgerai_audit import AuditTrail          # noqa: E402
from healthledgerai_eopyy_validator import EOPYYPreValidator  # noqa: E402

# ── risk display ──────────────────────────────────────────────────────────────

RISK_COLOUR = {
    "HIGH":   "\033[91m",   # red
    "MEDIUM": "\033[93m",   # yellow
    "LOW":    "\033[96m",   # cyan
}
RESET = "\033[0m"


# ── main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    print("=" * 72)
    print("  HealthLedgerAI — EOPYY Claim Pre-Validation")
    print("  EIMC Thessaloniki | ΕΚΠΥ compliance check")
    print("=" * 72)

    # 1. Verify dataset exists.
    if not DATASET_FILE.exists():
        print(f"\n[ERROR] Dataset not found: {DATASET_FILE}")
        sys.exit(1)

    # 2. Load relevant sheets.
    print(f"\nLoading dataset: {DATASET_FILE.name}")
    xl = pd.ExcelFile(str(DATASET_FILE))
    invoices_df = xl.parse("invoices")
    procedure_rates_df = xl.parse("procedure_rates")
    print(
        f"  invoices:        {len(invoices_df):>5} rows, {len(invoices_df.columns)} columns"
    )
    print(
        f"  procedure_rates: {len(procedure_rates_df):>5} rows, {len(procedure_rates_df.columns)} columns"
    )

    # 3. Initialise audit trail.
    audit = AuditTrail(
        path=str(OUTPUT_FILE),
        actor="healthledgerai_eopyy_run.py",
        software="HealthLedgerAI — EOPYY Pre-Validator v0.1",
    )
    audit.bind_dataset(str(DATASET_FILE))
    print(f"\nAudit log initialised: {OUTPUT_FILE.name}  (run_id {audit.run_id})")

    # 4. Run the EOPYY pre-validator.
    print("\nRunning EOPYY pre-validation checks…")
    print("-" * 72)
    validator = EOPYYPreValidator()
    alerts = validator.validate(invoices_df, procedure_rates_df)
    print("-" * 72)

    # 5. Log every alert to the audit trail.
    for alert in alerts:
        audit.log_decision(alert)

    # 6. Print a human-readable summary table.
    total = len(alerts)
    by_rule: dict[str, int] = {}
    by_risk: dict[str, int] = {}
    for a in alerts:
        by_rule[a["rule_id"]] = by_rule.get(a["rule_id"], 0) + 1
        by_risk[a["risk"]] = by_risk.get(a["risk"], 0) + 1

    print(f"\n{'─' * 72}")
    print(f"  EOPYY Pre-Validation Summary — {total} alert(s) found")
    print(f"{'─' * 72}")
    print(f"  {'Rule':<10}  {'Count':>6}  Description")
    print(f"  {'────':<10}  {'─────':>6}  ───────────────────────────────────────")
    for rule_id in ["EOPYY1", "EOPYY2", "EOPYY3", "EOPYY4", "EOPYY5", "EOPYY6"]:
        count = by_rule.get(rule_id, 0)
        from healthledgerai_eopyy_validator import RULES
        name_en = RULES[rule_id]["name"]["en"]
        print(f"  {rule_id:<10}  {count:>6}  {name_en}")

    print(f"\n  Risk breakdown:")
    for risk in ["HIGH", "MEDIUM", "LOW"]:
        c = by_risk.get(risk, 0)
        colour = RISK_COLOUR.get(risk, "")
        print(f"    {colour}{risk:<8}{RESET}  {c:>4} alert(s)")

    # 7. Print the first few alerts for quick inspection.
    if alerts:
        print(f"\n  Sample alerts (first 5 of {total}):")
        print(f"  {'─' * 68}")
        for a in alerts[:5]:
            colour = RISK_COLOUR.get(a["risk"], "")
            print(
                f"  [{colour}{a['risk']:<6}{RESET}] {a['rule_id']:>7} | "
                f"Inv {a['invoice_id']:<10} Pat {a['patient_id']:<6} | "
                f"{a['detail'][:60]}{'…' if len(a['detail']) > 60 else ''}"
            )

    # 8. Close the audit trail run.
    audit.complete(totals={
        "total_alerts": total,
        "by_rule": by_rule,
        "by_risk": by_risk,
    })

    # 9. Verify the chain.
    from healthledgerai_audit import AuditTrail as _AT
    result = _AT.verify(str(OUTPUT_FILE))
    chain_status = "OK ✓" if result["ok"] else f"BROKEN at entry {result['broken_at']}"
    print(f"\n  Audit chain integrity: {chain_status}  ({result['entries']} entries)")

    print(f"\n  Full results written to: {OUTPUT_FILE}")
    print("=" * 72)


if __name__ == "__main__":
    main()
