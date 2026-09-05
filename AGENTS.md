# AGENTS.md — Assumption Inspector

Canonical instructions for every coding agent working in this repo (Claude Code,
Cursor, Codex, Superset workers). `CLAUDE.md` and `.cursor/rules/` both point here.
If you are an agent: read this file fully before writing code.

---

## What this is

**Assumption Inspector** shows what an AI thinks you mean about a visual design,
previews each interpretation on the live page, and lets a human accept, reject,
or lock it *before* any code changes.

The main interaction is called **X-Ray View**.

The thesis:

> prompt ≠ agent interpretation ≠ implementation

A screenshot lets an agent see pixels. It does not let a person inspect the
agent's assumptions about taste, scope, cultural meaning, content, or what is
safe to change. This repo inserts a reviewable stage between the two.

**Status:** prototype. Built for the Hawaiʻi Tech Week Grok Bot session
(2026-09-05), continuing after.

---

## Hard constraints — never violate these

1. **No affiliation claims.** The demo page is a *fictionalized* event landing
   page. The string `Speculative concept demo · Not affiliated with Hawaiʻi Tech Week`
   must be visible in the app at all times. Never present this as a real redesign
   of, or work for, Hawaiʻi Tech Week.
2. **No invented event details.** Do not add speakers, venues, prices, ticket
   links, sponsor logos, or schedule items. The base copy in
   `docs/DEMO_CONTENT.md` is the whole content surface.
3. **No tropical cliché in the final render.** The palm/ocean overlay exists
   *only* as the deliberately-wrong assumption #4 preview. It must never appear
   in the approved/proposed render.
4. **Rejected assumptions have zero visual effect.** If a card is rejected, its
   CSS class must not be applied in proposal mode. This is the whole point of the
   product; a bug here invalidates the demo.
5. **No overclaiming in copy or README.** Not production-ready, not a model
   evaluation, not a Cursor competitor. It is a small interface prototype driven
   by one real Grok Bot interpretation.

---

## Scope fence — the golden path is the entire product

Build **only** this story, in this order:

1. Polished, intentionally generic "before" hero.
2. Direction input + `[ Show me what you think I mean ]`.
3. X-Ray View toggle → four assumption cards anchored to targets.
4. **Preview** one assumption at a time (live CSS, reversible).
5. Accept / Reject / Lock.
6. `[ Build approved direction ]` → Proposed Render applying *only* accepted assumptions.
7. Staging tray summarizing decisions + `[ Hold to compare ]`.

### Explicit non-goals (do not build, do not suggest building)

- No backend, no API calls from the app, no database, no auth.
- No image upload, no browser extension, no Git integration.
- No real code generation or file writing.
- No general-purpose editor, no multi-page app, no routing.
- No animation library, no component library, no Tailwind.
- No test suite for the hackathon build (add later if the repo continues).

If a change is not on the golden path, it is out of scope. Say so and stop.

---

## Architecture

```
src/
  App.tsx               state owner: xRayOpen, assumptions, isProposalMode, isComparing
  components/
    EventHero.tsx       the demo page; receives boolean flags, applies CSS classes
    AssumptionCard.tsx  one card: statement, confidence, target, action buttons
    XRayOverlay.tsx     card layer + anchors + "Previewing N interpretations" banner
    StagingTray.tsx     bottom tray: accepted/rejected/locked summary + export
    CompareControl.tsx  hold-to-compare before/after
  data/
    assumptions.ts      FIXTURE — the real Grok Bot output, hand-transcribed
  styles/
    app.css             tokens + component styles
```

**State lives in `App.tsx`.** Plain `useState`. No context, no reducer, no store
unless the state genuinely outgrows it.

### The fixture seam (important for post-hackathon work)

Assumptions are a **fixture** today and a **model call** later. Keep that seam clean:

- `src/data/assumptions.ts` exports `initialAssumptions: Assumption[]` and nothing else.
- Components must never know where assumptions came from.
- When a live model is wired in, it swaps behind an async source function that
  returns the same `Assumption[]`. Nothing else should have to change.

Do **not** add an API layer, env vars, or an adapter abstraction before it is
needed. Just keep the boundary honest.

---

## Data model

```ts
export type AssumptionStatus =
  | 'pending'
  | 'previewing'
  | 'accepted'
  | 'rejected'
  | 'locked'

export type Assumption = {
  id: string
  title: string
  target: 'hero' | 'title' | 'meta' | 'cta' | 'background'
  type: 'typography' | 'layout' | 'cta' | 'visual-identity'
  confidence: 'high' | 'medium' | 'low'
  statement: string
  previewLabel: string
  preserve: string
  status: AssumptionStatus
}
```

The four fixture assumptions (IDs are load-bearing — CSS flags key off them):

| id | type | confidence | preview effect |
|---|---|---|---|
| `typography` | typography | high | more breathing room, quieter editorial hierarchy |
| `event-context` | layout | high | date + Honolulu move up and gain metadata treatment |
| `cta` | cta | medium | flatter, smaller, calmer button; action preserved |
| `visual-identity` | visual-identity | low | corny ocean/palm overlay — **deliberately wrong** |

`visual-identity` is the rejection moment. It must be previewable, obviously
bad, and cleanly removable.

---

## Preview mechanics

A preview is a **local, reversible CSS class** on the hero — nothing else.
Preview state is temporary; accepted state is committed. Both must be able to
apply the same class.

While any preview is active, show:

```
Previewing N proposed interpretation(s)
No code has changed
```

That banner is not decoration. It is the claim the product makes.

---

## Visual design direction

An **editorial critique board**, not dashboard UI.

| token | value | use |
|---|---|---|
| `--paper` | `#F6F2EA` | inspector background |
| `--graphite` | `#25231F` | text |
| `--cobalt` | `#335CFF` | active / previewing |
| `--marker-red` | `#ED4B3D` | rejection strike-through, lock tape |
| `--question-yellow` | `#F6D762` | dotted border on low-confidence cards |
| `--verdict-green` | `#2F9E68` | accepted stamp |

Rules:
- Cards feel **pinned or translucent**, never modal-dialog-heavy.
- The hero stays highly polished — it is the first thing people notice.
- System sans + built-in serif only. **No web fonts** (loading risk on venue wifi).
- Readable at a distance: this is demoed on a projector.

### Fixed on-screen labels

```
X-RAY VIEW           / What the agent thinks you mean
PREVIEWING           / No code has changed
PROPOSED DIRECTION   / Human-approved interpretation
LOCKED               / Do not change factual information or event discovery
```

---

## Definition of done

- [ ] Polished generic "before" hero renders.
- [ ] X-Ray View activates.
- [ ] All four assumptions preview individually and reverse cleanly.
- [ ] At least three can be accepted.
- [ ] The tropical assumption can be rejected and leaves no trace.
- [ ] Factual/event-discovery content can be locked, with a visible badge.
- [ ] Proposed Render applies **only** accepted assumptions.
- [ ] Real Grok Bot output is saved in `docs/art-director-output.md` and
      referenced somewhere in the UI (a small "source" drawer is enough).
- [ ] The full flow demos in under two minutes.
- [ ] `npm run build` passes.

---

## Working style

- Ship the golden path before anything else. Stop adding features when it works.
- Smallest reversible step. Patch over rewrite.
- Do not refactor working demo code the night before a demo.
- Log real decisions in `docs/DECISIONS.md` — one line, dated, with the reason.
