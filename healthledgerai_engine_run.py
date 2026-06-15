"""
HealthLedgerAI — Config-Driven Engine Run
Demonstrates: rules engine (item #5) + audit trail (item #7) together.

Run:
  python3 healthledgerai_engine_run.py
  python3 healthledgerai_engine_run.py --eopyy      # add EOPYY rules
  python3 healthledgerai_engine_run.py --gesy       # add GESY rules
"""

import sys
from datetime import datetime
from healthledgerai_rules_engine import RulesEngine, load_tables
from healthledgerai_audit import AuditTrail

DATASET_FILE = "HealthLedgerAI_Validation_Dataset_UPLOAD.xlsx"
AUDIT_LOG    = "HealthLedgerAI_Engine_Audit.jsonl"
ACTOR        = "HealthLedgerAI/rules-engine v0.1"
RISK_ICON    = {"HIGH": "🔴", "MEDIUM": "🟡", "LOW": "🟢"}


def main():
    eopyy = "--eopyy" in sys.argv
    gesy  = "--gesy"  in sys.argv

    print("\n  HealthLedgerAI — Config-Driven Compliance Rules Engine")
    mode = " | ".join(filter(None, ["EOPYY rules ON" if eopyy else None,
                                    "GESY rules ON" if gesy else None])) or "Standard mode"
    print(f"  {mode}\n")

    tables = load_tables(DATASET_FILE)
    inv_count = len(tables.get("invoices", []))
    print(f"  Loaded {inv_count} invoices from {DATASET_FILE}\n")

    engine = RulesEngine()
    audit  = AuditTrail(AUDIT_LOG, actor=ACTOR)
    fp     = audit.bind_dataset(DATASET_FILE)
    print(f"  Audit trail → {AUDIT_LOG}  (SHA-256: {fp[:24]}…)\n")

    print("  Running rules...\n")
    alerts = engine.run(tables, eopyy=eopyy, gesy=gesy)
    for a in alerts:
        audit.log_decision(a)

    # ── summary ──────────────────────────────────────────────────────────────
    totals = {r: sum(1 for a in alerts if a["risk"] == r) for r in ("HIGH", "MEDIUM", "LOW")}
    audit.complete(totals)
    result = AuditTrail.verify(AUDIT_LOG)

    by_rule = {}
    for a in alerts:
        by_rule.setdefault(a["rule_id"], []).append(a)

    print("═" * 70)
    print("  COMPLIANCE ANALYSIS — RESULTS")
    print("═" * 70)
    print(f"  Total alerts  : {len(alerts)}")
    print(f"  HIGH risk     : {totals['HIGH']}")
    print(f"  MEDIUM risk   : {totals['MEDIUM']}")
    print("─" * 70)
    for rule_id in sorted(by_rule):
        batch = by_rule[rule_id]
        risk  = batch[0]["risk"]
        name  = batch[0]["detector"]
        print(f"  {RISK_ICON[risk]}  {name:<45}  {len(batch):>3} alert(s)")
    print("─" * 70)
    integrity = "✓ INTACT" if result["ok"] else "✗ TAMPERED"
    print(f"  Audit trail integrity : {integrity}  ({result['entries']} entries)")
    print(f"  Analysed at           : {datetime.now().strftime('%d %b %Y  %H:%M')}")
    print("═" * 70)

    # ── show top HIGH-risk alerts ─────────────────────────────────────────────
    high = [a for a in alerts if a["risk"] == "HIGH"][:5]
    if high:
        print(f"\n  Top {len(high)} HIGH-risk alerts:\n")
        for a in high:
            print(f"  {RISK_ICON['HIGH']} [{a['rule_id']}] {a['detector']}")
            print(f"     Finding  : {a['detail']}")
            print(f"     Action   : {a['action']}")
            print(f"     Legal    : {a['legal_ref'][0] if a['legal_ref'] else '—'}")
            print()

    print(f"  Full audit log → {AUDIT_LOG}\n")


if __name__ == "__main__":
    main()
