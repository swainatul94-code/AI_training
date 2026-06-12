// c15-mlops — course content. Must load before course/engine.js.
window.COURSE_PHASES = window.COURSE_PHASES || [];
COURSE_PHASES.push(Object.assign({ order: 15 },
{ id:13, title:"Phase 12 — MLOps / AI Engineering", est:"30-45 hrs",
  intro:"Notebooks don't pay rent. This phase turns your prototypes into deployed services that real users hit — with auth, monitoring, security, and cost control.",
  lessons:[
    {h:"What MLOps actually means for AI engineers", body:`<p><b>MLOps = the operations side of ML</b> — taking a trained model and making it a reliable service.</p>
    <p><b>What you need to know:</b></p>
    <ol>
      <li><b>Serving</b>: how to run your model behind an API at high throughput</li>
      <li><b>Wrapping</b>: REST API, auth, rate limits, error handling</li>
      <li><b>Containers</b>: Docker so it runs anywhere</li>
      <li><b>Deployment</b>: cloud platforms (Fly.io, Railway, Modal, Cloud Run) or your own infra</li>
      <li><b>Monitoring</b>: logs, metrics (latency, error rate, cost), alerts</li>
      <li><b>Security</b>: prompt injection defense, PII handling, secret management</li>
    </ol>
    <p>You're not expected to become a DevOps expert. Master enough to ship one service end-to-end. The skills generalize.</p>`},
    {h:"Serving open LLMs — choose the right tool", body:`<p>If you're using Claude API, you don't need to "serve" anything — Anthropic runs the model. If you're deploying an open model (Llama, Qwen, Mistral) on your own GPU, you need a serving framework:</p>
    <table>
      <tr><th>Tool</th><th>Use case</th><th>Why</th></tr>
      <tr><td><b>vLLM</b></td><td>Production high-throughput</td><td>PagedAttention + continuous batching → ~5-20× throughput vs naive HF generate. OpenAI-compatible API. Default for serving 7B+ models.</td></tr>
      <tr><td><b>TGI</b></td><td>Production HF stack</td><td>HuggingFace's official server. Mature, similar perf to vLLM.</td></tr>
      <tr><td><b>Ollama</b></td><td>Local single-user dev</td><td>Easy install, runs quantized models. One-command setup. Not for prod.</td></tr>
      <tr><td><b>llama.cpp</b></td><td>CPU / edge devices</td><td>Pure C++, runs on Raspberry Pi, phones. GGUF quantized weights.</td></tr>
    </table>
    <p><b>What makes vLLM fast:</b></p>
    <ul>
      <li><b>Continuous batching</b>: instead of waiting for a fixed batch to fill, vLLM packs new requests into the running batch every step. GPU stays at near 100% utilization.</li>
      <li><b>PagedAttention</b>: KV cache is allocated in pages (like virtual memory), not contiguously. Allows variable-length sequences without wasted memory.</li>
    </ul>`, code:`pip install vllm

python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3.1-8B-Instruct \\
  --dtype bfloat16 \\
  --max-model-len 8192 \\
  --port 8000

# Then call as if it were OpenAI:
# curl http://localhost:8000/v1/chat/completions ...`},
    {h:"FastAPI wrapper", code:`from fastapi import FastAPI, HTTPException, Header\nfrom pydantic import BaseModel\nimport anthropic, os\nfrom slowapi import Limiter\nfrom slowapi.util import get_remote_address\n\napp = FastAPI()\nlimiter = Limiter(key_func=get_remote_address)\nclient = anthropic.Anthropic()\nKEYS = set(os.getenv("APP_KEYS","").split(","))\n\nclass Q(BaseModel): question: str\n\n@app.post("/ask")\n@limiter.limit("30/minute")\nasync def ask(q: Q, request, x_api_key: str = Header(None)):\n    if x_api_key not in KEYS: raise HTTPException(401, "bad key")\n    resp = client.messages.create(model="claude-sonnet-4-6", max_tokens=1024,\n        messages=[{"role":"user","content":q.question}])\n    return {"answer":resp.content[0].text, "tokens":resp.usage.output_tokens}`},
    {h:"Dockerfile", code:`FROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nCMD ["uvicorn","app:app","--host","0.0.0.0","--port","8080"]`},
    {h:"Observability", body:`<ul>
      <li>Structured JSON logs, request_id correlation</li>
      <li>Metrics: req/s, p50/p95/p99, error rate, tokens, $ — Prometheus + Grafana</li>
      <li>LLM-specific: Langfuse/Helicone — traces, prompt versioning, evals</li>
      <li>Alerts: cost spike, latency degradation, error > 1%</li>
    </ul>`},
    {h:"Security checklist", body:`<ul>
      <li><b>Prompt injection</b>: untrusted text overrides system → separator markers, output validation, no privileged tool calls without confirmation</li>
      <li><b>Tool sandbox</b>: never exec untrusted (Docker, Modal sandbox)</li>
      <li><b>PII/secrets</b>: scrub before LLM call</li>
      <li><b>Auth + rate limits</b> per user/tenant</li>
      <li><b>Cost cap</b> per tenant monthly</li>
      <li><b>Red-team your own app weekly</b></li>
    </ul>`},
    {h:"Linux/shell bridge (you'll deploy to Linux servers)", body:`<p>Your laptop is Windows but production runs Linux. Learn enough shell to operate.</p>
    <h4>20 commands you actually need</h4>
    <table>
      <tr><th>Command</th><th>Does</th></tr>
      <tr><td><code>ls -la</code></td><td>List files with details + hidden</td></tr>
      <tr><td><code>cd /path</code></td><td>Change directory</td></tr>
      <tr><td><code>pwd</code></td><td>Print working directory</td></tr>
      <tr><td><code>cat file</code></td><td>Print file contents</td></tr>
      <tr><td><code>less file</code></td><td>Page through long file (q to quit)</td></tr>
      <tr><td><code>head -n 20 file</code> / <code>tail -f log</code></td><td>First N lines / follow log live</td></tr>
      <tr><td><code>grep -r "pattern" .</code></td><td>Recursive search in dir</td></tr>
      <tr><td><code>find . -name "*.py"</code></td><td>Find files matching glob</td></tr>
      <tr><td><code>cp src dst</code> / <code>mv src dst</code> / <code>rm file</code></td><td>Copy/move/delete</td></tr>
      <tr><td><code>chmod +x script.sh</code></td><td>Make executable</td></tr>
      <tr><td><code>ps aux | grep python</code></td><td>List processes matching</td></tr>
      <tr><td><code>kill -9 PID</code></td><td>Force-kill process by ID</td></tr>
      <tr><td><code>top</code> / <code>htop</code></td><td>Live CPU/mem dashboard</td></tr>
      <tr><td><code>df -h</code></td><td>Disk usage human-readable</td></tr>
      <tr><td><code>nvidia-smi</code></td><td>GPU utilization, mem, processes</td></tr>
      <tr><td><code>ssh user@host</code></td><td>Remote login</td></tr>
      <tr><td><code>scp local user@host:remote</code></td><td>Copy files over SSH</td></tr>
      <tr><td><code>systemctl status myapp</code></td><td>Check systemd service</td></tr>
      <tr><td><code>journalctl -u myapp -f</code></td><td>Tail service logs live</td></tr>
      <tr><td><code>curl -X POST localhost:8000/ask -d '...'</code></td><td>Hit an HTTP endpoint</td></tr>
    </table>
    <h4>Pipes + redirects (the Unix superpower)</h4>
    <pre><code># pipe one command's output to next
ps aux | grep python | wc -l        # count python processes

# redirect stdout (overwrite vs append)
python train.py > output.log
python train.py >> output.log 2>&1  # both stdout+stderr appended

# background process with output to file
nohup python serve.py > server.log 2>&1 &
</code></pre>
    <h4>Permissions: chmod numeric</h4>
    <pre><code>chmod 755 file   # rwx r-x r-x (owner all, others read+exec)
chmod 644 file   # rw- r-- r-- (owner rw, others read)
chmod 600 file   # rw- --- --- (owner only — use for API keys, SSH keys)
</code></pre>
    <h4>WSL: get Linux on Windows free</h4>
    <p>Run as admin: <code>wsl --install</code>. Installs Ubuntu in ~2 min. Open terminal → "Ubuntu" → you're in Linux without VM overhead. Practice every Linux command above here.</p>`},
    {h:"Speculative decoding — 2-3× faster inference", body:`<p><b>The bottleneck:</b> LLM inference is autoregressive — generate one token, then the next. Each token = full forward pass on a 70B model = ~50ms. Slow.</p>
    <p><b>The trick:</b> use a small <b>draft model</b> to predict next K tokens cheaply, then have the big model verify all K in <b>one</b> forward pass (it does parallel compute on the K candidates).</p>
    <ol>
      <li>Draft model (1B) generates 4 candidate tokens — cheap</li>
      <li>Big model (70B) does ONE forward pass on prompt + 4 candidates</li>
      <li>For each position, check if big model's top prediction matches draft</li>
      <li>Accept matched prefix; from first mismatch, take big model's prediction</li>
      <li>Best case: all 4 match → 4× speedup. Worst case: 0 match → same as no spec.</li>
    </ol>
    <p><b>Expected:</b> 2-3× wall-clock for typical text. No quality change (output is mathematically identical to big model alone).</p>
    <pre><code>python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3.1-70B-Instruct \\
  --speculative-model meta-llama/Llama-3.2-1B-Instruct \\
  --num-speculative-tokens 4 \\
  --dtype bfloat16
</code></pre>`},
    {h:"Dev vs prod: what changes when real people show up", body:`<p>Code that works perfectly on your laptop can fail in completely different ways the moment real users start using it. This lesson maps the exact differences so you are not surprised.</p>
    <table>
      <tr><th>Concern</th><th>During development</th><th>In production</th></tr>
      <tr><td><b>Secrets</b></td><td><code>ANTHROPIC_API_KEY</code> lives in a <code>.env</code> file on your laptop</td><td>Secret must live in Railway's dashboard Variables panel — never in the repository. Anyone who reads your public repo can steal a committed API key.</td></tr>
      <tr><td><b>Errors</b></td><td>You read the full Python traceback and fix it</td><td>Users see a blank screen or a generic "500 Internal Server Error." You need structured logs that record the full error with timestamps so you can diagnose it after the fact.</td></tr>
      <tr><td><b>Scale</b></td><td>One user (you)</td><td>Traffic spikes — 50 users hit the endpoint simultaneously at lunch. Does it queue gracefully or crash?</td></tr>
      <tr><td><b>Logging</b></td><td><code>print()</code> statements show output in your terminal</td><td><code>print()</code> still works but you need structured logs (JSON lines with timestamps, request IDs, severity levels) so you can filter and search Railway's log stream later.</td></tr>
      <tr><td><b>Updates</b></td><td>Save the file, run the script again</td><td>Deploy = push to GitHub &rarr; Railway rebuilds &rarr; new version goes live. You need a rollback plan if the new version is broken.</td></tr>
    </table>
    <p><b>The "works on my machine" autopsy:</b> most production failures that worked in development trace back to one of three causes: (1) <b>version drift</b> — your laptop has a different library version than the server; (2) <b>missing environment variable</b> — you forgot to add the variable to Railway's dashboard; (3) <b>path differences</b> — a file path that works on Windows (<code>C:\\Users\\you\\data.txt</code>) breaks on Linux (<code>/app/data.txt</code>). Docker containers (next lesson) kill all three of these bugs.</p>
    <div class="mistake"><b>Common mistake:</b> testing only the happy path before deploying. The happy path is one request with a clean, well-formed input. Production users will send empty strings, extremely long inputs, special characters, requests in unexpected languages, and requests at 3 AM when you are asleep. Test your error handling before you deploy, not after your first crash report.</div>`},

    {h:"Docker mental model: a shipping container for code", body:`<p>Before Docker existed, deploying software was like describing a recipe over the phone: "Install Python 3.10, then install these libraries, make sure the timezone is set to UTC, oh and you need this system library too..." Something always went wrong on the other end.</p>
    <p>Docker solves this with a simple idea borrowed from shipping: instead of describing what to install, you ship a sealed container that already has everything inside.</p>
    <p><b>Three vocabulary words:</b></p>
    <ul>
      <li><b>Image:</b> a frozen, read-only box containing your app + exact Python version + exact library versions. Built once, runs anywhere.</li>
      <li><b>Container:</b> a running copy of an image. You can run ten containers from the same image simultaneously.</li>
      <li><b>Dockerfile:</b> a recipe (a text file) that tells Docker how to build the image, step by step.</li>
    </ul>
    <p>The same image runs identically on your Windows laptop (via Docker Desktop), Railway's Linux servers, and a RunPod GPU pod. That is the entire value proposition.</p>
    <p><b>Note for Railway users:</b> Railway reads your <code>requirements.txt</code> and builds a container automatically from your GitHub repo. You often do not need to write a Dockerfile. You will need one when you want to control the exact base image, add system packages, or customise the build process.</p>
    <div class="mistake"><b>Common mistake:</b> putting the <code>COPY . .</code> line before the <code>RUN pip install</code> line in the Dockerfile. Docker caches each line. If your code changes but your requirements have not, Docker can reuse the cached pip install layer — saving 60 seconds on every rebuild. If you copy all your code first, a change to any file invalidates the cache and forces a full reinstall every time.</div>`,
    code:`# Dockerfile — a recipe for building a container image
# Each line creates one layer. Layers are cached.

# Start from an official slim Python image (smaller = faster to pull and run)
FROM python:3.12-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file FIRST (so pip install is cached separately from your code)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Now copy the rest of your code (changes here do NOT bust the pip cache)
COPY . .

# The command to run when the container starts
CMD ["python", "app.py"]`},

    {h:"Monitoring an LLM app: the four numbers", body:`<p>Classic server monitoring tracks CPU usage, memory, and disk. Those numbers matter for any server — but LLM apps have failure modes that CPU graphs will never reveal. This lesson covers the four numbers that matter specifically for an LLM-backed service.</p>
    <h4>Number 1: Latency p95</h4>
    <p>Do not use average latency — it hides the worst user experience. Instead, use the <b>95th percentile</b> (p95): the slowest 5% of requests.</p>
    <p><b>Worked example:</b> suppose you have 10 requests. Nine complete in 0.5 seconds and one takes 9 seconds. The average is (9 &times; 0.5 + 9) &divide; 10 = 13.5 &divide; 10 = 1.35 seconds. That sounds acceptable. But your p95 is approximately 9 seconds — one in twenty users is waiting nearly 10 seconds. That is a broken experience that the average completely obscures.</p>
    <h4>Number 2: Error rate</h4>
    <p>Count HTTP 5xx errors and API failures per hour. A sudden spike means something broke. Alert when error rate exceeds 1%.</p>
    <h4>Number 3: Token spend per day</h4>
    <p><b>LLM apps die by bill, not by crash.</b> A bug that doubles your token usage doubles your monthly cost and the app keeps running happily — no alarm fires. You only notice it when the invoice arrives. Log <code>input_tokens</code> and <code>output_tokens</code> from every <code>resp.usage</code> object, sum them daily, and alert when daily spend exceeds a threshold.</p>
    <h4>Number 4: Output quality sample</h4>
    <p>LLMs fail <b>silently</b> — they produce fluent, confident, grammatically correct text that is simply wrong. No exception is thrown. No error rate spikes. The only way to catch this is to read actual outputs. Log every input and output. Once a week, read 10 randomly selected ones. You will catch quality degradation that no automated metric catches.</p>
    <p><b>Cheapest viable monitoring stack:</b> structured JSON logs (use Python's <code>logging</code> module with a JSON formatter) + a daily SQL query summing token spend + a weekly manual review of 10 random conversations. This costs nothing and catches the important failures.</p>
    <div class="mistake"><b>Common mistake:</b> setting up CPU and memory dashboards and nothing else. For a Claude API app, the server will never run out of CPU — all the heavy computation happens on Anthropic's servers. The risks specific to LLM apps are cost surprises and silent quality failures, neither of which CPU graphs reveal.</div>`},

    {h:"GPU serving notes: vLLM on RunPod", body:`<p>This lesson applies to Phase 12, where you will deploy a small open-source model on a rented GPU rather than calling the Claude API. If you are using the Claude API for everything, you can read this as background knowledge for now.</p>
    <p><b>What vLLM is:</b> vLLM is an open-source inference server. You point it at a model, and it exposes an HTTP API that your Python code calls — similar to how you call the Claude API, except the model is running on your rented GPU.</p>
    <p><b>Why vLLM is fast (two superpowers):</b></p>
    <ul>
      <li><b>Continuous batching:</b> when multiple users send requests at the same time, a naive server waits for the current batch to finish before starting new requests. vLLM allows new requests to join the running batch mid-flight. The GPU stays busy almost continuously instead of sitting idle between batches.</li>
      <li><b>PagedAttention:</b> LLMs need to store the "attention cache" (a record of everything said so far in the conversation) in GPU memory. Normally this is one large contiguous block — wasteful and inflexible. vLLM slices the cache into pages, like an operating system manages RAM. This allows more simultaneous users to share the same GPU memory.</li>
    </ul>
    <p><b>Deployment flow on RunPod:</b></p>
    <ol>
      <li>Rent a GPU pod on RunPod (A100 40 GB or similar, depending on model size)</li>
      <li>The pod starts with a Linux environment. Download the model weights from HuggingFace.</li>
      <li>Start vLLM: <code>python -m vllm.entrypoints.openai.api_server --model your-model-name</code></li>
      <li>vLLM exposes an OpenAI-compatible HTTP endpoint at <code>http://localhost:8000</code></li>
      <li>Point your Python client at that URL instead of the Anthropic API URL</li>
    </ol>
    <p><b>Cost shape (relative — verify current RunPod pricing before renting):</b> RunPod charges per <b>hour</b> whether or not you are sending requests. The Claude API charges per <b>token</b> regardless of time. Self-hosting on RunPod only becomes cheaper than the Claude API when you have high, steady traffic that keeps the GPU busy. For a learning project with light traffic, you will almost certainly spend more on RunPod than on Claude API tokens.</p>
    <div class="mistake"><b>Common mistake:</b> leaving a GPU pod running when you are done for the day. A GPU pod left running overnight can cost $30&ndash;$50 before you notice. Always stop or terminate the pod when you finish a session. This is the expensive lesson almost every self-hosting beginner learns exactly once.</div>`},

    {h:"Quantization (GPTQ / AWQ / GGUF / NF4)", body:`<p>Weights default to bf16 (2 bytes each). A 70B model = 140GB. Doesn't fit on a 24GB GPU. Quantization shrinks weights to lower precision, trading minor quality loss for huge memory savings.</p>
    <h4>Format comparison</h4>
    <table>
      <tr><th>Format</th><th>Bits/weight</th><th>70B size</th><th>Quality loss</th><th>Tool</th></tr>
      <tr><td>bf16 (baseline)</td><td>16</td><td>140 GB</td><td>0%</td><td>—</td></tr>
      <tr><td>int8</td><td>8</td><td>70 GB</td><td>&lt; 1%</td><td>bitsandbytes</td></tr>
      <tr><td><b>GPTQ 4-bit</b></td><td>4</td><td>35 GB</td><td>~1-2%</td><td>AutoGPTQ; standard GPU inference</td></tr>
      <tr><td><b>AWQ 4-bit</b></td><td>4</td><td>35 GB</td><td>~1-2%</td><td>AutoAWQ; sometimes better than GPTQ</td></tr>
      <tr><td><b>GGUF (Q4_K_M)</b></td><td>~4.5</td><td>~40 GB</td><td>~1-2%</td><td>llama.cpp; best for Mac/CPU/edge</td></tr>
      <tr><td>NF4 (QLoRA)</td><td>4</td><td>35 GB</td><td>~1-2%</td><td>bitsandbytes; used during fine-tuning</td></tr>
    </table>
    <h4>When to use which</h4>
    <ul>
      <li><b>Inference on GPU</b>: AWQ or GPTQ 4-bit. Test on your golden set first.</li>
      <li><b>Inference on Mac/CPU</b>: GGUF via llama.cpp or Ollama. Q4_K_M is the sweet spot.</li>
      <li><b>Fine-tuning on consumer GPU</b>: NF4 + LoRA adapters (= QLoRA).</li>
    </ul>
    <h4>Loading a pre-quantized model</h4>
    <pre><code>from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained(
    "TheBloke/Llama-3.1-70B-Instruct-GPTQ",
    device_map="auto",
)
tok = AutoTokenizer.from_pretrained("TheBloke/Llama-3.1-70B-Instruct-GPTQ")
inputs = tok("Hello", return_tensors="pt").to("cuda")
out = model.generate(**inputs, max_new_tokens=50)
print(tok.decode(out[0]))
</code></pre>`},
  ],
  quiz:[
    {type:"mcq", q:"vLLM > naive HF generate() because:", options:["Lighter deps","Continuous batching + PagedAttention → 5-20× throughput","Smaller models","Free"], answer:1, explain:"Naive generate idles GPU. vLLM packs requests + paged KV cache → utilization."},
    {type:"mcq", q:"Most important LLM-specific metric?", options:["CPU","Tokens (in+out) and $ per request","Disk","Key count"], answer:1, explain:"Cost surprises. A token-doubling bug 10× your bill silently. Track + alert."},
    {type:"mcq", q:"Prompt injection defense?", options:["Trust model refuses","Defense in depth: sandbox, output validation, separators, no priv escalation","Bigger model","Longer system"], answer:1, explain:"No full defense. Limit blast radius — model CAN be tricked; ensure consequences small."},
    {type:"short", q:"50 req/s, p50 200ms but p99 4s. Investigate?", model:"P99 4s = (1) Long outputs blocking batch → cap max_tokens, stream. (2) Cache misses on rare prompts. (3) GPU memory near limit → batch shrinks. nvidia-smi. (4) Long-input variance → bucket. (5) Thermal throttle. (6) Slow client streaming back-pressure. Fixes: cap tokens, increase --max-num-seqs and --gpu-memory-utilization, timeout, autoscale on queue depth.", rubric:["long outputs","memory","input variance","back-pressure","autoscale"]},
  ],
  project:{title:"Phase 12 deliverable", steps:["vLLM self-host open LLM","FastAPI + auth + rate limit + Docker","Grafana latency + cost dashboard","Red-team writeup"]}
}
));
