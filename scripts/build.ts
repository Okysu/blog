import { execSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import consola from 'consola'
import { startAISummary } from '../autoSummary'
import { materializeFluxPages } from '../fluxmarkCompiler'

const root = process.cwd()

await startAISummary(path.join(root, 'pages/posts'))

// Clear any previously cached loader pages so Valaxy reads directly from materialized pages/*.md.
await fs.rm(path.join(root, '.valaxy/content'), { recursive: true, force: true })

const { generated, cleanup } = await materializeFluxPages(path.join(root, 'pages'), {
  strict: true,
})
consola.info(`[fluxmark] Materialized ${generated.length} Markdown files for build`)

try {
  const env = {
    ...process.env,
    FLUXMARK_MATERIALIZED: '1',
    SKIP_AI_SUMMARY: '1',
  }
  execSync('pnpm build:ssg && pnpm rss', { cwd: root, env, stdio: 'inherit' })
}
finally {
  await cleanup()
  consola.info(`[fluxmark] Cleaned up ${generated.length} generated Markdown files`)
}
