# PRD — Assumption Inspector

Single living product reference. Improve this doc in place; do not fork competing
visions in chat or in a second PRD. Related: [SCHEMA.md](./SCHEMA.md) (file
contract), [DECISIONS.md](./DECISIONS.md) (dated choices), [DEVLOG.md](./DEVLOG.md).

**v1 (A): a self-contained design-to-code assumption editor.** It interprets a
natural-language change, shows what it inferred, lets you accept/reject each
inference, and applies only the accepted set as a real patch. Local-first,
bring-your-own-key.

**Vision (B): a modular comprehension layer for agent oversight** (section 10),
sequenced *after* A earns its way, built on the same primitive. B is not a
parallel v1 track.

**Primary user (v1, LOCKED):** the author. A design-literate builder directing a
coding/product agent, dogfoodable today. North star (not v1): non-technical
builders who cannot read a diff to catch a misread.

> Collapsed 2026-09-16 from two divergent PRDs. The prior oversight-layer PRD,
> with its verified competitive research and provenance labels, is preserved at
> `docs/archive/PRD_oversight-layer_2026-09-12.md` and feeds section 10.

---

## 1. One-liner

Frozen 2026-09-05:

> Before an agent changes a design, it shows what it inferred, asks about what it
> is unsure of, and previews what it would do, on whatever surface you already use.

Working sentence (2026-09-16):

> A batch visual editor that surfaces the assumptions an LLM makes when it
> interprets natural language ("make the homepage friendlier") into concrete
> project changes, for designers, product managers, and builders.

The thesis, unchanged:

> prompt ≠ agent interpretation ≠ implementation

---

## 2. Problem

Coding and design agents turn a vague instruction into concrete edits by
**guessing** taste, scope, and what is safe to change. Today that guess is buried
inside a code diff and discovered as rework, too late. The interesting question
is not "can the agent write better CSS." It is: **what should an agent show a
person before it acts, when the thing being decided is subjective?**

---

## 3. The spine: Reveal → Decide → Apply

One loop, three stages, each a distinct seam. `NL in → interpret → Reveal →
Decide → Apply → new state → repeat.`

### 3.1 Reveal (interpretation transparency)

Show how the LLM interpreted the instruction and what it assumed, decomposed into
its constituent inferences (copy, layout, color, hierarchy, spacing, motion, ...).

**Integrity line (non-negotiable, and the whole credibility of the product).**
Split Reveal into two clearly-labeled tiers:

- **Real / inspectable** (show freely, it is ground truth): the proposed edits
  themselves, the dimensions touched, the params (e.g. temperature).
- **Reconstructed / narrated** (label as the model's account, never as fact): the
  "why." An LLM cannot faithfully report why it chose rounded corners. Showing an
  invented provenance would make the assumption-surfacer itself an unverified
  claim. Never present the narrated "why" as ground truth.

### 3.2 Decide (human authorship of the change)

See current vs. proposed, toggle, accept / reject / lock / revise, in batch.

**UX reference = Claude Artifacts' container:** a canvas separate from the
instruction; a live *rendered* preview (not a raw diff); linear versions;
iterate-in-place. **Mechanism = where we diverge from Artifacts, and it is the
moat:** Artifacts accept a whole opaque version; Decide is **per-assumption toggle
over the Reveal decomposition** (accept the corners, reject the copy). That
granularity is only possible because Reveal decomposed the interpretation.
Artifacts have no Reveal.

| Act | Meaning |
|---|---|
| Accept / Reject | Authored allow/deny on one inference |
| Lock | Protect facts, behavior, copy from any change |
| Revise | Redirect the interpretation ("calmer = whitespace, keep every step") |
| Batch | Multi-select accept/reject |
| Focus / zoom | Inspect one target or one assumption |

Rejection is first-class provenance ("we explicitly did not want X").

**Triage / consent model (this is the noise control, and it is a safety
property).** Alarm intensity = interpretation confidence × consequence (blast
radius, data/copy/imagery exposure). High-confidence, low-blast-radius inferences
proceed unless vetoed; low-confidence, high-blast-radius, or imagery/copy/color
inferences block until decided. An agent that asks about everything is abandoned.
This is alarm fatigue applied to review, and it is directly measured by the eval
(section 5).

**v1 is linear** (one interpreted batch, one timeline). Branching into parallel
iteration trees is **v2** (section 9).

### 3.3 Apply (feedback into the build)

The accepted subset becomes a **deterministic surgical patch** of exactly the
accepted edits. **Not a model re-run.** Rejecting the copy change means the copy
is untouched, provably, not "the model tries again and hopefully leaves it
alone." This determinism *is* the faithfulness guardrail (section 6):
applied == accepted.

- The **ApprovedBrief** (`APPROVED_BRIEF.md` / `.json`) is the record of the
  accepted/rejected/locked set. Git is the deliverable surface.
- Apply target is surface-specific and forces the v1 surface choice (section 7).
- Alternate path (secondary): hand the ApprovedBrief to a separate coding agent
  (Claude Code / Codex / Cursor) that implements *only* the accepted set. Kept for
  agent-native workflows; the primary v1 path is the deterministic patch.

---

## 4. Reference (inputs)

Every session starts from a **Reference**: a **prompt** (what the human means:
direction, locks, preserve rules) plus a **visual** (what can be seen or touched:
screenshot, live route/URL, component/code path). Neither alone is enough. Schema
lives in `docs/SCHEMA.md`.

---

## 5. Eval (acceptance criteria, not optional)

Score against the **diff**, never the prose (a persuasive rationale that reads
well is not the product; a caught bad edit is). The one outcome question: *did
Reveal + Decide let the user catch a bad interpretation before Apply committed
it?* Four measurable sub-metrics:

| Metric | Fails when |
|---|---|
| **Surfacing recall** | A silent edit reaches Apply without appearing in Reveal |
| **Catch rate** | A seeded wrong interpretation is *not* rejected before Apply |
| **Noise rate** | It flags edits that were fine (alarm fatigue; the death mode) |
| **Faithfulness** | A narrated "why" ties to no real edit, or a real edit is unsurfaced |

**Dataset source: dogfood.** Every edit the author rejects is a labeled
"bad-assumption" case. Using the tool builds its own eval set.

**Build the eval before the visual UI.** It defines what "correct interpretation
surfacing" even means.

---

## 6. Guardrails (integrity)

Two non-negotiable (the product's spine, not features):

1. **Faithfulness guard** = `unverified_claims` turned on the tool itself. Reveal
   may show no rationale untied to a real edit; Apply may change nothing not shown
   in Reveal and accepted. **applied == accepted**, enforced, not hoped.
2. **Explicit-accept-before-apply** = `require_confirmation`. Nothing applies
   without an explicit accept on *that* item. No silent apply.

Two supporting:

3. **Reveal-completeness.** Every proposed edit appears in Reveal before it is
   eligible for Decide. No hidden edits.
4. **Scope-bounds.** "Make the homepage friendlier" must not edit checkout. Bound
   the blast radius of an interpretation.

**Hard invariant (carried from v0):** rejected assumptions have zero effect on
previews and never appear in `ApprovedBrief.accepted`.

---

## 7. Non-functional constraints

- **Local-first, bring-your-own-key, zero-backend.** Operates on a directory. One
  command to start. Nothing leaves the machine (the trust story, not just the
  install story). **No v1 feature may require a hosted backend** (this also
  disciplines scope: anything that forces a backend is v2).
- **v1 surface: a visual web UI editing a code project** (React / HTML). Visual
  because Decide's rendered current-vs-proposed is the core and a CLI/TUI cannot
  express it. Headless CLI / skill / CI modes (Reveal + Apply without visual
  Decide) are **additive transports later**, cheap because the engine stays
  transport-agnostic. Never a rewrite.
- **The engine is the liftable core.** NL → interpret → assumptions → patch. Thin
  UI on top. Small, dependency-light. This is what B (section 10) extracts.

---

## 8. Milestones (each one usable; speed first)

Every milestone is dogfoodable at its level. No big-bang.

- **M0 — Fixture review studio (DONE, 2026-09-05).** Reveal + Decide on an
  authored fixture (hero, X-Ray, accept/reject/batch/focus), writes
  `APPROVED_BRIEF.md`. Usable as a demo; not yet on real work.

- **M1 — First real end-to-end loop (the dogfood milestone).** On one real
  project (the author's portfolio): real NL → real LLM interpret (BYO-key) →
  Reveal (text is fine) → Decide (accept/reject/batch) → **Apply a real surgical
  patch to files** → visible in `git diff`. Usable = you can make a real change to
  your own site through it. This is what generates the eval dataset. *Near-term
  push: mostly wiring real interpret + real apply onto the existing brain/studio.*

- **M2 — Trust.** Eval harness (section 5) seeded from M1 rejections, plus the
  faithfulness guard (applied == accepted, reveal-completeness). Usable = you run
  it on real work without babysitting each patch.

- **M3 — Visual Decide.** Rendered current-vs-proposed (Artifacts-like), per
  assumption toggle on the render. Usable = the visual editor the one-liner
  promises; a non-coder can review without reading the diff.

- **M4 — Liftable engine + lightweight packaging.** Extract the clean engine,
  one-command local start, BYO-key. Usable = someone else installs and runs the
  loop on their repo (the OSS milestone).

- **M5+ — B, modular** (section 10): headless CLI/skill transport first, then the
  oversight-layer direction as separate modules over the same primitive.

**M1 locked (2026-09-16):** target project = the author's portfolio
(`whoischrislam.github.io`, a real UI/frontend surface under active design
edits). First anchor instruction = **"make the company bands feel more
premium"** on the `co-band` sections. Chosen as purely-visual (type, spacing,
contrast, motion) so a rough Apply cannot touch career facts while the loop is
hardening, and it carries a clean over-reach for the catch demo: "premium" read
as a *global* theme/palette/font change rather than local band polish. Second
test after Apply is trusted: **"tighten the hero so it feels more confident"**,
which exercises the facts/copy lock.

---

## 9. v2 / deferred (parked with a reason; do not build until pulled)

- **Branching into iteration trees** (section 3.2). A UX explosion; v1 is linear.
- Live rendered overlay on a real DOM beyond the studio, if text/render alone
  loses decisions.
- npm package / MCP server: no second consumer or shell-less agent yet.
- Issue / PR templates tied to the brief: after briefs are in git and used.
- Editing assumption text in-studio before accept.
- Hosted / managed key (removes user friction, adds backend + cost + trust
  burden): a v2 option, never v1.

---

## 10. Vision (B): the modular oversight layer

The self-contained editor (A) grows toward a **comprehension layer for
human-agent oversight**: it turns a runtime's opaque plans, tool calls,
permissions, and outcomes into decision records a human can read, steer,
authorize, and audit. B reuses A's primitive (the reviewable, per-assumption
decision object) and adds:

- The **checkpoint / save-point** generalization (forward / revise / back;
  approval is the highest-stakes checkpoint).
- A **client-of-the-runtime** architecture (a viewer over an agent's existing
  local control plane), where B **surfaces, does not enforce** (a real sandbox
  enforces). Note this differs from A's Apply, which *does* apply accepted design
  edits; keep the two roles distinct as B is built.
- Live adapters to agent runtimes, and a fuller consequence/confidence taxonomy.

**Positioning (verified; full provenance in the archived oversight PRD).** The
open seam, as of a 2026-09-10/12 competitive pass against primary sources: no
named, funded product surfaces an agent's *hidden assumptions and ambiguity
resolutions* as a first-class, editable, diff-able object distinct from the plan
and from a formal spec, at inline speed, for design-to-code work. Plan-mode,
clarifying-questions, action-approval, and post-hoc-trace spaces are crowded;
Kiro and Tessl ($125M) contest the coding-spec flank but punt on hidden
assumptions. **Differentiation line:** *the agent's named assumptions as a
reviewable artifact, distinct from the plan, lightweight and inline, strongest on
visual/design requests.* Full verified claim-by-claim provenance, sources, and
dropped fabrications: `docs/archive/PRD_oversight-layer_2026-09-12.md` §3, §3a.

---

## 11. Non-goals

- Replacing Figma / Pencil as a general design tool. Inspect ≠ edit-in-canvas.
- A model evaluation, or evidence about any model's general behavior.
- Production-ready or HIPAA-compliant. Not affiliated with Hawaiʻi Tech Week;
  demo content stays fictional with a disclaimer.
- Requiring any specific bot or a hosted backend to function.
- Overclaiming provenance: the demo's assumptions are an authored fixture, not a
  live model transcript. Never describe them otherwise.
- Building chat + TUI + web as three separate products. One primitive, sequenced
  renderers.

---

## 12. Open questions [confirm]

- Apply primary path: deterministic patch confirmed as v1 default; is the
  brief-to-coding-agent path still wanted as a secondary output for v1, or v2?
- Success bar for M1/M2 (from the play-don't-show gate: unmoderated first-use
  where a user catches the deliberately wrong assumption unprompted).
- Where B's "surfaces, does not enforce" boundary sits once A already applies.

---

## 13. Doc ownership

| Doc | Owns |
|---|---|
| **This PRD** | The single product shape, spine, milestones, non-goals, vision |
| `SCHEMA.md` | The file contract: fields, taxonomy, triage rule, worked example |
| `DECISIONS.md` | Dated choices, one line each, not re-debated |
| `DEVLOG.md` | Dated lab notebook, time-boxed plans, experiments |
| `docs/archive/PRD_oversight-layer_2026-09-12.md` | Full B detail + verified research |

When product intent changes, update this PRD first. One PRD. No competing fork.
