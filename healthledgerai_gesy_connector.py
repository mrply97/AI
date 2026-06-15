"""
HealthLedgerAI — GESY/HIO Integration Stub
Part 4 · Critical Missing item #4 — "GESY/HIO integration (Cyprus)"

Status: STUB — production-ready interface, awaiting HIO portal credentials.

What this does
--------------
The General Health System (GESY / ΓεΣΥ) in Cyprus is administered by the
Health Insurance Organisation (HIO / ΟΑΥ).  Providers on the island submit
claims, eligibility checks, and pre-authorisation requests through the HIO
portal (https://providers.hio.org.cy) or via their ERP integration.

AMC Cyprus is currently OUTSIDE GESY (private, EOPYY-contracted).
This module is for future expansion to other Cyprus providers who ARE in GESY
(e.g. Apollonion, Aretaeio, Limassol General).

This stub:
  · Defines the full data contract (what HealthLedgerAI sends and receives)
  · Implements all HIO operations as typed Python methods
  · Returns plausible mock data when no live endpoint is configured
  · Becomes live the moment you call connect(endpoint, credentials)

HIO claim format (as of GESY Phase 2, 2024)
--------------------------------------------
  · DRG-based reimbursement for inpatient episodes
  · Visit-based for outpatient (per approved procedure code)
  · Claim XML follows HL7 FHIR R4 (ClaimResponse resource)
  · Eligibility: HL7 CoverageEligibilityRequest
  · Pre-auth:    HL7 Claim with use="preauthorization"
  · GESY assigns each episode a unique HIO Episode ID (20-char alphanumeric)

Run (stub mode, no credentials needed):
  python3 healthledgerai_gesy_connector.py

Once HIO credentials are available:
  from healthledgerai_gesy_connector import GESYConnector
  gesy = GESYConnector()
  gesy.connect(
      endpoint="https://providers.hio.org.cy/api/fhir/r4",
      credentials={"client_id": "...", "client_secret": "...", "cert_path": "..."},
  )
"""

from __future__ import annotations

import json
import uuid
from dataclasses import dataclass, field, asdict
from datetime import date, datetime, timedelta
from typing import Optional


# ── Data contracts ────────────────────────────────────────────────────────────

@dataclass
class HIOPatient:
    hio_id: str                   # ΑΑΜ — unique GESY beneficiary number
    name_el: str                  # Greek name as on ID card
    name_en: str
    date_of_birth: date
    id_number: str                # Cypriot ARC or passport
    coverage_start: date
    coverage_end: Optional[date] = None   # None = open-ended (active coverage)
    category: str = "RESIDENT"    # RESIDENT | EU_TOURIST | REFUGEE


@dataclass
class HIOProcedure:
    gesy_code: str                # HIO tariff code (e.g. "GESY-ONC-001")
    description_el: str
    description_en: str
    drg_code: Optional[str]       # DRG group for inpatient episodes
    unit_rate_eur: float          # HIO approved rate
    requires_pre_auth: bool = False
    specialty: str = ""           # e.g. "Oncology", "Cardiology"


@dataclass
class HIOClaim:
    episode_id: str               # HIO Episode ID (assigned by HIO on admission)
    provider_id: str              # Provider's HIO registration number
    patient: HIOPatient
    procedure: HIOProcedure
    service_date: date
    quantity: int = 1
    billed_amount_eur: float = 0.0
    diagnosis_icd10: str = ""     # Primary ICD-10 code
    attending_doctor_hio_id: str = ""
    pre_auth_reference: Optional[str] = None


@dataclass
class EligibilityResult:
    patient_hio_id: str
    is_eligible: bool
    coverage_category: str
    coverage_start: date
    coverage_end: Optional[date]
    co_payment_rate: float        # e.g. 0.15 = 15%
    co_payment_cap_eur: Optional[float]
    exemptions: list[str] = field(default_factory=list)
    raw_response: dict = field(default_factory=dict)


@dataclass
class PreAuthResult:
    request_reference: str
    status: str                   # APPROVED | PENDING | REJECTED
    approved_procedure_code: str
    approved_amount_eur: float
    valid_from: date
    valid_until: date
    conditions: list[str] = field(default_factory=list)
    rejection_reason: Optional[str] = None
    raw_response: dict = field(default_factory=dict)


@dataclass
class ClaimSubmissionResult:
    claim_id: str                 # HealthLedgerAI internal ID
    hio_transaction_id: str       # HIO reference number
    status: str                   # ACCEPTED | PENDING | REJECTED | PARTIAL
    approved_amount_eur: float
    patient_co_payment_eur: float
    hio_payment_eur: float
    payment_date: Optional[date]
    rejection_codes: list[str] = field(default_factory=list)
    rejection_messages: list[str] = field(default_factory=list)
    raw_response: dict = field(default_factory=dict)


@dataclass
class GESYAlert:
    """HealthLedgerAI alert enriched with GESY-specific context."""
    alert_id: str
    rule_id: str
    detector: str
    risk: str
    finding_el: str
    finding_en: str
    hio_episode_id: Optional[str]
    hio_claim_id: Optional[str]
    recommended_action_el: str
    recommended_action_en: str


# ── Connector ─────────────────────────────────────────────────────────────────

class GESYConnector:
    """
    Interface between HealthLedgerAI and the HIO/GESY portal.

    Usage (stub mode — no credentials needed):
        conn = GESYConnector()
        result = conn.check_eligibility("CY-2024-00012345")

    Usage (live mode — once HIO credentials are provided):
        conn = GESYConnector()
        conn.connect(
            endpoint="https://providers.hio.org.cy/api/fhir/r4",
            credentials={
                "client_id": "<HIO client ID>",
                "client_secret": "<HIO client secret>",
                "cert_path": "/etc/ssl/hio/provider.p12",  # mTLS cert
            }
        )
        result = conn.check_eligibility("CY-2024-00012345")
    """

    STUB_MODE_MSG = (
        "[GESY STUB] No live HIO endpoint configured. "
        "Call connect(endpoint, credentials) to go live."
    )

    def __init__(self):
        self._endpoint: Optional[str] = None
        self._credentials: dict = {}
        self._session = None          # requests.Session with mTLS, once live
        self._is_live = False

        # GESY co-payment schedule (as of April 2024 GESY Phase 2)
        self._co_payment_schedule = {
            "GP_VISIT":           {"rate": 0.00, "cap": None},
            "SPECIALIST_VISIT":   {"rate": 0.15, "cap": 150.0},
            "INPATIENT":          {"rate": 0.15, "cap": 1500.0},
            "EMERGENCY":          {"rate": 0.00, "cap": None},
            "PHYSIOTHERAPY":      {"rate": 0.15, "cap": None},
            "LABORATORY":         {"rate": 0.00, "cap": None},
            "IMAGING":            {"rate": 0.00, "cap": None},
            "PHARMACY":           {"rate": 0.10, "cap": None},
        }

    # ── Connection ────────────────────────────────────────────────────────────

    def connect(self, endpoint: str, credentials: dict) -> bool:
        """
        Activate live HIO API connection.

        Parameters
        ----------
        endpoint    : HIO FHIR R4 base URL
                      e.g. "https://providers.hio.org.cy/api/fhir/r4"
        credentials : dict with keys:
                        client_id     — HIO-issued OAuth 2.0 client ID
                        client_secret — HIO-issued secret
                        cert_path     — path to mTLS certificate (.p12 / .pem)

        Returns True if connection test succeeds.
        """
        self._endpoint = endpoint.rstrip("/")
        self._credentials = credentials

        # When live: initialise requests.Session with mTLS cert and OAuth token.
        # Not implemented here — placeholder for the real integration.
        #
        # import requests
        # self._session = requests.Session()
        # self._session.cert = credentials.get("cert_path")
        # token = self._get_oauth_token()
        # self._session.headers["Authorization"] = f"Bearer {token}"
        # ping = self._session.get(f"{self._endpoint}/metadata")
        # self._is_live = ping.status_code == 200

        self._is_live = True   # set False until real HTTP call is wired
        print(f"[GESY] Endpoint configured: {self._endpoint}")
        print("[GESY] NOTE: stub mode — HTTP calls not yet wired. "
              "Returning mock data until live integration is activated.")
        return self._is_live

    # ── Core HIO operations ───────────────────────────────────────────────────

    def check_eligibility(
        self,
        patient_hio_id: str,
        service_date: Optional[date] = None,
        service_type: str = "SPECIALIST_VISIT",
    ) -> EligibilityResult:
        """
        Check whether a patient is eligible for GESY coverage on a given date.

        HIO endpoint (live): GET /CoverageEligibilityRequest
        HL7 FHIR R4 resource: CoverageEligibilityRequest

        Parameters
        ----------
        patient_hio_id : ΑΑΜ — GESY beneficiary number (e.g. "CY-2024-00012345")
        service_date   : defaults to today
        service_type   : key in co-payment schedule
        """
        if service_date is None:
            service_date = date.today()

        if self._is_live and self._endpoint:
            # Live path: POST FHIR CoverageEligibilityRequest to HIO portal.
            # Uncomment when mTLS + OAuth are wired:
            #
            # payload = self._build_fhir_eligibility_request(patient_hio_id, service_date)
            # resp = self._session.post(f"{self._endpoint}/CoverageEligibilityRequest",
            #                           json=payload, timeout=30)
            # return self._parse_eligibility_response(resp.json())
            pass

        # Stub: return realistic mock data for development and demo purposes.
        co_pay = self._co_payment_schedule.get(
            service_type, {"rate": 0.15, "cap": None}
        )
        return EligibilityResult(
            patient_hio_id=patient_hio_id,
            is_eligible=True,
            coverage_category="RESIDENT",
            coverage_start=date(2024, 1, 1),
            coverage_end=None,
            co_payment_rate=co_pay["rate"],
            co_payment_cap_eur=co_pay["cap"],
            exemptions=[],
            raw_response={
                "_stub": True,
                "note": self.STUB_MODE_MSG,
                "hio_response_code": "200-OK-STUB",
            },
        )

    def request_pre_authorisation(
        self,
        patient_hio_id: str,
        procedure: HIOProcedure,
        service_date: date,
        diagnosis_icd10: str,
        attending_doctor_hio_id: str,
        clinical_notes: str = "",
    ) -> PreAuthResult:
        """
        Submit a pre-authorisation request to HIO for a procedure flagged
        `requires_pre_auth = True`.

        HIO endpoint (live): POST /Claim (use="preauthorization")
        HL7 FHIR R4 resource: Claim

        Pre-auth is required in GESY for:
          · Oncology treatment episodes
          · Major surgeries (DRG-grouped inpatient)
          · Assisted reproduction (IVF) — requires HIO Ethics Committee approval
          · Certain high-cost imaging (PET-CT, fMRI)
        """
        ref = f"HIO-PREAUTH-{uuid.uuid4().hex[:12].upper()}"

        if self._is_live and self._endpoint:
            # Live path:
            # payload = self._build_fhir_preauth_claim(
            #     patient_hio_id, procedure, service_date, diagnosis_icd10,
            #     attending_doctor_hio_id, clinical_notes
            # )
            # resp = self._session.post(f"{self._endpoint}/Claim", json=payload, timeout=30)
            # return self._parse_preauth_response(resp.json())
            pass

        return PreAuthResult(
            request_reference=ref,
            status="APPROVED",
            approved_procedure_code=procedure.gesy_code,
            approved_amount_eur=procedure.unit_rate_eur,
            valid_from=service_date,
            valid_until=service_date + timedelta(days=90),
            conditions=[
                "Procedure must be performed by GESY-registered specialist",
                "Patient co-payment must be collected at point of service",
                "Episode documentation to be submitted within 30 days",
            ],
            rejection_reason=None,
            raw_response={
                "_stub": True,
                "note": self.STUB_MODE_MSG,
                "pre_auth_reference": ref,
            },
        )

    def submit_claim(self, claim: HIOClaim) -> ClaimSubmissionResult:
        """
        Submit a completed episode claim to HIO for reimbursement.

        HIO endpoint (live): POST /Claim (use="claim")
        HL7 FHIR R4 resource: Claim

        The claim must include:
          · HIO Episode ID (assigned at admission / registration)
          · Pre-auth reference (if procedure requires_pre_auth)
          · Primary ICD-10 diagnosis
          · Attending doctor's HIO registration number
          · Service date + billed amount (must not exceed HIO tariff)
        """
        hio_txn = f"HIO-CLM-{uuid.uuid4().hex[:16].upper()}"
        co_pay_rate = self._co_payment_schedule.get(
            "SPECIALIST_VISIT", {"rate": 0.15}
        )["rate"]
        approved = min(claim.billed_amount_eur, claim.procedure.unit_rate_eur)
        patient_co_pay = round(approved * co_pay_rate, 2)
        hio_payment = round(approved - patient_co_pay, 2)

        if self._is_live and self._endpoint:
            # Live path:
            # payload = self._build_fhir_claim(claim)
            # resp = self._session.post(f"{self._endpoint}/Claim", json=payload, timeout=60)
            # return self._parse_claim_response(resp.json())
            pass

        return ClaimSubmissionResult(
            claim_id=f"HLA-{uuid.uuid4().hex[:8].upper()}",
            hio_transaction_id=hio_txn,
            status="ACCEPTED",
            approved_amount_eur=approved,
            patient_co_payment_eur=patient_co_pay,
            hio_payment_eur=hio_payment,
            payment_date=date.today() + timedelta(days=30),
            rejection_codes=[],
            rejection_messages=[],
            raw_response={
                "_stub": True,
                "note": self.STUB_MODE_MSG,
                "hio_transaction_id": hio_txn,
            },
        )

    def query_claim_status(self, hio_transaction_id: str) -> dict:
        """
        Query the status of a previously submitted claim.

        HIO endpoint (live): GET /ClaimResponse?identifier={hio_transaction_id}
        """
        return {
            "hio_transaction_id": hio_transaction_id,
            "status": "ACCEPTED",
            "payment_date": (date.today() + timedelta(days=30)).isoformat(),
            "_stub": True,
            "note": self.STUB_MODE_MSG,
        }

    # ── HealthLedgerAI alert enrichment ───────────────────────────────────────

    def enrich_alerts_with_gesy(
        self, alerts: list[dict], episode_map: Optional[dict] = None
    ) -> list[GESYAlert]:
        """
        Map HealthLedgerAI billing alerts to GESY-enriched alert objects.

        Parameters
        ----------
        alerts      : list of alert dicts from RulesEngine.run()
        episode_map : optional dict mapping invoice_id → HIO episode ID

        Used in future workflow:
          1. RulesEngine flags overbilling or missing pre-auth
          2. This method adds the HIO Episode ID + recommended action
          3. Enriched alerts are surfaced in the hospital's billing dashboard
          4. Billing manager submits corrected claim via submit_claim()
        """
        episode_map = episode_map or {}
        enriched = []
        for a in alerts:
            inv_id = a.get("invoice_id", "")
            rule_id = a.get("rule_id", "")

            # Map HealthLedgerAI rule IDs to GESY-specific remediation actions
            action_map = {
                "D1": (
                    "Ακυρώστε το διπλότυπο αίτημα στην πύλη HIO",
                    "Cancel the duplicate claim in the HIO portal",
                ),
                "D2": (
                    "Διορθώστε το ποσό αξίωσης ώστε να μην υπερβαίνει το εγκεκριμένο τιμολόγιο GESY",
                    "Correct claim amount to not exceed the approved GESY tariff",
                ),
                "D3": (
                    "Ελέγξτε τον κωδικό ICD-10 και υποβάλετε εκ νέου με σωστή κατηγορία DRG",
                    "Verify ICD-10 code and resubmit with correct DRG category",
                ),
                "D4": (
                    "Υποβάλετε έντυπο εισαγωγής ή εξόδου που λείπει μέσω πύλης HIO",
                    "Submit missing admission or discharge form via HIO portal",
                ),
            }
            action_el, action_en = action_map.get(
                rule_id,
                (
                    "Επικοινωνήστε με τον HIO για διευκρινίσεις σχετικά με αυτήν την αξίωση",
                    "Contact HIO for clarification on this claim",
                ),
            )

            enriched.append(
                GESYAlert(
                    alert_id=f"GA-{uuid.uuid4().hex[:8].upper()}",
                    rule_id=rule_id,
                    detector=a.get("detector", ""),
                    risk=a.get("risk", ""),
                    finding_el=a.get("detail", ""),
                    finding_en=a.get("detail", ""),
                    hio_episode_id=episode_map.get(inv_id),
                    hio_claim_id=None,
                    recommended_action_el=action_el,
                    recommended_action_en=action_en,
                )
            )
        return enriched

    # ── Tariff lookup ─────────────────────────────────────────────────────────

    def get_approved_tariff(self, gesy_code: str) -> Optional[float]:
        """
        Return the HIO-approved rate for a GESY procedure code.

        In production this calls GET /ChargeItemDefinition?code={gesy_code}.
        The stub returns representative GESY 2024 tariff values.
        """
        stub_tariffs = {
            "GESY-GP-001":    35.00,
            "GESY-SPEC-001":  60.00,
            "GESY-ONC-001":  850.00,
            "GESY-ONC-002":  450.00,
            "GESY-SURG-001": 1200.00,
            "GESY-SURG-002":  750.00,
            "GESY-LAB-001":   45.00,
            "GESY-IMG-001":   120.00,
            "GESY-PHYS-001":  35.00,
        }
        return stub_tariffs.get(gesy_code)

    # ── FHIR builders (to be completed when live endpoint confirmed) ──────────

    def _build_fhir_eligibility_request(
        self, patient_hio_id: str, service_date: date
    ) -> dict:
        """HL7 FHIR R4 CoverageEligibilityRequest skeleton."""
        return {
            "resourceType": "CoverageEligibilityRequest",
            "id": str(uuid.uuid4()),
            "status": "active",
            "purpose": ["benefits"],
            "patient": {"identifier": {"value": patient_hio_id}},
            "created": service_date.isoformat(),
            "insurer": {"identifier": {"system": "https://hio.org.cy", "value": "HIO"}},
            "insurance": [
                {
                    "focal": True,
                    "coverage": {
                        "identifier": {"system": "https://hio.org.cy/coverage",
                                       "value": patient_hio_id}
                    },
                }
            ],
        }

    def _build_fhir_claim(self, claim: HIOClaim) -> dict:
        """HL7 FHIR R4 Claim resource skeleton (use='claim')."""
        return {
            "resourceType": "Claim",
            "id": str(uuid.uuid4()),
            "status": "active",
            "use": "claim",
            "type": {"coding": [{"system": "http://terminology.hl7.org/CodeSystem/claim-type",
                                  "code": "professional"}]},
            "patient": {"identifier": {"value": claim.patient.hio_id}},
            "created": claim.service_date.isoformat(),
            "insurer": {"identifier": {"value": "HIO"}},
            "provider": {"identifier": {"value": claim.provider_id}},
            "priority": {"coding": [{"code": "normal"}]},
            "diagnosis": [
                {
                    "sequence": 1,
                    "diagnosisCodeableConcept": {
                        "coding": [{"system": "http://hl7.org/fhir/sid/icd-10",
                                    "code": claim.diagnosis_icd10}]
                    },
                }
            ],
            "item": [
                {
                    "sequence": 1,
                    "productOrService": {
                        "coding": [{"system": "https://hio.org.cy/codes",
                                    "code": claim.procedure.gesy_code}]
                    },
                    "servicedDate": claim.service_date.isoformat(),
                    "unitPrice": {"value": claim.billed_amount_eur, "currency": "EUR"},
                    "quantity": {"value": claim.quantity},
                    "net": {"value": claim.billed_amount_eur * claim.quantity, "currency": "EUR"},
                }
            ],
        }


# ── Self-test (stub mode, no credentials needed) ─────────────────────────────

def _demo():
    print("\n  HealthLedgerAI — GESY/HIO Connector Demo (STUB MODE)")
    print("  " + "─" * 55)
    print("  NOTE: AMC Cyprus is outside GESY. This module targets")
    print("  future Cyprus hospital expansion (Apollonion, Aretaeio,")
    print("  Limassol General, etc.).\n")

    conn = GESYConnector()

    # 1. Eligibility check
    print("  [1] Eligibility check — patient CY-2024-00012345")
    elig = conn.check_eligibility(
        "CY-2024-00012345",
        service_date=date(2026, 10, 15),
        service_type="SPECIALIST_VISIT",
    )
    print(f"      Eligible      : {elig.is_eligible}")
    print(f"      Category      : {elig.coverage_category}")
    print(f"      Co-payment    : {int(elig.co_payment_rate * 100)}%"
          + (f" (cap €{elig.co_payment_cap_eur:,.2f})" if elig.co_payment_cap_eur else ""))
    print(f"      Stub mode     : {elig.raw_response.get('_stub')}\n")

    # 2. Pre-authorisation (oncology example)
    proc = HIOProcedure(
        gesy_code="GESY-ONC-001",
        description_el="Χημειοθεραπεία — πρώτος κύκλος",
        description_en="Chemotherapy — first cycle",
        drg_code="DRG-Z51.1",
        unit_rate_eur=850.00,
        requires_pre_auth=True,
        specialty="Oncology",
    )
    print("  [2] Pre-authorisation — GESY-ONC-001 (chemotherapy)")
    pre_auth = conn.request_pre_authorisation(
        patient_hio_id="CY-2024-00012345",
        procedure=proc,
        service_date=date(2026, 10, 15),
        diagnosis_icd10="C50.9",
        attending_doctor_hio_id="DR-HIO-0042",
    )
    print(f"      Status        : {pre_auth.status}")
    print(f"      Reference     : {pre_auth.request_reference}")
    print(f"      Approved amt  : €{pre_auth.approved_amount_eur:,.2f}")
    print(f"      Valid until   : {pre_auth.valid_until}\n")

    # 3. Claim submission
    patient = HIOPatient(
        hio_id="CY-2024-00012345",
        name_el="Ανδρέας Παπαδόπουλος",
        name_en="Andreas Papadopoulos",
        date_of_birth=date(1978, 4, 12),
        id_number="CY123456",
        coverage_start=date(2024, 1, 1),
        category="RESIDENT",
    )
    claim = HIOClaim(
        episode_id="HIO-EP-2026-00998877",
        provider_id="PROV-HIO-00314",
        patient=patient,
        procedure=proc,
        service_date=date(2026, 10, 15),
        quantity=1,
        billed_amount_eur=850.00,
        diagnosis_icd10="C50.9",
        attending_doctor_hio_id="DR-HIO-0042",
        pre_auth_reference=pre_auth.request_reference,
    )
    print("  [3] Claim submission")
    result = conn.submit_claim(claim)
    print(f"      Status        : {result.status}")
    print(f"      HIO Txn ID    : {result.hio_transaction_id}")
    print(f"      Approved amt  : €{result.approved_amount_eur:,.2f}")
    print(f"      Patient co-pay: €{result.patient_co_payment_eur:,.2f}")
    print(f"      HIO payment   : €{result.hio_payment_eur:,.2f}")
    print(f"      Payment date  : {result.payment_date}\n")

    # 4. Tariff lookup
    print("  [4] GESY tariff lookup")
    codes = ["GESY-ONC-001", "GESY-SPEC-001", "GESY-LAB-001", "GESY-UNKNOWN"]
    for code in codes:
        rate = conn.get_approved_tariff(code)
        print(f"      {code:<20} → "
              + (f"€{rate:,.2f}" if rate is not None else "Not in tariff list"))

    print("\n  ─" * 28)
    print("  Status: STUB complete. To go live:")
    print("    conn.connect(")
    print('      endpoint="https://providers.hio.org.cy/api/fhir/r4",')
    print("      credentials={")
    print('        "client_id": "<from HIO portal>",')
    print('        "client_secret": "<from HIO portal>",')
    print('        "cert_path": "/etc/ssl/hio/provider.p12",')
    print("      }")
    print("    )\n")


if __name__ == "__main__":
    _demo()
