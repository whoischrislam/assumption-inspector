import type { ApprovedBrief } from '../brain'
import { briefToMarkdown } from '../brain'

export type BriefWriteResult =
  | { ok: true; path: string }
  | { ok: false; error: string; downloaded?: boolean }

/** Persist brief via Vite dev middleware (writes repo-root APPROVED_BRIEF.md). */
export async function writeApprovedBrief(
  brief: ApprovedBrief,
): Promise<BriefWriteResult> {
  const markdown = briefToMarkdown(brief)
  try {
    const res = await fetch('/api/brief/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        markdown,
        json: brief,
      }),
    })
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as {
        message?: string
      } | null
      return {
        ok: false,
        error: body?.message ?? `Write failed (${res.status})`,
      }
    }
    const data = (await res.json()) as { path?: string }
    return { ok: true, path: data.path ?? 'APPROVED_BRIEF.md' }
  } catch {
    return {
      ok: false,
      error: 'Live write unavailable — use Download or CLI.',
    }
  }
}

export function downloadApprovedBrief(brief: ApprovedBrief) {
  const markdown = briefToMarkdown(brief)
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'APPROVED_BRIEF.md'
  a.click()
  URL.revokeObjectURL(url)
}
