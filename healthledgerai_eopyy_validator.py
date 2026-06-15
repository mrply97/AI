"""
HealthLedgerAI — EOPYY Claim Pre-Validation Module
Part 4 · Critical Missing item #3 — "EOPYY claim pre-validation module"

Why this exists
---------------
EOPYY (Εθνικός Οργανισμός Παροχής Υπηρεσιών Υγείας — Greece's national health
insurer) operates a contracted-provider scheme.  Private clinics such as EIMC
Thessaloniki that hold EOPYY contracts must submit claims that satisfy a strict
set of requirements defined in the ΕΚΠΥ (Ενιαίος Κανονισμός Παροχών Υγείας).
Claims that fail any of these requirements are auto-rejected by EOPYY's batch
processing system before a human even sees them.

This module is a *pre-flight* validator: run it locally (on-premise, no network)
before submitting a batch to EOPYY.  It catches the six most common rejection
reasons:

  EOPYY1  ΕΚΠΥ tariff ceiling exceeded (Ν. 4238/2014 Art. 33)
  EOPYY2  Required claim fields missing (Ν. 4238/2014 Art. 34)
  EOPYY3  Submission outside 6-month deadline (ΕΚΠΥ Art. 5)
  EOPYY4  Claim routed to wrong validator — insurer is not EOPYY
  EOPYY5  Duplicate claim for same patient + procedure + date (ΕΚΠΥ Art. 4)
  EOPYY6  Co-payment arithmetic error — shortfall ≠ 20% (ΕΚΠΥ Art. 8)

Design notes
------------
  • Pure standard library + pandas — no additional pip installs required.
  • Bilingual labels (Greek / English) on every rule and alert.
  • Legal_ref on every alert — satisfies EU AI Act Art. 12 and GDPR Art. 30.
  • Graceful degradation: if a column expected by a rule does not exist in the
    DataFrame (e.g. icd10_code, pre_auth_flag), the rule emits a warning and
    skips rather than raising an exception.
  • On-premise mindset: no network calls, no external services.
  • EOPYY-only scope: AMC Cyprus is a GESY hospital, not EOPYY-contracted.
    This module must never be run against AMC Cyprus batches.

Version 0.1 (research prototype) | Maria Polychroniadou | healthledgerai.com
"""

from __future__ import annotations

import datetime
from typing import Optional

import pandas as pd

# ── module constants ──────────────────────────────────────────────────────────

VERSION = "0.1"

# Canonical insurer identifiers that mark a claim as an EOPYY claim.
# Match is case-insensitive; partial matches are accepted (e.g. "ΕΟΠΥΥ", "EOPYY-C").
EOPYY_INSURER_TOKENS = ["eopyy", "εοπυυ"]

# Co-payment rate mandated by ΕΚΠΥ Art. 8 for standard procedures.
COPAY_RATE = 0.20

# Tolerance (€) for co-payment arithmetic comparison.
COPAY_TOLERANCE_EUR = 1.0

# Submission deadline (months from service date).
SUBMISSION_DEADLINE_MONTHS = 6

# Reference date used for deadline calculation (injected at run time; defaults to today).
_TODAY = datetime.date(2026, 6, 15)  # frozen for reproducible demo


# ── rule metadata registry ────────────────────────────────────────────────────

RULES: dict[str, dict] = {
    "EOPYY1": {
        "id": "EOPYY1",
        "name": {
            "el": "Υπέρβαση Ανωτάτου Ορίου ΕΚΠΥ",
            "en": "ΕΚΠΥ Tariff Ceiling Exceeded",
        },
        "risk": "HIGH",
        "legal_ref": [
            "ΕΚΠΥ — Ενιαίος Κανονισμός Παροχών Υγείας (ισχύουσα έκδοση)",
            "Ν. 4238/2014, άρθρο 33 (αμοιβές παρόχων ΕΟΠΥΥ)",
        ],
        "action": (
            "Μειώστε το ποσό στο ανώτατο επιτρεπτό όριο ΕΚΠΥ πριν την υποβολή. "
            "Reduce invoice amount to ΕΚΠΥ ceiling before EOPYY submission."
        ),
    },
    "EOPYY2": {
        "id": "EOPYY2",
        "name": {
            "el": "Ελλιπή Υποχρεωτικά Πεδία",
            "en": "Missing Required Claim Fields",
        },
        "risk": "HIGH",
        "legal_ref": [
            "ΕΚΠΥ — υποχρεωτικά πεδία αίτησης εκκαθάρισης ΕΟΠΥΥ",
            "Ν. 4238/2014, άρθρο 34 (τεκμηρίωση αίτησης)",
        ],
        "action": (
            "Συμπληρώστε τα ελλείποντα πεδία. Η αίτηση θα απορριφθεί αυτόματα. "
            "Complete missing fields before submission — claim will be auto-rejected."
        ),
    },
    "EOPYY3": {
        "id": "EOPYY3",
        "name": {
            "el": "Εκπρόθεσμη Υποβολή (παραγραφή)",
            "en": "Submission Deadline Exceeded",
        },
        "risk": "HIGH",
        "legal_ref": [
            "ΕΚΠΥ, άρθρο 5 (παραγραφή αξιώσεων — 6 μήνες από παροχή)",
            "Ν. 4238/2014, άρθρο 5 (προθεσμία υποβολής αιτήσεων)",
        ],
        "action": (
            "Αξίωση πεπαλαιωμένη — δεν γίνεται δεκτή από ΕΟΠΥΥ. "
            "Claim is statute-barred. EOPYY will reject. Review for exceptional appeal."
        ),
    },
    "EOPYY4": {
        "id": "EOPYY4",
        "name": {
            "el": "Αίτηση σε Λάθος Επικυρωτή (Μη ΕΟΠΥΥ Ασφαλιστής)",
            "en": "Claim Routed to Wrong Validator (Non-EOPYY Insurer)",
        },
        "risk": "MEDIUM",
        "legal_ref": [
            "ΕΚΠΥ — πεδίο εφαρμογής (μόνο ασφαλισμένοι ΕΟΠΥΥ)",
            "Ν. 4238/2014, άρθρο 2 (ορισμός ασφαλισμένου ΕΟΠΥΥ)",
        ],
        "action": (
            "Δρομολογήστε στον κατάλληλο επικυρωτή για τον ασφαλιστή. "
            "Route claim to the correct validator for this insurer. Remove from EOPYY batch."
        ),
    },
    "EOPYY5": {
        "id": "EOPYY5",
        "name": {
            "el": "Διπλοεγγραφή Αίτησης ΕΟΠΥΥ",
            "en": "Duplicate EOPYY Claim",
        },
        "risk": "HIGH",
        "legal_ref": [
            "ΕΚΠΥ, άρθρο 4 (αποφυγή διπλοεγγραφής)",
            "Ν. 4254/2014, άρθρο 66 (αδικαιολόγητος πλουτισμός / anti-corruption)",
        ],
        "action": (
            "Αφαιρέστε το διπλό τιμολόγιο από τη δέσμη υποβολής. "
            "Remove duplicate invoice from submission batch. Keep only one instance."
        ),
    },
    "EOPYY6": {
        "id": "EOPYY6",
        "name": {
            "el": "Σφάλμα Αριθμητικής Συμμετοχής Ασθενούς",
            "en": "Co-payment Arithmetic Error",
        },
        "risk": "MEDIUM",
        "legal_ref": [
            "ΕΚΠΥ, άρθρο 8 (συμμετοχή ασθενούς — 20% για τυπικές πράξεις)",
            "Ν. 4238/2014, άρθρο 8 (ποσοστό συμμετοχής)",
        ],
        "action": (
            "Επαληθεύστε το ποσό συμμετοχής. Διορθώστε πριν από την υποβολή στον ΕΟΠΥΥ. "
            "Verify co-payment amount. Correct before EOPYY submission to avoid rejection."
        ),
    },
}

# Required fields for EOPYY claim completeness (EOPYY2).
EOPYY_REQUIRED_FIELDS = ["doctor_id", "procedure", "patient_id", "date", "insurer"]


# ── internal helpers ──────────────────────────────────────────────────────────

def _is_eopyy_insurer(value: str) -> bool:
    """Return True if *value* identifies an EOPYY insurer (case-insensitive)."""
    v = str(value).lower().strip()
    return any(token in v for token in EOPYY_INSURER_TOKENS)


def _build_alert(
    rule_key: str,
    invoice_id: str,
    patient_id: str,
    detail: str,
) -> dict:
    """Assemble a standardised alert dict from the rule registry."""
    rule = RULES[rule_key]
    return {
        "rule_id":     rule["id"],
        "detector":    f"{rule['id']} · {rule['name']['en']}",
        "detector_el": f"{rule['id']} · {rule['name']['el']}",
        "risk":        rule["risk"],
        "legal_ref":   rule["legal_ref"],
        "invoice_id":  str(invoice_id),
        "patient_id":  str(patient_id),
        "detail":      detail,
        "action":      rule["action"],
    }


def _require_columns(df: pd.DataFrame, cols: list[str], rule_id: str) -> bool:
    """
    Check that *df* contains all *cols*.  Print a warning for any that are
    missing and return False if at least one is absent (so the caller can skip).
    """
    missing = [c for c in cols if c not in df.columns]
    if missing:
        print(
            f"  [EOPYY pre-validator] WARNING: rule {rule_id} skipped — "
            f"column(s) not found in invoice DataFrame: {missing}"
        )
        return False
    return True


def _parse_date(value) -> Optional[datetime.date]:
    """Parse a date value to datetime.date, returning None on failure."""
    if pd.isna(value):
        return None
    try:
        return pd.to_datetime(value).date()
    except Exception:
        return None


# ── individual rule detectors ─────────────────────────────────────────────────

def _check_eopyy1_tariff_ceiling(
    eopyy_df: pd.DataFrame,
    procedure_rates_df: pd.DataFrame,
) -> list[dict]:
    """
    EOPYY1 — ΕΚΠΥ Tariff Ceiling.

    Join EOPYY invoices to procedure_rates on procedure code; flag any row
    where amount exceeds max_allowed.  Rows with no matching rate entry are
    skipped (warn once).

    Legal: ΕΚΠΥ Ενιαίος Κανονισμός Παροχών Υγείας, Ν. 4238/2014 Art. 33.
    """
    needed_inv = ["id", "patient_id", "procedure", "amount"]
    needed_ref = ["code", "max_allowed"]
    if not _require_columns(eopyy_df, needed_inv, "EOPYY1"):
        return []
    if not _require_columns(procedure_rates_df, needed_ref, "EOPYY1"):
        return []

    merged = eopyy_df.merge(
        procedure_rates_df[["code", "max_allowed", "description"]],
        left_on="procedure",
        right_on="code",
        how="left",
    )

    unmatched = merged["max_allowed"].isna().sum()
    if unmatched:
        print(
            f"  [EOPYY pre-validator] WARNING: EOPYY1 — {unmatched} invoice(s) have "
            "no matching procedure code in procedure_rates; skipped for tariff check."
        )

    flagged = merged[
        merged["max_allowed"].notna() & (merged["amount"] > merged["max_allowed"])
    ]

    alerts = []
    for _, row in flagged.iterrows():
        detail = (
            f"Procedure {row['procedure']} ('{row.get('description', row.get('procedure_desc', ''))}') "
            f"billed at €{row['amount']:.2f} — ΕΚΠΥ ceiling is €{row['max_allowed']:.2f} "
            f"(excess €{row['amount'] - row['max_allowed']:.2f})"
        )
        alerts.append(_build_alert("EOPYY1", row["id"], row["patient_id"], detail))
    return alerts


def _check_eopyy2_required_fields(eopyy_df: pd.DataFrame) -> list[dict]:
    """
    EOPYY2 — Required Fields Completeness.

    Check each EOPYY invoice for null or blank values in the mandatory fields
    defined by ΕΚΠΥ.  Missing columns in the DataFrame trigger a warning and
    are excluded from the check (not a crash).

    Legal: ΕΚΠΥ υποχρεωτικά πεδία, Ν. 4238/2014 Art. 34.
    """
    present_required = [f for f in EOPYY_REQUIRED_FIELDS if f in eopyy_df.columns]
    absent = [f for f in EOPYY_REQUIRED_FIELDS if f not in eopyy_df.columns]
    if absent:
        print(
            f"  [EOPYY pre-validator] WARNING: EOPYY2 — column(s) {absent} not found "
            "in invoice DataFrame; excluded from required-fields check."
        )
    if not present_required:
        return []

    alerts = []
    for _, row in eopyy_df.iterrows():
        missing = [
            f for f in present_required
            if pd.isna(row.get(f)) or str(row.get(f, "")).strip() == ""
        ]
        if missing:
            detail = (
                f"Invoice {row.get('id', '?')} is missing required EOPYY field(s): "
                f"{', '.join(missing)}"
            )
            alerts.append(
                _build_alert("EOPYY2", row.get("id", ""), row.get("patient_id", ""), detail)
            )
    return alerts


def _check_eopyy3_submission_deadline(
    eopyy_df: pd.DataFrame,
    today: datetime.date,
) -> list[dict]:
    """
    EOPYY3 — Submission Deadline.

    EOPYY claims must be submitted within 6 months of the service date.
    Any claim whose service date is more than 6 calendar months before *today*
    is flagged as potentially statute-barred.

    Legal: ΕΚΠΥ Art. 5 (παραγραφή αξιώσεων).
    """
    if not _require_columns(eopyy_df, ["id", "patient_id", "date"], "EOPYY3"):
        return []

    # Compute cutoff: 6 months before today.
    # Use simple month arithmetic to avoid a dateutil dependency.
    cutoff_month = today.month - SUBMISSION_DEADLINE_MONTHS
    cutoff_year = today.year
    while cutoff_month <= 0:
        cutoff_month += 12
        cutoff_year -= 1
    try:
        cutoff = datetime.date(cutoff_year, cutoff_month, today.day)
    except ValueError:
        # today.day may not exist in cutoff month (e.g. 31st Jan → 31st July)
        import calendar
        last_day = calendar.monthrange(cutoff_year, cutoff_month)[1]
        cutoff = datetime.date(cutoff_year, cutoff_month, min(today.day, last_day))

    alerts = []
    for _, row in eopyy_df.iterrows():
        svc_date = _parse_date(row.get("date"))
        if svc_date is None:
            continue
        if svc_date < cutoff:
            days_over = (today - svc_date).days
            detail = (
                f"Service date {svc_date} is {days_over} days before today ({today}); "
                f"EOPYY 6-month deadline expired on {cutoff}. Claim is statute-barred."
            )
            alerts.append(
                _build_alert("EOPYY3", row.get("id", ""), row.get("patient_id", ""), detail)
            )
    return alerts


def _check_eopyy4_wrong_insurer(all_df: pd.DataFrame) -> list[dict]:
    """
    EOPYY4 — Insurer Must Be EOPYY.

    Any claim in the batch whose insurer value does not match the EOPYY
    token list is flagged as routed to the wrong validator.

    Legal: ΕΚΠΥ πεδίο εφαρμογής, Ν. 4238/2014 Art. 2.
    """
    if not _require_columns(all_df, ["id", "patient_id", "insurer"], "EOPYY4"):
        return []

    alerts = []
    for _, row in all_df.iterrows():
        insurer_val = str(row.get("insurer", "")).strip()
        if not _is_eopyy_insurer(insurer_val):
            detail = (
                f"Invoice {row.get('id', '?')} has insurer '{insurer_val}' — "
                "this is not an EOPYY claim and should be removed from the EOPYY batch."
            )
            alerts.append(
                _build_alert("EOPYY4", row.get("id", ""), row.get("patient_id", ""), detail)
            )
    return alerts


def _check_eopyy5_duplicate_claim(eopyy_df: pd.DataFrame) -> list[dict]:
    """
    EOPYY5 — Duplicate Claim to EOPYY.

    Identifies claims where the same patient + procedure + date appears more
    than once in the EOPYY batch.  Both (all) occurrences are flagged.

    Legal: ΕΚΠΥ Art. 4 (αποφυγή διπλοεγγραφής).
    """
    needed = ["id", "patient_id", "procedure", "date"]
    if not _require_columns(eopyy_df, needed, "EOPYY5"):
        return []

    key_cols = ["patient_id", "procedure", "date"]
    dupes = eopyy_df[eopyy_df.duplicated(subset=key_cols, keep=False)].copy()

    alerts = []
    for _, row in dupes.iterrows():
        # Collect all invoice IDs sharing the same key.
        mask = (
            (eopyy_df["patient_id"] == row["patient_id"])
            & (eopyy_df["procedure"] == row["procedure"])
            & (eopyy_df["date"] == row["date"])
        )
        all_ids = eopyy_df.loc[mask, "id"].tolist()
        detail = (
            f"Invoice {row['id']}: duplicate EOPYY claim — "
            f"patient {row['patient_id']}, procedure {row['procedure']}, "
            f"date {row['date']}. All occurrences: {', '.join(str(i) for i in all_ids)}."
        )
        alerts.append(_build_alert("EOPYY5", row["id"], row["patient_id"], detail))
    return alerts


def _check_eopyy6_copayment(eopyy_df: pd.DataFrame) -> list[dict]:
    """
    EOPYY6 — Co-payment Arithmetic.

    When amount_paid < amount, the shortfall (amount − amount_paid) must equal
    20% of amount (the standard ΕΚΠΥ co-payment rate) within ±€1 tolerance.
    Rows where the arithmetic does not add up are flagged.

    Legal: ΕΚΠΥ Art. 8 (συμμετοχή ασθενούς).
    """
    needed = ["id", "patient_id", "amount", "amount_paid"]
    if not _require_columns(eopyy_df, needed, "EOPYY6"):
        return []

    alerts = []
    partial = eopyy_df[eopyy_df["amount_paid"] < eopyy_df["amount"]].copy()
    for _, row in partial.iterrows():
        billed = float(row["amount"])
        paid = float(row["amount_paid"])
        shortfall = billed - paid
        expected_copay = round(billed * COPAY_RATE, 2)
        diff = abs(shortfall - expected_copay)
        if diff > COPAY_TOLERANCE_EUR:
            detail = (
                f"Invoice {row['id']}: billed €{billed:.2f}, paid €{paid:.2f}, "
                f"shortfall €{shortfall:.2f}. Expected co-payment (20%) = €{expected_copay:.2f}. "
                f"Discrepancy: €{diff:.2f} (tolerance ±€{COPAY_TOLERANCE_EUR:.2f})."
            )
            alerts.append(_build_alert("EOPYY6", row["id"], row["patient_id"], detail))
    return alerts


# ── public API ────────────────────────────────────────────────────────────────

class EOPYYPreValidator:
    """
    EOPYY claim pre-validation engine for EIMC Thessaloniki.

    Runs six pre-flight checks against a batch of invoices before submission
    to EOPYY.  Returns a list of alert dicts, one per flagged claim per rule.

    Usage::

        from healthledgerai_eopyy_validator import EOPYYPreValidator
        import pandas as pd

        inv_df = pd.read_excel("dataset.xlsx", sheet_name="invoices")
        rates_df = pd.read_excel("dataset.xlsx", sheet_name="procedure_rates")

        validator = EOPYYPreValidator()
        alerts = validator.validate(inv_df, rates_df)

    The validator treats the *entire* DataFrame as a candidate EOPYY batch.
    EOPYY4 flags non-EOPYY insurers; the remaining rules run only on rows
    that carry an EOPYY insurer value.

    Parameters
    ----------
    today : datetime.date, optional
        Reference date for the 6-month deadline check.  Defaults to
        2026-06-15 (frozen for reproducible demo).  Override in production:
        ``EOPYYPreValidator(today=datetime.date.today())``.
    eopyy_insurer_tokens : list[str], optional
        Lower-case substrings that identify an EOPYY insurer in the
        ``insurer`` column.  Defaults to ``["eopyy", "εοπυυ"]``.
    """

    def __init__(
        self,
        today: Optional[datetime.date] = None,
        eopyy_insurer_tokens: Optional[list[str]] = None,
    ):
        self.today = today or _TODAY
        self._tokens = [t.lower() for t in (eopyy_insurer_tokens or EOPYY_INSURER_TOKENS)]

    def _is_eopyy(self, value: str) -> bool:
        v = str(value).lower().strip()
        return any(tok in v for tok in self._tokens)

    def validate(
        self,
        invoices_df: pd.DataFrame,
        procedure_rates_df: pd.DataFrame,
    ) -> list[dict]:
        """
        Run all six EOPYY pre-validation checks.

        Parameters
        ----------
        invoices_df : pd.DataFrame
            Invoice rows to validate.  Must include at minimum: id, patient_id,
            insurer, procedure, amount, amount_paid, date, doctor_id.
        procedure_rates_df : pd.DataFrame
            ΕΚΠΥ tariff reference table with columns: code, max_allowed.

        Returns
        -------
        list[dict]
            One dict per flagged finding.  Keys: rule_id, detector, detector_el,
            risk, legal_ref, invoice_id, patient_id, detail, action.
        """
        all_alerts: list[dict] = []

        # Split into EOPYY claims vs. all claims.
        if "insurer" in invoices_df.columns:
            eopyy_mask = invoices_df["insurer"].apply(self._is_eopyy)
            eopyy_df = invoices_df[eopyy_mask].copy().reset_index(drop=True)
        else:
            print(
                "  [EOPYY pre-validator] WARNING: 'insurer' column not found — "
                "treating all invoices as EOPYY claims for rules EOPYY1–EOPYY3, EOPYY5–EOPYY6."
            )
            eopyy_df = invoices_df.copy().reset_index(drop=True)

        eopyy_count = len(eopyy_df)
        total_count = len(invoices_df)
        print(
            f"  [EOPYY pre-validator] Batch: {total_count} invoices total, "
            f"{eopyy_count} identified as EOPYY claims."
        )

        # EOPYY1 — Tariff ceiling
        alerts = _check_eopyy1_tariff_ceiling(eopyy_df, procedure_rates_df)
        print(f"  [EOPYY pre-validator] EOPYY1 (tariff ceiling):      {len(alerts):>4} alerts")
        all_alerts.extend(alerts)

        # EOPYY2 — Required fields
        alerts = _check_eopyy2_required_fields(eopyy_df)
        print(f"  [EOPYY pre-validator] EOPYY2 (required fields):     {len(alerts):>4} alerts")
        all_alerts.extend(alerts)

        # EOPYY3 — Submission deadline
        alerts = _check_eopyy3_submission_deadline(eopyy_df, self.today)
        print(f"  [EOPYY pre-validator] EOPYY3 (deadline):            {len(alerts):>4} alerts")
        all_alerts.extend(alerts)

        # EOPYY4 — Wrong insurer (runs against full batch)
        alerts = _check_eopyy4_wrong_insurer(invoices_df)
        print(f"  [EOPYY pre-validator] EOPYY4 (wrong insurer):       {len(alerts):>4} alerts")
        all_alerts.extend(alerts)

        # EOPYY5 — Duplicate claims (EOPYY batch only)
        alerts = _check_eopyy5_duplicate_claim(eopyy_df)
        print(f"  [EOPYY pre-validator] EOPYY5 (duplicate claims):    {len(alerts):>4} alerts")
        all_alerts.extend(alerts)

        # EOPYY6 — Co-payment arithmetic
        alerts = _check_eopyy6_copayment(eopyy_df)
        print(f"  [EOPYY pre-validator] EOPYY6 (co-payment arith.):   {len(alerts):>4} alerts")
        all_alerts.extend(alerts)

        return all_alerts
