// course/studyguide.js — printable syllabus: weekly schedule, checkpoints, self-checks.
// Consistent with AI_ZERO_TO_HERO.md. All phase IDs match the COURSE_PHASES array.
// Must load before engine.js (or as a standalone data file).
window.STUDY_GUIDE = {

  pace: "Designed for ~8-10 hrs/week → finishes in ~7-8 months at that pace. Halve the hours, double the calendar. If you can do 15-20 hrs/week, you can finish in 4-5 months.",

  // ──────────────────────────────────────────────────────────────────────────
  // WEEKLY SCHEDULE
  // phase: the phase ID (or IDs) being covered that week
  // focus: what you're working on / watching / reading
  // goal: concrete 'done when' deliverable — something you can tick and show
  // ──────────────────────────────────────────────────────────────────────────
  weeks: [

    // ── Phase 0 Setup (est 1-2 hrs) ──────────────────────────────────────
    {
      wk: "1",
      phase: "0",
      focus: "Environment setup: Python, uv, Git, VS Code, Anthropic API key, GitHub repo",
      goal: "test_claude.py prints a Claude response in the terminal AND your first commit is pushed to GitHub"
    },

    // ── Phase 1 Python Basics (est 8-15 hrs) ─────────────────────────────
    {
      wk: "1–2",
      phase: "1",
      focus: "Python fundamentals: variables, lists, dicts, functions, classes, file I/O",
      goal: "Write a Python script with at least one class, one function, and file read/write — all from scratch without copy-pasting"
    },
    {
      wk: "2",
      phase: "1",
      focus: "Python for data: list comprehensions, generators, error handling, virtual environments",
      goal: "Phase 1 done: you can write and run a multi-file Python project without getting stuck on syntax"
    },

    // ── Phase 15 Ship First AI App (est 0.5-1 hr) ────────────────────────
    {
      wk: "2",
      phase: "15",
      focus: "Build and deploy a tiny Claude-powered app (e.g. a CLI Q&A tool) before going deep on theory",
      goal: "A working app deployed to Railway (or any public URL) that calls the Claude API and returns an answer — share the link"
    },

    // ── Phase 2 Math Foundations (est 25-40 hrs) ─────────────────────────
    {
      wk: "3",
      phase: "2",
      focus: "Linear algebra: vectors, matrices, dot product, matmul — 3Blue1Brown Essence of Linear Algebra",
      goal: "Complete all 15 3Blue1Brown linear algebra videos AND write numpy code that verifies 5 concepts from the videos (e.g. matmul, transpose)"
    },
    {
      wk: "4",
      phase: "2",
      focus: "Calculus: derivatives, chain rule, partial derivatives — 3Blue1Brown Essence of Calculus",
      goal: "Compute the gradient of f(x,y) = x²y + 3y by hand on paper AND verify with numpy's numerical approximation"
    },
    {
      wk: "5",
      phase: "2",
      focus: "Probability: distributions, Bayes, entropy, expectation — Khan Academy + MML book chapter 6",
      goal: "Phase 2 done: pass the Phase 2 course quiz AND implement softmax + cross-entropy loss in pure numpy (no libraries)"
    },

    // ── Phase 3 Python for ML (est 12-20 hrs) ────────────────────────────
    {
      wk: "6",
      phase: "3",
      focus: "NumPy: array operations, broadcasting, axis reductions — no for-loops allowed",
      goal: "Solve 10 NumPy exercises using only vectorised operations (no Python loops) — commit as phase3_numpy.py"
    },
    {
      wk: "6",
      phase: "3",
      focus: "pandas + matplotlib: load CSV, clean data, group, merge, plot 5 insights",
      goal: "Phase 3 done: Titanic EDA notebook (phase3_titanic_eda.ipynb) committed — shows 5 plots and 3 written observations"
    },

    // ── Phase 4 Classical ML (est 20-30 hrs) ─────────────────────────────
    {
      wk: "7",
      phase: "4",
      focus: "Linear and logistic regression from scratch in numpy — derive and implement gradient descent by hand",
      goal: "Working linear regression that matches scikit-learn's output on a toy dataset — both implementations committed"
    },
    {
      wk: "8",
      phase: "4",
      focus: "Decision trees, random forests, XGBoost with scikit-learn — train, validate, tune hyperparameters",
      goal: "Kaggle House Prices submission in the top 30% — commit notebook with pipeline, CV score, and public leaderboard screenshot"
    },
    {
      wk: "8",
      phase: "4",
      focus: "Evaluation metrics: accuracy, precision, recall, F1, ROC-AUC, cross-validation, overfitting diagnosis",
      goal: "Phase 4 done: write a one-page summary (markdown in repo) explaining bias-variance tradeoff with your own diagrams"
    },

    // ── Phase 5 Deep Learning + PyTorch (est 35-50 hrs) ──────────────────
    {
      wk: "9",
      phase: "5",
      focus: "Karpathy Zero to Hero: micrograd — build autograd engine from scratch",
      goal: "micrograd.py committed and passing all tests — you can explain what a computation graph is"
    },
    {
      wk: "10",
      phase: "5",
      focus: "Karpathy Zero to Hero: makemore — MLP character model, batch norm, residual connections",
      goal: "makemore model trained and generating plausible names — committed with training curve plot"
    },
    {
      wk: "11",
      phase: "5",
      focus: "PyTorch: training loop, optimizers (SGD, AdamW), regularization (dropout, weight decay), GPU",
      goal: "Phase 5 done: MLP trained on MNIST in PyTorch hitting >97% test accuracy — committed as phase5_mnist.py"
    },

    // ── Phase 6 NLP Fundamentals (est 12-18 hrs) ─────────────────────────
    {
      wk: "12",
      phase: "6",
      focus: "Tokenization: BPE from scratch following Karpathy's minbpe repo",
      goal: "BPE tokenizer that correctly encodes and decodes a paragraph — committed as phase6_bpe.py"
    },
    {
      wk: "12",
      phase: "6",
      focus: "Embeddings, seq2seq, attention mechanism (Bahdanau) — theory and simple implementation",
      goal: "Phase 6 done: draw the attention mechanism on paper from memory (photograph and commit it)"
    },

    // ── Phase 7 Transformers From Scratch (est 40-60 hrs) ────────────────
    {
      wk: "13",
      phase: "7",
      focus: "Karpathy 'Let's build GPT': self-attention, multi-head attention, causal mask — code along live",
      goal: "Working single-head attention block in PyTorch — committed and you can explain every line"
    },
    {
      wk: "14",
      phase: "7",
      focus: "Full transformer block: residual connections, layer norm, FFN, positional encoding, KV cache",
      goal: "Full decoder-only transformer committed — generates coherent Tiny Shakespeare text after 10 min training"
    },
    {
      wk: "15",
      phase: "7",
      focus: "nanoGPT: reproduce from scratch without copy-paste, add RoPE, benchmark with/without KV cache",
      goal: "Phase 7 done: your transformer repo is public on GitHub with a README showing training loss curve and sample output"
    },

    // ── Phase 8 Pretrain Small LLM (est 40-60 hrs) ───────────────────────
    {
      wk: "16",
      phase: "8",
      focus: "Dataset prep: download FineWeb, tokenise, shard into binary files",
      goal: "Tokenised dataset ready on Kaggle/RunPod GPU instance — data loading script committed"
    },
    {
      wk: "17",
      phase: "8",
      focus: "Karpathy 'Let's reproduce GPT-2': training loop at scale, gradient accumulation, mixed precision, W&B logging",
      goal: "Training run started on GPU — loss curve visible in W&B, model generating English text"
    },
    {
      wk: "17",
      phase: "8",
      focus: "Eval: HellaSwag accuracy, perplexity, checkpoint on HuggingFace Hub",
      goal: "Phase 8 done: pretrained model weights on HuggingFace Hub with a model card, HellaSwag score documented"
    },

    // ── Phase 9 Fine-tuning + Alignment (est 25-40 hrs) ──────────────────
    {
      wk: "18",
      phase: "9",
      focus: "LoRA fine-tuning with HuggingFace PEFT: set up LoraConfig, train on instruction dataset, compare outputs",
      goal: "LoRA fine-tuned model on HuggingFace Hub — side-by-side comparison of base vs fine-tuned outputs committed"
    },
    {
      wk: "19",
      phase: "9",
      focus: "DPO with TRL library: prepare preference pairs, run DPO trainer, compare SFT vs DPO behavior",
      goal: "Phase 9 done: blog post 'I fine-tuned X — here is what I learned' published (GitHub Pages or Substack)"
    },

    // ── Phase 10 Claude API Apps (est 30-50 hrs) ──────────────────────────
    {
      wk: "20",
      phase: "10",
      focus: "Claude API deep dive: prompt caching, tool use, streaming, structured output, extended thinking",
      goal: "App 1 deployed: CLI coding assistant using Claude tool use (file read/write) — public GitHub repo with README"
    },
    {
      wk: "21",
      phase: "10",
      focus: "Eval harness: golden set of 20 examples, LLM-as-judge scoring, prompt variant comparison",
      goal: "Phase 10 done: all 3 apps deployed (coding assistant, Discord/Slack bot, eval harness) — prompt cache hit rate measured and documented"
    },

    // ── Phase 11 RAG Systems (est 18-28 hrs) ──────────────────────────────
    {
      wk: "22",
      phase: "11",
      focus: "Chunking, embedding (Voyage AI), vector DB (Qdrant), cosine similarity search — build basic RAG",
      goal: "Basic RAG app that answers questions from your own documents — committed with architecture diagram"
    },
    {
      wk: "22",
      phase: "11",
      focus: "Contextual retrieval, hybrid search (BM25 + vector), reranking — measure recall@5 improvement",
      goal: "Phase 11 done: RAG app deployed (Railway) with eval showing recall@5 before and after contextual retrieval"
    },

    // ── Phase 12 Agents (est 25-40 hrs) ───────────────────────────────────
    {
      wk: "23",
      phase: "12",
      focus: "Tool use API: define tools, handle tool_use blocks, tool_result, multi-step loops — build raw without frameworks",
      goal: "Research agent that takes a topic, searches the web, reads pages, and writes a report — end-to-end test committed"
    },
    {
      wk: "24",
      phase: "12",
      focus: "Agent safety: max_steps cap, cost cap, loop detection, observability with Langfuse",
      goal: "Phase 12 done: agent runs reliably on 10 different inputs, cost per run < $0.50 measured and documented in README"
    },

    // ── Phase 13 MLOps (est 30-45 hrs) ────────────────────────────────────
    {
      wk: "25",
      phase: "13",
      focus: "Docker: containerise your Claude app, push to Docker Hub — understand layers and image size",
      goal: "Docker image that runs your app from 'docker run' with zero extra setup — image pushed to Docker Hub or GHCR"
    },
    {
      wk: "26",
      phase: "13",
      focus: "vLLM on RunPod GPU: serve your fine-tuned model, wrap with FastAPI, add auth + rate limiting",
      goal: "vLLM server running on rented GPU — curl request returns a completion, latency measured"
    },
    {
      wk: "27",
      phase: "13",
      focus: "CI/CD with GitHub Actions, monitoring with W&B + Langfuse, load testing (locust)",
      goal: "Phase 13 done: system diagram committed, load test results showing req/s and p50/p99 latency"
    },

    // ── Phase 14 Papers + Portfolio (ongoing) ─────────────────────────────
    {
      wk: "28–32",
      phase: "14",
      focus: "Read 1 paper/week (start with Attention Is All You Need, Chinchilla, InstructGPT, LoRA) — write 1 blog post per phase",
      goal: "Phase 14 ongoing: 5 papers annotated and filed, 5 blog posts published, all phase repos public with READMEs showing metrics"
    },
  ],

  // ──────────────────────────────────────────────────────────────────────────
  // CHECKPOINTS
  // 3-5 self-check questions each — plain enough to answer on paper or out loud
  // ──────────────────────────────────────────────────────────────────────────
  checkpoints: [

    {
      after: "Phase 0 (Setup) + Phase 1 (Python Basics)",
      check: [
        "Can you open a terminal and run a Python script you wrote yourself from scratch?",
        "Can you explain what an environment variable is and why we use setx on Windows instead of $env:VAR?",
        "Can you write a Python function that takes a list of numbers and returns their average — without using any library?",
        "Can you make a call to the Claude API and print the response text — from memory, without looking at the docs?",
      ]
    },

    {
      after: "Phase 15 (First App) + Phase 2 (Math Foundations)",
      check: [
        "Can you compute a 2×2 matrix multiply by hand on paper and verify it with numpy?",
        "Can you explain what a derivative means in plain English to someone who has never studied calculus?",
        "Can you explain why the chain rule is the mathematical reason backpropagation works?",
        "Can you compute the softmax of [2, 1, 0.5] by hand (pen and paper) and verify with numpy?",
        "Can you explain what cross-entropy loss is and why a model's loss is high when it's confident but wrong?",
      ]
    },

    {
      after: "Phase 3 (Python for ML) + Phase 4 (Classical ML)",
      check: [
        "Can you replace a for-loop over a 2D numpy array with a single vectorised operation — and explain why that's faster?",
        "Can you explain bias-variance tradeoff with one concrete example of underfitting and one of overfitting?",
        "Can you explain what cross-validation is and why fitting a scaler on the full dataset before splitting is a data leakage bug?",
        "Can you write logistic regression gradient descent in ~20 lines of numpy from memory?",
        "Can you look at a learning curve (train vs validation loss) and say whether the model is overfitting or underfitting?",
      ]
    },

    {
      after: "Phase 5 (Deep Learning + PyTorch)",
      check: [
        "Can you explain what a computation graph is and how PyTorch's autograd uses it to compute gradients?",
        "Can you write the 4-line PyTorch training step (zero_grad, forward, backward, step) from memory and explain what each line does?",
        "Can you explain why ReLU is preferred over sigmoid in hidden layers, and what the vanishing gradient problem is?",
        "Can you explain what dropout does during training versus evaluation, and why you call model.eval() before inference?",
        "Can you explain what AdamW does differently from SGD, and why transformers use AdamW?",
      ]
    },

    {
      after: "Phase 6 (NLP) + Phase 7 (Transformers From Scratch)",
      check: [
        "Can you explain what BPE tokenisation is and trace through two merge steps by hand with a toy vocabulary?",
        "Can you draw the scaled dot-product attention formula (softmax(QKᵀ/√d_k) · V) from memory and explain what Q, K, V are?",
        "Can you explain why the causal mask is needed in a decoder-only model — what would go wrong without it?",
        "Can you explain what a residual connection does and why it helps gradients flow through deep networks?",
        "Can you estimate the approximate parameter count of a small GPT (e.g. 6 layers, d_model=384) by walking through the formula?",
      ]
    },

    {
      after: "Phase 8 (Pretrain) + Phase 9 (Fine-tuning)",
      check: [
        "Can you state the Chinchilla scaling law in plain English and explain why it matters for choosing model size vs data size?",
        "Can you explain what LoRA does in concrete terms: which matrices are frozen, which are added, and what 'rank' controls?",
        "Can you explain what RLHF does that supervised fine-tuning alone cannot achieve?",
        "Can you explain what catastrophic forgetting is in fine-tuning and name two techniques that help prevent it?",
        "Can you calculate the approximate extra parameters added by LoRA with rank r=16 on a weight matrix of shape (4096, 4096)?",
      ]
    },

    {
      after: "Phase 10 (Claude API Apps) + Phase 11 (RAG)",
      check: [
        "Can you explain what prompt caching is and describe what you would wrap in a cache_control block in a real app?",
        "Can you walk through the full RAG pipeline from query to answer: query → embed → search → retrieve → prompt → generate?",
        "Can you explain what contextual retrieval is and why adding a per-chunk context summary improves retrieval accuracy?",
        "Can you explain cosine similarity in plain English and say why two embedding vectors with cos sim close to 1 are likely about the same topic?",
        "Can you design a golden set for evaluating a RAG app — what examples would you include and how would you measure quality?",
      ]
    },

    {
      after: "Phase 12 (Agents)",
      check: [
        "Can you walk through one full agent loop step by step: what the model receives, what it returns, what your code does, and how it calls back?",
        "Can you name three ways an agent loop can fail (runaway cost, infinite loop, tool error) and describe how to guard against each?",
        "Can you explain what the Model Context Protocol (MCP) is and why it makes building agents more composable?",
        "Can you explain what 'human-in-the-loop' means in an agent system and give one example of a high-stakes action that should require human approval?",
      ]
    },

    {
      after: "Phase 13 (MLOps) + Phase 14 (Portfolio)",
      check: [
        "Can you explain what a Docker container is in plain English and why 'works on my machine' is not a production strategy?",
        "Can you explain what vLLM's continuous batching does and why it improves GPU utilisation compared to naive batching?",
        "Can you look at a p50/p99 latency report and explain what it means if p99 is 10× worse than p50?",
        "Can you walk through how you would A/B test two prompts safely in a production system without breaking the user experience?",
        "Can you name every project you've shipped in this course and give one metric for each one (accuracy, recall@5, cost/run, p50 latency)?",
      ]
    },

  ],

};
