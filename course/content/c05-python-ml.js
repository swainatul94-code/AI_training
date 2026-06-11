// c05-python-ml — course content. Must load before course/engine.js.
window.COURSE_PHASES = window.COURSE_PHASES || [];
COURSE_PHASES.push(Object.assign({ order: 5 },
{ id:3, title:"Phase 2 — Python for ML", est:"12-20 hrs",
  intro:"numpy + pandas fluency. The single biggest skill jump from beginner Python to ML Python is <b>vectorization</b> — replacing loops with array operations that run 100× faster on the same hardware.",
  lessons:[
    {h:"Why vectorize? (the most important Python ML skill)", body:`<p><b>Slow Python:</b></p>
    <pre><code># Add 1 to each element of a million numbers
result = []
for x in numbers:        # explicit loop in Python
    result.append(x + 1)
# Takes ~0.5 seconds</code></pre>
    <p><b>Fast numpy:</b></p>
    <pre><code>result = numbers + 1     # vectorized
# Takes ~0.005 seconds (100× faster)</code></pre>
    <p><b>Why?</b> Python's <code>for</code> loop runs slow interpreted code per element. numpy ships the whole array to compiled C code that processes it in one batch, often using CPU SIMD instructions or GPU.</p>
    <p><b>The rule:</b> if you write <code>for</code> over array elements, you're doing it wrong. Find the numpy operation that does the same thing on the whole array.</p>
    <p><b>What "vectorized" means:</b> the operation applies element-wise without explicit loops. Math operators (+, -, *, /), functions (np.exp, np.log), comparisons (>, ==) all work on entire arrays at once.</p>`},
    {h:"numpy core — what each operation does", body:`<p>Memorize these. They're the alphabet of ML code.</p>
    <h4>Creating arrays</h4>
    <pre><code>np.zeros((3, 4))      # 3x4 of zeros
np.ones(5)            # length-5 of ones
np.eye(4)             # 4x4 identity (1s on diagonal)
np.random.randn(100, 5) # 100x5 random from N(0,1)
np.arange(10)         # [0,1,2,...,9]
np.linspace(0, 1, 50) # 50 evenly spaced from 0 to 1</code></pre>
    <h4>Shape manipulation</h4>
    <pre><code>a = np.arange(6)            # shape (6,)  → [0,1,2,3,4,5]
a.reshape(2, 3)             # → [[0,1,2],[3,4,5]]
a.reshape(-1, 2)            # -1 = "infer this dim" → (3,2)
a[:, None]                  # add axis → (6,1) column vector
np.concatenate([a, b], axis=0)  # stack along rows</code></pre>
    <h4>Math (element-wise unless noted)</h4>
    <pre><code>a + b        # element-wise add
a * b        # element-wise multiply (NOT matmul)
np.exp(a)    # e^x element-wise
np.log(a)    # natural log
np.maximum(a, 0)  # ReLU: max(x, 0) per element
A @ B        # matrix multiplication</code></pre>
    <h4>Reductions (collapse a dimension)</h4>
    <pre><code>a.sum()            # one number (sum all)
a.mean(axis=0)     # collapse axis 0 → average per column
a.std(axis=1, keepdims=True)  # std per row, keep 2D shape
a.argmax()         # index of max element</code></pre>
    <h4>Masking (boolean indexing)</h4>
    <pre><code>a[a > 0]           # keep only positive elements
a[a < 0] = 0       # in-place ReLU</code></pre>`},
    {h:"Broadcasting — the magic that powers everything", body:`<p><b>The problem:</b> you have an array X of shape (100, 5) — 100 samples, 5 features. You want to subtract the mean of each column. The mean has shape (5,). How can you compute (100, 5) - (5,)?</p>
    <p><b>Answer: broadcasting.</b> numpy automatically stretches the smaller array to match.</p>
    <p><b>The rules</b> (align shapes from the RIGHT):</p>
    <ol>
      <li>If one shape is shorter, pad the LEFT with 1s</li>
      <li>For each dim: sizes must match, or one of them must be 1</li>
      <li>Size-1 dims get "stretched" virtually (no memory copy)</li>
    </ol>
    <p><b>Worked example:</b></p>
    <pre><code>X.shape       = (100, 5)
mean.shape    = (5,)        → padded to (1, 5)
                              → stretched to (100, 5)
X - mean      → (100, 5)    ✓ works</code></pre>
    <p><b>Common failure:</b></p>
    <pre><code>X.shape  = (100, 5)
v.shape  = (100,)           → (1, 100)
                              → can't match 5 with 100
X - v    → ERROR</code></pre>
    <p>Fix: <code>X - v[:, None]</code> reshapes v to (100, 1) → broadcasts to (100, 5).</p>
    <p><b>Why this is huge:</b> half the operations in deep learning rely on broadcasting. LayerNorm, attention masks, position encodings — all use it.</p>`},
    {h:"Stable softmax", code:`def softmax(x):\n    x = x - x.max(axis=-1, keepdims=True)  # stability\n    e = np.exp(x)\n    return e / e.sum(axis=-1, keepdims=True)`},
    {h:"pandas essentials", code:`import pandas as pd\ndf = pd.read_csv("train.csv")\ndf.head(); df.info(); df.describe()\ndf[df.age>30]                                # filter\ndf.groupby("class")["fare"].mean()           # groupby\ndf.merge(other, on="id", how="left")         # join\ndf["age"].fillna(df["age"].median())         # impute\npd.get_dummies(df, columns=["sex"])          # one-hot`},
    {h:"matplotlib", code:`import matplotlib.pyplot as plt\nfig, ax = plt.subplots(1, 2, figsize=(10,4))\nax[0].scatter(df.age, df.fare, alpha=0.4)\nax[1].hist(df.age.dropna(), bins=30)\nplt.tight_layout(); plt.show()`},
    {h:"Titanic capstone", body:"<ol><li>Download Titanic train.csv from Kaggle</li><li>Notebook phase2_titanic_eda.ipynb</li><li>5 plots, each with 1-sentence insight</li><li>Push to repo</li></ol>"},
  ],
  quiz:[
    {type:"mcq", q:"A@B vs A*B?", options:["Same","@ matmul, * element-wise","* matmul","@ only 1D"], answer:1, explain:"@ → matmul. * → element-wise (Hadamard)."},
    {type:"mcq", q:"Why subtract max before exp in softmax?", options:["Speed","Numerical stability — prevents exp overflow","Math definition","Sum to 1"], answer:1, explain:"exp(1000)=inf. Shift to ≤0 first. Output identical (softmax shift-invariant)."},
    {type:"mcq", q:"Which broadcast? (3,4) + ?", options:["(4,3)","(3,)","(4,)","(4,3) only"], answer:2, explain:"Align right: (3,4)+(4,)→(3,4)+(1,4)→ok. (3,) fails."},
    {type:"short", q:"pandas vs numpy?", model:"pandas: heterogeneous tabular data with named cols, mixed dtypes, NaNs, groupby/joins — like SQL table. numpy: homogeneous numerical arrays, hot loops, model code. Convert at boundary: df.to_numpy() before training.", rubric:["pandas=tabular","numpy=fast numerical","convert at boundary"]},
  ],
  project:{title:"Phase 2 deliverable", steps:["10 numpy drills solved","phase2_titanic_eda.ipynb with 5 insights","titanic_clean.csv"]}
}
));
