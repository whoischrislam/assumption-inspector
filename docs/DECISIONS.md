# Decisions

One line per decision. Dated, with the reason. Don't re-debate unless evidence changes.

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
