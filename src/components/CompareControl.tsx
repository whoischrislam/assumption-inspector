type CompareControlProps = {
  active: boolean
  onHoldStart: () => void
  onHoldEnd: () => void
}

export default function CompareControl({
  active,
  onHoldStart,
  onHoldEnd,
}: CompareControlProps) {
  return (
    <button
      type="button"
      className={active ? 'compare-control is-holding' : 'compare-control'}
      onMouseDown={onHoldStart}
      onMouseUp={onHoldEnd}
      onMouseLeave={onHoldEnd}
      onTouchStart={onHoldStart}
      onTouchEnd={onHoldEnd}
    >
      {active ? 'Showing before…' : 'Hold to compare'}
    </button>
  )
}
