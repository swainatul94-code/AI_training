// c16-portfolio — course content. Must load before course/engine.js.
window.COURSE_PHASES = window.COURSE_PHASES || [];
COURSE_PHASES.push(Object.assign({ order: 16 },
{ id:14, title:"Phase 13 — Papers, Portfolio, Brand", est:"Ongoing",
  intro:"Job leverage = public proof + paper literacy + opinions.",
  lessons:[
    {h:"Must-read papers", body:`<ol>
      <li>Vaswani 2017 — Attention Is All You Need</li>
      <li>Devlin 2018 — BERT</li>
      <li>Radford 2019 — GPT-2</li>
      <li>Brown 2020 — GPT-3</li>
      <li>Kaplan 2020 — Scaling Laws</li>
      <li>Hoffmann 2022 — Chinchilla</li>
      <li>Ouyang 2022 — InstructGPT</li>
      <li>Bai 2022 — Constitutional AI (Anthropic)</li>
      <li>Hu 2021 — LoRA</li>
      <li>Dettmers 2023 — QLoRA</li>
      <li>Rafailov 2023 — DPO</li>
      <li>Lewis 2020 — RAG</li>
      <li>Dao 2022 — FlashAttention</li>
      <li>Jiang 2024 — Mixtral MoE</li>
      <li>Anthropic Claude 3/3.5/4 model cards</li>
    </ol>`},
    {h:"Mechanistic interpretability (Anthropic's flagship direction)", body:`<p><b>Why care:</b> if you're using Claude or building safety-critical AI, you should understand the research direction that opens the black box. Anthropic's interp team is one of the largest in industry; the field is hiring.</p>
    <h4>Core idea</h4>
    <p>Mechanistic interpretability tries to reverse-engineer neural networks into human-understandable algorithms. Not "the model has 175B params and outputs token T"; instead "this attention head copies entity names, this MLP layer detects negation".</p>
    <h4>Key concepts</h4>
    <ul>
      <li><b>Features</b>: directions in activation space that correspond to human concepts (e.g., "is a person's name", "is positive sentiment").</li>
      <li><b>Circuits</b>: groups of attention heads + MLPs that together implement an algorithm (e.g., indirect object identification).</li>
      <li><b>Superposition</b>: networks compress more features than they have neurons by representing features as overlapping directions.</li>
      <li><b>Sparse autoencoders (SAEs)</b>: trained to decompose model activations into sparse interpretable features. Anthropic's main tool. Has scaled to Claude 3 Sonnet — Anthropic reported finding millions of features.</li>
      <li><b>Activation patching</b>: swap activations from one input into another, see what changes. Identifies which components are causally responsible.</li>
      <li><b>Causal interventions</b>: ablate (zero out) or boost specific features to test hypotheses.</li>
    </ul>
    <h4>Must-read posts (free, no paywall)</h4>
    <ul>
      <li>Anthropic — <i>Scaling Monosemanticity</i> (2024): SAEs on Claude 3 Sonnet, "Golden Gate Bridge feature"</li>
      <li>Anthropic — <i>Towards Monosemanticity</i> (2023): SAEs on small models</li>
      <li>Olah et al. — <i>Zoom In: An Introduction to Circuits</i> (Distill.pub)</li>
      <li>Nanda — <i>An Extremely Opinionated Annotated List of Favorite Mechanistic Interpretability Papers</i></li>
      <li>Anthropic's Interpretability team blog: anthropic.com/research</li>
    </ul>
    <h4>Hands-on starting points</h4>
    <ul>
      <li><a href="https://github.com/TransformerLensOrg/TransformerLens" target="_blank">TransformerLens</a> — Python library for poking inside HF transformer models (extract activations, patch, ablate)</li>
      <li><a href="https://github.com/jbloomAus/SAELens" target="_blank">SAELens</a> — train and analyze sparse autoencoders</li>
      <li>Neel Nanda's tutorial notebooks (Colab-runnable)</li>
    </ul>
    <h4>Why it's a job market angle</h4>
    <p>Anthropic, DeepMind, OpenAI, Goodfire, METR, MATS hire interp researchers. Small field, high signal, distinct from "ML engineer". A blog post replicating one paper's result = visible portfolio piece.</p>`},
    {h:"3-pass paper reading", body:`<ol>
      <li>5 min: title, abstract, intro, conclusions, figures</li>
      <li>1 hr: full read, ignore proofs, 1-paragraph summary</li>
      <li>2-3 hr: re-derive math, replicate key result</li>
    </ol>`},
    {h:"📄 Structured paper summaries (read these BEFORE the originals)", body:`<p>Skim a summary first → know what to look for → read the actual paper with focus. Each summary: 1-line claim, key insight, why it matters, what to memorize.</p>
    <details class="try"><summary>1. Attention Is All You Need (Vaswani 2017)</summary><div class="ans">
      <b>Claim:</b> attention alone, no RNNs, suffices for translation — at higher quality and parallelism.<br>
      <b>Insight:</b> self-attention <code>softmax(QK^T/√d_k)V</code> + multi-head + positional encoding. Encoder-decoder.<br>
      <b>Why matters:</b> founding paper of every modern LLM. Read 3 times.<br>
      <b>Memorize:</b> scaled dot-product attention formula, multi-head intuition, why /√d_k.
    </div></details>
    <details class="try"><summary>2. BERT (Devlin 2018)</summary><div class="ans">
      <b>Claim:</b> bidirectional transformer pretrained on masked LM + next sentence prediction → SOTA on many NLU tasks.<br>
      <b>Insight:</b> encoder-only transformer, [MASK] + [CLS] tokens, fine-tune on downstream tasks.<br>
      <b>Why matters:</b> ushered transfer-learning era. Direct ancestor of all encoder models.<br>
      <b>Memorize:</b> MLM objective, why bidirectional helps understanding but not generation.
    </div></details>
    <details class="try"><summary>3. GPT-2 (Radford 2019)</summary><div class="ans">
      <b>Claim:</b> a decoder-only LM trained on web text shows zero-shot transfer to many tasks.<br>
      <b>Insight:</b> just scale + good data + next-token prediction → emergent multi-task capability.<br>
      <b>Why matters:</b> the "GPT" recipe. Karpathy reproduces this exact architecture.<br>
      <b>Memorize:</b> 1.5B params, byte-pair encoding, WebText dataset, layer-norm placement (pre vs post).
    </div></details>
    <details class="try"><summary>4. GPT-3 / "Language Models are Few-Shot Learners" (Brown 2020)</summary><div class="ans">
      <b>Claim:</b> 175B param LM does in-context learning — given a few examples in prompt, it generalizes without weight updates.<br>
      <b>Insight:</b> scale unlocks emergent behaviors invisible at smaller sizes.<br>
      <b>Why matters:</b> birthplace of "prompt engineering" as a field.<br>
      <b>Memorize:</b> few-shot vs zero-shot vs fine-tune, the emergent abilities concept.
    </div></details>
    <details class="try"><summary>5. Scaling Laws (Kaplan 2020)</summary><div class="ans">
      <b>Claim:</b> loss scales as predictable power laws of compute, dataset size, parameters.<br>
      <b>Insight:</b> can predict model quality before training. Bigger is better, predictably.<br>
      <b>Why matters:</b> turned ML from art to engineering. Justified billion-dollar training runs.<br>
      <b>Memorize:</b> L ∝ N^-α, log-log plots, compute-optimal frontier.
    </div></details>
    <details class="try"><summary>6. Chinchilla (Hoffmann 2022)</summary><div class="ans">
      <b>Claim:</b> for fixed compute, scale N and D proportionally. ~20 tokens/param is optimal.<br>
      <b>Insight:</b> GPT-3 was massively undertrained. A 70B model with 1.4T tokens beats a 175B model with 300B tokens at the same compute.<br>
      <b>Why matters:</b> changed how Llama, Mistral, and modern open models size their training.<br>
      <b>Memorize:</b> ~20 tokens/param, the compute formula C ≈ 6·N·D.
    </div></details>
    <details class="try"><summary>7. InstructGPT (Ouyang 2022)</summary><div class="ans">
      <b>Claim:</b> RLHF (SFT → reward model → PPO) makes GPT-3 actually useful as an assistant.<br>
      <b>Insight:</b> alignment via human preferences > raw scaling for usefulness.<br>
      <b>Why matters:</b> the recipe behind ChatGPT. Read before Phase 8.<br>
      <b>Memorize:</b> 3-stage pipeline, KL penalty to SFT, reward model training.
    </div></details>
    <details class="try"><summary>8. Constitutional AI (Bai/Anthropic 2022)</summary><div class="ans">
      <b>Claim:</b> replace expensive human feedback with AI feedback guided by written principles.<br>
      <b>Insight:</b> a model can critique + revise its own outputs against a constitution → scalable alignment.<br>
      <b>Why matters:</b> Anthropic's foundational alignment paper. Behind Claude's safety training.<br>
      <b>Memorize:</b> RLAIF vs RLHF, red-teaming + revision loop, role of the constitution.
    </div></details>
    <details class="try"><summary>9. LoRA (Hu 2021)</summary><div class="ans">
      <b>Claim:</b> fine-tune low-rank update B·A instead of full weights. ~100× fewer trainable params, same quality.<br>
      <b>Insight:</b> fine-tuning's "true rank" is low — most weight changes lie in a small subspace.<br>
      <b>Why matters:</b> made fine-tuning 7B+ models feasible on consumer GPU.<br>
      <b>Memorize:</b> W' = W + (α/r)·B·A, the α/r scaling factor.
    </div></details>
    <details class="try"><summary>10. QLoRA (Dettmers 2023)</summary><div class="ans">
      <b>Claim:</b> 4-bit (NF4) quantize base + LoRA adapters in fp16 → fine-tune 65B on a single 48GB GPU.<br>
      <b>Insight:</b> aggressive base-weight quantization + paged optimizers without quality loss.<br>
      <b>Why matters:</b> democratized large-model fine-tuning.<br>
      <b>Memorize:</b> NF4 quantization, double quantization, paged optimizers.
    </div></details>
    <details class="try"><summary>11. DPO (Rafailov 2023)</summary><div class="ans">
      <b>Claim:</b> skip the reward model — derive a closed-form loss directly from preference pairs that achieves PPO-equivalent results.<br>
      <b>Insight:</b> the policy IS its own implicit reward model. Math reformulation eliminates training instability.<br>
      <b>Why matters:</b> replaced PPO as preference-tuning default. Simpler, more stable, no RM to maintain.<br>
      <b>Memorize:</b> L_DPO = -log σ(β·[logπ/π_ref ratios for chosen vs rejected]).
    </div></details>
    <details class="try"><summary>12. RAG (Lewis 2020)</summary><div class="ans">
      <b>Claim:</b> retrieve-then-generate beats parametric memorization for knowledge-intensive tasks.<br>
      <b>Insight:</b> learnable retriever (DPR) + frozen generator (BART) end-to-end.<br>
      <b>Why matters:</b> the founding RAG paper. Modern systems are descendants.<br>
      <b>Memorize:</b> bi-encoder retrieval, augmented generation, knowledge non-staleness.
    </div></details>
    <details class="try"><summary>13. FlashAttention (Dao 2022)</summary><div class="ans">
      <b>Claim:</b> IO-aware attention algorithm — exact same math, much less HBM traffic. 2-4× faster, lower memory.<br>
      <b>Insight:</b> attention is memory-bandwidth bound, not compute bound. Block computation in SRAM saves wasted HBM reads.<br>
      <b>Why matters:</b> standard for modern training/inference. Read if you care about systems perf.<br>
      <b>Memorize:</b> tiling strategy, softmax recomputation in backward, why memory matters more than FLOPs.
    </div></details>
    <details class="try"><summary>14. Mixtral 8x7B (Jiang 2024)</summary><div class="ans">
      <b>Claim:</b> sparse Mixture of Experts — 47B total params but only 13B active per token. Matches Llama-2 70B at 1/4 the cost.<br>
      <b>Insight:</b> route each token to top-2 of 8 expert FFNs. Train router + experts jointly.<br>
      <b>Why matters:</b> MoE became standard for frontier models (GPT-4 rumored, Mixtral, DeepSeek).<br>
      <b>Memorize:</b> sparse activation, router network, load-balancing loss.
    </div></details>
    <details class="try"><summary>15. Anthropic Claude model cards (3 / 3.5 / 4 series)</summary><div class="ans">
      <b>Read:</b> anthropic.com → research → model cards.<br>
      <b>Why matters:</b> shows what an industry-leading lab discloses about capabilities, evals, safety testing, refusal training.<br>
      <b>Memorize:</b> the eval categories Anthropic reports (MMLU, GPQA, HumanEval, HellaSwag, agentic benchmarks).
    </div></details>
    <div class="callout"><b>Reading rhythm:</b> one paper per week. Read summary → read paper → write 1-paragraph notes in your repo's <code>papers/</code> folder → quiz yourself a week later. After 15 papers you can talk credibly with any AI engineer.</div>`},
    {h:"Portfolio shape", body:`<ul>
      <li><b>GitHub</b>: clean repos per phase, READMEs with results + screenshots</li>
      <li><b>HF Hub</b>: your fine-tuned models with model cards</li>
      <li><b>Personal blog</b>: 1 post per phase</li>
      <li><b>X / LinkedIn</b>: post every project</li>
      <li><b>OSS</b>: 1-2 PRs into transformers/vllm/trl/axolotl</li>
    </ul>`},
    {h:"🚀 15 portfolio project ideas (scoped, shippable, hireable)", body:`<p>"I don't know what to build" is the #1 portfolio killer. Below are 15 projects scoped from 1-day to 1-month, each with success criteria.</p>
    <h4>Beginner (1-3 days each — Phase 2-4)</h4>
    <details class="try"><summary>1. Titanic Kaggle submission (top 30%)</summary><div class="ans">
      <b>Scope:</b> classic intro Kaggle competition. Feature engineering + sklearn pipeline.<br>
      <b>Success:</b> public submission ranks top 30%, notebook in repo with EDA + 5 model comparison.<br>
      <b>Time:</b> 1-2 days.
    </div></details>
    <details class="try"><summary>2. House Prices Kaggle (top 30%)</summary><div class="ans">
      <b>Scope:</b> regression with mixed features. XGBoost + careful imputation.<br>
      <b>Success:</b> RMSE log &lt; 0.13 on leaderboard.<br>
      <b>Time:</b> 2-3 days.
    </div></details>
    <details class="try"><summary>3. Micrograd reimplemented</summary><div class="ans">
      <b>Scope:</b> autograd engine in pure Python (~200 lines), MLP trains on toy data.<br>
      <b>Success:</b> matches PyTorch gradient for a 3-layer network.<br>
      <b>Time:</b> 2 days (follow Karpathy).
    </div></details>
    <h4>Intermediate (1 week each — Phase 5-8)</h4>
    <details class="try"><summary>4. BPE tokenizer from scratch</summary><div class="ans">
      <b>Scope:</b> follow Karpathy minbpe. Train + encode + decode roundtrip.<br>
      <b>Success:</b> encode-decode is lossless on random text; ablation: vocab size vs compression ratio.<br>
      <b>Time:</b> 3-4 days.
    </div></details>
    <details class="try"><summary>5. nanoGPT reimplementation</summary><div class="ans">
      <b>Scope:</b> rebuild GPT from scratch, train on Tiny Shakespeare, generate coherent text.<br>
      <b>Success:</b> val loss matches Karpathy's number; samples are recognizably Shakespearean.<br>
      <b>Time:</b> 1 week.
    </div></details>
    <details class="try"><summary>6. Mini-GPT pretrain on a niche corpus</summary><div class="ans">
      <b>Scope:</b> 30M-param GPT trained on a corpus you choose (legal docs, your tweets, recipe data). Use Colab/Kaggle free GPU.<br>
      <b>Success:</b> blog post comparing generation quality on niche vs general prompts.<br>
      <b>Time:</b> 1 week.
    </div></details>
    <details class="try"><summary>7. LoRA fine-tune for a custom task</summary><div class="ans">
      <b>Scope:</b> fine-tune Qwen2.5-0.5B or Llama-3.2-1B on a domain (medical Q&A, customer support, your writing style).<br>
      <b>Success:</b> model on HF Hub with model card showing before/after eval results. Side-by-side examples.<br>
      <b>Time:</b> 1 week.
    </div></details>
    <details class="try"><summary>8. DPO preference tuning</summary><div class="ans">
      <b>Scope:</b> SFT model → collect (chosen, rejected) preferences → DPO.<br>
      <b>Success:</b> demonstrate win rate vs SFT model judged by Claude on 50 samples.<br>
      <b>Time:</b> 1 week.
    </div></details>
    <h4>Advanced (2-4 weeks each — Phase 9-12)</h4>
    <details class="try"><summary>9. Personal knowledge RAG chatbot</summary><div class="ans">
      <b>Scope:</b> ingest your notes/PDFs, RAG with Claude, Qdrant + Voyage embeddings. Hybrid search + reranker + Anthropic contextual retrieval.<br>
      <b>Success:</b> deployed (Modal/Fly), recall@5 measured on 30 golden questions, you actually use it daily.<br>
      <b>Time:</b> 2 weeks.
    </div></details>
    <details class="try"><summary>10. Code review agent</summary><div class="ans">
      <b>Scope:</b> agent that clones a repo, reads PR diff, posts review comments via GitHub API.<br>
      <b>Success:</b> works on a real PR you opened; observability dashboard tracks token cost per review.<br>
      <b>Time:</b> 2 weeks.
    </div></details>
    <details class="try"><summary>11. Research agent (Anthropic-style)</summary><div class="ans">
      <b>Scope:</b> input topic → searches web → reads pages → writes sourced report.<br>
      <b>Success:</b> compares 3 search strategies (single-shot, multi-step, hierarchical) with eval rubric for source quality + factual accuracy.<br>
      <b>Time:</b> 2-3 weeks.
    </div></details>
    <details class="try"><summary>12. LLM evaluation harness</summary><div class="ans">
      <b>Scope:</b> golden set + LLM-judge + dashboard. Test 3 prompt variants × 3 models on 50 examples.<br>
      <b>Success:</b> reproducible CI-gated evals, results dashboard published, blog post on findings.<br>
      <b>Time:</b> 2 weeks. <b>This is the project that wins QA-background AI eng interviews.</b>
    </div></details>
    <details class="try"><summary>13. vLLM self-hosted LLM API</summary><div class="ans">
      <b>Scope:</b> vLLM serving open Llama, FastAPI wrapper with auth + rate limits + Grafana metrics, deployed on RunPod.<br>
      <b>Success:</b> load test results (req/s, p50/p99 latency), public live URL, cost-per-1k-requests calculated.<br>
      <b>Time:</b> 2-3 weeks.
    </div></details>
    <details class="try"><summary>14. Red-team report on a popular AI app</summary><div class="ans">
      <b>Scope:</b> systematic prompt injection / jailbreak study on a public AI app. Document findings ethically.<br>
      <b>Success:</b> blog post (with permission from vendor) demonstrating defenses + bypasses. Stand out for safety-aware hiring.<br>
      <b>Time:</b> 1-2 weeks.
    </div></details>
    <details class="try"><summary>15. Mechanistic interp replication</summary><div class="ans">
      <b>Scope:</b> reproduce one finding from an interpretability paper using TransformerLens or SAELens (e.g., find an "induction head" in GPT-2).<br>
      <b>Success:</b> notebook + blog post with visualizations. This opens doors at Anthropic/DeepMind/research labs.<br>
      <b>Time:</b> 3-4 weeks.
    </div></details>
    <h4>How to pick</h4>
    <ol>
      <li>Pick ONE from the level you're at. Don't start 3.</li>
      <li>Scope down ruthlessly — ship a working v1, then iterate.</li>
      <li>Write the README first. Defines what "done" means.</li>
      <li>Ship publicly Day-1 with placeholders, even if broken. Real deadline = real focus.</li>
      <li>1 blog post per project. Even bad writing beats no writing.</li>
    </ol>`},
    {h:"People to follow", body:`<ul>
      <li>Andrej Karpathy</li>
      <li>Sebastian Raschka</li>
      <li>Lilian Weng</li>
      <li>Chip Huyen</li>
      <li>Anthropic Research / Interpretability</li>
      <li>Hamel Husain</li>
      <li>Eugene Yan</li>
      <li>Simon Willison</li>
    </ul>`},
    {h:"Job hunt", body:`<ol>
      <li>Resume — projects + metrics first</li>
      <li>LinkedIn 'AI Engineer' + project links</li>
      <li>Cold apply 5/day to AI startups (faster signal)</li>
      <li>'Ship board' page: every project + 30s demo</li>
      <li>Mock interviews with Claude — paste JD, get grilled</li>
    </ol>`},
  ],
  quiz:[
    {type:"mcq", q:"Most leveraged artifact for AI eng job?", options:["Resume","Live deployed project, public source, 60s demo","Coursera cert","Skills list"], answer:1, explain:"Hiring managers click links. Working app + repo gets screens. Certs = noise."},
    {type:"short", q:"Write 1-line resume bullet for one course project.", model:"Example: 'Reproduced GPT-2 124M from scratch in PyTorch (≈$10 compute, FineWeb-Edu subset), open-sourced on HF Hub, achieved 33% HellaSwag — github.com/user/repo'. Bullets: (1) what built, (2) measurable result, (3) link. Strong verb, no 'worked on'.", rubric:["concrete","measurable","link","strong verb"]},
  ],
  project:{title:"Phase 13 deliverable", steps:["Read 5 papers with notes","Blog with 1 post per completed phase","HF profile populated","1 OSS PR merged"]}
}
));
