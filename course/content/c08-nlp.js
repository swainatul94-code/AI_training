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
    {h:"Why text is hard for computers", body:`<p><b>Mental model:</b> a computer is, at heart, a calculator. It only knows how to add, multiply, and compare numbers. Words are not numbers — so before any learning can happen, text must be converted into numbers.</p>
    <p>The simplest idea is to assign each word an integer: cat = 1, dog = 2, car = 3. But this is immediately broken. The number 2 is between 1 and 3, so the encoding implies dog is "between" cat and car — which is nonsense. It also implies cat &times; 2 = dog — also nonsense.</p>
    <p>We need a number system where <b>similar meaning = similar numbers</b>. If "happy" and "joyful" mean nearly the same thing, their number representations should be close together. If "happy" and "building" are unrelated, they should be far apart.</p>
    <p>A single integer cannot capture this. We need a <b>vector</b> — a list of numbers — where the position in multi-dimensional space encodes meaning. That is what embeddings are (covered in the next lesson).</p>
    <p>This also explains why models do not "read" text the way humans do. There is no comprehension happening at the letter level. The model receives a sequence of vectors and performs matrix multiplications. The impression of understanding emerges from patterns learned across billions of those vector sequences.</p>
    <p><b>Common novice mistakes:</b></p>
    <ul>
      <li>Thinking the model "reads" words like a human — it processes sequences of learned number vectors.</li>
      <li>Assuming integer labels for categories are fine in all situations — for ordered categories with meaning (e.g., ratings 1&ndash;5) integers can work; for unordered categories (e.g., city names) they impose false relationships.</li>
    </ul>`},
    {h:"Tokenization end to end", body:`<p><b>Mental model:</b> tokenization is like breaking a word into syllables on a spelling test. You split text into the smallest pieces that the model can usefully recognize, assign each piece a number ID, and hand those IDs to the embedding layer.</p>
    <p><b>Worked example — "unbelievable":</b></p>
    <ul>
      <li>A whole-word tokenizer needs one entry per word in its vocabulary. New or rare words become UNKNOWN — a dead end for the model.</li>
      <li>A character tokenizer splits into ["u","n","b","e","l","i","e","v","a","b","l","e"] — 12 tokens. Sequences become very long and the model has to re-learn that those 12 characters form a concept.</li>
      <li>A subword tokenizer splits into something like ["un", "believ", "able"] — 3 tokens. Common fragments get their own entries. No word is ever UNKNOWN because any word can be broken into known pieces.</li>
    </ul>
    <p>Modern LLMs (GPT-4, Llama) all use subword tokenization (BPE or SentencePiece). The vocabulary size is typically 32,000&ndash;200,000 tokens.</p>
    <p><b>Rule of thumb for cost estimation:</b> 1 token &asymp; 0.75 English words, or about 4 characters. A 1,000-word document is roughly 1,300 tokens. API pricing is stated per token — this rule is how you estimate costs before running anything.</p>
    <p><b>Common novice mistakes:</b></p>
    <ul>
      <li>Assuming token = word when estimating API costs — you will underestimate by about 30%.</li>
      <li>Not checking how an unusual input (code, a foreign language, numbers) tokenizes — code and non-English text often use many more tokens per character than English prose.</li>
    </ul>`},
    {h:"Embeddings: meaning as coordinates", body:`<p><b>Mental model:</b> imagine plotting every word on a map. Words with similar meanings live near each other. "King" and "queen" are close. "King" and "car" are far apart. An embedding vector is just the coordinates of a word on that map — except the map has hundreds or thousands of dimensions instead of two.</p>
    <p><b>Toy 2-D example</b> (real embeddings have thousands of unlabeled dimensions; this uses two to make the idea visible):</p>
    <table>
      <tr><th>Word</th><th>Dim 1 (royalty)</th><th>Dim 2 (male-ness)</th></tr>
      <tr><td>king</td><td>0.9</td><td>0.8</td></tr>
      <tr><td>queen</td><td>0.9</td><td>0.2</td></tr>
      <tr><td>man</td><td>0.1</td><td>0.8</td></tr>
      <tr><td>woman</td><td>0.1</td><td>0.2</td></tr>
    </table>
    <p><b>Famous vector arithmetic:</b> king &minus; man + woman &asymp; queen. Let us verify with the toy numbers:</p>
    <ul>
      <li>king &minus; man + woman = (0.9, 0.8) &minus; (0.1, 0.8) + (0.1, 0.2) = (0.9 &minus; 0.1 + 0.1, 0.8 &minus; 0.8 + 0.2) = (0.9, 0.2) = queen exactly.</li>
    </ul>
    <p>The embedding space learned a direction that corresponds to "royalty" and a separate direction that corresponds to "gender." You can do arithmetic on meaning.</p>
    <p><b>Cosine similarity</b> measures the angle between two vectors. An angle of 0&deg; means identical direction (very similar meaning). An angle of 90&deg; means unrelated. This is the standard way to ask "how similar are two pieces of text?" in embedding space.</p>
    <p><b>Common novice mistakes:</b></p>
    <ul>
      <li>Comparing embeddings from different models — embedding spaces are not interchangeable across models.</li>
      <li>Using Euclidean distance instead of cosine similarity for meaning comparisons — high-dimensional embeddings are better compared by angle than by raw distance.</li>
    </ul>`},
    {h:"From counting to context — three eras of NLP", body:`<p><b>Mental model:</b> think of three generations of technology for representing language, each solving a problem the previous generation could not.</p>
    <p><b>Era 1 — Bag of words (pre-2013).</b> Count how many times each word appears in a document. Ignore order entirely. "The dog bites the man" and "The man bites the dog" produce identical representations because the word counts are the same. Useful for spam filters and topic classification, useless for anything where word order carries meaning. No understanding of synonyms — "happy" and "joyful" are treated as completely unrelated.</p>
    <p><b>Era 2 — Word2Vec and fixed vectors (2013&ndash;2018).</b> Train a neural network to predict each word from its neighbors. The hidden layer weights become the word embeddings. Words that appear in similar contexts end up with similar vectors — so "happy" and "joyful" are finally close. The breakthrough: meaning is encoded. The limitation: every word gets exactly one fixed vector regardless of context. The word "bank" in "river bank" and "bank account" is forced to share one point in the embedding space, blending two meanings into an average.</p>
    <p><b>Era 3 — Contextual embeddings and transformers (2018&ndash;present).</b> The vector for each word is recomputed depending on the entire surrounding sentence. The two uses of "bank" finally get different vectors. The model reads the whole sentence before assigning a meaning to any one word. This is what BERT, GPT, and every modern LLM do. It is the foundation of Phase 6.</p>
    <p><b>Common novice mistakes:</b></p>
    <ul>
      <li>Assuming word2vec-era embeddings understand context — they produce one fixed vector per word; the context problem was only solved by transformers.</li>
      <li>Using pre-trained embeddings from a very different domain (e.g., Wikipedia vectors for medical text) without fine-tuning — the embedding space may not capture the domain's specialized vocabulary well.</li>
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
