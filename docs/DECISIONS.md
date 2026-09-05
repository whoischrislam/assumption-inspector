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
