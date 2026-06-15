"""
HealthLedgerAI — EOPYY Pre-Validation Runner
Part 4 · Critical Missing item #3 — runner script

Loads the validation dataset, runs EOPYYPreValidator, prints a summary, and
writes every alert to an immutable audit log via AuditTrail.

Two-phase validation:
  Phase A — Full dataset scan (506 invoices, all INS-1…INS-4).
             Shows EOPYY4 alerts: no invoice in this dataset carries an EOPYY
             insurer tag, so all are flagged as "routed to wrong validator".
             This is the correct behaviour — the dataset is a private-insurer
             batch, not an EOPYY submission batch.

  Phase B — Synthetic EOPYY mini-batch injected for demonstration.
             Eight hand-crafted EOPYY rows exercise all six rules:
               EOPYY1 tariff ceiling, EOPYY2 missing fields,
               EOPYY3 deadline, EOPYY5 duplicate, EOPYY6 co-payment.

Usage:
    python3 healthledgerai_eopyy_run.py

Output:
    HealthLedgerAI_EOPYY_PreValidation.jsonl   — hash-chained audit log

Version 0.1 (research prototype) | Maria Polychroniadou | healthledgerai.com
"""

from __future__ import annotations

import datetime
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

from healthledgerai_audit import AuditTrail                   # noqa: E402
from healthledgerai_eopyy_validator import EOPYYPreValidator, RULES  # noqa: E402

# ── risk display ──────────────────────────────────────────────────────────────

RISK_COLOUR = {
    "HIGH":   "\033[91m",   # red
    "MEDIUM": "\033[93m",   # yellow
    "LOW":    "\033[96m",   # cyan
}
RESET = "\033[0m"


# ── synthetic EOPYY demo rows ─────────────────────────────────────────────────

def _build_synthetic_eopyy_batch() -> pd.DataFrame:
    """
    Build a small synthetic EOPYY submission batch that exercises all 6 rules.

    Row design:
      SYN001 — EOPYY1: P005 CT scan billed at €950 > max_allowed €900
      SYN002 — EOPYY2: missing doctor_id
      SYN003 — EOPYY3: service date 2025-10-01 (>6 months before 2026-06-15)
      SYN004 — EOPYY5: duplicate of SYN005 (same patient+procedure+date)
      SYN005 — EOPYY5: duplicate of SYN004
      SYN006 — EOPYY6: paid €60 on a €100 bill → shortfall €40 ≠ 20% (€20)
      SYN007 — clean row (should produce zero alerts)
      SYN008 — EOPYY4: non-EOPYY insurer in a mixed EOPYY batch
    """
    rows = [
        # SYN001 — tariff ceiling exceeded (P005 max=900, billed 950)
        {
            "id": "SYN001", "patient_id": "P201", "first": "Test", "last": "Alpha",
            "dob": "1970-01-01", "vendor": "EIMC Dept A", "procedure": "P005",
            "procedure_desc": "CT scan abdomen", "amount": 950.0,
            "date": "2026-05-10", "doctor_id": "D01", "doctor_name": "Doctor 01",
            "insurer": "EOPYY", "payment_method": "insurance", "amount_paid": 760.0,
            "appointment_date": "2026-05-10",
        },
        # SYN002 — missing doctor_id (required field blank)
        {
            "id": "SYN002", "patient_id": "P202", "first": "Test", "last": "Beta",
            "dob": "1965-03-15", "vendor": "EIMC Dept B", "procedure": "P001",
            "procedure_desc": "General consultation", "amount": 60.0,
            "date": "2026-04-20", "doctor_id": "",  # <-- MISSING
            "doctor_name": "", "insurer": "EOPYY", "payment_method": "insurance",
            "amount_paid": 48.0, "appointment_date": "2026-04-20",
        },
        # SYN003 — submission deadline exceeded (service 2025-10-01, >6 months ago)
        {
            "id": "SYN003", "patient_id": "P203", "first": "Test", "last": "Gamma",
            "dob": "1958-07-22", "vendor": "EIMC Dept C", "procedure": "P003",
            "procedure_desc": "Chest X-ray", "amount": 100.0,
            "date": "2025-10-01",  # <-- OLD DATE
            "doctor_id": "D02", "doctor_name": "Doctor 02",
            "insurer": "EOPYY", "payment_method": "insurance", "amount_paid": 80.0,
            "appointment_date": "2025-10-01",
        },
        # SYN004 — duplicate claim (same patient P204, P002, 2026-06-01)
        {
            "id": "SYN004", "patient_id": "P204", "first": "Test", "last": "Delta",
            "dob": "1980-11-05", "vendor": "EIMC Dept A", "procedure": "P002",
            "procedure_desc": "Blood test - basic panel", "amount": 45.0,
            "date": "2026-06-01", "doctor_id": "D03", "doctor_name": "Doctor 03",
            "insurer": "EOPYY", "payment_method": "insurance", "amount_paid": 36.0,
            "appointment_date": "2026-06-01",
        },
        # SYN005 — duplicate of SYN004
        {
            "id": "SYN005", "patient_id": "P204", "first": "Test", "last": "Delta",
            "dob": "1980-11-05", "vendor": "EIMC Dept B", "procedure": "P002",
            "procedure_desc": "Blood test - basic panel", "amount": 45.0,
            "date": "2026-06-01",  # same patient+procedure+date
            "doctor_id": "D03", "doctor_name": "Doctor 03",
            "insurer": "EOPYY", "payment_method": "insurance", "amount_paid": 36.0,
            "appointment_date": "2026-06-01",
        },
        # SYN006 — co-payment arithmetic error (billed 100, paid 60 → shortfall 40 ≠ 20%)
        {
            "id": "SYN006", "patient_id": "P205", "first": "Test", "last": "Epsilon",
            "dob": "1990-06-30", "vendor": "EIMC Dept D", "procedure": "P001",
            "procedure_desc": "General consultation", "amount": 100.0,
            "date": "2026-05-25", "doctor_id": "D04", "doctor_name": "Doctor 04",
            "insurer": "EOPYY", "payment_method": "insurance",
            "amount_paid": 60.0,  # shortfall=40, but 20% of 100=20 → diff=20 > €1
            "appointment_date": "2026-05-25",
        },
        # SYN007 — clean row (no rule should fire)
        {
            "id": "SYN007", "patient_id": "P206", "first": "Test", "last": "Zeta",
            "dob": "1975-09-14", "vendor": "EIMC Dept A", "procedure": "P004",
            "procedure_desc": "ECG", "amount": 70.0,
            "date": "2026-06-10", "doctor_id": "D05", "doctor_name": "Doctor 05",
            "insurer": "EOPYY", "payment_method": "insurance", "amount_paid": 56.0,
            "appointment_date": "2026-06-10",
        },
        # SYN008 — non-EOPYY insurer accidentally included in EOPYY batch (EOPYY4)
        {
            "id": "SYN008", "patient_id": "P207", "first": "Test", "last": "Eta",
            "dob": "1963-02-18", "vendor": "EIMC Dept C", "procedure": "P007",
            "procedure_desc": "Ultrasound", "amount": 150.0,
            "date": "2026-06-05", "doctor_id": "D06", "doctor_name": "Doctor 06",
            "insurer": "INS-2",  # <-- not EOPYY → EOPYY4
            "payment_method": "insurance", "amount_paid": 150.0,
            "appointment_date": "2026-06-05",
        },
    ]
    return pd.DataFrame(rows)


# ── helpers ───────────────────────────────────────────────────────────────────

def _print_summary(alerts: list[dict], phase_label: str) -> None:
    total = len(alerts)
    by_rule: dict[str, int] = {}
    by_risk: dict[str, int] = {}
    for a in alerts:
        by_rule[a["rule_id"]] = by_rule.get(a["rule_id"], 0) + 1
        by_risk[a["risk"]] = by_risk.get(a["risk"], 0) + 1

    print(f"\n{'─' * 72}")
    print(f"  {phase_label} — {total} alert(s) found")
    print(f"{'─' * 72}")
    print(f"  {'Rule':<10}  {'Count':>6}  Description")
    print(f"  {'────':<10}  {'─────':>6}  ───────────────────────────────────────")
    for rule_id in ["EOPYY1", "EOPYY2", "EOPYY3", "EOPYY4", "EOPYY5", "EOPYY6"]:
        count = by_rule.get(rule_id, 0)
        name_en = RULES[rule_id]["name"]["en"]
        print(f"  {rule_id:<10}  {count:>6}  {name_en}")

    print(f"\n  Risk breakdown:")
    for risk in ["HIGH", "MEDIUM", "LOW"]:
        c = by_risk.get(risk, 0)
        colour = RISK_COLOUR.get(risk, "")
        print(f"    {colour}{risk:<8}{RESET}  {c:>4} alert(s)")

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

    validator = EOPYYPreValidator()

    # ── Phase A: full dataset scan ────────────────────────────────────────────
    print("\n" + "─" * 72)
    print("  PHASE A — Full Dataset Scan (506 invoices, all private insurers)")
    print("  Expected: EOPYY4 fires for every invoice (none have insurer=EOPYY)")
    print("─" * 72)
    alerts_a = validator.validate(invoices_df, procedure_rates_df)
    _print_summary(alerts_a, "Phase A Summary")

    for alert in alerts_a:
        audit.log_decision(alert)

    # ── Phase B: synthetic EOPYY mini-batch ───────────────────────────────────
    print("\n" + "─" * 72)
    print("  PHASE B — Synthetic EOPYY Mini-Batch (8 rows, all 6 rules exercised)")
    print("─" * 72)
    synthetic_df = _build_synthetic_eopyy_batch()
    alerts_b = validator.validate(synthetic_df, procedure_rates_df)
    _print_summary(alerts_b, "Phase B Summary")

    for alert in alerts_b:
        audit.log_decision(alert)

    # ── Combined totals ───────────────────────────────────────────────────────
    all_alerts = alerts_a + alerts_b
    total = len(all_alerts)
    by_rule: dict[str, int] = {}
    by_risk: dict[str, int] = {}
    for a in all_alerts:
        by_rule[a["rule_id"]] = by_rule.get(a["rule_id"], 0) + 1
        by_risk[a["risk"]] = by_risk.get(a["risk"], 0) + 1

    # Close the audit trail run with combined totals.
    audit.complete(totals={
        "total_alerts": total,
        "phase_a_alerts": len(alerts_a),
        "phase_b_alerts": len(alerts_b),
        "by_rule": by_rule,
        "by_risk": by_risk,
    })

    # ── Chain verification ────────────────────────────────────────────────────
    result = AuditTrail.verify(str(OUTPUT_FILE))
    chain_status = "OK" if result["ok"] else f"BROKEN at entry {result['broken_at']}"
    print(f"\n{'─' * 72}")
    print(f"  Combined totals: {total} alert(s)  |  "
          f"Audit chain: {chain_status} ({result['entries']} entries)")
    print(f"  Full results written to: {OUTPUT_FILE.name}")
    print("=" * 72)


if __name__ == "__main__":
    main()
