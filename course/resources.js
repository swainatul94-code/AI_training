// course/resources.js — curated free external resources per phase, in watch/read order.
// Ordered: first item = start here. All URLs are canonical stable roots.
// Must load before engine.js (or as a standalone data file).
window.RESOURCES = [

  // ──────────────────────────────────────────────────────────────────────────
  // Phase 0 — Setup (get your environment working before anything else)
  // ──────────────────────────────────────────────────────────────────────────
  {
    phaseId: 0,
    items: [
      {
        title: "Official Python Tutorial",
        url: "https://docs.python.org/3/tutorial/",
        why: "The authoritative beginner introduction to Python from the people who make it — free, accurate, and always up to date."
      },
      {
        title: "Automate the Boring Stuff with Python (free online book)",
        url: "https://automatetheboringstuff.com",
        why: "Practical, zero-jargon book that teaches Python through real tasks; chapter 1 gets you writing scripts on day one."
      },
      {
        title: "Real Python — Beginner tutorials",
        url: "https://realpython.com",
        why: "Large library of plain-English Python tutorials with lots of worked examples — excellent for filling gaps when the official docs feel terse."
      },
      {
        title: "Anthropic docs — Getting Started",
        url: "https://docs.anthropic.com",
        why: "The official reference for everything Claude API — quickstart guide, model IDs, API reference, and pricing all live here."
      },
      {
        title: "Anthropic Cookbook (GitHub)",
        url: "https://github.com/anthropics/anthropic-cookbook",
        why: "Worked Python code examples for every common Claude API pattern — prompt caching, tool use, streaming, structured output, and more."
      },
      {
        title: "Git — the official tutorial",
        url: "https://git-scm.com/docs/gittutorial",
        why: "Ten-minute walkthrough of init, add, commit, push — enough Git to protect your work and build a portfolio from day one."
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Phase 1 — Python Basics (before you write ML code, learn the language)
  // ──────────────────────────────────────────────────────────────────────────
  {
    phaseId: 1,
    items: [
      {
        title: "Official Python Tutorial",
        url: "https://docs.python.org/3/tutorial/",
        why: "Work through chapters 3–9 to cover data types, functions, classes, and file I/O — the exact Python features used throughout this course."
      },
      {
        title: "Automate the Boring Stuff with Python (free online book)",
        url: "https://automatetheboringstuff.com",
        why: "Chapters on lists, dictionaries, functions, and file handling make abstract syntax concrete through practical mini-projects."
      },
      {
        title: "Real Python — Python Basics",
        url: "https://realpython.com/learning-paths/python-basics/",
        why: "Guided learning path with short focused articles on each Python concept; great for filling specific gaps quickly."
      },
      {
        title: "Python Tutor — visualise code execution",
        url: "https://pythontutor.com",
        why: "Paste any Python snippet and step through it line by line seeing exactly what variables hold — invaluable when debugging confusing behavior."
      },
      {
        title: "How to Think Like a Computer Scientist (free)",
        url: "https://openbookproject.net/thinkcs/python/english3e/",
        why: "Free textbook that builds genuine problem-solving intuition, not just syntax knowledge — the mental model section on functions is especially good."
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Phase 15 — Ship First AI App (build confidence early with the Claude API)
  // ──────────────────────────────────────────────────────────────────────────
  {
    phaseId: 15,
    items: [
      {
        title: "Anthropic docs — Build with Claude",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/",
        why: "The most direct path to your first working app: covers messages API, tool use, prompt caching, and streaming with copy-paste examples."
      },
      {
        title: "Anthropic Cookbook (GitHub)",
        url: "https://github.com/anthropics/anthropic-cookbook",
        why: "Runnable notebooks for every common pattern — start with the 'getting_started' folder for a working app in under 30 minutes."
      },
      {
        title: "Anthropic — Building Effective Agents (blog essay)",
        url: "https://www.anthropic.com/engineering/building-effective-agents",
        why: "Short, practical essay explaining when a simple API call beats an agent loop — read this before over-engineering your first app."
      },
      {
        title: "Railway docs — Deploy in minutes",
        url: "https://docs.railway.com",
        why: "Your default deploy target for Python apps: push a repo, Railway detects it, deploys it — no Docker required for simple apps."
      },
      {
        title: "Model Context Protocol (MCP) docs",
        url: "https://modelcontextprotocol.io",
        why: "The open standard for connecting Claude to your own tools and data sources — skim the overview now, come back when building agents."
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Phase 2 — Math Foundations (the calculus and linear algebra behind all ML)
  // ──────────────────────────────────────────────────────────────────────────
  {
    phaseId: 2,
    items: [
      {
        title: "3Blue1Brown — Essence of Linear Algebra (YouTube playlist)",
        url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
        why: "The single best visual introduction to vectors, matrices, and transformations — watch this before touching any ML code, no math background needed."
      },
      {
        title: "3Blue1Brown — Essence of Calculus (YouTube playlist)",
        url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr",
        why: "Builds intuition for derivatives and integrals from scratch with stunning animations — you need derivatives for backpropagation."
      },
      {
        title: "Khan Academy — Probability and Statistics",
        url: "https://www.khanacademy.org/math/statistics-probability",
        why: "Free, exercise-driven probability course — covers distributions, conditional probability, and Bayes' theorem which underpin LLM outputs."
      },
      {
        title: "Mathematics for Machine Learning (free PDF + web)",
        url: "https://mml-book.github.io",
        why: "The definitive free textbook covering exactly the linear algebra, calculus, and probability used in ML — use as a reference alongside videos."
      },
      {
        title: "StatQuest with Josh Starmer (YouTube)",
        url: "https://www.youtube.com/@statquest",
        why: "Plain-English statistical concepts explained with 'BAM!' enthusiasm — especially good for probability distributions, PCA, and gradient descent."
      },
      {
        title: "3Blue1Brown — Neural Networks playlist",
        url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi",
        why: "Four videos that connect the math you just learned to actual neural networks — watch before Phase 4 for the big picture."
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Phase 3 — Python for ML (numpy, pandas, matplotlib — the data toolkit)
  // ──────────────────────────────────────────────────────────────────────────
  {
    phaseId: 3,
    items: [
      {
        title: "NumPy official quickstart",
        url: "https://numpy.org/doc/stable/user/quickstart.html",
        why: "Official 30-minute walkthrough of arrays, broadcasting, and indexing — read this before any ML code, everything uses NumPy."
      },
      {
        title: "Python Data Science Handbook (free online)",
        url: "https://jakevdp.github.io/PythonDataScienceHandbook/",
        why: "Free book covering NumPy, pandas, matplotlib, and scikit-learn with runnable notebooks — chapters 2 and 3 are essential for this phase."
      },
      {
        title: "Kaggle — Pandas course (free)",
        url: "https://www.kaggle.com/learn/pandas",
        why: "Hands-on mini-course with instant feedback in-browser — the fastest way to get comfortable loading, filtering, and transforming tabular data."
      },
      {
        title: "Matplotlib tutorials",
        url: "https://matplotlib.org/stable/tutorials/index.html",
        why: "Official tutorials for the most-used Python plotting library — the 'Beginner's Guide' section gets you plotting loss curves and data distributions quickly."
      },
      {
        title: "Kaggle — Intro to Machine Learning course (free)",
        url: "https://www.kaggle.com/learn/intro-to-machine-learning",
        why: "Quick, practical introduction to decision trees and model validation in scikit-learn — pairs well with the Titanic and House Prices projects."
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Phase 4 — Classical ML (the foundations every ML interview tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    phaseId: 4,
    items: [
      {
        title: "scikit-learn user guide",
        url: "https://scikit-learn.org/stable/user_guide.html",
        why: "The complete reference for every classical ML algorithm — work through the supervised learning section alongside your project code."
      },
      {
        title: "Google ML Crash Course (free)",
        url: "https://developers.google.com/machine-learning/crash-course",
        why: "Structured course from Google covering linear regression, logistic regression, overfitting, and feature engineering — good for interview prep."
      },
      {
        title: "StatQuest — Machine Learning playlist (YouTube)",
        url: "https://www.youtube.com/@statquest/playlists",
        why: "Josh Starmer's plain-English walkthroughs of decision trees, random forests, gradient boosting, and PCA — best visual explanations available free."
      },
      {
        title: "Hands-On ML with Scikit-Learn, Keras & TensorFlow (Géron) — preview chapters",
        url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/",
        why: "The standard textbook for applied ML — chapters 1–8 cover classical ML thoroughly; check your local library for free access."
      },
      {
        title: "Kaggle — Feature Engineering course (free)",
        url: "https://www.kaggle.com/learn/feature-engineering",
        why: "Practical techniques for transforming raw data into features that actually help models — directly applicable to the House Prices competition."
      },
      {
        title: "Mathematics for ML — Probability chapter",
        url: "https://mml-book.github.io",
        why: "Return to chapter 6 (probability and distributions) to understand the math behind naive Bayes, logistic regression, and evaluation metrics."
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Phase 5 — Deep Learning + PyTorch (the engine under every modern AI system)
  // ──────────────────────────────────────────────────────────────────────────
  {
    phaseId: 5,
    items: [
      {
        title: "Andrej Karpathy — Neural Networks: Zero to Hero (YouTube playlist)",
        url: "https://www.youtube.com/playlist?list=PLAqhIIIyqZ7a8nDOfeWBNmL5kM5l5dlEB",
        why: "The most essential resource in this course: Karpathy builds micrograd (a tiny autograd engine) then a bigram model then makemore from scratch — code along with every video."
      },
      {
        title: "fast.ai — Practical Deep Learning for Coders (free)",
        url: "https://course.fast.ai",
        why: "Top-down approach that gets you training real models on the first day — great for building intuition before diving into the math details."
      },
      {
        title: "PyTorch official tutorials",
        url: "https://pytorch.org/tutorials/",
        why: "Official tutorials for the framework you'll use for everything — work through 'Learn the Basics' and 'Introduction to PyTorch' sections."
      },
      {
        title: "3Blue1Brown — Neural Networks playlist",
        url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi",
        why: "Four videos giving you the visual intuition for backpropagation and gradient descent before you implement them — watch first."
      },
      {
        title: "Deep Learning (Goodfellow, Bengio, Courville) — free online",
        url: "https://www.deeplearningbook.org",
        why: "The authoritative textbook for deep learning theory — use chapters 6 (deep feedforward networks) and 8 (optimization) as a reference, not cover-to-cover."
      },
      {
        title: "StatQuest — Backpropagation and Neural Networks (YouTube)",
        url: "https://www.youtube.com/@statquest",
        why: "Slower, more visual walkthrough of backpropagation math that complements Karpathy's faster coding approach — watch both for full understanding."
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Phase 6 — NLP Fundamentals (text processing, tokenisation, embeddings)
  // ──────────────────────────────────────────────────────────────────────────
  {
    phaseId: 6,
    items: [
      {
        title: "Andrej Karpathy — minbpe (GitHub repo)",
        url: "https://github.com/karpathy/minbpe",
        why: "Karpathy's minimal BPE tokenizer implementation — build this yourself to truly understand how GPT-style models split text into tokens."
      },
      {
        title: "Jurafsky & Martin — Speech and Language Processing (SLP3) — free online",
        url: "https://web.stanford.edu/~jurafsky/slp3/",
        why: "The standard NLP textbook, free online — chapters on n-grams, embeddings, and sequence models give solid theoretical grounding."
      },
      {
        title: "HuggingFace NLP Course (free)",
        url: "https://huggingface.co/learn/nlp-course",
        why: "Practical course covering tokenizers, transformers, and the HuggingFace ecosystem — chapter 2 (using transformers) is immediately applicable."
      },
      {
        title: "Jay Alammar — The Illustrated Word2Vec",
        url: "https://jalammar.github.io/illustrated-word2vec/",
        why: "Visual explanation of word embeddings that shows why similar words have similar vectors — the best free introduction to the concept."
      },
      {
        title: "Andrej Karpathy — Neural Networks: Zero to Hero (makemore episodes)",
        url: "https://www.youtube.com/playlist?list=PLAqhIIIyqZ7a8nDOfeWBNmL5kM5l5dlEB",
        why: "The makemore videos (episodes 2–5) build character-level language models step by step — the clearest path from basic MLP to understanding sequence modeling."
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Phase 7 — Transformers From Scratch (the architecture behind all LLMs)
  // ──────────────────────────────────────────────────────────────────────────
  {
    phaseId: 7,
    items: [
      {
        title: "Andrej Karpathy — Let's build GPT (YouTube)",
        url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
        why: "The definitive from-scratch GPT implementation video — Karpathy codes the entire transformer architecture live, explaining every line."
      },
      {
        title: "The Illustrated Transformer (Jay Alammar)",
        url: "https://jalammar.github.io/illustrated-transformer/",
        why: "The most-shared visual explanation of how attention and the full transformer block works — read this before or alongside Karpathy's video."
      },
      {
        title: "Attention Is All You Need (original paper)",
        url: "https://arxiv.org/abs/1706.03762",
        why: "The 2017 paper that introduced the transformer — read it after watching Karpathy so every equation has a concrete code counterpart in your mind."
      },
      {
        title: "Andrej Karpathy — nanoGPT (GitHub repo)",
        url: "https://github.com/karpathy/nanoGPT",
        why: "Clean, minimal GPT implementation you should reproduce line by line — the reference code to check your understanding after building your own version."
      },
      {
        title: "HuggingFace NLP Course — Chapter 1: Transformer Models",
        url: "https://huggingface.co/learn/nlp-course/chapter1/",
        why: "Accessible overview of how transformers are used in practice, connecting the architecture you just built to the library ecosystem you'll use in later phases."
      },
      {
        title: "Lilian Weng — The Transformer Family v2.0 (blog)",
        url: "https://lilianweng.github.io/posts/2023-01-27-the-transformer-family-v2/",
        why: "Comprehensive survey of every transformer variant (RoPE, ALiBi, sparse attention, etc.) — the best reference for understanding what changed between GPT-2 and modern LLMs."
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Phase 8 — Pretrain a Small LLM (train your own language model end to end)
  // ──────────────────────────────────────────────────────────────────────────
  {
    phaseId: 8,
    items: [
      {
        title: "Andrej Karpathy — Let's reproduce GPT-2 (124M) (YouTube)",
        url: "https://www.youtube.com/watch?v=l8pRSuU81PU",
        why: "4-hour video where Karpathy actually trains GPT-2 from scratch on a single GPU — the most educational pretraining walkthrough available."
      },
      {
        title: "Andrej Karpathy — nanoGPT (GitHub repo)",
        url: "https://github.com/karpathy/nanoGPT",
        why: "The codebase Karpathy uses in the video above — start from the simplest version and scale up to understand every training loop decision."
      },
      {
        title: "Chinchilla paper: Training Compute-Optimal Large Language Models",
        url: "https://arxiv.org/abs/2203.15556",
        why: "The paper that discovered the optimal ratio of model size to training tokens — explains why most models before 2022 were undertrained."
      },
      {
        title: "Weights & Biases — experiment tracking (free for personal use)",
        url: "https://docs.wandb.ai",
        why: "Log loss curves, gradients, and eval metrics during your pretraining run so you can debug and compare experiments visually."
      },
      {
        title: "HuggingFace Datasets — FineWeb",
        url: "https://huggingface.co/datasets/HuggingFaceFW/fineweb",
        why: "High-quality filtered web text dataset — the recommended free training corpus for your small pretraining run."
      },
      {
        title: "Sebastian Raschka — Build a Large Language Model From Scratch (book preview)",
        url: "https://www.manning.com/books/build-a-large-language-model-from-scratch",
        why: "Chapter-by-chapter guide to building and training an LLM — complements Karpathy's video with slower explanations and exercises."
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Phase 9 — Fine-tuning + Alignment (making a base model helpful and safe)
  // ──────────────────────────────────────────────────────────────────────────
  {
    phaseId: 9,
    items: [
      {
        title: "InstructGPT paper: Training Language Models to Follow Instructions with Human Feedback",
        url: "https://arxiv.org/abs/2203.02155",
        why: "The paper that introduced RLHF for language models — essential reading to understand why and how instruction tuning works."
      },
      {
        title: "LoRA paper: Low-Rank Adaptation of Large Language Models",
        url: "https://arxiv.org/abs/2106.09685",
        why: "The original LoRA paper — short and readable, explains why adding two small matrices beats updating all weights."
      },
      {
        title: "HuggingFace PEFT library docs",
        url: "https://huggingface.co/docs/peft",
        why: "The standard Python library for LoRA and QLoRA fine-tuning — start with the LoRA quickstart example to set up your first fine-tuning run."
      },
      {
        title: "HuggingFace TRL library docs",
        url: "https://huggingface.co/docs/trl",
        why: "Library for DPO, PPO, and SFT training — covers the full alignment training pipeline from supervised fine-tuning to preference optimisation."
      },
      {
        title: "Anthropic — Constitutional AI paper",
        url: "https://arxiv.org/abs/2212.08073",
        why: "Anthropic's method for making models helpful and harmless using AI-generated feedback guided by written principles — directly relevant since you use Claude."
      },
      {
        title: "Axolotl (GitHub) — fine-tuning framework",
        url: "https://github.com/axolotl-org/axolotl",
        why: "Popular config-file-driven fine-tuning framework that handles chat templates, LoRA setup, and dataset formatting so you can focus on the data quality."
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Phase 10 — Claude API Apps (building real products with the Claude API)
  // ──────────────────────────────────────────────────────────────────────────
  {
    phaseId: 10,
    items: [
      {
        title: "Anthropic docs — Build with Claude (full reference)",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/",
        why: "Read every section in 'Build with Claude' — prompt caching, tool use, extended thinking, streaming — this is your primary reference for the whole phase."
      },
      {
        title: "Anthropic Cookbook (GitHub)",
        url: "https://github.com/anthropics/anthropic-cookbook",
        why: "Runnable examples for every API pattern including multi-turn conversation, tool use, PDF processing, and vision — the fastest way from idea to working code."
      },
      {
        title: "Anthropic — Building Effective Agents (blog essay)",
        url: "https://www.anthropic.com/engineering/building-effective-agents",
        why: "Anthropic's own guide to when and how to build agent workflows — read carefully before designing your apps to avoid over-engineering."
      },
      {
        title: "Prompt Engineering Guide (community resource)",
        url: "https://www.promptingguide.ai",
        why: "Broad reference covering few-shot, chain-of-thought, ReAct, and other prompting techniques with concrete examples across providers."
      },
      {
        title: "Hamel Husain — Evaluations (blog, hamel.dev)",
        url: "https://hamel.dev",
        why: "The best practical writing on building LLM evaluation systems — essential for the eval harness project in this phase."
      },
      {
        title: "Railway docs",
        url: "https://docs.railway.com",
        why: "Deploy your Claude-powered app to a live URL — Railway is your default deployment target for Python web apps in this phase."
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Phase 11 — RAG Systems (retrieval-augmented generation)
  // ──────────────────────────────────────────────────────────────────────────
  {
    phaseId: 11,
    items: [
      {
        title: "Anthropic — Contextual Retrieval (blog post)",
        url: "https://www.anthropic.com/research/contextual-retrieval",
        why: "Anthropic's technique for adding per-chunk context summaries before embedding — shown to dramatically improve retrieval accuracy, implement this in your RAG project."
      },
      {
        title: "Qdrant docs — Getting Started",
        url: "https://qdrant.tech/documentation/",
        why: "The vector database used throughout this course — start with the local Docker quickstart then move to Qdrant Cloud for the deployed RAG app."
      },
      {
        title: "RAGAS — RAG evaluation framework",
        url: "https://docs.ragas.io",
        why: "Open-source library for measuring faithfulness, answer relevance, and context recall in RAG systems — use this to quantify improvements to your pipeline."
      },
      {
        title: "LangChain — Text Splitters documentation",
        url: "https://python.langchain.com/docs/concepts/text_splitters/",
        why: "Reference for chunking strategies (fixed-size, recursive, semantic) — understanding the options here directly affects retrieval quality."
      },
      {
        title: "Voyage AI — Embeddings docs",
        url: "https://docs.voyageai.com",
        why: "Voyage AI provides the best-in-class embeddings for retrieval tasks (50M tokens free) and is Anthropic's recommended embedding partner."
      },
      {
        title: "Eugene Yan — Applied ML (eugeneyan.com)",
        url: "https://eugeneyan.com",
        why: "Practical writing on production RAG systems, evaluation, and LLM apps from an industry practitioner — bookmark and read regularly."
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Phase 12 — AI Agents (building systems that use tools to complete tasks)
  // ──────────────────────────────────────────────────────────────────────────
  {
    phaseId: 12,
    items: [
      {
        title: "Anthropic — Building Effective Agents (blog essay)",
        url: "https://www.anthropic.com/engineering/building-effective-agents",
        why: "The most important reading for this phase — Anthropic's own analysis of when agents beat simple pipelines and how to design safe, cost-controlled loops."
      },
      {
        title: "Anthropic docs — Tool use (function calling)",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/",
        why: "Complete reference for how to define tools, handle tool_use blocks, and return tool_result — the raw API underneath every agent framework."
      },
      {
        title: "Model Context Protocol (MCP) docs",
        url: "https://modelcontextprotocol.io",
        why: "The open standard that lets AI models connect to arbitrary external tools and data sources — understanding MCP prepares you for building production agent systems."
      },
      {
        title: "Anthropic — Claude Agent SDK docs",
        url: "https://docs.anthropic.com/en/docs/claude-code/sdk",
        why: "Anthropic's official SDK for building agents — recommended first framework before exploring community alternatives."
      },
      {
        title: "Lilian Weng — LLM Powered Autonomous Agents (blog)",
        url: "https://lilianweng.github.io/posts/2023-06-23-agent/",
        why: "Comprehensive overview of the planning, memory, and tool-use components of LLM agents — excellent theoretical grounding for the practical projects."
      },
      {
        title: "Langfuse — LLM observability (free tier)",
        url: "https://langfuse.com",
        why: "Trace every step of your agent loop (token counts, tool calls, latencies, cost) — required for the observability requirement of the agent projects."
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Phase 13 — MLOps (deploying and operating models in production)
  // ──────────────────────────────────────────────────────────────────────────
  {
    phaseId: 13,
    items: [
      {
        title: "Docker — Get Started tutorial",
        url: "https://docs.docker.com/get-started/",
        why: "Official beginner tutorial for Docker — containers are the fundamental unit of deployment, you need to know this before deploying vLLM or any model server."
      },
      {
        title: "vLLM docs",
        url: "https://docs.vllm.ai",
        why: "The standard open-source LLM serving framework — covers PagedAttention, continuous batching, OpenAI-compatible API, and deployment to GPU servers."
      },
      {
        title: "RunPod docs",
        url: "https://docs.runpod.io",
        why: "Your GPU rental provider for Phase 12 — covers spinning up GPU pods, SSHing in, and running vLLM; spot instances keep costs near $1/hr."
      },
      {
        title: "FastAPI docs — Tutorial",
        url: "https://fastapi.tiangolo.com/tutorial/",
        why: "The Python web framework used to wrap your vLLM server with auth, rate limiting, and a clean REST API — excellent documentation with many examples."
      },
      {
        title: "Chip Huyen — Designing Machine Learning Systems (summary blog)",
        url: "https://huyenchip.com",
        why: "Chip Huyen's blog covers production ML systems: data pipelines, model deployment, monitoring, and failure modes — essential reading for the MLOps phase."
      },
      {
        title: "Weights & Biases docs — Monitoring",
        url: "https://docs.wandb.ai",
        why: "Use W&B to track training runs, model performance, and cost metrics — free for personal use and integrates with PyTorch and HuggingFace."
      },
      {
        title: "GitHub Actions docs — Quickstart",
        url: "https://docs.github.com/en/actions/quickstart",
        why: "Set up CI/CD pipelines that automatically test and deploy your model server on every push — the standard tool for automating the deploy process."
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Phase 14 — Papers + Portfolio (reading research and showcasing your work)
  // ──────────────────────────────────────────────────────────────────────────
  {
    phaseId: 14,
    items: [
      {
        title: "S. Keshav — How to Read a Paper (PDF)",
        url: "https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf",
        why: "Three-page guide to the 'three-pass' method for efficiently reading research papers — read this first before attempting any of the papers below."
      },
      {
        title: "Attention Is All You Need (2017)",
        url: "https://arxiv.org/abs/1706.03762",
        why: "The transformer paper — read it at least twice with annotations; understanding every equation here is the mark of a strong AI engineer."
      },
      {
        title: "Chinchilla: Training Compute-Optimal LLMs (2022)",
        url: "https://arxiv.org/abs/2203.15556",
        why: "Established the ~20 tokens-per-parameter scaling law that reshaped how all subsequent models are trained."
      },
      {
        title: "LoRA: Low-Rank Adaptation (2021)",
        url: "https://arxiv.org/abs/2106.09685",
        why: "The fine-tuning method you used in Phase 9 — reading the paper deepens your understanding of why it works and when to increase rank."
      },
      {
        title: "InstructGPT (2022)",
        url: "https://arxiv.org/abs/2203.02155",
        why: "The paper that introduced RLHF for language models — the alignment technique behind ChatGPT, Claude, and every modern assistant."
      },
      {
        title: "Yannic Kilcher — Paper walkthroughs (YouTube)",
        url: "https://www.youtube.com/@YannicKilcher",
        why: "Yannic reads major AI papers out loud with a whiteboard — watch his walkthroughs of papers you find dense before reading them yourself."
      },
      {
        title: "Lilian Weng's blog (lilianweng.github.io)",
        url: "https://lilianweng.github.io",
        why: "The best technical survey blog in ML — every post is a mini-textbook on an important topic (agents, RLHF, diffusion models, etc.) with full citations."
      },
      {
        title: "Andrej Karpathy — nanoGPT + llm.c (GitHub)",
        url: "https://github.com/karpathy/llm.c",
        why: "Karpathy's C/CUDA reimplementation of GPT-2 training — reading the source code deepens your understanding of training efficiency and GPU kernels."
      },
    ]
  },

];
