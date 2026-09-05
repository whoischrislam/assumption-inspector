# PRD — Assumption Inspector

Living product reference. Improve this doc as the system evolves; do not fork
competing visions in chat. Related: [PRODUCT.md](./PRODUCT.md) (thesis notes),
[BRAIN.md](./BRAIN.md) (schema/verbs), [DECISIONS.md](./DECISIONS.md).

**Status:** prototype / personal tooling → modular installable decision layer  
**Primary user (now):** Chris — faster, more correct visual work with Claude Code, Codex, Cursor  
**Secondary (later):** others installing brain + skill + optional studio  

---

## 1. One-liner

Assumption Inspector turns a **Reference** (prompt + visual) into **reviewable
assumptions**, lets a human **author decisions** (preview / accept / reject /
lock), and emits an **ApprovedBrief** that coding agents may implement — with
git (issues / PRs / commits) as the deliverable surface.

> prompt ≠ agent interpretation ≠ implementation

---

## 2. Problem

Coding agents can see pixels or files, but vague visual direction still forces
them to **guess** taste, scope, cultural meaning, and what is safe to change.
Today that guess is buried inside a code diff. Rework is discovering the guess
too late.

---

## 3. Solution shape

A **design-intent control plane** for coding agents:

```
Reference (prompt + visual)
  → Propose (assumptions / observability)
  → Authorship (preview, accept, reject, lock, batch, zoom)
  → ApprovedBrief
  → Implement (Claude / Codex / Cursor) — gated by brief
  → Deliverable (issue, PR, commits linked to brief)
```

The optional **studio** (web) is a Storybook- / Figma-like **review** surface,
not the product core and not a full design editor.

---

## 4. Reference (inputs)

Every session starts from a **Reference** with two required parts:

| Part | Examples | Role |
|---|---|---|
| **Prompt** | Direction, locks, preserve rules, taste notes | What the human *means* |
| **Visual** | Screenshot, live URL/route, Storybook story, selected component/code path | What can be *seen* or *touched* |

Neither alone is enough. Schema direction (evolve `Session.direction` →):

```ts
reference: {
  prompt: string
  visual:
    | { kind: 'screenshot'; uri: string }
    | { kind: 'url'; href: string }
    | { kind: 'route'; path: string }
    | { kind: 'story'; storyId: string }
    | { kind: 'description'; text: string } // fixture / offline
}
```

---

## 5. Assumptions & observability

Before implementation, agents must surface **Assumptions**:

- Bound to a **target** (region / node / box / component)
- Statement of inferred intent
- Confidence, preserve constraint
- Status: `pending` | `previewing` | `accepted` | `rejected` | `locked`

**Hard invariant:** rejected assumptions have **zero** effect on previews in
proposal mode and **never** appear in `ApprovedBrief.accepted`.

Observability appears in:

- Studio cards / pins / layers
- CLI list
- Future MCP tools (`list_decisions`, etc.)

Same `Assumption[]` everywhere — no second status machine per surface.

---

## 6. Authorship layer

Humans author **decisions**, not necessarily the final CSS:

| Act | Meaning |
|---|---|
| Preview | Temporary, reversible proposal on the visual |
| Accept / Reject | Authored allow/deny |
| Lock | Protect facts / behavior / copy |
| Batch | Multi-select accept/reject |
| Zoom / focus | Inspect one target or one assumption |
| Edit statement (future) | Revise the assumption text itself |

The human is author of the **ApprovedBrief**. Rejection is first-class
provenance (“we explicitly did not want X”).

---

## 7. Implementation & gating

Coding agents (Claude Code, Codex, Cursor) implement **only** from the brief:

1. Read `ApprovedBrief` (file and/or tool)
2. Implement accepted items only
3. Never implement `rejectedIds`
4. Obey locks / preserve
5. Link work to brief id / session id

**Portable packaging (modular):**

| Module | Role | Install |
|---|---|---|
| **brain** | Schema, verbs, brief | npm package |
| **skill / rule** | Policy: no visual impl without brief | Claude/Cursor skill, AGENTS snippet |
| **CLI / MCP** | Tool calls: propose, decide, brief | `npx` CLI first; MCP later |
| **studio** | Optional visual review | Example app / template |

Skill = when/rules. Tools = do. Brain = truth. Studio = see.

---

## 8. Git deliverables

| Artifact | Role |
|---|---|
| `APPROVED_BRIEF.md` / `.json` | Source of truth for allowed implementation |
| GitHub Issue | Holds Reference (prompt + visual link/shot); tracks session |
| Pull Request | Implements brief; body lists accepted / rejected / locks |
| Commits | Optional `Brief: <id>` trailer |
| CI (later) | Warn UI PRs missing brief reference |

Story: **Issue = intent → Session = inspection → Brief = authorship → PR = implementation.**

---

## 9. Studio / web UI (optional visual layer)

### Analogy

| Storybook | Figma | Assumption studio |
|---|---|---|
| Isolate a component | Direct-edit canvas | Isolate **interpretations** on a visual |
| Controls / variants | Selection + layers | Direction, locks, assumption pins |
| Docs | — | ApprovedBrief |

### Intent

**Figma-like gestures for review**, not a Figma clone for shipping pixels:

- Point/click (and later marquee) to select targets on the visual
- Layers-style list of targets + assumption badges
- Zoom/pan the artifact
- Preview as reversible overlay (“No code has changed”)
- Accept/reject/lock as authorship chrome

**Inspect ≠ Edit:** click means “this is under review,” not “mutate production CSS in the studio.” Final edits land via agent + git.

### Studio ladder

1. Preset hotspots (current demo hero)
2. Click DOM nodes in live preview
3. Screenshot + drawn boxes as targets
4. Multi-select, layers panel, zoom/pan
5. Optional: property tweaks that only *propose* assumption updates

---

## 10. Surfaces

| Surface | Job |
|---|---|
| **Brain** | Single Session + verbs + brief (source of decision truth) |
| **Studio (web)** | Spatial observability + authorship |
| **Terminal / CLI** | Agent-native list/decide/brief |
| **Chat** (later) | Utterances map to verbs |
| **MCP** (later) | Same verbs for cloud agents (public HTTPS) |

**Known gap (do not paper over):** web and CLI must eventually share one Session
store. Today they share verbs/types but can diverge in state — fix when
prioritizing multi-surface coherence.

---

## 11. Non-goals

- Replacing Figma / Pencil as a general design tool
- Claiming affiliation with Hawaiʻi Tech Week (demo content stays fictional + disclaimer)
- Inventing event details beyond `DEMO_CONTENT.md`
- Requiring Grok Bot for the product to work
- Studio writing production code as the primary path
- Building chat + TUI + web as three separate products
- Overclaiming: not a model eval, not production-ready platform

---

## 12. Success metrics (personal first)

- Fewer “undo the agent’s taste” loops on visual tasks
- Time from vague direction → acceptable UI goes down
- Rejected bad assumptions caught **before** a PR
- Brief is enough context for Claude/Codex without re-explaining in chat
- (Later) Another person can install brain + skill and run the loop on their repo

---

## 13. Roadmap (improve in place)

### Now (exists / in progress)

- [x] Brain module (types, verbs, selectors, fixture)
- [x] Studio demo: hero, X-Ray, preview, accept/reject, batch, focus, brief panel
- [x] CLI stub (`npm run brain`)
- [x] Auto-write `APPROVED_BRIEF.md` on approve
- [x] Portable skill text for Claude Code / Codex / Cursor (`docs/AGENT_SKILL.md`)
- [ ] Shared Session store (web ↔ CLI)
- [ ] `Session.reference` = prompt + visual (schema)

### Next

- [ ] npm-extractable `@assumption-inspector/brain` (+ CLI)
- [ ] DOM-inspect targets on live preview
- [ ] Issue / PR templates tied to brief
- [ ] Agent gate: skill enforces “implement only brief”

### Later

- [ ] Screenshot + box targets; layers panel; zoom/pan
- [ ] MCP server for propose / brief / decisions
- [ ] Storybook (or any-frame) visual adapter
- [ ] Light eval: with vs without inspection on small task set

---

## 14. Open questions

- Primary visual adapter for *your* daily work: local route, Storybook, or screenshot-first?
- How strict should the agent gate be (skill-only vs CI vs MCP tool requirement)?
- Should humans edit assumption text in-studio before accept, or only accept/reject as-written?
- Monorepo publish now vs keep brain in-repo until personal loop is habit?

---

## 15. Doc ownership

| Doc | Owns |
|---|---|
| **This PRD** | Product shape, roadmap, non-goals |
| `IMBUE_INTERVIEW_PLAN.md` | Time-boxed plan for Wed/Thu interview week (overrides priority until then) |
| `BRAIN.md` | Schema/verbs contract |
| `PRODUCT.md` | Short thesis / principles |
| `DECISIONS.md` | Dated choices |
| `AGENTS.md` | Repo coding constraints for agents |

When product intent changes, **update this PRD first**, then BRAIN/AGENTS as needed.
