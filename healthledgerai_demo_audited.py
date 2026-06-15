"""
HealthLedgerAI — Audited Analysis Run
Part 4 · Critical Missing item #7 in action.

Runs the existing 11 billing-compliance detectors (from healthledgerai_demo.py)
and writes EVERY decision to an immutable, tamper-evident audit trail, then
verifies the chain's integrity at the end.

The original healthledgerai_demo.py is left untouched — this is an additive
wrapper, so the presentation-tested script keeps working exactly as before.

Run: python3 healthledgerai_demo_audited.py
Requires: pip install pandas openpyxl
"""

from datetime import datetime

import healthledgerai_demo as core
from healthledgerai_audit import AuditTrail, RISK_LABELS

DATASET_FILE = core.DATASET_FILE
AUDIT_LOG = "HealthLedgerAI_Audit_Trail.jsonl"
ACTOR = "HealthLedgerAI/detector-engine v1.1"


def run():
    print("\n  HealthLedgerAI — Audited Billing Compliance Analysis")
    print("  Loading dataset...\n")

    inv, pat, appt, rates, bundles, nets = core.load_data(DATASET_FILE)
    print(f"  Loaded: {len(inv)} invoices · {len(pat)} patients · {len(appt)} appointments\n")

    # Open the immutable audit trail and bind it to the exact dataset analysed.
    audit = AuditTrail(AUDIT_LOG, actor=ACTOR)
    fp = audit.bind_dataset(DATASET_FILE)
    print(f"  Audit trail opened → {AUDIT_LOG}")
    print(f"  Dataset fingerprint (SHA-256): {fp[:32]}…\n")

    print("  Running 11 detectors (every decision is logged)...\n")
    detectors = [
        ("D1  Duplicate Invoice",   core.detect_duplicate_invoices(inv)),
        ("D2  Upcoding",            core.detect_upcoding(inv, rates)),
        ("D3  Undercoding",         core.detect_undercoding(inv, rates)),
        ("D4  Phantom Billing",     core.detect_phantom_billing(inv, appt)),
        ("D5  Unbundling",          core.detect_unbundling(inv, bundles)),
        ("D6  Unregistered Doctor", core.detect_unregistered_doctor(inv, nets)),
        ("D7  Credit Balance",      core.detect_credit_balance(inv)),
        ("D8  Identity Collision",  core.detect_identity_collision(inv, pat)),
        ("D9  Surprise Billing",    core.detect_surprise_billing(inv, nets)),
        ("D10 Date Mismatch",       core.detect_procedure_date_mismatch(inv, appt)),
        ("D11 Repeated Same-Day",   core.detect_repeated_same_day(inv)),
    ]

    all_alerts = []
    for name, alerts in detectors:
        for a in alerts:
            audit.log_decision(a)          # ← immutable, hash-chained
        print(f"  ✓  {name:<35} {len(alerts):>3} decision(s) logged")
        all_alerts.extend(alerts)

    totals = {r: sum(1 for a in all_alerts if a["risk"] == r) for r in ("HIGH", "MEDIUM", "LOW")}
    audit.complete(totals)

    print("\n" + "═" * 65)
    print("  AUDIT TRAIL — SUMMARY")
    print("═" * 65)
    print(f"  Decisions recorded : {len(all_alerts)}")
    for r in ("HIGH", "MEDIUM", "LOW"):
        if totals[r]:
            print(f"    {RISK_LABELS[r]['en']:<12} ({RISK_LABELS[r]['el']:<16}) {totals[r]:>3}")
    print(f"  Logged at          : {datetime.now().strftime('%d %b %Y  %H:%M')}")
    print("─" * 65)

    # Prove the chain is intact (this is what an auditor would run).
    result = AuditTrail.verify(AUDIT_LOG)
    status = "✓ INTACT — tamper-evident chain verified" if result["ok"] else "✗ TAMPERING DETECTED"
    print(f"  Integrity check    : {status}")
    print(f"  Entries verified   : {result['entries']}  ({result['reason']})")
    print("═" * 65)
    print(f"\n  Immutable log saved → {AUDIT_LOG}")
    print("  Each line is a decision, hash-linked to the previous one.")
    print("  Any edit, deletion, or reorder of a past decision breaks the chain.\n")


if __name__ == "__main__":
    run()
