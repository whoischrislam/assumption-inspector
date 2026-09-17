# Dev log

Dated entries, newest first. This is the lab notebook for Assumption Inspector
and for the wider question behind it: **what should an AI show a person before it
acts on a subjective visual decision, and on which surface?**

Each experiment uses the template at the bottom. Killed experiments stay in the
log. One experiment at a time; the next starts only after the previous has its
write-up.

---

## 2026-09-16 — Next-session plan: build the harness (two-layer synthesis)

**Not an experiment; the first task when work resumes in this repo.** Goal: build
assumption-inspector's harness by synthesizing what has converged across prior
repos with the transferable method from the agent-harness blueprint. The key
insight: **two harnesses, two sources.** Do not conflate them.

### Outer — the dev/governance harness (from convergent repo patterns)

Source: playsesh-desktop / y30-voice / playsesh-web / edr, packaged as the
`init-harness` skill. Run `/init-harness` as the base, then trim to minimal:

- session-start / session-end rituals
- `verify.sh` + `.githooks` pre-commit gate
- spec gate before non-trivial features
- learnings / self-learning loop
- DECISIONS.md (have), DEVLOG.md (have), a status/handoff doc
- AGENTS.md as the canonical contract (have; refine)

### Inner — the product/runtime harness (from the blueprint, adapted to Reveal → Decide → Apply)

The wins: the blueprint's patterns map onto things this repo **already has**.

- **Seams by change:** interpret / Reveal / Decide / Apply as separate
  components; the engine (liftable core) separate from the UI. `src/brain/` is
  already this.
- **Effects are evidence:** the `ApprovedBrief` IS the effect log. Each applied
  edit is a declared effect, which is what enables the faithfulness guard
  (`applied == accepted`) and the eval.
- **Mock provider = the existing fixtures.** The authored fixture assumptions are
  the scripted "interpreter" that lets the whole loop run offline,
  deterministically, in CI, with no API key. The blueprint's single most
  important testability move, already half-built here.
- **Eval against state, not prose:** score against the `git diff`, seeded from
  dogfood rejections (catch-rate / noise / faithfulness). Build before the visual UI.
- **Guardrails as pure functions:** faithfulness, explicit-accept-before-apply,
  scope-bounds, reveal-completeness. Each unit-testable in a few lines.
- **Observability (JSONL):** trace instruction → assumptions → decisions → patch
  → cost.
- **Config as data:** model + guardrails + declared effects in one validatable file.

### Method reference

`~/Documents/GitHub/HARNESS-LITERACY.md` (portable field guide) Part 5.5 + the
Part 7 laws, and `~/Downloads/agent-harness-blueprint`. This is the first real
application of them.

### Sequence next session

1. `/init-harness` (outer harness).
2. Stand up the mock-interpreter + eval skeleton from the existing fixtures
   (inner harness; cheapest high-value piece, and it makes everything testable).
3. Then M1: the patch applier (PRD section 8).

---

## 2026-09-05 — Shape session (after the hackathon build)

**Context.** Hawaiʻi Tech Week Grok Bot session was this morning. The demo
studio shipped (hero, X-Ray, preview, accept/reject, lock, brief panel, CLI stub,
optional live proposer). Build and lint pass, GitHub Pages deploy is live. This
entry records the product-shape thinking done the same afternoon so it is not
lost in chat.

### What was settled

- **The product is one contract with two sides, not the studio.** Three
  problems: *interpretation* (vague direction → named inferences), *authorship*
  (accept / reject / lock / preserve + the gate that stops the agent), *evidence*
  (previews on the real page). Authorship is the core and is surface-agnostic.
  The assumptions file between them is the whole product. Interpreters are
  servers, viewers are clients, in the Language Server Protocol sense.
- **Lightweight kernel for v1:** one file the agent writes, one rule the agent
  obeys, decisions made by editing a status column, git for reversibility.
  Nothing runs, nothing installs.
- **No live previews in v1.** Bad taste is usually legible in text. Previews are
  a v2 evidence upgrade, added only if the file-only loop shows text alone
  loses decisions.
- **The CLI is the tool call.** Claude Code, Codex, and Cursor have a shell. No
  MCP until an agent without a shell needs it. No npm package until a second
  repo consumes the brain.
- **The studio must read and write the same file.** Today `App.tsx` holds its
  own `useState<Session>` seeded from a fixture. That is a second store and the
  cause of the web/CLI divergence the PRD flags.
- **The design unit is the ask**, not the screen: what the agent saw, what it
  inferred and how confident it is, the decision with named options, what
  happens if you say nothing, how to undo. Every surface renders the same ask.
- **Consent model** (default, pending Chris): high-confidence, low-blast-radius
  inferences proceed unless vetoed; low-confidence or cultural / content / brand
  inferences block. Alarm fatigue kills review tools the same way it kills
  monitoring.
- **Rule for surfaces:** a new surface may add no new state.
- **One-liner, frozen:** *Before an agent changes a design, it shows what it
  inferred, asks about what it is unsure of, and previews what it would do, on
  whatever surface you already use.*
- Full spec: [`SCHEMA.md`](./SCHEMA.md). Product shape: [`PRD.md`](./PRD.md).

### Riskiest assumption

Not technical. Whether Chris pays the review tax on a routine edit when "just
undo the agent" costs thirty seconds. Test: run the file-only loop on three real
tasks on the portfolio site, log assumptions proposed / rejected / reworks
avoided. Three zeros in the rejected column is a real answer.

### Open decisions (defaults applied in docs; Chris to confirm or overrule)

1. **Restructure timing.** Default: docs now, code after the interview, so the
   fixture demo cannot break mid-week.
2. **Assumptions and briefs in git.** Default: yes, under a dated `sessions/`
   folder, so intent survives into the PR. Requires un-ignoring
   `APPROVED_BRIEF.*` and `session.json`.
3. **Consent default.** Default: proceed-unless-vetoed for high-confidence,
   low-blast-radius items.

### Audit findings (ranked, unfixed as of this entry)

1. README, PRODUCT.md, and the demo script claimed a "real Grok Bot
   interpretation." The provenance doc says authored fixture. **Fixed in docs
   this entry.**
2. The rejection beat is staged, and the live system prompt forces the tropical
   cliché. There is no evidence yet that an agent makes this mistake unforced.
   Experiment: run the live proposer with the forced rule removed; save raw
   output to `art-director-output.md`.
3. `preview()` in `src/brain/verbs.ts` demotes an accepted card to previewing
   (no status guard). One misclick drops a card from the brief.
4. Proposal mode still applies previews of pending cards while the
   "Human-approved interpretation" label is up.
5. The warm paper background applies only in proposal mode, not in the
   editorial preview. An unreviewed change smuggled in, against the thesis.
   Fix: move the paper rules onto `.hero--editorial`, then eyeball the
   tropical-plus-editorial combination.
6. `APPROVED_BRIEF.md` / `.json` are gitignored, so "intent survives into the
   PR" is currently false. See open decision 2.
7. The end-to-end loop (brief → Claude implements) has never been run.
8. Smaller: `locked` assumption status is dead schema; `normalizeLive` rejects
   any model output that is not exactly the four demo ids; xAI `grok-4.6`
   verified against docs.x.ai on 2026-09-05, though chat completions is
   labelled a legacy endpoint there.

### Interview week (Imbue, Wed or Thu, 2026-09-09 / 10)

This replaces the former `IMBUE_INTERVIEW_PLAN.md`. It overrides priority until
the interview is done. Demo = fixture studio. Reliability over magic.

**Success in ≤ 3 minutes:** thesis in one breath (*prompt ≠ interpretation ≠
implementation*); the live loop direction → assumptions → reject bad taste →
lock → brief; "this brief is what Claude / Codex are allowed to implement";
oversight as product architecture; a next step that does not sound unfinished.

**Priority, cut from the bottom, never cut P0:**

| Rank | Work |
|---|---|
| P0 | Fix audit items 3, 4, 5 in brain + CSS. Add a ten-line test for the invariant: rejected is never active and never in the brief; preview never demotes accepted. |
| P0 | Rehearse to a timer 5×. Screen recording. Pages URL confirmed. |
| P1 | Run the unforced live proposer once (item 2). Run the brief → Claude dry run once on the demo hero or the portfolio (item 7). Keep both outputs. |
| P1 | Docs honesty pass (done this entry). |
| P2 | Portfolio Work card linking the live demo. |
| Defer | Everything in the PRD parking lot. |

**Day by day.** Sun: P0 fixes + test, then the two P1 runs. Mon: script on a
card, rehearse 5×, record. Tue: dress rehearsal on the actual machine, three
likely questions, sleep. Wed/Thu: launch `npm run dev` 30 min before, click
through once, recording on the Desktop as backup.

**Talk track.** Opening (15s): I keep giving coding agents vague visual
direction. They guess taste and scope inside the diff. I want the guess
reviewable before code. Demo (60–90s): same direction you'd type to Claude; four
assumptions; preview and accept the ones that match; the tropical reading of
"local" gets rejected and must leave no trace; lock facts; this is the approved
brief, what an agent is allowed to implement. Close (20s): the point is not
better taste models. It is authorship of interpretation before implementation.
Next: the file-only loop on my own site, then previews on a real DOM.

**Likely questions.**

| Question | Answer spine |
|---|---|
| Why not just better prompts? | Prompts don't make the agent's inferences inspectable; the diff is too late. |
| Why not chat? | Chat collapses observation, assumption, and decision. Review needs parallel, persistent, addressable state, and reject must equal zero effect. |
| How is this different from plans in Cursor? | Plans are functional. This is subjective visual assumptions tied to targets, with a consent model for which ones deserve an ask. |
| Was the tropical assumption real model output? | No. Authored fixture, and the live prompt forces it. Then: what the unforced run actually produced (do item 2 so this answer exists). |
| Does it work with real agents? | The brief is the contract; the skill says implement only accepted. Then: what the dry run showed (do item 7). |
| What's the hard part? | Which inferences deserve an ask versus silent inference. Keeping reject honest. Not becoming a second Figma. |
| What would you measure? | Rework cycles, bad assumptions caught before a PR, time from vague direction to acceptable UI. |

**Definition of done for the week:** golden path works cold; reject tropical
leaves a clean render; the invariant test passes; script rehearsed ≥ 5×;
recording plus live URL; the two P1 runs have saved outputs.

### The lab, and its rules

This repo is also experiment one in a small lab on interfaces for designing
with AI beyond chat. Five rules:

1. Every experiment starts with a question that could be answered no.
2. Every experiment uses the template below.
3. One experiment at a time. The next starts only after the previous has its
   write-up.
4. Every experiment runs on Chris's own real work (portfolio site, y30 web).
5. Killed experiments get published.

Time cap: one fixed weekly slot. y30 is the mission; if a month passes with no
entry, that is a finding.

**Queued:** Experiment 2, *same ask, four surfaces*: one real task, one
assumptions file, rendered as a terminal list, a numbered chat message, the
browser overlay, and a PR comment. Same decisions in each. Log time to decide,
rejections caught, mistakes. One paragraph per surface on what the rendering
made easy and what it hid. Wireframe each on paper first.

---

## Experiment template

```
## YYYY-MM-DD — Experiment N: <name>
Question (answerable "no"):
Riskiest assumption:
Smallest thing built:
What was measured:
Result:
Lesson:
Status: kept | killed | parked
```
