# Imbue interview week — execution plan

**Interview window:** Wed or Thu this week (≈ Sep 9–10, 2026)  
**Today:** Sat Sep 5, 2026  
**Constraint:** Do not chase the full PRD. Ship a **credible vertical slice** + narrative.

Canonical product vision remains [PRD.md](./PRD.md). This doc **overrides priority** until the interview is done.

---

## 1. What “success” means Wednesday/Thursday

You can, in **≤ 3 minutes** (ideally 90–120s):

1. State the thesis in one breath: *prompt ≠ interpretation ≠ implementation*
2. Run the live loop: direction → assumptions → preview → **reject** bad taste → lock → brief
3. Connect to coding agents: “this brief is what Claude/Codex are allowed to implement”
4. Connect to *you*: oversight as product architecture (matches portfolio “looking for”)
5. Answer “what’s next?” without apology: Reference schema, agent skill gate, DOM inspect — *after* the loop is habit

You do **not** need: MCP, Grok Bot, shared Session, Figma freeform select, npm publish, eval study, portfolio fully redesigned.

---

## 2. Priority stack (ruthless)

| Rank | Work | Interview value | Effort |
|---|---|---|---|
| **P0** | Demo reliability + rehearsal | Essential | 2–4h |
| **P0** | Backup: screen recording + Pages URL | Essential | 1h |
| **P1** | Auto-write `APPROVED_BRIEF.md` + copy works | High — closes “then what?” | 2–3h |
| **P1** | One-page talk track (problem → insight → demo → ask) | High | 1–2h |
| **P2** | Tiny Claude/Codex skill snippet in repo | Medium — shows agent handoff | 1h |
| **P2** | Portfolio Work card + link to live demo | Medium — Imbue can revisit | 2–3h |
| **P3** | Polish UI / projector readability | Nice | 1–2h |
| **Defer** | Shared session, Reference schema, DOM inspect, MCP, packaging | Post-interview | — |

If time slips, **cut from the bottom**. Never cut P0.

---

## 3. Day-by-day (Sat → interview)

### Sat (today) — Freeze scope
- [x] Brain + studio + PRD already on `main`
- [ ] Run full golden path 3× (`npm run dev`): reject tropical leaves **zero** trace
- [ ] Confirm Pages deploy works or plan `npm run build && npx serve` backup
- [ ] Decide: interview demo = **fixture** (reliable) vs live LLM (optional flex)

**Decision default:** fixture for the talk. Mention live proposer as optional. Reliability > magic.

### Sun — P1 handoff artifact
- [x] Implement: Build approved direction → write `APPROVED_BRIEF.md`
- [x] Brief panel copy markdown/JSON still works
- [x] Draft `docs/AGENT_SKILL.md`: implement **only** brief
- [ ] One dry run: paste brief into a throwaway Claude/Codex prompt (even if you don’t merge a PR)

### Mon — Narrative + backup
- [ ] Write 90s script on a card (below); rehearse to a timer **5×**
- [ ] Record screen (QuickTime): full flow once clean
- [ ] Push any demo fixes; verify GitHub Pages URL
- [ ] Optional P2: portfolio card stub on whoischrislam.github.io

### Tue — Dress rehearsal
- [ ] Full run on the machine you’ll use (wifi, browser, font size)
- [ ] Practice failure recovery: “laptop dies → recording / Pages”
- [ ] Prepare 3 likely questions + answers (below)
- [ ] Sleep. Do not start DOM-inspect or MCP

### Wed/Thu — Interview day
- [ ] 30 min before: launch `npm run dev`, click through once
- [ ] Tabs ready: app, brief file, repo README/PRD (optional)
- [ ] Recording file on Desktop as backup

---

## 4. Talk track (use this)

**Opening (15s)**  
I keep giving coding agents vague visual direction. They guess taste and scope inside the diff. I want the guess **reviewable** before code.

**Demo (60–90s)**  
Here’s Assumption Inspector. Same direction you’d type to Claude. It shows four assumptions. I preview and accept the ones that match. The tropical reading of “local” — I reject it; it must leave no trace. I lock facts. Now this is the approved brief — what an agent is allowed to implement.

**Close (20s)**  
The point isn’t better taste models. It’s **authorship of interpretation** before implementation — oversight as product architecture. Next I’d gate Claude/Codex on this brief and point-and-click real DOM targets. Happy to go deep on either.

**Portfolio bridge (optional 10s)**  
This is also how I want to ship my own site updates — intent survives into the PR.

---

## 5. Likely Imbue questions → short answers

| Question | Answer spine |
|---|---|
| Why not just better prompts? | Prompts don’t make the agent’s *inferences* inspectable; the diff is too late |
| Why not chat? | Chat collapses observation/assumption/decision; we need structured status + reject = zero effect |
| How is this different from Cursor/plans? | Plans are usually functional; this is **subjective visual** assumptions tied to targets with live preview |
| Does it work with real agents? | Brief is the contract; skill says implement only accepted — studio is the human review surface |
| What’s the hard part? | Which assumptions deserve UI vs silent; keeping reject honest; not becoming a second Figma |
| What would you measure? | Rework cycles, bad assumptions caught pre-PR, time to acceptable UI (tiny eval later) |
| Doesn't reviewing every assumption become a chore? | It surfaces *every* interpretation by default — I don't let the tool decide what matters. Batch-clear the obvious; it learns what to auto-accept from my own decisions. Full authorship up front, less over time as it earns trust. Transparency is always on; the *interrupt* is a dial I tune down |

---

## 6. Explicit defer list (say “after interview”)

- Shared `session.json` web↔CLI  
- `reference: { prompt, visual }` schema migration  
- Figma-like freeform select / layers  
- MCP / Grok Bot  
- npm package extract  
- Formal eval study  
- Full portfolio redesign via the tool  

These stay in [PRD.md](./PRD.md) roadmap — not this week’s build queue.

---

## 7. Definition of done for interview week

- [ ] Golden path works cold on your laptop  
- [ ] Reject tropical → proposed render clean  
- [ ] `APPROVED_BRIEF.md` exists after approve (P1)  
- [ ] 90s script rehearsed ≥5×  
- [ ] Screen recording + live URL backup  
- [ ] You can say next steps without sounding unfinished  

---

## 8. Immediate next action

**Start P1:** auto-write `APPROVED_BRIEF.md` on Build approved direction + add `docs/AGENT_SKILL.md`.  
Then Sunday rehearsal — not more architecture.
