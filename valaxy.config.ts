import type { ThemeConfig } from 'valaxy-theme-editorial'
import { defineValaxyConfig } from 'valaxy'
import { addonMermaid } from 'valaxy-addon-mermaid'
import { startAISummary } from './autoSummary'

export default defineValaxyConfig<ThemeConfig>({
  theme: 'editorial',
  addons: [addonMermaid()],
  themeConfig: {
    wordmark: 'Okysu',
    eyebrow: 'OKYSU / 随笔与记录',
    introNote: '把经历写成文字，\n把好奇留给明天。',
    homePostCount: 12,
    showOutline: true,
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/archives/' },
      { text: '标签', link: '/tags/' },
      { text: '分类', link: '/categories/' },
      { text: '友链', link: '/links/' },
      { text: '关于', link: '/about/' },
    ],
    footer: {
      since: 2016,
      text: '为吾为枝，余地三尺，以己为棋，胜天半子。',
      beian: '苏ICP备2021011781号',
    },
  },
  hooks: {
    'build:before': async () => {
      await startAISummary()
    },
  },
})
