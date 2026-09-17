# Decisions

One line per decision. Dated, with the reason. Don't re-debate unless evidence changes.

## 2026-09-16 — one PRD; A first (editor that applies), B modular after

- **Product fork resolved: A is v1, B is the vision.** The repo had two divergent
  PRDs (a self-contained design-to-code control plane vs. an agent-oversight
  comprehension layer that only surfaces) plus a third framing in chat. Chose
  **A: a self-contained design-to-code editor that interprets NL, reveals the
  assumptions, lets you accept/reject each, and applies the accepted set as a
  deterministic surgical patch.** B (oversight layer, runtime adapters, checkpoint
  taxonomy) is sequenced after A, built on the same primitive. Reason: A is
  dogfoodable now, closes the loop to real value, and depends on nothing external;
  B needs unverified runtime wire protocols and is a viewer, not an editor.
- **Spine locked: Reveal → Decide → Apply**, with an integrity split on Reveal
  (real/inspectable vs. narrated), per-assumption toggle on Decide (the divergence
  from Artifacts), and a deterministic patch on Apply (applied == accepted).
- **Eval + guardrails are acceptance criteria, in the PRD**, not add-ons. Eval
  scores against the diff (catch rate, noise, faithfulness), seeded from dogfood
  rejections. Build the eval before the visual UI.
- **Non-functional: local-first, BYO-key, zero-backend, one command.** No v1
  feature may require a hosted backend.
- **Two PRDs collapsed to one** (`docs/PRD.md`). The oversight PRD, with its
  verified competitive research and provenance, is preserved at
  `docs/archive/PRD_oversight-layer_2026-09-12.md`. Left uncommitted for review.
- **M1 anchor locked.** Target = the author's portfolio (`whoischrislam.github.io`);
  first instruction = "make the company bands feel more premium" (`co-band`),
  chosen purely-visual so a rough Apply can't touch career facts, with a clean
  "premium = global theme change" over-reach for the catch demo. Second test =
  "tighten the hero so it feels more confident" (exercises the facts/copy lock).

## 2026-09-12 — scope confirmed: start-with-me, design-to-code hero

- **v1 user is the author; design-to-code is the hero domain, code oversight is a
  supporting exemplar.** Confirmed after a competitive verification pass (three
  parallel searches against primary sources, 2026-09-12). Reason: the
  differentiated, unoccupied wedge is surfacing the agent's *hidden assumptions*
  on ambiguous requests; design requests are the richest soil and the author's
  edge, and the scenario is dogfoodable now. Plan-mode, clarifying-questions,
  action-approval, and post-hoc-trace spaces are crowded; Kiro and Tessl ($125M)
  contest the coding-spec flank but punt on hidden assumptions.
- **Visual surface stays comprehension-only in v1 (B-first).** The
  spatial-manipulation canvas remains v2. Non-technical builders remain the north
  star, reached by sequenced renderers over one surface-agnostic primitive, not a
  parallel v1 track.
- **PRD updated:** new sections 3a (competitive) and 4a (scope); section 9 hero
  flipped to a design-to-code loop. Left uncommitted for Chris's post-weekend
  review.

## 2026-09-05 — repo setup

- **Name: Assumption Inspector; interaction: X-Ray View.** Clearest framing for an
  Imbue conversation; "X-Ray" is the memorable interaction name.
- **Vite + React + TypeScript, plain CSS, no backend.** Fastest path to a working
  demo. The four preview transforms are hand-written CSS classes; Tailwind setup
  would be pure friction under time pressure.
- **Fixture-first, model later.** Assumptions ship as a hand-transcribed fixture
  from a real Grok Bot run. A live model call swaps in behind the same
  `Assumption[]` shape. No API layer or adapter abstraction until it's needed.
- **MIT license, public from the first commit.** Prototype meant to be shared and
  discussed, not defended as IP.
- **GitHub Pages backup deploy.** Repo is public and `gh` is already authed, so
  zero new accounts. Vite `base` is `/assumption-inspector/` for builds, `/` for
  dev. Local dev stays the primary demo surface; the URL is insurance against a
  laptop or projector failure.
- **AGENTS.md is canonical; CLAUDE.md and .cursor/rules point at it.** Work will
  move between Claude Code, Cursor, and Codex (via Superset). One instruction set,
  three entry points.
- **Fictionalized event page, permanent non-affiliation label.** Avoids implying
  a real redesign or endorsement.
- **Build on site in Cursor; no pre-built hero.** Not enough time before
  check-in to build the hero properly, and a rushed one is worse than none. The
  consequence: the 9:40 Grok run uses a text description of the intended
  "before" state rather than a screenshot. Written out in `docs/ONSITE.md`.

## 2026-09-05 — live interpret (scope exception)

- **Proceed with live LLM behind the button (path B), fixture as fallback.**
  Product owner chose self-contained app with optional live interpret over
  Grok-Bot-only provenance. Cursor/Grok Bot credits are not an app API.
- **Vite `configureServer` middleware at `/api/interpret`, not a real backend.**
  Keeps the key off the client in local demo (`LLM_API_KEY` in `.env`); GitHub
  Pages stays fixture-only. OpenAI-compatible base URL so OpenAI or xAI works.
- **Authored four-assumption fixture including deliberate tropical reject beat.**
  Unblocks the golden path without another Grok round-trip; live model prompted
  to keep the same four IDs and the rejectable visual-identity assumption.

## 2026-09-05 — assumption brain (multi-surface foundation)

- **Extract `src/brain` as the client-agnostic decision layer.** Web, terminal, and
  future chat/MCP are adapters over one `Session` + verbs + `ApprovedBrief`.
- **Schema-first, any agent client later.** No Grok Bot MCP in v1; remote MCP can
  wrap the same verbs when a public URL exists.
- **Point-and-click on the hero** (target focus) + card zoom + batch accept/reject
  so review feels like designer selection, not only a card wall.
- **Terminal stub (`npm run brain`)** proves the brain is not web-only via
  `session.json`.

## 2026-09-05 — PRD locked as living product reference

- **Canonical product outline lives in `docs/PRD.md`.** Captures Reference
  (prompt + visual), authorship, brief-gated implementation, git deliverables,
  Figma-like *inspect* studio (not full edit), and modular brain/skill/CLI/studio
  packaging. Improve the PRD in place rather than re-litigating in chat.

## 2026-09-05 — agent handoff via APPROVED_BRIEF.md

- **Studio + CLI write `APPROVED_BRIEF.md` for Claude/Codex.** Feature-freeze the
  visual studio for interview week; portable agent surface is the brief file plus
  `docs/AGENT_SKILL.md`. Dev-only `/api/brief/write`; download fallback for Pages.

## 2026-09-09 — oversight model: transparency by default, muting is human-authored

- **Transparency ≠ interruption.** Every visual assumption the agent makes is
  always recorded (free, no stop). Review is a *dial*, not a gate: autopilot (log
  only) → checkpoint → co-pilot (author everything).
- **Default = surface *every* visual assumption, block on none.** The tool never
  decides which assumptions are "high-risk" — that judgment is exactly what we
  don't trust the agent to make. Present them as one batch to scan, not N
  sequential gates.
- **Tuning is muting from a maximal default, always with human confirmation.**
  The tool learns auto-accept rules from the human's own accept/reject history
  ("you've accepted typography-spacing 12×; auto-accept these?") and never invents
  a threshold. Filters are authored, not inferred.
- **Accepted cost:** first few sessions are review-heavy before mute rules accrue.
  Right price for not letting the tool guess taste.
- **Value anchor:** the unit of review is the *interpretation* (pre-code, tied to
  a live visual preview, reject = zero trace), not the diff. Optionality is the
  delivery; the superior review unit is the moat.
- **Surface implication:** the always-on record renders low-fi anywhere (terminal,
  PR comment); the rich browser studio is only needed for opt-in deep review.
  Agents integrate via one MCP server + the brief file — not per-agent plugins.

## 2026-09-05 — product shape (afternoon session after the hackathon)

- **The product is a file contract plus one agent rule; the studio is a viewer.**
  Three problems (interpretation, authorship, evidence); authorship is the core
  and is surface-agnostic. Reason: a tool with its own hero is a demo; a tool
  that reads and writes a file the agent already uses is a tool. See `docs/SCHEMA.md`.
- **No live previews in v1.** Bad taste is legible in text; previews are a v2
  evidence upgrade added only if the file-only loop shows text loses decisions.
- **CLI is the tool call. No MCP, no npm package until pulled.** Claude Code,
  Codex, and Cursor have a shell; MCP is for agents without one. A package for a
  status column is ceremony until a second repo consumes it.
- **A new surface may add no new state.** The studio's own `useState<Session>` is
  the root cause of web/CLI divergence; fix by making the file the truth.
- **Design unit is the ask, not the screen.** Five lines rendered identically on
  every surface. Consent model: proceed-unless-vetoed for high-confidence,
  low-blast-radius; ask for low-confidence or imagery/copy/color.
  *Default pending Chris.*
- **Assumptions and briefs tracked in git under `sessions/`.** *Default pending
  Chris.* Reason: otherwise "intent survives into the PR" is false.
- **Restructure code after the interview, docs now.** *Default pending Chris.*
  Reason: the fixture demo must not break mid-week.
- **`IMBUE_INTERVIEW_PLAN.md` replaced by `docs/DEVLOG.md`.** Time-boxed plans
  are log entries, not standalone docs. Event-day playbooks moved to
  `docs/archive/`.
- **Docs honesty fix: the fixture is authored, not a Grok Bot transcript.**
  README, PRODUCT.md, DEMO_SCRIPT, and AGENTS.md corrected. Reason: provenance
  doc already said so; the other docs had drifted.
- **This repo is experiment one of a small lab on designing with AI beyond chat.**
  Rules and template in `docs/DEVLOG.md`. One experiment at a time; killed ones
  get published.
