# Art Director — raw output / provenance

> Provenance record for interpretations shown in Assumption Inspector.
> Live runs go through `/api/interpret` (dev). Fixture lives in
> `src/data/assumptions.ts`.

**Run date:** 2026-09-05
**Source:** Authored fixture (path B) — not a Grok Bot transcript

---

## Baseline run

_(not used — skipped Grok Bot app in favor of in-app interpret + fixture)_

---

## Structured / fixture notes

Four authored assumptions with stable IDs:

| id | role |
|---|---|
| `typography` | editorial breathing room — accept |
| `event-context` | date/place forward — accept |
| `cta` | quieter button — accept |
| `visual-identity` | tropical overlay — **deliberately wrong, reject** |

When a live model returns the same IDs via `/api/interpret`, those statements
replace the fixture for that session. On API failure, the fixture is used and
the UI says so.

---

## Transcription notes

Authored for the golden-path rejection beat. Do not present the tropical
assumption as model output unless a live run actually produced it.
