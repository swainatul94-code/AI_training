// c10-pretrain — course content. Must load before course/engine.js.
window.COURSE_PHASES = window.COURSE_PHASES || [];
COURSE_PHASES.push(Object.assign({ order: 10 },
{ id:8, title:"Phase 7 — Pretrain Small LLM", est:"40-60 hrs",
  intro:"Reproduce GPT-2 (or smaller). This is the phase that converts you from \"reads about LLMs\" to \"trains LLMs\". Karpathy has reproduced GPT-2 124M for ~$10 of cloud compute — you can too.",
  lessons:[
    {h:"🪶 Phase 7 LITE — train a tiny GPT locally in 20 minutes (do this FIRST)", body:`<p>Before you rent a GPU, train a tiny model on your own laptop. This proves your pipeline works AND you ship something the same day.</p>
    <h4>Goal</h4>
    <ul>
      <li>~1M parameter GPT on Tiny Shakespeare (1MB text)</li>
      <li>Runs in 15-25 min on CPU, ~5 min on any consumer GPU</li>
      <li>Generates recognizably Shakespearean text by the end</li>
      <li>Zero cloud spend</li>
    </ul>
    <h4>The shortest possible setup</h4>
    <pre><code>git clone https://github.com/karpathy/nanoGPT
cd nanoGPT
pip install torch numpy transformers datasets tiktoken wandb tqdm
python data/shakespeare_char/prepare.py
python train.py config/train_shakespeare_char.py \\
  --device=cpu \\
  --compile=False \\
  --eval_iters=20 \\
  --log_interval=1 \\
  --block_size=64 \\
  --batch_size=12 \\
  --n_layer=4 \\
  --n_head=4 \\
  --n_embd=128 \\
  --max_iters=2000 \\
  --lr_decay_iters=2000 \\
  --dropout=0.0
# Use --device=cuda or --device=mps if you have GPU/Apple Silicon</code></pre>
    <h4>Generate samples</h4>
    <pre><code>python sample.py --out_dir=out-shakespeare-char --device=cpu</code></pre>
    <h4>What you'll see</h4>
    <p>Step 0: random gibberish like "JqK;rzWf:". Step 500: vaguely word-shaped. Step 2000: real-looking Old English with names, dialog tags, even rough iambic rhythm. You will laugh out loud.</p>
    <h4>Why this matters</h4>
    <ol>
      <li><b>Confidence builder.</b> You trained a real GPT. Today.</li>
      <li><b>Pipeline validated.</b> When you scale up to FineWeb on cloud GPU, you already know the loop works.</li>
      <li><b>Failure mode catalog.</b> See what NaN looks like, what under-training looks like, what convergence looks like — at zero cost.</li>
      <li><b>Eval baseline.</b> Now you have a reference loss curve to compare against bigger runs.</li>
    </ol>
    <div class="callout"><b>Hard rule:</b> do Phase 7 Lite BEFORE renting a GPU. If your local 1M model doesn't converge, your 124M cloud model definitely won't — and you'll have spent $10 finding out.</div>`},
    {h:"What pretraining actually is", body:`<p><b>Pretraining</b> = take a freshly initialized transformer (random weights), feed it billions of web tokens, and train it to predict the next token. After enough data + compute, you get a model that "knows things" — language, facts, basic reasoning.</p>
    <p><b>The objective is dumb:</b> just minimize cross-entropy on next-token prediction. No labels, no human supervision. The "intelligence" emerges from the model trying to compress patterns in the data.</p>
    <p><b>Why this works:</b> to predict next tokens well, the model has to learn grammar, world facts, math, code patterns — everything. Predicting next-word in "The capital of France is ___" requires knowing world facts.</p>
    <p><b>What you get after pretraining = a "base model".</b> Useful but not chatty. To make it follow instructions, you need Phase 8 (fine-tuning).</p>`},
    {h:"Dataset preparation", body:`<p><b>Common pretraining datasets:</b></p>
    <ul>
      <li><b>FineWeb / FineWeb-Edu</b> (HuggingFace) — filtered Common Crawl, 15T+ tokens. Modern standard. Use a slice (e.g., 10B tokens).</li>
      <li><b>The Pile</b> — 800GB diverse text. Legal grey area now.</li>
      <li><b>Tiny options for learning</b>: OpenWebText (40GB), WikiText-103 (500MB), TinyShakespeare (1MB for sanity checks).</li>
    </ul>
    <p><b>Steps to prep:</b></p>
    <ol>
      <li>Download text (HuggingFace datasets library)</li>
      <li>Tokenize with tiktoken (GPT-2 BPE) — converts text → uint16 token IDs</li>
      <li>Concatenate all tokens into one big binary file (shards if huge)</li>
      <li>At training time, memory-map the file and randomly sample sequences</li>
    </ol>
    <p><b>Why binary uint16:</b> tokens are integers 0-50256 → fits in 2 bytes. Memory-mapping = OS streams from disk efficiently → can train on data way bigger than RAM.</p>`},
    {h:"Training loop — annotated (bf16 + grad accum + clipping)", body:`<p><b>What this loop does:</b> trains an LLM at scale by combining 4 critical tricks:</p>
    <ol>
      <li><b>Mixed precision (bf16/fp16)</b> — half the memory, ~2× speed on modern GPUs</li>
      <li><b>Gradient accumulation</b> — simulate huge batch on small GPU by summing grads over micro-batches</li>
      <li><b>Gradient clipping</b> — caps gradient norm, prevents NaN explosions from outlier batches</li>
      <li><b>LR schedule</b> — warmup + cosine decay (separate function — drives stability)</li>
    </ol>
    <p><b>Why TWO variants:</b></p>
    <ul>
      <li><b>bf16</b> (Brain Float 16) has same exponent range as fp32 → no overflow → NO scaler needed. Default on A100/H100/RTX 30+.</li>
      <li><b>fp16</b> has narrower exponent range → overflow risk in attention → needs <code>GradScaler</code> to scale loss up before backward. Required on V100/T4 (older GPUs).</li>
    </ul>
    <div class="callout warn"><b>Common bug:</b> using GradScaler with bf16. It's a no-op-but-confusing pattern. Only use GradScaler with fp16.</div>
    <p><b>How to run:</b> needs a real <code>model</code>, <code>loader</code>, <code>schedule_lr</code> function and a GPU. This is the pattern Karpathy uses in <a href="https://www.youtube.com/watch?v=l8pRSuU81PU" target="_blank">"Let's reproduce GPT-2 (124M)"</a>. Phase 7 LITE shows the local-CPU version first.</p>`, code:`# ====== Variant A: bf16 (preferred on A100/H100/RTX 30+) ======
opt = torch.optim.AdamW(
    model.parameters(),
    lr=peak_lr,                                # set by your schedule_lr each step
    betas=(0.9, 0.95),                         # β2=0.95 is LLM-standard (lower than default 0.999)
    weight_decay=0.1,                          # heavier than typical 0.01 — LLM standard
)
accum = 8                                      # accumulate grads over 8 micro-batches before stepping
                                               # → effective batch = micro_batch × 8

for step in range(total_steps):
    opt.zero_grad()                            # clear stale grads BEFORE inner loop

    # micro-batch loop: accumulate gradients without stepping
    for _ in range(accum):
        xb, yb = next(loader)                  # one micro-batch from your data iterator

        # bf16 autocast: forward + loss compute in bf16, backward grads in fp32
        with torch.amp.autocast("cuda", dtype=torch.bfloat16):
            logits, loss = model(xb, yb)       # model returns both for convenience
            loss = loss / accum                # divide so total accumulated grad = mean

        loss.backward()                        # autograd. Grads ACCUMULATE in .grad of each param.

    # gradient clipping: cap global norm to 1.0 → prevents single-batch NaN spikes
    torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)

    opt.step()                                 # apply update using accumulated grads

    schedule_lr(opt, step)                     # warmup + cosine decay (your custom fn)


# ====== Variant B: fp16 (older GPUs, V100/T4). Needs GradScaler. ======
# GradScaler multiplies loss by a large factor BEFORE backward so small fp16
# gradients don't underflow to zero. Then unscales before step.

scaler = torch.amp.GradScaler("cuda")          # auto-tunes scale factor over training

for step in range(total_steps):
    opt.zero_grad()
    for _ in range(accum):
        xb, yb = next(loader)
        with torch.amp.autocast("cuda", dtype=torch.float16):
            logits, loss = model(xb, yb)
            loss = loss / accum

        scaler.scale(loss).backward()          # backward on SCALED loss → grads also scaled up

    scaler.unscale_(opt)                       # divide grads by the scale factor BEFORE clipping
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)

    scaler.step(opt)                           # if no inf/NaN grads, applies update; else skips
    scaler.update()                            # adapt scale factor for next iteration`},
    {h:"⚠️ Misconceptions to kill before reading further", body:`<div class="trap">
      <div class="wrong">❌ WRONG: "Bigger model = always better."</div>
      <div class="right">✅ RIGHT: At fixed compute, model size and data should grow TOGETHER. A 70B model trained on 100B tokens is worse than a 7B model trained on 1.4T tokens. See Chinchilla, next lesson.</div>
    </div>
    <div class="trap">
      <div class="wrong">❌ WRONG: "Pretraining teaches the model facts."</div>
      <div class="right">✅ RIGHT: It teaches the model statistical patterns of language. Facts are a byproduct. The model has no concept of truth or sources.</div>
      <div class="why">Implication: a pretrained model that says "the Eiffel Tower is in Berlin" isn't "lying" — it confabulated from patterns. Use RAG to inject real facts; use evals to detect hallucination.</div>
    </div>
    <div class="trap">
      <div class="wrong">❌ WRONG: "Low training loss = good model."</div>
      <div class="right">✅ RIGHT: Low train loss + high val loss = memorized garbage. Always watch BOTH. Divergence is the most common silent training failure.</div>
    </div>`},
    {h:"🎨 Interactive: warmup + cosine LR schedule", body:`<div data-widget="lr-viz"></div>`},
    {h:"Scaling laws — how much data does a model need?", body:`<p><b>Compute cost</b> for transformer training: <code>C ≈ 6 · N · D</code> FLOPS, where N = parameters and D = training tokens. (6 = ~2 fwd + ~4 bwd per param per token.)</p>
    <p><b>The big question:</b> if you have a fixed compute budget, should you train a bigger model on less data, or a smaller model on more data?</p>
    <p><b>Chinchilla answer (DeepMind 2022):</b> for compute-optimal, scale N and D proportionally. About <b>20 tokens per parameter</b>.</p>
    <table>
      <tr><th>Model</th><th>Params</th><th>Training tokens</th><th>Tokens/param</th><th>Verdict</th></tr>
      <tr><td>GPT-3</td><td>175B</td><td>300B</td><td>~1.7</td><td>Massively undertrained</td></tr>
      <tr><td>Chinchilla</td><td>70B</td><td>1.4T</td><td>20</td><td>Compute-optimal (the paper's recommendation)</td></tr>
      <tr><td>Llama-2 70B</td><td>70B</td><td>2T</td><td>~29</td><td>Slightly past optimal</td></tr>
      <tr><td>Llama-3 8B</td><td>8B</td><td>15T</td><td>~1875</td><td>Way past Chinchilla on purpose</td></tr>
    </table>
    <p><b>Why modern LLMs train way past Chinchilla:</b> Chinchilla optimizes for cheapest training. But you train once and serve forever — a smaller, more-trained model is cheaper to run. So companies overshoot data on small models.</p>
    <p><b>For your own training:</b> shoot for 20+ tokens/param. Below that = waste of compute.</p>`},
    {h:"Eval", body:`<ul>
      <li>Perplexity on held-out val</li>
      <li>HellaSwag, MMLU, GSM8K</li>
      <li><a href="https://github.com/EleutherAI/lm-evaluation-harness" target="_blank">lm-eval-harness</a></li>
    </ul>`},
    {h:"Compute options + exact rental recipe (step-by-step)", body:`<table>
      <tr><th>Provider</th><th>Cost</th><th>Use for</th></tr>
      <tr><td>Kaggle (free P100/T4 30hr/wk)</td><td>$0</td><td>Sanity runs, tiny &lt;30M models</td></tr>
      <tr><td>Colab Pro</td><td>$10/mo</td><td>T4/A100 occasional, 24 hr sessions</td></tr>
      <tr><td>RunPod community A100 spot</td><td>~$0.79-1.50/hr</td><td>GPT-2 124M reproduction sweet spot</td></tr>
      <tr><td>RunPod H100</td><td>~$2-3/hr</td><td>Faster GPT-2 runs, larger models</td></tr>
      <tr><td>Vast.ai (auction)</td><td>~$0.50-2/hr</td><td>Cheapest if you tolerate reliability variance</td></tr>
      <tr><td>Modal serverless</td><td>~$3/hr H100</td><td>One-command Python deploy, no SSH</td></tr>
      <tr><td>Lambda Labs reserved</td><td>~$3-5/hr H100</td><td>Stable, professional</td></tr>
    </table>
    <h4>Exact recipe — rent A100, reproduce GPT-2 124M for ~$10</h4>
    <ol>
      <li>Sign up at <a href="https://runpod.io" target="_blank">runpod.io</a>, add $20 credit</li>
      <li>Browse → Community Cloud → filter A100 PCIe, $1/hr region</li>
      <li>Template: "RunPod PyTorch 2.4" (Ubuntu + CUDA + PyTorch preinstalled)</li>
      <li>Disk: 50GB persistent volume (data + checkpoints)</li>
      <li>Deploy → wait ~30s → click "Connect" → "Start Jupyter"</li>
      <li>In Jupyter terminal, clone your code:
        <pre><code>git clone https://github.com/USER/AI_training.git
cd AI_training/llm_pretrain
pip install -r requirements.txt</code></pre>
      </li>
      <li>Verify GPU: <code>nvidia-smi</code> → should show A100 80GB</li>
      <li>Download FineWeb-Edu sample (~2GB): <code>python prepare_data.py</code></li>
      <li>Launch training: <code>python train.py</code> → expect 8-12 hrs for 1 epoch</li>
      <li>Track on Weights & Biases (free tier): <code>wandb login</code> then add <code>wandb.init(project="gpt2-repro")</code> to script</li>
      <li><b>STOP the pod when done.</b> Hourly billing keeps charging if you leave it on.</li>
    </ol>
    <h4>Cost-saving tips</h4>
    <ul>
      <li>Use spot/community instances — 50-70% cheaper than on-demand</li>
      <li>Use bf16 + torch.compile + Flash Attention → ~3× speedup → ~3× cheaper</li>
      <li>Profile first: run 100 steps, extrapolate. Don't book 24 hours and find out at hour 23 it's broken.</li>
      <li>Persist checkpoints to volume; if pod dies you can resume</li>
      <li>Karpathy reproduced GPT-2 124M for ~$10 with these optimizations</li>
    </ul>
    <h4>Troubleshooting common training failures</h4>
    <table>
      <tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr>
      <tr><td>Loss = NaN by step 100</td><td>LR too high or fp16 overflow</td><td>Lower LR 10×, use bf16 not fp16, check grad norm</td></tr>
      <tr><td>OOM (CUDA out of memory)</td><td>Batch too big, no grad accum</td><td>Reduce batch, increase grad_accum_steps, enable gradient checkpointing</td></tr>
      <tr><td>Loss plateaus at ~10.8 forever</td><td>Bad data pipeline → random tokens</td><td>Decode a batch with tokenizer; if garbage, fix loader</td></tr>
      <tr><td>Train loss drops, val explodes</td><td>Overfit on tiny dataset</td><td>More data, more regularization</td></tr>
      <tr><td>GPU at 30% utilization</td><td>I/O bound, slow data loading</td><td>Increase num_workers, pre-tokenize to bin files, use memory mapping</td></tr>
    </table>`},
  ],
  quiz:[
    {type:"mcq", q:"bf16 vs fp16 for LLM training?", options:["bf16 faster","bf16 same exp range as fp32 → no overflow in attention; fp16 narrower range overflows","fp16 broken on GPU","Same"], answer:1, explain:"fp16: 5 exp bits, max ~65k. bf16: 8 exp bits like fp32 → safe range. Standard for A100/H100."},
    {type:"mcq", q:"Chinchilla tokens-per-param?", options:["~1","~20","~200","~2000"], answer:1, explain:"~20. GPT-3 (~2) was undertrained."},
    {type:"mcq", q:"Why grad clip?", options:["Faster inf","Caps spike-batch updates → prevents divergence","Reduce mem","Speed backprop"], answer:1, explain:"Long runs see outlier batches. Clip global norm to e.g. 1.0."},
    {type:"mcq", q:"Compute formula?", options:["N+D","N·D","6·N·D","N²"], answer:2, explain:"6 FLOPs/param/token (2 fwd, 4 bwd) × D tokens."},
    {type:"short", q:"Loss plateaus high. Check what first?", model:"(1) LR too high (NaN) or low (flat). Try 1e-5, 1e-4, 3e-4, 1e-3. (2) Data pipeline — print decoded batch. (3) Target shift bug — input[:-1] vs target[1:]. (4) Init — GPT-2 std 0.02, output proj scaled. (5) Use bf16 not fp16. (6) Sanity: tiny model overfits tiny data to ~0?", rubric:["LR","data pipeline","target shift","tiny overfit"]},
  ],
  project:{title:"Phase 7 deliverable", steps:["10M-124M GPT-2 reproduction on FineWeb","Loss curves on W&B","HF Hub model card","HellaSwag eval"]}
}
));
