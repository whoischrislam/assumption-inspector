import type { Assumption } from '../brain'
import AssumptionCard from './AssumptionCard'

type XRayOverlayProps = {
  open: boolean
  assumptions: Assumption[]
  allCount: number
  previewCount: number
  sourceLabel: string
  focusLabel: string | null
  selectedIds: string[]
  dimmedIds: Set<string>
  zoomedId: string | null
  onPreview: (id: string) => void
  onAccept: (id: string) => void
  onReject: (id: string) => void
  onClearPreview: (id: string) => void
  onToggleSelect: (id: string) => void
  onZoom: (id: string) => void
  onClearFocus: () => void
  onBatchAccept: () => void
  onBatchReject: () => void
  onSelectAllOpen: () => void
  onClearSelection: () => void
}

export default function XRayOverlay({
  open,
  assumptions,
  allCount,
  previewCount,
  sourceLabel,
  focusLabel,
  selectedIds,
  dimmedIds,
  zoomedId,
  onPreview,
  onAccept,
  onReject,
  onClearPreview,
  onToggleSelect,
  onZoom,
  onClearFocus,
  onBatchAccept,
  onBatchReject,
  onSelectAllOpen,
  onClearSelection,
}: XRayOverlayProps) {
  if (!open) return null

  const selectedCount = selectedIds.length

  return (
    <div className="xray" aria-label="X-Ray View">
      <div className="xray__banner">
        <div>
          <p className="xray__eyebrow">X-RAY VIEW</p>
          <p className="xray__headline">What the agent thinks you mean</p>
        </div>
        <p className="xray__source">{sourceLabel}</p>
      </div>

      {focusLabel && (
        <div className="xray__focus-bar">
          <span>
            Focus · <strong>{focusLabel}</strong>
            {assumptions.length !== allCount
              ? ` (${assumptions.length} of ${allCount})`
              : ''}
          </span>
          <button type="button" onClick={onClearFocus}>
            Clear focus
          </button>
        </div>
      )}

      {previewCount > 0 && (
        <div className="xray__previewing" role="status">
          <strong>PREVIEWING</strong>
          <span>
            {previewCount} proposed interpretation
            {previewCount === 1 ? '' : 's'}
          </span>
          <span className="xray__promise">No code has changed</span>
        </div>
      )}

      <div className="xray__batch">
        <button type="button" onClick={onSelectAllOpen}>
          Select open
        </button>
        <button
          type="button"
          onClick={onClearSelection}
          disabled={selectedCount === 0}
        >
          Clear selection
        </button>
        <button
          type="button"
          className="xray__batch-accept"
          onClick={onBatchAccept}
          disabled={selectedCount === 0}
        >
          Accept selected ({selectedCount})
        </button>
        <button
          type="button"
          className="xray__batch-reject"
          onClick={onBatchReject}
          disabled={selectedCount === 0}
        >
          Reject selected
        </button>
      </div>

      <div className="xray__cards">
        {assumptions.map((a) => (
          <AssumptionCard
            key={a.id}
            assumption={a}
            selected={selectedIds.includes(a.id)}
            dimmed={dimmedIds.has(a.id)}
            zoomed={zoomedId === a.id}
            onPreview={onPreview}
            onAccept={onAccept}
            onReject={onReject}
            onClearPreview={onClearPreview}
            onToggleSelect={onToggleSelect}
            onZoom={onZoom}
          />
        ))}
      </div>

      {assumptions.length === 0 && (
        <p className="xray__empty">
          No assumptions for this target. Clear focus to see all.
        </p>
      )}
    </div>
  )
}
