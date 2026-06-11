"""
HealthLedgerAI — Billing Compliance Detector
Version 1.1 | Maria Polychroniadou | healthledgerai.com

Run: python3 healthledgerai_demo.py
Requires: pip install pandas openpyxl
"""

import pandas as pd
import sys
from datetime import datetime

# ── CONFIG ─────────────────────────────────────────────────────────────────────
DATASET_FILE = "HealthLedgerAI_Validation_Dataset_UPLOAD.xlsx"
REPORT_FILE  = "HealthLedgerAI_Alert_Report.xlsx"

RISK_COLOUR = {"HIGH": "🔴", "MEDIUM": "🟡", "LOW": "🟢"}

# ── LOAD DATA ──────────────────────────────────────────────────────────────────
def load_data(path):
    try:
        inv     = pd.read_excel(path, sheet_name="invoices")
        pat     = pd.read_excel(path, sheet_name="patients")
        appt    = pd.read_excel(path, sheet_name="appointments")
        rates   = pd.read_excel(path, sheet_name="procedure_rates")
        bundles = pd.read_excel(path, sheet_name="bundle_rules").dropna()
        nets    = pd.read_excel(path, sheet_name="insurance_networks")
        return inv, pat, appt, rates, bundles, nets
    except FileNotFoundError:
        print(f"\n  ERROR: Cannot find '{path}'")
        print(  "  Make sure the dataset file is in the same folder as this script.\n")
        sys.exit(1)

# ── HELPERS ────────────────────────────────────────────────────────────────────

def _build_network(nets):
    """Return {insurer: [doctor_id, ...]} from the insurance_networks sheet."""
    network = {}
    for _, r in nets.iterrows():
        doctors = [d.strip() for d in str(r["registered_doctor_ids"]).split(",")]
        network[r["insurer"]] = doctors
    return network

def _date_str(value):
    """Return the date portion of any datetime/string as YYYY-MM-DD."""
    return str(value)[:10]

# ── DETECTORS ──────────────────────────────────────────────────────────────────

def detect_duplicate_invoices(inv):
    """D1 — Same vendor + amount + date billed more than once."""
    dupes = inv[inv.duplicated(subset=["vendor", "amount", "date"], keep=False)].copy()
    alerts = []
    for _, r in dupes.iterrows():
        alerts.append({
            "detector": "D1 · Duplicate Invoice",
            "risk": "HIGH",
            "invoice_id": r["id"],
            "patient_id": r["patient_id"],
            "detail": f"Vendor '{r['vendor']}' | Amount €{r['amount']} | Date {r['date']}",
            "action": "Verify with vendor — reject duplicate before payment.",
        })
    return alerts


def detect_upcoding(inv, rates):
    """D2 — Billed amount exceeds the allowed maximum for the procedure."""
    merged = inv.merge(rates, left_on="procedure", right_on="code", how="left")
    over   = merged[merged["amount"] > merged["max_allowed"]].copy()
    alerts = []
    for _, r in over.iterrows():
        alerts.append({
            "detector": "D2 · Upcoding",
            "risk": "HIGH",
            "invoice_id": r["id"],
            "patient_id": r["patient_id"],
            "detail": (f"Procedure {r['procedure']} ('{r['procedure_desc']}') "
                       f"billed at €{r['amount']} — max allowed €{r['max_allowed']}"),
            "action": "Withhold payment. Request clinical justification.",
        })
    return alerts


def detect_undercoding(inv, rates):
    """D3 — Billed amount below the allowed minimum (possible kickback signal)."""
    merged = inv.merge(rates, left_on="procedure", right_on="code", how="left")
    under  = merged[merged["amount"] < merged["min_allowed"]].copy()
    alerts = []
    for _, r in under.iterrows():
        alerts.append({
            "detector": "D3 · Undercoding",
            "risk": "MEDIUM",
            "invoice_id": r["id"],
            "patient_id": r["patient_id"],
            "detail": (f"Procedure {r['procedure']} billed at €{r['amount']} "
                       f"— min allowed €{r['min_allowed']}"),
            "action": "Review — may indicate informal discount arrangement.",
        })
    return alerts


def detect_phantom_billing(inv, appt):
    """D4 — Invoice date has no appointment record for that patient."""
    # Trim both sides to YYYY-MM-DD so datetime timestamps don't cause false positives.
    appt_dates = set(zip(appt["patient_id"], appt["date"].astype(str).str[:10]))
    alerts = []
    for _, r in inv.iterrows():
        inv_date = _date_str(r["date"])
        if (r["patient_id"], inv_date) not in appt_dates:
            alerts.append({
                "detector": "D4 · Phantom Billing",
                "risk": "HIGH",
                "invoice_id": r["id"],
                "patient_id": r["patient_id"],
                "detail": f"No appointment found for patient {r['patient_id']} on {inv_date}",
                "action": "Verify patient was physically present. Do not pay without confirmation.",
            })
    return alerts


def detect_unbundling(inv, bundles):
    """D5 — Bundle component codes billed individually on the same day for the same patient."""
    # Compute once — not inside the bundle loop.
    patient_day = (
        inv.groupby(["patient_id", "date"])["procedure"]
        .apply(list)
        .reset_index()
    )
    alerts = []
    for _, b in bundles.iterrows():
        bundle_name = b["bundle"]
        members = [c.strip() for c in str(b["member_codes"]).split(",")]
        for _, row in patient_day.iterrows():
            found = [m for m in members if m in row["procedure"]]
            if len(found) >= 2:
                alerts.append({
                    "detector": "D5 · Unbundling",
                    "risk": "HIGH",
                    "invoice_id": "Multiple",
                    "patient_id": row["patient_id"],
                    "detail": (f"Bundle '{bundle_name}' — components {found} "
                               f"billed separately on {row['date']}"),
                    "action": "Rebill as single bundle code. Reject individual claims.",
                })
    return alerts


def detect_unregistered_doctor(inv, nets):
    """D6 — Doctor not registered with the patient's insurer."""
    network = _build_network(nets)
    alerts  = []
    for _, r in inv.iterrows():
        if pd.isna(r["insurer"]) or pd.isna(r["doctor_id"]):
            continue
        if r["doctor_id"] not in network.get(r["insurer"], []):
            alerts.append({
                "detector": "D6 · Unregistered Doctor",
                "risk": "HIGH",
                "invoice_id": r["id"],
                "patient_id": r["patient_id"],
                "detail": (f"Doctor {r['doctor_id']} ({r['doctor_name']}) "
                           f"not registered with {r['insurer']}"),
                "action": "Claim invalid. Notify insurer. Investigate referral pathway.",
            })
    return alerts


def detect_credit_balance(inv):
    """D7 — Amount paid exceeds invoice amount (overpayment accumulation)."""
    over   = inv[inv["amount_paid"] > inv["amount"]].copy()
    alerts = []
    for _, r in over.iterrows():
        excess = r["amount_paid"] - r["amount"]
        alerts.append({
            "detector": "D7 · Credit Balance Accumulation",
            "risk": "MEDIUM",
            "invoice_id": r["id"],
            "patient_id": r["patient_id"],
            "detail": f"Overpaid by €{excess:.2f} (billed €{r['amount']}, paid €{r['amount_paid']})",
            "action": "Issue refund or apply credit note. Log in ledger.",
        })
    return alerts


def detect_identity_collision(inv, pat):
    """D8 — Different patient IDs share the same name and date of birth."""
    # Normalise DOB to YYYY-MM-DD so time components don't break grouping.
    pat = pat.copy()
    pat["dob_str"]  = pd.to_datetime(pat["dob"]).dt.date.astype(str)
    pat["full_key"] = pat["first"] + "|" + pat["last"] + "|" + pat["dob_str"]
    dupes  = pat[pat.duplicated(subset=["full_key"], keep=False)]
    alerts = []
    for key, group in dupes.groupby("full_key"):
        ids               = group["id"].tolist()
        affected_invoices = inv[inv["patient_id"].isin(ids)]["id"].tolist()
        alerts.append({
            "detector": "D8 · Patient Identity Collision",
            "risk": "HIGH",
            "invoice_id": ", ".join(str(i) for i in affected_invoices[:5]) + ("…" if len(affected_invoices) > 5 else ""),
            "patient_id": " / ".join(str(i) for i in ids),
            "detail": f"Patient IDs {ids} share identical name and DOB: {key.replace('|', ' | ')}",
            "action": "Freeze both accounts. Manual identity verification required.",
        })
    return alerts


def detect_surprise_billing(inv, nets):
    """D9 — Patient billed out-of-pocket when insurer is on file and doctor is out-of-network."""
    network = _build_network(nets)
    alerts  = []
    for _, r in inv.iterrows():
        if r["payment_method"] in ("cash", "card") and not pd.isna(r["insurer"]):
            if r["doctor_id"] not in network.get(r["insurer"], []):
                alerts.append({
                    "detector": "D9 · Surprise Billing",
                    "risk": "HIGH",
                    "invoice_id": r["id"],
                    "patient_id": r["patient_id"],
                    "detail": (f"Patient billed {r['payment_method'].upper()} despite having "
                               f"{r['insurer']} — doctor {r['doctor_id']} out-of-network"),
                    "action": "Patient must be notified. Possible regulatory violation.",
                })
    return alerts


def detect_procedure_date_mismatch(inv, appt):
    """D10 — Invoice date does not match the recorded appointment date for that patient."""
    alerts = []
    for _, r in inv.iterrows():
        if pd.isna(r.get("appointment_date")):
            continue
        inv_date  = _date_str(r["date"])
        appt_date = _date_str(r["appointment_date"])
        if inv_date != appt_date:
            alerts.append({
                "detector": "D10 · Date Mismatch",
                "risk": "MEDIUM",
                "invoice_id": r["id"],
                "patient_id": r["patient_id"],
                "detail": f"Invoice date {inv_date} ≠ appointment date {appt_date}",
                "action": "Verify correct date before submitting to insurer.",
            })
    return alerts


def detect_repeated_same_day(inv):
    """D11 — Same patient billed for identical procedure more than once on the same day."""
    grp   = inv.groupby(["patient_id", "date", "procedure"]).size().reset_index(name="count")
    multi = grp[grp["count"] > 1]
    alerts = []
    for _, r in multi.iterrows():
        inv_ids = inv[
            (inv["patient_id"] == r["patient_id"]) &
            (inv["date"]       == r["date"]) &
            (inv["procedure"]  == r["procedure"])
        ]["id"].tolist()
        alerts.append({
            "detector": "D11 · Repeated Same-Day Procedure",
            "risk": "MEDIUM",
            "invoice_id": ", ".join(str(i) for i in inv_ids),
            "patient_id": r["patient_id"],
            "detail": f"Procedure {r['procedure']} billed {r['count']}x on {r['date']}",
            "action": "Verify clinical notes confirm multiple administrations.",
        })
    return alerts

# ── REPORT ─────────────────────────────────────────────────────────────────────

def _detector_sort_key(name):
    """Sort 'D10 · ...' numerically so D10 comes after D9, not before D2."""
    try:
        return int(name.split("·")[0].strip()[1:])
    except (ValueError, IndexError):
        return 99


def print_summary(all_alerts):
    counts = {}
    for a in all_alerts:
        d = a["detector"]
        counts[d] = counts.get(d, 0) + 1

    print("\n" + "═" * 65)
    print("  HealthLedgerAI — ALERT SUMMARY")
    print("═" * 65)
    print(f"  Total alerts flagged: {len(all_alerts)}")
    print(f"  Analysed: {datetime.now().strftime('%d %b %Y  %H:%M')}")
    print("─" * 65)
    for det in sorted(counts, key=_detector_sort_key):
        risk = next(a["risk"] for a in all_alerts if a["detector"] == det)
        print(f"  {RISK_COLOUR[risk]}  {det:<40}  {counts[det]:>3} alert(s)")
    print("═" * 65 + "\n")


def print_alerts(all_alerts, limit=5):
    high = [a for a in all_alerts if a["risk"] == "HIGH"]
    print(f"  Showing top {min(limit, len(high))} HIGH-RISK alerts:\n")
    for a in high[:limit]:
        print(f"  {RISK_COLOUR['HIGH']} [{a['detector']}]")
        print(f"     Invoice : {a['invoice_id']}")
        print(f"     Patient : {a['patient_id']}")
        print(f"     Finding : {a['detail']}")
        print(f"     Action  : {a['action']}")
        print()


def save_report(all_alerts, path):
    df = pd.DataFrame(all_alerts)
    with pd.ExcelWriter(path, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="All Alerts")
        for risk in ["HIGH", "MEDIUM", "LOW"]:
            sub = df[df["risk"] == risk]
            if not sub.empty:
                sub.to_excel(writer, index=False, sheet_name=f"{risk} Priority")
    print(f"  Report saved → {path}\n")

# ── MAIN ───────────────────────────────────────────────────────────────────────

def main():
    print("\n  HealthLedgerAI — Billing Compliance Analysis")
    print("  Loading dataset...\n")

    inv, pat, appt, rates, bundles, nets = load_data(DATASET_FILE)
    print(f"  Loaded: {len(inv)} invoices · {len(pat)} patients · {len(appt)} appointments\n")
    print("  Running 11 detectors...\n")

    detectors = [
        ("D1  Duplicate Invoice",   detect_duplicate_invoices(inv)),
        ("D2  Upcoding",            detect_upcoding(inv, rates)),
        ("D3  Undercoding",         detect_undercoding(inv, rates)),
        ("D4  Phantom Billing",     detect_phantom_billing(inv, appt)),
        ("D5  Unbundling",          detect_unbundling(inv, bundles)),
        ("D6  Unregistered Doctor", detect_unregistered_doctor(inv, nets)),
        ("D7  Credit Balance",      detect_credit_balance(inv)),
        ("D8  Identity Collision",  detect_identity_collision(inv, pat)),
        ("D9  Surprise Billing",    detect_surprise_billing(inv, nets)),
        ("D10 Date Mismatch",       detect_procedure_date_mismatch(inv, appt)),
        ("D11 Repeated Same-Day",   detect_repeated_same_day(inv)),
    ]

    all_alerts = []
    for name, alerts in detectors:
        print(f"  ✓  {name:<35} {len(alerts):>3} alert(s)")
        all_alerts.extend(alerts)

    print_summary(all_alerts)
    print_alerts(all_alerts, limit=5)
    save_report(all_alerts, REPORT_FILE)
    print("  Done. Open HealthLedgerAI_Alert_Report.xlsx for the full report.")
    print("  ─────────────────────────────────────────────────────────────\n")


if __name__ == "__main__":
    main()
