import type { Assumption, Session } from '../types'
import { DEFAULT_DIRECTION } from '../types'

/** Authored demo assumptions — includes deliberate tropical reject beat. */
export const demoAssumptions: Assumption[] = [
  {
    id: 'typography',
    title: 'Editorial breathing room',
    target: 'title',
    type: 'typography',
    confidence: 'high',
    statement:
      "'Community-led' means quieter hierarchy: more negative space, less shouty all-caps weight, type that feels like a program poster.",
    previewLabel: 'Loosen type + spacing',
    preserve: 'Keep the headline words and overall single-hero structure.',
    status: 'pending',
  },
  {
    id: 'event-context',
    title: 'Place + date forward',
    target: 'meta',
    type: 'layout',
    confidence: 'high',
    statement:
      "'Locally grounded' means date and Honolulu should lead visually — metadata as orientation, not fine print.",
    previewLabel: 'Promote date / place',
    preserve: 'Do not change the date range or city text.',
    status: 'pending',
  },
  {
    id: 'cta',
    title: 'Calmer discovery CTA',
    target: 'cta',
    type: 'cta',
    confidence: 'medium',
    statement:
      'The glossy high-saturation button reads like growth marketing; a flatter, smaller control better matches community discovery.',
    previewLabel: 'Quiet the button',
    preserve: 'Keep the label "Explore events" and the action of event discovery.',
    status: 'pending',
  },
  {
    id: 'visual-identity',
    title: 'Island illustration',
    target: 'background',
    type: 'visual-identity',
    confidence: 'low',
    statement:
      "'Local' means add a tropical ocean / palm overlay so the page feels like Hawaiʻi.",
    previewLabel: 'Tropical overlay',
    preserve: 'Factual copy and event discovery stay untouched.',
    status: 'pending',
  },
]

export function createDemoSession(
  overrides: Partial<Session> = {},
): Session {
  return {
    id: 'demo',
    direction: DEFAULT_DIRECTION,
    assumptions: demoAssumptions.map((a) => ({ ...a })),
    locks: [],
    focus: null,
    selectedIds: [],
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}
