# Agent skill — approved brief gate

Use this with **Claude Code**, **Codex**, or **Cursor** when changing visual UI
from a human direction (portfolio, landing page, component polish, etc.).

## When to apply

Any task that would change layout, typography, color, imagery, or CTA treatment
based on a vague visual direction (“make it feel more…”, “tighten hierarchy…”).

## Required workflow

1. **Prefer an existing brief.** Look for `APPROVED_BRIEF.md` (or
   `APPROVED_BRIEF.json`) in the repo root.
2. **If missing:** ask the human to approve assumptions in Assumption Inspector
   (`npm run dev` → Build approved direction) or via CLI:
   `npm run brain -- brief --write`. Do **not** invent taste or scope.
3. **Implement only Accepted items.** Each accepted row is allowed work.
4. **Never implement Rejected ids.** Treat them as hard bans.
5. **Obey Locks and Preserve lines** exactly (facts, labels, discovery behavior).
6. **PR / commit note:** mention `Brief: <generated timestamp or date>`.

## Prompt stub (paste to Claude / Codex)

```text
Read APPROVED_BRIEF.md and docs/AGENT_SKILL.md.
Implement ONLY the Accepted items on the target UI.
Do not implement Rejected ids.
Obey all Locks and Preserve constraints.
If anything is ambiguous, ask — do not guess taste.
```

## Out of scope for this skill

- Redesigning without a brief
- “Improving” rejected visual ideas because they seem nicer
- Expanding scope beyond accepted targets
