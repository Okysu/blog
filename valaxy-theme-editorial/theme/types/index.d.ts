import type { DefaultTheme } from 'valaxy'

export interface NavItem {
  text: string
  link: string
}

export interface ThemeConfig extends DefaultTheme.Config {
  /** Optional short wordmark; defaults to the site author name. */
  wordmark: string
  /** Small label above the site title. */
  eyebrow: string
  /** Optional short note next to the homepage introduction. */
  introNote: string
  /** Number of recent articles on the homepage. */
  homePostCount: number
  /** Show the article outline (frontmatter outline: false also works). */
  showOutline: boolean
  /** Show saved AI-generated excerpts above the article body. */
  showAiSummary: boolean
  nav: NavItem[]
  footer: {
    since?: number
    text: string
    beian?: string
  }
}

export type ThemeUserConfig = Partial<ThemeConfig>
