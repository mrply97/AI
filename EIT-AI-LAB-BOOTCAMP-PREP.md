# EIT AI Entrepreneurs Lab 2026 — Bootcamp Prep

**HealthLedger AI · Maria Polychroniadou · 9–13 November 2026 · Paris → Brussels → Amsterdam**

*Private — contains PhD research context. Do not share publicly.*

Sources for "already established": the EIT Jumpstarter application (April 2026), the Notion "Creative Pitch" (8 Sept 2026), the Notion CV (1 Oct 2026), the Airtable EIC Checklist (last updated 14 June 2026), and this repository.

---

## First: this week

- **Confirm your place.** The deadline to confirm to Parul Chaudhary (28DIGITAL) was **Tue 27 Oct, 21:00 CET**. If you haven't replied yet, reply today. Your place still depends on eligibility and background checks, so answer any document request the same day.
- **Don't book anything non-refundable** until the final confirmation arrives.
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
- **Eight weeks inside a Greek accounting office** (EYE, June–August 2026). You have already seen how little transfers between Greece and Cyprus.

### Still to face: the counterfactuals they will throw at you

1. **Wrong buyer?**
   - The accountants feel the pain, but the CFO owns the budget.
   - In hospital groups (Athens Medical Group; Hellenic Healthcare Group/PureHealth), purchasing happens at group level.
   - Your own pitch says you have never sold to a CFO.
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
   - Your CV says a patent disclosure is prepared, and the product becomes your PhD subject at EUC in 2027. Expect the question "Does the university own this?"
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
- **A go-to-market thesis:** on-site discovery first (2–3 days embedded), and warm introductions only.
- **A better first target.** Your tracker already moved the first target from large hospitals to **Embryolab**, via Dr. Kuriakidis. It is a smaller clinic with mixed EOPYY and private billing. That's a sound beachhead instinct.
- **An honest status line**, already written by you: "No hospital has run this on its own data. I have never sold anything to a CFO."

### Still to face

1. **The on-site model doesn't scale past you.** Three days on site per hospital, at a €3–8K licence, barely covers the trip. Ideas to test with the founders:
   - sell the discovery itself as a paid assessment;
   - build country and payer templates, so each new site starts mostly configured;
   - use accounting firms that already serve clinics, like your EYE host, as implementation partners.
2. **Hospital sales cycles are long** (procurement, IT security, the data-protection officer). You need a first customer who can say yes in weeks, such as a clinic or a diagnostic centre.
3. **There is no company yet.** The Cyprus Ltd you need for EIC eligibility is still open in your tracker. Ask whether the €10,000 is paid to a person or to a company, and what the tax consequences are.
4. **You are a solo founder.** The programme allows teams of two, and fourteen other AI founders will be in the room. One of them might become your technical co-founder or advisor.

### Prepare: five written questions for the founders

- How did you land your first customer in a regulated sector, and how long did it take?
- What did you charge for your first pilot? Would you charge differently now?
- How did you get real data before you had a customer?
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
- **Synthetic data only so far**, so no personal data has been processed.

### Still to face

1. **Make the AI path concrete.**
   - Your alert lifecycle is already a labelling machine: every DISMISSED alert is a false-positive label, and every RESOLVED alert is a confirmed error.
   - That is the training data for per-hospital anomaly scoring. The path from rules to learning is built into what already exists.
   - For each step, name the model type, the data and the metric.
2. **There is no precision number yet.**
   - Before the trip, measure precision and recall against the answer key of your validation dataset.
   - It is still synthetic data, but it shows measurement discipline. Real-data precision is what a pilot measures.
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

- **Problem validation** from inside a hospital accounting department (your friend at EIMC).
- **An official EU programme placement** in a Greek accounting office (Erasmus for Young Entrepreneurs), adapting the prototype to Greek tax rules.
- **Academic backing:** Prof. Kythreotis (EUC) and a defined PhD topic.
- **Warm introductions:** Dr. Kuriakidis → Embryolab; EUC → AMC; your friend → EIMC.
- **Templates ready:** observer certificate, and NDAs under Cyprus and Greek law.

### Still to face: this is your biggest gap

- **The status of your evidence is unclear.** Your tracker (last updated 14 June) still shows these as **To Do**:
  - the Embryolab demo;
  - the Embryolab letter of intent;
  - the host-firm certificate.

  Your September pitch also says no hospital has used the product. If any of these happened since, it is your strongest Proof Room material, so bring originals or scans.
- **If not, you have ten days.** In order of weight:
  1. **Embryolab billing or admin contact.** Arrange a 20-minute video demo via Dr. Kuriakidis next week, then ask for three sentences by email: "these errors are real for us; we would pilot." An email counts.
  2. **Your EYE host office.** A short letter on letterhead saying a finance professional reviewed the logic. Ideally signed by Kyriakos Keramidas, the host named on your EYE paperwork and your CV.
  3. **Prof. Kythreotis.** A letter supporting the path from research to venture.
  4. **Your friend at EIMC.** Valuable, but **don't ask for anything in writing**: it could expose your friend at work.
- **Claim only what you can show.** The Jumpstarter application called AMC and EIMC "partner hospitals". Unless something is signed, say "target pilot sites". In a room built to test proof, one overclaim costs more than any gap.
- **Prepare a 60-second ask** for mentors and peers, and make it specific. For example: "one introduction to a private-clinic CFO in Greece or Cyprus", or "an advisor in anomaly detection".
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
   | Validation so far | 20 s |
   | Market and model | 20 s |
   | The ask | 15 s |

2. **A concrete use for the €10,000.** Juries fund milestones, not wishes. For example: "€10,000 buys the first real-data precision number." That means one clinic pilot on pseudonymised data, with a data processing agreement and a short legal review, plus company registration. Use real quotes, not guesses.
3. **Don't depend on a live demo.**
   - Bring a 45-second recording and screenshots; the demo video is still To Do in your tracker.
   - The TypeScript module is not in this repository, so I couldn't check it. Make sure it runs offline on your laptop.
   - Keep the Python demo as a fallback.
4. **Protect what's yours in public.** Listings suggest the finale is a public ecosystem event at AI House Amsterdam.
   - **Patent:** in Europe, a public disclosure before filing can kill a patent, and there is no general grace period. Before 9 Nov, either file, or pitch *what it does* rather than *how it works*. Ask whoever prepared your patent disclosure this week.
   - **Anonymise:** say "a private hospital in Northern Greece", not EIMC, and keep the patient case unidentifiable. This protects your friend and you, for the same reason you kept the hospital research private.
5. **Use one canonical feature list.** The counts don't match across your documents, and a juror who compares will notice:
   - the Jumpstarter application says 11 categories;
   - the September pitch says 12, counting risk scoring and Excel I/O as classes;
   - my June demo script has its own 11 labels. Three of those I added myself (undercoding, date mismatch, repeated same-day), and they found nothing in your dataset.

   Pick one list and use it everywhere.
6. **Rehearse the ten hardest questions**, 20 seconds each:
   1. Where's the AI?
   2. Why won't SAP or the hospital's IT vendor just add this?
   3. How do you get data access, and what about GDPR?
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
| Thu 29 – Fri 30 Oct | Confirm your participation if you haven't. Send the endorsement requests: Dr. Kuriakidis/Embryolab, the host office, Prof. Kythreotis. Ask about the patent filing. |
| Sat 31 Oct – Sun 1 Nov | Write the assumptions page. Fix one canonical feature list. Measure precision and recall against the answer key. |
| Mon 2 – Wed 4 Nov | Embryolab demo call. Pitch v1 (3 min + 1 min). Record the demo video. |
| Thu 5 – Fri 6 Nov | Deck, Q&A rehearsal, offline demo test, anonymisation pass. Book travel once confirmed. |
| Sun 8 Nov | In Paris by 17:00. |

## What I can't see: tell me and I'll update this

- Did you confirm by 27 Oct, and have you received final confirmation?
- Did the Embryolab demo or letter, or the host-firm certificate, happen?
- What was the EIT Jumpstarter result?
- Is the Cyprus company registered?
- Did the October Nicosia visit (Prof. Kythreotis / AMC) happen?

---

*Programme facts (cohort of up to 15, up to five €10,000 awards, run by 28DIGITAL under the EIT Community AI & Robotics, finale listed at AI House Amsterdam) come from the confirmation email, your CV and public listings: [ecosistemastartup.com](https://ecosistemastartup.com/?p=110962), [28digital.eu info session](https://28digital.eu/newsroom/events/2026/ai-entrepreneurs-lab-2026-online-info-session/), [UKRO](https://www.ukro.ac.uk/news/eit-community-ai-robotics-ai-entrepreneurs-lab-call-launched/), [euagenda.eu](https://euagenda.eu/events/2026/11/13/ai-robotics-ecosystem-meetup). The official programme pages could not be opened from this session.*
