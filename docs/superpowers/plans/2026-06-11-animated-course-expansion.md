# Animated Course Site + AI Content Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the 5,910-line `ai_master_course.html` monolith into maintainable `course/` files, add rich-but-tasteful animations, add Reference/Resources/Study Guide tabs, and deeply expand lesson content for a zero-knowledge learner.

**Architecture:** Plain `<script src>` tags assemble a global `COURSE_PHASES` array from 16 per-phase content files; the existing engine (unchanged behavior) sorts it into `COURSE`. No build step, no fetch — works on GitHub Pages AND double-clicked from disk. localStorage key `ai_zero_to_hero_v2` and phase ids (0, 1, 15, 2–14) are preserved exactly so existing progress survives.

**Tech Stack:** Vanilla HTML/CSS/JS, IntersectionObserver, canvas, Node 20 (`test.mjs` self-test in CI), GitHub Pages, service worker (`sw.js`).

**Spec:** `docs/superpowers/specs/2026-06-11-animated-course-expansion-design.md`

---

## Critical facts about the existing code (read before any task)

| Fact | Value |
|---|---|
| Monolith | `ai_master_course.html`, 5,910 lines: CSS lines 12–456, body HTML 458–531, one `<script>` 532–5907 |
| Course data | `const COURSE = [` at line 534, closes with `];` at line 3172 |
| Phase starts (line, id) | 535→0, 683→1, 763→15, 829→2, 1079→3, 1156→4, 1223→5, 1426→6, 1490→7, 1668→8, 1880→9, 1951→10, 2611→11, 2693→12, 2761→13, 2910→14 |
| Games data | `const GAMES = [` at line 3175 — **stays in engine.js**, it is small |
| Storage | `const STORAGE_KEY = "ai_zero_to_hero_v2"` (line 3501). NEVER change this. |
| View system | `switchView(v)` toggles `currentView`, buttons matched by `data-view`; `render()` → `renderSidebar()` + `renderMain()`; `renderMain()` branches on `currentView` (search `if(currentView===`) |
| Existing views | phases, games, review, portfolio, badges |
| Root files | `index.html`/`styles.css`/`app.js` = SEPARATE main site. Do not touch. |
| Service worker | `sw.js` precaches; `VERSION = 'aizh-v7'`; new files must be added to `OPTIONAL` and VERSION bumped or clients serve stale cache |
| CI | `.github/workflows/ci.yml` runs `node test.mjs` on push. Section 2 of test.mjs parses the course's inline script — must be rewritten after the split. |
| Existing reveal | `function setupReveal()` already exists near end of script — read it before Task B1; extend, don't duplicate |
| Existing animations | hero orbs, confetti (`fireConfetti`), `fade-in` keyframes — keep all |
| Seed material | `AI_REFERENCE.md` (24KB) and `AI_ZERO_TO_HERO.md` (15KB) in repo root — mine them for Reference tab + Study Guide content |
| CSP | meta tag allows same-origin scripts/styles (`'self'`) — external files under `course/` are fine, no CSP change needed |

**Pedagogy rules for ALL content written in Stage D (from spec, non-negotiable):**
1. Assume zero prior knowledge. Plain English first, define every term at first use, analogy before math.
2. Worked examples use real numbers, not just formulas.
3. Each new lesson includes at least one of: mental-model box, worked example, "common novice mistakes" callout.
4. Claude API is the default LLM provider in examples; Railway for Phase 9–11 deploys; RunPod for Phase 12 GPU work.
5. Lesson format matches existing: `{h:"Title", body:`+backtick HTML+`, code:`+backtick code+` (code optional)}`.

---

## Stage A — Refactor (zero behavior change)

### Task A1: Write the one-shot split script

**Files:**
- Create: `tools/split-course.mjs`

- [ ] **Step 1: Verify the monolith is unmodified** (line anchors below depend on it)

Run: `git status --short` → expect empty (besides plan/spec docs). Then:
Run: `node -e "const l=require('fs').readFileSync('ai_master_course.html','utf8').split('\n'); console.log(l[533].trim(), '|', l[3171].trim(), '|', l[3174].trim())"`
Expected output: `const COURSE = [ | ]; | const GAMES = [`
If this does not match, STOP and re-derive boundaries before proceeding.

- [ ] **Step 2: Create `tools/split-course.mjs` with exactly this content**

```js
// One-shot splitter: monolith ai_master_course.html -> course/ files + shell.
// Run once from repo root: node tools/split-course.mjs   — then delete this file.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const src = readFileSync('./ai_master_course.html', 'utf8');

// 1. CSS block
const cssMatch = src.match(/<style>\r?\n([\s\S]*?)<\/style>/);
if (!cssMatch) throw new Error('style block not found');

// 2. Script block
const scriptMatch = src.match(/<script>\r?\n([\s\S]*?)<\/script>/);
if (!scriptMatch) throw new Error('script block not found');
const js = scriptMatch[1];

// 3. COURSE array bounds: from "const COURSE = [" to the first "];" on its own line
const courseStart = js.indexOf('const COURSE = [');
if (courseStart < 0) throw new Error('COURSE start not found');
const endRe = /\r?\n\];\r?\n/g;
endRe.lastIndex = courseStart;
const endM = endRe.exec(js);
if (!endM) throw new Error('COURSE end not found');
const courseBody = js.slice(courseStart + 'const COURSE = ['.length, endM.index);
const enginePrefix = js.slice(0, courseStart);
const engineRest = js.slice(endM.index + endM[0].length);

// 4. Split into 16 phase chunks at lines beginning "{ id:N, title:"
const starts = [...courseBody.matchAll(/^\{ id:\d+, title:/gm)].map(m => m.index);
if (starts.length !== 16) throw new Error('expected 16 phase chunks, got ' + starts.length);
const names = ['c01-setup','c02-python','c03-first-app','c04-math','c05-python-ml',
  'c06-classical-ml','c07-deep-learning','c08-nlp','c09-transformers','c10-pretrain',
  'c11-finetune','c12-claude-apps','c13-rag','c14-agents','c15-mlops','c16-portfolio'];
mkdirSync('./course/content', { recursive: true });
starts.forEach((s, i) => {
  let chunk = courseBody.slice(s, starts[i + 1] ?? courseBody.length).trim();
  if (chunk.endsWith(',')) chunk = chunk.slice(0, -1);
  const out = '// ' + names[i] + ' — course content. Must load before course/engine.js.\n'
    + 'window.COURSE_PHASES = window.COURSE_PHASES || [];\n'
    + 'COURSE_PHASES.push(Object.assign({ order: ' + (i + 1) + ' },\n'
    + chunk + '\n));\n';
  writeFileSync('./course/content/' + names[i] + '.js', out);
  console.log('wrote course/content/' + names[i] + '.js');
});

// 5. Engine: original script minus the COURSE literal, plus assembly shim
const engine = enginePrefix
  + 'const COURSE = (window.COURSE_PHASES || []).slice().sort((a, b) => a.order - b.order);\n'
  + 'if (!COURSE.length) console.warn("No course content files loaded — check <script> tags in ai_master_course.html");\n'
  + engineRest;
writeFileSync('./course/engine.js', engine);
console.log('wrote course/engine.js');

// 6. CSS file
writeFileSync('./course/course.css', cssMatch[1]);
console.log('wrote course/course.css');

// 7. Shell: same HTML, style block -> <link>, inline script -> <script src> tags
const tags = names.map(n => '<script src="course/content/' + n + '.js"></script>')
  .concat('<script src="course/engine.js"></script>').join('\n');
let shell = src.replace(/<style>\r?\n[\s\S]*?<\/style>/, '<link rel="stylesheet" href="course/course.css">');
shell = shell.replace(/<script>\r?\n[\s\S]*?<\/script>/, tags);
writeFileSync('./ai_master_course.html', shell);
console.log('rewrote ai_master_course.html as shell');
```

- [ ] **Step 3: Sanity-check the script parses**

Run: `node --check tools/split-course.mjs`
Expected: no output (clean parse).

**Fallback if Step 2's 16-chunk assertion fails at runtime:** a lesson body contains a line starting `{ id:` (likely a JSON code sample). Find it with `node -e "..."` grep of `^\{ id:` between lines 535–3171, and tighten the split regex to `/^\{ id:\d+, title:"Phase/gm` (every real phase title starts with the word `Phase`).

### Task A2: Run the split, wire everything, verify

**Files:**
- Create: `course/course.css`, `course/engine.js`, `course/content/c01…c16.js` (script output)
- Modify: `ai_master_course.html` (script output), `sw.js`, `test.mjs`
- Delete: `tools/split-course.mjs` (after success)

- [ ] **Step 1: Run the splitter**

Run: `node tools/split-course.mjs`
Expected: 18 "wrote …" lines + "rewrote ai_master_course.html as shell".

- [ ] **Step 2: Verify all course files parse and phase order is intact**

Run:
```bash
node -e "
const { readFileSync, readdirSync } = require('fs');
const files = readdirSync('course/content').map(f => 'course/content/' + f).concat('course/engine.js');
files.forEach(f => new Function(readFileSync(f, 'utf8')));
console.log(files.length + ' files parse');
global.window = global;   // content files write window.COURSE_PHASES, then push via the bare global
readdirSync('course/content').sort().forEach(f => new Function('window', readFileSync('course/content/' + f, 'utf8'))(global));
const phases = global.COURSE_PHASES.slice().sort((a, b) => a.order - b.order);
console.log('ids:', phases.map(p => p.id).join(','));
"
```
Expected: `17 files parse` and `ids: 0,1,15,2,3,4,5,6,7,8,9,10,11,12,13,14` — exactly this sequence (matches the original array order).

- [ ] **Step 3: Update `test.mjs` — replace section 2 (lines 95–104) with course-file parsing**

Replace the block beginning `// ---- 2. Legacy inline script parses ----` through its closing `}` with:

```js
// ---- 2. Course JS files parse ----
console.log('course script files parse:');
try {
  const { readdirSync } = await import('node:fs');
  const files = ['engine.js',
    ...readdirSync(new URL('./course/content/', import.meta.url)).map(f => 'content/' + f)];
  files.forEach(f => new Function(readFileSync(new URL('./course/' + f, import.meta.url), 'utf8')));
  ok(`${files.length} course file(s) parse`);
} catch (e) {
  bad(`course script parse error: ${e.message}`);
}
```

- [ ] **Step 4: Update `test.mjs` — extend section 3 to scan the course shell's asset refs**

After the existing section-3 loop over `index.html` refs (ends line ~112), add:

```js
const courseHtml = readFileSync(new URL('./ai_master_course.html', import.meta.url), 'utf8');
const courseRefs = [...courseHtml.matchAll(/(?:src|href)="([^":?#]+\.(?:js|css|png|webmanifest))"/g)].map(m => m[1]);
[...new Set(courseRefs)].forEach((r) => {
  existsSync(new URL('./' + r, import.meta.url)) ? ok('course: ' + r) : bad(`missing course asset: ${r}`);
});
```

- [ ] **Step 5: Update `sw.js` — new precache list + version bump**

Change `const VERSION = 'aizh-v7';` → `'aizh-v8'`. In the `OPTIONAL` array, after `'./ai_master_course.html',` add:

```js
  './course/course.css',
  './course/engine.js',
  './course/content/c01-setup.js',
  './course/content/c02-python.js',
  './course/content/c03-first-app.js',
  './course/content/c04-math.js',
  './course/content/c05-python-ml.js',
  './course/content/c06-classical-ml.js',
  './course/content/c07-deep-learning.js',
  './course/content/c08-nlp.js',
  './course/content/c09-transformers.js',
  './course/content/c10-pretrain.js',
  './course/content/c11-finetune.js',
  './course/content/c12-claude-apps.js',
  './course/content/c13-rag.js',
  './course/content/c14-agents.js',
  './course/content/c15-mlops.js',
  './course/content/c16-portfolio.js',
```

- [ ] **Step 6: Run the full self-test**

Run: `node test.mjs`
Expected: `✓ all checks passed`, exit 0.

- [ ] **Step 7: Browser verification (manual, file://)**

Open `ai_master_course.html` in a browser (`Start-Process .\ai_master_course.html`). Verify, with DevTools console open:
1. Zero console errors.
2. Sidebar lists all 16 phases in order Phase 0, 0.5, 0.75, 1…13.
3. Existing XP/level/streak in header unchanged from before the split (localStorage untouched).
4. Open one phase → lessons render, code blocks have copy buttons, a quiz question answers correctly and grants XP.
5. Games / Review / Portfolio / Badges tabs all render.

- [ ] **Step 8: Delete the splitter and commit**

```bash
rm tools/split-course.mjs
git add -A
git commit -m "refactor: split course monolith into course/ files (no behavior change)"
git push
```
Then confirm the CI run passes on GitHub (Actions tab) and the live GitHub Pages site still works (hard-reload twice — second load picks up the new service worker).

---

## Stage B — Animations

### Task B1: Animation CSS + reduced-motion block

**Files:**
- Modify: `course/course.css` (append at end)

- [ ] **Step 1: Append this block to `course/course.css`**

```css
/* ===== Stage B: animations ===== */
.reveal{opacity:0;transform:translateY(18px);transition:opacity .55s ease,transform .55s cubic-bezier(.16,1,.3,1)}
.reveal.in{opacity:1;transform:none}
.view-in{animation:fade-in .35s ease-out}
@keyframes quiz-pulse{0%{box-shadow:0 0 0 0 rgba(62,207,142,.55)}100%{box-shadow:0 0 0 14px rgba(62,207,142,0)}}
.quiz-correct{animation:quiz-pulse .7s ease-out;border-color:var(--ok)!important}
@keyframes quiz-shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
.quiz-wrong{animation:quiz-shake .45s ease;border-color:var(--err)!important}
@keyframes xp-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
#xp-bar-fill{background-size:200% 100%;animation:xp-shimmer 3.5s linear infinite}
@keyframes lvl-burst{0%{box-shadow:0 0 0 0 rgba(255,209,102,.7)}100%{box-shadow:0 0 0 22px rgba(255,209,102,0)}}
.lvl-burst{animation:lvl-burst .9s ease-out 2;border-radius:99px}
button:not(:disabled):active{transform:scale(.96)}
#hero-particles{position:absolute;inset:0;pointer-events:none;z-index:0}
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{animation:none!important;transition:none!important}
  .reveal{opacity:1;transform:none}
}
```

- [ ] **Step 2: Verify + commit**

Run `node test.mjs` (still passes — CSS only). Open page, confirm no visual regression.
```bash
git add course/course.css
git commit -m "feat: animation CSS — reveal, quiz feedback, shimmer, reduced-motion"
```

### Task B2: Scroll-reveal + view transition + counters + particles (engine JS)

**Files:**
- Modify: `course/engine.js`

- [ ] **Step 1: Read the existing `setupReveal()`** (search `function setupReveal` in `course/engine.js`). If it already implements IntersectionObserver reveals for `.step-card`, extend its selector and keep it. If it does something else (or is unused), replace it with the implementation below. Either way the final behavior must be:

```js
let _revealObs = null;
function setupReveal(){
  if (_revealObs){ _revealObs.disconnect(); _revealObs = null; }
  const cards = document.querySelectorAll('#main .step-card, #main .phase-game, #main .ref-card, #main .res-card, #main .guide-week');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches){ cards.forEach(c => c.classList.add('in')); return; }
  _revealObs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add('in'); _revealObs.unobserve(e.target); }
  }), { threshold: .08 });
  cards.forEach((c, i) => {
    c.classList.add('reveal');
    c.style.transitionDelay = `${Math.min(i, 6) * 60}ms`;
    _revealObs.observe(c);
  });
}
```

- [ ] **Step 2: Call reveal + view transition from `renderMain()`**

In `renderMain()` (search `function renderMain`), at the end of the function add:

```js
  const mainEl = document.getElementById('main');
  mainEl.classList.remove('view-in'); void mainEl.offsetWidth; mainEl.classList.add('view-in');
  setupReveal();
```
(If `renderMain` already calls `setupReveal()`, keep one call only, at the end.)

- [ ] **Step 3: Add the counter tween and use it for XP**

Add near other helpers (e.g. after `xpPop`):

```js
function tweenNumber(el, to, ms = 600){
  const from = parseInt(String(el.textContent).replace(/\D/g, ''), 10) || 0;
  if (from === to || matchMedia('(prefers-reduced-motion: reduce)').matches){ el.textContent = to; return; }
  const t0 = performance.now();
  (function frame(t){
    const k = Math.min(1, (t - t0) / ms);
    el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(frame);
  })(t0);
}
```

In `refreshHeader()` (search `function refreshHeader`), find where `#xp` textContent is set (something like `document.getElementById("xp").textContent = …`) and replace that single assignment with `tweenNumber(document.getElementById("xp"), <same value expression>)`. Leave all other assignments as-is.

- [ ] **Step 4: Level-up burst**

In `addXP()` (search `function addXP`), locate where the level increases (it calls `recomputeLevel` or compares level before/after; read the function first). Where a level-up is detected, add:

```js
    const lvlEl = document.querySelector('header .stat.lvl');
    if (lvlEl){ lvlEl.classList.remove('lvl-burst'); void lvlEl.offsetWidth; lvlEl.classList.add('lvl-burst'); }
```
If `addXP` has no level-up branch (level derived elsewhere), put this in `recomputeLevel()` guarded by `if (state.level > prevLevel)` using a local `prevLevel` captured at function start.

- [ ] **Step 5: Hero particles**

Add this function and call `mountParticles()` at the end of `renderPhase()` (the hero exists only in the phases view):

```js
function mountParticles(){
  const hero = document.querySelector('#main .hero');
  if (!hero || hero.querySelector('#hero-particles')) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.createElement('canvas'); c.id = 'hero-particles'; hero.prepend(c);
  const ctx = c.getContext('2d');
  let w = 0, h = 0;
  const dots = Array.from({ length: 36 }, () => ({
    x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + .6,
    vx: (Math.random() - .5) * .0008, vy: (Math.random() - .5) * .0008,
    a: Math.random() * .45 + .15,
  }));
  const size = () => { w = c.width = hero.clientWidth; h = c.height = hero.clientHeight; };
  size(); addEventListener('resize', size);
  (function tick(){
    if (!document.body.contains(c)) return;       // hero was re-rendered away — stop
    if (!document.hidden){
      ctx.clearRect(0, 0, w, h);
      for (const d of dots){
        d.x = (d.x + d.vx + 1) % 1; d.y = (d.y + d.vy + 1) % 1;
        ctx.beginPath(); ctx.arc(d.x * w, d.y * h, d.r, 0, 7);
        ctx.fillStyle = `rgba(122,162,255,${d.a})`; ctx.fill();
      }
    }
    requestAnimationFrame(tick);
  })();
}
```

- [ ] **Step 6: Quiz feedback classes**

Find the MCQ answer handler (search `const correct = (choice === correctIdx)` in `course/engine.js`). Read the surrounding function to identify the clicked option element (it re-renders or styles the chosen button). Add, right where correctness is known and the option element is in hand:

```js
    optEl.classList.add(correct ? 'quiz-correct' : 'quiz-wrong');
```
If the handler re-renders immediately (classes lost), instead add the class in the post-render markup: the renderer that paints answered options should include `quiz-correct`/`quiz-wrong` in the option's class attribute for the just-answered index. Choose whichever point survives the existing render flow — verify visually.

- [ ] **Step 7: Verify + commit**

`node test.mjs` → passes. Browser: cards rise in on scroll, XP counts up when answering a quiz, correct answer pulses green, wrong shakes, hero has drifting dots, view switch fades. DevTools → Rendering → "Emulate prefers-reduced-motion: reduce" → everything static, content fully visible.

```bash
git add course/engine.js
git commit -m "feat: scroll-reveal, counters, particles, quiz feedback animations"
git push
```

---

## Stage C — Reference, Resources, Study Guide tabs

### Task C1: Data file `course/reference.js`

**Files:**
- Create: `course/reference.js`

- [ ] **Step 1: Create the file with this structure and write all entries**

```js
// course/reference.js — glossary, cheat sheets, model table, one-page explainer.
window.REFERENCE = {
  glossary: [
    { t: "Activation function", d: "A function inside a neuron that decides how strongly it fires. Without it, stacking layers would collapse into one big linear equation." },
    // … ~100 entries total, alphabetical, one plain-English sentence each
  ],
  cheats: [
    { title: "Math symbols decoded", rows: [
      ["Σ", "Sum — add up everything in a list. Σxᵢ means x1+x2+…"],
      // …
    ]},
    { title: "NumPy / PyTorch quick ops", rows: [ /* op, what it does */ ]},
    { title: "Prompting patterns", rows: [ /* pattern, when to use */ ]},
    { title: "Claude API quick reference", rows: [ /* field/model, meaning */ ]},
  ],
  models: [
    { id: "claude-fable-5",  name: "Fable 5",   use: "Most capable — hardest reasoning, agents", cost: "$$$$" },
    { id: "claude-opus-4-8", name: "Opus 4.8",  use: "Deep reasoning, complex code",             cost: "$$$" },
    { id: "claude-sonnet-4-6", name: "Sonnet 4.6", use: "Best balance — default for apps",       cost: "$$" },
    { id: "claude-haiku-4-5-20251001", name: "Haiku 4.5", use: "Fast + cheap — classification, simple chat", cost: "$" },
  ],
  onePage: `…single scrollable HTML explainer…`,
};
```

Glossary must cover (write a one-sentence plain-English definition for each; mine `AI_REFERENCE.md` first — reuse its wording where good):
- **Basics:** AI, machine learning, deep learning, model, training, inference, dataset, feature, label, parameter, weight, bias (the neuron kind), epoch, batch, generalization, baseline
- **Math:** vector, matrix, tensor, dot product, gradient, derivative, chain rule, probability, distribution, mean, variance, standard deviation, norm, logarithm, exponential, softmax, argmax
- **Neural nets:** neuron, layer, hidden layer, activation function, ReLU, sigmoid, loss function, cross-entropy, MSE, backpropagation, optimizer, SGD, Adam, learning rate, learning-rate schedule, warmup, overfitting, underfitting, regularization, dropout, batch norm, layer norm, residual connection, gradient descent, gradient clipping, vanishing gradient
- **NLP/LLM:** token, tokenizer, BPE, vocabulary, embedding, positional encoding, attention, self-attention, multi-head attention, query/key/value, transformer, decoder-only, context window, prompt, system prompt, completion, temperature, top-p, sampling, greedy decoding, hallucination, pretraining, fine-tuning, LoRA, quantization, RLHF, alignment, instruction tuning, checkpoint, perplexity, scaling laws, emergent ability
- **Apps:** API, API key, endpoint, request/response, latency, throughput, streaming, rate limit, prompt caching, RAG, vector database, chunk, chunking, embedding search, cosine similarity, reranking, agent, tool use, function calling, MCP, eval, guardrail, human-in-the-loop
- **Ops:** deployment, environment variable, container, Docker, CI/CD, GPU, VRAM, CUDA, inference server, vLLM, batching, monitoring, logging, rollback

"Claude API quick reference" cheat rows: model ids (verify against the claude-api skill / docs.anthropic.com at execution time), `max_tokens`, `system`, `messages` roles, `temperature`, streaming flag, where pricing lives. The `onePage` explainer: tokens → embeddings → attention → stacked layers → next-token prediction → pretraining → fine-tuning → RLHF, ~10 short sections, each 2–4 sentences plain English, using `<h4>` + `<p>`.

- [ ] **Step 2: Parse check + commit**

Run: `node -e "new Function(require('fs').readFileSync('course/reference.js','utf8')); console.log('parses')"`
```bash
git add course/reference.js
git commit -m "feat: reference data — glossary, cheat sheets, model table, one-page LLM explainer"
```

### Task C2: Data file `course/resources.js`

**Files:**
- Create: `course/resources.js`

- [ ] **Step 1: Create with this structure; write all phases**

```js
// course/resources.js — curated free external resources per phase, in watch order.
window.RESOURCES = [
  { phaseId: 0, items: [
    { title: "Python.org official tutorial (ch. 1-3)", url: "https://docs.python.org/3/tutorial/", why: "The canonical 'what is Python' from the source." },
    // …
  ]},
  // … one entry per phaseId: 0, 1, 15, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
];
```

Required inclusions (add `why` lines and watch order yourself; 5–10 items per phase):
- **Math (id 2):** 3Blue1Brown "Essence of Linear Algebra" + "Essence of Calculus" (YouTube), Khan Academy probability, Mathematics for Machine Learning (free PDF, mml-book.github.io)
- **Classical ML (id 4):** StatQuest (Josh Starmer) core playlists, scikit-learn user guide, Google ML Crash Course
- **Deep learning (id 5):** Karpathy "Neural Networks: Zero to Hero" (full playlist), 3Blue1Brown neural-net series, PyTorch official tutorials, fast.ai Practical Deep Learning
- **NLP (id 6):** Hugging Face NLP course, Jurafsky & Martin Speech and Language Processing (free draft)
- **Transformers (id 7):** "Attention Is All You Need" (arxiv.org/abs/1706.03762), Karpathy "Let's build GPT", The Illustrated Transformer (jalammar.github.io), Karpathy minbpe repo
- **Pretraining (id 8):** Karpathy nanoGPT repo, Chinchilla paper (arxiv.org/abs/2203.15556), GPT-2/GPT-3 papers
- **Fine-tuning (id 9):** LoRA paper (arxiv.org/abs/2106.09685), InstructGPT paper (arxiv.org/abs/2203.02155), HF PEFT docs
- **Claude apps (id 10):** docs.anthropic.com, Anthropic cookbook (github.com/anthropics/anthropic-cookbook), Anthropic prompting guide
- **RAG (id 11):** Anthropic contextual-retrieval post, sentence-transformers docs
- **Agents (id 12):** Anthropic "Building effective agents" essay, MCP docs (modelcontextprotocol.io)
- **MLOps (id 13):** Docker getting-started, vLLM docs, Railway docs, RunPod docs
- **Papers/portfolio (id 14):** "How to read a paper" (Keshav), arxiv-sanity, Distill.pub archive
- Phases 0/1/15 (ids 0, 1, 15): official Python tutorial, Automate the Boring Stuff (free online), Railway quickstart, Real Python beginners track

All URLs must be real and stable. At execution, spot-check each URL resolves (HEAD request or open).

- [ ] **Step 2: Parse check + commit**

Run: `node -e "new Function(require('fs').readFileSync('course/resources.js','utf8')); console.log('parses')"`
```bash
git add course/resources.js
git commit -m "feat: curated external resources per phase"
```

### Task C3: Data file `course/studyguide.js`

**Files:**
- Create: `course/studyguide.js`

- [ ] **Step 1: Create with this structure**

```js
// course/studyguide.js — printable syllabus: weekly schedule, checkpoints, self-checks.
window.STUDY_GUIDE = {
  pace: "Designed for ~8-10 hrs/week → finishes in ~7-8 months. Halve the hours, double the calendar.",
  weeks: [
    { wk: "1", phase: "0 + 0.5", focus: "Setup + Python basics", goal: "test_claude.py runs; 50 Python drills done" },
    // … ~30 rows covering all phases at the spec's 6-9 month pace
  ],
  checkpoints: [
    { after: "Phase 1 (Math)", check: [
      "Can you compute a 2x2 matrix multiply on paper?",
      "Can you explain what a gradient points toward?",
      // 3-5 items each
    ]},
    // … one block per major phase
  ],
};
```

Weekly schedule math: total course ≈ 350–570 hrs; at 8–10 hrs/week the midpoint lands ≈ 30 weeks. Allocate weeks proportional to each phase's `est` hours (e.g. Math 25–40 hrs → 3–4 weeks; Transformers 40–60 hrs → 5–6 weeks). Use `AI_ZERO_TO_HERO.md` as the source roadmap — keep consistent with it.

- [ ] **Step 2: Parse check + commit**

Run: `node -e "new Function(require('fs').readFileSync('course/studyguide.js','utf8')); console.log('parses')"`
```bash
git add course/studyguide.js
git commit -m "feat: study guide data — weekly syllabus and phase checkpoints"
```

### Task C4: Renderers, tabs, search, print CSS — wire it all

**Files:**
- Modify: `ai_master_course.html` (tab buttons + script tags), `course/engine.js` (renderers + branches), `course/course.css` (cards + print), `sw.js` (3 files + version), `test.mjs` (no change needed — section 3 picks up new script tags automatically)

- [ ] **Step 1: Add script tags to `ai_master_course.html`** — before the `course/engine.js` tag:

```html
<script src="course/reference.js"></script>
<script src="course/resources.js"></script>
<script src="course/studyguide.js"></script>
```

- [ ] **Step 2: Add sidebar tab buttons** — in `<nav class="tabs">` after the Badges button:

```html
<button data-view="reference" onclick="switchView('reference')">Ref</button>
<button data-view="resources" onclick="switchView('resources')">Links</button>
<button data-view="guide" onclick="switchView('guide')">Guide</button>
```
(Mobile bottom nav unchanged per spec — drawer reaches these.)

- [ ] **Step 3: Add view branches in `course/engine.js`**

In `renderMain()`'s view dispatch (search `else if(currentView==="badges")`), add:

```js
  else if(currentView==="reference") renderReference();
  else if(currentView==="resources") renderResources();
  else if(currentView==="guide") renderStudyGuide();
```

In `renderSidebar()`'s view dispatch (search how `games`/`review` views fill `#sidebar-content`), add equivalent branches that render a simple section list:
- reference → buttons "Glossary / Cheat sheets / Models / LLM on one page" that `document.getElementById(anchorId)?.scrollIntoView({behavior:'smooth'})`
- resources → one button per phase (same phase titles), scrolling to that phase's anchor
- guide → buttons "Schedule / Checkpoints / Print" (Print calls `window.print()`)

- [ ] **Step 4: Add the three renderers to `course/engine.js`** (near `renderPortfolio`):

```js
function renderReference(){
  const R = window.REFERENCE || {};
  const main = document.getElementById("main");
  const cheatHtml = (R.cheats || []).map(c => `
    <div class="ref-card"><h4>${escapeHtml(c.title)}</h4>
      <table>${c.rows.map(r => `<tr><td><code>${escapeHtml(r[0])}</code></td><td>${escapeHtml(r[1])}</td></tr>`).join("")}</table>
    </div>`).join("");
  const modelHtml = `<table class="ref-table"><tr><th>Model</th><th>ID</th><th>Use for</th><th>Cost</th></tr>
    ${(R.models || []).map(m => `<tr><td><b>${escapeHtml(m.name)}</b></td><td><code>${escapeHtml(m.id)}</code></td><td>${escapeHtml(m.use)}</td><td>${escapeHtml(m.cost)}</td></tr>`).join("")}</table>`;
  main.innerHTML = `
    <div class="hero"><h2>📖 Reference Library</h2><p class="intro-text">Look things up while you study. Search the glossary, skim a cheat sheet, or read the one-page LLM explainer.</p></div>
    <h3 id="ref-glossary">Glossary</h3>
    <input id="gloss-search" type="search" placeholder="Search ${(R.glossary || []).length} terms…" oninput="glossaryFilter(this.value)"
      style="width:100%;max-width:420px;padding:10px 14px;border-radius:8px;border:1px solid var(--border);background:var(--panel2);color:var(--ink);font-size:14px">
    <div id="gloss-list"></div>
    <h3 id="ref-cheats">Cheat sheets</h3>${cheatHtml}
    <h3 id="ref-models">Claude models</h3><div class="ref-card">${modelHtml}
      <p style="color:var(--muted);font-size:12px">IDs change with releases — verify at docs.anthropic.com/en/docs/about-claude/models</p></div>
    <h3 id="ref-onepage">How an LLM works — on one page</h3><div class="ref-card">${R.onePage || ""}</div>`;
  glossaryFilter("");
  setupReveal();
}
function glossaryFilter(q){
  const R = window.REFERENCE || {}; q = String(q).trim().toLowerCase();
  const hits = (R.glossary || []).filter(g => !q || g.t.toLowerCase().includes(q) || g.d.toLowerCase().includes(q));
  document.getElementById("gloss-list").innerHTML = hits.length
    ? `<div class="gloss-grid">${hits.map(g => `<div class="ref-card"><b>${escapeHtml(g.t)}</b><p>${escapeHtml(g.d)}</p></div>`).join("")}</div>`
    : `<p style="color:var(--muted)">No matching terms.</p>`;
}
function renderResources(){
  const main = document.getElementById("main");
  const blocks = (window.RESOURCES || []).map(r => {
    const p = COURSE.find(x => x.id === r.phaseId);
    if (!p) return "";
    return `<h3 id="res-${r.phaseId}">${escapeHtml(p.title)}</h3>` + r.items.map((it, i) => `
      <div class="res-card ref-card"><b>${i + 1}. <a href="${escapeHtml(it.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(it.title)}</a></b>
      <p>${escapeHtml(it.why)}</p></div>`).join("");
  }).join("");
  main.innerHTML = `<div class="hero"><h2>🔗 Curated Resources</h2><p class="intro-text">The best free material on the internet, in watch order, per phase. Numbers = recommended order.</p></div>${blocks}`;
  setupReveal();
}
function renderStudyGuide(){
  const G = window.STUDY_GUIDE || {};
  const main = document.getElementById("main");
  main.innerHTML = `
    <div class="hero"><h2>🗓️ Study Guide</h2><p class="intro-text">${escapeHtml(G.pace || "")}</p>
      <button class="tool" onclick="window.print()" style="margin-top:8px">🖨️ Print this guide</button></div>
    <h3 id="guide-schedule">Week-by-week schedule</h3>
    <table class="ref-table guide-table"><tr><th>Week</th><th>Phase</th><th>Focus</th><th>Done when…</th></tr>
      ${(G.weeks || []).map(w => `<tr><td>${escapeHtml(w.wk)}</td><td>${escapeHtml(w.phase)}</td><td>${escapeHtml(w.focus)}</td><td>${escapeHtml(w.goal)}</td></tr>`).join("")}</table>
    <h3 id="guide-checkpoints">Ready for the next phase? Self-checks</h3>
    ${(G.checkpoints || []).map(c => `<div class="guide-week ref-card"><h4>After ${escapeHtml(c.after)}</h4>
      <ul>${c.check.map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul></div>`).join("")}`;
  setupReveal();
}
```

- [ ] **Step 5: Card + print CSS** — append to `course/course.css`:

```css
/* ===== Stage C: reference/resources/guide ===== */
.ref-card{background:linear-gradient(180deg,var(--panel),rgba(20,26,42,.6));border:1px solid var(--border-soft);border-radius:var(--rad);padding:14px 16px;margin:10px 0}
.ref-card p{color:var(--muted);font-size:13.5px;margin:4px 0 0}
.gloss-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px;margin-top:12px}
.gloss-grid .ref-card{margin:0}
.ref-table{width:100%;border-collapse:collapse;font-size:13.5px}
.ref-table th,.ref-table td{padding:8px 10px;border-bottom:1px solid var(--border-soft);text-align:left;vertical-align:top}
.ref-table th{color:var(--accent);font-size:12px;text-transform:uppercase;letter-spacing:.04em}
@media print{
  header.topbar,aside,.mobile-nav,.tools,#streak-banner,.hero button{display:none!important}
  body,html{background:#fff!important;color:#111!important}
  main{max-width:100%;padding:0}
  h2,h3,h4{color:#111!important;-webkit-text-fill-color:#111!important;background:none!important}
  .ref-card,.guide-week{border:1px solid #bbb;break-inside:avoid;background:#fff}
  .ref-card p,.ref-table td{color:#222!important}
  a{color:#111;text-decoration:underline}
}
```

- [ ] **Step 6: `sw.js`** — add to OPTIONAL: `'./course/reference.js', './course/resources.js', './course/studyguide.js',` and bump VERSION → `'aizh-v9'`.

- [ ] **Step 7: Verify + commit**

`node test.mjs` → passes (new script tags found on disk). Browser: three new tabs render; glossary search filters live and shows "No matching terms." on garbage input; resource links open in new tabs; Guide → Print preview shows clean white pages without sidebar/header. Reduced-motion check still fine.

```bash
git add -A
git commit -m "feat: Reference, Resources, and Study Guide views with glossary search and print CSS"
git push
```
Confirm CI green.

---

## Stage D — Content expansion (the master-teacher pass)

**Format for every new lesson** (matches existing data exactly — see any current lesson in `course/content/c01-setup.js`):

```js
{h:"Lesson title", body:`<p>…HTML…</p>`, code:`…optional code sample…`},
```

**Reusable HTML patterns inside `body`** (all style-free, existing CSS covers them):
- Mental-model box: `<p><b>Mental model:</b> …analogy…</p>`
- Mistakes callout: `<p><b>Common novice mistakes:</b></p><ul><li>…</li></ul>`
- Worked example: `<p><b>Worked example:</b></p>` followed by the arithmetic spelled out digit by digit
- Tables use bare `<table><tr><th>…` (already styled)

New lessons are **appended to the `lessons` array** of the phase unless an insertion point is named. Do not renumber, remove, or edit existing lessons or quizzes — progress references them.

One fully-written example of the expected depth (this exact lesson IS part of Task D1 — include it verbatim in c01):

```js
{h:"What IS artificial intelligence, actually?", body:`<p>Before installing anything, get the map straight. These four terms nest inside each other like Russian dolls:</p>
<table>
<tr><th>Term</th><th>What it means</th><th>Example</th></tr>
<tr><td><b>AI</b></td><td>Any program that does something we'd call "smart"</td><td>Chess engine, spam filter, ChatGPT</td></tr>
<tr><td><b>Machine Learning</b></td><td>AI that learns rules from examples instead of being hand-coded</td><td>Spam filter trained on 10,000 emails</td></tr>
<tr><td><b>Deep Learning</b></td><td>ML using neural networks with many layers</td><td>Image recognition, speech-to-text</td></tr>
<tr><td><b>LLM</b></td><td>Deep learning model trained on text to predict the next token</td><td>Claude, GPT</td></tr>
</table>
<p><b>Mental model:</b> AI is the building, ML is a floor in it, deep learning is a room on that floor, and LLMs are one (very loud) machine in that room. This course walks you from the front door to that machine.</p>
<p><b>The single most important sentence in this course:</b> an LLM is a program that, given some text, predicts which token (word-piece) most likely comes next — and everything it appears to "know" or "reason" emerges from doing that prediction extremely well.</p>
<p><b>Common novice mistakes:</b></p>
<ul>
<li>Thinking "AI" means one technology. It's an umbrella over very different tools.</li>
<li>Thinking LLMs look things up in a database. They don't — they generate from learned patterns (which is also why they can confidently make things up).</li>
<li>Thinking you must master ALL of AI. You're following one path: the LLM path.</li>
</ul>`},
```

### Task D1: Expand c01-setup, c02-python, c03-first-app

**Files:**
- Modify: `course/content/c01-setup.js`, `c02-python.js`, `c03-first-app.js`

- [ ] **Step 1: c01-setup — add 4 lessons.** Insert "What IS artificial intelligence, actually?" (verbatim above) as the FIRST lesson. Append three more:
  1. *"How a computer 'learns' — the 60-second version"* — dial-tuning analogy: model = machine with millions of dials (parameters); training = nudge dials to reduce wrongness (loss) on examples; worked example: predicting house price with one dial, show two guesses and the adjustment. Mistakes: thinking the machine understands; thinking more data always fixes everything.
  2. *"What happens when you call the Claude API (the full journey)"* — trace one request: your Python builds JSON → HTTPS to api.anthropic.com → auth check via key → tokens in → GPU datacenter predicts tokens out → JSON back → `msg.content[0].text`. Mental model: restaurant order (menu = API docs, kitchen = GPU cluster, bill = usage tokens). Code: annotated request/response JSON pair.
  3. *"How to read an error message without panicking"* — anatomy of a Python traceback bottom-up; table of the 5 errors beginners hit (`ModuleNotFoundError`, `AuthenticationError`, `SyntaxError`, `IndentationError`, `NameError`) with cause + fix each. Mistakes: reading top-down; retyping instead of reading.

- [ ] **Step 2: c02-python — add 5 lessons** (novice-critical phase):
  1. *"Variables are labeled boxes (and Python's 4 basic types)"* — int/float/str/bool with `type()` worked examples; mistake: `"5" + 5`.
  2. *"Lists vs dictionaries — when each"* — list = numbered shelf, dict = labeled drawers; same data both ways side by side; mistake: index-out-of-range, KeyError.
  3. *"Loops and functions, by tracing"* — trace a `for` loop iteration by iteration in a table; function = recipe with ingredients (args) and a dish (return). Code: trace printed.
  4. *"f-strings and slicing — the two tools you'll use daily"* — worked slice examples on `"transformer"`, off-by-one callout.
  5. *"Reading other people's Python (the skill nobody teaches)"* — how to walk an unfamiliar 20-line script: imports → entry point → data flow; annotated example script.

- [ ] **Step 3: c03-first-app — add 3 lessons:**
  1. *"What is a web app? Client, server, and where your code lives"* — browser/server request loop diagrammed in a table; where Railway fits; mental model: waiter (frontend) + kitchen (backend).
  2. *"Secrets and environment variables — why the key never goes in code"* — what happens when a key leaks on GitHub (bots scan public repos in minutes); env vars as a separate pocket; Railway dashboard variables = same idea in the cloud. Code: `os.environ` read + `.gitignore` for `.env`.
  3. *"When someone visits your deployed app — the request trace"* — DNS → Railway container → your Python → Claude API → response; where each failure shows up (502 vs timeout vs auth error) and the log line that diagnoses it.

- [ ] **Step 4: Verify + commit**

Run: `node test.mjs` → passes (parse check covers the edited files). Browser: open Phases 0/0.5/0.75 — new lessons render with numbering, copy buttons work, quizzes still pass and grant XP.
```bash
git add course/content/c01-setup.js course/content/c02-python.js course/content/c03-first-app.js
git commit -m "content: deep novice lessons for setup, Python basics, first app"
```

### Task D2: Expand c04-math, c05-python-ml

**Files:**
- Modify: `course/content/c04-math.js`, `course/content/c05-python-ml.js`

- [ ] **Step 1: c04-math — add 6 lessons:**
  1. *"Why ML needs math at all (read before fearing it)"* — only 4 ideas needed: vectors (data as numbers), matrix multiply (transforming data), derivatives (which way to adjust), probability (handling uncertainty). Map each to where it appears later in the course.
  2. *"Vectors: arrows AND lists at the same time"* — [3,4] as point, arrow, and feature list; length via Pythagoras worked: √(9+16)=5. Mistake: thinking vectors are only geometry.
  3. *"Dot product worked to the digit"* — [2,1]·[3,4] = 6+4 = 10; meaning: alignment score; connect forward to attention scores. Mistake: confusing dot (scalar out) with elementwise.
  4. *"Matrix multiply = many dot products"* — full 2×2 worked, every cell's arithmetic written out; rows-into-columns rule; shape rule (m×n)(n×p)→(m×p) with the "inner numbers must match" mantra.
  5. *"Derivative = slope, gradient = many slopes"* — f(x)=x² at x=3: nudge to 3.01, show Δ; gradient as the "all dials at once" version; descent = walk downhill. Worked numeric gradient step with learning rate 0.1.
  6. *"Chain rule with real numbers"* — f(g(x)) with g(x)=2x, f(u)=u² at x=3: outer'·inner' = (2·6)·2 = 24; say explicitly: backprop is this, repeated thousands of times.

- [ ] **Step 2: c05-python-ml — add 4 lessons:**
  1. *"NumPy shapes — the #1 source of bugs"* — `(3,)`, `(3,1)`, `(1,3)` are three different things; show each printed; the shape-mismatch error message decoded word by word.
  2. *"Broadcasting, drawn out"* — (3,1)+(1,4)→(3,4) worked cell by cell in a table; rule: dimensions match if equal or one is 1. Mistake: silent wrong-answer broadcasts.
  3. *"Pandas mental model: a dict of columns"* — DataFrame = dict of named NumPy arrays; `df["col"]` vs `df.loc` vs `df.iloc` decision table.
  4. *"Anatomy of a Matplotlib chart"* — figure/axes/plot/labels each one line, fully annotated; the 4-line skeleton that covers 90% of needs.

- [ ] **Step 3: Verify + commit**

`node test.mjs` → passes. Browser-check both phases.
```bash
git add course/content/c04-math.js course/content/c05-python-ml.js
git commit -m "content: worked-example math and NumPy/Pandas lessons"
```

### Task D3: Expand c06-classical-ml, c07-deep-learning, c08-nlp

**Files:**
- Modify: `course/content/c06-classical-ml.js`, `c07-deep-learning.js`, `c08-nlp.js`

- [ ] **Step 1: c06-classical-ml — add 4 lessons:**
  1. *"Train/test split — why models cheat if you let them"* — studying past exam vs sitting new exam; data leakage defined with a concrete leak example (normalizing before splitting).
  2. *"Overfitting = memorizing, underfitting = not studying"* — same dataset, three curves described (too simple/right/too wiggly); how to spot each from train-vs-test scores table.
  3. *"Loss functions in plain English"* — MSE worked on 3 predictions; cross-entropy as "surprise"; why you pick one per task type (regression vs classification).
  4. *"Accuracy lies: precision, recall, and the cancer test"* — 99% accuracy on 1%-positive data by always saying "no"; precision/recall worked from a 2×2 confusion matrix with real counts.

- [ ] **Step 2: c07-deep-learning — add 5 lessons:**
  1. *"A neuron is a weighted vote"* — inputs×weights+bias→activation worked with 3 numbers; mental model: bouncer scoring guests.
  2. *"Why layers? Composition builds concepts"* — edges→shapes→faces story; XOR as the classic "one layer can't, two can".
  3. *"Backprop with three numbers, end to end"* — 1-neuron net, input 2, weight 0.5, target 3: forward pass, loss, gradient, update with lr 0.1, second forward pass showing loss drop. Every multiplication written out. This is the course's centerpiece worked example — take the space it needs.
  4. *"The training loop, line by line"* — the canonical 8-line PyTorch loop with every line annotated (`zero_grad` why, `backward` what, `step` what). Mistake: forgetting `zero_grad`.
  5. *"Loss won't go down — the debugging checklist"* — ordered checklist: lr too high/low → data not shuffled → labels misaligned → wrong loss for task → overfit single batch test ("can it memorize 10 samples? if not, bug").

- [ ] **Step 3: c08-nlp — add 4 lessons:**
  1. *"Why text is hard for computers"* — computers need numbers; naive word-numbering fails (no similarity meaning); sets up embeddings.
  2. *"Tokenization end to end"* — "unbelievable" → ["un","believ","able"] style walk; why subwords beat whole words (rare-word problem) and characters (sequence length).
  3. *"Embeddings: meaning as coordinates"* — king−man+woman≈queen worked conceptually; cosine similarity as angle; 2-D toy table of 4 words with coordinates and computed similarity.
  4. *"From counting to context"* — bag-of-words → word2vec → contextual (the same word "bank" gets different vectors per sentence); one paragraph each, sets up transformers.

- [ ] **Step 4: Verify + commit**

`node test.mjs`; browser-check all three phases.
```bash
git add course/content/c06-classical-ml.js course/content/c07-deep-learning.js course/content/c08-nlp.js
git commit -m "content: classical ML, deep learning, and NLP foundations lessons"
```

### Task D4: Expand c09-transformers, c10-pretrain, c11-finetune

**Files:**
- Modify: `course/content/c09-transformers.js`, `c10-pretrain.js`, `c11-finetune.js`

- [ ] **Step 1: c09-transformers — add 5 lessons:**
  1. *"Attention with real numbers (tiny worked example)"* — 3 tokens, 2-dim Q/K/V given as literal numbers; compute all 9 dot products, softmax row (arithmetic shown), weighted sum for one token. The single most important worked example in the course — full space.
  2. *"Q, K, V: the library analogy"* — query = what I'm looking for, key = each book's spine label, value = the book's content; why three separate learned projections instead of one.
  3. *"Why positional encoding exists"* — attention is order-blind (show: same scores for shuffled tokens); position vectors added so "dog bites man" ≠ "man bites dog".
  4. *"Residuals and LayerNorm: why deep nets train at all"* — residual = "keep a copy of the input" (gradient highway); LayerNorm = "re-center the numbers so they don't explode"; what breaks without each.
  5. *"One full forward pass, narrated"* — token ids → embeddings → +position → [attention → MLP] ×N → final projection → softmax over vocab → next-token probabilities; table mapping each step to its tensor shape for a (batch=1, seq=4, d=8) toy.

- [ ] **Step 2: c10-pretrain — add 4 lessons:**
  1. *"What pretraining actually optimizes"* — next-token cross-entropy on billions of tokens; loss 10.8→3.2 means perplexity e^loss explained with numbers.
  2. *"From raw text to a training batch"* — text → tokenize → concat → chop into 1024-token windows → stack into batches; inputs vs labels = same window shifted by one (shown literally on a 6-token toy).
  3. *"Warmup and LR schedules — why the ramp"* — early steps have garbage gradients (random init), big lr then = explosion; cosine decay because late training needs gentle steps; the canonical curve described point by point.
  4. *"Reading a loss curve like a doctor"* — table: spiky = lr too high / plateau = lr too low or data issue / train-val gap growing = overfit / sudden spike = bad batch or NaN; what to do for each.

- [ ] **Step 3: c11-finetune — add 4 lessons:**
  1. *"Prompt vs fine-tune vs pretrain: the decision guide"* — cost/data/effort table; rule of thumb: prompt first, fine-tune when prompting plateaus AND you have 100s+ examples, pretrain ≈ never (you personally).
  2. *"LoRA with actual parameter math"* — full layer d=4096: 4096×4096 ≈ 16.8M params; LoRA r=8: 4096×8 + 8×4096 = 65,536 → 0.4% of the original, arithmetic written out; mental model: sticky notes on a textbook instead of rewriting it.
  3. *"The RLHF pipeline as a story"* — three acts: SFT (show it good answers) → reward model (teach a judge human taste) → RL (optimize against the judge); what each stage fixes and the failure mode it introduces (reward hacking).
  4. *"Catastrophic forgetting and how to notice it"* — fine-tune on legal docs, model forgets chitchat; always keep an eval set from BEFORE fine-tuning and diff scores after.

- [ ] **Step 4: Verify + commit**

`node test.mjs`; browser-check all three phases.
```bash
git add course/content/c09-transformers.js course/content/c10-pretrain.js course/content/c11-finetune.js
git commit -m "content: transformers, pretraining, and fine-tuning deep lessons"
```

### Task D5: Expand c12-claude-apps, c13-rag, c14-agents, c15-mlops, c16-portfolio

**Files:**
- Modify: `course/content/c12-claude-apps.js`, `c13-rag.js`, `c14-agents.js`, `c15-mlops.js`, `c16-portfolio.js`

- [ ] **Step 1: c12-claude-apps — add 5 lessons** (verify model ids/pricing against the claude-api skill at execution time):
  1. *"Anatomy of a messages.create call — every field"* — table: model, max_tokens, system, messages, temperature, stop_sequences; what each does, default, when to change it.
  2. *"System prompts that actually work"* — 4 patterns with before/after examples: role assignment, output format contract, refusal rules, few-shot examples; mistake: novel-length prompts that bury the instruction.
  3. *"Streaming: why and how"* — perceived latency story (first token at 0.5s vs full answer at 8s); annotated streaming code with the event loop explained.
  4. *"Tool use, traced step by step"* — full round-trip: tools param → `stop_reason:"tool_use"` → your code runs the function → `tool_result` message → final answer; annotated JSON for each leg.
  5. *"Cost control: caching, model choice, max_tokens"* — worked bill: same app on Haiku vs Sonnet at 1k requests/day; prompt caching = pay full once, ~10% on repeats — when it pays (long stable system prompt).

- [ ] **Step 2: c13-rag — add 4 lessons:**
  1. *"Why RAG exists"* — knowledge cutoff + private data + hallucination; "open-book exam" mental model.
  2. *"Chunking: the decisions that matter"* — too small = context-free fragments, too big = diluted relevance; worked example: same document at 100 vs 1000 tokens against one query, which chunk wins and why; overlap explained.
  3. *"One query, end to end"* — question → embed → cosine search top-k (toy numbers: 4 chunks with similarity scores) → stuff into prompt → cite sources; where each quality failure enters.
  4. *"When RAG fails: the retrieval debugging guide"* — symptom→cause table: right answer in corpus but wrong chunk retrieved (embedding mismatch — try reranking) / chunk retrieved but answer wrong (prompt doesn't force grounding) / slow (index type).

- [ ] **Step 3: c14-agents — add 4 lessons:**
  1. *"An agent is a loop"* — while-not-done: model decides → tool runs → result appended → repeat; one full trace of a 3-step task ("find cheapest flight": search → filter → report) with the message list growing each turn.
  2. *"Tool design rules"* — few/clear/typed: names that say what they do, descriptions written for the model not humans, return errors as content (model can recover) not exceptions.
  3. *"Why agents fail: error compounding"* — 95% per-step success ^ 10 steps ≈ 60% — arithmetic shown; mitigations: fewer steps, checkpoints, verification steps.
  4. *"Guardrails and the human in the loop"* — spend caps, allowed-tool lists, confirm-before-irreversible; map each to a line of code or config, not vibes.

- [ ] **Step 4: c15-mlops — add 4 lessons:**
  1. *"Dev vs prod: what changes when real people show up"* — table: secrets, errors, scale, logging, rollback; "it works on my machine" autopsied.
  2. *"Docker mental model: a shipping container for code"* — image vs container vs Dockerfile; annotated 6-line Dockerfile for a Python API; why Railway builds it for you (and when that stops being enough).
  3. *"Monitoring an LLM app"* — the 4 numbers to watch: latency p95, error rate, token spend/day, output-quality sample; cheapest viable setup: structured logs + a daily spend query.
  4. *"GPU serving notes: vLLM on RunPod"* — why vLLM (batching, paged attention, one-line plain-English version of each); pod → model download → OpenAI-compatible endpoint → point your client at it; cost math: pod $/hr vs per-token API — break-even sketch.

- [ ] **Step 5: c16-portfolio — add 3 lessons:**
  1. *"How to read a paper in three passes"* — Keshav method concretized on "Attention Is All You Need": pass 1 = title/abstract/figures (10 min), pass 2 = intro+conclusions+skim method (1 hr), pass 3 = re-derive (only if implementing).
  2. *"Writing about your work (the README that gets you hired)"* — structure: what it does in one sentence → demo gif/screenshot → run-it-in-3-commands → how it works → what you'd improve; before/after example of a bad vs good project description.
  3. *"The portfolio that beats a resume"* — 3 deep projects > 12 toys; each needs: deployed link, README per above, one writeup of a real problem you hit; map to this course's phase deliverables.

- [ ] **Step 6: Verify + commit + final version bump**

`node test.mjs` → passes. Browser: spot-check every expanded phase renders, quiz XP still works, Review tab SRS unaffected. Bump `sw.js` VERSION → `'aizh-v10'`.
```bash
git add -A
git commit -m "content: applications, RAG, agents, MLOps, portfolio lessons; sw cache bump"
git push
```
Confirm CI green and the live Pages site shows everything after two hard reloads.

---

## Final acceptance checklist (run after Stage D)

- [ ] file:// open: zero console errors; pre-existing XP/streak/progress intact
- [ ] All 16 phases in order Phase 0 → 13; each expanded phase shows its new lessons
- [ ] One quiz answered: green pulse + XP counter tween + SRS item queued
- [ ] Reference: glossary search live-filters; "No matching terms." on garbage; model table renders
- [ ] Resources: every link opens new tab with `noopener`
- [ ] Guide: print preview = clean white pages, no chrome
- [ ] Reduced-motion emulation: zero motion, all content visible
- [ ] `node test.mjs` exit 0; GitHub Actions green
- [ ] Live GitHub Pages site verified after service-worker update (hard reload ×2)
