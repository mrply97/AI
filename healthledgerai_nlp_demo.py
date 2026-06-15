"""
HealthLedgerAI — Greek NLP Pipeline Demo
Shows the full Layer 1 pipeline:
  PDF → text extraction → Claude agreement analysis → bilingual alert explanations

Run: python3 healthledgerai_nlp_demo.py

Uses a synthetic Greek cooperation agreement to demonstrate without real hospital data.
"""

import os
from healthledgerai_nlp import AgreementExtractor, BilingualExplainer, AgreementData
from healthledgerai_rules_engine import RulesEngine, load_tables

# ── Synthetic Greek cooperation agreement for testing ─────────────────────────
# In production this text comes from healthledgerai_ingest.ingest("agreement.pdf").full_text
# This example mirrors the structure of a real EOPYY provider agreement.

SAMPLE_GREEK_AGREEMENT = """
ΣΥΜΒΑΣΗ ΣΥΝΕΡΓΑΣΙΑΣ
Μεταξύ της ιδιωτικής κλινικής «Εμβρυολάβ Κλινική Γονιμότητας» (εφεξής «Πάροχος»),
ΑΦΜ: 094129XXX, που εδρεύει στην Αθήνα, και της ασφαλιστικής εταιρείας «Eurolife FFH»
(εφεξής «Ασφαλιστής»), ΑΦΜ: 094XXXXXXX.

Αντικείμενο: Η παρούσα σύμβαση ρυθμίζει την άμεση εκκαθάριση (direct billing)
παροχών υγείας για ασφαλισμένους της Eurolife FFH στην κλινική του Παρόχου.

Ισχύς σύμβασης: 01/01/2026 έως 31/12/2026.

Τιμολόγιο Παροχών:
- Κωδικός IVF001 (Εξωσωματική γονιμοποίηση — πλήρης κύκλος): μέγιστο €3.500,00
- Κωδικός IVF002 (Κρυοσυντήρηση εμβρύων): μέγιστο €800,00
- Κωδικός OB001 (Παρακολούθηση εγκυμοσύνης): μέγιστο €1.200,00
- Κωδικός LAB001 (Εργαστηριακές εξετάσεις — πακέτο): μέγιστο €450,00
- Κωδικός CONS001 (Ιατρική επίσκεψη / Συμβουλευτική): μέγιστο €120,00

Συμμετοχή ασθενούς (co-payment): 20% επί της εγκεκριμένης αξίας.
Εξαιρέσεις co-payment: Ασθενείς με αναπηρία ΑΜΕΑ (>67%) απαλλάσσονται.

Προεξουσιοδότηση (pre-authorisation): Υποχρεωτική για IVF001 και IVF002.
Η αίτηση προεξουσιοδότησης υποβάλλεται τουλάχιστον 5 εργάσιμες ημέρες πριν.

Προθεσμία υποβολής αξιώσεων: Εντός 90 ημερών από την ημερομηνία παροχής υπηρεσίας.

Υποχρεώσεις Παρόχου:
1. Τιμολόγηση εντός των συμφωνημένων ανωτάτων ορίων του τιμολογίου.
2. Έκδοση απόδειξης συμμετοχής ασθενούς κατά την παροχή υπηρεσίας.
3. Ηλεκτρονική υποβολή αξιώσεων μέσω πύλης Eurolife εντός 90 ημερών.
4. Τήρηση αρχείου ιατρικών πράξεων για 10 έτη (Ν. 4624/2019, GDPR).
5. Άμεση ενημέρωση ασθενούς για μη καλυπτόμενες υπηρεσίες πριν την παροχή.

Εμπιστευτικότητα: Όλα τα δεδομένα ασθενών προστατεύονται βάσει ΓΚΠΔ (2016/679)
και Ν. 4624/2019 (Ελληνικός νόμος για την Προστασία Δεδομένων).

Υπογραφές: Αθήνα, 15 Ιανουαρίου 2026.
"""


def main():
    print("\n  HealthLedgerAI — Greek NLP Pipeline Demo")
    print("  Layer 1: Cooperation Agreement Analysis\n")

    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        print("  ERROR: ANTHROPIC_API_KEY not set.")
        print("  Add it to the Claude Code environment variables and restart the session.")
        return

    # ── Step 1: Extract agreement structure ───────────────────────────────────
    print("  Step 1 — Extracting structure from Greek cooperation agreement...")
    print("           (Calling Claude API — this takes ~5 seconds)\n")

    extractor = AgreementExtractor()
    agreement = extractor.extract(SAMPLE_GREEK_AGREEMENT, source_file="embryolab_eurolife_2026.pdf")

    print("  ═══════════════════════════════════════════════════════════")
    print("  EXTRACTED AGREEMENT STRUCTURE")
    print("  ═══════════════════════════════════════════════════════════")
    print(f"  Type         : {agreement.agreement_type}")
    print(f"  Valid        : {agreement.effective_date} → {agreement.expiry_date}")
    print(f"  Confidence   : {agreement.extraction_confidence}")
    print(f"  Language     : {agreement.language_detected}")
    print(f"\n  Parties:")
    for p in agreement.parties:
        print(f"    · {p.name} [{p.role} / {p.type}]")
    print(f"\n  Payment terms ({len(agreement.payment_terms)} procedures):")
    for pt in agreement.payment_terms:
        print(f"    · {pt.procedure_code}: {pt.procedure_name_el} — max €{pt.max_rate_eur}")
    if agreement.co_payment_rules:
        cp = agreement.co_payment_rules[0]
        print(f"\n  Co-payment   : {int(cp.percentage*100)}%")
        if cp.exemptions:
            print(f"  Exemptions   : {', '.join(cp.exemptions)}")
    print(f"\n  Pre-auth required: {', '.join(agreement.pre_auth_required_codes) or 'none listed'}")
    print(f"  Billing deadline : {agreement.billing_deadline_days} days after service")
    print(f"\n  Key obligations:")
    for ob in agreement.key_obligations:
        print(f"    · {ob}")
    print("  ═══════════════════════════════════════════════════════════\n")

    # ── Step 2: Run the detectors on the validation dataset ───────────────────
    print("  Step 2 — Running billing detectors on validation dataset...")
    tables = load_tables("HealthLedgerAI_Validation_Dataset_UPLOAD.xlsx")
    engine = RulesEngine()
    alerts = engine.run(tables)
    high_alerts = [a for a in alerts if a["risk"] == "HIGH"]
    print(f"  {len(alerts)} alerts total · {len(high_alerts)} HIGH risk\n")

    # ── Step 3: Generate Greek explanations for top HIGH-risk alerts ──────────
    print("  Step 3 — Generating Greek explanations (calling Claude for each)...\n")
    explainer = BilingualExplainer()

    sample_alerts = high_alerts[:3]   # demo: top 3 HIGH alerts
    for i, alert in enumerate(sample_alerts, 1):
        print(f"  ─── Alert {i} ───────────────────────────────────────────────")
        print(f"  [{alert['rule_id']}] {alert['detector']}")
        print(f"  Finding  : {alert['detail']}")
        print(f"  Legal    : {alert['legal_ref'][0] if alert['legal_ref'] else '—'}")

        print("\n  🇬🇷 Εξήγηση (Ελληνικά):")
        el_text = explainer.explain(alert, agreement=agreement, lang="el")
        for line in el_text.split(". "):
            if line.strip():
                print(f"     {line.strip()}.")

        print("\n  🇬🇧 Explanation (English):")
        en_text = explainer.explain(alert, agreement=agreement, lang="en")
        for line in en_text.split(". "):
            if line.strip():
                print(f"     {line.strip()}.")
        print()

    print("  ═══════════════════════════════════════════════════════════")
    print("  Layer 1 pipeline complete.")
    print("  In production: replace SAMPLE_GREEK_AGREEMENT with")
    print("  healthledgerai_ingest.ingest('real_agreement.pdf').full_text")
    print("  ═══════════════════════════════════════════════════════════\n")


if __name__ == "__main__":
    main()
