import type { Assumption, Session, SessionFocus, TargetId } from './types'
import { ASSUMPTION_CLASS } from './types'

/** Assumptions that currently apply visual classes. Rejected never apply. */
export function activeAssumptionIds(session: Session): string[] {
  return session.assumptions
    .filter((a) => a.status === 'previewing' || a.status === 'accepted')
    .map((a) => a.id)
}

export function cssClassesForActiveIds(ids: string[]): string[] {
  return ids.map((id) => ASSUMPTION_CLASS[id]).filter(Boolean)
}

export function byTarget(
  assumptions: Assumption[],
  targetId: TargetId,
): Assumption[] {
  return assumptions.filter((a) => a.target === targetId)
}

export function previewCount(session: Session): number {
  return session.assumptions.filter((a) => a.status === 'previewing').length
}

export function hasFactualLock(session: Session): boolean {
  return session.locks.some((l) => l.id === 'factual-event-discovery')
}

/**
 * Visible cards given focus. Target focus filters; assumption focus keeps all
 * but marks the focused id (UI dims others).
 */
export function visibleAssumptions(session: Session): Assumption[] {
  const { focus, assumptions } = session
  if (!focus) return assumptions
  if (focus.kind === 'target') {
    return byTarget(assumptions, focus.targetId)
  }
  return assumptions
}

export function isAssumptionDimmed(
  session: Session,
  assumptionId: string,
): boolean {
  const { focus } = session
  if (!focus || focus.kind !== 'assumption') return false
  return focus.assumptionId !== assumptionId
}

export function focusedTargetId(focus: SessionFocus): TargetId | null {
  if (!focus) return null
  if (focus.kind === 'target') return focus.targetId
  return null
}

export function focusedAssumptionId(focus: SessionFocus): string | null {
  if (!focus || focus.kind !== 'assumption') return null
  return focus.assumptionId
}

export function targetForAssumption(
  session: Session,
  assumptionId: string,
): TargetId | null {
  return session.assumptions.find((a) => a.id === assumptionId)?.target ?? null
}

/** Highlight ring on hero: explicit target focus, or target of focused assumption. */
export function highlightTargetId(session: Session): TargetId | null {
  const { focus } = session
  if (!focus) return null
  if (focus.kind === 'target') return focus.targetId
  return targetForAssumption(session, focus.assumptionId)
}
