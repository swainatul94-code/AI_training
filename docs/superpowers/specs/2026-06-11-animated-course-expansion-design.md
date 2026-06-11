# Design: Animated Course Site + Comprehensive AI Learning Content

**Date:** 2026-06-11
**Status:** Approved by user
**Target:** `AI_training` repo (GitHub Pages hosted, also runs from disk via file://)

## Goal

Two improvements to the AI Zero → Hero course site (`ai_master_course.html`, currently a 409KB single-file app):

1. **Richer animation** — "rich but tasteful" tier: motion that rewards progress and guides attention without distracting from study.
2. **Comprehensive learning content** — the user is a novice learner; the site should teach AI from absolute zero. All four content types approved: deeper in-phase lessons, a Reference library, curated external resources, and a printable study guide.

A hard constraint from user preference: **every explanation assumes zero prior knowledge.** Plain English first, every term defined at first use, analogy before math.

## Architecture: split the monolith

**Repo context (discovered during planning):** the repo root already hosts a separate main site (`index.html`, `styles.css`, `app.js`), a service worker (`sw.js`) that precaches pages, and a CI self-test (`test.mjs` via `.github/workflows/ci.yml`). Therefore:

- The course shell **keeps its name** `ai_master_course.html` (main site, sw.js, and sitemap link to it). Root `index.html` belongs to the main site and is untouched.
- All new course assets live under a `course/` folder, clearly separated from main-site assets.
- `sw.js` must add the new files to its precache list and bump `VERSION` on each deploy stage.
- `test.mjs` must be updated: its "inline script parses" check becomes "all `course/*.js` files parse", and its asset-existence scan must also cover `ai_master_course.html` references.

```
AI_training/
├── ai_master_course.html   ← shell only: layout skeleton + <link> + <script src> tags
├── course/
│   ├── course.css          ← all current course CSS + new animation CSS
│   ├── engine.js           ← all current app logic (XP, SRS, quizzes, games)
│   ├── content/
│   │   ├── c01-setup.js    ← one file per phase (16 files),
│   │   ├── c02-python.js      numbered by course order (c01–c16),
│   │   ├── c03-first-app.js   not by phase label — avoids the
│   │   ├── c04-math.js …      "Phase 0.5 vs Phase 5" name collision
│   │   └── c16-portfolio.js
│   ├── reference.js        ← glossary + cheat sheets + model table data
│   ├── resources.js        ← curated external links per phase
│   └── studyguide.js       ← roadmap/syllabus data
```

**Loading mechanism:** plain `<script src>` tags in dependency order (content files → reference/resources/studyguide → engine). Each content file does `COURSE_PHASES.push({...})` into a global array; the engine sorts by an explicit `order` field and builds `COURSE`. No `fetch()`, no modules — this keeps the site working both on GitHub Pages and when double-clicked from disk (file:// has no CORS-safe fetch).

**Progress compatibility (critical):** phase `id` values stay exactly as today (`0, 1, 15, 2–14` — non-sequential, with Phase 0.75 as id 15) and the localStorage key is unchanged. Existing XP, streaks, quiz results, and SRS queue must survive the refactor byte-for-byte. The engine must always look up phases by `.find(p => p.id === …)`, never by array index.

**Migration safety:** the monolith is converted to the shell in place (same filename, same URL); git history is the backup. The split is verified (browser + `node test.mjs`) before commit.

**CSP note:** the existing CSP meta tag (`script-src 'self' 'unsafe-inline'`) already permits same-origin external JS files; it carries over to `index.html` unchanged.

## Content design

### a) Deeper lessons per phase

Each of the 16 phases gains 3–6 new lessons in the existing lesson format (`{h, body, code?}`), interleaved where they fit pedagogically. Heaviest expansion in Phases 0–4 (setup through deep learning) — that is where novices drown. Each new lesson uses:

- **Mental-model boxes** — e.g. "attention = spotlight that decides which earlier words matter"
- **Worked examples with real numbers** — not just formulas
- **"Common novice mistakes" callouts**
- **ASCII/SVG diagrams** where a picture beats a paragraph

Content uses the user's real context where relevant: Claude API as the default LLM provider, Railway hobby plan as deploy target for Phases 9–11, RunPod for Phase 12 GPU work.

### b) Reference tab (new sidebar view)

Four sections:

1. **Glossary** — ~100 AI terms A–Z, one plain-English sentence each, with a client-side search/filter box.
2. **Cheat sheets** — math symbols decoded (Σ, ∂, ∇, etc.), NumPy/PyTorch common ops, prompting patterns, Claude API quick-reference (current model IDs, basic call shape, pricing pointers).
3. **Model table** — current Claude models, what each is for, cost tier.
4. **"LLM on one page"** — single scrollable explainer from tokens → embeddings → attention → pretraining → fine-tuning → RLHF.

### c) Resources tab (new sidebar view)

Per phase: 5–10 best free external resources (3Blue1Brown, Karpathy nn-zero-to-hero, StatQuest, fast.ai, key papers like "Attention Is All You Need") with explicit watch-order and one line on why each matters. All links `target="_blank" rel="noopener noreferrer"`.

### d) Study Guide tab (new sidebar view)

Printable syllabus: week-by-week schedule paced for ~6–9 months, per-phase checkpoints, "ready for the next phase?" self-check lists. Includes `@media print` CSS so it prints clean (no sidebar/header, dark theme inverted to light).

## Animation design ("rich but tasteful")

| Animation | Mechanism |
|---|---|
| Scroll-reveal on lesson cards (fade + rise, staggered) | IntersectionObserver, CSS transitions |
| Animated counters (XP, percentages count up) | rAF tween |
| Phase-switch content transition (fade/slide) | CSS class swap on render |
| Hero floating particle field | small canvas, capped particle count, pauses when tab hidden |
| Quiz feedback: correct = green pulse, wrong = shake | CSS keyframes |
| XP bar shimmer; level-up glow burst | CSS keyframes |
| Button press micro-interactions (scale) | CSS :active transitions |

**Accessibility:** a single `@media (prefers-reduced-motion: reduce)` block disables all of the above (particles not started, reveals shown instantly).

## Engine changes (minimal)

- Assemble `COURSE` from `COURSE_PHASES` global (sort by `order`).
- Three new view renderers: `renderReference()`, `renderResources()`, `renderStudyGuide()`.
- New sidebar tabs wired into the existing tab system (desktop sidebar `nav.tabs` only; the 5-button mobile bottom nav stays unchanged — on mobile the new views are reached via the hamburger drawer).
- Glossary search box (simple substring filter).
- Everything else — quiz engine, SRS, games, XP, badges, timer — unchanged.

## Error handling

- Engine tolerates a missing/failed content file: builds with whatever phases loaded, logs a console warning (relevant if a script tag 404s on Pages).
- Glossary search with no matches shows "no results" state, not blank.

## Testing / verification

1. Open `index.html` from disk (file://): no console errors, existing progress (XP/streak/quiz state) intact.
2. One phase end-to-end: lessons render, quiz works, XP gained, SRS items added.
3. New tabs: Reference search filters, Resources links open in new tab, Study Guide prints clean (print preview).
4. `prefers-reduced-motion` emulation: no motion, content all visible.
5. Push to GitHub Pages, verify the live site identically.

## Build stages (site stays usable after each)

1. **Refactor** — split files, zero behavior change, verify progress survives.
2. **Animations** — CSS + small JS additions.
3. **New tabs** — Reference, Resources, Study Guide (engine renderers + data files).
4. **Content expansion** — phase by phase, early phases first.

## Out of scope

- No framework rebuild, no build step, no bundler.
- No backend, no accounts — localStorage stays the only persistence.
- No changes to game mechanics or quiz logic.
