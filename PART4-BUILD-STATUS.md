# Part 4 — Critical Missing (Must Build): Build Status
*Tracks the 8 "Critical Missing" items from CLAUDE-CONTEXT.md, Part 4.*
*Confidential — PhD Research Material. Last updated: 15 Jun 2026.*

The product today is `healthledgerai_demo.py` — 11 rule-based billing-error
detectors (Layer 2) over an anonymised validation dataset. The items below are
sequenced by what can be built **offline now** (pure Python, no external
systems) versus what needs API keys, real ERP access, or a Greek legal corpus.

| # | Item | Status | Notes |
|---|------|--------|-------|
| 7 | **Audit trail module (immutable log of all AI decisions)** | ✅ **Built** | `healthledgerai_audit.py` + `healthledgerai_demo_audited.py`. Hash-chained, tamper-evident, bilingual EL/EN, records legal basis (EU AI Act Art. 12, GDPR Art. 5(2)/30). Verified: detects edits, deletions, and reordering. |
| 5 | Basic compliance rules engine (Special Healthcare Accounting Plan) | ⏭ Next (buildable offline) | Refactor the 11 hardcoded detectors into a config-driven rules engine so rules live in data, not code. Natural next step; reuses existing detectors. |
| 3 | EOPYY claim pre-validation module | ⏭ Buildable offline | New EOPYY-specific ruleset (ΕΚΠΥ price-list adherence, pre-authorisation, payer routing, co-payment). Needs EOPYY-shaped sample data to run end-to-end. |
| 8 | GDPR/AVV documentation for hospital pilots | ⏭ Buildable offline | Document deliverable (HTML→PDF, same pipeline as the NDA / Validation Statement). Records of processing, DPA/AVV template, data-flow description. |
| 2 | Document ingestion (OCR + Greek PDF extraction) | ⏸ Needs deps | Requires Tesseract + Greek language pack (not installed here) and PDF parsing. Can scaffold the interface. |
| 1 | Greek NLP pipeline (multilingual LLM + RAG) | ⏸ Needs API/corpus | Requires LLM API access (network) and a Greek legal-text corpus. Scaffold + architecture only until keys/corpus available. |
| 4 | GESY/HIO integration (Cyprus) | ⏸ Needs external system | Requires HIO portal access. Interface stub only for now. |
| 6 | SAP connector (confirmed at AMC) | ⏸ Needs external system | Requires SAP FI/CO access. Interface stub only for now. |

## What was built in this session (item #7)

**Files**
- `healthledgerai_audit.py` — the `AuditTrail` class (append-only, SHA-256 hash-chained JSONL) + `verify()`.
- `healthledgerai_demo_audited.py` — additive wrapper: runs the existing 11 detectors and logs every decision, then verifies chain integrity. The original `healthledgerai_demo.py` is untouched.
- `HealthLedgerAI_Audit_Trail.jsonl` — sample immutable log from the anonymised validation dataset (70 decisions + 3 structural entries).

**Why this item first:** every other module (EOPYY validation, rules engine,
SAP connector, Greek NLP) must write its decisions *through* the audit trail —
it is the shared infrastructure. It is also fully buildable offline and directly
answers the two most-cited strategic needs in the brief: EU AI Act high-risk
record-keeping and GDPR accountability.

**Run it:**
```bash
python3 healthledgerai_demo_audited.py
```

**Verify an existing log (what an auditor would run):**
```python
from healthledgerai_audit import AuditTrail
AuditTrail.verify("HealthLedgerAI_Audit_Trail.jsonl")
# {'ok': True, 'entries': 73, 'broken_at': None, 'reason': 'chain intact'}
```

## Recommended next item
**#5 — Basic compliance rules engine.** Convert the 11 hardcoded detectors into
a config-driven engine (rules as data). This unlocks #3 (EOPYY rules become just
another config) and makes the "Special Healthcare Accounting Plan" rules
maintainable without code changes — the foundation Layer-1 agreement mapping will
eventually feed.
