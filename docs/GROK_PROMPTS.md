# Grok Bot prompts — copy/paste on site

## Credit rule

Use no more than:
- one short baseline run,
- one structured run,
- one correction/refinement run **only if required**.

Do not use the bot for browser automation, refactors, research, code generation,
site redesign, installs, long-running work, or sending messages. The credit is
single-use and limited — spend it on the learning experiment.

---

## 1. Bot profile — paste into the bot's instructions

```md
You are Art Director, a visual-planning collaborator.

Your task is to convert a visual reference plus creative direction into
explicit, reviewable assumptions before any implementation work begins.

Always:
- Separate observations from inferences.
- Tie each recommendation to a visible target or region.
- Assign confidence: high, medium, or low.
- Identify questions that need a human decision.
- State what should be preserved.
- Prefer local and reversible changes.
- Avoid generic AI aesthetics unless specifically requested:
  gradients, glassmorphism, generic stock imagery, and vague "modern"
  recommendations.
- Do not claim affiliation with any organization shown in a reference.
- Do not browse, publish, send, create accounts, change files, or use
  external tools unless explicitly instructed.

Return concise Markdown in the requested template only.
```

---

## 2. Baseline run (optional, ~30 seconds)

Attach the "before" screenshot.

```md
Review the attached screenshot.

Direction:
"Make this feel more community-led and locally grounded."

Give a short recommendation. Do not make changes.
```

Save the response. This is the control: it shows what the bot does *naturally* —
likely jumping straight to recommendations, possibly with vague or cliché ideas.

---

## 3. Structured run — the real artifact

Attach the "before" screenshot.

```md
Analyze the attached event-page hero.

Direction:
"Make this feel more community-led and locally grounded.
Preserve event discovery and factual information.
Avoid tropical clichés."

Return only:

## Observations
Three facts visibly supported by the reference.

## Assumptions
Exactly four items. For each:
- ID
- Target
- Type: typography, layout, CTA, visual identity, or content
- Assumption
- Confidence: high, medium, or low
- Suggested visual change
- Preserve/do-not-change constraint

## Questions
Up to three decisions that must not be guessed.

## Proposed scope
State the smallest component or visual region that should change.
```

If the bot can't inspect the screenshot, paste a textual description of the page
plus the direction. That is fine — the project is about how you **review its
interpretation**, not about its vision capability.

---

## 4. After the run

1. Paste the raw output verbatim into `docs/art-director-output.md`.
2. Transcribe the four assumptions into `src/data/assumptions.ts`.
3. Keep the IDs stable: `typography`, `event-context`, `cta`, `visual-identity`.
4. If the bot did *not* produce a tropical-cliché assumption on its own, say so
   honestly in the demo and in the docs — do not present an authored assumption
   as a model output.
