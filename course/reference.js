// course/reference.js — glossary, cheat sheets, model table, one-page explainer.
// Must load before engine.js (or as a standalone data file).
window.REFERENCE = {

  // ─── GLOSSARY (~100 terms, alphabetical) ───────────────────────────────────
  // One plain-English sentence each. Zero assumed knowledge.
  glossary: [
    { t: "activation function", d: "A math function applied inside a neuron that decides whether, and how strongly, that neuron 'fires' — without it, stacking layers would be pointless because the whole network would collapse into one linear equation." },
    { t: "Adam", d: "A popular optimizer (training algorithm) that automatically adjusts the step size for each weight individually, combining ideas from two earlier methods called Momentum and RMSProp." },
    { t: "agent", d: "An AI system that can use tools (web search, code execution, file read/write) in a loop, deciding step-by-step what to do until it completes a task." },
    { t: "AI (Artificial Intelligence)", d: "A broad term for computer systems that perform tasks — like recognising images, translating language, or answering questions — that normally require human-level intelligence." },
    { t: "alignment", d: "The effort to make an AI system behave in ways that are safe, helpful, and consistent with human values rather than pursuing unintended goals." },
    { t: "API (Application Programming Interface)", d: "A set of rules that lets two programs talk to each other — when you call the Claude API, your code sends a message and gets a reply, just like texting a service." },
    { t: "API key", d: "A long secret string (like a password) that proves to a service — such as Anthropic — that your code is authorised to make requests; keep it private." },
    { t: "argmax", d: "The function that picks the item with the highest value from a list — for example, argmax([0.1, 0.7, 0.2]) returns index 1 because 0.7 is largest." },
    { t: "attention", d: "A mechanism that lets a model weigh how much each word (token) should influence every other word when computing meaning — so 'bank' in 'river bank' attends to 'river' more than 'money'." },
    { t: "backpropagation", d: "The algorithm that computes how much each weight in a neural network contributed to the error, then passes that blame signal backwards through the network so weights can be improved." },
    { t: "baseline", d: "A simple reference result (e.g., 'always predict the most common class') that you compare against to know whether your fancier model is actually adding value." },
    { t: "batch", d: "A small group of training examples processed together in one step — instead of updating weights after every single example, you average the error across the batch for more stable training." },
    { t: "batch normalization", d: "A technique that standardises the activations inside a network after each layer so they stay in a consistent range, which speeds up training and makes it more stable." },
    { t: "bias (neuron kind)", d: "An extra learnable number added to a neuron's input sum, letting the neuron shift its output up or down independently of the input values — it's like the y-intercept in y = mx + b." },
    { t: "BPE (Byte Pair Encoding)", d: "A tokenisation algorithm that starts with individual characters (or bytes), then repeatedly merges the most common adjacent pair into one new token — this is how GPT-style models split words." },
    { t: "chain rule", d: "A calculus rule stating that the derivative of a composed function equals the product of the derivatives of its parts — backpropagation applies this rule at every layer of a network." },
    { t: "checkpoint", d: "A saved snapshot of a model's weights at a specific point during training, so you can resume training later or roll back to an earlier state." },
    { t: "chunk", d: "A piece of a document (e.g., a paragraph or fixed-size text window) created by splitting a longer text so it fits within a model's context window for retrieval or processing." },
    { t: "chunking", d: "The process of splitting a long document into smaller chunks before storing them in a vector database, balancing detail (small chunks) against context (large chunks)." },
    { t: "CI/CD", d: "Continuous Integration / Continuous Deployment — automated pipelines that test your code every time you push a change and then deploy it to production automatically if tests pass." },
    { t: "completion", d: "The text that a language model generates in response to a prompt — for example, if you send 'Once upon a time', the completion is whatever the model writes next." },
    { t: "container", d: "A lightweight, self-contained package of code plus all its dependencies (like a portable computer), created with Docker, so the app runs identically anywhere." },
    { t: "context window", d: "The maximum number of tokens a model can 'see' at once — everything (system prompt, conversation history, retrieved documents) must fit inside this limit." },
    { t: "cosine similarity", d: "A measure of how similar two vectors are by computing the cosine of the angle between them — a score of 1 means identical direction, 0 means unrelated, used in embedding search." },
    { t: "cross-entropy", d: "A loss function that measures how surprised the model is by the correct answer — if the model predicted 90% probability for the right token, the loss is low; if it predicted 1%, the loss is high." },
    { t: "CUDA", d: "NVIDIA's programming platform that lets code run on GPU cores — deep learning frameworks like PyTorch use CUDA to speed up matrix operations by thousands of times." },
    { t: "dataset", d: "A collection of examples used to train, validate, or test a model — for example, millions of sentences for a language model or thousands of labelled images for a classifier." },
    { t: "decoder-only", d: "A transformer architecture that generates text one token at a time, where each token can only look at previous tokens (not future ones) — GPT and Claude are decoder-only models." },
    { t: "deep learning", d: "A subset of machine learning that uses neural networks with many layers to learn complex patterns directly from raw data such as images, audio, or text." },
    { t: "deployment", d: "The process of putting a working model or app onto a server so real users can access it over the internet." },
    { t: "derivative", d: "The rate at which a function's output changes when its input changes slightly — if moving the input by 0.001 changes the output by 0.003, the derivative is roughly 3." },
    { t: "distribution", d: "A description of all possible values a random variable can take and how likely each value is — for example, a probability distribution over tokens tells you how likely the model thinks each token is next." },
    { t: "Docker", d: "Software that packages an app and its environment into a container, so the same app runs identically on your laptop, a test server, or a production cloud machine." },
    { t: "dot product", d: "A single number computed by multiplying matching elements of two equal-length lists and summing the results — it measures how aligned (similar) two vectors are." },
    { t: "dropout", d: "A regularisation trick where random neurons are temporarily turned off (set to zero) during each training step, forcing the network to not rely too heavily on any single neuron." },
    { t: "embedding", d: "A fixed-length list of numbers (a vector) that represents a word, sentence, or any item — similar meanings end up as similar vectors, which is how semantic search works." },
    { t: "embedding search", d: "Finding the most relevant documents by converting both the query and stored documents into vectors, then returning the documents whose vectors are closest to the query vector." },
    { t: "emergent ability", d: "A capability that suddenly appears in a model at a certain scale (number of parameters or training data) that was not predictably present in smaller versions." },
    { t: "endpoint", d: "The specific web address (URL) that you send a request to when calling an API — for example, 'https://api.anthropic.com/v1/messages' is the Claude messages endpoint." },
    { t: "environment variable", d: "A named value stored in your operating system (not in your code files) that programs can read — used to store secrets like API keys so they don't get accidentally shared in code." },
    { t: "epoch", d: "One complete pass through the entire training dataset — if you train for 3 epochs, every example is used 3 times total." },
    { t: "eval", d: "Short for evaluation — a set of test inputs with expected outputs used to measure how well a model or prompt is performing, like a report card for AI." },
    { t: "feature", d: "An input variable used to make a prediction — for a house price model, features might be square footage, number of bedrooms, and location." },
    { t: "fine-tuning", d: "Taking a model that was already trained on a huge dataset and training it further on a smaller, more specific dataset so it gets better at a particular task." },
    { t: "function calling", d: "A feature where you describe available functions (tools) to a model, and the model responds with a structured request to call one of them — your code then executes it and returns the result." },
    { t: "generalization", d: "A model's ability to perform well on new examples it has never seen before — a model that only memorised the training data has poor generalization." },
    { t: "GPU", d: "Graphics Processing Unit — a chip originally designed for video games that happens to be extremely fast at the matrix multiplications deep learning needs, speeding up training by 100x or more." },
    { t: "gradient", d: "A vector of derivatives — one derivative per weight — that points in the direction of steepest increase of the loss; gradient descent moves in the opposite direction to reduce loss." },
    { t: "gradient clipping", d: "A technique that caps the size of gradients before applying them so they never grow so large that they destabilise training (exploding gradients)." },
    { t: "gradient descent", d: "The core optimisation algorithm in deep learning: repeatedly measure the loss, compute gradients, and nudge each weight a tiny step in the direction that reduces the loss." },
    { t: "greedy decoding", d: "A text generation strategy where the model always picks the single most probable next token — fast and deterministic but tends to produce repetitive, boring text." },
    { t: "guardrail", d: "A safety check placed around an AI model that blocks or flags harmful inputs or outputs — for example, refusing to generate instructions for dangerous activities." },
    { t: "hallucination", d: "When a language model generates text that sounds confident and fluent but is factually wrong or completely made up — a known limitation of all current LLMs." },
    { t: "hidden layer", d: "Any layer in a neural network that sits between the input layer (raw data) and the output layer (final answer) — the more hidden layers, the 'deeper' the network." },
    { t: "human-in-the-loop", d: "A system design where a human reviews or approves an AI's output at key points before it takes effect, providing an important safety check." },
    { t: "inference", d: "Running a trained model on new inputs to get predictions or generate text — as opposed to training, where you're still updating the model's weights." },
    { t: "inference server", d: "A server optimised specifically for running (inferencing) a model at high speed and low cost, often using specialised memory tricks — vLLM is a popular example." },
    { t: "instruction tuning", d: "A type of fine-tuning where a model is trained on (instruction, response) pairs so it learns to follow natural-language instructions from users." },
    { t: "label", d: "The correct answer for a training example — in a spam filter dataset, each email has a label: 'spam' or 'not spam'." },
    { t: "latency", d: "The time delay between sending a request and receiving the first byte of a response — lower latency = faster-feeling apps." },
    { t: "layer", d: "A group of neurons in a neural network that all process inputs in parallel and pass their outputs to the next layer — networks are built by stacking many layers." },
    { t: "layer normalization", d: "A technique that normalises the values within a single example across its features (unlike batch normalisation, which normalises across examples) — standard in transformers." },
    { t: "learning rate", d: "A number (like 0.001) that controls how large a step the optimizer takes when updating weights — too high and training blows up, too low and it trains very slowly." },
    { t: "learning-rate schedule", d: "A plan for how the learning rate changes over the course of training — for example, starting high, warming up, then slowly decaying." },
    { t: "logarithm", d: "The inverse of exponentiation — log(1000) base 10 equals 3 because 10³=1000; in ML, natural log (base e) is used in cross-entropy loss to heavily penalise confident wrong predictions." },
    { t: "LoRA (Low-Rank Adaptation)", d: "A memory-efficient fine-tuning method that adds tiny trainable matrices to a frozen pretrained model instead of updating all weights, using a fraction of the GPU memory." },
    { t: "loss function", d: "A formula that measures how wrong the model's predictions are — training aims to minimise this number by adjusting weights." },
    { t: "machine learning", d: "A way to build computer programs that learn patterns from examples (data) rather than being programmed with explicit rules for every situation." },
    { t: "matrix", d: "A rectangular grid of numbers arranged in rows and columns — a 3×4 matrix has 3 rows and 4 columns; used everywhere in neural networks to represent batches of data and weight connections." },
    { t: "MCP (Model Context Protocol)", d: "An open standard that lets AI models connect to external tools and data sources (file systems, databases, APIs) through a defined interface, making it easier to build agents." },
    { t: "mean", d: "The average of a set of numbers — add them all up and divide by how many there are; used constantly to summarise data and measure performance." },
    { t: "model", d: "In ML/AI, a mathematical function with millions of learned numbers (parameters) that transforms an input (like text) into an output (like the next word)." },
    { t: "monitoring", d: "Continuously watching a deployed model's performance metrics (latency, error rate, cost, output quality) in production so you can detect problems before users report them." },
    { t: "MSE (Mean Squared Error)", d: "A loss function for regression tasks that computes the average of (prediction − actual)² — squaring penalises large errors more heavily than small ones." },
    { t: "multi-head attention", d: "Running several attention mechanisms in parallel on the same input, each learning to focus on different kinds of relationships, then combining their results." },
    { t: "neuron", d: "The basic building block of a neural network: it takes a weighted sum of its inputs, adds a bias, applies an activation function, and outputs a single number." },
    { t: "norm", d: "A measure of a vector's 'size' or length — the L2 norm (most common) is the square root of the sum of squared values, like distance from the origin in space." },
    { t: "optimizer", d: "An algorithm that uses gradients to update a model's weights during training — Adam and SGD are the two most common optimizers." },
    { t: "overfitting", d: "When a model learns the training data so well (including its noise and quirks) that it performs poorly on new, unseen examples — like memorising answers instead of understanding them." },
    { t: "parameter", d: "A number inside a model that is learned during training — 'weights' and 'biases' are parameters; a large language model has billions of them." },
    { t: "perplexity", d: "A metric for language models that measures how 'surprised' the model is by a test text — lower perplexity means the model predicts the text more confidently and accurately." },
    { t: "positional encoding", d: "Extra information added to each token's embedding to tell the model the token's position in the sequence — because transformers process all tokens at once, they need this to know word order." },
    { t: "pretraining", d: "The first and largest phase of training a language model, where it reads enormous amounts of text and learns to predict the next token — this is where most of the model's knowledge comes from." },
    { t: "probability", d: "A number between 0 and 1 expressing how likely something is — 0 means impossible, 1 means certain, 0.5 means a 50/50 coin flip." },
    { t: "prompt", d: "The text you send to a language model as input — the model reads your prompt and generates a response (completion) based on what it learned during training." },
    { t: "prompt caching", d: "An Anthropic feature that stores a stable prefix of your prompt (like a long system prompt) so the model doesn't re-process it on every request, cutting cost and latency significantly." },
    { t: "quantization", d: "Storing a model's weights using fewer bits (e.g., 4-bit integers instead of 32-bit floats) to dramatically reduce memory usage, making large models run on smaller hardware." },
    { t: "query/key/value (Q, K, V)", d: "The three projections used in attention: the query asks 'what am I looking for?', the key says 'what do I contain?', and the value is the actual information that gets blended into the output." },
    { t: "RAG (Retrieval-Augmented Generation)", d: "A technique that retrieves relevant documents from a database and adds them to the prompt before asking the model to answer, giving the model up-to-date or private information it wasn't trained on." },
    { t: "rate limit", d: "A cap set by an API provider on how many requests you can make per minute or day — if you exceed it, the API returns an error until the window resets." },
    { t: "regularization", d: "Any technique that discourages a model from overfitting by penalising complexity — examples include dropout, weight decay, and data augmentation." },
    { t: "ReLU (Rectified Linear Unit)", d: "The simplest and most widely used activation function: outputs the input if it's positive, and outputs zero if it's negative — written as max(0, x)." },
    { t: "request/response", d: "The two sides of an API call: a request is what your code sends (prompt, settings), and the response is what the server sends back (generated text, usage stats, etc.)." },
    { t: "reranking", d: "A second-pass step in retrieval that scores each candidate document more carefully using a slower but more accurate model, then returns only the top few truly relevant results." },
    { t: "residual connection", d: "A shortcut that adds a layer's input directly to its output (output = layer(x) + x), preventing information from being lost in deep networks and helping gradients flow during backpropagation." },
    { t: "RLHF (Reinforcement Learning from Human Feedback)", d: "A training technique where human raters rank model outputs, a reward model learns those preferences, and the language model is then trained to score higher rewards — this is how models learn to be helpful and harmless." },
    { t: "rollback", d: "Reverting a deployed system to an earlier, known-good version when a new update causes problems — made easy by storing model checkpoints and using version-controlled deployment configs." },
    { t: "sampling", d: "Generating text by randomly drawing the next token according to the model's probability distribution — unlike greedy decoding, sampling can produce varied and creative text." },
    { t: "scaling laws", d: "Empirical formulas (most famously from the Chinchilla paper) that predict how a model's performance improves as you increase the number of parameters, training data, and compute." },
    { t: "self-attention", d: "Attention applied within a single sequence where every token looks at every other token in the same sequence — this lets the model understand how words relate to each other in context." },
    { t: "SGD (Stochastic Gradient Descent)", d: "The simplest optimizer: pick a random mini-batch, compute gradients, take one step in the downhill direction, repeat — 'stochastic' means 'random'." },
    { t: "sigmoid", d: "An activation function that squishes any number into the range 0 to 1, shaped like an S-curve — often used for binary classification outputs." },
    { t: "softmax", d: "A function that takes a list of numbers and converts them into probabilities that sum to 1 — used at the output of a language model to turn raw scores into a probability distribution over possible next tokens." },
    { t: "standard deviation", d: "A measure of how spread out numbers are from their mean — a small standard deviation means values cluster tightly; a large one means they're spread widely." },
    { t: "streaming", d: "An API mode where the model sends tokens to you one at a time as they're generated (like typing), instead of waiting until the full response is complete — makes apps feel faster." },
    { t: "system prompt", d: "Instructions placed at the start of a conversation that set the model's role, tone, and rules — users typically can't see the system prompt but the model follows it throughout." },
    { t: "temperature", d: "A number (typically 0–1) that controls how random text generation is — low temperature (near 0) makes output focused and predictable; high temperature (near 1) makes it more varied and creative." },
    { t: "tensor", d: "A generalisation of vectors and matrices to any number of dimensions — a vector is a 1D tensor, a matrix is a 2D tensor, and a batch of images is a 4D tensor; PyTorch and TensorFlow use tensors everywhere." },
    { t: "throughput", d: "How many requests or tokens per second a system can process — distinct from latency (speed of one request), throughput measures bulk capacity." },
    { t: "token", d: "The smallest unit of text a language model processes — roughly a word or word-piece (e.g., 'unbelievable' might split into 'un', 'believ', 'able'); models never see raw characters, only token IDs." },
    { t: "tokenizer", d: "Software that converts raw text into a list of integer token IDs that the model can process, and converts IDs back to text — each model has its own vocabulary." },
    { t: "tool use", d: "See 'function calling' — the model requests that your code run a specific function (search, calculator, file read) and returns the result back to the model to continue the task." },
    { t: "top-p (nucleus sampling)", d: "A sampling strategy that only considers the smallest set of tokens whose probabilities sum to p (e.g., 0.9), ignoring very unlikely tokens — balances creativity with coherence." },
    { t: "training", d: "The process of repeatedly showing a model examples, measuring how wrong its predictions are (loss), and adjusting its weights via backpropagation to improve — this can take days or weeks for large models." },
    { t: "transformer", d: "The neural network architecture (introduced in 'Attention Is All You Need', 2017) that powers almost all modern LLMs — built from stacked blocks of self-attention and feed-forward layers." },
    { t: "underfitting", d: "When a model is too simple to learn the patterns in the data — it performs badly on both training and new examples, like trying to fit a straight line through a curved dataset." },
    { t: "vanishing gradient", d: "A training problem where gradients shrink to nearly zero as they're passed back through many layers, making early layers train extremely slowly or not at all — fixed by ReLU activations and residual connections." },
    { t: "variance", d: "A measure of how spread out numbers are from their mean — the average of the squared differences from the mean; standard deviation is its square root." },
    { t: "vector", d: "An ordered list of numbers, e.g. [0.2, -1.5, 3.0] — used to represent anything from a word's meaning to a model's internal state; the length of the list is called the vector's dimension." },
    { t: "vector database", d: "A database optimised for storing and searching embedding vectors — given a query vector, it finds the closest stored vectors in milliseconds, making semantic search possible at scale." },
    { t: "vLLM", d: "An open-source inference server for running LLMs at high throughput, using a technique called PagedAttention to pack many requests into GPU memory efficiently." },
    { t: "vocabulary", d: "The complete set of tokens a model knows — GPT-4 has ~100,000 tokens; any text outside the vocabulary is split into sub-word pieces that are in the vocabulary." },
    { t: "VRAM", d: "Video RAM — the memory on a GPU chip itself — the main bottleneck for running large models locally; a 70B-parameter model in float16 needs ~140 GB VRAM." },
    { t: "warmup", d: "A training technique that starts with a very small learning rate and gradually increases it over the first few hundred or thousand steps, preventing unstable updates early in training." },
    { t: "weight", d: "A learnable number inside a neural network that is multiplied by an input value — all the 'intelligence' of a trained model lives in its weights." },
  ],

  // ─── CHEAT SHEETS ──────────────────────────────────────────────────────────
  cheats: [
    {
      title: "Math symbols decoded",
      rows: [
        ["Symbol", "What it means"],
        ["Σ (sigma)", "Sum — add up everything in a list. Σxᵢ means x₁ + x₂ + x₃ + …"],
        ["∂ (partial d)", "Partial derivative — the rate of change of a function with respect to one variable, holding others fixed. ∂L/∂w means 'how does loss L change when weight w changes?'"],
        ["∇ (nabla)", "Gradient — a vector of all partial derivatives. ∇L is the full gradient of loss: one number per weight telling each weight which way to move."],
        ["· (dot)", "Dot product — multiply matching elements and sum. [1,2]·[3,4] = 1×3 + 2×4 = 11. Measures similarity."],
        ["‖x‖ (norm)", "The length (magnitude) of vector x. L2 norm: √(x₁² + x₂² + …). Used to measure how big gradients or vectors are."],
        ["exp(x) or eˣ", "Euler's number (~2.718) raised to the power x. Turns sums into products; always positive. Used in softmax and probability."],
        ["log(x) or ln(x)", "Natural logarithm — the inverse of eˣ. log(1) = 0, log(e) = 1. Makes multiplication into addition; used in cross-entropy loss."],
        ["⊙ (Hadamard)", "Element-wise multiplication — multiply matching elements separately (NOT dot product). [2,3] ⊙ [4,5] = [8,15]."],
        ["ᵀ (transpose)", "Flip a matrix: rows become columns. A matrix of shape (3,4) becomes (4,3). Used constantly in attention: QKᵀ."],
        ["argmax", "Return the INDEX of the largest value in a list, not the value itself. argmax([0.1, 0.7, 0.2]) = 1. Used to pick the top token."],
        ["argmin", "Return the INDEX of the smallest value. Same idea as argmax but for the minimum."],
      ]
    },
    {
      title: "NumPy / PyTorch quick ops",
      rows: [
        ["Operation", "What it does (NumPy / PyTorch)"],
        ["a @ b  or  np.matmul(a, b)", "Matrix multiplication. Shape rule: (m, k) @ (k, n) → (m, n). Use this, NOT the * operator."],
        ["a * b", "Element-wise multiplication (Hadamard). Both arrays must have the same shape (or broadcast)."],
        ["x.reshape(2, -1)", "Rearrange elements into a new shape. -1 means 'figure out this dimension automatically'."],
        ["x.sum(axis=0)", "Sum along rows (collapse rows → one row). axis=1 sums along columns. Omit axis to sum everything."],
        ["x.mean() / x.std()", "Mean and standard deviation of all elements (or along an axis)."],
        ["np.zeros((3,4)) / np.ones((3,4))", "Create a 3×4 matrix filled with zeros / ones. Same as torch.zeros / torch.ones."],
        ["np.arange(0, 10, 2) / torch.arange(0, 10, 2)", "Create [0, 2, 4, 6, 8] — evenly spaced values from start to stop with given step."],
        ["np.random.randn(3, 4) / torch.randn(3, 4)", "Random matrix from a standard normal distribution (mean 0, std 1). Used to initialise weights."],
        ["x.shape  /  x.T", ".shape returns (rows, cols, …). .T transposes (swaps last two dims)."],
        ["with torch.no_grad():", "Block that tells PyTorch not to build a computation graph — use during inference/eval to save memory."],
        ["tensor.to('cuda') / tensor.to('cpu')", "Move a tensor to the GPU or back to CPU. Model and data must be on the same device."],
        ["loss.backward()", "Compute gradients via backpropagation. Call this after computing the loss, then call optimizer.step()."],
      ]
    },
    {
      title: "Prompting patterns",
      rows: [
        ["Pattern", "When to use it"],
        ["Role assignment", "Start system prompt with 'You are a [role]…' to anchor the model's persona and expertise level."],
        ["Output format contract", "Tell the model exactly what format to return: 'Respond ONLY with valid JSON matching this schema: {…}'. Use tool/function calling for guaranteed structure."],
        ["Few-shot examples", "Include 2-5 examples of input→output pairs before the real request to show the model the pattern you want."],
        ["Chain-of-thought (CoT)", "Add 'Think step by step before answering' or 'Let's think through this carefully:' to improve accuracy on reasoning tasks."],
        ["Delimiters for data", "Wrap user-supplied or untrusted data in XML tags like <document>…</document> to separate it clearly from instructions and reduce prompt injection risk."],
        ["Refusal rules", "Explicitly list things the model should NOT do: 'Do not discuss competitor products. If asked, say you can't help with that.'"],
        ["Prefill (Claude)", "Start the 'assistant' turn with the opening of the response you want, e.g. '{' to force JSON output from the first character."],
        ["Ask for JSON", "Say 'Return your answer as a JSON object with keys: title, summary, score' — combine with a tool schema for the most reliable structured output."],
      ]
    },
    {
      title: "Claude API quick reference",
      rows: [
        ["Field / concept", "What it means — verify current IDs and pricing at docs.anthropic.com"],
        ["claude-fable-5", "Most capable model. Use for hardest reasoning, complex multi-step agents. Highest cost."],
        ["claude-opus-4-8", "Deep reasoning, complex code, nuanced long-form tasks. High cost."],
        ["claude-sonnet-4-6", "Best balance of capability and cost — default choice for most production apps."],
        ["claude-haiku-4-5-20251001", "Fastest and cheapest. Use for classification, simple extraction, high-volume tasks."],
        ["max_tokens", "Hard cap on the response length in tokens. Always set this to avoid runaway costs. 1 token ≈ 0.75 words."],
        ["system (field)", "The system prompt — a string or list of content blocks with instructions the model follows throughout the conversation."],
        ["messages (roles)", "A list of {role, content} dicts. role is 'user' or 'assistant'. Alternate them to represent conversation history."],
        ["temperature", "0 = deterministic/focused. 1 = creative/varied. Default is usually 1; set lower for factual tasks."],
        ["stream: true", "Enables token-by-token streaming so you can show text as it's generated instead of waiting for the full response."],
        ["Prompt caching", "Wrap stable content (long system prompts, reference docs) in cache_control: {type: 'ephemeral'} to cache it — ~10% of normal input cost on cache hits."],
        ["Pricing", "Always verify current per-token rates at console.anthropic.com/settings/billing or docs.anthropic.com/pricing — model costs change with releases."],
      ]
    },
  ],

  // ─── MODEL TABLE ───────────────────────────────────────────────────────────
  // Verify current IDs and pricing at docs.anthropic.com/en/docs/about-claude/models
  models: [
    { id: "claude-fable-5",             name: "Fable 5",    use: "Most capable — hardest reasoning, complex agents, research tasks",    cost: "$$$$" },
    { id: "claude-opus-4-8",            name: "Opus 4.8",   use: "Deep reasoning, complex code, nuanced long documents",                cost: "$$$"  },
    { id: "claude-sonnet-4-6",          name: "Sonnet 4.6", use: "Best balance — default for most apps, RAG, coding assistants",       cost: "$$"   },
    { id: "claude-haiku-4-5-20251001",  name: "Haiku 4.5",  use: "Fast + cheap — classification, simple chat, high-volume extraction", cost: "$"    },
  ],

  // ─── ONE-PAGE LLM EXPLAINER ────────────────────────────────────────────────
  // ~10 sections, each <h4> + 1 <p>. No style attributes — site CSS handles it.
  onePage: `
<h4>1. Text is broken into tokens</h4>
<p>Before a language model reads your text, a <strong>tokenizer</strong> splits it into small pieces called <strong>tokens</strong> — roughly one token per word, but common words stay whole while rare ones split into parts (e.g. "unbelievable" → "un", "believ", "able"). Every token is then converted to a number (its ID in the vocabulary). The model never sees raw letters — only streams of integers.</p>

<h4>2. Tokens become embedding vectors</h4>
<p>Each integer token ID is looked up in a giant table called an <strong>embedding matrix</strong>, which converts it into a list of hundreds or thousands of numbers called a <strong>vector</strong>. Words with similar meanings end up with similar vectors — "king" and "queen" land near each other in this high-dimensional space. These vectors are the actual input to every calculation inside the model.</p>

<h4>3. Attention: a spotlight on what matters</h4>
<p>The most important operation inside a transformer is <strong>self-attention</strong>. Think of it as a spotlight: when the model processes the word "bank" in a sentence, attention lets it look at every other word simultaneously and ask "does this other word help explain what kind of bank I mean?" Each token votes on how relevant every other token is, then blends their information into its own updated representation — so the model understands words <em>in context</em>, not in isolation.</p>

<h4>4. Layers stack to build understanding</h4>
<p>A transformer runs the input through dozens of identical <strong>blocks</strong>, each containing one attention step and one small feed-forward network. Early layers pick up surface patterns (grammar, spelling); middle layers build phrases and entities; deep layers represent abstract concepts, facts, and reasoning steps. Each layer refines the previous one, like an editor who rewrites a draft, passes it forward, and the next editor refines it again.</p>

<h4>5. Next-token prediction is the training task</h4>
<p>During pretraining, the model reads a sequence of tokens and tries to predict what the <em>next</em> token should be — at every position, for every token in the training corpus. The predicted probability is compared to the actual next token, and the error (cross-entropy loss) is used to nudge all the model's billions of weights slightly in a better direction via backpropagation. After enough repetitions across enough text, the weights encode a compressed version of the patterns in human language and knowledge.</p>

<h4>6. Why next-token prediction creates apparent intelligence</h4>
<p>Predicting the next token correctly requires understanding grammar, facts, reasoning patterns, and context — so a model trained well enough on enough diverse text implicitly learns to do all of those things. It isn't consciously "thinking"; it has learned that the most likely continuation of "The capital of France is …" is "Paris" because that pattern appeared millions of times in training. The appearance of understanding emerges from prediction, not from a built-in knowledge base.</p>

<h4>7. Pretraining: reading the internet</h4>
<p><strong>Pretraining</strong> is the first and most expensive phase: a model reads trillions of tokens of text (web pages, books, code, scientific papers) and trains for weeks or months on thousands of GPUs. This is where most of the model's "world knowledge" comes from. After pretraining, the model can complete text fluently but doesn't yet know how to be a helpful assistant — it might continue a question with another question instead of answering it.</p>

<h4>8. Fine-tuning: learning to be helpful</h4>
<p><strong>Fine-tuning</strong> starts from the pretrained weights and trains further on a curated dataset of (instruction, ideal response) pairs — for example, "Explain gradient descent to a beginner" paired with a clear, accurate explanation. This is called <strong>instruction tuning</strong> (or SFT — supervised fine-tuning). It teaches the model to answer questions, follow instructions, and produce helpful outputs rather than just continuing text.</p>

<h4>9. RLHF: learning from human preferences</h4>
<p><strong>RLHF (Reinforcement Learning from Human Feedback)</strong> takes a fine-tuned model a step further: human raters compare pairs of model responses and mark which one is better, a separate "reward model" learns those preferences, and then the main model is trained to generate responses that score high rewards. This is how models learn to be not just accurate but also safe, honest, and aligned with what people actually find helpful.</p>

<h4>10. Limits: hallucination and knowledge cutoff</h4>
<p>Two fundamental limitations apply to all current LLMs: (1) <strong>Hallucination</strong> — the model can generate plausible-sounding text that is factually wrong, because it is predicting likely-sounding tokens, not retrieving verified facts. (2) <strong>Knowledge cutoff</strong> — the model only knows what was in its training data; events or information after that date don't exist for the model unless you supply them in the prompt (or use RAG). Always verify factual claims from LLMs against authoritative sources.</p>
`,

};
