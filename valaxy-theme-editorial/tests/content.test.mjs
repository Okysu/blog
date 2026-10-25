import assert from 'node:assert/strict'
import { it } from 'node:test'
import { aiSummary, plainText, postTags } from '../theme/client/posts.ts'

it('renders HTML excerpts as plain text without active markup', () => {
  assert.equal(plainText('<p>Hello <a href="/x">world</a></p>'), 'Hello world')
  assert.equal(plainText('See [Valaxy](https://valaxy.site) and **read**.'), 'See Valaxy and read.')
  assert.equal(plainText(undefined), '')
  assert.equal(plainText('文字 [https://example.com] ---- 后文'), '文字 后文')
})

it('shows only saved AI summaries and renders them as text', () => {
  assert.equal(aiSummary({ excerpt_type: 'ai', excerpt: '<p>真实摘要</p>' }), '真实摘要')
  assert.equal(aiSummary({ excerpt_type: 'ai' }), '')
  assert.equal(aiSummary({ excerpt_type: 'text', excerpt: '普通截取' }), '')
})

it('normalizes frontmatter tag shapes without treating numbers as text', () => {
  assert.deepEqual(postTags(['Vue', 2026, '随笔']), ['Vue', '随笔'])
  assert.deepEqual(postTags('Vue'), ['Vue'])
  assert.deepEqual(postTags(null), [])
})
