# Product notes

## One sentence

Before an AI changes a visual design, Assumption Inspector shows what it thinks
you mean, previews each interpretation directly on the page, and lets you accept,
revise, reject, or lock it before code changes.

## The thesis

> prompt ≠ agent interpretation ≠ implementation

Planning-before-execution is well understood for functional work, where the
ambiguity is usually *what to build*. In visual work the ambiguity is different:
it is taste, cultural meaning, relative emphasis, and scope. A person often knows
the direction by recognition, not by precise language.

So the interesting question is not "can the agent write better CSS." It is:
**what should an agent show a person before it acts, when the thing being decided
is subjective?**

## The layers

| Layer | Question | Example |
|---|---|---|
| Observation | What can the agent truly see? | "The date/location metadata is visually secondary to the headline." |
| Assumption | What does it infer from a vague direction? | "'More local' means a regional illustration." |
| Preview | What would that assumption do visually? | "CTA loses shadow, saturation, and prominence." |
| Decision | What does the human allow, reject, or protect? | "Reject regional cliché; preserve all factual copy." |
| Approved brief | What may a code agent implement? | "Apply accepted visual changes to the hero only." |

The separation is the product. Collapsing observation into assumption is what
makes agent visual work feel uncontrollable.

## Design principles

1. **A preview is a proposal, not an edit.** The page is a proposal surface. The
   "No code has changed" banner is a promise, and the UI must never break it.
2. **Rejection must be as easy and as visible as acceptance.** The deliberately
   wrong fourth assumption exists so the human-control moment is real, not implied.
3. **Locks are first-class.** "Do not change factual event information, links, or
   event-discovery behavior" is a constraint the human authors, not a setting.
4. **Confidence is shown, not hidden.** Low-confidence assumptions look different
   (yellow dotted border) so attention goes where the guessing is.

## Open questions (worth thinking about, not building yet)

- How do you represent ambiguity a user recognizes but can't articulate?
- Which assumptions deserve approval vs. silent inference? Too much transparency
  is work; too little is a black box.
- For subjective outputs, does verification become user-authored constraints and
  comparison interfaces rather than a correctness score?
- Should plan statements carry commitment levels — *explore / suggest / change /
  preserve* — instead of all being requirements?

## What not to claim

- Not HIPAA-compliant, not production-ready, not affiliated with Hawaiʻi Tech Week.
- Grok Bot did not change any website. It produced one interpretation, which was
  transcribed into a fixture.
- Not a model evaluation and not evidence about any model's general behavior.
- Not a better Cursor / Paper / pen.dev.

What is true: *a small interface prototype driven by a real Grok Bot
interpretation, testing whether previewable assumptions make visual agent work
easier to direct and safer to review.*
