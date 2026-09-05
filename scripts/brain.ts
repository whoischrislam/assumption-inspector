#!/usr/bin/env npx tsx
/**
 * Minimal terminal surface over the assumption brain.
 * Usage: npm run brain -- <list|brief|accept|reject|focus> [id]
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  accept,
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

const [cmd, arg] = process.argv.slice(2)
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
    const brief = buildBrief(session)
    console.log(briefToMarkdown(brief))
    console.log('\n--- JSON ---')
    console.log(JSON.stringify(brief, null, 2))
    break
  }

  case 'accept':
    if (!arg) {
      console.error('Usage: npm run brain -- accept <id>')
      process.exit(1)
    }
    session = accept(session, arg)
    saveSession(session)
    console.log(`Accepted ${arg}`)
    break

  case 'reject':
    if (!arg) {
      console.error('Usage: npm run brain -- reject <id>')
      process.exit(1)
    }
    session = reject(session, arg)
    saveSession(session)
    console.log(`Rejected ${arg}`)
    break

  case 'focus': {
    if (!arg) {
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
      'Commands: list | brief | accept <id> | reject <id> | focus <target>',
    )
    process.exit(1)
}
