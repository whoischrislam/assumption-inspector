# On-site playbook

Open this file at 9:40. Everything here is copy-paste.

The hero does **not** exist yet — you're building it on site in Cursor. That
changes one thing about the Grok run: you have no screenshot to attach. Use the
text description in step 1. This is fine and honest; the project is about how you
review the interpretation, not about the bot's vision capability.

---

## 1. Grok Bot — paste this instead of a screenshot

Bot profile and both prompts are in `GROK_PROMPTS.md`. For the structured run,
replace "attach the screenshot" with this block:

```md
Analyze this event-page hero. I am describing it rather than attaching an
image.

The page is a single hero section for a fictional tech-week event:

- Full-bleed blue/purple gradient background.
- Oversized all-caps headline: "HAWAIʻI TECH WEEK".
- Subhead: "Where tech meets Hawaiʻi" followed by "A week of people
  building, sharing, learning, and connecting."
- A small, low-contrast date/place line: "August 31–September 6 · Honolulu".
- A glossy, high-saturation primary button: "Explore events", with a drop
  shadow and rounded corners.
- Centered layout, tight vertical spacing, geometric sans-serif throughout.
- Overall: competent but generic — conventional SaaS event-landing-page
  polish.

Direction:
"Make this feel more community-led and locally grounded.
Preserve event discovery and factual information.
Avoid tropical clichés."

Return only:

## Observations
Three facts supported by the description above.

## Assumptions
Exactly four items. For each:
- ID
- Target
- Type: typography, layout, CTA, visual identity, or content
- Assumption
- Confidence: high, medium, or low
- Suggested visual change
- Preserve/do-not-change constraint

## Questions
Up to three decisions that must not be guessed.

## Proposed scope
State the smallest component or visual region that should change.
```

Then:
1. Paste the raw output verbatim into `art-director-output.md`.
2. Transcribe the four assumptions into `src/data/assumptions.ts`.
3. Keep IDs stable: `typography`, `event-context`, `cta`, `visual-identity`.
4. If the bot did **not** produce a tropical-cliché assumption on its own,
   say so in the demo and label the authored one as authored. Do not present
   an assumption you wrote as a model output.

---

## 2. Cursor — paste this as the first message

```md
Read AGENTS.md at the repo root before writing anything. It is the canonical
instruction set: scope fence, hard constraints, architecture, data model,
palette, and definition of done. Follow it exactly.

Build in this order, and stop after each step so I can look:

1. src/components/EventHero.tsx + styles — the polished, intentionally
   generic "before" state described in docs/DEMO_CONTENT.md. Blue/purple
   gradient, oversized all-caps headline, glossy CTA, small date/place line.
   Include the permanent "Speculative concept demo · Not affiliated with
   Hawaiʻi Tech Week" label. Make it good — this is the first thing people see.

2. The four preview CSS classes on the hero: .hero--editorial,
   .hero--place-forward, .hero--quiet-cta, .hero--tropical. Each must be
   independently togglable and fully reversible.

3. src/data/assumptions.ts — the fixture, typed per AGENTS.md. I will paste
   the real content in.

4. X-Ray toggle + the four assumption cards.

5. Preview / Accept / Reject per card, then the lock chip.

6. Proposed Render — applies ONLY accepted assumptions.

7. Staging tray + hold-to-compare.

Do not build anything in the non-goals list. Do not add a backend, tests, a
component library, Tailwind, or web fonts. Ask before adding any dependency.
```

---

## 3. Build order checklist (10:05–10:50)

- [ ] Base hero renders, looks polished, disclaimer visible
- [ ] Four CSS classes toggle independently and reverse cleanly
- [ ] Fixture populated from the real Grok output
- [ ] X-Ray toggle
- [ ] Four cards, anchored, confidence styling
- [ ] Preview per card + "Previewing N · No code has changed" banner
- [ ] Accept / Reject
- [ ] Lock chip
- [ ] Proposed Render applies only accepted
- [ ] Staging tray

**Stop when this list is done.** Anything else is scope creep.

## 4. Polish + capture (10:50–11:10)

- [ ] Readable on a projector from the back of the room
- [ ] Run the full flow five times
- [ ] Verify rejection leaves zero trace in the final render
- [ ] Screenshot: before
- [ ] Screenshot: x-ray with four cards
- [ ] Screenshot: tropical preview (the rejection moment)
- [ ] Screenshot: proposed render
- [ ] Screen recording of the full flow — this is your backup if the laptop dies
- [ ] `git push` — the Pages deploy is your other backup
      (https://whoischrislam.github.io/assumption-inspector/)
