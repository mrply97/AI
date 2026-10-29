# HealthLedgerAI — Full Research Context
*Complete reference document. Paste into Claude alongside CLAUDE-BRIEF.md for full context.*
*Last updated: May 2026 | Confidential — PhD Research Material*

---

## PART 1: MARKET & REGULATORY ANALYSIS

### Greece Regulatory Framework
| Area | Regulation |
|---|---|
| Hospital accounting | Ειδικό Λογιστικό Σχέδιο Μονάδων Υγείας (Special Accounting Plan for Healthcare Units) — mandatory |
| EOPYY reimbursement | Ν. 4238/2014 + EOPYY Unified Price List (ΕΚΠΥ) |
| Anti-corruption | Ν. 4254/2014, Ν. 3213/2003 |
| Private clinic licensing | ΠΔ 84/2001 |
| Data protection | GDPR + HDPA (Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα) |
| Tax audits | ΑΑΔΕ / ΣΔΟΕ |

### Cyprus Regulatory Framework
| Area | Regulation |
|---|---|
| GESY participation | HIO (ΟΑΥ) framework agreements — since 2019 |
| GESY billing | HIO portal, DRG-based payment system |
| Data protection | GDPR + Cyprus DPA (Επίτροπος Προστασίας Δεδομένων) |
| Accounting | IFRS as adopted in Cyprus |

### Greek Healthcare IT Market
Common ERP/HIS systems in Greek private hospitals:
- **SingularLogic** — dominant in mid-size Greek private hospitals (priority integration target)
- **Epsilon/Entersoft** — growing market share
- **Priority Software** — present in hospital groups
- **Custom/in-house** — common in public hospitals
- **SAP FI/CO** — large private groups (Hygeia, Metropolitan, Euromedica, and confirmed at AMC Cyprus)

### Why Greek NLP is Critical
All cooperation agreements, accounting entries, and EOPYY correspondence are in Greek. Any AI feature must:
- Read Greek-language PDFs (including scanned documents)
- Handle Greek legal terminology precisely
- Generate explanations and reports in Greek
- Work with both formal legal Greek and modern administrative Greek
Recommended approach: Multilingual LLM (Mistral, LLaMA-3, or GPT-4o) with RAG over Greek legal text corpus.

---

## PART 2: AMC CYPRUS — COMPLETE RESEARCH

### Identity
- **Legal name:** C & S American Heart Institute Limited
- **Operating name:** American Medical Center (AMC) / American Heart Institute (AHI)
- **Address:** 215 Spyrou Kyprianou Ave, Strovolos, Nicosia 2047, Cyprus
- **Phone:** +357 22 476 657 / +357 22 476 777 | **HR:** hr@amc.com.cy
- **Website:** amc.com.cy
- **Founded:** 1998 (incorporated); operations began July 1999; current premises March 2011
- **Size:** 50 beds, 5+ operating theatres, helipad, ICU, cath lab/hybrid OR, 10,000 m²
- **Staff:** ~123+ employees

### Ownership (as of Oct 2025)
- 50% founders (Dr. Soteriou & Dr. Christou via C&S AHI Ltd.)
- 50% PureHealth (Abu Dhabi, UAE) via Hellenic Healthcare Group → Evacol Ltd.
  - HHG acquisition approved: Cyprus Competition Commission, October 25, 2024
  - PureHealth acquired 60% of HHG for €800M: October 2025
  - HHG full equity implied value: ~€1.3 billion
- Two entities: AMERICAN MEDICAL CENTER A.M.C. (i-Cyprus #443222) + AMERICAN MEDICAL CENTER CYPRUS SERVICES (i-Cyprus #511417)

### GESY Status: DELIBERATELY OUTSIDE
- April 2019: AMC publicly accused HIO of "deceiving the public" — named confrontation
- Limassol hospital (2023 announcement): explicitly outside GESY
- All revenue is private: insurance + self-pay + Ministry of Health state-referral
- No HIO billing, no OAY interactions

### ERP Confirmed: SAP
Evidence from three job postings (Jan–May 2026):
1. Casualty Administrator (Jan 22, 2026): "Knowledge of SAP system will be considered an advantage"
2. Payroll Accountant (Jan 7, 2026): "Knowledge of SAP system will be considered an advantage"
3. Insurance Liaison & Administrative Officer (May 2026): "Hands-on proficiency with SAP ERP software is listed as a desirable criterion"
The "advantage not required" phrasing = system implemented but not fully embedded

### Insurance Partners (Inferred)
CNP Cyprialife, Eurolife (Bank of Cyprus), Universal Life, AXA, Allianz, Bupa/Cigna International, MetLife Cyprus + US/international plans (US Embassy recommended provider)

### Ministry of Health Agreement
Bilateral state-referral agreement since 2001 — predates GESY, still active. Government refers complex cardiac/surgical cases at negotiated rates.

### Key Cooperation Agreements
| Partner | Type | Since |
|---|---|---|
| PureHealth/HHG | 50% equity, group membership | Oct 2024 |
| Ministry of Health Cyprus | State-referral agreement | 2001 |
| University of Cyprus / FAETHON | 6-year energy/sustainability MOU | Oct 2024 |
| International patient networks | Medical tourism | Active |

### Accreditations
ISO 9001 (since 2004, TÜV Rheinland, annual audits) · ISO 22000 · ISO 18000 · No JCI

### Services
Originally cardiovascular; full-service tertiary since 2011. Full list: Cardiothoracic surgery, interventional cardiology, robotic surgery (da Vinci), neurosurgery, orthopedics, spine, vascular, oncology, nephrology/hemodialysis, IVF/maternity, pediatrics, ENT, ophthalmology, dermatology, 24/7 emergency, rehabilitation, sports medicine.

### Financial
Private company — no public accounts. Indicators:
- Limassol project: €60M (approved Jan 2025, 12,900 m², 10 floors, 68 beds, target 2026)
- Nicosia medical tower: additional investment (Feb 2025, scale undisclosed)
- HHG stake valued as "substantial" within ~€1.3B group

### Compliance History
Clean. Competition Commission cleared HHG acquisition unconditionally (Oct 2024). ISO audits maintained annually since 2004. 2019 HIO dispute was political/strategic, not regulatory.

### Key Personnel
| Name | Role | Contact |
|---|---|---|
| Constantinos Michaelides | General Manager (de facto CFO) | LinkedIn: /in/constantinos-michaelides-40520592 |
| Dr. Marinos C. Soteriou | Co-Founder, Chairman, Cardiothoracic Surgeon | amc.com.cy |
| Dr. Christos P. Christou FACC | Co-Founder, Cath Lab Director | amc.com.cy |
| Marios Georgiou PhD | Director of Nursing | LinkedIn available |
| Dimitris Spyridis | HHG/PureHealth CEO (parent) | Via HHG |

### Pain Points Summary
1. 100% private billing — no GESY standardisation
2. SAP underutilised — partially implemented
3. Insurance liaison bottleneck — hiring dedicated role May 2026
4. Limassol launch (2026) — billing infrastructure needed before Day 1
5. PureHealth group reporting requirements incoming
6. Three open finance roles — team short-staffed
7. Medical tourism cross-border billing complexity

### Entry Strategy
1. LinkedIn outreach to Constantinos Michaelides
2. Hook: "You're hiring an Insurance Liaison Officer. We built the AI that does what they'll do — at scale, in SAP."
3. Timing: Limassol opens 2026 — decisions must happen now
4. PhD credential resonates with US-trained founders

---

## PART 3: EIMC THESSALONIKI — COMPLETE RESEARCH

### Identity
- **Full name:** ΙΑΤΡΙΚΟ ΔΙΑΒΑΛΚΑΝΙΚΟ ΘΕΣΣΑΛΟΝΙΚΗΣ
- **English:** European Interbalkan Medical Center (EIMC)
- **Address:** Ασκληπιού 10, Πυλαία, 55535, Θεσσαλονίκη
- **Phone:** +30 2310 400000 | **EOPYY desk:** 2310-400212/213/463/464/940/476708
- **HR:** cv.imc@interbalkan-hosp.gr
- **AFM (Tax ID):** 094129169 | **EOPYY Installation No:** 39713

### Ownership
- 100% Athens Medical Group S.A. (Ιατρικό Αθηνών Ε.Α.Ε.)
- Listed: Athens Stock Exchange — ticker: ΙΑΤΡ
- NOT part of Hygeia Group (separate competitor, now owned by CVC/Vivantes)
- GEMI: 000356301000

### Scale
383 beds · 18 operating rooms (incl. 1 Hybrid Robotic "Υπερίων") · 21-bed ICU · 50,000 m² campus on 60-acre plot · 1,000+ associate physicians · 800+ employees

**Plus new (2024):** 12,000 m² International Oncology Center · 120 chemo beds · Elekta Versa HD (IMRT/IGRT/VMAT) · digital PET/CT · automated chemotherapy installation

### EOPYY Status: Contracted Provider
- Contract: Board Decision ΑΔΑ: ΩΚ8ΚΟΞ7Μ-ΓΧ2, January 15, 2016
- Co-payment absorption model: up to €1,000/stay when EOPYY + private insurer used together
- EOPYY payment confirmed via Diavgeia: yperdiavgeia.gr/decisions/view/21903586
- No publicly reported EOPYY audit disputes

### Accreditations
- **JCI Gold Seal — December 2025** (first in Northern Greece; 8th edition standards; full hospital scope)
- ISO 9001:2015 (TÜV HELLAS) · ISO 22000 · TEMOS (×2 — Quality + Excellence in Medical Tourism) · GHA 2018 (first general hospital in Europe to receive GHA)

### Financials (Athens Medical Group Consolidated)
| Period | Revenue | EBITDA | Net Profit |
|---|---|---|---|
| FY 2023 | €258.4M | €38.1M | €8.2M |
| FY 2024 | €269.8M (+4.4%) | €32.0M (−16%) | €1.9M (−77%) |
| H1 2025 | €142.8M (+0.8%) | €17.1M (−31.6%) | €1.2M (−84.3%) |
**Working capital:** −€20.5M consolidated (June 2024) · NBG revolving credit €5M (Sept 2024)
**Investments:** €5M new ORs (Feb 2023) · €40M Oncology Center (2024) · €? Ellinikon Healthcare Park (2027)

### ERP/IT
Not publicly confirmed. AMG joined Clinerion (Swiss patient data platform) 2018 — implies structured EHR integration. Discovery needed via LinkedIn for IT staff titles.

### Insurance Partners
Eurolife FFH (confirmed) · Interamerican (confirmed) · Εθνική Ασφαλιστική (confirmed) · Generali · Allianz Ευρωπαϊκή Πίστη · ERGO · NN Hellas · Groupama · others. AMG actively recruited insurance sector executives (2024) to deepen these relationships.

### Cooperation Agreements
| Partner | Type | Year |
|---|---|---|
| Imperial College Healthcare NHS Trust | International clinical partnership — first in Europe in IC network | March 2024 |
| LAMDA Development / Ellinikon | 10-year Healthcare Park MOU | April 2024 |
| Clinerion (Switzerland) | Clinical trial patient network | 2018 |
| FIMS | Sports Medicine Collaborating Center | Active |
| MEDSANA Romania | AMG subsidiary — 4 diagnostic centres in Bucharest | Active |
| Sofia / Belgrade / Skopje | AMG diagnostic centres — Balkan referral pipeline | Active |
| EOPYY | National payer contract | Since 2016 |
| 10+ private insurers | Direct billing agreements | Active |
| ΤΕΑΕΑΠΑΕ + union funds | Supplementary benefits | Active |

### Balkan Patient Flows
~7,000 foreign patients/year from 53 countries across AMG. Primary Balkan sources: Bulgaria (EU), Romania (EU), Serbia (non-EU, bilateral agreement with Greece), North Macedonia (non-EU). Each requires different billing pathway.

### Key Personnel
| Name | Role | Contact |
|---|---|---|
| Dr. Vassilis G. Apostolopoulos | CEO/MD, Athens Medical Group | Via AMG press office |
| Christos Apostolopoulos | Executive Vice Chairman, AMG | Via AMG press office |
| Site CFO/Finance Director | Not publicly named | LinkedIn search needed |
| Site IT Director | Not publicly named | LinkedIn search needed |

### Pain Points Summary
1. Dual EOPYY + private insurance billing per patient — co-payment absorption model
2. Oncology Center billing ramp-up — 120 new beds, complex chemotherapy protocols
3. Working capital −€20.5M — faster collections = direct CFO value
4. Cross-border billing — 53 countries, 4 Balkan referral networks
5. JCI continuous compliance — 1,000+ elements, ongoing
6. Cooperation agreement complexity — Imperial College, LAMDA, Clinerion, FIMS, 10+ insurers, EOPYY, union funds
7. EOPYY reimbursement lag — systemic Greek-market issue

### Entry Strategy
1. NOT a site-level sale — must go through AMG group (Athens)
2. Entry event: Annual Oncology Symposia at EIMC — attend as researcher
3. Hook: "Your Oncology Center is the most complex billing event in your history. Let's make the €40M investment pay faster."
4. Financial hook: Working capital improvement from faster collections
5. JCI hook: AI-assisted compliance monitoring as permanent infrastructure
6. PhD hook: Imperial College partnership signals they value academic credibility — lead with research

---

## PART 4: PRODUCT GAPS & ROADMAP

### Critical Missing (Must Build)
1. Greek NLP pipeline (multilingual LLM + RAG on Greek legal text)
2. Document ingestion (OCR + extraction from Greek PDF agreements)
3. EOPYY claim pre-validation module
4. GESY/HIO integration (Cyprus entry point)
5. Basic compliance rules engine (Special Healthcare Accounting Plan)
6. SAP connector (confirmed at AMC)
7. Audit trail module (immutable log of all AI decisions)
8. GDPR/AVV documentation for hospital pilots

### Important (Phase 2)
1. Contract lifecycle management (renewal alerts, version history)
2. Multi-insurance reconciliation engine
3. Cross-border patient billing automation
4. Explainability layer (AI must cite specific law paragraphs)
5. Regulatory update feed (when laws change)
6. SingularLogic connector (Greek ERP)

### Strategic Gaps
1. EU AI Act compliance strategy (potential high-risk AI classification)
2. On-premise/private cloud deployment option (hospitals won't put data on public cloud)
3. ROI calculator for hospital CFOs (€ per hour saved × staff × hours)
4. Pilot agreement template (scope, data ownership, confidentiality, reference rights)
5. Partnership with Greek/Cypriot healthcare IT consulting firm for distribution

### Go-to-Market Sequence
1. **Cyprus first** (AMC) — English-speaking, smaller, faster decisions, SAP confirmed
2. **Greece second** (EIMC) — larger market, longer cycle, group-level sale
3. **Expand** — Other GESY hospitals (Cyprus), other Greek private hospital groups (Hygeia, Metropolitan, Euromedica)
4. **Regional** — Balkans (via EIMC's referral network), possibly Middle East (via PureHealth/AMC connection)

---

## PART 5: KEY SOURCES FOR FUTURE RESEARCH

### Cyprus
- hio.org.cy — GESY/HIO framework, hospital contracts
- cy.usembassy.gov — AMC recommended provider listing
- cbn.com.cy — Cyprus Business News
- cyprus-mail.com — English-language Cyprus press
- financialmirror.com — Financial Mirror Cyprus
- i-cyprus.com — Company registry

### Greece
- eopyy.gov.gr — EOPYY provider registry and contracts
- yperdiavgeia.gr / diavgeia.gov.gr — Government transparency portal
- naftemporiki.gr — Business newspaper
- euro2day.gr — AMG stock exchange announcements
- capital.gr, liberal.gr — Greek business press
- voria.gr — Thessaloniki regional news
- kariera.gr, skywalker.gr — Greek job postings (ERP system discovery)
- gemi.gov.gr — Greek company registry

### Regulatory
- eur-lex.europa.eu — EU AI Act full text
- ec.europa.eu/health — EU health policy
- moh.gov.cy — Cyprus Ministry of Health
- moh.gov.gr — Greek Ministry of Health
