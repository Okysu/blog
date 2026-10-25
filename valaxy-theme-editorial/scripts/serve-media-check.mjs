import { readFile, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { dirname, extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const workspace = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { consumer } = JSON.parse(await readFile(resolve(workspace, 'temp/consumer-result.json'), 'utf8'))
const root = resolve(consumer, 'dist')
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.json': 'application/json' }
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    let target = resolve(root, pathname.replace(/^\/journal\/?/, '').replace(/^\//, '') || 'index.html')
    if (target !== root && !target.startsWith(root + sep)) {
      response.writeHead(403).end()
      return
    }
    if (!extname(target))
      target += '.html'
    if ((await stat(target)).isDirectory())
      target = resolve(target, 'index.html')
    const bytes = await readFile(target)
    const send = () => {
      response.writeHead(200, { 'Content-Type': mime[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' })
      response.end(bytes)
    }
    if (pathname.endsWith('/slow-avatar.svg'))
      setTimeout(send, 20_000)
    else
      send()
  }
  catch {
    response.writeHead(404).end('Not found')
  }
}).listen(4862, '127.0.0.1', () => {
  console.log('Media check: http://127.0.0.1:4862/journal/ (avatars delayed 20 seconds)')
})
