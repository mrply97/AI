# HealthLedgerAI — Master Business Brief
*Paste this at the start of any new Claude conversation to restore full context.*

---

## Who I Am
I am building **HealthLedgerAI** — an AI-powered compliance and accounting intelligence tool built specifically for hospital accounting departments in **Cyprus and Greece**.

- I hold a **PhD (in progress)** with research focused on hospital cooperation agreements in Cyprus and Greece — on-site immersion methodology
- My research is the foundation of the product. The AI is trained on real cooperation agreement structures and accounting compliance patterns I documented through fieldwork
- Website: healthledgerai.com (landing page live, product in R&D)
- Contact: info@healthledgerai.com

---

## What the Product Does

**IMPORTANT — Product Framing (resolved May 2026):**
Two framings exist across project files. They are NOT competing — they are two layers of the same system. Always frame them together:

**Layer 1 — Foundation (the differentiator):**
**Cooperation Agreement Mapping** — The AI reads, structures, and understands each hospital's specific cooperation agreements. This is the moat. Generic billing tools don't know what the agreements say. HealthLedgerAI does.

**Layer 2 — Output (what the CFO cares about):**
**Billing Error & Anomaly Detection** — Because the system knows the agreements, it detects when billing violates them. A taxonomy of error categories (billing wrong rate, expired agreement, missing pre-authorisation, wrong payer, duplicate claim, co-payment miscalculation, documentation gap, etc.) flows from the agreement layer. The detection accuracy is only possible *because* of the agreement foundation.

**How to frame it in conversation:**
- Lead with the pain: billing errors, rejected EOPYY claims, revenue loss, compliance risk
- Then explain the reason the detection is accurate: it's grounded in their actual agreements, not generic rules
- CFO angle: Layer 2 (revenue recovered, rejections reduced)
- Compliance angle: Layer 1 (agreement obligations tracked and enforced)
- CEO angle: both (revenue protection + compliance risk reduction)

**Core value proposition:** AI that reads hospital cooperation agreements and uses them as the ground truth to detect billing errors, prevent compliance violations, and protect revenue — so hospitals don't misclassify payments, miss obligations, or fail audits.

**Four product pillars:**
1. **Cooperation Agreement Mapping** — Extract structured data from agreements (PDFs, Word docs in Greek/English), identify parties, payment terms, compliance obligations
2. **Billing Error & Anomaly Detection** — Flag deviations from agreement terms before or after billing; taxonomy of error categories derived from agreement analysis
3. **Hospital-Specific AI** — Custom-trained per hospital client on their own agreement corpus
4. **On-Site Methodology** — Implementation includes embedded fieldwork with the accounting team (active: Erasmus placement in Greece provides live on-site research opportunity)

---

## Target Market

**Primary markets:** Greece and Cyprus (NOT Germany)

**Why these markets:**
- Hospital IT is less mature → more manual processes → bigger AI opportunity
- GESY (Cyprus, 2019) and EOPYY (Greece) create complex compliance obligations hospitals struggle with
- Greek/Cypriot hospitals manage cooperation agreements mostly manually (spreadsheets, paper)
- Less competition than Western European markets
- Relationship-based sales culture matches my on-site methodology

**Regulatory context:**
- Greece: Ειδικό Λογιστικό Σχέδιο Μονάδων Υγείας, EOPYY compliance, Greek anti-corruption law, ΑΑΔΕ audits
- Cyprus: GESY/HIO framework agreements, Cyprus DPA (GDPR), Ministry of Health regulations
- Both: EU AI Act (potential high-risk AI classification), GDPR

---

## Two Priority Target Hospitals

### 1. American Medical Center (AMC) — Nicosia, Cyprus
- 50 beds, private, **outside GESY** (deliberately), founded 1999
- 50% owned by PureHealth (Abu Dhabi) via HHG — acquired October 2025
- **SAP ERP confirmed** (partially implemented — "advantage not required" in job postings)
- Expanding: €60M Limassol hospital (2026) + new Nicosia tower
- Hiring Insurance Liaison Officer (May 2026) — billing bottleneck signal
- #1 most trusted hospital in Cyprus 9 consecutive years
- **Key contact:** Constantinos Michaelides (General Manager, accounting background, LinkedIn: /in/constantinos-michaelides-40520592)
- **Entry angle:** "You're recruiting a billing person. We're the AI that does it at scale, integrated with your SAP, before Limassol opens."

### 2. Ιατρικό Διαβαλκανικό Θεσσαλονίκης (EIMC) — Thessaloniki, Greece
- 383 beds, Athens Medical Group (ATHEX: ΙΑΤΡ), €270M group revenue
- **EOPYY contracted** — dual EOPYY + private insurance billing per patient
- JCI Gold Seal — December 2025 (first in Northern Greece)
- New €40M International Oncology Center opened 2024 (120 chemo beds, Elekta Versa HD, PET/CT)
- Working capital −€20.5M (June 2024) — revenue optimization is urgent
- 7,000 foreign patients/year from 53 countries (Balkan referral network: Sofia, Belgrade, Bucharest, Skopje)
- Imperial College Healthcare partnership (March 2024)
- **Key contact:** Dr. Vassilis Apostolopoulos (CEO, AMG) — group-level sale via Athens
- **Entry angle:** "Your Oncology Center is the most complex billing event in your history. Let's make the €40M investment pay faster."

---

## Current Status — Erasmus in Greece (upcoming)
The founder has an upcoming Erasmus placement in Greece (duration: several months). This creates a live on-site research and sales opportunity — particularly for EIMC Thessaloniki and the Athens Medical Group. The academic Erasmus context is a natural door-opener for hospital accounting department access ("researching hospital cooperation agreements"). The location within Greece will determine tactical priority (Thessaloniki = direct EIMC access; Athens = AMG group headquarters access).

---

## What I've Built So Far
- Landing page at healthledgerai.com (design complete — cream/gold/sage aesthetic, Cormorant Garamond + Jost typography)
- Hospital intelligence briefs (internal, not public): amc-cyprus.html, eimc-thessaloniki.html
- Full research on both target hospitals (see CLAUDE-CONTEXT.md for complete detail)
- No backend, no AI model, no product yet — in positioning/research phase

---

## What I Need Help With (Standing Priorities)
1. Product architecture decisions (LLM stack, RAG pipeline, Greek NLP)
2. Go-to-market strategy for Cyprus first, then Greece
3. DSGVO/GDPR documentation templates for hospital pilots
4. EU AI Act classification analysis
5. ROI calculator for hospital CFOs
6. Content and messaging for hospital outreach
7. Technical implementation planning

---

## Important Constraints
- **PhD research material is confidential** — do not suggest publishing hospital-specific analysis publicly
- Hospital pages (amc-cyprus.html, eimc-thessaloniki.html) are on a private git branch — NOT to be pushed to main/public
- The product is pre-launch — do not position as a finished product
- Language: hospital accounting in Greece/Cyprus is in Greek — any AI features must work in Greek
