import type { KeyboardEvent, MouseEvent, ReactNode } from 'react'
import type { TargetId } from '../brain'
import { ASSUMPTION_CLASS } from '../brain'

type EventHeroProps = {
  activeIds: string[]
  isProposalMode: boolean
  isComparing: boolean
  highlightTarget: TargetId | null
  onTargetClick: (target: TargetId) => void
}

export default function EventHero({
  activeIds,
  isProposalMode,
  isComparing,
  highlightTarget,
  onTargetClick,
}: EventHeroProps) {
  const classes = ['event-hero']

  if (!isComparing) {
    for (const id of activeIds) {
      const cls = ASSUMPTION_CLASS[id]
      if (cls) classes.push(cls)
    }
  }

  if (isProposalMode && !isComparing) {
    classes.push('event-hero--proposal')
  }

  if (highlightTarget) {
    classes.push(`event-hero--focus-${highlightTarget}`)
  }

  function region(
    target: TargetId,
    className: string,
    children: ReactNode,
    tag: 'p' | 'h1' | 'button' = 'p',
  ) {
    const focused = highlightTarget === target
    const hitClass = [
      className,
      'event-hero__hit',
      focused ? 'event-hero__hit--focused' : '',
    ]
      .filter(Boolean)
      .join(' ')

    const onClick = (e: MouseEvent) => {
      e.stopPropagation()
      onTargetClick(target)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onTargetClick(target)
      }
    }

    if (tag === 'h1') {
      return (
        <h1
          className={hitClass}
          data-target={target}
          onClick={onClick}
          onKeyDown={onKeyDown}
          role="button"
          tabIndex={0}
          aria-pressed={focused}
          title={`Inspect assumptions for ${target}`}
        >
          {children}
        </h1>
      )
    }

    if (tag === 'button') {
      return (
        <button
          type="button"
          className={hitClass}
          data-target={target}
          onClick={onClick}
          aria-pressed={focused}
          title={`Inspect assumptions for ${target}`}
        >
          {children}
        </button>
      )
    }

    return (
      <p
        className={hitClass}
        data-target={target}
        onClick={onClick}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={0}
        aria-pressed={focused}
        title={`Inspect assumptions for ${target}`}
      >
        {children}
      </p>
    )
  }

  return (
    <section
      className={classes.join(' ')}
      aria-label="Event hero"
      onClick={() => onTargetClick('background')}
    >
      <p className="event-hero__disclaimer">
        Speculative concept demo · Not affiliated with Hawaiʻi Tech Week
      </p>

      <div className="event-hero__inner" onClick={(e) => e.stopPropagation()}>
        {region(
          'meta',
          'event-hero__meta',
          'August 31–September 6 · Honolulu',
        )}
        {region('title', 'event-hero__title', 'HAWAIʻI TECH WEEK', 'h1')}
        <p className="event-hero__subhead">Where tech meets Hawaiʻi</p>
        <p className="event-hero__support">
          A week of people building, sharing, learning, and connecting.
        </p>
        {region('cta', 'event-hero__cta', 'Explore events', 'button')}
      </div>

      <div className="event-hero__tropical" aria-hidden="true" />
    </section>
  )
}
