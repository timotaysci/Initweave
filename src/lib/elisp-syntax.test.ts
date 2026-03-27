import { describe, it, expect } from 'vitest'
import { execFileSync } from 'child_process'
import { writeFileSync, unlinkSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { modules } from '../modules'

/**
 * Runs Emacs in batch mode to validate elisp syntax.
 * Checks both parenthesis balance (check-parens) and read syntax (read loop).
 */
function checkElispSyntax(elisp: string): { ok: boolean; error?: string } {
  const tmpFile = join(tmpdir(), `initweave-${Date.now()}.el`)
  writeFileSync(tmpFile, elisp, 'utf8')

  // Use --load to evaluate a script that reads all forms from the temp file.
  // In --batch mode, any unhandled error causes exit code 1.
  const evalScript = [
    '(condition-case err',
    `  (with-temp-buffer`,
    `    (insert-file-contents "${tmpFile}")`,
    `    (check-parens)`,
    `    (goto-char (point-min))`,
    `    (condition-case _eof`,
    `      (while t (read (current-buffer)))`,
    `      (end-of-file nil))`,
    `    (message "OK"))`,
    '  (error (message "Error: %s" (error-message-string err)) (kill-emacs 1)))',
  ].join(' ')

  try {
    execFileSync('emacs', ['--batch', '--eval', evalScript], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    return { ok: true }
  } catch (e: unknown) {
    const err = e as { stderr?: string; message?: string }
    return { ok: false, error: (err.stderr ?? err.message ?? 'unknown error').trim() }
  } finally {
    try { unlinkSync(tmpFile) } catch { /* ignore */ }
  }
}

describe('elisp syntax validation', () => {
  for (const mod of modules) {
    it(`${mod.id}: ${mod.label}`, () => {
      const result = checkElispSyntax(mod.elisp)
      expect(result.ok, result.error).toBe(true)
    })
  }
})
