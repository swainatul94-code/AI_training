# AI Zero → Hero: LLM Builder + AI Engineer Track

**Owner:** swain
**Started:** 2026-05-24
**Pace:** 10–20 hrs/week (~6–9 months)
**Goals:** Build/train LLMs from scratch · Apply LLMs (RAG, agents, apps) · Land AI engineering job
**Primary LLM for apps:** Claude (Anthropic API, model `claude-opus-4-7` / `claude-sonnet-4-6`)

> How to use this guide: do phases in order. Each phase has **Learn → Practice → Build → Checkpoint**. Don't skip checkpoints. Ask Claude to quiz you, explain stuck concepts, or review code. Mark `[x]` when done.

---

## Phase 0 — Setup (Week 0, ~5 hrs) `[ ]`

**Why:** Bad env = stalled learning. One-time fix.

### Install
- [ ] Python 3.11+ (`python --version`)
- [ ] VS Code + Python extension
- [ ] `uv` package manager (`pip install uv` or `winget install astral-sh.uv`)
- [ ] Git (`git --version`)
- [ ] Anthropic API key → save as `$env:ANTHROPIC_API_KEY` (Windows PowerShell, persist via `setx`)
- [ ] GitHub account, create repo `ai-zero-to-hero` for all projects
- [ ] Kaggle account (free GPU later)
- [ ] Hugging Face account + access token

### Sanity test
```python
# test_claude.py
import anthropic
client = anthropic.Anthropic()
msg = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=100,
    messages=[{"role": "user", "content": "Say hi in 5 words"}],
)
print(msg.content[0].text)
```

### Checkpoint 0
- [ ] Claude API call returns response
- [ ] Pushed first commit to GitHub repo

---

## Phase 1 — Math Foundations (Weeks 1–3, ~30 hrs) `[ ]`

**Why:** Can't debug LLM internals without linear algebra + gradients.

### Topics (only what's needed for ML — don't over-study)
- **Linear algebra**: vectors, matrices, dot product, matmul, transpose, eigenvalues, SVD
- **Calculus**: derivatives, partial derivatives, chain rule, gradients
- **Probability**: distributions, conditional prob, Bayes, expectation, entropy, KL divergence
- **Stats**: mean/var, sampling, hypothesis basics

### Resources
- 3Blue1Brown — *Essence of Linear Algebra* (YouTube, ~3 hrs total) — **watch all**
- 3Blue1Brown — *Essence of Calculus* (~3 hrs)
- Khan Academy — Probability & Statistics (skim, do exercises)
- Book (optional reference): *Mathematics for Machine Learning* (Deisenroth) — free PDF

### Practice
- [ ] 20 problems on matrix ops (paper + numpy verify)
- [ ] Derive gradient of `f(x) = (Wx + b - y)^2` by hand
- [ ] Implement softmax + cross-entropy in pure numpy

### Checkpoint 1 (ask Claude to quiz you)
- [ ] Explain backprop chain rule to Claude in your own words; have it grade you
- [ ] Code: compute gradient of MSE loss for `y = Wx + b` in numpy, no autograd

---

## Phase 2 — Python for ML (Week 4, ~15 hrs) `[ ]`

### Topics
- numpy (vectorization, broadcasting, axis ops)
- pandas (load/clean CSV, groupby, merge)
- matplotlib (line, scatter, hist)
- Jupyter notebooks

### Project
- [ ] Download Titanic dataset from Kaggle. Clean, EDA, plot 5 insights.

### Checkpoint 2
- [ ] Notebook in repo: `phase2_titanic_eda.ipynb`
- [ ] Can replace any for-loop with vectorized numpy

---

## Phase 3 — Classical ML (Weeks 5–6, ~25 hrs) `[ ]`

**Why:** LLM-only people get filtered out of interviews. Need fundamentals.

### Topics
- Linear regression, logistic regression (derive + implement from scratch)
- Decision trees, random forests, gradient boosting (XGBoost)
- k-means clustering, PCA
- Train/val/test split, cross-validation, overfitting, regularization
- Metrics: accuracy, precision/recall, F1, ROC-AUC, MSE/MAE

### Resources
- *Hands-On ML with Scikit-Learn, Keras & TensorFlow* (Géron) — Ch 1–8
- Andrew Ng — Coursera *Machine Learning Specialization* (skim, do labs)

### Project
- [ ] Kaggle competition: House Prices. Submit. Target top 30%.

### Checkpoint 3
- [ ] Linear regression from scratch (numpy only, gradient descent)
- [ ] Explain bias-variance tradeoff to Claude with examples

---

## Phase 4 — Deep Learning + PyTorch (Weeks 7–9, ~40 hrs) `[ ]`

### Topics
- Perceptron → MLP → backprop
- Activation functions (ReLU, GELU, SiLU)
- Optimizers (SGD, Adam, AdamW)
- Loss functions, regularization (dropout, weight decay, batch norm, layer norm)
- CNNs (briefly — image basics)
- RNN/LSTM (briefly — understand why they died)
- GPU basics, mixed precision

### Resources (do in order)
1. **fast.ai *Practical Deep Learning* Part 1** — top-down, ship fast
2. **Andrej Karpathy — *Neural Networks: Zero to Hero* (YouTube)** — bottom-up, micrograd → makemore. **THIS IS CRITICAL.**
3. *Deep Learning* (Goodfellow) — reference only

### Projects
- [ ] Build micrograd from scratch (follow Karpathy)
- [ ] Train MLP on MNIST in PyTorch
- [ ] Train CNN on CIFAR-10, hit >85% test acc

### Checkpoint 4
- [ ] Write autograd engine in <200 lines (commit to repo)
- [ ] Explain why we use AdamW over SGD for transformers

---

## Phase 5 — NLP Fundamentals (Week 10, ~15 hrs) `[ ]`

### Topics
- Tokenization (word, BPE, WordPiece, SentencePiece)
- Embeddings (word2vec, GloVe — historical context)
- Seq2seq, attention mechanism (Bahdanau)
- Why transformers replaced RNNs

### Project
- [ ] Implement BPE tokenizer from scratch (follow Karpathy minbpe)
- [ ] Train a tiny char-level RNN on Shakespeare

### Checkpoint 5
- [ ] BPE tokenizer encodes/decodes correctly
- [ ] Can draw attention mechanism on whiteboard from memory

---

## Phase 6 — Transformers From Scratch (Weeks 11–13, ~40 hrs) `[ ]`

**Why:** This is the heart. Don't move past until solid.

### Topics
- Self-attention, multi-head attention, causal mask
- Positional encodings (sinusoidal, learned, RoPE, ALiBi)
- Layer norm, residual connections, FFN
- Decoder-only vs encoder-decoder vs encoder-only
- KV cache, flash attention

### Resources
- Paper: *Attention Is All You Need* (read 3 times, annotate)
- Karpathy — *Let's build GPT* video (build nanoGPT live)
- Lilian Weng blog — *The Transformer Family v2.0*
- Sebastian Raschka — *Build a Large Language Model (From Scratch)* book

### Projects
- [ ] Re-implement nanoGPT from scratch (no copy-paste). Train on Tiny Shakespeare.
- [ ] Add RoPE positional encoding
- [ ] Add KV cache for inference

### Checkpoint 6
- [ ] Your transformer generates coherent Shakespeare
- [ ] Explain to Claude: why causal mask? why scaled dot-product (divide by √d_k)?
- [ ] Benchmark inference with vs without KV cache

---

## Phase 7 — Pretrain a Small LLM (Weeks 14–16, ~40 hrs) `[ ]`

### Topics
- Dataset prep (FineWeb, The Pile, deduplication, quality filtering)
- Training loop at scale (gradient accumulation, mixed precision, checkpointing)
- Distributed training basics (DDP, FSDP — read about, may not run)
- Scaling laws (Chinchilla)
- Eval (HellaSwag, MMLU, perplexity)

### Resources
- Karpathy — *Let's reproduce GPT-2 (124M)* video
- Karpathy — `llm.c` repo (C/CUDA reference)
- nanotron, litgpt repos

### Project
- [ ] Reproduce GPT-2 124M (or smaller ~30M if GPU-limited). Use Kaggle/Colab/runpod.
- [ ] Track with W&B (Weights & Biases)
- [ ] Eval on HellaSwag

### Checkpoint 7
- [ ] Loss curve looks healthy, model speaks English
- [ ] Hosted weights on Hugging Face Hub

---

## Phase 8 — Fine-tuning & Alignment (Weeks 17–19, ~30 hrs) `[ ]`

### Topics
- SFT (supervised fine-tuning)
- LoRA, QLoRA (parameter-efficient)
- RLHF (PPO) — concept-level
- DPO (Direct Preference Optimization) — implement
- Instruction tuning datasets (Alpaca, UltraChat, Anthropic HH-RLHF)
- Constitutional AI (Anthropic paper — read it)

### Resources
- Paper: *InstructGPT*
- Paper: *Constitutional AI* (Anthropic) — relevant since you use Claude
- Paper: *DPO*
- HuggingFace TRL library docs

### Project
- [ ] LoRA fine-tune a small open model (Llama 3.2 1B or Qwen 2.5 0.5B) on a custom dataset
- [ ] Apply DPO with preference pairs
- [ ] Compare base vs SFT vs DPO outputs

### Checkpoint 8
- [ ] Fine-tuned model on HF Hub with model card
- [ ] Write blog post: "I fine-tuned X, here's what I learned"

---

## Phase 9 — LLM Applications with Claude (Weeks 20–22, ~30 hrs) `[ ]`

**Why:** Job market needs builders, not just researchers. Use Claude API as primary.

### Topics
- Prompt engineering (system prompts, few-shot, chain-of-thought)
- **Prompt caching** (Anthropic feature — cuts cost ~90%)
- Tool use / function calling
- Structured outputs
- Streaming
- Extended thinking (Claude's reasoning mode)
- Token budgets, context windows, cost optimization
- Evals (LLM-as-judge, golden sets)

### Resources
- Anthropic docs: docs.anthropic.com (read **all** of Build with Claude)
- Anthropic cookbook (github.com/anthropics/anthropic-cookbook)
- *Prompt Engineering Guide* (promptingguide.ai)

### Projects
- [ ] **App 1**: CLI coding assistant using Claude API with tool use (file read/write, bash exec)
- [ ] **App 2**: Discord/Slack bot powered by Claude
- [ ] **App 3**: Eval harness — measure your prompts against a golden set

### Checkpoint 9
- [ ] All 3 apps deployed (Fly.io / Railway / Modal)
- [ ] Prompt caching enabled, measure cache hit rate

---

## Phase 10 — RAG Systems (Weeks 23–24, ~20 hrs) `[ ]`

### Topics
- Embeddings (Voyage AI, OpenAI, Cohere — pick one)
- Vector DBs (Qdrant, Pinecone, pgvector, Chroma)
- Chunking strategies (fixed, semantic, recursive)
- Hybrid search (BM25 + vector)
- Reranking (Cohere reranker, Voyage rerank)
- **Contextual retrieval** (Anthropic technique — read their blog post)
- Evals for RAG (recall@k, faithfulness, answer relevance)

### Project
- [ ] **RAG app**: ingest your own PDFs/notes, chat with them via Claude
- [ ] Implement contextual retrieval (Anthropic's method) and measure lift
- [ ] Add reranker, measure recall@5 improvement

### Checkpoint 10
- [ ] RAG app deployed, you actually use it daily
- [ ] Documented eval results in README

---

## Phase 11 — AI Agents (Weeks 25–27, ~30 hrs) `[ ]`

### Topics
- ReAct pattern
- Tool use (multi-step, parallel)
- Planning, reflection, self-correction
- Memory (short-term context, long-term vector/file)
- Multi-agent orchestration
- Agent evals (success rate, token cost, latency)

### Frameworks (try one, then go raw)
- **Claude Agent SDK** (recommended — official)
- LangGraph (alternative, more complex)
- Build raw with Claude API + tool use (best learning)

### Resources
- Anthropic — *Building Effective Agents* blog post (read carefully)
- Claude Agent SDK docs

### Project
- [ ] **Agent**: research agent that takes a topic, searches web, reads pages, writes report
- [ ] **Agent**: code review agent that clones a repo, reviews PR diff, posts comments
- [ ] Add observability (Langfuse / Helicone / custom logging)

### Checkpoint 11
- [ ] Agent runs end-to-end on real task, you trust output
- [ ] Cost per run < $0.50, measured

---

## Phase 12 — AI Engineering / MLOps (Weeks 28–30, ~30 hrs) `[ ]`

**Why:** Job target. Need deploy + ops skills, not just notebooks.

### Topics
- Model serving (vLLM, TGI, Ollama, Triton)
- API design (FastAPI, rate limiting, auth)
- Containers (Docker), orchestration basics (Kubernetes — light)
- CI/CD (GitHub Actions)
- Monitoring (Prometheus, Grafana, OpenTelemetry)
- LLM observability (Langfuse, Helicone, Arize)
- Cost tracking, latency optimization, caching layers
- Security: prompt injection defense, PII handling, jailbreak testing

### Resources
- *Designing Machine Learning Systems* (Chip Huyen)
- *AI Engineering* (Chip Huyen, 2025)

### Project
- [ ] Self-host an open LLM with vLLM on a rented GPU
- [ ] Wrap with FastAPI, add auth + rate limiting
- [ ] Deploy with Docker, monitor with Grafana
- [ ] Red-team your own app for prompt injection

### Checkpoint 12
- [ ] System diagram in repo
- [ ] Load test results (req/s, p50/p99 latency)

---

## Phase 13 — Research, Papers, Portfolio (Ongoing) `[ ]`

### Habits
- [ ] Read 1 paper/week. Use Claude to explain hard parts.
- [ ] Follow: Karpathy, Lilian Weng, Sebastian Raschka, Anthropic research, Yannic Kilcher
- [ ] Subscribe: arxiv-sanity, AlphaSignal newsletter, The Batch
- [ ] Twitter/X: build feed of AI researchers

### Must-read papers (chronological)
1. *Attention Is All You Need* (2017)
2. *BERT* (2018)
3. *GPT-2, GPT-3* (2019, 2020)
4. *Scaling Laws* (Kaplan 2020) + *Chinchilla* (2022)
5. *InstructGPT* (2022)
6. *LoRA* (2021)
7. *Constitutional AI* (Anthropic 2022)
8. *DPO* (2023)
9. *RAG* (2020) + *Contextual Retrieval* (Anthropic 2024)
10. *FlashAttention* (2022)
11. *Mixture of Experts (Mixtral)* (2023)
12. *Claude 3 / 3.5 / 4 model cards* (Anthropic)

### Portfolio
- [ ] GitHub: clean repos for every project above, READMEs with results
- [ ] Personal site or blog (1 post per phase)
- [ ] Hugging Face profile with your fine-tuned models
- [ ] 1–2 open-source contributions (transformers, trl, vllm, axolotl, etc.)

---

## Job Prep (Final 4 weeks) `[ ]`

- [ ] Update LinkedIn, GitHub README
- [ ] Resume: lead with shipped projects + metrics
- [ ] Practice interviews:
  - System design for LLM apps (RAG, agents, serving)
  - ML fundamentals (bias-variance, regularization, optimizers)
  - Transformer internals (attention math, KV cache, positional encoding)
  - Coding: PyTorch from-scratch + leetcode-easy
- [ ] Apply: AI startups (faster signal), then big labs
- [ ] Mock interviews with Claude — paste JD, have Claude grill you

---

## Daily / Weekly Rhythm

**Daily (1–3 hrs)**
- 30 min reading (paper, doc, book)
- Remainder: code
- 5 min log progress (commit + 1-line journal in repo)

**Weekly**
- Friday: ship something (commit, blog post, or PR)
- Sunday: 30-min reflection — what stuck, what didn't, adjust next week

**Stuck rule**
- 20 min stuck → ask Claude (paste error + code + what you tried)
- 1 hr stuck → simplify, write failing test, isolate
- Half day stuck → take walk, sleep on it

---

## Tooling Cheat Sheet

| Need | Pick |
|------|------|
| LLM API | **Claude** (`claude-opus-4-7`, `claude-sonnet-4-6`, `claude-haiku-4-5-20251001`) |
| Local LLM | Ollama, llama.cpp |
| Training | PyTorch + HF Transformers + TRL + Accelerate |
| GPU rental | RunPod, Lambda Labs, Modal, Vast.ai |
| Free GPU | Kaggle, Colab |
| Vector DB | Qdrant (local), pgvector (prod) |
| Eval | Langfuse, custom golden sets |
| Deploy | Modal, Fly.io, Railway, Vercel (front) |
| Tracking | Weights & Biases (W&B) |

---

## Progress Tracker

| Phase | Status | Date done | Notes |
|-------|--------|-----------|-------|
| 0 Setup | [ ] | | |
| 1 Math | [ ] | | |
| 2 Python ML | [ ] | | |
| 3 Classical ML | [ ] | | |
| 4 Deep Learning | [ ] | | |
| 5 NLP basics | [ ] | | |
| 6 Transformers | [ ] | | |
| 7 Pretrain | [ ] | | |
| 8 Fine-tune | [ ] | | |
| 9 Claude apps | [ ] | | |
| 10 RAG | [ ] | | |
| 11 Agents | [ ] | | |
| 12 MLOps | [ ] | | |
| 13 Research | [ ] | | |
| Job prep | [ ] | | |

---

**Resume command:** open this file, find first `[ ]`, ask Claude "I'm at Phase X, drive my checkpoint."
