# Assumption Inspector

**Before an AI changes a visual design, Assumption Inspector shows what it thinks
you mean, previews each interpretation directly on the page, and lets you accept,
revise, reject, or lock it before code changes.**

The main interaction is **X-Ray View**.

> ⚠️ **Speculative concept demo. Not affiliated with Hawaiʻi Tech Week.**
> The event page used in this demo is fictionalized. No real event details,
> branding, or endorsement are represented.

---

## The problem

The current workflow for directing a coding agent on visual work looks like this:

```
build live UI → screenshot it → paste into agent terminal →
"make this feel more like X" → agent guesses →
repair its wrong interpretation afterward
```

A screenshot lets an agent see pixels. It does not let a person inspect the
agent's assumptions about taste, scope, cultural meaning, content, or what is
safe to change.

This tool inserts a deliberate stage in between:

```
live UI → visual direction → assumptions → preview each assumption →
human decisions → approved implementation brief
```

## The layers

| Layer | What it answers |
|---|---|
| **Observation** | What can the agent truly see? |
| **Assumption** | What does it infer from a vague direction? |
| **Preview** | What would that assumption actually do visually? |
| **Decision** | What does the human allow, reject, or protect? |
| **Approved brief** | What may a code agent eventually implement? |

## Status

Prototype, built in a few hours for the Hawaiʻi Tech Week Grok Bot session
(2026-09-05) and continuing after.

- Assumptions are a **fixture** — a real Grok Bot "Art Director" interpretation,
  hand-transcribed into `src/data/assumptions.ts`. See `docs/art-director-output.md`
  for the raw output.
- No backend, no API calls, no database, no auth.
- The preview transforms are local CSS. Nothing writes code.

**This is not:** production-ready software, a model evaluation, a claim about
any model's general behavior, or a competitor to any editor.

## Run it

```bash
npm install
npm run dev
```

Build and preview the production bundle:

```bash
npm run build && npm run preview
```

## Repo map

```
AGENTS.md              canonical instructions for coding agents (read this first)
CLAUDE.md              pointer to AGENTS.md
docs/
  PRODUCT.md           the concept, the thesis, open questions
  DEMO_SCRIPT.md       lightning-round script + the golden path, step by step
  DEMO_CONTENT.md      the exact fictional event copy (the only content surface)
  GROK_PROMPTS.md      Art Director bot profile + the prompts to run
  art-director-output.md   raw Grok Bot output, pasted verbatim
  DECISIONS.md         dated decision log
src/
  components/          EventHero, AssumptionCard, XRayOverlay, StagingTray, CompareControl
  data/assumptions.ts  the fixture
  styles/app.css       tokens + styles
```

## License

MIT — see [LICENSE](./LICENSE).
