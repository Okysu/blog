import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import {
  collectCompiledFluxPages,
  fluxToMarkdown,
  materializeFluxPages,
  renderFluxInlineToMarkdown,
  splitFrontmatter,
} from '../fluxmarkCompiler'
import { parseFluxInline } from 'fluxmark'

test('splitFrontmatter preserves comments, date formatting and empty body', () => {
  const input = '---\r\ntitle: 测试\r\n# comment\r\ndate: 2021-09-17 10:43:08\r\n---\r\n\r\n# 标题\r\n'
  const { frontmatter, body } = splitFrontmatter(input)
  assert.equal(frontmatter, '---\ntitle: 测试\n# comment\ndate: 2021-09-17 10:43:08\n---')
  assert.equal(body, '\n# 标题\n')

  const emptyBody = splitFrontmatter('---\nlayout: 404\n---\n')
  assert.equal(emptyBody.frontmatter, '---\nlayout: 404\n---')
  assert.equal(emptyBody.body, '')
})

test('fluxToMarkdown compiles sections, lists, task items, callouts and code blocks', () => {
  const fx = [
    '---',
    'title: Demo',
    '---',
    '',
    '# 一级标题',
    '\t这是包含 *粗体*、_斜体_、=高亮=、~删除~ 和 `code` 的段落。',
    '',
    '\t# 二级标题',
    '\t\t> [warn] 注意事项',
    '\t\t\t请不要使用 any。',
    '',
    '\t\t> 普通引用内容。',
    '',
    '\t\t$ ts',
    '\t\t\tconst x = 1',
    '',
    '\t\t$ mermaid',
    '\t\t\tgraph TD',
    '\t\t\t\tA --> B',
    '',
    '\t\t- 第一项',
    '\t\t-- 嵌套项',
    '\t\t1. 有序一',
    '\t\t2. 有序二',
    '\t\t* [x] 已完成',
    '\t\t* [ ] 待办',
    '\t\t---',
  ].join('\n')

  const md = fluxToMarkdown(fx, { strict: true })
  assert.match(md, /^---\ntitle: Demo\n---\n\n# 一级标题/)
  assert.ok(md.includes('**粗体**、*斜体*、<mark>高亮</mark>、~~删除~~ 和 `code`'))
  assert.ok(md.includes('## 二级标题'))
  assert.ok(md.includes('::: warning 注意事项\n请不要使用 any。\n:::'))
  assert.ok(md.includes('> 普通引用内容。'))
  assert.ok(md.includes('```ts\nconst x = 1\n```'))
  assert.ok(md.includes('```mermaid\ngraph TD\n\tA --> B\n```'))
  assert.ok(md.includes('- 第一项\n  - 嵌套项'))
  assert.ok(md.includes('1. 有序一\n2. 有序二'))
  assert.ok(md.includes('- [x] 已完成\n- [ ] 待办'))
  assert.ok(md.includes('\n---\n'))
})

test('fluxToMarkdown compiles DataTable, RawHtml, links, images, and footnotes', () => {
  const fx = [
    '@ 对比表',
    '\t- 模型 | 优势',
    '\t- Opus | [强|b]',
    '\t- Codex | 均衡',
    '',
    '!html',
    '\t<EditorialFriends />',
    '',
    '查看[官网|https://example.com,?访问官网]与图片 ![https://example.com/a.png|示例图] 以及脚注[^1]。',
    '',
    '[^1]: 引用说明',
  ].join('\n')

  const md = fluxToMarkdown(fx, { strict: true })
  assert.ok(md.includes('**对比表**\n\n| 模型 | 优势 |\n| --- | --- |\n| Opus | **强** |\n| Codex | 均衡 |'))
  assert.ok(md.includes('<EditorialFriends />'))
  assert.ok(md.includes('[官网](https://example.com "访问官网")'))
  assert.ok(md.includes('![示例图](https://example.com/a.png)'))
  assert.ok(md.includes('脚注[^1]。'))
  assert.ok(md.includes('[^1]: 引用说明'))
})

test('renderFluxInlineToMarkdown handles pipe modifiers and nested code backticks', () => {
  const tokens = parseFluxInline('[Ctrl+K|kbd] [Beta|badge] [隐藏|spoiler] [红字|#ff0000] [`a`b`|c]')
  const md = renderFluxInlineToMarkdown(tokens)
  assert.ok(md.includes('<kbd>Ctrl+K</kbd>'))
  assert.ok(md.includes('<span class="fx-badge">Beta</span>'))
  assert.ok(md.includes('<span class="fx-spoiler">隐藏</span>'))
  assert.ok(md.includes('<span style="color:#ff0000">红字</span>'))
  assert.ok(md.includes('`` `a`b` ``'))
})

test('collectCompiledFluxPages compiles nested .fx files into .md paths with digests', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'blog-flux-loader-'))
  try {
    await mkdir(path.join(dir, 'posts'), { recursive: true })
    await writeFile(path.join(dir, '404.fx'), '---\nlayout: 404\n---\n', 'utf8')
    await writeFile(path.join(dir, 'posts/hello.fx'), '---\ntitle: Hello\n---\n\n# 你好\n\t世界\n', 'utf8')
    const items = await collectCompiledFluxPages(dir, { strict: true })
    assert.equal(items.length, 2)
    assert.equal(items[0]?.path, '404.md')
    assert.equal(items[0]?.content, '---\nlayout: 404\n---\n')
    assert.equal(items[1]?.path, 'posts/hello.md')
    assert.equal(items[1]?.content, '---\ntitle: Hello\n---\n\n# 你好\n\n世界\n')
    assert.ok(items[1]?.digest.length === 64)

    const { generated, cleanup } = await materializeFluxPages(dir, { strict: true })
    assert.equal(generated.length, 2)
    await assert.rejects(materializeFluxPages(dir, { strict: true }), /Refusing to overwrite/)
    await cleanup()
    const remaining = await collectCompiledFluxPages(dir, { strict: true })
    assert.equal(remaining.length, 2)
  }
  finally {
    await rm(dir, { recursive: true, force: true })
  }
})
