# EIT AI Entrepreneurs Lab 2026 — Bootcamp Prep

**HealthLedger AI · Maria Polychroniadou · 9–13 November 2026 · Paris → Brussels → Amsterdam**

*Private — contains PhD research context. Do not share publicly.*

Sources for "already established": the EIT Jumpstarter application (April 2026), your EUC PhD research proposal and scholarship-application notes, the Notion "Creative Pitch" (8 Sept 2026), the Notion CV (1 Oct 2026), the Airtable EIC Checklist (last updated 14 June 2026), your status update of 29 Oct 2026, and this repository.

---

## First: this week

- **Place confirmed:** you replied before the 27 Oct deadline. Answer any eligibility or background-check request the same day.
- **Bookings:** if the final confirmation isn't in writing yet, wait for it before booking anything non-refundable.
- **Timings:** be in Paris by **Sun 8 Nov, 17:00**. The programme starts **Mon 9 Nov, 09:00** and ends **Fri 13 Nov** after the Final Showcase and Awards (19:00) in Amsterdam.
- **Travel:** the organisers book Paris → Brussels → Amsterdam. Travel and accommodation are reimbursed **up to €1,000**, so keep every receipt. Sharing accommodation with other finalists stretches that budget.
- **What's at stake:** a cohort of up to 15, and **up to five €10,000 awards** on the last day.
- **Still unknown:** the pitch length and judging criteria. Ask the organisers on Day 1.

---

## Day 1 — Paris · "Challenge everything you know"

*Founder global mindset. Counterfactual Lab: what if you're wrong?*

### Already established

- **A problem from the inside.** It comes from your friend in EIMC's accounting department: the identity-collision case that ended in legal proceedings against the wrong patient. The daily errors you discussed became your detectors.
- **A working engine.** Twelve classes per the September pitch. You built it in four days in March starting from zero code: first Python, then TypeScript.
- **Your strongest counterfactual, already written by you:** building the rules proved that rules can't scale. The upcoding detector over-flagged because the price ceilings were invented. Lead with this. It is exactly what this day rewards.
- **Eight weeks inside a Greek accounting office** (Erasmus for Young Entrepreneurs, June–August 2026, certificate received). You have already seen how little transfers between Greece and Cyprus.

### Still to face: the counterfactuals they will throw at you

1. **Wrong buyer?**
   - The accountants feel the pain, but the CFO owns the budget.
   - In hospital groups (Athens Medical Group; Hellenic Healthcare Group/PureHealth), purchasing happens at group level.
   - Your own pitch says you have never sold to a CFO. But your PhD questionnaire goes to the CFOs of both partner hospitals: that's your structured route to the buyer.
2. **Already solved?**
   - ERPs, SAP included, already have a basic duplicate-invoice check. EOPYY's own processing already rejects some errors. Duplicates alone are not a business.
   - Your defensible part is the cross-record checks an ERP doesn't do: identity collisions, unbundling across invoices, and invoices checked against appointments.
   - The other defensible part is each hospital's own contract rules.
3. **Wrong errors?**
   - "Surprise billing" is a US legal term. The 80% figure comes from a US billing-advocacy group. Check which country the 7–26% study measured.
   - In Greece and Cyprus the money may sit elsewhere: EOPYY claim rejections, co-payments, rebate and clawback reconciliation, GESY claims.
   - Know which of your twelve classes has a real Greek or Cypriot example, and which came from the literature.
4. **Flattering data?**
   - You wrote both the test data and the detectors.
   - The 1,371% CT-scan overcharge is a value you planted, measured against a ceiling you set yourself.
   - Say this before anyone else does.
5. **Wrong price, too small, too local?**
   - The Jumpstarter application prices the licence at €3–8K a year, which gives €120K revenue in year 3 from 15 hospitals.
   - The ROI story, meanwhile, claims millions in working-capital impact for a single hospital group. Both can't be right: either the value claim is too big, or the price is far too low.
   - Have a one-line answer for why Cyprus and Greece come first, and which market is next.
6. **Who owns it?**
   - Your CV says a patent disclosure is prepared, and the product will be validated inside your PhD at EUC's partner hospitals. Expect the question "Does the university own this?"
   - You built it in March 2026, self-funded, before the PhD. Have that answer ready, and know what EUC's IP policy says.

### Prepare before you go

- One page with your **five riskiest assumptions**. Write each one as: *"I believe… / I'm wrong if… / the cheapest test is…"*

---

## Day 2 — Paris · "Learning from the masters"

*Entrepreneurship fundamentals. Founders tell the truth and work alongside you.*

### Already established

- **A business model on paper** (from the Jumpstarter application):
  - four revenue streams: licence €3–8K, on-site implementation €1.5–3K, custom modules €2–5K, annual recalibration €1–2K;
  - a 3-year projection: €18K → €54K → €120K revenue.
- **Your first pilot sites come with your PhD:** AMC Nicosia and EIMC Thessaloniki, your university's partner hospitals, from February 2027 (details under Day 4). You skip the outsider cold start that stops most health-tech founders.
- **An honest status line**, already written by you: "No hospital has run this on its own data. I have never sold anything to a CFO."

### Still to face

1. **The on-site model doesn't scale past you.** Three days on site per hospital, at a €3–8K licence, barely covers the trip. Ideas to test with the founders:
   - sell the discovery itself as a paid assessment;
   - build country and payer templates, so each new site starts mostly configured;
   - use accounting firms that already serve clinics, like your Erasmus host, as implementation partners.
2. **From research partner to paying customer.** Your route avoids the cold sales cycle, but research access doesn't make anyone pay. Ask the founders how they turned a pilot partner into a first contract, and when they started charging.
3. **No company until February 2027.** You'll register in Cyprus when you move there for the PhD. Say exactly that; it also keeps you eligible for the EIC Pre-Accelerator. Ask whether the €10,000 is paid to a person or to a company, and what the tax consequences are.
4. **You are a solo founder.** The programme allows teams of two, and fourteen other AI founders will be in the room. One of them might become your technical co-founder or advisor.

### Prepare: five written questions for the founders

- How did you turn your first pilot partner into a paying customer, and how long did it take?
- What did you charge for your first pilot? Would you charge differently now?
- How did you keep research access and commercial work apart?
- How did you run a company during a PhD, and what broke?
- When and where did you incorporate, and why there?

---

## Day 3 — Brussels · "From AI project to AI venture"

*Make it useful or make it die. Trust as the value.*

### Already established

- **An honest answer to "where is the AI?"** (from the September pitch). Today it is a deterministic engine, built that way on purpose to learn the domain. The case for AI:
  - "normal" differs in every hospital;
  - the signal is relational, across invoices, patients and appointments;
  - precision is the product.
- **Trust by design:**
  - read-only access to hospital systems;
  - layered audit logging;
  - time-limited cryptographic session keys;
  - GDPR- and EHDS-aligned data handling;
  - an alert lifecycle (OPEN → PENDING → RESOLVED → DISMISSED) with an audit trail;
  - identity collisions held until a human verifies them.
- **Data protection planned the way hospitals expect** (from your PhD proposal and AMC notes): pseudonymised data that stays in the hospital, formal data-sharing agreements through the university, informed consent, and EUC ethics approval.
- **Synthetic data only so far**, so no personal data has been processed.

### Still to face

1. **Make the AI path concrete.**
   - Your alert lifecycle is already a labelling machine: every DISMISSED alert is a false-positive label, and every RESOLVED alert is a confirmed error.
   - That is the training data for per-hospital anomaly scoring. The path from rules to learning is built into what already exists.
   - For each step, name the model type, the data and the metric.
2. **There is no precision number yet.**
   - Before the trip, measure precision and recall against the answer key of your validation dataset.
   - It is still synthetic data, but it shows measurement discipline. Real-data precision is what the hospital pilots measure.
3. **"Make it useful."**
   - Expect to be pushed from twelve classes down to the one or two that win the first contract.
   - My pick: **identity collisions** (your founding story; they hurt people; ERPs don't catch them) and **upcoding against contract rates** (that's where the money is). Test this choice with the experts.
4. **EU AI Act and GDPR.**
   - As an internal billing check where a human decides, it is probably not high-risk.
   - That can change if a payer such as EOPYY or an insurer uses it on individual patients' claims or eligibility (Annex III, point 5).
   - Invoices with procedure codes are health data (GDPR Art. 9), and a decision that affects a patient must not be fully automated (Art. 22).
   - Brussels is the place to get this checked, so bring the question.
5. **A one-sentence trust pitch:** "The data never leaves the hospital — we come to the data." Make sure your TypeScript module can actually run that way.

### Prepare

- Two slides: **Where the AI is (now / next / later)** and **Trust by design**.
- Two questions for the policy and legal experts.

---

## Day 4 — Amsterdam · "Validate, endorse, improve"

*No customer, no company. Earn endorsements in the Proof Room.*

### Already established

- **Your access path is built in.** Your PhD research proposal names your first two sites: the **American Medical Center (Nicosia)** and the **European Interbalkan Medical Center (Thessaloniki)**. Both are partner institutions of European University Cyprus, and you will work with them as a supervised doctoral researcher from February 2027.
  - This is exactly the barrier the founder at Prof. Kythreotis's webinar couldn't get past: her breast-cancer app never made it into a hospital because she came from outside. You come in as a researcher.
  - Make this the centre of your Proof Room answer.
- **Structured access to the buyer.** Your PhD questionnaire goes to accounting staff, finance managers *and CFOs* at both hospitals.
- **A plan written in the hospital's language.** The AMC one-pager covers the problem, a three-phase project, what the hospital gains and provides, data protection, and a funding route (RIF "PhD in Industry").
- **Problem validation** from inside a hospital accounting department (your friend at EIMC).
- **An official EU certificate** for your Erasmus for Young Entrepreneurs placement in a Greek accounting office.
- **Academic backing.** Prof. Kythreotis is your supervisor, a Deputy Dean, and part of EUC's PEAK Innovation Center, the unit that handles industry cooperation.

### Still to face

To "no customer, no company" your honest answer is already strong: *"The company is registered in Cyprus in February 2027, when I move for the PhD. My first two pilot sites come through my university."* Four things will still be tested:

1. **A research partner isn't a paying customer yet.**
   - Expect: when do the hospitals pay, and on what terms? Have one sentence ready: research pilot first, commercial terms once the results show value.
   - Your notes already contain a bridge. AMC could host a RIF "PhD in Industry" project, bringing up to €150,000 of public funding. That would make AMC a formal R&D partner, not just a research site.
2. **Separate what's agreed from what's planned.**
   - The partnership is between EUC and the hospitals. Your own data access is still to be negotiated: your proposal plans data-access agreements in year 1 (2027–28) and data collection in year 2, and the AMC meeting was postponed while Prof. Kythreotis was away.
   - Until a hospital agrees to a pilot, say "my university's partner hospitals, where my doctoral research runs from 2027". Don't say "my customers" or "my pilot sites".
   - Your proposal says the prototype detects errors "in real hospital information system data". It hasn't run on real data yet, so on stage say it is *built for* that data.
3. **Your PhD studies AI adoption; it isn't a product trial.**
   - Your methods are a survey (SEM) and secondary financial data. Running HealthLedger AI on the hospitals' billing data needs its own written agreement.
   - Tell the ethics committee and the hospitals openly that you are both the researcher and the founder.
   - Expect "Aren't you evaluating your own product?" Your answer: the research question stays independent, and the pilot is separate and disclosed.
   - If your EIT Health capstone is still running (it needs a real organisation and the hospital's consent), it could be the right vehicle for the first demo.
4. **Timing.** Results on real data are a year or more away. Name a concrete first milestone (for example, a first demo at AMC in spring 2027), but only if it is realistic.

### Bring to the Proof Room (strongest first)

1. **A short letter from Prof. Kythreotis.** This is the strongest thing you can get in ten days, and since he asked to be kept informed, an update about the bootcamp is a natural reason to write. Ask him to confirm three things:
   - he supervises your PhD from February 2027;
   - the research is planned with EUC's partner institutions AMC and EIMC;
   - HealthLedger AI is the prototype behind the research's translational part.

   The letter should not claim the hospitals have agreed to a pilot.
2. **Your Erasmus for Young Entrepreneurs certificate**, as a scan on your laptop.
3. **The AMC one-pager**, shown as your plan. Don't hand it out.
4. **Your friend at EIMC.** Valuable, but **don't ask for anything in writing**: it could expose your friend at work.

### Also

- **Prepare a 60-second ask** for mentors and peers, and make it specific. For example: "an introduction to someone who has run a hospital R&D pilot in Cyprus", or "an advisor in anomaly detection".
- **"Improve."** Expect to rework the pitch overnight from Thursday to Friday. Keep the deck and the demo editable on your laptop.

---

## Day 5 — Amsterdam · "New pitch, new life"

*Final pitches and the €10,000 Test on Demo Day.*

### Already established

- **A strong story and the material to tell it:**
  - the founding case;
  - the honest AI framing;
  - two concrete numbers: a CT scan billed at €13,241 against a €900 ceiling (+1,371%), and an appendectomy split into three invoices (€265);
  - the founder arc: zero code → a working engine in four days → a TypeScript module.
- **Your unfair advantage, in one line:** "I met a founder whose app never got into a hospital because she was an outsider. I go in as a doctoral researcher, with my university's partner hospitals."
- **Your own closing line:** "find out, in a room full of people who will tell me the truth, whether anyone will actually pay for it." By Friday you will have spent four days in that room.
- **Brand and site:** healthledgerai.com.

### Still to face

1. **The format is unknown.** Ask on Day 1. Build a 3-minute version and a 1-minute version. For the 3 minutes:

   | Part | Time |
   |---|---|
   | Story | 20 s |
   | Problem, and who pays | 30 s |
   | Proof: one alert, one number | 45 s |
   | AI and trust | 30 s |
   | Access and validation so far | 20 s |
   | Market and model | 20 s |
   | The ask | 15 s |

2. **A concrete use for the €10,000.** Juries fund milestones, not wishes. For example: "€10,000 gets the first hospital pilot ready for 2027". That covers company registration in Cyprus, the legal and ethics groundwork (a data processing agreement and a data-protection impact assessment), and a pilot version that runs inside the hospital. Use real quotes, not guesses.
3. **Don't depend on a live demo.**
   - Bring a 45-second recording and screenshots; the demo video is still To Do in your tracker.
   - The TypeScript module is not in this repository, so I couldn't check it. Make sure it runs offline on your laptop.
   - Keep the Python demo as a fallback.
4. **Protect what's yours in public.** Listings suggest the finale is a public ecosystem event at AI House Amsterdam.
   - **Patent:** in Europe, a public disclosure before filing can kill a patent, and there is no general grace period. Before 9 Nov, either file, or pitch *what it does* rather than *how it works*. Ask the patent attorney who drafted your NDA this week.
   - **Don't name the hospitals on stage.** Say "two private hospitals in Cyprus and Greece that partner with my university". They haven't agreed to appear in a startup pitch, and you need their goodwill for data access.
   - **Never link the founding story to a hospital you'll work with.** The wrongly pursued patient stays "a hospital in Northern Greece". This protects your friend, the partnership, and you.
5. **Use one canonical feature list.** The counts don't match across your documents, and a juror who compares will notice:
   - the Jumpstarter application says 11 categories;
   - the September pitch and the PhD proposal say 12, counting risk scoring and Excel I/O as classes;
   - my June demo script has its own 11 labels. Three of those I added myself (undercoding, date mismatch, repeated same-day), and they found nothing in your dataset.

   Pick one list and use it everywhere.
6. **Rehearse the ten hardest questions**, 20 seconds each:
   1. Where's the AI?
   2. Why won't SAP or the hospital's IT vendor just add this?
   3. How do you get data access, and can you use research access commercially?
   4. What's your precision on real data?
   5. Who pays, and why so cheap?
   6. Why you?
   7. Why Cyprus and Greece, and how do you reach the rest of the EU?
   8. You're a solo founder — who builds with you?
   9. Who owns the IP?
   10. What changed in your plan this week?
7. **"New pitch, new life": show that the week changed you.** "On Monday I believed X; today I believe Y, because Z" is a closing juries remember.

---

## Ten-day countdown

| When | What |
|---|---|
| Thu 29 – Fri 30 Oct | Send Prof. Kythreotis an update on the bootcamp and ask for the short letter. Scan your Erasmus certificate. Ask your patent attorney about filing before 9 Nov. |
| Sat 31 Oct – Sun 1 Nov | Write the assumptions page. Fix one canonical feature list. Measure precision and recall against the answer key. |
| Mon 2 – Wed 4 Nov | Build the access slide: two partner hospitals, what's agreed versus planned, and the 2027 timeline. Write pitch v1 (3 min + 1 min). Record the demo video. |
| Thu 5 – Fri 6 Nov | Deck, Q&A rehearsal, offline demo test, and a check that no hospital is named on stage. Book travel once confirmed. |
| Sun 8 Nov | In Paris by 17:00. |

## Status as of 29 October 2026

- **Bootcamp place:** confirmed.
- **Erasmus for Young Entrepreneurs:** completed, certificate received.
- **EIT Jumpstarter:** not accepted (outside its focus).
- **Company:** to be registered in Cyprus in February 2027, when the PhD starts.
- **Nicosia, October:** online meeting with Prof. Kythreotis (he was abroad), and an invitation to his webinar with women entrepreneurs.
- **First pilot sites:** AMC Nicosia and EIMC Thessaloniki, through the PhD. Embryolab is no longer on the path.

---

*Programme facts (cohort of up to 15, up to five €10,000 awards, run by 28DIGITAL under the EIT Community AI & Robotics, finale listed at AI House Amsterdam) come from the confirmation email, your CV and public listings: [ecosistemastartup.com](https://ecosistemastartup.com/?p=110962), [28digital.eu info session](https://28digital.eu/newsroom/events/2026/ai-entrepreneurs-lab-2026-online-info-session/), [UKRO](https://www.ukro.ac.uk/news/eit-community-ai-robotics-ai-entrepreneurs-lab-call-launched/), [euagenda.eu](https://euagenda.eu/events/2026/11/13/ai-robotics-ecosystem-meetup). The official programme pages could not be opened from this session.*
