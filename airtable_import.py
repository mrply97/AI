"""
HealthLedgerAI — Airtable Importer
Run this on your laptop (NOT in Claude Code).
Steps:
  1. pip install requests
  2. Paste your Airtable personal access token below
  3. python airtable_import.py
"""

import requests
import json

# ── PASTE YOUR TOKEN HERE ──────────────────────────────────────
TOKEN = "paste_your_token_here"
# ──────────────────────────────────────────────────────────────

HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

TASKS = [
    {"Task": "Connect with Alexandra Thomaidou (Smart Umbrella) before arrival", "Phase": "Erasmus Preparation", "Category": "Networking", "Priority": "High", "Target Date": "Before June 2026", "Status": "To Do", "Notes": "Ask about healthcare business connections in Thessaloniki. Email: info@smartumbrella.eu"},
    {"Task": "Email ΚΕΡΑΜΙΔΑ host firm — ask if they have healthcare/clinic clients", "Phase": "Erasmus Preparation", "Category": "Networking", "Priority": "High", "Target Date": "Before June 2026", "Status": "To Do", "Notes": "kerkir29@otenet.gr | +30 2310 651 167"},
    {"Task": "Print and pack the Observer Certificate", "Phase": "Erasmus Preparation", "Category": "Documents", "Priority": "High", "Target Date": "Before June 2026", "Status": "To Do", "Notes": "Print PILOT-OBSERVER-CERTIFICATE.html from browser. Bring physical copy to Thessaloniki."},
    {"Task": "Print NDA for EIMC meeting", "Phase": "Erasmus Preparation", "Category": "Documents", "Priority": "Medium", "Target Date": "Before June 2026", "Status": "To Do", "Notes": "Print NDA-EIMC-GREECE.html — bring to any EIMC meeting."},
    {"Task": "Prepare one-page research brief in Greek", "Phase": "Erasmus Preparation", "Category": "Documents", "Priority": "High", "Target Date": "Before June 2026", "Status": "To Do", "Notes": "Explain PhD topic in Greek. Use as introduction document for hospital visits."},
    {"Task": "Research EIMC Oncology Symposium dates", "Phase": "Erasmus Preparation", "Category": "Research", "Priority": "Medium", "Target Date": "Before June 2026", "Status": "To Do", "Notes": "Aim to attend during Erasmus period."},
    {"Task": "Practice the demo alone", "Phase": "Erasmus Preparation", "Category": "Prototype", "Priority": "High", "Target Date": "Before June 2026", "Status": "Done", "Notes": "Run: python healthledgerai_demo.py. 70 alerts on 506 invoices."},
    {"Task": "Demo prototype with Michalis (accounting firm host)", "Phase": "Erasmus — Thessaloniki", "Category": "Prototype Validation", "Priority": "High", "Target Date": "June–July 2026", "Status": "To Do", "Notes": "Run demo → show Excel report → get Observer Certificate signed."},
    {"Task": "Ask Michalis to write 2 sentences in Greek on the certificate", "Phase": "Erasmus — Thessaloniki", "Category": "Prototype Validation", "Priority": "High", "Target Date": "June–July 2026", "Status": "To Do", "Notes": "Handwritten accountant note = strongest evidence for EIC reviewers."},
    {"Task": "Ask host firm about healthcare sector clients", "Phase": "Erasmus — Thessaloniki", "Category": "Networking", "Priority": "High", "Target Date": "June 2026", "Status": "To Do", "Notes": "If they have clinic or hospital clients, ask for an introduction as a researcher."},
    {"Task": "Contact Alexandra Thomaidou on arrival", "Phase": "Erasmus — Thessaloniki", "Category": "Networking", "Priority": "High", "Target Date": "June 2026", "Status": "To Do", "Notes": "Smart Umbrella network = potential warm introductions to EIMC."},
    {"Task": "Approach EIMC accounting department — research visit", "Phase": "Erasmus — Thessaloniki", "Category": "Hospital Validation", "Priority": "High", "Target Date": "June–July 2026", "Status": "To Do", "Notes": "Frame as: PhD researcher working with local accounting firm. NOT a sales call."},
    {"Task": "Get at least one EIMC person to review the demo output", "Phase": "Erasmus — Thessaloniki", "Category": "Hospital Validation", "Priority": "High", "Target Date": "June–July 2026", "Status": "To Do", "Notes": "Even informal feedback = market validation evidence."},
    {"Task": "Record a 3-4 minute demo video (Loom)", "Phase": "Erasmus — Thessaloniki", "Category": "Prototype", "Priority": "High", "Target Date": "June–July 2026", "Status": "To Do", "Notes": "Show: run script → alerts appear → open Excel report → explain one finding."},
    {"Task": "Register a company in Cyprus (Ltd)", "Phase": "Company Registration", "Category": "Legal", "Priority": "Critical", "Target Date": "Before Nov 2027", "Status": "To Do", "Notes": "CRITICAL for EIC eligibility. Must be Cyprus or Greece. Germany does not qualify."},
    {"Task": "Open a Cyprus business bank account", "Phase": "Company Registration", "Category": "Legal", "Priority": "High", "Target Date": "After registration", "Status": "To Do", "Notes": "Required for EIC grant disbursement."},
    {"Task": "Register for Cyprus VAT (if required)", "Phase": "Company Registration", "Category": "Legal", "Priority": "Medium", "Target Date": "After registration", "Status": "To Do", "Notes": "Check threshold with Cyprus accountant."},
    {"Task": "Wait for EIT Jumpstarter 2026 feedback", "Phase": "Funding", "Category": "Grant Applications", "Priority": "High", "Target Date": "July 2026", "Status": "Waiting", "Notes": "Applied May 2026. Feedback expected July 2026."},
    {"Task": "Apply EIT feedback to EIC application", "Phase": "Funding", "Category": "Grant Applications", "Priority": "High", "Target Date": "August–October 2026", "Status": "To Do", "Notes": "Fix whatever EIT reviewers flag before EIC submission."},
    {"Task": "Follow up on Studienstiftung scholarship", "Phase": "Funding", "Category": "Scholarships", "Priority": "High", "Target Date": "Check deadline", "Status": "To Do", "Notes": "Already mentioned in EIT application as applied."},
    {"Task": "Follow up on Konrad Adenauer Stiftung scholarship", "Phase": "Funding", "Category": "Scholarships", "Priority": "High", "Target Date": "Check deadline", "Status": "To Do", "Notes": "Already mentioned in EIT application as applied."},
    {"Task": "Begin PhD reading programme with Prof. Kythreotis", "Phase": "PhD Track", "Category": "Academic", "Priority": "High", "Target Date": "June 2026", "Status": "To Do", "Notes": "~200 papers in AI + healthcare accounting + financial compliance."},
    {"Task": "October 2026 Nicosia visit — meetings at EUC", "Phase": "PhD Track", "Category": "Academic", "Priority": "High", "Target Date": "October 2026", "Status": "To Do", "Notes": "Pre-PhD preparation phase with Prof. Kythreotis."},
    {"Task": "Attempt access to AMC accounting department (Nicosia)", "Phase": "PhD Track", "Category": "Hospital Validation", "Priority": "High", "Target Date": "October 2026", "Status": "To Do", "Notes": "Contact: Constantinos Michaelides (GM). Bring NDA-AMC-CYPRUS.html printed."},
    {"Task": "Upgrade prototype to Streamlit web interface", "Phase": "Prototype Development", "Category": "Technical", "Priority": "High", "Target Date": "Before Nov 2027", "Status": "To Do", "Notes": "pip install streamlit. Much more impressive for EIC demo."},
    {"Task": "Add Greek-language output to alert report", "Phase": "Prototype Development", "Category": "Technical", "Priority": "Medium", "Target Date": "Before Nov 2027", "Status": "To Do", "Notes": "Must show it works in Greek — the actual operating language."},
    {"Task": "Add cooperation agreement PDF upload to prototype", "Phase": "Prototype Development", "Category": "Technical", "Priority": "High", "Target Date": "Before Nov 2027", "Status": "To Do", "Notes": "Layer 1: AI reads a Greek cooperation agreement and extracts obligations."},
    {"Task": "Collect at least 2 signed observer certificates", "Phase": "EIC Application Prep", "Category": "Evidence", "Priority": "Critical", "Target Date": "Before Nov 2027", "Status": "To Do", "Notes": "One from Michalis (accounting firm). One from a hospital contact."},
    {"Task": "Collect at least 1 letter of intent from a hospital", "Phase": "EIC Application Prep", "Category": "Evidence", "Priority": "High", "Target Date": "Before Nov 2027", "Status": "To Do", "Notes": "Even an email from an accounting director saying they would test it."},
    {"Task": "Write EIC Pre-Accelerator application", "Phase": "EIC Application Prep", "Category": "Grant Applications", "Priority": "Critical", "Target Date": "October–November 2027", "Status": "To Do", "Notes": "Opens May 5 2027. Deadline November 18 2027."},
    {"Task": "Prepare EIC demo video for submission", "Phase": "EIC Application Prep", "Category": "Grant Applications", "Priority": "Critical", "Target Date": "October 2027", "Status": "To Do", "Notes": "Must show working prototype. Loom recording of Streamlit demo. 3 minutes max."},
    {"Task": "Calculate ROI for hospital CFO", "Phase": "EIC Application Prep", "Category": "Business Case", "Priority": "High", "Target Date": "Before submission", "Status": "To Do", "Notes": "10% EOPYY rejection reduction at EIMC scale = several million euros annually."},
    {"Task": "Prepare GDPR data processing documentation", "Phase": "EIC Application Prep", "Category": "Legal", "Priority": "Medium", "Target Date": "Before Nov 2027", "Status": "To Do", "Notes": "Needed before any live hospital data is processed."},
    {"Task": "EU AI Act classification analysis", "Phase": "EIC Application Prep", "Category": "Legal", "Priority": "Medium", "Target Date": "Before Nov 2027", "Status": "To Do", "Notes": "Healthcare billing AI may be high-risk under Article 6 + Annex III."},
    {"Task": "Update CLAUDE-BRIEF.md with new developments", "Phase": "Ongoing", "Category": "Admin", "Priority": "Low", "Target Date": "Ongoing", "Status": "Ongoing", "Notes": "Paste CLAUDE-BRIEF.md at start of any new Claude session to restore full context."},
]

def create_base():
    print("Creating Airtable base...")
    payload = {
        "name": "HealthLedgerAI — EIC Checklist",
        "tables": [{
            "name": "Tasks",
            "fields": [
                {"name": "Task", "type": "singleLineText"},
                {"name": "Phase", "type": "singleLineText"},
                {"name": "Category", "type": "singleLineText"},
                {"name": "Priority", "type": "singleSelect", "options": {"choices": [
                    {"name": "Critical", "color": "redBright"},
                    {"name": "High", "color": "orangeBright"},
                    {"name": "Medium", "color": "yellowBright"},
                    {"name": "Low", "color": "greenBright"},
                ]}},
                {"name": "Target Date", "type": "singleLineText"},
                {"name": "Status", "type": "singleSelect", "options": {"choices": [
                    {"name": "To Do", "color": "grayBright"},
                    {"name": "In Progress", "color": "blueBright"},
                    {"name": "Waiting", "color": "purpleBright"},
                    {"name": "Done", "color": "greenBright"},
                    {"name": "Ongoing", "color": "cyanBright"},
                ]}},
                {"name": "Notes", "type": "multilineText"},
            ]
        }]
    }
    r = requests.post("https://api.airtable.com/v0/meta/bases", headers=HEADERS, json=payload)
    if r.status_code != 200:
        print(f"Error creating base: {r.status_code} — {r.text}")
        return None, None
    data = r.json()
    base_id = data["id"]
    table_id = data["tables"][0]["id"]
    print(f"Base created: {base_id}")
    return base_id, table_id

def insert_tasks(base_id):
    print(f"Inserting {len(TASKS)} tasks...")
    records = [{"fields": t} for t in TASKS]
    for i in range(0, len(records), 10):
        batch = records[i:i+10]
        r = requests.post(
            f"https://api.airtable.com/v0/{base_id}/Tasks",
            headers=HEADERS,
            json={"records": batch}
        )
        if r.status_code != 200:
            print(f"Error inserting batch: {r.status_code} — {r.text}")
        else:
            print(f"  Inserted rows {i+1}–{min(i+10, len(records))}")
    print("Done! Open Airtable — your base is ready.")

if __name__ == "__main__":
    if TOKEN == "paste_your_token_here":
        print("ERROR: Paste your Airtable personal access token into the TOKEN variable in this script.")
    else:
        base_id, table_id = create_base()
        if base_id:
            insert_tasks(base_id)
