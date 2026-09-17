# PRD (DRAFT): Assumption Inspector, a comprehension layer for human-agent oversight

> Working draft, iterating toward a solid spec before implementation.
>
> Provenance: competitive facts verified 2026-09-10 against primary sources
> (docs.openclaw.ai, github.com/openclaw/openclaw, github.com/NousResearch/hermes-agent).
> Two precise-sounding external-AI claims were checked and dropped as false (a
> Feishu card "Command" option that is actually "Deny"; a nonexistent Hermes
> "least-privilege credentials" issue). Star counts are distrusted (a fetched
> 244k figure was implausible) and not used. Prior-art citations in section 6 are
> from a grounding research pass; items without a reachable primary source are
> marked [unverified]. Product-competition facts in section 3a verified 2026-09-12
> (three parallel search passes against primary sources; per-claim labels there).
>
> Status of decisions: LOCKED items are settled. [CONFIRM] items are the
> remaining punch-list to make this PRD final.

## 1. Thesis

Agent runtimes do a stellar job with capability and policy. The
human/transparency layer is missing for comprehension. How do you trust an
agent when you don't have a comprehension layer between an agent's capability
and a human's intention and decision?

## 2. What this is

A **comprehension layer** for agent oversight: it turns a runtime's opaque
plans, tool calls, permissions, and outcomes into **decision records** a human
can read, steer, authorize, and audit.

- One-line value: delegate real work without blindly approving implementation
  details, and without becoming the agent's full-time operator.
- Core primitive: the **checkpoint** (section 5).
- Hard boundary: this layer **surfaces and annotates; it does not enforce**
  (section 11). A real sandbox enforces.

## 3. The problem (evidence, not assertion)

Modern personal-agent runtimes have deep capability and deep policy and no human
face on either. The approval *primitive* already exists; the *comprehension*
above it does not.

- OpenClaw permission is expressed **primarily through CLI/config**: five modes
  (`deny / allowlist / ask / auto / full`) set via `openclaw config set`. No
  user-facing model of "what is my agent allowed to do" in human terms.
  [docs.openclaw.ai/tools/permission-modes]
- OpenClaw broadcasts `exec.approval.requested` / `exec.approval.resolve` to
  operator clients, and documents the guardrail's own limit: approvals are "not
  a per-user auth boundary or filesystem read-only policy."
  [docs.openclaw.ai/tools/exec-approvals]
- Hermes ships approval as an API (`POST /v1/runs/{run_id}/approval`, advertised
  as a `run_approval` capability in `/v1/capabilities`), native chat-channel
  cards (Allow Once / Session / Always / Deny), and an auth-gated web dashboard.
  End-to-end wiring on the API/WebUI path is flagged open in issue #15802.
  [github.com/NousResearch/hermes-agent docs]
- Neither turns a raw approval event into a legible decision record with the
  agent's interpretation, a risk-by-confidence read, a plain consequence
  statement, reversibility, and a tiered surface.
- Attention is the real constraint. In one classic study only ~17% of people
  attended to permission prompts and ~3% comprehended them; adherence collapses
  with repetition (habituation). [Felt et al., SOUPS 2012; Vance/Anderson, MISQ
  2018] The design problem is comprehension under habituation, not more prompts.

The design layer for this is an opening, not a solved problem: these runtimes'
own hiring posts describe the product-design function as still forming, a thing
to *establish* rather than maintain.

## 3a. Competitive landscape and differentiation (verified 2026-09-12)

Product competition, distinct from the runtimes this layer hooks into (section
8). Verified against primary sources 2026-09-12; provenance labeled per claim.

**Table stakes now (do not lead with these):**

- *Plan-before-code* and *clarifying questions*. Claude Code, Cursor, GitHub
  Copilot, OpenAI Codex, Devin, Google Jules, and Replit Agent all ship a plan
  mode [official docs, 2025-2026]. Tell: Cursor 2.1's clarifying questions are
  *skippable* and fall back silently to "best judgment" [Cursor 2.1,
  2025-11-21]. That silent fallback is the failure this layer catches.
- *Action approval*. HumanLayer and LangGraph `interrupt()` gate what the agent
  will *do*, not what it *understood* [official, 2026].
- *Post-hoc traces*. Langfuse, AgentOps sit *after* execution [official, 2026].

**Contested flank (funded, coding-only).** AWS Kiro and Tessl ($125M raised,
Index-led) generate a reviewable, AI-authored *intent artifact* for coding [Kiro
official, 2025-07-14; Tessl funding, 2026]. Closest competitors. They produce a
*formal spec* (EARS notation, three-phase gates) and, per Kiro's own reviewers,
can mis-formalize genuinely ambiguous requirements. Heavy ceremony.

**One true category match.** Mural's multiplayer AI synthesizes agent context
onto a shared canvas for human review [Mural official, 2026], but as a
whiteboard-collaboration feature, not an oversight/decision layer.

**The open seam (our wedge).** No named, funded product surfaces the agent's
*hidden assumptions and ambiguity resolutions* as a first-class, editable,
diff-able object, distinct from the implementation plan and from a formal spec,
at inline-agent speed, for design-to-code work. No settled category name exists
yet. Kiro and Tessl punt on this; the inline agents skip it. Design is the
richest soil: a design request carries more hidden assumptions per instruction
than a code request.

**Differentiation line.** Not "shows a plan" or "asks questions." It is *the
agent's named assumptions as a reviewable artifact, distinct from the plan,
lightweight and inline, strongest on visual/design requests.*

**Caveats (not encoded as settled fact).** A stealth startup on this exact pitch
cannot be ruled out (absence of search evidence is not proof). "Coefficient
Giving / 36 initiatives" from the source research thread is a funder, not a
competitor, and the count is unverified.

## 4. Who it's for

- **v1 (dogfood):** a technically-capable person (starting with the author)
  running a local AI coding/product agent, who wants to steer it without
  operating every step. LOCKED.
- **Vision:** non-technical people (section 12). The save-point and undo mental
  model is deliberately legible to non-engineers; that is why the original
  Assumption Inspector began as a visual-design transparency tool.

## 4a. Scope: v1 boundary and sequencing (confirmed 2026-09-12)

Three axes, decided separately so scope creep cannot hide in the merge.

- **User (v1, LOCKED):** the author. A design-literate builder directing a
  coding/product agent. Dogfoodable today; saves real time on current work, so
  validation does not wait on recruiting strangers.
- **Domain (v1):** design-to-code is the **hero**. The agent's interpretation of
  an *ambiguous visual/UI request* is the star; general code actions (delete,
  refactor, migrate) are supporting exemplars in the same session timeline.
  Design requests carry the most hidden assumptions per instruction, which is
  where the comprehension layer earns its keep, and it is the author's edge.
- **Surface (v1):** a visual comprehension studio. Visual means *review and
  correct assumptions*, rendered graphically. This stays B-first (comprehension).
  It is **not** the spatial-manipulation canvas, which remains v2. Do not let
  "visual" slide into "drag nodes on a canvas."

**One primitive, sequenced renderers.** The invariant is the DecisionRecord /
checkpoint (sections 5, 8), surface- and domain-agnostic by design. CLI,
terminal, and the eventual non-technical visual app are all *renderings* of the
same object. Build the primitive once; add renderers as they earn their way in
(section 13). The Claude Code analogy holds only as a *sequence*: TUI first, apps
after the primitive was proven, never both at once.

**North star (not v1, see section 12):** the non-technical builder who cannot
read a diff to catch a misread. Larger and more defensible precisely because the
assumption gap is invisible to them until the result is wrong. It is what the v1
primitive earns its way toward, not a parallel v1 track.

## 5. Core concept: the checkpoint / save-point spine (LOCKED)

The primitive is the **checkpoint**: a moment where the agent's interpretation
and intended next action are made legible, and the human can move **forward** (on
track), **revise** (redirect), or **back** (revert to a prior save point).
Approval is just the highest-stakes kind of checkpoint. Interpretation is the
star; authority is a special case.

Mental models it borrows (also the explanation layer for non-technical users):

- **git / version control:** a checkpoint is a commit; revise is a branch; the
  receipt is a diff; revert is a reset.
- **emulator save states:** a checkpoint snapshots interpretation + intended
  action, addressable and loadable.
- **branching narrative games:** the session is a *tree* of checkpoints; rewind
  to a node and take another path.
- **parallel side quests, in-session:** forked subtrees run concurrently but stay
  scoped to the session and rejoin. Nothing escapes the session without crossing
  a high-tier checkpoint. That boundary is a safety property.

**Reversibility decides whether a back button exists at all.** Reversible actions
get rich forward/back. Irreversible actions have no back, so the checkpoint must
gate hard *before*. This single axis ties the tiers (section 6) to the save
points.

v1 builds the **linear minimum** (one timeline; forward/revise/back). The tree,
branches, and parallel quests are additive later, because a checkpoint is an
addressable object from day one.

## 6. The classification model (two layers) (LOCKED)

**Precision in the model, brevity at the surface.**

### 6a. Internal scoring axes (stored as data; tier is a computed function)

Derive-don't-hardcode is the flexibility guarantee: adding an action, an axis, or
a runtime is additive, never a reshuffle.

| Axis | Notes / borrowed vocabulary |
|---|---|
| Reversibility (+ idempotency) | strongest axis in all prior art. "one-way/two-way door" (Bezos); "destructive vs additive" + "idempotent" (MCP `ToolAnnotations`, 2025-03-26). Idempotency is the cleanest reason NOT to interrupt a repeat. |
| Blast radius | DevOps/SRE convention; give it units (files/records/services/users touched). Capability-security analogue: scope. |
| Data exposure (sensitivity x recipient) | data classification tiers public/internal/confidential/restricted; GDPR special-category flag; contextual integrity (Nissenbaum): sensitivity = information type x recipient. Absorbs most of the old "destination." |
| Repeatability / grant persistence | once / task / session / persistent. The habituation lever (Android allow-once/while-using/always; OAuth scopes + incremental auth). Was the biggest gap in v0 of this model. |
| Interpretation confidence | the modulator, not a peer. Horvitz mixed-initiative (CHI 1999): act-vs-ask = uncertainty x cost of being wrong. MULTIPLY against consequence. Confidence-display has an over/under-reliance failure mode ["Are You Really Sure?", CHI 2024]. |

- **Consequence is the derived tier (the output), not an input.** (Android
  normal/dangerous/signature; Anthropic "confirm meaningful real-world
  consequences.")
- **Trigger provenance** (is the instruction from the user, or from untrusted
  content the agent read?) is the prompt-injection axis. Held for vision; matches
  a fail-toward-safety instinct. [MCP untrusted-annotation warning]

### 6b. The surface (what the human sees)

Roughly **3 tiers** (aligns with Android's 3 protection levels and the near
universal 3-mode agent approval pattern) plus a **one-line "why"** that names at
most the 1-2 axes that drove the decision. When interpretation confidence is what
triggered the stop, the "why" says so; that is when it reads as an
assumption-inspector rather than a permission box.

### 6c. Derived outputs

- **Alarm intensity** (how loudly to surface) = interpretation confidence x
  consequence, plus blast radius / data exposure.
- **Back button** (can you rewind) = reversibility alone.

### 6d. The floor [CONFIRM]

Tuning and persistence apply to the soft tiers only. The Critical tier
(irreversible, real-world, or credential/financial) always surfaces at full
intensity and cannot be set to silent or to a persistent "always allow." This is
the safety floor under the tunable gradient (principle 1), and it mirrors how
OpenClaw enforces the stricter of policy and host defaults. Confirm the floor and
where it sits.

## 7. Decision vocabulary (v1) (LOCKED)

**Allow once / Revise / Deny.** No "always here" in v1 (its scope is ambiguous
and it is the exact ambient-permission affordance that drives habituation).
Preview task/session/persistent authority visually, but do not ship it as a
working control until scope comprehension is tested.

## 8. How it hooks in (architecture) (LOCKED)

This is a **client of the agent's existing local control plane**, not a
modification of the runtime.

- OpenClaw runs a local **Gateway** (`http://127.0.0.1:18789`); the Control UI is
  one client of it; approval events broadcast to connected clients advertising
  the `approvals` capability. Hermes exposes an equivalent local API
  (`localhost:8642/v1`) with a `run_approval` capability. [both verified 2026-09-10]

**Build against the contract, not the connection.** Two modes:

1. **Fixture mode (v1):** the studio renders one complete decision loop from a
   seeded fixture. No running agent, no install, GitHub-Pages hostable.
2. **Live adapter mode (later):** an adapter connects to a real Gateway/API and
   emits the *same* event shapes.

```
interface AgentEventSource {
  listTasks(): Promise<TaskSummary[]>;
  getTask(taskId: string): Promise<TaskDetail>;
  getAuthorityState(): Promise<AuthorityState>;
  subscribe(onEvent: (e: AgentEvent) => void): () => void;
  resolveApproval(approvalId: string, decision: ApprovalDecision): Promise<ApprovalResolution>;
}
// FixtureSource (v1) | OpenClawAdapter (later) | HermesAdapter (later)
// Note distinct identities: task vs approval vs authority-grant.
```

The human-facing object is a **DecisionRecord** (the rendering of a checkpoint
that needs a decision):

```
type DecisionRecord = {
  id: string; checkpointId: string; taskId: string; requestedAt: string;
  intent: string;          // what the agent believes the goal is
  actionSummary: string;   // what it is about to do, in human terms
  rationale: string;       // why it thinks this is right
  interpretationConfidence: "explicit" | "inferred" | "guessed";
  classification: {         // the scored axes -> derived tier
    reversibility; blastRadius; dataExposure; repeatability; tier; why: string;
  };
  consequences: { changes: string[]; externalEffects: string[]; dataDisclosure: string[]; reversible: boolean; undoPath?: string };
  raw?: { tool: string; command?: string; args?: Record<string, unknown> }; // on demand only
};
```

**Still to verify before the live adapter** (architecture shape is verified; wire
protocol is not): exact endpoints, event schema, the `approvals`/`run_approval`
handshake for a third-party client, and client identity/auth.

## 9. First slice (v1): the design-to-code decision loop [CONFIRM scenario details]

Hero domain is design-to-code (section 4a); a code action stays as a supporting
exemplar. Proposed dogfood scenario: you tell the agent **"make the onboarding
feel calmer."** v1 renders that one session as a timeline of checkpoints spanning
the tier spectrum:

- **Low:** nudges spacing/token values inside one component. Silent log, free
  back.
- **Guarded:** restyles a *shared* component. Passive notice that names the
  ripple ("this changes the shared Button; 6 screens use it"), back works.
- **High + wrong assumption (the star):** it read "calmer" as "remove the
  progress stepper and merge three steps into one screen," a flow/IA change you
  did not ask for. Low interpretation confidence x high blast radius produces a
  **blocking decision record**: what it thinks you meant ("calmer = fewer
  steps"), what it will touch (deletes the stepper, rewrites three routes), what
  is reversible. You **Revise** ("calmer = more whitespace, softer palette,
  slower transitions, keep every step") or **Deny**.
- **(Optional Critical exemplar, code):** wants to run a repo-wide codemod or
  force-push. Hard gate, no back button.

Plus a **completion receipt** answering four fixed questions: what happened, what
changed, which shared components/screens it rippled to, what can still be undone.

Riskiest assumption this tests: that an inspect-before-act stage reads as
leverage, not friction, on exactly the ambiguous *visual* requests where the
assumption gap is widest. Confirm the anchor request and the tier exemplars.

## 10. Design principles (wording provisional)

1. **Interruption is a tunable gradient, not a binary** (with the section 6d
   floor).
2. **You cannot approve what you cannot see.** Legible in human terms before the
   decision.
3. **Predictable beats clever; transparency builds trust.** If you can't guess
   what a control does, it failed.
4. **When unsure, stop and deny.** Authority fails closed.
5. **A block is a teaching moment, not a dead end.** On a stop, help the user
   resolve it (allow once, adjust, revise) and understand why, via micro-tutorials
   that fade once the mental model lands. [v1: one teaching moment on one block;
   adaptive fading is later.]

Parked candidates: "chat is for intent, a task record is for accountable work";
"make uncertainty visible" (may already be covered by axis 5 + principle 2).

## 11. Non-goals (LOCKED unless marked)

- **Surfaces, does not enforce.** This layer annotates and helps decide. A real
  sandbox enforces. It must never be trusted to *prevent* what it can only *show*.
- Not a policy/permission engine. It sits on top of an existing one.
- Not multi-surface parity in v1. Web studio goes deep first.
- Not a live runtime connection in v1 (fixture-driven).
- Not a gotcha. This engages the runtimes constructively; the goal is a better
  design layer above what they already ship, not a callout of anyone's flaws.
- [CONFIRM] any others.

## 12. Vision / north star (not v1)

- **Dogfood -> general tool** for AI-assisted coding + product development.
- **Non-technical reach:** the save-point/undo model made legible to
  non-engineers.
- **Feedback / personalization loop** (Sculptor-style): dive into what the agent
  did and *teach it back* (user teaches system; the inverse of principle 5). A
  system unto itself.
- **The tree:** branching, rewind, parallel session-scoped side quests.
- **Trigger-provenance** axis (prompt-injection surface).
- **Live adapters:** OpenClaw first (best documented), then Hermes.
- **Terminal register:** the approval/decision card OpenClaw's TUI lacks.

## 13. Layering roadmap

1. Web studio, fixture mode: one coding decision loop across tiers + receipt.
2. Authority axes wired through the decision + a real revise path.
3. Live proposer / real event data replacing the fixture.
4. `OpenClawAdapter` (needs the wire-protocol verification pass first).
5. Second register (terminal, Ink) and/or Hermes adapter.
6. Feedback/personalization loop; the checkpoint tree.

## 14. Success (v1) [CONFIRM]

A 5-person unmoderated first-use bar (from qualitative testing, per the
play-don't-show gate):

- 4/5 can explain what the agent was trying to do, what required a decision, what
  Allow-once would do, and the difference between Revise and Deny.
- 4/5 identify the deliberately wrong assumption unprompted.
- 3/5 describe the decision record as more confidence/control, not needless
  overhead.
- A participant can find the receipt and say what left the device and whether it
  can be undone.

Confirm or adjust the bar.

## 15. Open questions / punch-list

- [CONFIRM] the v1 design-to-code scenario details (section 9); hero domain
  flipped code -> design 2026-09-12, scenario details still open.
- [CONFIRM] the section 6d floor and where it sits.
- [CONFIRM] name + core noun: keep "Assumption Inspector," subtitle "decision
  records for consequential agent actions"?
- [CONFIRM] the success bar (section 14).
- [CONFIRM] final principle wording (section 10).
- OpenClaw/Hermes wire protocol before any adapter work.
- Does v1 ship one scenario or a small set of exemplars in one session?
- Is the authority view read-only comprehension in v1, or also editable?

## Sources (primary unless noted)

- OpenClaw: docs.openclaw.ai/tools/exec-approvals, /tools/permission-modes,
  /web/control-ui, /gateway/security; github.com/openclaw/openclaw
- Hermes: github.com/NousResearch/hermes-agent (docs + issue #15802);
  hermes-agent.nousresearch.com/docs
- Prior art: Horvitz, Mixed-Initiative UIs (CHI 1999); Nissenbaum, contextual
  integrity; MCP tool annotations (2025-03-26); OAuth 2.0 (RFC 6749); Felt et al.
  (SOUPS 2012); Vance/Anderson habituation (MISQ 2018); Nielsen heuristics.
  [macOS TCC categories and one 2026 arXiv agent-CI paper were title/secondary
  only, unverified.]
- Do NOT cite: squatter domains (open-claw.bot, openclaw-ai.com, hermes-agent.org,
  hermes-ai.net); crypto-spam "on-chain" claims; the dropped fabrications above.
