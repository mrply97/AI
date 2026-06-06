# AI Engineer Roadmap
**Start date:** June 13, 2026  
**Background:** International Management (BSc) + Accounting & Finance (MSc) + R  
**Goal:** Self-sufficient AI Engineer — build, understand, and debug your own software

---

## Timeline Overview

| Phase | Period | Focus |
|-------|--------|-------|
| Pre-Month 1 | Jun 13 – Jul 10 | Python Foundations (from R) |
| Month 1 | Jul 11 – Aug 7 | Python, Data Handling & ML Foundations |
| Month 2 | Aug 8 – Sep 4 | Machine Learning Deep Dive |
| Month 3 | Sep 5 – Oct 2 | Deep Learning & Neural Networks |
| Month 4 | Oct 3 – Oct 30 | MLOps & Production Systems |
| Month 5 | Oct 31 – Nov 27 | Applied AI Systems |
| Month 6 | Nov 28 – Dec 26 | Portfolio, Interviews & Job Positioning |

---

## Pre-Month 1: Python Foundations (for R users)
**Jun 13 – Jul 10**

You already think like a programmer. This phase is about translating that into Python.

### Week 1 (Jun 13–19): Python Syntax & R Comparisons
- [ ] Install Python, VS Code, set up a virtual environment
- [ ] Variables, types, conditionals, loops — compare to R equivalents
- [ ] Functions: `def` vs R's `function()`
- [ ] Lists, tuples, sets, dictionaries (vs R's vectors and lists)
- [ ] Practice: rewrite 3 small R scripts you know in Python

### Week 2 (Jun 20–26): Python Intermediate
- [ ] List/dict comprehensions (concise loops — very Pythonic)
- [ ] String formatting and f-strings
- [ ] File I/O: reading CSVs, text files
- [ ] Error handling: `try / except` (vs R's `tryCatch`)
- [ ] Practice: build a small script that reads a CSV and prints summary stats

### Week 3 (Jun 27–Jul 3): Object-Oriented Python
- [ ] Classes and objects: what they are and why they matter
- [ ] `__init__`, methods, `self`
- [ ] Inheritance basics
- [ ] Modules and packages: how Python projects are structured
- [ ] Practice: build a simple `Portfolio` class that holds and calculates returns

### Week 4 (Jul 4–10): Python for Data
- [ ] Generators and iterators
- [ ] Decorators (you'll see these constantly in ML frameworks)
- [ ] Type hints: `def foo(x: int) -> str:`
- [ ] Introduction to Jupyter notebooks
- [ ] Practice: convert your Week 3 project into a Jupyter notebook with explanations

**Pre-Month 1 Checkpoint:** You can write Python scripts, read data, and understand error messages without googling every line.

---

## Month 1: Python, Data Handling & ML Foundations
**Jul 11 – Aug 7**

### Week 1 (Jul 11–17): NumPy
- [ ] Arrays vs Python lists — why arrays are faster
- [ ] Array creation, indexing, slicing (similar to R vectors/matrices)
- [ ] Broadcasting: operating on arrays of different shapes
- [ ] Linear algebra basics: dot products, matrix multiplication
- [ ] Practice: implement mean, variance, and covariance from scratch using NumPy

### Week 2 (Jul 18–24): Pandas
- [ ] DataFrames and Series (this is R's `data.frame` — you'll feel at home)
- [ ] Reading/writing CSV, Excel, JSON
- [ ] Filtering, groupby, merging (like SQL `WHERE`, `GROUP BY`, `JOIN`)
- [ ] Handling missing values
- [ ] Practice: take a financial dataset (stock prices or GDP data) and produce a summary report

### Week 3 (Jul 25–31): Data Preprocessing & Statistics
- [ ] Data cleaning: duplicates, outliers, type casting
- [ ] Normalization and standardization (min-max, z-score)
- [ ] Feature engineering: creating new columns from existing ones
- [ ] Distributions, mean, variance, hypothesis testing (you know this from your MSc — apply it in Python)
- [ ] Practice: take a messy dataset, clean it, and prepare it for modeling

### Week 4 (Aug 1–7): Core ML Concepts + First Models
- [ ] Supervised vs unsupervised learning
- [ ] Overfitting, underfitting, bias/variance tradeoff
- [ ] Train/test split, cross-validation
- [ ] Linear regression with scikit-learn
- [ ] Logistic regression with scikit-learn
- [ ] Practice: **Project** — end-to-end pipeline: load dataset → clean → train model → evaluate → report results

**Month 1 Checkpoint:** You can take raw data, clean it, and produce a working ML model with proper evaluation.

---

## Month 2: Machine Learning Deep Dive
**Aug 8 – Sep 4**

### Week 1 (Aug 8–14): Tree-Based Algorithms
- [ ] Decision trees: how splits work, overfitting risk
- [ ] Random forests: bagging, feature importance
- [ ] Gradient boosting: XGBoost, LightGBM
- [ ] When to use which algorithm
- [ ] Practice: train all three on the same dataset, compare results

### Week 2 (Aug 15–21): Model Evaluation
- [ ] Classification metrics: precision, recall, F1, ROC-AUC
- [ ] Regression metrics: MAE, RMSE, R²
- [ ] Confusion matrices
- [ ] When each metric matters (finance context: cost of false negatives vs false positives)
- [ ] Practice: evaluate your Month 1 project with proper metrics

### Week 3 (Aug 22–28): Tuning & Pipelines
- [ ] Cross-validation: k-fold, stratified k-fold
- [ ] GridSearchCV and RandomizedSearchCV
- [ ] scikit-learn Pipelines: chain preprocessing + model
- [ ] Practice: take any previous model and improve it through tuning

### Week 4 (Aug 29–Sep 4): Interpretability & Kaggle
- [ ] SHAP values: why a model made a decision
- [ ] Feature importance from tree models
- [ ] Solve a Kaggle problem end-to-end (pick a beginner competition)
- [ ] Practice: **Project** — production-style ML pipeline with proper validation, metrics, and a brief write-up explaining the model decisions

**Month 2 Checkpoint:** You can build, evaluate, tune, and explain an ML model. You understand why it works, not just that it works.

---

## Month 3: Deep Learning & Neural Networks
**Sep 5 – Oct 2**

### Week 1 (Sep 5–11): Neural Network Fundamentals
- [ ] What a neuron does: weighted sum + activation function
- [ ] Forward pass: input → layers → output
- [ ] Backpropagation: how the model learns (gradient descent)
- [ ] Loss functions: cross-entropy, MSE
- [ ] Practice: implement a simple neural network from scratch in NumPy (no frameworks yet)

### Week 2 (Sep 12–18): PyTorch Basics
- [ ] Tensors (like NumPy arrays, but GPU-compatible)
- [ ] Autograd: automatic differentiation
- [ ] Building a model with `nn.Module`
- [ ] Training loop: forward → loss → backward → optimizer step
- [ ] Practice: reimplement your Week 1 network in PyTorch

### Week 3 (Sep 19–25): Architectures
- [ ] MLPs: fully connected networks for tabular data
- [ ] CNNs: convolutional layers for images
- [ ] RNNs/LSTMs: sequence data (time series, text)
- [ ] Transformers: high-level understanding (you'll go deep in Month 5)
- [ ] Batching, optimizers (Adam, SGD), learning rate schedulers
- [ ] Regularization: dropout, weight decay
- [ ] Practice: train a CNN on an image dataset (e.g., CIFAR-10)

### Week 4 (Sep 26–Oct 2): Transfer Learning & Real Data
- [ ] Pre-trained models: why training from scratch is rarely needed
- [ ] Fine-tuning: adapt a pre-trained model to your task
- [ ] Work with real-world data: images, text, or time series
- [ ] Practice: **Project** — fine-tune a pre-trained model on a real problem relevant to your interests

**Month 3 Checkpoint:** You can build and train neural networks, understand why they fail, and fine-tune pre-trained models.

---

## Month 4: MLOps & Production Systems
**Oct 3 – Oct 30**

### Week 1 (Oct 3–9): Serving Models
- [ ] FastAPI: build a REST API that serves your model
- [ ] Request/response design: inputs, outputs, validation
- [ ] Test your API with curl and Postman
- [ ] Practice: wrap your best model from Month 2 in a FastAPI endpoint

### Week 2 (Oct 10–16): Docker & Containerization
- [ ] What Docker is and why it matters (your code runs anywhere)
- [ ] Write a `Dockerfile` for your FastAPI app
- [ ] Docker Compose for multi-service setups
- [ ] Practice: containerize your Month 4 Week 1 API

### Week 3 (Oct 17–23): Experiment Tracking & Model Lifecycle
- [ ] MLflow: log experiments, parameters, metrics, models
- [ ] Model versioning: why you need it, how to do it
- [ ] Weights & Biases (W&B) as an alternative
- [ ] Model monitoring: detecting drift in production
- [ ] Practice: rerun your Month 2 project with full MLflow tracking

### Week 4 (Oct 24–30): Cloud & Observability
- [ ] AWS or GCP basics: compute, storage, deployment
- [ ] Deploy your Docker container to the cloud
- [ ] Logging, error handling, health checks
- [ ] Practice: **Project** — deploy a trained model as a live API with real inputs, logging, and monitoring

**Month 4 Checkpoint:** Your model is not just a notebook — it's a running service anyone can call.

---

## Month 5: Applied AI Systems
**Oct 31 – Nov 27**

### Week 1 (Oct 31–Nov 6): LLM Fundamentals
- [ ] Embeddings: how text becomes numbers
- [ ] Tokenization: how LLMs read text
- [ ] Transformer architecture: attention mechanism (practical understanding)
- [ ] Prompt engineering: writing prompts that reliably produce useful outputs
- [ ] Practice: use the Claude or OpenAI API to build a simple Q&A tool

### Week 2 (Nov 7–13): RAG Systems
- [ ] What RAG is: retrieve relevant context, then generate
- [ ] Vector databases: Pinecone, Weaviate, or pgvector
- [ ] Embedding documents and storing them
- [ ] Retrieval: similarity search
- [ ] Practice: build a RAG system over a set of documents you care about (e.g., finance papers, company reports)

### Week 3 (Nov 14–20): Orchestration & Agents
- [ ] LangChain or LlamaIndex: orchestrating LLM pipelines
- [ ] Agents: LLMs that use tools (search, calculators, APIs)
- [ ] Memory: giving agents context across turns
- [ ] Multi-step workflows: chain of thought, tool use
- [ ] Practice: build a multi-step AI workflow (e.g., an agent that researches a topic and writes a report)

### Week 4 (Nov 21–27): Evaluation & Flagship Project
- [ ] Evaluating LLM outputs: metrics, human eval, LLM-as-judge
- [ ] Production considerations: latency, cost, rate limits
- [ ] Practice: **Project** — production-grade AI system: RAG app or AI copilot, fully deployed, evaluated, and documented

**Month 5 Checkpoint:** You can build, deploy, and evaluate an end-to-end AI system using LLMs.

---

## Month 6: Portfolio, Interviews & Job Positioning
**Nov 28 – Dec 26**

### Week 1 (Nov 28–Dec 4): Polish Projects
- [ ] Refactor all projects: clean code, proper structure, no notebooks in production
- [ ] Write tests for critical functions
- [ ] Add READMEs with problem → approach → results
- [ ] Write strong case studies: what problem, why this approach, what tradeoffs, what results

### Week 2 (Dec 5–11): GitHub & Portfolio Site
- [ ] GitHub profile: pin 2–3 flagship projects
- [ ] Each project: clear README, demo, results
- [ ] Build a simple portfolio site (you already have this repo — use it)
- [ ] Add system design thinking: explain how your ML system scales

### Week 3 (Dec 12–18): Interview Prep
- [ ] ML concepts: be able to explain any algorithm you used
- [ ] Coding: practice Python interview questions (LeetCode easy/medium)
- [ ] System design: how would you build X at scale?
- [ ] Behavioral: your story — why AI, what you built, what you learned

### Week 4 (Dec 19–26): Apply & Mock Interviews
- [ ] Targeted applications: AI Engineer, Applied ML, MLOps roles
- [ ] Mock interviews with a peer or record yourself
- [ ] Refine your story: background in finance + built real AI systems = rare combination
- [ ] Practice: do at least 3 mock interviews

**Month 6 Checkpoint:** You have a portfolio, a story, and the skills to back it up.

---

## Your Competitive Edge

Your finance/management background is not a weakness — it's a differentiator:

- You understand **why** data matters, not just how to process it
- You can communicate results to business stakeholders
- You know what a model needs to do to be **actually useful** in the real world
- Most AI Engineers cannot do this

Target roles: **AI Engineer**, **Applied ML Engineer**, **ML Platform Engineer**, **MLOps Engineer**  
Avoid positioning yourself as a pure researcher — your edge is building things that work in production.

---

## Key Resources

### Python (Pre-Month 1)
- [Python for R Users](https://aeturrell.github.io/python4DS/) — free, written for people who already know data
- Automate the Boring Stuff with Python (free online)

### ML
- Hands-On Machine Learning with Scikit-Learn, Keras & TensorFlow (Aurélien Géron)
- fast.ai — practical deep learning, free

### Deep Learning
- PyTorch official tutorials
- Andrej Karpathy's YouTube channel (builds everything from scratch — best for understanding)

### LLMs & AI Systems
- LangChain docs
- Simon Willison's blog (practical LLM engineering)

### Practice
- Kaggle (datasets, competitions, notebooks)
- Papers With Code (see what's state of the art)

---

*Last updated: June 2026*
