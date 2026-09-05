import type {
  Assumption,
  ApprovedBrief,
  Session,
  SessionFocus,
  SessionLock,
  TargetId,
} from './types'
import { FACTUAL_LOCK } from './types'

function touch(session: Session): Session {
  return { ...session, updatedAt: new Date().toISOString() }
}

function mapAssumption(
  session: Session,
  id: string,
  status: Assumption['status'],
): Session {
  const assumptions = session.assumptions.map((a) => {
    if (a.id !== id) {
      if (status === 'previewing' && a.status === 'previewing') {
        return { ...a, status: 'pending' as const }
      }
      return a
    }
    return { ...a, status }
  })
  return touch({ ...session, assumptions })
}

/** Replace assumptions from a proposer (LLM / fixture). Resets focus + selection. */
export function propose(session: Session, assumptions: Assumption[]): Session {
  return touch({
    ...session,
    assumptions: assumptions.map((a) => ({ ...a, status: 'pending' as const })),
    focus: null,
    selectedIds: [],
  })
}

export function setDirection(session: Session, direction: string): Session {
  return touch({ ...session, direction })
}

export function preview(session: Session, id: string): Session {
  return mapAssumption(session, id, 'previewing')
}

export function clearPreview(session: Session, id: string): Session {
  const a = session.assumptions.find((x) => x.id === id)
  if (!a || a.status !== 'previewing') return session
  return mapAssumption(session, id, 'pending')
}

export function accept(session: Session, id: string): Session {
  return mapAssumption(session, id, 'accepted')
}

export function reject(session: Session, id: string): Session {
  const next = mapAssumption(session, id, 'rejected')
  return touch({
    ...next,
    selectedIds: next.selectedIds.filter((sid) => sid !== id),
  })
}

export function batchAccept(session: Session, ids: string[]): Session {
  const idSet = new Set(ids)
  const assumptions = session.assumptions.map((a) => {
    if (!idSet.has(a.id) || a.status === 'rejected') return a
    return { ...a, status: 'accepted' as const }
  })
  return touch({ ...session, assumptions, selectedIds: [] })
}

export function batchReject(session: Session, ids: string[]): Session {
  const idSet = new Set(ids)
  const assumptions = session.assumptions.map((a) => {
    if (!idSet.has(a.id)) return a
    return { ...a, status: 'rejected' as const }
  })
  return touch({
    ...session,
    assumptions,
    selectedIds: session.selectedIds.filter((id) => !idSet.has(id)),
  })
}

export function focus(session: Session, next: SessionFocus): Session {
  return touch({ ...session, focus: next })
}

export function clearFocus(session: Session): Session {
  return focus(session, null)
}

export function toggleSelected(session: Session, id: string): Session {
  const has = session.selectedIds.includes(id)
  const selectedIds = has
    ? session.selectedIds.filter((x) => x !== id)
    : [...session.selectedIds, id]
  return touch({ ...session, selectedIds })
}

export function clearSelection(session: Session): Session {
  return touch({ ...session, selectedIds: [] })
}

export function selectAllOpen(session: Session): Session {
  const selectedIds = session.assumptions
    .filter((a) => a.status === 'pending' || a.status === 'previewing')
    .map((a) => a.id)
  return touch({ ...session, selectedIds })
}

/** Toggle the standard factual/event-discovery lock. */
export function toggleFactualLock(session: Session): Session {
  const on = session.locks.some((l) => l.id === FACTUAL_LOCK.id)
  const locks: SessionLock[] = on
    ? session.locks.filter((l) => l.id !== FACTUAL_LOCK.id)
    : [...session.locks, FACTUAL_LOCK]
  return touch({ ...session, locks })
}

/** Clear transient previews before committing proposed render. */
export function clearAllPreviews(session: Session): Session {
  const assumptions = session.assumptions.map((a) =>
    a.status === 'previewing' ? { ...a, status: 'pending' as const } : a,
  )
  return touch({ ...session, assumptions })
}

/**
 * Build the handoff brief. Rejected assumptions are listed by id only and
 * never appear in `accepted`.
 */
export function buildBrief(session: Session): ApprovedBrief {
  const accepted = session.assumptions
    .filter((a) => a.status === 'accepted')
    .map((a) => ({
      id: a.id,
      title: a.title,
      target: a.target,
      type: a.type,
      statement: a.statement,
      preserve: a.preserve,
    }))

  const rejectedIds = session.assumptions
    .filter((a) => a.status === 'rejected')
    .map((a) => a.id)

  const preserve = [
    ...new Set([
      ...accepted.map((a) => a.preserve),
      ...session.locks.map((l) => l.label),
    ]),
  ].filter(Boolean)

  return {
    direction: session.direction,
    accepted,
    locks: session.locks,
    rejectedIds,
    preserve,
    generatedAt: new Date().toISOString(),
  }
}

export function briefToMarkdown(brief: ApprovedBrief): string {
  const lines = [
    '# Approved brief',
    '',
    `Generated: ${brief.generatedAt}`,
    '',
    '## Direction',
    brief.direction,
    '',
    '## Accepted',
  ]

  if (brief.accepted.length === 0) {
    lines.push('_None_')
  } else {
    for (const a of brief.accepted) {
      lines.push(
        `- **${a.title}** (\`${a.id}\`, ${a.target}/${a.type}): ${a.statement}`,
      )
      lines.push(`  - Preserve: ${a.preserve}`)
    }
  }

  lines.push('', '## Locks')
  if (brief.locks.length === 0) {
    lines.push('_None_')
  } else {
    for (const lock of brief.locks) {
      lines.push(`- ${lock.label}`)
    }
  }

  lines.push('', '## Rejected (do not implement)')
  lines.push(
    brief.rejectedIds.length
      ? brief.rejectedIds.map((id) => `- \`${id}\``).join('\n')
      : '_None_',
  )

  lines.push('', '## Preserve summary')
  for (const p of brief.preserve) {
    lines.push(`- ${p}`)
  }

  return lines.join('\n')
}

export function focusTarget(session: Session, targetId: TargetId): Session {
  const same =
    session.focus?.kind === 'target' && session.focus.targetId === targetId
  return focus(session, same ? null : { kind: 'target', targetId })
}

export function focusAssumption(
  session: Session,
  assumptionId: string,
): Session {
  const same =
    session.focus?.kind === 'assumption' &&
    session.focus.assumptionId === assumptionId
  return focus(session, same ? null : { kind: 'assumption', assumptionId })
}
