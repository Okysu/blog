import type { ThemeConfig } from './types'
import { defineTheme } from 'valaxy'

export default defineTheme<ThemeConfig>({
  themeConfig: {
    wordmark: '',
    eyebrow: 'NOTES & THOUGHTS',
    introNote: '',
    homePostCount: 6,
    showOutline: true,
    showAiSummary: true,
    outline: [2, 3],
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/archives/' },
      { text: '关于', link: '/about/' },
    ],
    footer: { text: '' },
    valaxyDarkOptions: { circleTransition: false },
  },
  markdown: {
    markdownSetup(md) {
      const render = md.renderer.rules.image
      md.renderer.rules.image = (tokens, index, options, env, self) => {
        tokens[index].attrSet('loading', 'lazy')
        tokens[index].attrSet('decoding', 'async')
        tokens[index].attrSet('fetchpriority', 'low')
        return render ? render(tokens, index, options, env, self) : self.renderToken(tokens, index, options)
      }
    },
  },
})
