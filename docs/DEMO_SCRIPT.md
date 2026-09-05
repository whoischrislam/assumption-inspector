# Demo script

Target: **90–120 seconds.** The maximum is 3 minutes; do not use it all.

## The golden path (the exact clicks)

1. Page loads in its generic "before" state. Select the hero.
2. Enter the direction:
   > "Make this feel more community-led and locally grounded. Preserve event
   > discovery and factual information. Avoid tropical clichés."
3. Click **[ Show me what you think I mean ]**.
4. Four assumption cards animate in, anchored to their targets.
5. Preview **Typography** → **Accept**
6. Preview **Event context** → **Accept**
7. Preview **CTA** → **Accept**
8. Preview **Island illustration** → **Reject** (card goes gray with a red strike)
9. Add the lock:
   > LOCKED — Do not change factual event information, links, or event-discovery behavior.
10. Click **[ Build approved direction ]** → Proposed Render.
11. Staging tray shows the decisions. Optionally **[ Hold to compare ]**.

## Spoken script

> "I build with coding agents, and I keep taking screenshots of live work and
> saying, 'make this feel more like this.' The agent can see the pixels, but it
> still has to guess what I mean.
>
> I made Assumption Inspector to put a reviewable step before an agent changes
> code. I select this event hero and say, 'make it more community-led and locally
> grounded, but avoid tropical clichés.'
>
> Grok Bot gives me the interpretations it would act on. More breathing room?
> That works — I can preview and accept it. Bringing date and place forward?
> Also good.
>
> But it assumes 'local' means an island/ocean illustration. I preview that,
> reject it, and lock the constraint.
>
> Now this is the proposed direction: every visible change came from an
> assumption I approved, and factual content and event discovery stayed
> protected.
>
> The point isn't that agents should have better taste. It's that they should
> show what they think we mean before they change the work."

## Event-day timing (2026-09-05)

| Time | What |
|---|---|
| before leaving | scaffold + base hero + fixture + CSS classes; take before/after screenshots; **do not activate the credit QR early** |
| 8:45–9:10 | check-in, mingle |
| 9:15–9:40 | Grok Bot walkthrough — watch attachment flow, persistent instructions, permissions, how to stop/redirect, export, credit behavior |
| 9:40–10:05 | create the Art Director bot, run the prompts, save output to `docs/art-director-output.md`, transcribe four assumptions into the fixture |
| 10:05–10:50 | build in order: X-Ray toggle → four cards → preview → accept/reject → lock chip → proposed render → staging tray. **Stop when the flow works.** |
| 10:50–11:10 | polish + test the flow five times; verify rejection leaves no trace; verify only accepted cards affect the render |
| 11:10–11:20 | rehearse to 90–120s |
| 11:35 | lightning round |

## One question to ask during the walkthrough

> "For an agent interpreting visual references, what is the cleanest way to force
> it to separate what it observes, what it infers, and what it needs a person to
> decide before it takes any action?"

## Backup plan

If the dev server, laptop, or projector fails:
1. Deployed build: **https://whoischrislam.github.io/assumption-inspector/**
2. Screenshot sequence (before → x-ray → previews → rejection → proposed render).
3. Screen recording of the full flow.

Capture 2 and 3 **before leaving**.
