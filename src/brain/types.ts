export type AssumptionStatus =
  | 'pending'
  | 'previewing'
  | 'accepted'
  | 'rejected'
  | 'locked'

export type TargetId = 'hero' | 'title' | 'meta' | 'cta' | 'background'

export type AssumptionType =
  | 'typography'
  | 'layout'
  | 'cta'
  | 'visual-identity'

export type Confidence = 'high' | 'medium' | 'low'

export type Assumption = {
  id: string
  title: string
  target: TargetId
  type: AssumptionType
  confidence: Confidence
  statement: string
  previewLabel: string
  preserve: string
  status: AssumptionStatus
}

/** What is currently zoomed in the inspector UI. */
export type SessionFocus =
  | { kind: 'target'; targetId: TargetId }
  | { kind: 'assumption'; assumptionId: string }
  | null

export type SessionLock = {
  id: string
  label: string
}

export type Session = {
  id: string
  direction: string
  reference?: string
  assumptions: Assumption[]
  locks: SessionLock[]
  focus: SessionFocus
  selectedIds: string[]
  updatedAt: string
}

/** Handoff artifact — rejected assumptions are never included. */
export type ApprovedBrief = {
  direction: string
  accepted: Array<{
    id: string
    title: string
    target: TargetId
    type: AssumptionType
    statement: string
    preserve: string
  }>
  locks: SessionLock[]
  rejectedIds: string[]
  preserve: string[]
  generatedAt: string
}

/** CSS class keyed by assumption id — load-bearing for web previews. */
export const ASSUMPTION_CLASS: Record<string, string> = {
  typography: 'hero--editorial',
  'event-context': 'hero--place-forward',
  cta: 'hero--quiet-cta',
  'visual-identity': 'hero--tropical',
}

export const DEFAULT_DIRECTION =
  'Make this feel more community-led and locally grounded. Preserve event discovery and factual information. Avoid tropical clichés.'

export const FACTUAL_LOCK: SessionLock = {
  id: 'factual-event-discovery',
  label: 'Do not change factual information or event discovery',
}
