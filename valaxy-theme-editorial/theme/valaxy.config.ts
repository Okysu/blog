import type { ThemeConfig } from './types'
import { defineTheme } from 'valaxy'

export default defineTheme<ThemeConfig>({
  themeConfig: {
    wordmark: '',
    eyebrow: 'NOTES & THOUGHTS',
    introNote: '',
    homePostCount: 6,
    showOutline: true,
    outline: [2, 3],
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/archives/' },
      { text: '关于', link: '/about/' },
    ],
    footer: { text: '' },
    valaxyDarkOptions: { circleTransition: false },
  },
})
