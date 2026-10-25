import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  lang: 'zh-CN',
  timezone: 'Asia/Hong_Kong',
  title: '小于同学的异世界',
  subtitle: '写代码，也写生活。',
  description: '为吾为枝，余地三尺，以己为棋，胜天半子。',
  url: 'https://example.com/',
  author: { name: 'Okysu' },
  social: [
    { name: 'GitHub', link: 'https://github.com/Okysu', icon: 'i-ri-github-line' },
    { name: 'RSS', link: '/atom.xml', icon: 'i-ri-rss-line' },
  ],
  comment: { enable: false },
  search: { enable: false },
  excerpt: { auto: true, length: 180, type: 'text' },
})
