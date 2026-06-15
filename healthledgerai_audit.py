"""
HealthLedgerAI — Immutable Audit Trail
Part 4 · Critical Missing item #7 — "Audit trail module (immutable log of all AI decisions)"

Why this exists
---------------
HealthLedgerAI is likely to be classified as a HIGH-RISK AI system under the
EU AI Act (automated decisions affecting healthcare billing / financial flows).
Two obligations follow directly:

  • EU AI Act, Art. 12  — automatic record-keeping ("logs") over the system's lifetime
  • GDPR, Art. 5(2) & 30 — accountability and records of processing activities

This module gives every detector decision a permanent, tamper-evident home.
Each entry is hash-chained to the one before it (like a private ledger), so any
later edit, deletion, or re-ordering of a past decision is detectable.

Design notes
------------
  • Pure standard library — no external dependencies, no network, runs on-premise.
    (Hospitals will not put patient data on a public cloud — see CLAUDE-BRIEF.md.)
  • Append-only JSON Lines (.jsonl). One decision per line, human-readable.
  • Bilingual labels (Greek / English) because hospital accounting in GR/CY is in
    Greek — see the language constraint in CLAUDE-BRIEF.md.

Version 0.1 (research prototype) | Maria Polychroniadou | healthledgerai.com
"""

from __future__ import annotations

import hashlib
import json
import os
import uuid
from datetime import datetime, timezone

VERSION = "0.1"
GENESIS_PREV_HASH = "0" * 64  # the chain's anchor — nothing precedes the first entry

# Legal basis recorded on every run so an auditor sees *why* the log exists.
LEGAL_BASIS = [
    "EU AI Act, Art. 12 (record-keeping / automatic logs for high-risk AI)",
    "GDPR, Art. 5(2) (accountability) & Art. 30 (records of processing)",
    "Ν. 4624/2019 (Greek data protection law implementing GDPR)",
]

# Bilingual labels for the event types the prototype emits.
EVENT_LABELS = {
    "run_started":   {"el": "Έναρξη ανάλυσης",          "en": "Analysis run started"},
    "dataset_bound": {"el": "Δέσμευση συνόλου δεδομένων", "en": "Dataset fingerprint bound"},
    "decision":      {"el": "Απόφαση ελέγχου",           "en": "Compliance decision"},
    "run_completed": {"el": "Ολοκλήρωση ανάλυσης",       "en": "Analysis run completed"},
}

RISK_LABELS = {
    "HIGH":   {"el": "Υψηλός κίνδυνος",  "en": "High risk"},
    "MEDIUM": {"el": "Μέτριος κίνδυνος", "en": "Medium risk"},
    "LOW":    {"el": "Χαμηλός κίνδυνος", "en": "Low risk"},
}


def _canonical(obj) -> str:
    """Deterministic JSON so the same content always yields the same hash."""
    return json.dumps(obj, sort_keys=True, ensure_ascii=False, separators=(",", ":"))


def _hash_entry(prev_hash: str, core: dict) -> str:
    """entry_hash = SHA-256( prev_hash + canonical(core fields) )."""
    return hashlib.sha256((prev_hash + _canonical(core)).encode("utf-8")).hexdigest()


def file_fingerprint(path: str) -> str:
    """SHA-256 of a file — used to bind the audit log to the exact dataset analysed."""
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


class AuditTrail:
    """Append-only, hash-chained audit log of AI billing-compliance decisions."""

    def __init__(self, path: str, actor: str, software: str = "HealthLedgerAI"):
        self.path = path
        self.actor = actor
        self.software = software
        self.run_id = str(uuid.uuid4())
        self.seq = 0
        self._prev_hash = GENESIS_PREV_HASH
        # Start a fresh log file for each run (runs are immutable once written).
        open(self.path, "w", encoding="utf-8").close()
        self._append(
            "run_started",
            {
                "software": software,
                "audit_module_version": VERSION,
                "run_id": self.run_id,
                "legal_basis": LEGAL_BASIS,
            },
        )

    # ── writing ──────────────────────────────────────────────────────────────
    def _append(self, event_type: str, payload: dict) -> str:
        """Write one chained entry. Returns its entry_hash."""
        core = {
            "seq": self.seq,
            "timestamp_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "actor": self.actor,
            "event_type": event_type,
            "label": EVENT_LABELS.get(event_type, {"el": event_type, "en": event_type}),
            "payload": payload,
        }
        entry_hash = _hash_entry(self._prev_hash, core)
        entry = {**core, "prev_hash": self._prev_hash, "entry_hash": entry_hash}
        with open(self.path, "a", encoding="utf-8") as f:
            f.write(_canonical(entry) + "\n")
        self._prev_hash = entry_hash
        self.seq += 1
        return entry_hash

    def bind_dataset(self, dataset_path: str) -> str:
        """Record which dataset (by content hash) this run analysed."""
        fp = file_fingerprint(dataset_path)
        self._append(
            "dataset_bound",
            {"dataset_file": os.path.basename(dataset_path), "sha256": fp},
        )
        return fp

    def log_decision(self, alert: dict) -> str:
        """Record a single detector decision (one flagged alert)."""
        risk = alert.get("risk", "LOW")
        payload = {
            "detector": alert.get("detector"),
            "risk": risk,
            "risk_label": RISK_LABELS.get(risk, {"el": risk, "en": risk}),
            "invoice_id": str(alert.get("invoice_id", "")),
            "patient_id": str(alert.get("patient_id", "")),
            "finding": alert.get("detail"),
            "recommended_action": alert.get("action"),
            "decision": "FLAGGED",
        }
        return self._append("decision", payload)

    def complete(self, totals: dict) -> str:
        """Close the run with a summary count of decisions by risk."""
        return self._append("run_completed", {"totals": totals})

    # ── reading / verification ───────────────────────────────────────────────
    @staticmethod
    def verify(path: str) -> dict:
        """
        Re-walk the chain and confirm nothing was altered, deleted, or reordered.
        Returns {"ok": bool, "entries": int, "broken_at": int|None, "reason": str}.
        """
        prev = GENESIS_PREV_HASH
        count = 0
        with open(path, "r", encoding="utf-8") as f:
            for i, line in enumerate(f):
                line = line.strip()
                if not line:
                    continue
                entry = json.loads(line)
                # Sequence must be strictly increasing from 0.
                if entry.get("seq") != i:
                    return {"ok": False, "entries": count, "broken_at": i,
                            "reason": f"sequence mismatch at line {i}"}
                # The recorded prev_hash must match the running chain.
                if entry.get("prev_hash") != prev:
                    return {"ok": False, "entries": count, "broken_at": i,
                            "reason": f"broken link at entry {i}"}
                # Recompute the hash from the core fields and compare.
                core = {k: entry[k] for k in
                        ("seq", "timestamp_utc", "actor", "event_type", "label", "payload")}
                recomputed = _hash_entry(prev, core)
                if recomputed != entry.get("entry_hash"):
                    return {"ok": False, "entries": count, "broken_at": i,
                            "reason": f"content tampered at entry {i}"}
                prev = entry["entry_hash"]
                count += 1
        return {"ok": True, "entries": count, "broken_at": None, "reason": "chain intact"}
