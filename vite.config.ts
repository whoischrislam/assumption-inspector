import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const SYSTEM_PROMPT = `You are Art Director for Assumption Inspector.
Return ONLY valid JSON (no markdown) with shape:
{"assumptions":[...exactly 4 objects...]}

Each object:
{
  "id": one of "typography" | "event-context" | "cta" | "visual-identity",
  "title": short label,
  "target": one of "hero" | "title" | "meta" | "cta" | "background",
  "type": one of "typography" | "layout" | "cta" | "visual-identity",
  "confidence": one of "high" | "medium" | "low",
  "statement": what you think the human means (one or two sentences),
  "previewLabel": short button label for preview,
  "preserve": what must not change
}

Rules:
- Use each id exactly once.
- visual-identity MUST be a low-confidence tropical/ocean/palm cliché reading of "local" — deliberately wrong so a human can reject it.
- Do not invent speakers, venues, prices, sponsors, or schedule items.
- Do not claim affiliation with Hawaiʻi Tech Week.
- Prefer local, reversible visual changes.`

const USER_TEMPLATE = (direction: string) => `Analyze this fictional event-page hero (described, not attached):

- Full-bleed blue/purple gradient background.
- Oversized all-caps headline: "HAWAIʻI TECH WEEK".
- Subhead: "Where tech meets Hawaiʻi" then "A week of people building, sharing, learning, and connecting."
- Small low-contrast date/place: "August 31–September 6 · Honolulu".
- Glossy high-saturation primary button: "Explore events".
- Centered, tight spacing, geometric sans — competent but generic SaaS event polish.

Direction from the human:
"""
${direction}
"""

Return the JSON object only.`

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function interpretApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'assumption-interpret-api',
    configureServer(server) {
      const root = server.config.root

      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''

        if (url === '/api/interpret/status' && req.method === 'GET') {
          const configured = Boolean(env.LLM_API_KEY)
          sendJson(res, 200, {
            configured,
            provider: configured
              ? (env.LLM_BASE_URL || 'https://api.openai.com/v1').includes('x.ai')
                ? 'xai'
                : 'openai-compatible'
              : null,
            model: configured ? env.LLM_MODEL || 'gpt-4o-mini' : null,
          })
          return
        }

        if (url === '/api/brief/write' && req.method === 'POST') {
          try {
            const raw = await readBody(req)
            const body = JSON.parse(raw) as {
              markdown?: string
              json?: unknown
            }
            if (!body.markdown?.trim()) {
              sendJson(res, 400, { message: 'markdown is required' })
              return
            }
            const mdPath = resolve(root, 'APPROVED_BRIEF.md')
            const jsonPath = resolve(root, 'APPROVED_BRIEF.json')
            writeFileSync(mdPath, body.markdown, 'utf8')
            if (body.json !== undefined) {
              writeFileSync(
                jsonPath,
                JSON.stringify(body.json, null, 2) + '\n',
                'utf8',
              )
            }
            sendJson(res, 200, { path: 'APPROVED_BRIEF.md', jsonPath: 'APPROVED_BRIEF.json' })
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Write failed'
            sendJson(res, 500, { message })
          }
          return
        }

        if (url !== '/api/interpret' || req.method !== 'POST') {
          next()
          return
        }

        const apiKey = env.LLM_API_KEY
        if (!apiKey) {
          sendJson(res, 503, {
            error: 'missing_api_key',
            message:
              'No LLM_API_KEY in .env — live interpret unavailable.',
          })
          return
        }

        try {
          const raw = await readBody(req)
          const { direction } = JSON.parse(raw) as { direction?: string }
          if (!direction?.trim()) {
            sendJson(res, 400, { error: 'direction is required' })
            return
          }

          const base = (env.LLM_BASE_URL || 'https://api.openai.com/v1').replace(
            /\/$/,
            '',
          )
          const model = env.LLM_MODEL || 'gpt-4o-mini'

          const upstream = await fetch(`${base}/chat/completions`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model,
              temperature: 0.4,
              response_format: { type: 'json_object' },
              messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: USER_TEMPLATE(direction.trim()) },
              ],
            }),
          })

          if (!upstream.ok) {
            const text = await upstream.text()
            sendJson(res, 502, {
              error: 'upstream_error',
              message: `Upstream ${upstream.status}: ${text.slice(0, 240)}`,
            })
            return
          }

          const completion = (await upstream.json()) as {
            choices?: { message?: { content?: string } }[]
          }
          const content = completion.choices?.[0]?.message?.content
          if (!content) {
            sendJson(res, 502, {
              error: 'empty_response',
              message: 'Empty model response',
            })
            return
          }

          const parsed = JSON.parse(content) as { assumptions?: unknown }
          sendJson(res, 200, { assumptions: parsed.assumptions })
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Interpret error'
          sendJson(res, 500, { error: 'interpret_error', message })
        }
      })
    },
  }
}

// Base path is '/assumption-inspector/' for the GitHub Pages backup deploy,
// and '/' for local dev. See .github/workflows/deploy.yml.
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), interpretApiPlugin(env)],
    base: command === 'build' ? '/assumption-inspector/' : '/',
  }
})
