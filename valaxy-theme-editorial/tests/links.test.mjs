import assert from 'node:assert/strict'
import { it } from 'node:test'
import { isNativeLink, nativeLinkHref } from '../theme/client/links.ts'

it('opens RSS and static files natively while keeping page navigation in Vue Router', () => {
  for (const link of ['/atom.xml', '/feed.json', '/files/guide.pdf?download=1', 'https://example.com/', 'mailto:reader@example.com'])
    assert.ok(isNativeLink(link), link)
  for (const link of ['/', '/archives/', '/posts/hello', '/tags/?tag=Vue', '/tags/?tag=Vue.js'])
    assert.ok(!isNativeLink(link), link)
})

it('keeps feed links under a deployment base without changing external URLs', () => {
  assert.equal(nativeLinkHref('/atom.xml', '/journal/'), '/journal/atom.xml')
  assert.equal(nativeLinkHref('/atom.xml', '/'), '/atom.xml')
  assert.equal(nativeLinkHref('https://example.com/atom.xml', '/journal/'), 'https://example.com/atom.xml')
  assert.equal(nativeLinkHref('//example.com/file.pdf', '/journal/'), '//example.com/file.pdf')
})
