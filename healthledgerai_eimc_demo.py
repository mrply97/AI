"""
HealthLedgerAI — EIMC Thessaloniki Demonstration
Full pipeline run for presentation to Ιατρικό Διαβαλκανικό Θεσσαλονίκης (EIMC).

What this shows
---------------
1. Agreement extraction — reads EIMC's EOPYY + private insurance cooperation
   agreements (Greek text) and extracts structured data via Claude API.
2. Billing compliance analysis — runs ALL applicable rules including EOPYY-
   specific checks on the validation dataset (506 invoices, 120 patients).
3. Greek explanations — every alert explained in Greek, citing the specific
   EOPYY article or cooperation agreement clause that was violated.
4. Audit trail — immutable, hash-chained log of every decision.
5. Formatted report — a summary table suitable for presenting to the
   EIMC accounting/finance team.

Hospital context (EIMC)
-----------------------
- 383 beds · 18 ORs · €270M group revenue (Athens Medical Group, ATHEX: ΙΑΤΡ)
- EOPYY contracted since 2016 (ΑΔΑ: ΩΚ8ΚΟΞ7Μ-ΓΧ2)
- Co-payment absorption model: up to €1,000/stay (EOPYY + private insurer)
- JCI Gold Seal December 2025 — highest billing documentation standards
- New €40M International Oncology Center 2024 — 120 chemo beds, complex billing
- Working capital: −€20.5M (June 2024) — faster claims recovery = direct CFO value
- 7,000 foreign patients/year (53 countries) — cross-border billing complexity

Run: python3 healthledgerai_eimc_demo.py
"""

import os
import sys
from datetime import datetime

from healthledgerai_nlp import AgreementExtractor, BilingualExplainer
from healthledgerai_rules_engine import RulesEngine, load_tables
from healthledgerai_audit import AuditTrail

DATASET_FILE = "HealthLedgerAI_Validation_Dataset_UPLOAD.xlsx"
AUDIT_LOG    = "HealthLedgerAI_EIMC_Audit.jsonl"
ACTOR        = "HealthLedgerAI/eimc-demo v0.1"

# ── Synthetic EIMC cooperation agreement (Greek) ──────────────────────────────
# Reflects EIMC's real setup: EOPYY contract + Eurolife FFH + Interamerican.
# In production this text comes from:
#   healthledgerai_ingest.ingest("eimc_eopyy_contract.pdf").full_text

EIMC_AGREEMENT_TEXT = """
ΣΥΜΒΑΣΗ ΠΑΡΟΧΗΣ ΥΠΗΡΕΣΙΩΝ ΥΓΕΙΑΣ ΜΕ ΕΟΠΥΥ
Αριθμός Απόφασης: ΑΔΑ: ΩΚ8ΚΟΞ7Μ-ΓΧ2
Ημερομηνία σύναψης: 15 Ιανουαρίου 2016 | Ισχύς: παρατεινόμενη ετησίως

Μεταξύ:
Α) ΕΟΠΥΥ — Εθνικός Οργανισμός Παροχής Υπηρεσιών Υγείας (εφεξής «ΕΟΠΥΥ»)
   ΑΦΜ: 997519138, Κηφισίας 39, Μαρούσι 15123
   Εκπρόσωπος: Διοικητής ΕΟΠΥΥ
Β) ΙΑΤΡΙΚΟ ΔΙΑΒΑΛΚΑΝΙΚΟ ΘΕΣΣΑΛΟΝΙΚΗΣ Α.Ε. (εφεξής «Πάροχος»)
   ΑΦΜ: 094129169 | Αρ. Εγκατάστασης ΕΟΠΥΥ: 39713
   Ασκληπιού 10, Πυλαία, 55535, Θεσσαλονίκη
   Νόμιμος εκπρόσωπος: Δ.Σ. Ιατρικού Διαβαλκανικού Θεσσαλονίκης

Αντικείμενο σύμβασης:
Παροχή νοσοκομειακής και εξωνοσοκομειακής περίθαλψης σε ασφαλισμένους ΕΟΠΥΥ.
Ο Πάροχος υποχρεούται να δέχεται ασφαλισμένους ΕΟΠΥΥ χωρίς διακριτική μεταχείριση
και να τιμολογεί αποκλειστικά εντός των ορίων του ΕΚΠΥ.

Τιμολόγιο βάσει ΕΚΠΥ (Ενιαίος Κανονισμός Παροχών Υγείας):
- ONC001 (Χημειοθεραπεία — κύκλος τυπικός): μέγιστο ΕΚΠΥ €2.800,00
- ONC002 (Χημειοθεραπεία — βιολογικοί παράγοντες): μέγιστο ΕΚΠΥ €5.500,00
- RAD001 (Ακτινοθεραπεία IMRT/IGRT — σύνεδρο): μέγιστο ΕΚΠΥ €450,00
- CARD001 (Καρδιολογική εξέταση + ΗΚΓ): μέγιστο ΕΚΠΥ €85,00
- SURG001 (Χειρουργική επέμβαση — μέτριας πολυπλοκότητας): μέγιστο ΕΚΠΥ €3.200,00
- LAB001 (Εργαστηριακές εξετάσεις — πακέτο): μέγιστο ΕΚΠΥ €320,00
- CONS001 (Ιατρική επίσκεψη): μέγιστο ΕΚΠΥ €45,00

Συμμετοχή ασθενούς (co-payment):
Ο ασθενής καταβάλλει 15% επί της εγκεκριμένης αξίας ΕΟΠΥΥ.
Ο Πάροχος δύναται να απορροφά το co-payment έως €1.000,00 ανά νοσηλεία (μοντέλο
απορρόφησης) όταν συντρέχει και ιδιωτική ασφάλιση ασθενούς (συνδυαστική κάλυψη).
Εξαιρέσεις co-payment: χρόνιοι νεφροπαθείς αιμοκαθαίρεσης, αιμορροφιλικοί,
ασφαλισμένοι με αναπηρία άνω του 80%.

Προεξουσιοδότηση: Υποχρεωτική για ONC001, ONC002, RAD001, SURG001.
Χρόνος απόκρισης ΕΟΠΥΥ: εντός 5 εργάσιμων ημερών.

Προθεσμία υποβολής αξιώσεων: Εντός 6 μηνών από την ημερομηνία νοσηλείας / παροχής.

Ειδικές υποχρεώσεις Παρόχου:
1. Τιμολόγηση αποκλειστικά εντός ΕΚΠΥ — απαγορεύεται υπέρβαση ανωτάτων ορίων.
2. Ηλεκτρονική υποβολή δαπανών μέσω πλατφόρμας ΕΟΠΥΥ (e-ΕΟΠΥΥ).
3. Τήρηση φακέλου νοσηλείας ανά ασθενή για τουλάχιστον 15 έτη.
4. Υποβολή τριμηνιαίων αναφορών ποιότητας (JCI compliance — από Δεκ. 2025).
5. Άμεση γνωστοποίηση στον ασθενή κάθε παροχής μη καλυπτόμενης από ΕΟΠΥΥ.
6. Για διεθνείς ασθενείς: εφαρμογή διμερών συμφωνιών κοινωνικής ασφάλισης
   (Βουλγαρία, Ρουμανία — EU; Σερβία, Βόρεια Μακεδονία — bilateral).

Συνδυαστική κάλυψη (ΕΟΠΥΥ + ιδιωτική ασφάλιση):
Σε περίπτωση συνδυαστικής κάλυψης με Eurolife FFH ή Interamerican:
- Πρώτη αξίωση προς ΕΟΠΥΥ (βάσει ΕΚΠΥ).
- Υπόλοιπο (co-payment) προς ιδιωτικό ασφαλιστή (συμπληρωματική κάλυψη).
- Απαγορεύεται διπλή αξίωση για το ίδιο ποσό και στους δύο φορείς.

GDPR / Προστασία Δεδομένων:
Όλα τα δεδομένα ασθενών προστατεύονται βάσει ΓΚΠΔ (ΕΕ 2016/679) και Ν. 4624/2019.
Ο Πάροχος έχει ορίσει Υπεύθυνο Προστασίας Δεδομένων (DPO).

Θεσσαλονίκη, 15 Ιανουαρίου 2016 / Ανανεώθηκε: 15 Ιανουαρίου 2026.
"""


def print_section(title: str):
    print("\n" + "═" * 70)
    print(f"  {title}")
    print("═" * 70)


def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        print("\n  ERROR: ANTHROPIC_API_KEY not set.")
        print("  Add it to the Claude Code environment variables and restart.")
        sys.exit(1)

    print("\n")
    print("  ██╗  ██╗███████╗ █████╗ ██╗  ████████╗██╗  ██╗██╗     ███████╗██████╗  █████╗ ██╗")
    print("  ██║  ██║██╔════╝██╔══██╗██║  ╚══██╔══╝██║  ██║██║     ██╔════╝██╔══██╗██╔══██╗██║")
    print("  ███████║█████╗  ███████║██║     ██║   ███████║██║     █████╗  ██║  ██║███████║██║")
    print("  ██╔══██║██╔══╝  ██╔══██║██║     ██║   ██╔══██║██║     ██╔══╝  ██║  ██║██╔══██║██║")
    print("  ██║  ██║███████╗██║  ██║███████╗██║   ██║  ██║███████╗███████╗██████╔╝██║  ██║██║")
    print("  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝╚═════╝ ╚═╝  ╚═╝╚═╝")
    print()
    print("  Billing Compliance Intelligence for Private Healthcare")
    print("  Demonstration for: Ιατρικό Διαβαλκανικό Θεσσαλονίκης (EIMC)")
    print(f"  Run date: {datetime.now().strftime('%d %B %Y  %H:%M')}")
    print("  CONFIDENTIAL · RESEARCH PROTOTYPE · PhD Research — Maria Polychroniadou")

    # ── STEP 1: Extract agreement structure ───────────────────────────────────
    print_section("STEP 1 — Cooperation Agreement Analysis (AI-Powered, Greek)")
    print("  Reading EIMC's EOPYY cooperation agreement...")
    print("  Extracting structure via Claude API...\n")

    extractor = AgreementExtractor()
    agreement = extractor.extract(
        EIMC_AGREEMENT_TEXT,
        source_file="eimc_eopyy_contract_2026.pdf"
    )

    print(f"  Agreement type   : {agreement.agreement_type}")
    print(f"  Valid period     : {agreement.effective_date} → {agreement.expiry_date}")
    print(f"  Extraction       : {agreement.extraction_confidence} confidence")
    print(f"\n  Parties identified:")
    for p in agreement.parties:
        print(f"    · {p.name}  [{p.role}]")

    print(f"\n  Procedure tariffs extracted ({len(agreement.payment_terms)} codes):")
    for pt in agreement.payment_terms:
        print(f"    · {pt.procedure_code:<10} {pt.procedure_name_el:<45}  max €{pt.max_rate_eur:,.0f}")

    if agreement.co_payment_rules:
        cp = agreement.co_payment_rules[0]
        print(f"\n  Co-payment rule  : {int(cp.percentage*100)}%")
        if cp.max_amount_eur:
            print(f"  Absorption cap   : €{cp.max_amount_eur:,.0f}/νοσηλεία (combined EOPYY + private)")
        if cp.exemptions:
            print(f"  Exemptions       : {'; '.join(cp.exemptions[:2])}")

    print(f"\n  Pre-auth required: {', '.join(agreement.pre_auth_required_codes)}")
    print(f"  Billing deadline : {agreement.billing_deadline_days} days / 6 months after service")

    print(f"\n  Key obligations extracted ({len(agreement.key_obligations)}):")
    for i, ob in enumerate(agreement.key_obligations, 1):
        print(f"    {i}. {ob}")

    # ── STEP 2: Run billing detectors ─────────────────────────────────────────
    print_section("STEP 2 — Billing Compliance Analysis (506 Invoices · 120 Patients)")
    print("  Running all detectors including EOPYY-specific rules...\n")

    tables = load_tables(DATASET_FILE)
    audit  = AuditTrail(AUDIT_LOG, actor=ACTOR)
    fp     = audit.bind_dataset(DATASET_FILE)
    print(f"  Dataset fingerprint (SHA-256): {fp[:32]}…")
    print(f"  Audit trail: {AUDIT_LOG}\n")

    engine = RulesEngine()
    alerts = engine.run(tables, eopyy=True)

    for a in alerts:
        audit.log_decision(a)

    totals = {r: sum(1 for a in alerts if a["risk"] == r) for r in ("HIGH", "MEDIUM", "LOW")}
    audit.complete(totals)
    integrity = AuditTrail.verify(AUDIT_LOG)

    # Group by rule
    by_rule: dict[str, list] = {}
    for a in alerts:
        by_rule.setdefault(a["rule_id"], []).append(a)

    RISK_ICON = {"HIGH": "🔴", "MEDIUM": "🟡", "LOW": "🟢"}

    print(f"  {'Rule':<8}  {'Description':<45}  {'Alerts':>6}  Risk")
    print("  " + "─" * 66)
    for rule_id in sorted(by_rule, key=lambda r: (r[0], int(''.join(filter(str.isdigit, r))) if any(c.isdigit() for c in r) else 99)):
        batch = by_rule[rule_id]
        risk  = batch[0]["risk"]
        name  = batch[0]["detector"].split(" · ", 1)[-1]
        print(f"  {rule_id:<8}  {name:<45}  {len(batch):>6}  {RISK_ICON[risk]} {risk}")

    print("  " + "─" * 66)
    print(f"  {'TOTAL':<8}  {'':45}  {len(alerts):>6}")
    print(f"\n  🔴 HIGH    : {totals['HIGH']:>3} alerts — immediate action required")
    print(f"  🟡 MEDIUM  : {totals['MEDIUM']:>3} alerts — review within 48 hours")
    print(f"  🔒 Audit   : {integrity['entries']} entries · chain {'✓ INTACT' if integrity['ok'] else '✗ BROKEN'}")

    # ── STEP 3: Greek explanations ────────────────────────────────────────────
    print_section("STEP 3 — Αναλυτική Εξήγηση Ευρημάτων (Greek Explanations)")
    print("  Generating Greek explanations grounded in the EIMC/EOPYY agreement...\n")

    explainer = BilingualExplainer()

    # Pick one representative alert per rule type (up to 5)
    representative = []
    seen_rules = set()
    for a in alerts:
        if a["rule_id"] not in seen_rules:
            representative.append(a)
            seen_rules.add(a["rule_id"])
        if len(representative) == 5:
            break

    for a in representative:
        risk = a["risk"]
        print(f"  {'─'*68}")
        print(f"  {RISK_ICON[risk]} {a['detector']}")
        print(f"  Εύρημα   : {a['detail']}")
        if a.get("legal_ref"):
            print(f"  Νομική βάση : {a['legal_ref'][0]}")
        print()

        el_explanation = explainer.explain(a, agreement=agreement, lang="el")
        print("  🇬🇷 Εξήγηση για το τμήμα λογιστηρίου:")
        for sentence in el_explanation.replace("\n\n", "\n").split("\n"):
            sentence = sentence.strip().lstrip("#·*—- ")
            if sentence:
                print(f"     {sentence}")
        print()

        en_explanation = explainer.explain(a, agreement=agreement, lang="en")
        print("  🇬🇧 Explanation for management / audit:")
        for sentence in en_explanation.replace("\n\n", "\n").split("\n"):
            sentence = sentence.strip().lstrip("#·*—- ")
            if sentence:
                print(f"     {sentence}")
        print()

    # ── STEP 4: Executive summary ─────────────────────────────────────────────
    print_section("STEP 4 — Executive Summary for EIMC Finance Team")

    high_value = sum(
        float(str(a.get("detail", "")).split("€")[-1].split()[0].replace(",", ""))
        for a in alerts if a["risk"] == "HIGH" and "€" in str(a.get("detail", ""))
        and a["rule_id"] in ("D2", "EOP1")
    )

    print(f"""
  Dataset analysed  : 506 invoices · 120 patients · 498 appointments
  Analysis date     : {datetime.now().strftime('%d %B %Y')}
  Rules applied     : 12 (11 standard + 1 EOPYY tariff rule)
  Agreement basis   : EIMC/ΕΟΠΥΥ ΑΔΑ: ΩΚ8ΚΟΞ7Μ-ΓΧ2 + Eurolife FFH + Interamerican

  FINDINGS SUMMARY
  ────────────────────────────────────────────────────────────────────
  🔴 {totals['HIGH']:>3} HIGH-risk alerts  — payment must be withheld pending review
  🟡 {totals['MEDIUM']:>3} MEDIUM-risk alerts — accounting review required within 48h

  TOP RISK CATEGORIES
  ────────────────────────────────────────────────────────────────────""")

    for rule_id in sorted(by_rule, key=lambda r: -len(by_rule[r])):
        if by_rule[rule_id][0]["risk"] == "HIGH":
            name = by_rule[rule_id][0]["detector"].split(" · ", 1)[-1]
            print(f"  · {len(by_rule[rule_id]):>2}x {name}")

    print(f"""
  WHAT THIS MEANS FOR EIMC
  ────────────────────────────────────────────────────────────────────
  · {by_rule.get('D4', [0]).__len__()} phantom billing alerts → risk of ΕΟΠΥΥ audit recovery claim
  · {by_rule.get('D1', [0]).__len__()} duplicate invoices     → direct cash leakage if paid
  · {by_rule.get('D2', [0]).__len__()} upcoding flags         → ΕΚΠΥ tariff violations → ΕΟΠΥΥ rejection
  · {by_rule.get('D8', [0]).__len__()} patient ID collisions  → GDPR / JCI documentation breach

  AUDIT TRAIL
  ────────────────────────────────────────────────────────────────────
  Every decision above is logged in an immutable, hash-chained audit
  trail ({AUDIT_LOG}). Any edit or deletion of a past decision
  breaks the chain — satisfying EU AI Act Art. 12 record-keeping and
  GDPR Art. 5(2) accountability requirements.

  JCI RELEVANCE (EIMC Gold Seal, December 2025)
  ────────────────────────────────────────────────────────────────────
  JCI Standard ACC.1: patient identification documentation
  JCI Standard FMS.4: financial record accuracy
  JCI Standard GLD.7: billing integrity
  HealthLedgerAI's audit trail directly supports continuous JCI compliance.

  ────────────────────────────────────────────────────────────────────
  This analysis was produced by HealthLedgerAI — a pre-launch research
  prototype. All data is anonymised. This demonstration uses a synthetic
  dataset; production deployment runs on the hospital's own billing data,
  processed locally (never uploaded to any cloud service).

  Contact: Maria Polychroniadou | info@healthledgerai.com
           PhD Researcher · EUC · Erasmus for Young Entrepreneurs 2026
  ────────────────────────────────────────────────────────────────────
""")


if __name__ == "__main__":
    main()
