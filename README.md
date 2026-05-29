# AI Zero → Hero

The most fun way to learn AI — from "what's a neuron?" to building and shipping real LLMs. Animated, interactive, free. Made for the curious and the obsessed.

## Files

| File | What it is |
|------|------------|
| `index.html` | **Main site.** Landing + 14-phase roadmap + 8 interactive demos + Deep Concepts encyclopedia + flashcards + activity heatmap. Markup only. |
| `styles.css` | All styling (extracted from `index.html` for HTTP caching). |
| `app.js` | All behavior (extracted so a strict Content-Security-Policy can use `script-src 'self'`). |
| `sw.js` | Service worker — cache-first offline support. |
| `manifest.webmanifest` | PWA manifest (installable to home screen). |
| `ai_master_course.html` | Original gamified interactive course (XP, levels, quizzes, 14 mini-games). Linked from the new site's nav, hero, and footer. |
| `AI_ZERO_TO_HERO.md` | 14-phase roadmap as plain markdown (~30 weeks, 10–20 hrs/wk). |
| `AI_REFERENCE.md` | Glossary + 100 interview questions + decision trees + cheat sheets. |

## Quick start

The site is hosted on GitHub Pages (HTTPS). That's the intended way to run it.

**Local preview:** because of the strict Content-Security-Policy, open it through a local web server — not by double-clicking the file (`file://` blocks the external `app.js` under CSP):

```bash
cd AI_training
python -m http.server 8000
# then open http://localhost:8000/
```

## Security

- Strict CSP: `script-src 'self'` (no inline JS, no eval), scoped `connect-src` (only `api.anthropic.com` for the opt-in tutor), `object-src 'none'`, `frame-src 'none'`.
- All user input (tokenizer, search, portfolio, quiz answers) is HTML-escaped before rendering.
- The optional AI tutor is **off by default**, requires explicit opt-in, and keeps your API key in `sessionStorage` only (cleared on tab close, never persisted).
- 100% client-side. No tracking, no analytics, no backend.

## Live (GitHub Pages)

After enabling Pages (Settings → Pages → main branch → /(root)):

`https://swainatul94-code.github.io/AI_training/`

## The roadmap at a glance

Phase 0 Setup · Phase 1 Math · Phase 2 Python ML · Phase 3 Classical ML · Phase 4 Deep Learning + PyTorch · Phase 5 NLP · Phase 6 Transformers from scratch · Phase 7 Pretrain a small LLM · Phase 8 Fine-tune + DPO · Phase 9 Claude API apps · Phase 10 RAG · Phase 11 Agents · Phase 12 MLOps · Phase 13 Research + portfolio

## Learn without leaving

- **Deep Concepts** — a built-in encyclopedia: attention, backprop, tokenization, generation, the alignment family (RLHF/DPO/GRPO/RLVR), reasoning & test-time compute, RAG, agents + MCP, prompting, MoE, quantization/LoRA/distillation, evals, and LLM security — each explained in full, no off-site reading required.
- **8 interactive playgrounds** — Neural Net, Tokenizer, Attention heatmap, Gradient Descent, LayerNorm, Embedding lookup, Temperature/top-p sampling, Beam search.
- **Per-phase mini-games** inside each lesson, plus story / code / quiz / pitfalls / mastery rubric.
- **Flashcards** with SM-2 spaced repetition, **activity heatmap**, streaks, certificate + share-card generator.
- **90+ glossary terms** including 2025–26 topics (MCP, reasoning models, GRPO, MoE, SSM/Mamba, agentic RAG).

## Tech

- Three static files (`index.html` + `styles.css` + `app.js`), zero build step
- Pure CSS + vanilla JS (no frameworks, no CDN libs beyond Google Fonts)
- Strict CSP, HTML-escaped user input, opt-in tutor (see Security above)
- Service worker offline support + installable PWA
- Canvas animations, IntersectionObserver scroll reveals, light/dark theme
- Respects `prefers-reduced-motion`, mobile responsive, print stylesheet

## Credits

Built with [Claude Code](https://claude.com/claude-code). Curated by `@swainatul94`.
