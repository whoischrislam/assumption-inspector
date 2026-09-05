import type { ApprovedBrief } from '../brain'
import { briefToMarkdown } from '../brain'

type BriefPanelProps = {
  brief: ApprovedBrief
  open: boolean
  onToggle: () => void
}

export default function BriefPanel({ brief, open, onToggle }: BriefPanelProps) {
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

      {open && (
        <div className="brief-panel__body">
          <div className="brief-panel__actions">
            <button type="button" onClick={() => void copy(markdown)}>
              Copy markdown
            </button>
            <button type="button" onClick={() => void copy(json)}>
              Copy JSON
            </button>
          </div>
          <pre className="brief-panel__pre">{markdown}</pre>
        </div>
      )}
    </section>
  )
}
