import { useEffect, useRef, useState } from 'react'
import {
  accept,
  activeAssumptionIds,
  batchAccept,
  batchReject,
  buildBrief,
  clearAllPreviews,
  clearFocus,
  clearPreview,
  clearSelection,
  createDemoSession,
  focusAssumption,
  focusTarget,
  hasFactualLock,
  highlightTargetId,
  isAssumptionDimmed,
  preview,
  previewCount,
  propose,
  reject,
  selectAllOpen,
  setDirection,
  toggleFactualLock,
  toggleSelected,
  visibleAssumptions,
  type Session,
  type TargetId,
} from './brain'
import {
  fetchInterpretStatus,
  loadAssumptions,
  type InterpretStatus,
  type LoadSource,
} from './data/loadAssumptions'
import EventHero from './components/EventHero'
import XRayOverlay from './components/XRayOverlay'
import StagingTray from './components/StagingTray'
import CompareControl from './components/CompareControl'
import BriefPanel from './components/BriefPanel'

const INTERPRET_PHASES = [
  'Reading the hero…',
  'Separating observations from inferences…',
  'Drafting four reviewable assumptions…',
  'Pinning them to targets…',
]

function getFocusLabel(session: Session): string | null {
  if (!session.focus) return null
  if (session.focus.kind === 'target') {
    return `target · ${session.focus.targetId}`
  }
  const assumptionId = session.focus.assumptionId
  const a = session.assumptions.find((x) => x.id === assumptionId)
  return a ? `assumption · ${a.title}` : 'assumption'
}

export default function App() {
  const [session, setSession] = useState<Session>(() => createDemoSession())
  const [xRayOpen, setXRayOpen] = useState(false)
  const [isProposalMode, setIsProposalMode] = useState(false)
  const [isComparing, setIsComparing] = useState(false)
  const [briefOpen, setBriefOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState<string | null>(null)
  const [source, setSource] = useState<LoadSource | null>(null)
  const [statusNote, setStatusNote] = useState<string | null>(null)
  const [apiStatus, setApiStatus] = useState<InterpretStatus | null>(null)
  const xrayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    void fetchInterpretStatus().then(setApiStatus)
  }, [])

  const liveReady = apiStatus?.configured === true
  const activeIds = activeAssumptionIds(session)
  const previews = previewCount(session)
  const visible = visibleAssumptions(session)
  const dimmedIds = new Set(
    session.assumptions
      .filter((a) => isAssumptionDimmed(session, a.id))
      .map((a) => a.id),
  )
  const zoomedId =
    session.focus?.kind === 'assumption' ? session.focus.assumptionId : null
  const highlightTarget = highlightTargetId(session)
  const locked = hasFactualLock(session)
  const brief = buildBrief(session)

  async function handleShowMeaning() {
    setLoading(true)
    setStatusNote(null)
    setIsProposalMode(false)
    setIsComparing(false)
    setXRayOpen(false)
    setBriefOpen(false)

    let phaseIndex = 0
    setPhase(INTERPRET_PHASES[0])
    const tick = window.setInterval(() => {
      phaseIndex = Math.min(phaseIndex + 1, INTERPRET_PHASES.length - 1)
      setPhase(INTERPRET_PHASES[phaseIndex])
    }, 700)

    const direction = session.direction
    const result = await loadAssumptions(direction)
    window.clearInterval(tick)
    setPhase(null)

    setSession((s) => propose({ ...s, direction }, result.assumptions))
    setSource(result.source)
    setXRayOpen(true)
    setLoading(false)

    if (result.source === 'live') {
      setStatusNote(
        apiStatus?.model
          ? `Live interpretation · ${apiStatus.model}`
          : 'Live interpretation',
      )
    } else {
      setStatusNote(
        liveReady
          ? `Couldn’t use live model — ${result.error ?? 'fallback'}. Showing fixture.`
          : 'Demo mode (fixture). Brain review loop works offline.',
      )
    }

    requestAnimationFrame(() => {
      xrayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const sourceLabel =
    source === 'live'
      ? `Source: live model${apiStatus?.model ? ` (${apiStatus.model})` : ''}`
      : source === 'fixture'
        ? 'Source: fixture (proposer adapter)'
        : ''

  function onTargetClick(target: TargetId) {
    setSession((s) => focusTarget(s, target))
    if (!xRayOpen) setXRayOpen(true)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-header__product">Assumption Inspector</p>
          <p className="app-header__tag">
            Inspect what an agent thinks you mean before code changes
          </p>
        </div>
        {locked && (
          <span className="app-header__lock-badge">
            LOCKED / Do not change factual information or event discovery
          </span>
        )}
      </header>

      {!liveReady && apiStatus !== null && (
        <div className="setup-banner" role="status">
          <div>
            <p className="setup-banner__title">Optional live proposer</p>
            <p className="setup-banner__body">
              The review brain works offline on a fixture. Add an API key only if
              you want the direction button to call a live model.
            </p>
            <ol className="setup-banner__steps">
              <li>
                <code>cp .env.example .env</code> → set <code>LLM_API_KEY</code>
              </li>
              <li>
                xAI: <code>LLM_BASE_URL=https://api.x.ai/v1</code> ·{' '}
                <code>LLM_MODEL=grok-4.6</code>
              </li>
              <li>
                Restart <code>npm run dev</code>
              </li>
            </ol>
          </div>
          <p className="setup-banner__note">
            Terminal surface: <code>npm run brain -- list</code> ·{' '}
            <code>npm run brain -- brief</code>
          </p>
        </div>
      )}

      {liveReady && (
        <p className="live-ready" role="status">
          Live interpret ready
          {apiStatus?.model ? ` · ${apiStatus.model}` : ''}
          {apiStatus?.provider ? ` · ${apiStatus.provider}` : ''}
        </p>
      )}

      <div className="direction-bar">
        <label className="direction-bar__label" htmlFor="direction">
          Direction
        </label>
        <textarea
          id="direction"
          rows={2}
          value={session.direction}
          onChange={(e) =>
            setSession((s) => setDirection(s, e.target.value))
          }
          disabled={loading}
        />
        <button
          type="button"
          className="direction-bar__submit"
          onClick={handleShowMeaning}
          disabled={loading || !session.direction.trim()}
        >
          {loading ? 'Interpreting…' : 'Show me what you think I mean'}
        </button>
        {phase && (
          <p className="direction-bar__phase" aria-live="polite">
            {phase}
          </p>
        )}
        {statusNote && !loading && (
          <p className="direction-bar__note">{statusNote}</p>
        )}
        <p className="direction-bar__hint">
          Tip: click title, date, CTA, or background on the hero to focus that
          target.
        </p>
      </div>

      <div className="stage">
        <EventHero
          activeIds={activeIds}
          isProposalMode={isProposalMode}
          isComparing={isComparing}
          highlightTarget={highlightTarget}
          onTargetClick={onTargetClick}
        />
        <div ref={xrayRef}>
          <XRayOverlay
            open={xRayOpen}
            assumptions={visible}
            allCount={session.assumptions.length}
            previewCount={previews}
            sourceLabel={sourceLabel}
            focusLabel={getFocusLabel(session)}
            selectedIds={session.selectedIds}
            dimmedIds={dimmedIds}
            zoomedId={zoomedId}
            onPreview={(id) => setSession((s) => preview(s, id))}
            onClearPreview={(id) => setSession((s) => clearPreview(s, id))}
            onAccept={(id) => setSession((s) => accept(s, id))}
            onReject={(id) => setSession((s) => reject(s, id))}
            onToggleSelect={(id) => setSession((s) => toggleSelected(s, id))}
            onZoom={(id) => setSession((s) => focusAssumption(s, id))}
            onClearFocus={() => setSession((s) => clearFocus(s))}
            onBatchAccept={() =>
              setSession((s) => batchAccept(s, s.selectedIds))
            }
            onBatchReject={() =>
              setSession((s) => batchReject(s, s.selectedIds))
            }
            onSelectAllOpen={() => setSession((s) => selectAllOpen(s))}
            onClearSelection={() => setSession((s) => clearSelection(s))}
          />
        </div>

        {xRayOpen && (
          <BriefPanel
            brief={brief}
            open={briefOpen}
            onToggle={() => setBriefOpen((v) => !v)}
          />
        )}
      </div>

      {xRayOpen && (
        <StagingTray
          assumptions={session.assumptions}
          locked={locked}
          isProposalMode={isProposalMode}
          onToggleLock={() => setSession((s) => toggleFactualLock(s))}
          onBuild={() => {
            setSession((s) => clearAllPreviews(s))
            setIsProposalMode(true)
            setBriefOpen(true)
          }}
          compareSlot={
            <CompareControl
              active={isComparing}
              onHoldStart={() => setIsComparing(true)}
              onHoldEnd={() => setIsComparing(false)}
            />
          }
        />
      )}
    </div>
  )
}
