# CivicSignal — Multimodal Civic-Meeting Intelligence Platform

A portfolio project proposal for a mid-level SWE (2–6 YOE) pivoting into AI engineering.
Designed around the Hugging Face task taxonomy (huggingface.co/tasks), targeted at the
2026 AI engineering job market, and scoped for a solo engineer to ship in 1–3 months.

---

## 1. The project in one paragraph

**CivicSignal** ingests everything a city government publishes — multi-hour council
meeting videos, 500-page scanned agenda packets, budget spreadsheets, and ordinance
PDFs — and turns it into a queryable, citation-backed intelligence system. A user
(journalist, realtor, small-business owner, civic activist, or GovTech analyst) asks
questions like *"What zoning variances were approved near 5th & Main in the last six
months, and who spoke against them?"* and gets an answer grounded in exact video
timestamps, page-level document citations, and budget line items — with a verifier
agent that refuses to answer when the evidence isn't there.

**The real-world problem:** local government produces enormous amounts of public
information that is practically inaccessible — 3-hour videos with no transcripts,
scanned PDF packets with no text layer, budgets buried in tables. Local news is
shrinking; nobody watches these meetings. This is a genuine transparency gap, not a
toy scenario — and the same technical shape (long-form audio + messy scanned documents
+ tables + cross-document entity tracking) is exactly what enterprise AI teams deal
with in meeting intelligence, compliance, and contract analysis.

**Why it stands out:** hiring managers in 2026 have seen a thousand "chat with your
PDF" and "finance news summarizer" projects. Almost nobody has built multimodal RAG
over *civic* data, and the ingredients (visual document retrieval over scanned packets,
diarized long-form ASR, agentic verification) are individually hard and collectively
rare. It also demos beautifully: pick a real city, show a real answer, click through
to the real video timestamp.

---

## 2. Hugging Face tasks used (from the tasks page)

| HF task (as shown on huggingface.co/tasks) | Role in CivicSignal |
|---|---|
| **Automatic Speech Recognition** (Audio) | Transcribe meeting audio/video (Whisper-family, e.g. `distil-whisper` / faster-whisper) |
| **Audio Classification** (Audio) | Speaker diarization + segment typing (pyannote pipeline; public comment vs. council discussion) |
| **Visual Document Retrieval** (Multimodal) | The differentiator: ColPali/ColQwen2-style retrieval directly over scanned agenda-packet page images — no lossy OCR step. Only ~183 models in this category; using it signals you track the frontier |
| **Document Question Answering** (Multimodal) | Page-level QA over retrieved packet pages with a vision-language model |
| **Table Question Answering** (NLP) | Budget and fee-schedule tables ("How much did the police overtime budget grow YoY?") |
| **Summarization** (NLP) | Per-agenda-item meeting summaries and weekly digests |
| **Feature Extraction / Sentence Similarity** (NLP) | Text embeddings (e.g. `bge-m3`) for the pgvector index; cross-meeting topic linking |
| **Text Ranking** (NLP) | Cross-encoder reranking (e.g. `bge-reranker-v2-m3`) after hybrid retrieval — a production RAG pattern most portfolios skip |
| **Token Classification** (NLP) | NER over transcripts/documents: people, vendors, parcels, ordinance numbers → entity graph |
| **Zero-Shot Classification** (NLP) | Topic tagging (zoning, budget, public safety, housing…) without labeled training data |
| **Text Generation** (NLP) | Answer synthesis and agent reasoning (hosted LLM + one self-hosted open model to show inference-ops skills) |

Nine-plus tasks across three sections of the taxonomy (Multimodal, NLP, Audio), each
load-bearing rather than decorative.

---

## 3. System design

```
                        ┌────────────────────────────────────────────┐
                        │  INGESTION (event-driven, queue-backed)    │
  Legistar / Granicus   │  • poll city APIs for new meetings/packets │
  YouTube (city chans)  │  • yt-dlp → audio → faster-whisper ASR    │
  Socrata open data  ──▶│  • pyannote diarization, segment merge     │
                        │  • packet PDFs → page images → ColPali     │
                        │    multi-vector index + OCR fallback       │
                        │  • table extraction → structured store     │
                        └───────────────┬────────────────────────────┘
                                        ▼
                        ┌────────────────────────────────────────────┐
                        │  INDEX LAYER (Postgres)                    │
                        │  • pgvector: dense text embeddings         │
                        │  • tsvector: BM25-style lexical search     │
                        │  • ColPali page-image vectors              │
                        │  • entity graph (NER-derived)              │
                        └───────────────┬────────────────────────────┘
                                        ▼
                        ┌────────────────────────────────────────────┐
                        │  AGENT LAYER (LangGraph)                   │
                        │  Planner → routes to:                      │
                        │   • TranscriptAgent (hybrid + rerank)      │
                        │   • DocumentAgent (visual doc retrieval)   │
                        │   • TableAgent (Table QA / SQL)            │
                        │  CitationVerifier → checks every claim     │
                        │  against sources; can reject & re-retrieve │
                        └───────────────┬────────────────────────────┘
                                        ▼
                        ┌────────────────────────────────────────────┐
                        │  SERVING & OPS                             │
                        │  FastAPI (streaming SSE) + Next.js UI      │
                        │  Langfuse traces • cost/latency dashboards │
                        │  Eval harness in CI (gate on regression)   │
                        └────────────────────────────────────────────┘
```

Key production patterns demonstrated (the things JDs actually ask for):

- **Hybrid retrieval + reranking** — dense (pgvector) + lexical (tsvector) fused with
  RRF, then cross-encoder rerank. Measured, not vibes: report recall@k deltas.
- **Multi-vector / late-interaction retrieval** for scanned pages (ColPali) — 2025–26
  state of the art for document RAG.
- **Multi-agent orchestration with a verifier** — LangGraph graph with typed state,
  conditional edges, retry-with-feedback loop when the CitationVerifier rejects an
  answer. Refusal ("insufficient evidence") is a first-class outcome.
- **Eval harness as CI gate** — a golden dataset of ~150–200 Q&A pairs over 2–3 real
  cities: retrieval metrics (recall@5, MRR), generation metrics (faithfulness,
  citation accuracy via RAGAS + custom LLM-as-judge with human-verified samples),
  agent metrics (correct routing rate, refusal correctness). GitHub Actions runs the
  suite on every PR; a faithfulness or recall regression fails the build.
- **LLMOps** — Langfuse tracing on every request, prompt versioning, per-query cost
  and token accounting, model-swap A/B (hosted frontier model vs. self-hosted
  quantized open model on Modal) with eval-backed comparison.
- **Scalability story** — queue-backed idempotent ingestion, incremental indexing,
  cached embeddings, batch GPU inference for ASR/ColPali on Modal serverless GPUs so
  cost is ~$0 at idle. Documented in the README with a load-test result.

---

## 4. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Orchestration | **LangGraph** | The 2026 JD keyword for agentic workflows; typed state graphs beat ad-hoc chains |
| RAG plumbing | **LlamaIndex** (ingestion/chunking) or lightweight custom | Shows you know the ecosystem but aren't framework-captured |
| Vector store | **Postgres + pgvector** | One database for vectors, lexical search, entities, and app state — a deliberate, defensible architecture decision (vs. Pinecone) you can discuss in interviews; mention Pinecone/Qdrant as the managed-scale alternative |
| Models (hosted) | Claude / GPT via API | Answer synthesis, LLM-as-judge |
| Models (self-hosted) | faster-whisper, ColQwen2, bge-m3, bge-reranker, pyannote on **Modal** serverless GPUs | Real inference ops: quantization, batching, cold-start management |
| API | **FastAPI** + SSE streaming | Standard |
| Frontend | **Next.js** | Timestamp-linked video player + page-image citations |
| Observability | **Langfuse** (OSS) | Tracing, prompt mgmt, cost tracking; self-hostable |
| Evals | **RAGAS + custom judge + pytest**, run in **GitHub Actions** | Eval-gated CI is the single strongest differentiator |
| Infra | Docker Compose local; Fly.io/Railway app + Modal GPU; Terraform optional | Solo-feasible, cheap |

Data sources (all real, free, public): **Legistar Web API** (hundreds of US cities),
**Granicus/YouTube** city channels for video, **Socrata/CKAN** open-data portals for
budgets. No auth walls, no licensing issues — ideal for a public portfolio.

---

## 5. How it maps to 2026 AI-engineering JDs

| Common JD requirement | Where CivicSignal proves it |
|---|---|
| "Design and ship RAG systems in production" | Hybrid retrieval + rerank + multimodal index, with measured retrieval metrics |
| "Agentic workflows / multi-agent systems" | LangGraph planner–specialist–verifier graph with retries and refusal paths |
| "LLM evaluation and quality" | Golden dataset, RAGAS + calibrated LLM-judge, eval-gated CI |
| "LLMOps / observability" | Langfuse tracing, cost dashboards, prompt versioning, A/B model swaps |
| "Deploy and optimize model inference" | Self-hosted quantized models on serverless GPUs, batching, cold-start handling |
| "Multimodal AI" | ASR + diarization + visual document retrieval + table QA in one pipeline |
| "Vector databases and embeddings" | pgvector at scale, embedding model selection with benchmarks |
| "Work with ambiguous real-world data" | Scanned PDFs, 3-hour audio, inconsistent city APIs — the messiest data there is |

---

## 6. Resume-ready impact metrics (fill in your real numbers)

- "Built a multimodal RAG platform indexing **N hours** of civic meeting audio and
  **N thousand** document pages across **3 cities**, serving cited answers at
  **p95 < Ns** and **<$0.0X/query**."
- "Improved retrieval recall@5 from **X% → Y%** by adding hybrid lexical+dense fusion
  and cross-encoder reranking, measured on a 200-question golden dataset."
- "Cut unsupported-claim rate from **X% → <Y%** with a citation-verifier agent and
  eval-gated CI (RAGAS faithfulness + human-calibrated LLM-judge)."
- "Reduced document-QA failures on scanned packets by **X%** by replacing OCR-based
  chunking with ColPali visual document retrieval."
- "Ran ASR/embedding inference on serverless GPUs with dynamic batching, cutting
  ingestion cost **X%** vs. hosted APIs."

Portfolio assets: live demo on a real city, a README with the architecture diagram
and eval methodology, and 2–3 deep-dive blog posts ("Eval-gated CI for RAG",
"ColPali vs. OCR on real government documents" — the kind of post that gets you
interviews on its own).

---

## 7. 12-week solo roadmap

**Weeks 1–4 — Walking skeleton (one city).**
Legistar + YouTube ingestion, faster-whisper ASR, basic chunk/embed into pgvector,
single-agent RAG with citations, FastAPI + minimal UI. *Milestone: honest cited
answers over transcripts.*

**Weeks 5–8 — Multimodal + agents + evals.**
ColPali packet indexing, diarization, table extraction, LangGraph multi-agent graph
with CitationVerifier, golden dataset v1, RAGAS + judge harness wired into CI.
*Milestone: eval dashboard with baseline vs. improved numbers.*

**Weeks 9–12 — Ops, scale, polish.**
Langfuse tracing + cost dashboards, self-hosted model A/B on Modal, second and third
city (proves generalization), load test, entity graph + weekly digest feature, demo
video, blog posts. *Milestone: public URL + published writeups.*

Scope insurance: if time runs short, cut the entity graph and third city — never cut
the eval harness or the verifier agent; they're the differentiators.

---

## 8. Why this beats the obvious alternatives

- **Finance/earnings-call copilot** — technically similar but a saturated portfolio
  genre; data licensing is murkier (earnings audio, paywalled filings).
- **Personal knowledge-base / "chat with docs"** — no real-world data story, no
  ingestion complexity, screams tutorial project.
- **Customer-support bot** — needs proprietary data you don't have; demos poorly.

CivicSignal keeps all the enterprise-relevant hard parts (long audio, scanned
documents, tables, verification, evals, ops) on top of data that is free, real,
messy, and genuinely useful to make accessible — with a demo a hiring manager can
click on and immediately understand.
