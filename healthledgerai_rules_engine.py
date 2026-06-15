"""
HealthLedgerAI — Config-Driven Compliance Rules Engine
Part 4 · Critical Missing item #5 — "Basic compliance rules engine"

Why this exists
---------------
The original healthledgerai_demo.py has 11 hardcoded Python functions.  Every
new compliance rule (EOPYY-specific, Special Healthcare Accounting Plan, GESY)
required writing a new Python function and wiring it manually.

This engine makes rules DATA, not code.  A rule is a JSON block in
rules_config.json.  To add "EOPYY pre-authorisation check" you add one JSON
entry; you do not touch Python.  The engine maps each rule `type` to one of
~7 generic detector patterns.

Rule types implemented
----------------------
  duplicate_rows          D1  — find rows duplicated on specified columns
  value_vs_reference      D2/D3/EOP1 — join to a ref table, compare to bound
  missing_foreign_event   D4  — source row with no matching row in a foreign table
  bundle_component_split  D5  — bundle members billed individually same day
  entity_not_in_set       D6  — entity not in an allowed set from a ref table
  payment_exceeds_billed  D7  — paid_col > billed_col
  key_collision           D8  — same composite key across different IDs
  cash_with_oop_exposure  D9  — cash payment + insurer + out-of-network doctor
  field_date_mismatch     D10 — two date columns differ
  repeated_event          D11 — same group occurs more than max_count times
  missing_required_field  EOP2/HAS1 — required column(s) are null/empty

Audit integration
-----------------
Every alert carries `legal_ref` from the rule config — the audit trail
(healthledgerai_audit.py) records this verbatim, satisfying EU AI Act Art. 12
and GDPR Art. 30 requirements that the legal basis for each decision is logged.

Version 0.1 (research prototype) | Maria Polychroniadou | healthledgerai.com
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Optional

import pandas as pd

DEFAULT_CONFIG = Path(__file__).parent / "rules_config.json"


# ── helpers ──────────────────────────────────────────────────────────────────

def _date_str(v) -> str:
    return str(v)[:10]


def _build_network(nets: pd.DataFrame, group_col: str, entity_col: str) -> dict:
    out = {}
    for _, r in nets.iterrows():
        entities = [e.strip() for e in str(r[entity_col]).split(",")]
        out[r[group_col]] = entities
    return out


def _alert(rule: dict, **fields) -> dict:
    """Build a standardised alert dict from a rule config + field values."""
    try:
        finding = rule["finding_template"].format(**fields)
    except KeyError:
        finding = str(fields)
    return {
        "rule_id":     rule["id"],
        "detector":    f"{rule['id']} · {rule['name']['en']}",
        "detector_el": f"{rule['id']} · {rule['name']['el']}",
        "risk":        rule["risk"],
        "legal_ref":   rule.get("legal_ref", []),
        "invoice_id":  str(fields.get("invoice_id", fields.get("id", ""))),
        "patient_id":  str(fields.get("patient_id", "")),
        "detail":      finding,
        "action":      rule.get("action", ""),
    }


# ── generic detector patterns ─────────────────────────────────────────────────

def _run_duplicate_rows(rule: dict, tables: dict) -> list:
    src = tables[rule["params"]["source"]]
    cols = rule["params"]["on_columns"]
    dupes = src[src.duplicated(subset=cols, keep=False)]
    return [_alert(rule, **r.to_dict()) for _, r in dupes.iterrows()]


def _run_value_vs_reference(rule: dict, tables: dict) -> list:
    p = rule["params"]
    src = tables[p["source"]]
    ref = tables[p["reference"]]
    merged = src.merge(ref, left_on=p["join_left"], right_on=p["join_right"], how="left",
                       suffixes=("", "_ref"))
    if p["direction"] == "above":
        mask = merged[p["value_col"]] > merged[p["bound_col"]]
    else:
        mask = merged[p["value_col"]] < merged[p["bound_col"]]
    return [_alert(rule, **r.to_dict()) for _, r in merged[mask].iterrows()]


def _run_missing_foreign_event(rule: dict, tables: dict) -> list:
    p = rule["params"]
    src = tables[p["source"]]
    foreign = tables[p["foreign"]]
    match = p["match_on"]  # {src_col: foreign_col, ...}
    src_cols = list(match.keys())
    foreign_cols = list(match.values())
    foreign_keys = set(
        zip(
            foreign[foreign_cols[0]].astype(str).str[:10],
            foreign[foreign_cols[1]].astype(str).str[:10],
        )
    )
    alerts = []
    for _, r in src.iterrows():
        key = (str(r[src_cols[0]]), _date_str(r[src_cols[1]]))
        if key not in foreign_keys:
            row = r.to_dict()
            row["date"] = _date_str(r["date"])   # normalise date in the template
            alerts.append(_alert(rule, **row))
    return alerts


def _run_bundle_component_split(rule: dict, tables: dict) -> list:
    p = rule["params"]
    src = tables[p["source"]]
    bundle_ref = tables[p["bundle_ref"]].dropna()
    patient_day = (
        src.groupby(["patient_id", "date"])["procedure"]
        .apply(list).reset_index()
    )
    alerts = []
    for _, b in bundle_ref.iterrows():
        members = [c.strip() for c in str(b["member_codes"]).split(",")]
        for _, row in patient_day.iterrows():
            found = [m for m in members if m in row["procedure"]]
            if len(found) >= 2:
                alerts.append(_alert(rule, patient_id=row["patient_id"],
                                     date=row["date"], bundle=b["bundle"],
                                     found=found))
    return alerts


def _run_entity_not_in_set(rule: dict, tables: dict) -> list:
    p = rule["params"]
    src = tables[p["source"]]
    ref = tables[p["network_ref"]]
    network = _build_network(ref, p["network_group_col"], p["network_entity_col"])
    alerts = []
    for _, r in src.iterrows():
        if pd.isna(r.get(p["group_col"])) or pd.isna(r.get(p["entity_col"])):
            continue
        if r[p["entity_col"]] not in network.get(r[p["group_col"]], []):
            alerts.append(_alert(rule, **r.to_dict()))
    return alerts


def _run_payment_exceeds_billed(rule: dict, tables: dict) -> list:
    p = rule["params"]
    src = tables[p["source"]]
    over = src[src[p["paid_col"]] > src[p["billed_col"]]].copy()
    over["excess"] = over[p["paid_col"]] - over[p["billed_col"]]
    return [_alert(rule, **r.to_dict()) for _, r in over.iterrows()]


def _run_key_collision(rule: dict, tables: dict) -> list:
    p = rule["params"]
    src = tables[p["source"]].copy()
    inv = tables.get(p.get("invoice_link", ""))
    src["dob_str"] = pd.to_datetime(src["dob"]).dt.date.astype(str)
    src["_key"] = src[p["key_cols"][0]] + "|" + src[p["key_cols"][1]] + "|" + src["dob_str"]
    dupes = src[src.duplicated(subset=["_key"], keep=False)]
    alerts = []
    for key, group in dupes.groupby("_key"):
        ids = group[p["id_col"]].tolist()
        affected = inv[inv[p["invoice_patient_col"]].isin(ids)]["id"].tolist() if inv is not None else []
        alerts.append(_alert(
            rule,
            patient_id=" / ".join(str(i) for i in ids),
            invoice_id=", ".join(str(i) for i in affected[:5]) + ("…" if len(affected) > 5 else ""),
            ids=ids,
            key=key.replace("|", " | "),
        ))
    return alerts


def _run_cash_with_oop_exposure(rule: dict, tables: dict) -> list:
    p = rule["params"]
    src = tables[p["source"]]
    ref = tables[p["network_ref"]]
    network = _build_network(ref, p["network_group_col"], p["network_entity_col"])
    alerts = []
    for _, r in src.iterrows():
        if r.get(p["payment_col"]) in p["cash_values"] and not pd.isna(r.get(p["insurer_col"])):
            if r[p["entity_col"]] not in network.get(r[p["insurer_col"]], []):
                alerts.append(_alert(rule, **r.to_dict()))
    return alerts


def _run_field_date_mismatch(rule: dict, tables: dict) -> list:
    p = rule["params"]
    src = tables[p["source"]]
    alerts = []
    for _, r in src.iterrows():
        if pd.isna(r.get(p["date_col_b"])):
            continue
        if _date_str(r[p["date_col_a"]]) != _date_str(r[p["date_col_b"]]):
            alerts.append(_alert(rule, **r.to_dict()))
    return alerts


def _run_repeated_event(rule: dict, tables: dict) -> list:
    p = rule["params"]
    src = tables[p["source"]]
    grp = src.groupby(p["group_cols"]).size().reset_index(name="count")
    multi = grp[grp["count"] > p["max_count"]]
    alerts = []
    for _, r in multi.iterrows():
        mask = src[p["group_cols"][0]] == r[p["group_cols"][0]]
        for col in p["group_cols"][1:]:
            mask &= src[col] == r[col]
        inv_ids = ", ".join(str(i) for i in src[mask]["id"].tolist())
        # Build fields dict from the group row, then override the reserved fields.
        fields = r.to_dict()
        fields["invoice_id"] = inv_ids
        # patient_id comes from group_cols[0] (avoid duplicate-kwarg clash)
        fields["patient_id"] = str(r[p["group_cols"][0]])
        alerts.append(_alert(rule, **fields))
    return alerts


def _run_missing_required_field(rule: dict, tables: dict) -> list:
    p = rule["params"]
    src = tables[p["source"]]
    alerts = []
    for _, r in src.iterrows():
        missing = [f for f in p["required_fields"]
                   if f in r.index and (pd.isna(r[f]) or str(r[f]).strip() == "")]
        if missing:
            alerts.append(_alert(
                rule,
                invoice_id=str(r.get("id", "")),
                patient_id=str(r.get("patient_id", "")),
                missing_fields=", ".join(missing),
            ))
    return alerts


# ── dispatch table ────────────────────────────────────────────────────────────

_DISPATCHERS = {
    "duplicate_rows":          _run_duplicate_rows,
    "value_vs_reference":      _run_value_vs_reference,
    "missing_foreign_event":   _run_missing_foreign_event,
    "bundle_component_split":  _run_bundle_component_split,
    "entity_not_in_set":       _run_entity_not_in_set,
    "payment_exceeds_billed":  _run_payment_exceeds_billed,
    "key_collision":           _run_key_collision,
    "cash_with_oop_exposure":  _run_cash_with_oop_exposure,
    "field_date_mismatch":     _run_field_date_mismatch,
    "repeated_event":          _run_repeated_event,
    "missing_required_field":  _run_missing_required_field,
}


# ── public API ────────────────────────────────────────────────────────────────

class RulesEngine:
    """
    Config-driven compliance rules engine.

    Usage:
        from healthledgerai_rules_engine import RulesEngine, load_tables
        tables = load_tables("HealthLedgerAI_Validation_Dataset_UPLOAD.xlsx")
        engine = RulesEngine()                        # loads rules_config.json
        alerts = engine.run(tables)                   # all applicable rules
        alerts = engine.run(tables, eopyy=True)       # include EOPYY rules
        alerts = engine.run(tables, rule_ids=["D1","D2"])  # specific rules only
    """

    def __init__(self, config_path: Optional[str] = None):
        path = config_path or DEFAULT_CONFIG
        with open(path, "r", encoding="utf-8") as f:
            cfg = json.load(f)
        # Skip comment-only entries (those without "id").
        self.rules = [r for r in cfg["rules"] if "id" in r and not r["id"].startswith("_")]

    def run(
        self,
        tables: dict,
        rule_ids: Optional[list] = None,
        eopyy: bool = False,
        gesy: bool = False,
    ) -> list:
        """
        Run all applicable rules.

        rule_ids  — if set, only run these specific rule IDs.
        eopyy     — include rules flagged eopyy_specific (default: False so a
                    non-EOPYY hospital like AMC Cyprus isn't affected by EOPYY rules).
        gesy      — include rules flagged gesy_specific.
        """
        all_alerts = []
        for rule in self.rules:
            if rule_ids is not None and rule["id"] not in rule_ids:
                continue
            if rule.get("eopyy_specific") and not eopyy:
                continue
            if rule.get("gesy_specific") and not gesy:
                continue
            rtype = rule.get("type")
            dispatcher = _DISPATCHERS.get(rtype)
            if dispatcher is None:
                print(f"  ⚠  Unknown rule type '{rtype}' for rule {rule['id']} — skipped.")
                continue
            try:
                alerts = dispatcher(rule, tables)
            except Exception as exc:
                print(f"  ⚠  Rule {rule['id']} failed: {exc}")
                alerts = []
            all_alerts.extend(alerts)
        return all_alerts


def load_tables(dataset_path: str) -> dict:
    """Load all sheets from the validation dataset into a dict of DataFrames."""
    xl = pd.ExcelFile(dataset_path)
    return {sheet: xl.parse(sheet) for sheet in xl.sheet_names}
