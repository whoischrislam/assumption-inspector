import type { ReactNode } from 'react'
import type { Assumption } from '../brain'

type StagingTrayProps = {
  assumptions: Assumption[]
  locked: boolean
  isProposalMode: boolean
  onBuild: () => void
  onToggleLock: () => void
  compareSlot: ReactNode
}

export default function StagingTray({
  assumptions,
  locked,
  isProposalMode,
  onBuild,
  onToggleLock,
  compareSlot,
}: StagingTrayProps) {
  const accepted = assumptions.filter((a) => a.status === 'accepted')
  const rejected = assumptions.filter((a) => a.status === 'rejected')
  const pending = assumptions.filter(
    (a) => a.status === 'pending' || a.status === 'previewing',
  )

  const canBuild = accepted.length > 0

  return (
    <aside className="staging-tray" aria-label="Staging tray">
      <div className="staging-tray__summary">
        <div>
          <p className="staging-tray__label">Accepted</p>
          <p>{accepted.map((a) => a.title).join(' · ') || '—'}</p>
        </div>
        <div>
          <p className="staging-tray__label">Rejected</p>
          <p>{rejected.map((a) => a.title).join(' · ') || '—'}</p>
        </div>
        <div>
          <p className="staging-tray__label">Open</p>
          <p>{pending.map((a) => a.title).join(' · ') || '—'}</p>
        </div>
      </div>

      <div className="staging-tray__actions">
        <button
          type="button"
          className={locked ? 'lock-chip is-on' : 'lock-chip'}
          onClick={onToggleLock}
        >
          {locked
            ? 'LOCKED — Do not change factual information or event discovery'
            : 'Lock factual / event-discovery content'}
        </button>

        <button
          type="button"
          className="staging-tray__build"
          onClick={onBuild}
          disabled={!canBuild}
        >
          {isProposalMode ? 'Proposed direction active' : 'Build approved direction'}
        </button>

        {isProposalMode && compareSlot}
      </div>

      {isProposalMode && (
        <p className="staging-tray__proposal-label">
          PROPOSED DIRECTION / Human-approved interpretation
        </p>
      )}
    </aside>
  )
}
