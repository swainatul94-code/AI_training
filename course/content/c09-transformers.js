// c09-transformers — course content. Must load before course/engine.js.
window.COURSE_PHASES = window.COURSE_PHASES || [];
COURSE_PHASES.push(Object.assign({ order: 9 },
{ id:7, title:"Phase 6 — Transformers From Scratch", est:"40-60 hrs",
  intro:"Heart of course. Don't move past until you can rebuild nanoGPT blindfolded. We'll walk a 3-token toy example by hand before jumping into code.",
  lessons:[
    {h:"The problem attention solves", body:`<p><b>Problem:</b> in a sentence "<i>The cat that lived next door sat on the mat</i>", what does "sat" refer to? Answer: <b>cat</b>. But "cat" is 6 words back. How can the model carry that information forward?</p>
    <p><b>Old answer (RNN/LSTM):</b> pass a "hidden state" forward token by token, hoping it remembers. Doesn't scale — forgets long-range info.</p>
    <p><b>New answer (Transformer attention):</b> for each token, look at EVERY other token directly and decide how much to "attend to" each. No sequential bottleneck. All tokens processed in parallel.</p>
    <p><b>Big idea:</b> a token's representation = weighted sum of other tokens' representations, where weights are learned per-context.</p>`},
    {h:"Q, K, V — three lenses on each token", body:`<p>For each token's embedding vector x, we compute three projections via learned linear layers:</p>
    <ul>
      <li><b>Q (query)</b> = x · W_Q — "what am I looking for?"</li>
      <li><b>K (key)</b> = x · W_K — "what do I contain?"</li>
      <li><b>V (value)</b> = x · W_V — "what do I deliver if attended to?"</li>
    </ul>
    <p><b>Library analogy:</b> imagine searching a library.</p>
    <ul>
      <li>Your <b>question</b> is a query Q</li>
      <li>Each book has a <b>title/tags</b> = its key K</li>
      <li>The actual <b>content</b> of the book = its value V</li>
      <li>You compare your Q to each K, find best matches, fetch their V</li>
    </ul>
    <p><b>Why three?</b> Tokens advertise themselves (K) differently from what they actually mean (V). And the question (Q) is different from both. Separating them gives the model flexibility.</p>`},
    {h:"Self-attention walkthrough by hand (3 tokens, d=2)", body:`<details class="try"><summary>🎯 Try first: token A scores [2, 5, 1] against [K_A, K_B, K_C]. After softmax (no scaling), which token gets most attention?</summary><div class="ans">Answer: <b>token B</b>. Softmax preserves order: highest score → highest weight. Weights ≈ [0.05, 0.93, 0.02].</div></details>
    <div class="mistake"><b>Common mistake:</b> forgetting to divide scores by √d_k. Without scaling, large d_k makes softmax saturate → vanishing gradients on losing positions.</div>
    <p>Let's compute attention for 3 tokens with embedding dim d=2. Real models use d=64+ per head, but the math is identical.</p>
    <pre><code>tokens: ["The", "cat", "sat"]

# After Q, K, V projections (skip the W matrices for clarity):
Q = [[1, 0],     # "The" looks for ...
     [0, 1],     # "cat" looks for ...
     [1, 1]]     # "sat" looks for ...

K = [[1, 0],     # "The" contains
     [0, 1],     # "cat" contains
     [1, 1]]     # "sat" contains  (same as Q here for simplicity)

V = [[1, 2],     # "The"'s value
     [3, 4],     # "cat"'s value
     [5, 6]]     # "sat"'s value

# STEP 1: compute QK^T (similarity scores between every Q and every K)
QK^T = Q @ K.T

For "sat" (Q row [1,1]):
  vs K_The [1,0]:  1*1 + 1*0 = 1
  vs K_cat [0,1]:  1*0 + 1*1 = 1
  vs K_sat [1,1]:  1*1 + 1*1 = 2

So scores for "sat" attending to others: [1, 1, 2]

# STEP 2: scale by sqrt(d_k) = sqrt(2) ≈ 1.41
scaled = [1/1.41, 1/1.41, 2/1.41] ≈ [0.71, 0.71, 1.41]

# STEP 3: apply causal mask (decoder LLM — "sat" can't see future)
"sat" is position 2, can see 0,1,2 → no change here
For "cat" (position 1): mask out position 2
For "The" (position 0): mask out positions 1, 2 (set to -inf)

# STEP 4: softmax (converts scores → weights summing to 1)
softmax([0.71, 0.71, 1.41])
≈ [exp(0.71), exp(0.71), exp(1.41)] / sum
≈ [2.03, 2.03, 4.10] / 8.16
≈ [0.25, 0.25, 0.50]

# STEP 5: weighted sum of V vectors
output_for_"sat" = 0.25 * V[0] + 0.25 * V[1] + 0.50 * V[2]
                 = 0.25 * [1,2] + 0.25 * [3,4] + 0.50 * [5,6]
                 = [0.25, 0.5] + [0.75, 1] + [2.5, 3]
                 = [3.5, 4.5]</code></pre>
    <p>That's it. Attention's full operation, by hand. Repeat for "The" and "cat" using their Qs. Stack into output matrix. Done.</p>
    <p><b>Open the "Attention Toy" game</b> in the Games tab to play with this interactively.</p>`},
    {h:"The formula and what each piece does", body:`<span class="formula">Attention(Q, K, V) = softmax(Q Kᵀ / √d_k) · V</span>
    <div data-widget="softmax-viz"></div>
    <ul>
      <li><b>Q Kᵀ</b>: similarity matrix, shape (seq × seq). Entry [i,j] = how much Q_i wants K_j.</li>
      <li><b>/√d_k</b>: <b>scaling</b>. Without this, dot products grow with d_k. Large values → softmax becomes nearly one-hot → tiny gradients on losing positions → vanishing gradient. Dividing by √d_k keeps variance bounded.</li>
      <li><b>softmax</b>: turns scores into a probability distribution (each row sums to 1).</li>
      <li><b>· V</b>: weighted sum of values.</li>
    </ul>
    <p><b>Causal mask (decoder-only LLMs like GPT):</b> set scores for future positions to <code>-inf</code> before softmax. After softmax they become 0 → no leakage of future info. This is what lets GPT learn to predict next token.</p>`},
    {h:"Self-attention", body:`<p>The above is <b>self-attention</b>: Q, K, V all come from the same sequence. Tokens attend to other tokens in their own context.</p>
    <p>(Encoder-decoder models like T5 also use cross-attention where Q comes from decoder, K and V from encoder. We focus on decoder-only.)</p>`},
    {h:"Multi-head attention — every line explained", body:`<p><b>What it does:</b> runs <code>h</code> attention operations in parallel with different learned projections, then concatenates. Lets the model attend to different relationships simultaneously (one head for syntax, one for coreference, etc.).</p>
    <p><b>Why one combined QKV projection (not three):</b> efficiency. One matmul of size <code>(d_model, 3*d_model)</code> beats three matmuls. Split into Q/K/V via reshape afterward.</p>
    <p><b>Shape tracking through the forward pass (the hard part):</b></p>
    <pre><code>x:              (B, T, C)         # batch, tokens, channels
qkv (after lin) (B, T, 3*C)       # concat of Q,K,V
.reshape:       (B, T, 3, h, d_h) # split into 3 heads and per-head dim
unbind dim=2:   3× (B, T, h, d_h)
transpose 1↔2:  (B, h, T, d_h)    # heads become a batch dimension
Q @ K^T:        (B, h, T, T)      # similarity matrix per head
softmax dim=-1: (B, h, T, T)      # row-wise probabilities
@ V:            (B, h, T, d_h)
transpose:      (B, T, h, d_h)
reshape:        (B, T, C)         # concat heads back
proj:           (B, T, C)         # final mixing</code></pre>`, code:`class MHA(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        # d_model must split evenly across heads (e.g., 768 / 12 = 64)
        assert d_model % n_heads == 0
        self.d_h = d_model // n_heads          # per-head dimension
        self.h = n_heads

        # ONE big linear that outputs Q, K, V concatenated.
        # bias=False is a common LLM choice (Llama, GPT-NeoX) — slight quality win.
        self.qkv = nn.Linear(d_model, 3 * d_model, bias=False)

        # output projection: mixes information back across heads after attention
        self.proj = nn.Linear(d_model, d_model)

    def forward(self, x, mask=None):
        B, T, C = x.shape                      # batch, time (tokens), channels

        # project to Q, K, V in one shot
        qkv = self.qkv(x).reshape(B, T, 3, self.h, self.d_h)
        q, k, v = qkv.unbind(dim=2)            # each is (B, T, h, d_h)

        # bring heads next to batch so we can matmul per-head in parallel
        q, k, v = [t.transpose(1, 2) for t in (q, k, v)]   # (B, h, T, d_h)

        # SCALED DOT-PRODUCT attention
        # q @ k^T → (B, h, T, T) similarity matrix
        # divide by sqrt(d_h): stabilizes softmax (Var(q·k) grows with d_h)
        att = (q @ k.transpose(-2, -1)) / (self.d_h ** 0.5)

        # Causal mask: 1s below/on diagonal, 0s above. Set 0s to -inf
        # so softmax assigns them probability 0 → token can't see future.
        if mask is not None:
            att = att.masked_fill(mask == 0, float('-inf'))

        att = F.softmax(att, dim=-1)           # row-wise: each query distributes attention

        # weighted sum of values, then concat heads back into channel dim
        out = (att @ v).transpose(1, 2).reshape(B, T, C)

        return self.proj(out)                  # mix across heads → output of attention sublayer`},
    {h:"Causal mask + positional encoding", body:`<ul>
      <li><b>Causal mask</b>: lower-tri, -inf future positions before softmax. Decoder-only LLMs.</li>
      <li><b>Sinusoidal</b> (orig): fixed sin/cos different freqs</li>
      <li><b>Learned</b> (GPT-2): nn.Embedding(max_seq, d_model)</li>
      <li><b>RoPE</b>: rotate Q,K by position angle. Llama, modern LLMs. Extrapolates better.</li>
      <li><b>ALiBi</b>: position-dependent bias added to scores</li>
    </ul>`},
    {h:"Full block + GPT", code:`class Block(nn.Module):\n    def __init__(self, d, h):\n        super().__init__()\n        self.ln1 = nn.LayerNorm(d); self.attn = MHA(d, h)\n        self.ln2 = nn.LayerNorm(d)\n        self.ffn = nn.Sequential(nn.Linear(d, 4*d), nn.GELU(), nn.Linear(4*d, d))\n    def forward(self, x, mask):\n        x = x + self.attn(self.ln1(x), mask)\n        x = x + self.ffn(self.ln2(x))\n        return x\n\nclass GPT(nn.Module):\n    def __init__(self, vocab, d=384, h=6, n=6, max_seq=256):\n        super().__init__()\n        self.tok = nn.Embedding(vocab, d)\n        self.pos = nn.Embedding(max_seq, d)\n        self.blocks = nn.ModuleList([Block(d, h) for _ in range(n)])\n        self.ln_f = nn.LayerNorm(d)\n        self.head = nn.Linear(d, vocab, bias=False)\n        self.register_buffer("mask", torch.tril(torch.ones(max_seq, max_seq)))\n    def forward(self, ids, targets=None):\n        B, T = ids.shape\n        x = self.tok(ids) + self.pos(torch.arange(T, device=ids.device))\n        for blk in self.blocks: x = blk(x, self.mask[:T,:T])\n        logits = self.head(self.ln_f(x))\n        loss = None\n        if targets is not None:\n            loss = F.cross_entropy(logits.reshape(-1,logits.size(-1)), targets.reshape(-1))\n        return logits, loss`},
    {h:"KV cache", body:"<p>At inference, cache K,V for prior tokens. Reduces O(T²) → O(T) per new token.</p>"},
    {h:"🧮 Interactive: Parameter count calculator", body:`<p>Plug in transformer hyperparams and see total parameter count. Per-block params ≈ 12·d² (QKV proj 3d² + output d² + FFN 8d²). Plus embedding table vocab·d.</p>
    <div class="minilab">
      <label>d_model: <input id="pc-d" type="number" value="768" min="64" step="64" oninput="paramCalc()"></label>
      <label>n_layers: <input id="pc-n" type="number" value="12" min="1" max="200" oninput="paramCalc()"></label>
      <label>vocab_size: <input id="pc-v" type="number" value="50257" min="1000" step="1000" oninput="paramCalc()"></label>
      <label>FFN expand factor: <input id="pc-f" type="number" value="4" min="1" max="16" step="1" oninput="paramCalc()"></label>
      <div class="out" id="pc-out"></div>
    </div>
    <p><b>Compare to real models:</b> GPT-2 small (d=768, n=12) ≈ 124M. GPT-2 medium (d=1024, n=24) ≈ 350M. Llama-3 8B (d=4096, n=32) ≈ 8B (uses GQA + tied embeddings, formula differs).</p>`},
    {h:"Common mistakes + interview prep", body:`<div class="mistake"><b>Common mistake #1:</b> using <code>mask = torch.ones(T,T)</code> as causal mask. ones means no mask. Need <code>torch.tril(torch.ones(T,T))</code>.</div>
    <div class="mistake"><b>Common mistake #2:</b> applying scale AFTER softmax. Wrong: <code>softmax(QK^T) / √d_k</code>. Right: <code>softmax(QK^T / √d_k)</code>.</div>
    <div class="mistake"><b>Common mistake #3:</b> forgetting <code>opt.zero_grad()</code> → gradients accumulate across steps → wrong updates.</div>
    <div class="interview"><b>Interview question:</b> "Walk through self-attention for a single token, step by step." Practice answering aloud. See the by-hand 3-token walkthrough lesson above.</div>
    <div class="interview"><b>Interview question:</b> "Why divide by √d_k?" → Var(q·k) grows with d_k. Without scaling, softmax saturates near one-hot → vanishing gradients. Dividing by √d_k keeps variance ≈ 1.</div>
    <div class="interview"><b>Interview question:</b> "Estimate GPT-2 124M parameters from architecture." Use the calculator above. d=768, n=12, vocab=50257 → ~124M (with weight tying).</div>`},
    {h:"Resources", body:`<ul>
      <li><a href="https://arxiv.org/abs/1706.03762" target="_blank">Attention Is All You Need</a> — read 3×</li>
      <li>Karpathy <a href="https://www.youtube.com/watch?v=kCc8FmEb1nY" target="_blank">Let's build GPT</a></li>
      <li><a href="https://github.com/karpathy/nanoGPT" target="_blank">nanoGPT</a></li>
      <li>Sebastian Raschka <i>Build a Large Language Model (From Scratch)</i></li>
    </ul>`},
  ],
  quiz:[
    {type:"mcq", q:"Why /√d_k?", options:["Speed","Without scale, dot products grow with d_k → softmax saturates → grad vanishes","LayerNorm req","Precision"], answer:1, explain:"Var(q·k) grows with d_k. Large values → near one-hot softmax → tiny grad on losers. Scale stabilizes."},
    {type:"mcq", q:"Causal mask?", options:["Identity","Lower-tri, -inf future before softmax","Random","Diagonal"], answer:1, explain:"Token t can only see ≤t. Lower-tri + -inf upper before softmax."},
    {type:"mcq", q:"d_model=512, n_heads=8, d_head=?", options:["512","64","8","4096"], answer:1, explain:"d_head = d_model/n_heads = 64. Each head in 64-dim subspace, concat back to 512."},
    {type:"mcq", q:"Why pre-norm (vs post-norm)?", options:["Tradition","Pre-norm = stable training at depth","FlashAttn req","Faster"], answer:1, explain:"Original used post-norm + careful warmup. Pre-norm (GPT-2+) makes deep stacks robust."},
    {type:"mcq", q:"KV cache accelerates?", options:["Training","Inference — skip recomputing K,V for seen tokens","Backprop","Tokenization"], answer:1, explain:"Training processes all positions parallel. Inference is one-token-at-a-time → cache K,V."},
    {type:"mcq", q:"RoPE advantage?", options:["Smaller model","Better extrapolation, relative position natural","Faster","No compute"], answer:1, explain:"Learned positions fail past max_seq. RoPE rotates Q,K by position angle → relative positions emerge → extrapolates."},
    {type:"short", q:"Walk one token through one block.", model:"(1) LayerNorm1. (2) Project to Q,K,V via linear. (3) Q·Kᵀ scaled by √d_h. (4) Causal mask zeros future. (5) Softmax → weights. (6) Weighted sum V. (7) Output proj. (8) Residual add to input. (9) LayerNorm2. (10) FFN expand to 4d, GELU, contract. (11) Residual add. Same shape out, contextualized.", rubric:["LN","QKV","scaled+mask+softmax","residual","FFN","residual","same shape"]},
    {type:"short", q:"Why FFN is 4× wider? GPT-2 124M arithmetic?", model:"4× expand is original hyperparameter giving capacity to project into higher-dim space, apply non-linearity, contract back. Per block: QKV proj 3d², output proj d², FFN 2·(d·4d)=8d² → ~12d² per block. d=768: ~7M/block, 12 blocks ~85M, + token embeddings vocab·d ≈ 50257·768 ≈ 38.6M + pos embeddings 1024·768 ≈ 0.8M → ~124M. GPT-2 uses weight tying (output projection shares weights with token embedding) → no extra params for unembed.", rubric:["4× expand reason","12d²/block","embedding count","weight tying"]},
  ],
  project:{title:"Phase 6 deliverable", steps:["nanoGPT from scratch on Tiny Shakespeare","Add RoPE","Add KV cache, benchmark speedup"]}
}
));
