import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

function buildSystemPrompt(
  availableModules: { id: string; label: string; description: string }[]
): string {
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

async function askHandler(
  request: HttpRequest,
  _context: InvocationContext
): Promise<HttpResponseInit> {
  if (request.method !== 'POST') {
    return { status: 405, body: 'Method Not Allowed' }
  }

  let question: string
  let enabledModules: string[] = []
  let availableModules: { id: string; label: string; description: string }[] = []

  try {
    const body = (await request.json()) as {
      question?: unknown
      enabled_modules?: unknown
      available_modules?: unknown
    }

    if (typeof body.question !== 'string' || !body.question.trim()) {
      return { status: 400, body: 'Missing or invalid "question" field.' }
    }
    question = body.question.trim()

    if (Array.isArray(body.enabled_modules)) {
      enabledModules = body.enabled_modules.filter((x): x is string => typeof x === 'string')
    }
    if (Array.isArray(body.available_modules)) {
      availableModules = body.available_modules.filter(
        (x): x is { id: string; label: string; description: string } =>
          typeof x === 'object' &&
          x !== null &&
          typeof (x as Record<string, unknown>).id === 'string'
      )
    }
  } catch {
    return { status: 400, body: 'Invalid JSON body.' }
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return { status: 500, body: 'API key not configured.' }
  }

  const userMessage =
    enabledModules.length > 0
      ? `Currently enabled modules: ${enabledModules.join(', ')}\n\nRequest: ${question}`
      : question

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: buildSystemPrompt(availableModules),
    messages: [{ role: 'user', content: userMessage }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : '{}'

  // Parse and re-serialize to validate it's well-formed JSON
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    // If the model wrapped in a code fence, strip it and retry
    const stripped = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    try {
      parsed = JSON.parse(stripped)
    } catch {
      return { status: 500, body: 'Model returned malformed JSON.' }
    }
  }

  return {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed),
  }
}

app.http('ask', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'ask',
  handler: askHandler,
})
