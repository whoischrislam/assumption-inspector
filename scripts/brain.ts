#!/usr/bin/env npx tsx
/**
 * Minimal terminal surface over the assumption brain.
 * Usage: npm run brain -- <list|brief|accept|reject|focus> [id]
 *        npm run brain -- brief --write
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  accept,
  APPROVED_BRIEF_FILENAME,
  briefToMarkdown,
  buildBrief,
  createDemoSession,
  focusTarget,
  reject,
  type Session,
  type TargetId,
} from '../src/brain/index.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sessionPath = resolve(root, 'session.json')

function loadSession(): Session {
  if (!existsSync(sessionPath)) {
    const s = createDemoSession()
    saveSession(s)
    return s
  }
  return JSON.parse(readFileSync(sessionPath, 'utf8')) as Session
}

function saveSession(session: Session) {
  writeFileSync(sessionPath, JSON.stringify(session, null, 2) + '\n')
}

function writeBriefFiles(session: Session) {
  const brief = buildBrief(session)
  const mdPath = resolve(root, APPROVED_BRIEF_FILENAME)
  const jsonPath = resolve(root, 'APPROVED_BRIEF.json')
  writeFileSync(mdPath, briefToMarkdown(brief), 'utf8')
  writeFileSync(jsonPath, JSON.stringify(brief, null, 2) + '\n', 'utf8')
  return { mdPath, jsonPath, brief }
}

const argv = process.argv.slice(2)
const [cmd, arg] = argv
const writeFlag = argv.includes('--write')
let session = loadSession()

switch (cmd) {
  case 'list':
  case undefined:
    for (const a of session.assumptions) {
      console.log(
        `[${a.status.padEnd(10)}] ${a.id} → ${a.target}: ${a.title}`,
      )
    }
    if (session.focus) {
      console.log('\nFocus:', JSON.stringify(session.focus))
    }
    break

  case 'brief': {
    const { brief, mdPath } = writeFlag
      ? writeBriefFiles(session)
      : { brief: buildBrief(session), mdPath: null }
    console.log(briefToMarkdown(brief))
    if (writeFlag && mdPath) {
      console.log(`\nWrote ${mdPath}`)
      console.log('Wrote APPROVED_BRIEF.json')
    } else {
      console.log('\n--- JSON ---')
      console.log(JSON.stringify(brief, null, 2))
      console.log('\nTip: npm run brain -- brief --write')
    }
    break
  }

  case 'accept':
    if (!arg || arg === '--write') {
      console.error('Usage: npm run brain -- accept <id>')
      process.exit(1)
    }
    session = accept(session, arg)
    saveSession(session)
    console.log(`Accepted ${arg}`)
    break

  case 'reject':
    if (!arg || arg === '--write') {
      console.error('Usage: npm run brain -- reject <id>')
      process.exit(1)
    }
    session = reject(session, arg)
    saveSession(session)
    console.log(`Rejected ${arg}`)
    break

  case 'focus': {
    if (!arg || arg === '--write') {
      console.error(
        'Usage: npm run brain -- focus <title|meta|cta|background>',
      )
      process.exit(1)
    }
    session = focusTarget(session, arg as TargetId)
    saveSession(session)
    console.log('Focus:', JSON.stringify(session.focus))
    break
  }

  default:
    console.error(`Unknown command: ${cmd}`)
    console.error(
      'Commands: list | brief [--write] | accept <id> | reject <id> | focus <target>',
    )
    process.exit(1)
}
