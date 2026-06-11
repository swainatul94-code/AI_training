// c04-math — course content. Must load before course/engine.js.
window.COURSE_PHASES = window.COURSE_PHASES || [];
COURSE_PHASES.push(Object.assign({ order: 4 },
{ id:2, title:"Phase 1 — Math Foundations", est:"25-40 hrs",
  intro:"Can't debug LLMs without linear algebra + gradients + probability. Skip = stuck at Phase 6. This phase uses analogies + numeric examples; don't memorize formulas, build intuition.",
  lessons:[
    {h:"Vectors — what they are and why ML uses them", body:`<p><b>A vector is two things at once:</b></p>
    <ol>
      <li>A <b>list of numbers</b> like <code>[3, 1, 4]</code></li>
      <li>An <b>arrow in space</b> pointing from origin (0,0,0) to point (3,1,4)</li>
    </ol>
    <p>Both views matter. The "list" view is what you store in numpy. The "arrow" view is how you reason about it geometrically.</p>
    <p><b>In ML, vectors are how we represent things:</b></p>
    <ul>
      <li>One sentence → a vector of 768 numbers (an "embedding")</li>
      <li>One image → flatten 28×28 pixels to a 784-number vector</li>
      <li>One user → vector of [age, num_purchases, total_spend, ...]</li>
    </ul>
    <p><b>Why?</b> Because computers can do math on vectors fast (matrix operations on GPUs). Once data is a vector, you can ask: "how similar are these two things?" That question is the heart of search, recommendation, and attention.</p>
    <p><b>Concrete example.</b> Two cats represented as vectors of [tail_length, weight]:</p>
    <pre><code>cat_A = [10, 8]   # short tail, heavy
cat_B = [25, 4]   # long tail, light
cat_C = [11, 9]   # short tail, heavy (like cat_A)</code></pre>
    <p>Vectors cat_A and cat_C "point in similar directions" → similar cats. cat_B is different. We'll measure that with dot product in 2 lessons.</p>`},
    {h:"Matrices and matrix multiplication", body:`<details class="try"><summary>🎯 Try first: what shape does (3,4) @ (4,7) produce?</summary><div class="ans">Answer: <b>(3, 7)</b>. Inner dims (4 and 4) must match and cancel. Outer dims (3 and 7) survive.</div></details>
    <p><b>A matrix is a grid of numbers</b>, e.g. shape (rows, cols):</p>
    <pre><code>A = [[1, 2, 3],
     [4, 5, 6]]    # shape (2, 3)</code></pre>
    <p><b>Geometric meaning:</b> a matrix is a <b>linear transformation</b> — multiplying by it rotates, scales, or shears space.</p>
    <p><b>Matrix multiplication</b> <code>C = A @ B</code> combines two transformations.</p>
    <p><b>Shape rule:</b> <code>(m, k) @ (k, n) → (m, n)</code>. Inner dims must match.</p>
    <p><b>How a single cell is computed.</b> <code>C[i, j]</code> = dot product of row i of A with column j of B:</p>
    <pre><code>A = [[1, 2],
     [3, 4]]    # (2, 2)
B = [[5, 6],
     [7, 8]]    # (2, 2)

C[0,0] = 1*5 + 2*7 = 19
C[0,1] = 1*6 + 2*8 = 22
C[1,0] = 3*5 + 4*7 = 43
C[1,1] = 3*6 + 4*8 = 50

C = [[19, 22],
     [43, 50]]</code></pre>
    <p><b>Why ML cares:</b> every neural network layer is a matmul. <code>output = input @ W</code>. A model with 1B parameters = a stack of huge matmuls. GPUs exist to do this fast.</p>
    <p><b>Common confusion:</b> <code>@</code> is matmul. <code>*</code> is element-wise (Hadamard). Different operations.</p>`, code:`import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

print(A @ B)     # matrix multiply → [[19,22],[43,50]]
print(A * B)     # element-wise   → [[5,12],[21,32]]
print(A.T)       # transpose      → [[1,3],[2,4]]`},
    {h:"Dot product — measuring similarity", body:`<details class="try"><summary>🎯 Try first: a=[1,0], b=[0,1]. What is a·b?</summary><div class="ans">Answer: <b>0</b>. Element-wise: 1·0 + 0·1 = 0. Geometrically these are perpendicular (90°), so cos(90°)=0 confirms it.</div></details>
    <div data-widget="dot-viz"></div>
    <p>The dot product of two vectors <code>a · b = a[0]*b[0] + a[1]*b[1] + ...</code> (sum element-wise products).</p>
    <p><b>Geometric meaning:</b> <code>a · b = |a| · |b| · cos(θ)</code> where θ is the angle between them.</p>
    <ul>
      <li>θ = 0° (same direction): cos = 1 → max similarity</li>
      <li>θ = 90° (perpendicular): cos = 0 → unrelated</li>
      <li>θ = 180° (opposite): cos = -1 → max dissimilarity</li>
    </ul>
    <p><b>This is THE most important operation in modern AI.</b> Every "is X similar to Y" question — retrieval, attention, recommendation — uses dot products.</p>
    <p><b>Numeric example with our cats from earlier:</b></p>
    <pre><code>cat_A · cat_C = 10*11 + 8*9  = 110 + 72 = 182   # high → similar
cat_A · cat_B = 10*25 + 8*4  = 250 + 32 = 282   # higher? but...

# raw dot product favors big numbers. Normalize first:
def cosine_sim(a, b):
    return (a·b) / (|a| * |b|)

cosine_sim(cat_A, cat_C) ≈ 0.998  # nearly identical direction
cosine_sim(cat_A, cat_B) ≈ 0.766  # less similar direction</code></pre>
    <p><b>In LLMs:</b> attention computes <code>Q · K</code> for every (query, key) pair → "how much does token Q want to attend to token K?". Same operation as the cat similarity.</p>`, code:`import numpy as np

a = np.array([10, 8])
b = np.array([25, 4])
c = np.array([11, 9])

# raw dot product
print(a @ c)  # 182
print(a @ b)  # 282

# cosine similarity (normalized)
def cosine(a, b):
    return (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))

print(cosine(a, c))  # ~0.998 — very similar
print(cosine(a, b))  # ~0.766 — less similar`},
    {h:"Transpose — the simplest matrix operation", body:`<p>Transpose <code>Aᵀ</code> flips rows and columns. A matrix of shape (m, n) becomes (n, m). That's it.</p>
    <pre><code>A   = [[1, 2, 3]]      # shape (1, 3) — a row vector

A.T = [[1],
       [2],
       [3]]             # shape (3, 1) — a column vector</code></pre>
    <p><b>Where you'll see it constantly:</b></p>
    <ul>
      <li>Attention math: <code>Q · Kᵀ</code> (compute scores between every query and every key)</li>
      <li>Convert column-vector to row-vector (and back)</li>
      <li>Whenever shape doesn't match for matmul</li>
    </ul>`, code:`import numpy as np
A = np.array([[1, 2, 3], [4, 5, 6]])  # shape (2, 3)
print(A.shape)        # (2, 3)
print(A.T.shape)      # (3, 2)
print(A.T)            # rows become cols`},
    {h:"Determinant — does this transform crush a dimension?", body:`<p>The determinant is a single number that says <b>"how much does this matrix scale volume?"</b></p>
    <ul>
      <li><code>det(A) = 2</code> → transformation doubles areas/volumes</li>
      <li><code>det(A) = -1</code> → transformation flips orientation but preserves size</li>
      <li><code>det(A) = 0</code> → transformation collapses something flat → information is LOST → matrix is NOT invertible</li>
    </ul>
    <p><b>When you'll care:</b> a matrix with det=0 is "singular" — you can't undo what it did. In ML this means linear systems can't be solved, regression breaks, etc.</p>`, code:`import numpy as np

# A normal invertible matrix
A = np.array([[1, 2], [3, 5]])
print(np.linalg.det(A))   # -1.0 (not zero → invertible)

# A singular matrix (rows are dependent: row2 = 2*row1)
B = np.array([[1, 2], [2, 4]])
print(np.linalg.det(B))   # 0.0 (collapse → no inverse)`},
    {h:"Eigenvectors — directions that don't rotate", body:`<p>Most vectors, when multiplied by a matrix A, get rotated AND scaled. Eigenvectors are special: A only SCALES them, never rotates them.</p>
    <span class="formula">A · v = λ · v       (λ is the eigenvalue: how much v gets scaled)</span>
    <p><b>Intuition:</b> if A is a rotation around an axis, the axis itself doesn't rotate. That axis = an eigenvector with λ=1 (no scaling).</p>
    <p><b>Where you'll meet this:</b></p>
    <ul>
      <li><b>PCA</b> (principal component analysis): eigenvectors of the covariance matrix = directions of most variance in your data. Used for dimensionality reduction.</li>
      <li><b>Stability analysis</b>: in training dynamics, eigenvalues > 1 mean things explode.</li>
      <li><b>Graph algorithms</b> like PageRank.</li>
    </ul>`, code:`import numpy as np
A = np.array([[2, 0], [0, 3]])   # diagonal: just scales x by 2, y by 3
vals, vecs = np.linalg.eig(A)
print("eigenvalues:", vals)       # [2, 3]
print("eigenvectors:\\n", vecs)   # [[1,0],[0,1]] — the x and y axes`},
    {h:"SVD — the universal matrix factorization (math behind LoRA)", body:`<p>Every matrix A can be decomposed into <b>three steps: rotate → scale → rotate</b>:</p>
    <span class="formula">A = U · Σ · Vᵀ</span>
    <ul>
      <li><b>U, V</b>: rotation matrices</li>
      <li><b>Σ</b>: diagonal matrix of "singular values" (scaling factors), sorted big → small</li>
    </ul>
    <p><b>The killer insight:</b> the small singular values often contribute little. If you keep only the top-r singular values (set others to 0), you get a great low-rank approximation of A with far fewer numbers.</p>
    <p><b>This IS the math behind LoRA</b> (Phase 8). A fine-tuning weight update ΔW has approximately low rank → represent it as <code>(α/r)·B·A</code> with tiny B, A → ~100× fewer trainable parameters than full fine-tuning.</p>
    <p><b>You won't compute SVD by hand.</b> Just remember: "every matrix = rotate, scale, rotate. Small scales can be dropped."</p>`, code:`import numpy as np
A = np.random.randn(100, 50)
U, S, Vt = np.linalg.svd(A, full_matrices=False)
print("singular values shape:", S.shape)  # (50,)
print("biggest:", S[0], "smallest:", S[-1])
# Approximating A with top-10 singular values:
r = 10
A_approx = U[:, :r] @ np.diag(S[:r]) @ Vt[:r, :]
print("reconstruction error:", np.linalg.norm(A - A_approx))`},
    {h:"Derivatives — the slope of a function", body:`<details class="try"><summary>🎯 Try first: f(x) = 5x. What's the slope?</summary><div class="ans">Answer: <b>5</b>. A straight line of slope 5 has derivative = 5 everywhere. (Rule: derivative of c·x is c.)</div></details>
    <p><b>What a derivative is:</b> the slope of a function at a specific point. If <code>f(x) = x²</code>, then <code>f'(x) = 2x</code> — at x=3, slope is 6.</p>
    <p><b>Why ML cares:</b> we have a <b>loss function</b> measuring how wrong the model is. We want to find parameter values where the loss is minimum. Derivatives tell us which direction (and how much) to move parameters to reduce loss.</p>
    <p><b>Picture:</b> imagine you're on a hill in fog. You want to reach the bottom. Feel the ground around your feet → walk in the steepest-down direction → repeat. That's gradient descent.</p>
    <p><b>The rules you actually need:</b></p>
    <pre><code>f(x) = c          → f'(x) = 0     (constant has no slope)
f(x) = x          → f'(x) = 1
f(x) = x²         → f'(x) = 2x
f(x) = xⁿ         → f'(x) = n·xⁿ⁻¹
f(x) = eˣ         → f'(x) = eˣ    (special!)
f(x) = log(x)     → f'(x) = 1/x
f(x) = a·g(x)     → f'(x) = a·g'(x)         (constant factor)
f(x) = g(x) + h(x)→ f'(x) = g'(x) + h'(x)  (sum)</code></pre>
    <p><b>Worked example:</b> <code>f(x) = 3x² + 5x - 7</code></p>
    <p>f'(x) = 3·(2x) + 5·(1) - 0 = <b>6x + 5</b></p>
    <p>At x=2: slope is 6·2 + 5 = 17. Steep upward. To minimize f, move x left (decrease).</p>`},
    {h:"Partial derivatives + gradient", body:`<p>Functions of multiple variables (like loss as function of millions of parameters) have a slope <b>per variable</b>.</p>
    <p><b>Partial derivative</b> <code>∂f/∂x</code> = derivative treating only x as variable, others as constants.</p>
    <p><b>Example.</b> <code>f(x, y) = x² + 3xy + y³</code></p>
    <pre><code>∂f/∂x = 2x + 3y    (treat y as constant)
∂f/∂y = 3x + 3y²   (treat x as constant)</code></pre>
    <p><b>Gradient</b> <code>∇f</code> = vector of all partial derivatives. For our example: <code>∇f = [2x + 3y, 3x + 3y²]</code>.</p>
    <p><b>Geometric meaning:</b> ∇f points in the direction of steepest <b>ascent</b>. So to minimize, step in the opposite direction: <code>x_new = x_old - α · ∇f(x_old)</code>. α is the learning rate.</p>
    <p><b>In a neural net with 1B parameters:</b> ∇L is a 1B-dimensional vector. Each entry says "to decrease loss, nudge this param by this much." That's training in one line.</p>`},
    {h:"Chain rule — the heart of backprop", body:`<details class="try"><summary>🎯 Try first: f(x) = (3x)². What is f'(x)?</summary><div class="ans">Answer: <b>18x</b>. Let g(x) = 3x (inner), outer = squared. f'(x) = 2·g(x)·g'(x) = 2·(3x)·3 = 18x.</div></details>
    <p>When a function is built by composing other functions, the chain rule tells you how to take its derivative:</p>
    <span class="formula">d/dx f(g(x)) = f'(g(x)) · g'(x)</span>
    <p><b>Plain English:</b> outer derivative (evaluated at inner) <b>times</b> inner derivative.</p>
    <p><b>Worked example.</b> <code>f(x) = sin(x²)</code>. Let <code>g(x) = x²</code>, outer is sin. Then:</p>
    <pre><code>f'(x) = cos(x²) · 2x
       = cos(inner) · derivative_of_inner</code></pre>
    <p><b>Why it matters for ML.</b> A neural net is composition: <code>L = loss(model(input, W))</code>. To update W, we need <code>∂L/∂W</code>. That requires chaining through every layer.</p>
    <p><b>Backpropagation = chain rule applied repeatedly backward through layers.</b> Each layer hands its downstream gradient back times its own local Jacobian.</p>
    <p><b>Memorize this identity (appears everywhere):</b></p>
    <span class="formula">σ(z) = 1 / (1 + e⁻ᶻ),  σ'(z) = σ(z) · (1 - σ(z))</span>
    <p>The sigmoid's derivative can be written in terms of itself. Used in logistic regression gradients and historical RNN derivations.</p>`},
    {h:"Probability — distributions, expectation, conditional", body:`<p><b>Random variable</b> X = a value drawn from some process. Result of a die roll, next token, image label.</p>
    <p><b>Distribution</b> = how likely each outcome is.</p>
    <ul>
      <li><b>PMF</b> (probability mass function) for discrete outcomes: <code>P(X = "cat") = 0.7</code></li>
      <li><b>PDF</b> (probability density function) for continuous: bell curve, etc.</li>
    </ul>
    <p><b>Expectation</b> E[X] = average outcome weighted by probability:</p>
    <pre><code>E[X] = Σ x · P(X = x)

Die: E[X] = 1·(1/6) + 2·(1/6) + ... + 6·(1/6) = 3.5</code></pre>
    <p><b>Conditional probability</b> P(A | B) = "probability of A given that B happened":</p>
    <pre><code>P(A | B) = P(A and B) / P(B)</code></pre>
    <p><b>Bayes' theorem</b> — flip the conditional:</p>
    <span class="formula">P(A | B) = P(B | A) · P(A) / P(B)</span>
    <p><b>Worked Bayes example.</b> Disease affects 1% of people. Test is 99% accurate. You test positive. What's the chance you have it?</p>
    <pre><code>P(disease | positive)
= P(positive | disease) · P(disease) / P(positive)
= 0.99 · 0.01 / [0.99·0.01 + 0.01·0.99]
= 0.0099 / 0.0198
= 0.5  (50%!)</code></pre>
    <p>Intuition: false positives from the 99% of healthy people swamp the true positives from the 1% who are sick.</p>`},
    {h:"Entropy, cross-entropy, KL — the LLM loss function", body:`<details class="try"><summary>🎯 Try first: model says cat=0.9, dog=0.1. True label is cat. Cross-entropy?</summary><div class="ans">Answer: <b>-log(0.9) ≈ 0.105</b>. Only the true class contributes: -1·log(p_cat). If model said cat=0.5, loss would be -log(0.5)≈0.69, much worse.</div></details>
    <p>Three info-theory quantities. Memorize what each means.</p>
    <h4>Entropy H(p)</h4>
    <p>"How much uncertainty does this distribution have?"</p>
    <span class="formula">H(p) = -Σ p(x) · log p(x)</span>
    <ul>
      <li>Coin flip 50/50 → H = 1 bit (maximum uncertainty)</li>
      <li>Coin always heads → H = 0 (no uncertainty)</li>
    </ul>
    <h4>Cross-entropy H(p, q)</h4>
    <p>"How many bits do I waste using distribution q to encode events from distribution p?"</p>
    <span class="formula">H(p, q) = -Σ p(x) · log q(x)</span>
    <p>p = true distribution (correct token = 100%, others 0%). q = model's predicted distribution. <b>Minimizing H(p, q) = training the LLM.</b></p>
    <p><b>Concrete example.</b> True next token is "cat" (one-hot). Model outputs:</p>
    <pre><code>q("cat") = 0.7
q("dog") = 0.2
q("bird") = 0.1

Cross-entropy = -(1·log(0.7) + 0·log(0.2) + 0·log(0.1))
              = -log(0.7) ≈ 0.357

If model output q("cat") = 0.99:
CE = -log(0.99) ≈ 0.010  ← lower loss, better</code></pre>
    <h4>KL divergence KL(p ‖ q)</h4>
    <p>"How different are distributions p and q?"</p>
    <span class="formula">KL(p ‖ q) = Σ p(x) · log(p(x)/q(x)) = H(p, q) − H(p)</span>
    <p>Always ≥ 0. Zero only when p = q. Used in RLHF and DPO as a "stay close to the original model" anchor.</p>
    <div class="callout"><b>The summary:</b> LLMs are trained by minimizing cross-entropy between true next-token distribution (one-hot) and model's predicted distribution (softmax over vocab). Every gradient step nudges parameters so the model puts more probability mass on correct tokens.</div>`},
    {h:"From-scratch linear regression (pure numpy)", body:"<p>Derive gradients by hand, then code.</p>", code:`import numpy as np\nnp.random.seed(0)\nX = np.random.randn(100,1)\ny = 3*X.squeeze() + 2 + 0.1*np.random.randn(100)\n\nw, b, lr = np.random.randn(), 0.0, 0.1\nfor s in range(200):\n    yhat = w*X.squeeze() + b\n    loss = ((yhat - y)**2).mean()\n    grad_w = 2*((yhat - y)*X.squeeze()).mean()\n    grad_b = 2*(yhat - y).mean()\n    w -= lr*grad_w; b -= lr*grad_b\n    if s % 20 == 0: print(f"{s} {loss:.4f} {w:.3f} {b:.3f}")`},
    {h:"Resources", body:`<ul>
      <li>3Blue1Brown <a href="https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" target="_blank">Essence of Linear Algebra</a> (~3 hrs, watch all)</li>
      <li>3Blue1Brown Essence of Calculus eps 1-6, 9 (~2 hrs)</li>
      <li>Khan Academy — Probability & Statistics</li>
    </ul>`},
    {h:"Why ML needs math at all (read this before fearing it)", body:`<p>Before we go any deeper, let's answer the question that stops many beginners: <b>do I really need math?</b></p>
    <p>The honest answer: you need <b>four ideas</b>, and nothing else, to follow every lesson in this course. Here they are in plain English:</p>
    <ol>
      <li><b>Vectors</b> — a list of numbers. A sentence, an image, a user profile — everything in ML becomes a list of numbers first.</li>
      <li><b>Matrix multiplication</b> — a recipe for transforming one list of numbers into another. Every neural network layer does exactly this.</li>
      <li><b>Derivatives</b> — a way to ask "if I nudge this dial slightly, does the error go up or down?" That answer tells training which direction to move.</li>
      <li><b>Probability</b> — a way to say "I'm not sure, but here are my best guesses with confidence attached." Language models produce a probability for every word they could say next.</li>
    </ol>
    <p><b>Where you will meet each idea in this course:</b></p>
    <table>
      <tr><th>Idea</th><th>Where it appears</th><th>Phase</th></tr>
      <tr><td>Vectors</td><td>Word embeddings — words stored as number lists so similarity can be computed</td><td>Phase 5</td></tr>
      <tr><td>Matrix multiplication</td><td>Every neural network layer: output = input × weight matrix</td><td>Phase 4</td></tr>
      <tr><td>Derivatives</td><td>Gradient descent — the engine that trains every model</td><td>Phase 4</td></tr>
      <tr><td>Probability</td><td>Next-token prediction — the LLM picks the next word using a probability distribution</td><td>Phase 7</td></tr>
    </table>
    <p><b>What you do NOT need:</b> calculus proofs, Greek-letter theorems, or a university degree. High-school algebra and patience are enough. Every formula in this course will be explained with real numbers before any symbols appear.</p>
    <p><b>Mental model:</b> think of math as a language, not a talent. You are not discovering whether you are "a math person." You are learning four words in a new language. The words happen to use + and × instead of letters, but the learning process is identical.</p>
    <p><b>Common novice mistakes:</b></p>
    <ul>
      <li>Skipping the math and copy-pasting code — you will get stuck the first time a shape error appears and have no idea why.</li>
      <li>Trying to memorize every formula before moving on — understand the <em>purpose</em> first; the symbols will follow naturally.</li>
      <li>Thinking "I'm not smart enough" — the people who built these tools learned the same four ideas from scratch, just like you are now.</li>
    </ul>`},
    {h:"Vectors: arrows AND lists at the same time", body:`<p>You already met vectors in the first lesson of this phase. Now we will slow down and build the intuition properly — because vectors are the single most reused idea in all of machine learning.</p>
    <p><b>Three ways to read the same vector [3, 4]:</b></p>
    <ol>
      <li><b>A point on a map.</b> Walk 3 steps east, 4 steps north. You land at point (3, 4).</li>
      <li><b>An arrow from the origin.</b> Draw a line from (0, 0) to (3, 4). That arrow IS the vector. Its direction and length contain all the information.</li>
      <li><b>A list of features.</b> A house: bedrooms = 3, bathrooms = 4. Nothing geometric — just two measurements stored together.</li>
    </ol>
    <p>In ML, the third view (feature list) is what you will use most often. The geometric view (arrow) is what makes similarity computable.</p>
    <p><b>Worked example — length via Pythagoras:</b></p>
    <p>The vector [3, 4] is an arrow. How long is it? Pythagoras says: length = &radic;(3&sup2; + 4&sup2;).</p>
    <p>Step by step: 3&sup2; = 9. 4&sup2; = 16. 9 + 16 = 25. &radic;25 = <b>5</b>.</p>
    <p>So the vector [3, 4] has length 5. In numpy: <code>np.linalg.norm([3, 4])</code> gives 5.0.</p>
    <p>For a longer vector like [1, 2, 2]: length = &radic;(1 + 4 + 4) = &radic;9 = 3. Pythagoras extends to any number of dimensions — just square each number, sum them, take the square root.</p>
    <p><b>Mental model:</b> the length of a vector (also called its "norm" or "magnitude") tells you how strong that set of features is in total. Two vectors can point in the same direction but have different lengths. When comparing similarity, we usually care about direction, not length — so we divide each vector by its length to make it a "unit vector" of length 1. That is called normalizing.</p>
    <p><b>Common novice mistakes:</b></p>
    <ul>
      <li>Thinking vectors are only a geometry concept. In ML, most vectors are just feature lists — [age, salary, years_of_experience]. The geometry is a reasoning tool, not the storage format.</li>
      <li>Confusing a vector [3, 4] (one-dimensional list of numbers) with a matrix [[3, 4]] (a row inside a 2D grid). They look similar but have different shapes in numpy: (2,) versus (1, 2).</li>
      <li>Forgetting that "length" and "number of elements" are different things. The vector [3, 4] has 2 elements but a geometric length of 5.</li>
    </ul>`},
    {h:"Dot product, worked to the digit", body:`<p>The dot product is the most important arithmetic operation in modern AI. Attention in transformers, cosine similarity in search, every dense layer in a network — all of them use it. Let's build it from scratch with real digits.</p>
    <p><b>Definition:</b> multiply matching elements, then add up all the products.</p>
    <p><b>Worked example:</b> [2, 1] &middot; [3, 4]</p>
    <p>Step 1 — multiply matching pairs: 2 &times; 3 = 6, and 1 &times; 4 = 4.</p>
    <p>Step 2 — add the products: 6 + 4 = <b>10</b>.</p>
    <p>That is the entire operation. One number comes out, no matter how long the vectors are.</p>
    <p><b>What does 10 mean?</b> The dot product measures <b>alignment</b> — how much the two vectors point in the same direction:</p>
    <ul>
      <li><b>Large positive number</b> → vectors point the same way → highly related.</li>
      <li><b>Zero</b> → vectors are perpendicular → completely unrelated (no shared signal).</li>
      <li><b>Negative number</b> → vectors point in opposite directions → negatively related.</li>
    </ul>
    <p><b>Mental model:</b> imagine you are grading a student's answer against a model answer. The dot product counts how much they agree, feature by feature, and sums up the agreement. A high score means strong agreement.</p>
    <p><b>Forward hook — transformers:</b> when a transformer model reads a sentence, each word has a "query" vector and a "key" vector. The attention score between two words is simply query &middot; key — a dot product. A high score means "word A should pay attention to word B." This is why dot products are everywhere in LLMs.</p>
    <p><b>Common novice mistakes:</b></p>
    <ul>
      <li>Confusing dot product with element-wise multiplication. [2,1] &middot; [3,4] = 10 (one number). [2,1] * [3,4] = [6, 4] (still a vector). These are completely different operations with different uses.</li>
      <li>Expecting a vector back. The dot product always outputs a single number (a scalar), never a vector.</li>
      <li>Forgetting that order does not matter for dot products: a &middot; b = b &middot; a always.</li>
    </ul>`, code:`import numpy as np

a = np.array([2, 1])
b = np.array([3, 4])

# Method 1: manual
print(2*3 + 1*4)         # 10

# Method 2: numpy dot
print(np.dot(a, b))      # 10

# Method 3: @ operator (works on 1D arrays too)
print(a @ b)             # 10

# Element-wise multiply is different — gives a vector
print(a * b)             # [6 4]  (NOT the same thing)`},
    {h:"Matrix multiply = many dot products", body:`<p>You already know the dot product — multiply matching elements, add them up. Matrix multiplication is just that operation repeated for every cell in the result. Nothing new to learn, just more of the same.</p>
    <p><b>The rule:</b> to fill cell (row i, column j) of the result, take the dot product of row i from the left matrix with column j from the right matrix.</p>
    <p><b>Worked example — every cell's arithmetic written out:</b></p>
    <p>A = [[1, 2], [3, 4]] and B = [[5, 6], [7, 8]]. We want C = A &times; B.</p>
    <p>Cell (1,1) — row 1 of A is [1, 2], column 1 of B is [5, 7]. Dot product: 1 &times; 5 + 2 &times; 7 = 5 + 14 = <b>19</b>.</p>
    <p>Cell (1,2) — row 1 of A is [1, 2], column 2 of B is [6, 8]. Dot product: 1 &times; 6 + 2 &times; 8 = 6 + 16 = <b>22</b>.</p>
    <p>Cell (2,1) — row 2 of A is [3, 4], column 1 of B is [5, 7]. Dot product: 3 &times; 5 + 4 &times; 7 = 15 + 28 = <b>43</b>.</p>
    <p>Cell (2,2) — row 2 of A is [3, 4], column 2 of B is [6, 8]. Dot product: 3 &times; 6 + 4 &times; 8 = 18 + 32 = <b>50</b>.</p>
    <p>Result: C = [[19, 22], [43, 50]].</p>
    <p><b>Shape rule:</b> a matrix of shape (m &times; n) multiplied by a matrix of shape (n &times; p) gives a result of shape (m &times; p). The two middle numbers must match — this is the "inner dimensions must agree" rule. The outer numbers (m and p) survive into the result.</p>
    <p>Mantra: <b>"inner numbers must match; outer numbers become the result shape."</b></p>
    <p>Example: (3 &times; 4) times (4 &times; 7) is fine. Inner numbers are both 4. Result is (3 &times; 7).</p>
    <p><b>Mental model:</b> a matrix multiplication takes data in one space and transforms it into another space. Every neural network layer does exactly this: it takes your input vector, multiplies by a weight matrix, and produces a new vector — a transformed representation of the same information.</p>
    <p><b>Common novice mistakes:</b></p>
    <ul>
      <li>Trying to multiply (2 &times; 3) by (2 &times; 3). The inner dimensions are 3 and 2 — they do not match. This will raise a shape error.</li>
      <li>Thinking matrix multiply is commutative. A &times; B and B &times; A are almost always different. Order matters.</li>
      <li>Using * instead of @ in numpy. The * operator does element-wise multiply. The @ operator does matrix multiply. They produce completely different results.</li>
    </ul>`, code:`import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

C = A @ B
print(C)
# [[19 22]
#  [43 50]]

# Verify one cell by hand
print(1*5 + 2*7)   # 19 — cell (0,0)
print(1*6 + 2*8)   # 22 — cell (0,1)

# Shape rule demo: (2x2) @ (2x2) -> (2x2)
print(A.shape, B.shape, C.shape)   # (2, 2) (2, 2) (2, 2)

# Wrong order gives a different result
print(B @ A)
# [[23 34]
#  [31 46]]  <- not the same as A @ B`},
    {h:"Derivative = slope, gradient = many slopes", body:`<p>Training a neural network means finding the parameter settings that make the model's errors as small as possible. Derivatives are the tool that tells us which way to move each parameter to reduce the error. Without derivatives, training is impossible.</p>
    <p><b>What a derivative is in plain English:</b> it is the slope of a curve at one specific point. Slope means "how steeply is the output changing as I increase the input by a tiny amount?"</p>
    <p><b>Worked example — f(x) = x&sup2;, at x = 3:</b></p>
    <p>f(3) = 3 &times; 3 = 9.</p>
    <p>Now nudge x up by a tiny amount: f(3.01) = 3.01 &times; 3.01 = 9.0601.</p>
    <p>The output changed by 9.0601 &minus; 9 = 0.0601 when the input changed by 0.01.</p>
    <p>Slope &asymp; 0.0601 &divide; 0.01 = <b>6.01</b>. The exact derivative of x&sup2; is 2x, and 2 &times; 3 = 6. The tiny numerical experiment confirms it. ✓</p>
    <p><b>Gradient = the derivative for every dial at once.</b> A neural network has millions of parameters (dials). The gradient is a list of slopes — one slope per parameter. Each slope says "if you increase this parameter, the error goes up by this much."</p>
    <p>Because the gradient points uphill (toward higher error), training walks in the <em>opposite</em> direction. This is gradient descent.</p>
    <p><b>One step of gradient descent with real numbers:</b></p>
    <p>Current x = 3, slope at x = 2 &times; 3 = 6, learning rate (step size) = 0.1.</p>
    <p>New x = 3 &minus; 0.1 &times; 6 = 3 &minus; 0.6 = <b>2.4</b>.</p>
    <p>Check: f(2.4) = 2.4 &times; 2.4 = <b>5.76</b>. Previous error was f(3) = 9. Error went down. The step worked.</p>
    <p><b>Mental model:</b> you are hiking in fog and want to reach the valley. You cannot see the valley, but you can feel which way the ground slopes under your feet. Take one step downhill. Check the slope again. Repeat. That is gradient descent.</p>
    <p><b>Common novice mistakes:</b></p>
    <ul>
      <li>Confusing "gradient" (a vector of all slopes) with "derivative" (the slope for one variable). They are related — the gradient is built from derivatives — but they are not the same word.</li>
      <li>Using a learning rate that is too large. If the step is too big, you jump over the valley and land on the other side, possibly higher than where you started. Training diverges.</li>
      <li>Forgetting the minus sign. We subtract the gradient because the gradient points uphill and we want to go downhill.</li>
    </ul>`},
    {h:"Chain rule with real numbers", body:`<p>Almost every interesting function in ML is made by chaining simpler functions together. For example: take the input, double it, then square the result. The chain rule is the formula for finding the derivative of such composed functions. It is also the mathematical foundation of backpropagation — the algorithm that trains every neural network.</p>
    <p><b>The composed function we will use:</b></p>
    <p>Let g(x) = 2x (the inner function — doubles the input).</p>
    <p>Let f(u) = u&sup2; (the outer function — squares whatever it receives).</p>
    <p>The composed function is h(x) = f(g(x)) = (2x)&sup2;.</p>
    <p><b>Computing h at x = 3:</b></p>
    <p>Step 1 — apply inner function: g(3) = 2 &times; 3 = 6.</p>
    <p>Step 2 — apply outer function: h(3) = f(6) = 6 &times; 6 = 36.</p>
    <p><b>Chain rule formula:</b> h'(x) = f'(g(x)) &times; g'(x).</p>
    <p>In words: outer derivative (evaluated at the inner function's output) times inner derivative.</p>
    <p><b>Applying it at x = 3:</b></p>
    <p>g(3) = 6 (inner output, computed above).</p>
    <p>f'(u) = 2u, so f'(g(3)) = f'(6) = 2 &times; 6 = 12.</p>
    <p>g'(x) = 2 (derivative of 2x is just 2).</p>
    <p>h'(3) = 12 &times; 2 = <b>24</b>.</p>
    <p><b>Numerical verification:</b> h(3.01) = (2 &times; 3.01)&sup2; = (6.02)&sup2; = 36.2404. Change in output = 36.2404 &minus; 36 = 0.2404. Change in input = 0.01. Slope &asymp; 0.2404 &divide; 0.01 = <b>24.04</b>. Matches the chain rule answer. ✓</p>
    <p><b>Why this matters for ML:</b> a neural network is a chain of dozens or hundreds of functions layered on top of each other. To train the network, we need the derivative of the final loss with respect to every single weight. The chain rule lets us compute that by multiplying local slopes together, layer by layer, walking backward from the output to the input. PyTorch does this automatically (it is called autograd), but the math it is doing is exactly this chain rule, applied hundreds of times.</p>
    <p><b>Common novice mistakes:</b></p>
    <ul>
      <li>Forgetting to evaluate the outer derivative at g(x), not at x. The outer derivative f'(u) must be evaluated at u = g(x), not at the original input x.</li>
      <li>Multiplying in the wrong order. The chain rule is a product of two derivatives — order does not matter for multiplication, but it does matter when you extend to vectors (Jacobians), where order reverses.</li>
      <li>Thinking you need to apply the chain rule by hand in practice. PyTorch's autograd handles it. Understanding the rule helps you debug exploding/vanishing gradients — both are symptoms of chain-rule products becoming too large or too small across many layers.</li>
    </ul>`, code:`import numpy as np

# Composed function: h(x) = (2x)^2
def g(x): return 2 * x
def f(u): return u ** 2
def h(x): return f(g(x))

x = 3
print("h(3) =", h(x))      # 36

# Chain rule: h'(x) = f'(g(x)) * g'(x)
# f'(u) = 2u, g'(x) = 2
gx    = g(x)                # 6
df_du = 2 * gx              # 12  (outer derivative at inner output)
dg_dx = 2                   # 2   (inner derivative)
chain = df_du * dg_dx
print("chain rule h'(3) =", chain)   # 24

# Numerical verification
dx = 0.01
numerical = (h(x + dx) - h(x)) / dx
print("numerical slope  =", round(numerical, 2))  # ~24.04`},
  ],
  quiz:[
    {type:"mcq", q:"Why -∇L not +∇L in gradient descent?", options:["∇L points to max loss; we want min","Convention","Numerical","Faster"], answer:0, explain:"Gradient = steepest ASCENT. Negate to descend."},
    {type:"mcq", q:"For A@B with shapes (3,4) and B, B must be:", options:["(3,k)","(4,n)","(n,3)","Any"], answer:1, explain:"Inner dims match: (3,4)@(4,n)=(3,n)."},
    {type:"mcq", q:"det(A)=0 means:", options:["A is identity","A collapses space → no inverse","A is symmetric","A rotates 90°"], answer:1, explain:"Zero volume scale = squished dimension = singular."},
    {type:"mcq", q:"Cross-entropy is minimized when:", options:["Outputs equal labels","Predicted distribution matches true distribution","Entropy max","KL=1"], answer:1, explain:"H(p,q) = H(p) + KL(p‖q). Min CE = min KL = match distributions."},
    {type:"mcq", q:"σ'(z) = ?", options:["σ(z)","1-σ(z)","σ(z)(1-σ(z))","e⁻ᶻ"], answer:2, explain:"Classic identity. Memorize."},
    {type:"short", q:"Why is dot product useful for similarity?", model:"a·b = |a||b|cosθ. Aligned vectors → high. Perpendicular → 0. Opposite → negative. Normalize to unit length → exactly cosine similarity in [-1,1]. Attention uses Q·Kᵀ for exactly this reason.", rubric:["cosθ","perpendicular=0","attention uses it"]},
    {type:"short", q:"Why is backprop just chain rule?", model:"d/dx f(g(x)) = f'(g(x))·g'(x). Neural net = composition fₙ(fₙ₋₁(...f₁(x))). Loss = scalar at end. To get ∂L/∂param, multiply local gradients backward layer by layer. Each layer hands downstream gradient back times its own local Jacobian. That's backprop.", rubric:["chain rule","composition","multiply backward"]},
  ],
  project:{title:"Phase 1 deliverable", steps:["phase1_linreg_scratch.py converges (w≈3,b≈2)","Math notes pushed","Can whiteboard backprop unaided"]}
}
));
