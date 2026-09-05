import type { ApprovedBrief } from '../brain'
import { briefToMarkdown } from '../brain'
import { downloadApprovedBrief } from '../data/writeBrief'

type BriefPanelProps = {
  brief: ApprovedBrief
  open: boolean
  onToggle: () => void
  writeStatus: string | null
  onWriteToDisk: () => void
}

export default function BriefPanel({
  brief,
  open,
  onToggle,
  writeStatus,
  onWriteToDisk,
}: BriefPanelProps) {
  const markdown = briefToMarkdown(brief)
  const json = JSON.stringify(brief, null, 2)

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // ignore — demo surface
    }
  }

  return (
    <section className="brief-panel" aria-label="Approved brief">
      <div className="brief-panel__header">
        <button type="button" className="brief-panel__toggle" onClick={onToggle}>
          {open ? 'Hide' : 'Show'} approved brief
        </button>
        <span className="brief-panel__meta">
          {brief.accepted.length} accepted · {brief.rejectedIds.length} rejected ·{' '}
          {brief.locks.length} locks
        </span>
      </div>

      {writeStatus && <p className="brief-panel__status">{writeStatus}</p>}

      {open && (
        <div className="brief-panel__body">
          <div className="brief-panel__actions">
            <button type="button" onClick={() => void copy(markdown)}>
              Copy markdown
            </button>
            <button type="button" onClick={() => void copy(json)}>
              Copy JSON
            </button>
            <button type="button" onClick={onWriteToDisk}>
              Write APPROVED_BRIEF.md
            </button>
            <button type="button" onClick={() => downloadApprovedBrief(brief)}>
              Download
            </button>
          </div>
          <p className="brief-panel__hint">
            Claude / Codex: read <code>APPROVED_BRIEF.md</code> and follow{' '}
            <code>docs/AGENT_SKILL.md</code>.
          </p>
          <pre className="brief-panel__pre">{markdown}</pre>
        </div>
      )}
    </section>
  )
}
