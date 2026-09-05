import { demoAssumptions, type Assumption } from '../brain'

export type LoadSource = 'live' | 'fixture'

export type LoadAssumptionsResult = {
  assumptions: Assumption[]
  source: LoadSource
  error?: string
}

export type InterpretStatus = {
  configured: boolean
  provider: string | null
  model: string | null
}

const REQUIRED_IDS = [
  'typography',
  'event-context',
  'cta',
  'visual-identity',
] as const

function resetStatuses(list: Assumption[]): Assumption[] {
  return list.map((a) => ({ ...a, status: 'pending' as const }))
}

function normalizeLive(raw: unknown): Assumption[] | null {
  if (!Array.isArray(raw) || raw.length !== 4) return null

  const byId = new Map<string, Assumption>()
  for (const item of raw) {
    if (!item || typeof item !== 'object') return null
    const row = item as Record<string, unknown>
    const id = String(row.id ?? '')
    if (!REQUIRED_IDS.includes(id as (typeof REQUIRED_IDS)[number])) return null

    const confidence = row.confidence
    if (confidence !== 'high' && confidence !== 'medium' && confidence !== 'low') {
      return null
    }

    const type = row.type
    if (
      type !== 'typography' &&
      type !== 'layout' &&
      type !== 'cta' &&
      type !== 'visual-identity'
    ) {
      return null
    }

    const target = row.target
    if (
      target !== 'hero' &&
      target !== 'title' &&
      target !== 'meta' &&
      target !== 'cta' &&
      target !== 'background'
    ) {
      return null
    }

    byId.set(id, {
      id,
      title: String(row.title ?? id),
      target,
      type,
      confidence,
      statement: String(row.statement ?? ''),
      previewLabel: String(row.previewLabel ?? 'Preview'),
      preserve: String(row.preserve ?? ''),
      status: 'pending',
    })
  }

  if (byId.size !== 4) return null
  return REQUIRED_IDS.map((id) => byId.get(id)!)
}

export async function fetchInterpretStatus(): Promise<InterpretStatus> {
  try {
    const res = await fetch('/api/interpret/status')
    if (!res.ok) return { configured: false, provider: null, model: null }
    return (await res.json()) as InterpretStatus
  } catch {
    return { configured: false, provider: null, model: null }
  }
}

/**
 * Proposer adapter only — returns Assumption[] for brain.propose().
 * Live interpret via Vite `/api/interpret`, else authored fixture.
 */
export async function loadAssumptions(
  direction: string,
): Promise<LoadAssumptionsResult> {
  try {
    const res = await fetch('/api/interpret', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direction }),
    })

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as {
        message?: string
        error?: string
      } | null
      return {
        assumptions: resetStatuses(demoAssumptions),
        source: 'fixture',
        error: body?.message ?? body?.error ?? `Interpret failed (${res.status})`,
      }
    }

    const data = (await res.json()) as { assumptions?: unknown }
    const normalized = normalizeLive(data.assumptions)
    if (!normalized) {
      return {
        assumptions: resetStatuses(demoAssumptions),
        source: 'fixture',
        error: 'Model returned an unexpected shape — showing fixture instead.',
      }
    }

    return { assumptions: normalized, source: 'live' }
  } catch {
    return {
      assumptions: resetStatuses(demoAssumptions),
      source: 'fixture',
      error: 'Live interpret unreachable — showing fixture instead.',
    }
  }
}
