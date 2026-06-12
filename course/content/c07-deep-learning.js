// c07-deep-learning — course content. Must load before course/engine.js.
window.COURSE_PHASES = window.COURSE_PHASES || [];
COURSE_PHASES.push(Object.assign({ order: 7 },
{ id:5, title:"Phase 4 — Deep Learning + PyTorch", est:"35-50 hrs",
  intro:"Karpathy's <i>Neural Networks: Zero to Hero</i> is mandatory. Code along, don't just watch.",
  lessons:[
    {h:"What a neural network IS (in plain English)", body:`<p><b>A neural network is a function.</b> Input goes in, output comes out. The "neural" part just means the function is built by stacking simple math operations (matmul + nonlinearity).</p>
    <p><b>Why do we use them?</b> Because we don't know the function we want. We have examples of (input, correct_output) pairs. We let the network "learn" the function by adjusting its parameters until it matches the examples.</p>
    <p><b>Single neuron:</b> takes inputs x, multiplies by weights w, adds bias b, passes through an activation function σ:</p>
    <span class="formula">y = σ(w · x + b)</span>
    <p>Mental model: it's a linear regression with a nonlinear twist at the end.</p>
    <p><b>Why the nonlinearity?</b> Without σ, stacking 100 linear layers = still one linear function. Useless. The σ (ReLU, GELU, sigmoid) bends the function so stacking gives you expressive power.</p>`},
    {h:"By-hand 2-neuron example", body:`<details class="try"><summary>🎯 Try first: input x=2, weight w=3, bias b=1, ReLU activation. Output?</summary><div class="ans">Answer: <b>7</b>. Linear part: 3·2 + 1 = 7. ReLU(max(0, 7)) = 7. If x had been -3: 3·(-3)+1 = -8, ReLU → 0.</div></details>
    <p>Let's compute one forward pass of a tiny network: 2 inputs → 1 hidden layer with 2 neurons → 1 output.</p>
    <pre><code>x = [0.5, -1.0]              # input (2 numbers)

# Layer 1: 2 inputs → 2 neurons
W1 = [[0.8, 0.2],            # weights for neuron 1
      [-0.5, 0.4]]            # weights for neuron 2
b1 = [0.1, -0.1]

h_raw = W1 @ x + b1
      = [0.8*0.5 + 0.2*(-1) + 0.1,    -0.5*0.5 + 0.4*(-1) + (-0.1)]
      = [0.4 - 0.2 + 0.1,             -0.25 - 0.4 - 0.1]
      = [0.3, -0.75]

# ReLU activation: max(0, x) element-wise
h = [max(0, 0.3), max(0, -0.75)]
  = [0.3, 0]                  # ← second neuron "dies" because negative

# Layer 2: 2 inputs → 1 output
W2 = [1.0, -2.0]
b2 = 0.5

y = W2 @ h + b2
  = 1.0*0.3 + (-2.0)*0 + 0.5
  = 0.8                       # final output</code></pre>
    <p>That's a forward pass. Training works by adjusting W1, W2, b1, b2 (the "parameters") via backprop to make y match the target.</p>`},
    {h:"Perceptron → MLP", body:`<p>Stack many neurons in a layer → <b>fully connected layer</b>. Stack many layers → <b>multilayer perceptron (MLP)</b>. That's the simplest deep neural net.</p>
    <p><b>Universal approximation theorem:</b> an MLP with 1 hidden layer of enough width can approximate any continuous function. But "enough" might be millions of neurons.</p>
    <p><b>Why go deep instead of wide?</b> Deep nets reuse intermediate computations and learn hierarchical features (edges → shapes → objects). Way more parameter-efficient than wide-and-shallow.</p>`},
    {h:"Activations — what they are and why each exists", body:`<p>Activations are the nonlinear "bend" applied after each linear layer. Without them, deep stacks collapse to one linear function.</p>
    <div data-widget="act-viz"></div>
    <table>
      <tr><th>Name</th><th>Formula</th><th>Where used</th><th>Why</th></tr>
      <tr><td>Sigmoid</td><td>1/(1+e⁻ˣ)</td><td>Binary classifier output</td><td>Squeezes any real number into (0,1) — looks like probability. Avoid in hidden layers — derivatives max at 0.25 → vanishing gradients in deep stacks.</td></tr>
      <tr><td>Tanh</td><td>(eˣ−e⁻ˣ)/(eˣ+e⁻ˣ)</td><td>Historical RNN hidden layers</td><td>Like sigmoid but range (-1, 1), zero-centered. Better than sigmoid hidden but still vanishes.</td></tr>
      <tr><td>ReLU</td><td>max(0, x)</td><td>CNN hidden layers, MLPs</td><td>Cheap. No vanishing for positive values. Risk: "dead neurons" stuck outputting 0.</td></tr>
      <tr><td>GELU</td><td>x · Φ(x) (Φ = Gaussian CDF)</td><td>Transformer FFN (GPT-2, BERT)</td><td>Smooth version of ReLU. Slight quality boost over ReLU.</td></tr>
      <tr><td>SiLU / Swish</td><td>x · σ(x)</td><td>Llama, modern LLMs</td><td>Similar to GELU. Empirically performs slightly better in some LLM architectures.</td></tr>
      <tr><td>Softmax</td><td>eˣⁱ / Σ eˣʲ</td><td>Multi-class output layer + attention</td><td>Turns a vector into a probability distribution (entries sum to 1). Always last layer for classification.</td></tr>
    </table>
    <p><b>Rule of thumb:</b> for new code, use GELU in transformers, ReLU otherwise. Don't experiment with activations early — focus on data + scale.</p>`},
    {h:"Optimizers — how parameters get updated", body:`<p>After backprop computes gradient ∇L, the <b>optimizer</b> uses it to update parameters. Different strategies trade off speed vs stability.</p>
    <h4>SGD (Stochastic Gradient Descent)</h4>
    <p><code>W ← W - α · ∇L</code> — take a step in steepest-descent direction, size α (learning rate).</p>
    <p>Simple but noisy. Needs careful LR schedule. Default in some image CNN papers.</p>
    <h4>SGD + Momentum</h4>
    <p>Keep a running average of gradients (velocity v):</p>
    <pre><code>v ← β·v + ∇L         (β=0.9 typical)
W ← W - α·v</code></pre>
    <p>Accelerates updates in directions where gradient consistently points. Damps noisy directions.</p>
    <p>Analogy: rolling a ball downhill instead of teleporting each step. Builds speed in good directions.</p>
    <h4>Adam</h4>
    <p>Tracks per-parameter adaptive learning rate using first moment (mean) and second moment (variance) of gradients. Each parameter gets a custom step size based on its own gradient history.</p>
    <p>Result: trains fast on diverse parameter scales. Default for most NN work in 2015-2020.</p>
    <h4>AdamW (Adam + decoupled weight decay)</h4>
    <p>Adam has a subtle bug: L2 regularization gets scaled by the adaptive LR, making it weaker on big-gradient parameters. AdamW fixes this by applying weight decay separately.</p>
    <p><b>Use AdamW for all transformer / LLM training.</b> Typical params: <code>lr=3e-4 (small) to 6e-4, β1=0.9, β2=0.95, weight_decay=0.1</code>.</p>
    <h4>LR schedule (cosine + warmup)</h4>
    <p>Constant LR is bad — too high causes instability, too low wastes compute. LLMs use:</p>
    <ol>
      <li><b>Warmup</b>: 1-5% of total steps, linearly ramp LR from 0 to peak. Lets Adam's moment estimates and LayerNorm stats settle before applying full LR.</li>
      <li><b>Cosine decay</b>: smoothly drop LR following half a cosine curve until end of training. Hits ~10% of peak by the end.</li>
    </ol>`},
    {h:"Normalization", body:`<ul>
      <li><b>BatchNorm</b>: across batch dim. CNN standard.</li>
      <li><b>LayerNorm</b>: across feature dim per sample. <b>Transformer standard</b>.</li>
      <li><b>RMSNorm</b>: cheaper LayerNorm. Llama, modern LLMs.</li>
    </ul>`},
    {h:"PyTorch minimum viable model — every line explained", body:`<p><b>Why run this:</b> minimal but COMPLETE pattern for training any neural net in PyTorch. Synthetic data + 3-layer MLP + AdamW + cross-entropy. Memorize this shape — you'll reuse it for every subsequent project.</p>
    <p><b>How to run:</b></p>
    <pre><code>uv pip install torch
python mlp_demo.py
# Expect: 10 epoch lines with decreasing loss. Random data → loss approaches but
# never reaches 0 because labels are random.</code></pre>
    <p><b>What each block does:</b></p>
    <ol>
      <li><b>Imports + device.</b> <code>nn</code> for layers, <code>F</code> for stateless functions like <code>cross_entropy</code>. <code>device</code> auto-picks GPU if available.</li>
      <li><b>MLP class.</b> <code>nn.Module</code> = base class for all PyTorch models. <code>__init__</code> registers learnable layers. <code>forward</code> defines how input flows through them.</li>
      <li><b>nn.Sequential.</b> Convenience container: layers run in order. <code>Linear(a,b)</code> = matmul + bias from <code>a</code>-dim to <code>b</code>-dim. <code>GELU</code> = smooth nonlinearity.</li>
      <li><b>Synthetic data.</b> 1000 samples, 20 features, 5 classes. Random — only here to demonstrate the loop.</li>
      <li><b>DataLoader.</b> Wraps <code>TensorDataset</code>, gives mini-batches. <code>shuffle=True</code> randomizes order each epoch.</li>
      <li><b>Optimizer.</b> AdamW = transformer default. <code>lr=3e-4</code> = Karpathy's "constant for small models". <code>weight_decay</code> = L2-style regularization.</li>
      <li><b>Training loop.</b> Inner loop = one optimizer step per batch. Same 5 lines for EVERY PyTorch training, period.</li>
    </ol>`, code:`import torch
import torch.nn as nn                          # layers + Module base
import torch.nn.functional as F                # stateless math (loss fns, activations)
from torch.utils.data import DataLoader, TensorDataset

# auto-pick fastest device
device = "cuda" if torch.cuda.is_available() else "cpu"

# ---- model definition ----
class MLP(nn.Module):                          # inherit from Module → param tracking + .to() + .train()/.eval()
    def __init__(self, in_d, hid, out_d):
        super().__init__()                     # MUST call: registers _parameters dict
        self.net = nn.Sequential(              # layers run in order
            nn.Linear(in_d, hid),              # matmul (in_d→hid) + bias. Learnable.
            nn.GELU(),                         # nonlinearity. Without this, stack collapses to one linear.
            nn.Linear(hid, hid),               # second hidden layer (depth helps)
            nn.GELU(),
            nn.Linear(hid, out_d),             # output layer: hid→num_classes. No softmax here — CrossEntropyLoss adds it.
        )
    def forward(self, x):                      # called by model(x). PyTorch sets up autograd graph.
        return self.net(x)

# ---- fake data ----
X = torch.randn(1000, 20)                      # 1000 samples, 20 features each (continuous)
y = torch.randint(0, 5, (1000,))               # 1000 integer class labels in [0..4]

# DataLoader batches + shuffles each epoch
loader = DataLoader(TensorDataset(X, y), batch_size=64, shuffle=True)

# ---- instantiate + move to GPU ----
model = MLP(in_d=20, hid=128, out_d=5).to(device)

# AdamW: adaptive LR per param + decoupled weight decay. Standard for NN.
opt = torch.optim.AdamW(
    model.parameters(),                        # all learnable tensors (auto-collected from nn.Module)
    lr=3e-4,                                   # learning rate; tune ±10× and watch loss
    weight_decay=0.01,                         # L2-style regularization (penalizes large weights)
)

# ---- training loop (memorize this shape) ----
for epoch in range(10):
    for xb, yb in loader:                      # mini-batches of (batch_size, 20) and (batch_size,)
        xb, yb = xb.to(device), yb.to(device)  # ship batch to GPU

        # FORWARD
        logits = model(xb)                     # raw scores, shape (batch, 5)
        loss = F.cross_entropy(logits, yb)     # combines log_softmax + NLL in one (numerically stable)

        # BACKWARD + UPDATE (3 critical lines)
        opt.zero_grad()                        # clear stale grads. PyTorch ACCUMULATES by default — forgetting = bug.
        loss.backward()                        # autograd: chain-rule backward through every layer
        opt.step()                             # apply update: w -= lr * grad (with AdamW adaptations)

    print(f"epoch {epoch} loss {loss.item():.4f}")
    # .item() pulls scalar tensor → Python float (only for printing/logging)`},
    {h:"Karpathy Zero-to-Hero (mandatory) — full companion guide", body:`<div class="callout warn"><b>Hard rule:</b> never just watch. Open VS Code beside the video, pause every 60s, type along, run the cell. If you can't reproduce the cell without peeking, rewatch that segment.</div>
    <h4>Video 1 — Building micrograd (~2.5 hrs)</h4>
    <p><a href="https://www.youtube.com/watch?v=VMj-3S1tku0" target="_blank">youtube.com/watch?v=VMj-3S1tku0</a></p>
    <ul>
      <li><b>What you'll build:</b> an autograd engine in ~200 lines of pure Python. No PyTorch.</li>
      <li><b>Key timestamps to revisit:</b> backward pass derivation (~1:00), topological sort (~1:30), neural net class (~2:00)</li>
      <li><b>After watching:</b> close the video, recreate <code>Value</code> class + neural net from memory. If stuck &gt;10 min on a section, rewatch.</li>
      <li><b>Deliverable for repo:</b> <code>micrograd.py</code> + a notebook training MLP on toy data.</li>
    </ul>
    <h4>Video 2 — makemore part 1 (bigram model) (~2 hrs)</h4>
    <p><a href="https://www.youtube.com/watch?v=PaCmpygFfXo" target="_blank">youtube.com/watch?v=PaCmpygFfXo</a></p>
    <ul>
      <li><b>Build:</b> character-level bigram language model on names dataset</li>
      <li><b>Concept introduced:</b> negative log likelihood = cross entropy</li>
      <li><b>Why it matters:</b> shows that probability tables → neural nets is a continuous transition</li>
    </ul>
    <h4>Video 3-5 — makemore parts 2-4 (MLPs, BatchNorm, WaveNet) (~6 hrs total)</h4>
    <p>Each builds on previous. Type along. By end you understand BatchNorm internals, kaiming init, and why we use them.</p>
    <h4>Video 6 — Let's build GPT (~2 hrs)</h4>
    <p><a href="https://www.youtube.com/watch?v=kCc8FmEb1nY" target="_blank">youtube.com/watch?v=kCc8FmEb1nY</a></p>
    <ul>
      <li><b>Build:</b> nanoGPT on Tiny Shakespeare from scratch</li>
      <li><b>Don't fast-forward attention sections.</b> Watch them twice.</li>
      <li><b>This sets up your Phase 6 deliverable</b> — re-implement nanoGPT without peeking.</li>
    </ul>
    <h4>Video 7 — Let's reproduce GPT-2 (124M) (~4 hrs)</h4>
    <p><a href="https://www.youtube.com/watch?v=l8pRSuU81PU" target="_blank">youtube.com/watch?v=l8pRSuU81PU</a></p>
    <ul>
      <li><b>Build:</b> full GPT-2 124M reproduction on FineWeb-Edu</li>
      <li><b>Phase 7 deliverable</b> — your own training run, weights on HF Hub.</li>
      <li>Watch this when you have cloud GPU budget allocated.</li>
    </ul>
    <h4>What you DON'T get from these videos</h4>
    <ul>
      <li>RLHF / DPO — find separately (TRL docs, HuggingFace blog)</li>
      <li>LoRA / QLoRA — Phase 8 covers it</li>
      <li>RAG / agents / production — Phases 10-12</li>
    </ul>`},
    {h:"A neuron is a weighted vote", body:`<p><b>Mental model:</b> picture a club bouncer who decides whether to let a guest in. They score the guest on several criteria — how well dressed, how well known, how early in the night — and each criterion has a different importance weight. They add up the weighted scores, add a personal grumpiness offset (the bias), and if the total clears their threshold they open the rope.</p>
    <p>A neuron does the same thing with numbers. It takes a list of inputs, multiplies each by a weight, adds a bias, then passes the result through an <b>activation function</b> that decides whether the neuron "fires."</p>
    <p><b>Worked example:</b> inputs = [2, 3], weights = [0.5, &minus;1], bias = 1.</p>
    <ul>
      <li>Weighted sum: (2 &times; 0.5) + (3 &times; (&minus;1)) + 1 = 1 &minus; 3 + 1 = &minus;1</li>
      <li>ReLU activation: max(0, &minus;1) = 0 — the neuron stays silent.</li>
    </ul>
    <p>Now change the second weight from &minus;1 to +1:</p>
    <ul>
      <li>Weighted sum: (2 &times; 0.5) + (3 &times; 1) + 1 = 1 + 3 + 1 = 5</li>
      <li>ReLU(5) = 5 — the neuron fires strongly.</li>
    </ul>
    <p>Training adjusts the weights and bias so that the right neurons fire for the right inputs. That is all that learning is at this level.</p>
    <p><b>Common novice mistakes:</b></p>
    <ul>
      <li>Thinking of neurons as brain cells that "understand" — they are just weighted sums followed by a simple math function.</li>
      <li>Forgetting the bias term — without it the neuron cannot fire unless the weighted sum is already positive.</li>
    </ul>`},
    {h:"Why layers? Composition builds concepts", body:`<p><b>Mental model:</b> a single employee can only do one job. Stack specialists — each building on the previous person's output — and you can build cathedrals.</p>
    <p>A single layer of neurons can only draw straight-line boundaries in the input space. But stacking layers lets each layer build on top of what the previous layer detected.</p>
    <p><b>Concrete image-recognition chain:</b></p>
    <ul>
      <li>Layer 1 learns to detect edges — bright-to-dark transitions at various angles.</li>
      <li>Layer 2 combines edges into shapes — corners, curves, circles.</li>
      <li>Layer 3 combines shapes into recognizable objects — an eye, a wheel, a nose.</li>
    </ul>
    <p>Language models follow the same logic: characters &rarr; word fragments &rarr; grammar patterns &rarr; meaning.</p>
    <p><b>The XOR proof that depth matters:</b> the XOR function outputs 1 when inputs differ (0 XOR 1 = 1, 1 XOR 0 = 1) and 0 when they match (0 XOR 0 = 0, 1 XOR 1 = 0). A single layer of neurons literally cannot learn this — the data is not linearly separable. Adding one hidden layer solves it trivially. This was a historically important result that proved depth is not optional for many real problems.</p>
    <p><b>Common novice mistakes:</b></p>
    <ul>
      <li>Adding more neurons to one wide layer instead of adding depth — depth and width are not interchangeable.</li>
      <li>Assuming "more layers is always better" — very deep nets need residual connections to train at all.</li>
    </ul>`},
    {h:"Backprop with three numbers, end to end", body:`<p><b>Mental model:</b> training a model is like tuning a dial on a radio. You listen (forward pass), check how far off the station you are (loss), then decide which direction to turn the dial and by how much (gradient), then actually turn it (weight update). Repeat until the music is clear.</p>
    <p>Backpropagation is the mathematical procedure for computing "which direction and how much" for every dial (weight) in the network simultaneously.</p>
    <p><b>Worked example — the simplest possible network:</b> one weight, no activation, one sample.</p>
    <ul>
      <li>Input x = 2, weight w = 0.5, target y = 3.</li>
      <li><b>Forward pass:</b> prediction = w &times; x = 0.5 &times; 2 = 1.0</li>
      <li><b>Loss (MSE):</b> (prediction &minus; target)&sup2; = (1.0 &minus; 3)&sup2; = (&minus;2)&sup2; = 4</li>
      <li><b>Gradient:</b> how much does the loss change if we nudge w slightly? By the chain rule: dLoss/dw = 2 &times; (prediction &minus; target) &times; x = 2 &times; (&minus;2) &times; 2 = &minus;8</li>
      <li><b>Update</b> (learning rate = 0.1): w<sub>new</sub> = 0.5 &minus; 0.1 &times; (&minus;8) = 0.5 + 0.8 = 1.3</li>
    </ul>
    <p><b>Second forward pass to verify:</b> prediction = 1.3 &times; 2 = 2.6. Loss = (2.6 &minus; 3)&sup2; = (&minus;0.4)&sup2; = 0.16.</p>
    <p>Loss fell from 4 to 0.16 in one step. Keep repeating and the prediction approaches 3.</p>
    <p>Scale this to a network with billions of weights, apply the chain rule automatically across every layer, and that is exactly how every LLM trains. The math is the same; only the scale differs.</p>`, code:`# Plain Python backprop — no libraries
# 1-neuron net: pred = w * x  (no bias, no activation for clarity)

x = 2.0
target = 3.0
w = 0.5
lr = 0.1

for step in range(5):
    pred = w * x                          # forward pass
    loss = (pred - target) ** 2           # MSE loss
    grad = 2 * (pred - target) * x        # dLoss/dw (chain rule)
    w = w - lr * grad                     # gradient descent update
    print(f"step {step}  w={w:.4f}  pred={w*x:.4f}  loss={loss:.4f}")`},
    {h:"The training loop, line by line", body:`<p>Every PyTorch training run — from a tiny toy net to a billion-parameter LLM — uses the same eight-line loop. Memorize its shape once and you can read any training script ever written.</p>
    <p><b>The loop does one full pass over the dataset (one <em>epoch</em>), broken into small batches:</b></p>
    <p>See the annotated code block below. Each line has exactly one job. Nothing is redundant.</p>
    <p><b>Why batches instead of the full dataset at once?</b> Modern datasets are too large to fit in GPU memory. A batch of 32&ndash;256 samples gives the optimizer a good-enough gradient estimate and trains far faster than waiting for the full dataset each step.</p>
    <p><b>Common novice mistakes:</b></p>
    <ul>
      <li><b>Forgetting <code>optimizer.zero_grad()</code>.</b> PyTorch accumulates gradients by default — it adds each new backward pass on top of the old one. Skip the clear and your gradients grow without bound. Training will silently produce garbage.</li>
      <li>Calling <code>loss.backward()</code> before <code>optimizer.zero_grad()</code> — the order must be: zero, forward, loss, backward, step.</li>
      <li>Not switching to <code>model.eval()</code> during validation — dropout stays on and batch-norm uses wrong statistics, giving noisy val numbers.</li>
    </ul>`, code:`# Canonical PyTorch training loop — annotate every line
for epoch in range(num_epochs):              # one epoch = one full pass over the dataset
    for x, y in loader:                      # loader yields one mini-batch at a time
        optimizer.zero_grad()                # CLEAR old gradients — PyTorch accumulates; skip = bug
        pred = model(x)                      # forward pass: input flows through all layers
        loss = loss_fn(pred, y)              # scalar score of how wrong the model is right now
        loss.backward()                      # backprop: compute dLoss/dWeight for every weight
        optimizer.step()                     # update: w = w - lr * grad (with optimizer adjustments)
    print(f"epoch {epoch}  loss {loss.item():.4f}")  # .item() pulls tensor scalar → Python float`},
    {h:"Loss won't go down — the debugging checklist", body:`<p><b>Mental model:</b> training is an experiment. When the experiment fails, work through the checklist from most-likely to least-likely cause. Do not randomly tune hyperparameters hoping to get lucky.</p>
    <p><b>The golden diagnostic test first:</b> before touching a single hyperparameter, try to make the model memorize 10 training samples perfectly. Set batch size to 10, run for many epochs, watch training loss. If it does not reach near-zero:</p>
    <ul>
      <li>There is a bug in your code — wrong loss function, labels and inputs shuffled out of sync, model output shape mismatch. Fix the code first.</li>
    </ul>
    <p>If it memorizes 10 samples easily, your code is correct and you have a hyperparameter or data problem:</p>
    <table>
      <tr><th>Symptom</th><th>Most likely cause</th><th>Try</th></tr>
      <tr><td>Loss explodes or goes NaN</td><td>Learning rate too high</td><td>Divide LR by 10</td></tr>
      <tr><td>Loss flat from the very first step</td><td>LR too low, or data/label mismatch</td><td>Multiply LR by 10; check that inputs and labels are aligned (shuffle bug)</td></tr>
      <tr><td>Loss falls, then climbs back up</td><td>Overfitting</td><td>Get more data, add regularization (dropout, weight decay), or reduce model size</td></tr>
      <tr><td>Loss jumps wildly between steps</td><td>Batch too small or bad samples in data</td><td>Increase batch size; inspect individual samples for corrupted labels</td></tr>
    </table>
    <p><b>Common novice mistakes:</b></p>
    <ul>
      <li>Tuning the learning rate for 30 minutes before running the 10-sample memorization test — you may be tuning around a code bug.</li>
      <li>Declaring "the model can't learn this task" after two training runs — the checklist above resolves 90% of failures.</li>
    </ul>`},
    {h:"Common mistakes + interview prep", body:`<div class="mistake"><b>Mistake #1:</b> forgetting <code>opt.zero_grad()</code> at start of each step → grads accumulate from previous step → wrong updates → loss explodes or doesn't converge.</div>
    <div class="mistake"><b>Mistake #2:</b> not calling <code>model.eval()</code> during validation → dropout still active + BN uses batch stats → noisy/wrong val numbers. Always pair with <code>with torch.no_grad():</code> for speed.</div>
    <div class="mistake"><b>Mistake #3:</b> using <code>GradScaler</code> with bf16. Scaler is fp16-only. With bf16 just use <code>autocast(dtype=torch.bfloat16)</code> and skip the scaler.</div>
    <div class="mistake"><b>Mistake #4:</b> LR too high → loss → NaN. LR too low → flat line. Always start with 3e-4 (AdamW small models) then sweep ±10×.</div>
    <div class="interview"><b>Interview Q:</b> "Why AdamW over Adam for transformers?" → Adam scales weight decay by adaptive LR, weakening regularization on big-grad params. AdamW applies decay separately. Standard for LLMs.</div>
    <div class="interview"><b>Interview Q:</b> "Vanishing gradients — cause + remedies?" → Sigmoid σ' max 0.25 → product of L sigmoids → 0. Remedies: ReLU/GELU (no squash), residual connections (preserve gradient flow), LayerNorm (control activation scale), better init (Xavier/He).</div>
    <div class="interview"><b>Interview Q:</b> "LayerNorm vs BatchNorm — why transformers use LayerNorm?" → BN batch statistics noisy for variable-length sequences and small batches. LN per-sample stats → robust.</div>`},
  ],
  quiz:[
    {type:"mcq", q:"AdamW over Adam for transformers because:", options:["Faster","Decouples weight decay from grad update — fixes Adam bug","No GPU","Same"], answer:1, explain:"In Adam, L2 reg gets scaled by adaptive LR → ineffective. AdamW applies decay separately. LLM standard."},
    {type:"mcq", q:"Vanishing grad with sigmoid because:", options:["σ' max 0.25; deep stack multiplies many ≤0.25 → 0","Sigmoid slow","Float precision","Wrong loss"], answer:0, explain:"σ' max 0.25 at z=0. 0.25^L → 0. ReLU/GELU don't squash."},
    {type:"mcq", q:"LayerNorm > BatchNorm in transformers because:", options:["No batch dim dependency → variable seq length, small batches OK","BN deprecated","LN faster","More params"], answer:0, explain:"BN's batch stats noisy for seqs / small batches. LN per-sample → robust."},
    {type:"mcq", q:"opt.zero_grad() purpose?", options:["Reset model weights","Clear accumulated grads — PyTorch accumulates by default","Reset learning rate scheduler","Switch model to eval mode (disable dropout)"], answer:1, explain:"PyTorch sums grads each backward(). Forgetting causes update compounding. Weights are updated by opt.step(); scheduler reset is scheduler.last_epoch=-1; eval mode is model.eval()."},
    {type:"mcq", q:"Why LR warmup?", options:["Cool GPU","Stabilize Adam moments + LayerNorm stats early → prevent divergence","Required by AdamW","Reg"], answer:1, explain:"Early grads noisy, Adam moments biased. Warm up 1-5% steps to peak, then cosine decay."},
    {type:"short", q:"Why is dropout train-only?", model:"Train: random zero activations with prob p → ensemble regularization, forces redundancy. Eval: deterministic predictions, full capacity. PyTorch handles via model.train() vs model.eval(). Forgetting eval mode = random degraded inference.", rubric:["train regularizer","eval deterministic","model.train/eval"]},
  ],
  project:{title:"Phase 4 deliverable", steps:["micrograd (~200 lines) pushed","MNIST MLP >97%","CIFAR-10 CNN >85%"]}
}
));
