import assert from 'node:assert/strict'
import { execSync } from 'node:child_process'
import { copyFile, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const workspace = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { version } = JSON.parse(await readFile(join(workspace, 'theme/package.json'), 'utf8'))
const archive = join(workspace, `artifacts/valaxy-theme-editorial-${version}.tgz`)
const consumer = await mkdtemp(join(tmpdir(), 'editorial-consumer-'))
console.log('Independent consumer:', consumer)
await copyFile(archive, join(consumer, 'theme.tgz'))
async function put(file, content) {
  await mkdir(dirname(join(consumer, file)), { recursive: true })
  await writeFile(join(consumer, file), content)
}
function run(command) {
  execSync(command, { cwd: consumer, stdio: 'inherit', env: { ...process.env, SKIP_AI_SUMMARY: '1' } })
}
await put('package.json', JSON.stringify({
  name: 'editorial-portability-check',
  private: true,
  type: 'module',
  packageManager: 'pnpm@12.4.2',
  scripts: { build: 'valaxy build --ssg', typecheck: 'tsc --noEmit' },
  dependencies: {
    'valaxy': '1.2.0',
    'valaxy-theme-editorial': 'file:theme.tgz',
    'vue': '^3.5.41',
    'vue-router': '^5.0.3',
  },
  devDependencies: { 'vite': '^8.3.5', 'typescript': '^5.9.3', '@types/node': '^24.0.0' },
}, null, 2))
await put('pnpm-workspace.yaml', 'allowBuilds:\n  \'@parcel/watcher\': true\n  esbuild: true\n')
await put('tsconfig.json', JSON.stringify({
  compilerOptions: {
    target: 'ESNext',
    module: 'ESNext',
    moduleResolution: 'bundler',
    strict: true,
    skipLibCheck: true,
    noEmit: true,
    types: ['node', 'valaxy/client', 'vite/client'],
    lib: ['DOM', 'DOM.Iterable', 'ESNext'],
  },
  include: ['*.ts'],
}))
await put('site.config.ts', 'import { defineSiteConfig } from \'valaxy\'\nexport default defineSiteConfig({ title: \'Portable Editorial\', url: \'https://example.com/\', author: { name: \'Reader\' }, lang: \'zh-CN\', social: [{ name: \'RSS\', link: \'/atom.xml\', icon: \'i-ri-rss-line\' }] })\n')
await put('valaxy.config.ts', 'import type { ThemeConfig } from \'valaxy-theme-editorial\'\nimport { defineValaxyConfig } from \'valaxy\'\nexport default defineValaxyConfig<ThemeConfig>({ theme: \'editorial\', themeConfig: { introNote: \'Independent package\' } })\n')
await put('pages/about.md', '---\ntitle: Portable About\n---\n\nOrdinary page content.\n')
run('pnpm install --no-frozen-lockfile --reporter=append-only')
run('pnpm typecheck')
run('pnpm build')
const empty = await readFile(join(consumer, 'dist/index.html'), 'utf8')
assert.ok(empty.includes('这里的文字，还在路上。'))
assert.ok(empty.includes('Portable Editorial'))

await put('vite.config.ts', 'import { defineConfig } from \'vite\'\nexport default defineConfig({ base: \'/journal/\' })\n')
await put('public/slow-avatar.svg', '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="#2e6c60"/></svg>')
await put('components/ConsumerProbe.vue', `<script setup lang="ts">
import { plainText, useThemeConfig } from 'valaxy-theme-editorial/client'
const theme = useThemeConfig()
const friends = [{ name: 'Slow Avatar Probe', url: 'https://example.com', avatar: import.meta.env.BASE_URL + 'slow-avatar.svg' }]
</script>
<template><p>{{ plainText("<b>Client export works</b>") }} / {{ theme.introNote }}</p><EditorialFriendList :links="friends" /></template>
`)
await put('pages/posts/example.md', '---\ntitle: Portable Article\ndate: 2026-10-25\ntags: [Portability]\nexcerpt_type: ai\nexcerpt: AI_SUMMARY_VISIBLE\n---\n\n## First heading\n\nReal Markdown content.\n\n<ConsumerProbe />\n\n```ts\nconst answer = 42\n```\n')
await put('pages/posts/images.md', '---\ntitle: Portable Image\ndate: 2026-10-25\nexcerpt_type: text\nexcerpt: Ordinary excerpt\n---\n\n![Example image](/slow-avatar.svg)\n')
await put('pages/posts/draft.md', '---\ntitle: DRAFT_PORTABILITY_SENTINEL\ndate: 2026-10-25\ndraft: true\n---\n\nNever publish.\n')
run('pnpm build')
const home = await readFile(join(consumer, 'dist/index.html'), 'utf8')
const article = await readFile(join(consumer, 'dist/posts/example.html'), 'utf8')
const imageArticle = await readFile(join(consumer, 'dist/posts/images.html'), 'utf8')
const about = await readFile(join(consumer, 'dist/about.html'), 'utf8')
const archiveHtml = await readFile(join(consumer, 'dist/archives.html'), 'utf8')
assert.ok(home.includes('Portable Article'))
assert.ok(home.includes('/journal/assets/'))
assert.ok(home.includes('href="/journal/archives/"'))
assert.ok(home.includes('href="/journal/atom.xml"'))
assert.ok(article.includes('Client export works'))
assert.ok(article.includes('--shiki-light'))
assert.ok(article.includes('aria-label="AI 摘要"'))
assert.ok(article.includes('AI_SUMMARY_VISIBLE'))
assert.ok(article.includes('Slow Avatar Probe'))
assert.ok(!article.includes('<img'), 'avatars must not start requests in server-rendered HTML')
assert.ok(!imageArticle.includes('aria-label="AI 摘要"'), 'ordinary excerpts are not AI summaries')
const imageTag = imageArticle.match(/<img\b[^>]*>/)?.[0] || ''
for (const attribute of ['loading="lazy"', 'decoding="async"', 'fetchpriority="low"'])
  assert.ok(imageTag.includes(attribute), attribute)
assert.ok(about.includes('Ordinary page content.'))
assert.ok(archiveHtml.includes('Portable Article'))
for (const html of [home, article, archiveHtml])
  assert.ok(!html.includes('DRAFT_PORTABILITY_SENTINEL'))
for (const file of ['atom.xml', 'feed.xml', 'feed.json'])
  assert.ok(!(await readFile(join(consumer, 'dist', file), 'utf8')).includes('DRAFT_PORTABILITY_SENTINEL'))
await writeFile(join(workspace, 'temp/consumer-result.json'), JSON.stringify({ consumer, empty: true, base: '/journal/', ssg: true, draftExcluded: true, clientExport: true }, null, 2))
console.log('PASS: package/SSG/base, AI summary, native RSS, deferred avatars, lazy images and drafts')
