# AI Reference Companion

Standalone reference. Glossary, interview question bank, decision trees, cheat sheets per phase, free-tier catalog. Use alongside `ai_master_course.html`.

---

## 0. Free Tier Catalog (build for $0)

### LLM APIs
| Provider | Free | Models | Use |
|---|---|---|---|
| Anthropic | $5 signup credit | Opus 4.7 / Sonnet 4.6 / Haiku 4.5 | Course default |
| Google Gemini | 1500 req/day free | Gemini 2.5 Flash/Pro | High-volume free |
| Groq | Generous free | Llama 3.3 70B, Mixtral, DeepSeek-R1 distill | Ultra-fast (~500 tok/s) |
| Together AI | $1 credit | Llama, Qwen, DeepSeek | Compare open models |
| DeepSeek | $5 credit | V3, R1 reasoning | Cheap reasoning |
| Mistral | Free Small/Codestral | Mistral family | EU data residency |
| HuggingFace | ~30k chars/mo free | Any HF-hosted | Quick tests |
| OpenRouter | `:free` models | Routes everything | One API key for all |
| Cohere | Trial key | Command R/R+ | Free embeddings included |
| Cerebras | Free Llama 3.3 | Llama | ~2000 tok/s |

### Local LLMs (free forever)
- **Ollama** — one-command 7B-30B on Mac/Win/Linux
- **LM Studio** — GUI for GGUF models
- **llama.cpp** — pure C++ CPU/GPU
- **vLLM** — production serving on your GPU

### Cloud compute
| Provider | Free |
|---|---|
| Kaggle | 30 hrs/week T4/P100 |
| Colab | Free T4 occasional |
| RunPod | $5 signup, spot A100 ~$1/hr |
| Lightning AI | 22 hrs/mo |
| Modal | $30/mo compute credit |

### Embeddings
- **sentence-transformers** (local, free): all-MiniLM-L6-v2, bge-small-en
- **Voyage AI** — 50M tokens free
- **Cohere Embed** — trial generous

### Vector DBs (free tier)
- Qdrant (local Docker + Cloud 1GB free)
- pgvector + Postgres (Railway/Supabase/Neon free)
- Pinecone Starter (1 index, 100k vectors)
- Chroma / LanceDB / Weaviate Sandbox

### Deployment
- Railway hobby ($5/mo credit)
- Fly.io (3 small VMs free)
- Render (750 hrs/mo, sleeps on idle)
- Vercel hobby (unlimited static + serverless)
- Cloudflare Workers (100k req/day)
- HF Spaces (CPU free, paid GPU)
- GitHub Pages (static, hosts this course)

### Datasets (all free)
HuggingFace Datasets · Kaggle · Common Crawl · FineWeb · The Pile · HH-RLHF · UltraChat · Alpaca · Tulu

### Eval + observability
- lm-eval-harness, RAGAS (OSS)
- Langfuse (50k traces/mo free)
- Helicone (100k req/mo free)
- Phoenix Arize (OSS local)
- W&B (personal free)

### Tools (all free / OSS)
HF transformers · peft · trl · accelerate · datasets · nanoGPT · minbpe · llm.c · vLLM · TGI · TransformerLens · SAELens · LangChain · LlamaIndex · Anthropic Claude Agent SDK

### Total course spend
**$0–15** if optimized. ~$5 Claude signup + maybe $10 cloud GPU for Phase 7. Everything else free.

---

## 1. Glossary (top 80 terms)

### Math / fundamentals
- **Scalar / Vector / Matrix / Tensor** — 0-d, 1-d, 2-d, n-d number arrays. Tensor is the general term used in PyTorch/TF.
- **Dot product** `a·b` — sum of element-wise products. Equals `|a||b|cosθ`. Used as similarity.
- **Matmul** `A@B` — composition of two linear transforms. Inner dims must match: `(m,k)@(k,n)=(m,n)`.
- **Transpose** `Aᵀ` — flip rows/cols.
- **Determinant** — volume scale factor. det=0 → singular, no inverse.
- **Eigenvalue/eigenvector** — `Av = λv`. Directions A only scales, doesn't rotate.
- **SVD** — every matrix = rotate → scale → rotate. Foundation of PCA, LoRA.
- **Gradient** `∇f` — vector of partial derivatives. Points to steepest ascent.
- **Jacobian** — matrix of partial derivatives when output is a vector.
- **Chain rule** — `d/dx f(g(x)) = f'(g(x))·g'(x)`. Backprop is this.

### Probability / info theory
- **Expectation** `E[X]` — average over distribution.
- **Bayes** — `P(A|B) = P(B|A)P(A)/P(B)`.
- **Entropy** `H(p) = -Σp log p` — uncertainty.
- **Cross-entropy** `H(p,q) = -Σp log q` — LLM training loss.
- **KL divergence** `KL(p‖q) = Σp log(p/q)` — distance between distributions. Used in RLHF/DPO.
- **Likelihood** — probability of data given parameters. Max likelihood = standard learning objective.

### Classical ML
- **Bias / Variance** — bias = wrong assumptions (underfit). Variance = sensitivity to data (overfit).
- **Train / Val / Test** — fit / select / unbiased final eval. Don't peek at test.
- **Cross-validation** — k-fold; averages over splits, more stable than single split.
- **Regularization** — penalty on weights to prevent overfit (L1 sparse, L2 smooth).
- **Hyperparameter** — set by you (LR, batch size, depth). Tuned on val, not learned.
- **Pipeline** (sklearn) — chain preprocessing + model; refits per fold = no leakage.
- **Data leakage** — info from val/test influences training. Subtle: scaler fit on full data, target encoding from global means, time-future features.

### Deep learning
- **Neuron / Perceptron** — `y = activation(w·x + b)`.
- **Activation** — non-linearity. ReLU, GELU, SiLU, sigmoid, tanh, softmax.
- **MLP** — multi-layer perceptron, stacked Linear + activation.
- **CNN** — convolutional NN. Image standard.
- **RNN / LSTM / GRU** — sequential models, mostly historic post-transformer.
- **Loss function** — scalar to minimize. CE for classification, MSE for regression.
- **Backprop** — auto-diff applying chain rule backward.
- **Autograd** (PyTorch) — engine that builds dynamic graph and computes gradients automatically.
- **Optimizer** — SGD, Adam, AdamW. Updates params using gradients.
- **Learning rate (LR)** — step size for optimizer.
- **Schedule** — how LR changes over training (cosine, linear, warmup).
- **Epoch** — one pass through entire training data.
- **Batch / Mini-batch** — subset processed per optimizer step.
- **Gradient accumulation** — sum grads over k micro-batches before opt.step → simulate bigger batch.
- **Mixed precision** — bf16/fp16 forward + fp32 master weights. Speed + memory win.
- **Dropout** — randomly zero activations during training. Regularizes.
- **BatchNorm / LayerNorm / RMSNorm** — normalize activations. LayerNorm/RMSNorm = transformers.
- **Vanishing/Exploding gradients** — gradients shrink/grow through deep stacks. Fixed by ReLU/normalization/residuals/clipping.

### NLP / Transformers
- **Token** — atomic unit model sees (sub-word usually).
- **Tokenizer** — text → token IDs. BPE, WordPiece, SentencePiece.
- **BPE** — start with bytes, merge frequent pairs. GPT-2/3/4 standard.
- **Embedding** — lookup table mapping token IDs to dense vectors.
- **Vocab** — set of tokens model knows. GPT-4 ~100k.
- **Self-attention** — each token weighted-sum over all tokens. `softmax(QKᵀ/√d_k)·V`.
- **Q, K, V** — query, key, value projections of input.
- **Multi-head attention** — multiple parallel attention "views".
- **Causal mask** — lower-triangular, -inf future positions, used in decoder-only LLMs.
- **Positional encoding** — sinusoidal, learned, RoPE, ALiBi. Tells model token order.
- **RoPE** — rotary, rotates Q/K by position angle. Extrapolates better.
- **Pre-norm / Post-norm** — LayerNorm placement. Pre-norm = stable deep training.
- **FFN** — feed-forward network inside transformer block, usually 4× wider than d_model.
- **KV cache** — store K,V during generation to avoid recomputing.
- **FlashAttention** — IO-optimized attention kernel. Memory-efficient, faster.
- **Context window / Sequence length** — max tokens model sees at once.
- **Decoder-only / Encoder-only / Encoder-decoder** — GPT family / BERT / T5.

### LLM training
- **Pretraining** — train base LM on huge unlabeled corpus, predict next token.
- **Scaling laws** — N (params), D (data), C (compute) relation. Chinchilla: ~20 tokens/param.
- **SFT** — supervised fine-tuning on (instruction, response).
- **RLHF** — train reward model on prefs, then PPO policy.
- **DPO** — direct preference optimization. Skips RM. Modern default.
- **PPO** — Proximal Policy Optimization, RL algo used in RLHF.
- **Constitutional AI** — Anthropic method, AI-feedback guided by written principles.
- **LoRA** — low-rank update to frozen base. Parameter-efficient FT.
- **QLoRA** — 4-bit quantized base + LoRA. Fits 65B on 48GB GPU.
- **Distillation** — small model trained to mimic large model's outputs.
- **MoE** — Mixture of Experts. Sparse activation. Mixtral, GPT-4 (rumored).
- **Quantization** — reduce weights/activations to int8/int4 etc.

### Apps / RAG / Agents
- **Prompt engineering** — designing system/user prompts for desired behavior.
- **Prompt caching** (Anthropic) — cache stable prefixes, ~10% of normal input cost.
- **Few-shot prompting** — provide examples in messages, model learns pattern.
- **Chain-of-thought** — ask model to reason step-by-step before answering.
- **Tool use / Function calling** — model emits structured tool calls you execute.
- **Structured output** — JSON-shaped answers (best via tool with schema).
- **Extended thinking** (Claude) — explicit reasoning budget separate from output.
- **RAG** — retrieval-augmented generation. Retrieve relevant chunks, augment prompt.
- **Vector DB** — Qdrant, pgvector, Pinecone, Chroma. Stores embeddings, nearest-neighbor search.
- **Embedding model** — text → fixed-dim vector. Voyage, Cohere, OpenAI.
- **Chunking** — split docs for retrieval. Fixed/recursive/semantic/structural.
- **BM25** — sparse keyword retrieval. Pairs with vector for "hybrid".
- **Reranker** — cross-encoder that scores (query, chunk) pairs. Top-50 → top-K.
- **Contextual retrieval** (Anthropic) — LLM-generate context per chunk before embed.
- **Agent** — LLM + tools in a loop with memory.
- **Eval / Golden set** — fixed (input, expected) pairs to score prompt variants.
- **LLM-as-judge** — use another LLM to grade outputs against rubric.

### MLOps
- **vLLM / TGI / Ollama** — LLM serving frameworks.
- **Continuous batching** — pack new requests into running batch each step.
- **PagedAttention** — vLLM's memory-efficient KV cache.
- **p50 / p95 / p99** — latency percentiles.
- **Prompt injection** — attacker text overrides system instructions.
- **Jailbreak** — bypass safety training via crafted prompt.
- **Observability** — logs + metrics + traces. Langfuse, Helicone, Grafana.

---

## 2. Interview Question Bank (100 Qs)

### ML fundamentals (20)
1. Explain bias-variance tradeoff. How do you diagnose? How do you fix each side?
2. Why use cross-validation over a single train/val split?
3. L1 vs L2 regularization — when use which?
4. What's data leakage? Give three examples.
5. ROC-AUC vs PR-AUC — when use which?
6. Explain precision and recall. When is precision more important than recall?
7. Why does softmax + cross-entropy work for classification?
8. Derive logistic regression gradient.
9. What's the curse of dimensionality?
10. Random forest vs gradient boosting — internal difference?
11. How do decision trees decide where to split?
12. Why does XGBoost dominate tabular competitions?
13. Imbalanced data — what's wrong with accuracy? What metrics use instead?
14. Why standardize features for logistic regression but not random forest?
15. What does p-value < 0.05 mean? What does it NOT mean?
16. Naive Bayes — what assumption gives it the name? When is it OK?
17. K-means: how is initial centroid choice (k-means++) better than random?
18. What's the difference between online and batch learning?
19. Why use stratified sampling for train/test split on imbalanced classification?
20. Explain the bias-variance decomposition formula.

### Deep learning (20)
21. Why ReLU over sigmoid in hidden layers?
22. Explain vanishing gradients. Three remedies.
23. Why AdamW over Adam for transformers?
24. What does opt.zero_grad() do and what bug arises without it?
25. LayerNorm vs BatchNorm — why transformers use LayerNorm?
26. What is dropout doing mathematically? Why disable in eval?
27. What's the difference between fp16 and bf16?
28. Why use gradient clipping?
29. Why use a learning rate warmup?
30. Explain residual connections. Why do they help?
31. What's the universal approximation theorem? Caveats?
32. How does autograd work in PyTorch?
33. Explain mixed precision training.
34. Why is initialization important? What's Xavier/He init for?
35. What is a Jacobian? When does it matter in DL?
36. Backprop through softmax + cross-entropy — derive the gradient.
37. Explain weight decay. Is it the same as L2 regularization in Adam? Why AdamW exists?
38. What's a learning curve? What does its shape tell you?
39. Explain teacher forcing in seq2seq training.
40. Why convolutions over fully connected for images?

### Transformers / LLMs (25)
41. Walk through scaled dot-product attention.
42. Why divide by √d_k?
43. Multi-head attention — what does each head learn?
44. What is the causal mask? When is it used?
45. Compare sinusoidal, learned, RoPE, ALiBi positional encodings.
46. Why is the FFN typically 4× d_model?
47. Estimate parameter count of GPT-2 124M from architecture.
48. What's a KV cache? When does it help, when not?
49. Why pre-norm over post-norm?
50. Explain FlashAttention — what problem does it solve?
51. Encoder-decoder vs encoder-only vs decoder-only — examples and use cases.
52. What's Chinchilla scaling law? Why was GPT-3 undertrained?
53. How does temperature affect sampling? top-p? top-k?
54. What's beam search? Why is it bad for open-ended generation?
55. Explain Mixture of Experts. Why use it?
56. SFT vs RLHF vs DPO — what does each fix?
57. Why does DPO work without an explicit reward model?
58. LoRA — what does rank control? Memory math?
59. QLoRA — what two techniques and why combine?
60. Why does fine-tuning often need ~10× lower LR than pretraining?
61. What's catastrophic forgetting? How do you fight it during fine-tuning?
62. Walk through tokenization edge cases that cause LLM bugs.
63. Explain constitutional AI in your own words.
64. What's perplexity? Limits as a metric?
65. Why isn't accuracy on benchmarks a complete picture of LLM quality?

### RAG / Agents / Apps (15)
66. Design a RAG system for company internal docs. What evals?
67. When does pure vector search fail? Fix?
68. Why use a reranker? When is it overkill?
69. Explain Anthropic's contextual retrieval. Lift estimate?
70. How do you prevent hallucinations in a RAG app?
71. When does an agent loop beat a single LLM call?
72. Design failure modes for a web research agent.
73. How do you enforce cost caps in agent loops?
74. What's prompt caching and when to use it?
75. Tool use vs JSON-mode for structured output — tradeoffs?
76. Build an eval golden set — what goes in it? How big?
77. LLM-as-judge — when reliable, when not?
78. How do you defend against prompt injection?
79. Explain extended thinking and when to use it.
80. Why log tokens per request as a top-line metric?

### System Design / MLOps (10)
81. Self-host an open LLM serving 1k req/s. Architecture?
82. How do you autoscale an LLM API by queue depth?
83. p99 latency much worse than p50 — investigate.
84. Pick model tier (Opus/Sonnet/Haiku) for: customer chat, code review, document summary at scale. Justify.
85. Design observability stack for a Claude-powered SaaS.
86. Vector DB choice for 100M chunks vs 10k chunks — different answer?
87. Versioning prompts in production — how?
88. A/B testing two prompts safely in prod — how?
89. Red-team checklist for an LLM customer support agent.
90. How do you handle PII in prompts?

### Behavioral / "Show me you can think" (10)
91. Walk through a real ML/AI project you shipped. Metrics?
92. A model passed all tests but failed in production. What happened? How did you debug?
93. Describe a time you disagreed with a team decision on an ML choice.
94. Most surprising thing you learned about LLMs?
95. What paper changed how you think about NLP?
96. What's your view on LLM agents — overhyped, underhyped, or right?
97. How would you safely deploy an AI feature that's 95% accurate but could embarrass the company on edge cases?
98. What's the most underrated skill for AI engineers right now?
99. How do you stay current — what's your reading routine?
100. What would you do in your first 30 days here?

---

## 3. Decision Trees / Cheat Sheets

### "Which model tier should I use?" (Claude)
- Hard reasoning, complex code, long agent traces → **Opus 4.7**
- General chat, RAG answers, summary at scale → **Sonnet 4.6**
- Bulk classification, extraction, simple ops, contextual retrieval ingest → **Haiku 4.5**
- Self-host needed (privacy/cost at extreme scale) → open Llama via vLLM

### "Which optimization should I use?"
- Image / CNN → SGD+momentum (works), AdamW (also fine)
- MLP / general → AdamW
- Transformer / LLM → AdamW (β1=0.9, β2=0.95), cosine LR with warmup
- Fine-tuning → AdamW with LR ~10× smaller than pretrain

### "Which fine-tuning method?"
- Limited GPU + just want behavior change → **LoRA** (r=8-64)
- Severe GPU limit + large base model → **QLoRA** (4-bit base + LoRA)
- Plenty of compute + critical quality → full SFT
- Need preference alignment after SFT → **DPO** (skip PPO unless you must)

### "Which retrieval setup?"
- Small corpus (<10k chunks), single user → in-memory Qdrant, vector only
- Production, mixed query types → vector + BM25 (hybrid) + reranker
- Complex docs (code, legal, technical) → add Anthropic-style contextual retrieval
- Real-time data → check if RAG is even right; consider tool use to live API

### "Which normalization layer?"
- CNN, image → BatchNorm
- Transformer / LLM / variable seq → LayerNorm
- Modern LLM (Llama, Mistral) → RMSNorm (cheaper)

### "Build vs buy LLM?"
- Don't fine-tune unless: you've maxed out prompt + RAG + tools, you have ≥1k high-quality labeled examples, and you have stable evals showing prompt-only ceiling.
- Don't pretrain unless: you're in a research org, niche language not covered, or making a product where weights ownership matters.

### "Eval methodology" (apply in order)
1. Write 5 examples by hand. Run prompt. Eyeball.
2. Expand to 20-50 golden examples covering edge cases.
3. Run all golden examples → exact match where possible, LLM-judge where not.
4. Track scores in spreadsheet/W&B across prompt versions.
5. Add real production samples to golden set weekly.
6. Don't ship without measured improvement.

### "Agent or no agent?"
- Single fixed pipeline works → don't agentify.
- LLM needs to decide ordering at runtime → agent.
- Tool errors recoverable mid-task → agent.
- Cost / latency tight → minimize loop depth.

---

## 4. Per-Phase Quick Cheat Sheet

### Phase 1 Math
```
∇(Wx-y)² / ∇W = 2(Wx-y)·xᵀ    (linreg gradient)
σ(z) = 1/(1+e⁻ᶻ),  σ' = σ(1-σ)
softmax stability: x ← x - max(x)
cross-entropy = -Σ p log q
```

### Phase 2 numpy
```python
A @ B          # matmul (not *)
X - X.mean(0)  # broadcast subtract per col
x[:,None]      # add axis
softmax: e = np.exp(x - x.max(-1, keepdims=True)); e/e.sum(-1, keepdims=True)
```

### Phase 3 Classical ML
```python
# Pipeline avoids leakage in CV
Pipeline([("scale", StandardScaler()), ("clf", LogisticRegression())])
cross_val_score(pipe, X, y, cv=5, scoring="roc_auc")
```

### Phase 4 PyTorch
```python
opt.zero_grad()
loss.backward()
torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
opt.step()
# eval mode:
model.eval(); with torch.no_grad(): ...
```

### Phase 6 Transformer
```
Attn(Q,K,V) = softmax(QKᵀ/√d_k) · V
Block: x + Attn(LN(x), mask); x + FFN(LN(x))
GPT-2 124M ≈ 12·d² per block + vocab·d embeddings; d=768, n=12 → 124M
```

### Phase 7 Pretrain
```
C ≈ 6·N·D   (FLOPS)
Chinchilla: D ≈ 20·N
AdamW(β1=.9, β2=.95, wd=0.1), bf16, grad clip 1.0
warmup 1-5% steps, cosine to peak ~3e-4 (small models)
```

### Phase 8 Fine-tune
```python
LoraConfig(r=16, lora_alpha=32, lora_dropout=0.05, target_modules=["q_proj","v_proj"])
# LR ~10× smaller than pretrain
# Always check chat template matches at train AND inference
```

### Phase 9 Claude API
```python
client.messages.create(
    model="claude-opus-4-7",    # or sonnet-4-6, haiku-4-5-20251001
    max_tokens=1024,
    system=[{"type":"text","text":STATIC_PREFIX,"cache_control":{"type":"ephemeral"}}],
    messages=[{"role":"user","content":q}],
    tools=[...],
    thinking={"type":"enabled","budget_tokens":4000},
)
```

### Phase 10 RAG
```
chunk → context_summary (Haiku) → embed → store
query → embed + BM25 → fuse → rerank top-50 → top-5 → Claude
metric: recall@k, faithfulness, relevance
```

### Phase 11 Agents
```
loop: messages.create(tools=T) → if tool_use → exec → tool_result → repeat
caps: max_steps, total_time, total_$, detect repeat (tool,args)
sandbox tool exec; never raw shell on untrusted
```

### Phase 12 MLOps
```
vLLM serving + FastAPI wrapper + Docker
auth (API keys), rate limit (slowapi)
Prometheus/Grafana for req/s, p50/p95/p99, tokens, $
Langfuse/Helicone for LLM traces
```

---

## 5. Common Mistakes Per Phase

| Phase | Mistake | Fix |
|-------|---------|-----|
| 0 | Forget to `setx` → key vanishes new shell | Use `setx`, reopen shell |
| 1 | Skip math → die later | 3Blue1Brown linear alg + calc, no skip |
| 2 | Loops instead of vectorization | Replace every for with broadcasting |
| 3 | Fit scaler on full data before split | sklearn Pipeline + CV |
| 4 | Forget zero_grad → grads compound | Add zero_grad first thing each step |
| 5 | Skip BPE → don't understand tokenizer bugs | Build minbpe from scratch |
| 6 | Just watch Karpathy, don't code along | Pause, type, run |
| 7 | LR too high → NaN; too low → flat | 3e-4 for small, sweep ±10× |
| 8 | Forget chat template → garbage outputs | Print decoded sample, verify template at train + infer |
| 9 | Skip evals → optimize on vibes | 20-50 golden examples FIRST |
| 10 | Pure vector search → fail on codes | Hybrid + rerank |
| 11 | Loops without caps → runaway cost | Always cap steps + $ |
| 12 | No observability → blind in prod | Logs + traces + cost dashboards |
| 13 | Private repos → no leverage | Default public for portfolio |

---

## 6. Reading Order (one-stop)

**Day 1–7**: 3Blue1Brown LA + Calc + Khan Stats. Phase 1 quiz.
**Week 2**: numpy/pandas + Titanic. Phase 2.
**Week 3–4**: Hands-on ML book ch 1-8 + Kaggle House Prices.
**Week 5–7**: Karpathy Zero-to-Hero (micrograd → makemore). Phase 4.
**Week 8**: BPE from scratch (minbpe). Phase 5.
**Week 9–12**: Karpathy "Let's build GPT". Reimplement nanoGPT. RoPE + KV cache. Phase 6.
**Week 13–16**: Karpathy reproduce GPT-2 124M. Phase 7.
**Week 17–19**: LoRA fine-tune Llama-3.2-1B. DPO. Phase 8.
**Week 20–22**: Anthropic docs cover-to-cover. Build 3 Claude apps. Phase 9.
**Week 23–24**: RAG over your data. Contextual retrieval. Phase 10.
**Week 25–27**: Agents. Phase 11.
**Week 28–30**: vLLM + FastAPI + Docker + Grafana. Phase 12.
**Ongoing**: papers, blog, portfolio, applications.

---

## 7. Books (in priority order)

1. Sebastian Raschka — *Build a Large Language Model (From Scratch)*
2. Andrew Glassner — *Deep Learning: A Visual Approach*
3. Aurélien Géron — *Hands-On ML with Scikit-Learn, Keras & TensorFlow*
4. Chip Huyen — *Designing Machine Learning Systems*
5. Chip Huyen — *AI Engineering* (2025)
6. Ian Goodfellow — *Deep Learning* (reference)
7. Christopher Bishop — *Pattern Recognition and Machine Learning* (math-heavy classic)

---

## 8. People to follow on X / blogs

- Andrej Karpathy (videos + repos)
- Sebastian Raschka (newsletter)
- Lilian Weng (lilianweng.github.io — surveys)
- Chip Huyen (huyenchip.com)
- Simon Willison (simonwillison.net — daily LLM news)
- Eugene Yan (eugeneyan.com — production LLM)
- Hamel Husain (hamel.dev — evals)
- Anthropic Research / Interpretability team
- jbarrow / nostalgebraist / janus on X (interpretability community)
- Yannic Kilcher (paper walkthroughs YT)

---

## 9. The 5-Question Check (use anytime you're confused)

Whenever stuck on a concept, answer these out loud:
1. **What problem does this solve?**
2. **What's the input and output?**
3. **What's the simplest example?**
4. **Where does it break?**
5. **What does it look like in code?**

If you can't answer 4 of 5, you don't understand it yet. Re-watch / re-read / re-code.
