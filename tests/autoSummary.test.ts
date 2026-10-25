import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import matter from 'gray-matter'
import { generateAutoSummary, startAISummary, summaryEndpoint } from '../autoSummary'

test('only appends chat/completions and preserves provider path prefixes', () => {
  assert.equal(summaryEndpoint('https://api.deepseek.com///'), 'https://api.deepseek.com/chat/completions')
  assert.equal(summaryEndpoint('https://gateway.example/api/v1/'), 'https://gateway.example/api/v1/chat/completions')
})

test('sends long articles intact to deepseek-flash and keeps output small', async () => {
  const article = '完整长文。'.repeat(220_000)
  let called = false
  const excerpt = await generateAutoSummary(article, {
    apiKey: 'test-key',
    baseUrl: 'https://example.test/proxy/',
    fetch: async (url, options) => {
      called = true
      assert.equal(url, 'https://example.test/proxy/chat/completions')
      const payload = JSON.parse(String(options?.body))
      assert.equal(payload.model, 'deepseek-flash')
      assert.deepEqual(payload.thinking, { type: 'disabled' })
      assert.equal(payload.messages[1].content, article)
      assert.equal(payload.max_tokens, 512)
      return Response.json({ choices: [{ message: { content: ' 第一行\n第二行 ' }, finish_reason: 'stop' }] })
    },
  })
  assert.ok(called)
  assert.equal(excerpt, '第一行 第二行')
})

test('rejects HTTP errors, empty and truncated results', async () => {
  await assert.rejects(generateAutoSummary('test', {
    apiKey: 'test',
    fetch: async () => new Response('', { status: 429 }),
  }), /HTTP 429/)
  for (const body of [
    { choices: [] },
    { choices: [{ message: { content: 'partial' }, finish_reason: 'length' }] },
  ]) {
    await assert.rejects(generateAutoSummary('test', {
      apiKey: 'test',
      fetch: async () => Response.json(body),
    }), /empty or incomplete/)
  }
})

test('summarizes nested Markdown while preserving existing excerpts and drafts', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'blog-summary-test-'))
  const oldKey = process.env.OPENAI_API_KEY
  const oldSkip = process.env.SKIP_AI_SUMMARY
  const oldFetch = globalThis.fetch
  process.env.OPENAI_API_KEY = 'test'
  delete process.env.SKIP_AI_SUMMARY
  let calls = 0
  globalThis.fetch = async () => {
    calls++
    return Response.json({ choices: [{ message: { content: '生成的摘要' }, finish_reason: 'stop' }] })
  }
  try {
    await mkdir(path.join(dir, 'nested'))
    await writeFile(path.join(dir, 'nested/new.md'), '---\ntitle: 新文章\nexcerpt_type: ai\n---\n\n原始内容。')
    const existing = '---\nexcerpt_type: ai\nexcerpt: 手动摘要\n---\n不要覆盖。'
    const draft = '---\nexcerpt_type: ai\ndraft: true\n---\n草稿。'
    await writeFile(path.join(dir, 'existing.md'), existing)
    await writeFile(path.join(dir, 'draft.md'), draft)
    await writeFile(path.join(dir, 'asset.txt'), 'not markdown')
    await startAISummary(dir)
    assert.equal(calls, 1)
    const result = matter(await readFile(path.join(dir, 'nested/new.md'), 'utf8'))
    assert.equal(result.data.excerpt, '生成的摘要')
    assert.equal(result.content.trim(), '原始内容。')
    assert.equal(await readFile(path.join(dir, 'existing.md'), 'utf8'), existing)
    assert.equal(await readFile(path.join(dir, 'draft.md'), 'utf8'), draft)
  }
  finally {
    globalThis.fetch = oldFetch
    if (oldKey === undefined) delete process.env.OPENAI_API_KEY
    else process.env.OPENAI_API_KEY = oldKey
    if (oldSkip === undefined) delete process.env.SKIP_AI_SUMMARY
    else process.env.SKIP_AI_SUMMARY = oldSkip
    await rm(dir, { recursive: true, force: true })
  }
})
