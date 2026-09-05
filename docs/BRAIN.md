# Assumption brain

Client-agnostic decision layer for Assumption Inspector.

> Agents propose assumptions tied to targets → humans inspect (point, zoom, batch) → only an **ApprovedBrief** may be implemented.

Surfaces (web, terminal, future chat/MCP) are adapters. They must not invent a second status machine.

## Schema

Defined in [`src/brain/types.ts`](../src/brain/types.ts):

| Type | Role |
|---|---|
| `Assumption` | One reviewable interpretation (`id`, `target`, `statement`, `status`, …) |
| `Session` | Current work: direction, assumptions, locks, focus, selectedIds |
| `SessionFocus` | Zoom: a `target` or a single `assumption`, or `null` |
| `ApprovedBrief` | Handoff artifact — **rejected never in `accepted`** |

Hard invariant: rejected assumptions have **zero** visual effect and never enter the brief’s accepted list.

## Verbs

Pure functions in [`src/brain/verbs.ts`](../src/brain/verbs.ts):

`propose` · `preview` · `clearPreview` · `accept` · `reject` · `batchAccept` · `batchReject` · `focus` / `focusTarget` / `focusAssumption` · `toggleSelected` · `toggleFactualLock` · `buildBrief` · `briefToMarkdown`

Selectors in [`src/brain/selectors.ts`](../src/brain/selectors.ts): `activeAssumptionIds`, `visibleAssumptions`, `highlightTargetId`, …

## Surfaces

| Surface | How it plugs in |
|---|---|
| **Web** | `App.tsx` holds one `Session`, calls verbs, renders hero + X-Ray |
| **Terminal** | `npm run brain -- list \| brief \| accept <id> \| reject <id> \| focus <target>` (writes `session.json`) |
| **Chat** (later) | Map utterances → the same verbs; no separate state |
| **MCP / Grok Bot** (later) | Expose `propose` / `get_brief` / `list_decisions` over HTTPS; Bot must not implement until brief says so |

## Proposer seam

[`src/data/loadAssumptions.ts`](../src/data/loadAssumptions.ts) is a **proposer only** — returns `Assumption[]` for `propose()`. Fixture or live LLM. Components never know the source.

## Point-and-click (web)

1. Click a hero region (`title` / `meta` / `cta` / `background`) → `focusTarget`
2. X-Ray filters or zooms matching assumptions
3. Multi-select → batch accept/reject
4. Zoom a card → `focusAssumption` (dims others, enlarges statement)
5. Build approved direction → clear previews + show `ApprovedBrief`

## Extending for a new client

1. Import verbs/selectors from `src/brain`
2. Hold or load a `Session`
3. Call verbs on user/agent actions
4. Render however you want — do not fork status rules
