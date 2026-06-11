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
