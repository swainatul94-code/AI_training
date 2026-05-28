# AI Zero → Hero

The most fun way to learn AI — from "what's a neuron?" to building and shipping real LLMs. Animated, interactive, free. Made for the curious and the obsessed.

## Files

| File | What it is |
|------|------------|
| `index.html` | **Main site.** Animated landing + 14-phase roadmap + 4 interactive demos (neural net playground, tokenizer visualizer, attention heatmap, gradient descent). Open in any browser. |
| `ai_master_course.html` | Original gamified interactive course (XP, levels, quizzes). Linked from the new site's nav, hero, and footer. |
| `AI_ZERO_TO_HERO.md` | 14-phase roadmap as plain markdown (~30 weeks, 10–20 hrs/wk). |
| `AI_REFERENCE.md` | Glossary (80 terms) + 100 interview questions + decision trees + cheat sheets. |

## Quick start

1. Open `index.html` in any modern browser. Everything is client-side.
2. Scroll the hero → roadmap → try the 4 live playgrounds.
3. When you're ready to actually start: open Phase 0, install the tools, push your first commit.

## Live (GitHub Pages)

After enabling Pages (Settings → Pages → main branch → /(root)):

`https://swainatul94-code.github.io/AI_training/`

## The roadmap at a glance

Phase 0 Setup · Phase 1 Math · Phase 2 Python ML · Phase 3 Classical ML · Phase 4 Deep Learning + PyTorch · Phase 5 NLP · Phase 6 Transformers from scratch · Phase 7 Pretrain a small LLM · Phase 8 Fine-tune + DPO · Phase 9 Claude API apps · Phase 10 RAG · Phase 11 Agents · Phase 12 MLOps · Phase 13 Research + portfolio

## Interactive demos

The new site includes 4 hands-on playgrounds — no install, no setup:

- **Neural Net Playground** — sliders for inputs, click "Forward Pass" to watch signal flow through layers
- **Tokenizer Visualizer** — type any text, see how an LLM slices it into tokens with IDs
- **Attention Heatmap** — hover the matrix to see how "it" attends back to "cat"
- **Gradient Descent** — watch a ball roll downhill on a loss surface, tune learning rate + momentum

## Tech

- Single self-contained HTML file, zero build step
- Pure CSS + vanilla JS (no frameworks, no CDN libs beyond Google Fonts)
- Canvas-based animations with IntersectionObserver scroll reveals
- Respects `prefers-reduced-motion`
- Mobile responsive

## Credits

Built with [Claude Code](https://claude.com/claude-code). Curated by `@swainatul94`.
