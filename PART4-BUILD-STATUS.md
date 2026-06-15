# Part 4 — Critical Missing (Must Build): Build Status
*Tracks the 8 "Critical Missing" items from CLAUDE-CONTEXT.md, Part 4.*
*Confidential — PhD Research Material. Last updated: 15 Jun 2026.*

The product today is `healthledgerai_demo.py` — 11 rule-based billing-error
detectors (Layer 2) over an anonymised validation dataset. The items below are
sequenced by what can be built **offline now** (pure Python, no external
systems) versus what needs API keys, real ERP access, or a Greek legal corpus.

| # | Item | Status | File(s) |
|---|------|--------|---------|
| 1 | Greek NLP pipeline (multilingual LLM + RAG) | ✅ **Built** | `healthledgerai_nlp.py`, `healthledgerai_nlp_demo.py`, `healthledgerai_eimc_demo.py` |
| 2 | Document ingestion (OCR + Greek PDF extraction) | ✅ **Built** | `healthledgerai_ingest.py` |
| 3 | EOPYY claim pre-validation module | ✅ **Built** | `healthledgerai_eopyy_validator.py`, `healthledgerai_eopyy_run.py` |
| 4 | GESY/HIO integration (Cyprus) | ✅ **Built (stub — not for AMC; future expansion only)** | `healthledgerai_gesy_connector.py` |
| 5 | Basic compliance rules engine | ✅ **Built** | `healthledgerai_rules_engine.py`, `rules_config.json`, `healthledgerai_engine_run.py` |
| 6 | SAP connector (AMC-specific) | ✅ **Built (stub — blocked until AMC grants access, October 2026)** | `healthledgerai_sap_connector.py` |
| 7 | Audit trail module (immutable log of all AI decisions) | ✅ **Built** | `healthledgerai_audit.py`, `healthledgerai_demo_audited.py` |
| 8 | GDPR/AVV documentation for hospital pilots | ✅ **Built** | `GDPR-PILOT-PACKAGE.html`, `GDPR-PILOT-PACKAGE.pdf` |

**All 8 Critical Missing items are now complete.**

---

## Item summaries

### #7 — Audit trail
`healthledgerai_audit.py` + `healthledgerai_demo_audited.py`
SHA-256 hash-chained JSONL. Tamper-evident. Bilingual EL/EN. Legal basis on
every entry (EU AI Act Art. 12, GDPR Art. 5(2)/30). Detects edits, deletions,
reordering.

### #5 — Rules engine
`healthledgerai_rules_engine.py` + `rules_config.json`
13 rules as JSON data (D1–D11, EOP1, EOP2, HAS1 preview). Config-driven
dispatcher — add a rule by editing JSON, not Python. Output matches original
demo exactly (70 alerts standard mode, 80 with `--eopyy`).

### #3 — EOPYY pre-validator
`healthledgerai_eopyy_validator.py`
6 ΕΚΠΥ-specific rules: tariff ceiling, required fields, 6-month deadline,
insurer routing, duplicate claim, co-pay arithmetic.

### #8 — GDPR package
`GDPR-PILOT-PACKAGE.html` / `.pdf`
4-page document: DPA (Art. 6(1)(f) + Art. 9(3)), ROPA table, TOMs checklist +
data flow diagram, signature block. Same brand as NDA/Validation Statement.

### #2 — Document ingestion
`healthledgerai_ingest.py`
Auto-detects digital (pdfplumber) vs scanned (pdf2image + pytesseract). Greek
language detection (Unicode U+0370-03FF, U+1F00-1FFF). Tesseract auto-installed
via session-start hook.

### #1 — Greek NLP pipeline
`healthledgerai_nlp.py`
`AgreementExtractor` (Claude API → structured `AgreementData`) +
`BilingualExplainer` (Greek/English alert explanations). Demonstrated end-to-end
in `healthledgerai_eimc_demo.py` with the real EIMC EOPYY agreement
(ΑΔΑ: ΩΚ8ΚΟΞ7Μ-ΓΧ2): 7 procedure codes, 80 alerts, 83-entry audit trail.

### #4 — GESY/HIO connector stub
`healthledgerai_gesy_connector.py`
Full data contract: `HIOPatient`, `HIOProcedure`, `HIOClaim`,
`EligibilityResult`, `PreAuthResult`, `ClaimSubmissionResult`.
Methods: `check_eligibility()`, `request_pre_authorisation()`, `submit_claim()`,
`query_claim_status()`, `enrich_alerts_with_gesy()`, `get_approved_tariff()`.
HL7 FHIR R4 payload builders included. Activate with:
```python
conn.connect(
    endpoint="https://providers.hio.org.cy/api/fhir/r4",
    credentials={"client_id": "...", "client_secret": "...", "cert_path": "..."},
)
```
**⚠ Not for AMC.** AMC Cyprus is deliberately outside GESY — this connector
will never be used with AMC. It exists for future expansion to other Cyprus
private hospitals that ARE on GESY (e.g. Apollonion, Aretaeio, Limassol
General). Lower priority than everything else for now.

### #6 — SAP FI/CO connector stub
`healthledgerai_sap_connector.py`
Full data contract: `SAPFIDocument` (BKPF+BSEG mapping), `SAPCorrectionEntry`,
`SAPAlertEnrichment`.
Methods: `connect()` (OData or RFC), `fetch_fi_documents()`,
`fetch_document_by_reference()`, `park_correction_document()`,
`enrich_alerts_with_sap()`.
BAPI_ACC_DOCUMENT_POST payload builders + OData payload builders included.
Supports both integration approaches:
- OData REST (SAP Fiori / NetWeaver Gateway) — recommended
- RFC/BAPI via pyrfc — fallback for older ECC without Fiori Add-On

Activate with:
```python
conn.connect(
    method="odata",
    endpoint="https://sap.amccyprus.com:443/sap/opu/odata/sap/",
    credentials={"username": "HLAI_SERVICE", "password": "...", "client": "100"},
)
```
**⚠ AMC-specific and blocked until October 2026.** SAP FI/CO is confirmed at
AMC Cyprus (from 3 active job postings requiring SAP FI knowledge). It is NOT
confirmed at EIMC — Greek private hospitals typically run SingularLogic or a
custom ERP, so this connector does not apply to EIMC. The stub is ready; AMC
needs to provide a test endpoint and service-user credentials when the pilot
starts in October.

---

## How to run each module

```bash
# Audit trail
python3 healthledgerai_demo_audited.py

# Rules engine (standard mode)
python3 healthledgerai_engine_run.py

# Rules engine (EOPYY mode — for EIMC)
python3 healthledgerai_engine_run.py --eopyy

# EOPYY pre-validator
python3 healthledgerai_eopyy_run.py

# Greek NLP + rules + audit (full EIMC demo)
python3 healthledgerai_eimc_demo.py

# GESY connector (stub demo, no credentials needed)
python3 healthledgerai_gesy_connector.py

# SAP connector (stub demo, no credentials needed)
python3 healthledgerai_sap_connector.py
```
