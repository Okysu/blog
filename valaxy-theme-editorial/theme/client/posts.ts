/** Excerpts may contain Markdown or HTML. Render only text in article lists. */
export function plainText(value: unknown): string {
  if (typeof value !== 'string')
    return ''
  return value.replace(/<[^>]*>/g, ' ').replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\s*\[https?:\/\/[^\]]+\]/g, '').replace(/[-_─]{4,}/g, ' ').replace(/[#*`_>~]/g, '').replace(/&(?:nbsp|amp|lt|gt|quot);/g, ' ').replace(/\s+/g, ' ').trim()
}

export function postTags(value: unknown): string[] {
  if (Array.isArray(value))
    return value.filter((tag): tag is string => typeof tag === 'string')
  return typeof value === 'string' ? [value] : []
}
