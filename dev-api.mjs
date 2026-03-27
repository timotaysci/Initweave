/**
 * Minimal local dev server standing in for the Azure Function.
 * Run with:  node dev-api.mjs
 * Requires ANTHROPIC_API_KEY in the environment or a .env.local file.
 */
import http from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// Load .env.local if present (simple KEY=VALUE parser, no library needed)
const dir = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(dir, '.env.local')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
}

const PORT = 3001
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

function buildSystemPrompt(availableModules) {
  const moduleList = availableModules
    .map((m) => `  - ${m.id}: ${m.label} — ${m.description}`)
    .join('\n')

  return `You are an Emacs configuration assistant for initweave, a tool that generates init.el files.

Your job is to help users build their Emacs configuration by recommending which modules to enable and, when needed, generating custom Elisp configuration for things not covered by the available modules.

Available modules (these can be toggled on in the UI):
${moduleList}

When a user describes what they want, respond with a JSON object — no markdown, no explanation outside the JSON — in exactly this shape:

{
  "explanation": "A warm, friendly 2-3 sentence explanation of what you're recommending and why.",
  "enable_modules": ["id1", "id2"],
  "custom_block": {
    "label": "Short descriptive name",
    "elisp": "(use-package example\\n  :config\\n  ...)"
  }
}

Rules:
- "enable_modules" should list the IDs of any available modules worth enabling for this use case. Include modules that are already enabled if they are relevant (the UI will show them as already enabled).
- "custom_block" should only be present (non-null) if the user needs something genuinely beyond the available modules — write clean, well-commented, production-quality Elisp using use-package.
- If nothing extra is needed beyond available modules, set "custom_block" to null.
- If the question is not about Emacs configuration at all, set "enable_modules" to [] and "custom_block" to null, and use "explanation" to politely redirect.
- Never wrap the JSON in markdown code fences. Return raw JSON only.`
}

async function callAnthropic(question, enabledModules, availableModules) {
  const userMessage =
    enabledModules.length > 0
      ? `Currently enabled modules: ${enabledModules.join(', ')}\n\nRequest: ${question}`
      : question

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: buildSystemPrompt(availableModules),
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Anthropic API error ${res.status}: ${text}`)
  }

  const data = await res.json()
  const raw = (data.content[0]?.text ?? '{}').trim()

  // Strip code fences if the model wrapped the JSON
  const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
  return JSON.parse(cleaned)
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method === 'POST' && req.url === '/api/ask') {
    if (!ANTHROPIC_API_KEY) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set. Add it to .env.local' }))
      return
    }

    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', async () => {
      try {
        const { question, enabled_modules = [], available_modules = [] } = JSON.parse(body)
        if (!question?.trim()) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Missing question' }))
          return
        }

        const result = await callAnthropic(question.trim(), enabled_modules, available_modules)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(result))
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: e.message }))
      }
    })
    return
  }

  res.writeHead(404)
  res.end()
})

server.listen(PORT, () => {
  console.log(`dev-api listening on http://localhost:${PORT}`)
  if (!ANTHROPIC_API_KEY) {
    console.warn('  WARNING: ANTHROPIC_API_KEY is not set — AI Config tab will return errors.')
    console.warn('  Add it to .env.local: ANTHROPIC_API_KEY=sk-ant-...')
  }
})
