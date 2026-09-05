import type { Assumption } from '../brain'

type AssumptionCardProps = {
  assumption: Assumption
  selected: boolean
  dimmed: boolean
  zoomed: boolean
  onPreview: (id: string) => void
  onAccept: (id: string) => void
  onReject: (id: string) => void
  onClearPreview: (id: string) => void
  onToggleSelect: (id: string) => void
  onZoom: (id: string) => void
}

export default function AssumptionCard({
  assumption,
  selected,
  dimmed,
  zoomed,
  onPreview,
  onAccept,
  onReject,
  onClearPreview,
  onToggleSelect,
  onZoom,
}: AssumptionCardProps) {
  const { id, title, confidence, statement, previewLabel, preserve, status, type } =
    assumption

  const isPreviewing = status === 'previewing'
  const isAccepted = status === 'accepted'
  const isRejected = status === 'rejected'
  const isLocked = status === 'locked'

  return (
    <article
      className={[
        'assumption-card',
        `assumption-card--${confidence}`,
        `assumption-card--${status}`,
        `assumption-card--target-${assumption.target}`,
        selected ? 'assumption-card--selected' : '',
        dimmed ? 'assumption-card--dimmed' : '',
        zoomed ? 'assumption-card--zoomed' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-type={type}
    >
      <header className="assumption-card__header">
        <div className="assumption-card__top">
          <label className="assumption-card__select">
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggleSelect(id)}
              disabled={isRejected}
              aria-label={`Select ${title}`}
            />
          </label>
          <span className="assumption-card__confidence">{confidence}</span>
          <button
            type="button"
            className="assumption-card__zoom"
            onClick={() => onZoom(id)}
          >
            {zoomed ? 'Exit zoom' : 'Zoom'}
          </button>
        </div>
        <h3 className="assumption-card__title">{title}</h3>
        <p className="assumption-card__target">Target · {assumption.target}</p>
      </header>

      <p className="assumption-card__statement">{statement}</p>
      <p className="assumption-card__preserve">
        <span>Preserve</span> {preserve}
      </p>

      <div className="assumption-card__actions">
        {!isRejected && !isLocked && (
          <>
            <button
              type="button"
              className={isPreviewing ? 'is-active' : ''}
              onClick={() => (isPreviewing ? onClearPreview(id) : onPreview(id))}
            >
              {isPreviewing ? 'Stop preview' : previewLabel}
            </button>
            <button
              type="button"
              className={isAccepted ? 'is-accepted' : ''}
              onClick={() => onAccept(id)}
              disabled={isAccepted}
            >
              {isAccepted ? 'Accepted' : 'Accept'}
            </button>
            <button
              type="button"
              className="assumption-card__reject"
              onClick={() => onReject(id)}
            >
              Reject
            </button>
          </>
        )}
        {isRejected && (
          <span className="assumption-card__stamp stamp-reject">Rejected</span>
        )}
        {isAccepted && (
          <span className="assumption-card__stamp stamp-accept">Accepted</span>
        )}
        {isLocked && (
          <span className="assumption-card__stamp stamp-lock">Locked</span>
        )}
      </div>
    </article>
  )
}
