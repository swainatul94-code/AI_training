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
    {h:"NumPy shapes — the #1 source of bugs", body:`<p>If you have ever seen an error message and thought "the code looks right, why is this broken?" — the answer is almost always a shape mismatch. Learning to read shapes before and after every operation is the single biggest debugging skill you can develop.</p>
    <p><b>Three different things that look identical in print:</b></p>
    <p><code>np.array([1, 2, 3])</code> has shape <code>(3,)</code> — a 1-dimensional array of 3 numbers. NumPy calls this a "flat vector."</p>
    <p><code>np.array([[1], [2], [3]])</code> has shape <code>(3, 1)</code> — a 2-dimensional array with 3 rows and 1 column. A column vector.</p>
    <p><code>np.array([[1, 2, 3]])</code> has shape <code>(1, 3)</code> — a 2-dimensional array with 1 row and 3 columns. A row vector.</p>
    <p>All three contain the same three numbers. But they behave completely differently in math operations. A (3,) plus a (3,1) does not give element-wise addition — it gives a (3,3) grid, and no error is raised. The wrong answer appears silently.</p>
    <p><b>Decoding the classic error word by word:</b></p>
    <p><code>operands could not be broadcast together with shapes (3,2) (3,)</code></p>
    <p>"Operands" = the two arrays you are trying to combine. "Could not be broadcast" = NumPy tried its broadcasting rules and failed. "Shapes (3,2) (3,)" = the first array has 3 rows and 2 columns; the second has 3 elements in one flat dimension. NumPy aligns from the right: (3,2) and (1,3) after padding — the rightmost dimensions are 2 and 3, which are not equal and neither is 1. Broadcasting fails. Fix: reshape the second array to (3,1) or (1,2) depending on your intent.</p>
    <p><b>Mental model:</b> think of shape as an address. Just as you cannot deliver a letter to an address with a missing street, NumPy cannot operate on arrays with incompatible addresses. Always check the address (shape) before the operation, not after.</p>
    <p><b>Common novice mistakes:</b></p>
    <ul>
      <li>Ignoring <code>.shape</code> when debugging. It should be the <em>first</em> thing you print, not the last resort.</li>
      <li>Assuming a function returns the same shape it received. Many NumPy operations drop a dimension: <code>arr.mean(axis=0)</code> on a (5,3) array gives (3,), not (1,3).</li>
      <li>Fixing shape errors by adding random <code>.reshape()</code> calls until the error goes away — without understanding why. This produces silent wrong-answer bugs that are much harder to find than the original error.</li>
    </ul>`, code:`import numpy as np

flat   = np.array([1, 2, 3])
col    = flat.reshape(3, 1)
row    = flat.reshape(1, 3)

print(flat.shape)   # (3,)  — one-dimensional
print(col.shape)    # (3, 1) — column vector
print(row.shape)    # (1, 3) — row vector

# Same numbers, but operations behave differently
print(col + row)
# (3,1) + (1,3) -> broadcasts to (3,3):
# [[2 3 4]
#  [3 4 5]
#  [4 5 6]]

print(flat + col)
# (3,) + (3,1) -> also (3,3) — probably not what you wanted!
# [[2 3 4]
#  [3 4 5]
#  [4 5 6]]

# FIRST thing to do when debugging: print shapes
print("flat:", flat.shape, "col:", col.shape, "row:", row.shape)`},
    {h:"Broadcasting, drawn out", body:`<p>Broadcasting is the rule NumPy uses to do math on arrays that have different shapes. Instead of raising an error, NumPy virtually stretches the smaller array to match the larger one — no extra memory is used, and the math is fast.</p>
    <p><b>The rule in two sentences:</b> align the shapes from the right. Two dimensions are compatible if they are equal, or if one of them is 1 (the size-1 dimension gets "stretched" to match the other).</p>
    <p><b>Worked example — every cell shown:</b></p>
    <p>Column vector (shape 3 &times; 1): [[1], [2], [3]].</p>
    <p>Row vector (shape 1 &times; 4): [[10, 20, 30, 40]].</p>
    <p>Adding them: (3,1) + (1,4) &rarr; result is (3,4). NumPy stretches the column across 4 columns and the row down 3 rows.</p>
    <table>
      <tr><th></th><th>10</th><th>20</th><th>30</th><th>40</th></tr>
      <tr><th>1</th><td>11</td><td>21</td><td>31</td><td>41</td></tr>
      <tr><th>2</th><td>12</td><td>22</td><td>32</td><td>42</td></tr>
      <tr><th>3</th><td>13</td><td>23</td><td>33</td><td>43</td></tr>
    </table>
    <p>Each cell is the row-header plus the column-header. The row [1,2,3] was stretched across all 4 columns; the column [10,20,30,40] was stretched down all 3 rows.</p>
    <p><b>Mental model:</b> imagine tiling a small image to fill a large canvas. Broadcasting tiles the smaller array virtually (without copying data) until both arrays are the same size, then does the math.</p>
    <p><b>Why this is huge in ML:</b> when you subtract the mean from a dataset (normalisation), add position encodings to token embeddings, or apply an attention mask — all of these use broadcasting. Understanding it prevents both errors and confusing silent bugs.</p>
    <p><b>Common novice mistakes:</b></p>
    <ul>
      <li>The silent wrong-answer broadcast. Adding a (3,) array to a (3,1) array gives a (3,3) result — no error, but almost certainly not what you intended. Always verify the output shape immediately after.</li>
      <li>Confusing (3,) with (3,1). They broadcast differently. (3,) is treated as (1,3) when padded from the left, not (3,1). Reshape explicitly to avoid surprises.</li>
      <li>Expecting broadcasting to always copy data. It does not — it is a virtual trick. If you need an actual copy, use <code>np.broadcast_to(a, shape).copy()</code>.</li>
    </ul>`, code:`import numpy as np

col = np.array([[1],
                [2],
                [3]])          # shape (3, 1)

row = np.array([[10, 20, 30, 40]])  # shape (1, 4)

result = col + row             # broadcasts to (3, 4)
print(result)
# [[11 21 31 41]
#  [12 22 32 42]
#  [13 23 33 43]]
print("result shape:", result.shape)  # (3, 4)

# Practical example: subtract the column mean from each column
data = np.array([[4.0, 8.0],
                 [2.0, 6.0],
                 [6.0, 10.0]])   # shape (3, 2)

col_mean = data.mean(axis=0)     # shape (2,)
print("column means:", col_mean) # [4. 8.]

centered = data - col_mean       # (3,2) - (2,) -> (3,2) via broadcasting
print(centered)
# [[ 0.  0.]
#  [-2. -2.]
#  [ 2.  2.]]`},
    {h:"Pandas mental model: a dict of columns", body:`<p>Pandas is the go-to tool for handling tabular data — spreadsheet-style rows and columns — before it goes into a model. The fastest way to understand it is a single analogy: <b>a DataFrame is a Python dictionary where every value is a NumPy array of the same length, and the keys are the column names.</b></p>
    <p>That is it. Once that model clicks, every pandas operation makes sense.</p>
    <p>The row labels (the index) are like the position numbers on a spreadsheet. By default they are 0, 1, 2, ... but they can be anything — dates, names, IDs.</p>
    <p><b>Three ways to pull data out, and when to use each:</b></p>
    <table>
      <tr><th>What you want</th><th>Syntax</th><th>Example</th></tr>
      <tr><td>One whole column</td><td><code>df["column_name"]</code></td><td><code>df["age"]</code></td></tr>
      <tr><td>A row by its label (index value)</td><td><code>df.loc[label]</code></td><td><code>df.loc[2]</code></td></tr>
      <tr><td>A row by its position (0, 1, 2...)</td><td><code>df.iloc[position]</code></td><td><code>df.iloc[0]</code></td></tr>
    </table>
    <p>The difference between <code>.loc</code> and <code>.iloc</code> trips up almost every beginner. <b>loc uses the label</b> (the value shown in the index column). <b>iloc uses the integer position</b> (0 for first row, 1 for second, regardless of labels). When the index is 0, 1, 2, ... they behave the same — which is why the difference only becomes obvious when the index is something else, like dates.</p>
    <p><b>Mental model:</b> loc = "locate by name." iloc = "locate by integer counting."</p>
    <p><b>Common novice mistakes:</b></p>
    <ul>
      <li>Using dot-access <code>df.age</code> instead of <code>df["age"]</code>. Dot-access breaks silently when the column name has a space ("home price") or matches a pandas method name ("count", "mean"). Always use bracket notation for safety.</li>
      <li>Chained indexing for assignment: <code>df["col1"]["row1"] = value</code>. Pandas may operate on a temporary copy, so the original DataFrame does not change. You get a SettingWithCopyWarning. Use <code>df.loc[row, col] = value</code> instead.</li>
      <li>Mixing up <code>.loc</code> and <code>.iloc</code> after filtering. When you filter rows, the index labels stay the same but the positions change. <code>df.iloc[0]</code> always means the first visible row; <code>df.loc[0]</code> means the row whose label is 0, which may not exist after filtering.</li>
    </ul>`, code:`import pandas as pd

# Build a DataFrame from a plain dictionary — exactly like the mental model
data = {
    "name":   ["Alice", "Bob", "Carol"],
    "age":    [25, 31, 22],
    "score":  [88.5, 91.0, 77.0],
}
df = pd.DataFrame(data)
print(df)
#     name  age  score
# 0  Alice   25   88.5
# 1    Bob   31   91.0
# 2  Carol   22   77.0

# Get one column — returns a Series (like a numpy array with labels)
print(df["age"])          # 0    25 / 1    31 / 2    22

# Get row by label (index value)
print(df.loc[2])          # Carol's row — label 2

# Get row by position
print(df.iloc[0])         # Alice's row — first position

# Safe assignment — always use .loc[row, col]
df.loc[0, "score"] = 90.0
print(df["score"].tolist())  # [90.0, 91.0, 77.0]`},
    {h:"Anatomy of a Matplotlib chart", body:`<p>Matplotlib is Python's standard plotting library. It can make almost any chart, but it has a confusing quirk: there are two different ways to use it (the "state" style and the "object" style), and mixing them produces charts that look wrong or do not appear at all. This lesson teaches you one style — the object style — which works reliably every time.</p>
    <p><b>The four-line skeleton that covers 90% of all charts you will ever need:</b></p>
    <ol>
      <li><code>fig, ax = plt.subplots()</code> — create the canvas and the chart frame.</li>
      <li><code>ax.plot(x, y)</code> — draw something on the frame.</li>
      <li><code>ax.set_xlabel(...) / ax.set_ylabel(...) / ax.set_title(...)</code> — add labels.</li>
      <li><code>plt.show()</code> — display the finished chart.</li>
    </ol>
    <p><b>Mental model — figure vs axes:</b></p>
    <p>A <b>figure</b> is the sheet of paper you are drawing on. It has a size (width and height in inches) and can hold multiple charts side by side.</p>
    <p>An <b>axes</b> (note: axes is already plural — one axes object, not "axe") is the chart frame drawn on that paper. It contains the data area, the tick marks, and the labels. Confusingly, it is NOT the same as the x-axis or y-axis lines — it is the whole framed chart region.</p>
    <p>When you call <code>plt.subplots()</code>, you get back both: a figure and one axes. All your drawing calls go on the axes object (<code>ax.plot</code>, <code>ax.bar</code>, <code>ax.scatter</code>, etc.).</p>
    <p><b>Why this matters for ML:</b> you will plot training loss curves, confusion matrices, weight distributions, and attention heatmaps constantly. A chart without axis labels and a title is useless to anyone reading your notebook. Forming the four-line habit now saves future-you a lot of time.</p>
    <p><b>Common novice mistakes:</b></p>
    <ul>
      <li>Mixing <code>plt.*</code> (state style) and <code>ax.*</code> (object style) in the same cell. For example, calling <code>plt.xlabel("x")</code> on one line and <code>ax.plot(...)</code> on another. The state style applies labels to whichever axes matplotlib considers "current," which changes unpredictably when you have multiple subplots. Stick to <code>ax.*</code> for everything.</li>
      <li>Forgetting <code>plt.show()</code> in a script (not a Jupyter notebook). Without it, the chart is prepared but never displayed.</li>
      <li>Calling <code>plt.subplots()</code> inside a loop without closing the previous figure. Each call creates a new figure object in memory. Use <code>plt.close()</code> at the end of each loop iteration, or use <code>plt.close("all")</code> before the loop.</li>
    </ul>`, code:`import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)   # 100 evenly spaced x values from 0 to 10
y = np.sin(x)                  # compute sine for each x

# Line 1: create the canvas (fig) and the chart frame (ax)
fig, ax = plt.subplots()

# Line 2: draw the data — ax.plot draws a line chart
ax.plot(x, y, label="sin(x)", color="steelblue")

# Line 3: add labels and title — always do this; unlabelled charts are useless
ax.set_xlabel("x value")
ax.set_ylabel("sin(x)")
ax.set_title("Sine wave — example chart")
ax.legend()          # shows the label we set in ax.plot

# Line 4: display the chart
plt.show()

# Multiple subplots side by side: fig with two axes
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
ax1.plot(x, np.sin(x)); ax1.set_title("Sine")
ax2.plot(x, np.cos(x)); ax2.set_title("Cosine")
plt.tight_layout()   # prevents labels from overlapping
plt.show()`},
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
