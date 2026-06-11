// c08-nlp — course content. Must load before course/engine.js.
window.COURSE_PHASES = window.COURSE_PHASES || [];
COURSE_PHASES.push(Object.assign({ order: 8 },
{ id:6, title:"Phase 5 — NLP Fundamentals", est:"12-18 hrs",
  intro:"Tokens, embeddings, why RNNs died. Brief but critical — these concepts underpin every LLM.",
  lessons:[
    {h:"The fundamental problem: text → numbers", body:`<p>Neural networks only handle numbers. Text is symbols. How do we bridge that gap?</p>
    <p><b>Two-step pipeline every LLM uses:</b></p>
    <ol>
      <li><b>Tokenize</b>: split text into pieces ("tokens"), assign each piece an integer ID</li>
      <li><b>Embed</b>: look up each ID in a table of learned vectors</li>
    </ol>
    <p>The output is a sequence of vectors. Now the transformer can do math on it.</p>
    <p><b>Why this matters:</b> the choice of tokenizer affects EVERYTHING downstream — vocab size, sequence length, cost, multilingual quality, even how well the model does arithmetic. It's not a throwaway preprocessing step.</p>`},
    {h:"Tokenization strategies", body:`<table>
      <tr><th>Strategy</th><th>How it works</th><th>Vocab size</th><th>Problems</th></tr>
      <tr><td>Character-level</td><td>Each char = one token</td><td>~100</td><td>Sequences become very long. Model can't learn word-level patterns easily.</td></tr>
      <tr><td>Word-level</td><td>Each whitespace-split word = one token</td><td>~1M</td><td>Out-of-vocabulary (OOV) words break. Bad for compound words, new slang.</td></tr>
      <tr><td>Subword (BPE)</td><td>Learn frequent byte/char pairs, merge into tokens</td><td>~30k-200k</td><td>Sweet spot. Used by GPT-2/3/4, Llama.</td></tr>
      <tr><td>WordPiece</td><td>BPE variant, slightly different merge criterion</td><td>~30k</td><td>Used by BERT, original Google models.</td></tr>
      <tr><td>SentencePiece</td><td>Language-agnostic BPE on raw bytes, treats whitespace as character</td><td>~32k-256k</td><td>Multilingual standard. Used by Llama, T5.</td></tr>
    </table>
    <div class="callout"><b>Why subword wins:</b> common words like "the" are single tokens (cheap). Rare words like "antidisestablishmentarianism" decompose into pieces ("anti", "dis", "establish", "ment", "arian", "ism") — model never sees OOV. Best of both worlds.</div>`},
    {h:"BPE algorithm", body:`<ol>
      <li>Vocab = all bytes (256)</li>
      <li>Count adjacent pairs</li>
      <li>Merge most frequent → new token</li>
      <li>Repeat to target vocab size</li>
    </ol>`, code:`def get_stats(ids):\n    counts = {}\n    for a,b in zip(ids, ids[1:]):\n        counts[(a,b)] = counts.get((a,b), 0) + 1\n    return counts\n\ndef merge(ids, pair, new_id):\n    out, i = [], 0\n    while i < len(ids):\n        if i < len(ids)-1 and ids[i]==pair[0] and ids[i+1]==pair[1]:\n            out.append(new_id); i += 2\n        else:\n            out.append(ids[i]); i += 1\n    return out\n\ntext = "the cat sat on the mat"\nids = list(text.encode("utf-8"))\nfor new_id in range(256, 270):\n    stats = get_stats(ids)\n    if not stats: break\n    pair = max(stats, key=stats.get)\n    ids = merge(ids, pair, new_id)`},
    {h:"Embeddings — turning IDs into meaning vectors", body:`<p><b>An embedding table is just a big lookup matrix</b> of shape <code>(vocab_size, d_model)</code>. Each row is the learned vector representation of one token.</p>
    <p><b>Example:</b> GPT-2 small has vocab=50257, d_model=768. Embedding table = 50257 × 768 ≈ 38M parameters. Token ID 42 → row 42 of this table → a 768-dim vector.</p>
    <p><b>Why a vector?</b> Because vectors can encode rich meaning. Similar words end up with similar vectors after training. Famous example from word2vec:</p>
    <pre><code>king - man + woman ≈ queen</code></pre>
    <p>The embedding table learns linear relationships in concept space.</p>
    <p><b>How is the table learned?</b> Backprop. Every time the model sees "the cat sat" and predicts the next token, gradients flow back to update the rows for "the", "cat", "sat" — making similar tokens have similar embeddings.</p>
    <p><b>In LLMs vs older models:</b></p>
    <ul>
      <li>Static embeddings (word2vec, GloVe): one vector per word, fixed regardless of context</li>
      <li>Contextual embeddings (BERT, GPT): vectors change based on surrounding tokens — "bank" near "river" ≠ "bank" near "money"</li>
    </ul>`, code:`import torch.nn as nn
import torch

emb = nn.Embedding(50257, 768)  # GPT-2 small vocab + dim

# input: token IDs
ids = torch.tensor([[1, 42, 99]])  # batch=1, seq=3

# output: looked-up vectors
x = emb(ids)
print(x.shape)  # torch.Size([1, 3, 768])`},
    {h:"Why RNNs died", body:`<ul>
      <li>RNN: sequential, can't parallelize</li>
      <li>LSTM/GRU: gated, still bottlenecked</li>
      <li>Bahdanau attention (2014): bypass bottleneck</li>
      <li>Transformer (2017): drop RNN, just attention + MLP. Parallel = scale = win</li>
    </ul>`},
  ],
  quiz:[
    {type:"mcq", q:"Why BPE over word tokenization?", options:["Faster","No OOV; rare words decompose","Smaller files","Required"], answer:1, explain:"Robust to any input. Decomposes to sub-pieces."},
    {type:"mcq", q:"How does embedding learn?", options:["Frozen","Gradient flows through Embedding.weight just like any param","Only word2vec","Manual"], answer:1, explain:"nn.Embedding is learnable lookup. Each indexed row updates."},
    {type:"mcq", q:"Why transformers replaced RNNs?", options:["Fewer params","Parallel across positions in training; RNN inherently sequential","Less memory","RNN can't model long"], answer:1, explain:"Transformer self-attn = all positions simultaneously → full GPU → web-scale training."},
    {type:"mcq", q:"Same English document costs ~5× more in tokens when in Burmese. Why?", options:["Anthropic charges extra for non-English","Burmese script + smaller training share → BPE merges fewer chars per token → more tokens per character","Latency overhead","Encoding bug"], answer:1, explain:"BPE merges what's frequent in training data. Underrepresented scripts get fewer multi-char merges → fall back to byte-level → 4-6× the tokens. Cost + quality both suffer."},
    {type:"mcq", q:"User prompt ends with trailing space; few-shot examples don't. Result?", options:["Identical output","Different tokens at boundary → potentially worse output; standardize whitespace","API rejects","No effect with temperature=0"], answer:1, explain:"' word' and 'word' are different tokens. Mismatch with few-shot pattern can degrade output. Strip trailing whitespace before sending, or include in examples."},
    {type:"short", q:"Why is tokenization a hidden source of LLM bugs?", model:"Token boundaries don't match human concepts. GPT splits numbers oddly → bad arithmetic. Some languages use 4-5x more tokens per char → expensive + worse. Trailing/leading whitespace = different tokens → breaks few-shot. SolidGoldMagikarp-style undertrained tokens = undefined behavior. Always inspect tokens for math/multilingual/code before blaming model.", rubric:["unit mismatch","math/multilingual","inspect before debug"]},
  ],
  project:{title:"Phase 5 deliverable", steps:["BPE tokenizer encode/decode roundtrip","Char-level RNN on Tiny Shakespeare (historical literacy)"]}
}
));
