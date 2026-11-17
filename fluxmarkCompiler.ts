import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import consola from 'consola'
import { parseFluxMark } from 'fluxmark'
import type {
  FluxBlockNode,
  FluxCallout,
  FluxCodeBlock,
  FluxDataTable,
  FluxDocument,
  FluxInlineStyle,
  FluxInlineToken,
  FluxList,
  FluxListItem,
  FluxSection,
} from 'fluxmark'
import matter from 'gray-matter'
import { defineContentLoader } from 'valaxy'
import type { Plugin } from 'vite'

export interface FrontmatterSplit {
  frontmatter: string | null
  body: string
}

export interface FluxCompileOptions {
  filePath?: string
  strict?: boolean
}

export interface FluxLoaderOptions {
  userRoot?: string
  pagesDir?: string
  strict?: boolean
}

const CALLOUT_TO_CONTAINER: Record<string, string> = {
  note: 'info',
  info: 'info',
  tip: 'tip',
  warn: 'warning',
  warning: 'warning',
  danger: 'danger',
  details: 'details',
}

/**
 * Split leading YAML frontmatter from a `.fx` or `.md` source string while
 * preserving the raw frontmatter text (comments, quoting, date format).
 */
export function splitFrontmatter(source: string): FrontmatterSplit {
  const normalized = source.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  if (!normalized.startsWith('---\n'))
    return { frontmatter: null, body: normalized }

  const match = /^---\n([\s\S]*?)\n---(?:\n|$)/.exec(normalized)
  if (!match) {
    if (/^---\n---(?:\n|$)/.test(normalized)) {
      const rest = normalized.replace(/^---\n---(?:\n)?/, '')
      return { frontmatter: '---\n---', body: rest }
    }
    return { frontmatter: null, body: normalized }
  }

  // Check via gray-matter data or YAML comment/empty frontmatter; avoid `parsed.matter`
  // because gray-matter's internal cache clears `.matter` on repeated calls with identical input.
  const parsed = matter(normalized)
  const hasYamlKeys = parsed.data !== null && typeof parsed.data === 'object' && Object.keys(parsed.data).length > 0
  const hasOnlyCommentsOrWhitespace = match[1]
    .split('\n')
    .every(line => /^\s*(?:#.*)?$/.test(line))
  if (!hasYamlKeys && !hasOnlyCommentsOrWhitespace)
    return { frontmatter: null, body: normalized }

  const frontmatter = `---\n${match[1]}\n---`
  const body = normalized.slice(match[0].length)
  return { frontmatter, body }
}

function escapeHtmlAttr(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function escapeMarkdownText(value: string): string {
  // Escape emphasis/code delimiters while keeping footnote references ([^id])
  // and inline LaTeX ($...$) intact.
  let out = ''
  let inMath = false
  for (let i = 0; i < value.length; i += 1) {
    const ch = value[i]!
    if (ch === '$') {
      inMath = !inMath
      out += ch
      continue
    }
    if (!inMath && (ch === '*' || ch === '~' || ch === '`')) {
      out += `\\${ch}`
      continue
    }
    out += ch
  }
  return out
}

function renderInlineCode(content: string): string {
  let maxRun = 0
  let currentRun = 0
  for (let i = 0; i < content.length; i += 1) {
    if (content[i] === '`') {
      currentRun += 1
      if (currentRun > maxRun)
        maxRun = currentRun
    }
    else {
      currentRun = 0
    }
  }
  const fence = '`'.repeat(maxRun + 1)
  const needsPadding = content.startsWith('`') || content.endsWith('`') || (content.startsWith(' ') && content.endsWith(' ') && content.trim().length > 0)
  return needsPadding ? `${fence} ${content} ${fence}` : `${fence}${content}${fence}`
}

function formatLinkDestination(href: string): string {
  return /[\s()]/.test(href) ? `<${href}>` : href
}

function applyTokenWrappers(inner: string, style: FluxInlineStyle): string {
  let result = inner

  for (const mod of style.customModifiers) {
    const lower = mod.toLowerCase()
    if (lower === 'kbd')
      result = `<kbd>${result}</kbd>`
    else if (lower === 'badge')
      result = `<span class="fx-badge">${result}</span>`
    else if (lower === 'spoiler')
      result = `<span class="fx-spoiler">${result}</span>`
  }

  if (style.mark)
    result = `<mark>${result}</mark>`
  if (style.underline)
    result = `<u>${result}</u>`
  if (style.strike)
    result = `~~${result}~~`
  if (style.bold && style.italic)
    result = `***${result}***`
  else if (style.bold)
    result = `**${result}**`
  else if (style.italic)
    result = `*${result}*`

  if (style.color)
    result = `<span style="color:${escapeHtmlAttr(style.color)}">${result}</span>`

  if (style.href !== null) {
    const titlePart = style.tooltip ? ` "${style.tooltip.replaceAll('"', '\\"')}"` : ''
    result = `[${result}](${formatLinkDestination(style.href)}${titlePart})`
  }
  else if (style.tooltip) {
    result = `<span title="${escapeHtmlAttr(style.tooltip)}">${result}</span>`
  }

  return result
}

function styleKey(style: FluxInlineStyle): string {
  return JSON.stringify([
    style.bold,
    style.italic,
    style.underline,
    style.strike,
    style.mark,
    style.color,
    style.href,
    style.tooltip,
    style.customModifiers,
  ])
}

function renderTokenBase(token: FluxInlineToken): string {
  switch (token.type) {
    case 'break':
      return '  \n'
    case 'html':
      return token.content
    case 'image': {
      const src = token.attributes.src ?? ''
      const alt = token.content.replaceAll('[', '\\[').replaceAll(']', '\\]')
      return `![${alt}](${formatLinkDestination(src)})`
    }
    case 'code':
      return renderInlineCode(token.content)
    case 'text':
    case 'style':
      return escapeMarkdownText(token.content)
  }
}

/** Serialize FluxMark inline tokens into Markdown inline syntax. */
export function renderFluxInlineToMarkdown(tokens: FluxInlineToken[]): string {
  if (tokens.length === 0)
    return ''

  let out = ''
  let i = 0
  while (i < tokens.length) {
    const token = tokens[i]!
    if (token.type === 'break' || token.type === 'html') {
      out += renderTokenBase(token)
      i += 1
      continue
    }

    const key = styleKey(token.style)
    let grouped = renderTokenBase(token)
    let j = i + 1
    while (j < tokens.length) {
      const next = tokens[j]!
      if (next.type === 'break' || next.type === 'html' || styleKey(next.style) !== key)
        break
      grouped += renderTokenBase(next)
      j += 1
    }

    out += applyTokenWrappers(grouped, token.style)
    i = j
  }
  return out
}

function escapeTableCell(cell: string): string {
  return cell
    .replaceAll('  \n', '<br />')
    .replaceAll('\n', '<br />')
    .replace(/\|/g, '\\|')
}

function renderCodeBlock(node: FluxCodeBlock): string[] {
  const code = node.code.replace(/\n+$/, '')
  let maxRun = 2
  const matches = code.match(/`+/g)
  if (matches) {
    for (const m of matches) {
      if (m.length > maxRun)
        maxRun = m.length
    }
  }
  const fence = '`'.repeat(maxRun + 1)
  const lang = node.language ?? ''
  const lines = [`${fence}${lang}`]
  if (code.length > 0)
    lines.push(...code.split('\n'))
  lines.push(fence)
  return lines
}

function renderDataTable(node: FluxDataTable): string[] {
  const lines: string[] = []
  if (node.title.length > 0) {
    lines.push(`**${renderFluxInlineToMarkdown(node.title)}**`, '')
  }
  if (node.columns.length === 0)
    return lines

  const header = `| ${node.columns.map(col => escapeTableCell(col)).join(' | ')} |`
  const divider = `| ${node.columns.map(() => '---').join(' | ')} |`
  lines.push(header, divider)

  for (const row of node.rows) {
    const cells = node.columns.map((col) => {
      const cell = row.cells[col]
      return cell ? escapeTableCell(renderFluxInlineToMarkdown(cell.tokens)) : ''
    })
    lines.push(`| ${cells.join(' | ')} |`)
  }
  return lines
}

function renderCallout(node: FluxCallout): string[] {
  const variant = node.variant.toLowerCase()
  if (variant === 'quote') {
    const innerLines: string[] = []
    if (node.title.length > 0)
      innerLines.push(renderFluxInlineToMarkdown(node.title))
    const bodyLines = renderBlocksToLines(node.children)
    if (innerLines.length > 0 && bodyLines.length > 0)
      innerLines.push('')
    innerLines.push(...bodyLines)
    if (innerLines.length === 0)
      return ['>']
    return innerLines.map(line => (line.length === 0 ? '>' : `> ${line}`))
  }

  const containerName = CALLOUT_TO_CONTAINER[variant] ?? variant
  const titleText = node.title.length > 0 ? ` ${renderFluxInlineToMarkdown(node.title)}` : ''
  const bodyLines = renderBlocksToLines(node.children)
  return [`::: ${containerName}${titleText}`, ...bodyLines, ':::']
}

function renderListItem(item: FluxListItem, prefix: string): string[] {
  const taskPrefix = item.checked === null ? '' : `[${item.checked ? 'x' : ' '}] `
  const fullPrefix = `${prefix}${taskPrefix}`
  const indent = ' '.repeat(prefix.length)

  if (item.children.length === 0)
    return [fullPrefix.trimEnd()]

  const [first, ...rest] = item.children
  const lines: string[] = []

  if (first?.type === 'Paragraph') {
    const paraLines = renderFluxInlineToMarkdown(first.tokens).split('\n')
    lines.push(`${fullPrefix}${paraLines[0] ?? ''}`)
    for (const extra of paraLines.slice(1))
      lines.push(extra.length === 0 ? '' : `${indent}${extra}`)
  }
  else if (first) {
    lines.push(fullPrefix.trimEnd())
    const firstLines = renderBlockToLines(first)
    for (const line of firstLines)
      lines.push(line.length === 0 ? '' : `${indent}${line}`)
  }

  if (rest.length > 0) {
    const restLines = renderBlocksToLines(rest)
    if (restLines.length > 0) {
      // Separate multi-block children inside a list item cleanly unless the next block is just a nested list.
      if (rest[0]?.type !== 'List')
        lines.push('')
      for (const line of restLines)
        lines.push(line.length === 0 ? '' : `${indent}${line}`)
    }
  }

  return lines
}

function renderList(node: FluxList): string[] {
  const lines: string[] = []
  let num = node.start || 1
  for (let i = 0; i < node.children.length; i += 1) {
    const item = node.children[i]!
    const prefix = node.ordered ? `${num}. ` : '- '
    num += 1
    const itemLines = renderListItem(item, prefix)
    if (i > 0 && itemLines.some(l => l === '')) {
      if (lines[lines.length - 1] !== '')
        lines.push('')
    }
    lines.push(...itemLines)
  }
  return lines
}

function renderSection(node: FluxSection): string[] {
  const level = Math.max(1, Math.min(6, node.level))
  const heading = `${'#'.repeat(level)} ${renderFluxInlineToMarkdown(node.title)}`
  if (node.children.length === 0)
    return [heading]
  return [heading, '', ...renderBlocksToLines(node.children)]
}

function renderBlockToLines(node: FluxBlockNode): string[] {
  switch (node.type) {
    case 'Section':
      return renderSection(node)
    case 'Paragraph':
      return [renderFluxInlineToMarkdown(node.tokens)]
    case 'Callout':
      return renderCallout(node)
    case 'CodeBlock':
      return renderCodeBlock(node)
    case 'DataTable':
      return renderDataTable(node)
    case 'List':
      return renderList(node)
    case 'ListItem':
      return renderListItem(node, '- ')
    case 'HorizontalRule':
      return ['---']
    case 'RawHtml':
      return node.content.split('\n')
    case 'CustomBlock': {
      const lines: string[] = []
      if (node.content.length > 0)
        lines.push(...node.content.split('\n'))
      if (node.children.length > 0)
        lines.push(...renderBlocksToLines(node.children))
      return lines
    }
  }
}

function renderBlocksToLines(blocks: FluxBlockNode[]): string[] {
  const lines: string[] = []
  for (const block of blocks) {
    const blockLines = renderBlockToLines(block)
    if (blockLines.length === 0)
      continue
    if (lines.length > 0)
      lines.push('')
    lines.push(...blockLines)
  }
  return lines
}

/**
 * Compile a FluxMark document (optionally prefixed with YAML frontmatter) into
 * standard CommonMark / GFM / Valaxy Markdown.
 */
export function fluxToMarkdown(source: string, options: FluxCompileOptions = {}): string {
  const { frontmatter, body } = splitFrontmatter(source)
  const trimmedBody = body.trim()

  if (trimmedBody.length === 0)
    return frontmatter ? `${frontmatter}\n` : ''

  const ast: FluxDocument = parseFluxMark(body, {
    calloutVariants: ['details'],
  })

  if (ast.issues.length > 0) {
    const label = options.filePath ?? 'fluxmark'
    for (const issue of ast.issues) {
      const msg = `[fluxmark] ${label}:${issue.line}:${issue.column} (${issue.severity}) ${issue.message}`
      if (options.strict && issue.severity === 'error')
        throw new Error(msg)
      consola.warn(msg)
    }
    if (options.strict && ast.issues.some(i => i.severity === 'error'))
      throw new Error(`[fluxmark] Failed to compile ${label}`)
  }

  const mdBody = renderBlocksToLines(ast.children).join('\n').trimEnd()
  if (frontmatter)
    return mdBody.length > 0 ? `${frontmatter}\n\n${mdBody}\n` : `${frontmatter}\n`
  return mdBody.length > 0 ? `${mdBody}\n` : ''
}

async function* walkFluxFiles(directory: string): AsyncGenerator<string> {
  let entries
  try {
    entries = await fs.readdir(directory, { withFileTypes: true })
  }
  catch {
    return
  }
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.'))
      continue
    const full = path.join(directory, entry.name)
    if (entry.isDirectory())
      yield* walkFluxFiles(full)
    else if (entry.isFile() && /\.fx$/i.test(entry.name))
      yield full
  }
}

export async function collectCompiledFluxPages(
  pagesDir = path.join(process.cwd(), 'pages'),
  options: { strict?: boolean } = {},
): Promise<Array<{ path: string, content: string, digest: string }>> {
  const items: Array<{ path: string, content: string, digest: string }> = []
  for await (const file of walkFluxFiles(pagesDir)) {
    const raw = await fs.readFile(file, 'utf8')
    const relFx = path.relative(pagesDir, file).replace(/\\/g, '/')
    const relMd = relFx.replace(/\.fx$/i, '.md')
    const content = fluxToMarkdown(raw, { filePath: relFx, strict: options.strict })
    const digest = createHash('sha256').update(content).digest('hex')
    items.push({ path: relMd, content, digest })
  }
  items.sort((a, b) => a.path.localeCompare(b.path))
  return items
}

/**
 * Compile every `.fx` file in `pagesDir` into a sibling `.md` file and return a
 * cleanup callback that removes only the generated `.md` files.
 */
export async function materializeFluxPages(
  pagesDir = path.join(process.cwd(), 'pages'),
  options: { strict?: boolean } = {},
): Promise<{ generated: string[], cleanup: () => Promise<void> }> {
  const items = await collectCompiledFluxPages(pagesDir, options)
  const generated: string[] = []

  try {
    for (const item of items) {
      const target = path.join(pagesDir, item.path)
      let exists = false
      try {
        await fs.access(target)
        exists = true
      }
      catch {
        exists = false
      }
      if (exists) {
        throw new Error(`[fluxmark] Refusing to overwrite existing Markdown file: ${item.path}`)
      }
      await fs.writeFile(target, item.content, 'utf8')
      generated.push(target)
    }
  }
  catch (error) {
    await Promise.all(generated.map(file => fs.rm(file, { force: true })))
    throw error
  }

  return {
    generated,
    async cleanup() {
      await Promise.all(generated.map(file => fs.rm(file, { force: true })))
    },
  }
}

/**
 * Valaxy ContentLoader that compiles `.fx` files under `pages/` into
 * `.valaxy/content/pages/` `.md` files before Valaxy routes, SSG, RSS, Fuse,
 * and markdown-it plugins run.
 */
export function createFluxMarkLoader(options: FluxLoaderOptions = {}) {
  return defineContentLoader({
    name: 'fluxmark',
    strict: options.strict ?? true,
    async load(ctx) {
      const pagesDir = options.pagesDir
        ?? path.join(ctx.node.options.userRoot, 'pages')
      return collectCompiledFluxPages(pagesDir, { strict: options.strict })
    },
  })
}

/**
 * Vite dev-server plugin that watches `.fx` files under `pages/` and syncs
 * compiled `.md` files into `.valaxy/content/pages/` so HMR works while editing `.fx` files.
 */
export function createFluxMarkVitePlugin(options: FluxLoaderOptions = {}): Plugin {
  return {
    name: 'valaxy:fluxmark-dev',
    apply: 'serve',
    configureServer(server) {
      // Valaxy sets Vite's `root` to `clientRoot` (node_modules/valaxy/client),
      // so resolve user pages/cache relative to `userRoot` (cwd) rather than `server.config.root`.
      const root = path.resolve(options.userRoot ?? process.cwd())
      const pagesDir = path.resolve(options.pagesDir ?? path.join(root, 'pages'))
      const cachePagesDir = path.resolve(root, '.valaxy/content/pages')

      server.watcher.add(pagesDir)

      const syncFile = async (file: string) => {
        const resolved = path.resolve(file)
        if (!resolved.startsWith(pagesDir + path.sep) || !/\.fx$/i.test(resolved))
          return
        const relFx = path.relative(pagesDir, resolved).replace(/\\/g, '/')
        const target = path.join(cachePagesDir, relFx.replace(/\.fx$/i, '.md'))
        try {
          const raw = await fs.readFile(resolved, 'utf8')
          const compiled = fluxToMarkdown(raw, { filePath: relFx, strict: options.strict })
          await fs.mkdir(path.dirname(target), { recursive: true })
          await fs.writeFile(target, compiled, 'utf8')
        }
        catch (error) {
          consola.error(`[fluxmark] Failed to compile ${relFx}:`, error)
        }
      }

      const removeFile = async (file: string) => {
        const resolved = path.resolve(file)
        if (!resolved.startsWith(pagesDir + path.sep) || !/\.fx$/i.test(resolved))
          return
        const relFx = path.relative(pagesDir, resolved).replace(/\.fx$/i, '.md')
        const target = path.join(cachePagesDir, relFx.replace(/\.fx$/i, '.md'))
        await fs.rm(target, { force: true })
      }

      server.watcher.on('add', syncFile)
      server.watcher.on('change', syncFile)
      server.watcher.on('unlink', removeFile)
    },
  }
}
