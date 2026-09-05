export type {
  Assumption,
  AssumptionStatus,
  AssumptionType,
  ApprovedBrief,
  Confidence,
  Session,
  SessionFocus,
  SessionLock,
  TargetId,
} from './types'

export {
  ASSUMPTION_CLASS,
  DEFAULT_DIRECTION,
  FACTUAL_LOCK,
} from './types'

export {
  accept,
  batchAccept,
  batchReject,
  APPROVED_BRIEF_FILENAME,
  briefToMarkdown,
  buildBrief,
  clearAllPreviews,
  clearFocus,
  clearPreview,
  clearSelection,
  focus,
  focusAssumption,
  focusTarget,
  preview,
  propose,
  reject,
  selectAllOpen,
  setDirection,
  toggleFactualLock,
  toggleSelected,
} from './verbs'

export {
  activeAssumptionIds,
  byTarget,
  cssClassesForActiveIds,
  focusedAssumptionId,
  focusedTargetId,
  hasFactualLock,
  highlightTargetId,
  isAssumptionDimmed,
  previewCount,
  targetForAssumption,
  visibleAssumptions,
} from './selectors'

export { createDemoSession, demoAssumptions } from './fixtures/demoSession'
