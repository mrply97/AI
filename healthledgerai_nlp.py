"""
HealthLedgerAI — Greek NLP Pipeline
Part 4 · Critical Missing item #1 — "Greek NLP pipeline (multilingual LLM + RAG on Greek legal text)"

What this does
--------------
This is the Layer 1 engine of HealthLedgerAI — the part that makes the product
fundamentally different from generic billing tools.

Generic tools apply universal rules to billing data.
HealthLedgerAI reads each hospital's ACTUAL cooperation agreements (in Greek)
and uses them as the ground truth. The AI knows what THIS hospital agreed to
with THIS insurer at THIS rate — so its detections are specific, not generic.

Two components
--------------
  AgreementExtractor
      Takes raw text from a cooperation agreement (Greek or mixed-language PDF,
      already extracted by healthledgerai_ingest.py) and calls the Claude API
      to extract structured data: parties, payment rates, billing deadlines,
      co-payment rules, pre-authorisation requirements, coverage obligations.
      Output: AgreementData dataclass (JSON-serialisable).

  BilingualExplainer
      Takes a billing alert (from any detector or the rules engine) and an
      AgreementData object and generates a natural-language explanation in
      Greek (default) or English — citing the specific agreement clause that
      the billing event violates. This is what the hospital's accounting team
      actually reads.

Why Claude for Greek
--------------------
Claude (claude-sonnet-4-6) handles Modern Greek, polytonic Greek, Greek legal
terminology, and mixed Greek/English documents natively. No fine-tuning, no
translation step, no separate Greek NLP library.

The RAG element
---------------
"RAG" here = the extracted AgreementData IS the retrieval layer.
When a detector fires, the explainer retrieves the relevant clause from the
structured agreement data and passes it to Claude as context. This is lightweight
RAG: the structured extraction replaces a vector database for the prototype.

Requires
--------
  ANTHROPIC_API_KEY in environment (injected by session-start hook)
  pip install anthropic (installed by session-start hook)

Version 0.1 (research prototype) | Maria Polychroniadou | healthledgerai.com
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass, field, asdict
from typing import Optional

import anthropic

# ── model config ──────────────────────────────────────────────────────────────

_MODEL   = "claude-sonnet-4-6"
_CLIENT  = None   # lazy init

def _client() -> anthropic.Anthropic:
    global _CLIENT
    if _CLIENT is None:
        key = os.environ.get("ANTHROPIC_API_KEY", "")
        if not key:
            raise RuntimeError(
                "ANTHROPIC_API_KEY not set. "
                "Add it via the Claude Code environment settings "
                "or ensure the session-start hook has run."
            )
        _CLIENT = anthropic.Anthropic(api_key=key)
    return _CLIENT


# ── data structures ───────────────────────────────────────────────────────────

@dataclass
class Party:
    name: str
    role: str           # "payer" | "provider" | "insurer" | "hospital" | "other"
    type: str           # "private_insurer" | "eopyy" | "gesy_hio" | "ministry" | "hospital"
    tax_id: str = ""

@dataclass
class PaymentTerm:
    procedure_code: str
    procedure_name_el: str
    procedure_name_en: str
    max_rate_eur: Optional[float]
    currency: str = "EUR"
    conditions: str = ""

@dataclass
class CoPaymentRule:
    percentage: float           # e.g. 0.20 = 20%
    max_amount_eur: Optional[float]
    exemptions: list[str] = field(default_factory=list)
    notes: str = ""

@dataclass
class AgreementData:
    """Structured extraction of a cooperation agreement."""
    source_file: str = ""
    language_detected: str = "el"
    agreement_type: str = ""    # "cooperation_agreement" | "eopyy_contract" | "insurance_direct_billing" | "gesy_contract"
    effective_date: str = ""
    expiry_date: str = ""
    parties: list[Party] = field(default_factory=list)
    payment_terms: list[PaymentTerm] = field(default_factory=list)
    co_payment_rules: list[CoPaymentRule] = field(default_factory=list)
    pre_auth_required_codes: list[str] = field(default_factory=list)
    billing_deadline_days: Optional[int] = None   # days after service to submit
    covered_procedure_codes: list[str] = field(default_factory=list)
    key_obligations: list[str] = field(default_factory=list)   # free-text
    raw_excerpt: str = ""       # first 500 chars of source text for provenance
    extraction_confidence: str = "medium"   # "high" | "medium" | "low"
    notes: str = ""

    def to_json(self) -> str:
        return json.dumps(asdict(self), ensure_ascii=False, indent=2)

    def party_names(self) -> list[str]:
        return [p.name for p in self.parties]

    def max_rate_for(self, code: str) -> Optional[float]:
        for pt in self.payment_terms:
            if pt.procedure_code == code:
                return pt.max_rate_eur
        return None


# ── AgreementExtractor ────────────────────────────────────────────────────────

_EXTRACT_SYSTEM = """You are a legal document analyst specialising in Greek and Cypriot
healthcare cooperation agreements (συμβάσεις συνεργασίας), insurance billing contracts,
EOPYY provider agreements, and GESY/HIO framework agreements.

Your task: extract structured information from cooperation agreement text and return it
as a single valid JSON object matching the schema provided.

Rules:
- Always return valid JSON, nothing else.
- If a field cannot be determined from the text, use null (numbers), "" (strings), or [] (arrays).
- For dates, use ISO format YYYY-MM-DD if possible.
- For procedure codes, extract exactly as written (may be Greek ΕΚΠΥ codes, ICD, DRG, or custom codes).
- Translate Greek party names and obligations to English in the _en fields; keep Greek in _el fields.
- Set extraction_confidence to "high" if key terms (rates, dates, parties) are clearly stated,
  "medium" if partially readable, "low" if mostly inferred."""

_EXTRACT_SCHEMA = """{
  "agreement_type": "cooperation_agreement|eopyy_contract|insurance_direct_billing|gesy_contract|unknown",
  "effective_date": "YYYY-MM-DD or ''",
  "expiry_date": "YYYY-MM-DD or ''",
  "parties": [
    {"name": "...", "role": "payer|provider|insurer|hospital|other",
     "type": "private_insurer|eopyy|gesy_hio|ministry|hospital|other", "tax_id": ""}
  ],
  "payment_terms": [
    {"procedure_code": "...", "procedure_name_el": "...", "procedure_name_en": "...",
     "max_rate_eur": 0.0, "currency": "EUR", "conditions": ""}
  ],
  "co_payment_rules": [
    {"percentage": 0.20, "max_amount_eur": null, "exemptions": [], "notes": ""}
  ],
  "pre_auth_required_codes": ["code1", "code2"],
  "billing_deadline_days": null,
  "covered_procedure_codes": ["code1"],
  "key_obligations": ["obligation in English"],
  "extraction_confidence": "high|medium|low",
  "notes": "any caveats about the extraction"
}"""


class AgreementExtractor:
    """
    Extract structured data from a Greek cooperation agreement text.

    Usage
    -----
    from healthledgerai_ingest import ingest
    from healthledgerai_nlp import AgreementExtractor

    doc   = ingest("hospital_agreement.pdf")
    ext   = AgreementExtractor()
    data  = ext.extract(doc.full_text, source_file="hospital_agreement.pdf")
    print(data.to_json())
    """

    def __init__(self, model: str = _MODEL):
        self.model = model

    def extract(self, text: str, source_file: str = "") -> AgreementData:
        """
        Extract structured agreement data from raw text.

        Parameters
        ----------
        text        : raw text of the agreement (Greek, English, or mixed)
        source_file : filename for provenance tracking

        Returns
        -------
        AgreementData
        """
        # Truncate to avoid very large prompts (first 8000 chars covers most agreements)
        excerpt = text[:8000]

        prompt = f"""Extract structured information from the following cooperation agreement text.
Return ONLY a JSON object matching this exact schema:

{_EXTRACT_SCHEMA}

Agreement text:
---
{excerpt}
---

Return only the JSON object, no other text."""

        response = _client().messages.create(
            model=self.model,
            max_tokens=2000,
            temperature=0,
            system=_EXTRACT_SYSTEM,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.content[0].text.strip()

        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError:
            return AgreementData(
                source_file=source_file,
                raw_excerpt=text[:500],
                extraction_confidence="low",
                notes=f"JSON parse failed. Raw response: {raw[:200]}",
            )

        def _parties(lst):
            return [Party(**{k: v or "" for k, v in p.items()}) for p in (lst or [])]

        def _payment_terms(lst):
            out = []
            for pt in (lst or []):
                out.append(PaymentTerm(
                    procedure_code=pt.get("procedure_code", ""),
                    procedure_name_el=pt.get("procedure_name_el", ""),
                    procedure_name_en=pt.get("procedure_name_en", ""),
                    max_rate_eur=pt.get("max_rate_eur"),
                    currency=pt.get("currency", "EUR"),
                    conditions=pt.get("conditions", ""),
                ))
            return out

        def _copay(lst):
            out = []
            for c in (lst or []):
                out.append(CoPaymentRule(
                    percentage=c.get("percentage", 0.0) or 0.0,
                    max_amount_eur=c.get("max_amount_eur"),
                    exemptions=c.get("exemptions") or [],
                    notes=c.get("notes", ""),
                ))
            return out

        return AgreementData(
            source_file=source_file,
            language_detected="el" if any(ord(c) > 0x0370 for c in text) else "en",
            agreement_type=parsed.get("agreement_type", ""),
            effective_date=parsed.get("effective_date", "") or "",
            expiry_date=parsed.get("expiry_date", "") or "",
            parties=_parties(parsed.get("parties", [])),
            payment_terms=_payment_terms(parsed.get("payment_terms", [])),
            co_payment_rules=_copay(parsed.get("co_payment_rules", [])),
            pre_auth_required_codes=parsed.get("pre_auth_required_codes") or [],
            billing_deadline_days=parsed.get("billing_deadline_days"),
            covered_procedure_codes=parsed.get("covered_procedure_codes") or [],
            key_obligations=parsed.get("key_obligations") or [],
            raw_excerpt=text[:500],
            extraction_confidence=parsed.get("extraction_confidence", "medium"),
            notes=parsed.get("notes", ""),
        )


# ── BilingualExplainer ────────────────────────────────────────────────────────

_EXPLAIN_SYSTEM = """You are a billing compliance assistant for a Greek/Cypriot private hospital.
Your role: explain billing compliance alerts to the hospital's accounting team.
Write clearly, professionally, and concisely. Cite the specific agreement clause or legal
article where relevant. Use the correct Greek accounting terminology."""


class BilingualExplainer:
    """
    Generate natural-language explanations of billing alerts — in Greek or English —
    grounded in the hospital's specific cooperation agreement.

    Usage
    -----
    explainer = BilingualExplainer()
    text = explainer.explain(alert, agreement_data, lang="el")
    print(text)
    """

    def __init__(self, model: str = _MODEL):
        self.model = model

    def explain(
        self,
        alert: dict,
        agreement: Optional[AgreementData] = None,
        lang: str = "el",
    ) -> str:
        """
        Generate a human-readable explanation of a billing alert.

        Parameters
        ----------
        alert     : alert dict from any HealthLedgerAI detector
        agreement : extracted AgreementData (if available adds contract-specific context)
        lang      : "el" (Greek) or "en" (English)

        Returns
        -------
        Explanation string in the requested language.
        """
        lang_instruction = (
            "Respond in Modern Greek (Δημοτική). Use formal accounting terminology."
            if lang == "el" else
            "Respond in English. Use professional accounting terminology."
        )

        agreement_context = ""
        if agreement:
            agreement_context = f"""
Relevant cooperation agreement context:
- Agreement type: {agreement.agreement_type}
- Parties: {', '.join(agreement.party_names())}
- Effective: {agreement.effective_date} → {agreement.expiry_date}
- Billing deadline: {agreement.billing_deadline_days} days after service
- Key obligations: {'; '.join(agreement.key_obligations[:3])}
"""
            # Add specific payment term if the alert references a procedure
            procedure = alert.get("payload", {}).get("procedure") or ""
            if procedure:
                rate = agreement.max_rate_for(procedure)
                if rate:
                    agreement_context += f"- Agreed max rate for {procedure}: €{rate}\n"

        legal_refs = "\n".join(f"  - {r}" for r in alert.get("legal_ref", []))

        prompt = f"""A billing compliance alert has been triggered. Explain it to the hospital
accounting team. Be specific about what happened, why it matters, and what they must do next.
Keep the explanation to 3-4 sentences maximum.

{lang_instruction}

Alert details:
- Rule: {alert.get('detector', alert.get('rule_id', ''))}
- Risk: {alert.get('risk', '')}
- Finding: {alert.get('detail', '')}
- Recommended action: {alert.get('action', '')}
- Legal references:
{legal_refs or '  (none specified)'}
{agreement_context}
Write the explanation now:"""

        response = _client().messages.create(
            model=self.model,
            max_tokens=300,
            temperature=0,
            system=_EXPLAIN_SYSTEM,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.content[0].text.strip()

    def explain_batch(
        self,
        alerts: list[dict],
        agreement: Optional[AgreementData] = None,
        lang: str = "el",
        limit: int = 5,
    ) -> list[dict]:
        """Explain the first `limit` HIGH-risk alerts. Returns alerts with added 'explanation' key."""
        high = [a for a in alerts if a.get("risk") == "HIGH"][:limit]
        results = []
        for a in high:
            explanation = self.explain(a, agreement=agreement, lang=lang)
            results.append({**a, "explanation": explanation, "explanation_lang": lang})
        return results
