import type { ThemeConfig } from 'valaxy-theme-editorial'
import { defineValaxyConfig } from 'valaxy'
import { addonMermaid } from 'valaxy-addon-mermaid'

export default defineValaxyConfig<ThemeConfig>({
  theme: 'editorial',
  addons: [addonMermaid()],
  themeConfig: {
    eyebrow: 'OKYSU / 随笔与记录',
    homePostCount: 12,
    introNote: '把经历写成文字，\n把好奇留给明天。',
    showOutline: true,
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/archives/' },
      { text: '关于', link: '/about/' },
      { text: '主页 ↗', link: 'https://oky.su' },
    ],
    footer: { since: 2016, text: '我只知道一件事，那就是我一无所知。' },
  },
})
