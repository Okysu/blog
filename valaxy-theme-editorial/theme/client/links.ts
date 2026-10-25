/** Files and feeds must bypass Vue Router, including same-origin URLs. */
export function isNativeLink(to: string): boolean {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(to)
    || /(?:^|\/)[^/?#]+\.[a-z\d]+(?:[?#].*)?$/i.test(to)
}

export function nativeLinkHref(to: string, base = '/'): string {
  if (!to.startsWith('/') || to.startsWith('//'))
    return to
  return `${base.replace(/\/$/, '')}${to}`
}
